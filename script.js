/* ========================================
   Nebula_岚野 - 个人主页脚本 (前端显示版)
   SPA路由 / 博客展示 / 外观设置
   ======================================== */

(function () {
  'use strict';

  /* ----------------------------------------
     配置
     ---------------------------------------- */
  // LocalStorage 键名
  var STORAGE_KEY = 'nebula_articles';
  var SETTINGS_KEY = 'nebula_settings';
  var LIKES_KEY = 'nebula_likes';
  var COMMENTS_KEY = 'nebula_comments';
  var USER_LIKES_KEY = 'nebula_user_likes';

  // 默认站点设置
  var DEFAULT_SETTINGS = {
    nickname: 'Nebula_岚野',
    bio: '永远相信美好的事情即将发生',
    avatar: 'avatar.jpg',
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
    sponsorDesc: '如果我的内容对你有帮助，欢迎支持一下~',
    sponsorAlipay: '',
    sponsorWechat: '',
    sponsorQQ: '',
    sponsorAfdian: ''
  };

  // 默认示例文章
  var DEFAULT_ARTICLES = [
    {
      id: 'default-1',
      title: '原神开服四周年，聊聊陪伴与成长',
      date: '2025-09-28',
      tags: ['原神', '游戏', '随笔'],
      content:
        '## 四年了\n\n' +
        '不知不觉，原神已经开服四年了。从2020年9月那个秋天到现在，提瓦特大陆的故事一直在继续。\n\n' +
        '### 关于陪伴\n\n' +
        '还记得第一次打开游戏的时候，从海滩上醒来的感觉。那时候什么都不懂，跟着指引一路走，' +
        '看到蒙德的风景时真的被震撼到了。四年来，每次打开游戏都有一种回家的感觉。\n\n' +
        '> 好的游戏不只是消遣，更是生活中的一部分。\n\n' +
        '### 关于成长\n\n' +
        '从最初连元素反应都搞不清楚，到现在能轻松打通深渊，这个过程中学到了很多。' +
        '不只是游戏技巧，更多的是耐心和坚持。每一期深渊的挑战，每一次新角色的培养，' +
        '都像是在告诉自己：**慢慢来，比较快**。\n\n' +
        '### 期待未来\n\n' +
        '纳塔的故事还在继续，新的角色、新的地图、新的剧情。希望这个游戏能一直走下去，' +
        '也希望每一个旅行者都能在提瓦特找到属于自己的故事。\n\n' +
        '---\n\n' +
        '*永远相信美好的事情即将发生。*'
    },
    {
      id: 'default-2',
      title: '用HTML做第一个网页是什么体验',
      date: '2025-10-15',
      tags: ['HTML', '前端', '学习笔记'],
      content:
        '## 从零开始\n\n' +
        '最近开始学习前端开发，第一步就是 HTML。说实话，一开始觉得挺简单的——不就是写几个标签嘛。\n\n' +
        '但真正动手做的时候才发现，要把一个页面做得好看、做得规整，其实需要很多细节。\n\n' +
        '### 学到的东西\n\n' +
        '- `div` 和 `span` 的区别，什么时候用块级元素，什么时候用行内元素\n' +
        '- 语义化标签很重要，`header`、`main`、`footer` 不只是好看\n' +
        '- 表单的 `label` 和 `input` 要配套使用，对无障碍访问很关键\n\n' +
        '### 第一个作品\n\n' +
        '做了一个简单的个人主页，虽然很朴素，但是自己一行一行代码敲出来的，看着就很有成就感。\n\n' +
        '```html\n' +
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '  <title>我的第一个网页</title>\n' +
        '</head>\n' +
        '<body>\n' +
        '  <h1>Hello World</h1>\n' +
        '</body>\n' +
        '</html>\n' +
        '```\n\n' +
        '### 下一步\n\n' +
        '接下来准备学 CSS，让页面变得更好看。听说 CSS 的坑比 HTML 多很多，不过没关系，' +
        '**慢慢来就好**。\n\n' +
        '---\n\n' +
        '*学习这件事，什么时候开始都不晚。*'
    },
    {
      id: 'default-3',
      title: '推荐几部适合秋天看的番剧',
      date: '2025-11-02',
      tags: ['番剧', '二次元', '推荐'],
      content:
        '## 秋天和番剧最配了\n\n' +
        '天气渐渐凉了，泡一杯热茶，窝在沙发上看番，简直是秋天最幸福的事情。\n\n' +
        '### 1. 夏目友人帐\n\n' +
        '这部番不管什么时候看都很治愈。夏目和猫咪老师的日常，温暖但不腻。' +
        '每一集都是一个独立的小故事，看完心里会觉得很平静。\n\n' +
        '### 2. 四月是你的谎言\n\n' +
        '虽然名字里有四月，但秋天的氛围看也完全没问题。关于音乐、关于成长、关于遗憾。' +
        '看完之后可能会哭，但是那种**哭完之后觉得很释然**的感觉。\n\n' +
        '### 3. 龙与虎\n\n' +
        '校园恋爱番的经典之作。大河和龙儿的互动又好笑又感动。' +
        '节奏很好，不会觉得拖沓，结局也很圆满。\n\n' +
        '### 4. 花开伊吕波\n\n' +
        '讲的是在温泉旅馆打工的女孩们的故事。画面很美，' +
        '每个角色都有自己的成长线。适合在一个安静的下午慢慢看。\n\n' +
        '> 好的番剧就像一本好书，看完之后会在心里留很久。\n\n' +
        '---\n\n' +
        '*有空的时候，多看看好的作品，生活会变得更丰富。*'
    }
  ];

  // 默认作品集数据
  var DEFAULT_PORTFOLIO = [
    {
      title: '个人主页',
      desc: '用 HTML 和 CSS 做的第一个个人网站，简约复古风格。',
      icon: 'fas fa-globe'
    },
    {
      title: '像素画练习',
      desc: '用像素风格画的二次元角色，还在持续练习中。',
      icon: 'fas fa-paint-brush'
    },
    {
      title: '游戏攻略笔记',
      desc: '整理的原神攻略和地图标注，方便自己查阅。',
      icon: 'fas fa-book'
    },
    {
      title: '学习笔记',
      desc: '前端学习过程中的笔记和代码片段整理。',
      icon: 'fas fa-code'
    }
  ];

  /* ----------------------------------------
     数据管理
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
    // 首次访问，写入默认文章
    saveArticles(DEFAULT_ARTICLES);
    return DEFAULT_ARTICLES;
  }

  // 保存文章列表
  function saveArticles(articles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }

  // 根据ID获取文章
  function getArticleById(articleId) {
    var articles = getArticles();
    for (var i = 0; i < articles.length; i++) {
      if (articles[i].id === articleId) {
        return articles[i];
      }
    }
    return null;
  }

  /* ----------------------------------------
     点赞功能
     ---------------------------------------- */
  // 获取文章点赞数
  function getLikes(articleId) {
    var data = localStorage.getItem(LIKES_KEY);
    if (data) {
      try {
        var likes = JSON.parse(data);
        return likes[articleId] || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  }

  // 保存点赞数
  function saveLikes(articleId, count) {
    var data = localStorage.getItem(LIKES_KEY);
    var likes = {};
    if (data) {
      try {
        likes = JSON.parse(data);
      } catch (e) {
        likes = {};
      }
    }
    likes[articleId] = count;
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  }

  // 检查用户是否已点赞
  function hasUserLiked(articleId) {
    var data = localStorage.getItem(USER_LIKES_KEY);
    if (data) {
      try {
        var userLikes = JSON.parse(data);
        return userLikes[articleId] === true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  // 设置用户点赞状态
  function setUserLiked(articleId, liked) {
    var data = localStorage.getItem(USER_LIKES_KEY);
    var userLikes = {};
    if (data) {
      try {
        userLikes = JSON.parse(data);
      } catch (e) {
        userLikes = {};
      }
    }
    userLikes[articleId] = liked;
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify(userLikes));
  }

  // 切换点赞状态
  function toggleLike(articleId) {
    var currentLikes = getLikes(articleId);
    var hasLiked = hasUserLiked(articleId);

    if (hasLiked) {
      // 取消点赞
      saveLikes(articleId, Math.max(0, currentLikes - 1));
      setUserLiked(articleId, false);
    } else {
      // 点赞
      saveLikes(articleId, currentLikes + 1);
      setUserLiked(articleId, true);
    }

    return !hasLiked;
  }

  // 渲染点赞按钮
  function renderLikeButton(articleId) {
    var container = document.getElementById('like-btn');
    if (!container) return;

    var likes = getLikes(articleId);
    var hasLiked = hasUserLiked(articleId);

    var html = '<button class="like-button' + (hasLiked ? ' liked' : '') + '">' +
      '<i class="fas fa-heart"></i>' +
      '<span class="like-count">' + likes + '</span>' +
      '</button>';

    container.innerHTML = html;

    // 绑定点击事件
    var btn = container.querySelector('.like-button');
    if (btn) {
      btn.addEventListener('click', function () {
        toggleLike(articleId);
        renderLikeButton(articleId);
      });
    }
  }

  /* ----------------------------------------
     评论功能
     ---------------------------------------- */
  // 获取文章评论
  function getComments(articleId) {
    var data = localStorage.getItem(COMMENTS_KEY);
    if (data) {
      try {
        var comments = JSON.parse(data);
        return comments[articleId] || [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  // 保存评论
  function saveComments(articleId, comments) {
    var data = localStorage.getItem(COMMENTS_KEY);
    var allComments = {};
    if (data) {
      try {
        allComments = JSON.parse(data);
      } catch (e) {
        allComments = {};
      }
    }
    allComments[articleId] = comments;
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
  }

  // 添加评论
  function addComment(articleId, name, content) {
    var comments = getComments(articleId);
    var newComment = {
      id: 'comment-' + Date.now(),
      name: name || '匿名用户',
      content: content,
      date: new Date().toLocaleString('zh-CN')
    };
    comments.push(newComment);
    saveComments(articleId, comments);
    return newComment;
  }

  // 渲染评论列表
  function renderComments(articleId) {
    var container = document.getElementById('comments-list');
    var countEl = document.getElementById('comment-count');
    if (!container) return;

    var comments = getComments(articleId);

    // 更新评论数
    if (countEl) {
      countEl.textContent = comments.length;
    }

    if (comments.length === 0) {
      container.innerHTML = '<div class="no-comments"><i class="fas fa-comments"></i><p>暂无评论，快来抢沙发吧~</p></div>';
      return;
    }

    var html = '';
    for (var i = 0; i < comments.length; i++) {
      var comment = comments[i];
      html += '<div class="comment-item" data-id="' + comment.id + '">' +
        '<div class="comment-header">' +
        '<span class="comment-name">' + escapeHtml(comment.name) + '</span>' +
        '<span class="comment-date">' + escapeHtml(comment.date) + '</span>' +
        '</div>' +
        '<div class="comment-content">' + escapeHtml(comment.content) + '</div>' +
        '</div>';
    }
    container.innerHTML = html;
  }

  // 处理评论提交
  function handleCommentSubmit(articleId) {
    var nameInput = document.getElementById('comment-name');
    var contentInput = document.getElementById('comment-content');

    if (!contentInput) return;

    var name = nameInput ? nameInput.value.trim() : '';
    var content = contentInput.value.trim();

    if (!content) {
      alert('请输入评论内容');
      return;
    }

    addComment(articleId, name, content);

    // 清空输入
    if (nameInput) nameInput.value = '';
    contentInput.value = '';

    // 重新渲染评论
    renderComments(articleId);
  }

  /* ----------------------------------------
     赞助功能
     ---------------------------------------- */
  // 渲染赞助区域
  function renderSponsorSection() {
    var container = document.getElementById('sponsor-section');
    if (!container) return;

    var settings = getSettings();

    // 检查是否有任何赞助设置
    var hasSponsor = settings.sponsorAlipay || settings.sponsorWechat || settings.sponsorQQ || settings.sponsorAfdian;

    if (!hasSponsor) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';

    var html = '<div class="sponsor-card">' +
      '<h3 class="sponsor-title"><i class="fas fa-coffee"></i> 支持作者</h3>';

    if (settings.sponsorDesc) {
      html += '<p class="sponsor-desc">' + escapeHtml(settings.sponsorDesc) + '</p>';
    }

    html += '<div class="sponsor-items">';

    // 支付宝
    if (settings.sponsorAlipay) {
      html += '<div class="sponsor-item" data-type="alipay">' +
        '<i class="fab fa-alipay"></i>' +
        '<span>支付宝</span>' +
        '<div class="sponsor-qrcode">' +
        '<img src="' + escapeHtml(settings.sponsorAlipay) + '" alt="支付宝收款码">' +
        '</div>' +
        '</div>';
    }

    // 微信
    if (settings.sponsorWechat) {
      html += '<div class="sponsor-item" data-type="wechat">' +
        '<i class="fab fa-weixin"></i>' +
        '<span>微信</span>' +
        '<div class="sponsor-qrcode">' +
        '<img src="' + escapeHtml(settings.sponsorWechat) + '" alt="微信收款码">' +
        '</div>' +
        '</div>';
    }

    // QQ
    if (settings.sponsorQQ) {
      html += '<div class="sponsor-item" data-type="qq">' +
        '<i class="fab fa-qq"></i>' +
        '<span>QQ</span>' +
        '<div class="sponsor-qrcode">' +
        '<img src="' + escapeHtml(settings.sponsorQQ) + '" alt="QQ收款码">' +
        '</div>' +
        '</div>';
    }

    // 爱发电
    if (settings.sponsorAfdian) {
      html += '<a href="' + escapeHtml(settings.sponsorAfdian) + '" target="_blank" class="sponsor-item sponsor-link">' +
        '<i class="fas fa-bolt"></i>' +
        '<span>爱发电</span>' +
        '</a>';
    }

    html += '</div></div>';
    container.innerHTML = html;

    // 绑定二维码显示事件
    var items = container.querySelectorAll('.sponsor-item[data-type]');
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('click', function () {
        var qrcode = this.querySelector('.sponsor-qrcode');
        if (qrcode) {
          qrcode.classList.toggle('show');
        }
      });
    }
  }

  /* ----------------------------------------
     Markdown 简易渲染
     ---------------------------------------- */
  function renderMarkdown(text) {
    if (!text) return '';

    var html = text;

    // 转义HTML特殊字符（保留后续要替换的Markdown标记）
    html = html.replace(/&/g, '&amp;');
    html = html.replace(/</g, '&lt;');
    html = html.replace(/>/g, '&gt;');

    // 代码块（```...```）
    html = html.replace(/```([\s\S]*?)```/g, function (match, code) {
      return '<pre><code>' + code.trim() + '</code></pre>';
    });

    // 行内代码（`code`）
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 标题（### ### ## #）
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // 分隔线
    html = html.replace(/^---$/gm, '<hr>');

    // 引用（> text）
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // 粗体（**text**）
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 斜体（*text*）
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // 无序列表（- item）
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    // 把连续的 li 包裹在 ul 中
    html = html.replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // 段落：两个换行符之间的内容
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // 清理空段落
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>\s*(<h[1-3]>)/g, '$1');
    html = html.replace(/(<\/h[1-3]>)\s*<\/p>/g, '$1');
    html = html.replace(/<p>\s*(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)\s*<\/p>/g, '$1');
    html = html.replace(/<p>\s*(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1');
    html = html.replace(/<p>\s*(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)\s*<\/p>/g, '$1');
    html = html.replace(/<p>\s*(<hr>)\s*<\/p>/g, '$1');

    // 换行
    html = html.replace(/\n/g, '<br>');

    return html;
  }

  // 提取摘要（取前100字）
  function getSummary(content, maxLen) {
    maxLen = maxLen || 100;
    // 去掉Markdown标记
    var text = content
      .replace(/#{1,3}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/>/g, '')
      .replace(/---/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\n/g, ' ')
      .trim();
    if (text.length > maxLen) {
      return text.substring(0, maxLen) + '...';
    }
    return text;
  }

  /* ----------------------------------------
     页面路由
     ---------------------------------------- */
  var currentPage = 'home';
  var currentArticleId = null;

  // 导航滑块
  function updateNavSlider(activeEl) {
    var slider = document.getElementById('nav-slider');
    var navLinks = document.querySelector('.nav-links');
    if (!slider || !navLinks) return;

    if (activeEl) {
      var navRect = navLinks.getBoundingClientRect();
      var elRect = activeEl.getBoundingClientRect();
      // 计算相对于导航容器的位置（考虑padding）
      var navPadding = parseFloat(getComputedStyle(navLinks).paddingLeft) || 0;
      slider.style.width = elRect.width + 'px';
      slider.style.transform = 'translateX(' + (elRect.left - navRect.left - navPadding) + 'px)';
      slider.style.opacity = '1';
    } else {
      slider.style.opacity = '0';
    }
  }

  // 页面导航
  function navigateTo(page, articleId) {
    // 隐藏所有页面
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove('active');
    }

    // 更新导航栏高亮
    var navLinks = document.querySelectorAll('.nav-links a, .nav-links button');
    for (var j = 0; j < navLinks.length; j++) {
      navLinks[j].classList.remove('active');
    }

    // 显示目标页面
    var targetId = 'page-' + page;
    var targetPage = document.getElementById(targetId);
    if (targetPage) {
      targetPage.classList.add('active');
    }

    // 导航栏高亮（只在 .nav-links 内查找，避免选中 Logo）
    var activeNav = document.querySelector('.nav-links [data-page="' + page + '"]');
    if (activeNav) {
      activeNav.classList.add('active');
    }

    // 更新导航滑块位置
    updateNavSlider(activeNav);

    currentPage = page;
    currentArticleId = articleId || null;

    // 滚动到顶部
    window.scrollTo(0, 0);

    // 根据页面执行对应逻辑
    switch (page) {
      case 'blog':
        renderBlogList();
        break;
      case 'blog-detail':
        renderArticleDetail(articleId);
        break;
      case 'portfolio':
        renderPortfolio();
        break;
    }
  }

  // 显示指定页面（别名函数）
  function showPage(page, articleId) {
    navigateTo(page, articleId);
  }

  /* ----------------------------------------
     渲染函数
     ---------------------------------------- */
  // 博客列表渲染
  function renderBlogList() {
    var container = document.getElementById('blog-list');
    if (!container) return;
    
    var articles = getArticles();

    // 按日期倒序排列
    articles.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    if (articles.length === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
        '<i class="fas fa-feather-alt"></i>' +
        '<p>还没有文章，稍后再来看看吧</p>' +
        '</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < articles.length; i++) {
      var art = articles[i];
      var tagsHtml = '';
      if (art.tags && art.tags.length > 0) {
        for (var t = 0; t < art.tags.length; t++) {
          tagsHtml += '<span class="tag">' + escapeHtml(art.tags[t]) + '</span>';
        }
      }
      var likes = getLikes(art.id);
      html +=
        '<div class="blog-card" data-id="' + art.id + '">' +
        '  <h3 class="card-title">' + escapeHtml(art.title) + '</h3>' +
        '  <p class="card-meta">' + escapeHtml(art.date) + ' · <i class="fas fa-heart"></i> ' + likes + '</p>' +
        '  <p class="card-summary">' + escapeHtml(getSummary(art.content)) + '</p>' +
        '  <div class="card-tags">' + tagsHtml + '</div>' +
        '</div>';
    }
    container.innerHTML = html;

    // 绑定点击事件
    var cards = container.querySelectorAll('.blog-card');
    for (var c = 0; c < cards.length; c++) {
      cards[c].addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        navigateTo('blog-detail', id);
      });
    }
  }

  // 文章详情渲染
  function renderArticleDetail(articleId) {
    var article = getArticleById(articleId);

    if (!article) {
      navigateTo('blog');
      return;
    }

    document.getElementById('detail-title').textContent = article.title;
    document.getElementById('detail-meta').textContent = article.date;
    document.getElementById('detail-body').innerHTML = renderMarkdown(article.content);

    // 标签
    var tagsContainer = document.getElementById('detail-tags');
    var tagsHtml = '';
    if (article.tags && article.tags.length > 0) {
      for (var t = 0; t < article.tags.length; t++) {
        tagsHtml += '<span class="tag">' + escapeHtml(article.tags[t]) + '</span>';
      }
    }
    tagsContainer.innerHTML = tagsHtml;

    // 渲染点赞按钮
    renderLikeButton(articleId);

    // 渲染评论列表
    renderComments(articleId);
  }

  // 作品集渲染
  function renderPortfolio() {
    var container = document.getElementById('portfolio-grid');
    if (!container) return;
    
    var html = '';
    for (var i = 0; i < DEFAULT_PORTFOLIO.length; i++) {
      var item = DEFAULT_PORTFOLIO[i];
      html +=
        '<div class="portfolio-card">' +
        '  <div class="card-img"><i class="' + item.icon + '"></i></div>' +
        '  <div class="card-body">' +
        '    <h3>' + escapeHtml(item.title) + '</h3>' +
        '    <p>' + escapeHtml(item.desc) + '</p>' +
        '  </div>' +
        '</div>';
    }
    container.innerHTML = html;
  }

  /* ----------------------------------------
     外观设置应用
     ---------------------------------------- */
  // 将设置应用到页面
  function applySettings() {
    var settings = getSettings();

    // 导航栏Logo
    var logo = document.querySelector('.navbar .logo');
    if (logo) logo.textContent = settings.nickname;

    // 页面标题
    document.title = settings.nickname;

    // 首页
    var heroAvatar = document.querySelector('.hero-avatar img');
    if (heroAvatar) heroAvatar.src = settings.avatar;

    var heroName = document.querySelector('.hero .name');
    if (heroName) heroName.textContent = settings.nickname;

    var heroBio = document.querySelector('.hero .bio');
    if (heroBio) heroBio.textContent = settings.bio;

    // 技能标签
    var skillTag = document.querySelector('.hero .skill-tag');
    if (skillTag) {
      var skills = settings.skills.split(/[,，]/).map(function (s) { return s.trim(); }).filter(function (s) { return s; });
      if (skills.length > 0) {
        skillTag.textContent = skills[0];
      }
    }

    // 首页社交链接
    var heroSocial = document.querySelector('.hero .social-links');
    if (heroSocial) {
      var socialHtml = '';
      if (settings.bilibili) {
        socialHtml += '<a href="' + escapeHtml(settings.bilibili) + '" target="_blank" title="哔哩哔哩"><i class="fas fa-tv"></i></a>';
      }
      if (settings.douyin) {
        socialHtml += '<a href="' + escapeHtml(settings.douyin) + '" target="_blank" title="抖音"><i class="fab fa-tiktok"></i></a>';
      }
      if (settings.qq) {
        socialHtml += '<a href="' + escapeHtml(settings.qq) + '" target="_blank" title="QQ"><i class="fab fa-qq"></i></a>';
      }
      if (settings.email) {
        socialHtml += '<a href="mailto:' + escapeHtml(settings.email) + '" title="邮箱"><i class="fas fa-envelope"></i></a>';
      }
      heroSocial.innerHTML = socialHtml;
    }

    // 关于我页面
    var aboutAvatar = document.querySelector('.about-avatar img');
    if (aboutAvatar) aboutAvatar.src = settings.avatar;

    var aboutText = document.querySelector('.about-text');
    if (aboutText) {
      aboutText.innerHTML = escapeHtml(settings.about).replace(/\n/g, '<br>');
    }

    // 技能列表
    var skillsList = document.querySelector('.skills-list');
    if (skillsList) {
      var skills = settings.skills.split(/[,，]/).map(function (s) { return s.trim(); }).filter(function (s) { return s; });
      var skillsHtml = '';
      for (var i = 0; i < skills.length; i++) {
        skillsHtml += '<span class="tag">' + escapeHtml(skills[i]) + '</span>';
      }
      skillsList.innerHTML = skillsHtml;
    }

    // 关于我社交链接
    var aboutSocial = document.querySelector('.about-social .social-links');
    if (aboutSocial) {
      var aboutSocialHtml = '';
      if (settings.bilibili) {
        aboutSocialHtml += '<a href="' + escapeHtml(settings.bilibili) + '" target="_blank"><i class="fas fa-tv"></i> 哔哩哔哩</a>';
      }
      if (settings.douyin) {
        aboutSocialHtml += '<a href="' + escapeHtml(settings.douyin) + '" target="_blank"><i class="fab fa-tiktok"></i> 抖音</a>';
      }
      if (settings.qq) {
        aboutSocialHtml += '<a href="' + escapeHtml(settings.qq) + '" target="_blank"><i class="fab fa-qq"></i> QQ</a>';
      }
      if (settings.email) {
        aboutSocialHtml += '<a href="mailto:' + escapeHtml(settings.email) + '"><i class="fas fa-envelope"></i> 邮箱</a>';
      }
      aboutSocial.innerHTML = aboutSocialHtml;
    }

    // 页脚
    var footer = document.querySelector('.footer');
    if (footer) {
      footer.innerHTML = '&copy; ' + new Date().getFullYear() + ' ' + escapeHtml(settings.nickname) + ' · ' + escapeHtml(settings.bio);
    }

    // 外观设置应用
    applyBackground(settings);
    applyColors(settings);
    applyFont(settings);

    // 渲染赞助区域
    renderSponsorSection();
  }

  // 应用背景图片
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

  // 应用主配色
  function applyColors(settings) {
    var root = document.documentElement;
    root.style.setProperty('--bg-primary', settings.colorBg || DEFAULT_SETTINGS.colorBg);
    root.style.setProperty('--bg-card', settings.colorCard || DEFAULT_SETTINGS.colorCard);
    root.style.setProperty('--text-primary', settings.colorText || DEFAULT_SETTINGS.colorText);
    root.style.setProperty('--accent', settings.colorAccent || DEFAULT_SETTINGS.colorAccent);
    root.style.setProperty('--border-color', settings.colorBorder || DEFAULT_SETTINGS.colorBorder);
  }

  // 应用字体
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
      loadGoogleFont(fontFamily);
    }

    document.documentElement.style.setProperty('--font-family', fontFamily);
  }

  // 加载Google Fonts（按需）
  var loadedFonts = {};
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
     URL路由处理
     ---------------------------------------- */
  // 处理初始页面路由
  function handleInitialRoute() {
    var hash = window.location.hash;
    if (hash && hash.length > 1) {
      var page = hash.substring(1);
      if (['home', 'blog', 'portfolio', 'about'].indexOf(page) !== -1) {
        return page;
      }
      // 检查是否是文章详情页
      if (page.indexOf('article-') === 0) {
        var articleId = page.substring(8);
        return { page: 'blog-detail', articleId: articleId };
      }
    }
    return 'home';
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
    // 导航链接
    var navItems = document.querySelectorAll('[data-page]');
    for (var i = 0; i < navItems.length; i++) {
      navItems[i].addEventListener('click', function (e) {
        e.preventDefault();
        var page = this.getAttribute('data-page');
        navigateTo(page);
      });
    }

    // 博客返回按钮
    var blogBackBtn = document.getElementById('blog-back');
    if (blogBackBtn) {
      blogBackBtn.addEventListener('click', function () {
        navigateTo('blog');
      });
    }

    // 评论提交按钮
    var commentSubmitBtn = document.getElementById('comment-submit');
    if (commentSubmitBtn) {
      commentSubmitBtn.addEventListener('click', function () {
        if (currentArticleId) {
          handleCommentSubmit(currentArticleId);
        }
      });
    }

    // 评论输入框回车提交
    var commentContent = document.getElementById('comment-content');
    if (commentContent) {
      commentContent.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (currentArticleId) {
            handleCommentSubmit(currentArticleId);
          }
        }
      });
    }
  }

  /* ----------------------------------------
     初始化
     ---------------------------------------- */
  function init() {
    // 确保有默认数据
    getArticles();
    bindEvents();

    // 应用站点设置到页面
    applySettings();

    // 根据URL决定初始页面
    var initialRoute = handleInitialRoute();
    if (typeof initialRoute === 'object') {
      navigateTo(initialRoute.page, initialRoute.articleId);
    } else {
      navigateTo(initialRoute);
    }

    // 窗口大小变化时更新滑块位置
    window.addEventListener('resize', function () {
      var activeNav = document.querySelector('.nav-links a.active');
      updateNavSlider(activeNav);
    });
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
