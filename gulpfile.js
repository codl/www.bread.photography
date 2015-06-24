var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cachebuster = require('gulp-cachebust'),
    del = require('del'),
    rsync = require('gulp-rsync'),
    uglify = require('gulp-uglify');

var cachebust = new cachebuster();

gulp.task('clean', function(cb){
    del('build', cb);
});

gulp.task('default', ['build']);

gulp.task('build', ['css', 'js', 'html']);

gulp.task('css', function(){
    return gulp.src('src/*.css')
        .pipe(autoprefixer('> 5%'))
        .pipe(gulp.dest('build/'))
        .pipe(cachebust.resources())
        .pipe(gulp.dest('build/'));
});

gulp.task('js', function(){
    return gulp.src('src/*.js')
        .pipe(gulp.dest('build/'))
        .pipe(uglify())
        .pipe(cachebust.resources())
        .pipe(gulp.dest('build/'));
});

gulp.task('html-no-cachebust', function(){
    return gulp.src('src/*.html')
        .pipe(gulp.dest('build/'));
});

gulp.task('html', ['css', 'js'], function(){
    return gulp.src('src/*.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('build/'));
});

gulp.task('deploy', function(){
    gulp.src('build/')
        .pipe(rsync({root: 'build', hostname: 'ana.bread.photography', destination: '/srv/www.bread.photography', recursive: true, clean: true}));
});