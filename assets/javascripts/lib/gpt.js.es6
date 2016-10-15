/*jshint esversion: 6 */

import loadScript from 'discourse/lib/load-script';

let slots = {};

export function slot(placement, div_id) {
  console.log(`slot: ${placement}, ${div_id}`);
  var path = `/${Discourse.SiteSettings.dfp_publisher_id}/${placement}`;

  window.googletag.cmd.push(function(){
    slots[div_id] = window.googletag.defineSlot(path, ['fluid'], div_id).addService(window.googletag.pubads());

    window.googletag.display(div_id);
    window.googletag.pubads().refresh([slots[div_id]]);
  });
}

export function destroySlot(div_id) {
  console.log(`destroySlot: ${div_id}`);
  if (slots[div_id] && window.googletag) {
    window.googletag.cmd.push(function(){
      window.googletag.destroySlots([slots[div_id]]);
      delete slots[div_id];
    });
  }
}


let _loaded = false;
let _promise = null;

export function loadGoogle() {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  // The boilerplate code
  var gpt_link = '//www.googletagservices.com/tag/js/gpt.js';
  var dfpSrc = (('https:' === document.location.protocol) ? 'https:' : 'http:') + gpt_link;

  _promise = loadScript(dfpSrc, { scriptTag: true }).then(function() {
    _loaded = true;
    if (window.googletag === undefined) {
      console.log('googletag is undefined!');
    }

    window.googletag.cmd.push(function() {
      window.googletag.pubads().enableSingleRequest();
      window.googletag.pubads().disableInitialLoad(); // we always use refresh() to fetch the ads
      window.googletag.enableServices();
    });
  });

  return _promise;
}
