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

const pending = new Map();

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

    json(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => { console.log('[EPIC API] Listening on port ' + PORT); });
