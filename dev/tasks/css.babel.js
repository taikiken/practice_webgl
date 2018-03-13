/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/12/31 - 18:49
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * scss を css コンバートします
 *
 * - SCSSLint エラーが無いように作成します
 * - プロジェクトに合わせ `scss/_project-setting.scss` l.60 ~ 出力オプションを編集します
 * - `dir.app.css` で開発します
 */

import module from '../gulp_setting.babel';

const gulp = module.gulp;
/**
 * gulp-load-plugins instance
 * ```
 * import gulpLoadPlugins from 'gulp-load-plugins';
 * const $ = gulpLoadPlugins();
 * ```
 * @type {*}
 */
const $ = module.$;
/**
 * @type {{
 *  reload: function,
 *  browserSync: function,
 *  runSequence: function,
 *  webpack: function,
 *  del: function,
 * }}
 */
const $$ = module.$$;

const dir = module.dir;

// const patterns = module.patterns;
//
// const wpk = module.wpk;

// --------------------------------------
//  TASK
// --------------------------------------
const files = {
  app: `${dir.app.root}/**/*.scss`,
  scss: `${dir.scss}/**/*.scss`,
};

// SCSSLint
// --------------------------------------
// scssLint option
const option = {
  config: `${dir.root}/.scss-lint.yml`,
};

// app
gulp.task('css:app:lint', () => {
  option.filePipeOutput = 'scss-app-report.json';

  return gulp.src(files.app)
    .pipe($.scssLint(option))
    .pipe(gulp.dest(`${dir.root}/scss-report`))
    .pipe($.size({ title: '*** css:app:lint ***' }));
});

// scss
gulp.task('css:scss:lint', () => {
  option.filePipeOutput = 'scss-scss-report.json';

  return gulp.src(files.scss)
    .pipe($.scssLint(option))
    .pipe(gulp.dest(`${dir.root}/scss-report`))
    .pipe($.size({ title: '*** css:scss:lint ***' }));
});

// SCSS compile
// --------------------------------------

// DEV
/**
 * gulp-sass + gulp-autoprefixer + gulp-sourcemaps で
 * .map が正常に出力されない問題がある様子
 *
 * @see https://github.com/floridoo/gulp-sourcemaps/issues/60
 * @see https://github.com/ByScripts/gulp-sample/blob/master/gulpfile.js
 * ```
 * var gulp = require('gulp'),
 * sourcemaps = require('gulp-sourcemaps'),
 * sass = require('gulp-sass')
 * autoprefixer = require('gulp-autoprefixer');
 *
 * gulp.task('doesntWork', function () {
 *      gulp.src('./src/sample.scss')
 *          .pipe(sourcemaps.init())
 *          .pipe(sass())
 *          .pipe(autoprefixer())
 *          .pipe(sourcemaps.write('.'))
 *          .pipe(gulp.dest('./dest/doesntWork'))
 *  });
 *
 * gulp.task('doesWork', function () {
 *      gulp.src('./src/sample.scss')
 *          .pipe(sourcemaps.init())
 *          .pipe(sass())
 *          .pipe(sourcemaps.write({includeContent: false}))
 *          .pipe(sourcemaps.init({loadMaps: true}))
 *          .pipe(autoprefixer())
 *          .pipe(sourcemaps.write('.'))
 *          .pipe(gulp.dest('./dest/doesWork'))
 *  });
 *
 * gulp.task('default', ['doesWork', 'doesntWork']);
 */
gulp.task('css:dev:compile', () => (
  gulp.src([
    files.app,
    files.scss,
  ])
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10,
      outputStyle: 'expanded',
    })).on('error', $.sass.logError)
    .pipe($.sourcemaps.write({
      includeContent: false,
    }))
    .pipe($.sourcemaps.init({
      loadMaps: true,
    }))
    .pipe($.autoprefixer({
      browsers: module.AUTO_PREFIX_BROWSERS,
    }))
    .pipe($.sourcemaps.write(
      '.',
      {
        includeContent: false,
        sourceRoot: '/',
      },
    ))
    .pipe($.debug({ title: 'CSS' }))
    .pipe($.replaceTask({
      patterns: module.patterns,
    }))
    .pipe(gulp.dest(dir.tmp))
    .pipe($.size({ title: '*** css:dev ***' }))
));

gulp.task('css:dev', callback => (
  $$.runSequence(
    'css:app:lint',
    'css:dev:compile',
    callback,
  )
));

// BUILD
gulp.task('css:build', () => {
  console.warn('***************************************');
  if (module.compress.css) {
    console.warn('CSS will minify >>>');
  } else {
    console.warn('               WARNING');
    console.warn('css not minify, OK?');
  }
  console.warn('***************************************');

  return gulp.src([
    files.app,
    files.scss,
  ])
    .pipe($.sass({
      precision: 10,
      outputStyle: 'expanded',
    })).on('error', $.sass.logError)
    .pipe($.autoprefixer({
      browsers: module.AUTO_PREFIX_BROWSERS,
    }))
    .pipe($.debug({ title: 'CSS' }))
    .pipe($.replaceTask({
      patterns: module.patterns,
    }))
    .pipe(gulp.dest(dir.tmp))
    .pipe($.if(module.compress.css, $.cssnano({
      zindex: false,
      // @see http://cssnano.co/optimisations/reduceidents/
      reduceIdents: false,
    })))
    .pipe(gulp.dest(dir.dist.root))
    .pipe($.size({ title: '*** css:build ***' }));
});

// // SCSS watch
// // --------------------------------------
// gulp.task('css:watch', ['css:dev:compile'], callback => {
//   return callback();
// });
