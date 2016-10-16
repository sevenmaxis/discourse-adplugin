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
        destroySlot('topic-bottom');
      }.on('willDestroyElement')
    });

    TopicView.reopen({
      _insert_ad: function() {
        if (Discourse.SiteSettings.dfp_right_panel_display) {
          Em.run.later(() =>
            loadGoogle().then(function() {
              $('.topic-timeline').after("<div id='right-panel'/>");
              slot('right-panel', 'right-panel');
            }),
          1000);
        }
      }.on('didInsertElement'),

      cleanup_ad: function() {
        destroySlot('right-panel');
      }.on('willDestroyElement')
    });

    DiscoveryTopicsListComponent.reopen({
      _insert_ad: function() {
        if (Discourse.SiteSettings.dfp_hood_display >= 0) {
          loadGoogle().then(function() {
            // div#hood is already inserted
            slot('hood', 'hood');
          });
        }
      }.on('didInsertElement'),

      refresh_ad: function() {
        console.log('DiscoveryTopicsListComponent refresh ad');
      }.on('refreshOnChange'),

      cleanup_ad: function() {
        destroySlot('hood');
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
