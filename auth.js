/**
 * EPIC Hackathon Singapore — Registration Logic
 * auth.js  (v2 — multi-step, role-based, email verification)
 */

const API_BASE = 'http://43.130.98.104:8080/api';

let currentRole = null;
let pendingEmail = null;

/* ============================================================
   Page Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // Coming back from email verification link
    if (params.get('verified') === '1') {
        showStep('step-success');
        startCountdown();
        return;
    }

    // Error from verification
    const err = params.get('error');
    if (err) {
        showStep('step-role');
        const msg = err === 'token_expired'
            ? 'Your verification link has expired. Please register again.'
            : err === 'invalid_token'
            ? 'Invalid verification link. Please register again.'
            : 'An error occurred. Please try again.';
        showToast(msg, 'error');
    }

    // Form submit listeners
    const fp = document.getElementById('form-player');
    const fa = document.getElementById('form-admin');
    if (fp) fp.addEventListener('submit', handlePlayerSubmit);
    if (fa) fa.addEventListener('submit', handleAdminSubmit);
});

/* ============================================================
   Step Navigation
   ============================================================ */
function showStep(stepId) {
    document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(stepId);
    if (el) el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectRole(role) {
    currentRole = role;
    showStep(role === 'player' ? 'step-player' : 'step-admin');
}

function goBack(targetStep) {
    showStep(targetStep);
}

/* ============================================================
   Validation Helpers
   ============================================================ */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(elementId, msg) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    el.classList.add('error');
}

function clearError(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
}

function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (loading) {
        btn.classList.add('loading');
        btn.disabled = true;
    } else {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

/* ============================================================
   Participant Form Submit
   ============================================================ */
async function handlePlayerSubmit(e) {
    e.preventDefault();
    clearError('player-error');

    const firstName  = document.getElementById('p-firstname').value.trim();
    const lastName   = document.getElementById('p-lastname').value.trim();
    const email      = document.getElementById('p-email').value.trim();
    const password   = document.getElementById('p-password').value;
    const password2  = document.getElementById('p-password2').value;
    const title      = document.getElementById('p-role').value;
    const bio        = document.getElementById('p-bio').value.trim();
    const github     = document.getElementById('p-github').value.trim();
    const linkedin   = document.getElementById('p-linkedin').value.trim();
    const discord    = document.getElementById('p-discord').value.trim();
    const website    = document.getElementById('p-website').value.trim();
    const skills     = document.getElementById('p-skills').value.trim();
    const teamStatus = document.querySelector('input[name="p-team"]:checked')?.value || 'solo';

    if (!firstName || !lastName) return showError('player-error', 'Please enter your full name.');
    if (!validateEmail(email))   return showError('player-error', 'Please enter a valid email address.');
    if (password.length < 8)     return showError('player-error', 'Password must be at least 8 characters.');
    if (password !== password2)  return showError('player-error', 'Passwords do not match.');
    if (!title)                  return showError('player-error', 'Please select your role / title.');

    setLoading('player-submit-btn', true);

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: 'player',
                email, password,
                firstName, lastName, title, bio,
                github, linkedin, discord, website, skills, teamStatus
            })
        });
        const data = await res.json();

        if (!res.ok) {
            showError('player-error', data.error || 'Registration failed. Please try again.');
            setLoading('player-submit-btn', false);
            return;
        }

        pendingEmail = email;
        document.getElementById('verify-email-display').textContent = email;
        showStep('step-verify');
    } catch (err) {
        showError('player-error', 'Network error. Please check your connection and try again.');
        setLoading('player-submit-btn', false);
    }
}

/* ============================================================
   Organizer Form Submit
   ============================================================ */
async function handleAdminSubmit(e) {
    e.preventDefault();
    clearError('admin-error');

    const firstName      = document.getElementById('a-firstname').value.trim();
    const lastName       = document.getElementById('a-lastname').value.trim();
    const email          = document.getElementById('a-email').value.trim();
    const password       = document.getElementById('a-password').value;
    const password2      = document.getElementById('a-password2').value;
    const organization   = document.getElementById('a-org').value.trim();
    const adminRole      = document.getElementById('a-role').value;
    const eventName      = document.getElementById('a-event-name').value.trim();
    const eventStart     = document.getElementById('a-event-start').value;
    const eventEnd       = document.getElementById('a-event-end').value;
    const eventLocation  = document.getElementById('a-event-location').value.trim();
    const eventDesc      = document.getElementById('a-event-desc').value.trim();
    const eventPrice     = document.getElementById('a-event-price').value;
    const eventCapacity  = document.getElementById('a-event-capacity').value;
    const eventApproval  = document.getElementById('a-event-approval').checked;

    if (!firstName || !lastName) return showError('admin-error', 'Please enter your full name.');
    if (!validateEmail(email))   return showError('admin-error', 'Please enter a valid email address.');
    if (password.length < 8)     return showError('admin-error', 'Password must be at least 8 characters.');
    if (password !== password2)  return showError('admin-error', 'Passwords do not match.');
    if (!organization)           return showError('admin-error', 'Please enter your organization name.');
    if (!adminRole)              return showError('admin-error', 'Please select your role.');

    setLoading('admin-submit-btn', true);

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: 'admin',
                email, password,
                firstName, lastName, organization, adminRole,
                eventName, eventStart, eventEnd, eventLocation,
                eventDesc, eventPrice, eventCapacity, eventApproval
            })
        });
        const data = await res.json();

        if (!res.ok) {
            showError('admin-error', data.error || 'Registration failed. Please try again.');
            setLoading('admin-submit-btn', false);
            return;
        }

        pendingEmail = email;
        document.getElementById('verify-email-display').textContent = email;
        showStep('step-verify');
    } catch (err) {
        showError('admin-error', 'Network error. Please check your connection and try again.');
        setLoading('admin-submit-btn', false);
    }
}

/* ============================================================
   Resend Verification
   ============================================================ */
async function resendVerification() {
    const btn = document.getElementById('resend-btn');
    const msgEl = document.getElementById('resend-message');

    btn.disabled = true;
    btn.textContent = 'Sending...';
    msgEl.classList.add('hidden');

    try {
        const res = await fetch(`${API_BASE}/resend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: pendingEmail, role: currentRole })
        });
        const data = await res.json();

        if (res.ok) {
            msgEl.textContent = 'Verification email resent! Please check your inbox.';
            msgEl.className = 'form-message success';
            msgEl.classList.remove('hidden');
        } else {
            msgEl.textContent = data.error || 'Failed to resend. Please try again.';
            msgEl.className = 'form-message error';
            msgEl.classList.remove('hidden');
        }
    } catch {
        msgEl.textContent = 'Network error. Please try again.';
        msgEl.className = 'form-message error';
        msgEl.classList.remove('hidden');
    }

    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Resend Email';
    }, 30000);
}

/* ============================================================
   Success Countdown
   ============================================================ */
function startCountdown() {
    let count = 5;
    const el = document.getElementById('countdown');
    if (!el) return;
    const timer = setInterval(() => {
        count--;
        el.textContent = count;
        if (count <= 0) {
            clearInterval(timer);
            window.location.href = 'index.html';
        }
    }, 1000);
}

/* ============================================================
   Toast Notification
   ============================================================ */
function showToast(msg, type) {
    const toast = document.createElement('div');
    toast.style.cssText = [
        'position:fixed;top:80px;right:20px;z-index:9999;',
        'padding:12px 18px;border-radius:10px;font-size:14px;',
        'max-width:340px;line-height:1.5;',
        type === 'error'
            ? 'background:rgba(255,80,80,0.15);border:1px solid rgba(255,80,80,0.3);color:#ff8888;'
            : 'background:rgba(80,200,120,0.15);border:1px solid rgba(80,200,120,0.3);color:#88d4a8;'
    ].join('');
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 6000);
}
