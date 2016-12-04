/*jshint esversion: 6 */

import Topic from 'discourse/components/discourse-topic';
import TopicList from 'discourse/components/topic-list';
import TopicFooterButtons from 'discourse/components/topic-footer-buttons';
import { withPluginApi } from 'discourse/lib/plugin-api';
import { displaySlot, insert_hoods_and_nth, refresh_nth_topic } from '../lib/gpt';

export default {
  name: 'initialize-ad-plugin',
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');

    TopicFooterButtons.reopen({
      _insert_ad: function() {
        if (siteSettings.dfp_bottom_1_display) {
          displaySlot('bottom-1', 'bottom-1',
            ()=>$('#suggested-topics').before(`<div id='bottom-1'/>`));
        }
        if (siteSettings.dfp_bottom_2_display) {
          displaySlot('bottom-2', 'bottom-2',
            ()=>$('#main-outlet').after("<div id='bottom-2'/>"));
        }
        for (var hood, i = 1; i < 4; i++) {
          if (Discourse.SiteSettings[`dfp_hood_${i}_display`]) {
            hood = `hood-${i}`;
            displaySlot(hood, hood);
          }
        }
        if (Discourse.SiteSettings.dfp_nth_topic_display > 0) {
          $('.nth-topic > td').each(function(index, element) {
            //displaySlot('nth-topic', element.getAttribute('id'));
          });
        }
      }.on('didInsertElement')
    });

    Topic.reopen({
      _insert_ad: function() {
        $('.topic-timeline').after("<div class='right-panel'/>");
        for (var html = "", i = 1; i < 7; i++) {
          html += `<div id='right-${i}' class='right'/>`;
        }
        $('.right-panel').append(html);
        for (i = 1; i < 7; i++) { displaySlot(`right-${i}`, `right-${i}`); }
      }
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
