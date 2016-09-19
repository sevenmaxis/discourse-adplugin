import { createWidget } from 'discourse/widgets/widget'
import { h } from 'virtual-dom'
import { slot, loadGoogle } from '../../lib/gpt'

export default createWidget('top-2', {
  tagName: 'li.top-2',
  //loadedGoogletag: false,

  html(attrs) {
    loadGoogle().then(function() {
      console.log('top-2:promise is fullfiled');
      slot('top-2', 'top-2');
    });
    /*Ember.run.scheduleOnce('afterRender', () => {
      slot('top-2', 'top-2');
    })*/
    return h('div', { attributes: { id: 'top-2'} });
  }
})
