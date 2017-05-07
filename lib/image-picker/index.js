{
  class ImagePicker {
    constructor(options) {
      let defaultOptions = {
        element: null,
        upload: {
          url: '',
          method: '',
          inputName: '',
        },
        parseResponse: null,
        fallbackImage: '',
      }
      this.options = Object.assign({}, defaultOptions, options)
      this.checkOptions()
      this.domRefs = {
        img: this.options.element.querySelector('img'),
      }
      this.initHtml()
      this.bindEvents()
    }
    checkOptions() {
      let { element, upload: { url, method, inputName } } = this.options
      if (!element || !url || !method || !inputName) {
        throw new Error('Some option is required')
      }
      return this
    }
    initHtml() {
      let { element } = this.options
      let fileInput = (this.domRefs.fileInput = dom.create('<input type="file"/>'))
      dom.append(element, fileInput)
    }
    bindEvents() {
      let { element, upload, parseResponse, fallbackImage } = this.options
      this.domRefs.fileInput.addEventListener('change', e => {
        let f = e.target.files[0]
        let formData = new window.FormData()
        formData.append(upload.inputName, f)

        element.classList.add('uploading')
        http(upload.method, upload.url, formData).then(
          responseBody => {
            element.classList.remove('uploading')
            let path = parseResponse(responseBody)
            let img = new Image()
            img.onload = () => {
              element.classList.remove('downloading')
              this.domRefs.img.src = path
              dom.dispatchEvent(element, 'uploadedImageLoaded')
            }
            img.onerror = () => {
              element.classList.remove('downloading')
              if (fallbackImage) {
                this.domRefs.img.src = fallbackImage
              }
              dom.dispatchEvent(element, 'uploadedImageFailed')
            }
            element.classList.add('downloading')
            img.src = path
            dom.dispatchEvent(element, 'uploaded')
          },
          () => {
            dom.dispatchEvent(element, 'uploadFailed')
          }
        )
      })
    }
  }

  window.ImagePicker = ImagePicker

  function http(method, url, data) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.open(method, url)
      xhr.onload = () => resolve(xhr.responseText, xhr)
      xhr.onerror = () => reject(xhr)
      xhr.send(data)
    })
  }
}
