const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const PUBLIC_DIR = __dirname;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // 默认首页
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // SPA路由支持: /admin 等路径都返回 index.html
    // 匹配所有非文件路径，返回index.html由前端处理
    const requestExt = path.extname(pathname).toLowerCase();
    const knownExts = Object.keys(mimeTypes);
    const isKnownFile = knownExts.indexOf(requestExt) !== -1;

    let filePath;
    if (!isKnownFile) {
        // 非已知文件扩展名，视为SPA路由
        // /admin 路径返回 admin/index.html
        // /editor 路径返回 editor/index.html
        if (pathname === '/admin' || pathname.startsWith('/admin/')) {
            filePath = path.join(PUBLIC_DIR, 'admin', 'index.html');
        } else if (pathname === '/editor' || pathname.startsWith('/editor/')) {
            filePath = path.join(PUBLIC_DIR, 'editor', 'index.html');
        } else {
            filePath = path.join(PUBLIC_DIR, 'index.html');
        }
    } else {
        filePath = path.join(PUBLIC_DIR, pathname);
    }

    // 安全检查
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('500 Server Error');
            }
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
