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
    //ES6 get语法
    get monthBeginning() {
      return this.day(1)
    }
    //不知道该月的实际天数,故而得到该月后一个月的Date对象，再去取得上一个月的最后一天，day(0)实际为setDate(0)，返回的是上一个月的最后一天，小技巧
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
        //这里的day是为了初始化该月的日期
      let nextMonth = this.day(1).month(month - 1)
        //修正日期，如果原日期大于当前月的最大日期，则将当前月日期设置为最后一天
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
    // ES6 GETTER语法，访问该属性时，自动调用对应的方法
    get clone() {
      return new Date2(this.date)
    }
	//这是核心方法，通过判断n决定set还是get
    _proxy(name, n, offset = 0) {
      if (n === undefined) {
        // this.date是日期对象的实例，这里调用他的原型上的方法,
        // getMonth、getDay、getHours、getMinutes、getDate、getFullYear、getMilliseconds
        // getDate 返回一个指定日期对象是该月的第几天  setDate 制定一个日期对象的天数
        return this.date[`get${capitalize(name)}`]() + offset
      } else {
        let d = this.clone
          //调用set方法 这里的减去offset只是为了setMonth准备的
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

  //让首字母大写
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  window.Date2 = Date2
}
