# dev-gulp-cli
基于gulp构建工具的本地开发脚手架。支持文件热加载；JS语法检测；LESS编译；添加服务代理及json-server模拟服务；

## 依赖
+ gulp
+ json-server
+ concurrently (使用该插件拓展npm scripts)
+ browser-sync (可选)
+ gulp-connect (可选)
+ http-proxy-middleware 
+ gulp-open (打开指定应用+网址)

### 安装
```javascript
npm install
```

### 运行
```javascript
npm run dev
```


## 介绍

脚手架中使用`gulp-connect`和`http-proxy-middleware`实现本地服务及接口代理。
另外，由于`gulp-connect`没有发现有支持默认打开文件的api，于是这里补充了`gulp-open`来实现，这样当我们运行脚手架服务时，即可自动打开浏览器并指定路由地址。

```javascript
gulp.task('server', function () {
    var options = {
        app: 'chrome',
        uri: 'http:localhost:8080'
    };
    connect.server({
        root: 'dist',
        livereload: true,
        port: 8080,
        middleware: function (connect, opt) {
            console.log({
                connect,
                opt
            })
            return [
                proxy('/org', {
                    target: 'https://api.github.com/',
                    changeOrigin: true
                })
            ]
        }
    });
    gulp.src(__filename)
        .pipe(open(options));
});
```

`concurrently`模块帮助我们对`npm scripts`进行了拓展，使得多个执行项可以整合为一条命令语句执行。
安装`concurrently`模块后，修改package.json的 scripts:

```javascript
"command1":"hahaha",
"command2":"xixixi",
"com":"concurrently \"npm run command1\" \"npm run command2\""
```

之后我们执行`npm run com`就会分别执行`npm run command1`和`npm run command2`


`json-sever`是一个可搭建本地模拟数据接口服务的模块，遵循 REST API 规则。具体使用方法可访问[json-server](https://www.npmjs.com/package/json-server)
