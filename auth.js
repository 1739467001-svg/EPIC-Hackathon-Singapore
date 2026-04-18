/**
 * EPIC Hackathon Singapore — Auth Logic
 * auth.js  (v4 — dual sign-in: password + OTP)
 */

const API_BASE = `${window.location.protocol}//${window.location.hostname}:3002/api`;

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
    // Shake nearby input fields
    const container = el.closest('form') || el.parentElement;
    if (container) {
        container.querySelectorAll('.auth-field').forEach(f => {
            f.classList.remove('field-error');
            void f.offsetWidth;
            f.classList.add('field-error');
            setTimeout(() => f.classList.remove('field-error'), 500);
        });
    }
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
    btn.classList.toggle('btn-state-loading', loading);
    if (loading) {
        // Add spinner before loading text
        if (loadingEl && !loadingEl.querySelector('.btn-spinner')) {
            const spinner = document.createElement('span');
            spinner.className = 'btn-spinner';
            loadingEl.prepend(spinner);
        }
    } else {
        btn.classList.remove('btn-state-success');
        const spinner = btn.querySelector('.btn-spinner');
        if (spinner) spinner.remove();
    }
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

        // Successful login — save user info and redirect with smooth transition
        localStorage.setItem('epic_user', JSON.stringify(data.user));
        // Show success state on button
        const btn = document.getElementById('signin-submit-btn');
        if (btn) {
            btn.classList.add('btn-state-success');
            btn.querySelector('.btn-text').textContent = '✓ Welcome back!';
            btn.querySelector('.btn-loading').classList.add('hidden');
        }
        setTimeout(() => smoothRedirect('/index.html'), 600);
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

        // Successful OTP login — save user info and redirect with smooth transition
        localStorage.setItem('epic_user', JSON.stringify(data.user));
        const btn = document.getElementById('otp-verify-btn');
        if (btn) {
            btn.classList.add('btn-state-success');
            btn.querySelector('.btn-text').textContent = '✓ Verified!';
            btn.querySelector('.btn-loading').classList.add('hidden');
        }
        setTimeout(() => smoothRedirect('/index.html'), 600);
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

    if (!pendingEmail) {
        msgEl.textContent = 'Session expired. Please go back and register again.';
        msgEl.style.background = 'rgba(248,113,113,0.08)';
        msgEl.style.borderColor = 'rgba(248,113,113,0.22)';
        msgEl.style.color = '#fca5a5';
        msgEl.classList.remove('hidden');
        return;
    }

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
    }, 60000);
}

/* ============================================================
   Toast Notification — Premium
   ============================================================ */
function showToast(msg, type = 'error') {
    // Remove existing toasts
    document.querySelectorAll('.epic-toast').forEach(t => t.remove());

    const icons = {
        error: `<svg class="epic-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        info:  `<svg class="epic-toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
    };
    const toast = document.createElement('div');
    toast.className = `epic-toast epic-toast-${type === 'info' ? 'info' : 'error'}`;
    toast.innerHTML = (icons[type] || icons.error) + `<span>${msg}</span>`;
    toast.onclick = () => dismissToast(toast);
    document.body.appendChild(toast);

    const timer = setTimeout(() => dismissToast(toast), 5000);
    toast._timer = timer;
}

function dismissToast(toast) {
    if (!toast || !toast.parentNode) return;
    clearTimeout(toast._timer);
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
}

/* ============================================================
   Page Transition — Smooth redirect with overlay
   ============================================================ */
function smoothRedirect(url, delay = 400) {
    const overlay = document.getElementById('pageExitOverlay');
    if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = url; }, delay);
    } else {
        window.location.href = url;
    }
}
