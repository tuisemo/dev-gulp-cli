var gulp = require('gulp');
var jsmin = require('gulp-uglify');
var jshint = require('gulp-jshint');
var less = require("gulp-less");
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-clean-css');
var base64 = require('gulp-base64');
var imagemin = require('gulp-imagemin');
var connect = require("gulp-connect");
var gulpPlumber = require('gulp-plumber');
var open = require('gulp-open');
var proxy = require('http-proxy-middleware');
// var browserSync = require('browser-sync').create();
// var reload = browserSync.reload;

gulp.task('jshint', function () {
    return gulp.src(['src/js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('jsmin', ['jshint'], function () {
    gulp.src(['src/js/*.js'])
        // .pipe(jsmin())
        .pipe(gulp.dest('./dist/js'))
        .pipe(connect.reload());
});

gulp.task('less', function () {
    return gulp.src(['src/css/*.less'])
        .pipe(gulpPlumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./src/css'))
        .pipe(connect.reload());
});

gulp.task('cssmin', ['less'], function () {
    gulp.src('src/css/*.css')
        .pipe(gulpPlumber())
        .pipe(cssmin())
        .pipe(base64({
            extensions: ['jpg', 'png', 'jpge'],
            maxImageSize: 1000 * 1024, // bytes 
            debug: true
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('imagemin', function () {
    gulp.src('src/images/*.*')
        .pipe(gulpPlumber())
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
        .pipe(connect.reload());
});

gulp.task('copy', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('src/css/*.less', ['cssmin']);
    gulp.watch('src/js/*.js', ['jsmin']);
    gulp.watch('src/*.*', ['copy']);
    gulp.watch('src/images/*.*', ['imagemin']);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: {
            target: "http://192.168.1.199:8382",
            middleware: function (req, res, next) {
                console.log(req.url);
                next();
            }
        },
        port: 3001,
        server: {
            baseDir: "./dist"
        }
    });
});

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

gulp.task('default', ['watch', 'less', 'cssmin', 'jsmin', 'jshint', 'copy', 'server'], function () {
    // 将你的默认的任务代码放在这
});