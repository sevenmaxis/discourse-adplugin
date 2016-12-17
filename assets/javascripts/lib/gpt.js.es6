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
    });
    slotRenderEnded(div_id);
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

function slotRenderEnded(slot) {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().addEventListener('slotRenderEnded', function(event) {
      if (event.slot.getSlotElementId() == slot) {
        if (slot.includes('nth-topic-')) {
          Discourse.SiteSettings.nth_topics = !event.isEmpty;
        } else {
          Discourse.SiteSettings[slot] = !event.isEmpty;
        }
      }
    });
  });
}

function requestSlot(delivering, slot) {
  console.log('requestSlot: ' + delivering + ' ' + slot);
  if (!delivering) {
    // slot is in not delivaring state, load slot to get the status of this slot
    // we don't care about will it display or not
    loadGoogle().then(() => {
      slotRenderEnded(slot);
    });
  }
}

export function showBottom(index) {
  var show, delivering, bottom;

  bottom = `bottom-${index}`;

  show = Discourse.SiteSettings[`dfp_bottom_${index}_display`];
  delivering = Discourse.SiteSettings[bottom];

  requestSlot(delivering, bottom);

  return show && delivering;
}

export function showRightAds() {
  // no switching off for right ads
  return Discourse.SiteSettings.dfp_right_ads_display;
}

export function showNthAds() {
  var show, delivering, nth;

  nth = 'nth-topic';

  show = Discourse.SiteSettings.dfp_nth_topics_display;
  delivering = Discourse.SiteSettings[nth];

  requestSlot(delivering, nth)

  return show && delivering;
}

export function showTop(index) {
  var show, delivering, top;

  top = `top-${index}`;

  show = Discourse.SiteSettings[`dfp_top_${index}_display`];
  delivering = Discourse.SiteSettings[top];

  requestSlot(delivering, top);

  return show && delivering;
}

export function showPremium_1() {
  var show, delivering, premium;

  premium = 'premium-1';

  show = Discourse.SiteSettings.dfp_premium_1_display;
  delivering = Discourse.SiteSettings[premium];

  requestSlot(delivering, premium);

  return show && delivering;
}

export function showHood(index) {
  var show, delivering, hood;

  hood = `hood-${index}`;

  show = Discourse.SiteSettings[`dfp_hood_${index}_display`];
  delivering = Discourse.SiteSettings[hood];

  requestSlot(delivering, hood);

  return show && delivering;
}

export function initSlotSettings() {
  Discourse.SiteSettings['top-1'] = true;
  Discourse.SiteSettings['top-2'] = true;
  Discourse.SiteSettings['bottom-1'] = true;
  Discourse.SiteSettings['bottom-2'] = true;
  Discourse.SiteSettings['premium-1'] = true;
  Discourse.SiteSettings['nth-topic'] = true;
  for (var i = 1; i < 4; i++) {
    Discourse.SiteSettings[`hood-${i}`] = true;
  }
}
