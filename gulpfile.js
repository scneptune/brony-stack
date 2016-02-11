//initialize all of our variables
var app, base, concat, directory, gulp,
    gutil, hostname, path, refresh, sass,
    uglify, imagemin, minifyCSS, del,
    browserSync, autoprefixer, gulpSequence,
    shell, sourceMaps, plumber,
    babel, eslint, eslintOptions, mochaTest;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

require('dotenv').config();

//load all of our dependencies
//add more here if you want to include more libraries
gulp        = require('gulp');
gutil       = require('gulp-util');
babel       = require('gulp-babel');
concat      = require('gulp-concat');
uglify      = require('gulp-uglify');
sass        = require('gulp-sass');
eslint      = require('gulp-eslint');
sourceMaps  = require('gulp-sourcemaps');
imagemin    = require('gulp-imagemin');
minifyCSS   = require('gulp-minify-css');
browserSync = require('browser-sync');
mochaTest   = require('gulp-mocha');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell       = require('gulp-shell');
plumber     = require('gulp-plumber');

//TODO: probably could move this out to a .eslintrtc file.
eslintOptions = {
  extends: 'eslint:recommended',
  env: {
    browser: true,
    mocha: true,
    es6: true
  },
  fix: true,
  rules: {
    'prefer-template': 2,
    'init-declarations': [2, 'always'],
    'no-delete-var': 2,
    'vars-on-top': 2,
    'no-console': 0,
    'no-undef': 0,
    'no-implied-eval': 2,
    'eqeqeq': 2,
    'valid-jsdoc': [2, {requireParamDescription: false}],
    'valid-typeof': 2,
    'no-dupe-keys': 2
  }
};


gulp.task('browserSync', function() {
    browserSync({
        proxy: "localhost:" + (process.env.SERVER_PORT || 9000),
        options: {
            reloadDelay: 250
        },
        notify: true
    });
});


//compressing images & handle SVG files
gulp.task('images', function(tmp) {
    gulp.src(['src/images/*.jpg', 'src/images/*.png'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest('src/precompiled/images'));

    gulp.src(['!src/images/*.jpg', '!src/images/*.png', 'src/images/*.*'])
        .pipe(plumber())
        .pipe(gulp.dest('src/precompiled/images'));
});

//compressing images & handle SVG files
gulp.task('images-deploy', function() {
    gulp.src(['src/precompiled/images/**/*', '!precompiled/images/README'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist/images'));
});

//compiling our Javascripts
gulp.task('scripts', function() {
    //this is where our dev JS scripts are
    return gulp.src(['src/javascripts/**/*.js'])
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber())
                // run through a es2015 babel sensitive lint
                .pipe(eslint(eslintOptions))
                //give us some formatted results in the console.
                .pipe(eslint.format())
                //babel precompilation
                .pipe(babel({
                  presets: ['es2015', 'react', 'stage-0']
                }))
                //this is the filename of the compressed version of our JS
                .pipe(concat('client-app.js'))
                //catch errors
                .on('error', gutil.log)
                //where we will store our finalized, compressed script
                .pipe(gulp.dest('src/precompiled/javascripts'))
                //notify browserSync to refresh
                .pipe(browserSync.reload({stream: true}));
});

//compiling our Javascripts for deployment
gulp.task('scripts-deploy', function() {
    //this is where our dev JS scripts are
    return gulp.src(['src/javascripts/**/*.js'])
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber())
                // run through a es2015 babel sensitive lint
                .pipe(eslint(eslintOptions))
                //give us some formatted results in the console.
                .pipe(eslint.format())
                //babel precompilation
                .pipe(babel({
                  presets: ['es2015', 'react', 'stage-0']
                }))
                //this is the filename of the compressed version of our JS
                .pipe(concat('client-app.js'))
                //compress :D
                .pipe(uglify())
                //where we will store our finalized, compressed script
                .pipe(gulp.dest('dist/javascripts'));
});

//compiling our SCSS files
gulp.task('styles', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('src/stylesheets/init.scss')
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber({
                  errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                  }
                }))
                //get sourceMaps ready
                .pipe(sourceMaps.init())
                //include SCSS and list every "include" folder
                .pipe(sass({
                      errLogToConsole: true,
                      includePaths: [
                          'src/stylesheets/framework/'
                      ]
                }))
                .pipe(autoprefixer({
                   browsers: autoPrefixBrowserList,
                   cascade:  true
                }))
                //catch errors
                .on('error', gutil.log)
                //the final filename of our combined css file
                .pipe(concat('styles.css'))
                //get our sources via sourceMaps
                .pipe(sourceMaps.write())
                //where to save our final, compressed css file
                .pipe(gulp.dest('src/precompiled/stylesheets'))
                //notify browserSync to refresh
                .pipe(browserSync.reload({stream: true}));
});

//compiling our SCSS files for deployment
gulp.task('styles-deploy', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('src/stylesheets/init.scss')
                .pipe(plumber())
                //include SCSS includes folder
                .pipe(sass({
                      includePaths: [
                          'src/stylesheets/framework/',
                      ]
                }))
                .pipe(autoprefixer({
                  browsers: autoPrefixBrowserList,
                  cascade:  true
                }))
                //the final filename of our combined css file
                .pipe(concat('styles.css'))
                .pipe(minifyCSS())
                //where to save our final, compressed css file
                .pipe(gulp.dest('dist/stylesheets'));
});

//basically just keeping an eye on all HTML files
gulp.task('html', function() {
    //watch any and all HTML files and refresh when something changes
    return gulp.src('app/views/*.html')
        .pipe(plumber())
        .pipe(browserSync.reload({stream: true}))
        //catch errors
        .on('error', gutil.log);
});

//migrating over all HTML files for deployment
gulp.task('html-deploy', function() {
    //grab everything, which should include htaccess, robots, etc
    gulp.src('src/app/*/*')
      //prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())
      .pipe(gulp.dest('dist'));

    gulp.src('src/app/*')
      //prevent pipe breaking caused by errors from gulp plugins
      .pipe(plumber())
      .pipe(gulp.dest('dist'));

});

gulp.task('tests', function () {
  return gulp.src('tests/*')
    .pipe(plumber())
    .pipe(mochaTest({
      ui: 'bdd',
      reporter: 'nyan'
    }))
})

//cleans our dist directory in case things got deleted
gulp.task('clean', function() {
    return shell.task([
      'rm -rf dist'
    ]);
});

//create folders using shell
gulp.task('scaffold', function() {
  return shell.task([
      'mkdir dist',
      'mkdir dist/images',
      'mkdir dist/scripts',
      'mkdir dist/stylesheets'
    ]
  );
});

//this is our master task when you run `gulp` in CLI / Terminal
//this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and SCSS files
gulp.task('default', ['browserSync', 'tests', 'scripts', 'styles'], function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('src/javascripts/**', ['scripts', 'tests']);
    gulp.watch('tests/**', ['tests']);
    gulp.watch('src/stylesheets/**', ['styles']);
    gulp.watch('src/images/**', ['images']);
    gulp.watch('src/app/views/*.html', ['html']);
});

//this is our deployment task, it will set everything for deployment-ready files
gulp.task('deploy', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));
