/**
 * EPIC Hackathon Singapore — Registration API Server
 * api-server.js
 *
 * Handles:
 *  POST /api/register   — store pending registration, send verification email
 *  GET  /api/verify     — verify token, write to Supabase, redirect to success
 *  POST /api/resend     — resend verification email
 *
 * Port: 3001 (nginx proxies /api/ → localhost:3001)
 */

const http        = require('http');
const https       = require('https');
const nodemailer  = require('nodemailer');
const crypto      = require('crypto');
const url         = require('url');

/* ============================================================
   Config
   ============================================================ */
const PORT         = 3001;
const BASE_URL     = 'http://43.130.98.104:8080';
const SUPABASE_URL = 'https://ahwafopsbwgevogeezqu.supabase.co';
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

/* ============================================================
   In-memory pending store  { token -> { data, expiresAt } }
   (For production, use Redis or a DB table)
   ============================================================ */
const pending = new Map();

/* ============================================================
   Nodemailer transporter
   ============================================================ */
const transporter = nodemailer.createTransport({
    host: SMTP.host,
    port: SMTP.port,
    secure: SMTP.secure,
    auth: SMTP.auth,
    tls: { rejectUnauthorized: false }
});

/* ============================================================
   Supabase REST helper
   ============================================================ */
function supabaseInsert(table, record) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(record);
        const options = {
            hostname: 'ahwafopsbwgevogeezqu.supabase.co',
            path: `/rest/v1/${table}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Supabase error ${res.statusCode}: ${data}`));
                }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

/* ============================================================
   Email template
   ============================================================ */
function buildEmail(toEmail, verifyLink, role) {
    const roleLabel = role === 'admin' ? 'Organizer' : 'Participant';
    return {
        from: `"EPIC Hackathon Singapore" <${SMTP.auth.user}>`,
        to: toEmail,
        subject: `Verify your EPIC Hackathon registration`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#000;padding:28px 36px;border-bottom:1px solid rgba(255,255,255,0.07);">
            <span style="font-size:22px;font-weight:900;letter-spacing:0.1em;color:#fff;">EPIC</span>
            <span style="font-size:13px;color:rgba(255,255,255,0.4);margin-left:12px;">Hackathon Singapore</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 36px 28px;">
            <h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 12px;letter-spacing:-0.5px;">Verify your email address</h1>
            <p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 24px;">
              Thanks for registering as a <strong style="color:#fff;">${roleLabel}</strong> at EPIC Hackathon Singapore!<br/>
              Click the button below to verify your email and complete your registration.
            </p>
            <a href="${verifyLink}" style="display:inline-block;background:#fff;color:#000;font-size:15px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:-0.2px;">
              Verify Email &amp; Complete Registration →
            </a>
            <p style="font-size:13px;color:rgba(255,255,255,0.35);margin:24px 0 0;line-height:1.6;">
              This link expires in <strong style="color:rgba(255,255,255,0.55);">24 hours</strong>.<br/>
              If you didn't register, you can safely ignore this email.
            </p>
          </td>
        </tr>
        <!-- Link fallback -->
        <tr>
          <td style="padding:0 36px 28px;">
            <p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">
              Or copy this link: <a href="${verifyLink}" style="color:rgba(255,255,255,0.45);">${verifyLink}</a>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:rgba(255,255,255,0.025);padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">
              &copy; 2025 EPIC Hackathon Singapore &nbsp;&middot;&nbsp;
              <a href="${BASE_URL}" style="color:rgba(255,255,255,0.35);text-decoration:none;">Visit Website</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
    };
}

/* ============================================================
   Request body parser
   ============================================================ */
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try { resolve(JSON.parse(body)); }
            catch (e) { resolve({}); }
        });
        req.on('error', reject);
    });
}

/* ============================================================
   CORS helper
   ============================================================ */
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

/* ============================================================
   HTTP Server
   ============================================================ */
const server = http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    // Preflight
    if (req.method === 'OPTIONS') {
        setCORS(res);
        res.writeHead(204);
        res.end();
        return;
    }

    /* ----------------------------------------------------------
       POST /api/register
       Body: { role, email, password, ...formFields }
       ---------------------------------------------------------- */
    if (pathname === '/api/register' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { role, email, password } = body;

            if (!role || !email || !password) {
                return json(res, 400, { error: 'Missing required fields.' });
            }
            if (password.length < 8) {
                return json(res, 400, { error: 'Password must be at least 8 characters.' });
            }

            // Generate token
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h

            // Store pending
            pending.set(token, { data: body, expiresAt });

            // Build verify link
            const verifyLink = `${BASE_URL}/api/verify?token=${token}`;

            // Send email
            await transporter.sendMail(buildEmail(email, verifyLink, role));

            return json(res, 200, { ok: true, message: 'Verification email sent.' });
        } catch (err) {
            console.error('[register]', err);
            return json(res, 500, { error: 'Failed to send verification email. Please try again.' });
        }
    }

    /* ----------------------------------------------------------
       GET /api/verify?token=xxx
       ---------------------------------------------------------- */
    if (pathname === '/api/verify' && req.method === 'GET') {
        const token = parsed.query.token;
        if (!token || !pending.has(token)) {
            setCORS(res);
            res.writeHead(302, { Location: `${BASE_URL}/auth.html?error=invalid_token` });
            res.end();
            return;
        }

        const entry = pending.get(token);
        if (Date.now() > entry.expiresAt) {
            pending.delete(token);
            setCORS(res);
            res.writeHead(302, { Location: `${BASE_URL}/auth.html?error=token_expired` });
            res.end();
            return;
        }

        const { data } = entry;
        pending.delete(token);

        try {
            // Hash password (simple SHA-256 for demo; use bcrypt in production)
            const pwHash = crypto.createHash('sha256').update(data.password).digest('hex');

            if (data.role === 'player') {
                // Insert into players table
                await supabaseInsert('players', {
                    email: data.email,
                    password_hash: pwHash,
                    first_name: data.firstName || '',
                    last_name: data.lastName || '',
                    title: data.title || '',
                    bio: data.bio || '',
                    github: data.github ? `https://github.com/${data.github}` : null,
                    linkedin: data.linkedin ? `https://linkedin.com/in/${data.linkedin}` : null,
                    discord: data.discord || null,
                    website: data.website || null,
                    skills: data.skills || null,
                    team_status: data.teamStatus || 'solo',
                    verified: true,
                    created_at: new Date().toISOString()
                });
            } else {
                // Insert into admins table
                await supabaseInsert('admins', {
                    email: data.email,
                    password_hash: pwHash,
                    first_name: data.firstName || '',
                    last_name: data.lastName || '',
                    organization: data.organization || '',
                    role_title: data.adminRole || '',
                    verified: true,
                    created_at: new Date().toISOString()
                });

                // If event details provided, insert into events table
                if (data.eventName) {
                    await supabaseInsert('events', {
                        organizer_email: data.email,
                        name: data.eventName,
                        start_time: data.eventStart || null,
                        end_time: data.eventEnd || null,
                        location: data.eventLocation || null,
                        description: data.eventDesc || null,
                        ticket_price: data.eventPrice || 'free',
                        capacity: data.eventCapacity || 'unlimited',
                        requires_approval: data.eventApproval === true,
                        created_at: new Date().toISOString()
                    });
                }
            }

            // Redirect to success page
            setCORS(res);
            res.writeHead(302, { Location: `${BASE_URL}/auth.html?verified=1&role=${data.role}` });
            res.end();
        } catch (err) {
            console.error('[verify]', err);
            setCORS(res);
            res.writeHead(302, { Location: `${BASE_URL}/auth.html?error=db_error` });
            res.end();
        }
        return;
    }

    /* ----------------------------------------------------------
       POST /api/resend
       Body: { email, role }
       ---------------------------------------------------------- */
    if (pathname === '/api/resend' && req.method === 'POST') {
        try {
            const body = await parseBody(req);
            const { email, role } = body;

            // Find existing pending entry by email
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

            // Refresh expiry
            found.entry.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
            const verifyLink = `${BASE_URL}/api/verify?token=${found.tok}`;
            await transporter.sendMail(buildEmail(email, verifyLink, role || found.entry.data.role));

            return json(res, 200, { ok: true });
        } catch (err) {
            console.error('[resend]', err);
            return json(res, 500, { error: 'Failed to resend email.' });
        }
    }

    // 404
    json(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
    console.log(`[EPIC API] Listening on port ${PORT}`);
});
