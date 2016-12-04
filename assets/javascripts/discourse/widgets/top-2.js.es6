/*jshint esversion: 6 */

import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { displaySlot } from '../../lib/gpt';

export default createWidget('top-2', {
  tagName: 'li.top-2',

  html() {
    if ($('#top-2').length === 0) {
      displaySlot('top-2', 'top-2');
    }
    return h('div', { attributes: { id: 'top-2'} });
  }
});
