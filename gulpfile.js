// Load plugins
var browserSync  = require('browser-sync'),
    gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    changed      = require('gulp-changed'),
    concat       = require('gulp-concat'),
    csso         = require('gulp-csso'),
    duration     = require('gulp-duration'),
    filesize     = require('gulp-size'),
    ghpages      = require('gulp-gh-pages'),
    imagemin     = require('gulp-imagemin'),
    less         = require('gulp-less'),
    newer        = require('gulp-newer'),
    notify       = require('gulp-notify'),
    plumber      = require('gulp-plumber'),
    svgSprite    = require('gulp-svg-sprite'),
    uglify       = require('gulp-uglify'),
    reload       = browserSync.reload;



// Path Variables
var paths =  {
  'html': {
    'src_files': 'dist/*.html'
  },
  'styles': {
    'src_files': 'src/less/**/*.less',
    'dist_dir': 'dist/css/'
  },
  'svgicons': {
    'src_files': 'src/icons/*.svg',
    'dist_dir': 'dist/icons/'
  },
  "js": {
    "src_files": "src/js/*.js",
    "dist_dir": "dist/js/"
  }
};


// HTML
gulp.task('html', function() {
  return gulp.src([paths.html.src_files])
    .pipe(reload({stream:true}));
});


// Styles
gulp.task('styles', function() {
  return gulp.src(['src/less/app.less'])
    .pipe(less({ compress: true }))
    .pipe(autoprefixer({ browsers: ['last 2 versions','ie 9'], cascade: false }))
    .pipe(gulp.dest(paths.styles.dist_dir))
    .pipe(duration('building styles'))
    .pipe(notify({message:'styles task complete'}))
    .pipe(reload({stream:true}));
});


// SVG Icons
gulp.task('svgicons', function () {
  return gulp.src(paths.svgicons.src_files)
  	.pipe(imagemin())
    .pipe(gulp.dest(paths.svgicons.dist_dir))
    .pipe(svgSprite({
      'svg': {
        'xmlDeclaration': false,
        'doctypeDeclaration': false,
        'dimensionAttributes': false
      },
      'mode': {
        'symbol': {
          'dest': '',
          'example': true,
          'sprite': 'sprite.svg'
        }
      }
    }))
    .pipe(gulp.dest(paths.svgicons.dist_dir))
    .pipe(duration('building svg icons'))
    .pipe(notify({ message: 'svg icons task complete' }))
    .pipe(reload({stream:true}));
});


// Javascript
gulp.task('js', function() {
  return gulp.src([
    'bower_components/svg4everybody/svg4everybody.min.js',
    paths.js.src_files
    ])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dist_dir))
    .pipe(duration("building js"))
    .pipe(notify({ message: "js task complete" }))
    .pipe(reload({stream:true}));
});

// Watch
gulp.task('watch', function() {
  gulp.watch(paths.styles.src_files, ['styles']);
  gulp.watch(paths.svgicons.src_files, ['svgicons']);
  gulp.watch(paths.js.src_files, ['js']);
  gulp.watch(paths.html.src_files, ['html']);
});


// Server
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './dist'
    }
  });
});


// Website
gulp.task('website', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghpages());
});


// Default task
gulp.task('default', ['styles','svgicons','js']);

gulp.task('server', ['watch', 'browser-sync'], function () {
    gulp.watch([paths.html.src_files], reload);
});


