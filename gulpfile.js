var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');

gulp.task('minify-html', function() {
    return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .on('error', function(err) {
            console.log('html Error!', err.message);
            this.end();
        })
        .pipe(gulp.dest('./public'))
});
gulp.task('minify-css', function() {
    return gulp.src('./public/**/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./public'));
});
gulp.task('minify-js', function() {
    return gulp.src(['./public/js/**/*.js', '!./public/js/**/*.{min,mini}.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});
gulp.task('minify-images', function() {
    return gulp.src('./public/img/**/*.*')
        .pipe(imagemin(
        [imagemin.gifsicle({'optimizationLevel': 3}),
        imagemin.jpegtran({'progressive': true}),
        imagemin.optipng({'optimizationLevel': 8}),
        imagemin.svgo()],
        {'verbose': true}))
        .pipe(gulp.dest('./public/img'))
});
gulp.task('default', gulp.parallel('minify-html','minify-css','minify-js','minify-images', function(done){
    done();
}));
