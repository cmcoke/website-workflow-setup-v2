// Gulp loader

const {
  src,
  dest,
  task,
  watch,
  series,
  parallel
} = require('gulp');

// --------------------------------------------
// Dependencies
// --------------------------------------------

// CSS / SASS plugins
let sass = require('gulp-sass');
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let rucksack = require('rucksack-css');
let minifycss = require('gulp-clean-css');

// JSS / plugins
let uglify = require('gulp-uglify');

// Utility plugins
let concat = require('gulp-concat');
let del = require('del');
let plumber = require('gulp-plumber');
let sourcemaps = require('gulp-sourcemaps');
let rename = require('gulp-rename');

// Browser plugins
let browserSync = require('browser-sync').create();

// Images plugins
let images = require('gulp-imagemin');


// Project Variables

let styleSrc = './app/source/scss/**/*.scss';
let styleDest = './app/build/assets/css/';

let vendorSrc = './app/source/scripts/vendors/';
let vendorDest = './app/build/assets/scripts/';
let scriptSrc = './app/source/scripts/*.js';
let scriptDest = './app/build/assets/scripts/';

let htmlSrc = './app/source/';
let htmlDest = './app/build/';




// --------------------------------------------
// Stand Alone Tasks
// --------------------------------------------


// Compiles SASS files
function css(done) {
  src('./app/source/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({
      style: 'compressed'
    }))
    .pipe(postcss([autoprefixer(), rucksack()]))
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    // uncomment the below script to minify the css when the project is completed
    // .pipe(minifycss({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(dest('./app/build/assets/css'));
  done();
};


// Images
function img(done) {
  src('./app/source/img/*')
    .pipe(images())
    .pipe(dest('./app/build/assets/img'));
  done();
};

// Uglify js files
function js(done) {
  src('./app/source/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest('./app/build/assets/scripts'));
  done();
};

//Concat and Compress Vendor .js files
function vendor(done) {
  src(
      [
        './app/source/scripts/vendors/jquery.min.js',
        './app/source/scripts/vendors/*.js'
      ])
    .pipe(plumber())
    .pipe(concat('vendors.js'))
    .pipe(uglify())
    .pipe(dest('./app/build/assets/scripts'));
  done();
};



// Watch for changes

function watcher() {

  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: "./app/build"
    },
    notify: false
  });

  watch(styleSrc, series(css));
  watch(scriptSrc, series(js));
  watch(vendorSrc, series(vendor));
  watch(['./app/build/*.html', './app/source/scss/**/*.scss', './app/build/assets/css/*.css', './app/source/scripts/**/*.js', './app/build/assets/scripts/*.js', './app/build/assets/scripts/vendors/*.js']).on('change', browserSync.reload);

};


// use default task to launch Browsersync and watch JS files
let build = parallel(watcher);
task('default', build);
task('img', img);
