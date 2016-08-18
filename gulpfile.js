var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    wiredep = require('wiredep').stream,
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    inject = require('gulp-inject'),
    open = require('gulp-open');

var jsSources = ['app/**/*.js'],
    cssSources = ['app/**/*.css'],
    htmlSources = ['app/*.html'];

gulp.task('watch', function() {
    gulp.watch(jsSources, ['js']);
    gulp.watch(cssSources, ['css']);
    gulp.watch(htmlSources, ['html']);
});

var paths = ['./app/bower_components/','./app/js/app.js','./app/secrets/*.js','./app/js/**/*.js','./app/css/**/*.css'];

gulp.task('inject', function() {
    var sources = gulp.src(paths, {read: false});
    return gulp.src('./app/index.html')
        .pipe(wiredep())
        .pipe(inject(sources, { relative: true }))
        .pipe(gulp.dest('./app'));
});

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(connect.reload())
});

gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(connect.reload())
});

gulp.task('css', function() {
    gulp.src(cssSources)
        .pipe(connect.reload())
});

gulp.task('connect', function() {
    connect.server({
        root: './app',
        livereload: true
    })
});

gulp.task('app', function(){
    var options = {
        uri: 'http://localhost:8080',
        app: 'firefox'
    };
    gulp.src('./app/index.html')
        .pipe(open(options));
});


gulp.task('serve', ['connect', 'watch', 'inject', 'app']);
