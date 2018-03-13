/*!
 * Copyright (c) 2011-2018 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2018/03/13 - 17:33
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 * version: @@version
 * date: @@buildTime
 */

// polyfill
import './moku/polyfill/method/babel';

console.log('app version', '@@version', '@@buildTime');

const begin = Date.now();
console.log('begin', begin);

setTimeout(() => {
  const current = Date.now();
  const passed = current - begin;
  console.log('passed', passed);
}, 1000);
