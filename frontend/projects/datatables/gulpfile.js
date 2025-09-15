const gulp = require('gulp');

const rename = require('gulp-rename');

function copyAssetsThemes() {
  return gulp
    .src('./src/lib/assets/themes/**/*')
    .pipe(gulp.dest('./../../dist/VRDatatables/assets/themes'));
}

function copyAndRename() {
  return gulp
    .src('./src/lib/components/datatable.component.scss')
    .pipe(rename('vrc-datatable.scss'))
    .pipe(gulp.dest('./../../dist/VRDatatables/assets'));
}

gulp.task('copyDocuments', gulp.series(copyAssetsThemes, copyAndRename));
