import { registerHelper } from 'discourse/lib/helpers';

var makeBoundHelper = Ember.HTMLBars.makeBoundHelper;

registerHelper('eq', makeBoundHelper(function(params) {
  return params[0] === params[1];
}));

registerHelper('insert_ad', makeBoundHelper(function(params) {
  var dfp_nth_topic = Discourse.SiteSettings.dfp_nth_topic;

  if (dfp_nth_topic < 0) return false;

  return params[0] == dfp_nth_topic;
}))
