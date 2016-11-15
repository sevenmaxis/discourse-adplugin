/*jshint esversion: 6 */

import TopicView from 'discourse/views/topic';
import DiscoveryTopicsListComponent from 'discourse/components/discovery-topics-list';
import TopicFooterButtons from 'discourse/components/topic-footer-buttons';
import { withPluginApi } from 'discourse/lib/plugin-api';
import { slot, destroySlot, loadGoogle, insert_hoods_and_nth, destroy_hoods_and_nth } from '../lib/gpt';

export default {
  name: 'initialize-ad-plugin',
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');

    if (Discourse.SiteSettings.dfp_bottom_1_display ||
        Discourse.SiteSettings.dfp_bottom_2_display) {
      TopicFooterButtons.reopen({
        _insert_ad: function() {
          Em.run.later(() =>
            loadGoogle().then(function() {
              insert_hoods_and_nth();
              if (Discourse.SiteSettings.dfp_bottom_1_display) {
                $('#suggested-topics').before("<div id='bottom-1'/>");
                slot('bottom-1', 'bottom-1');
              }
              if (Discourse.SiteSettings.dfp_bottom_2_display) {
                $('#main-outlet').after("<div id='bottom-2'/>");
                slot('bottom-2', 'bottom-2');
              }
            }),
          1000);
        }.on('didInsertElement'),

        cleanup_ad: function() {
          destroySlot('bottom-1');
          destroy_hoods_and_nth();
        }.on('willDestroyElement')
      });
    }

    if (Discourse.SiteSettings.dfp_right_ads_display) {
      TopicView.reopen({
        _insert_ad: function() {
          Em.run.later(() =>
            loadGoogle().then(function() {
              $('.topic-timeline').after("<div class='right-panel'/>");
              for (var html = "", i = 1; i < 7; i++) {
                html += `<div id='right-${i}' class='right'/>`;
              }
              $('.right-panel').append(html);
              for (var i = 1; i < 7; i++) { slot(`right-${i}`, `right-${i}`); }
            }),
          1000);
        }.on('didInsertElement'),

        cleanup_ad: function() {
          for (var i = 1; i < 7; i++) { destroySlot(`right-${i}`); }
        }.on('willDestroyElement')
      });
    }

    DiscoveryTopicsListComponent.reopen({
      _insert_ad: function() {
        loadGoogle().then(function() {
          insert_hoods_and_nth();
        });
      }.on('didInsertElement'),

      cleanup_ad: function() {
        destroy_hoods_and_nth();
      }.on('willDestroyElement')
    });

    if (siteSettings.dfp_top_1_display) {
      loadGoogle().then(function() {
        $('#main').before($("<section/>").append("<div id='top-1'></div>"));
        slot('top-1', 'top-1', () => $(window).scroll());
      });
    }

    if (siteSettings.dfp_premium_1_display) {
      loadGoogle().then(function() {
        var snippet = $("<div class='container'/>").append("<div id='premium-1'/>");
        $('#main-outlet > .container:first').before(snippet);
        slot('premium-1', 'premium-1');
      });
    }

    if (siteSettings.dfp_top_2_display) {
      withPluginApi('0.1', api => {
        api.decorateWidget('header-icons:before', function(helper) {
          return helper.attach('top-2');
        });
      });
    }
  }
};
