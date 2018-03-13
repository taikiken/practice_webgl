/**
 * Copyright (c) 2011-2017 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2017/01/01 - 0:21
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

/**
 * ES2015 単独ファイル
 *
 * `app/_babel` で作成します
 * `*.babel.js` middle name `babel` を付与しファイルを作成します
 * dir.app.bundle へ `*.bundle.js` へリネームされ出力されます
 */
//
// import fs from 'fs';

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

const wpk = module.wpk;

// --------------------------------------
//  TASK
// --------------------------------------

const files = [
  `${dir.app.root}/**/*.babel.{js,jsx}`,
];

// ESLint
// --------------------------------------
gulp.task('babel:lint', () => (
  gulp.src(files)
    .pipe($.debug({ title: '[BABEL]' }))
    .pipe($.eslint({ useEslintrc: true }))
    .pipe($.eslint.format())
    .pipe($.if(!$$.browserSync.active, $.eslint.failAfterError()))
    .pipe($.size({ title: '*** babel:lint ***' }))
));

// babel compile
// --------------------------------------
gulp.task('babel:compile', () => (
  gulp.src(files)
    // .pipe($.babel({
    //   presets: [
    //     'es2015',
    //     'react',
    //     'stage-0',
    //   ],
    //   plugins: ['transform-runtime'],
    // }))
    .pipe($.babel())
    .pipe($.replaceTask({ patterns }))
    .pipe($.rename((value) => {
      const path = value;
      const names = path.basename.split('.');
      path.basename = `${names[0]}.compile`;
      path.dirname = path.dirname.split('_babel').join('_compile');
    }))
    .pipe(gulp.dest(dir.app.root))
    .pipe($.size({ title: '*** babel:compile ***' }))
));

// babel webpack
// --------------------------------------
// /**
//  * directory を read し file list を取得します
//  * @param {string} directory path
//  * @param {function} resolve success callback
//  * @param {function} reject error callback
//  */
// const read = (directory, resolve, reject) => {
//   fs.readdir(directory, (error, fileList) => {
//     if (error) {
//       console.error(`fs.readdir(${directory}): error: ${error}`);
//       return reject(error);
//     }
//     // no error
//     resolve(fileList);
//     return fileList;
//   });
// };

// DEV
gulp.task('babel:pack:dev', () => {
  const directory = `${dir.app.root}/_compile`;
  const reject = error => console.error(`[ERROR:${directory}]${error}`);
  const resolve = (fileList) => {
    const config = Object.assign({}, wpk);
    // conf.plugins = [new $$.webpack.optimize.DedupePlugin()];

    fileList.map((file) => {
      const base = file.split('.').shift();
      // ファイル名.bundle.js にするために file name を key にした構造体を作成します
      const entry = {};
      entry[base] = `${wpk.entry}/app/_compile/${file}`;
      config.entry = entry;
      return $$.webpack(config, (error, stats) => {
        if (error) {
          throw new $.util.PluginError('webpack', error);
        }
        $.util.log('[webpack:dev]', stats.toString({
          colors: true,
          progress: true,
        }));
      });
    });
  };
  // directory をパースします
  return $$.read(directory, resolve, reject);
});

// BUILD
gulp.task('babel:pack:build', () => {
  const directory = `${dir.app.root}/_compile`;
  const reject = error => console.error(`[ERROR:${directory}]${error}`);
  const resolve = (fileList) => {
    const config = Object.assign({}, wpk);
    config.plugins = [
      // new $$.webpack.optimize.DedupePlugin(),
      // new $$.webpack.optimize.UglifyJsPlugin({ compress: { warnings: true } }),
      // https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
      new $$.webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
    ];
    // minify
    config.optimization = {
      minimizer: [
        // webpack 4 + uglify custom
        new $$.UglifyjsWebpackPlugin({
          parallel: 4,
          // sourceMap: true,
          uglifyOptions: {
            output: {
              comments: /^!|^\*!|@preserve|@license|@cc_on/,
            },
          },
        }),
      ],
    };
    fileList.map((file) => {
      const base = file.split('.').shift();
      // ファイル名.bundle.js にするために file name を key にした構造体を作成します
      const entry = {};
      entry[base] = `${wpk.entry}/app/_compile/${file}`;
      config.entry = entry;
      return $$.webpack(config, (error, stats) => {
        if (error) {
          throw new $.util.PluginError('webpack', error);
        }
        $.util.log('[webpack:build]', stats.toString({
          colors: true,
          progress: true,
        }));
      });
    });
  };
  // directory をパースします
  return $$.read(directory, resolve, reject);
});


// copy
// --------------------------------------
gulp.task('babel:copy', () => (
  gulp.src(
    [
      `${dir.app.root}/**/*.bundle.js`,
    ],
  )
    .pipe($.debug({ title: '[BABEL]' }))
    .pipe(gulp.dest(dir.dist.root))
    .pipe($.size({ title: '*** babel:copy ***' }))
));

// --------------------------------------
//  TASK > SEQUENCE
// --------------------------------------
gulp.task('babel:dev', callback => (
  $$.runSequence(
    'babel:lint',
    'babel:compile',
    'babel:pack:dev',
    callback,
  )
));

gulp.task('babel:build', callback => (
  $$.runSequence(
    // 'babels:lint',
    'babel:compile',
    'babel:pack:build',
    'babel:copy',
    callback,
  )
));
