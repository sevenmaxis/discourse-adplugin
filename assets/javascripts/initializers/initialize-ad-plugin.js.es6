import TopicView from 'discourse/views/topic';
import PostModel from 'discourse/models/post';
import { withPluginApi } from 'discourse/lib/plugin-api';
import { slot, loadGoogle } from '../lib/gpt';

// can't reopen TopicView in 'initialize' function, so reopen it right here
TopicView.reopen({
  _inserted: function() {
    this._super();
    loadGoogle().then(function() {
      console.log('add topic-bottom');
      $("#topic-bottom").after("<div id='bottom'/>");
      slot('bottom', 'bottom');

      console.log('add right-panel');
      $('.timeline-container > .topic-timeline').after("<div id='right-panel'/>");
      slot('right-panel', 'right-panel');
    })
  }.on('didInsertElement')
})

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

    loadGoogle().then(function() {
      if (siteSettings.dfp_top_1_display) {
        console.log('add top-1');
        $('#main').before($("<section/>").append("<div id='top-1'></div>"));
        slot('top-1', 'top-1');
      }

      console.log('add premium-1');
      var snippet = $("<div class='container'/>").append("<div id='premium-1'/>");
      $('#main-outlet > .container:first').before(snippet);
      slot('premium-1', 'premium-1');
    })

    withPluginApi('0.1', api => {
      api.decorateWidget('header-icons:before', function(helper) {
        return helper.attach('top-2');
      })
    })

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
