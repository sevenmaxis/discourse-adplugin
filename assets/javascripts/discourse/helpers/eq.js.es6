/*jshint esversion: 6 */

import { registerHelper } from '../../lib/helpers';

var makeBoundHelper = Ember.HTMLBars.makeBoundHelper;

registerHelper('eq', makeBoundHelper(function(params) {
  return params[0] === params[1];
}));

registerHelper('insert_ad', makeBoundHelper(function(params) {
  var dfp_hood_display = Discourse.SiteSettings.dfp_hood_display;

  if (dfp_hood_display < 0) return false;

  return params[0] == dfp_hood_display;
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
