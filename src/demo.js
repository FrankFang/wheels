import * as Wheels from '../lib/'

require('../lib/components/tabs/default.css')

let t = new Wheels.Tabs({
  element: document.querySelector('[data-role=tabs]')
})
console.log(t)
