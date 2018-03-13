/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/12/31 - 23:35
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * 画像を圧縮します
 *
 * - png: pngquant を使用し compress.png により圧縮します
 * - jpg, gif, svg: compress.img により圧縮します
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
const files = [
  `${dir.app.root}/**/*.{jpg,svg,gif,ico}`,
  // ignore font
  `!${dir.app.root}/**/fonts/**/*.svg`,
  `!${dir.app.root}/**/font/**/*.svg`,
];

// copy, 圧縮せずコピーします,
// 開発時に watch task と併用し使用します
// --------------------------------------
gulp.task('image:copy', () => {
  const clone = files.slice(0);
  clone.push(`${dir.app.root}/**/*.png`);
  return gulp.src(clone)
    .pipe(gulp.dest(dir.dist.root))
    .pipe($.size({ title: '*** image:copy ***' }));
});

// 圧縮 除くPNG
// --------------------------------------
gulp.task('image:min', () => (
  gulp.src(files)
    .pipe($.imagemin(module.compress.img))
    .pipe($.debug({ title: 'IMG' }))
    .pipe(gulp.dest(dir.dist.root))
    .pipe($.size({ title: '*** image:min ***' }))
));

// 圧縮 PNG
// --------------------------------------
gulp.task('image:png:min', () => (
  gulp.src([`${dir.app.root}/**/*.png`])
    .pipe($.imagemin([$$.pngquant(module.compress.png)]))
    .pipe($.debug({ title: 'PNG' }))
    .pipe(gulp.dest(dir.dist.root))
    .pipe($.size({ title: '*** image:png:min ***' }))
));

// BUILD
// --------------------------------------
gulp.task('image:build', callback => (
  $$.runSequence(
    [
      'image:min',
      'image:png:min',
    ],
    callback,
  )
));
