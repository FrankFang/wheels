let bom = {
  queryString: {
    get: function(name) {
      let getAll = searchString => {
        let query = searchString.replace(/^\?/, '')
        let queryObject = {}
        let queryArray = query.split('&').filter(i => i).forEach((string, index) => {
          let parts = string.split('=')
          queryObject[parts[0]] = decodeURIComponent(parts[1])
        })
        return queryObject
      }
      if (arguments.length === 0) {
        return getAll(location.search)
      } else {
        return getAll(location.search)[name]
      }
    },
    set: function(name, value) {
      let set = (search, name, value) => {
        let regex = new RegExp(`(${encodeURIComponent(name)})=([^&]*)`, '')
        if (regex.test(search)) {
          return search.replace(regex, (match, c1, c2) => `${c1}=${encodeURIComponent(value)}`)
        } else {
          return search.replace(/&?$/, `&${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
        }
      }
      if (arguments.length === 1 && typeof name === 'object' && name !== null) {
        let search = location.search
        for (let key in arguments[0]) {
          search = set(search, key, arguments[0][key])
        }
        location.search = search
      } else {
        location.search = set(location.search, name, value)
      }
    },
  },
}
