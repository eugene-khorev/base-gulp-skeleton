var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var sync = require('browser-sync');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var csso = require('gulp-csso');
var swig = require('gulp-swig');
var htmlmin = require('gulp-htmlmin');
var watch = require('gulp-watch');

gulp.task('clean-images', function () {
  return gulp.src(['./dist/images/*.*', './build/images/*.*'], {
      read: false
    })
    .pipe(clean());
});

gulp.task('clean-fonts', function () {
  return gulp.src(['./dist/fonts/*.*', './build/fonts/*.*'], {
      read: false
    })
    .pipe(clean());
});

gulp.task('clean-styles', function () {
  return gulp.src(['./dist/css/*.css', './build/css/*.css'], {
      read: false
    })
    .pipe(clean());
});

gulp.task('clean-scripts', function () {
  return gulp.src(['./dist/js/*.js', './build/js/*.js'], {
      read: false
    })
    .pipe(clean());
});

gulp.task('clean-templates', function () {
  return gulp.src(['./build/*.html', './dist/*.html'], {
      read: false
    })
    .pipe(clean());
});

gulp.task('images', ['clean-images'], function (cb) {
  var task = gulp.src(['./src/images/*.*'])
    .pipe(gulp.dest('./build/images'));

  if (!debug) {
    task.pipe(gulp.dest('./dist/images'));
  }

  return task.pipe(sync.reload({
    stream: true
  }));
});

gulp.task('fonts', ['clean-fonts'], function (cb) {
  var task = gulp.src(['./src/fonts/*.*'])
    .pipe(gulp.dest('./build/fonts'));

  if (!debug) {
    task.pipe(gulp.dest('./dist/fonts'));
  }

  return task.pipe(sync.reload({
    stream: true
  }));
});

gulp.task('styles', ['clean-styles'], function (cb) {
  var task = gulp.src(['./src/css/*.scss'])
    .pipe(sass())
    .pipe(postcss([ autoprefixer({ browsers: ['Explorer <= 8', 'Firefox <= 20', 'Chrome <= 30'] }) ]) )
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./build/css'));

  if (!debug) {
    task.pipe(csso())
      .pipe(gulp.dest('./dist/css'))
  }
  return task.pipe(sync.reload({
    stream: true
  }));
});

gulp.task('scripts', ['clean-scripts'], function (cb) {
  var task = gulp.src(['./build/js/*.js', './src/js/*.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./build/js'));

  if (!debug) {
    task.pipe(uglify())
      .pipe(gulp.dest('./dist/js'))
  }

  return task.pipe(sync.reload({
    stream: true
  }));
});

gulp.task('templates', ['clean-templates', 'scripts'], function (cb) {
  var commonData = JSON.parse(fs.readFileSync('./src/json/common.json', 'utf8'));
  var opts = {
    load_json: true,
    json_path: './src/json/pages/',
    defaults: {
      cache: false,
      locals: commonData
    }
  };

  var task = gulp.src(['./src/swig/pages/*.swig'])
    .pipe(swig(opts))
    .pipe(gulp.dest('./build'));

  if (!debug) {
    task.pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeEmptyAttributes: true,
        collapseBooleanAttributes: true,
      }))
      .pipe(gulp.dest('./dist'))
  }

  return task.pipe(sync.reload({
    stream: true
  }));
});

gulp.task('all', ['styles', 'scripts', 'templates', 'images', 'fonts'], function (cb) {
    cb();
});

gulp.task('serve', ['all'], function (cb) {
  sync({
    server: debug ? './build' : './dist',
    reloadDelay: 500
  });

  watch(['./src/images/*.*'], function (event) {
    gulp.start('images');
  });

  watch(['./src/fonts/*.*'], function (event) {
    gulp.start('fonts');
  });

  watch(['./src/css/**/*.scss'], function (event) {
    gulp.start('styles');
  });

  watch(['./src/js/*.js', './src/json/**/*.json', './src/swig/layouts/*.swig', './src/swig/partials/*.swig', './src/swig/pages/*.swig'], function (event) {
    gulp.start('templates');
  });
});

gulp.task('debug', function (event) {
  debug = true;
  gulp.start('serve');
});

gulp.task('default', function (event) {
  debug = false;
  gulp.start('serve');
});

// default value (DO NOT CHANGE)
var debug = false;
