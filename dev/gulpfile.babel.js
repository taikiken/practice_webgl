/**
 * @license inazumatv.com
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/11/03
 *
 * Copyright (c) 2011-2015 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */

import connectSSI from 'connect-ssi';

import requireDir from 'require-dir';

import module from './gulp_setting.babel';

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
 *  del: function,
 *  runSequence: function,
 *  browserSync: function,
 *  reload: function,
 * }}
 */
const $$ = module.$$;

const dir = module.dir;

// --------------------------------------
//  LOAD TASKS
// --------------------------------------
requireDir('tasks');

// --------------------------------------
//  TASK
// --------------------------------------

// dev
// --------------------------------------
// watch
gulp.task('serve:app', () => {
  const option = {
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'DEV',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    // will present a certificate warning in the browser.
    // https: true
    server: {
      baseDir: [dir.app.root, dir.tmp],
      directory: module.server.indexes,
      // startPath: dir.app.root,
      // additional option sever launch by ip address
      // open: 'external',
      // port: module.server.port,
      middleware: [
        connectSSI({
          baseDir: `${__dirname}/app`,
          ext: 'html',
        }),
      ],
    },
    // additional option sever launch by ip address
    open: 'external',
    // port 設定位置が変わった様子
    // @since 2017-01-24
    port: module.server.port,
    // Clicks, Scrolls & Form inputs on any device will be mirrored to all others.
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },
    // option 設定位置が変わった様子
    startPath: '/',
  };

  $$.browserSync(option);

  // watch
  // html
  gulp.watch([`${dir.app.root}/**/*.html`], $$.reload);
  // scss, css
  gulp.watch([`${dir.app.root}/**/*.{scss,css}`, `${dir.scss}/**/*.scss`], ['css:dev', $$.reload]);
  // js:lint
  gulp.watch([
    `${dir.app.root}/**/*.js`,
    // ignore
    `!${dir.app.root}/**/*.{min,app,pack}.js`,
    `!${dir.app.root}/**/*-{min,app,pack}.js`,
    `!${dir.app.root}/**/*_{min,app,pack}.js`,
    `!${dir.app.root}/**/*.{babel,bundle,compile}.js`,
    `!${dir.app.root}/**/libs/**/*.js`,
  ], ['js:lint']);
  // js:reload
  gulp.watch([`${dir.app.root}/**/*.js`], $$.reload);
  // image
  gulp.watch([`${dir.app.root}/**/*.{png,jpg,gif,svg}`], $$.reload);
  // font
  gulp.watch([`${dir.app.root}/**/font*/*.{eot,svg,ttf,woff}`], $$.reload);
});

// dev
// 開発用更新する
gulp.task('dev', callback => (
  $$.runSequence(
    'sprite:build',
    'babels:dev',
    'scripts:dev',
    'css:dev',
    callback,
  )
));


// build
// --------------------------------------
// build
gulp.task('default', callback => (
  $$.runSequence(
    // delete htdocs
    'clean:htdocs',
    // sprite
    'sprite:build',
    // js
    'vendor:build', // or notuse vendor 'vendor:libs:build',
    'babels:build',
    'babel:build',
    'scripts:build',
    'js:build',
    // css
    'css:build',
    // html
    'html:build',
    // font(copy)
    'font:copy',
    // image(min)
    'image:build',
    // clean
    'clean:build',
    callback,
  )
));

// build + server(on htdocs)
gulp.task('serve', ['default'], () => {
  const option = {
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'BLD',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    // will present a certificate warning in the browser.
    // https: true
    server: {
      baseDir: [dir.dist.root],
      directory: module.server.indexes,
      // startPath: dir.dist.root,
      // additional option sever launch by ip address
      // open: 'external',
      // port: module.server.port,
      middleware: [
        connectSSI({
          baseDir: `${__dirname}/../htdocs`,
          ext: 'html',
        }),
      ],
    },
    // additional option sever launch by ip address
    open: 'external',
    // port 設定位置が変わった様子
    // @since 2017-01-24
    port: module.server.port,
    // https://www.browsersync.io/docs/options/#option-ghostMode
    // Clicks, Scrolls & Form inputs on any device will be mirrored to all others.
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },
    // option 設定位置が変わった様子
    startPath: '/',
  };

  return $$.browserSync(option);
});
