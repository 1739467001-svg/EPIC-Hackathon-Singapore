/**
 * EPIC Hackathon Singapore — Auth Logic
 * auth.js  (v4 — dual sign-in: password + OTP)
 */

const API_BASE = 'http://43.130.98.104:8080/api';

let pendingEmail    = null;
let otpCountdownTimer = null;

/* ============================================================
   Page Init
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // Coming back from password reset link
    const resetToken = params.get('reset_token');
    if (resetToken) {
        initResetPassword(resetToken);
        return;
    }

    // Coming back from email verification link — show login tab with success toast
    if (params.get('verified') === '1') {
        switchTab('signin');
        showToast('Email verified! Your account is ready. Please sign in.', 'info');
        history.replaceState({}, '', window.location.pathname);
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
    const fsi  = document.getElementById('form-signin');
    const fsu  = document.getElementById('form-signup');
    const fotp = document.getElementById('form-otp');
    if (fsi)  fsi.addEventListener('submit', handleSignIn);
    if (fsu)  fsu.addEventListener('submit', handleSignUp);
    if (fotp) fotp.addEventListener('submit', handleOTPVerify);
});

/* ============================================================
   Tab / Panel Navigation
   ============================================================ */
function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
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
   Sign In Method Sub-Tabs (Password / OTP)
   ============================================================ */
function switchSigninMethod(method) {
    // Update sub-tab buttons
    document.querySelectorAll('.signin-method-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.method === method);
    });
    // Show correct method panel
    document.querySelectorAll('.signin-method-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('method-' + method);
    if (panel) panel.classList.add('active');

    // Clear errors when switching
    clearError('signin-error');
    clearError('otp-send-error');
    clearError('otp-verify-error');
}

/* ============================================================
   Password Toggle
   ============================================================ */
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    const icon = btn.querySelector('svg');
    if (icon) {
        icon.innerHTML = isHidden
            ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
            : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
    }
}

/* ============================================================
   Forgot Password — show panel
   ============================================================ */
function showForgotPanel(e) {
    e.preventDefault();
    hideTabs();
    showPanel('panel-forgot');
    // Bind form submit if not already bound
    const form = document.getElementById('form-forgot');
    if (form && !form._bound) {
        form.addEventListener('submit', handleForgotPassword);
        form._bound = true;
    }
}

/* ============================================================
   Forgot Password — send reset email
   ============================================================ */
async function handleForgotPassword(e) {
    e.preventDefault();
    clearError('forgot-error');

    const email = document.getElementById('forgot-email').value.trim();
    if (!validateEmail(email)) return showError('forgot-error', 'Please enter a valid email address.');

    setLoading('forgot-submit-btn', true);

    try {
        const res  = await fetch(`${API_BASE}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();

        // Always show success (don't reveal if email exists)
        document.getElementById('forgot-email-display').textContent = email;
        showPanel('panel-forgot-sent');
    } catch {
        showError('forgot-error', 'Network error. Please check your connection and try again.');
        setLoading('forgot-submit-btn', false);
    }
}

/* ============================================================
   Reset Password — init from URL token
   ============================================================ */
function initResetPassword(token) {
    hideTabs();
    showPanel('panel-reset');
    const form = document.getElementById('form-reset');
    if (form && !form._bound) {
        form.addEventListener('submit', (e) => handleResetPassword(e, token));
        form._bound = true;
    }
}

/* ============================================================
   Reset Password — submit new password
   ============================================================ */
async function handleResetPassword(e, token) {
    e.preventDefault();
    clearError('reset-error');

    const password = document.getElementById('reset-password').value;
    const confirm  = document.getElementById('reset-confirm').value;

    if (password.length < 8) return showError('reset-error', 'Password must be at least 8 characters.');
    if (password !== confirm)  return showError('reset-error', 'Passwords do not match.');

    setLoading('reset-submit-btn', true);

    try {
        const res  = await fetch(`${API_BASE}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showError('reset-error', data.error || 'Reset failed. The link may have expired.');
            setLoading('reset-submit-btn', false);
            return;
        }

        showPanel('panel-reset-success');
        history.replaceState({}, '', window.location.pathname);
    } catch {
        showError('reset-error', 'Network error. Please check your connection and try again.');
        setLoading('reset-submit-btn', false);
    }
}

/* ============================================================
   Password Strength Checker
   ============================================================ */
function checkPasswordStrength(value) {
    const fill = document.getElementById('pw-strength-fill');
    const text = document.getElementById('pw-strength-text');
    if (!fill || !text) return;

    let score = 0;
    if (value.length >= 8)  score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const levels = [
        { pct: '0%',   color: 'transparent',  label: '' },
        { pct: '25%',  color: '#EF4444',       label: 'Weak' },
        { pct: '50%',  color: '#F97316',       label: 'Fair' },
        { pct: '75%',  color: '#EAB308',       label: 'Good' },
        { pct: '90%',  color: '#22C55E',       label: 'Strong' },
        { pct: '100%', color: '#16A34A',       label: 'Very strong' },
    ];
    const lvl = levels[Math.min(score, 5)];
    fill.style.width      = lvl.pct;
    fill.style.background = lvl.color;
    text.textContent      = lvl.label;
    text.style.color      = lvl.color;
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
   Sign In — Password Method
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
        window.location.href = 'http://43.130.98.104:8080/index.html';
    } catch {
        showError('signin-error', 'Network error. Please check your connection and try again.');
        setLoading('signin-submit-btn', false);
    }
}

/* ============================================================
   Sign In — OTP Method: Send Code
   ============================================================ */
async function sendOTP() {
    clearError('otp-send-error');

    const email = document.getElementById('otp-email').value.trim();
    if (!validateEmail(email)) {
        return showError('otp-send-error', 'Please enter a valid email address.');
    }

    const btn      = document.getElementById('otp-send-btn');
    const textEl   = document.getElementById('otp-send-text');
    btn.disabled   = true;
    textEl.textContent = 'Sending...';

    try {
        const res  = await fetch(`${API_BASE}/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (!res.ok) {
            showError('otp-send-error', data.error || 'Failed to send verification code. Please try again.');
            btn.disabled = false;
            textEl.textContent = 'Send Code';
            return;
        }

        // Show step 2 (code input)
        document.getElementById('otp-step-1').style.display = 'none';
        document.getElementById('otp-step-2').style.display = 'block';
        document.getElementById('otp-code').focus();

        // Start 10-minute countdown
        startOTPCountdown(600);

    } catch {
        showError('otp-send-error', 'Network error. Please check your connection and try again.');
        btn.disabled = false;
        textEl.textContent = 'Send Code';
    }
}

/* ============================================================
   Sign In — OTP Method: Verify Code
   ============================================================ */
async function handleOTPVerify(e) {
    e.preventDefault();
    clearError('otp-verify-error');

    const email = document.getElementById('otp-email').value.trim();
    const code  = document.getElementById('otp-code').value.trim();

    if (!code || code.length !== 6) {
        return showError('otp-verify-error', 'Please enter the 6-digit code from your email.');
    }

    setLoading('otp-verify-btn', true);

    try {
        const res  = await fetch(`${API_BASE}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });
        const data = await res.json();

        if (!res.ok) {
            showError('otp-verify-error', data.error || 'Invalid or expired code. Please try again.');
            setLoading('otp-verify-btn', false);
            return;
        }

        // Stop countdown
        if (otpCountdownTimer) clearInterval(otpCountdownTimer);

        // Successful OTP login — redirect to homepage
        window.location.href = 'http://43.130.98.104:8080/index.html';
    } catch {
        showError('otp-verify-error', 'Network error. Please check your connection and try again.');
        setLoading('otp-verify-btn', false);
    }
}

/* ============================================================
   OTP Countdown Timer
   ============================================================ */
function startOTPCountdown(seconds) {
    if (otpCountdownTimer) clearInterval(otpCountdownTimer);
    const el = document.getElementById('otp-countdown');
    let remaining = seconds;

    function update() {
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        el.textContent = `Code expires in ${m}:${s.toString().padStart(2, '0')}`;
        if (remaining <= 0) {
            clearInterval(otpCountdownTimer);
            el.textContent = 'Code expired. Please request a new one.';
            el.style.color = '#FCA5A5';
            // Reset back to step 1
            setTimeout(resetOTP, 2000);
        }
        remaining--;
    }

    update();
    otpCountdownTimer = setInterval(update, 1000);
}

/* ============================================================
   Reset OTP flow back to step 1
   ============================================================ */
function resetOTP() {
    if (otpCountdownTimer) clearInterval(otpCountdownTimer);
    document.getElementById('otp-step-1').style.display = 'block';
    document.getElementById('otp-step-2').style.display = 'none';
    document.getElementById('otp-code').value = '';
    document.getElementById('otp-countdown').textContent = '';
    document.getElementById('otp-countdown').style.color = '';
    const btn    = document.getElementById('otp-send-btn');
    const textEl = document.getElementById('otp-send-text');
    if (btn)    btn.disabled = false;
    if (textEl) textEl.textContent = 'Send Code';
    clearError('otp-send-error');
    clearError('otp-verify-error');
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
            body: JSON.stringify({ email: pendingEmail })
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
