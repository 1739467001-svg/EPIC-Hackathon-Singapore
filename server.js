/**
 * EPIC Hackathon Singapore — Registration API Server
 *
 * Endpoints:
 *  POST /api/register        — store pending registration, send verification email
 *  GET  /api/verify          — verify token, write to MariaDB, redirect to login
 *  POST /api/resend          — resend verification email
 *  POST /api/login           — verify email+password, return user info
 *  POST /api/send-otp        — send one-time code for passwordless login
 *  POST /api/verify-otp      — verify one-time code and return user info
 *  POST /api/forgot-password — send password reset email
 *  POST /api/reset-password  — reset password by token
 *  GET  /api/profile         — fetch user profile by email
 *  POST /api/profile         — update user profile fields
 *  POST /api/change-password — change password after verifying current password
 *
 * Port: 3001
 */

const http = require('http');
const crypto = require('crypto');
const url = require('url');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');

const PORT = Number(process.env.PORT || 3001);
const BASE_URL = process.env.BASE_URL || 'https://evol.epicconnector.ai';

const DB_CONFIG = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'epictest',
    password: process.env.DB_PASSWORD || 'epichackathon',
    database: process.env.DB_NAME || 'epic_hackathon',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const SMTP = {
    host: process.env.SMTP_HOST || 'smtpdm.aliyun.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    auth: {
        user: process.env.SMTP_USER || 'tutorial@dm.clouddreamai.com',
        pass: process.env.SMTP_PASS || 'Sl1kdjLDKS8L1JDKL'
    }
};

const pending = new Map();
const otpStore = new Map();
const resetStore = new Map();

const pool = mysql.createPool(DB_CONFIG);

const transporter = nodemailer.createTransport({
    host: SMTP.host,
    port: SMTP.port,
    secure: SMTP.secure,
    auth: SMTP.auth,
    tls: { rejectUnauthorized: false }
});

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
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

function redirect(res, location) {
    setCORS(res);
    res.writeHead(302, { Location: location });
    res.end();
}

function hashPassword(pw) {
    return crypto.createHash('sha256').update(String(pw || '')).digest('hex');
}

function sanitizeOptional(value) {
    if (value === undefined || value === null) return null;
    const s = String(value).trim();
    return s === '' ? null : s;
}

function normalizeUrlField(value, prefix) {
    const s = sanitizeOptional(value);
    if (!s) return null;
    if (/^https?:\/\//i.test(s)) return s;
    return prefix + s.replace(/^\/+/, '');
}

function mapUserRow(row) {
    return {
        email: row.email,
        firstName: row.first_name || '',
        lastName: row.last_name || '',
        title: row.title || '',
        bio: row.bio || '',
        github: row.github || '',
        linkedin: row.linkedin || '',
        discord: row.discord || '',
        website: row.website || '',
        skills: row.skills || '',
        teamStatus: row.team_status || 'solo',
        age: row.age || '',
        location: row.location || '',
        twitterX: row.twitter_x || '',
        rednote: row.rednote || '',
        hackathonHistory: row.hackathon_history || ''
    };
}

async function dbQuery(sql, params = []) {
    const [rows] = await pool.query(sql, params);
    return rows;
}

async function dbExecute(sql, params = []) {
    const [result] = await pool.execute(sql, params);
    return result;
}

async function userExists(email) {
    const rows = await dbQuery('SELECT email FROM players WHERE email = ? LIMIT 1', [email]);
    return rows.length > 0;
}

function buildVerifyEmail(toEmail, verifyLink) {
    return {
        from: '"EPIC Hackathon Singapore" <' + SMTP.auth.user + '>',
        to: toEmail,
        subject: 'Verify your EPIC Hackathon registration',
        html: '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;"><tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;"><tr><td style="background:#000;padding:28px 36px;border-bottom:1px solid rgba(255,255,255,0.07);"><span style="font-size:22px;font-weight:900;color:#fff;">EPIC</span><span style="font-size:13px;color:rgba(255,255,255,0.4);margin-left:12px;">Hackathon Singapore</span></td></tr><tr><td style="padding:36px 36px 28px;"><h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 12px;">Verify your email address</h1><p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 24px;">Thanks for registering for EPIC Hackathon Singapore!<br/>Click the button below to verify your email and complete your registration.</p><a href="' + verifyLink + '" style="display:inline-block;background:#fff;color:#000;font-size:15px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;">Verify Email &amp; Complete Registration &#8594;</a><p style="font-size:13px;color:rgba(255,255,255,0.35);margin:24px 0 0;line-height:1.6;">This link expires in <strong style="color:rgba(255,255,255,0.55);">24 hours</strong>.<br/>If you did not register, you can safely ignore this email.</p></td></tr><tr><td style="padding:0 36px 28px;"><p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">Or copy this link: <a href="' + verifyLink + '" style="color:rgba(255,255,255,0.45);">' + verifyLink + '</a></p></td></tr><tr><td style="background:rgba(255,255,255,0.025);padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);"><p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">&copy; 2026 EPIC Hackathon Singapore &nbsp;&middot;&nbsp;<a href="' + BASE_URL + '" style="color:rgba(255,255,255,0.35);text-decoration:none;">Visit Website</a></p></td></tr></table></td></tr></table></body></html>'
    };
}

function buildOtpEmail(email, code) {
    return {
        from: '"EPIC Hackathon Singapore" <' + SMTP.auth.user + '>',
        to: email,
        subject: 'Your EPIC sign-in code: ' + code,
        html: '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;"><tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;"><tr><td style="background:#000;padding:28px 36px;border-bottom:1px solid rgba(255,255,255,0.07);"><span style="font-size:22px;font-weight:900;color:#fff;">EPIC</span><span style="font-size:13px;color:rgba(255,255,255,0.4);margin-left:12px;">Hackathon Singapore</span></td></tr><tr><td style="padding:36px 36px 28px;"><h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 12px;">Your sign-in code</h1><p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 28px;">Use the code below to sign in to your EPIC account. This code expires in <strong style="color:#fff;">10 minutes</strong>.</p><div style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);border-radius:16px;padding:28px;text-align:center;margin-bottom:24px;"><span style="font-size:48px;font-weight:900;letter-spacing:12px;color:#22C55E;font-family:monospace;">' + code + '</span></div><p style="font-size:13px;color:rgba(255,255,255,0.35);margin:0;line-height:1.6;">If you did not request this code, you can safely ignore this email. Do not share this code with anyone.</p></td></tr><tr><td style="background:rgba(255,255,255,0.025);padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);"><p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">&copy; 2026 EPIC Hackathon Singapore &nbsp;&middot;&nbsp;<a href="' + BASE_URL + '" style="color:rgba(255,255,255,0.35);text-decoration:none;">Visit Website</a></p></td></tr></table></td></tr></table></body></html>'
    };
}

function buildResetPasswordEmail(email, firstName, resetLink) {
    return {
        from: '"EPIC Hackathon Singapore" <' + SMTP.auth.user + '>',
        to: email,
        subject: 'Reset your EPIC password',
        html: '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;"><tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;"><tr><td style="background:#000;padding:28px 36px;border-bottom:1px solid rgba(255,255,255,0.07);"><span style="font-size:22px;font-weight:900;color:#fff;">EPIC</span><span style="font-size:13px;color:rgba(255,255,255,0.4);margin-left:12px;">Hackathon Singapore</span></td></tr><tr><td style="padding:36px 36px 28px;"><h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 12px;">Reset your password</h1><p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 8px;">Hi ' + firstName + ',</p><p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 28px;">We received a request to reset your EPIC account password. Click the button below to set a new password. This link expires in <strong style="color:#fff;">1 hour</strong>.</p><div style="text-align:center;margin-bottom:28px;"><a href="' + resetLink + '" style="display:inline-block;padding:16px 40px;background:#22C55E;color:#000;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;">Reset Password</a></div><p style="font-size:13px;color:rgba(255,255,255,0.35);margin:0 0 8px;line-height:1.6;">Or copy and paste this link into your browser:</p><p style="font-size:12px;color:rgba(255,255,255,0.25);word-break:break-all;margin:0;">' + resetLink + '</p></td></tr><tr><td style="background:rgba(255,255,255,0.025);padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);"><p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">If you did not request a password reset, you can safely ignore this email. &copy; 2026 EPIC Hackathon Singapore</p></td></tr></table></td></tr></table></body></html>'
    };
}

async function ensureSchema() {
    await dbExecute(`
        CREATE TABLE IF NOT EXISTS players (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) DEFAULT '',
            last_name VARCHAR(100) DEFAULT '',
            title VARCHAR(255) DEFAULT '',
            bio TEXT,
            github VARCHAR(255) DEFAULT NULL,
            linkedin VARCHAR(255) DEFAULT NULL,
            discord VARCHAR(255) DEFAULT NULL,
            website VARCHAR(255) DEFAULT NULL,
            skills TEXT,
            team_status VARCHAR(50) DEFAULT 'solo',
            verified TINYINT(1) NOT NULL DEFAULT 1,
            age VARCHAR(50) DEFAULT '',
            location VARCHAR(255) DEFAULT '',
            twitter_x VARCHAR(255) DEFAULT '',
            rednote VARCHAR(255) DEFAULT '',
            hackathon_history TEXT,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    if (req.method === 'OPTIONS') {
        setCORS(res);
        res.writeHead(204);
        res.end();
        return;
    }

    if (pathname === '/api/register' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email, password } = body;

            if (!email || !password) {
                return json(res, 400, { error: 'Email and password are required.' });
            }
            if (String(password).length < 8) {
                return json(res, 400, { error: 'Password must be at least 8 characters.' });
            }
            if (await userExists(email)) {
                return json(res, 409, { error: 'This email is already registered. Please sign in.' });
            }

            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
            pending.set(token, { data: body, expiresAt });

            const verifyLink = BASE_URL + '/api/verify?token=' + token;
            await transporter.sendMail(buildVerifyEmail(email, verifyLink));
            return json(res, 200, { ok: true, message: 'Verification email sent. Please check your inbox.' });
        } catch (err) {
            console.error('[register]', err.message);
            return json(res, 500, { error: 'Failed to send verification email. Please try again.' });
        }
    }

    if (pathname === '/api/verify' && req.method === 'GET') {
        try {
            const token = parsed.query.token;
            if (!token || !pending.has(token)) {
                return redirect(res, BASE_URL + '/auth.html?error=invalid_token');
            }

            const entry = pending.get(token);
            if (Date.now() > entry.expiresAt) {
                pending.delete(token);
                return redirect(res, BASE_URL + '/auth.html?error=token_expired');
            }

            const data = entry.data;
            pending.delete(token);

            if (await userExists(data.email)) {
                return redirect(res, BASE_URL + '/auth.html?verified=1');
            }

            await dbExecute(
                `INSERT INTO players (
                    email, password_hash, first_name, last_name, title, bio,
                    github, linkedin, discord, website, skills, team_status,
                    verified, age, location, twitter_x, rednote, hackathon_history, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
                [
                    data.email,
                    hashPassword(data.password),
                    sanitizeOptional(data.firstName) || '',
                    sanitizeOptional(data.lastName) || '',
                    sanitizeOptional(data.title) || '',
                    sanitizeOptional(data.bio),
                    normalizeUrlField(data.github, 'https://github.com/'),
                    normalizeUrlField(data.linkedin, 'https://linkedin.com/in/'),
                    sanitizeOptional(data.discord),
                    sanitizeOptional(data.website),
                    sanitizeOptional(data.skills),
                    sanitizeOptional(data.teamStatus) || 'solo',
                    1,
                    sanitizeOptional(data.age) || '',
                    sanitizeOptional(data.location) || '',
                    sanitizeOptional(data.twitterX) || '',
                    sanitizeOptional(data.rednote) || '',
                    sanitizeOptional(data.hackathonHistory),
                    new Date()
                ]
            );

            return redirect(res, BASE_URL + '/auth.html?verified=1');
        } catch (err) {
            console.error('[verify]', err.message);
            return redirect(res, BASE_URL + '/auth.html?error=db_error');
        }
    }

    if (pathname === '/api/login' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email, password } = body;
            if (!email || !password) {
                return json(res, 400, { error: 'Email and password are required.' });
            }

            const rows = await dbQuery(
                `SELECT email, first_name, last_name, title, bio, github, linkedin, discord, website,
                        skills, team_status, age, location, twitter_x, rednote, hackathon_history
                 FROM players
                 WHERE email = ? AND password_hash = ? AND verified = 1
                 LIMIT 1`,
                [email, hashPassword(password)]
            );

            if (!rows.length) {
                return json(res, 401, { error: 'Invalid email or password.' });
            }

            return json(res, 200, { ok: true, user: mapUserRow(rows[0]) });
        } catch (err) {
            console.error('[login]', err.message);
            return json(res, 500, { error: 'Login failed. Please try again.' });
        }
    }

    if (pathname === '/api/resend' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email } = body;
            let found = null;
            for (const [tok, entry] of pending.entries()) {
                if (entry.data.email === email) {
                    found = { tok, entry };
                    break;
                }
            }
            if (!found) {
                return json(res, 404, { error: 'No pending registration found for this email.' });
            }

            found.entry.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
            const verifyLink = BASE_URL + '/api/verify?token=' + found.tok;
            await transporter.sendMail(buildVerifyEmail(email, verifyLink));
            return json(res, 200, { ok: true });
        } catch (err) {
            console.error('[resend]', err.message);
            return json(res, 500, { error: 'Failed to resend email.' });
        }
    }

    if (pathname === '/api/send-otp' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email } = body;
            if (!email) {
                return json(res, 400, { error: 'Email is required.' });
            }

            const rows = await dbQuery(
                'SELECT email FROM players WHERE email = ? AND verified = 1 LIMIT 1',
                [email]
            );
            if (!rows.length) {
                return json(res, 404, { error: 'No account found for this email. Please register first.' });
            }

            const code = String(Math.floor(100000 + Math.random() * 900000));
            const expiresAt = Date.now() + 10 * 60 * 1000;
            otpStore.set(email, { code, expiresAt, attempts: 0 });

            await transporter.sendMail(buildOtpEmail(email, code));
            return json(res, 200, { ok: true, message: 'Verification code sent to ' + email });
        } catch (err) {
            console.error('[send-otp]', err.message);
            return json(res, 500, { error: 'Failed to send verification code. Please try again.' });
        }
    }

    if (pathname === '/api/verify-otp' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email, code } = body;
            if (!email || !code) {
                return json(res, 400, { error: 'Email and code are required.' });
            }

            const entry = otpStore.get(email);
            if (!entry) {
                return json(res, 400, { error: 'No verification code found. Please request a new one.' });
            }
            if (Date.now() > entry.expiresAt) {
                otpStore.delete(email);
                return json(res, 400, { error: 'Verification code has expired. Please request a new one.' });
            }

            entry.attempts += 1;
            if (entry.attempts > 5) {
                otpStore.delete(email);
                return json(res, 429, { error: 'Too many attempts. Please request a new code.' });
            }

            if (entry.code !== String(code).trim()) {
                return json(res, 400, { error: 'Incorrect code. Please try again (' + (5 - entry.attempts) + ' attempts left).' });
            }

            otpStore.delete(email);

            const rows = await dbQuery(
                `SELECT email, first_name, last_name, title, bio, github, linkedin, discord, website,
                        skills, team_status, age, location, twitter_x, rednote, hackathon_history
                 FROM players
                 WHERE email = ?
                 LIMIT 1`,
                [email]
            );
            const user = rows[0] || { email };
            return json(res, 200, { ok: true, user: mapUserRow(user) });
        } catch (err) {
            console.error('[verify-otp]', err.message);
            return json(res, 500, { error: 'Verification failed. Please try again.' });
        }
    }

    if (pathname === '/api/forgot-password' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email } = body;
            if (!email) {
                return json(res, 400, { error: 'Email is required.' });
            }

            json(res, 200, { ok: true });

            (async () => {
                try {
                    const rows = await dbQuery(
                        'SELECT email, first_name FROM players WHERE email = ? AND verified = 1 LIMIT 1',
                        [email]
                    );
                    if (!rows.length) return;

                    const token = crypto.randomBytes(32).toString('hex');
                    const expiresAt = Date.now() + 60 * 60 * 1000;
                    resetStore.set(token, { email, expiresAt });

                    const firstName = rows[0].first_name || 'there';
                    const resetLink = BASE_URL + '/auth.html?reset_token=' + token;
                    await transporter.sendMail(buildResetPasswordEmail(email, firstName, resetLink));
                    console.log('[forgot-password] Reset email sent to', email);
                } catch (err) {
                    console.error('[forgot-password async]', err.message);
                }
            })();
            return;
        } catch (err) {
            console.error('[forgot-password]', err.message);
            return json(res, 500, { error: 'Server error. Please try again.' });
        }
    }

    if (pathname === '/api/reset-password' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { token, password } = body;
            if (!token || !password) {
                return json(res, 400, { error: 'Token and password are required.' });
            }
            if (String(password).length < 8) {
                return json(res, 400, { error: 'Password must be at least 8 characters.' });
            }

            const entry = resetStore.get(token);
            if (!entry) {
                return json(res, 400, { error: 'Invalid or expired reset link. Please request a new one.' });
            }
            if (Date.now() > entry.expiresAt) {
                resetStore.delete(token);
                return json(res, 400, { error: 'This reset link has expired. Please request a new one.' });
            }

            await dbExecute('UPDATE players SET password_hash = ? WHERE email = ?', [hashPassword(password), entry.email]);
            resetStore.delete(token);
            console.log('[reset-password] Password updated for', entry.email);
            return json(res, 200, { ok: true, message: 'Password updated successfully.' });
        } catch (err) {
            console.error('[reset-password]', err.message);
            return json(res, 500, { error: 'Failed to reset password. Please try again.' });
        }
    }

    if (pathname === '/api/profile' && req.method === 'GET') {
        try {
            const email = parsed.query.email;
            if (!email) {
                return json(res, 400, { error: 'Email is required.' });
            }

            const rows = await dbQuery(
                `SELECT email, first_name, last_name, title, bio, github, linkedin, discord, website,
                        skills, team_status, age, location, twitter_x, rednote, hackathon_history
                 FROM players
                 WHERE email = ?
                 LIMIT 1`,
                [email]
            );

            if (!rows.length) {
                return json(res, 404, { error: 'User not found.' });
            }

            return json(res, 200, mapUserRow(rows[0]));
        } catch (err) {
            console.error('[get-profile]', err.message);
            return json(res, 500, { error: 'Failed to load profile.' });
        }
    }

    if (pathname === '/api/profile' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email } = body;
            if (!email) {
                return json(res, 400, { error: 'Email is required.' });
            }

            const update = {};
            if (body.firstName !== undefined) update.first_name = String(body.firstName);
            if (body.lastName !== undefined) update.last_name = String(body.lastName);
            if (body.title !== undefined) update.title = String(body.title);
            if (body.bio !== undefined) update.bio = String(body.bio);
            if (body.github !== undefined) update.github = String(body.github);
            if (body.linkedin !== undefined) update.linkedin = String(body.linkedin);
            if (body.discord !== undefined) update.discord = String(body.discord);
            if (body.website !== undefined) update.website = String(body.website);
            if (body.skills !== undefined) update.skills = String(body.skills);
            if (body.teamStatus !== undefined) update.team_status = String(body.teamStatus);
            if (body.age !== undefined) update.age = String(body.age);
            if (body.location !== undefined) update.location = String(body.location);
            if (body.twitterX !== undefined) update.twitter_x = String(body.twitterX);
            if (body.rednote !== undefined) update.rednote = String(body.rednote);
            if (body.hackathonHistory !== undefined) update.hackathon_history = String(body.hackathonHistory);

            if (Object.keys(update).length === 0) {
                return json(res, 400, { error: 'No fields to update.' });
            }
            if (update.first_name !== undefined && !update.first_name.trim()) {
                return json(res, 400, { error: 'First name cannot be empty.' });
            }
            if (update.last_name !== undefined && !update.last_name.trim()) {
                return json(res, 400, { error: 'Last name cannot be empty.' });
            }

            const fields = [];
            const values = [];
            for (const [key, value] of Object.entries(update)) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
            values.push(email);

            await dbExecute(`UPDATE players SET ${fields.join(', ')} WHERE email = ?`, values);
            console.log('[profile] Updated profile for', email);
            return json(res, 200, { ok: true });
        } catch (err) {
            console.error('[profile]', err.message);
            return json(res, 500, { error: 'Failed to update profile.' });
        }
    }

    if (pathname === '/api/change-password' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email, currentPassword, newPassword } = body;
            if (!email || !currentPassword || !newPassword) {
                return json(res, 400, { error: 'All fields are required.' });
            }
            if (String(newPassword).length < 8) {
                return json(res, 400, { error: 'New password must be at least 8 characters.' });
            }
            if (currentPassword === newPassword) {
                return json(res, 400, { error: 'New password must be different from your current password.' });
            }

            const rows = await dbQuery(
                'SELECT email FROM players WHERE email = ? AND password_hash = ? LIMIT 1',
                [email, hashPassword(currentPassword)]
            );
            if (!rows.length) {
                return json(res, 401, { error: 'Current password is incorrect.' });
            }

            await dbExecute('UPDATE players SET password_hash = ? WHERE email = ?', [hashPassword(newPassword), email]);
            console.log('[change-password] Password changed for', email);
            return json(res, 200, { ok: true });
        } catch (err) {
            console.error('[change-password]', err.message);
            return json(res, 500, { error: 'Failed to change password.' });
        }
    }

    return json(res, 404, { error: 'Not found' });
});

(async () => {
    try {
        await ensureSchema();
        await dbQuery('SELECT 1 AS ok');
        server.listen(PORT, () => {
            console.log('[EPIC API] Listening on port ' + PORT);
            console.log('[DB] Connected to MariaDB at ' + DB_CONFIG.host + ':' + DB_CONFIG.port + '/' + DB_CONFIG.database);
        });
    } catch (err) {
        console.error('[startup]', err.message);
        process.exit(1);
    }
})();
