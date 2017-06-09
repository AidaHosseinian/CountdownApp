var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');

gulp.task('cssCompile', function () {
    gulp.src('src/scss/stylesheet.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('jsMinify', function () {
    gulp.src('src/main.js')
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('./dist/js/'))
});

//Watch task
gulp.task('default', function () {
    gulp.watch('src/scss/**/*.scss', ['cssCompile']);
    gulp.watch('src/main.js', ['jsMinify']);
});