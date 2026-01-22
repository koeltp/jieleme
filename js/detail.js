// 详情页脚本
document.addEventListener('DOMContentLoaded', function() {
  // 获取URL参数中的id
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = urlParams.get('id') || '001';
  
  // 加载征婚信息详情
  loadProfileDetail(profileId);
  
  // 添加自定义弹窗点击外部关闭功能
  document.addEventListener('click', function(e) {
    const modal = document.getElementById('customModal');
    if (modal && modal.style.display === 'flex' && e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// 加载征婚信息详情
function loadProfileDetail(profileId) {
  const loadingElement = document.getElementById('loading');
  const detailContainer = document.getElementById('profile-detail');
  const notFoundElement = document.getElementById('not-found');
  
  console.log('加载征婚信息详情，ID:', profileId);
  
  // 从合并后的profiles.json文件中查找
  const fileName = 'data/profiles.json';
  console.log('从合并文件加载:', fileName);
  
  fetch(fileName)
    .then(response => {
      if (!response.ok) {
        throw new Error('网络响应异常');
      }
      return response.json();
    })
    .then(profilesData => {
      // 查找对应ID的profile
      const profile = profilesData.find(p => p.id === profileId);
      
      if (profile) {
        // 找到匹配的profile
        loadingElement.style.display = 'none';
        detailContainer.innerHTML = createDetailPage(profile);
        initDetailInteractions(profile);
        console.log('找到征婚信息:', profile.name);
      } else {
        // 未找到
        loadingElement.style.display = 'none';
        notFoundElement.style.display = 'block';
        console.log('未找到征婚信息，ID:', profileId);
      }
    })
    .catch(error => {
      // 加载失败
      console.error('加载文件失败:', error);
      loadingElement.style.display = 'none';
      notFoundElement.style.display = 'block';
    });
}

// 创建详情页面HTML（按新布局）
function createDetailPage(profile) {
  // 检查是否有完整详细信息
  const fullDetails = profile.fullDetails || {
    tagline: `${profile.name}的征婚详情`,
    aboutMe: profile.details.map(d => d.text),
    // 将tags内容添加到关于我
    tags: profile.tags.map(tag => tag.text),
    expectations: ["请直接联系了解详细信息"],
    notImportant: ["请直接联系了解详细信息"],
    avoid: ["请直接联系了解详细信息"],
    contactInfo: {
      wechat: "请通过平台联系"
    },
    // 添加默认照片数据
    travelPhotos: ["images/travel1.jpg", "images/travel2.jpg", "images/travel3.jpg"]
  };
  
  // 合并关于我内容和标签
  const aboutMeWithTags = [
    ...fullDetails.aboutMe
  ];

  return `
    <header class="page-header" style="margin-bottom: 40px;">
      <div class="header-content">
        <h1 class="tagline">${fullDetails.tagline}</h1>
        <p class="description">${profile.occupation} · ${profile.age}岁 · ${profile.gender === 'male' ? '男性' : '女性'} · ${profile.location}</p>
        ${profile.quote ? `<div class="quote-text">"${profile.quote}"</div>` : ''}
      </div>
    </header>

    <div class="detail-content">
      <!-- 上半部分：关于我和期待的你并列 -->
      <div class="detail-top-row">
        <div class="detail-section">
          <h3 class="section-title"><i class="fas fa-user-circle"></i> 关于我</h3>
          <ul class="detail-list">
            ${aboutMeWithTags.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
          </ul>
          ${profile.tags && profile.tags.length > 0 ? `
          <div class="tags-section">
            <h4 class="tags-label"><i class="fas fa-tag"></i> 个人标签</h4>
            <div class="tags-container">
              ${profile.tags.map(tag => `<span class="tag ${tag.class}">${tag.text}</span>`).join('')}
            </div>
          </div>
          ` : ''}
        </div>

        <div class="detail-section">
          <h3 class="section-title"><i class="fas fa-heart"></i> 期待的你</h3>
          <ul class="detail-list">
            ${fullDetails.expectations.map(item => `<li><i class="fas fa-star"></i> ${item}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- 中间部分：我的网站项目单独一行 -->
      ${fullDetails.websites ? `
      <div class="websites-section detail-section">
        <h3 class="section-title"><i class="fas fa-globe"></i> 我的网站项目</h3>
        <div class="websites-grid">
          ${fullDetails.websites.map(site => `
            <div class="website-card">
              <h4>${site.name}</h4>
              <p>${site.description}</p>
              <a href="${site.url}" target="_blank" class="website-link">${site.url}</a>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- 靓照幻灯片 -->
      ${fullDetails.travelPhotos && fullDetails.travelPhotos.length > 0 ? `
      <div class="detail-section">
        <h3 class="section-title"><i class="fas fa-images"></i> 靓照</h3>
        <div class="photo-slider">
          <div class="slider-container">
            ${fullDetails.travelPhotos.map((photo, index) => `
              <div class="slide ${index === 0 ? 'active' : ''}">
                <img src="${photo}" alt="照片 ${index + 1}" class="slide-photo" data-index="${index}">
              </div>
            `).join('')}
            <button class="slider-btn prev-btn" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); z-index: 10;">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="slider-btn next-btn" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); z-index: 10;">
              <i class="fas fa-chevron-right"></i>
            </button>
            <div class="slide-dots-container">
              ${fullDetails.travelPhotos.map((_, index) => `
                <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- 共同活动（如果有） -->
      ${fullDetails.togetherActivities ? `
      <div class="together-section detail-section">
        <h3 class="section-title"><i class="fas fa-handshake"></i> 我们可以一起</h3>
        <div class="together-grid">
          ${fullDetails.togetherActivities.map(activity => `
            <div class="together-card">
              <i class="${activity.icon}"></i>
              <h4>${activity.title}</h4>
              <p>${activity.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- 下半部分：不介意的细节和希望避免并列 -->
      <div class="detail-bottom-row">
        <div class="detail-section">
          <h3 class="section-title"><i class="fas fa-thumbs-up"></i> 不介意的细节</h3>
          <ul class="detail-list">
            ${fullDetails.notImportant.map(item => `<li><i class="fas fa-check-circle"></i> ${item}</li>`).join('')}
          </ul>
        </div>

        <div class="detail-section">
          <h3 class="section-title"><i class="fas fa-times-circle"></i> 希望避免</h3>
          <ul class="detail-list">
            ${fullDetails.avoid.map(item => `<li><i class="fas fa-ban"></i> ${item}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- 最下面：联系方式 -->
      <div class="contact-section">
        <h3 class="contact-title"><i class="fas fa-envelope"></i> 期待与你相遇</h3>
        <div class="contact-content">
          <p>如果你觉得我们可能合适，欢迎通过微信联系我，交换照片和更多故事。</p>
          <div class="wechat-qr-code">
            <img src="${fullDetails.contactInfo.wechat}" alt="微信二维码" class="qr-code-image">
            <p class="qr-code-hint">扫描二维码添加微信</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图片放大模态框 -->
    <div id="imageModal" class="modal">
      <span class="close-modal">&times;</span>
      <div class="modal-navigation">
        <button class="modal-nav prev" id="prevPhoto"><i class="fas fa-chevron-left"></i></button>
        <img id="modalImage" class="modal-content" src="" alt="放大的照片">
        <button class="modal-nav next" id="nextPhoto"><i class="fas fa-chevron-right"></i></button>
      </div>
      <div class="modal-caption"></div>
    </div>
  `;
}

// 初始化详情页交互
function initDetailInteractions(profile) {
  const fullDetails = profile.fullDetails;
  
  // 幻灯片功能
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  let currentSlide = 0;
  
  // 幻灯片导航
  function showSlide(n) {
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    currentSlide = n;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  
  // 上一张
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });
  }
  
  // 下一张
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });
  }
  
  // 点击圆点跳转
  dots.forEach(dot => {
    dot.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      showSlide(index);
    });
  });
  
  // 自动轮播
  if (slides.length > 1) {
    let slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
    
    // 鼠标悬停时暂停自动轮播
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
      });
      
      sliderContainer.addEventListener('mouseleave', () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
          showSlide(currentSlide + 1);
        }, 5000);
      });
    }
  }
  
  // 图片放大功能
  const slidePhotos = document.querySelectorAll('.slide-photo');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeModalBtn = document.querySelector('.close-modal');
  const modalPrevBtn = document.getElementById('prevPhoto');
  const modalNextBtn = document.getElementById('nextPhoto');
  const modalCaption = document.querySelector('.modal-caption');
  
  let currentPhotoIndex = 0;
  let photoUrls = [];
  
  if (fullDetails && fullDetails.travelPhotos && fullDetails.travelPhotos.length > 0) {
    photoUrls = fullDetails.travelPhotos;
  }
  
  // 为每张幻灯片照片添加点击事件
  slidePhotos.forEach(photo => {
    photo.addEventListener('click', function() {
      currentPhotoIndex = parseInt(this.getAttribute('data-index'));
      openModal(currentPhotoIndex);
    });
  });
  
  function openModal(index) {
    if (photoUrls.length === 0) return;
    
    currentPhotoIndex = index;
    modal.style.display = 'flex';
    modalImg.src = photoUrls[currentPhotoIndex];
    modalCaption.textContent = `照片 ${currentPhotoIndex + 1} / ${photoUrls.length}`;
    document.body.style.overflow = 'hidden';
    
    // 更新导航按钮状态
    updateNavButtons();
  }
  
  function updateNavButtons() {
    if (modalPrevBtn) {
      if (currentPhotoIndex > 0) {
        modalPrevBtn.disabled = false;
        modalPrevBtn.classList.remove('disabled');
      } else {
        modalPrevBtn.disabled = true;
        modalPrevBtn.classList.add('disabled');
      }
    }
    if (modalNextBtn) {
      if (currentPhotoIndex < photoUrls.length - 1) {
        modalNextBtn.disabled = false;
        modalNextBtn.classList.remove('disabled');
      } else {
        modalNextBtn.disabled = true;
        modalNextBtn.classList.add('disabled');
      }
    }
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
      closeModal();
    });
  }
  
  if (modalPrevBtn) {
    modalPrevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!this.disabled && currentPhotoIndex > 0) {
        currentPhotoIndex--;
        modalImg.src = photoUrls[currentPhotoIndex];
        modalCaption.textContent = `照片 ${currentPhotoIndex + 1} / ${photoUrls.length}`;
        updateNavButtons();
      }
    });
  }
  
  if (modalNextBtn) {
    modalNextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (!this.disabled && currentPhotoIndex < photoUrls.length - 1) {
        currentPhotoIndex++;
        modalImg.src = photoUrls[currentPhotoIndex];
        modalCaption.textContent = `照片 ${currentPhotoIndex + 1} / ${photoUrls.length}`;
        updateNavButtons();
      }
    });
  }
  
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
  
  // ESC键关闭
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
    
    // 左右箭头切换照片
    if (modal.style.display === 'flex') {
      if (e.key === 'ArrowLeft' && currentPhotoIndex > 0) {
        currentPhotoIndex--;
        modalImg.src = photoUrls[currentPhotoIndex];
        modalCaption.textContent = `照片 ${currentPhotoIndex + 1} / ${photoUrls.length}`;
        updateNavButtons();
      } else if (e.key === 'ArrowRight' && currentPhotoIndex < photoUrls.length - 1) {
        currentPhotoIndex++;
        modalImg.src = photoUrls[currentPhotoIndex];
        modalCaption.textContent = `照片 ${currentPhotoIndex + 1} / ${photoUrls.length}`;
        updateNavButtons();
      }
    }
  });
  
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

