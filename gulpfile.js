/**
 * Created by LikoLu on 2016/4/20.
 */
var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('gulp-webpack');
var livereload = require('gulp-livereload');
var filter = require('gulp-filter');
var useref = require('gulp-useref');

// var uglify = require('gulp-uglify');

gulp.task('webpack',function(){
    return gulp.src('./src/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./script'))
        .pipe(livereload())
});
gulp.task('webpack:p',function(){
    return gulp.src('./src/index.js')
        .pipe(webpack(require('./webpack.public.config.js')))
        // .pipe(uglify())
        .pipe(gulp.dest('./script'))
        .pipe(livereload())
});
gulp.task('webpack:watch',function(){
    gulp.watch(['./src/js/**/*.js','index.html','./src/js/templates/*.html'],['webpack'],function(){
        gulp.run(['webpack']);
    });
});
gulp.task('live',function(){
    livereload.listen();
    gulp.watch(['./src/js/**/*.js','index.html','./src/js/templates/*.html'],['webpack']);
});
gulp.task('public',function(){
    var jsFilter = filter(['**/*.js','!**/.config.js'],{restore:true});
    var cssFilter = filter(['**/*.css'],{restore:true});
    gulp.src('./css/fonts/*').pipe(gulp.dest('./public/css/fonts'));
    gulp.src('./css/font-awesome/font/*').pipe(gulp.dest('./public/font'));
    gulp.src('./index.html')
        .pipe(useref())
        .pipe(jsFilter)
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(cssFilter.restore)
        .pipe(gulp.dest('./public'))
});