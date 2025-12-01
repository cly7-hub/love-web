// ==================== 时间线模块 ====================

// 时间线数据
let timelineData = [
    {
        id: 1,
        date: '2023.02.14',
        title: '第一次遇见',
        text: '在咖啡店门口，你撞掉了我的书，也撞进了我的心',
        image: 'https://via.placeholder.com/300x200',
        location: 'XX咖啡店',
        type: 'meet'
    },
    {
        id: 2,
        date: '2023.03.20',
        title: '正式在一起',
        text: 'XX公园的樱花树下，我们许下承诺',
        image: 'https://via.placeholder.com/300x200',
        location: 'XX公园',
        type: 'together'
    },
    {
        id: 3,
        date: '2023.06.01',
        title: '第一次旅行',
        text: '一起赶高铁、吃了超辣的火锅、在海边看日出',
        image: 'https://via.placeholder.com/300x200',
        location: '海边城市',
        type: 'travel'
    }
];

// ==================== 初始化时间线 ====================
document.addEventListener('DOMContentLoaded', function() {
    renderTimeline();
    initTimelineAddNode();
    initTimelineAnimations();
});

// ==================== 渲染时间线 ====================
function renderTimeline() {
    const container = document.querySelector('.timeline-container');
    if (!container) return;
    
    // 清除时间线内容，但保留添加按钮
    const addButton = document.querySelector('.btn-add-node');
    const timelineItems = container.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => item.remove());
    
    timelineData.forEach((item, index) => {
        const timelineItem = createTimelineItem(item, index);
        if (addButton) {
            container.insertBefore(timelineItem, addButton);
        } else {
            container.appendChild(timelineItem);
        }
    });
}

// ==================== 创建时间线节点 ====================
function createTimelineItem(item, index) {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.setAttribute('data-date', item.date);
    timelineItem.setAttribute('data-id', item.id);
    
    // 节点图标
    const node = document.createElement('div');
    node.className = 'timeline-node';
    
    // 根据类型设置图标
    let iconClass = 'fas fa-heart';
    switch(item.type) {
        case 'meet':
            iconClass = 'fas fa-user-friends';
            break;
        case 'together':
            iconClass = 'fas fa-heart';
            break;
        case 'travel':
            iconClass = 'fas fa-plane';
            break;
        case 'birthday':
            iconClass = 'fas fa-birthday-cake';
            break;
        default:
            iconClass = 'fas fa-star';
    }
    
    node.innerHTML = `<i class="${iconClass}"></i>`;
    node.addEventListener('click', () => expandTimelineItem(item.id));
    
    // 内容区域
    const content = document.createElement('div');
    content.className = 'timeline-content';
    
    content.innerHTML = `
        <h3>${item.title}</h3>
        <p class="timeline-date">${item.date}</p>
        <p class="timeline-text">${item.text}</p>
        ${item.image ? `
            <div class="timeline-image">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x200'">
            </div>
        ` : ''}
        <p class="timeline-location"><i class="fas fa-map-marker-alt"></i> ${item.location}</p>
        <button class="btn-edit-timeline" onclick="editTimelineItem(${item.id})" style="margin-top: 10px; padding: 5px 15px; background: #B3E5FC; border: none; border-radius: 15px; cursor: pointer;">编辑</button>
        <button class="btn-delete-timeline" onclick="deleteTimelineItem(${item.id})" style="margin-top: 10px; padding: 5px 15px; background: #ffcccc; border: none; border-radius: 15px; cursor: pointer; margin-left: 10px;">删除</button>
    `;
    
    timelineItem.appendChild(node);
    timelineItem.appendChild(content);
    
    // 添加入场动画
    timelineItem.style.opacity = '0';
    timelineItem.style.transform = 'translateY(30px)';
    setTimeout(() => {
        timelineItem.style.transition = 'all 0.6s ease-out';
        timelineItem.style.opacity = '1';
        timelineItem.style.transform = 'translateY(0)';
    }, index * 200);
    
    return timelineItem;
}

// ==================== 展开/收起时间线节点 ====================
function expandTimelineItem(id) {
    const item = document.querySelector(`.timeline-item[data-id="${id}"]`);
    if (!item) return;
    
    const content = item.querySelector('.timeline-content');
    const node = item.querySelector('.timeline-node');
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        node.style.transform = 'translateX(-50%) scale(1)';
    } else {
        // 先收起其他节点
        document.querySelectorAll('.timeline-content.expanded').forEach(c => {
            c.classList.remove('expanded');
            c.parentElement.querySelector('.timeline-node').style.transform = 'translateX(-50%) scale(1)';
        });
        
        content.classList.add('expanded');
        node.style.transform = 'translateX(-50%) scale(1.3)';
        
        // 滚动到该节点
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ==================== 添加新节点 ====================
function initTimelineAddNode() {
    const addButton = document.getElementById('addTimelineNode');
    if (!addButton) return;
    
    addButton.addEventListener('click', function() {
        showTimelineForm();
    });
}

function showTimelineForm() {
    const form = document.createElement('div');
    form.className = 'timeline-form-modal';
    form.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>添加时间线节点</h2>
            <form id="timelineForm">
                <label>
                    日期：
                    <input type="date" name="date" required>
                </label>
                <label>
                    标题：
                    <input type="text" name="title" placeholder="如：第一次旅行" required>
                </label>
                <label>
                    描述：
                    <textarea name="text" placeholder="描述这个重要时刻..." required></textarea>
                </label>
                <label>
                    地点：
                    <input type="text" name="location" placeholder="如：XX公园">
                </label>
                <label>
                    图片URL：
                    <input type="url" name="image" placeholder="图片链接（可选）">
                </label>
                <label>
                    类型：
                    <select name="type">
                        <option value="meet">遇见</option>
                        <option value="together">在一起</option>
                        <option value="travel">旅行</option>
                        <option value="birthday">生日</option>
                        <option value="other">其他</option>
                    </select>
                </label>
                <button type="submit" class="btn-primary">添加</button>
            </form>
        </div>
    `;
    
    form.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    document.body.appendChild(form);
    
    // 关闭按钮
    form.querySelector('.close-modal').addEventListener('click', () => {
        form.remove();
    });
    
    // 表单提交
    form.querySelector('#timelineForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const date = formData.get('date');
        const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '.');
        
        const newItem = {
            id: timelineData.length + 1,
            date: formattedDate,
            title: formData.get('title'),
            text: formData.get('text'),
            location: formData.get('location') || '未设置',
            image: formData.get('image') || '',
            type: formData.get('type')
        };
        
        timelineData.push(newItem);
        timelineData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        renderTimeline();
        form.remove();
        
        // 保存到本地存储
        saveTimelineData();
    });
    
    // 点击外部关闭
    form.addEventListener('click', function(e) {
        if (e.target === form) {
            form.remove();
        }
    });
}

// ==================== 编辑时间线节点 ====================
window.editTimelineItem = function(id) {
    const item = timelineData.find(t => t.id === id);
    if (!item) return;
    
    const form = document.createElement('div');
    form.className = 'timeline-form-modal';
    form.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>编辑时间线节点</h2>
            <form id="editTimelineForm">
                <label>
                    日期：
                    <input type="text" name="date" value="${item.date}" required>
                </label>
                <label>
                    标题：
                    <input type="text" name="title" value="${item.title}" required>
                </label>
                <label>
                    描述：
                    <textarea name="text" required>${item.text}</textarea>
                </label>
                <label>
                    地点：
                    <input type="text" name="location" value="${item.location}">
                </label>
                <label>
                    图片URL：
                    <input type="url" name="image" value="${item.image || ''}">
                </label>
                <button type="submit" class="btn-primary">保存</button>
            </form>
        </div>
    `;
    
    form.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    document.body.appendChild(form);
    
    form.querySelector('.close-modal').addEventListener('click', () => form.remove());
    
    form.querySelector('#editTimelineForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        Object.assign(item, {
            date: formData.get('date'),
            title: formData.get('title'),
            text: formData.get('text'),
            location: formData.get('location'),
            image: formData.get('image')
        });
        
        timelineData.sort((a, b) => new Date(a.date) - new Date(b.date));
        renderTimeline();
        saveTimelineData();
        form.remove();
    });
    
    form.addEventListener('click', function(e) {
        if (e.target === form) form.remove();
    });
};

// ==================== 删除时间线节点 ====================
window.deleteTimelineItem = function(id) {
    if (confirm('确定要删除这个时间线节点吗？')) {
        timelineData = timelineData.filter(t => t.id !== id);
        renderTimeline();
        saveTimelineData();
    }
};

// ==================== 时间线动画 ====================
function initTimelineAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
}

// ==================== 本地存储 ====================
function saveTimelineData() {
    localStorage.setItem('timelineData', JSON.stringify(timelineData));
}

function loadTimelineData() {
    const saved = localStorage.getItem('timelineData');
    if (saved) {
        try {
            timelineData = JSON.parse(saved);
            renderTimeline();
        } catch (e) {
            console.error('加载时间线数据失败', e);
        }
    }
}

// 页面加载时读取本地数据
document.addEventListener('DOMContentLoaded', loadTimelineData);

// ==================== 时间线节点悬停效果 ====================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.timeline-node').forEach(node => {
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-50%) scale(1.2) rotate(15deg)';
        });
        
        node.addEventListener('mouseleave', function() {
            if (!this.parentElement.querySelector('.timeline-content').classList.contains('expanded')) {
                this.style.transform = 'translateX(-50%) scale(1) rotate(0deg)';
            }
        });
    });
});



