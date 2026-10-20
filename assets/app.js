// app.js — 读取笔记列表、渲染 markdown、处理路由
(function () {
    'use strict';

    var CFG = { owner: 'Rosalia3001', repo: 'Rosalia-notes', branch: 'main' };

    var el = {
        nav: document.getElementById('nav'),
        article: document.getElementById('article'),
        stat: document.getElementById('stat'),
        toggle: document.getElementById('toc-toggle'),
        sidebar: document.getElementById('sidebar')
    };

    var notes = [];
    var labels = {};

    // ---------- 工具 ----------
    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function dateOf(file) {
        var m = file.match(/^(\d{4})-(\d{2})-(\d{2})/);
        return m ? m[0] : '';
    }

    function monthLabel(ym) {
        var p = ym.split('-');
        return p.length === 2 ? p[0] + ' 年 ' + parseInt(p[1], 10) + ' 月' : '未分类';
    }

    function titleOf(note) {
        if (labels[note.file]) return labels[note.file];
        if (note.title) return note.title;
        return note.file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-?/, '').replace(/-/g, ' ');
    }

    function state(html) {
        el.article.innerHTML = '<div class="state">' + html + '</div>';
    }

    // ---------- 列表 ----------
    function loadIndex() {
        return fetch('./notes-index.json', { cache: 'no-store' })
            .then(function (r) {
                if (!r.ok) throw new Error('no index');
                return r.json();
            })
            .then(function (list) {
                if (!Array.isArray(list) || !list.length) throw new Error('empty');
                return list;
            })
            .catch(function () {
                // 兜底：直接问 GitHub API（每 IP 每小时 60 次）
                var url = 'https://api.github.com/repos/' + CFG.owner + '/' + CFG.repo +
                    '/contents/notes?ref=' + CFG.branch;
                return fetch(url).then(function (r) {
                    if (!r.ok) throw new Error('api ' + r.status);
                    return r.json();
                }).then(function (arr) {
                    return arr.filter(function (x) { return /\.md$/i.test(x.name); })
                        .map(function (x) {
                            return { file: x.name, date: dateOf(x.name) };
                        })
                        .sort(function (a, b) { return b.file.localeCompare(a.file); });
                });
            });
    }

    function renderNav() {
        var groups = {};
        var order = [];
        notes.forEach(function (n) {
            var ym = (n.date || '').slice(0, 7) || '未分类';
            if (!groups[ym]) { groups[ym] = []; order.push(ym); }
            groups[ym].push(n);
        });
        order.sort().reverse();

        var frag = document.createDocumentFragment();
        order.forEach(function (ym) {
            var box = document.createElement('div');
            box.className = 'nav-group';
            var h = document.createElement('h3');
            h.textContent = ym === '未分类' ? ym : monthLabel(ym);
            box.appendChild(h);
            groups[ym].forEach(function (n) {
                var a = document.createElement('a');
                a.className = 'nav-item';
                a.href = '#/' + n.file;
                a.dataset.file = n.file;
                a.textContent = titleOf(n);
                box.appendChild(a);
            });
            frag.appendChild(box);
        });
        el.nav.innerHTML = '';
        el.nav.appendChild(frag);
        el.stat.textContent = notes.length + ' 篇 · 更新于 ' + (notes[0] ? notes[0].date : '');
    }

    function markActive(file) {
        Array.prototype.forEach.call(el.nav.querySelectorAll('.nav-item'), function (a) {
            a.classList.toggle('active', a.dataset.file === file);
        });
    }

    // ---------- 笔记 ----------
    function metaBar(file, words) {
        var d = dateOf(file);
        var edit = 'https://github.com/' + CFG.owner + '/' + CFG.repo + '/edit/' + CFG.branch + '/notes/' + encodeURI(file);
        return '<div class="note-meta"><span>' + (d || '') + '</span>' +
            (words ? '<span>约 ' + words + ' 字</span>' : '') +
            '<a class="edit" href="' + edit + '" target="_blank" rel="noopener">在 GitHub 上编辑 ↗</a></div>';
    }

    function loadNote(file) {
        state('正在读取…');
        fetch('./notes/' + encodeURI(file), { cache: 'no-store' })
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.text();
            })
            .then(function (md) {
                var words = md.replace(/\s/g, '').length;
                el.article.innerHTML = metaBar(file, words) + marked.parse(md);

                Array.prototype.forEach.call(el.article.querySelectorAll('a[href^="http"]'), function (a) {
                    a.target = '_blank';
                    a.rel = 'noopener';
                });

                var h1 = el.article.querySelector('h1');
                if (h1) {
                    labels[file] = h1.textContent.trim();
                    var item = el.nav.querySelector('.nav-item[data-file="' + file + '"]');
                    if (item) item.textContent = labels[file];
                    document.title = labels[file] + ' · Rosalia 的知识库';
                }
                markActive(file);
                window.scrollTo(0, 0);
            })
            .catch(function (err) {
                state('读取失败（' + esc(err.message) + '）。<br><br>' +
                    '如果是双击本地文件打开的，请通过线上地址访问，或在仓库目录运行 <code>python -m http.server</code>。');
            });
    }

    // ---------- 路由 ----------
    function route() {
        var file = decodeURIComponent((location.hash || '').replace(/^#\/?/, ''));
        if (!file && notes.length) file = notes[0].file;
        if (!file) return;
        loadNote(file);
        if (window.innerWidth <= 900) {
            el.sidebar.classList.remove('open');
            el.toggle.setAttribute('aria-expanded', 'false');
        }
    }

    // ---------- 初始化 ----------
    el.nav.addEventListener('click', function (e) {
        var a = e.target.closest('.nav-item');
        if (a) { /* 交给 hash 变化触发 */ }
    });

    el.toggle.addEventListener('click', function () {
        var open = el.sidebar.classList.toggle('open');
        el.toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    window.addEventListener('hashchange', route);

    loadIndex()
        .then(function (list) {
            notes = list.slice().sort(function (a, b) { return b.file.localeCompare(a.file); });
            renderNav();
            route();
        })
        .catch(function () {
            state('读不到笔记列表。<br><br>可能是网络被拦截，或者仓库还没有笔记。' +
                '可以直接去 <a href="https://github.com/' + CFG.owner + '/' + CFG.repo + '">GitHub 仓库</a> 查看。');
        });
})();
