/**
 * EPIC Hackathon Singapore — Auth Logic (Supabase)
 * auth.js
 */

/* ========================================
   Supabase 初始化
   ======================================== */
const SUPABASE_URL  = 'https://ahwafopsbwgevogeezqu.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFod2Fmb3BzYndnZXZvZ2VlenF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTQ5MTYsImV4cCI6MjA5MTY3MDkxNn0.wK7fZDyFaA39et0szUmMfvKVXgXTsrMxxt2Yo-ctFp0';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

/* ========================================
   页面加载：检测 OAuth 回调 & 已登录状态
   ======================================== */
document.addEventListener('DOMContentLoaded', async () => {
    // 处理 URL hash 中的 OAuth 回调 token（Supabase 自动写入）
    const { data: { session }, error } = await supabase.auth.getSession();

    if (session) {
        // 已登录，跳回主页
        window.location.href = 'index.html';
        return;
    }

    // URL 参数处理
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'signup') switchTab('signup');

    // 处理 OAuth 错误回调
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    if (hashParams.get('error')) {
        switchTab('signin');
        showError('signin-error', hashParams.get('error_description') || 'Authentication failed.');
    }
});

/* ========================================
   Tab / Panel 切换
   ======================================== */
function switchTab(panel) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.toggle('active', tab.id === `tab-${panel}`);
    });
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`panel-${panel}`);
    if (target) target.classList.add('active');
    clearErrors();
}

function clearErrors() {
    document.querySelectorAll('.form-error, .form-success').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });
}

/* ========================================
   工具函数
   ======================================== */
function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = loading;
    btn.querySelector('.btn-text').classList.toggle('hidden', loading);
    btn.querySelector('.btn-spinner').classList.toggle('hidden', !loading);
}

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

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
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
    if (value.length >= 8)         score++;
    if (/[A-Z]/.test(value))       score++;
    if (/[0-9]/.test(value))       score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    const levels = ['strength-weak', 'strength-fair', 'strength-good', 'strength-strong'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const idx = Math.max(0, score - 1);
    container.classList.add(levels[idx]);
    label.textContent = labels[idx];
}

/* ========================================
   邮箱登录（Sign In）
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

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading('signin-submit', false);

    if (error) {
        // 友好化错误提示
        const msg = error.message.includes('Invalid login')
            ? 'Incorrect email or password. Please try again.'
            : error.message;
        showError('signin-error', msg);
        return;
    }

    // 登录成功 → 跳回主页
    window.location.href = 'index.html';
}

/* ========================================
   邮箱注册（Sign Up）
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

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // 将姓名、角色存入用户元数据
            data: {
                full_name:  `${firstName} ${lastName}`,
                first_name: firstName,
                last_name:  lastName,
                role:       role
            },
            // 邮箱验证后跳转地址
            emailRedirectTo: `${window.location.origin}/index.html`
        }
    });

    setLoading('signup-submit', false);

    if (error) {
        const msg = error.message.includes('already registered')
            ? 'This email is already registered. Please sign in instead.'
            : error.message;
        showError('signup-error', msg);
        return;
    }

    // 注册成功 → 显示邮箱验证提示面板
    document.getElementById('verify-email-addr').textContent = email;
    switchTab('verify');
}

/* ========================================
   忘记密码
   ======================================== */
function showForgotPassword(event) {
    event.preventDefault();
    const signinEmail = document.getElementById('signin-email').value;
    if (signinEmail) document.getElementById('forgot-email').value = signinEmail;
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

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth.html?tab=reset`
    });

    setLoading('forgot-submit', false);

    if (error) {
        showError('forgot-error', error.message);
        return;
    }

    showSuccess('forgot-success', `Reset link sent to ${email}. Please check your inbox.`);
    document.getElementById('forgot-form').reset();
}

/* ========================================
   重新发送验证邮件
   ======================================== */
async function resendVerification() {
    const email = document.getElementById('verify-email-addr').textContent;
    if (!email) return;

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/index.html` }
    });

    const note = document.querySelector('.verify-note');
    if (note) {
        note.textContent = error
            ? `Failed to resend: ${error.message}`
            : `Email resent to ${email} ✓`;
        setTimeout(() => {
            note.textContent = "Didn't receive it? Check your spam folder or";
        }, 4000);
    }
}

/* ========================================
   OAuth 登录（Google / GitHub / LinkedIn）
   ======================================== */
async function oauthLogin(provider) {
    showOAuthLoading(provider);

    // Supabase provider 名称映射
    const providerMap = {
        google:   'google',
        github:   'github',
        linkedin: 'linkedin_oidc'
    };

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: providerMap[provider],
        options: {
            redirectTo: `${window.location.origin}/index.html`,
            queryParams: provider === 'google' ? { access_type: 'offline', prompt: 'select_account' } : {}
        }
    });

    if (error) {
        hideOAuthLoading();
        showError('signin-error', error.message);
    }
    // 成功时 Supabase 自动跳转到 OAuth 授权页，无需额外处理
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

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
