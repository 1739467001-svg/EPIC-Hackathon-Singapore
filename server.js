/**
 * EPIC Hackathon Singapore — Registration API Server
 *
 * This server supports two data providers while keeping the same API routes
 * and payload field naming for the frontend:
 *   - supabase (existing implementation)
 *   - mariadb  (new additive implementation)
 *
 * Switch provider with DB_PROVIDER=supabase|mariadb
 * Default: supabase
 */

const http = require('http');
const https = require('https');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const url = require('url');
const mysql = require('mysql2/promise');

const PORT = Number(process.env.PORT || 3001);
const BASE_URL = process.env.BASE_URL || 'https://evol.epicconnector.ai';
const DB_PROVIDER = (process.env.DB_PROVIDER || 'supabase').toLowerCase();

const SUPABASE_HOST = process.env.SUPABASE_HOST || 'ahwafopsbwgevogeezqu.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFod2Fmb3BzYndnZXZvZ2VlenF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTQ5MTYsImV4cCI6MjA5MTY3MDkxNn0.wK7fZDyFaA39et0szUmMfvKVXgXTsrMxxt2Yo-ctFp0';

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

const transporter = nodemailer.createTransport({
    host: SMTP.host,
    port: SMTP.port,
    secure: SMTP.secure,
    auth: SMTP.auth,
    tls: { rejectUnauthorized: false }
});

let pool = null;
if (DB_PROVIDER === 'mariadb') {
    pool = mysql.createPool(DB_CONFIG);
}

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

function setCORS(req, res) {
    const origin = req.headers.origin || '*';
    const reqHeaders = req.headers['access-control-request-headers'] || 'Content-Type';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin, Access-Control-Request-Headers');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', reqHeaders);
    res.setHeader('Access-Control-Max-Age', '86400');
}

function sendPreflight(req, res) {
    setCORS(req, res);
    res.statusCode = 204;
    res.setHeader('Content-Length', '0');
    res.end();
}

function json(arg1, arg2, arg3, arg4) {
    const hasReq = typeof arg4 !== 'undefined';
    const req = hasReq ? arg1 : { headers: {} };
    const res = hasReq ? arg2 : arg1;
    const status = hasReq ? arg3 : arg2;
    const data = hasReq ? arg4 : arg3;
    setCORS(req, res);
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function redirect(arg1, arg2, arg3) {
    const hasReq = typeof arg3 !== 'undefined';
    const req = hasReq ? arg1 : { headers: {} };
    const res = hasReq ? arg2 : arg1;
    const location = hasReq ? arg3 : arg2;
    setCORS(req, res);
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

function mapUserToResponse(row) {
    return { ok: true, user: mapUserRow(row) };
}

/* ---------- Supabase helpers ---------- */
function supabaseRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : null;
        const options = {
            hostname: SUPABASE_HOST,
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
                try {
                    resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
                } catch (e) {
                    resolve({ status: res.statusCode, data: null });
                }
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

/* ---------- MariaDB helpers ---------- */
async function dbQuery(sql, params = []) {
    const [rows] = await pool.query(sql, params);
    return rows;
}

async function dbExecute(sql, params = []) {
    const [result] = await pool.execute(sql, params);
    return result;
}

async function ensureMariaDbSchema() {
    if (DB_PROVIDER !== 'mariadb') return;
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

async function findUserByEmail(email) {
    if (DB_PROVIDER === 'mariadb') {
        const rows = await dbQuery(
            `SELECT email, first_name, last_name, title, bio, github, linkedin, discord, website,
                    skills, team_status, age, location, twitter_x, rednote, hackathon_history, verified, password_hash
             FROM players WHERE email = ? LIMIT 1`,
            [email]
        );
        return rows[0] || null;
    }
    const rows = await supabaseQuery(
        'players',
        'email=eq.' + encodeURIComponent(email) + '&select=email,first_name,last_name,title,bio,github,linkedin,discord,website,skills,team_status,age,location,twitter_x,rednote,hackathon_history,verified,password_hash'
    );
    return rows && rows[0] ? rows[0] : null;
}

async function createUserFromRegistration(data) {
    const record = {
        email: data.email,
        password_hash: hashPassword(data.password),
        first_name: data.firstName || '',
        last_name: data.lastName || '',
        title: data.title || '',
        bio: data.bio || '',
        github: data.github ? normalizeUrlField(data.github, 'https://github.com/') : null,
        linkedin: data.linkedin ? normalizeUrlField(data.linkedin, 'https://linkedin.com/in/') : null,
        discord: data.discord || null,
        website: data.website || null,
        skills: data.skills || null,
        team_status: data.teamStatus || 'solo',
        verified: true,
        age: data.age || '',
        location: data.location || '',
        twitter_x: data.twitterX || '',
        rednote: data.rednote || '',
        hackathon_history: data.hackathonHistory || '',
        created_at: new Date().toISOString()
    };

    if (DB_PROVIDER === 'mariadb') {
        await dbExecute(
            `INSERT INTO players (
                email, password_hash, first_name, last_name, title, bio,
                github, linkedin, discord, website, skills, team_status,
                verified, age, location, twitter_x, rednote, hackathon_history, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                record.email,
                record.password_hash,
                record.first_name,
                record.last_name,
                record.title,
                record.bio,
                record.github,
                record.linkedin,
                record.discord,
                record.website,
                record.skills,
                record.team_status,
                1,
                record.age,
                record.location,
                record.twitter_x,
                record.rednote,
                record.hackathon_history,
                new Date()
            ]
        );
        return;
    }

    await supabaseInsert('players', record);
}

async function findVerifiedUserByLogin(email, passwordHash) {
    if (DB_PROVIDER === 'mariadb') {
        const rows = await dbQuery(
            `SELECT email, first_name, last_name, title, bio, github, linkedin, discord, website,
                    skills, team_status, age, location, twitter_x, rednote, hackathon_history
             FROM players
             WHERE email = ? AND password_hash = ? AND verified = 1
             LIMIT 1`,
            [email, passwordHash]
        );
        return rows[0] || null;
    }
    const rows = await supabaseQuery(
        'players',
        'email=eq.' + encodeURIComponent(email) +
        '&password_hash=eq.' + passwordHash +
        '&verified=eq.true&select=email,first_name,last_name,title,bio,github,linkedin,discord,website,skills,team_status,age,location,twitter_x,rednote,hackathon_history'
    );
    return rows && rows[0] ? rows[0] : null;
}

async function getProfileByEmail(email) {
    if (DB_PROVIDER === 'mariadb') {
        const rows = await dbQuery(
            `SELECT email, first_name, last_name, title, bio, github, linkedin, discord, website,
                    skills, team_status, age, location, twitter_x, rednote, hackathon_history
             FROM players WHERE email = ? LIMIT 1`,
            [email]
        );
        return rows[0] || null;
    }
    const rows = await supabaseQuery(
        'players',
        'email=eq.' + encodeURIComponent(email) + '&select=email,first_name,last_name,title,bio,github,linkedin,discord,website,skills,team_status,age,location,twitter_x,rednote,hackathon_history'
    );
    return rows && rows[0] ? rows[0] : null;
}

async function updateProfileByEmail(email, update) {
    if (DB_PROVIDER === 'mariadb') {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(update)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        values.push(email);
        await dbExecute(`UPDATE players SET ${fields.join(', ')} WHERE email = ?`, values);
        return;
    }
    await supabaseRequest('PATCH', '/rest/v1/players?email=eq.' + encodeURIComponent(email), update);
}

async function updatePasswordByEmail(email, newHash) {
    if (DB_PROVIDER === 'mariadb') {
        await dbExecute('UPDATE players SET password_hash = ? WHERE email = ?', [newHash, email]);
        return;
    }
    await supabaseRequest('PATCH', '/rest/v1/players?email=eq.' + encodeURIComponent(email), { password_hash: newHash });
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

const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    if (req.method === 'OPTIONS') {
        sendPreflight(req, res);
        return;
    }

    if (pathname === '/api/register' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email, password } = body;
            if (!email || !password) return json(res, 400, { error: 'Email and password are required.' });
            if (String(password).length < 8) return json(res, 400, { error: 'Password must be at least 8 characters.' });

            const existing = await findUserByEmail(email);
            if (existing) return json(res, 409, { error: 'This email is already registered. Please sign in.' });

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
        const token = parsed.query.token;
        if (!token || !pending.has(token)) {
            return redirect(res, BASE_URL + '/auth.html?error=invalid_token');
        }
        const entry = pending.get(token);
        if (Date.now() > entry.expiresAt) {
            pending.delete(token);
            return redirect(res, BASE_URL + '/auth.html?error=token_expired');
        }
        const { data } = entry;
        pending.delete(token);
        try {
            const existing = await findUserByEmail(data.email);
            if (!existing) await createUserFromRegistration(data);
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
            if (!email || !password) return json(res, 400, { error: 'Email and password are required.' });
            const user = await findVerifiedUserByLogin(email, hashPassword(password));
            if (!user) return json(res, 401, { error: 'Invalid email or password.' });
            return json(res, 200, mapUserToResponse(user));
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
                if (entry.data.email === email) { found = { tok, entry }; break; }
            }
            if (!found) return json(res, 404, { error: 'No pending registration found for this email.' });
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
            if (!email) return json(res, 400, { error: 'Email is required.' });

            const user = await findUserByEmail(email);
            if (!user || !(user.verified === true || user.verified === 1 || user.verified === 'true' || user.verified === null)) {
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
            const user = await getProfileByEmail(email);
            return json(res, 200, { ok: true, user: mapUserRow(user || { email }) });
        } catch (err) {
            console.error('[verify-otp]', err.message);
            return json(res, 500, { error: 'Verification failed. Please try again.' });
        }
    }

    if (pathname === '/api/forgot-password' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email } = body;
            if (!email) return json(res, 400, { error: 'Email is required.' });

            json(res, 200, { ok: true });
            (async () => {
                try {
                    const user = await findUserByEmail(email);
                    if (!user || !(user.verified === true || user.verified === 1 || user.verified === 'true' || user.verified === null)) return;
                    const token = crypto.randomBytes(32).toString('hex');
                    const expiresAt = Date.now() + 60 * 60 * 1000;
                    resetStore.set(token, { email, expiresAt });
                    const firstName = user.first_name || 'there';
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
            if (!token || !password) return json(res, 400, { error: 'Token and password are required.' });
            if (String(password).length < 8) return json(res, 400, { error: 'Password must be at least 8 characters.' });

            const entry = resetStore.get(token);
            if (!entry) return json(res, 400, { error: 'Invalid or expired reset link. Please request a new one.' });
            if (Date.now() > entry.expiresAt) {
                resetStore.delete(token);
                return json(res, 400, { error: 'This reset link has expired. Please request a new one.' });
            }

            await updatePasswordByEmail(entry.email, hashPassword(password));
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
            if (!email) return json(res, 400, { error: 'Email is required.' });
            const user = await getProfileByEmail(email);
            if (!user) return json(res, 404, { error: 'User not found.' });
            return json(res, 200, mapUserRow(user));
        } catch (err) {
            console.error('[get-profile]', err.message);
            return json(res, 500, { error: 'Failed to load profile.' });
        }
    }

    if (pathname === '/api/profile' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email } = body;
            if (!email) return json(res, 400, { error: 'Email is required.' });

            const update = {};
            if (body.firstName !== undefined) update.first_name = body.firstName;
            if (body.lastName !== undefined) update.last_name = body.lastName;
            if (body.title !== undefined) update.title = body.title;
            if (body.bio !== undefined) update.bio = body.bio;
            if (body.github !== undefined) update.github = body.github;
            if (body.linkedin !== undefined) update.linkedin = body.linkedin;
            if (body.discord !== undefined) update.discord = body.discord;
            if (body.website !== undefined) update.website = body.website;
            if (body.skills !== undefined) update.skills = body.skills;
            if (body.teamStatus !== undefined) update.team_status = body.teamStatus;
            if (body.age !== undefined) update.age = body.age;
            if (body.location !== undefined) update.location = body.location;
            if (body.twitterX !== undefined) update.twitter_x = body.twitterX;
            if (body.rednote !== undefined) update.rednote = body.rednote;
            if (body.hackathonHistory !== undefined) update.hackathon_history = body.hackathonHistory;

            if (Object.keys(update).length === 0) return json(res, 400, { error: 'No fields to update.' });
            if (update.first_name !== undefined && !String(update.first_name).trim()) return json(res, 400, { error: 'First name cannot be empty.' });
            if (update.last_name !== undefined && !String(update.last_name).trim()) return json(res, 400, { error: 'Last name cannot be empty.' });

            await updateProfileByEmail(email, update);
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
            if (!email || !currentPassword || !newPassword) return json(res, 400, { error: 'All fields are required.' });
            if (String(newPassword).length < 8) return json(res, 400, { error: 'New password must be at least 8 characters.' });
            if (currentPassword === newPassword) return json(res, 400, { error: 'New password must be different from your current password.' });

            const user = await findVerifiedUserByLogin(email, hashPassword(currentPassword));
            if (!user) return json(res, 401, { error: 'Current password is incorrect.' });

            await updatePasswordByEmail(email, hashPassword(newPassword));
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
        if (DB_PROVIDER === 'mariadb') {
            await ensureMariaDbSchema();
            await dbQuery('SELECT 1 AS ok');
            console.log('[DB] MariaDB enabled at ' + DB_CONFIG.host + ':' + DB_CONFIG.port + '/' + DB_CONFIG.database);
        } else {
            const r = await supabaseRequest('GET', '/rest/v1/players?select=email&limit=1');
            if (!(r.status >= 200 && r.status < 300)) {
                throw new Error('Supabase health check failed: HTTP ' + r.status);
            }
            console.log('[DB] Supabase enabled at ' + SUPABASE_HOST);
        }
        server.listen(PORT, () => {
            console.log('[EPIC API] Listening on port ' + PORT + ' with provider=' + DB_PROVIDER);
        });
    } catch (err) {
        console.error('[startup]', err.message);
        process.exit(1);
    }
})();
