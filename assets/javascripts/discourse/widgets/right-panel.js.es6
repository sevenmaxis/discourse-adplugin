import { createWidget } from 'discourse/widgets/widget'
import { h } from 'virtual-dom'
import { slot, loadGoogle } from '../../lib/gpt'

export default createWidget('right-panel', {
  tagName: 'div.right-panel',

  html() {
    loadGoogle().then(function() {
      console.log('add right-panel');
      slot('right-panel', 'right-panel');
    })

    return h('div', { attributes: {id: 'right-panel'} })
  }
})
