import loadScript from 'discourse/lib/load-script';

let slots = {};

export function displaySlot(placement, div_id, before_callback, after_callback) {
  console.log(`displaySlot: ${placement}, ${div_id}`);

  if (slots[div_id]) {
    if (before_callback) before_callback();
    window.googletag.display(div_id);
    if (after_callback) after_callback();
    return;
  }

  loadGoogle().then(() => {
    var path = `/${Discourse.SiteSettings.dfp_publisher_id}/${placement}`;

    window.googletag.cmd.push(() => {
      slots[div_id] = window.googletag.defineSlot(path, ['fluid'], div_id).addService(window.googletag.pubads());
      window.googletag.pubads().addEventListener('slotRenderEnded', function(event) {
        if (event.slot.getSlotElementId() == div_id) {
          setupSlot(div_id, event.isEmpty);
        }
      });
    });
  });

  var _displaySlot = () => {
    loadGoogle().then(() => {
      if (before_callback) before_callback();
      window.googletag.cmd.push(function(){
        window.googletag.display(div_id);
        window.googletag.pubads().refresh([slots[div_id]]);
      });
      if (after_callback) after_callback();
    });
  };

  if (window.googletag && window.googletag.pubadsReady) {
    _displaySlot();
  } else {
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

function setupSlot(div_id, isEmpty) {
  var show = !isEmpty;

  if (div_id.includes('right-')) {
    Discourse.SiteSettings.right_ads = show;
  } else if (div_id.includes('nth-topic-')) {
    Discourse.SiteSettings.nth_topics = show;
  } else {
    Discourse.SiteSettings[div_id] = show;
  }
}

export function showBottom(index) {
  return Discourse.SiteSettings[`dfp_bottom_${index}_display`];
}

export function showRightAds() {
  return Discourse.SiteSettings.dfp_right_ads_display;
}

export function showNthAds() {
  return Discourse.SiteSettings.dfp_nth_topics_display;
}

export function showTop(index) {
  return Discourse.SiteSettings[`dfp_top_${index}_display`];
}

export function showPremium_1() {
  return Discourse.SiteSettings.dfp_premium_1_display;
}

export function showHood(index) {
  return Discourse.SiteSettings[`dfp_hood_${index}_display`];
}
