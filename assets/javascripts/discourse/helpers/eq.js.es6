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
