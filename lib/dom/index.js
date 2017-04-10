let dom = {
  on:function (element, eventType, selector, fn){
    element.addEventListener(eventType, (e)=>{
      let el = e.target
      while (el && !el.matches(selector)) {
        el = el.parentNode
        if(element === el){ el = null }
      }
      if(el){ fn.call(el, e, el) }
    })
    return element
  },

  index:function (element){
    let siblings = element.parentNode.children
    for(let index=0; index<siblings.length; index++){
      if(siblings[index] === element){
        return index
      }
    }
    return -1
  },

  uniqueClass:function (element, className){
    for (let el of element.parentNode.children){
      el.classList.remove(className)
    }
    element.classList.add(className)
    return element
  }
}
