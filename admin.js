/* ========================================
   Nebula_岚野 - 后台管理面板脚本
   独立管理功能 / 文章CRUD / 站点设置
   ======================================== */

(function () {
  'use strict';

  /* ----------------------------------------
     配置
     ---------------------------------------- */
  // 多账号管理（用户名: 密码）
  var ADMIN_ACCOUNTS = {
    'admin': 'Lkr20110215@',
    'nebula': 'Lkr20110215@'
  };

  // LocalStorage 键名
  var STORAGE_KEY = 'nebula_articles';
  var AUTH_KEY = 'nebula_auth';
  var ACCOUNTS_KEY = 'nebula_accounts';
  var SETTINGS_KEY = 'nebula_settings';

  // 默认站点设置
  var DEFAULT_SETTINGS = {
    nickname: 'Nebula_岚野',
    bio: '永远相信美好的事情即将发生',
    avatar: '../avatar.jpg',
    skills: 'HTML',
    about: '你好，我是 Nebula_岚野。\n一个喜欢二次元和游戏的人，偶尔写写代码，偶尔画画。\n相信每一份热爱都值得被认真对待。',
    bilibili: 'https://b23.tv/RVOialG',
    douyin: 'https://v.douyin.com/AZAPJkQtO20/',
    qq: 'https://wpa.qq.com/msgrd?v=3&uin=2524033232&site=qq&menu=yes',
    email: 'lkr2312@163.com',
    // 外观设置
    bgImage: '',
    bgCover: true,
    bgFixed: true,
    bgBlur: true,
    colorBg: '#f0ebe3',
    colorCard: '#fffdf7',
    colorText: '#3d3428',
    colorAccent: '#8b6f4e',
    colorBorder: '#d9cdb8',
    fontSource: 'preset',
    fontFamily: "'HYWenHei85W', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    fontCustomData: '',
    // 赞助设置
    sponsorDesc: '如果我的内容对你有帮助，欢迎请我喝杯咖啡 ☕',
    sponsorAlipay: '',
    sponsorWechat: '',
    sponsorQQ: '',
    sponsorAfdian: ''
  };

  // 管理员验证邮箱（用于密码重置）
  var ADMIN_EMAILS = {
    'admin': 'lkr2312@163.com',
    'nebula': 'lkr2312@163.com'
  };

  // 颜色预设方案
  var COLOR_PRESETS = {
    warm: { bg: '#f0ebe3', card: '#fffdf7', text: '#3d3428', accent: '#8b6f4e', border: '#d9cdb8' },
    dark: { bg: '#1a1a2e', card: '#16213e', text: '#e0e0e0', accent: '#0f3460', border: '#2a2a4a' },
    ocean: { bg: '#e8f4f8', card: '#ffffff', text: '#2c3e50', accent: '#2980b9', border: '#bdc3c7' },
    forest: { bg: '#e8f5e9', card: '#f1f8e9', text: '#2e4a3e', accent: '#4a7c59', border: '#a5d6a7' },
    sakura: { bg: '#fce4ec', card: '#fff0f3', text: '#4a2c3d', accent: '#c2185b', border: '#f8bbd0' },
    reset: { bg: '#f0ebe3', card: '#fffdf7', text: '#3d3428', accent: '#8b6f4e', border: '#d9cdb8' }
  };

  // 编辑中的文章ID
  var editingArticleId = null;
  var pendingDeleteId = null;
  var toastTimer = null;

  /* ----------------------------------------
     数据管理 - 文章
     ---------------------------------------- */
  // 获取文章列表
  function getArticles() {
    var data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  // 保存文章列表
  function saveArticles(articles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }

  // 生成唯一ID
  function generateId() {
    return 'art-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
  }

  /* ----------------------------------------
     数据管理 - 设置
     ---------------------------------------- */
  // 获取站点设置
  function getSettings() {
    var data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      try {
        var saved = JSON.parse(data);
        // 合并默认值，防止缺失字段
        for (var key in DEFAULT_SETTINGS) {
          if (saved[key] === undefined || saved[key] === null) {
            saved[key] = DEFAULT_SETTINGS[key];
          }
        }
        return saved;
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }

  // 保存站点设置
  function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  /* ----------------------------------------
     账号管理
     ---------------------------------------- */
  // 加载保存的账号
  function loadAccounts() {
    var data = localStorage.getItem(ACCOUNTS_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return {};
      }
    }
    return {};
  }

  // 保存账号到本地存储
  function saveAccountToStorage(username, password) {
    var accounts = loadAccounts();
    accounts[username] = password;
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  // 删除账号
  function deleteAccountFromStorage(username) {
    var accounts = loadAccounts();
    delete accounts[username];
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  // 获取当前登录用户名
  function getCurrentUsername() {
    var authData = sessionStorage.getItem(AUTH_KEY);
    try {
      var auth = JSON.parse(authData);
      return auth && auth.username ? auth.username : null;
    } catch (e) {
      return null;
    }
  }

  /* ----------------------------------------
     后台管理 - 登录/登出
     ---------------------------------------- */
  function checkAuth() {
    var authData = sessionStorage.getItem(AUTH_KEY);
    try {
      var auth = JSON.parse(authData);
      if (auth && auth.username) {
        showAdminPanel();
      } else {
        showAdminLogin();
      }
    } catch (e) {
      showAdminLogin();
    }
  }

  function showAdminLogin() {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('login-error').textContent = '';
  }

  function showAdminPanel() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    resetEditor();
    renderAdminList();
    renderAccountsList();
    loadSettingsToForm();
  }

  function handleLogin() {
    var username = document.getElementById('login-username').value.trim();
    var password = document.getElementById('login-password').value;

    if (!username || !password) {
      document.getElementById('login-error').textContent = '请输入用户名和密码';
      return;
    }

    // 从本地存储加载自定义账号
    var savedAccounts = loadAccounts();
    var allAccounts = {};
    for (var key in ADMIN_ACCOUNTS) {
      allAccounts[key] = ADMIN_ACCOUNTS[key];
    }
    for (var key2 in savedAccounts) {
      allAccounts[key2] = savedAccounts[key2];
    }

    if (allAccounts[username] && allAccounts[username] === password) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify({ username: username }));
      showAdminPanel();
      showToast('登录成功，欢迎 ' + username);
    } else {
      document.getElementById('login-error').textContent = '用户名或密码错误';
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    showAdminLogin();
    showToast('已退出登录');
  }

  /* ----------------------------------------
     后台管理 - 文章编辑器
     ---------------------------------------- */
  function resetEditor() {
    editingArticleId = null;
    var editorTitle = document.getElementById('editor-title');
    if (editorTitle) editorTitle.textContent = '发布新文章';
    
    var inputTitle = document.getElementById('editor-input-title');
    if (inputTitle) inputTitle.value = '';
    
    var inputTags = document.getElementById('editor-input-tags');
    if (inputTags) inputTags.value = '';
    
    var inputContent = document.getElementById('editor-input-content');
    if (inputContent) inputContent.value = '';
    
    var saveBtn = document.getElementById('editor-save-btn');
    if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-save"></i> 发布';
  }

  function handleEditArticle(articleId) {
    var articles = getArticles();
    var article = null;
    for (var i = 0; i < articles.length; i++) {
      if (articles[i].id === articleId) {
        article = articles[i];
        break;
      }
    }
    if (!article) return;

    editingArticleId = articleId;
    
    var editorTitle = document.getElementById('editor-title');
    if (editorTitle) editorTitle.textContent = '编辑文章';
    
    var inputTitle = document.getElementById('editor-input-title');
    if (inputTitle) inputTitle.value = article.title;
    
    var inputTags = document.getElementById('editor-input-tags');
    if (inputTags) inputTags.value = (article.tags || []).join(', ');
    
    var inputContent = document.getElementById('editor-input-content');
    if (inputContent) inputContent.value = article.content;
    
    var saveBtn = document.getElementById('editor-save-btn');
    if (saveBtn) saveBtn.innerHTML = '<i class="fas fa-save"></i> 保存修改';

    // 滚动到编辑器
    var editorSection = document.getElementById('editor-section');
    if (editorSection) {
      editorSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function handleSaveArticle() {
    var inputTitle = document.getElementById('editor-input-title');
    var inputTags = document.getElementById('editor-input-tags');
    var inputContent = document.getElementById('editor-input-content');
    
    var title = inputTitle ? inputTitle.value.trim() : '';
    var tagsStr = inputTags ? inputTags.value.trim() : '';
    var content = inputContent ? inputContent.value.trim() : '';

    // 校验
    if (!title) {
      showToast('请输入文章标题');
      return;
    }
    if (!content) {
      showToast('请输入文章内容');
      return;
    }

    // 解析标签
    var tags = [];
    if (tagsStr) {
      tags = tagsStr.split(/[,，]/).map(function (t) { return t.trim(); }).filter(function (t) { return t; });
    }

    var articles = getArticles();

    if (editingArticleId) {
      // 编辑模式
      for (var i = 0; i < articles.length; i++) {
        if (articles[i].id === editingArticleId) {
          articles[i].title = title;
          articles[i].tags = tags;
          articles[i].content = content;
          break;
        }
      }
      showToast('文章已更新');
    } else {
      // 新建模式
      var today = new Date();
      var dateStr = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

      articles.push({
        id: generateId(),
        title: title,
        date: dateStr,
        tags: tags,
        content: content
      });
      showToast('文章已发布');
    }

    saveArticles(articles);
    resetEditor();
    renderAdminList();
  }

  /* ----------------------------------------
     后台管理 - 文章列表
     ---------------------------------------- */
  function renderAdminList() {
    var container = document.getElementById('admin-articles');
    if (!container) return;
    
    var articles = getArticles();

    // 按日期倒序
    articles.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    if (articles.length === 0) {
      container.innerHTML = '<div class="list-empty">还没有文章</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < articles.length; i++) {
      var art = articles[i];
      html +=
        '<div class="admin-item">' +
        '  <div class="item-info">' +
        '    <div class="item-title">' + escapeHtml(art.title) + '</div>' +
        '    <div class="item-date">' + escapeHtml(art.date) + '</div>' +
        '  </div>' +
        '  <div class="item-actions">' +
        '    <button class="btn btn-sm edit-btn" data-id="' + art.id + '">' +
        '      <i class="fas fa-edit"></i> 编辑' +
        '    </button>' +
        '    <button class="btn btn-sm btn-danger delete-btn" data-id="' + art.id + '">' +
        '      <i class="fas fa-trash"></i> 删除' +
        '    </button>' +
        '  </div>' +
        '</div>';
    }
    container.innerHTML = html;

    // 绑定编辑按钮
    var editBtns = container.querySelectorAll('.edit-btn');
    for (var e = 0; e < editBtns.length; e++) {
      editBtns[e].addEventListener('click', function () {
        handleEditArticle(this.getAttribute('data-id'));
      });
    }

    // 绑定删除按钮
    var deleteBtns = container.querySelectorAll('.delete-btn');
    for (var d = 0; d < deleteBtns.length; d++) {
      deleteBtns[d].addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        handleDeleteArticle(id);
      });
    }
  }

  function handleDeleteArticle(articleId) {
    pendingDeleteId = articleId;
    var modalMsg = document.getElementById('modal-message');
    if (modalMsg) {
      modalMsg.textContent = '确定要删除这篇文章吗？删除后无法恢复。';
    }
    var modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.add('active');
    }
  }

  function confirmDelete() {
    if (!pendingDeleteId) return;

    var articles = getArticles();
    var filtered = [];
    for (var i = 0; i < articles.length; i++) {
      if (articles[i].id !== pendingDeleteId) {
        filtered.push(articles[i]);
      }
    }
    saveArticles(filtered);
    pendingDeleteId = null;
    closeModal();
    renderAdminList();
    showToast('文章已删除');
  }

  function closeModal() {
    var modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
    }
    pendingDeleteId = null;
  }

  /* ----------------------------------------
     账号管理
     ---------------------------------------- */
  function renderAccountsList() {
    var container = document.getElementById('admin-accounts-list');
    if (!container) return;

    var savedAccounts = loadAccounts();
    var currentUser = getCurrentUsername();

    var html = '';
    // 显示默认账号
    for (var key in ADMIN_ACCOUNTS) {
      html +=
        '<div class="account-item default-account">' +
        '  <div class="account-info">' +
        '    <span class="account-name">' + escapeHtml(key) + '</span>' +
        '    <span class="account-badge">默认</span>' +
        '  </div>' +
        '  <div class="account-actions">' +
        '    <span class="account-status">系统账号</span>' +
        '  </div>' +
        '</div>';
    }

    // 显示自定义账号
    for (var key2 in savedAccounts) {
      var isCurrent = (key2 === currentUser);
      html +=
        '<div class="account-item' + (isCurrent ? ' current-user' : '') + '">' +
        '  <div class="account-info">' +
        '    <span class="account-name">' + escapeHtml(key2) + '</span>' +
        (isCurrent ? '<span class="account-badge current">当前</span>' : '') +
        '  </div>' +
        '  <div class="account-actions">' +
        '    <button class="btn btn-sm delete-account-btn" data-user="' + escapeHtml(key2) + '">' +
        '      <i class="fas fa-trash"></i> 删除' +
        '    </button>' +
        '  </div>' +
        '</div>';
    }

    if (Object.keys(savedAccounts).length === 0 && Object.keys(ADMIN_ACCOUNTS).length === 0) {
      html = '<div class="list-empty">暂无账号</div>';
    }

    container.innerHTML = html;

    // 绑定删除按钮
    var deleteBtns = container.querySelectorAll('.delete-account-btn');
    for (var d = 0; d < deleteBtns.length; d++) {
      deleteBtns[d].addEventListener('click', function () {
        var username = this.getAttribute('data-user');
        handleDeleteAccount(username);
      });
    }
  }

  function handleDeleteAccount(username) {
    var currentUser = getCurrentUsername();
    if (username === currentUser) {
      showToast('不能删除当前登录的账号');
      return;
    }

    if (confirm('确定要删除账号 "' + username + '" 吗？')) {
      deleteAccountFromStorage(username);
      renderAccountsList();
      showToast('账号已删除');
    }
  }

  function handleAddAccount() {
    var usernameInput = document.getElementById('new-account-username');
    var passwordInput = document.getElementById('new-account-password');
    var confirmInput = document.getElementById('new-account-confirm');

    var username = usernameInput ? usernameInput.value.trim() : '';
    var password = passwordInput ? passwordInput.value : '';
    var confirm = confirmInput ? confirmInput.value : '';

    if (!username || !password) {
      showToast('请输入用户名和密码');
      return;
    }

    if (password !== confirm) {
      showToast('两次输入的密码不一致');
      return;
    }

    // 检查是否已存在
    var savedAccounts = loadAccounts();
    if (savedAccounts[username] || ADMIN_ACCOUNTS[username]) {
      showToast('该用户名已存在');
      return;
    }

    saveAccountToStorage(username, password);
    renderAccountsList();

    // 清空输入框
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (confirmInput) confirmInput.value = '';

    showToast('账号添加成功');
  }

  /* ----------------------------------------
     修改密码
     ---------------------------------------- */
  function handleChangePassword() {
    var currentPasswordInput = document.getElementById('current-password');
    var newPasswordInput = document.getElementById('new-password');
    var confirmPasswordInput = document.getElementById('confirm-new-password');

    var currentPassword = currentPasswordInput ? currentPasswordInput.value : '';
    var newPassword = newPasswordInput ? newPasswordInput.value : '';
    var confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('请填写所有字段');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('两次输入的新密码不一致');
      return;
    }

    if (newPassword.length < 6) {
      showToast('新密码至少6位');
      return;
    }

    // 获取当前登录用户
    var authData = sessionStorage.getItem(AUTH_KEY);
    var auth = authData ? JSON.parse(authData) : null;
    if (!auth || !auth.username) {
      showToast('请重新登录');
      return;
    }

    var username = auth.username;

    // 验证当前密码
    var allAccounts = getAllAccounts();
    if (allAccounts[username] !== currentPassword) {
      showToast('当前密码错误');
      return;
    }

    // 更新密码
    saveAccountToStorage(username, newPassword);
    showToast('密码修改成功');

    // 清空输入框
    if (currentPasswordInput) currentPasswordInput.value = '';
    if (newPasswordInput) newPasswordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';
  }

  /* ----------------------------------------
     忘记密码
     ---------------------------------------- */
  function showForgotPasswordModal() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('forgot-password-modal').style.display = 'block';
    document.getElementById('new-password-modal').style.display = 'none';
  }

  function showLoginModal() {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('forgot-password-modal').style.display = 'none';
    document.getElementById('new-password-modal').style.display = 'none';
  }

  function showNewPasswordModal() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('forgot-password-modal').style.display = 'none';
    document.getElementById('new-password-modal').style.display = 'block';
  }

  // 存储重置密码的用户名
  var resetUsername = '';

  function handleVerifyIdentity() {
    var usernameInput = document.getElementById('reset-username');
    var emailInput = document.getElementById('reset-email');
    var errorEl = document.getElementById('reset-error');

    var username = usernameInput ? usernameInput.value.trim() : '';
    var email = emailInput ? emailInput.value.trim() : '';

    if (!username || !email) {
      if (errorEl) errorEl.textContent = '请填写用户名和邮箱';
      return;
    }

    // 检查用户名是否存在
    var allAccounts = getAllAccounts();
    if (!allAccounts[username]) {
      if (errorEl) errorEl.textContent = '用户名不存在';
      return;
    }

    // 检查邮箱是否匹配
    var expectedEmail = ADMIN_EMAILS[username];
    if (!expectedEmail || email.toLowerCase() !== expectedEmail.toLowerCase()) {
      if (errorEl) errorEl.textContent = '邮箱验证失败';
      return;
    }

    // 验证成功，显示设置新密码界面
    resetUsername = username;
    if (errorEl) errorEl.textContent = '';
    showNewPasswordModal();
  }

  function handleSaveNewPassword() {
    var newPasswordInput = document.getElementById('reset-new-password');
    var confirmPasswordInput = document.getElementById('reset-confirm-password');
    var errorEl = document.getElementById('new-password-error');

    var newPassword = newPasswordInput ? newPasswordInput.value : '';
    var confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

    if (!newPassword || !confirmPassword) {
      if (errorEl) errorEl.textContent = '请填写所有字段';
      return;
    }

    if (newPassword !== confirmPassword) {
      if (errorEl) errorEl.textContent = '两次输入的密码不一致';
      return;
    }

    if (newPassword.length < 6) {
      if (errorEl) errorEl.textContent = '密码至少6位';
      return;
    }

    // 保存新密码
    saveAccountToStorage(resetUsername, newPassword);
    if (errorEl) errorEl.textContent = '';

    // 清空输入框
    if (newPasswordInput) newPasswordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';
    document.getElementById('reset-username').value = '';
    document.getElementById('reset-email').value = '';

    showToast('密码重置成功，请重新登录');
    showLoginModal();
  }

  /* ----------------------------------------
     站点设置
     ---------------------------------------- */
  function loadSettingsToForm() {
    var settings = getSettings();
    
    var settingNickname = document.getElementById('setting-nickname');
    if (settingNickname) settingNickname.value = settings.nickname || '';
    
    var settingBio = document.getElementById('setting-bio');
    if (settingBio) settingBio.value = settings.bio || '';
    
    var settingSkills = document.getElementById('setting-skills');
    if (settingSkills) settingSkills.value = settings.skills || '';
    
    var settingAbout = document.getElementById('setting-about');
    if (settingAbout) settingAbout.value = (settings.about || '').replace(/\\n/g, '\n');
    
    var settingBilibili = document.getElementById('setting-bilibili');
    if (settingBilibili) settingBilibili.value = settings.bilibili || '';
    
    var settingDouyin = document.getElementById('setting-douyin');
    if (settingDouyin) settingDouyin.value = settings.douyin || '';
    
    var settingQq = document.getElementById('setting-qq');
    if (settingQq) settingQq.value = settings.qq || '';
    
    var settingEmail = document.getElementById('setting-email');
    if (settingEmail) settingEmail.value = settings.email || '';
    
    var avatarUrlInput = document.getElementById('avatar-url-input');
    if (avatarUrlInput) avatarUrlInput.value = settings.avatar || '';

    // 更新头像预览
    var previewImg = document.getElementById('avatar-preview-img');
    if (previewImg && settings.avatar) {
      previewImg.src = settings.avatar;
    }

    // 背景图片
    var bgPreviewImg = document.getElementById('bg-preview-img');
    var bgPlaceholder = document.getElementById('bg-preview-placeholder');
    if (settings.bgImage) {
      if (bgPreviewImg) {
        bgPreviewImg.src = settings.bgImage;
        bgPreviewImg.style.display = 'block';
      }
      if (bgPlaceholder) bgPlaceholder.style.display = 'none';
    } else {
      if (bgPreviewImg) bgPreviewImg.style.display = 'none';
      if (bgPlaceholder) bgPlaceholder.style.display = 'flex';
    }
    
    var bgUrlInput = document.getElementById('bg-url-input');
    if (bgUrlInput) bgUrlInput.value = settings.bgImage || '';
    
    var bgCover = document.getElementById('bg-cover');
    if (bgCover) bgCover.checked = settings.bgCover !== false;
    
    var bgFixed = document.getElementById('bg-fixed');
    if (bgFixed) bgFixed.checked = settings.bgFixed !== false;
    
    var bgBlur = document.getElementById('bg-blur');
    if (bgBlur) bgBlur.checked = settings.bgBlur !== false;

    // 主配色
    var colorBg = document.getElementById('color-bg');
    var colorBgText = document.getElementById('color-bg-text');
    if (colorBg) colorBg.value = settings.colorBg || '#f0ebe3';
    if (colorBgText) colorBgText.value = settings.colorBg || '#f0ebe3';
    
    var colorCard = document.getElementById('color-card');
    var colorCardText = document.getElementById('color-card-text');
    if (colorCard) colorCard.value = settings.colorCard || '#fffdf7';
    if (colorCardText) colorCardText.value = settings.colorCard || '#fffdf7';
    
    var colorText = document.getElementById('color-text');
    var colorTextText = document.getElementById('color-text-text');
    if (colorText) colorText.value = settings.colorText || '#3d3428';
    if (colorTextText) colorTextText.value = settings.colorText || '#3d3428';
    
    var colorAccent = document.getElementById('color-accent');
    var colorAccentText = document.getElementById('color-accent-text');
    if (colorAccent) colorAccent.value = settings.colorAccent || '#8b6f4e';
    if (colorAccentText) colorAccentText.value = settings.colorAccent || '#8b6f4e';
    
    var colorBorder = document.getElementById('color-border');
    var colorBorderText = document.getElementById('color-border-text');
    if (colorBorder) colorBorder.value = settings.colorBorder || '#d9cdb8';
    if (colorBorderText) colorBorderText.value = settings.colorBorder || '#d9cdb8';

    // 字体
    var fontSource = document.getElementById('font-source');
    if (fontSource) {
      fontSource.value = settings.fontSource || 'preset';
      toggleFontSource(settings.fontSource || 'preset');
    }

    if (settings.fontSource === 'preset' || !settings.fontSource) {
      var fontPreset = document.getElementById('font-preset');
      if (fontPreset) fontPreset.value = settings.fontFamily || DEFAULT_SETTINGS.fontFamily;

      // 更新自定义下拉框的显示
      var fontFamily = settings.fontFamily || DEFAULT_SETTINGS.fontFamily;
      var options = document.querySelectorAll('.custom-select-option');
      options.forEach(function (opt) {
        opt.classList.remove('selected');
        if (opt.getAttribute('data-value') === fontFamily) {
          opt.classList.add('selected');
          var triggerText = document.querySelector('.custom-select-text');
          if (triggerText) triggerText.textContent = opt.textContent;
        }
      });
    }

    if (settings.fontCustomData) {
      var fontFileName = document.getElementById('font-file-name');
      if (fontFileName) fontFileName.textContent = '已上传字体';
    }
    
    updateFontPreview();

    // 赞助设置
    var sponsorDesc = document.getElementById('sponsor-desc');
    var sponsorAlipay = document.getElementById('sponsor-alipay');
    var sponsorWechat = document.getElementById('sponsor-wechat');
    var sponsorQQ = document.getElementById('sponsor-qq');
    var sponsorAfdian = document.getElementById('sponsor-afdian');

    if (sponsorDesc) sponsorDesc.value = settings.sponsorDesc || DEFAULT_SETTINGS.sponsorDesc;
    if (sponsorAlipay) sponsorAlipay.value = settings.sponsorAlipay || '';
    if (sponsorWechat) sponsorWechat.value = settings.sponsorWechat || '';
    if (sponsorQQ) sponsorQQ.value = settings.sponsorQQ || '';
    if (sponsorAfdian) sponsorAfdian.value = settings.sponsorAfdian || '';

    // 更新赞助预览
    updateSponsorPreviews();
  }

  function updateSponsorPreviews() {
    var alipayPreview = document.getElementById('alipay-preview');
    var wechatPreview = document.getElementById('wechat-preview');
    var qqPreview = document.getElementById('qq-preview');
    var alipayInput = document.getElementById('sponsor-alipay');
    var wechatInput = document.getElementById('sponsor-wechat');
    var qqInput = document.getElementById('sponsor-qq');

    if (alipayPreview && alipayInput && alipayInput.value) {
      alipayPreview.innerHTML = '<img src="' + alipayInput.value + '" alt="支付宝">';
    }
    if (wechatPreview && wechatInput && wechatInput.value) {
      wechatPreview.innerHTML = '<img src="' + wechatInput.value + '" alt="微信">';
    }
    if (qqPreview && qqInput && qqInput.value) {
      qqPreview.innerHTML = '<img src="' + qqInput.value + '" alt="QQ">';
    }
  }

  function handleSaveSettings() {
    var settings = getSettings();
    
    var settingNickname = document.getElementById('setting-nickname');
    var settingBio = document.getElementById('setting-bio');
    var settingSkills = document.getElementById('setting-skills');
    var settingAbout = document.getElementById('setting-about');
    var settingBilibili = document.getElementById('setting-bilibili');
    var settingDouyin = document.getElementById('setting-douyin');
    var settingQq = document.getElementById('setting-qq');
    var settingEmail = document.getElementById('setting-email');
    
    settings.nickname = settingNickname ? (settingNickname.value.trim() || DEFAULT_SETTINGS.nickname) : DEFAULT_SETTINGS.nickname;
    settings.bio = settingBio ? (settingBio.value.trim() || DEFAULT_SETTINGS.bio) : DEFAULT_SETTINGS.bio;
    settings.skills = settingSkills ? (settingSkills.value.trim() || DEFAULT_SETTINGS.skills) : DEFAULT_SETTINGS.skills;
    settings.about = settingAbout ? (settingAbout.value.trim() || DEFAULT_SETTINGS.about) : DEFAULT_SETTINGS.about;
    settings.bilibili = settingBilibili ? settingBilibili.value.trim() : '';
    settings.douyin = settingDouyin ? settingDouyin.value.trim() : '';
    settings.qq = settingQq ? settingQq.value.trim() : '';
    settings.email = settingEmail ? settingEmail.value.trim() : '';

    // 外观设置
    var bgUrlInput = document.getElementById('bg-url-input');
    var bgCover = document.getElementById('bg-cover');
    var bgFixed = document.getElementById('bg-fixed');
    var bgBlur = document.getElementById('bg-blur');
    var colorBg = document.getElementById('color-bg');
    var colorCard = document.getElementById('color-card');
    var colorText = document.getElementById('color-text');
    var colorAccent = document.getElementById('color-accent');
    var colorBorder = document.getElementById('color-border');
    var fontSource = document.getElementById('font-source');
    
    settings.bgImage = bgUrlInput ? bgUrlInput.value.trim() : '';
    settings.bgCover = bgCover ? bgCover.checked : true;
    settings.bgFixed = bgFixed ? bgFixed.checked : true;
    settings.bgBlur = bgBlur ? bgBlur.checked : true;
    settings.colorBg = colorBg ? colorBg.value : DEFAULT_SETTINGS.colorBg;
    settings.colorCard = colorCard ? colorCard.value : DEFAULT_SETTINGS.colorCard;
    settings.colorText = colorText ? colorText.value : DEFAULT_SETTINGS.colorText;
    settings.colorAccent = colorAccent ? colorAccent.value : DEFAULT_SETTINGS.colorAccent;
    settings.colorBorder = colorBorder ? colorBorder.value : DEFAULT_SETTINGS.colorBorder;
    settings.fontSource = fontSource ? fontSource.value : 'preset';
    
    if (settings.fontSource === 'preset') {
      var fontPreset = document.getElementById('font-preset');
      if (fontPreset) settings.fontFamily = fontPreset.value;
    }
    // fontCustomData 已在上传时保存

    // 赞助设置
    var sponsorDesc = document.getElementById('sponsor-desc');
    var sponsorAlipay = document.getElementById('sponsor-alipay');
    var sponsorWechat = document.getElementById('sponsor-wechat');
    var sponsorQQ = document.getElementById('sponsor-qq');
    var sponsorAfdian = document.getElementById('sponsor-afdian');

    settings.sponsorDesc = sponsorDesc ? sponsorDesc.value.trim() : DEFAULT_SETTINGS.sponsorDesc;
    settings.sponsorAlipay = sponsorAlipay ? sponsorAlipay.value.trim() : '';
    settings.sponsorWechat = sponsorWechat ? sponsorWechat.value.trim() : '';
    settings.sponsorQQ = sponsorQQ ? sponsorQQ.value.trim() : '';
    settings.sponsorAfdian = sponsorAfdian ? sponsorAfdian.value.trim() : '';

    saveSettings(settings);
    applySettings();
    showToast('站点设置已保存');
  }

  /* ----------------------------------------
     头像上传处理
     ---------------------------------------- */
  function handleAvatarUpload(file) {
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件');
      return;
    }

    // 检查文件大小（最大2MB）
    if (file.size > 2 * 1024 * 1024) {
      showToast('图片大小不能超过2MB');
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      var base64 = e.target.result;
      var settings = getSettings();
      settings.avatar = base64;
      saveSettings(settings);

      // 更新预览
      var previewImg = document.getElementById('avatar-preview-img');
      if (previewImg) previewImg.src = base64;
      
      applySettings();
      showToast('头像已更新');
    };
    reader.readAsDataURL(file);
  }

  function handleAvatarUrl() {
    var avatarUrlInput = document.getElementById('avatar-url-input');
    var url = avatarUrlInput ? avatarUrlInput.value.trim() : '';
    
    if (!url) {
      showToast('请输入头像URL');
      return;
    }

    var settings = getSettings();
    settings.avatar = url;
    saveSettings(settings);

    // 更新预览
    var previewImg = document.getElementById('avatar-preview-img');
    if (previewImg) previewImg.src = url;
    
    applySettings();
    showToast('头像已更新');
  }

  /* ----------------------------------------
     背景图片上传处理
     ---------------------------------------- */
  function handleBgUpload(file) {
    if (!file || !file.type.startsWith('image/')) { 
      showToast('请选择图片文件'); 
      return; 
    }
    if (file.size > 5 * 1024 * 1024) { 
      showToast('图片大小不能超过5MB'); 
      return; 
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      var base64 = e.target.result;
      
      var bgUrlInput = document.getElementById('bg-url-input');
      var bgPreviewImg = document.getElementById('bg-preview-img');
      var bgPlaceholder = document.getElementById('bg-preview-placeholder');
      
      if (bgUrlInput) bgUrlInput.value = base64;
      if (bgPreviewImg) {
        bgPreviewImg.src = base64;
        bgPreviewImg.style.display = 'block';
      }
      if (bgPlaceholder) bgPlaceholder.style.display = 'none';
      
      showToast('背景图已上传，点击保存生效');
    };
    reader.readAsDataURL(file);
  }

  /* ----------------------------------------
     字体上传处理
     ---------------------------------------- */
  function handleFontUpload(file) {
    if (!file) return;
    var validExts = ['.ttf', '.otf', '.woff', '.woff2'];
    var ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (validExts.indexOf(ext) === -1) {
      showToast('请选择 .ttf/.otf/.woff/.woff2 格式的字体文件');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('字体文件不能超过10MB');
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      var base64 = e.target.result;
      var fontName = file.name.replace(/\.[^.]+$/, '');

      // 保存到设置
      var settings = getSettings();
      settings.fontSource = 'upload';
      settings.fontFamily = "'" + fontName + "', sans-serif";
      settings.fontCustomData = JSON.stringify({ name: fontName, data: base64 });
      saveSettings(settings);

      var fontFileName = document.getElementById('font-file-name');
      if (fontFileName) fontFileName.textContent = file.name;
      
      updateFontPreview();
      applyFont(settings);
      showToast('字体已上传并应用');
    };
    reader.readAsDataURL(file);
  }

  /* ----------------------------------------
     颜色预设
     ---------------------------------------- */
  function applyColorPreset(presetName) {
    var preset = COLOR_PRESETS[presetName];
    if (!preset) return;

    var colorBg = document.getElementById('color-bg');
    var colorBgText = document.getElementById('color-bg-text');
    var colorCard = document.getElementById('color-card');
    var colorCardText = document.getElementById('color-card-text');
    var colorText = document.getElementById('color-text');
    var colorTextText = document.getElementById('color-text-text');
    var colorAccent = document.getElementById('color-accent');
    var colorAccentText = document.getElementById('color-accent-text');
    var colorBorder = document.getElementById('color-border');
    var colorBorderText = document.getElementById('color-border-text');

    if (colorBg) colorBg.value = preset.bg;
    if (colorBgText) colorBgText.value = preset.bg;
    if (colorCard) colorCard.value = preset.card;
    if (colorCardText) colorCardText.value = preset.card;
    if (colorText) colorText.value = preset.text;
    if (colorTextText) colorTextText.value = preset.text;
    if (colorAccent) colorAccent.value = preset.accent;
    if (colorAccentText) colorAccentText.value = preset.accent;
    if (colorBorder) colorBorder.value = preset.border;
    if (colorBorderText) colorBorderText.value = preset.border;
  }

  /* ----------------------------------------
     字体来源切换
     ---------------------------------------- */
  function toggleFontSource(source) {
    var presetRow = document.getElementById('font-preset-row');
    var uploadRow = document.getElementById('font-upload-row');
    if (source === 'preset') {
      if (presetRow) presetRow.style.display = 'flex';
      if (uploadRow) uploadRow.style.display = 'none';
    } else {
      if (presetRow) presetRow.style.display = 'none';
      if (uploadRow) uploadRow.style.display = 'flex';
    }
  }

  function updateFontPreview() {
    var preview = document.getElementById('font-preview');
    if (!preview) return;
    
    var fontSource = document.getElementById('font-source');
    var source = fontSource ? fontSource.value : 'preset';
    
    var fontFamily;
    if (source === 'preset') {
      var fontPreset = document.getElementById('font-preset');
      fontFamily = fontPreset ? fontPreset.value : DEFAULT_SETTINGS.fontFamily;
    } else {
      var settings = getSettings();
      fontFamily = settings.fontFamily || DEFAULT_SETTINGS.fontFamily;
    }
    
    var span = preview.querySelector('span');
    if (span) span.style.fontFamily = fontFamily;
  }

  /* ----------------------------------------
     设置应用
     ---------------------------------------- */
  function applySettings() {
    var settings = getSettings();

    // 应用背景图片
    applyBackground(settings);

    // 应用主配色
    applyColors(settings);

    // 应用字体
    applyFont(settings);
  }

  function applyBackground(settings) {
    var root = document.documentElement;
    // 移除旧的背景样式
    root.style.removeProperty('--custom-bg-image');
    root.style.removeProperty('--custom-bg-size');
    root.style.removeProperty('--custom-bg-attachment');
    root.style.removeProperty('--custom-bg-blur');

    if (settings.bgImage) {
      root.style.setProperty('--custom-bg-image', 'url(' + settings.bgImage + ')');
      root.style.setProperty('--custom-bg-size', settings.bgCover ? 'cover' : 'auto');
      root.style.setProperty('--custom-bg-attachment', settings.bgFixed ? 'fixed' : 'scroll');
      root.style.setProperty('--custom-bg-blur', settings.bgBlur ? 'blur(4px)' : 'none');

      // 动态添加背景样式
      var existingStyle = document.getElementById('custom-bg-style');
      if (!existingStyle) {
        var style = document.createElement('style');
        style.id = 'custom-bg-style';
        document.head.appendChild(style);
        existingStyle = style;
      }
      existingStyle.textContent =
        'body::before {' +
        '  background-image: var(--custom-bg-image) !important;' +
        '  background-size: var(--custom-bg-size) !important;' +
        '  background-position: center !important;' +
        '  background-attachment: var(--custom-bg-attachment) !important;' +
        '  background-repeat: no-repeat !important;' +
        '  filter: var(--custom-bg-blur) !important;' +
        '  opacity: 0.3 !important;' +
        '  width: 100% !important;' +
        '  height: 100% !important;' +
        '  top: 0 !important;' +
        '  left: 0 !important;' +
        '  border-radius: 0 !important;' +
        '}';
    } else {
      var existingStyle = document.getElementById('custom-bg-style');
      if (existingStyle) existingStyle.remove();
    }
  }

  function applyColors(settings) {
    var root = document.documentElement;
    root.style.setProperty('--bg-primary', settings.colorBg || DEFAULT_SETTINGS.colorBg);
    root.style.setProperty('--bg-card', settings.colorCard || DEFAULT_SETTINGS.colorCard);
    root.style.setProperty('--text-primary', settings.colorText || DEFAULT_SETTINGS.colorText);
    root.style.setProperty('--accent', settings.colorAccent || DEFAULT_SETTINGS.colorAccent);
    root.style.setProperty('--border-color', settings.colorBorder || DEFAULT_SETTINGS.colorBorder);
  }

  var loadedFonts = {};
  
  function applyFont(settings) {
    var fontFamily = settings.fontFamily || DEFAULT_SETTINGS.fontFamily;

    // 如果有自定义字体数据，先注册
    if (settings.fontCustomData) {
      try {
        var fontData = JSON.parse(settings.fontCustomData);
        // 检查是否已注册
        if (!document.querySelector('style[data-custom-font="' + fontData.name + '"]')) {
          var style = document.createElement('style');
          style.setAttribute('data-custom-font', fontData.name);
          style.textContent =
            '@font-face {' +
            '  font-family: "' + fontData.name + '";' +
            '  src: url(' + fontData.data + ') format("truetype");' +
            '  font-weight: normal;' +
            '  font-style: normal;' +
            '  font-display: swap;' +
            '}';
          document.head.appendChild(style);
        }
        fontFamily = "'" + fontData.name + "', " + fontFamily;
      } catch (e) {
        // 解析失败，忽略
      }
    }

    // 如果是预制字体，加载Google Fonts
    if (settings.fontSource === 'preset') {
      var fontPreset = document.getElementById('font-preset');
      if (fontPreset) fontFamily = fontPreset.value;
      loadGoogleFont(fontFamily);
    }

    document.documentElement.style.setProperty('--font-family', fontFamily);
  }

  function loadGoogleFont(fontFamily) {
    // 提取字体名称
    var match = fontFamily.match(/'([^']+)'/);
    if (!match) return;
    var fontName = match[1];

    // 跳过系统字体和本地字体
    var skipFonts = ['HYWenHei85W', 'PingFang SC', 'Microsoft YaHei', 'SimSun', 'system-ui', '-apple-system'];
    for (var i = 0; i < skipFonts.length; i++) {
      if (fontName.indexOf(skipFonts[i]) === 0) return;
    }

    if (loadedFonts[fontName]) return;
    loadedFonts[fontName] = true;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + fontName.replace(/ /g, '+') + ':wght@400;700&display=swap';
    document.head.appendChild(link);
  }

  /* ----------------------------------------
     提示消息
     ---------------------------------------- */
  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2000);
  }

  /* ----------------------------------------
     模态框
     ---------------------------------------- */
  function showModal(message, onConfirm) {
    var modalMessage = document.getElementById('modal-message');
    var modalOverlay = document.getElementById('modal-overlay');
    var modalConfirm = document.getElementById('modal-confirm');
    
    if (modalMessage) modalMessage.textContent = message;
    if (modalOverlay) modalOverlay.classList.add('active');
    
    // 保存回调
    if (onConfirm) {
      modalConfirm.onclick = function() {
        onConfirm();
        closeModal();
      };
    }
  }

  /* ----------------------------------------
     工具函数
     ---------------------------------------- */
  function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  /* ----------------------------------------
     事件绑定
     ---------------------------------------- */
  function bindEvents() {
    // 后台登录
    var loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', handleLogin);
    }
    
    var loginPassword = document.getElementById('login-password');
    if (loginPassword) {
      loginPassword.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handleLogin();
      });
    }

    // 后台退出
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }

    // 编辑器保存
    var editorSaveBtn = document.getElementById('editor-save-btn');
    if (editorSaveBtn) {
      editorSaveBtn.addEventListener('click', handleSaveArticle);
    }

    // 编辑器取消
    var editorCancelBtn = document.getElementById('editor-cancel-btn');
    if (editorCancelBtn) {
      editorCancelBtn.addEventListener('click', resetEditor);
    }

    // 弹窗确认/取消
    var modalConfirm = document.getElementById('modal-confirm');
    if (modalConfirm) {
      modalConfirm.addEventListener('click', confirmDelete);
    }
    
    var modalCancel = document.getElementById('modal-cancel');
    if (modalCancel) {
      modalCancel.addEventListener('click', closeModal);
    }

    // 点击弹窗外部关闭
    var modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', function (e) {
        if (e.target === this) closeModal();
      });
    }

    // 账号管理 - 添加账号
    var addAccountBtn = document.getElementById('add-account-btn');
    if (addAccountBtn) {
      addAccountBtn.addEventListener('click', handleAddAccount);
    }

    // 账号管理 - 回车添加
    var confirmInput = document.getElementById('new-account-confirm');
    if (confirmInput) {
      confirmInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') handleAddAccount();
      });
    }

    // 修改密码
    var changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
      changePasswordBtn.addEventListener('click', handleChangePassword);
    }

    // 忘记密码
    var forgotPasswordBtn = document.getElementById('forgot-password-btn');
    if (forgotPasswordBtn) {
      forgotPasswordBtn.addEventListener('click', showForgotPasswordModal);
    }

    var backToLoginBtn = document.getElementById('back-to-login-btn');
    if (backToLoginBtn) {
      backToLoginBtn.addEventListener('click', showLoginModal);
    }

    var resetVerifyBtn = document.getElementById('reset-verify-btn');
    if (resetVerifyBtn) {
      resetVerifyBtn.addEventListener('click', handleVerifyIdentity);
    }

    var resetSaveBtn = document.getElementById('reset-save-btn');
    if (resetSaveBtn) {
      resetSaveBtn.addEventListener('click', handleSaveNewPassword);
    }

    // 站点设置 - 保存
    var settingsSaveBtn = document.getElementById('settings-save-btn');
    if (settingsSaveBtn) {
      settingsSaveBtn.addEventListener('click', handleSaveSettings);
    }

    // 站点设置 - 头像上传按钮
    var avatarUploadBtn = document.getElementById('avatar-upload-btn');
    var avatarFileInput = document.getElementById('avatar-file-input');
    if (avatarUploadBtn && avatarFileInput) {
      avatarUploadBtn.addEventListener('click', function () {
        avatarFileInput.click();
      });
      avatarFileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
          handleAvatarUpload(this.files[0]);
        }
      });
    }

    // 站点设置 - 头像URL
    var avatarUrlBtn = document.getElementById('avatar-url-btn');
    if (avatarUrlBtn) {
      avatarUrlBtn.addEventListener('click', handleAvatarUrl);
    }

    // 背景图片上传
    var bgUploadBtn = document.getElementById('bg-upload-btn');
    var bgFileInput = document.getElementById('bg-file-input');
    if (bgUploadBtn && bgFileInput) {
      bgUploadBtn.addEventListener('click', function () { bgFileInput.click(); });
      bgFileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
          handleBgUpload(this.files[0]);
        }
      });
    }

    // 背景图片URL
    var bgUrlBtn = document.getElementById('bg-url-btn');
    if (bgUrlBtn) {
      bgUrlBtn.addEventListener('click', function () {
        var bgUrlInput = document.getElementById('bg-url-input');
        var url = bgUrlInput ? bgUrlInput.value.trim() : '';
        if (!url) { showToast('请输入图片URL'); return; }
        
        var bgPreviewImg = document.getElementById('bg-preview-img');
        var bgPlaceholder = document.getElementById('bg-preview-placeholder');
        
        if (bgPreviewImg) {
          bgPreviewImg.src = url;
          bgPreviewImg.style.display = 'block';
        }
        if (bgPlaceholder) bgPlaceholder.style.display = 'none';
        
        showToast('背景图已设置，点击保存生效');
      });
    }

    // 移除背景
    var bgRemoveBtn = document.getElementById('bg-remove-btn');
    if (bgRemoveBtn) {
      bgRemoveBtn.addEventListener('click', function () {
        var bgUrlInput = document.getElementById('bg-url-input');
        var bgPreviewImg = document.getElementById('bg-preview-img');
        var bgPlaceholder = document.getElementById('bg-preview-placeholder');
        
        if (bgUrlInput) bgUrlInput.value = '';
        if (bgPreviewImg) bgPreviewImg.style.display = 'none';
        if (bgPlaceholder) bgPlaceholder.style.display = 'flex';
        
        showToast('背景图已移除，点击保存生效');
      });
    }

    // 颜色选择器同步
    var colorPairs = [
      ['color-bg', 'color-bg-text'],
      ['color-card', 'color-card-text'],
      ['color-text', 'color-text-text'],
      ['color-accent', 'color-accent-text'],
      ['color-border', 'color-border-text']
    ];
    colorPairs.forEach(function (pair) {
      var picker = document.getElementById(pair[0]);
      var hex = document.getElementById(pair[1]);
      if (picker && hex) {
        picker.addEventListener('input', function () { hex.value = this.value; });
        hex.addEventListener('input', function () {
          if (/^#[0-9a-fA-F]{6}$/.test(this.value)) {
            picker.value = this.value;
          }
        });
      }
    });

    // 颜色预设
    var presetBtns = document.querySelectorAll('.color-preset');
    presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var preset = this.getAttribute('data-preset');
        applyColorPreset(preset);
      });
    });

    // 字体来源切换
    var fontSource = document.getElementById('font-source');
    if (fontSource) {
      fontSource.addEventListener('change', function () {
        toggleFontSource(this.value);
        updateFontPreview();
      });

      // 自定义字体下拉框
      var fontSelectTrigger = document.getElementById('font-select-trigger');
      var fontSelectContainer = document.getElementById('font-select-container');
      var fontSelectOptions = document.getElementById('font-select-options');
      var fontPresetInput = document.getElementById('font-preset');

      if (fontSelectTrigger && fontSelectContainer) {
        fontSelectTrigger.addEventListener('click', function (e) {
          e.stopPropagation();
          fontSelectContainer.classList.toggle('open');
        });

        fontSelectOptions.addEventListener('click', function (e) {
          var option = e.target.closest('.custom-select-option');
          if (option) {
            var value = option.getAttribute('data-value');
            var text = option.textContent;

            // 更新显示文本
            fontSelectTrigger.querySelector('.custom-select-text').textContent = text;

            // 更新隐藏input的值
            fontPresetInput.value = value;

            // 更新选中状态
            fontSelectOptions.querySelectorAll('.custom-select-option').forEach(function (opt) {
              opt.classList.remove('selected');
            });
            option.classList.add('selected');

            // 关闭下拉框
            fontSelectContainer.classList.remove('open');

            // 更新字体预览
            updateFontPreview();
          }
        });

        // 点击外部关闭
        document.addEventListener('click', function (e) {
          if (!fontSelectContainer.contains(e.target)) {
            fontSelectContainer.classList.remove('open');
          }
        });
      }
    }

    // 预制字体选择
    var fontPreset = document.getElementById('font-preset');
    if (fontPreset) {
      fontPreset.addEventListener('change', updateFontPreview);
    }

    // 字体文件上传
    var fontUploadBtn = document.getElementById('font-upload-btn');
    var fontFileInput = document.getElementById('font-file-input');
    if (fontUploadBtn && fontFileInput) {
      fontUploadBtn.addEventListener('click', function () { fontFileInput.click(); });
      fontFileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
          handleFontUpload(this.files[0]);
        }
      });
    }
  }

  /* ----------------------------------------
     初始化
     ---------------------------------------- */
  function init() {
    // 检查登录状态
    checkAuth();
    
    // 绑定所有事件
    bindEvents();
    
    // 应用站点设置到页面
    applySettings();
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
