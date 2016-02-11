!function(e,r){if("object"==typeof exports&&"object"==typeof module)module.exports=r();else if("function"==typeof define&&define.amd)define(r);else{var t=r();for(var n in t)("object"==typeof exports?exports:e)[n]=t[n]}}(this,function(){return function(e){function r(n){if(t[n])return t[n].exports;var o=t[n]={exports:{},id:n,loaded:!1};return e[n].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var t={};return r.m=e,r.c=t,r.p="",r(0)}([function(e,r,t){e.exports=t(1)},function(e,r,t){"use strict";function n(){var e="undefined"==typeof JSON?{}:JSON;o.setupJSON(e)}var o=t(2),i=t(3);n();var a=window._rollbarConfig,s=a&&a.globalAlias||"Rollbar",u=window[s]&&"undefined"!=typeof window[s].shimId;!u&&a?o.wrapper.init(a):(window.Rollbar=o.wrapper,window.RollbarNotifier=i.Notifier),e.exports=o.wrapper},function(e,r,t){"use strict";function n(e){a.setupJSON(e)}function o(e,r,t){!t[4]&&window._rollbarWrappedError&&(t[4]=window._rollbarWrappedError,window._rollbarWrappedError=null),e.uncaughtError.apply(e,t),r&&r.apply(window,t)}function i(e,r){if(r.hasOwnProperty&&r.hasOwnProperty("addEventListener")){var t=r.addEventListener;r.addEventListener=function(r,n,o){t.call(this,r,e.wrap(n),o)};var n=r.removeEventListener;r.removeEventListener=function(e,r,t){n.call(this,e,r&&r._wrapped||r,t)}}}var a=t(3),s=a.Notifier;window._rollbarWrappedError=null;var u={};u.init=function(e,r){var t=new s(r);if(t.configure(e),e.captureUncaught){var n=window.onerror;window.onerror=function(){var e=Array.prototype.slice.call(arguments,0);o(t,n,e)};var a,u,c=["EventTarget","Window","Node","ApplicationCache","AudioTrackList","ChannelMergerNode","CryptoOperation","EventSource","FileReader","HTMLUnknownElement","IDBDatabase","IDBRequest","IDBTransaction","KeyOperation","MediaController","MessagePort","ModalWindow","Notification","SVGElementInstance","Screen","TextTrack","TextTrackCue","TextTrackList","WebSocket","WebSocketWorker","Worker","XMLHttpRequest","XMLHttpRequestEventTarget","XMLHttpRequestUpload"];for(a=0;a<c.length;++a)u=c[a],window[u]&&window[u].prototype&&i(t,window[u].prototype)}return window.Rollbar=t,s.processPayloads(),t},e.exports={wrapper:u,setupJSON:n}},function(e,r,t){"use strict";function n(e){h=e,d.setupJSON(e)}function o(){return w}function i(e){w=w||this;var r=window.location.protocol;0!==r.indexOf("http")&&(r="https:");var t=r+"//"+i.DEFAULT_ENDPOINT;this.options={enabled:!0,endpoint:t,environment:"production",scrubFields:f.copy(i.DEFAULT_SCRUB_FIELDS),checkIgnore:null,logLevel:i.DEFAULT_LOG_LEVEL,reportLevel:i.DEFAULT_REPORT_LEVEL,uncaughtErrorLevel:i.DEFAULT_UNCAUGHT_ERROR_LEVEL,payload:{}},this.lastError=null,this.plugins={},this.parentNotifier=e,this.logger=function(){if(window.console&&"function"==typeof window.console.log){var e=["Rollbar:"].concat(Array.prototype.slice.call(arguments,0));window.console.log(e)}},e&&(e.hasOwnProperty("shimId")?e.notifier=this:(this.logger=e.logger,this.configure(e.options)))}function a(e,r){return function(){var t=r||this;try{return e.apply(t,arguments)}catch(n){t&&t.logger(n)}}}function s(e){if(!e)return["Unknown error. There was no error message to display.",""];var r=e.match(v),t="(unknown)";return r&&(t=r[r.length-1],e=e.replace((r[r.length-2]||"")+t+":",""),e=e.replace(/(^[\s]+|[\s]+$)/g,"")),[t,e]}function u(){m||(m=setTimeout(c,1e3))}function c(){var e;try{for(;e=window._rollbarPayloadQueue.shift();)l(e.endpointUrl,e.accessToken,e.payload,e.callback)}finally{m=void 0}}function l(e,r,t,n){n=n||function(){};var o=(new Date).getTime();o-y>=6e4&&(y=o,_=0);var i=window._globalRollbarOptions.maxItems,a=window._globalRollbarOptions.itemsPerMinute,s=function(){return!t.ignoreRateLimit&&i>=1&&b>=i},u=function(){return!t.ignoreRateLimit&&a>=1&&_>=a};return s()?void n(new Error(i+" max items reached")):u()?void n(new Error(a+" items per minute reached")):(b++,_++,s()&&w._log(w.options.uncaughtErrorLevel,"maxItems has been hit. Ignoring errors for the remainder of the current page load.",null,{maxItems:i},null,!1,!0),t.ignoreRateLimit&&delete t.ignoreRateLimit,void g.post(e,r,t,function(e,r){return e?n(e):n(null,r)}))}var p=t(4),f=t(5),d=t(6),g=d.XHR,h=null;i.NOTIFIER_VERSION="1.3.0",i.DEFAULT_ENDPOINT="api.rollbar.com/api/1/",i.DEFAULT_SCRUB_FIELDS=["pw","pass","passwd","password","secret","confirm_password","confirmPassword","password_confirmation","passwordConfirmation","access_token","accessToken","secret_key","secretKey","secretToken"],i.DEFAULT_LOG_LEVEL="debug",i.DEFAULT_REPORT_LEVEL="debug",i.DEFAULT_UNCAUGHT_ERROR_LEVEL="warning",i.DEFAULT_ITEMS_PER_MIN=60,i.DEFAULT_MAX_ITEMS=0,i.LEVELS={debug:0,info:1,warning:2,error:3,critical:4},window._rollbarPayloadQueue=[],window._globalRollbarOptions={startTime:(new Date).getTime(),maxItems:i.DEFAULT_MAX_ITEMS,itemsPerMinute:i.DEFAULT_ITEMS_PER_MIN};var w;i._generateLogFn=function(e){return a(function(){var r=this._getLogArgs(arguments);return this._log(e||r.level||this.options.logLevel||i.DEFAULT_LOG_LEVEL,r.message,r.err,r.custom,r.callback)})},i.prototype._getLogArgs=function(e){for(var r,t,n,o,s,u,c,l=this.options.logLevel||i.DEFAULT_LOG_LEVEL,p=0;p<e.length;++p)c=e[p],u=typeof c,"string"===u?t=c:"function"===u?s=a(c,this):c&&"object"===u&&("Date"===c.constructor.name?r=c:c instanceof Error||c.prototype===Error.prototype||c.hasOwnProperty("stack")||"undefined"!=typeof DOMException&&c instanceof DOMException?n=c:o=c);return{level:l,message:t,err:n,custom:o,callback:s}},i.prototype._route=function(e){var r=this.options.endpoint,t=/\/$/.test(r),n=/^\//.test(e);return t&&n?e=e.substring(1):t||n||(e="/"+e),r+e},i.prototype._processShimQueue=function(e){for(var r,t,n,o,a,s,u,c={};t=e.shift();)r=t.shim,n=t.method,o=t.args,a=r.parentShim,u=c[r.shimId],u||(a?(s=c[a.shimId],u=new i(s)):u=this,c[r.shimId]=u),u[n]&&"function"==typeof u[n]&&u[n].apply(u,o)},i.prototype._buildPayload=function(e,r,t,n,o){var a=this.options.accessToken,s=this.options.environment,u=f.copy(this.options.payload),c=f.uuid4();if(void 0===i.LEVELS[r])throw new Error("Invalid level");if(!t&&!n&&!o)throw new Error("No message, stack info or custom data");var l={environment:s,endpoint:this.options.endpoint,uuid:c,level:r,platform:"browser",framework:"browser-js",language:"javascript",body:this._buildBody(t,n,o),request:{url:window.location.href,query_string:window.location.search,user_ip:"$remote_ip"},client:{runtime_ms:e.getTime()-window._globalRollbarOptions.startTime,timestamp:Math.round(e.getTime()/1e3),javascript:{browser:window.navigator.userAgent,language:window.navigator.language,cookie_enabled:window.navigator.cookieEnabled,screen:{width:window.screen.width,height:window.screen.height},plugins:this._getBrowserPlugins()}},server:{},notifier:{name:"rollbar-browser-js",version:i.NOTIFIER_VERSION}};u.body&&delete u.body;var p={access_token:a,data:f.merge(l,u)};return this._scrub(p.data),p},i.prototype._buildBody=function(e,r,t){var n;return n=r?this._buildPayloadBodyTrace(e,r,t):this._buildPayloadBodyMessage(e,t)},i.prototype._buildPayloadBodyMessage=function(e,r){e||(e=r?h.stringify(r):"");var t={body:e};return r&&(t.extra=f.copy(r)),{message:t}},i.prototype._buildPayloadBodyTrace=function(e,r,t){var n=s(r.message),o=r.name||n[0],i=n[1],a={exception:{"class":o,message:i}};if(e&&(a.exception.description=e||"uncaught exception"),r.stack){var u,c,l,p,d,g,h,w;for(a.frames=[],h=0;h<r.stack.length;++h)u=r.stack[h],c={filename:u.url?f.sanitizeUrl(u.url):"(unknown)",lineno:u.line||null,method:u.func&&"?"!==u.func?u.func:"[anonymous]",colno:u.column},l=p=d=null,g=u.context?u.context.length:0,g&&(w=Math.floor(g/2),p=u.context.slice(0,w),l=u.context[w],d=u.context.slice(w)),l&&(c.code=l),(p||d)&&(c.context={},p&&p.length&&(c.context.pre=p),d&&d.length&&(c.context.post=d)),u.args&&(c.args=u.args),a.frames.push(c);return a.frames.reverse(),t&&(a.extra=f.copy(t)),{trace:a}}return this._buildPayloadBodyMessage(o+": "+i,t)},i.prototype._getBrowserPlugins=function(){if(!this._browserPlugins){var e,r,t=window.navigator.plugins||[],n=t.length,o=[];for(r=0;n>r;++r)e=t[r],o.push({name:e.name,description:e.description});this._browserPlugins=o}return this._browserPlugins},i.prototype._scrub=function(e){function r(e,r,t,n,o,i,a,s){return r+f.redact(i)}function t(e){var t;if("string"==typeof e)for(t=0;t<s.length;++t)e=e.replace(s[t],r);return e}function n(e,r){var t;for(t=0;t<a.length;++t)if(a[t].test(e)){r=f.redact(r);break}return r}function o(e,r){var o=n(e,r);return o===r?t(o):o}var i=this.options.scrubFields,a=this._getScrubFieldRegexs(i),s=this._getScrubQueryParamRegexs(i);return f.traverse(e,o),e},i.prototype._getScrubFieldRegexs=function(e){for(var r,t=[],n=0;n<e.length;++n)r="\\[?(%5[bB])?"+e[n]+"\\[?(%5[bB])?\\]?(%5[dD])?",t.push(new RegExp(r,"i"));return t},i.prototype._getScrubQueryParamRegexs=function(e){for(var r,t=[],n=0;n<e.length;++n)r="\\[?(%5[bB])?"+e[n]+"\\[?(%5[bB])?\\]?(%5[dD])?",t.push(new RegExp("("+r+"=)([^&\\n]+)","igm"));return t},i.prototype._urlIsWhitelisted=function(e){var r,t,n,o,i,a,s,u,c,l;try{if(r=this.options.hostWhiteList,t=e.data.body.trace,!r||0===r.length)return!0;if(!t)return!0;for(s=r.length,i=t.frames.length,c=0;i>c;c++){if(n=t.frames[c],o=n.filename,"string"!=typeof o)return!0;for(l=0;s>l;l++)if(a=r[l],u=new RegExp(a),u.test(o))return!0}}catch(p){return this.configure({hostWhiteList:null}),this.error("Error while reading your configuration's hostWhiteList option. Removing custom hostWhiteList.",p),!0}return!1},i.prototype._messageIsIgnored=function(e){var r,t,n,o,i,a,s;try{if(i=!1,n=this.options.ignoredMessages,s=e.data.body.trace,!n||0===n.length)return!1;if(!s)return!1;for(r=s.exception.message,o=n.length,t=0;o>t&&(a=new RegExp(n[t],"gi"),!(i=a.test(r)));t++);}catch(u){this.configure({ignoredMessages:null}),this.error("Error while reading your configuration's ignoredMessages option. Removing custom ignoredMessages.")}return i},i.prototype._enqueuePayload=function(e,r,t,n){var o={callback:n,accessToken:this.options.accessToken,endpointUrl:this._route("item/"),payload:e},i=function(){if(n){var e="This item was not sent to Rollbar because it was ignored. This can happen if a custom checkIgnore() function was used or if the item's level was less than the notifier' reportLevel. See https://rollbar.com/docs/notifier/rollbar.js/configuration for more details.";n(null,{err:0,result:{id:null,uuid:null,message:e}})}};if(this._internalCheckIgnore(r,t,e))return void i();try{if(this.options.checkIgnore&&"function"==typeof this.options.checkIgnore&&this.options.checkIgnore(r,t,e))return void i()}catch(a){this.configure({checkIgnore:null}),this.error("Error while calling custom checkIgnore() function. Removing custom checkIgnore().",a)}if(this._urlIsWhitelisted(e)&&!this._messageIsIgnored(e)){if(this.options.verbose){if(e.data&&e.data.body&&e.data.body.trace){var s=e.data.body.trace,c=s.exception.message;this.logger(c)}this.logger("Sending payload -",o)}"function"==typeof this.options.logFunction&&this.options.logFunction(o);try{"function"==typeof this.options.transform&&this.options.transform(e)}catch(a){this.configure({transform:null}),this.error("Error while calling custom transform() function. Removing custom transform().",a)}this.options.enabled&&(window._rollbarPayloadQueue.push(o),u())}},i.prototype._internalCheckIgnore=function(e,r,t){var n=r[0],o=i.LEVELS[n]||0,a=i.LEVELS[this.options.reportLevel]||0;if(a>o)return!0;var s=this.options?this.options.plugins:{};return s&&s.jquery&&s.jquery.ignoreAjaxErrors&&t.body.message?t.body.messagejquery_ajax_error:!1},i.prototype._log=function(e,r,t,n,o,i,a){var s=null;if(t){if(s=t._savedStackTrace?t._savedStackTrace:p.parse(t),t===this.lastError)return;this.lastError=t}var u=this._buildPayload(new Date,e,r,s,n);a&&(u.ignoreRateLimit=!0),this._enqueuePayload(u,i?!0:!1,[e,r,t,n],o)},i.prototype.log=i._generateLogFn(),i.prototype.debug=i._generateLogFn("debug"),i.prototype.info=i._generateLogFn("info"),i.prototype.warn=i._generateLogFn("warning"),i.prototype.warning=i._generateLogFn("warning"),i.prototype.error=i._generateLogFn("error"),i.prototype.critical=i._generateLogFn("critical"),i.prototype.uncaughtError=a(function(e,r,t,n,o,i){if(i=i||null,o&&o.stack)return void this._log(this.options.uncaughtErrorLevel,e,o,i,null,!0);if(r&&r.stack)return void this._log(this.options.uncaughtErrorLevel,e,r,i,null,!0);var a={url:r||"",line:t};a.func=p.guessFunctionName(a.url,a.line),a.context=p.gatherContext(a.url,a.line);var s={mode:"onerror",message:e||"uncaught exception",url:document.location.href,stack:[a],useragent:navigator.userAgent};o&&(s=o._savedStackTrace||p.parse(o));var u=this._buildPayload(new Date,this.options.uncaughtErrorLevel,e,s);this._enqueuePayload(u,!0,[this.options.uncaughtErrorLevel,e,r,t,n,o])}),i.prototype.global=a(function(e){e=e||{},f.merge(window._globalRollbarOptions,e),void 0!==e.maxItems&&(b=0),void 0!==e.itemsPerMinute&&(_=0)}),i.prototype.configure=a(function(e){f.merge(this.options,e),this.global(e)}),i.prototype.scope=a(function(e){var r=new i(this);return f.merge(r.options.payload,e),r}),i.prototype.wrap=function(e,r){var t;if(t="function"==typeof r?r:function(){return r||{}},"function"!=typeof e)return e;if(e._isWrap)return e;if(!e._wrapped){e._wrapped=function(){try{return e.apply(this,arguments)}catch(r){throw r.stack||(r._savedStackTrace=p.parse(r)),r._rollbarContext=t()||{},r._rollbarContext._wrappedSource=e.toString(),window._rollbarWrappedError=r,r}},e._wrapped._isWrap=!0;for(var n in e)e.hasOwnProperty(n)&&(e._wrapped[n]=e[n])}return e._wrapped};var m,v=new RegExp("^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ");i.processPayloads=function(e){return e?void c():void u()};var y=(new Date).getTime(),b=0,_=0;e.exports={Notifier:i,setupJSON:n,topLevelNotifier:o}},function(e,r,t){"use strict";function n(e,r){return c}function o(e,r){return null}function i(e){var r={};return r._stackFrame=e,r.url=e.fileName,r.line=e.lineNumber,r.func=e.functionName,r.column=e.columnNumber,r.args=e.args,r.context=o(r.url,r.line),r}function a(e){function r(){var r=[];try{r=u.parse(e)}catch(t){r=[]}for(var n=[],o=0;o<r.length;o++)n.push(new i(r[o]));return n}return{stack:r(),message:e.message,name:e.name}}function s(e){return new a(e)}var u=t(7),c="?";e.exports={guessFunctionName:n,gatherContext:o,parse:s,Stack:a,Frame:i}},function(e,r,t){"use strict";var n={merge:function(){var e,r,t,o,i,a,s=arguments[0]||{},u=1,c=arguments.length,l=!0;for("object"!=typeof s&&"function"!=typeof s&&(s={});c>u;u++)if(null!==(e=arguments[u]))for(r in e)e.hasOwnProperty(r)&&(t=s[r],o=e[r],s!==o&&(l&&o&&(o.constructor===Object||(i=o.constructor===Array))?(i?(i=!1,a=[]):a=t&&t.constructor===Object?t:{},s[r]=n.merge(a,o)):void 0!==o&&(s[r]=o)));return s},copy:function(e){var r;return"object"==typeof e&&(e.constructor===Object?r={}:e.constructor===Array&&(r=[])),n.merge(r,e),r},parseUriOptions:{strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},parseUri:function(e){if(!e||"string"!=typeof e&&!(e instanceof String))throw new Error("Util.parseUri() received invalid input");for(var r=n.parseUriOptions,t=r.parser[r.strictMode?"strict":"loose"].exec(e),o={},i=14;i--;)o[r.key[i]]=t[i]||"";return o[r.q.name]={},o[r.key[12]].replace(r.q.parser,function(e,t,n){t&&(o[r.q.name][t]=n)}),o},sanitizeUrl:function(e){if(!e||"string"!=typeof e&&!(e instanceof String))throw new Error("Util.sanitizeUrl() received invalid input");var r=n.parseUri(e);return""===r.anchor&&(r.source=r.source.replace("#","")),e=r.source.replace("?"+r.query,"")},traverse:function(e,r){var t,o,i,a="object"==typeof e,s=[];if(a)if(e.constructor===Object)for(t in e)e.hasOwnProperty(t)&&s.push(t);else if(e.constructor===Array)for(i=0;i<e.length;++i)s.push(i);for(i=0;i<s.length;++i)t=s[i],o=e[t],a="object"==typeof o,a?null===o?e[t]=r(t,o):o.constructor===Object?e[t]=n.traverse(o,r):o.constructor===Array?e[t]=n.traverse(o,r):e[t]=r(t,o):e[t]=r(t,o);return e},redact:function(e){return e=String(e),new Array(e.length+1).join("*")},uuid4:function(){var e=(new Date).getTime(),r="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(r){var t=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"===r?t:7&t|8).toString(16)});return r}};e.exports=n},function(e,r,t){"use strict";function n(e){o=e}var o=null,i={XMLHttpFactories:[function(){return new XMLHttpRequest},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}],createXMLHTTPObject:function(){var e,r=!1,t=i.XMLHttpFactories,n=t.length;for(e=0;n>e;e++)try{r=t[e]();break}catch(o){}return r},post:function(e,r,t,n){if("object"!=typeof t)throw new Error("Expected an object to POST");t=o.stringify(t),n=n||function(){};var a=i.createXMLHTTPObject();if(a)try{try{var s=function(e){try{s&&4===a.readyState&&(s=void 0,200===a.status?n(null,o.parse(a.responseText)):n("number"==typeof a.status&&a.status>=400&&a.status<600?new Error(a.status.toString()):new Error))}catch(r){var t;t="object"==typeof r&&r.stack?r:new Error(r),n(t)}};a.open("POST",e,!0),a.setRequestHeader&&(a.setRequestHeader("Content-Type","application/json"),a.setRequestHeader("X-Rollbar-Access-Token",r)),a.onreadystatechange=s,a.send(t)}catch(u){if("undefined"!=typeof XDomainRequest){var c=function(e){n(new Error)},l=function(e){n(new Error)},p=function(e){n(null,o.parse(a.responseText))};a=new XDomainRequest,a.onprogress=function(){},a.ontimeout=c,a.onerror=l,a.onload=p,a.open("POST",e,!0),a.send(t)}}}catch(f){n(f)}}};e.exports={XHR:i,setupJSON:n}},function(e,r,t){var n,o,i;!function(a,s){"use strict";o=[t(8)],n=s,i="function"==typeof n?n.apply(r,o):n,!(void 0!==i&&(e.exports=i))}(this,function(e){"use strict";var r,t,n=/\S+\:\d+/,o=/\s+at /;return r=Array.prototype.map?function(e,r){return e.map(r)}:function(e,r){var t,n=e.length,o=[];for(t=0;n>t;++t)o.push(r(e[t]));return o},t=Array.prototype.filter?function(e,r){return e.filter(r)}:function(e,r){var t,n=e.length,o=[];for(t=0;n>t;++t)r(e[t])&&o.push(e[t]);return o},{parse:function(e){if("undefined"!=typeof e.stacktrace||"undefined"!=typeof e["opera#sourceloc"])return this.parseOpera(e);if(e.stack&&e.stack.match(o))return this.parseV8OrIE(e);if(e.stack&&e.stack.match(n))return this.parseFFOrSafari(e);throw new Error("Cannot parse given Error object")},extractLocation:function(e){if(-1===e.indexOf(":"))return[e];var r=e.replace(/[\(\)\s]/g,"").split(":"),t=r.pop(),n=r[r.length-1];if(!isNaN(parseFloat(n))&&isFinite(n)){var o=r.pop();return[r.join(":"),o,t]}return[r.join(":"),t,void 0]},parseV8OrIE:function(t){var n=this.extractLocation,o=r(t.stack.split("\n").slice(1),function(r){var t=r.replace(/^\s+/,"").split(/\s+/).slice(1),o=n(t.pop()),i=t[0]&&"Anonymous"!==t[0]?t[0]:void 0;return new e(i,void 0,o[0],o[1],o[2])});return o},parseFFOrSafari:function(o){var i=t(o.stack.split("\n"),function(e){return!!e.match(n)}),a=this.extractLocation,s=r(i,function(r){var t=r.split("@"),n=a(t.pop()),o=t.shift()||void 0;return new e(o,void 0,n[0],n[1],n[2])});return s},parseOpera:function(e){return!e.stacktrace||e.message.indexOf("\n")>-1&&e.message.split("\n").length>e.stacktrace.split("\n").length?this.parseOpera9(e):e.stack?this.parseOpera11(e):this.parseOpera10(e)},parseOpera9:function(r){for(var t=/Line (\d+).*script (?:in )?(\S+)/i,n=r.message.split("\n"),o=[],i=2,a=n.length;a>i;i+=2){var s=t.exec(n[i]);s&&o.push(new e(void 0,void 0,s[2],s[1]))}return o},parseOpera10:function(r){for(var t=/Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i,n=r.stacktrace.split("\n"),o=[],i=0,a=n.length;a>i;i+=2){var s=t.exec(n[i]);s&&o.push(new e(s[3]||void 0,void 0,s[2],s[1]))}return o},parseOpera11:function(o){var i=t(o.stack.split("\n"),function(e){return!!e.match(n)&&!e.match(/^Error created at/)}),a=this.extractLocation,s=r(i,function(r){var t,n=r.split("@"),o=a(n.pop()),i=n.shift()||"",s=i.replace(/<anonymous function(: (\w+))?>/,"$2").replace(/\([^\)]*\)/g,"")||void 0;i.match(/\(([^\)]*)\)/)&&(t=i.replace(/^[^\(]+\(([^\)]*)\)$/,"$1"));var u=void 0===t||"[arguments not available]"===t?void 0:t.split(",");return new e(s,u,o[0],o[1],o[2])});return s}}})},function(e,r,t){var n,o,i;!function(t,a){"use strict";o=[],n=a,i="function"==typeof n?n.apply(r,o):n,!(void 0!==i&&(e.exports=i))}(this,function(){"use strict";function e(e){return!isNaN(parseFloat(e))&&isFinite(e)}function r(e,r,t,n,o){void 0!==e&&this.setFunctionName(e),void 0!==r&&this.setArgs(r),void 0!==t&&this.setFileName(t),void 0!==n&&this.setLineNumber(n),void 0!==o&&this.setColumnNumber(o)}return r.prototype={getFunctionName:function(){return this.functionName},setFunctionName:function(e){this.functionName=String(e)},getArgs:function(){return this.args},setArgs:function(e){if("[object Array]"!==Object.prototype.toString.call(e))throw new TypeError("Args must be an Array");this.args=e},getFileName:function(){return this.fileName},setFileName:function(e){this.fileName=String(e)},getLineNumber:function(){return this.lineNumber},setLineNumber:function(r){if(!e(r))throw new TypeError("Line Number must be a Number");this.lineNumber=Number(r)},getColumnNumber:function(){return this.columnNumber},setColumnNumber:function(r){if(!e(r))throw new TypeError("Column Number must be a Number");this.columnNumber=Number(r)},toString:function(){var r=this.getFunctionName()||"{anonymous}",t="("+(this.getArgs()||[]).join(",")+")",n=this.getFileName()?"@"+this.getFileName():"",o=e(this.getLineNumber())?":"+this.getLineNumber():"",i=e(this.getColumnNumber())?":"+this.getColumnNumber():"";return r+t+n+o+i}},r})}])});