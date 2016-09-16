import { createWidget } from 'discourse/widgets/widget'
import { h } from 'virtual-dom'

export default createWidget('top-2', {
  tagName: 'li.top-2',

  html(attrs) {
    Ember.run.scheduleOnce('afterRender', () => {
      console.log('next tick');
      if ($('#top-2').length == 0)
        console.log("element #top-2 doesn't exist yet");
    })
    return h('div', { attributes: { id: 'top-2'} });
  }
})
