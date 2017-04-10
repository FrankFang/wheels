import * as dom from '../../dom'

export default class Tab {
  constructor(options){
    let defaultOptions = {
      element: '',
      navSelector: '[data-role="tabs-nav"]',
      panesSelector: '[data-role="tabs-panes"]',
      activeClassName: 'active'
    }
    this.options = Object.assign({}, defaultOptions, options)
    this.bindEvents()
  }
  bindEvents(){
    dom.on(this.options.element, 'click', `${this.options.navSelector}>li`, (e, el)=>{
      let index = dom.index(el)
      let children = this.options.element.querySelector(this.options.panesSelector).children
      dom.uniqueClass(el, this.options.activeClassName)
      dom.uniqueClass(children[index], this.options.activeClassName)
    })
  }
}

