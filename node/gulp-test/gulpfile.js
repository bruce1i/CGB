/**
 * Created by lixun on 2016/10/11.
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');

// gulp.task('default', function () {
//     //todo
// });

gulp.task('script', function () {
    gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('auto', function () {
    gulp.watch('js/*.js', ['script']);
});