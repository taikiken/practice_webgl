/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/12/31 - 22:08
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * HTML を dist へコピーします
 * compress 設定により minify します
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
// /**
//  * @type {{
//  *  reload: function,
//  *  browserSync: function,
//  *  runSequence: function,
//  *  webpack: function,
//  *  del: function,
//  * }}
//  */
// const $$ = module.$$;

const dir = module.dir;

// const patterns = module.patterns;
//
// const wpk = module.wpk;

// --------------------------------------
//  TASK
// --------------------------------------
const files = [
  `${dir.app.root}/**/*.html`,
  `!${dir.app.root}/**/_*.html`,
];

gulp.task('html:build', () => {
  console.warn('***************************************');
  if (module.compress.html) {
    console.warn('HTML will minify >>>');
  } else {
    console.warn('               WARNING');
    console.warn('HTML not minify, OK?');
  }
  console.warn('***************************************');

  return gulp.src(files)
    .pipe($.replaceTask({
      patterns: module.patterns,
    }))
    .pipe($.if(module.compress.html, $.htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest(dir.dist.root))
    .pipe($.size({ title: '*** html:build ***' }));
});
