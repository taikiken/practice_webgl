/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/12/31 - 22:40
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * bower install したファイルを `bower/bower_exports` へ必要ファイルのみ出力します
 *
 * jQuery は map 記述されていることがあるので要確認 + 削除します
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
// foundation
gulp.task('bower:foundation', () => (
  gulp.src([
    `${dir.bower.components}/foundation/**/js/foundation/foundation*.js`,
    `${dir.bower.components}/foundation/**/scss/foundation/components/*.scss`,
  ])
    .pipe(gulp.dest(`${dir.bower.exports}/foundation`))
    .pipe($.size({ title: '*** bower:foundation ***' }))
));

// modularized
gulp.task('bower:modularized', () => (
  gulp.src([
    `${dir.bower.components}/modularized-normalize-scss/*.scss`,
    `${dir.bower.components}/modularized-normalize-scss/**/base/*.scss`,
    `${dir.bower.components}/modularized-normalize-scss/**/embed/*.scss`,
    `${dir.bower.components}/modularized-normalize-scss/**/forms/*.scss`,
    `${dir.bower.components}/modularized-normalize-scss/**/grouping/*.scss`,
    `${dir.bower.components}/modularized-normalize-scss/**/html5/*.scss`,
    `${dir.bower.components}/modularized-normalize-scss/**/links/*.scss`,
    `${dir.bower.components}/modularized-normalize-scss/**/tables/*.scss`,
    `${dir.bower.components}/modularized-normalize-scss/**/text-level/*.scss`,
  ])
    .pipe(gulp.dest(`${dir.bower.exports}/modularized`))
    .pipe($.size({ title: '*** bower:modularized ***' }))
));

// sagen
gulp.task('bower:sagen', () => (
  gulp.src([
    `${dir.bower.components}/sagen.js/libs/*.min.js`,
  ])
    .pipe(gulp.dest(`${dir.bower.exports}/sagen`))
    .pipe($.size({ title: '*** bower:sagen ***' }))
));

// html5shiv
gulp.task('bower:html5shiv', () => (
  gulp.src([
    `${dir.bower.components}/html5shiv/dist/*.min.js`,
  ])
    .pipe(gulp.dest(`${dir.bower.exports}/html5shiv`))
    .pipe($.size({ title: '*** bower:html5shiv ***' }))
));

// jquery1
gulp.task('bower:jquery1', () => (
  gulp.src([
    `${dir.bower.components}/jquery1/dist/*.min.*`,
  ])
    .pipe(gulp.dest(`${dir.bower.exports}/jquery1`))
    .pipe($.size({ title: '*** bower:jquery1 ***' }))
));

// jquery2
gulp.task('bower:jquery2', () => (
  gulp.src([
    `${dir.bower.components}/jquery2/dist/*.min.*`,
  ])
    .pipe(gulp.dest(`${dir.bower.exports}/jquery2`))
    .pipe($.size({ title: '*** bower:jquery2 ***' }))
));

// jquery3
gulp.task('bower:jquery3', () => (
  gulp.src([
    `${dir.bower.components}/jquery3/dist/*.min.*`,
  ])
    .pipe(gulp.dest(`${dir.bower.exports}/jquery3`))
    .pipe($.size({ title: '*** bower:jquery3 ***' }))
));

// // react
// gulp.task('bower:react', () =>
//   gulp.src([
//     `${dir.bower.components}/react/*.js`,
//   ])
//     .pipe(gulp.dest(`${dir.bower.exports}/react`))
//     .pipe($.size({ title: '*** bower:react ***' }))
// );
//
// // fetch
// gulp.task('bower:fetch', () =>
//   gulp.src([
//     `${dir.bower.components}/fetch/*.js`,
//   ])
//     .pipe(gulp.dest(`${dir.bower.exports}/fetch`))
//     .pipe($.size({ title: '*** bower:fetch ***' }))
// );
//
// // promise
// gulp.task('bower:promise', () =>
//   gulp.src([
//     `${dir.bower.components}/es6-promise/*.js`,
//   ])
//     .pipe(gulp.dest(`${dir.bower.exports}/promise`))
//     .pipe($.size({ title: '*** bower:promise ***' }))
// );


// bower [EXPORTS]
// --------------------------------------
gulp.task('bower:exports', callback => (
  $$.runSequence(
    [
      'bower:foundation',
      'bower:modularized',
      'bower:sagen',
      'bower:html5shiv',
      'bower:jquery1',
      'bower:jquery2',
      'bower:jquery3',
      // 'bower:react',
      // 'bower:fetch',
      // 'bower:promise',
    ],
    callback,
  )
));
