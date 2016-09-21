import { createWidget } from 'discourse/widgets/widget'
import { h } from 'virtual-dom'
import { slot, loadGoogle } from '../../lib/gpt'

export default createWidget('top-2', {
  tagName: 'li.top-2',

  html() {
    loadGoogle().then(function() {
      console.log('add top-2');
      slot('top-2', 'top-2');
    });

    return h('div', { attributes: { id: 'top-2'} });
  }
})
