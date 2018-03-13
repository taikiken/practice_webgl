/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/01/02 - 0:27
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * ES5 ライブラリを作成します
 *
 * `dir.scripts.src` で開発します
 * - dependencies: 依存ライブラリの内同梱するものを列挙します
 * - fileName: ライブラリ名称を設定します
 * - files: ライブラリファイルを列挙します
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

// files
// --------------------------------------

// 依存ライブラリ
/**
 * 依存ライブラリを参照関係を考慮し追加(push)します
 * @type {Array}
 */
const dependencies = [];

// ライブラリ
/**
 * ライブラリファイルを参照関係を考慮し追加(push)します
 * @type {Array}
 */
const files = [];

/**
 * ライブラリ名
 * @type {string}
 */
const fileName = 'XXX.app.js';

// ライブラリ
// --------------------------------------
// パッケージするファイルを設定します

// main
files.push(`${dir.scripts.src}/${fileName}`);

// files.push(`${dir.scripts.src}/xxx/xxx.js`);

// ESLint
// --------------------------------------
gulp.task('scripts:lint', () => (
  gulp.src(files)
    .pipe($.debug({ title: '[SCRIPTS]' }))
    .pipe($.eslint({
      useEslintrc: false,
      configFile: `${dir.root}/eslint.es5.yml`,
    }))
    .pipe($.eslint.format())
    .pipe($.if(!$$.browserSync.active, $.eslint.failAfterError()))
    .pipe($.size({ title: '*** scripts:lint ***' }))
));

// CONCAT
// --------------------------------------
gulp.task('scripts:concat', () => {
  const libs = dependencies.concat(files);
  return gulp.src(libs)
    .pipe($.concat(fileName))
    .pipe($.replaceTask({ patterns }))
    // .pipe($.uglify({ preserveComments: 'license' }))
    .pipe(gulp.dest(dir.app.js))
    .pipe($.size({ title: '*** scripts:concat ***' }));
});

// minify
// --------------------------------------
gulp.task('scripts:min', () => {
  const libs = dependencies.concat(files);
  return gulp.src(libs)
    .pipe($.concat(fileName))
    .pipe($.replaceTask({ patterns }))
    .pipe($.uglify(
      {
        output: {
          comments: 'some',
        },
      },
      ))
    .pipe(gulp.dest(dir.dist.root))
    .pipe($.size({ title: '*** scripts:min ***' }));
});

// --------------------------------------
//  TASK > SEQUENCE
// --------------------------------------
// dev
gulp.task('scripts:dev', callback => (
  $$.runSequence(
    'scripts:lint',
    'scripts:concat',
    callback,
  )
));

// build
gulp.task('scripts:build', callback => (
  $$.runSequence(
    // 'scripts:lint',
    'scripts:min',
    callback,
  )
));
