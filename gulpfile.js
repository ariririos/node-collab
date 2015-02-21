/* jshint node: true, browser: false, esnext: false, strict: false */
/**
  Modified from the original in project-template to add support for web components by:
  //* Adding a new task to compile the scripts for each component: this task ignores all import and export statements, instead relying on global variables from index.js
  * Changing the 'src's in the scripts task, styles task, the html task, and their corresponding gulp.watch calls to watch and compile all .js, .scss and .haml files under src/
  * Forcing a full page reload for css files- it doesn't look like browser-sync can inject css for a component, so we'll just a reload. The CSS injection wasn't working correctly, anyway.
  * Removing the beep() function (see next bullet)
  * Handling errors using gulp-notify's onError method, removed beep() to prevent code smell
**/
var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')({
    rename: {
      'gulp-ruby-haml': 'haml'
    }
  }),
  nodemon = require('nodemon'),
  notifier = require('node-notifier'),
  browserSync = require('browser-sync'),
  port = '8001';

function notify(msg) {
  notifier.notify({
    title: 'Gulp',
    message: msg
  });
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
      }, 500);
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
      .src('src/**/*.js')
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.babel({
        loose: ['es6.forOf'],
        modules: 'amd',
        comments: false,
        experimental: true,
        playground: true
      }))
      .on('error', plugins.notify.onError('Error in script transpilation: \n <%= error.message %>'))
      .pipe(plugins.uglify())
      .on('error', plugins.notify.onError('Error in script minification: \n <%= error.message %>'))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest('public'))
      .on('end', function() {
        notify('Scripts processed successfully.');
      });
  } catch (e) {
    notify('Uncaught error in script processing: ' + e.message);
  }
});

gulp.task('styles', function() {
  try {
    return gulp
      .src('src/**/*.scss')
      .pipe(plugins.changed('public', {
        extension: '.css'
      }))
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.sass({
        errLogToConsole: true,
        onError: function(error) {
          notify('Error in style transpilation: \n' + error.message);
        }
      }))
      .pipe(plugins.minifyCss())
      .on('error',  plugins.notify.onError('Error in style minification: \n <%= error.message %>'))
      .pipe(plugins.autoprefixer('last 2 versions'))
      .on('error', plugins.notify.onError('Error in style autoprefixing: \n <%= error.message %>'))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest('public'))
      .pipe(plugins.filter('**/*.css'))
      .pipe(browserSync.reload({
        stream: true
      }))
      .on('end', function() {
        notify('Styles processed successfully.');
      });
  } catch (e) {
    notify('Uncaught error in styles processing: ' + e.message);
  }
});

gulp.task('html', function() {
  try {
    return gulp
      .src('src/**/*.haml')
      .pipe(plugins.changed('public', {
        extension: '.html'
      }))
      .pipe(plugins.haml())
      .on('error', plugins.notify.onError('Error in haml transpilation: \n <%= error.message %>'))
      .pipe(plugins.minifyHtml())
      .on('error', plugins.notify.onError('Error in haml minification: \n <%= error.message %>'))
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
      .pipe(plugins.babel({
        loose: ['es6.forOf'],
        modules: 'ignore',
        comments: false,
        experimental: true,
        playground: true
      }))
      .on('error', plugins.notify.onError('Error in script transpilation: \n <%= error.message %>'))
      .pipe(plugins.uglify())
      .on('error', plugins.notify.onError('Error in script minification: \n <%= error.message %>'))
      .pipe(plugins.sourcemaps.write())
      .pipe(plugins.rename('server.js'))
      .pipe(gulp.dest('.'))
      .on('end', function() {
        notify('Scripts processed successfully.');
      });
  } catch (e) {
    notify('Uncaught error in script processing: ' + e.message);

  }
});

gulp.task('watch', function() {
  try {
    gulp.watch('src/**/*.js', ['scripts', browserSync.reload]);
    gulp.watch('src/**/*.scss', ['styles']);
    gulp.watch('src/**/*.haml', ['html', browserSync.reload]);
    gulp.watch('server-es6.js', ['server-script', browserSync.reload]);
  } catch (e) {
    notify('Uncaught error: ' + e.message);
  }
});

gulp.task('default', ['browser-sync', 'scripts', 'styles', 'html', 'server-script', 'watch']);
