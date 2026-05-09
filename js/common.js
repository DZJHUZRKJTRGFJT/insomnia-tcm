// ============================================
// 通用 JavaScript
// ============================================

// 导航栏滚动效果
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// 移动端导航
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks && navLinks.classList.toggle('open');
    navActions && navActions.classList.toggle('open');
  });
}

// Toast 提示
function showToast(message, type = 'success', duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  toast.innerHTML = `<span>${icons[type] || '💬'}</span><span>${message}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// 简易路由（基于角色的重定向）
function checkAuth() {
  const user = getCurrentUser();
  const path = window.location.pathname;

  const userPages = ['/user/', '/insomnia-tcm/user/'];
  const doctorPages = ['/doctor/', '/insomnia-tcm/doctor/'];

  const isUserPage = userPages.some(p => path.includes(p));
  const isDoctorPage = doctorPages.some(p => path.includes(p));

  if ((isUserPage || isDoctorPage) && !user) {
    window.location.href = '../login.html?redirect=' + encodeURIComponent(window.location.href);
    return false;
  }

  if (isDoctorPage && user && user.role !== 'doctor') {
    window.location.href = '../user/dashboard.html';
    return false;
  }

  return true;
}

// 用户状态管理
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser'));
  } catch { return null; }
}

function saveUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = '../index.html';
}

// 更新导航栏用户状态
function updateNavForUser() {
  const user = getCurrentUser();
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;

  if (user) {
    const dashUrl = user.role === 'doctor' ? 'doctor/dashboard.html' : 'user/dashboard.html';
    const basePath = window.location.pathname.includes('/user/') || 
                     window.location.pathname.includes('/doctor/') ? '../' : '';
    navActions.innerHTML = `
      <a href="${basePath}${dashUrl}" class="btn-login">
        ${user.name || user.phone} · ${user.role === 'doctor' ? '医生端' : '用户端'}
      </a>
      <button class="btn-register" onclick="logoutUser()">退出登录</button>
    `;
  }
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  const inSubDir = window.location.pathname.includes('/user/') || 
                   window.location.pathname.includes('/doctor/');
  window.location.href = inSubDir ? '../index.html' : 'index.html';
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  updateNavForUser();
  
  // 滚动动画 IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.feature-card, .workflow-step, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // animate-in 类添加时应用效果
  const style = document.createElement('style');
  style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);
});

// 模拟用户数据库
const MOCK_USERS = {
  'user_13800138000': { id: 'u001', phone: '13800138000', name: '李晓明', password: '123456', role: 'user', gender: '男', age: 35, records: [] },
  'user_13900139000': { id: 'u002', phone: '13900139000', name: '王雅琴', password: '123456', role: 'user', gender: '女', age: 42, records: [] },
  'doctor_13700137000': { id: 'd001', phone: '13700137000', name: '张仲景医生', password: '123456', role: 'doctor', title: '主任医师', dept: '中医内科', hospital: '北京中医药大学附属医院', patients: [] },
  'doctor_demo': { id: 'd002', phone: 'demo_doctor', name: '陈明华医生', password: 'doctor123', role: 'doctor', title: '副主任医师', dept: '睡眠科', hospital: '广州中医药大学第一附属医院', patients: [] },
  'user_demo': { id: 'u003', phone: 'demo_user', name: '赵晓梅', password: 'user123', role: 'user', gender: '女', age: 28, records: [] },
};

function findUser(phone, password) {
  for (const key of Object.keys(MOCK_USERS)) {
    const u = MOCK_USERS[key];
    if ((u.phone === phone || key === `user_${phone}` || key === `doctor_${phone}`) && u.password === password) {
      return u;
    }
  }
  return null;
}

function registerUser(data) {
  const key = `${data.role}_${data.phone}`;
  if (MOCK_USERS[key]) return null; // 已存在
  MOCK_USERS[key] = { ...data, id: 'u' + Date.now(), records: [] };
  return MOCK_USERS[key];
}
