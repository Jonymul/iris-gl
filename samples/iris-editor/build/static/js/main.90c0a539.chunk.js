(this["webpackJsonpiris-editor"]=this["webpackJsonpiris-editor"]||[]).push([[0],{24:function(e,t,n){"use strict";n.r(t);var r=n(14),a=n.n(r),i=n(7),o=n(10),c=n(2),s=n(0),u=n(5),l=n(6),d=function(){function e(t){Object(u.a)(this,e),this.setWebGLRenderingContext(t)}return Object(l.a)(e,[{key:"compileShader",value:function(e,t){var n=this.context,r=n.createShader(t);return n.shaderSource(r,e),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)||console.error("Shader failed to compile: ".concat(n.getShaderInfoLog(r))),r}},{key:"compileVertexShader",value:function(e){var t=this.context;return this.compileShader(e,t.VERTEX_SHADER)}},{key:"compileFragmentShader",value:function(e){var t=this.context;return this.compileShader(e,t.FRAGMENT_SHADER)}},{key:"setWebGLRenderingContext",value:function(e){this.context=e}}]),e}();function f(e,t){console.warn("Couldn't set uniform. \"".concat(t,'" is not a valid numeric value for ').concat(e))}function m(e,t){console.warn("Couldn't set uniform. \"".concat(t,'" is not a valid Float32List for ').concat(e))}function h(e,t){console.warn("Couldn't set uniform. \"".concat(t,'" is not a valid Int32List for ').concat(e))}var b,g=new Float32Array([-1,-1,-1,1,1,1,-1,-1,1,1,1,-1]),v=function(){function e(t){Object(u.a)(this,e),this.state="Awaiting Image",this.programUniformLocations=new Map,this.canvas=t,this.canvas.width=0,this.canvas.height=0;var n=this.context=this.canvas.getContext("webgl");if(null===n)throw new Error("Couldn't get a WebGL context");this.shaderCompiler=new d(n),this.clearCanvas();var r=this.createProgram([this.shaderCompiler.compileVertexShader("\n  attribute vec2 position;\n  varying vec2 texCoords;\n\n  void main() {\n    texCoords = (position + 1.0) / 2.0;\n    texCoords.y = 1.0 - texCoords.y;\n    gl_Position = vec4(position, 0, 1.0);\n  }\n"),this.shaderCompiler.compileFragmentShader("\n  precision highp float;\n  varying vec2 texCoords;\n\n  uniform sampler2D textureSampler;\n  uniform float brightness;\n  uniform float exposure;\n  uniform float contrast;\n  uniform float shadows;\n  uniform float highlights;\n  uniform float saturation;\n  uniform float warmth;\n  uniform float tint;\n\n  vec3 adjustBrightness(vec3 color, float brightness) {\n    return color + brightness;\n  }\n\n  vec3 adjustExposure(vec3 color, float exposure) {\n    return color * pow(2.0, exposure);\n  }\n\n  vec3 adjustContrast(vec3 color, float contrast) {\n    return 0.5 + (contrast + 1.0) * (color.rgb - 0.5);\n  }\n\n  vec3 adjustSaturation(vec3 color, float saturation) {\n    // WCAG 2.1 relative luminance base\n    const vec3 luminanceWeighting = vec3(0.2126, 0.7152, 0.0722);\n    vec3 grayscaleColor = vec3(dot(color, luminanceWeighting));\n    return mix(grayscaleColor, color, 1.0 + saturation);\n  }\n\n  vec3 adjustTempTint(vec3 color, float warmth, float tint) {\n    const vec3 warmFilter = vec3(0.93, 0.54, 0.0);\n    const mat3 RGBtoYIQ = mat3(0.299, 0.587, 0.114, 0.596, -0.274, -0.322, 0.212, -0.523, 0.311);\n    const mat3 YIQtoRGB = mat3(1.0, 0.956, 0.621, 1.0, -0.272, -0.647, 1.0, -1.105, 1.702);\n\n    // adjusting tint\n    vec3 yiq = RGBtoYIQ * color;\n    yiq.b = clamp(yiq.b + tint*0.5226*0.1, -0.5226, 0.5226);\n    vec3 rgb = YIQtoRGB * yiq;\n\n    // adjusting warmth\n    vec3 processed = vec3(\n      (rgb.r < 0.5 ? (2.0 * rgb.r * warmFilter.r) : (1.0 - 2.0 * (1.0 - rgb.r) * (1.0 - warmFilter.r))),\n      (rgb.g < 0.5 ? (2.0 * rgb.g * warmFilter.g) : (1.0 - 2.0 * (1.0 - rgb.g) * (1.0 - warmFilter.g))),\n      (rgb.b < 0.5 ? (2.0 * rgb.b * warmFilter.b) : (1.0 - 2.0 * (1.0 - rgb.b) * (1.0 - warmFilter.b)))\n    );\n    return mix(rgb, processed, warmth);\n  }\n\n  vec3 adjustShadowsHighlights(vec3 color, float shadows, float highlights) {\n    const vec3 luminanceWeighting = vec3(0.3, 0.3, 0.3);\n    mediump float luminance = dot(color, luminanceWeighting);\n\n    mediump float shadow = clamp((pow(luminance, 1.0/(shadows+1.0)) + (-0.76)*pow(luminance, 2.0/(shadows+1.0))) - luminance, 0.0, 1.0);\n    mediump float highlight = clamp((1.0 - (pow(1.0-luminance, 1.0/(1.0-highlights)) + (-0.8)*pow(1.0-luminance, 2.0/(1.0-highlights)))) - luminance, -1.0, 0.0);\n    lowp vec3 result = vec3(0.0, 0.0, 0.0) + ((luminance + shadow + highlight) - 0.0) * ((color - vec3(0.0, 0.0, 0.0))/(luminance - 0.0));\n\n    return result;\n  }\n\n  void main() {\n    vec4 color = texture2D(textureSampler, texCoords);\n    \n    color.rgb = adjustShadowsHighlights(color.rgb, shadows, highlights);\n    color.rgb = adjustExposure(color.rgb, exposure);\n    color.rgb = adjustBrightness(color.rgb, brightness);\n    color.rgb = adjustContrast(color.rgb, contrast);\n    color.rgb = adjustTempTint(color.rgb, warmth, tint);\n    color.rgb = adjustSaturation(color.rgb, saturation);\n\n    gl_FragColor = color;\n  }\n")]);this.useProgram(r),this.getUniforms()}return Object(l.a)(e,[{key:"createProgram",value:function(e){var t=this.context,n=t.createProgram();return e.forEach((function(e){return t.attachShader(n,e)})),t.linkProgram(n),n}},{key:"useProgram",value:function(e){this.context.useProgram(e),this.currentProgram=e}},{key:"clearCanvas",value:function(){var e=this.context;e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT)}},{key:"getUniforms",value:function(){var e=this.context;this.programUniformLocations=new Map;for(var t=e.getProgramParameter(this.currentProgram,e.ACTIVE_UNIFORMS),n=0;n<t;n++){var r=e.getActiveUniform(this.currentProgram,n);if(null===r)throw new Error("Couldn't get uniform at index: ".concat(n,"."));var a=e.getUniformLocation(this.currentProgram,r.name);a&&this.programUniformLocations.set(r.name,{type:r.type,location:a})}}},{key:"setUniform",value:function(e,t){var n=this.context;if(this.programUniformLocations.has(e)){var r=this.programUniformLocations.get(e);switch(r.type){case n.FLOAT:if("number"!==typeof t){f(e,t);break}n.uniform1fv(r.location,[t]);break;case n.FLOAT_VEC2:if(!(t instanceof Float32Array)){m(e,t);break}n.uniform2fv(r.location,t);break;case n.FLOAT_VEC3:if(!(t instanceof Float32Array)){m(e,t);break}n.uniform3fv(r.location,t);break;case n.FLOAT_VEC4:if(!(t instanceof Float32Array)){m(e,t);break}n.uniform4fv(r.location,t);break;case n.BOOL:case n.INT:if("number"!==typeof t){f(e,t);break}n.uniform1iv(r.location,[t]);break;case n.BOOL_VEC2:case n.INT_VEC2:if(!(t instanceof Int32Array)){h(e,t);break}n.uniform2iv(r.location,t);break;case n.BOOL_VEC3:case n.INT_VEC3:if(!(t instanceof Int32Array)){h(e,t);break}n.uniform3iv(r.location,t);break;case n.BOOL_VEC4:case n.INT_VEC4:if(!(t instanceof Int32Array)){h(e,t);break}n.uniform4iv(r.location,t);break;default:!function(e){console.warn("Couldn't set uniform. The type for ".concat(e," could not be determined"))}(e)}}else!function(e){console.warn("Couldn't set uniform. The uniform ".concat(e," does not exist"))}(e)}},{key:"setTexture",value:function(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=this.context,a=n.interpolationMode,i=void 0===a?"Linear":a;switch(i){case"Nearest":t=r.NEAREST;break;case"Linear":default:t=r.LINEAR}var o=r.createTexture();r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,o),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,e),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,t),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,t),this.state="Ready"}},{key:"draw",value:function(e){var t=this.context;if("Ready"!==this.state)throw new Error("Iris Failed to render. setImageData() has not been called.");this.canvas.width=e.width*e.pixelRatio,this.canvas.height=e.height*e.pixelRatio,this.canvas.style.width="".concat(e.width,"px"),this.canvas.style.height="".concat(e.height,"px"),t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight);var n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,g,t.STATIC_DRAW);var r=t.getAttribLocation(this.currentProgram,"position");t.vertexAttribPointer(r,2,t.FLOAT,!1,0,0),t.enableVertexAttribArray(r),this.setUniform("brightness",e.adjustments.brightness),this.setUniform("exposure",e.adjustments.exposure),this.setUniform("contrast",e.adjustments.contrast),this.setUniform("highlights",e.adjustments.highlights),this.setUniform("shadows",e.adjustments.shadows),this.setUniform("saturation",e.adjustments.saturation),this.setUniform("warmth",e.adjustments.warmth),this.setUniform("tint",e.adjustments.tint),t.drawArrays(t.TRIANGLES,0,6)}},{key:"getImageDataFromCanvas",value:function(){var e=this.context,t=new Uint8ClampedArray(e.drawingBufferWidth*e.drawingBufferHeight*4);return this.context.readPixels(0,0,e.drawingBufferWidth,e.drawingBufferHeight,e.RGBA,e.UNSIGNED_BYTE,t),new ImageData(t,e.drawingBufferWidth,e.drawingBufferHeight)}},{key:"getState",value:function(){return this.state}},{key:"setImage",value:function(e){this.setTexture(e)}},{key:"render",value:function(e){return this.draw(e),this.getImageDataFromCanvas()}}]),e}(),p={brightness:{min:-1,max:1,default:0},exposure:{min:-1,max:1,default:0},contrast:{min:-1,max:1,default:0},highlights:{min:-1,max:0,default:0},shadows:{min:0,max:1,default:0},warmth:{min:-1,max:1,default:0},tint:{min:-1,max:1,default:0},saturation:{min:-1,max:1,default:0},sharpness:{min:-1,max:1,default:0},grain:{min:0,max:1,default:0},vignette:{min:0,max:1,default:0}},j=function(){var e={};return Object.keys(p).forEach((function(t){e[t]=p[t].default})),e}();!function(e){e[e["0deg"]=0]="0deg",e[e["90deg"]=90]="90deg",e[e["180deg"]=180]="180deg",e[e["270deg"]=270]="270deg"}(b||(b={}));var O={rotation:b["0deg"],adjust:0,cx:.5,cy:.5,dx:1,dy:1},x=function(){function e(t){Object(u.a)(this,e),this.inputDimensions={width:0,height:0},this.adjustmentParams=j,this.cropParams=O,this.canvasRenderer=new v(t)}return Object(l.a)(e,[{key:"getOutputDimensions",value:function(){if(void 0===this.maxOutputDimensions)return this.inputDimensions;var e=this.maxOutputDimensions.height/this.inputDimensions.height,t=this.maxOutputDimensions.width/this.inputDimensions.width,n=Math.min(1,e,t);return{width:this.inputDimensions.width*n,height:this.inputDimensions.height*n}}},{key:"getOutputPixelRatio",value:function(){var e;return(null===(e=this.maxOutputDimensions)||void 0===e?void 0:e.pixelRatio)||1}},{key:"setImage",value:function(e){e instanceof ImageData&&(this.inputDimensions={width:e.width,height:e.height}),e instanceof HTMLImageElement&&(this.inputDimensions={width:e.naturalWidth,height:e.naturalHeight}),this.canvasRenderer.setImage(e)}},{key:"getState",value:function(){return this.canvasRenderer.getState()}},{key:"setMaxOutputDimensions",value:function(e,t){this.maxOutputDimensions=Object.assign(Object.assign({},e),{pixelRatio:t||1})}},{key:"setAdjustments",value:function(e){this.adjustmentParams=e}},{key:"getAdjustments",value:function(){return Object.assign({},this.adjustmentParams)}},{key:"resetAdjustments",value:function(){this.setAdjustments(j)}},{key:"setAdjustmentValue",value:function(e,t){this.adjustmentParams[e]=t}},{key:"getAdjustmentValue",value:function(e){return this.adjustmentParams[e]}},{key:"render",value:function(){return this.canvasRenderer.render(Object.assign(Object.assign({},this.getOutputDimensions()),{pixelRatio:this.getOutputPixelRatio(),adjustments:this.adjustmentParams}))}}]),e}(),w=Object(s.createContext)(void 0),y=w.Provider,k=(w.Consumer,function(){var e=Object(s.useRef)(),t=Object(s.useRef)(!1),n=Object(s.useState)(j),r=Object(c.a)(n,2),a=r[0],i=r[1],u=function(e){var t=Object(s.useState)(),n=Object(c.a)(t,2),r=n[0],a=n[1];return Object(s.useEffect)((function(){var t=document.createElement("img");t.crossOrigin="Anonymous",t.src=e,t.addEventListener("load",(function(){a(t)}))}),[e,a]),r}("/jag.jpg");Object(s.useEffect)((function(){void 0!==u&&Object.getOwnPropertySymbols(e.current).forEach((function(t){var n=e.current[t];n.setImage(u),n.render()}))}),[u,e.current]);var l=Object(s.useCallback)((function(t){var n=t.maxDimensions,r=t.pixelRatio,i=Symbol(),c=new x(t.canvas);return c.setAdjustments(a),void 0!==n&&c.setMaxOutputDimensions(n,r),e.current=Object.assign(Object.assign({},e.current),Object(o.a)({},i,c)),[c,i]}),[e,a]),d=Object(s.useCallback)((function(t){var n=Object.assign({},e.current);delete n[t],e.current=n}),[e]),f=Object(s.useCallback)((function(){Object.getOwnPropertySymbols(e.current).forEach((function(t){var n=e.current[t];"Ready"===n.getState()&&n.render()}))}),[e]),m=Object(s.useCallback)((function(){t.current||requestAnimationFrame((function(){f(),t.current=!1}))}),[t]),h=Object(s.useCallback)((function(t){Object.getOwnPropertySymbols(e.current).forEach((function(n){e.current[n].setAdjustments(t)}))}),[e]),b=Object(s.useCallback)((function(e){i(e),h(e),m()}),[]);return{_previewIrisInstances:e,createPreviewInstance:l,destroyPreviewInstance:d,adjustments:a,setAdjustments:b}}),E=function(){var e=Object(s.useContext)(w);if(!e)throw new Error("Iris context accessed outside of a valid IrisProvider");return e},C=function(e){var t=function(){var e=E();return[e.adjustments,e.setAdjustments]}(),n=Object(c.a)(t,2),r=n[0],a=n[1],i=p[e],u=i.min,l=i.max,d=Object(s.useCallback)((function(t){a(Object.assign(Object.assign({},r),Object(o.a)({},e,t)))}),[r,e]);return[r[e],d,u,l]},R=n(1);var I={name:"jfeklx",styles:'body{background-color:#111111;color:#ffffff;margin:0;font-family:"Saira",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}button{color:inherit;font-family:inherit;font-weight:inherit;}'},T=n(3),A=n(4);var S={name:"1suqald",styles:'display:flex;overflow-x:scroll;overflow-y:hidden;padding-top:30px;padding-bottom:37px;&:before,&:after{content:"";display:block;flex:0 0 calc(50% - 1px);}'},P={name:"1e6mbb7",styles:"color:#61c781;font-size:12px;font-weight:regular;text-align:center;text-overflow:visible;text-transform:uppercase;text-align:center;width:4em;pointer-events:none"},D={name:"ktlwz0",styles:"background:#61c781;position:absolute;left:50%;transform:translateX(-2px);top:18px;bottom:0;border-left:1px solid #232323;border-right:1px solid #232323;width:1px"},F={name:"1cw62z7",styles:"position:absolute;left:50%;transform:translateX(-50%);height:45px"},L={name:"13urkon",styles:'position:relative;width:100%;&:before{content:"";pointer-events:none;position:absolute;top:0;right:0;bottom:0;left:0;background:linear-gradient(\n              90deg,\n              rgba(35, 35, 35, 1),\n              rgba(35, 35, 35, 0) 20%,\n              rgba(35, 35, 35, 0) 80%,\n              rgba(35, 35, 35, 1)\n            );}'},_=function(e){var t=e.min,n=e.max,r=e.value,a=e.onChange,i=Object(A.a)(e,["min","max","value","onChange"]),o=Object(s.useState)(r),u=Object(c.a)(o,2),l=u[0],d=u[1],f=Object(s.useRef)(0),m=Object(s.useRef)(null),h=Object(s.useRef)(null),b=Object(s.useMemo)((function(){return Math.round(100*l)}),[l]),g=Object(s.useMemo)((function(){return n+-t}),[n,t]),v=Object(s.useCallback)((function(){var e,t;if(h.current){var n=null!==(e=null===(t=window)||void 0===t?void 0:t.devicePixelRatio)&&void 0!==e?e:1,r=h.current,a=r.getContext("2d"),i=r.clientWidth*n*(g/2),o=r.clientHeight*n,c=20*g,s=(i-n)/c;if(r.width=i,r.height=o,f.current=r.clientWidth,a){a.clearRect(0,0,i,o),a.lineWidth=.8*n;for(var u=0;u<=c;u++){var l=Math.floor(u*s)+n/2;a.beginPath(),a.strokeStyle=u%10===0?"#fff":"#5c5c5c",a.moveTo(l,0),a.lineTo(l,o),a.stroke(),a.closePath()}}}}),[g]),p=Object(s.useCallback)((function(e){var n=e.currentTarget.scrollLeft/f.current*g+t;d(n),void 0!==a&&a(n)}),[t,g,a]);return Object(s.useLayoutEffect)((function(){v()}),[v]),Object(s.useEffect)((function(){if(m.current){var e=m.current;return e.addEventListener("scroll",p,{passive:!0}),function(){e.removeEventListener("scroll",p)}}}),[p]),Object(s.useEffect)((function(){if(m.current){var e=m.current,n=(l-t)/g*f.current;e.scrollLeft=n}}),[l,g,t]),Object(s.useEffect)((function(){l!==r&&d(r)}),[r]),Object(R.c)(s.Fragment,null,Object(R.c)("div",Object(T.a)({css:L},i),Object(R.c)("div",{css:F},Object(R.c)("div",{css:D}),Object(R.c)("div",{css:P},b)),Object(R.c)("div",{ref:m,css:S},Object(R.c)("canvas",{ref:h,css:Object(R.b)("flex:0 0 ",50*g,"%;height:15px;","")}))))},U=n(9),B=n(15),W=Object(s.forwardRef)((function(e,t){var n=e.children,r=e.snap,a=void 0===r?"start":r,i=e.paddingX,o=void 0===i?"24px":i,u=e.paddingY,l=void 0===u?"24px":u,d=e.gap,f=void 0===d?"24px":d,m=e.snapSkipConstructors,h=e.focusedItem,b=e.onFocusedItemChange,g=e._highlightIndicator,v=Object(A.a)(e,["children","snap","paddingX","paddingY","gap","snapSkipConstructors","focusedItem","onFocusedItemChange","_highlightIndicator"]),p=Object(s.useRef)(null),j=Object(s.useRef)(!1),O=Object(s.useState)(h),x=Object(c.a)(O,2),w=x[0],y=x[1],k=Object(s.useMemo)((function(){return n instanceof Array?Object(U.a)(n):[n]}),[n]),E=Object(s.useMemo)((function(){return k.map((function(e,t){return(null===m||void 0===m?void 0:m.some((function(t){return t===e.type})))?t:void 0})).filter(Number)}),[k,m]);Object(s.useEffect)((function(){if(void 0!==h&&h!==w&&null!==p.current){j.current=!0,setTimeout((function(){j.current=!1}),1500);var e=h+k.slice(0,h).filter((function(e,t){return E.some((function(e){return e===t}))})).length,t=p.current.children[e];void 0!==t&&(p.current.scrollLeft="center"===a?t.offsetLeft+t.clientWidth/2-p.current.clientWidth/2:t.offsetLeft)}}),[h,k,m]);var C=Object(s.useCallback)((function(e){var t=e.currentTarget,n=t.scrollLeft+t.clientWidth/2,r=t.children,a=0,i=-1;Object(U.a)(r).filter((function(e,t){return!E.some((function(e){return e===t}))})).splice(0,r.length-1).forEach((function(e,t){var r=e,o=r.offsetLeft+r.clientWidth/2,c=Math.abs(n-o);(-1===i||c<i)&&(a=t,i=c)})),a!==w&&(y(a),navigator.vibrate(10),void 0===b||j.current||b(a))}),[E,w,b,j]);return Object(s.useLayoutEffect)((function(){var e=p.current;if(null!==e)return e.addEventListener("scroll",C,{passive:!0}),function(){e.removeEventListener("scroll",C)}}),[C]),Object(R.c)(s.Fragment,null,Object(R.c)("ul",Object(T.a)({css:Object(R.b)("scroll-behavior:smooth;list-style:none;padding:0;display:flex;justify-content:start;margin:0;overflow-x:scroll;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-padding:","center"!==a?o:null,';&:before,&:after{content:"";display:block;flex:0 0 ',o,";}",""),ref:Object(B.a)([p,t])},v),k.map((function(e,t){var n=null===m||void 0===m?void 0:m.some((function(t){return t===e.type}));return Object(R.c)("li",{key:t,role:n?"presentation":"",css:Object(R.b)("flex:0 0 auto;margin-right:",f,";margin-top:",l,";margin-bottom:",l,";scroll-snap-align:",n?null:a,";&:last-child{margin-right:0;}","")},Object(s.cloneElement)(e))})),void 0!==g?Object(R.c)("li",null,g):null))}));var M={name:"1dboj4j",styles:"background-color:#313131;border-radius:100px;height:36px;min-width:36px;position:absolute;top:22px"},V=function(e){return Object(R.c)("div",Object(T.a)({css:M},e))},N={name:"bjn8wh",styles:"position:relative"},G=function(e){var t=e.onTabChange,n=e.children,r=Object(s.useRef)(null),a=Object(s.useState)({width:0,left:0}),i=Object(c.a)(a,2),o=i[0],u=i[1],l=Object(s.useMemo)((function(){var e=n.findIndex((function(e){return e.props.selected}));return-1!==e?e:0}),[n]);return Object(s.useEffect)((function(){if(null!==r.current){var e=r.current.children[l];u({width:e.clientWidth,left:e.offsetLeft})}}),[l]),Object(R.c)("div",null,Object(R.c)(W,{paddingX:"50%",snap:"center",snapSkipConstructors:[V],ref:r,focusedItem:l,onFocusedItemChange:t,_highlightIndicator:Object(R.c)(V,{css:Object(R.b)("width:",o.width,"px;left:",o.left,"px;transition:width linear 0.2s,left linear 0.2s;","")}),css:N},s.Children.map(Object(U.a)(n),(function(e,t){return Object(s.cloneElement)(e,{selected:t===l})}))))},X=function(e){var t=e.label,n=e.selected,r=void 0!==n&&n,a=Object(A.a)(e,["label","selected"]);return Object(R.c)("button",Object(T.a)({css:Object(R.b)("background:none;color:",r?"#FFFFFF":"#A7A7A7",";border:none;font-size:14px;text-transform:uppercase;padding:6px 12px;z-index:1;position:relative;","")},a),t)},H=[{label:"Presets"},{label:"Advanced"}],z=function(e){var t=Object(s.useState)(0),n=Object(c.a)(t,2),r=n[0],a=n[1],i=Object(s.useCallback)((function(e){a(e)}),[]);return Object(R.c)("div",null,Object(R.c)(G,{onTabChange:i},H.map((function(e,t){return Object(R.c)(X,{key:t,label:e.label,selected:t===r,onClick:function(){return i(t)}})}))))},Y=function(e){var t=e.icon,n=e.size,r=void 0===n?24:n,a=e.className,i=Object(A.a)(e,["icon","size","className"]);return Object(R.c)("div",Object(T.a)({className:["material-icons",a].join(" "),css:Object(R.b)("font-size:",r,"px;",""),role:"presentation"},i),t)};var q={default:{background:"#313131",icon:"white",label:"white"},active:{background:"#61C781",icon:"#111111",label:"white"},inactive:{background:"transparent",icon:"white",label:"#A7A7A7"}},Q={name:"1qa1o6a",styles:"border:0;background:transparent;display:flex;flex-direction:column;align-items:center;width:56px"},J=function(e){var t=e.label,n=e.icon,r=e.variant,a=void 0===r?"default":r,i=Object(A.a)(e,["label","icon","variant"]),o=q[a];return Object(R.c)("button",Object(T.a)({css:Q},i),Object(R.c)(Y,{icon:n,size:24,css:Object(R.b)("background:",o.background,";color:",o.icon,";border-radius:50%;padding:16px;","")}),Object(R.c)("div",{css:Object(R.b)("color:",o.label,";margin-top:10px;font-size:12px;font-weight:regular;text-align:center;text-overflow:visible;text-transform:uppercase;","")},t))};var K={name:"xk1288",styles:"width:1px;height:36px;margin-block-start:12px;margin-block-end:12px;background:#5c5c5c;border:none"},Z=function(e){return Object(R.c)("hr",{css:K})},$=[{icon:"crop",label:"Crop",index:0,parameter:"crop"},"DIVIDER",{icon:"light_mode",label:"Brightness",index:1,parameter:"brightness"},{icon:"exposure",label:"Exposure",index:2,parameter:"exposure"},{icon:"tonality",label:"Contrast",index:3,parameter:"contrast"},{icon:"hdr_strong",label:"Highlights",index:4,parameter:"highlights"},{icon:"hdr_weak",label:"Shadows",index:5,parameter:"shadows"},"DIVIDER",{icon:"thermostat",label:"Warmth",index:6,parameter:"warmth"},{icon:"colorize",label:"Tint",index:7,parameter:"tint"},{icon:"invert_colors",label:"Saturation",index:8,parameter:"saturation"},"DIVIDER",{icon:"details",label:"Sharpness",index:9,parameter:"sharpness"},{icon:"grain",label:"Grain",index:10,parameter:"grain"},{icon:"vignette",label:"Vignette",index:11,parameter:"vignette"}],ee=$.filter((function(e){return"DIVIDER"!==e})).map((function(e){return e.parameter})),te=function(e){var t=e.selectedParameter,n=e.onClickParameter,r=Object(s.useMemo)((function(){return"none"!==t}),[t]),a=Object(s.useCallback)((function(e){"none"!==t&&n(ee[e]||"none")}),[t,n]);return Object(R.c)(W,{paddingX:"calc(50% - 28px)",snap:r?"center":"none",snapSkipConstructors:[Z],focusedItem:"none"!==t?ee.indexOf(t):void 0,onFocusedItemChange:a},$.map((function(e,r){return"DIVIDER"===e?Object(R.c)(Z,{key:r}):Object(R.c)(J,{key:r,variant:void 0===t?"default":t===e.parameter?"active":"inactive",icon:e.icon,label:e.label,onClick:function(){return n(e.parameter)}})})))};var ne=function(e){var t=C(e.parameter),n=Object(c.a)(t,4),r=n[0],a=n[1],i=n[2],o=n[3];return Object(R.c)(_,{value:r,onChange:a,min:i,max:o})},re={name:"rkxnzy",styles:"background-color:#232323"};a.a.render(Object(R.c)(s.Fragment,null,Object(R.c)((function(){return Object(R.c)(R.a,{styles:I})}),null),Object(R.c)((function(e){var t=k();return Object(i.jsx)(y,Object.assign({value:t},{children:e.children}),void 0)}),null,Object(R.c)("div",{css:{name:"ey8mg8",styles:"height:100vh;display:flex;flex-direction:column"}},Object(R.c)((function(e){var t=E(),n=Object(s.useRef)(),r=Object(s.useRef)();return Object(s.useEffect)((function(){var e=(null===window||void 0===window?void 0:window.devicePixelRatio)||1,a=t.createPreviewInstance({canvas:r.current,pixelRatio:e,maxDimensions:{width:n.current.clientWidth,height:n.current.clientHeight}}),i=Object(c.a)(a,2),o=(i[0],i[1]);return function(){t.destroyPreviewInstance(o)}}),[]),Object(i.jsx)("div",Object.assign({ref:n},e,{children:Object(i.jsx)("canvas",{ref:r},void 0)}),void 0)}),{css:{name:"1xdc0a7",styles:"width:100%;flex:1 1 auto;display:flex;line-height:0;align-items:center;justify-content:center"}}),Object(R.c)((function(e){var t=Object(s.useState)("none"),n=Object(c.a)(t,2),r=n[0],a=n[1];return Object(R.c)("section",Object(T.a)({title:"Editor controls",css:re},e),Object(R.c)(te,{selectedParameter:r,onClickParameter:a}),"none"===r||"crop"===r?Object(R.c)(z,null):Object(R.c)(ne,{parameter:r}))}),{css:{name:"ou8xsw",styles:"flex:0 0 auto"}})))),document.getElementById("root"))}},[[24,1,2]]]);
//# sourceMappingURL=main.90c0a539.chunk.js.map