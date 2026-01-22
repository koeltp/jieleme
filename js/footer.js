// 创建并插入页脚
document.addEventListener('DOMContentLoaded', function() {
  const footerContainer = document.getElementById('footer-container');
  
  if (footerContainer) {
    // 检查当前页面是否为详情页
    const isDetailPage = window.location.pathname.includes('detail.html');
    
    footerContainer.innerHTML = `
      <footer>
        <div class="footer-content">
          <div class="footer-description">
            <p>
                结了么是一个免注册的真诚交友平台。我们致力于为各行各业的真诚人士提供一个直接、高效的交友环境。在这里，您可以自由浏览征婚信息，直接与感兴趣的人联系，无需复杂注册流程。
            </p>
          </div>
          <!-- 二维码部分 - 移除框框和标题 -->
          <div class="qr-container">
            <div class="qr-item">
              <div class="qr-code">
                <img src="images/wxgroup.png" alt="征婚交友群二维码">
              </div>
              <div class="qr-label">征婚交友群</div>
              <div class="qr-note">扫码加入，认识更多朋友</div>
            </div>
            <div class="qr-item">
              <div class="qr-code">
                <img src="images/wxmaster.png" alt="站长微信二维码">
              </div>
              <div class="qr-label">站长微信</div>
              <div class="qr-note">添加好友，咨询平台事宜</div>
            </div>
          </div>
          

          

          <div class="site-runtime">
            小破站已运行 <span class="runtime-number" id="days">00</span>天 
            <span class="runtime-number" id="hours">00</span>时 
            <span class="runtime-number" id="minutes">00</span>分 
            <span class="runtime-number" id="seconds">00</span>秒
          </div>
          <div class="copyright">
            &copy; 2026 <a href="https://www.jieleme.top">结了么</a>. 保留所有权利. 
            真诚交友 · 多元包容 · 用心相遇
          </div>
        </div>
      </footer>
    `;
    
    // 初始化站点运行时间
    initRuntime();
    
    // 添加导航栏交互
    initNav();
  }
});

// 初始化站点运行时间
function initRuntime() {
  // 设置站点开始运行的时间（这里设为2026年1月15日 21:00）
  const startDate = new Date('2026-01-15T21:00:00');
  
  function updateRuntime() {
    const now = new Date();
    const diff = now - startDate;
    
    // 计算天、时、分、秒
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // 更新显示
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
  }
  
  // 初始更新
  updateRuntime();
  
  // 每秒更新一次
  setInterval(updateRuntime, 1000);
}

// 初始化导航栏交互
function initNav() {
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
    
    // 点击导航链接后关闭移动菜单
    const navLinkItems = document.querySelectorAll('.nav-link');
    navLinkItems.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('active');
        }
      });
    });
  }
}

