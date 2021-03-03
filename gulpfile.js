let gulp = require("gulp");
let uglify = require('gulp-uglify-es').default;

gulp.task("uglify", function() {
  return gulp.src("public/*.js")
    .pipe(uglify({
      mangle: {
        toplevel: true
      }
    }))
    .pipe(gulp.dest("public/"));
});
