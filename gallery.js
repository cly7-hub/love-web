// ==================== 相册模块 ====================

// 文件夹中的照片路径配置（自动读取）
const folderPhotos = [
    { id: 1, url: '3D爱心/images/1.jpg', category: 'daily', date: '2023.05.20', location: 'XX餐厅', note: '第一次一起吃烛光晚餐' },
    { id: 2, url: '3D爱心/images/2.jpg', category: 'travel', date: '2023.06.01', location: '海边', note: '第一次旅行' },
    { id: 3, url: '3D爱心/images/3.jpg', category: 'anniversary', date: '2023.03.20', location: 'XX公园', note: '正式在一起' },
    { id: 4, url: '3D爱心/images/4.jpg', category: 'food', date: '2023.07.15', location: '火锅店', note: '超辣的火锅' },
    { id: 5, url: '3D爱心/images/5.jpg', category: 'daily', date: '2023.08.10', location: '家里', note: '日常随拍' },
    { id: 6, url: '3D爱心/images/6.jpg', category: 'travel', date: '2023.09.01', location: '山顶', note: '一起看日出' }
];

// 合并后的照片数组（文件夹照片 + 上传照片）
let galleryPhotos = [];
let uploadedPhotos = [];
const MAX_PHOTOS = 30; // 最多30张照片

let currentFilter = 'all';
let currentPhotoIndex = 0;

// ==================== 初始化相册 ====================
document.addEventListener('DOMContentLoaded', function() {
    init3DBackground();
    initGallery();
    initPhotoViewer();
    init3DHeart();
    initPhotoFilters();
});

// ==================== 3D背景特效 ====================
function init3DBackground() {
    const container = document.getElementById('gallery3DBackground');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.id = 'gallery3DCanvas';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    // 粒子系统
    const particles = [];
    const particleCount = 100;
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = `rgba(255, 182, 193, ${Math.random() * 0.5 + 0.2})`;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // 绘制连线
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.strokeStyle = `rgba(255, 182, 193, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawLines();
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // 窗口大小改变时重新调整
    window.addEventListener('resize', function() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });
}

// ==================== 初始化照片墙 ====================
function initGallery() {
    const galleryWall = document.getElementById('galleryWall');
    if (!galleryWall) return;
    
    // 加载已上传的照片
    loadUploadedPhotos();
    
    // 合并照片：文件夹照片 + 上传照片（最多30张）
    mergePhotos();
    
    renderGallery();
}

// ==================== 合并照片 ====================
function mergePhotos() {
    // 从localStorage加载上传的照片
    loadUploadedPhotos();
    
    // 合并照片：先显示文件夹照片，再显示上传照片，总共最多30张
    const folderCount = folderPhotos.length;
    const uploadedCount = uploadedPhotos.length;
    
    galleryPhotos = [];
    
    // 先添加文件夹中的照片
    folderPhotos.forEach(photo => {
        galleryPhotos.push(photo);
    });
    
    // 计算还能添加多少张上传的照片
    const remainingSlots = MAX_PHOTOS - folderCount;
    
    if (remainingSlots > 0 && uploadedPhotos.length > 0) {
        // 添加上传的照片（最多填满30张）
        const photosToAdd = uploadedPhotos.slice(0, remainingSlots);
        // 复制照片对象，保留原始ID用于删除
        photosToAdd.forEach(photo => {
            galleryPhotos.push({...photo});
        });
    }
}

// ==================== 加载已上传的照片 ====================
function loadUploadedPhotos() {
    const saved = localStorage.getItem('uploadedPhotos');
    if (saved) {
        try {
            uploadedPhotos = JSON.parse(saved);
        } catch (e) {
            console.error('加载上传照片失败', e);
            uploadedPhotos = [];
        }
    } else {
        uploadedPhotos = [];
    }
}

// ==================== 保存上传的照片 ====================
function saveUploadedPhotos() {
    localStorage.setItem('uploadedPhotos', JSON.stringify(uploadedPhotos));
}

function renderGallery(filter = 'all') {
    // 先合并照片
    mergePhotos();
    
    const galleryWall = document.getElementById('galleryWall');
    galleryWall.innerHTML = '';
    
    const filteredPhotos = filter === 'all' 
        ? galleryPhotos 
        : galleryPhotos.filter(photo => photo.category === filter);
    
    // 更新照片数量显示（显示筛选后的数量）
    const countElement = document.getElementById('photoCount');
    if (countElement) {
        if (filter === 'all') {
            countElement.textContent = galleryPhotos.length;
            countElement.parentElement.innerHTML = `共 <strong>${galleryPhotos.length}</strong> 张照片（最多30张）`;
        } else {
            countElement.textContent = filteredPhotos.length;
            countElement.parentElement.innerHTML = `当前分类：<strong>${filteredPhotos.length}</strong> 张（共 ${galleryPhotos.length} 张）`;
        }
    }
    
    filteredPhotos.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-index', index);
        galleryItem.setAttribute('data-photo-id', photo.id);
        
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.note;
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/300x300?text=照片' + photo.id;
        };
        
        const overlay = document.createElement('div');
        overlay.className = 'gallery-item-overlay';
        overlay.innerHTML = `
            <p><strong>${photo.date}</strong></p>
            <p><i class="fas fa-map-marker-alt"></i> ${photo.location}</p>
            <p>${photo.note}</p>
        `;
        
        // 如果是上传的照片，添加删除按钮
        if (photo.isUploaded) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'gallery-delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255, 0, 0, 0.8);
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止触发照片查看
                deletePhoto(photo.id);
            });
            galleryItem.appendChild(deleteBtn);
            
            // 悬停显示删除按钮
            galleryItem.addEventListener('mouseenter', function() {
                deleteBtn.style.opacity = '1';
            });
            galleryItem.addEventListener('mouseleave', function() {
                deleteBtn.style.opacity = '0';
            });
        }
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(overlay);
        galleryItem.addEventListener('click', (e) => {
            // 如果点击的是删除按钮，不打开查看器
            if (!e.target.closest('.gallery-delete-btn')) {
                openPhotoViewer(index, filteredPhotos);
            }
        });
        
        galleryWall.appendChild(galleryItem);
    });
    
    // 添加滑动动画
    setTimeout(() => {
        galleryWall.classList.add('loaded');
    }, 100);
}

// ==================== 更新照片数量显示 ====================
function updatePhotoCount() {
    const countElement = document.getElementById('photoCount');
    if (countElement) {
        countElement.textContent = galleryPhotos.length;
        
        // 如果接近上限，改变颜色提示
        const statsElement = document.getElementById('galleryStats');
        if (statsElement) {
            if (galleryPhotos.length >= MAX_PHOTOS) {
                statsElement.style.color = '#ff6b6b';
            } else if (galleryPhotos.length >= MAX_PHOTOS - 5) {
                statsElement.style.color = '#ffa502';
            } else {
                statsElement.style.color = '#666';
            }
        }
    }
}

// ==================== 删除照片 ====================
function deletePhoto(photoId) {
    if (!confirm('确定要删除这张照片吗？')) {
        return;
    }
    
    // 从上传照片数组中删除
    uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
    
    // 保存到localStorage
    saveUploadedPhotos();
    
    // 重新合并和渲染
    mergePhotos();
    renderGallery(currentFilter);
    
    // 显示删除成功提示
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 30px;
        border-radius: 20px;
        z-index: 3000;
        font-size: 1rem;
        animation: popUp 0.5s ease-out;
    `;
    notification.textContent = '照片已删除';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'popUp 0.5s ease-out reverse';
        setTimeout(() => notification.remove(), 500);
    }, 1500);
}

// ==================== 照片过滤器 ====================
function initPhotoFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            currentFilter = filter;
            
            // 更新数量显示（显示筛选后的数量）
            const filteredPhotos = filter === 'all' 
                ? galleryPhotos 
                : galleryPhotos.filter(photo => photo.category === filter);
            
            const countElement = document.getElementById('photoCount');
            if (countElement) {
                countElement.textContent = filteredPhotos.length;
                if (filter !== 'all') {
                    countElement.parentElement.innerHTML = `当前分类：<strong>${countElement.textContent}</strong> 张（共 ${galleryPhotos.length} 张）`;
                } else {
                    countElement.parentElement.innerHTML = `共 <strong>${countElement.textContent}</strong> 张照片（最多30张）`;
                }
            }
            
            renderGallery(filter);
        });
    });
}

// ==================== 照片查看器 ====================
function initPhotoViewer() {
    const viewer = document.getElementById('photoViewer');
    const closeBtn = document.querySelector('.close-viewer');
    const prevBtn = document.querySelector('.viewer-nav.prev');
    const nextBtn = document.querySelector('.viewer-nav.next');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePhotoViewer);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigatePhoto(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigatePhoto(1));
    }
    
    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && viewer.classList.contains('active')) {
            closePhotoViewer();
        }
        if (e.key === 'ArrowLeft') navigatePhoto(-1);
        if (e.key === 'ArrowRight') navigatePhoto(1);
    });
}

let currentPhotoSet = [];

function openPhotoViewer(index, photos) {
    currentPhotoIndex = index;
    currentPhotoSet = photos;
    
    const viewer = document.getElementById('photoViewer');
    const img = document.getElementById('viewerImage');
    
    img.src = photos[index].url;
    img.alt = photos[index].note;
    
    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePhotoViewer() {
    const viewer = document.getElementById('photoViewer');
    viewer.classList.remove('active');
    document.body.style.overflow = '';
}

function navigatePhoto(direction) {
    if (currentPhotoSet.length === 0) return;
    
    currentPhotoIndex += direction;
    
    if (currentPhotoIndex < 0) {
        currentPhotoIndex = currentPhotoSet.length - 1;
    } else if (currentPhotoIndex >= currentPhotoSet.length) {
        currentPhotoIndex = 0;
    }
    
    const img = document.getElementById('viewerImage');
    img.src = currentPhotoSet[currentPhotoIndex].url;
    img.alt = currentPhotoSet[currentPhotoIndex].note;
}

// ==================== 优化的3D爱心 ====================
function init3DHeart() {
    const container = document.getElementById('heart3D');
    if (!container) return;
    
    // 清除可能存在的旧内容
    container.innerHTML = '';
    
    // 创建3D爱心场景
    const scene = document.createElement('div');
    scene.className = 'heart-3d-scene';
    scene.style.cssText = `
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        perspective: 1000px;
    `;
    
    // 创建多个爱心层
    const heartLayers = 12;
    const heartSize = 150;
    
    for (let i = 0; i < heartLayers; i++) {
        const heart = createHeartShape(heartSize);
        const angle = (360 / heartLayers) * i;
        const radius = 60;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const z = Math.sin((angle * Math.PI) / 180) * radius;
        
        heart.style.cssText = `
            position: absolute;
            width: ${heartSize}px;
            height: ${heartSize}px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg);
            transform-style: preserve-3d;
            animation: heartRotate 15s linear infinite;
            animation-delay: ${i * 0.2}s;
        `;
        
        scene.appendChild(heart);
    }
    
    // 添加中心旋转动画
    const animation = document.createElement('style');
    animation.textContent = `
        @keyframes heartRotate {
            0% {
                transform: translate(-50%, -50%) translateX(${Math.cos(0) * 60}px) translateZ(${Math.sin(0) * 60}px) rotateY(0deg) rotateX(0deg);
            }
            25% {
                transform: translate(-50%, -50%) translateX(${Math.cos(90 * Math.PI / 180) * 60}px) translateZ(${Math.sin(90 * Math.PI / 180) * 60}px) rotateY(90deg) rotateX(10deg);
            }
            50% {
                transform: translate(-50%, -50%) translateX(${Math.cos(180 * Math.PI / 180) * 60}px) translateZ(${Math.sin(180 * Math.PI / 180) * 60}px) rotateY(180deg) rotateX(0deg);
            }
            75% {
                transform: translate(-50%, -50%) translateX(${Math.cos(270 * Math.PI / 180) * 60}px) translateZ(${Math.sin(270 * Math.PI / 180) * 60}px) rotateY(270deg) rotateX(-10deg);
            }
            100% {
                transform: translate(-50%, -50%) translateX(${Math.cos(360 * Math.PI / 180) * 60}px) translateZ(${Math.sin(360 * Math.PI / 180) * 60}px) rotateY(360deg) rotateX(0deg);
            }
        }
        
        .heart-3d-scene {
            animation: sceneRotate 20s linear infinite;
        }
        
        @keyframes sceneRotate {
            0% {
                transform: rotateY(0deg);
            }
            100% {
                transform: rotateY(360deg);
            }
        }
    `;
    document.head.appendChild(animation);
    
    container.appendChild(scene);
}

function createHeartShape(size) {
    const heart = document.createElement('div');
    heart.className = 'heart-shape';
    
    // 使用CSS创建爱心形状
    heart.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        position: relative;
        filter: drop-shadow(0 0 15px rgba(255, 105, 180, 0.6));
    `;
    
    // 创建爱心SVG，使用渐变填充
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 24 24');
    
    // 定义渐变
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', `heartGradient-${Math.random().toString(36).substr(2, 9)}`);
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#FF69B4');
    stop1.setAttribute('stop-opacity', '1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#FF1493');
    stop2.setAttribute('stop-opacity', '0.9');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z');
    path.setAttribute('fill', `url(#${gradient.getAttribute('id')})`);
    path.style.filter = 'drop-shadow(0 0 8px rgba(255, 105, 180, 0.8))';
    
    svg.appendChild(path);
    heart.appendChild(svg);
    
    // 添加多层光晕效果
    for (let i = 0; i < 3; i++) {
        const glow = document.createElement('div');
        const glowSize = size * (1.2 + i * 0.15);
        const opacity = 0.4 - i * 0.1;
        glow.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${glowSize}px;
            height: ${glowSize}px;
            background: radial-gradient(circle, rgba(255,105,180,${opacity}) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: pulseGlow ${2 + i * 0.5}s ease-in-out infinite;
            animation-delay: ${i * 0.3}s;
        `;
        heart.appendChild(glow);
    }
    
    // 添加脉冲动画
    if (!document.getElementById('heart-pulse-style')) {
        const style = document.createElement('style');
        style.id = 'heart-pulse-style';
        style.textContent = `
            @keyframes pulseGlow {
                0%, 100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0.4;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.1);
                    opacity: 0.6;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    return heart;
}

// ==================== 上传照片功能 ====================
document.getElementById('uploadPhoto')?.addEventListener('click', function() {
    // 先合并照片，检查当前总数
    mergePhotos();
    
    const currentTotal = galleryPhotos.length;
    
    // 如果已达到30张，提示用户
    if (currentTotal >= MAX_PHOTOS) {
        alert(`照片数量已达到上限（${MAX_PHOTOS}张），请删除部分照片后再上传。`);
        return;
    }
    
    // 计算还能上传多少张
    const remainingSlots = MAX_PHOTOS - currentTotal;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    
    input.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        // 限制选择数量
        if (files.length > remainingSlots) {
            alert(`最多还能上传 ${remainingSlots} 张照片，已自动选择前 ${remainingSlots} 张。`);
            files = files.slice(0, remainingSlots);
        }
        
        let uploadCount = 0;
        let errorCount = 0;
        
        files.forEach((file, index) => {
            // 检查文件大小（限制10MB）
            if (file.size > 10 * 1024 * 1024) {
                errorCount++;
                console.warn(`照片 ${file.name} 超过10MB，已跳过`);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const newPhoto = {
                    id: Date.now() + index, // 使用时间戳确保ID唯一
                    url: event.target.result, // Base64格式
                    category: 'daily',
                    date: new Date().toLocaleDateString('zh-CN'),
                    location: '未设置',
                    note: file.name.replace(/\.[^/.]+$/, ''), // 去掉文件扩展名
                    isUploaded: true // 标记为上传的照片
                };
                
                // 添加到上传照片数组
                uploadedPhotos.push(newPhoto);
                uploadCount++;
                
                // 如果所有文件都处理完成
                if (uploadCount + errorCount === files.length) {
                    // 保存到localStorage
                    saveUploadedPhotos();
                    
                    // 重新合并照片
                    mergePhotos();
                    
                    // 重新渲染相册
                    renderGallery(currentFilter);
                    
                    // 显示上传成功提示
                    if (uploadCount > 0) {
                        showUploadSuccess(uploadCount);
                    }
                    if (errorCount > 0) {
                        alert(`${errorCount} 张照片上传失败（可能文件过大）`);
                    }
                }
            };
            
            reader.onerror = function() {
                errorCount++;
                console.error(`读取照片 ${file.name} 失败`);
                
                if (uploadCount + errorCount === files.length) {
                    if (uploadCount > 0) {
                        saveUploadedPhotos();
                        mergePhotos();
                        renderGallery(currentFilter);
                        showUploadSuccess(uploadCount);
                    }
                    if (errorCount > 0) {
                        alert(`${errorCount} 张照片上传失败`);
                    }
                }
            };
            
            reader.readAsDataURL(file);
        });
    });
    
    input.click();
});

// ==================== 显示上传成功提示 ====================
function showUploadSuccess(count) {
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
    notification.innerHTML = `成功上传 ${count} 张照片！💕`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'popUp 0.5s ease-out reverse';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// ==================== 照片墙滑动效果 ====================
function addSwipeEffect() {
    const galleryWall = document.getElementById('galleryWall');
    if (!galleryWall) return;
    
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;
    
    galleryWall.addEventListener('mousedown', function(e) {
        isDown = true;
        startX = e.pageX - galleryWall.offsetLeft;
        scrollLeft = galleryWall.scrollLeft;
        galleryWall.style.cursor = 'grabbing';
    });
    
    galleryWall.addEventListener('mouseleave', function() {
        isDown = false;
        galleryWall.style.cursor = 'grab';
    });
    
    galleryWall.addEventListener('mouseup', function() {
        isDown = false;
        galleryWall.style.cursor = 'grab';
    });
    
    galleryWall.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - galleryWall.offsetLeft;
        const walk = (x - startX) * 2;
        galleryWall.scrollLeft = scrollLeft - walk;
    });
    
    // 触摸事件支持
    let touchStartX = 0;
    let touchScrollLeft = 0;
    
    galleryWall.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].pageX - galleryWall.offsetLeft;
        touchScrollLeft = galleryWall.scrollLeft;
    });
    
    galleryWall.addEventListener('touchmove', function(e) {
        const x = e.touches[0].pageX - galleryWall.offsetLeft;
        const walk = (x - touchStartX) * 2;
        galleryWall.scrollLeft = touchScrollLeft - walk;
    });
}

// 初始化滑动效果
document.addEventListener('DOMContentLoaded', addSwipeEffect);

