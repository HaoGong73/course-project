const {src, dest, series, watch, parallel} = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const htmlReplace = require('gulp-html-replace');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync');
const eslint = require('gulp-eslint');

function browserSync() {
  return browsersync.init({
    server: {
      baseDir: './dist',
    },
    port: 3456,
  })
};

function htmlTask() {
  return src('*.html')
  .pipe(dest('dist/'))
  .pipe(browsersync.stream());
}

function styleTask(){
  return src('css/*.css')
  .pipe(sourcemaps.init())
  .pipe(autoprefixer())
  .pipe(cleanCSS())
  .pipe(sourcemaps.write())
  .pipe(dest('dist/css'))
  .pipe(browsersync.stream());
}

function jsTask(){
  return src('script/*.js')
  .pipe(eslint({}))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(dest('dist/js'))
  .pipe(browsersync.stream());
}

function imagesTask(){
  return src('images/*')
  .pipe(imagemin())
  .pipe(dest('dist/images'))
  .pipe(browsersync.stream());

}

function watchFiles() {
  watch('css/*.css', styleTask);
  watch('js/*.js', jsTask);
  watch('*.html', htmlTask);
  watch('images/*', imagesTask);
}

function prefixTask() {
  return src('css/global.css')
  .pipe(autoprefixer())
  .pipe(dest('dist/css/'));
}

function lintTask() {
  return src('js/test.js')
  .pipe(eslint({fix:true}))
  .pipe(eslint.format())
  .pipe(dest('dist/js'));
}
// .pipe(eslint.failAfterError())

exports.html = htmlTask;
exports.lint = lintTask;
exports.prefix = prefixTask;
exports.watch = browserSync;
exports.dev = series(
  parallel(htmlTask, jsTask, styleTask, imagesTask),
  parallel(watchFiles, browserSync)
); 
exports.default = series(htmlTask, styleTask, jsTask, imagesTask);