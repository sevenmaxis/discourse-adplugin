/*jshint esversion: 6 */

import TopicView from 'discourse/views/topic';
import DiscoveryTopicsListComponent from 'discourse/components/discovery-topics-list';
import TopicFooterButtons from 'discourse/components/topic-footer-buttons';
import PostModel from 'discourse/models/post';
import { withPluginApi } from 'discourse/lib/plugin-api';
import { slot, destroySlot, loadGoogle } from '../lib/gpt';

export default {
  name: 'initialize-ad-plugin',
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');

  	PostModel.reopen({
  	  postSpecificCountDFP: function() {
        return this.isNthPost(parseInt(siteSettings.dfp_nth_post_code));
  	  }.property('post_number'),

  	  postSpecificCountAdsense: function() {
        return this.isNthPost(parseInt(siteSettings.adsense_nth_post_code));
  	  }.property('post_number'),

      postSpecificCountAmazon: function() {
        return this.isNthPost(parseInt(siteSettings.amazon_nth_post_code));
      }.property('post_number'),

      isNthPost: function(n) {
        if (n && n > 0) {
          return (this.get('post_number') % n) === 0;
        } else {
          return false;
        }
      }
  	});

    TopicFooterButtons.reopen({
      _insert_ad: function() {
        if (Discourse.SiteSettings.dfp_bottom_display) {
          Em.run.later(() =>
            loadGoogle().then(function() {
              $('.topic-above-suggested-outlet.discourse-adplugin').append("<div id='bottom'/>");
              slot('bottom', 'bottom');
            }),
          1000);
        }
      }.on('didInsertElement'),

      refresh_ad: function() {
        console.log('TopicFooterButtons refresh ad');
      }.on('refreshOnChange'),

      cleanup_ad: function() {
        destroySlot('bottom');
      }.on('willDestroyElement')
    });

    TopicView.reopen({
      _insert_ad: function() {
        if (Discourse.SiteSettings.dfp_right_ads_display) {
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
        }
      }.on('didInsertElement'),

      cleanup_ad: function() {
        for (var i = 1; i < 7; i++) { destroySlot(`right-${i}`); }
      }.on('willDestroyElement')
    });

    DiscoveryTopicsListComponent.reopen({
      _insert_ad: function() {
        if (Discourse.SiteSettings.dfp_hood_1_display ||
            Discourse.SiteSettings.dfp_hood_2_display ||
            Discourse.SiteSettings.dfp_hood_3_display) {
          loadGoogle().then(function() {
            for (var hood, i = 1; i < 4; i++) {
              if (Discourse.SiteSettings[`dfp_hood_${i}_display`]) {
                hood = `hood-${i}`;
                slot(hood, hood);
              }
            }
          });
        }
        if (Discourse.SiteSettings.dfp_nth_topic_display > 0) {
          loadGoogle().then(function() {
            // div#nth-topic is already inserted
            slot('nth-topic', 'nth-topic');
          });
        }
      }.on('didInsertElement'),

      refresh_ad: function() {
        console.log('DiscoveryTopicsListComponent refresh ad');
      }.on('refreshOnChange'),

      cleanup_ad: function() {
        destroySlot('nth-topic');
        for (var i = 1; i < 4; i++) {
          destroySlot(`hood-${i}`);
        }
      }.on('willDestroyElement')
    });

    if (siteSettings.dfp_top_1_display) {
      loadGoogle().then(function() {
        $('#main').before($("<section/>").append("<div id='top-1'></div>"));
        slot('top-1', 'top-1');
        $(window).scroll();
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

    withPluginApi('0.1', api => {
      api.decorateWidget('post:after', dec => {
        return dec.connect({
          templateName: 'connectors/post-bottom/discourse-adplugin',
          context: 'model'
        });
      });
    });
  }
};
