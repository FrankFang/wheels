class Tabs {
  constructor(options) {
    let defaultOptions = {
      element: '',
      navSelector: '[data-role="tabs-nav"]',
      panesSelector: '[data-role="tabs-panes"]',
      activeClassName: 'active',
    }
    this.options = Object.assign({}, defaultOptions, options)
    this.checkOptions().bindEvents().setDefaultTab()
  }
  checkOptions() {
    if (!this.options.element) {
      throw new Error('element is required')
    }
    return this
  }
  bindEvents() {
    dom.on(this.options.element, 'click', `${this.options.navSelector}>li`, (e, el) => {
      let index = dom.index(el)
      let children = this.options.element.querySelector(this.options.panesSelector).children
      dom.uniqueClass(el, this.options.activeClassName)
      dom.uniqueClass(children[index], this.options.activeClassName)
    })
    return this
  }
  setDefaultTab() {
    this.options.element.querySelector(`${this.options.navSelector}>li:first-child`).click()
    return this
  }
}
