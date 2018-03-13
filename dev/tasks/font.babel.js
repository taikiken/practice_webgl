/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/12/31 - 23:26
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * font file を dist へコピーします
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
gulp.task('font:copy', () => (
  gulp.src(
    [
      `${dir.app.root}/**/fonts/**/*.{eot,svg,ttf,woff}`,
      `${dir.app.root}/**/font/**/*.{eot,svg,ttf,woff}`,
    ],
  )
    .pipe($.debug({ title: 'FONT' }))
    .pipe(gulp.dest(dir.dist.root))
    .pipe($.size({ title: '*** font:copy ***' }))
));
