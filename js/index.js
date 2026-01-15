// 从JSON文件加载征婚信息
document.addEventListener('DOMContentLoaded', function() {
  // 加载征婚信息
  loadProfiles();
  
  // 绑定筛选按钮事件
  document.getElementById('apply-filters').addEventListener('click', applyFilters);
  document.getElementById('reset-filters').addEventListener('click', resetFilters);
  
  // 为分页按钮添加点击事件
  const paginationBtns = document.querySelectorAll('.pagination-btn:not(.active)');
  paginationBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      alert('这是一个示例页面，实际开发中这里会加载对应页码的内容。');
    });
  });
});

// 加载征婚信息
function loadProfiles() {
  const loadingElement = document.getElementById('loading');
  const profilesGrid = document.getElementById('profiles-grid');
  
  // 从profiles.json加载数据
  fetch('data/profiles.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('网络响应异常');
      }
      return response.json();
    })
    .then(profilesData => {
      // 清空加载提示
      profilesGrid.innerHTML = '';
      
      // 生成征婚卡片
      profilesData.forEach(profile => {
        const profileCard = createProfileCard(profile);
        profilesGrid.appendChild(profileCard);
      });
      
      // 更新数量
      updateProfileCount();
      
      // 为所有查看详情按钮添加点击事件（处理没有detailUrl的情况）
      const viewButtons = document.querySelectorAll('.btn-view:not([href*="detail.html?id=001"])');
      viewButtons.forEach(button => {
        if (button.getAttribute('href') === '#') {
          button.addEventListener('click', function(e) {
            e.preventDefault();
            const profileId = this.getAttribute('data-id');
            // 跳转到默认详情页
            window.location.href = `detail.html?id=${profileId}`;
          });
        }
      });
    })
    .catch(error => {
      console.error('加载征婚信息失败:', error);
      profilesGrid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-circle"></i>
          <h3>加载征婚信息失败</h3>
          <p>请刷新页面重试</p>
        </div>
      `;
    })
    .finally(() => {
      loadingElement.style.display = 'none';
    });
}

// 创建征婚卡片
function createProfileCard(profile) {
  const card = document.createElement('div');
  card.className = 'profile-card';
  
  // 确定详情链接
  let detailLink;
  if (profile.detailUrl && profile.detailUrl !== '#') {
    // 如果有指定的detailUrl，使用它
    detailLink = profile.detailUrl;
  } else {
    // 否则使用默认的detail.html，并带上ID参数
    detailLink = `detail.html?id=${profile.id}`;
  }
  
  // 构建卡片HTML
  card.innerHTML = `
    <div class="profile-header ${profile.headerClass}">
      <div class="profile-id">${profile.id}</div>
      <h3 class="profile-name">${profile.name}</h3>
      <div class="profile-age">${profile.age}岁 · ${profile.gender === 'male' ? '男性' : '女性'}</div>
      <div class="profile-occupation">${profile.occupation}</div>
      <div class="profile-location">
        <i class="fas fa-map-marker-alt"></i>
        <span>${profile.location}</span>
      </div>
      <div class="occupation-icons">
        ${profile.icons.map(icon => `<i class="${icon}"></i>`).join('')}
      </div>
    </div>
    <div class="profile-body">
      <div class="profile-tags">
        ${profile.tags.map(tag => `<span class="profile-tag ${tag.class}">${tag.text}</span>`).join('')}
      </div>
      <div class="profile-details">
        ${profile.details.map(detail => `
          <div class="profile-detail">
            <i class="${detail.icon}"></i>
            <div>${detail.text}</div>
          </div>
        `).join('')}
      </div>
      <div class="profile-quote">"${profile.quote}"</div>
    </div>
    <div class="profile-footer">
      <a href="${detailLink}" class="btn-view" ${profile.detailUrl === '#' ? `data-id="${profile.id}"` : ''}>查看详细信息</a>
    </div>
  `;
  
  return card;
}

// 更新征婚信息数量
function updateProfileCount() {
  const profileCards = document.querySelectorAll('.profile-card');
  document.getElementById('profile-count').textContent = profileCards.length;
}

// 应用筛选
function applyFilters() {
  const ageRange = document.getElementById('age-range').value;
  const city = document.getElementById('city').value;
  const occupation = document.getElementById('occupation').value;
  const gender = document.getElementById('gender').value;
  const keyword = document.getElementById('keyword').value.toLowerCase();
  
  const profileCards = document.querySelectorAll('.profile-card');
  let visibleCount = 0;
  
  profileCards.forEach(card => {
    let shouldShow = true;
    
    // 提取卡片信息用于筛选
    const cardText = card.textContent.toLowerCase();
    const ageElement = card.querySelector('.profile-age');
    const locationElement = card.querySelector('.profile-location span');
    const occupationElement = card.querySelector('.profile-occupation');
    
    // 年龄筛选（简化逻辑）
    if (ageRange !== 'all') {
      const ageText = ageElement ? ageElement.textContent : '';
      const ageMatch = ageText.match(/\d+/);
      const age = ageMatch ? parseInt(ageMatch[0]) : 0;
      
      if (ageRange === '25-30' && (age < 25 || age > 30)) shouldShow = false;
      else if (ageRange === '30-35' && (age < 30 || age > 35)) shouldShow = false;
      else if (ageRange === '35-40' && (age < 35 || age > 40)) shouldShow = false;
      else if (ageRange === '40+' && age <= 40) shouldShow = false;
    }
    
    // 城市筛选
    if (city !== 'all' && locationElement) {
      const locationText = locationElement.textContent.toLowerCase();
      if (!locationText.includes(city)) shouldShow = false;
    }
    
    // 职业筛选
    if (occupation !== 'all' && occupationElement) {
      const occupationText = occupationElement.textContent.toLowerCase();
      let hasOccupation = false;
      
      if (occupation === 'tech' && (occupationText.includes('程序') || occupationText.includes('技术') || card.querySelector('.tech-header'))) hasOccupation = true;
      else if (occupation === 'finance' && (occupationText.includes('金融') || occupationText.includes('投资') || card.querySelector('.finance-header'))) hasOccupation = true;
      else if (occupation === 'education' && (occupationText.includes('教师') || occupationText.includes('教授') || card.querySelector('.education-header'))) hasOccupation = true;
      else if (occupation === 'medical' && (occupationText.includes('医生') || card.querySelector('.medical-header'))) hasOccupation = true;
      else if (occupation === 'creative' && (occupationText.includes('艺术') || occupationText.includes('设计') || card.querySelector('.creative-header'))) hasOccupation = true;
      else if (occupation === 'business' && (occupationText.includes('律师') || occupationText.includes('管理') || card.querySelector('.business-header'))) hasOccupation = true;
      else if (occupation === 'engineer' && (occupationText.includes('工程') || card.querySelector('.engineer-header'))) hasOccupation = true;
      else if (occupation === 'other') hasOccupation = true;
      
      if (!hasOccupation) shouldShow = false;
    }
    
    // 性别筛选
    if (gender !== 'all') {
      const genderText = card.querySelector('.profile-age') ? card.querySelector('.profile-age').textContent : '';
      if (gender === 'male' && !genderText.includes('男')) shouldShow = false;
      if (gender === 'female' && !genderText.includes('女')) shouldShow = false;
    }
    
    // 关键词筛选
    if (keyword && !cardText.includes(keyword)) {
      shouldShow = false;
    }
    
    // 显示或隐藏卡片
    if (shouldShow) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // 更新可见数量
  document.getElementById('profile-count').textContent = visibleCount;
  
  // 如果没有匹配结果，显示空状态
  const emptyState = document.getElementById('empty-state');
  if (visibleCount === 0) {
    const profilesGrid = document.getElementById('profiles-grid');
    const emptyDiv = document.createElement('div');
    emptyDiv.id = 'empty-state';
    emptyDiv.className = 'empty-state';
    emptyDiv.innerHTML = `
      <i class="fas fa-search"></i>
      <h3>没有找到匹配的征婚信息</h3>
      <p>尝试调整筛选条件或使用不同的关键词搜索</p>
      <button class="btn btn-primary" onclick="resetFilters()" style="margin-top: 20px;">重置筛选条件</button>
    `;
    
    // 如果已存在空状态，先移除
    if (emptyState) emptyState.remove();
    profilesGrid.appendChild(emptyDiv);
  } else if (emptyState) {
    emptyState.remove();
  }
}

// 重置筛选
function resetFilters() {
  document.getElementById('age-range').value = 'all';
  document.getElementById('city').value = 'all';
  document.getElementById('occupation').value = 'all';
  document.getElementById('gender').value = 'all';
  document.getElementById('keyword').value = '';
  
  // 显示所有卡片
  const profileCards = document.querySelectorAll('.profile-card');
  profileCards.forEach(card => {
    card.style.display = 'flex';
  });
  
  // 移除空状态
  const emptyState = document.getElementById('empty-state');
  if (emptyState) emptyState.remove();
  
  // 更新数量
  updateProfileCount();
}