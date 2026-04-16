/**
 * EPIC Hackathon Singapore — Registration API Server
 *
 * Endpoints:
 *  POST /api/register   — store pending registration, send verification email
 *  GET  /api/verify     — verify token, write to Supabase, redirect to login
 *  POST /api/resend     — resend verification email
 *  POST /api/login      — verify email+password, return user info
 *
 * Port: 3001 (nginx proxies /api/ → localhost:3001)
 */

const http       = require('http');
const https      = require('https');
const nodemailer = require('nodemailer');
const crypto     = require('crypto');
const url        = require('url');

const PORT         = 3001;
const BASE_URL     = 'http://43.130.98.104:8080';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFod2Fmb3BzYndnZXZvZ2VlenF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTQ5MTYsImV4cCI6MjA5MTY3MDkxNn0.wK7fZDyFaA39et0szUmMfvKVXgXTsrMxxt2Yo-ctFp0';

const SMTP = {
    host: 'smtpdm.aliyun.com',
    port: 465,
    secure: true,
    auth: {
        user: 'tutorial@dm.clouddreamai.com',
        pass: 'Sl1kdjLDKS8L1JDKL'
    }
};

const pending  = new Map();
const otpStore  = new Map(); // email -> { code, expiresAt, attempts }
const resetStore = new Map(); // token -> { email, expiresAt }

const transporter = nodemailer.createTransport({
    host: SMTP.host,
    port: SMTP.port,
    secure: SMTP.secure,
    auth: SMTP.auth,
    tls: { rejectUnauthorized: false }
});

/* ---- Supabase helpers ---- */
function supabaseRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'ahwafopsbwgevogeezqu.supabase.co',
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': 'Bearer ' + SUPABASE_KEY,
                'Prefer': 'return=representation'
            }
        };
        if (bodyStr) options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null }); }
                catch (e) { resolve({ status: res.statusCode, data: null }); }
            });
        });
        req.on('error', reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
    });
}

function supabaseInsert(table, record) {
    return supabaseRequest('POST', '/rest/v1/' + table, record).then(r => {
        if (r.status >= 200 && r.status < 300) return r.data;
        throw new Error('Supabase insert error ' + r.status + ': ' + JSON.stringify(r.data));
    });
}

function supabaseQuery(table, filter) {
    return supabaseRequest('GET', '/rest/v1/' + table + '?' + filter).then(r => {
        if (r.status >= 200 && r.status < 300) return r.data;
        throw new Error('Supabase query error ' + r.status + ': ' + JSON.stringify(r.data));
    });
}

/* ---- Email template ---- */
function buildEmail(toEmail, verifyLink) {
    return {
        from: '"EPIC Hackathon Singapore" <' + SMTP.auth.user + '>',
        to: toEmail,
        subject: 'Verify your EPIC Hackathon registration',
        html: '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;"><tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;"><tr><td style="background:#000;padding:28px 36px;border-bottom:1px solid rgba(255,255,255,0.07);"><span style="font-size:22px;font-weight:900;color:#fff;">EPIC</span><span style="font-size:13px;color:rgba(255,255,255,0.4);margin-left:12px;">Hackathon Singapore</span></td></tr><tr><td style="padding:36px 36px 28px;"><h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 12px;">Verify your email address</h1><p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 24px;">Thanks for registering for EPIC Hackathon Singapore!<br/>Click the button below to verify your email and complete your registration.</p><a href="' + verifyLink + '" style="display:inline-block;background:#fff;color:#000;font-size:15px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;">Verify Email &amp; Complete Registration &#8594;</a><p style="font-size:13px;color:rgba(255,255,255,0.35);margin:24px 0 0;line-height:1.6;">This link expires in <strong style="color:rgba(255,255,255,0.55);">24 hours</strong>.<br/>If you did not register, you can safely ignore this email.</p></td></tr><tr><td style="padding:0 36px 28px;"><p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">Or copy this link: <a href="' + verifyLink + '" style="color:rgba(255,255,255,0.45);">' + verifyLink + '</a></p></td></tr><tr><td style="background:rgba(255,255,255,0.025);padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);"><p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">&copy; 2026 EPIC Hackathon Singapore &nbsp;&middot;&nbsp;<a href="' + BASE_URL + '" style="color:rgba(255,255,255,0.35);text-decoration:none;">Visit Website</a></p></td></tr></table></td></tr></table></body></html>'
    };
}

/* ---- Helpers ---- */
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { resolve({}); } });
        req.on('error', reject);
    });
}

function setCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function json(res, status, data) {
    setCORS(res);
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function hashPassword(pw) {
    return crypto.createHash('sha256').update(pw).digest('hex');
}

/* ---- HTTP Server ---- */
const server = http.createServer(async (req, res) => {
    const parsed   = url.parse(req.url, true);
    const pathname = parsed.pathname;

    if (req.method === 'OPTIONS') { setCORS(res); res.writeHead(204); res.end(); return; }

    /* POST /api/register */
    if (pathname === '/api/register' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email, password, firstName, lastName, role } = body;
            if (!email || !password) return json(res, 400, { error: 'Email and password are required.' });
            if (password.length < 8) return json(res, 400, { error: 'Password must be at least 8 characters.' });

            // Check duplicate
            const existing = await supabaseQuery('players', 'email=eq.' + encodeURIComponent(email) + '&select=email');
            if (existing && existing.length > 0) return json(res, 409, { error: 'This email is already registered. Please sign in.' });

            const token     = crypto.randomBytes(32).toString('hex');
            const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
            pending.set(token, { data: body, expiresAt });

            const verifyLink = BASE_URL + '/api/verify?token=' + token;
            await transporter.sendMail(buildEmail(email, verifyLink));
            return json(res, 200, { ok: true, message: 'Verification email sent. Please check your inbox.' });
        } catch (err) {
            console.error('[register]', err.message);
            return json(res, 500, { error: 'Failed to send verification email. Please try again.' });
        }
    }

    /* GET /api/verify */
    if (pathname === '/api/verify' && req.method === 'GET') {
        const token = parsed.query.token;
        if (!token || !pending.has(token)) {
            setCORS(res); res.writeHead(302, { Location: BASE_URL + '/auth.html?error=invalid_token' }); res.end(); return;
        }
        const entry = pending.get(token);
        if (Date.now() > entry.expiresAt) {
            pending.delete(token);
            setCORS(res); res.writeHead(302, { Location: BASE_URL + '/auth.html?error=token_expired' }); res.end(); return;
        }
        const { data } = entry;
        pending.delete(token);
        try {
            const pwHash = hashPassword(data.password);
            await supabaseInsert('players', {
                email:         data.email,
                password_hash: pwHash,
                first_name:    data.firstName  || '',
                last_name:     data.lastName   || '',
                title:         data.title      || '',
                bio:           data.bio        || '',
                github:        data.github     ? 'https://github.com/' + data.github : null,
                linkedin:      data.linkedin   ? 'https://linkedin.com/in/' + data.linkedin : null,
                discord:       data.discord    || null,
                website:       data.website    || null,
                skills:        data.skills     || null,
                team_status:   data.teamStatus || 'solo',
                verified:      true,
                created_at:    new Date().toISOString()
            });
            // ✅ Redirect to login page with success notice
            setCORS(res); res.writeHead(302, { Location: BASE_URL + '/auth.html?verified=1' }); res.end();
        } catch (err) {
            console.error('[verify]', err.message);
            setCORS(res); res.writeHead(302, { Location: BASE_URL + '/auth.html?error=db_error' }); res.end();
        }
        return;
    }

    /* POST /api/login */
    if (pathname === '/api/login' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email, password } = body;
            if (!email || !password) return json(res, 400, { error: 'Email and password are required.' });

            const pwHash = hashPassword(password);
            const rows = await supabaseQuery('players',
                'email=eq.' + encodeURIComponent(email) +
                '&password_hash=eq.' + pwHash +
                '&verified=eq.true&select=email,first_name,last_name'
            );
            if (!rows || rows.length === 0) return json(res, 401, { error: 'Invalid email or password.' });

            const user = rows[0];
            return json(res, 200, { ok: true, user: { email: user.email, firstName: user.first_name, lastName: user.last_name } });
        } catch (err) {
            console.error('[login]', err.message);
            return json(res, 500, { error: 'Login failed. Please try again.' });
        }
    }

    /* POST /api/resend */
    if (pathname === '/api/resend' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email } = body;
            let found = null;
            for (const [tok, entry] of pending.entries()) {
                if (entry.data.email === email) { found = { tok, entry }; break; }
            }
            if (!found) return json(res, 404, { error: 'No pending registration found for this email.' });
            found.entry.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
            const verifyLink = BASE_URL + '/api/verify?token=' + found.tok;
            await transporter.sendMail(buildEmail(email, verifyLink));
            return json(res, 200, { ok: true });
        } catch (err) {
            console.error('[resend]', err.message);
            return json(res, 500, { error: 'Failed to resend email.' });
        }
    }

    /* POST /api/send-otp */
    if (pathname === '/api/send-otp' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email } = body;
            if (!email) return json(res, 400, { error: 'Email is required.' });

            // Check user exists and is verified
            const rows = await supabaseQuery('players',
                'email=eq.' + encodeURIComponent(email) + '&verified=eq.true&select=email'
            );
            if (!rows || rows.length === 0) {
                return json(res, 404, { error: 'No account found for this email. Please register first.' });
            }

            // Generate 6-digit OTP
            const code      = String(Math.floor(100000 + Math.random() * 900000));
            const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
            otpStore.set(email, { code, expiresAt, attempts: 0 });

            // Send OTP email
            const otpHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;"><tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;"><tr><td style="background:#000;padding:28px 36px;border-bottom:1px solid rgba(255,255,255,0.07);"><span style="font-size:22px;font-weight:900;color:#fff;">EPIC</span><span style="font-size:13px;color:rgba(255,255,255,0.4);margin-left:12px;">Hackathon Singapore</span></td></tr><tr><td style="padding:36px 36px 28px;"><h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 12px;">Your sign-in code</h1><p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 28px;">Use the code below to sign in to your EPIC account. This code expires in <strong style="color:#fff;">10 minutes</strong>.</p><div style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);border-radius:16px;padding:28px;text-align:center;margin-bottom:24px;"><span style="font-size:48px;font-weight:900;letter-spacing:12px;color:#22C55E;font-family:monospace;">' + code + '</span></div><p style="font-size:13px;color:rgba(255,255,255,0.35);margin:0;line-height:1.6;">If you did not request this code, you can safely ignore this email. Do not share this code with anyone.</p></td></tr><tr><td style="background:rgba(255,255,255,0.025);padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);"><p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">&copy; 2026 EPIC Hackathon Singapore &nbsp;&middot;&nbsp;<a href="' + BASE_URL + '" style="color:rgba(255,255,255,0.35);text-decoration:none;">Visit Website</a></p></td></tr></table></td></tr></table></body></html>';

            await transporter.sendMail({
                from: '"EPIC Hackathon Singapore" <' + SMTP.auth.user + '>',
                to: email,
                subject: 'Your EPIC sign-in code: ' + code,
                html: otpHtml
            });

            return json(res, 200, { ok: true, message: 'Verification code sent to ' + email });
        } catch (err) {
            console.error('[send-otp]', err.message);
            return json(res, 500, { error: 'Failed to send verification code. Please try again.' });
        }
    }

    /* POST /api/verify-otp */
    if (pathname === '/api/verify-otp' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email, code } = body;
            if (!email || !code) return json(res, 400, { error: 'Email and code are required.' });

            const entry = otpStore.get(email);
            if (!entry) return json(res, 400, { error: 'No verification code found. Please request a new one.' });

            if (Date.now() > entry.expiresAt) {
                otpStore.delete(email);
                return json(res, 400, { error: 'Verification code has expired. Please request a new one.' });
            }

            entry.attempts++;
            if (entry.attempts > 5) {
                otpStore.delete(email);
                return json(res, 429, { error: 'Too many attempts. Please request a new code.' });
            }

            if (entry.code !== String(code).trim()) {
                return json(res, 400, { error: 'Incorrect code. Please try again (' + (5 - entry.attempts) + ' attempts left).' });
            }

            otpStore.delete(email);

            // Fetch user info
            const rows = await supabaseQuery('players',
                'email=eq.' + encodeURIComponent(email) + '&select=email,first_name,last_name'
            );
            const user = rows && rows[0] ? rows[0] : { email };
            return json(res, 200, { ok: true, user: { email: user.email, firstName: user.first_name, lastName: user.last_name } });
        } catch (err) {
            console.error('[verify-otp]', err.message);
            return json(res, 500, { error: 'Verification failed. Please try again.' });
        }
    }

    /* POST /api/forgot-password */
    if (pathname === '/api/forgot-password' && req.method === 'POST') {
        try {
            const body  = await parseBody(req);
            const { email } = body;
            if (!email) return json(res, 400, { error: 'Email is required.' });

            // Always respond 200 to avoid email enumeration
            json(res, 200, { ok: true });

            // Check user exists and is verified (async, fire-and-forget)
            // NOTE: response already sent above, do NOT call json() again after this
            (async () => {
                try {
                    const rows = await supabaseQuery('players',
                        'email=eq.' + encodeURIComponent(email) + '&verified=eq.true&select=email,first_name'
                    );
                    if (!rows || rows.length === 0) return; // silently ignore

                    // Generate secure reset token (64 hex chars)
                    const token     = crypto.randomBytes(32).toString('hex');
                    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
                    resetStore.set(token, { email, expiresAt });

                    const firstName = rows[0].first_name || 'there';
                    const resetLink = BASE_URL + '/auth.html?reset_token=' + token;

                    const resetHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;"><tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;"><tr><td style="background:#000;padding:28px 36px;border-bottom:1px solid rgba(255,255,255,0.07);"><span style="font-size:22px;font-weight:900;color:#fff;">EPIC</span><span style="font-size:13px;color:rgba(255,255,255,0.4);margin-left:12px;">Hackathon Singapore</span></td></tr><tr><td style="padding:36px 36px 28px;"><h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 12px;">Reset your password</h1><p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 8px;">Hi ' + firstName + ',</p><p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 28px;">We received a request to reset your EPIC account password. Click the button below to set a new password. This link expires in <strong style="color:#fff;">1 hour</strong>.</p><div style="text-align:center;margin-bottom:28px;"><a href="' + resetLink + '" style="display:inline-block;padding:16px 40px;background:#22C55E;color:#000;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;">Reset Password</a></div><p style="font-size:13px;color:rgba(255,255,255,0.35);margin:0 0 8px;line-height:1.6;">Or copy and paste this link into your browser:</p><p style="font-size:12px;color:rgba(255,255,255,0.25);word-break:break-all;margin:0;">' + resetLink + '</p></td></tr><tr><td style="background:rgba(255,255,255,0.025);padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);"><p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">If you did not request a password reset, you can safely ignore this email. &copy; 2026 EPIC Hackathon Singapore</p></td></tr></table></td></tr></table></body></html>';

                    await transporter.sendMail({
                        from: '"EPIC Hackathon Singapore" <' + SMTP.auth.user + '>',
                        to: email,
                        subject: 'Reset your EPIC password',
                        html: resetHtml
                    });
                    console.log('[forgot-password] Reset email sent to', email);
                } catch (err) {
                    console.error('[forgot-password async]', err.message);
                }
            })();

            return; // response already sent above
        } catch (err) {
            console.error('[forgot-password]', err.message);
            return json(res, 500, { error: 'Server error. Please try again.' });
        }
    }

    /* POST /api/reset-password */
    if (pathname === '/api/reset-password' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { token, password } = body;
            if (!token || !password) return json(res, 400, { error: 'Token and password are required.' });
            if (password.length < 8)  return json(res, 400, { error: 'Password must be at least 8 characters.' });

            const entry = resetStore.get(token);
            if (!entry) return json(res, 400, { error: 'Invalid or expired reset link. Please request a new one.' });

            if (Date.now() > entry.expiresAt) {
                resetStore.delete(token);
                return json(res, 400, { error: 'This reset link has expired. Please request a new one.' });
            }

            const { email } = entry;

            // Hash new password (SHA-256, same as registration)
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

            // Update password in Supabase
            await supabaseRequest('PATCH',
                '/rest/v1/players?email=eq.' + encodeURIComponent(email),
                { password_hash: passwordHash }
            );

            resetStore.delete(token);
            console.log('[reset-password] Password updated for', email);

            return json(res, 200, { ok: true, message: 'Password updated successfully.' });
        } catch (err) {
            console.error('[reset-password]', err.message);
            return json(res, 500, { error: 'Failed to reset password. Please try again.' });
        }
    }

    json(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => { console.log('[EPIC API] Listening on port ' + PORT); });
