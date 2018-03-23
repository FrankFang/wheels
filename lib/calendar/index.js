{
  class Calendar {
    constructor(options) {
      let defaultOptions = {
        element: null,
        startOfWeek: 1, // 1 or 0
        strings: {
          weekdays: n => {
            let map = { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' }
            return map[n]
          },
          days: n => `${n}`,
          dayTemplate: `
            <li>
              <span class="dayLabel">
                <span class="day"></span><span class="unit">日</span>
              </span>
            </li>
          `,
          output: d => `${d.getFullYear()}年${d.getMonth() + 1}月`,
        },
      }

      this.options = Object.assign({}, defaultOptions, options)
      this.currentDate = new Date()
      this._checkOptions()
      this._generateCalendar()
    }
    // 按钮事件
    nextMonth() {
        // nextMonth返回的是Date2对象，所以要取到他的date属性，这才是真正的Date对象
      this.currentDate = new Date2(this.currentDate).nextMonth.date
      this._generateCalendar()
    }
    previousMonth() {
      this.currentDate = new Date2(this.currentDate).previousMonth.date
      this._generateCalendar()
    }
    resetMonth() {
      this.currentDate = new Date()
      this._generateCalendar()
    }
    //判空事件
    _checkOptions() {
      if (!this.options.element) {
        throw new Error('element is required')
      }
      return this
    }
    //整理页面上星期的显示，受到option里startOfWeek的控制
      _generateWeekdays() {
      let { startOfWeek, strings } = this.options
      let items = createArray({ length: 7, fill: startOfWeek }).map((day, i) => {
		  //通过这个表达式，得出星期的排列
        let n = day + i >= 7 ? day + i - 7 : day + i
        let text = strings.weekdays(n)
        let li = dom.create(`<li>${text}</li>`)
		//对周六周天添加样式
        if ([0, 6].indexOf(n) >= 0) {
          li.classList.add('weekend')
        }
        return li
      })
      return dom.create(`<ol class="weekdays"></ol>`, items)
    }
    //整理当前月DOM排列
      _generateCurrentMonth() {
          let current = new Date2(this.currentDate)
		  //该月的天数 = 该月最后一天的日期
          let dayCount = current.monthEnding.day()
		  //这个convert是为了每一天对应的元素上写入当天的日期，就是几号就写多少号
          let convert = this.options.strings.days
		  //遍历长度为天数的数组，“_”下划线起到占位的效果，没其他用途
          return createArray({ length: dayCount }).map((_, i) => {
              let date2 = current.day(i + 1)
              let li = dom.create(this.options.strings.dayTemplate)
              li.className = 'currentMonth'
              if (date2.isSameDayAs(new Date())) {
                  li.classList.add('today')
              }
              if ([0, 6].indexOf(date2.weekday()) >= 0) {
                  li.classList.add('weekend')
              }
              li.querySelector('.day').textContent = convert(i + 1)
              return li
          })
      }
      //整理与当前月连接的上一月DOM排列
      _generatePreviousMonth() {
      let { startOfWeek } = this.options
      let date2 = new Date2(this.currentDate)
      let monthBeginning = date2.monthBeginning
      let startPadding = monthBeginning.weekday() >= startOfWeek
        ? monthBeginning.weekday() - startOfWeek
        : monthBeginning.weekday() + 7 - startOfWeek
      let convert = this.options.strings.days
      return createArray({ length: startPadding })
        .map((_, i) => {
          let li = dom.create(this.options.strings.dayTemplate)
          li.className = 'previousMonth'
          if ([0, 6].indexOf(date2.day(-i).weekday()) >= 0) {
            li.classList.add('weekend')
          }
          //这里的-i是一个小技巧,例如，对 一个Date对象为 2017-08-08，对它这个day（0），会返回上一个月的最后一天这个日期对象。
          li.querySelector('.day').textContent = convert(date2.day(-i).day())
          return li
        })
          //这里反转了数组的顺序，因为他是从当月的一号依次找到上一个月在日历上的边界，得反过来
        .reverse()
    }
      //整理与当前月连接的下一月DOM排列
    _generateNextMonth() {
      let { startOfWeek } = this.options
      let date2 = new Date2(this.currentDate)
      let monthEnding = date2.monthEnding
      let endPadding = monthEnding.weekday() >= startOfWeek
        ? 7 - (monthEnding.weekday() - startOfWeek + 1)
        : 7 - (monthEnding.weekday() + 7 - startOfWeek + 1)
      let convert = this.options.strings.days

      return createArray({ length: endPadding }).map((_, i) => {
        let li = dom.create(this.options.strings.dayTemplate)
        li.className = 'nextMonth'
        let data2 = new Date2(this.currentDate)
        if ([0, 6].indexOf(date2.nextMonth.day(i + 1).weekday()) >= 0) {
          li.classList.add('weekend')
        }
        li.querySelector('.day').textContent = convert(i + 1)
        return li
      })
    }
    //整理所有的日期,在这里调用上面的三个方法
    _generateDays() {
      let { startOfWeek } = this.options
      let date2 = new Date2(this.currentDate)
	  //这里定义的monthBeginning和monthEnding应该没有用处，因为在_generateCurrentMonth和_generatePreviousMonth方法中，他们又重新获取了
      //let monthBeginning = date2.monthBeginning
      //let monthEnding = date2.monthEnding

      let days = this._generateCurrentMonth()
        //连接数组
      days = this._generatePreviousMonth().concat(days)
      days = days.concat(this._generateNextMonth())
      return dom.create(`<ol class=days></ol>`, days)
    }
    //整理日历，插入页面
    _generateCalendar() {
      let { element } = this.options
      dom.removeChildren(element)
      dom.append(element, this._generateWeekdays())
      dom.append(element, this._generateDays())
      this.options.output.textContent = this.options.strings.output(this.currentDate)
      return this
    }
  }

  window.Calendar = Calendar

  // 生成一个长度位 length，内容为 fill 的数组
  // 不同于 new Array(length)，createArray 生成的数组是有 0 到 length 下标的
  // https://segmentfault.com/q/1010000006793990  这里贴一个这种特殊写法的链接，只是还不清楚为啥会有下标
  function createArray({ length, fill }) {
    let array = Array.apply(null, { length: length })
    if (fill !== undefined) {
      array = array.map(() => fill)
    }
    return array
  }
}
