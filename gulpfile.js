/**
 * Created by LikoLu on 2016/4/20.
 */
var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('gulp-webpack');
var livereload = require('gulp-livereload');
var filter = require('gulp-filter');
var useref = require('gulp-useref');

gulp.task('webpack',function(){
    return gulp.src('./src/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./script'))
        .pipe(livereload())
});
gulp.task('webpack:watch',function(){
    gulp.watch(['./src/**/*.js','index2.html','./src/templates/*.html'],['webpack'],function(){
        gulp.run(['webpack']);
    });
});
gulp.task('live',function(){
    livereload.listen();
    gulp.watch(['./src/**/*.js','index2.html','./src/templates/*.html'],['webpack']);
});
gulp.task('public',function(){
    var jsFilter = filter(['**/*.js','!**/.config.js'],{restore:true});
    return gulp.src('./index-backup.html')
        .pipe(useref())
        .pipe(jsFilter)
        .pipe(jsFilter.restore)
        .pipe(gulp.dest('./build'))
});