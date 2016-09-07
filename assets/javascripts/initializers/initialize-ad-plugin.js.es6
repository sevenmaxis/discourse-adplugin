import PostModel from 'discourse/models/post';
import { withPluginApi } from 'discourse/lib/plugin-api';

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

    withPluginApi('0.4', api => {
      api.decorateWidget('header-icons:before', helper => {
        const showExtraInfo = helper.attrs.topic;
        if (!showExtraInfo) {
          return helper.h('div.top-2-banner-holder', [
            helper.h('div.top-2-banner', [
              helper.h('a.close-thik', {
                href: '#'
              }),
              helper.h('a', {
                href: 'http://www.luxoft-training.ru/training/katalog_kursov/kompleksnye-programmy/kp-testing-auto/?utm_source=automated-testing&utm_medium=banner&utm_campaign=QA',
                target: '_blank'
              }, [
                helper.h('img', {
                  src: 'https://s4.postimg.org/ldmmul3ml/luxoft_300x60_106269515237171471500440.png'
                })
              ])
            ])
          ])
        }
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
