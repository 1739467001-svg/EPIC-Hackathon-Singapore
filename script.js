/**
 * EPIC Hackathon Singapore
 * 1:1 Replica of epicconnector.ai
 */

// Translations
const i18n = {
    en: {
        nav: {
            home: 'Home',
            about: 'About',
            schedule: 'Schedule',
            prizes: 'Prizes',
            team: 'Team Up',
            sponsors: 'Sponsors',
            register: 'Register Now'
        },
        hero: {
            badge: 'Registration Open',
            title: 'Build Your AI Product',
            subtitle: 'in 48 Hours',
            description: 'Join 200+ global founders, developers, and designers. Get mentorship from top VCs, access to $50K+ in AI credits, and compete for $100K in prizes.',
            prize: 'Prize Pool',
            founders: 'Founders',
            duration: 'To Launch',
            ctaPrimary: 'Register for Hackathon',
            ctaSecondary: 'Find Teammates',
            location: 'Singapore',
            date: 'June 15-17, 2026'
        },
        resources: {
            eyebrow: 'What You Get',
            title: 'Everything to Build & Launch',
            description: 'We provide the resources. You bring the vision.',
            ai: {
                title: 'AI Infrastructure',
                desc: '$50K+ in API credits from OpenAI, Anthropic, Gemini, and more.'
            },
            cloud: {
                title: 'Cloud Credits',
                desc: 'AWS, Google Cloud, and Azure credits to scale your infrastructure.'
            },
            mentor: {
                title: 'Expert Mentors',
                desc: '1:1 guidance from partners at a16z, Sequoia, and successful founders.'
            },
            growth: {
                title: 'Growth Support',
                desc: 'Go-to-market strategy, investor intros, and launch support.'
            }
        },
        team: {
            eyebrow: 'Team Up',
            title: 'Find Your Perfect Team',
            description: 'Solo? No problem. We\'ll match you with complementary skills.',
            tabs: {
                find: 'Find Teammates',
                create: 'Create Team',
                browse: 'Browse Teams'
            },
            filters: {
                role: 'Role',
                experience: 'Experience',
                location: 'Location',
                allRoles: 'All Roles',
                anyLevel: 'Any Level',
                anyLocation: 'Any Location'
            },
            roles: {
                developer: 'Developer',
                designer: 'Designer',
                pm: 'Product Manager',
                business: 'Business/Marketing'
            },
            form: {
                teamName: 'Team Name',
                lookingFor: 'Looking For',
                teamSize: 'Team Size',
                idea: 'Idea/Focus Area',
                placeholder: 'Describe your idea or what you want to build...',
                create: 'Create Team'
            }
        },
        schedule: {
            eyebrow: 'Schedule',
            title: '48 Hours to Launch',
            description: 'Three days of intense building, learning, and connecting.',
            day1: {
                day: 'Day 01',
                date: 'June 15, 2026',
                title: 'Kickoff & Team Formation',
                items: [
                    'Opening keynote from successful founders',
                    'Team matching session',
                    'Workshop: From Idea to MVP',
                    'Networking dinner'
                ]
            },
            day2: {
                day: 'Day 02',
                date: 'June 16, 2026',
                title: 'Build Day',
                items: [
                    '24-hour hacking begins',
                    'Mentor office hours (all day)',
                    'Technical workshops',
                    'Midnight snack & energy boost'
                ]
            },
            day3: {
                day: 'Day 03',
                date: 'June 17, 2026',
                title: 'Demo Day & Awards',
                items: [
                    'Final presentations',
                    'Judging by top VCs',
                    'Awards ceremony',
                    'After-party with investors'
                ]
            }
        },
        prizes: {
            eyebrow: 'Prizes',
            title: '$100,000 in Prizes',
            description: 'Plus investment opportunities and accelerator fast-tracks.',
            grand: 'Grand Prize',
            second: '2nd Place',
            third: '3rd Place',
            aiAgent: 'Best AI Agent',
            design: 'Best Design',
            community: 'Community Choice',
            includes: [
                'Direct investment offer',
                'YC interview fast-track',
                'AWS $25K credits',
                'Investor introductions',
                'Google Cloud credits',
                'Mentorship package',
                'OpenAI credits',
                'Anthropic partnership',
                'Figma premium year',
                'Vercel credits'
            ]
        },
        cta: {
            title: 'Ready to Build?',
            description: 'Join 200+ founders, developers, and designers. Limited spots available.',
            current: 'Free',
            original: '$299',
            note: 'Early bird ends May 1',
            button: 'Register Now — It\'s Free',
            guarantee: 'Full refund if you can\'t make it'
        },
        footer: {
            tagline: 'AI Product Incubation & Global Growth',
            hackathon: 'Hackathon',
            resources: 'Resources',
            company: 'Company',
            links: {
                about: 'About',
                schedule: 'Schedule',
                prizes: 'Prizes',
                team: 'Team Up',
                aiTools: 'AI Tools',
                cloud: 'Cloud Credits',
                mentors: 'Mentors',
                faq: 'FAQ',
                aboutEpic: 'About EPIC',
                partners: 'Partners',
                sponsor: 'Sponsor',
                contact: 'Contact'
            },
            copyright: '2026 EPIC Connector. All rights reserved. Made with ❤️ in Singapore.'
        }
    },
    zh: {
        nav: {
            home: '首页',
            about: '关于',
            schedule: '赛程',
            prizes: '奖项',
            team: '组队',
            sponsors: '赞助商',
            register: '立即报名'
        },
        hero: {
            badge: '报名开启',
            title: '打造你的AI产品',
            subtitle: '48小时极限开发',
            description: '加入200+全球创始人、开发者和设计师。获得顶级风投导师指导，$50K+ AI额度，争夺$100K奖金。',
            prize: '奖池',
            founders: '创始人',
            duration: '开发时间',
            ctaPrimary: '报名参加黑客松',
            ctaSecondary: '寻找队友',
            location: '新加坡',
            date: '2026年6月15-17日'
        },
        resources: {
            eyebrow: '你将获得',
            title: '从开发到发布的全方位支持',
            description: '我们提供资源，你带来创意。',
            ai: {
                title: 'AI基础设施',
                desc: 'OpenAI、Anthropic、Gemini等$50K+ API额度支持。'
            },
            cloud: {
                title: '云服务额度',
                desc: 'AWS、Google Cloud、Azure免费额度支持。'
            },
            mentor: {
                title: '专家导师',
                desc: 'a16z、红杉合伙人及成功创始人1对1指导。'
            },
            growth: {
                title: '增长支持',
                desc: '市场进入策略、投资人对接、发布支持。'
            }
        },
        team: {
            eyebrow: '组队',
            title: '找到你的完美团队',
            description: '一个人？没问题。我们会为你匹配互补技能的队友。',
            tabs: {
                find: '寻找队友',
                create: '创建团队',
                browse: '浏览团队'
            },
            filters: {
                role: '角色',
                experience: '经验',
                location: '地点',
                allRoles: '所有角色',
                anyLevel: '任何级别',
                anyLocation: '任何地点'
            },
            roles: {
                developer: '开发者',
                designer: '设计师',
                pm: '产品经理',
                business: '商业/市场'
            },
            form: {
                teamName: '团队名称',
                lookingFor: '寻找',
                teamSize: '团队规模',
                idea: '想法/专注领域',
                placeholder: '描述你的想法或你想构建的内容...',
                create: '创建团队'
            }
        },
        schedule: {
            eyebrow: '赛程',
            title: '48小时发布产品',
            description: '三天密集开发、学习和连接。',
            day1: {
                day: '第一天',
                date: '2026年6月15日',
                title: '开幕 & 团队组建',
                items: [
                    '成功创始人主题演讲',
                    '团队匹配环节',
                    '工作坊：从想法到MVP',
                    '交流晚宴'
                ]
            },
            day2: {
                day: '第二天',
                date: '2026年6月16日',
                title: '开发日',
                items: [
                    '24小时黑客马拉松开始',
                    '导师办公时间（全天）',
                    '技术工作坊',
                    '午夜能量补给'
                ]
            },
            day3: {
                day: '第三天',
                date: '2026年6月17日',
                title: 'Demo Day & 颁奖典礼',
                items: [
                    '最终展示',
                    '顶级VC评审',
                    '颁奖典礼',
                    '投资人派对'
                ]
            }
        },
        prizes: {
            eyebrow: '奖项',
            title: '$100,000奖金池',
            description: '外加投资机会和加速器快速通道。',
            grand: '大奖',
            second: '第二名',
            third: '第三名',
            aiAgent: '最佳AI Agent',
            design: '最佳设计',
            community: '社区选择奖',
            includes: [
                '直接投资意向',
                'YC面试快速通道',
                'AWS $25K额度',
                '投资人对接',
                'Google Cloud额度',
                '导师包',
                'OpenAI额度',
                'Anthropic合作',
                'Figma高级版一年',
                'Vercel额度'
            ]
        },
        cta: {
            title: '准备好开始了吗？',
            description: '加入200+创始人、开发者和设计师。名额有限。',
            current: '免费',
            original: '$299',
            note: '早鸟价5月1日截止',
            button: '立即报名 — 免费',
            guarantee: '无法参加可全额退款'
        },
        footer: {
            tagline: 'AI产品孵化与全球增长',
            hackathon: '黑客松',
            resources: '资源',
            company: '公司',
            links: {
                about: '关于',
                schedule: '赛程',
                prizes: '奖项',
                team: '组队',
                aiTools: 'AI工具',
                cloud: '云额度',
                mentors: '导师',
                faq: '常见问题',
                aboutEpic: '关于EPIC',
                partners: '合作伙伴',
                sponsor: '成为赞助商',
                contact: '联系我们'
            },
            copyright: '2026 EPIC Connector. 版权所有。❤️ 新加坡制作'
        }
    }
};

// State
let currentLang = localStorage.getItem('epic_lang') || 'zh';

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLanguageSwitch();
    initTabs();
    initScrollReveal();
    initSmoothScroll();
    initMagicRingsBackground();
    // Apply saved language on load
    updateLanguage();
    updateLangUI();
});

function initMagicRingsBackground() {
    const mount = document.getElementById('magic-rings-container');
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const config = {
        color: '#A855F7',
        colorTwo: '#6366F1',
        ringCount: 6,
        speed: 1,
        attenuation: 10,
        lineThickness: 2,
        baseRadius: 0.35,
        radiusStep: 0.1,
        scaleRate: 0.1,
        opacity: 1,
        blur: 0,
        noiseAmount: 0.1,
        rotation: 0,
        ringGap: 1.5,
        fadeIn: 0.7,
        fadeOut: 0.5,
        followMouse: false,
        mouseInfluence: 0.2,
        hoverScale: 1.2,
        parallax: 0.05,
        clickBurst: false
    };

    const vertexShaderSource = `#version 300 es
    precision highp float;
    in vec2 aPosition;
    void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }`;

    const fragmentShaderSource = `#version 300 es
    precision highp float;

    uniform float uTime;
    uniform float uAttenuation;
    uniform float uLineThickness;
    uniform float uBaseRadius;
    uniform float uRadiusStep;
    uniform float uScaleRate;
    uniform float uOpacity;
    uniform float uNoiseAmount;
    uniform float uRotation;
    uniform float uRingGap;
    uniform float uFadeIn;
    uniform float uFadeOut;
    uniform float uMouseInfluence;
    uniform float uHoverAmount;
    uniform float uHoverScale;
    uniform float uParallax;
    uniform float uBurst;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec3 uColor;
    uniform vec3 uColorTwo;
    uniform int uRingCount;

    out vec4 outColor;

    const float HP = 1.5707963;
    const float CYCLE = 3.45;

    float fadeValue(float t) {
        return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
    }

    float ring(vec2 p, float ri, float cut, float t0, float px) {
        float t = mod(uTime + t0, CYCLE);
        float r = ri + t / CYCLE * uScaleRate;
        float d = abs(length(p) - r);
        float a = atan(abs(p.y), abs(p.x)) / HP;
        float th = max(1.0 - a, 0.5) * px * uLineThickness;
        float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
        d += pow(cut * a, 3.0) * r;
        return h * exp(-uAttenuation * d) * fadeValue(t);
    }

    void main() {
        float px = 1.0 / min(uResolution.x, uResolution.y);
        vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
        float cr = cos(uRotation), sr = sin(uRotation);
        p = mat2(cr, -sr, sr, cr) * p;
        p -= uMouse * uMouseInfluence;
        float sc = mix(1.0, uHoverScale, uHoverAmount) + uBurst * 0.3;
        p /= sc;
        vec3 c = vec3(0.0);
        float rcf = max(float(uRingCount) - 1.0, 1.0);
        for (int i = 0; i < 10; i++) {
            if (i >= uRingCount) break;
            float fi = float(i);
            vec2 pr = p - fi * uParallax * uMouse;
            vec3 rc = mix(uColor, uColorTwo, fi / rcf);
            c = mix(c, rc, vec3(ring(pr, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), i == 0 ? 0.0 : 2.95 * fi, px)));
        }
        c *= 1.0 + uBurst * 2.0;
        float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
        c += (n - 0.5) * uNoiseAmount;
        outColor = vec4(c, max(c.r, max(c.g, c.b)) * uOpacity);
    }`;

    const canvas = document.createElement('canvas');
    canvas.id = 'magic-rings-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    mount.innerHTML = '';
    mount.appendChild(canvas);

    if (config.blur > 0) {
        mount.style.filter = `blur(${config.blur}px)`;
    }

    const gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: true,
        depth: false,
        stencil: false,
        premultipliedAlpha: true
    });
    if (!gl) return;

    const compileShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('MagicRings shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) {
        return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('MagicRings program link error:', gl.getProgramInfoLog(program));
        return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]),
        gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const uniforms = {
        uTime: gl.getUniformLocation(program, 'uTime'),
        uAttenuation: gl.getUniformLocation(program, 'uAttenuation'),
        uLineThickness: gl.getUniformLocation(program, 'uLineThickness'),
        uBaseRadius: gl.getUniformLocation(program, 'uBaseRadius'),
        uRadiusStep: gl.getUniformLocation(program, 'uRadiusStep'),
        uScaleRate: gl.getUniformLocation(program, 'uScaleRate'),
        uOpacity: gl.getUniformLocation(program, 'uOpacity'),
        uNoiseAmount: gl.getUniformLocation(program, 'uNoiseAmount'),
        uRotation: gl.getUniformLocation(program, 'uRotation'),
        uRingGap: gl.getUniformLocation(program, 'uRingGap'),
        uFadeIn: gl.getUniformLocation(program, 'uFadeIn'),
        uFadeOut: gl.getUniformLocation(program, 'uFadeOut'),
        uMouseInfluence: gl.getUniformLocation(program, 'uMouseInfluence'),
        uHoverAmount: gl.getUniformLocation(program, 'uHoverAmount'),
        uHoverScale: gl.getUniformLocation(program, 'uHoverScale'),
        uParallax: gl.getUniformLocation(program, 'uParallax'),
        uBurst: gl.getUniformLocation(program, 'uBurst'),
        uResolution: gl.getUniformLocation(program, 'uResolution'),
        uMouse: gl.getUniformLocation(program, 'uMouse'),
        uColor: gl.getUniformLocation(program, 'uColor'),
        uColorTwo: gl.getUniformLocation(program, 'uColorTwo'),
        uRingCount: gl.getUniformLocation(program, 'uRingCount')
    };

    const hexToRgb = (hex) => {
        const normalized = hex.replace('#', '');
        const full = normalized.length === 3
            ? normalized.split('').map((char) => char + char).join('')
            : normalized;
        const value = Number.parseInt(full, 16);
        return [
            ((value >> 16) & 255) / 255,
            ((value >> 8) & 255) / 255,
            (value & 255) / 255
        ];
    };

    const mouse = [0, 0];
    const smoothMouse = [0, 0];
    let hoverAmount = 0;
    let isHovered = false;
    let burst = 0;
    let frameId = null;

    const resize = () => {
        const width = Math.max(1, Math.floor(mount.clientWidth));
        const height = Math.max(1, Math.floor(mount.clientHeight));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const updatePointer = (event) => {
        const rect = mount.getBoundingClientRect();
        mouse[0] = (event.clientX - rect.left) / rect.width - 0.5;
        mouse[1] = -((event.clientY - rect.top) / rect.height - 0.5);
    };

    const resetPointer = () => {
        mouse[0] = 0;
        mouse[1] = 0;
    };

    const render = (time) => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        smoothMouse[0] += (mouse[0] - smoothMouse[0]) * 0.08;
        smoothMouse[1] += (mouse[1] - smoothMouse[1]) * 0.08;
        hoverAmount += ((isHovered ? 1 : 0) - hoverAmount) * 0.08;
        burst *= 0.95;
        if (burst < 0.001) burst = 0;

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        const primary = hexToRgb(config.color);
        const secondary = hexToRgb(config.colorTwo);

        gl.uniform1f(uniforms.uTime, (time || 0) * 0.001 * config.speed);
        gl.uniform1f(uniforms.uAttenuation, config.attenuation);
        gl.uniform1f(uniforms.uLineThickness, config.lineThickness);
        gl.uniform1f(uniforms.uBaseRadius, config.baseRadius);
        gl.uniform1f(uniforms.uRadiusStep, config.radiusStep);
        gl.uniform1f(uniforms.uScaleRate, config.scaleRate);
        gl.uniform1f(uniforms.uOpacity, config.opacity);
        gl.uniform1f(uniforms.uNoiseAmount, config.noiseAmount);
        gl.uniform1f(uniforms.uRotation, (config.rotation * Math.PI) / 180);
        gl.uniform1f(uniforms.uRingGap, config.ringGap);
        gl.uniform1f(uniforms.uFadeIn, config.fadeIn);
        gl.uniform1f(uniforms.uFadeOut, config.fadeOut);
        gl.uniform1f(uniforms.uMouseInfluence, config.followMouse ? config.mouseInfluence : 0);
        gl.uniform1f(uniforms.uHoverAmount, hoverAmount);
        gl.uniform1f(uniforms.uHoverScale, config.hoverScale);
        gl.uniform1f(uniforms.uParallax, config.parallax);
        gl.uniform1f(uniforms.uBurst, config.clickBurst ? burst : 0);
        gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
        gl.uniform2f(uniforms.uMouse, smoothMouse[0], smoothMouse[1]);
        gl.uniform3f(uniforms.uColor, primary[0], primary[1], primary[2]);
        gl.uniform3f(uniforms.uColorTwo, secondary[0], secondary[1], secondary[2]);
        gl.uniform1i(uniforms.uRingCount, config.ringCount);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const animate = (time) => {
        render(time);
        frameId = requestAnimationFrame(animate);
    };

    const onResize = () => {
        resize();
        if (prefersReducedMotion.matches) {
            render(0);
        }
    };

    resize();
    if (prefersReducedMotion.matches) {
        render(0);
    } else {
        frameId = requestAnimationFrame(animate);
    }

    mount.addEventListener('mousemove', updatePointer);
    mount.addEventListener('mouseenter', () => { isHovered = true; });
    mount.addEventListener('mouseleave', () => {
        isHovered = false;
        resetPointer();
    });
    mount.addEventListener('click', () => {
        if (config.clickBurst) burst = 1;
    });

    window.addEventListener('resize', onResize);
    if (prefersReducedMotion.addEventListener) {
        prefersReducedMotion.addEventListener('change', onResize);
    }
}

/**
 * Navigation scroll effect
 */
function initNavigation() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Language switch functionality — slider toggle
 */
function initLanguageSwitch() {
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    // Single click = toggle EN ↔ ZH with slider animation
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        updateLanguage();
        updateLangUI();
        if (langDropdown) langDropdown.classList.remove('show');
    });

    // Keep dropdown options in sync (for any legacy dropdown)
    document.addEventListener('click', () => {
        if (langDropdown) langDropdown.classList.remove('show');
    });

    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentLang = option.dataset.lang;
            updateLanguage();
            updateLangUI();
            if (langDropdown) langDropdown.classList.remove('show');
        });
    });
}

function updateLanguage() {
    const t = i18n[currentLang];
    localStorage.setItem('epic_lang', currentLang);

    // ── Nav links ──
    document.querySelectorAll('.nav-link').forEach((el, i) => {
        const keys = ['about', 'schedule', 'prizes', 'team', 'sponsors'];
        if (keys[i]) el.textContent = t.nav[keys[i]];
    });
    // Register button (guest) — safe selector
    const regBtn = document.getElementById('nav-register-btn');
    if (regBtn) regBtn.textContent = t.nav.register;
    // User dropdown items
    const ddItems = document.querySelectorAll('.user-dropdown-item');
    if (ddItems[0]) ddItems[0].childNodes[ddItems[0].childNodes.length-1].textContent = (currentLang==='zh'?' 我的主页':' My Profile');
    if (ddItems[1]) ddItems[1].childNodes[ddItems[1].childNodes.length-1].textContent = (currentLang==='zh'?' 修改密码':' Change Password');
    if (ddItems[2]) ddItems[2].childNodes[ddItems[2].childNodes.length-1].textContent = (currentLang==='zh'?' 退出登录':' Sign Out');

    // ── Hero ──
    document.querySelector('.hero-badge').innerHTML = `<span class="badge-pulse"></span>${t.hero.badge}`;
    document.querySelector('.hero-title').innerHTML = `${t.hero.title}<br><span class="title-highlight">${t.hero.subtitle}</span>`;
    document.querySelector('.hero-description').textContent = t.hero.description;
    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels[0]) statLabels[0].textContent = t.hero.prize;
    if (statLabels[1]) statLabels[1].textContent = t.hero.founders;
    if (statLabels[2]) statLabels[2].textContent = t.hero.duration;
    const ctaBtns = document.querySelectorAll('.hero-cta .btn');
    if (ctaBtns[0]) ctaBtns[0].textContent = t.hero.ctaPrimary;
    if (ctaBtns[1]) ctaBtns[1].textContent = t.hero.ctaSecondary;
    const infoItems = document.querySelectorAll('.info-item span');
    if (infoItems[0]) infoItems[0].textContent = t.hero.location;
    if (infoItems[1]) infoItems[1].textContent = t.hero.date;

    // ── Resources section ──
    const rSec = document.getElementById('resources');
    if (rSec) {
        const ey = rSec.querySelector('.section-eyebrow'); if(ey) ey.textContent = t.resources.eyebrow;
        const ti = rSec.querySelector('.section-title');   if(ti) ti.textContent = t.resources.title;
        const de = rSec.querySelector('.section-description'); if(de) de.textContent = t.resources.description;
        const cards = rSec.querySelectorAll('.resource-card');
        const rKeys = ['ai','cloud','mentor','growth'];
        cards.forEach((card, i) => {
            if (!rKeys[i]) return;
            const h3 = card.querySelector('.resource-title'); if(h3) h3.textContent = t.resources[rKeys[i]].title;
            const p  = card.querySelector('.resource-desc');  if(p)  p.textContent  = t.resources[rKeys[i]].desc;
        });
    }

    // ── Team section ──
    const tSec = document.getElementById('team');
    if (tSec) {
        const ey = tSec.querySelector('.section-eyebrow'); if(ey) ey.textContent = t.team.eyebrow;
        const ti = tSec.querySelector('.section-title');   if(ti) ti.textContent = t.team.title;
        const de = tSec.querySelector('.section-description'); if(de) de.textContent = t.team.description;
        // Tab buttons
        const tabBtns = tSec.querySelectorAll('.tab-btn');
        const tabKeys = ['find','create','browse'];
        tabBtns.forEach((btn,i) => { if(tabKeys[i]) btn.textContent = t.team.tabs[tabKeys[i]]; });
        // Filter labels
        const filterLabels = tSec.querySelectorAll('.filter-group label');
        const fKeys = ['role','experience','location'];
        filterLabels.forEach((lbl,i) => { if(fKeys[i]) lbl.textContent = t.team.filters[fKeys[i]]; });
        // Create team form
        const formLabels = tSec.querySelectorAll('.create-team-form .form-group label');
        const formKeys = ['teamName','lookingFor','teamSize','idea'];
        formLabels.forEach((lbl,i) => { if(formKeys[i]) lbl.textContent = t.team.form[formKeys[i]]; });
        const textarea = tSec.querySelector('.form-textarea');
        if (textarea) textarea.placeholder = t.team.form.placeholder;
        const createBtn = tSec.querySelector('.create-team-form .btn-large');
        if (createBtn) createBtn.textContent = t.team.form.create;
    }

    // ── Schedule section ──
    const sSec = document.getElementById('schedule');
    if (sSec) {
        const ey = sSec.querySelector('.section-eyebrow'); if(ey) ey.textContent = t.schedule.eyebrow;
        const ti = sSec.querySelector('.section-title');   if(ti) ti.textContent = t.schedule.title;
        const de = sSec.querySelector('.section-description'); if(de) de.textContent = t.schedule.description;
        const items = sSec.querySelectorAll('.timeline-item');
        const dKeys = ['day1','day2','day3'];
        items.forEach((item, i) => {
            if (!dKeys[i]) return;
            const d = t.schedule[dKeys[i]];
            const dayEl   = item.querySelector('.timeline-day');  if(dayEl)  dayEl.textContent  = d.day;
            const dateEl  = item.querySelector('.timeline-date'); if(dateEl) dateEl.textContent = d.date;
            const titleEl = item.querySelector('h3');             if(titleEl) titleEl.textContent = d.title;
            const lis = item.querySelectorAll('.timeline-list li');
            lis.forEach((li, j) => { if(d.items[j]) li.textContent = d.items[j]; });
        });
    }

    // ── Prizes section ──
    const pSec = document.getElementById('prizes');
    if (pSec) {
        const ey = pSec.querySelector('.section-eyebrow'); if(ey) ey.textContent = t.prizes.eyebrow;
        const ti = pSec.querySelector('.section-title');   if(ti) ti.textContent = t.prizes.title;
        const de = pSec.querySelector('.section-description'); if(de) de.textContent = t.prizes.description;
        const ranks = pSec.querySelectorAll('.prize-rank');
        const rankKeys = ['grand','second','third','aiAgent','design','community'];
        ranks.forEach((r,i) => { if(rankKeys[i]) r.textContent = t.prizes[rankKeys[i]]; });
        const prizeItems = pSec.querySelectorAll('.prize-includes li');
        prizeItems.forEach((li, i) => { if(t.prizes.includes[i]) li.textContent = t.prizes.includes[i]; });
    }

    // ── CTA section ──
    const ctaSec = document.querySelector('.cta-section') || document.querySelector('section.section:last-of-type');
    if (ctaSec) {
        const ctaTitle = ctaSec.querySelector('.cta-title'); if(ctaTitle) ctaTitle.textContent = t.cta.title;
        const ctaDesc  = ctaSec.querySelector('.cta-description'); if(ctaDesc) ctaDesc.textContent = t.cta.description;
        const ctaNote  = ctaSec.querySelector('.price-note'); if(ctaNote) ctaNote.textContent = t.cta.note;
        const ctaBtn   = ctaSec.querySelector('.btn-large.btn-primary'); if(ctaBtn) ctaBtn.textContent = t.cta.button;
        const guarantee = ctaSec.querySelector('.cta-guarantee'); if(guarantee) guarantee.textContent = t.cta.guarantee;
        const priceCurrent = ctaSec.querySelector('.price-current'); if(priceCurrent) priceCurrent.textContent = t.cta.current;
    }

    // ── Footer ──
    const footer = document.querySelector('footer');
    if (footer) {
        const tagline = footer.querySelector('.footer-tagline'); if(tagline) tagline.textContent = t.footer.tagline;
        const copyright = footer.querySelector('.footer-copyright'); if(copyright) copyright.textContent = '© ' + t.footer.copyright;
        // Footer section headings
        const footerHeadings = footer.querySelectorAll('.footer-heading');
        const headingKeys = ['hackathon','resources','company'];
        footerHeadings.forEach((h,i) => { if(headingKeys[i]) h.textContent = t.footer[headingKeys[i]]; });
        // Footer links
        const footerLinks = footer.querySelectorAll('.footer-link');
        const linkKeys = ['about','schedule','prizes','team','aiTools','cloud','mentors','faq','aboutEpic','partners','sponsor','contact'];
        footerLinks.forEach((a,i) => { if(linkKeys[i] && t.footer.links[linkKeys[i]]) a.textContent = t.footer.links[linkKeys[i]]; });
    }
}

function updateSection(id, texts) {
    const section = document.getElementById(id);
    if (!section) return;
    
    const eyebrow = section.querySelector('.section-eyebrow');
    const title = section.querySelector('.section-title');
    const desc = section.querySelector('.section-description');
    
    if (eyebrow && texts.eyebrow) eyebrow.textContent = texts.eyebrow;
    if (title && texts.title) title.textContent = texts.title;
    if (desc && texts.description) desc.textContent = texts.description;
}

function updateLangUI() {
    // Legacy text span (fallback)
    const langText = document.querySelector('.lang-text');
    if (langText) langText.textContent = currentLang === 'zh' ? '中文' : 'EN';

    // New slider toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.classList.toggle('zh', currentLang === 'zh');
        // Ripple animation
        langToggle.classList.remove('switching');
        void langToggle.offsetWidth; // force reflow
        langToggle.classList.add('switching');
        setTimeout(() => langToggle.classList.remove('switching'), 500);
    }

    // Sync mobile lang buttons
    const enBtn = document.getElementById('mobile-lang-en');
    const zhBtn = document.getElementById('mobile-lang-zh');
    if (enBtn) enBtn.classList.toggle('active', currentLang === 'en');
    if (zhBtn) zhBtn.classList.toggle('active', currentLang === 'zh');

    // Sync dropdown options
    document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.toggle('active', option.dataset.lang === currentLang);
    });
}

/**
 * Tabs functionality
 */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
}

/**
 * Scroll reveal animation
 */
function initScrollReveal() {
    const elements = document.querySelectorAll(
        '.section-header, .resource-card, .profile-card, .team-card, .prize-card, .timeline-item'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

/**
 * Smooth scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ============================================================
// 🎯 SMART TEAM MATCHING SYSTEM
// ============================================================

/**
 * Team Matching Engine - Intelligent algorithm for matching teammates
 * Features:
 * - Skill complementarity scoring
 * - Experience level balancing
 * - Location preference matching
 * - Interest/tech stack compatibility
 * - Real-time filtering and sorting
 */
class TeamMatchingEngine {
    constructor() {
        // Database of all available profiles
        this.profiles = [
            {
                id: 1,
                name: 'Alex Chen',
                role: 'developer',
                roleCategory: 'Full-Stack Developer',
                experience: 'senior',
                location: 'Singapore',
                tags: ['React', 'Node.js', 'AI/ML', 'TypeScript', 'AWS'],
                bio: 'Ex-Google engineer. Built 3 AI startups. Looking for design and business co-founders.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AlexChen&backgroundColor=b6e3f4',
                status: 'online',
                lookingFor: ['designer', 'business'],
                skills: { frontend: 95, backend: 90, ai: 85, design: 30, business: 40 },
                interests: ['AI Startups', 'SaaS', 'B2B Products'],
                availability: 'full-time'
            },
            {
                id: 2,
                name: 'Sarah Kim',
                role: 'designer',
                roleCategory: 'Product Designer',
                experience: 'senior',
                location: 'San Francisco',
                tags: ['UI/UX', 'Figma', 'Motion Design', 'Design Systems', 'User Research'],
                bio: 'Design lead at Stripe. Passionate about AI-powered products. Need technical co-founder.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=SarahKim&backgroundColor=ffdfbf',
                status: 'online',
                lookingFor: ['developer'],
                skills: { frontend: 60, backend: 20, ai: 50, design: 98, business: 60 },
                interests: ['AI Products', 'Consumer Apps', 'Fintech'],
                availability: 'full-time'
            },
            {
                id: 3,
                name: 'Marcus Johnson',
                role: 'developer',
                roleCategory: 'AI Engineer',
                experience: 'senior',
                location: 'London',
                tags: ['Python', 'PyTorch', 'LLMs', 'Computer Vision', 'NLP'],
                bio: 'PhD in ML from MIT. Published researcher. Building the next generation of AI agents.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MarcusJohnson&backgroundColor=c0aede',
                status: 'away',
                lookingFor: ['developer', 'pm'],
                skills: { frontend: 30, backend: 70, ai: 99, design: 20, business: 35 },
                interests: ['AI Research', 'LLM Applications', 'Robotics'],
                availability: 'part-time'
            },
            {
                id: 4,
                name: 'Emily Zhang',
                role: 'pm',
                roleCategory: 'Product Manager',
                experience: 'senior',
                location: 'Singapore',
                tags: ['Strategy', 'Growth', 'B2B SaaS', 'Agile', 'Data Analysis'],
                bio: 'Former PM at Notion. Launched 10+ products. Seeking technical team members.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=EmilyZhang&backgroundColor=ffd5dc',
                status: 'online',
                lookingFor: ['developer', 'designer'],
                skills: { frontend: 40, backend: 35, ai: 60, design: 55, business: 90 },
                interests: ['Productivity Tools', 'Enterprise Software', 'EdTech'],
                availability: 'full-time'
            },
            {
                id: 5,
                name: 'David Park',
                role: 'developer',
                roleCategory: 'Mobile Developer',
                experience: 'senior',
                location: 'Seoul',
                tags: ['Swift', 'Kotlin', 'Flutter', 'React Native', 'iOS'],
                bio: 'Mobile lead at Spotify. 8 years building consumer apps. Full-stack capable.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DavidPark&backgroundColor=d1d4f9',
                status: 'offline',
                lookingFor: ['designer', 'pm'],
                skills: { frontend: 80, backend: 65, ai: 45, design: 45, business: 50 },
                interests: ['Consumer Apps', 'Music Tech', 'Health & Fitness'],
                availability: 'full-time'
            },
            {
                id: 6,
                name: 'Lisa Wong',
                role: 'business',
                roleCategory: 'Business Development',
                experience: 'senior',
                location: 'Hong Kong',
                tags: ['Sales', 'Partnerships', 'Fundraising', 'Go-to-Market', 'VC Network'],
                bio: 'Ex-McKinsey. Helped raise $50M+ for startups. Looking for technical co-founders.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=LisaWong&backgroundColor=ffdfbf',
                status: 'online',
                lookingFor: ['developer', 'technical-cofounder'],
                skills: { frontend: 15, backend: 10, ai: 30, design: 25, business: 99 },
                interests: ['Fintech', 'Healthcare', 'Deep Tech'],
                availability: 'part-time'
            },
            {
                id: 7,
                name: 'Raj Patel',
                role: 'developer',
                roleCategory: 'Backend Engineer',
                experience: 'junior',
                location: 'Remote',
                tags: ['Node.js', 'PostgreSQL', 'GraphQL', 'Docker', 'Kubernetes'],
                bio: 'Passionate about scalable systems. Open source contributor. Eager to learn and grow.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=RajPatel&backgroundColor=b6e3f4',
                status: 'online',
                lookingFor: ['mentor', 'team'],
                skills: { frontend: 40, backend: 85, ai: 55, design: 20, business: 30 },
                interests: ['Open Source', 'DevTools', 'Cloud Infrastructure'],
                availability: 'full-time'
            },
            {
                id: 8,
                name: 'Yuki Tanaka',
                role: 'designer',
                roleCategory: 'UI Designer',
                experience: 'junior',
                location: 'Tokyo',
                tags: ['CSS', 'JavaScript', 'Adobe XD', 'Illustration', '3D Design'],
                bio: 'Creative designer with eye for detail. Love working on innovative projects with impact.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=YukiTanaka&backgroundColor=ffd5dc',
                status: 'online',
                lookingFor: ['team', 'learning-opportunity'],
                skills: { frontend: 75, backend: 30, ai: 35, design: 92, business: 25 },
                interests: ['Web3', 'Gaming', 'Social Impact'],
                availability: 'part-time'
            },
            {
                id: 9,
                name: 'Omar Hassan',
                role: 'developer',
                roleCategory: 'Data Scientist',
                experience: 'mid',
                location: 'Dubai',
                tags: ['Python', 'TensorFlow', 'Pandas', 'Machine Learning', 'Statistics'],
                bio: 'Data scientist transitioning into ML engineering. Strong math background, practical mindset.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=OmarHassan&backgroundColor=c0aede',
                status: 'away',
                lookingFor: ['team', 'career-growth'],
                skills: { frontend: 35, backend: 60, ai: 90, design: 15, business: 45 },
                interests: ['FinTech', 'E-commerce', 'Predictive Analytics'],
                availability: 'full-time'
            },
            {
                id: 10,
                name: 'Sophie Martin',
                role: 'pm',
                roleCategory: 'Technical PM',
                experience: 'mid',
                location: 'Paris',
                tags: ['Scrum', 'Jira', 'API Design', 'User Stories', 'A/B Testing'],
                bio: 'Bridge between tech and business. Former developer turned PM. Love complex challenges.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=SophieMartin&backgroundColor=ffd5dc',
                status: 'online',
                lookingFor: ['developer', 'innovative-team'],
                skills: { frontend: 55, backend: 55, ai: 65, design: 50, business: 75 },
                interests: ['Climate Tech', 'Sustainability', 'Social Good'],
                availability: 'full-time'
            },
            {
                id: 11,
                name: 'Chen Wei',
                role: 'developer',
                roleCategory: 'Game Developer',
                experience: 'junior',
                location: 'Shanghai',
                tags: ['Unity', 'C#', 'C++', 'Unreal Engine', 'Graphics Programming'],
                bio: 'Game dev enthusiast with strong C++ skills. Looking to build something revolutionary.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ChenWei&backgroundColor=d1d4f9',
                status: 'online',
                lookingFor: ['team', 'creative-project'],
                skills: { frontend: 50, backend: 70, ai: 50, design: 60, business: 20 },
                interests: ['Gaming', 'Metaverse', 'Virtual Reality'],
                availability: 'full-time'
            },
            {
                id: 12,
                name: 'Maria Garcia',
                role: 'business',
                roleCategory: 'Marketing Manager',
                experience: 'mid',
                location: 'Madrid',
                tags: ['Digital Marketing', 'SEO', 'Content Strategy', 'Social Media', 'Analytics'],
                bio: 'Growth marketer who understands developers. Helped grow 3 startups to 1M+ users.',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MariaGarcia&backgroundColor=ffdfbf',
                status: 'online',
                lookingFor: ['technical-cofounder', 'product-fit'],
                skills: { frontend: 25, backend: 15, ai: 40, design: 40, business: 95 },
                interests: ['D2C', 'Consumer Social', 'Creator Economy'],
                availability: 'part-time'
            }
        ];

        // Current user profile (for matching context)
        this.currentUser = null;
        this.matchHistory = new Set();
        this.filters = {
            role: 'all',
            experience: 'all',
            location: 'all'
        };
    }

    /**
     * Calculate match score between two profiles
     * @param {Object} profile1 - First profile
     * @param {Object} profile2 - Second profile
     * @returns {Object} Match result with score and reasons
     */
    calculateMatchScore(profile1, profile2) {
        let score = 0;
        const reasons = [];
        const weaknesses = [];

        // 1. Skill Complementarity Scoring (max 40 points)
        // Rewards complementary skills, penalizes overlap
        const skillComplementarity = this.calculateSkillComplementarity(profile1.skills, profile2.skills);
        score += skillComplementarity.score;
        if (skillComplementarity.reasons.length > 0) {
            reasons.push(...skillComplementarity.reasons);
        }

        // 2. Role Balance Scoring (max 20 points)
        // Ideal teams have diverse roles
        if (profile1.role !== profile2.role) {
            score += 20;
            reasons.push('complementary-roles');
        } else {
            weaknesses.push('similar-roles');
        }

        // 3. Experience Level Balance (max 15 points)
        // Some difference is good, too much can be challenging
        const expBalance = this.calculateExperienceBalance(profile1.experience, profile2.experience);
        score += expBalance.score;
        if (expBalance.reason) reasons.push(expBalance.reason);

        // 4. Looking-for Match (max 25 points)
        // High reward if one person's needs match the other's offering
        const needMatch = this.calculateNeedMatch(profile1, profile2);
        score += needMatch.score;
        if (needMatch.reasons.length > 0) {
            reasons.push(...needMatch.reasons);
        }

        // 5. Interest Overlap (bonus up to 10 points)
        const interestOverlap = this.calculateInterestOverlap(profile1.interests, profile2.interests);
        score += interestOverlap.score;
        if (interestOverlap.reasons.length > 0) {
            reasons.push(...interestOverlap.reasons);
        }

        // 6. Availability Compatibility (max -10 penalty)
        if (profile1.availability === profile2.availability && 
            profile1.availability === 'part-time') {
            score -= 5;
            weaknesses.push('both-part-time');
        }

        // Normalize score to 0-100
        const normalizedScore = Math.min(100, Math.max(0, score));

        return {
            score: normalizedScore,
            level: this.getMatchLevel(normalizedScore),
            reasons,
            weaknesses,
            details: {
                skillComplementarity: Math.round(skillComplementarity.score),
                roleBalance: profile1.role !== profile2.role ? 20 : 0,
                experienceBalance: expBalance.score,
                needMatch: needMatch.score,
                interestOverlap: interestOverlap.score
            }
        };
    }

    /**
     * Calculate how well skills complement each other
     * Rewards when one is strong where the other is weak
     */
    calculateSkillComplementarity(skills1, skills2) {
        let score = 0;
        const reasons = [];
        
        const skillKeys = Object.keys(skills1);
        let totalDiff = 0;
        let complementaryPairs = 0;

        skillKeys.forEach(skill => {
            const s1 = skills1[skill] || 0;
            const s2 = skills2[skill] || 0;
            const diff = Math.abs(s1 - s2);
            
            // If one is strong (70+) and the other is weak (<40), that's great complementarity
            if ((s1 >= 70 && s2 < 40) || (s2 >= 70 && s1 < 40)) {
                score += 8;
                complementaryPairs++;
                reasons.push(`${skill}-complement`);
            } else if (diff < 20 && s1 >= 50 && s2 >= 50) {
                // Both moderately skilled - slight bonus
                score += 2;
            } else if (diff < 15) {
                // Very similar levels - slight penalty (redundancy)
                score -= 2;
            }
            
            totalDiff += diff;
        });

        // Bonus for multiple complementary skill areas
        if (complementaryPairs >= 3) {
            score += 10;
            reasons.push('high-complementarity');
        }

        return { score: Math.max(0, Math.min(40, score)), reasons };
    }

    /**
     * Calculate experience level balance scoring
     */
    calculateExperienceBalance(exp1, exp2) {
        const levels = { student: 1, junior: 2, mid: 3, senior: 4, executive: 5 };
        const l1 = levels[exp1] || 3;
        const l2 = levels[exp2] || 3;
        const diff = Math.abs(l1 - l2);

        if (diff === 1) {
            return { score: 15, reason: 'good-experience-gap' }; // Ideal: one level apart
        } else if (diff === 2) {
            return { score: 10, reason: 'acceptable-experience-gap' };
        } else if (diff === 0) {
            return { score: 5, reason: 'same-experience-level' };
        } else {
            return { score: 3, reason: 'large-experience-gap' }; // May be challenging
        }
    }

    /**
     * Check if what one person needs matches what the other offers
     */
    calculateNeedMatch(profile1, profile2) {
        let score = 0;
        const reasons = [];

        // Check if profile2's role is in profile1's lookingFor list
        if (profile1.lookingFor.some(need => 
            profile2.role.includes(need) || profile2.roleCategory.toLowerCase().includes(need)
        )) {
            score += 15;
            reasons.push('needs-met');
        }

        // Check if profile1's role is in profile2's lookingFor list
        if (profile2.lookingFor.some(need => 
            profile1.role.includes(need) || profile1.roleCategory.toLowerCase().includes(need)
        )) {
            score += 10;
            reasons.push('mutual-interest');
        }

        return { score: Math.min(25, score), reasons };
    }

    /**
     * Calculate interest/tag overlap
     */
    calculateInterestOverlap(interests1, interests2) {
        const common = interests1.filter(i => interests2.includes(i));
        const score = common.length * 2.5; // 2.5 points per shared interest
        
        return {
            score: Math.min(10, score),
            reasons: common.length > 0 ? [`shared-interests:${common.join(',')}`] : []
        };
    }

    /**
     * Get match level label based on score
     */
    getMatchLevel(score) {
        if (score >= 85) return { label: 'Perfect Match', class: 'perfect', color: '#10b981', icon: '💎' };
        if (score >= 70) return { label: 'Great Match', class: 'great', color: '#3b82f6', icon: '🌟' };
        if (score >= 55) return { label: 'Good Match', class: 'good', color: '#f59e0b', icon: '✨' };
        if (score >= 40) return { label: 'Possible Match', class: 'possible', color: '#8b5cf6', icon: '🔍' };
        return { label: 'Low Match', class: 'low', color: '#ef4444', icon: '❓' };
    }

    /**
     * Find best matches for a given profile
     * @param {Object} profile - Profile to match against
     * @param {number} limit - Max number of results
     * @returns {Array} Sorted array of matches with scores
     */
    findBestMatches(profile, limit = 6) {
        const matches = [];

        this.profiles.forEach(candidate => {
            if (candidate.id === profile.id) return; // Skip self
            
            // Apply filters
            if (!this.passesFilters(candidate)) return;

            const result = this.calculateMatchScore(profile, candidate);
            matches.push({
                profile: candidate,
                ...result
            });
        });

        // Sort by score descending
        matches.sort((a, b) => b.score - a.score);

        return matches.slice(0, limit);
    }

    /**
     * Check if a profile passes current filters
     */
    passesFilters(profile) {
        if (this.filters.role !== 'all' && 
            profile.role !== this.filters.role &&
            !profile.roleCategory.toLowerCase().includes(this.filters.role.toLowerCase())) {
            return false;
        }

        if (this.filters.experience !== 'all' && 
            profile.experience !== this.filters.experience) {
            return false;
        }

        if (this.filters.location !== 'all' && 
            profile.location !== this.filters.location &&
            !(this.filters.location === 'remote' && profile.location === 'Remote')) {
            return false;
        }

        return true;
    }

    /**
     * Get recommended teammates based on a hypothetical user profile
     * @param {Object} preferences - User's preferences/role
     * @returns {Array} Recommended matches with scores
     */
    getRecommendations(preferences = {}) {
        // Create a virtual user profile based on preferences or defaults
        const userProfile = {
            id: 0,
            name: 'You',
            role: preferences.role || 'developer',
            roleCategory: preferences.roleCategory || 'Developer',
            experience: preferences.experience || 'mid',
            location: preferences.location || 'Singapore',
            tags: preferences.tags || [],
            bio: '',
            avatar: '',
            status: 'online',
            lookingFor: preferences.lookingFor || ['designer', 'pm', 'business'],
            skills: preferences.skills || { frontend: 60, backend: 60, ai: 50, design: 30, business: 40 },
            interests: preferences.interests || [],
            availability: 'full-time'
        };

        return this.findBestMatches(userProfile);
    }

    /**
     * Update filter criteria
     */
    setFilter(filterType, value) {
        this.filters[filterType] = value;
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filters = { role: 'all', experience: 'all', location: 'all' };
    }

    /**
     * Generate team composition suggestion
     * @param {number} teamSize - Desired team size
     * @returns {Object} Team suggestion with roles and members
     */
    suggestTeamComposition(teamSize = 4) {
        const idealComposition = [
            { role: 'developer', count: 2, priority: 'essential' },
            { role: 'designer', count: 1, priority: 'high' },
            { role: 'pm', count: 1, priority: 'high' },
            { role: 'business', count: 1, priority: 'medium' }
        ];

        const suggestions = this.getRecommendations();
        const team = {
            members: [],
            missingRoles: [],
            overallScore: 0,
            strength: 'balanced',
            tips: []
        };

        const usedRoles = new Set();
        let totalScore = 0;

        suggestions.forEach((match, index) => {
            if (index < teamSize) {
                team.members.push({
                    ...match,
                    suggestedRole: this.getSuggestedRole(match.profile, usedRoles)
                });
                usedRoles.add(match.profile.role);
                totalScore += match.score;
            }
        });

        team.overallScore = Math.round(totalScore / Math.min(teamSize, suggestions.length));
        team.strength = this.evaluateTeamStrength(team.members);

        // Generate tips
        if (!usedRoles.has('designer')) {
            team.missingRoles.push('Designer');
            team.tips.push('Consider adding a designer for better UX');
        }
        if (!usedRoles.has('business') && teamSize > 3) {
            team.missingRoles.push('Business/Marketing');
            team.tips.push('A business member helps with go-to-market strategy');
        }

        return team;
    }

    getSuggestedRole(profile, usedRoles) {
        // Suggest a role that complements existing team
        const available = ['Tech Lead', 'UI/UX Lead', 'Product Owner', 'Business Lead'];
        for (const role of available) {
            if (!usedRoles.has(role)) return role;
        }
        return 'Team Member';
    }

    evaluateTeamStrength(members) {
        const hasDev = members.some(m => m.profile.role === 'developer');
        const hasDesigner = members.some(m => m.profile.role === 'designer');
        const hasPM = members.some(m => m.profile.role === 'pm');
        const hasBiz = members.some(m => m.profile.role === 'business');

        if (hasDev && hasDesigner && hasPM) return 'well-rounded';
        if (hasDev && hasDesigner) return 'tech-strong';
        if (hasDev && hasPM) return 'product-focused';
        return 'needs-diversity';
    }
}

// Initialize the matching engine
const matchingEngine = new TeamMatchingEngine();

/**
 * Initialize Smart Matching UI
 */
function initSmartMatching() {
    const searchBtn = document.querySelector('.filters-bar .btn-primary');
    const filterSelects = document.querySelectorAll('.filter-select');
    const connectBtns = document.querySelectorAll('.profile-footer .btn-small');

    if (!searchBtn) return;

    // Enhance search button functionality
    searchBtn.addEventListener('click', performSmartSearch);

    // Add filter change listeners
    filterSelects.forEach((select, index) => {
        select.addEventListener('change', () => {
            const filterTypes = ['role', 'experience', 'location'];
            matchingEngine.setFilter(filterTypes[index], select.value);
        });
    });

    // Enhance Connect buttons
    connectBtns.forEach(btn => {
        btn.addEventListener('click', handleConnect);
    });

    // Add match indicators to profile cards
    addMatchIndicators();

    // Initialize team suggestion feature
    initTeamSuggestions();
}

/**
 * Perform smart search with filtering and ranking
 */
function performSmartSearch(e) {
    e.preventDefault();

    const profilesGrid = document.querySelector('.profiles-grid');
    if (!profilesGrid) return;

    // Show loading state
    profilesGrid.innerHTML = `
        <div class="search-loading">
            <div class="loading-spinner"></div>
            <p>Finding your perfect teammates...</p>
        </div>
    `;

    // Simulate search delay for UX feel
    setTimeout(() => {
        const results = matchingEngine.getRecommendations();
        renderSearchResults(results, profilesGrid);
    }, 800);
}

/**
 * Render search results with match scores
 */
function renderSearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No matches found</h3>
                <p>Try adjusting your filters to see more results.</p>
                <button class="btn btn-secondary" onclick="resetFilters()">Reset Filters</button>
            </div>
        `;
        return;
    }

    container.innerHTML = results.map((result, index) => `
        <div class="profile-card match-result" style="animation-delay: ${index * 100}ms">
            <div class="match-badge ${result.level.class}" title="${result.label}: ${result.score}/100">
                <span class="match-icon">${result.level.icon}</span>
                <span class="match-score">${result.score}</span>
            </div>
            <div class="profile-header">
                <img src="${result.profile.avatar}" alt="${result.profile.name}" class="profile-avatar">
                <div class="profile-status ${result.profile.status}"></div>
            </div>
            <h4 class="profile-name">${result.profile.name}</h4>
            <p class="profile-role">${result.profile.roleCategory}</p>
            <div class="profile-tags">
                ${result.profile.tags.slice(0, 4).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <p class="profile-bio">${result.profile.bio}</p>
            <div class="match-reasons">
                ${result.reasons.slice(0, 2).map(reason => `<span class="reason-tag">${formatReason(reason)}</span>`).join('')}
            </div>
            <div class="profile-footer">
                <span class="profile-location">${getLocationFlag(result.profile.location)} ${result.profile.location}</span>
                <button class="btn btn-small btn-primary" onclick="handleConnect('${result.profile.name}', event)">Connect</button>
            </div>
        </div>
    `).join('');

    // Animate cards in
    requestAnimationFrame(() => {
        container.querySelectorAll('.match-result').forEach((card, i) => {
            setTimeout(() => card.classList.add('revealed'), i * 100);
        });
    });
}

/**
 * Format reason key to readable text
 */
function formatReason(reason) {
    const reasonMap = {
        'complementary-roles': '🔄 Complementary Roles',
        'needs-met': '✅ Needs Met',
        'mutual-interest': '🤝 Mutual Interest',
        'good-experience-gap': '📈 Good Exp. Gap',
        'shared-interests': '🎯 Shared Interests',
        'high-complementarity': '⭐ Highly Complementary',
        'skill-complement': '🔧 Skill Complement'
    };
    
    // Handle dynamic shared interests
    if (reason.startsWith('shared-interests:')) {
        return `🎯 ${reason.replace('shared-interests:', '')}`;
    }
    
    return reasonMap[reason] || reason;
}

/**
 * Get flag emoji for location
 */
function getLocationFlag(location) {
    const flags = {
        'Singapore': '🇸🇬',
        'San Francisco': '🇺🇸',
        'London': '🇬🇧',
        'Seoul': '🇰🇷',
        'Hong Kong': '🇭🇰',
        'Tokyo': '🇯🇵',
        'Dubai': '🇦🇪',
        'Paris': '🇫🇷',
        'Shanghai': '🇨🇳',
        'Madrid': '🇪🇸',
        'Remote': '🌐'
    };
    return flags[location] || '📍';
}

/**
 * Handle Connect button click
 */
function handleConnect(name, event) {
    event.preventDefault();
    event.stopPropagation();

    const btn = event.target;
    const originalText = btn.textContent;

    // Check if already connected
    if (btn.classList.contains('connected')) {
        showMatchModal(name, 'already-connected');
        return;
    }

    // Show connecting state
    btn.textContent = '...';
    btn.disabled = true;

    // Simulate connection process
    setTimeout(() => {
        btn.textContent = '✓ Sent';
        btn.classList.add('connected');
        btn.disabled = false;

        // Show success modal
        showMatchModal(name, 'connect-request-sent');

        // Record in match history
        matchingEngine.matchHistory.add(name);

        // Show toast notification
        showToast(`Connection request sent to ${name}! 🚀`);
    }, 1200);
}

/**
 * Show match detail modal
 */
function showMatchModal(name, type) {
    // Remove existing modal
    const existing = document.querySelector('.match-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'match-modal';

    const titles = {
        'connect-request-sent': {
            icon: '✉️',
            title: 'Connection Request Sent!',
            subtitle: `${name} will be notified of your interest.`,
            color: '#10b981'
        },
        'already-connected': {
            icon: '💬',
            title: `You're already connected with ${name}`,
            subtitle: 'Start a conversation!',
            color: '#3b82f6'
        },
        'perfect-match': {
            icon: '💎',
            title: `It's a Perfect Match!`,
            subtitle: `Your skills complement ${name}'s perfectly.`,
            color: '#8b5cf6'
        }
    };

    const config = titles[type] || titles['connect-request-sent'];

    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-icon" style="background: ${config.color}20">${config.icon}</div>
            <h3>${config.title}</h3>
            <p>${config.subtitle}</p>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="closeMatchModal()">Great!</button>
                <button class="btn btn-secondary" onclick="closeMatchModal()">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Trigger animation
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });

    // Close on backdrop click
    modal.querySelector('.modal-backdrop').addEventListener('click', closeMatchModal);

    // Close on Escape key
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') closeMatchModal();
    }, { once: true });
}

/**
 * Close match modal
 */
function closeMatchModal() {
    const modal = document.querySelector('.match-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * Reset filters to default
 */
function resetFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.selectedIndex = 0;
    });
    
    matchingEngine.clearFilters();
    
    // Re-render original profiles
    const profilesGrid = document.querySelector('.profiles-grid');
    if (profilesGrid) {
        profilesGrid.innerHTML = getOriginalProfilesHTML();
        addMatchIndicators();
        initConnectButtons();
    }
}

/**
 * Get original profiles HTML (fallback)
 */
function getOriginalProfilesHTML() {
    return `
        <div class="profile-card">
            <div class="profile-header">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=AlexChen&backgroundColor=b6e3f4" alt="Alex Chen" class="profile-avatar">
                <div class="profile-status online"></div>
            </div>
            <h4 class="profile-name">Alex Chen</h4>
            <p class="profile-role">Full-Stack Developer</p>
            <div class="profile-tags">
                <span class="tag">React</span><span class="tag">Node.js</span><span class="tag">AI/ML</span>
            </div>
            <p class="profile-bio">Ex-Google engineer. Built 3 AI startups. Looking for design and business co-founders.</p>
            <div class="profile-footer">
                <span class="profile-location">🇸🇬 Singapore</span>
                <button class="btn btn-small btn-primary">Connect</button>
            </div>
        </div>
        <div class="profile-card">
            <div class="profile-header">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=SarahKim&backgroundColor=ffdfbf" alt="Sarah Kim" class="profile-avatar">
                <div class="profile-status online"></div>
            </div>
            <h4 class="profile-name">Sarah Kim</h4>
            <p class="profile-role">Product Designer</p>
            <div class="profile-tags">
                <span class="tag">UI/UX</span><span class="tag">Figma</span><span class="tag">Motion</span>
            </div>
            <p class="profile-bio">Design lead at Stripe. Passionate about AI-powered products. Need technical co-founder.</p>
            <div class="profile-footer">
                <span class="profile-location">🇺🇸 San Francisco</span>
                <button class="btn btn-small btn-primary">Connect</button>
            </div>
        </div>
        <div class="profile-card">
            <div class="profile-header">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=MarcusJohnson&backgroundColor=c0aede" alt="Marcus Johnson" class="profile-avatar">
                <div class="profile-status away"></div>
            </div>
            <h4 class="profile-name">Marcus Johnson</h4>
            <p class="profile-role">AI Engineer</p>
<div class="profile-tags">
                <span class="tag">Python</span><span class="tag">PyTorch</span><span class="tag">LLMs</span>
            </div>
            <p class="profile-bio">PhD in ML from MIT. Published researcher. Building the next generation of AI agents.</p>
            <div class="profile-footer">
                <span class="profile-location">🇬🇧 London</span>
                <button class="btn btn-small btn-primary">Connect</button>
            </div>
        </div>
        <div class="profile-card">
            <div class="profile-header">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=EmilyZhang&backgroundColor=ffd5dc" alt="Emily Zhang" class="profile-avatar">
                <div class="profile-status online"></div>
            </div>
            <h4 class="profile-name">Emily Zhang</h4>
            <p class="profile-role">Product Manager</p>
            <div class="profile-tags">
                <span class="tag">Strategy</span><span class="tag">Growth</span><span class="tag">B2B SaaS</span>
            </div>
            <p class="profile-bio">Former PM at Notion. Launched 10+ products. Seeking technical team members.</p>
            <div class="profile-footer">
                <span class="profile-location">🇸🇬 Singapore</span>
                <button class="btn btn-small btn-primary">Connect</button>
            </div>
        </div>
        <div class="profile-card">
            <div class="profile-header">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=DavidPark&backgroundColor=d1d4f9" alt="David Park" class="profile-avatar">
                <div class="profile-status offline"></div>
            </div>
            <h4 class="profile-name">David Park</h4>
            <p class="profile-role">Mobile Developer</p>
            <div class="profile-tags">
                <span class="tag">Swift</span><span class="tag">Kotlin</span><span class="tag">Flutter</span>
            </div>
            <p class="profile-bio">Mobile lead at Spotify. 8 years building consumer apps. Full-stack capable.</p>
            <div class="profile-footer">
                <span class="profile-location">🇰🇷 Seoul</span>
                <button class="btn btn-small btn-primary">Connect</button>
            </div>
        </div>
        <div class="profile-card">
            <div class="profile-header">
                <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=LisaWong&backgroundColor=ffdfbf" alt="Lisa Wong" class="profile-avatar">
                <div class="profile-status online"></div>
            </div>
            <h4 class="profile-name">Lisa Wong</h4>
            <p class="profile-role">Business Development</p>
            <div class="profile-tags">
                <span class="tag">Sales</span><span class="tag">Partnerships</span><span class="tag">Fundraising</span>
            </div>
            <p class="profile-bio">Ex-McKinsey. Helped raise $50M+ for startups. Looking for technical co-founders.</p>
            <div class="profile-footer">
                <span class="profile-location">🇭🇰 Hong Kong</span>
                <button class="btn btn-small btn-primary">Connect</button>
            </div>
        </div>
    `;
}

/**
 * Add match score indicators to profile cards
 */
function addMatchIndicators() {
    const cards = document.querySelectorAll('.profile-card');
    
    cards.forEach(card => {
        const nameEl = card.querySelector('.profile-name');
        if (!nameEl) return;

        const name = nameEl.textContent.trim();
        const profile = matchingEngine.profiles.find(p => p.name === name);
        if (!profile) return;

        // Calculate a mock score for display (in real app, this would be based on current user)
        const mockUser = {
            id: 999,
            name: 'You',
            role: 'developer',
            roleCategory: 'Developer',
            experience: 'mid',
            location: 'Singapore',
            tags: ['JavaScript', 'React', 'Node.js'],
            bio: '',
            avatar: '',
            status: 'online',
            lookingFor: ['designer', 'pm'],
            skills: { frontend: 65, backend: 55, ai: 45, design: 25, business: 35 },
            interests: [],
            availability: 'full-time'
        };

        const matchResult = matchingEngine.calculateMatchScore(mockUser, profile);
        
        // Create match badge
        const badge = document.createElement('div');
        badge.className = `match-indicator ${matchResult.level.class}`;
        badge.innerHTML = `
            <span class="match-icon">${matchResult.level.icon}</span>
            <span class="match-label">${matchResult.label}</span>
            <span class="match-percent">${matchResult.score}%</span>
        `;
        badge.title = `Match Score: ${matchResult.score}/100\n${matchResult.reasons.join(', ')}`;

        // Insert after header
        const header = card.querySelector('.profile-header');
        if (header && !card.querySelector('.match-indicator')) {
            header.style.position = 'relative';
            header.appendChild(badge);
        }
    });
}

/**
 * Re-initialize Connect buttons after DOM changes
 */
function initConnectButtons() {
    document.querySelectorAll('.profile-footer .btn-small').forEach(btn => {
        if (!btn.dataset.enhanced) {
            btn.dataset.enhanced = 'true';
            btn.addEventListener('click', function(e) {
                handleConnect(this.closest('.profile-card').querySelector('.profile-name').textContent, e);
            });
        }
    });
}

/**
 * Initialize Team Suggestions Feature
 */
function initTeamSuggestions() {
    const createForm = document.querySelector('.create-team-form');
    const createBtn = createForm?.querySelector('.btn-large');

    if (createBtn) {
        createBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Gather form data
            const formData = gatherFormData(createForm);
            
            if (validateTeamForm(formData)) {
                suggestOptimalTeam(formData);
            }
        });
    }
}

/**
 * Gather form data from Create Team form
 */
function gatherFormData(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    const data = {};
    
    inputs.forEach(input => {
        data[input.placeholder || input.name || input.querySelector('label')?.textContent] = input.value;
    });
    
    return data;
}

/**
 * Validate team creation form
 */
function validateTeamForm(data) {
    const values = Object.values(data);
    return values.some(v => v && v.length > 0); // At least one field filled
}

/**
 * Suggest optimal team based on form input
 */
function suggestOptimalTeam(formData) {
    const suggestion = matchingEngine.suggestTeamComposition(4);
    
    // Show suggestion modal
    const modal = document.createElement('div');
    modal.className = 'match-modal team-suggestion-modal';
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content modal-large">
            <div class="modal-icon" style="background: #3b82f620">👥</div>
            <h3>Team Composition Suggestion</h3>
            <p class="suggestion-subtitle">Based on your requirements, here's an ideal team:</p>
            
            <div class="team-suggestion">
                <div class="suggestion-members">
                    ${suggestion.members.map(member => `
                        <div class="suggestion-member">
                            <img src="${member.profile.avatar}" alt="${member.profile.name}" class="suggestion-avatar">
                            <div class="suggestion-info">
                                <h4>${member.profile.name}</h4>
                                <span class="suggestion-role">${member.suggestedRole}</span>
                                <span class="suggestion-score">${member.score}% match</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="suggestion-meta">
                    <div class="meta-item">
                        <span class="meta-label">Team Strength:</span>
                        <span class="meta-value strength-${suggestion.strength}">${suggestion.strength.toUpperCase()}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Avg Match Score:</span>
                        <span class="meta-value">${suggestion.overallScore}%</span>
                    </div>
                </div>
                
                ${suggestion.tips.length > 0 ? `
                <div class="suggestion-tips">
                    <h4>💡 Suggestions</h4>
                    <ul>
                        ${suggestion.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${suggestion.missingRoles.length > 0 ? `
                <div class="missing-roles">
                    <h4>Consider Adding:</h4>
                    <div class="missing-tags">
                        ${suggestion.missingRoles.map(role => `<span class="missing-tag">${role}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="acceptTeamSuggestion()">Build This Team</button>
                <button class="btn btn-secondary" onclick="closeMatchModal()">Keep Exploring</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    requestAnimationFrame(() => modal.classList.add('show'));
    
    modal.querySelector('.modal-backdrop').addEventListener('click', closeMatchModal);
}

/**
 * Accept team suggestion
 */
function acceptTeamSuggestion() {
    closeMatchModal();
    
    // Switch to browse tab to show teams
    const browseTab = document.getElementById('browse-tab');
    const browseBtn = document.querySelector('[data-tab="browse"]');
    
    if (browseTab && browseBtn) {
        browseBtn.click();
        
        // Scroll to teams section
        setTimeout(() => {
            browseTab.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
    
    showToast('Team composition saved! Continue browsing for more members. 🎯');
}

// ============================================================
// ENHANCED STYLES FOR MATCHING SYSTEM
// ============================================================
const matchingStyles = `
<style>
/* ===== MATCH BADGES & INDICATORS ===== */
.match-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 2;
    animation: badgePop 0.3s ease-out;
    cursor: help;
    transition: transform 0.2s ease;
}

.match-badge:hover {
    transform: scale(1.05);
}

.match-badge.perfect { background: linear-gradient(135deg, #10b981, #059669); color: white; }
.match-badge.great { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; }
.match-badge.good { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
.match-badge.possible { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
.match-badge.low { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }

.match-icon { font-size: 14px; }
.match-score { font-size: 13px; font-weight: 700; opacity: 0.95; }

/* Match Indicator (on profile cards) */
.match-indicator {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 2;
    animation: slideUp 0.3s ease-out;
}

.match-indicator.perfect { background: #10b981; color: white; }
.match-indicator.great { background: #3b82f6; color: white; }
.match-indicator.good { background: #f59e0b; color: white; }
.match-indicator.possible { background: #8b5cf6; color: white; }
.match-indicator.low { background: #6b7280; color: white; }

.match-label { opacity: 0.9; }
.match-percent { font-weight: 700; opacity: 1; }

/* Match Reasons Tags */
.match-reasons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
}

.reason-tag {
    padding: 3px 8px;
    background: #f3f4f6;
    border-radius: 6px;
    font-size: 11px;
    color: #4b5563;
    white-space: nowrap;
}

/* Search Loading State */
.search-loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.search-loading p {
    color: #6b7280;
    margin-top: 16px;
    font-size: 14px;
}

/* No Results State */
.no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
}

.no-results-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.no-results h3 {
    color: #1f2937;
    margin-bottom: 8px;
    font-size: 18px;
}

.no-results p {
    color: #6b7280;
    margin-bottom: 24px;
    font-size: 14px;
}

/* ===== MATCH MODAL ===== */
.match-modal {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.match-modal.show {
    opacity: 1;
    visibility: visible;
}

.modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    border-radius: 20px;
    padding: 40px;
    max-width: 420px;
    width: 90%;
    position: relative;
    z-index: 1;
    transform: scale(0.9) translateY(20px);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.match-modal.show .modal-content {
    transform: scale(1) translateY(0);
}

.modal-large {
    max-width: 520px;
}

.modal-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 16px;
}

.modal-content h3 {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 8px;
}

.suggestion-subtitle {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 24px;
}

.modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 32px;
}

.modal-actions .btn {
    flex: 1;
}

/* Team Suggestion Modal */
.team-suggestion {
    margin-top: 24px;
}

.suggestion-members {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    max-height: 200px;
    overflow-y: auto;
    padding-right: 8px;
}

.suggestion-member {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f9fafb;
    border-radius: 12px;
    transition: all 0.2s ease;
}

.suggestion-member:hover {
    background: #f3f4f6;
    transform: translateX(4px);
}

.suggestion-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
}

.suggestion-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.suggestion-info h4 {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
}

.suggestion-role {
    font-size: 12px;
    color: #6b7280;
}

.suggestion-score {
    font-size: 12px;
    font-weight: 700;
    color: #10b981;
    background: #d1fae5;
    padding: 2px 8px;
    border-radius: 10px;
}

.suggestion-meta {
    display: flex;
    gap: 24px;
    padding: 16px;
    background: #f9fafb;
    border-radius: 12px;
    margin-bottom: 16px;
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.meta-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
}

.meta-value {
    font-size: 14px;
    font-weight: 700;
    color: #1f2937;
}

.meta-value.strength-well-rounded { color: #10b981; }
.meta-value.strength-tech-strong { color: #3b82f6; }
.meta-value.strength-product-focused { color: #f59e0b; }
.meta-value.strength-needs-diversity { color: #ef4444; }

.suggestion-tips {
    background: #fef3c7;
    border: 1px solid #fde68a;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
}

.suggestion-tips h4 {
    font-size: 13px;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 8px;
}

.suggestion-tips ul {
    margin: 0;
    padding-left: 16px;
    font-size: 13px;
    color: #166534;
}

.suggestion-tips li {
    margin-bottom: 4px;
}

.missing-roles {
    background: #fee2e2;
    border: 1px #fecaca;
    border-radius: 12px;
    padding: 16px;
}

.missing-roles h4 {
    font-size: 13px;
    font-weight: 600;
    color: #dc2626;
    margin-bottom: 12px;
}

.missing-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.missing-tag {
    padding: 4px 12px;
    background: white;
    border: 1px solid #fecaca;
    border-radius: 6px;
    font-size: 12px;
    color: #dc2626;
    font-weight: 500;
}

/* ===== ANIMATIONS ===== */
@keyframes badgePop {
    0% { transform: scale(0) rotate(-12deg); opacity: 0; }
    60% { transform: scale(1.1) rotate(2deg); opacity: 1; }
    100% { transform: scale(1) rotate(0); opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateX(-50%) translateY(10px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
}

/* Card reveal animation for search results */
.match-result {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.match-result.revealed {
    opacity: 1;
    transform: translateY(0);
}

/* Connected button state */
.btn.connected {
    background: linear-gradient(135deg, #10b981, #059669) !important;
    border-color: #10b981 !important;
}

.btn.connected:hover {
    background: linear-gradient(135deg, #059669, #047857) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .match-badge {
        top: -6px;
        right: -6px;
        padding: 4px 8px;
        font-size: 10px;
    }
    
    .match-indicator {
        bottom: -6px;
        padding: 3px 8px;
        font-size: 10px;
    }
    
    .modal-content {
        padding: 24px;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', matchingStyles);

// ============================================================
// BUTTON CLICK HANDLERS (Enhanced)
// ============================================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) {
            e.preventDefault();
            showToast(currentLang === 'en' ? 'Coming soon!' : '即将推出！');
        }
    });
});

// Initialize smart matching when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmartMatching);
} else {
    initSmartMatching();
}

/**
 * Toast notification
 */
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--black);
        color: var(--white);
        padding: 14px 28px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        border: 1px solid var(--white-12);
    `;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
