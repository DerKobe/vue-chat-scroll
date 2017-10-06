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

function scrollToBottom(el, smooth) {
  if (smooth) {
    el.scroll({ top: el.scrollHeight, left: 0, behavior: 'smooth' });
  } else {
    el.scrollTop = el.scrollHeight;
  }
}

var vChatScroll = {
  inserted: function inserted(el) {
    return scrollToBottom(el, false);
  },

  componentUpdated: function componentUpdated(el, binding) {
    var smooth = ((binding || {}).value || {}).smooth;
    if (typeof smooth !== 'undefined') {
      el.dataset.smooth = smooth;
    }
  },

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

      if (typeof el.dataset.smooth === 'undefined') {
        el.dataset.smooth = typeof config.smooth === 'undefined' ? true : config.smooth;
      }

      scrollToBottom(el, el.dataset.smooth === 'true');
    }).observe(el, { childList: true, subtree: true });
  }
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
