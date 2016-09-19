import loadScript from 'discourse/lib/load-script';

// TODO: the idea is to use scheduleOnce to refresh all ads at once.
// scheduleOnce gives posobility to call this function multiple times but
// it will execute only once for optimization
function refresh() {
  window.googletag.pubads().refresh();
}

export function slot(placement, div_id) {
  var path = `/${Discourse.SiteSettings.dfp_publisher_id}/${placement}`;

  window.googletag.cmd.push(function(){
    var ad = window.googletag.defineSlot(path, ['fluid'], div_id).addService(window.googletag.pubads());
    debugger;
    window.googletag.display(div_id);
    window.googletag.pubads().refresh([ad]);
  });
}

var _loaded = false;
var _promise = null;

export function loadGoogle() {
  if (_loaded) {
    return Ember.RSVP.resolve();
  }

  if (_promise) {
    return _promise;
  }

  // The boilerplate code
  var gpt_link = '//www.googletagservices.com/tag/js/gpt.js'
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
