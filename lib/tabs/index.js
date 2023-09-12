class Tabs {
  constructor(options) {
    //这是默认的配置
    let defaultOptions = {
      //容器元素
      element: '',
      //选项卡元素
      navSelector: '[data-role="tabs-nav"]',
      //选项卡内容元素
      panesSelector: '[data-role="tabs-panes"]',
      //选中状态
      activeClassName: 'active',
    }
    //先将传入的配置和默认配置合并 (Object.assign)
    this.options = Object.assign({}, defaultOptions, options)
    this.checkOptions().bindEvents().setDefaultTab()
  }
  //检查是否传入元素
  checkOptions() {
    if (!this.options.element) {
      throw new Error('element is required')
    }
    //返回自身方便链式调用
    return this
  }
  //绑定事件
  bindEvents() {
    //接下来就到dom库那里了
    dom.on(this.options.element, 'click', `${this.options.navSelector}>li`, (e, el) => {
      //回来这里,拿到元素在兄弟元素中的下标
      let index = dom.index(el)
      //获取容器元素下的要切换内容的列表
      let children = this.options.element.querySelector(this.options.panesSelector).children
      //切换class
      dom.uniqueClass(el, this.options.activeClassName)
      dom.uniqueClass(children[index], this.options.activeClassName)
    })
    return this
  }
  //打开页面时初始化一个选项卡被点击
  setDefaultTab() {
    this.options.element.querySelector(`${this.options.navSelector}>li:first-child`).click()
    return this
  }
}
