{
  class Date2 {
    constructor(date = new Date()) {
      this.date = new Date(date - 0)
    }
    weekday(n) {
      if (n) {
        throw new Error('You can not set weekday')
      }
      return this._proxy('day')
    }
    day(n) {
      return this._proxy('date', n)
    }
    year(n) {
      return this._proxy('fullYear', n)
    }
    month(n) {
      return this._proxy('month', n, 1)
    }
    get monthBeginning() {
      return this.day(1)
    }
    get monthEnding() {
      return this.month(this.month() + 1).day(0)
    }
    get nextMonth() {
      let day = this.day()
      let month = this.month()
      let nextMonth = this.day(1).month(month + 1)
      if (day > nextMonth.monthEnding.day()) {
        return nextMonth.monthEnding
      } else {
        return nextMonth.day(day)
      }
    }
    get previousMonth() {
      let day = this.day()
      let month = this.month()
      let nextMonth = this.day(1).month(month - 1)
      if (day > nextMonth.monthEnding.day()) {
        return nextMonth.monthEnding
      } else {
        return nextMonth.day(day)
      }
    }
    hours(n) {
      return this._proxy('hours', n)
    }
    minutes(n) {
      return this._proxy('minutes', n)
    }
    seconds(n) {
      return this._proxy('seconds', n)
    }
    milliseconds(n) {
      return this._proxy('milliseconds', n)
    }
    get clone() {
      return new Date2(this.date)
    }

    _proxy(name, n, offset = 0) {
      if (n === undefined) {
        return this.date[`get${capitalize(name)}`]() + offset
      } else {
        let d = this.clone
        d.date[`set${capitalize(name)}`](n - offset)
        return d
      }
    }
    isSameMonthAs(date) {
      return this.year() === date.getFullYear() && this.month() === date.getMonth() + 1
    }
    isSameDayAs(date) {
      return this.isSameMonthAs(date) && this.day() === date.getDate()
    }
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  window.Date2 = Date2
}
