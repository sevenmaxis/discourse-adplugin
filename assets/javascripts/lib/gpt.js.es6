/*jshint esversion: 6 */

import loadScript from 'discourse/lib/load-script';

let slots = {};

export function displaySlot(placement, div_id, before_callback, after_callback) {
  console.log(`displaySlot: ${placement}, ${div_id}`);

  if (slots[div_id]) {
    console.log('displaySlot: rerender');
    if (before_callback) before_callback();
    window.googletag.display(div_id);
    if (after_callback) after_callback();
    return;
  }

  loadGoogle().then(() => {
    var path = `/${Discourse.SiteSettings.dfp_publisher_id}/${placement}`;

    window.googletag.cmd.push(() => {
      slots[div_id] = window.googletag.defineSlot(path, ['fluid'], div_id).addService(window.googletag.pubads());
    });
  });

  var _displaySlot = () => {
    loadGoogle().then(() => {
      console.log('display: ' + div_id);
      if (before_callback) before_callback();
      window.googletag.display(div_id);
      window.googletag.pubads().refresh([slots[div_id]]);
      if (after_callback) after_callback();
    });
  };

  if (window.googletag && window.googletag.pubadsReady) {
    console.log('pubadsReady is true');
    _displaySlot();
  } else {
    console.log('pubadsReady is false');
    Em.run.later(_displaySlot, 90);
  }
}

let _loaded = false;
let _promise = null;

export function loadGoogle() {
  if (_loaded) return Ember.RSVP.resolve();

  if (_promise) return _promise;

  // The boilerplate code
  var gpt_link = '//www.googletagservices.com/tag/js/gpt.js';
  var dfpSrc = (('https:' === document.location.protocol) ? 'https:' : 'http:') + gpt_link;

  _promise = loadScript(dfpSrc, { scriptTag: true }).then(function() {
    _loaded = true;

    window.googletag.cmd.push(function() {
      window.googletag.pubads().enableSingleRequest();
      window.googletag.pubads().disableInitialLoad(); // we always use refresh() to fetch the ads
      window.googletag.enableServices();
    });
  });

  return _promise;
}

export function insert_hoods_and_nth() {
  for (var hood, i = 1; i < 4; i++) {
    if (Discourse.SiteSettings[`dfp_hood_${i}_display`]) {
      hood = `hood-${i}`;
      slot(hood, hood);
    }
  }
  if (Discourse.SiteSettings.dfp_nth_topic_display > 0) {
    $('.nth-topic > td').each(function(index, element) {
      slot('nth-topic', element.getAttribute('id'));
    });
  }
}

export function destroy_hoods_and_nth() {
  $('.nth-topic > td').each(function(index, element) {
    destroySlot(element.getAttribute('id'));
  });
  for (var i = 1; i < 4; i++) { destroySlot(`hood-${i}`); }
}

export function refresh_nth_topic() {
  if (window.googletag) {
    $('.nth-topic > td').each(function(index, element) {
      slot('.nth-topic', element.getAttribute('id'));
    });
  }
}
