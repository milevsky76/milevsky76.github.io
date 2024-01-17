const {
    src,
    dest,
    watch,
    parallel,
    series
  } = require('gulp');
  
  const scss = require('gulp-sass')(require('sass'));
  const concat = require('gulp-concat');
  const uglify = require('gulp-uglify-es').default;
  const browserSync = require('browser-sync').create();
  const autoprefixer = require('gulp-autoprefixer');
  const clean = require('gulp-clean');
  const avift = require('gulp-avif');
  const webp = require('gulp-webp');
  const imagemin = require('gulp-imagemin');
  const newer = require('gulp-newer');
  const svgSprite = require('gulp-svg-sprite');
  
  function sprite() {
    return src('app/img/*.svg')
      .pipe(svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
            example: true
          }
        }
      }))
      .pipe(dest('app/img'))
  }
  
  function images() {
    return src(['app/img/src/*.*', '!app/img/src/*.svg'])
      // .pipe(newer('app/img'))
      // .pipe(avift({
      //   quality: 50
      // }))
  
      // .pipe(src('app/img/src/*.*'))
      .pipe(newer('app/img'))
      .pipe(webp())
  
      .pipe(src('app/img/src/*.*'))
      .pipe(newer('app/img'))
      .pipe(imagemin())
  
      .pipe(dest('app/img'))
  }
  
  function styles() {
    return src('app/scss/style.scss')
      .pipe(concat('style.min.css'))
      .pipe(scss({
        outputStyle: 'compressed'
      }))
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions']
      }))
      .pipe(dest('app/css'))
      .pipe(browserSync.stream())
  }
  
  function scripts() {
    return src('app/js/main.js')
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(dest('app/js'))
      .pipe(browserSync.stream())
  }
  
  function watching() {
    watch(['app/scss/**/*.scss'], styles)
    // watch(['app/img/src'], images)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
  }
  
  function browsersync() {
    browserSync.init({
      server: {
        baseDir: "app/"
      },
      browser: 'chrome'
    });
  }
  
  function building() {
    return src([
        'app/css/style.min.css',
        'app/img/*.*',
        // '!app/img/*.svg',
        // 'app/img/sprite.svg',
        'app/js/main.min.js',
        'app/*.html'
      ], {
        base: 'app'
      })
      .pipe(dest('docs'))
  }
  
  function cleanDocs() {
    return src('docs')
      .pipe(clean())
  }
  
  exports.styles = styles;
  exports.sprite = sprite;
  exports.images = images;
  exports.scripts = scripts;
  exports.watching = watching;
  exports.browsersync = browsersync;
  
  exports.build = series(cleanDocs, building);
  exports.default = parallel(styles, /*images, */ scripts, browsersync, watching);