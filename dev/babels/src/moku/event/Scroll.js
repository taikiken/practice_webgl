/**
 * Copyright (c) 2011-2016 inazumatv.com, inc.
 * @author (at)taikiken / http://inazumatv.com
 * @date 2016/07/26 - 21:05
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 */

// event
import EventDispatcher from './EventDispatcher';
import ScrollEvents from './events/ScrollEvents';

// util
import Freeze from '../util/Freeze';

/**
 * new を許可しないための Symbol
 * @type {Symbol}
 * @private
 */
const singletonSymbol = Symbol('Scroll singleton symbol');
/**
 * singleton instance, nullable
 * @type {?Scroll}
 * @private
 */
let instance = null;

/**
 * window scroll event を監視し通知を行います
 * <p>singleton なので new ではなく factory を使用し instance を作成します</p>
 *
 * ```
 * const instance = Scroll.factory();
 * ```
 */
export default class Scroll extends EventDispatcher {
  // ----------------------------------------
  // STATIC METHOD
  // ----------------------------------------
  /**
   * y 位置に scroll top を即座に移動させます
   * @param {number} [y=0] scroll top 目標値
   * @param {number} [delay=0] time out 遅延 ms
   * @returns {number} time out id
   */
  static jump(y = 0, delay = 0) {
    return setTimeout(() => { window.scrollTo(0, y); }, delay);
  }
  /**
   * {@link Freeze}.freeze を実行し scroll 操作を一定期間不能にします
   * @returns {number} time out ID
   */
  static freeze() {
    return Freeze.freeze();
  }
  /**
   * scroll top 位置
   * @returns {number} scroll top 位置を返します
   * @see https://developer.mozilla.org/ja/docs/Web/API/Window/scrollY
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/pageYOffset
   */
  static y() {
    return (typeof window.pageYOffset !== 'undefined') ?
      window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop;
  }
  // ----------------------------------------
  /**
   * Scroll instance を singleton を保証し作成します
   * @returns {Scroll} Scroll instance を返します
   */
  static factory() {
    if (instance === null) {
      instance = new Scroll(singletonSymbol);
    }
    return instance;
  }
  // ----------------------------------------
  // EVENT
  // ----------------------------------------
  /**
   * scroll で発生するイベントを取得します
   * @event SCROLL
   * @returns {string} event, scrollScroll を返します
   * @default scrollScroll
   */
  static get SCROLL() {
    return 'scrollScroll';
  }
  // ---------------------------------------------------
  //  CONSTRUCTOR
  // ---------------------------------------------------
  /**
  /**
   * singleton です
   * @param {Symbol} checkSymbol singleton を保証するための private instance
   * @returns {Scroll} singleton instance を返します
   */
  constructor(checkSymbol) {
    // checkSymbol と singleton が等価かをチェックします
    if (checkSymbol !== singletonSymbol) {
      throw new Error('don\'t use new, instead use static factory method.');
    }
    // instance 作成済みかをチェックし instance が null の時 this を設定します
    if (instance !== null) {
      return instance;
    }
    // onetime setting
    super();
    // instance = this;

    // event handler
    // const boundScroll = this.scroll.bind(this);
    /**
     * bound onScroll, window.onscroll event handler
     * @type {function}
     */
    // this.boundScroll = this.scroll.bind(this);
    this.onScroll = this.onScroll.bind(this);
    // this.boundScroll = () => boundScroll;
    // @type {Events} - events instance
    // const events = new ScrollEvents(Scroll.SCROLL, this, this);
    /**
     * ScrollEvents instance, 発火時に使用します
     * @type {ScrollEvents}
     */
    this.events = new ScrollEvents(Scroll.SCROLL, this, this);
    // this.events = () => events;
    /**
     * 前回 scroll top 位置
     * @type {number}
     * @default -1
     */
    this.previous = -1;
    // /**
    //  * start 済みフラッグ
    //  * @type {boolean}
    //  * @default false
    //  */
    // this.started = false;

    // 設定済み instance を返します
    return this;
  }
  // ----------------------------------------
  // METHOD
  // ----------------------------------------
  /**
   * scroll event を監視します
   * @returns {Scroll} method chain 可能なように instance を返します
   */
  start() {
    // if (this.started) {
    //   return this;
    // }
    // this.started = true;
    this.stop();
    window.addEventListener('scroll', this.onScroll, false);
    return this;
  }
  /**
   * scroll event を監視を止めます
   * @returns {Scroll} method chain 可能なように instance を返します
   */
  stop() {
    // if (!this.started) {
    //   return this;
    // }
    // this.started = false;
    window.removeEventListener('scroll', this.onScroll);
    return this;
  }
  /**
   * window scroll event handler<br>
   * window scroll event 発生後に scroll top 位置をもたせた Scroll.SCROLL custom event を発火します
   * @param {?Event} event window scroll event, nullable
   * @returns {void}
   */
  onScroll(event) {
    // @type {number} - scroll top
    const y = Scroll.y();
    // @type {number} - window height
    const height = window.innerHeight;
    // @type {number} - 前回の scroll top
    const previous = this.previous;

    // @type {Events} - events
    const events = this.events;
    // @type {Event} - scroll event
    events.original = event;
    // @type {number} - scroll top
    events.y = y;
    // @type {number} - window height
    events.height = height;
    // @type {number} - window bottom(y + height)
    events.bottom = y + height;
    events.previous = previous;
    // @type {boolean} - 前回の scroll top と比較し移動したかを真偽値で取得します, true: 移動した
    events.changed = previous !== y;
    // @type {number} - 移動量 +（正）: down, -（負）: up
    events.moving = y - previous;
    // event fire
    this.dispatch(events);
    this.previous = y;
  }
}
