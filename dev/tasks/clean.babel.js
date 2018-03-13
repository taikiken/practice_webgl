/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/12/31 - 21:05
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * dist フォルダから不要ファイルを削除します
 *
 * - .map
 * - .scss
 * - _*.html
 */

import module from '../gulp_setting.babel';

const gulp = module.gulp;
// /**
//  * gulp-load-plugins instance
//  * ```
//  * import gulpLoadPlugins from 'gulp-load-plugins';
//  * const $ = gulpLoadPlugins();
//  * ```
//  * @type {*}
//  */
// const $ = module.$;
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

const remove = (extension, low = false) => {
  const pattern = !low ?
    `${dir.dist.root}/**/*.${extension}` :
    `${dir.dist.root}/**/_*.${extension}`;

  return $$.del(
    [pattern],
    {
      base: process.cwd(),
      dot: true,
      force: true,
    },
  )
    .then((paths) => {
      console.warn(`*** clean[${extension}]: ${paths.length}`);
      if (paths.length > 0) {
        console.warn(paths.join('\n'));
      }
    });
};

// htdocs
gulp.task('clean:htdocs', () => (
  $$.del(
    [`${dir.dist.root}/*`],
    {
      base: process.cwd(),
      dot: true,
      force: true,
    },
  )
));

// map
gulp.task('clean:map', () => remove('map'));

// scss
gulp.task('clean:scss', () => remove('scss'));

// low dash
gulp.task('clean:low', () => remove('html', true));

// BUILD
gulp.task('clean:build', callback => (
  $$.runSequence(
    'clean:map',
    'clean:scss',
    'clean:low',
    callback,
  )
));
