class TargetDrag{
  constructor(options) {
    let defaultOptions={
      mouseDownX:'',
      mouseDownY:'',
      initX:'',
      initY:'',
      flag:false
    }
    this.options=Object.assign({},defaultOptions,options);
    this.checkOptions().bindEvents()
  }

  checkOptions() {
    if (!this.options.element) {
      throw new Error('element is required')
    }
    return this
  }

  bindEvents(){
    let targetElement=this.options.element;

    this.options.element.addEventListener('mousedown',(e)=>{
      this.options.mouseDownX=e.pageX||e.clientX;
      this.options.mouseDownY=e.pageY||e.clientY;
      this.options.initX=this.options.element.offsetLeft;
      this.options.initY=this.options.element.offsetTop;
      this.options.flag=true;
    })

    this.options.element.addEventListener('mousemove',(e)=>{
      console.log(this.options.flag);
      if (this.options.flag) {
        let mouseMoveX=e.clientX,mouseMoveY=e.clientY;
        targetElement.style.left=parseInt(e.clientX)-parseInt(this.options.mouseDownX)+parseInt(this.options.initX)+'px';
        targetElement.style.top=parseInt(e.clientY)-parseInt(this.options.mouseDownY)+parseInt(this.options.initY)+'px';
      }
    })

    this.options.element.addEventListener('mouseup',(e)=>{
      this.options.flag=false;
    })

    return this;
  }

}
