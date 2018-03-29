class Pager {
  constructor(options) {
    let defaultOptions = {
      //容器元素
      element: null,
      //可显示的分页数量
      buttonCount: 10,
      //当前页数
      currentPage: 1,
      //总页数
      totalPage: 1,
      //分页url
      pageQuery: '', // 'page'
      //动态生成的按钮元素
      templates: {
        number: '<span>%page%</span>',
        prev: '<button class=prev>上一页</button>',
        next: '<button class=next>下一页</button>',
        first: '<button class=first>首页</button>',
        last: '<button class=last>末页</button>',
      },
    }
    //合并传入的配置和默认配置
    this.options = Object.assign({}, defaultOptions, options)
    //用来放新的分页列表
    this.domRefs = {}
    //当前页数
    this.currentPage = parseInt(this.options.currentPage, 10) || 1
    this.checkOptions().initHtml().bindEvents()
  }
  //检查有没有传入元素
  checkOptions() {
    if (!this.options.element) {
      throw new Error('element is required')
    }
    return this
  }
  bindEvents() {
    //绑定事件 --> dom库
    dom.on(this.options.element, 'click', 'ol[data-role="pageNumbers"]>li', (e, el) => {
      this.goToPage(parseInt(el.dataset.page, 10))
    })
    //各种绑定
    this.domRefs.first.addEventListener('click', () => {
      this.goToPage(1)
    })
    this.domRefs.last.addEventListener('click', () => {
      this.goToPage(this.options.totalPage)
    })
    this.domRefs.prev.addEventListener('click', () => {
      this.goToPage(this.currentPage - 1)
    })
    this.domRefs.next.addEventListener('click', () => {
      this.goToPage(this.currentPage + 1)
    })
  }
  //分页控制
  goToPage(page) {
    //如果点击的元素和当前页数一样的话就什么都不做 ps:这里注意看下运算符优先级
    if (!page || page > this.options.totalPage || page === this.currentPage) {
      return
    }
    //如需要控制url才执行
    if (this.options.pageQuery) {
      bom.queryString.set(this.options.pageQuery, page)
    }
    this.currentPage = page
    //这是自定义事件,用来控制台显示页数的,也可以去掉
    this.options.element.dispatchEvent(new CustomEvent('pageChange', { detail: { page } }))
    //重绘分页列表
    this.rerender()
  }
  //重绘分页列表
  rerender() {
    this._checkButtons()
    //先获取一波新的分页列表
    let newNumbers = this._createNumbers()
    //拿到旧的分页列表
    let oldNumbers = this.domRefs.numbers
    //获取旧的分页列表的父元素然后替换一下
    oldNumbers.parentNode.replaceChild(newNumbers, oldNumbers)
    //将新的分页列表赋值
    this.domRefs.numbers = newNumbers
  }
  //初始化分页需要的HTML元素
  initHtml() {
    //创建分页组件的nav元素
    let pager = (this.domRefs.pager = document.createElement('nav'))
    this.domRefs.first = dom.create(this.options.templates.first)
    this.domRefs.prev = dom.create(this.options.templates.prev)
    this.domRefs.next = dom.create(this.options.templates.next)
    this.domRefs.last = dom.create(this.options.templates.last)
    //检查按钮是否符合条件可以按下
    this._checkButtons()
    //创建分页列表 --> this._createNumbers()
    this.domRefs.numbers = this._createNumbers()
    pager.appendChild(this.domRefs.first)
    pager.appendChild(this.domRefs.prev)
    pager.appendChild(this.domRefs.numbers)
    pager.appendChild(this.domRefs.next)
    pager.appendChild(this.domRefs.last)
    //添加到页面上
    this.options.element.appendChild(pager)
    return this
  }
  //检查按钮是否符合条件可以按下
  _checkButtons() {
    if (this.currentPage === 1) {
      this.domRefs.first.setAttribute('disabled', '')
      this.domRefs.prev.setAttribute('disabled', '')
    } else {
      this.domRefs.first.removeAttribute('disabled')
      this.domRefs.prev.removeAttribute('disabled')
    }
    if (this.currentPage === this.options.totalPage) {
      this.domRefs.next.setAttribute('disabled', '')
      this.domRefs.last.setAttribute('disabled', '')
    } else {
      this.domRefs.next.removeAttribute('disabled')
      this.domRefs.last.removeAttribute('disabled')
    }
  }
  //创建新分页列表的方法
  _createNumbers() {
    //获取当前的页数
    let currentPage = this.currentPage
    //获取可显示的页数和总页数
    let { buttonCount, totalPage } = this.options
     //用来计算当前页数有没有超过分页器显示数目的一半
     //和防止到最后几页页数列表减少
    let start1 = Math.max(currentPage - Math.round(buttonCount / 2), 1)
    let end1 = Math.min(start1 + buttonCount - 1, totalPage)
    let end2 = Math.min(currentPage + Math.round(buttonCount / 2) - 1, totalPage)
    let start2 = Math.max(end2 - buttonCount + 1, 1)
    let start = Math.min(start1, start2)
    let end = Math.max(end1, end2)
    //创建一个ol元素 --> dom库
    let ol = dom.create('<ol data-role="pageNumbers"></ol>')
    let numbers = []
    //循环创建页数li
    for (var i = start; i <= end; i++) {
      let li = dom.create(`<li data-page="${i}">${this.options.templates.number.replace('%page%', i)}</li>`)
      //如果是当前的页面就添加class
      if (i === currentPage) {
        li.classList.add('current')
      }
      ol.appendChild(li)
    }
    return ol
  }
}
