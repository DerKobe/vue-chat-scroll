(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['vue-chat-scroll'] = factory());
}(this, (function () { 'use strict';

/**
 * @name VueJS vChatScroll (vue-chat-scroll)
 * @description Monitors an element and scrolls to the bottom if a new child is added
 * @author Theodore Messinezis <theo@theomessin.com>
 * @file v-chat-scroll  directive definition
 */

function scrollTo(element, from, to, duration) {
  var _this = this;

  var currentTime = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

  if (from <= 0) {
    from = 0;
  }
  if (to <= 0) {
    to = 0;
  }
  if (currentTime >= duration) {
    return;
  }
  var delta = to - from;
  var progress = currentTime / duration * Math.PI / 2;
  var position = delta * Math.sin(progress);
  setTimeout(function () {
    element.scrollTop = from + position;
    _this.scrollTo(element, from, to, duration, currentTime + 10);
  }, 10);
}

var scrollToBottom = function scrollToBottom(el) {
  // el.scrollTop = el.scrollHeight;
  scrollTo(el, el.scrollTop, el.scrollHeight, 1000);
};

var vChatScroll = {
  bind: function bind(el, binding) {
    var timeout = void 0;
    var scrolled = false;

    el.addEventListener('scroll', function () {
      if (timeout) {
        window.clearTimeout(timeout);
      }
      timeout = window.setTimeout(function () {
        scrolled = el.scrollTop + el.clientHeight + 1 < el.scrollHeight;
      }, 200);
    });

    new MutationObserver(function (e) {
      var config = binding.value || {};
      var pause = config.always === false && scrolled;
      if (pause || e[e.length - 1].addedNodes.length !== 1) {
        return;
      }
      scrollToBottom(el);
    }).observe(el, { childList: true, subtree: true });
  },
  inserted: scrollToBottom
};

/**
 * @name VueJS vChatScroll (vue-chat-scroll)
 * @description Monitors an element and scrolls to the bottom if a new child is added
 * @author Theodore Messinezis <theo@theomessin.com>
 * @file vue-chat-scroll plugin definition
 */

var VueChatScroll = {
    install: function install(Vue, options) {
        Vue.directive('chat-scroll', vChatScroll);
    }
};

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(VueChatScroll);
}

return VueChatScroll;

})));
