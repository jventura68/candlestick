if(typeof visme==='undefined'){var visme={constants:{FPS60:16,DELAY_BEFORE_CHECKING_REPLACING_VISME_DIVS_TO_IFRAMES_MS:1000,DELAY_BEFORE_UPDATING_REPLACED_IFRAME_SIZE_MS:0,DEBOUNCED_UPDATING_RESPONSEIVE_SIZE_DELAY_MS:300,TOP_LEVEL_UPDATE_DIMENSIONS_MESSAGE_TYPE:'@visme::TOP_LEVEL_UPDATE_DIMENSIONS'},data:[],isChangedOrientation:false,isInited:false,isInitOnReadyFired:false,initOnReady(){if(visme.isInitOnReadyFired){return}
visme.onInit(window,visme.init)},onInit(element,func){var canInitNow=element.document&&(element.document.readyState==='complete'||element.document.readyState==='interactive')
if(canInitNow){func()
return}
visme.addEvent(element,'load',func)
if(!element.document){return}
visme.addEvent(element.document,'DOMContentLoaded',func)
var readyStateChange=function(){if(element.document.readyState==='complete'){func()}}
visme.addEvent(element.document,'readystatechange',readyStateChange)},init(){if(visme.isInited){return}
visme.isInited=true
visme.setupVisme()
visme.addEvent(window,'orientationchange',visme.onOrientationChangeHandler)
visme.addEvent(window,'resize',visme.debouncedUpdateResponsiveSize)
visme.addEvent(window,'message',visme.onMessageHandler,false)
visme.addEvent(window,'scroll',visme.debouncedPassDimensions)
visme.addEvent(window,'resize',visme.debouncedPassDimensions)
visme.addEvent(window,'orientationchange',visme.debouncedPassDimensions)},setupVisme(){var vismeDivs=document.getElementsByClassName('visme_d')
var vismeDivsForSetUp=[]
for(var i=0;i<vismeDivs.length;i++){var vismeDiv=vismeDivs[i]
var width=visme.getComputedSizeStyle(vismeDiv,'width')
if(width!==0){vismeDivsForSetUp.push({vismeDiv,width,})}}
var vismeDataLength=visme.data.length
for(var index=0;index<vismeDivsForSetUp.length;index++){var meta=vismeDivsForSetUp[index]
visme.setUpVismeEl(meta.vismeDiv,index+vismeDataLength,meta.width)}
setTimeout(visme.setupVisme,visme.constants.DELAY_BEFORE_CHECKING_REPLACING_VISME_DIVS_TO_IFRAMES_MS)},setUpVismeEl(vismeDiv,index,width){var vismeIframe=document.createElement('IFRAME')
var vismeOrigin=visme.getOrigin(vismeDiv)
vismeIframe.setAttribute('src',vismeOrigin+'/_embed/'+vismeDiv.getAttribute('data-url')+'?responsive=1')
vismeIframe.style.border='none'
vismeIframe.className='visme'
vismeIframe.dataset.projectid=vismeDiv.getAttribute('data-url')
if(!visme.data[index]){visme.data[index]={}}
visme.data[index].height=vismeDiv.getAttribute('data-h')
visme.data[index].width=vismeDiv.getAttribute('data-w')
vismeIframe.setAttribute('width',width)
if(navigator.platform.match(/iPhone|iPod|iPad/)){vismeIframe.setAttribute('scrolling','no')}
vismeIframe.style.width=width+'px'
if(visme.data[index].height&&visme.data[index].width){vismeIframe.setAttribute('height',visme.data[index].height*(parseInt(width)/visme.data[index].width))}
vismeIframe.setAttribute('allowfullscreen',true)
vismeIframe.setAttribute('webkitallowfullscreen',true)
vismeIframe.setAttribute('mozallowfullscreen',true)
vismeDiv.parentNode.replaceChild(vismeIframe,vismeDiv)
visme.onInit(vismeIframe.contentWindow,function(){setTimeout(visme.updateResponsiveSizeEl,visme.constants.DELAY_BEFORE_UPDATING_REPLACED_IFRAME_SIZE_MS,vismeIframe,index)})},updateResponsiveSize(){var vismeIframes=document.getElementsByClassName('visme')
for(var i=0;i<vismeIframes.length;i++){visme.updateResponsiveSizeEl(vismeIframes[i],i)}
visme.isChangedOrientation=false},updateResponsiveSizeEl(vismeIframe,index){vismeIframe.style.overflow='hidden'
var elementWidth=visme.data[index].width
var elementHeight=visme.data[index].height
var width=visme.getComputedSizeStyle(vismeIframe,'width')
var paddingLeft=visme.getComputedSizeStyle(vismeIframe,'padding-left')
var paddingRight=visme.getComputedSizeStyle(vismeIframe,'padding-right')
var elementWidthWithoutPaddings=width-paddingLeft-paddingRight
if(elementWidthWithoutPaddings<=0){elementWidthWithoutPaddings=width}
var ratio=elementWidthWithoutPaddings/elementWidth
vismeIframe.width=elementWidthWithoutPaddings
vismeIframe.style.width=elementWidthWithoutPaddings+'px'
if(elementHeight){vismeIframe.height=parseInt(elementHeight*ratio)}
if(visme.isChangedOrientation){var src=vismeIframe.getAttribute('src')
vismeIframe.setAttribute('src','')
vismeIframe.setAttribute('src',src)
visme.isChangedOrientation=false}},getOrigin(iframeDestination){var domain=iframeDestination.getAttribute('data-domain')||'my'
var isDev=domain==='visme4'
var isFileOrigin=window.location.origin==='file://'
var protocol=''
if(isFileOrigin){protocol=isDev?'http:':'https:'}
return protocol+'//'+domain+(isDev?'':'.visme.co')},addEvent(obj,type,fn){if(obj.addEventListener){obj.addEventListener(type,fn,false)}else if(obj.attachEvent){obj['e'+type+fn]=fn
obj[type+fn]=function(){obj['e'+type+fn](window.event)}
obj.attachEvent('on'+type,obj[type+fn])}else{obj['on'+type]=obj['e'+type+fn]}},debounce(func,wait){var timeout
return function(){var context=this
var args=arguments
clearTimeout(timeout)
timeout=setTimeout(function(){timeout=null
func.apply(context,args)},wait)}},getParent(element,parentLevel){var result=element
while(parentLevel--){if(result&&result.parentNode){result=result.parentNode}else{result=null
break}}
return result},getComputedSizeStyle(element,styleName){var maxParentLevel=2
var style=0
for(var level=1;level<=maxParentLevel&&(isNaN(style)||style===0||style==='auto');level++){var parent=visme.getParent(element,level)
if(parent===null){style=0
break}
var strategies=[function(){return Number(window.getComputedStyle(parent,null).getPropertyValue(styleName).replace('px',''))},function(){return Number(parent.style[styleName].replace('px',''))},function(){return Number(parent.currentStyle[styleName].replace('px',''))}]
for(var k=0;k<strategies.length&&(isNaN(style)||style===0);k++){try{style=strategies[k]()}catch(e){style=0}}}
return style},passDimensions(){var dimensions={window:{pageYOffset:window.pageYOffset},document:{body:{scrollTop:0,scrollHeight:0,offsetHeight:0},documentElement:{scrollHeight:0,offsetHeight:0,scrollTop:0,clientWidth:0,clientHeight:0}}}
if(document.body){dimensions.document.body.scrollTop=document.body.scrollTop
dimensions.document.body.scrollHeight=document.body.scrollHeight
dimensions.document.body.offsetHeight=document.body.offsetHeight}
if(document.documentElement){dimensions.document.documentElement.scrollHeight=document.documentElement.scrollHeight
dimensions.document.documentElement.offsetHeight=document.documentElement.offsetHeight
dimensions.document.documentElement.scrollTop=document.documentElement.scrollTop
dimensions.document.documentElement.clientWidth=document.documentElement.clientWidth
dimensions.document.documentElement.clientHeight=document.documentElement.clientHeight}
var vismeIframes=document.querySelectorAll('iframe.visme')
var message=JSON.stringify({type:visme.constants.TOP_LEVEL_UPDATE_DIMENSIONS_MESSAGE_TYPE,payload:dimensions})
for(var i=0;i<vismeIframes.length;i++){vismeIframes[i].contentWindow.postMessage(message,'*')}},onMessageHandler(e){if(e.origin.indexOf('visme')===-1){return}
var key=e.message?'message':'data'
var data=e[key]
if(data.event==='title'){var vismeIframes=document.getElementsByClassName('visme')
var i
for(i=0;i<vismeIframes.length;i++){var isEqualProjectId=vismeIframes[i].dataset.projectid.toString()===data.projectid.toString()
if(isEqualProjectId||vismeIframes[i].contentWindow===e.source){vismeIframes[i].title=data.title}}}
if(data.event==='hyperlink'&&data.target==='same_window'){window.location=data.args}},onOrientationChangeHandler(){visme.isChangedOrientation=true
visme.debouncedUpdateResponsiveSize()}}
visme.debouncedUpdateResponsiveSize=visme.debounce(visme.updateResponsiveSize,visme.constants.DEBOUNCED_UPDATING_RESPONSEIVE_SIZE_DELAY_MS)
visme.debouncedPassDimensions=visme.debounce(visme.passDimensions,visme.constants.FPS60)
visme.initOnReady()}