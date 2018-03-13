/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/01/02 - 1:08
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * 依存ライブラリを結合・未結合し `assets` へ出力します
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

// libs
// --------------------------------------
/**
 * 結合しないライブラリを列挙します
 * @type {Array}
 */
const libs = [];
libs.push(`${dir.bower.exports}/**/sagen/sagen.min.js`);
libs.push(`${dir.bower.exports}/**/html5shiv/*.min.js`);
// jquery
libs.push(`${dir.bower.exports}/**/jquery1/*.min.js`);
libs.push(`${dir.bower.exports}/**/jquery2/*.min.js`);
libs.push(`${dir.bower.exports}/**/jquery3/*.min.js`);

// dev
gulp.task('vendor:libs:dev', () => (
  gulp.src(libs)
    .pipe($.debug({ title: '[VENDOR:LIBS]' }))
    .pipe(gulp.dest(dir.app.libs))
    .pipe($.size({ title: '*** vendor:libs:dev ***' }))
));

// build
gulp.task('vendor:libs:build', ['vendor:libs:dev'], () => (
  gulp.src(`${dir.app.root}/**/libs/**/*`)
    .pipe($.debug({ title: '[VENDOR:BUILD]' }))
    .pipe(gulp.dest(dir.dist.root))
    .pipe($.size({ title: '*** vendor:libs:build ***' }))
));


// vendor.js
// --------------------------------------
const vendorName = 'vendor.js';
// dev
// 未圧縮結合
gulp.task('vendor:concat:dev', () => (
  gulp.src(
    [
      // `${dir.bower.exports}/promise/es6-promise.js`,
      // `${dir.bower.exports}/fetch/fetch.js`,
      // `${dir.bower.exports}/react/react.js`,
      // `${dir.bower.exports}/react/react-dom.js`,
    ])
    .pipe($.concat(vendorName))
    .pipe(gulp.dest(dir.app.js))
    .pipe($.size({ title: '*** vendor:concat:dev ***' }))
));

// build
// 圧縮結合
// fetch.js は未圧縮ファイルのみ提供なので結合し minify します
gulp.task('vendor:concat:build', () => (
  gulp.src(
    [
      // `${dir.bower.exports}/promise/es6-promise.min.js`,
      // `${dir.bower.exports}/fetch/fetch.js`,
      // `${dir.bower.exports}/react/react.min.js`,
      // `${dir.bower.exports}/react/react-dom.min.js`,
    ])
    .pipe($.concat(vendorName))
    .pipe($.uglify({ preserveComments: 'license' }))
    .pipe(gulp.dest(dir.app.js))
    .pipe($.size({ title: '*** vendor:concat:build ***' }))
));

// copy to dist
gulp.task('vendor:copy', () => (
  gulp.src(
    [
      `${dir.app.root}/**/libs/**/*`,
      `${dir.app.root}/**/${vendorName}`,
    ])
    .pipe($.debug({ title: '[VENDOR:COPY]' }))
    .pipe(gulp.dest(dir.dist.root))
    .pipe($.size({ title: '*** vendor:copy ***' }))
));

// --------------------------------------
//  TASK > SEQUENCE
// --------------------------------------
// dev
gulp.task('vendor:dev', callback => (
  $$.runSequence(
    'vendor:libs:dev',
    'vendor:concat:dev',
    callback,
  )
));

// build
gulp.task('vendor:build', callback => (
  $$.runSequence(
    'vendor:libs:build',
    'vendor:concat:build',
    'vendor:copy',
    callback,
  )
));
