/**
 * @name VueJS vChatScroll (vue-chat-scroll)
 * @description Monitors an element and scrolls to the bottom if a new child is added
 * @author Theodore Messinezis <theo@theomessin.com>
 * @file v-chat-scroll  directive definition
 */

function scrollTo(element, from, to, duration, currentTime = 0) {
  if (from <= 0) { from = 0; }
  if (to <= 0) { to = 0; }
  if (currentTime >= duration) { return; }
  let delta = to - from;
  let progress = currentTime / duration * Math.PI / 2;
  let position = delta * (Math.sin(progress));
  setTimeout(() => {
    element.scrollTop = from + position;
    this.scrollTo(element, from, to, duration, currentTime + 10);
  }, 10);
}

const scrollToBottom = el => {
  // el.scrollTop = el.scrollHeight;
  scrollTo(el, el.scrollTop, el.scrollHeight, 1000);
};

const vChatScroll = {
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

    (new MutationObserver(e => {
      let config = binding.value || {};
      let pause = config.always === false && scrolled;
      if (pause || e[e.length - 1].addedNodes.length !== 1) {
        return;
      }
      scrollToBottom(el);
    })).observe(el, {childList: true, subtree: true});
  },
  inserted: scrollToBottom
};

export default vChatScroll;
