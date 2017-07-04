/*
将失败、成功函数单独提取出来
访问网址不是文件而是文件夹的话，会查询文件夹下文件是否有index.html，若有则返回，没有则报错
不足：文件夹深度为一，并未设置成深度为N的模式
**/
'use strict'
var url = require('url');
var fs = require('fs');
var path = require('path');
var http = require('http');

var root = path.resolve(process.argv[2] || '.');
console.log('Static root dir:' + root);

var server = http.createServer(function(req, res){
    var pathname = url.parse(req.url).pathname;
    var filepath = path.join(root, pathname);
    console.log(filepath);
    fs.stat(filepath, function(err, stats){
        if (!err && stats.isFile()) {
            Suc(req, res, filepath);
        } else if (!err && stats.isDirectory()){
            fs.readdir(filepath, function(err, files){
                if (err) {
                    Err(req, res);
                } else {
                    files.forEach(val => {
                        if ('index.html' == val){
                            filepath = path.join(filepath, 'index.html');
                            Suc(req, res, filepath);
                        }
                    });
                }
            });
        } else {
            Err(req, res);
        }
    });
}).listen(8080);

function Err(request, response){
    console.log('404' + request.url);
    response.writeHead(404);
    response.end('404 Not Found');
}

function Suc(request, response, filepa){
    console.log('200' + request.url);
    response.writeHead(200);
    fs.createReadStream(filepa).pipe(response);
}

console.log('Server is running at http://127.0.0.1:8080/a');
