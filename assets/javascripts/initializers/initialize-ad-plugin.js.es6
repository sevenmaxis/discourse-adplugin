/*jshint esversion: 6 */

import DiscoveryTopicsListComponent from 'discourse/components/discovery-topics-list';
import TopicTimeline from 'discourse/components/topic-timeline';
import TopicFooterButtons from 'discourse/components/topic-footer-buttons';
import PostModel from 'discourse/models/post';
import { withPluginApi } from 'discourse/lib/plugin-api';
import { slot, loadGoogle } from '../lib/gpt';

let bottom_slot;
let right_panel;

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
          loadGoogle().then(function() {
            console.log('add bottom');
            if (bottom_slot) {
              googletag.display('topic-bottom');
            } else {
              slot('bottom', 'topic-bottom');
              bottom_slot = 'defined';
            }
          });
        }
      }.on('didInsertElement')
    });

    DiscoveryTopicsListComponent.reopen({
      _insert_ad: function() {
        if (Discourse.SiteSettings.dfp_top_3_display >= 0) {
          loadGoogle().then(function() {
            console.log('add top-3');
            // div#top-3 is already inserted
            slot('top-3', 'top-3');
          });
        }
      }.on('didInsertElement')
    });

    TopicTimeline.reopen({
      _insert_ad: function() {
        if (Discourse.SiteSettings.dfp_right_panel_display) {
          loadGoogle().then(function() {
            console.log('add right-panel');
            console.log('.topic-timeline: ' + $('.topic-timeline').length);
            $('.topic-timeline').after("<div id='right-panel'/>");
            if (right_panel) {
              googletag.display('right-panel');
            } else {
              slot('right-panel', 'right-panel');
              right_panel = 'defined';
            }
          });
        }
      }.on('didInsertElement')
    });

    if (siteSettings.dfp_top_1_display) {
      loadGoogle().then(function() {
        console.log('add top-1');
        $('#main').before($("<section/>").append("<div id='top-1'></div>"));
        slot('top-1', 'top-1');
        $(window).scroll();
      });
    }

    if (siteSettings.dfp_premium_1_display) {
      loadGoogle().then(function() {
        console.log('add premium-1');
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
