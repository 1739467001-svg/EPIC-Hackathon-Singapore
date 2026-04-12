#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const CONTENT_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    
    // Parse URL
    const parsedUrl = url.parse(req.url);
    let filePath = parsedUrl.pathname;
    
    // Default to index.html for root path
    if (filePath === '/') {
        filePath = '/index.html';
    }
    
    // Remove leading slash
    const localPath = path.join(__dirname, filePath.substring(1));
    
    // Check if file exists
    fs.stat(localPath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Try index.html for directories
            if (filePath.endsWith('/')) {
                const indexPath = path.join(__dirname, filePath.substring(1), 'index.html');
                serveFile(indexPath, res);
            } else {
                // Try with .html extension
                const htmlPath = localPath + '.html';
                serveFile(htmlPath, res, () => {
                    // Fallback to 404
                    serve404(res, filePath);
                });
            }
        } else {
            serveFile(localPath, res);
        }
    });
});

function serveFile(filePath, res, notFoundCallback) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (notFoundCallback) {
                notFoundCallback();
            } else {
                serve404(res, filePath);
            }
            return;
        }
        
        // Determine content type
        const ext = path.extname(filePath).toLowerCase();
        const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
        
        // Set headers
        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        
        res.end(data);
    });
}

function serve404(res, path) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 Not Found</title>
            <style>
                body { font-family: sans-serif; padding: 2rem; text-align: center; }
                h1 { color: #666; }
                .error { color: #999; margin-top: 2rem; }
            </style>
        </head>
        <body>
            <h1>404 - File Not Found</h1>
            <p>The requested file <code>${path}</code> was not found on this server.</p>
            <div class="error">
                <p>Try visiting <a href="/">the home page</a></p>
            </div>
        </body>
        </html>
    `);
}

server.listen(PORT, 'localhost', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);
    });
});