var browserSync = require('browser-sync'),
    bump        = require('gulp-bump'),
    csslint     = require('gulp-csslint'),
    del         = require('del'),
    gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    scsslint    = require('gulp-scss-lint');

var manifests = ['./bower.json', './package.json'];


gulp.task('bump:patch', function(){
  return gulp.src(manifests)
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});


gulp.task('bump:minor', function(){
  return gulp.src(manifests)
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});


gulp.task('clean:target', function(done){
  del('./target/*', done);
});


gulp.task('lint:css', function() {
  return gulp.src('./target/**/*.css')
    .pipe(csslint('./.csslintrc'))
    .pipe(csslint.reporter());
});


gulp.task('lint:scss', function() {
  return gulp.src('./src/**/*.scss')
    .pipe(scsslint({config: './.scss-lint.yml'}));
});


gulp.task('sass', function compileSass(){
  return gulp.src('./test/*.scss')
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'nested',
      precision: 10,
      sourceComments: false
    }))
    .pipe(gulp.dest('./target'));
});


gulp.task('sync', function(){
  browserSync
    .create()
    .init({
      browser: 'firefox',
      files: ['target/**/*', 'examples/**/*'],
      port: 7000,
      server: {
        baseDir: '.'
      }
    });
});


gulp.task('default', gulp.series('clean:target', 'sass', function watch(){
  gulp.watch(['./src/**/*.scss', './test/**/*.scss'], gulp.task('sass'));
}));
