/* jshint node: true, browser: false, esnext: false, strict: false */
var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')({
    rename: {
      'gulp-6to5': 'to5',
      'gulp-ruby-haml': 'haml'
    }
  }),
  nodemon = require('nodemon'),
  notifier = require('node-notifier'),
  browserSync = require('browser-sync'),
  port = '8000';

function notify(msg) {
  notifier.notify({
    title: 'Gulp',
    message: msg
  });
}

function beep() {
  console.log('\007');
}

gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon({
    script: 'server.js',
    watch: ['server.js']
  })
    .on('start', function() {
    if (!called) {
      cb();
    }
    called = true;
  })
    .on('restart', function() {
        setTimeout(function() {
          browserSync.reload({
            stream: false
          });
        }, 2000);
    });
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init({
    proxy: 'http://localhost:' + port,
    port: '300' + port.slice(-1)
  });
});

gulp.task('scripts', function() {
  try {
    return gulp
      .src('src/scripts/*.js')
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.to5({
        loose: ['es6.forOf'],
        modules: 'amd',
        comments: false,
        experimental: true,
        playground: true
      }))
      .on('error', function(error) {
        notify('Error in script transpilation: \n' + error.message);
        beep();
      })
      .pipe(plugins.uglify())
      .on('error', function(error) {
        notify('Error in script minification: \n' + error.message);
        beep();
      })
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest('public/scripts'))
      .on('end', function() {
        notify('Scripts processed successfully.');
      });
  }
  catch (e) {
    notify('Uncaught error in script processing: ' + e.message);
    beep();
  }
});

gulp.task('styles', function() {
  try {
    return gulp
      .src('src/styles/*.scss')
      .pipe(plugins.changed('public', {
        extension: '.css'
      }))
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({
        errLogToConsole: true,
        onError: function(error) {
          notify('Error in style transpilation: \n' + error.message);
          beep();
        }
      }))
      .pipe(plugins.minifyCss())
      .on('error', function(error) {
        notify('Error in style minification: \n' + error.message);
        beep();
      })
      .pipe(plugins.autoprefixer('last 2 versions'))
      .on('error', function(error) {
        notify('Error in style autoprefixing: \n' + error.message);
        beep();
      })
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest('public/styles/'))
      .pipe(plugins.filter('**/*.css'))
      .pipe(browserSync.reload({
        stream: true
      }))
      .on('end', function() {
        notify('Styles processed successfully.');
      });
  } catch (e) {
    notify('Uncaught error in styles processing: ' + e.message);
    beep();
  }
});

gulp.task('html', function() {
  try {
    return gulp
      .src('src/index.haml')
      .pipe(plugins.changed('public', {
        extension: '.html'
      }))
      .pipe(plugins.haml())
      .on('error', function(error) {
        notify('Error in haml transpilation: \n' + error.message);
        beep();
      })
      .pipe(plugins.minifyHtml())
      .on('error', function(error) {
        notify('Error in html minification: \n' + error.message);
        beep();
      })
      .pipe(gulp.dest('public'))
      .on('end', function() {
        notify('Haml processed successfully.');
      });
  } catch (e) {
    notify('Uncaught error in haml processing: ' + e.message);
  }
});

gulp.task('server-script', function() {
  try {
    return gulp
      .src('server-es6.js')
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.to5({
        loose: ['es6.forOf'],
        modules: 'ignore',
        comments: false,
        experimental: true,
        playground: true
      }))
      .on('error', function(error) {
        notify('Error in script transpilation: \n' + error.message);
        beep();
      })
      .pipe(plugins.uglify())
      .on('error', function(error) {
        notify('Error in script minification: \n' + error.message);
        beep();
      })
      .pipe(plugins.sourcemaps.write())
      .pipe(plugins.rename('server.js'))
      .pipe(gulp.dest('.'))
      .on('end', function() {
        notify('Scripts processed successfully.');
      });
  }
  catch (e) {
    notify('Uncaught error in script processing: ' + e.message);
    beep();
  }
});

gulp.task('watch', function() {
  try {
    gulp.watch('src/scripts/*.js', ['scripts', browserSync.reload]);
    gulp.watch('src/styles/*.scss', ['styles']);
    gulp.watch('src/index.haml', ['html', browserSync.reload]);
    gulp.watch('server-es6.js', ['server-script', browserSync.reload]);
  } catch (e) {
    notify('Uncaught error: ' + e.message);
    beep();
  }
});

gulp.task('default', ['browser-sync', 'scripts', 'styles', 'html', 'server-script', 'watch']);

gulp.task('brackets-default', ['default']);
