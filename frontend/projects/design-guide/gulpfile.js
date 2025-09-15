const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const webFonts = require('gulp-google-webfonts');
const header = require('gulp-header');
const pkg = require('./package.json');

const banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @homepage <%= pkg.homepage %>',
  ' * @copyright ' + new Date().getFullYear() + ' <%= pkg.author.name %> ',
  ' * @license <%= pkg.license %>',
  ' */',
  '\n',
].join('\n');

const options = {
  fontsDir: './fonts/',
  cssDir: './css/',
  cssFilename: 'googlefonts.css',
};

// create if directory not exists
function checkDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Remove all files
function cleanDist() {
  checkDirExists('../../dist/VRDesignGuide/');
  return gulp.src('../../dist/VRDesignGuide/*').pipe(
    clean({
      force: true,
    }),
  );
}

function compileSassWeb() {
  return gulp
    .src('./src/sass/imports.scss', {
      sourcemaps: false,
    })
    .pipe(
      sass({
        style: 'expanded',
        quiet: false,
        cacheLocation: '.sass-cache',
      }).on('error', sass.logError),
    )
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename('vrdesignguidecss.css'))
    .pipe(replace('../../assets/icons', '../images/icons'))
    .pipe(replace('../../assets/fonts', 'fonts'))
    .pipe(replace(`"Roboto"`, 'Roboto, sans-serif'))
    .pipe(replace(/url\(([^)]+\.woff)\)/g, 'url("../$1")'))
    .pipe(
      header(banner, {
        pkg: pkg,
      }),
    )
    .pipe(gulp.dest('../../dist/VRDesignGuide/css'))
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
    .pipe(gulp.dest('../../dist/VRDesignGuide/css'));
}

function compileSassIcons() {
  return gulp
    .src('./src/assets/icons/vrdesignguide.icons.scss', {
      sourcemaps: false,
    })
    .pipe(
      sass({
        style: 'expanded',
        quiet: false,
        cacheLocation: '.sass-cache',
      }).on('error', sass.logError),
    )
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename('vrdesignguideicons.css'))
    .pipe(replace('../../assets/icons', '../images/icons'))
    .pipe(gulp.dest('../../dist/VRDesignGuide/css'))
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
    .pipe(gulp.dest('../../dist/VRDesignGuide/css'));
}

function moveIcons() {
  return gulp
    .src(['./src/assets/icons/svg/**/*.{gif,jpg,png,svg}'])
    .pipe(gulp.dest('../../dist/VRDesignGuide/images/icons/svg'));
}

function compileSassImages() {
  return gulp
    .src('./src/assets/images/vrdesignguide.images.scss', {
      sourcemaps: false,
    })
    .pipe(
      sass({
        style: 'expanded',
        quiet: false,
        cacheLocation: '.sass-cache',
      }).on('error', sass.logError),
    )
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename('vrdesignguideimages.css'))
    .pipe(replace('../../assets/images', '../images'))
    .pipe(gulp.dest('../../dist/VRDesignGuide/css'))
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
    .pipe(gulp.dest('../../dist/VRDesignGuide/css'));
}

function moveImages() {
  return gulp
    .src(['./src/assets/images/**/*.{gif,jpg,png,svg}'], { encoding: false })
    .pipe(gulp.dest('../../dist/VRDesignGuide/images'));
}

function fonts() {
  try {
    const fonts = gulp
      .src('./src/assets/fonts.list', {
        sourcemaps: false,
      })
      .pipe(webFonts(options))
      .pipe(replace(`'Roboto'`, 'Roboto, sans-serif'))
      .pipe(replace(/url\(([^)]+\.woff)\)/g, 'url("../$1")'))
      .pipe(gulp.dest('../../dist/VRDesignGuide'));

    return fonts;
  } catch (error) {
    throw new Error(error);
  }
}

function CopyPackages() {
  return gulp
    .src(['./package*.json'])
    .pipe(gulp.dest('../../dist/VRDesignGuide'));
}

gulp.task(
  'build',
  gulp.series(
    cleanDist,
    compileSassWeb,
    compileSassIcons,
    moveIcons,
    compileSassImages,
    moveImages,
    fonts,
    CopyPackages,
  ),
);
