/*jshint esversion: 6 */

function registerHelper(name, fn) {
  Ember.HTMLBars._registerHelper(name, fn);
}

var makeBoundHelper = Ember.HTMLBars.makeBoundHelper;

registerHelper('eq', makeBoundHelper(function(params) {
  return params[0] === params[1];
}));

registerHelper('insert_ad', makeBoundHelper(function(params) {
  var dfp_nth_display = Discourse.SiteSettings.dfp_nth_display;

  if (dfp_nth_display < 0) return false;

  return params[0] == dfp_nth_display;
}));

registerHelper('insert_hood_1', function() {
  return Discourse.SiteSettings.dfp_hood_1_display === true;
});

registerHelper('insert_hood_2', function() {
  return Discourse.SiteSettings.dfp_hood_2_display === true;
});

registerHelper('insert_hood_3', function() {
  return Discourse.SiteSettings.dfp_hood_3_display === true;
});

registerHelper('insert_every_nth_topic', makeBoundHelper(function(params) {
  var nth = Discourse.SiteSettings.dfp_nth_topic_display;

  if (nth == 0) return false;
  if (params[0] == 0) return false;
  
  return (params[0] % nth) == 0 ? true : false;
}));
