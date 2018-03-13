/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/01/01 - 18:49
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * ES5 JS 単独ファイル
 *
 * `dir.app.js` で開発します
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

const patterns = module.patterns;

// const wpk = module.wpk;

// --------------------------------------
//  TASK
// --------------------------------------

const files = [
  `${dir.app.root}/**/*.js`,
  // ignore
  `!${dir.app.root}/**/*.{min,app,pack}.js`,
  `!${dir.app.root}/**/*-{min,app,pack}.js`,
  `!${dir.app.root}/**/*_{min,app,pack}.js`,
  `!${dir.app.root}/**/*.{babel,bundle,compile}.js`,
  `!${dir.app.root}/**/libs/**/*.js`,
];

// ESLint
// --------------------------------------
gulp.task('js:lint', () => (
  gulp.src(files)
    .pipe($.debug({ title: '[JS]' }))
    .pipe($.eslint({
      useEslintrc: false,
      configFile: `${dir.root}/eslint.es5.yml`,
    }))
    .pipe($.eslint.format())
    .pipe($.if(!$$.browserSync.active, $.eslint.failAfterError()))
    .pipe($.size({ title: '*** js:eslint ***' }))
));

// minify
// --------------------------------------
gulp.task('js:min', () => (
  gulp.src(files)
    .pipe($.replaceTask({ patterns }))
    .pipe($.uglify(
      {
        output: {
          comments: 'some',
        },
      },
      ))
    .pipe(gulp.dest(dir.dist.root))
    .pipe($.size({ title: '*** js:min ***' }))
));

// --------------------------------------
//  TASK > SEQUENCE
// --------------------------------------
// dev
gulp.task('js:dev', callback => (
  $$.runSequence(
    'js:lint',
    callback,
  )
));

// build
gulp.task('js:build', callback => (
  $$.runSequence(
    // 'js:lint',
    'js:min',
    callback,
  )
));
