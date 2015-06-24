var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cachebuster = require('gulp-cachebust');
var rsync = require('gulp-rsync');
var uglify = require('gulp-uglify');

var connect = require('connect');
var serveStatic = require('serve-static');
var morgan = require('morgan');

var del = require('del');

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

gulp.task('watch', ['js', 'css', 'html-no-cachebust'], function(){
    gulp.watch('src/*.js', ['js']);
    gulp.watch('src/*.css', ['css']);
    gulp.watch('src/*.html', ['html-no-cachebust']);
});

gulp.task('serve', ['watch'], function(){
    connect().use(morgan('tiny')).use(serveStatic('build/')).listen(8080);
    console.log("Listening on 0.0.0.0:8080");
});
