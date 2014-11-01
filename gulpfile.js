// Load plugins
var browserSync  = require('browser-sync'),
    gulp         = require('gulp'),
    autoprefixer = require("gulp-autoprefixer"),
    changed      = require("gulp-changed"),
    concat       = require("gulp-concat"),
    csso         = require("gulp-csso"),
    duration     = require("gulp-duration"),
    filesize     = require("gulp-size"),
    imagemin     = require("gulp-imagemin"),
    less         = require('gulp-less'),
    newer        = require("gulp-newer"),
    notify       = require("gulp-notify"),
    plumber      = require('gulp-plumber'),
    svgSprite    = require("gulp-svg-sprites"),
    uglify       = require("gulp-uglify"),
    reload       = browserSync.reload;



// Path Variables
var paths =  {
  "html": {
    "src_files": "*.html"
  },
  "styles": {
    "src_files": "src/less/**/*.less",
    "dist_dir": "dist/css/"
  },
  "svgicons": {
    "src_files": "src/icons/svg/*.svg",
    "dist_dir": "dist/icons/"
  }
};


// Styles
gulp.task('styles', function() {
  return gulp.src(["src/less/app.less"])
    .pipe(plumber(function(error) {
          
        }))
    .pipe(less({ compress: true }))
    .pipe(autoprefixer({ browsers: ['last 2 versions','ie 9'], cascade: false }))
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.styles.dist_dir))
    .pipe(duration("building styles"))
    .pipe(notify({ message: "styles task complete" }))
    .pipe(reload({stream:true}));
});




// SVG Icons
gulp.task('svgicons', function () {
  return gulp.src(paths.svgicons.src_files)
  	.pipe(imagemin())
    .pipe(svgSprite({
      selector: "icon-%f",
      mode: "symbols"
    }))
    .pipe(gulp.dest(paths.svgicons.dist_dir))
    .pipe(duration("building svg icons"))
    .pipe(notify({ message: "svg icons task complete" }))
    .pipe(reload({stream:true}));
});


// Watch
gulp.task("watch", function() {
  gulp.watch(paths.styles.src_files, ["styles"]);
  gulp.watch(paths.svgicons.src_files, ["svgicons"]);
});


// Server
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});



// Default task
gulp.task('default', ['styles','svgicons']);

gulp.task('server', ['watch', 'browser-sync'], function () {
    gulp.watch([paths.html.src_files], reload);
});


