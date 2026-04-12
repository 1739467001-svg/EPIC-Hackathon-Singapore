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
let currentLang = 'en';

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initLanguageSwitch();
    initTabs();
    initScrollReveal();
    initSmoothScroll();
});

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
 * Language switch functionality
 */
function initLanguageSwitch() {
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', () => {
        langDropdown.classList.remove('show');
    });
    
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            if (lang !== currentLang) {
                currentLang = lang;
                updateLanguage();
                updateLangUI();
            }
            langDropdown.classList.remove('show');
        });
    });
}

function updateLanguage() {
    const texts = i18n[currentLang];
    
    // Update nav
    document.querySelectorAll('.nav-link').forEach((el, i) => {
        const keys = ['about', 'schedule', 'prizes', 'team', 'sponsors'];
        if (keys[i]) el.textContent = texts.nav[keys[i]];
    });
    
    document.querySelector('.header-actions .btn-primary').textContent = texts.nav.register;
    
    // Update hero
    document.querySelector('.hero-badge').innerHTML = `<span class="badge-pulse"></span>${texts.hero.badge}`;
    document.querySelector('.hero-title').innerHTML = `${texts.hero.title}<br><span class="title-highlight">${texts.hero.subtitle}</span>`;
    document.querySelector('.hero-description').textContent = texts.hero.description;
    
    const statLabels = document.querySelectorAll('.stat-label');
    statLabels[0].textContent = texts.hero.prize;
    statLabels[1].textContent = texts.hero.founders;
    statLabels[2].textContent = texts.hero.duration;
    
    const ctaButtons = document.querySelectorAll('.hero-cta .btn');
    ctaButtons[0].textContent = texts.hero.ctaPrimary;
    ctaButtons[1].textContent = texts.hero.ctaSecondary;
    
    const infoItems = document.querySelectorAll('.info-item span');
    infoItems[0].textContent = texts.hero.location;
    infoItems[1].textContent = texts.hero.date;
    
    // Update sections (simplified - full implementation would update all text)
    updateSection('resources', texts.resources);
    updateSection('team', texts.team);
    updateSection('schedule', texts.schedule);
    updateSection('prizes', texts.prizes);
    updateSection('cta', texts.cta);
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
    const langText = document.querySelector('.lang-text');
    const langOptions = document.querySelectorAll('.lang-option');
    
    langText.textContent = currentLang.toUpperCase();
    
    langOptions.forEach(option => {
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

// Button click handlers
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) {
            e.preventDefault();
            showToast(currentLang === 'en' ? 'Coming soon!' : '即将推出！');
        }
    });
});

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
