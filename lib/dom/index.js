let dom = {
  on: function(element, eventType, selector, fn) {
    element.addEventListener(eventType, e => {
      let el = e.target
      //判断用户所点击的元素是不是和允许切换的元素一样
      while (!el.matches(selector)) {
        //如果不一样,就检查点击的元素是不是element元素
        if (element === el) {
          //是的话,就将el设置为null,因为在这个里面并没有能允许切换的元素
          el = null
          break
        }
        //如果不是就一直向上查找,因为要保证我只要点击的地方是这个元素的子元素就可以切换
        el = el.parentNode
      }
      //el有值的话,执行传入的回调函数
      el && fn.call(el, e, el)
    })
    return element
  },

  onSwipe: function(element, fn) {
    let x0, y0
    element.addEventListener('touchstart', function(e) {
      x0 = e.touches[0].clientX
      y0 = e.touches[0].clientY
    })
    element.addEventListener('touchmove', function(e) {
      if (!x0 || !y0) {
        return
      }
      let xDiff = e.touches[0].clientX - x0
      let yDiff = e.touches[0].clientY - y0

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          fn.call(element, e, 'right')
        } else {
          fn.call(element, e, 'left')
        }
      } else {
        if (yDiff > 0) {
          fn.call(element, e, 'down')
        } else {
          fn.call(element, e, 'up')
        }
      }
      x0 = undefined
      y0 = undefined
    })
  },
  //获取元素在兄弟元素中的序号
  index: function(element) {
    //先获取传入元素的父元素,然后在调用children得到元素类数组
    let siblings = element.parentNode.children
    //循环比对
    for (let index = 0; index < siblings.length; index++) {
      //兄弟元素和传入元素相等
      if (siblings[index] === element) {
        //返回对应的下标
        return index
      }
    }
    return -1
  },
  //切换class方法
  uniqueClass: function(element, className) {
    //将每一个选项内容元素class清除
    dom.every(element.parentNode.children, el => {
      el.classList.remove(className)
    })
    //对所点击的选项添加class 
    element.classList.add(className)
    return element
  },
  //给每一个元素执行一些动作
  every: function(nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
      //执行回调函数
      fn.call(null, nodeList[i], i)
    }
    return nodeList
  },

  // http://stackoverflow.com/a/35385518/1262580
  //创建元素
  create: function(html, children) {
    //创建一个dom模板片段
    var template = document.createElement('template')
    //将传入的元素字符串去除两端空白字符后赋值
    template.innerHTML = html.trim()
    //获取模板的内容(content)下的第一个元素(firstChild)
    let node = template.content.firstChild
    if (children) {
      dom.append(node, children)
    }
    return node
  },

  append: function(parent, children) {
    if (children.length === undefined) {
      children = [children]
    }
    for (let i = 0; i < children.length; i++) {
      parent.appendChild(children[i])
    }
    return parent
  },
  prepend: function(parent, children) {
    if (children.length === undefined) {
      children = [children]
    }
    for (let i = children.length - 1; i >= 0; i--) {
      if (parent.firstChild) {
        parent.insertBefore(children[i], parent.firstChild)
      } else {
        parent.appendChild(children[i])
      }
    }
    return parent
  },
  removeChildren: function(element) {
    while (element.hasChildNodes()) {
      element.removeChild(element.lastChild)
    }
    return this
  },

  dispatchEvent: function(element, eventType, detail) {
    let event = new CustomEvent(eventType, { detail })
    element.dispatchEvent(event)
    return this
  },
}
