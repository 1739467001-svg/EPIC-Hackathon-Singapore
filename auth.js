/**
 * EPIC Hackathon Singapore — Auth Logic
 * auth.js  (v3 — split layout, email-only sign in / create account)
 */

const API_BASE = 'http://43.130.98.104:8080/api';

let pendingEmail = null;
let pendingRole  = 'player';

/* ============================================================
   Page Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // Coming back from email verification link
    if (params.get('verified') === '1') {
        showPanel('panel-success');
        hideTabs();
        startCountdown();
        return;
    }

    // Error from verification
    const err = params.get('error');
    if (err) {
        const msg = err === 'token_expired'
            ? 'Your verification link has expired. Please register again.'
            : err === 'invalid_token'
            ? 'Invalid verification link. Please register again.'
            : 'An error occurred. Please try again.';
        showToast(msg, 'error');
    }

    // Form submit listeners
    const fsi = document.getElementById('form-signin');
    const fsu = document.getElementById('form-signup');
    if (fsi) fsi.addEventListener('submit', handleSignIn);
    if (fsu) fsu.addEventListener('submit', handleSignUp);
});

/* ============================================================
   Tab / Panel Navigation
   ============================================================ */
function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Show correct panel
    const panelId = tab === 'signin' ? 'panel-signin' : 'panel-signup';
    showPanel(panelId);
}

function showPanel(panelId) {
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(panelId);
    if (el) el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideTabs() {
    const tabs = document.getElementById('authTabs');
    if (tabs) tabs.style.display = 'none';
}

/* ============================================================
   Password Toggle
   ============================================================ */
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';

    // Swap icon
    const icon = btn.querySelector('.eye-icon');
    if (icon) {
        icon.innerHTML = isHidden
            ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
            : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
    }
}

/* ============================================================
   Forgot Password
   ============================================================ */
function showForgot(e) {
    e.preventDefault();
    showToast('Password reset is coming soon. Please contact support.', 'info');
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
    const textEl    = btn.querySelector('.btn-text');
    const loadingEl = btn.querySelector('.btn-loading');
    btn.disabled = loading;
    if (textEl)    textEl.classList.toggle('hidden', loading);
    if (loadingEl) loadingEl.classList.toggle('hidden', !loading);
}

/* ============================================================
   Sign In
   ============================================================ */
async function handleSignIn(e) {
    e.preventDefault();
    clearError('signin-error');

    const email    = document.getElementById('si-email').value.trim();
    const password = document.getElementById('si-password').value;

    if (!validateEmail(email)) return showError('signin-error', 'Please enter a valid email address.');
    if (!password)             return showError('signin-error', 'Please enter your password.');

    setLoading('signin-submit-btn', true);

    try {
        const res  = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showError('signin-error', data.error || 'Invalid email or password. Please try again.');
            setLoading('signin-submit-btn', false);
            return;
        }

        // Successful login — redirect to homepage
        window.location.href = 'index.html';
    } catch {
        showError('signin-error', 'Network error. Please check your connection and try again.');
        setLoading('signin-submit-btn', false);
    }
}

/* ============================================================
   Create Account (Sign Up)
   ============================================================ */
async function handleSignUp(e) {
    e.preventDefault();
    clearError('signup-error');

    const firstName = document.getElementById('su-firstname').value.trim();
    const lastName  = document.getElementById('su-lastname').value.trim();
    const email     = document.getElementById('su-email').value.trim();
    const password  = document.getElementById('su-password').value;
    const title     = document.getElementById('su-role').value;

    if (!firstName || !lastName) return showError('signup-error', 'Please enter your full name.');
    if (!validateEmail(email))   return showError('signup-error', 'Please enter a valid email address.');
    if (password.length < 8)     return showError('signup-error', 'Password must be at least 8 characters.');
    if (!title)                  return showError('signup-error', 'Please select your role.');

    setLoading('signup-submit-btn', true);

    try {
        const res  = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: 'player',
                email, password,
                firstName, lastName, title,
                teamStatus: 'solo'
            })
        });
        const data = await res.json();

        if (!res.ok) {
            showError('signup-error', data.error || 'Registration failed. Please try again.');
            setLoading('signup-submit-btn', false);
            return;
        }

        pendingEmail = email;
        pendingRole  = 'player';
        document.getElementById('verify-email-display').textContent = email;
        hideTabs();
        showPanel('panel-verify');
    } catch {
        showError('signup-error', 'Network error. Please check your connection and try again.');
        setLoading('signup-submit-btn', false);
    }
}

/* ============================================================
   Resend Verification
   ============================================================ */
async function resendVerification() {
    const btn   = document.getElementById('resend-btn');
    const msgEl = document.getElementById('resend-message');

    btn.disabled = true;
    btn.textContent = 'Sending...';
    msgEl.classList.add('hidden');

    try {
        const res  = await fetch(`${API_BASE}/resend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: pendingEmail, role: pendingRole })
        });
        const data = await res.json();

        if (res.ok) {
            msgEl.textContent = 'Verification email resent! Please check your inbox.';
            msgEl.style.background = 'rgba(34,197,94,0.08)';
            msgEl.style.borderColor = 'rgba(34,197,94,0.22)';
            msgEl.style.color = '#86efac';
            msgEl.classList.remove('hidden');
        } else {
            msgEl.textContent = data.error || 'Failed to resend. Please try again.';
            msgEl.classList.remove('hidden');
        }
    } catch {
        msgEl.textContent = 'Network error. Please try again.';
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
function showToast(msg, type = 'error') {
    const colors = {
        error: 'background:rgba(255,80,80,0.12);border:1px solid rgba(255,80,80,0.25);color:#ff9999;',
        info:  'background:rgba(34,197,94,0.10);border:1px solid rgba(34,197,94,0.25);color:#86efac;'
    };
    const toast = document.createElement('div');
    toast.style.cssText = [
        'position:fixed;top:24px;right:24px;z-index:9999;',
        'padding:13px 18px;border-radius:12px;font-size:14px;',
        'max-width:360px;line-height:1.5;font-family:Inter,sans-serif;',
        colors[type] || colors.error
    ].join('');
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 6000);
}
