/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/01/02 - 11:56
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * sprite 画像を作成します
 *
 * @see https://github.com/twolfson/gulp.spritesmith
 * @see https://github.com/Ensighten/spritesmith
 * ```
 * var gulp = require('gulp');
 * var concat = require('gulp-concat');
 * var merge = require('merge-stream');
 * var spritesmith = require('gulp.spritesmith');
 *
 * // Define our gulp task
 * gulp.task('sprite', function () {
 *  // Generate our spritesheets
 *  var iconSpriteData = gulp.src('icons/*.png').pipe(spritesmith({
 *    imgName: 'icons.png',
 *    cssName: 'icons.css'
 *  }));
 *  var logoSpriteData = gulp.src('logos/*.png').pipe(spritesmith({
 *    imgName: 'logos.png',
 *    cssName: 'logos.css'
 *  }));
 *
 *  // Output our images
 *  var iconImgStream = iconSpriteData.img.pipe(gulp.dest('path/to/image/folder/'));
 *  var logoImgStream = logoSpriteData.img.pipe(gulp.dest('path/to/image/folder/'));
 *
 *  // Concatenate our CSS streams
 *  var cssStream = merge(iconSpriteData.css, logoSpriteData.css)
 *    .pipe(concat('main.css'))
 *    .pipe(gulp.dest('path/to/css/folder/'));
 *
 *  // Return a merged stream to handle all our `end` events
 *  return merge(iconImgStream, logoImgStream, cssStream);
 * });
 * ```
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
gulp.task('sprite:build', () => {
  const directory = dir.sprite.root;
  const cssPath = dir.sprite.img.replace(dir.app.root, '');
  const img = [];
  const css = [];
  // reject
  const reject = error => console.error(`[ERROR:${directory}]${error}`);
  // resolve
  const resolve = (fileList) => {
    fileList.map((folder) => {
      const data = gulp.src(`${dir.sprite.root}/${folder}/**/*.*`)
        .pipe($.debug({ title: `[SPRITE:${folder}]` }))
        .pipe($$.spritesmith(
          {
            imgName: `sprite-${folder}.png`,
            cssName: `_sprite-${folder}.scss`,
            imgPath: `${cssPath}/sprite-${folder}.png`,
            padding: 0,
            // https://github.com/twolfson/gulp.spritesmith#algorithm
            algorithm: 'binary-tree',
          },
        ));
      const imgStream = data.img.pipe(gulp.dest(dir.sprite.img));
      img.push(imgStream);
      css.push(data.css);
      const cssStream = $$.merge(css)
        .pipe($.concat('_sprite.scss'))
        .pipe(gulp.dest(dir.sprite.css));
      img.push(cssStream);
      return $$.merge(img);
    });
  };
  // read directory
  return $$.read(directory, resolve, reject);
});
