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

const vChatScroll = {
  inserted: el => scrollToBottom(el, false),

  componentUpdated: function(el, binding) {
    const smooth = ((binding || {}).value || {}).smooth;
    if (typeof smooth !== 'undefined') {
      el.dataset.smooth = smooth;
    }
  },

  bind: (el, binding) => {
    let timeout;
    let scrolled = false;

    el.addEventListener('scroll', () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
      timeout = window.setTimeout(function() {
        scrolled = el.scrollTop + el.clientHeight + 1 < el.scrollHeight;
      }, 200);
    });

    (new MutationObserver((mutations) => {
      const config = binding.value || {};
      if (config.always === false && scrolled) {
        return;
      }

      const lastMutation = mutations[mutations.length - 1];

      if (!lastMutation.addedNodes.length && !lastMutation.removedNodes.length) {
        return;
      }

      if (typeof el.dataset.smooth === 'undefined') {
        el.dataset.smooth = typeof config.smooth === 'undefined' ? true : config.smooth;
      }

      scrollToBottom(el, el.dataset.smooth === 'true');
    })).observe(el, { childList: true, subtree: false });
  }
};

export default vChatScroll;
