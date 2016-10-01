import { createWidget } from 'discourse/widgets/widget'
import { h } from 'virtual-dom'
import { slot, loadGoogle } from '../../lib/gpt'

export default createWidget('top-2', {
  tagName: 'li.top-2',

  html() {
    if ($('#top-2').length == 0) {
      loadGoogle().then(function() {
        console.log('add top-2');
        slot('top-2', 'top-2');
      });
    }
    console.log('top-2 widget rendered');

    return h('div', { attributes: { id: 'top-2'} });
  }
})
