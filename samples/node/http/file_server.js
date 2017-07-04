'use strict';

// a simple http server

var
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

var root = path.resolve(process.argv[2] || '.');// 这里控制台输入js文件后面需跟空格再跟路径。路径跟js文件位于同一磁盘下，所以磁盘不用输入
                                                // eg: node demo.js http/args
                                                //demo.js 位于D:/xx/xx/..
                                                //index.html(默认文件)位于D:/http/args

console.log('Static root dir: ' + root);

var server = http.createServer(function (request, response) {
    var
        pathname = url.parse(request.url).pathname, // 默认 index.html
        filepath = path.join(root, pathname); // 'D:/http/args/index.html'
    fs.stat(filepath, function (err, stats) {
        if (!err && stats.isFile()) {
            console.log('200 ' + request.url);
            response.writeHead(200);
            fs.createReadStream(filepath).pipe(response);
        } else {
            console.log('404 ' + request.url);
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
});

server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');
