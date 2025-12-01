// ==================== 全局变量 ====================
// 恋爱开始时间（需要修改为实际日期）
const loveStartDate = new Date('2023-02-14T00:00:00');
const nextAnniversaryDate = new Date('2024-05-20T00:00:00');

// ==================== 页面加载完成后初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initTimeCounter();
    initPetals();
    initStars();
    initSmoothScroll();
    initScrollQuotes();
    initSettings();
    initTheme();
    initNavLinks();
    
    // 检查是否是节日
    checkHoliday();
});

// ==================== 时间计数器 ====================
function initTimeCounter() {
    function updateCounter() {
        const now = new Date();
        const diff = now - loveStartDate;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        // 计算距离下次纪念日
        const anniversaryDiff = nextAnniversaryDate - now;
        const daysToAnniversary = Math.ceil(anniversaryDiff / (1000 * 60 * 60 * 24));
        if (daysToAnniversary > 0) {
            document.getElementById('nextAnniversary').textContent = daysToAnniversary;
        } else {
            document.getElementById('nextAnniversary').parentElement.innerHTML = '<p>🎉 今天是我们的纪念日！</p>';
        }
    }
    
    updateCounter();
    setInterval(updateCounter, 1000);
}

// ==================== 花瓣飘落效果 ====================
function initPetals() {
    const petalsContainer = document.querySelector('.floating-petals');
    if (!petalsContainer) return;
    
    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 3 + 5) + 's';
        petal.style.animationDelay = Math.random() * 2 + 's';
        petal.style.width = (Math.random() * 10 + 5) + 'px';
        petal.style.height = petal.style.width;
        petalsContainer.appendChild(petal);
        
        petal.addEventListener('animationend', () => {
            petal.remove();
        });
    }
    
    // 每500ms创建一个花瓣
    setInterval(createPetal, 500);
    
    // 初始创建一些花瓣
    for (let i = 0; i < 10; i++) {
        setTimeout(createPetal, i * 200);
    }
}

// ==================== 星空背景 ====================
function initStars() {
    const starsContainer = document.querySelector('.stars-background');
    if (!starsContainer) return;
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.animationDuration = (Math.random() * 2 + 1) + 's';
        starsContainer.appendChild(star);
    }
}

// ==================== 平滑滚动 ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== 滚动到页面底部显示语录 ====================
function initScrollQuotes() {
    const quotes = [
        '今天也比昨天更爱你❤️',
        '遇见你，是我最美好的意外💕',
        '想和你一起看遍世间所有风景🌅',
        '有你陪伴的日子，每天都是情人节💖',
        '我想和你一起慢慢变老💑',
        '你是我的全世界🌍',
        '爱你，是我做过最正确的事✨',
        '想和你分享所有美好的瞬间📸'
    ];
    
    let quoteShown = false;
    
    window.addEventListener('scroll', function() {
        if (quoteShown) return;
        
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const clientHeight = window.innerHeight;
        
        // 滚动到90%时显示语录
        if (scrollTop + clientHeight >= scrollHeight * 0.9) {
            const quoteElement = document.getElementById('loveQuote');
            if (quoteElement) {
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                quoteElement.querySelector('p').textContent = randomQuote;
                quoteElement.style.display = 'block';
                quoteShown = true;
                
                // 5秒后隐藏
                setTimeout(() => {
                    quoteElement.style.display = 'none';
                }, 5000);
            }
        }
    });
}

// ==================== 设置功能 ====================
function initSettings() {
    const settingsLink = document.querySelector('a[href="#settings"]');
    const settingsModal = document.getElementById('settingsModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (settingsLink && settingsModal) {
        settingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            settingsModal.classList.add('active');
        });
    }
    
    if (closeModal && settingsModal) {
        closeModal.addEventListener('click', function() {
            settingsModal.classList.remove('active');
        });
    }
    
    // 点击模态框外部关闭
    if (settingsModal) {
        settingsModal.addEventListener('click', function(e) {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
            }
        });
    }
    
    // 数据备份功能
    const backupBtn = document.querySelector('.btn-backup');
    if (backupBtn) {
        backupBtn.addEventListener('click', function() {
            exportData();
        });
    }
    
    // 隐私设置
    const privacyRadios = document.querySelectorAll('input[name="privacy"]');
    const savedPrivacy = localStorage.getItem('privacy') || 'couple';
    privacyRadios.forEach(radio => {
        if (radio.value === savedPrivacy) {
            radio.checked = true;
        }
        radio.addEventListener('change', function() {
            localStorage.setItem('privacy', this.value);
            alert('隐私设置已保存');
        });
    });
}

// ==================== 导出数据 ====================
function exportData() {
    const data = {
        timeline: JSON.parse(localStorage.getItem('timelineData') || '[]'),
        checkin: JSON.parse(localStorage.getItem('checkinData') || '{}'),
        photos: JSON.parse(localStorage.getItem('galleryPhotos') || '[]'),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `情侣网页备份_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('数据导出成功！💕');
}

// ==================== 主题切换 ====================
function initTheme() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('theme') || 'pink';
    
    // 应用保存的主题
    applyTheme(savedTheme);
    
    themeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
            localStorage.setItem('theme', theme);
        });
    });
}

function applyTheme(theme) {
    const root = document.documentElement;
    
    switch(theme) {
        case 'blue':
            root.style.setProperty('--primary-pink', '#B3E5FC');
            root.style.setProperty('--primary-blue', '#81D4FA');
            break;
        case 'green':
            root.style.setProperty('--primary-pink', '#C8E6C9');
            root.style.setProperty('--primary-blue', '#A5D6A7');
            break;
        case 'pink':
        default:
            root.style.setProperty('--primary-pink', '#FFD1DC');
            root.style.setProperty('--primary-blue', '#B3E5FC');
            break;
    }
}

// ==================== 导航链接高亮 ====================
function initNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .entry-card');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==================== 节日彩蛋 ====================
function checkHoliday() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    
    // 情人节 2月14日
    if (month === 2 && date === 14) {
        activateValentineEffect();
    }
    
    // 白色情人节 3月14日
    if (month === 3 && date === 14) {
        activateValentineEffect();
    }
    
    // 520
    if (month === 5 && date === 20) {
        activate520Effect();
    }
}

function activateValentineEffect() {
    // 增加花瓣数量
    setInterval(() => {
        createPetal();
    }, 200);
    
    // 显示节日祝福
    setTimeout(() => {
        alert('💕 情人节快乐！愿我们的爱情如花般绚烂！💕');
    }, 1000);
}

function activate520Effect() {
    // 特殊520效果
    document.body.style.background = 'linear-gradient(135deg, #FFD1DC 0%, #FFB6C1 100%)';
    
    setTimeout(() => {
        alert('💖 520 我爱你！愿我们的爱情天长地久！💖');
    }, 1000);
}

// ==================== 入场动画 ====================
function initFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.entry-card, .timeline-item, .wish-card, .exclusive-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// 初始化入场动画
document.addEventListener('DOMContentLoaded', initFadeInAnimations);

// ==================== 爱心点击特效 ====================
document.addEventListener('click', function(e) {
    if (e.target.closest('.timeline-node, .entry-icon')) {
        createHeartBurst(e.clientX, e.clientY);
    }
});

function createHeartBurst(x, y) {
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = '20px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.animation = `heartFloat 1s ease-out forwards`;
        heart.style.animationDelay = i * 0.1 + 's';
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 1000);
    }
}

// 添加爱心浮动动画
const style = document.createElement('style');
style.textContent = `
    @keyframes heartFloat {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 200 - 100}px, -100px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== 时间线节点展开 ====================
document.querySelectorAll('.timeline-node').forEach(node => {
    node.addEventListener('click', function() {
        const content = this.parentElement.querySelector('.timeline-content');
        if (content) {
            content.classList.toggle('expanded');
        }
    });
});

// ==================== 打卡功能 ====================
document.getElementById('submitMissing')?.addEventListener('click', function() {
    const text = document.getElementById('missingText').value;
    if (text.trim()) {
        alert('打卡成功！💕\n' + text);
        document.getElementById('missingText').value = '';
    }
});

// ==================== Tab切换 ====================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        const tabContainer = this.closest('.checkin-section, .wishlist-section');
        
        // 移除所有active类
        tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tabContainer.querySelectorAll('.wish-tab').forEach(b => b.classList.remove('active'));
        
        // 添加active类
        this.classList.add('active');
        const targetContent = document.getElementById(tabId + 'Checkin') || 
                             document.querySelector(`.wishlist-grid[data-category="${tabId}"]`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

document.querySelectorAll('.wish-tab').forEach(btn => {
    btn.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        const container = this.closest('.wishlist-section');
        
        container.querySelectorAll('.wish-tab').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // 根据分类显示愿望
        document.querySelectorAll('.wish-card').forEach(card => {
            card.style.display = card.getAttribute('data-category') === category ? 'block' : 'none';
        });
    });
});

