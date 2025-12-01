// ==================== 打卡模块 ====================

// 打卡数据
let checkinData = {
    daily: [],
    challenges: [],
    calendar: {}
};

// ==================== 初始化打卡模块 ====================
document.addEventListener('DOMContentLoaded', function() {
    initCheckinTabs();
    initDailyCheckin();
    initChallengeCheckin();
    initCheckinCalendar();
    loadCheckinData();
});

// ==================== 打卡Tab切换 ====================
function initCheckinTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 移除所有active
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // 添加active
            this.classList.add('active');
            const targetContent = document.getElementById(tabId + 'Checkin');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// ==================== 日常打卡 ====================
function initDailyCheckin() {
    const submitBtn = document.getElementById('submitMissing');
    const missingText = document.getElementById('missingText');
    
    if (submitBtn && missingText) {
        submitBtn.addEventListener('click', function() {
            const text = missingText.value.trim();
            if (!text) {
                alert('请输入内容后再打卡哦～');
                return;
            }
            
            const checkin = {
                id: Date.now(),
                type: 'missing',
                text: text,
                date: new Date().toISOString(),
                timestamp: Date.now()
            };
            
            checkinData.daily.push(checkin);
            saveCheckinData();
            
            // 显示成功提示
            showCheckinSuccess();
            
            // 清空输入
            missingText.value = '';
            
            // 更新显示
            displayDailyCheckins();
        });
    }
    
    // 待办事项
    document.querySelectorAll('.todo-list input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveTodoState();
        });
    });
}

// ==================== 显示日常打卡记录 ====================
function displayDailyCheckins() {
    const container = document.getElementById('dailyCheckin');
    if (!container) return;
    
    // 创建打卡记录显示区域（如果不存在）
    let recordsArea = container.querySelector('.checkin-records');
    if (!recordsArea) {
        recordsArea = document.createElement('div');
        recordsArea.className = 'checkin-records';
        recordsArea.style.cssText = 'margin-top: 20px;';
        container.appendChild(recordsArea);
    }
    
    // 显示最近的打卡记录
    const recentCheckins = checkinData.daily.slice(-5).reverse();
    recordsArea.innerHTML = '<h4>最近打卡记录</h4>';
    
    recentCheckins.forEach(checkin => {
        const record = document.createElement('div');
        record.className = 'checkin-record';
        record.style.cssText = `
            background: white;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        
        const date = new Date(checkin.date).toLocaleString('zh-CN');
        record.innerHTML = `
            <p>${checkin.text}</p>
            <small style="color: #999;">${date}</small>
        `;
        
        recordsArea.appendChild(record);
    });
}

// ==================== 挑战打卡 ====================
function initChallengeCheckin() {
    const challenges = [
        {
            id: 1,
            title: '30天早安晚安打卡',
            total: 30,
            current: 20,
            description: '每天互道早安晚安，培养默契'
        },
        {
            id: 2,
            title: '一起读同一本书',
            total: 20,
            current: 8,
            description: '共同阅读一本书，分享心得'
        }
    ];
    
    // 更新挑战进度
    updateChallenges(challenges);
    
    // 继续挑战按钮
    document.querySelectorAll('.btn-challenge').forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const challenge = challenges[index];
            if (challenge.current < challenge.total) {
                challenge.current++;
                updateChallenges(challenges);
                saveCheckinData();
                
                // 检查是否完成
                if (challenge.current >= challenge.total) {
                    showChallengeComplete(challenge.title);
                }
            }
        });
    });
}

function updateChallenges(challenges) {
    document.querySelectorAll('.challenge-card').forEach((card, index) => {
        if (challenges[index]) {
            const challenge = challenges[index];
            const progressBar = card.querySelector('.progress');
            const progressText = card.querySelector('p');
            
            if (progressBar) {
                const percentage = (challenge.current / challenge.total) * 100;
                progressBar.style.width = percentage + '%';
            }
            
            if (progressText) {
                progressText.textContent = `已完成 ${challenge.current}/${challenge.total} ${challenge.title.includes('天') ? '天' : '章'}`;
            }
        }
    });
}

function showChallengeComplete(title) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 400px;">
            <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
            <h2 style="color: #FF69B4; margin-bottom: 10px;">挑战完成！</h2>
            <p style="margin-bottom: 20px;">恭喜完成「${title}」挑战！</p>
            <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" 
                    style="padding: 10px 30px; background: #FF69B4; color: white; border: none; border-radius: 20px; cursor: pointer;">
                太棒了！
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ==================== 打卡日历 ====================
function initCheckinCalendar() {
    const calendarContainer = document.getElementById('checkinCalendar');
    if (!calendarContainer) return;
    
    renderCalendar();
}

function renderCalendar() {
    const calendarContainer = document.getElementById('checkinCalendar');
    if (!calendarContainer) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // 创建日历HTML
    let calendarHTML = `
        <div class="calendar-header">
            <button class="calendar-nav" onclick="changeCalendarMonth(-1)">‹</button>
            <h3>${year}年${month + 1}月</h3>
            <button class="calendar-nav" onclick="changeCalendarMonth(1)">›</button>
        </div>
        <div class="calendar-grid">
            <div class="calendar-weekday">日</div>
            <div class="calendar-weekday">一</div>
            <div class="calendar-weekday">二</div>
            <div class="calendar-weekday">三</div>
            <div class="calendar-weekday">四</div>
            <div class="calendar-weekday">五</div>
            <div class="calendar-weekday">六</div>
    `;
    
    // 空白日期
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>';
    }
    
    // 日期格子
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isChecked = checkinData.calendar[dateStr] || false;
        const isToday = year === now.getFullYear() && month === now.getMonth() && day === now.getDate();
        
        calendarHTML += `
            <div class="calendar-day ${isChecked ? 'checked' : ''} ${isToday ? 'today' : ''}" 
                 data-date="${dateStr}"
                 onclick="toggleCheckin('${dateStr}')">
                ${day}
            </div>
        `;
    }
    
    calendarHTML += '</div>';
    calendarContainer.innerHTML = calendarHTML;
}

window.changeCalendarMonth = function(direction) {
    // 这里可以实现月份切换功能
    renderCalendar();
};

window.toggleCheckin = function(dateStr) {
    checkinData.calendar[dateStr] = !checkinData.calendar[dateStr];
    saveCheckinData();
    renderCalendar();
    
    if (checkinData.calendar[dateStr]) {
        showCheckinSuccess();
    }
};

// ==================== 打卡成功提示 ====================
function showCheckinSuccess() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFD1DC 0%, #FFB6C1 100%);
        color: white;
        padding: 20px 40px;
        border-radius: 30px;
        box-shadow: 0 8px 30px rgba(255, 182, 193, 0.5);
        z-index: 3000;
        font-size: 1.2rem;
        animation: popUp 0.5s ease-out;
    `;
    notification.textContent = '打卡成功！💕';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'popUp 0.5s ease-out reverse';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// ==================== 保存待办状态 ====================
function saveTodoState() {
    const todos = [];
    document.querySelectorAll('.todo-list input[type="checkbox"]').forEach(checkbox => {
        todos.push({
            text: checkbox.parentElement.textContent.trim(),
            checked: checkbox.checked
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodoState() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        try {
            const todos = JSON.parse(saved);
            document.querySelectorAll('.todo-list input[type="checkbox"]').forEach((checkbox, index) => {
                if (todos[index]) {
                    checkbox.checked = todos[index].checked;
                }
            });
        } catch (e) {
            console.error('加载待办状态失败', e);
        }
    }
}

// ==================== 本地存储 ====================
function saveCheckinData() {
    localStorage.setItem('checkinData', JSON.stringify(checkinData));
}

function loadCheckinData() {
    const saved = localStorage.getItem('checkinData');
    if (saved) {
        try {
            checkinData = JSON.parse(saved);
            displayDailyCheckins();
            loadTodoState();
        } catch (e) {
            console.error('加载打卡数据失败', e);
        }
    }
}

// 初始化时加载数据
document.addEventListener('DOMContentLoaded', loadCheckinData);



