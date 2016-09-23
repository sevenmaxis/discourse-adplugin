import { createWidget } from 'discourse/widgets/widget'
import { h } from 'virtual-dom'
import { slot, loadGoogle } from '../../lib/gpt'

// prevent loadGoogle from calling many times
var _top_2;

export default createWidget('top-2', {
  tagName: 'li.top-2',

  html() {
    if (_top_2 === 'undefined') {
      loadGoogle().then(function() {
        console.log('add top-2');
        slot('top-2', 'top-2');
      });
      _top_2 = 'rendered';
    } else {
      console.log('top-2 is already rendered');
    }

    return h('div', { attributes: { id: 'top-2'} });
  }
})
