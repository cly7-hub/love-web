// ==================== 愿望清单模块 ====================

// 愿望清单数据
let wishlistData = {
    short: [
        {
            id: 1,
            title: '一起去云南旅行',
            description: '打卡大理古城、玉龙雪山，住洱海边的民宿',
            date: '预计 2024.08',
            image: 'https://via.placeholder.com/300x200',
            status: 'pending',
            category: 'travel'
        },
        {
            id: 2,
            title: '一起看演唱会',
            description: '去看最爱的歌手的演唱会',
            date: '预计 2024.06',
            status: 'in-progress',
            category: 'entertainment'
        }
    ],
    long: [],
    travel: []
};

// ==================== 初始化愿望清单 ====================
document.addEventListener('DOMContentLoaded', function() {
    initWishlistTabs();
    initWishlistCards();
    initAddWish();
    loadWishlistData();
});

// ==================== 愿望清单Tab切换 ====================
function initWishlistTabs() {
    document.querySelectorAll('.wish-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // 移除所有active
            document.querySelectorAll('.wish-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应分类的愿望
            renderWishlist(category);
        });
    });
}

// ==================== 渲染愿望清单 ====================
function renderWishlist(category) {
    const grid = document.querySelector('.wishlist-grid');
    if (!grid) return;
    
    const wishes = wishlistData[category] || [];
    grid.innerHTML = '';
    
    wishes.forEach(wish => {
        const card = createWishCard(wish);
        grid.appendChild(card);
    });
    
    // 如果为空，显示提示
    if (wishes.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">
                <i class="fas fa-star" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                <p>还没有愿望哦，快去添加吧～</p>
            </div>
        `;
    }
}

// ==================== 创建愿望卡片 ====================
function createWishCard(wish) {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.setAttribute('data-id', wish.id);
    card.setAttribute('data-status', wish.status);
    
    const statusText = {
        'pending': '未完成',
        'in-progress': '进行中',
        'completed': '✓ 已实现'
    };
    
    const statusClass = wish.status === 'completed' ? 'completed' : '';
    
    card.innerHTML = `
        <div class="wish-header">
            <h3>${wish.title}</h3>
            <span class="wish-status ${statusClass}">${statusText[wish.status]}</span>
        </div>
        <p>${wish.description}</p>
        <p class="wish-date">${wish.date}</p>
        ${wish.image ? `
            <div class="wish-image">
                <img src="${wish.image}" alt="${wish.title}" onerror="this.style.display='none'">
            </div>
        ` : ''}
        ${wish.status === 'completed' ? '<div class="wish-badge">✓</div>' : ''}
        <div class="wish-actions" style="margin-top: 15px; display: flex; gap: 10px;">
            <button class="btn-wish-action" onclick="changeWishStatus(${wish.id}, 'in-progress')" style="padding: 5px 15px; background: #B3E5FC; border: none; border-radius: 15px; cursor: pointer;">进行中</button>
            <button class="btn-wish-action" onclick="changeWishStatus(${wish.id}, 'completed')" style="padding: 5px 15px; background: #C8E6C9; border: none; border-radius: 15px; cursor: pointer;">已完成</button>
            <button class="btn-wish-action" onclick="deleteWish(${wish.id})" style="padding: 5px 15px; background: #ffcccc; border: none; border-radius: 15px; cursor: pointer;">删除</button>
        </div>
    `;
    
    // 添加拖拽功能
    card.draggable = true;
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('drop', handleDrop);
    card.addEventListener('dragend', handleDragEnd);
    
    return card;
}

// ==================== 拖拽功能 ====================
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
}

function handleDragOver(e) {
    e.preventDefault();
    if (this !== draggedElement) {
        this.style.borderTop = '3px solid #FF69B4';
    }
}

function handleDrop(e) {
    e.preventDefault();
    this.style.borderTop = '';
    if (this !== draggedElement && this.parentElement === draggedElement.parentElement) {
        const allCards = Array.from(this.parentElement.children);
        const draggedIndex = allCards.indexOf(draggedElement);
        const targetIndex = allCards.indexOf(this);
        
        if (draggedIndex < targetIndex) {
            this.parentElement.insertBefore(draggedElement, this.nextSibling);
        } else {
            this.parentElement.insertBefore(draggedElement, this);
        }
    }
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    document.querySelectorAll('.wish-card').forEach(card => {
        card.style.borderTop = '';
    });
}

// ==================== 修改愿望状态 ====================
window.changeWishStatus = function(id, status) {
    let wish = null;
    let category = null;
    
    // 找到愿望所在的分类
    for (let cat in wishlistData) {
        const index = wishlistData[cat].findIndex(w => w.id === id);
        if (index !== -1) {
            wish = wishlistData[cat][index];
            category = cat;
            wish.status = status;
            break;
        }
    }
    
    if (wish && category) {
        saveWishlistData();
        renderWishlist(category);
        
        if (status === 'completed') {
            showWishCompleteAnimation();
        }
    }
};

// ==================== 删除愿望 ====================
window.deleteWish = function(id) {
    if (!confirm('确定要删除这个愿望吗？')) return;
    
    for (let cat in wishlistData) {
        wishlistData[cat] = wishlistData[cat].filter(w => w.id !== id);
    }
    
    saveWishlistData();
    
    // 重新渲染当前激活的分类
    const activeTab = document.querySelector('.wish-tab.active');
    if (activeTab) {
        const category = activeTab.getAttribute('data-category');
        renderWishlist(category);
    }
};

// ==================== 添加愿望 ====================
function initAddWish() {
    const addBtn = document.getElementById('addWish');
    if (!addBtn) return;
    
    addBtn.addEventListener('click', function() {
        showAddWishForm();
    });
}

function showAddWishForm() {
    const form = document.createElement('div');
    form.className = 'wish-form-modal';
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
    
    form.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>添加愿望</h2>
            <form id="wishForm">
                <label>
                    标题：
                    <input type="text" name="title" placeholder="如：一起去云南旅行" required>
                </label>
                <label>
                    描述：
                    <textarea name="description" placeholder="描述这个愿望..." required></textarea>
                </label>
                <label>
                    预计完成时间：
                    <input type="text" name="date" placeholder="如：预计 2024.08">
                </label>
                <label>
                    图片URL：
                    <input type="url" name="image" placeholder="图片链接（可选）">
                </label>
                <label>
                    分类：
                    <select name="category" required>
                        <option value="short">短期愿望</option>
                        <option value="long">长期愿望</option>
                        <option value="travel">旅行清单</option>
                    </select>
                </label>
                <button type="submit" class="btn-primary">添加</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(form);
    
    // 关闭按钮
    form.querySelector('.close-modal').addEventListener('click', () => form.remove());
    
    // 表单提交
    form.querySelector('#wishForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const category = formData.get('category');
        
        const newWish = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date') || '未设置',
            image: formData.get('image') || '',
            status: 'pending',
            category: formData.get('category') === 'travel' ? 'travel' : ''
        };
        
        wishlistData[category].push(newWish);
        saveWishlistData();
        
        // 切换到对应的分类并刷新
        const tab = document.querySelector(`.wish-tab[data-category="${category}"]`);
        if (tab) {
            tab.click();
        } else {
            renderWishlist(category);
        }
        
        form.remove();
    });
    
    // 点击外部关闭
    form.addEventListener('click', function(e) {
        if (e.target === form) form.remove();
    });
}

// ==================== 愿望完成动画 ====================
function showWishCompleteAnimation() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 3000;
    `;
    
    // 创建彩色纸屑
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${['#FF69B4', '#B3E5FC', '#FFD700', '#FFB6C1'][Math.floor(Math.random() * 4)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confettiFall ${Math.random() * 2 + 1}s ease-out forwards;
        `;
        confetti.appendChild(piece);
    }
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 2000);
    
    // 添加动画样式
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==================== 初始化愿望卡片 ====================
function initWishlistCards() {
    const activeTab = document.querySelector('.wish-tab.active');
    if (activeTab) {
        const category = activeTab.getAttribute('data-category');
        renderWishlist(category);
    }
}

// ==================== 本地存储 ====================
function saveWishlistData() {
    localStorage.setItem('wishlistData', JSON.stringify(wishlistData));
}

function loadWishlistData() {
    const saved = localStorage.getItem('wishlistData');
    if (saved) {
        try {
            wishlistData = JSON.parse(saved);
            initWishlistCards();
        } catch (e) {
            console.error('加载愿望清单数据失败', e);
        }
    }
}



