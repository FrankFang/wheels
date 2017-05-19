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
    nextMonth() {
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
    _checkOptions() {
      if (!this.options.element) {
        throw new Error('element is required')
      }
      return this
    }
    _generateWeekdays() {
      let { startOfWeek, strings } = this.options
      let items = createArray({ length: 7, fill: startOfWeek }).map((day, i) => {
        let n = day + i >= 7 ? day + i - 7 : day + i
        let text = strings.weekdays(n)
        let li = dom.create(`<li>${text}</li>`)
        if ([0, 6].indexOf(n) >= 0) {
          li.classList.add('weekend')
        }
        return li
      })
      return dom.create(`<ol class="weekdays"></ol>`, items)
    }
    _generateCurrentMonth() {
      let current = new Date2(this.currentDate)
      let dayCount = current.monthEnding.day()
      let convert = this.options.strings.days
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
          li.querySelector('.day').textContent = convert(date2.day(-i).day())
          return li
        })
        .reverse()
    }
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
    _generateDays() {
      let { startOfWeek } = this.options
      let date2 = new Date2(this.currentDate)
      let monthBeginning = date2.monthBeginning
      let monthEnding = date2.monthEnding

      let days = this._generateCurrentMonth()
      days = this._generatePreviousMonth().concat(days)
      days = days.concat(this._generateNextMonth())
      return dom.create(`<ol class=days></ol>`, days)
    }
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
  function createArray({ length, fill }) {
    let array = Array.apply(null, { length: length })
    if (fill !== undefined) {
      array = array.map(() => fill)
    }
    return array
  }
}
