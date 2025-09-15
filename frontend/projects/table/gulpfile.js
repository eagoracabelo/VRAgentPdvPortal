const gulp = require('gulp');

const rename = require('gulp-rename');

function copyAssetsIcones() {
  return gulp
    .src('./src/lib/assets/icons/**/*')
    .pipe(gulp.dest('./../../dist/VRTable/assets/icons'));
}

function copyAssetsThemes() {
  return gulp
    .src('./src/lib/assets/themes/**/*')
    .pipe(gulp.dest('./../../dist/VRTable/assets/themes'));
}

function copyAndRename() {
  return gulp
    .src('./src/lib/components/table.component.scss')
    .pipe(rename('vrc-table.scss'))
    .pipe(gulp.dest('./../../dist/VRTable/assets'));
}

gulp.task(
  'copyDocuments',
  gulp.series(copyAssetsIcones, copyAssetsThemes, copyAndRename),
);
