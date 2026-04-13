/**
 * EPIC Hackathon Singapore — Auth Logic
 * auth.js
 *
 * Handles:
 *  - Tab switching (Sign In / Sign Up / Forgot / Verify)
 *  - Email/password sign-in & sign-up (simulated; swap with real API)
 *  - OAuth redirect: Google, GitHub, LinkedIn
 *  - Password visibility toggle
 *  - Password strength meter
 *  - Forgot password flow
 *  - Email verification panel
 */

/* ========================================
   Tab / Panel Switching
   ======================================== */

/**
 * Switch between auth panels.
 * @param {'signin'|'signup'|'forgot'|'verify'} panel
 */
function switchTab(panel) {
    // Update tab buttons (only signin / signup have tabs)
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.toggle('active', tab.id === `tab-${panel}`);
    });

    // Update panels
    document.querySelectorAll('.auth-panel').forEach(p => {
        p.classList.remove('active');
    });

    const target = document.getElementById(`panel-${panel}`);
    if (target) {
        target.classList.add('active');
    }

    // Clear errors when switching
    clearErrors();
}

function clearErrors() {
    document.querySelectorAll('.form-error, .form-success').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });
}

/* ========================================
   Password Visibility Toggle
   ======================================== */

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    // Swap icon
    btn.innerHTML = isPassword
        ? `<svg class="eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
               <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
               <line x1="1" y1="1" x2="23" y2="23"/>
           </svg>`
        : `<svg class="eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
               <circle cx="12" cy="12" r="3"/>
           </svg>`;
}

/* ========================================
   Password Strength Meter
   ======================================== */

function checkPasswordStrength(value) {
    const container = document.getElementById('password-strength');
    const label = document.getElementById('strength-label');

    if (!value) {
        container.classList.remove('visible', 'strength-weak', 'strength-fair', 'strength-good', 'strength-strong');
        return;
    }

    container.classList.add('visible');
    container.classList.remove('strength-weak', 'strength-fair', 'strength-good', 'strength-strong');

    let score = 0;
    if (value.length >= 8)  score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const levels = ['strength-weak', 'strength-fair', 'strength-good', 'strength-strong'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];

    const idx = Math.max(0, score - 1);
    container.classList.add(levels[idx]);
    label.textContent = labels[idx];
}

/* ========================================
   Button Loading State
   ======================================== */

function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    btn.disabled = loading;
    text.classList.toggle('hidden', loading);
    spinner.classList.toggle('hidden', !loading);
}

/* ========================================
   Show Error / Success
   ======================================== */

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
}

function showSuccess(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
}

/* ========================================
   Sign In
   ======================================== */

async function handleSignIn(event) {
    event.preventDefault();
    clearErrors();

    const email    = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;

    if (!email || !password) {
        showError('signin-error', 'Please fill in all fields.');
        return;
    }

    setLoading('signin-submit', true);

    try {
        // -------------------------------------------------------
        // TODO: Replace with your real authentication API call.
        // Example using fetch:
        //
        // const res = await fetch('/api/auth/signin', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, password })
        // });
        // const data = await res.json();
        // if (!res.ok) throw new Error(data.message || 'Sign in failed');
        // window.location.href = '/dashboard';
        //
        // -------------------------------------------------------

        // Simulated delay for demo
        await delay(1200);

        // Demo: accept any valid-looking credentials
        // In production, remove this block and use real API above.
        console.log('[Auth] Sign in:', email);
        window.location.href = 'index.html?signed_in=1';

    } catch (err) {
        showError('signin-error', err.message || 'Invalid email or password. Please try again.');
    } finally {
        setLoading('signin-submit', false);
    }
}

/* ========================================
   Sign Up
   ======================================== */

async function handleSignUp(event) {
    event.preventDefault();
    clearErrors();

    const firstName = document.getElementById('signup-firstname').value.trim();
    const lastName  = document.getElementById('signup-lastname').value.trim();
    const email     = document.getElementById('signup-email').value.trim();
    const password  = document.getElementById('signup-password').value;
    const role      = document.getElementById('signup-role').value;
    const terms     = document.getElementById('signup-terms').checked;

    if (!firstName || !lastName || !email || !password || !role) {
        showError('signup-error', 'Please fill in all required fields.');
        return;
    }

    if (password.length < 8) {
        showError('signup-error', 'Password must be at least 8 characters.');
        return;
    }

    if (!terms) {
        showError('signup-error', 'Please accept the Terms of Service to continue.');
        return;
    }

    setLoading('signup-submit', true);

    try {
        // -------------------------------------------------------
        // TODO: Replace with your real registration API call.
        // Example:
        //
        // const res = await fetch('/api/auth/signup', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ firstName, lastName, email, password, role })
        // });
        // const data = await res.json();
        // if (!res.ok) throw new Error(data.message || 'Registration failed');
        //
        // -------------------------------------------------------

        // Simulated delay for demo
        await delay(1400);

        // Show email verification panel
        document.getElementById('verify-email-addr').textContent = email;
        switchTab('verify');

    } catch (err) {
        showError('signup-error', err.message || 'Registration failed. Please try again.');
    } finally {
        setLoading('signup-submit', false);
    }
}

/* ========================================
   Forgot Password
   ======================================== */

function showForgotPassword(event) {
    event.preventDefault();
    // Pre-fill email if already entered
    const signinEmail = document.getElementById('signin-email').value;
    if (signinEmail) {
        document.getElementById('forgot-email').value = signinEmail;
    }
    switchTab('forgot');
}

async function handleForgotPassword(event) {
    event.preventDefault();
    clearErrors();

    const email = document.getElementById('forgot-email').value.trim();
    if (!email) {
        showError('forgot-error', 'Please enter your email address.');
        return;
    }

    setLoading('forgot-submit', true);

    try {
        // -------------------------------------------------------
        // TODO: Replace with your real password reset API call.
        // Example:
        //
        // const res = await fetch('/api/auth/forgot-password', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // });
        // const data = await res.json();
        // if (!res.ok) throw new Error(data.message);
        //
        // -------------------------------------------------------

        await delay(1000);
        showSuccess('forgot-success', `Reset link sent to ${email}. Check your inbox.`);
        document.getElementById('forgot-form').reset();

    } catch (err) {
        showError('forgot-error', err.message || 'Failed to send reset link. Please try again.');
    } finally {
        setLoading('forgot-submit', false);
    }
}

/* ========================================
   Resend Verification Email
   ======================================== */

async function resendVerification() {
    const emailEl = document.getElementById('verify-email-addr');
    const email = emailEl ? emailEl.textContent : '';

    // -------------------------------------------------------
    // TODO: Call your resend verification API
    // -------------------------------------------------------

    await delay(800);
    // Provide visual feedback
    const note = document.querySelector('.verify-note');
    if (note) {
        note.textContent = `Email resent to ${email}`;
        setTimeout(() => {
            note.textContent = "Didn't receive it? Check your spam folder or";
        }, 4000);
    }
}

/* ========================================
   OAuth Login
   ======================================== */

/**
 * Initiate OAuth flow for the given provider.
 * @param {'google'|'github'|'linkedin'} provider
 */
function oauthLogin(provider) {
    showOAuthLoading(provider);

    // -------------------------------------------------------
    // TODO: Replace with your actual OAuth URLs.
    //
    // For a real implementation you would redirect to your
    // backend OAuth endpoint, e.g.:
    //   window.location.href = `/api/auth/${provider}`;
    //
    // Or use a third-party auth provider SDK (Auth0, Supabase,
    // Firebase Auth, NextAuth, etc.).
    //
    // Example OAuth endpoints:
    //   Google:   https://accounts.google.com/o/oauth2/v2/auth?...
    //   GitHub:   https://github.com/login/oauth/authorize?...
    //   LinkedIn: https://www.linkedin.com/oauth/v2/authorization?...
    //
    // -------------------------------------------------------

    const oauthUrls = {
        google:   buildGoogleOAuthUrl(),
        github:   buildGitHubOAuthUrl(),
        linkedin: buildLinkedInOAuthUrl()
    };

    const url = oauthUrls[provider];

    if (url) {
        // Small delay to show loading animation before redirect
        setTimeout(() => {
            window.location.href = url;
        }, 600);
    } else {
        hideOAuthLoading();
        alert(`OAuth for ${provider} is not configured yet. Please set up your OAuth credentials.`);
    }
}

/* ---- OAuth URL Builders ---- */
/* Replace CLIENT_ID values with your actual OAuth app credentials */

function buildGoogleOAuthUrl() {
    const params = new URLSearchParams({
        client_id:     'YOUR_GOOGLE_CLIENT_ID',          // TODO: Replace
        redirect_uri:  `${window.location.origin}/auth/callback/google`,
        response_type: 'code',
        scope:         'openid email profile',
        state:         generateState(),
        access_type:   'offline',
        prompt:        'select_account'
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

function buildGitHubOAuthUrl() {
    const params = new URLSearchParams({
        client_id:    'YOUR_GITHUB_CLIENT_ID',           // TODO: Replace
        redirect_uri: `${window.location.origin}/auth/callback/github`,
        scope:        'user:email',
        state:        generateState()
    });
    return `https://github.com/login/oauth/authorize?${params}`;
}

function buildLinkedInOAuthUrl() {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id:     'YOUR_LINKEDIN_CLIENT_ID',        // TODO: Replace
        redirect_uri:  `${window.location.origin}/auth/callback/linkedin`,
        scope:         'r_liteprofile r_emailaddress',
        state:         generateState()
    });
    return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
}

/* ---- State parameter for CSRF protection ---- */
function generateState() {
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('oauth_state', state);
    return state;
}

/* ---- OAuth Loading Overlay ---- */
function showOAuthLoading(provider) {
    let overlay = document.getElementById('oauth-loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'oauth-loading-overlay';
        overlay.className = 'oauth-loading-overlay';
        overlay.innerHTML = `
            <div class="oauth-loading-spinner"></div>
            <p class="oauth-loading-text" id="oauth-loading-text">Connecting to ${capitalize(provider)}...</p>
        `;
        document.body.appendChild(overlay);
    } else {
        document.getElementById('oauth-loading-text').textContent = `Connecting to ${capitalize(provider)}...`;
    }
    requestAnimationFrame(() => overlay.classList.add('visible'));
}

function hideOAuthLoading() {
    const overlay = document.getElementById('oauth-loading-overlay');
    if (overlay) overlay.classList.remove('visible');
}

/* ========================================
   Utility Helpers
   ======================================== */

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ========================================
   Init — check URL params on load
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    // If redirected from OAuth callback with error
    if (params.get('error')) {
        switchTab('signin');
        showError('signin-error', decodeURIComponent(params.get('error_description') || 'Authentication failed.'));
    }

    // If redirected to sign up
    if (params.get('tab') === 'signup') {
        switchTab('signup');
    }
});
