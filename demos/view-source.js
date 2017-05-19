{
  let parts = location.pathname.split(/\/|\./)
  let name = parts[parts.length - 1 - 1]
  let a = dom.create(`<a id="viewSource" href="https://github.com/FrankFang/wheels#如何阅读源代码">查看源码</a>`)
  a.style.position = 'fixed'
  a.style.bottom = '.2em'
  a.style.right = '.2em'
  a.style.background = 'black'
  a.style.border = '1px solid white'
  a.style.color = 'white'
  a.style.padding = '.2em'
  a.style.textDecoration = 'none'
  document.body.appendChild(a)
}
