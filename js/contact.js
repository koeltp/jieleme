// contact.js - 联系我们页面交互

document.addEventListener('DOMContentLoaded', function() {
  // FAQ交互
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      faqItem.classList.toggle('active');
    });
  });
  
});

// 在线客服
function openChat() {
  alert('在线客服功能即将上线，敬请期待！');
}

// 拨打客服电话
function callPhone() {
  alert('拨打客服电话：400-123-4567');
  // 实际项目中可以使用：window.location.href = 'tel:400-123-4567';
}

// 发送邮件
function sendEmail() {
  const email = 'support@jieleme.top';
  const subject = '咨询-结了么平台';
  const body = '您好，我想咨询关于结了么平台的相关信息。';
  
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}