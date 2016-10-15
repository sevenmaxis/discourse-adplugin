/*jshint esversion: 6 */

import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { slot, destroySlot, loadGoogle } from '../../lib/gpt';

export default createWidget('top-2', {
  tagName: 'li.top-2',

  html() {
    if ($('#top-2').length === 0) {
      loadGoogle().then(function() {
        console.log('add top-2');
        slot('top-2', 'top-2');
      });
    }
    return h('div', { attributes: { id: 'top-2'} });
  }
});
