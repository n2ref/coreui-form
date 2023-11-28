(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.CoreUI = global.CoreUI || {}, global.CoreUI.form = factory());
}(this, (function () { 'use strict';

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f();}else if(typeof define==="function"&&define.amd){define([],f);}else{var g;if(typeof window!=="undefined"){g=window;}else if(typeof global!=="undefined"){g=global;}else if(typeof self!=="undefined"){g=self;}else{g=this;}g.ejs=f();}})(function(){return function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t);}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r}()({1:[function(require,module,exports){"use strict";var fs=require("fs");var path=require("path");var utils=require("./utils");var scopeOptionWarned=false;var _VERSION_STRING=require("../package.json").version;var _DEFAULT_OPEN_DELIMITER="<";var _DEFAULT_CLOSE_DELIMITER=">";var _DEFAULT_DELIMITER="%";var _DEFAULT_LOCALS_NAME="locals";var _NAME="ejs";var _REGEX_STRING="(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)";var _OPTS_PASSABLE_WITH_DATA=["delimiter","scope","context","debug","compileDebug","client","_with","rmWhitespace","strict","filename","async"];var _OPTS_PASSABLE_WITH_DATA_EXPRESS=_OPTS_PASSABLE_WITH_DATA.concat("cache");var _BOM=/^\uFEFF/;var _JS_IDENTIFIER=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/;exports.cache=utils.cache;exports.fileLoader=fs.readFileSync;exports.localsName=_DEFAULT_LOCALS_NAME;exports.promiseImpl=new Function("return this;")().Promise;exports.resolveInclude=function(name,filename,isDir){var dirname=path.dirname;var extname=path.extname;var resolve=path.resolve;var includePath=resolve(isDir?filename:dirname(filename),name);var ext=extname(name);if(!ext){includePath+=".ejs";}return includePath};function resolvePaths(name,paths){var filePath;if(paths.some(function(v){filePath=exports.resolveInclude(name,v,true);return fs.existsSync(filePath)})){return filePath}}function getIncludePath(path,options){var includePath;var filePath;var views=options.views;var match=/^[A-Za-z]+:\\|^\//.exec(path);if(match&&match.length){path=path.replace(/^\/*/,"");if(Array.isArray(options.root)){includePath=resolvePaths(path,options.root);}else{includePath=exports.resolveInclude(path,options.root||"/",true);}}else{if(options.filename){filePath=exports.resolveInclude(path,options.filename);if(fs.existsSync(filePath)){includePath=filePath;}}if(!includePath&&Array.isArray(views)){includePath=resolvePaths(path,views);}if(!includePath&&typeof options.includer!=="function"){throw new Error('Could not find the include file "'+options.escapeFunction(path)+'"')}}return includePath}function handleCache(options,template){var func;var filename=options.filename;var hasTemplate=arguments.length>1;if(options.cache){if(!filename){throw new Error("cache option requires a filename")}func=exports.cache.get(filename);if(func){return func}if(!hasTemplate){template=fileLoader(filename).toString().replace(_BOM,"");}}else if(!hasTemplate){if(!filename){throw new Error("Internal EJS error: no file name or template "+"provided")}template=fileLoader(filename).toString().replace(_BOM,"");}func=exports.compile(template,options);if(options.cache){exports.cache.set(filename,func);}return func}function tryHandleCache(options,data,cb){var result;if(!cb){if(typeof exports.promiseImpl=="function"){return new exports.promiseImpl(function(resolve,reject){try{result=handleCache(options)(data);resolve(result);}catch(err){reject(err);}})}else{throw new Error("Please provide a callback function")}}else{try{result=handleCache(options)(data);}catch(err){return cb(err)}cb(null,result);}}function fileLoader(filePath){return exports.fileLoader(filePath)}function includeFile(path,options){var opts=utils.shallowCopy(utils.createNullProtoObjWherePossible(),options);opts.filename=getIncludePath(path,opts);if(typeof options.includer==="function"){var includerResult=options.includer(path,opts.filename);if(includerResult){if(includerResult.filename){opts.filename=includerResult.filename;}if(includerResult.template){return handleCache(opts,includerResult.template)}}}return handleCache(opts)}function rethrow(err,str,flnm,lineno,esc){var lines=str.split("\n");var start=Math.max(lineno-3,0);var end=Math.min(lines.length,lineno+3);var filename=esc(flnm);var context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?" >> ":"    ")+curr+"| "+line}).join("\n");err.path=filename;err.message=(filename||"ejs")+":"+lineno+"\n"+context+"\n\n"+err.message;throw err}function stripSemi(str){return str.replace(/;(\s*$)/,"$1")}exports.compile=function compile(template,opts){var templ;if(opts&&opts.scope){if(!scopeOptionWarned){console.warn("`scope` option is deprecated and will be removed in EJS 3");scopeOptionWarned=true;}if(!opts.context){opts.context=opts.scope;}delete opts.scope;}templ=new Template(template,opts);return templ.compile()};exports.render=function(template,d,o){var data=d||utils.createNullProtoObjWherePossible();var opts=o||utils.createNullProtoObjWherePossible();if(arguments.length==2){utils.shallowCopyFromList(opts,data,_OPTS_PASSABLE_WITH_DATA);}return handleCache(opts,template)(data)};exports.renderFile=function(){var args=Array.prototype.slice.call(arguments);var filename=args.shift();var cb;var opts={filename:filename};var data;var viewOpts;if(typeof arguments[arguments.length-1]=="function"){cb=args.pop();}if(args.length){data=args.shift();if(args.length){utils.shallowCopy(opts,args.pop());}else{if(data.settings){if(data.settings.views){opts.views=data.settings.views;}if(data.settings["view cache"]){opts.cache=true;}viewOpts=data.settings["view options"];if(viewOpts){utils.shallowCopy(opts,viewOpts);}}utils.shallowCopyFromList(opts,data,_OPTS_PASSABLE_WITH_DATA_EXPRESS);}opts.filename=filename;}else{data=utils.createNullProtoObjWherePossible();}return tryHandleCache(opts,data,cb)};exports.Template=Template;exports.clearCache=function(){exports.cache.reset();};function Template(text,opts){opts=opts||utils.createNullProtoObjWherePossible();var options=utils.createNullProtoObjWherePossible();this.templateText=text;this.mode=null;this.truncate=false;this.currentLine=1;this.source="";options.client=opts.client||false;options.escapeFunction=opts.escape||opts.escapeFunction||utils.escapeXML;options.compileDebug=opts.compileDebug!==false;options.debug=!!opts.debug;options.filename=opts.filename;options.openDelimiter=opts.openDelimiter||exports.openDelimiter||_DEFAULT_OPEN_DELIMITER;options.closeDelimiter=opts.closeDelimiter||exports.closeDelimiter||_DEFAULT_CLOSE_DELIMITER;options.delimiter=opts.delimiter||exports.delimiter||_DEFAULT_DELIMITER;options.strict=opts.strict||false;options.context=opts.context;options.cache=opts.cache||false;options.rmWhitespace=opts.rmWhitespace;options.root=opts.root;options.includer=opts.includer;options.outputFunctionName=opts.outputFunctionName;options.localsName=opts.localsName||exports.localsName||_DEFAULT_LOCALS_NAME;options.views=opts.views;options.async=opts.async;options.destructuredLocals=opts.destructuredLocals;options.legacyInclude=typeof opts.legacyInclude!="undefined"?!!opts.legacyInclude:true;if(options.strict){options._with=false;}else{options._with=typeof opts._with!="undefined"?opts._with:true;}this.opts=options;this.regex=this.createRegex();}Template.modes={EVAL:"eval",ESCAPED:"escaped",RAW:"raw",COMMENT:"comment",LITERAL:"literal"};Template.prototype={createRegex:function(){var str=_REGEX_STRING;var delim=utils.escapeRegExpChars(this.opts.delimiter);var open=utils.escapeRegExpChars(this.opts.openDelimiter);var close=utils.escapeRegExpChars(this.opts.closeDelimiter);str=str.replace(/%/g,delim).replace(/</g,open).replace(/>/g,close);return new RegExp(str)},compile:function(){var src;var fn;var opts=this.opts;var prepended="";var appended="";var escapeFn=opts.escapeFunction;var ctor;var sanitizedFilename=opts.filename?JSON.stringify(opts.filename):"undefined";if(!this.source){this.generateSource();prepended+='  var __output = "";\n'+"  function __append(s) { if (s !== undefined && s !== null) __output += s }\n";if(opts.outputFunctionName){if(!_JS_IDENTIFIER.test(opts.outputFunctionName)){throw new Error("outputFunctionName is not a valid JS identifier.")}prepended+="  var "+opts.outputFunctionName+" = __append;"+"\n";}if(opts.localsName&&!_JS_IDENTIFIER.test(opts.localsName)){throw new Error("localsName is not a valid JS identifier.")}if(opts.destructuredLocals&&opts.destructuredLocals.length){var destructuring="  var __locals = ("+opts.localsName+" || {}),\n";for(var i=0;i<opts.destructuredLocals.length;i++){var name=opts.destructuredLocals[i];if(!_JS_IDENTIFIER.test(name)){throw new Error("destructuredLocals["+i+"] is not a valid JS identifier.")}if(i>0){destructuring+=",\n  ";}destructuring+=name+" = __locals."+name;}prepended+=destructuring+";\n";}if(opts._with!==false){prepended+="  with ("+opts.localsName+" || {}) {"+"\n";appended+="  }"+"\n";}appended+="  return __output;"+"\n";this.source=prepended+this.source+appended;}if(opts.compileDebug){src="var __line = 1"+"\n"+"  , __lines = "+JSON.stringify(this.templateText)+"\n"+"  , __filename = "+sanitizedFilename+";"+"\n"+"try {"+"\n"+this.source+"} catch (e) {"+"\n"+"  rethrow(e, __lines, __filename, __line, escapeFn);"+"\n"+"}"+"\n";}else{src=this.source;}if(opts.client){src="escapeFn = escapeFn || "+escapeFn.toString()+";"+"\n"+src;if(opts.compileDebug){src="rethrow = rethrow || "+rethrow.toString()+";"+"\n"+src;}}if(opts.strict){src='"use strict";\n'+src;}if(opts.debug){console.log(src);}if(opts.compileDebug&&opts.filename){src=src+"\n"+"//# sourceURL="+sanitizedFilename+"\n";}try{if(opts.async){try{ctor=new Function("return (async function(){}).constructor;")();}catch(e){if(e instanceof SyntaxError){throw new Error("This environment does not support async/await")}else{throw e}}}else{ctor=Function;}fn=new ctor(opts.localsName+", escapeFn, include, rethrow",src);}catch(e){if(e instanceof SyntaxError){if(opts.filename){e.message+=" in "+opts.filename;}e.message+=" while compiling ejs\n\n";e.message+="If the above error is not helpful, you may want to try EJS-Lint:\n";e.message+="https://github.com/RyanZim/EJS-Lint";if(!opts.async){e.message+="\n";e.message+="Or, if you meant to create an async function, pass `async: true` as an option.";}}throw e}var returnedFn=opts.client?fn:function anonymous(data){var include=function(path,includeData){var d=utils.shallowCopy(utils.createNullProtoObjWherePossible(),data);if(includeData){d=utils.shallowCopy(d,includeData);}return includeFile(path,opts)(d)};return fn.apply(opts.context,[data||utils.createNullProtoObjWherePossible(),escapeFn,include,rethrow])};if(opts.filename&&typeof Object.defineProperty==="function"){var filename=opts.filename;var basename=path.basename(filename,path.extname(filename));try{Object.defineProperty(returnedFn,"name",{value:basename,writable:false,enumerable:false,configurable:true});}catch(e){}}return returnedFn},generateSource:function(){var opts=this.opts;if(opts.rmWhitespace){this.templateText=this.templateText.replace(/[\r\n]+/g,"\n").replace(/^\s+|\s+$/gm,"");}this.templateText=this.templateText.replace(/[ \t]*<%_/gm,"<%_").replace(/_%>[ \t]*/gm,"_%>");var self=this;var matches=this.parseTemplateText();var d=this.opts.delimiter;var o=this.opts.openDelimiter;var c=this.opts.closeDelimiter;if(matches&&matches.length){matches.forEach(function(line,index){var closing;if(line.indexOf(o+d)===0&&line.indexOf(o+d+d)!==0){closing=matches[index+2];if(!(closing==d+c||closing=="-"+d+c||closing=="_"+d+c)){throw new Error('Could not find matching close tag for "'+line+'".')}}self.scanLine(line);});}},parseTemplateText:function(){var str=this.templateText;var pat=this.regex;var result=pat.exec(str);var arr=[];var firstPos;while(result){firstPos=result.index;if(firstPos!==0){arr.push(str.substring(0,firstPos));str=str.slice(firstPos);}arr.push(result[0]);str=str.slice(result[0].length);result=pat.exec(str);}if(str){arr.push(str);}return arr},_addOutput:function(line){if(this.truncate){line=line.replace(/^(?:\r\n|\r|\n)/,"");this.truncate=false;}if(!line){return line}line=line.replace(/\\/g,"\\\\");line=line.replace(/\n/g,"\\n");line=line.replace(/\r/g,"\\r");line=line.replace(/"/g,'\\"');this.source+='    ; __append("'+line+'")'+"\n";},scanLine:function(line){var self=this;var d=this.opts.delimiter;var o=this.opts.openDelimiter;var c=this.opts.closeDelimiter;var newLineCount=0;newLineCount=line.split("\n").length-1;switch(line){case o+d:case o+d+"_":this.mode=Template.modes.EVAL;break;case o+d+"=":this.mode=Template.modes.ESCAPED;break;case o+d+"-":this.mode=Template.modes.RAW;break;case o+d+"#":this.mode=Template.modes.COMMENT;break;case o+d+d:this.mode=Template.modes.LITERAL;this.source+='    ; __append("'+line.replace(o+d+d,o+d)+'")'+"\n";break;case d+d+c:this.mode=Template.modes.LITERAL;this.source+='    ; __append("'+line.replace(d+d+c,d+c)+'")'+"\n";break;case d+c:case"-"+d+c:case"_"+d+c:if(this.mode==Template.modes.LITERAL){this._addOutput(line);}this.mode=null;this.truncate=line.indexOf("-")===0||line.indexOf("_")===0;break;default:if(this.mode){switch(this.mode){case Template.modes.EVAL:case Template.modes.ESCAPED:case Template.modes.RAW:if(line.lastIndexOf("//")>line.lastIndexOf("\n")){line+="\n";}}switch(this.mode){case Template.modes.EVAL:this.source+="    ; "+line+"\n";break;case Template.modes.ESCAPED:this.source+="    ; __append(escapeFn("+stripSemi(line)+"))"+"\n";break;case Template.modes.RAW:this.source+="    ; __append("+stripSemi(line)+")"+"\n";break;case Template.modes.COMMENT:break;case Template.modes.LITERAL:this._addOutput(line);break}}else{this._addOutput(line);}}if(self.opts.compileDebug&&newLineCount){this.currentLine+=newLineCount;this.source+="    ; __line = "+this.currentLine+"\n";}}};exports.escapeXML=utils.escapeXML;exports.__express=exports.renderFile;exports.VERSION=_VERSION_STRING;exports.name=_NAME;if(typeof window!="undefined"){window.ejs=exports;}},{"../package.json":6,"./utils":2,fs:3,path:4}],2:[function(require,module,exports){"use strict";var regExpChars=/[|\\{}()[\]^$+*?.]/g;var hasOwnProperty=Object.prototype.hasOwnProperty;var hasOwn=function(obj,key){return hasOwnProperty.apply(obj,[key])};exports.escapeRegExpChars=function(string){if(!string){return""}return String(string).replace(regExpChars,"\\$&")};var _ENCODE_HTML_RULES={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"};var _MATCH_HTML=/[&<>'"]/g;function encode_char(c){return _ENCODE_HTML_RULES[c]||c}var escapeFuncStr="var _ENCODE_HTML_RULES = {\n"+'      "&": "&amp;"\n'+'    , "<": "&lt;"\n'+'    , ">": "&gt;"\n'+'    , \'"\': "&#34;"\n'+'    , "\'": "&#39;"\n'+"    }\n"+"  , _MATCH_HTML = /[&<>'\"]/g;\n"+"function encode_char(c) {\n"+"  return _ENCODE_HTML_RULES[c] || c;\n"+"};\n";exports.escapeXML=function(markup){return markup==undefined?"":String(markup).replace(_MATCH_HTML,encode_char)};function escapeXMLToString(){return Function.prototype.toString.call(this)+";\n"+escapeFuncStr}try{if(typeof Object.defineProperty==="function"){Object.defineProperty(exports.escapeXML,"toString",{value:escapeXMLToString});}else{exports.escapeXML.toString=escapeXMLToString;}}catch(err){console.warn("Unable to set escapeXML.toString (is the Function prototype frozen?)");}exports.shallowCopy=function(to,from){from=from||{};if(to!==null&&to!==undefined){for(var p in from){if(!hasOwn(from,p)){continue}if(p==="__proto__"||p==="constructor"){continue}to[p]=from[p];}}return to};exports.shallowCopyFromList=function(to,from,list){list=list||[];from=from||{};if(to!==null&&to!==undefined){for(var i=0;i<list.length;i++){var p=list[i];if(typeof from[p]!="undefined"){if(!hasOwn(from,p)){continue}if(p==="__proto__"||p==="constructor"){continue}to[p]=from[p];}}}return to};exports.cache={_data:{},set:function(key,val){this._data[key]=val;},get:function(key){return this._data[key]},remove:function(key){delete this._data[key];},reset:function(){this._data={};}};exports.hyphenToCamel=function(str){return str.replace(/-[a-z]/g,function(match){return match[1].toUpperCase()})};exports.createNullProtoObjWherePossible=function(){if(typeof Object.create=="function"){return function(){return Object.create(null)}}if(!({__proto__:null}instanceof Object)){return function(){return{__proto__:null}}}return function(){return{}}}();},{}],3:[function(require,module,exports){},{}],4:[function(require,module,exports){(function(process){function normalizeArray(parts,allowAboveRoot){var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1);}else if(last===".."){parts.splice(i,1);up++;}else if(up){parts.splice(i,1);up--;}}if(allowAboveRoot){for(;up--;up){parts.unshift("..");}}return parts}exports.resolve=function(){var resolvedPath="",resolvedAbsolute=false;for(var i=arguments.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?arguments[i]:process.cwd();if(typeof path!=="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){continue}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=path.charAt(0)==="/";}resolvedPath=normalizeArray(filter(resolvedPath.split("/"),function(p){return!!p}),!resolvedAbsolute).join("/");return(resolvedAbsolute?"/":"")+resolvedPath||"."};exports.normalize=function(path){var isAbsolute=exports.isAbsolute(path),trailingSlash=substr(path,-1)==="/";path=normalizeArray(filter(path.split("/"),function(p){return!!p}),!isAbsolute).join("/");if(!path&&!isAbsolute){path=".";}if(path&&trailingSlash){path+="/";}return(isAbsolute?"/":"")+path};exports.isAbsolute=function(path){return path.charAt(0)==="/"};exports.join=function(){var paths=Array.prototype.slice.call(arguments,0);return exports.normalize(filter(paths,function(p,index){if(typeof p!=="string"){throw new TypeError("Arguments to path.join must be strings")}return p}).join("/"))};exports.relative=function(from,to){from=exports.resolve(from).substr(1);to=exports.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..");}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")};exports.sep="/";exports.delimiter=":";exports.dirname=function(path){if(typeof path!=="string")path=path+"";if(path.length===0)return".";var code=path.charCodeAt(0);var hasRoot=code===47;var end=-1;var matchedSlash=true;for(var i=path.length-1;i>=1;--i){code=path.charCodeAt(i);if(code===47){if(!matchedSlash){end=i;break}}else{matchedSlash=false;}}if(end===-1)return hasRoot?"/":".";if(hasRoot&&end===1){return"/"}return path.slice(0,end)};function basename(path){if(typeof path!=="string")path=path+"";var start=0;var end=-1;var matchedSlash=true;var i;for(i=path.length-1;i>=0;--i){if(path.charCodeAt(i)===47){if(!matchedSlash){start=i+1;break}}else if(end===-1){matchedSlash=false;end=i+1;}}if(end===-1)return"";return path.slice(start,end)}exports.basename=function(path,ext){var f=basename(path);if(ext&&f.substr(-1*ext.length)===ext){f=f.substr(0,f.length-ext.length);}return f};exports.extname=function(path){if(typeof path!=="string")path=path+"";var startDot=-1;var startPart=0;var end=-1;var matchedSlash=true;var preDotState=0;for(var i=path.length-1;i>=0;--i){var code=path.charCodeAt(i);if(code===47){if(!matchedSlash){startPart=i+1;break}continue}if(end===-1){matchedSlash=false;end=i+1;}if(code===46){if(startDot===-1)startDot=i;else if(preDotState!==1)preDotState=1;}else if(startDot!==-1){preDotState=-1;}}if(startDot===-1||end===-1||preDotState===0||preDotState===1&&startDot===end-1&&startDot===startPart+1){return""}return path.slice(startDot,end)};function filter(xs,f){if(xs.filter)return xs.filter(f);var res=[];for(var i=0;i<xs.length;i++){if(f(xs[i],i,xs))res.push(xs[i]);}return res}var substr="ab".substr(-1)==="b"?function(str,start,len){return str.substr(start,len)}:function(str,start,len){if(start<0)start=str.length+start;return str.substr(start,len)};}).call(this,require("_process"));},{_process:5}],5:[function(require,module,exports){var process=module.exports={};var cachedSetTimeout;var cachedClearTimeout;function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}(function(){try{if(typeof setTimeout==="function"){cachedSetTimeout=setTimeout;}else{cachedSetTimeout=defaultSetTimout;}}catch(e){cachedSetTimeout=defaultSetTimout;}try{if(typeof clearTimeout==="function"){cachedClearTimeout=clearTimeout;}else{cachedClearTimeout=defaultClearTimeout;}}catch(e){cachedClearTimeout=defaultClearTimeout;}})();function runTimeout(fun){if(cachedSetTimeout===setTimeout){return setTimeout(fun,0)}if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout){cachedSetTimeout=setTimeout;return setTimeout(fun,0)}try{return cachedSetTimeout(fun,0)}catch(e){try{return cachedSetTimeout.call(null,fun,0)}catch(e){return cachedSetTimeout.call(this,fun,0)}}}function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout){return clearTimeout(marker)}if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout){cachedClearTimeout=clearTimeout;return clearTimeout(marker)}try{return cachedClearTimeout(marker)}catch(e){try{return cachedClearTimeout.call(null,marker)}catch(e){return cachedClearTimeout.call(this,marker)}}}var queue=[];var draining=false;var currentQueue;var queueIndex=-1;function cleanUpNextTick(){if(!draining||!currentQueue){return}draining=false;if(currentQueue.length){queue=currentQueue.concat(queue);}else{queueIndex=-1;}if(queue.length){drainQueue();}}function drainQueue(){if(draining){return}var timeout=runTimeout(cleanUpNextTick);draining=true;var len=queue.length;while(len){currentQueue=queue;queue=[];while(++queueIndex<len){if(currentQueue){currentQueue[queueIndex].run();}}queueIndex=-1;len=queue.length;}currentQueue=null;draining=false;runClearTimeout(timeout);}process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1){for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i];}}queue.push(new Item(fun,args));if(queue.length===1&&!draining){runTimeout(drainQueue);}};function Item(fun,array){this.fun=fun;this.array=array;}Item.prototype.run=function(){this.fun.apply(null,this.array);};process.title="browser";process.browser=true;process.env={};process.argv=[];process.version="";process.versions={};function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.prependListener=noop;process.prependOnceListener=noop;process.listeners=function(name){return[]};process.binding=function(name){throw new Error("process.binding is not supported")};process.cwd=function(){return"/"};process.chdir=function(dir){throw new Error("process.chdir is not supported")};process.umask=function(){return 0};},{}],6:[function(require,module,exports){module.exports={name:"ejs",description:"Embedded JavaScript templates",keywords:["template","engine","ejs"],version:"3.1.8",author:"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",license:"Apache-2.0",bin:{ejs:"./bin/cli.js"},main:"./lib/ejs.js",jsdelivr:"ejs.min.js",unpkg:"ejs.min.js",repository:{type:"git",url:"git://github.com/mde/ejs.git"},bugs:"https://github.com/mde/ejs/issues",homepage:"https://github.com/mde/ejs",dependencies:{jake:"^10.8.5"},devDependencies:{browserify:"^16.5.1",eslint:"^6.8.0","git-directory-deploy":"^1.5.1",jsdoc:"^4.0.2","lru-cache":"^4.0.1",mocha:"^10.2.0","uglify-js":"^3.3.16"},engines:{node:">=0.10.0"},scripts:{test:"mocha -u tdd"}};},{}]},{},[1])(1)});

let tpl = Object.create(null);
tpl['form-error.html'] = '<div class="coreui-form__error alert alert-danger alert-dismissible fade show mb-3 <%= options.class %>">\n    <%- message %>\n    <% if (options.dismiss) { %>\n    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>\n    <% } %>\n</div>';
tpl['form-field-content.html'] = '<%- content %>';
tpl['form-field-group.html'] = '<div id="coreui-form-<%= id %>" class="coreui-form__group_container mb-3">\n    <div class="coreui-form__group_label pe-2">\n        <h6 class="coreui-form__field_label_text col-form-label-sm">\n            <%- group.label %>\n            <% if (group.showCollapsible) { %>\n                <button type="button" class="btn btn-sm btn-link btn-collapsible text-dark">\n                    <% if ( ! group.show) { %>\n                    <i class="bi bi-chevron-right"></i>\n                    <% } else { %>\n                    <i class="bi bi-chevron-down"></i>\n                    <% } %>\n                </button>\n            <% } %>\n        </h6>\n    </div>\n    <div class="coreui-form__group_content"<% if ( ! group.show) { %> style="display:none"<% } %>>\n        <%- content %>\n    </div>\n</div>';
tpl['form-field-label.html'] = '<div id="coreui-form-<%= id %>" class="coreui-form__field_container d-flex flex-column flex-md-row mb-3"\n     <% if ( ! field.show) { %> style="display:none"<% } %>>\n    <% if (field.labelWidth !== 0 && field.labelWidth !== \'0px\') { %>\n    <div class="coreui-form__field_label text-md-end text-sm-start pe-2"<% if (field.labelWidth) { %> style="min-width:<%= field.labelWidth %>;width:<%= field.labelWidth %>"<% } %>>\n        <div class="coreui-form__field_label_content col-form-label-sm">\n            <% if (field.required) { %>\n            <span class="coreui-form__field_label_req text-danger">*</span>\n            <% } %>\n            <span class="coreui-form__field_label_text fw-medium"><%- field.label %></span>\n        </div>\n\n        <% if (field.description) { %>\n        <div class="coreui-form__field_label_description text-muted">\n            <small><%- field.description %></small>\n        </div>\n        <% } %>\n    </div>\n    <% } %>\n    <div class="coreui-form__field_content flex-fill pt-1">\n        <div class="d-inline-block content-<%= hash %>">\n            <%- content %>\n        </div>\n\n        <% if (field.outContent) { %>\n        <span class="coreui-form__field-content-out d-inline-block align-top pt-1 ps-1">\n            <%- field.outContent %>\n        </span>\n        <% } %>\n\n        <% if (attachFields && attachFields.length > 0) { %>\n            <% $.each(attachFields, function(key, attachField) { %>\n                <div class="<% if (attachField.hasOwnProperty(\'direction\') && attachField.direction === \'column\') { %>d-block mt-2<% } else { %>d-inline-block<% } %> content-<%= attachField.hash %>">\n                    <%- attachField.content %>\n                </div>\n            <% }); %>\n        <% } %>\n    </div>\n</div>';
tpl['form.html'] = '<div id="coreui-form-<%= form.id %>" class="coreui-form mb-2"\n    <% if (widthSizes) { %>style="<%= widthSizes.join(\';\') %>"<% } %>>\n    <% if (form.title) { %>\n    <h5 class="mb-4"><%- form.title %></h5>\n    <% } %>\n\n    <form action="<%= form.send.url %>" method="<%= form.send.method %>"<%- formAttr %>>\n        <div class="coreui-form__fields d-flex justify-content-start flex-column flex-wrap">\n            <%- layout %>\n        </div>\n\n        <% if (controls) { %>\n        <div class="coreui-form__controls d-flex justify-content-start flex-sm-wrap flex-md-nowrap">\n            <% if (form.controlsOffset !== 0 && form.controlsOffset !== \'0px\') { %>\n            <div class="d-none d-md-block" style="width:<%= form.controlsOffset %>;min-width:<%= form.controlsOffset %>"></div>\n            <% } %>\n\n            <div class="d-flex justify-content-start flex-wrap gap-2">\n                <% $.each(controls, function(key, control) { %>\n                <div id="coreui-form-<%= form.id %>-control-<%= control.index %>" class="coreui-form__control_container"\n                     <% if ( ! control.show) { %>style="display:none"<% } %>>\n                    <%- control.content %>\n                </div>\n                <% }); %>\n            </div>\n        </div>\n        <% } %>\n    </form>\n</div>';
tpl['controls/button.html'] = '<button <%- render.attr %>><%- control.content %></button>';
tpl['controls/link.html'] = '<a href="<%- control.href %>"<%- render.attr %>><%- control.content %></a>';
tpl['fields/checkbox.html'] = '<% if (field.readonly) { %>\n    <%- render.selectedItems.join(\', \') %>\n<% } else { %>\n    <% $.each(render.options, function(key, option) { %>\n    <div class="form-check<% if (field.inline) { %> form-check-inline<% } %>">\n        <input <%- option.attr %>/>\n        <label class="form-check-label" for="<%= option.id %>"><%= option.text %></label>\n    </div>\n    <% }); %>\n<% } %>';
tpl['fields/color.html'] = '<% if (field.readonly) { %>\n    <div class="rounded-1" style="width: 14px;height: 14px;background-color: <%= value %>"></div>\n<% } else { %>\n    <input <%- render.attr %>/>\n\n    <% if (render.datalist.length > 0) { %>\n    <datalist id="<%= datalistId %>">\n        <% $.each(render.datalist, function(key, item) { %>\n        <option <%- item.attr %>/>\n        <% }); %>\n    </datalist>\n    <% } %>\n<% } %>';
tpl['fields/custom.html'] = '<%- content %>';
tpl['fields/dataset-row-readonly.html'] = '<tr class="coreui-form__field-dataset-item">\n    <% $.each(options, function(key, option) { %>\n        <td class="pe-2 pb-1">\n            <%- option.value %>\n        </td>\n    <% }); %>\n</tr>';
tpl['fields/dataset-row.html'] = '<tr class="coreui-form__field-dataset-item" id="dataset-item-<%= hashItem %>">\n    <% $.each(options, function(key, option) { %>\n        <td class="pe-1 pb-1">\n        <% if (option.type === \'select\') { %>\n            <select <%- option.attr %>>\n                <% $.each(option.items, function(key, item) { %>\n                <option <%- item.attr %>><%- item.title %></option>\n                <% }); %>\n            </select>\n        <% } else if (option.type === \'switch\') { %>\n            <div class="form-check form-switch">\n                <input <%- option.attr %>/>\n            </div>\n        <% } else { %>\n            <input <%- option.attr %>>\n        <% } %>\n        </td>\n    <% }); %>\n\n    <td class="pb-1">\n        <button type="button" class="btn btn-sm btn-link btn-dataset-remove" data-item-id="dataset-item-<%= hashItem %>">\n            <i class="bi bi-x text-muted"></i>\n        </button>\n    </td>\n</tr>';
tpl['fields/dataset.html'] = '<% if (field.readonly) { %>\n    <table class="coreui-form__field-dataset-container" <% if (render.rows.length == 0) { %> style="display:none"<% } %>>\n        <thead>\n            <tr>\n                <% $.each(render.headers, function(key, item) { %>\n                <td class="text-muted pe-2"><small><%= item.title %></small></td>\n                <% }); %>\n            </tr>\n        </thead>\n        <tbody class="coreui-form__field-dataset-list">\n            <% $.each(render.rows, function(key, row) { %>\n            <%- row %>\n            <% }); %>\n        </tbody>\n    </table>\n\n<% } else { %>\n    <table class="coreui-form__field-dataset-container" <% if (render.rows.length == 0) { %> style="display:none"<% } %>>\n        <thead>\n            <tr>\n                <% $.each(render.headers, function(key, item) { %>\n                <td class="text-muted"><small><%= item.title %></small></td>\n                <% }); %>\n                <td></td>\n            </tr>\n        </thead>\n        <tbody class="coreui-form__field-dataset-list">\n            <% $.each(render.rows, function(key, row) { %>\n                <%- row %>\n            <% }); %>\n        </tbody>\n    </table>\n\n    <button type="button" class="btn btn-sm btn-link btn-dataset-add"><%= lang.dataset_add %></button>\n<% } %>';
tpl['fields/hidden.html'] = '<% if ( ! field.readonly) { %>\n    <input <%- render.attr %>/>\n<% } %>';
tpl['fields/input.html'] = '<% if (field.readonly) { %>\n    <%- value %>\n<% } else { %>\n    <input <%- render.attr %>/>\n\n    <% if (render.datalist.length > 0) { %>\n    <datalist id="<%= datalistId %>">\n        <% $.each(render.datalist, function(key, item) { %>\n        <option <%- item.attr %>/>\n        <% }); %>\n    </datalist>\n    <% } %>\n<% } %>';
tpl['fields/modal-loading.html'] = '<div class="py-4 d-flex justify-content-center align-items-center gap-2">\n    <div class="spinner-border mr-2"></div> <%= lang.modal_loading %>\n</div>\n';
tpl['fields/modal.html'] = '<% if (field.readonly) { %>\n    <%= text %>\n<% } else { %>\n    <div class="input-group"<% if (render.width) { %> style="width:<%= render.width %>"<% } %>>\n        <input <%- render.attr %>/>\n        <input type="hidden" name="<%= field.name %>" value="<%= value %>" class="coreui-form-modal-value"/>\n        <% if ( ! field.required) { %>\n        <button class="btn btn-sm btn-outline-secondary btn-modal-clear border-secondary-subtle" type="button">\n            <i class="bi bi-x"></i>\n        </button>\n        <% } %>\n        <button class="btn btn-sm btn-outline-secondary btn-modal-select border-secondary-subtle" type="button"><%= lang.modal_select %></button>\n    </div>\n<% } %>';
tpl['fields/passwordRepeat.html'] = '<% if (field.readonly) { %>\n    <%- value %>\n<% } else { %>\n    <div class="d-flex gap-1 align-items-center">\n        <input <%- render.attr %>/>\n        <small class="password-text-repeat"><%= lang.repeat %></small>\n\n        <% if (field.showBtn) { %>\n            <div class="input-group flex-nowrap">\n                <input <%- render.attr2 %>/>\n                <button class="btn btn-sm btn-outline-secondary border-secondary-subtle btn-password-change" type="button"\n                        data-change="<%- lang.change %>" data-cancel="<%- lang.cancel %>"><%= btn_text %></button>\n            </div>\n        <% } else { %>\n            <input <%- render.attr2 %>/>\n        <% } %>\n\n    </div>\n<% } %>';
tpl['fields/radio.html'] = '<% if (field.readonly) { %>\n    <%- render.selectedItem %>\n<% } else { %>\n    <% $.each(render.options, function(key, option) { %>\n    <div class="form-check<% if (field.inline) { %> form-check-inline<% } %>">\n        <input <%- option.attr %>/>\n        <label class="form-check-label" for="<%= option.id %>"><%= option.text %></label>\n    </div>\n    <% }); %>\n<% } %>';
tpl['fields/select.html'] = '<% if (field.readonly) { %>\n    <%= render.selectedOptions.join(\', \') %>\n<% } else { %>\n    <select <%- render.attr %>>\n        <% $.each(render.options, function(key, option) { %>\n            <% if (option.type === \'group\') { %>\n                <optgroup<%- option.attr %>/>\n                <% $.each(option.options, function(key, groupOption) { %>\n                    <option <%- groupOption.attr %>/><%= groupOption.text %></option>\n                <% }); %>\n                </optgroup>\n            <% } else { %>\n            <option <%- option.attr %>/><%= option.text %></option>\n            <% } %>\n        <% }); %>\n    </select>\n<% } %>';
tpl['fields/switch.html'] = '<% if (field.readonly) { %>\n    <%= field.valueY == value ? lang.switch_yes : lang.switch_no %>\n<% } else { %>\n    <div class="form-check form-switch">\n        <input <%- render.attr %>/>\n    </div>\n<% } %>';
tpl['fields/textarea.html'] = '<% if (field.readonly) { %>\n    <%- value %>\n<% } else { %>\n    <textarea <%- render.attr %>><%- value %></textarea>\n<% } %>';
tpl['fields/wysiwyg.html'] = '<% if (field.readonly) { %>\n    <%- value %>\n<% } else { %>\n    <textarea name="<%= field.name %>" id="editor-<%= editorHash %>"><%- value %></textarea>\n<% } %>';

let coreuiFormUtils$1 = {

    /**
     * Получение значения поля
     * @param {coreuiFormInstance} form
     * @param {object}               fieldOptions
     * @returns {string|number|null}
     */
    getFieldValue: function (form, fieldOptions) {

        let formRecord = form.getRecord();

        if (fieldOptions &&
            formRecord &&
            typeof fieldOptions.name === 'string' &&
            typeof formRecord === 'object' &&
            formRecord.hasOwnProperty(fieldOptions.name) &&
            ['string', 'number', 'object'].indexOf(typeof formRecord[fieldOptions.name]) >= 0
        ) {
            return formRecord[fieldOptions.name];
        }

        return '';
    },


    /**
     * Получение функции из указанного текста
     * @param functionName
     * @param context
     * @returns {null|Window}
     * @private
     */
    getFunctionByName: function(functionName, context) {

        let namespaces = functionName.split(".");
        let func       = namespaces.pop();

        context = context || window;

        for (let i = 0; i < namespaces.length; i++) {
            if (context.hasOwnProperty(namespaces[i])) {
                context = context[namespaces[i]];
            } else {
                return null;
            }
        }

        if (typeof context[func] === 'function') {
            return context[func];
        }

        return null;
    },


    /**
     * Обработка полей в полях
     * @param form
     * @param defaultOptions
     * @param fieldOptions
     */
    mergeFieldOptions: function (form, defaultOptions, fieldOptions) {

        let options = $.extend(true, {}, defaultOptions);

        if (fieldOptions) {
            if (options.hasOwnProperty('attr') && typeof options.attr === 'object' &&
                fieldOptions.hasOwnProperty('attr') && typeof fieldOptions.attr === 'object'
            ) {
                fieldOptions.attr = this.mergeAttr(options.attr, fieldOptions.attr);
            }

            options = $.extend(true, {}, options, fieldOptions);
        }

        if (options.hasOwnProperty('width')) {
            if (options.width) {
                let unit = typeof options.width === 'number' ? 'px' : '';
                options.width = options.width + unit;

            } else if (form._options.fieldWidth && options.type !== 'color') {
                let unit = typeof form._options.fieldWidth === 'number' ? 'px' : '';
                options.width = form._options.fieldWidth + unit;
            }
        }

        if (options.hasOwnProperty('labelWidth')) {
            if (options.labelWidth >= 0 && options.labelWidth !== null) {
                let unit = typeof options.labelWidth === 'number' ? 'px' : '';
                options.labelWidth = options.labelWidth + unit;

            } else if (form._options.labelWidth) {
                let unit = typeof form._options.labelWidth === 'number' ? 'px' : '';
                options.labelWidth = form._options.labelWidth + unit;
            }
        }

        return options
    },


    /**
     * Объединение атрибутов
     * @param attr1
     * @param attr2
     * @returns {object}
     */
    mergeAttr: function (attr1, attr2) {

        let mergeAttr = Object.assign({}, attr1);

        if (typeof attr2 === 'object') {
            $.each(attr2, function (name, value) {
                if (mergeAttr.hasOwnProperty(name)) {
                    if (name === 'class') {
                        mergeAttr[name] += ' ' + value;

                    } else if (name === 'style') {
                        mergeAttr[name] += ';' + value;

                    } else {
                        mergeAttr[name] = value;
                    }

                } else {
                    mergeAttr[name] = value;
                }
            });
        }

        return mergeAttr;
    },


    /**
     * Инициализация и рендер дополнительных полей
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @returns {object}
     * @private
     */
    getAttacheFields: function(form, options) {

        let fields = [];

        if (typeof options === 'object' &&
            typeof(options.fields) === 'object' &&
            Array.isArray(options.fields)
        ) {
            $.each(options.fields, function (key, field) {
                let instance = form.initField(field);

                if (typeof instance !== 'object') {
                    return;
                }

                fields.push({
                    hash: instance._hash,
                    direction: options.hasOwnProperty('fieldsDirection') ? options.fieldsDirection : 'row',
                    content: instance.renderContent()
                });
            });
        }

        return fields;
    },


    /**
     * Форматирование даты
     * @param {string} value
     * @return {string}
     */
    formatDate: function (value) {

        if (value && value.length === 10) {
            let date  = new Date(value);
            let year  = date.getFullYear();
            let month = date.getMonth() + 1;
            let day   = date.getDate();

            day   = day < 10 ? '0' + day : day;
            month = month < 10 ? '0' + month : month;

            value = day + '.' + month + '.' + year;
        }

        return value;
    },


    /**
     * Форматирование даты со временем
     * @param {string} value
     * @return {string}
     */
    formatDateTime: function (value) {

        if (value && value.length >= 10) {
            let date  = new Date(value);
            let year  = date.getFullYear();
            let month = date.getMonth() + 1;
            let day   = date.getDate();
            let hour  = ("00" + date.getHours()).slice(-2);
            let min   = ("00" + date.getMinutes()).slice(-2);
            let sec   = ("00" + date.getSeconds()).slice(-2);

            day   = day < 10 ? '0' + day : day;
            month = month < 10 ? '0' + month : month;

            value = day + '.' + month + '.' + year + ' ' + hour + ':' + min + ':' + sec;
        }

        return value;
    },


    /**
     * Форматирование даты со временем
     * @param {string} value
     * @param {object} lang
     * @return {string}
     */
    formatDateMonth: function (value, lang) {

        if (value && value.length === 7) {
            let date  = new Date(value);
            let year  = date.getFullYear();
            let month = date.getMonth();

            let monthLang = lang.date_months.hasOwnProperty(month) ? lang.date_months[month] : '';

            value = monthLang + ' ' + year;
        }

        return value;
    },


    /**
     * Форматирование даты со временем
     * @param {string} value
     * @param {object} lang
     * @return {string}
     */
    formatDateWeek: function (value, lang) {

        if (value && value.length >= 7) {
            let year = value.substring(0, 4);
            let week = value.substring(6);

            value = year + ' ' + lang.date_week + ' ' + week;
        }

        return value;
    },


    /**
     * Получение значения из объекта по указанному пути
     * @param {object} obj
     * @param {string} path
     * @return {*}
     */
    getObjValue: function(obj, path) {

        for (let i = 0, path = path.split('.'), len = path.length; i < len; i++){
            obj = obj[path[i]];
        }

        return obj;
    },


    /**
     * Проверка на число
     * @param num
     * @returns {boolean}
     * @private
     */
    isNumeric: function(num) {
        return (typeof(num) === 'number' || typeof(num) === "string" && num.trim() !== '') && ! isNaN(num);
    },


    /**
     * @returns {string}
     * @private
     */
    hashCode: function() {
        return this.crc32((new Date().getTime() + Math.random()).toString()).toString(16);
    },


    /**
     * Hash crc32
     * @param str
     * @returns {number}
     * @private
     */
    crc32: function (str) {

        for (var a, o = [], c = 0; c < 256; c++) {
            a = c;
            for (var f = 0; f < 8; f++) {
                a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
            }
            o[c] = a;
        }

        for (var n = -1, t = 0; t < str.length; t++) {
            n = n >>> 8 ^ o[255 & (n ^ str.charCodeAt(t))];
        }

        return (-1 ^ n) >>> 0;
    },


    /**
     * Округление
     * @param number
     * @param precision
     * @returns {number}
     */
    round: function (number, precision) {

        precision = typeof precision !== 'undefined' ? parseInt(precision) : 0;

        if (precision === 0) {
            return Math.round(number);

        } else if (precision > 0) {
            let pow = Math.pow(10, precision);
            return Math.round(number * pow) / pow;

        } else {
            let pow = Math.pow(10, precision);
            return Math.round(number / pow) * pow;
        }
    }
};

let coreuiFormInstance = {

    _options: {
        id: null,
        title: '',
        lang: 'en',
        send: {
            url: '',
            method: 'POST',
            format: 'form',
        },
        width: null,
        minWidth: null,
        maxWidth: null,
        labelWidth: 200,
        controlsOffset: null,
        readonly: false,
        validate: false,
        errorClass: '',
        layout: '[column_default]',
        onSubmit: null,
        record: {},
        fields: [],
        controls: []
    },

    _lock: false,
    _fieldsIndex: 0,
    _groupsIndex: 0,
    _controlsIndex: 0,
    _groups: [],
    _fields: [],
    _controls: [],
    _events: {},


    /**
     * Инициализация
     * @param {object} options
     * @private
     */
    _init: function (options) {

        this._options.labelWidth    = coreuiForm$1.getSetting('labelWidth');
        this._options.lang          = coreuiForm$1.getSetting('lang');
        this._options.errorClass    = coreuiForm$1.getSetting('errorClass');
        this._options.send.format = coreuiForm$1.getSetting('sendDataFormat');

        this._options = $.extend(true, {}, this._options, options);

        if ( ! this._options.id) {
            this._options.id = coreuiFormUtils$1.hashCode();
        }

        if (this._options.hasOwnProperty('labelWidth')) {
            if (this._options.labelWidth >= 0 && this._options.labelWidth !== null) {
                let unit = typeof this._options.labelWidth === 'number' ? 'px' : '';
                this._options.labelWidth = this._options.labelWidth + unit;
            }
        }

        if ( ! this._options.hasOwnProperty('controlsOffset') || this._options.controlsOffset === null) {
            this._options.controlsOffset = this._options.labelWidth;
        } else {
            if (this._options.controlsOffset >= 0) {
                let unit = typeof this._options.controlsOffset === 'number' ? 'px' : '';
                this._options.controlsOffset = this._options.controlsOffset + unit;
            }
        }
    },


    /**
     *
     */
    initEvents: function () {

        let that          = this;
        let formContainer = '#coreui-form-' + this._options.id + ' > form';

        $(formContainer).on('submit', function () {
            setTimeout(function () {
                that.send.apply(that);
            }, 0);
            return false;
        });

        this._trigger('shown.coreui.form');
    },


    /**
     * Получение id формы
     * @return {string|null}
     */
    getId: function () {

        return this._options.hasOwnProperty('id') ? this._options.id : null;
    },


    /**
     *
     * @param element
     * @returns {*}
     */
    render: function(element) {

        let that       = this;
        let widthSizes = [];
        let layout     = this._options.layout;
        let controls   = [];
        let formAttr   = [];



        if (this._options.width) {
            let unit = typeof this._options.width === 'number' ? 'px' : '';
            widthSizes.push('width:' + this._options.width + unit);
        }

        if (this._options.minWidth) {
            let unit = typeof this._options.minWidth === 'number' ? 'px' : '';
            widthSizes.push('min-width:' + this._options.minWidth + unit);
        }

        if (this._options.maxWidth) {
            let unit = typeof this._options.maxWidth === 'number' ? 'px' : '';
            widthSizes.push('max-width:' + this._options.maxWidth + unit);
        }



        // Поля
        if (typeof this._options.fields === 'object' &&
            Array.isArray(this._options.fields) &&
            this._options.fields.length > 0 &&
            layout &&
            typeof layout === 'string'
        ) {
            let matches        = Array.from(layout.matchAll(/\[column_([\w_\d]+)\]/g));
            let columns        = [];
            let columnsContent = {};

            if (matches.length > 0) {
                $.each(matches, function (key, match) {
                    columns.push(match[1]);
                });
            }

            if (columns.length > 0) {
                $.each(this._options.fields, function (key, field) {
                    let column = field.hasOwnProperty('column') && (typeof field.column === 'string' || typeof field.column === 'number')
                        ? (columns.indexOf(field.column) >= 0 ? field.column : null)
                        : 'default';

                    if (typeof column !== 'string') {
                        return;
                    }

                    let type     = field.hasOwnProperty('type') && typeof field.type === 'string' ? field.type : '';
                    let instance = null;

                    if (type === 'group') {
                        instance = that.initGroup(field);

                    } else {
                        instance = that.initField(field);
                    }


                    if ( ! instance || typeof instance !== 'object') {
                        return;
                    }

                    if ( ! columnsContent.hasOwnProperty(column)) {
                        columnsContent[column] = [];
                    }
                    columnsContent[column].push(instance.render());
                });
            }

            if (Object.keys(columnsContent).length >= 0) {
                $.each(columnsContent, function (name, fieldContents) {

                    layout = layout.replace('[column_' + name + ']', fieldContents.join(''));
                });
            }
        }


        // Элементы управления
        if (typeof this._options.controls === 'object' &&
            Array.isArray(this._options.controls) &&
            this._options.controls.length > 0
        ) {
            $.each(this._options.controls, function (key, control) {
                let instance = that.initControl(control);

                if ( ! instance || typeof instance !== 'object') {
                    return;
                }

                controls.push({
                    show: ! control.hasOwnProperty('show') || control.show,
                    index: that._controlsIndex - 1,
                    content: instance.render()
                });
            });
        }

        if (typeof this._options.validate === 'boolean' && this._options.validate) {
            formAttr.push('novalidate');
        }


        let html = ejs.render(tpl['form.html'], {
            form: this._options,
            formAttr: formAttr ? ' ' + formAttr.join(' ') : '',
            widthSizes: widthSizes,
            layout: layout,
            controls: controls,
        });

        if (element === undefined) {
            return html;
        }

        // Dom element
        let domElement = {};

        if (typeof element === 'string') {
            domElement = document.getElementById(element);

            if ( ! domElement) {
                return '';
            }

        } else if (element instanceof HTMLElement) {
            domElement = element;
        }


        domElement.innerHTML = html;

        this.initEvents();
    },


    /**
     *
     */
    lock: function () {

        this._lock = true;

        $.each(this._controls, function (key, control) {
            let controlOptions = control.getOptions();

            if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
                control.lock();
            }
        });
    },


    /**
     * Разблокировка
     */
    unlock: function () {

        this._lock = false;

        $.each(this._controls, function (key, control) {
            let controlOptions = control.getOptions();

            if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
                control.unlock();
            }
        });
    },


    /**
     * Отправка данных формы
     */
    send: function () {

        if (this._lock) {
            return;
        }


        if (typeof this._options.validate === 'boolean' && this._options.validate) {
            let isValid = this.validate();

            if ( ! isValid) {
                return;
            }
        }


        let onsubmit = null;
        let data     = this.getData();

        if (typeof this._options.onSubmit === 'function') {
            onsubmit = this._options.onSubmit;

        } else if (typeof this._options.onSubmit === 'string' && this._options.onSubmit) {
            let func = coreuiFormUtils$1.getFunctionByName(this._options.onSubmit);

            if (typeof func === 'function') {
                onsubmit = func;
            } else if (typeof this._options.onSubmit === 'string') {
                let onSubmitText = this._options.onSubmit;

                onsubmit = function(form, data) {
                    try {
                        eval(onSubmitText);
                    } catch (e) {
                        throw Error('Incorrect onSubmit param: ' + e.message)
                    }
                };
            }
        }

        if (typeof onsubmit === 'function') {
            let onSubmitResult = onsubmit(this, data);

            if (onSubmitResult === false) {
                return;
            }
        }


        let results    = this._trigger('send.coreui.form', this, [ this, data ]);
        let isStopSend = false;

        $.each(results, function(key, result) {
            if (result === false) {
                isStopSend = true;
                return false;
            }
        });

        if (isStopSend) {
            return;
        }


        this.lock();

        let that       = this;
        let sendFormat = ['form', 'json'].indexOf(this._options.send.format) >= 0
            ? this._options.send.format
            : 'form';

        let dataFormat  = null;
        let contentType = null;

        if (sendFormat === 'json') {
            contentType = "application/json; charset=utf-8";
            dataFormat  = JSON.stringify(data);

        } else {
            contentType = false;
            dataFormat  = new FormData();

            $.each(data, function (name, value) {
                if (value instanceof File) {
                    dataFormat.append(name, value, value.name);

                } else if (value instanceof FileList) {
                    $.each(value, function (key, file) {
                        dataFormat.append(name, file, file.name);
                    });

                } else {
                    dataFormat.append(name, value);
                }
            });
        }


        $.ajax({
            url: this._options.send.url,
            method: this._options.send.method,
            data: dataFormat,
            contentType: contentType,
            processData: false,
            beforeSend: function(xhr) {
                that._trigger('start-send.coreui.form', that, [ that, xhr ]);
            },
            success: function (result) {
                that.hideError();

                that._trigger('success-send.coreui.form', that, [ that, result ]);

                let jsonResponse = null;

                try {
                    let parsedResponse = JSON.parse(result);
                    if (typeof parsedResponse === 'object' &&
                        parsedResponse !== null &&
                        ! Array.isArray(parsedResponse)
                    ) {
                        jsonResponse = parsedResponse;
                    }

                } catch (e) {
                    // ignore
                }

                if (jsonResponse !== null && typeof jsonResponse === 'object') {
                    if (jsonResponse.hasOwnProperty('scripts') &&
                        Array.isArray(jsonResponse.scripts)
                    ) {
                        $.each(jsonResponse.scripts, function (key, script) {
                            if (typeof script === 'string') {
                                let func = coreuiFormUtils$1.getFunctionByName(script);

                                if (typeof func === 'function') {
                                    func();
                                } else {
                                    eval(script);
                                }
                            }
                        });
                    }

                    if (jsonResponse.hasOwnProperty('loadUrl') &&
                        typeof jsonResponse.loadUrl === 'string'
                    ) {
                        location.href = jsonResponse.loadUrl;
                    }
                }

                if (that._options.hasOwnProperty('successLoadUrl') &&
                    typeof that._options.successLoadUrl === 'string'
                ) {
                    let successLoadUrl = that._options.successLoadUrl;

                    // Замена параметров
                    if (jsonResponse !== null && typeof jsonResponse === 'object') {
                        const regx = new RegExp('\\[response\\.([\\d\\w\\.]+)\\]', 'uig');
                        let urlParams = {};

                        while (result = regx.exec(successLoadUrl)) {
                            urlParams[result[0]] = result[1];
                        }

                        if (Object.keys(urlParams).length > 0) {
                            $.each(urlParams, function (param, path) {
                                let value = coreuiFormUtils$1.getObjValue(jsonResponse, path);
                                value = typeof value !== 'undefined' ? value : '';

                                successLoadUrl = successLoadUrl.replace(
                                    new RegExp(param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                                    value
                                );
                            });
                        }
                    }

                    location.href = successLoadUrl;
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                let errorMessage = that.getLang().send_error || '';
                let data         = {};

                try {
                    let parsedResponse = JSON.parse(xhr.responseText);
                    if (typeof parsedResponse === 'object' &&
                        parsedResponse !== null &&
                        ! Array.isArray(parsedResponse)
                    ) {
                        data = parsedResponse;
                    }

                } catch (e) {
                    // ignore
                }

                if (data.hasOwnProperty('error_message') &&
                    typeof data.error_message === 'string' &&
                    data.error_message !== ''
                ) {
                    errorMessage = data.error_message;
                }

                that.showError(errorMessage);
                that._trigger('error-send.coreui.form', that, [ that, xhr, textStatus, errorThrown ]);
            },
            complete: function(xhr, textStatus) {
                that.unlock();
                that._trigger('end-send.coreui.form', that, [ that, xhr, textStatus ]);
            },
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return this._options;
    },


    /**
     * Получение записи
     * @returns {object}
     */
    getRecord: function () {

        if (this._options.hasOwnProperty('record') && typeof this._options.record === 'object') {
            return this._options.record;
        }

        return {};
    },


    /**
     * Получение данных с формы
     * @returns {object}
     */
    getData: function () {

        let data = {};

        $.each(this._fields, function (key, field) {
            let fieldOptions = field.getOptions();

            if (fieldOptions.hasOwnProperty('name') && fieldOptions.name) {
                data[fieldOptions.name] = field.getValue();
            }
        });

        return data;
    },


    /**
     * Получение полей
     * @returns {object}
     */
    getFields: function () {
        return this._fields;
    },


    /**
     * Получение элементов управления
     * @returns {object}
     */
    getControls: function () {
        return this._controls;
    },


    /**
     * Получение групп полей
     * @returns {object}
     */
    getGroups: function () {
        return this._groups;
    },


    /**
     * Получение поля
     * @param {string} name
     * @returns {object}
     */
    getField: function (name) {

        let field = {};

        $.each(this._fields, function (key, fieldInstance) {
            let fieldOptions = fieldInstance.getOptions();

            if (fieldOptions.hasOwnProperty('name') && fieldOptions.name === name) {
                field = fieldInstance;
            }
        });

        return field;
    },


    /**
     * Смена состояний полей формы
     */
    readonly: function (isReadonly) {

        $.each(this._fields, function (key, fieldInstance) {
            fieldInstance.readonly(isReadonly);
        });


        $.each(this._controls, function (key, control) {
            let controlOptions = control.getOptions();

            if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
                if (isReadonly) {
                    control.hide();
                } else {
                    control.show();
                }
            }
        });
    },


    /**
     * Показ всех элементов управления
     */
    showControls: function () {

        $.each(this._controls, function (key, control) {
            control.show();
        });
    },


    /**
     * Скрытие всех элементов управления
     */
    hideControls: function () {

        $.each(this._controls, function (key, control) {
            control.hide();
        });
    },


    /**
     * Валидация полей
     * @return {boolean}
     */
    validate: function () {

        let isValid = true;

        $.each(this._fields, function (key, field) {

            if (field.isValid() === false) {
                field.validate(false);
                isValid = false;

            } else {
                field.validate(null);
            }
        });

        return isValid;
    },


    /**
     * Показ сообщения с ошибкой
     * @param {string} message
     * @param {object} options
     */
    showError: function (message, options) {

        let formContainer = $('#coreui-form-' + this._options.id + ' > form');
        let formError     = formContainer.find('> .coreui-form__error');

        if (formError[0]) {
            formError.remove();
        }

        options = typeof options === 'object' && ! Array.isArray(options) && options !== null ? options : {};

        if (typeof this._options.errorClass === 'string' && this._options.errorClass !== '') {
            options.class = options.hasOwnProperty('class') ? options.class : '';
            options.class += ' ' + this._options.errorClass;
        }

        let errorOptions = {
            class:   options.hasOwnProperty('class') && typeof options.class === 'string' ? options.class : '',
            dismiss: options.hasOwnProperty('dismiss') ? !! options.dismiss : true,
        };

        formContainer.prepend(
            ejs.render(tpl['form-error.html'], {
                message: message,
                options: errorOptions,
            })
        );


        if ( ! options.hasOwnProperty('scroll') || options.scroll) {
            let scrollOffset = coreuiForm$1.getSetting('errorMessageScrollOffset');

            $('html,body').animate({
                scrollTop : formContainer.offset().top - scrollOffset
            }, 'fast');
        }
    },


    /**
     * Скрытие сообщения с ошибкой
     */
    hideError: function () {

        $('#coreui-form-' + this._options.id + ' > form > .coreui-form__error').remove();
    },


    /**
     * @param eventName
     * @param callback
     * @param context
     * @param singleExec
     */
    on: function(eventName, callback, context, singleExec) {
        if (typeof this._events[eventName] !== 'object') {
            this._events[eventName] = [];
        }
        this._events[eventName].push({
            context : context || this,
            callback: callback,
            singleExec: !! singleExec,
        });
    },


    /**
     * Удаление формы
     */
    destruct: function () {

        $('#coreui-form-' + this._options.id).remove();
        delete coreuiForm$1._instances[this.getId()];
    },


    /**
     * Инициализация поля
     * @param field
     * @return {object|null}
     * @private
     */
    initField: function (field) {

        if (typeof field !== 'object') {
            return null;
        }

        let type = field.hasOwnProperty('type') && typeof field.type === 'string' ? field.type : 'input';

        if (type === 'group') {
            return null;
        }

        if ( ! coreuiForm$1.fields.hasOwnProperty(type)) {
            type = 'input';
        }

        if (this._options.readonly) {
            field.readonly = true;
        }


        let fieldInstance = $.extend(true, {
            render:        function () {},
            renderContent: function () {},
            init:          function () {},
            getValue:      function () {},
            setValue:      function () {},
            getOptions:    function () {},
            show:          function () {},
            hide:          function () {},
            readonly:      function () {},
            validate:      function () {},
            isValid:       function () {},
        }, coreuiForm$1.fields[type]);

        fieldInstance.init(this, field, this._fieldsIndex++);

        this._fields.push(fieldInstance);

        return fieldInstance;
    },


    /**
     * Инициализация группы
     * @param group
     * @return {object|null}
     * @private
     */
    initGroup: function (group) {

        if (typeof group !== 'object') {
            return null;
        }

        let type = group.hasOwnProperty('type') && typeof group.type === 'string' ? group.type : '';

        if (type !== 'group') {
            return null;
        }

        let groupInstance = $.extend(true, {
            render:     function () {},
            init:       function () {},
            getOptions: function () {},
            expand:     function () {},
            collapse:   function () {},
        }, coreuiForm$1.fields[type]);

        groupInstance.init(this, group, this._groupsIndex++);

        this._groups.push(groupInstance);

        return groupInstance;
    },


    /**
     * Инициализация контролов
     * @param control
     * @return {object|null}
     * @private
     */
    initControl: function (control) {

        if (typeof control !== 'object') {
            return null;
        }

        let type = control.hasOwnProperty('type') && typeof control.type === 'string' ? control.type : null;

        if ( ! type || ! coreuiForm$1.controls.hasOwnProperty(type)) {
            return null;
        }

        if (type === 'submit' && this._options.readonly) {
            control.show = false;
        }


        let controlInstance = $.extend(true, {
            render:     function () {},
            init:       function () {},
            getOptions: function () {},
            show:       function () {},
            hide:       function () {},
        }, coreuiForm$1.controls[type]);

        controlInstance.init(this, control, this._controlsIndex++);

        this._controls.push(controlInstance);

        return controlInstance;
    },


    /**
     * Получение настроек языка
     * @private
     */
    getLang: function () {

        return coreuiForm$1.lang.hasOwnProperty(this._options.lang)
            ? coreuiForm$1.lang[this._options.lang]
            : coreuiForm$1.lang['ru'];
    },


    /**
     * @param name
     * @param context
     * @param params
     * @return {object}
     * @private
     */
    _trigger: function(name, context, params) {

        params = params || [];
        let results = [];

        if (this._events[name] instanceof Object && this._events[name].length > 0) {
            for (var i = 0; i < this._events[name].length; i++) {
                let callback = this._events[name][i].callback;

                context = context || this._events[name][i].context;

                results.push(
                    callback.apply(context, params)
                );

                if (this._events[name][i].singleExec) {
                    this._events[name].splice(i, 1);
                }
            }
        }

        return results;
    },


    /**
     * @param {object} control
     * @return {string}
     * @private
     */
    _renderControl: function (control) {

        let content = '';
        let type    = control.hasOwnProperty('type') && typeof control.type === 'string' ? control.type : 'text';

        if (coreuiForm$1.control.hasOwnProperty(type)) {
            content = coreuiForm$1.control[type].render(control);
        }

        return content;
    }
};

var coreuiForm$1 = {

    lang: {},
    fields: {},
    controls: {},

    _instances: {},
    _settings: {
        labelWidth: 200,
        lang: 'en',
        class: '',
        sendDataFormat: 'form',
        errorMessageScrollOffset: 70
    },


    /**
     * Создание экземпляра формы
     * @param {object} options
     * @returns {coreuiFormInstance}
     */
    create: function (options) {

        let instance = $.extend(true, {}, coreuiFormInstance);
        instance._init(options instanceof Object ? options : {});

        let formId = instance.getId();
        this._instances[formId] = instance;

        return instance;
    },


    /**
     * Получение экземпляра формы по id
     * @param {string} id
     * @returns {coreuiFormInstance|null}
     */
    get: function (id) {

        if ( ! this._instances.hasOwnProperty(id)) {
            return null;
        }

        if ($('#coreui-form-' + this._instances[id])[0]) {
            delete this._instances[id];
            return null;
        }

        return this._instances[id];
    },


    /**
     * Установка настроек
     * @param {object} settings
     */
    setSettings: function(settings) {

        this._settings = $.extend({}, this._settings, settings);
    },


    /**
     * Получение значения настройки
     * @param {string} name
     */
    getSetting: function(name) {

        let value = null;

        if (this._settings.hasOwnProperty(name)) {
            value = this._settings[name];
        }

        return value;
    }
};

coreuiForm$1.lang.ru = {
    "modal_select": "Выбрать",
    "modal_loading": "Загрузка...",
    "switch_yes": "Да",
    "switch_no": "Нет",
    "dataset_add": "Добавить",
    "date_months": ['Январь','Февраль','Март','Апрель','Май','Июнь', 'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    "date_week": "неделя",
    "send_error": "Произошла ошибка. Попробуйте снова или обратитесь к администратору",
    "required_field": "Обязательное поле",
    "repeat": "повторите",
    "change": "изменить",
    "cancel": "отмена"
};

coreuiForm$1.lang.en = {
    "modal_select": "Select",
    "modal_loading": "Loading...",
    "switch_yes": "Yes",
    "switch_no": "No",
    "dataset_add": "Add",
    "date_months": [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    "date_week": "week",
    "send_error": "An error has occurred. Please try again or contact your administrator",
    "required_field": "Required field",
    "repeat": "repeat",
    "change": "change",
    "cancel": "cancel"
};

coreuiForm$1.controls.button = {

    _form: null,
    _index: null,
    _options: {
        type: 'button',
        href: null,
        content: null,
        onClick: null,
        attr: {
            class: 'btn btn-sm btn-secondary'
        }
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object} options
     * @param {int} index
     */
    init: function (form, options, index) {

        this._options = $.extend({}, this._options, options);
        this._form    = form;
        this._index   = index;
        let that      = this;

        form.on('shown.coreui.form', function () {
            that._initEvents();
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function() {

        let attributes = [];
        let options    = this.getOptions();

        options.attr.type = 'button';

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['controls/button.html'], {
            control: this._options,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            },
        });
    },


    /**
     * Показ контрола
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._form.getId() + '-control-' + this._index).show(duration || 0);
    },


    /**
     * Скрытие контрола
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._form.getId() + '-control-' + this._index).hide(duration || 0);
    },


    /**
     *
     */
    lock: function () {

        let button = $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button');

        if ( ! button.find('.spinner-border')[0]) {
            button.prepend('<span class="spinner-border spinner-border-sm"></span> ');
        }
        if ( ! button.attr('disabled')) {
            button.attr('disabled', 'disabled');
        }
    },


    /**
     * Инициализация событий связанных с элементом управления
     */
    _initEvents: function () {

        let that = this;

        if (['function', 'string'].indexOf(typeof this._options.onClick) >= 0) {
            $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button')
                .click(function (event) {

                    if (typeof that._options.onClick === 'function') {
                        that._options.onClick(that._form, event);
                    } else {
                        let callback = coreuiFormUtils$1.getFunctionByName(that._options.onClick);

                        if (typeof callback === 'function') {
                            callback(that._form, event);
                        } else {
                            eval(that._options.onClick);
                        }
                    }
                });
        }
    }
};

coreuiForm$1.controls.custom = {

    _form: null,
    _index: null,
    _options: {
        type: 'custom',
        content: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object} options
     * @param {int} index
     */
    init: function (form, options, index) {

        this._options = $.extend({}, this._options, options);
        this._form   = form;
        this._index   = index;
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Показ контрола
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + form.getId() + '-control-' + this._index).show(duration || 0);
    },


    /**
     * Скрытие контрола
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + form.getId() + '-control-' + this._index).hide(duration || 0);
    },


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function() {

        return this._options.content;
    }
};

coreuiForm$1.controls.link = {

    _form: null,
    _index: null,
    _options: {
        type: 'link',
        href: null,
        content: null,
        onClick: null,
        attr: {
            class: 'btn btn-sm btn-link'
        }
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object} options
     * @param {int} index
     */
    init: function (form, options, index) {

        this._options = $.extend({}, this._options, options);
        this._form    = form;
        this._index   = index;
        let that      = this;

        form.on('shown.coreui.form', function () {
            that._initEvents();
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Показ контрола
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._form.getId() + '-control-' + this._index).show(duration || 0);
    },


    /**
     * Скрытие контрола
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._form.getId() + '-control-' + this._index).hide(duration || 0);
    },


    /**
     *
     */
    lock: function () {

        let button = $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button');

        if ( ! button.find('.spinner-border')[0]) {
            button.prepend('<span class="spinner-border spinner-border-sm"></span> ');
        }
        if ( ! button.attr('disabled')) {
            button.attr('disabled', 'disabled');
        }
    },


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function() {

        let attributes = [];
        let options    = this.getOptions();

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['controls/link.html'], {
            control: this._options,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            },
        });
    },


    /**
     * Инициализация событий связанных с элементом управления
     */
    _initEvents: function () {

        let that = this;

        if (['function', 'string'].indexOf(typeof this._options.onClick) >= 0) {
            $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > a')
                .click(function (event) {

                    if (typeof that._options.onClick === 'function') {
                        that._options.onClick(that._form, event);
                    } else {
                        let callback = coreuiFormUtils.getFunctionByName(that._options.onClick);

                        if (typeof callback === 'function') {
                            callback(that._form, event);
                        } else {
                            eval(that._options.onClick);
                        }
                    }
                });
        }
    }
};

coreuiForm$1.controls.submit = {

    _form: null,
    _index: null,
    _options: {
        type: 'submit',
        href: null,
        content: null,
        onClick: null,
        show: true,
        attr: {
            class: 'btn btn-sm btn-primary'
        }
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object} options
     * @param {int} index
     */
    init: function (form, options, index) {

        this._options = $.extend({}, this._options, options);
        this._form    = form;
        this._index   = index;
        let that      = this;

        form.on('shown.coreui.form', function () {
            that._initEvents();
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Показ контрола
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._form.getId() + '-control-' + this._index).show(duration || 0);
    },


    /**
     * Скрытие контрола
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._form.getId() + '-control-' + this._index).hide(duration || 0);
    },


    /**
     *
     */
    lock: function () {

        let button = $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button');

        if ( ! button.find('.spinner-border')[0]) {
            button.prepend('<span class="spinner-border spinner-border-sm"></span> ');
        }
        if ( ! button.attr('disabled')) {
            button.attr('disabled', 'disabled');
        }
    },


    /**
     *
     */
    unlock: function () {

        let button = $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button');

        button.find('.spinner-border').remove();
        button.removeAttr('disabled');
    },


    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function() {

        let attributes = [];
        let options    = this.getOptions();

        options.attr.type = 'submit';

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['controls/button.html'], {
            control: this._options,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            },
        });
    },


    /**
     * Инициализация событий связанных с элементом управления
     */
    _initEvents: function () {

        let that = this;

        if (['function', 'string'].indexOf(typeof this._options.onClick) >= 0) {
            $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button')
                .click(function (event) {

                    if (typeof that._options.onClick === 'function') {
                        that._options.onClick(that._form, event);
                    } else {
                        let callback = coreuiFormUtils.getFunctionByName(that._options.onClick);

                        if (typeof callback === 'function') {
                            callback(that._form, event);
                        } else {
                            eval(that._options.onClick);
                        }
                    }
                });
        }
    }
};

coreuiForm$1.fields.checkbox = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: [],
    _options: {
        type: 'checkbox',
        name: null,
        label: null,
        labelWidth: null,
        inline: false,
        outContent: null,
        description: null,
        errorText: null,
        options: [],
        fields: null,
        required: null,
        readonly: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils$1.hashCode();
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {object}
     */
    getValue: function () {

        if (this._options.readonly) {
            return this._value;

        } else {
            let values = [];

            $('.content-' + this._hash + ' input[type=checkbox]:checked').each(function () {
                values.push($(this).val());
            });

            return values;
        }
    },


    /**
     * Установка значений в поле
     * @param {object|null|string|number} value
     */
    setValue: function (value) {

        if (['string', 'number', 'object'].indexOf(typeof value) < 0) {
            return;
        }

        if (typeof value === 'object') {
            if (value !== null && ! Array.isArray(value)) {
                return;
            }

        } else {
            value = [ value ];
        }

        let that    = this;
        this._value = [];

        if (this._options.readonly) {
            $('.content-' + that._hash).empty();

            let fieldOptions = this.getOptions();

            if (fieldOptions.hasOwnProperty('options') &&
                typeof fieldOptions.options === 'object' &&
                Array.isArray(fieldOptions.options) &&
                Array.isArray(value)
            ) {
                let selectedItems = [];

                $.each(fieldOptions.options, function (key, option) {

                    if (option.hasOwnProperty('value')) {
                        $.each(value, function (key, val) {

                            if (option.value == val) {
                                if (option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0) {
                                    selectedItems.push(option.text);
                                }

                                that._value.push(val);
                                return false;
                            }
                        });
                    }
                });


                $('.content-' + that._hash).text(selectedItems.join(', '));
            }

        } else {
            $('.content-' + this._hash + ' input[type=radio]').prop('checked', false);

            if (Array.isArray(value)) {
                $('.content-' + this._hash + ' input[type=radio]').each(function (key, itemValue) {
                    $.each(value, function (key, val) {
                        if (val == $(itemValue).val()) {
                            $(itemValue).prop('checked', true);
                            that._value.push(val);

                            return false;
                        }
                    });
                });
            }
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let lastInput = $('.form-check:last-child', container);
        let inputs    = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            inputs.removeClass('is-invalid');
            inputs.removeClass('is-valid');

        } else if (isValid) {
            inputs.removeClass('is-invalid');
            inputs.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                lastInput.append('<div class="valid-feedback">' + text + '</div>');
            }

        } else {
            inputs.removeClass('is-valid');
            inputs.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                lastInput.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        if (this._options.required && ! this._options.readonly) {
            return this.getValue().length > 0;
        }

        return true;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: this._options,
            content: this.renderContent(),
            attachFields: attachFields,
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let that            = this;
        let checkboxOptions = [];
        let fieldOptions    = this.getOptions();
        let selectedItems   = [];

        if (fieldOptions.hasOwnProperty('options') &&
            typeof fieldOptions.options === 'object' &&
            Array.isArray(fieldOptions.options)
        ) {
            $.each(fieldOptions.options, function (key, option) {
                let attributes = [];
                let itemAttr = {
                    type: 'checkbox',
                    class: 'form-check-input'
                };
                let optionText = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
                    ? option.text
                    : '';

                if (fieldOptions.name) {
                    itemAttr.name = that._options.name;
                }

                if (fieldOptions.required) {
                    itemAttr.required = 'required';
                }

                $.each(option, function (name, value) {
                    if (name !== 'text') {
                        if (name === 'class') {
                            itemAttr[name] = itemAttr[name] + ' ' + value;
                        } else {
                            itemAttr[name] = value;
                        }
                    }
                });

                itemAttr.id = coreuiFormUtils$1.hashCode();

                if (typeof(that._value) === 'object' &&
                    Array.isArray(that._value)
                ) {
                    $.each(that._value, function (key, itemValue) {
                        if (itemValue == option.value) {
                            itemAttr.checked = 'checked';
                            if (option.hasOwnProperty('text') && option.text) {
                                selectedItems.push(option.text);
                            }
                            return false;
                        }
                    });

                } else if (that._value == option.value) {
                    if (option.hasOwnProperty('text') && option.text) {
                        selectedItems.push(option.text);
                    }
                    itemAttr.checked = 'checked';
                }

                $.each(itemAttr, function (name, value) {
                    attributes.push(name + '="' + value + '"');
                });


                checkboxOptions.push({
                    id: itemAttr.id,
                    text: optionText,
                    attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : ''
                });
            });
        }

        let value = typeof this._value === 'object' && Array.isArray(this._value)
            ? this._value.join(', ')
            : this._value;

        return ejs.render(tpl['fields/checkbox.html'], {
            field: fieldOptions,
            value: value,
            render: {
                options: checkboxOptions,
                selectedItems: selectedItems
            },
        });
    }
};

coreuiForm$1.fields.color = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'color',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            class: 'form-control form-control-color d-inline-block'
        },
        required: null,
        readonly: null,
        datalist: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils$1.hashCode();
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input').val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            $('.content-' + this._hash + ' input').val(value);
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let input     = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            input.removeClass('is-invalid');
            input.removeClass('is-valid');

        } else if (isValid) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        let input = $('.content-' + this._hash + ' input');

        if (input[0]) {
            return input.is(':valid');
        }

        return null;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields,
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    },


    /**
     *
     * @return {*}
     * @private
     */
    _renderContent: function () {

        let attributes   = [];
        let datalist     = [];
        let options      = this.getOptions();
        let datalistId   = coreuiFormUtils$1.hashCode();

        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }

        if (options.name) {
            options.attr.name = this._options.name;
        }

        options.attr.type  = options.type;
        options.attr.value = this._value;

        if (options.width) {
            options.attr = coreuiFormUtils$1.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }
        if (options.required) {
            options.attr.required = 'required';
        }


        if (options.hasOwnProperty('datalist') &&
            typeof options.datalist === 'object' &&
            Array.isArray(options.datalist)
        ) {
            options.attr.list = datalistId;

            $.each(options.datalist, function (key, itemAttributes) {
                let datalistAttr = [];

                $.each(itemAttributes, function (name, value) {
                    datalistAttr.push(name + '="' + value + '"');
                });

                datalist.push({
                    attr: datalistAttr.length > 0 ? (' ' + datalistAttr.join(' ')) : ''
                });
            });
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['fields/color.html'], {
            field: options,
            datalistId: datalistId,
            value: this._value,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                datalist: datalist,
            },
        });
    },


    /**
     *
     * @return {*}
     * @private
     */
    _renderContentReadonly: function () {

        let options = this.getOptions();

        return ejs.render(tpl['fields/color.html'], {
            field: options,
            value: this._value
        });
    }
};

coreuiForm$1.fields.custom = {

    _id: '',
    _hash: '',
    _form: null,
    _value: null,
    _options: {
        type: 'custom',
        label: null,
        labelWidth: null,
        width: null,
        content: '',
        outContent: null,
        description: null,
        required: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
        this._hash    = coreuiFormUtils$1.hashCode();
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения из поля
     */
    getValue: function () {

    },


    /**
     * Установка значения в поле
     * @param {object} value
     */
    setValue: function (value) {

    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let options         = this.getOptions();
        let content         = '';
        let alloyComponents = [
            'coreui.table',
            'coreui.layout',
            'coreui.panel',
            'coreui.tabs',
            'coreui.info',
            'coreui.chart',
        ];

        if (typeof options.content === 'string') {
            content = options.content;

        } else if (options.content instanceof Object) {
            if ( ! Array.isArray(options.content)) {
                options.content = [ options.content ];
            }

            let components = [];

            for (let i = 0; i < options.content.length; i++) {
                if (typeof options.content[i] === 'string') {
                    components.push(options.content[i]);

                } else if ( ! Array.isArray(options.content[i]) &&
                        options.content[i].hasOwnProperty('component') &&
                        alloyComponents.indexOf(options.content[i].component) >= 0
                ) {
                    let name = options.content[i].component.split('.')[1];

                    if (CoreUI.hasOwnProperty(name) &&
                        typeof CoreUI[name] === "object" &&
                        CoreUI[name] !== null &&
                        ! Array.isArray(CoreUI[name])
                    ) {
                        let instance = CoreUI[name].create(options.content[i]);
                        components.push(instance.render());

                        this._form.on('shown.coreui.form', instance.initEvents, instance, true);
                    }
                }
            }

            content = components.join('');
        }


        return ejs.render(tpl['fields/custom.html'], {
            content: content
        });
    }
};

coreuiForm$1.fields.dataset = {

    _id: '',
    _hash: '',
    _form: null,
    _value: [],
    _renderOptions: [],
    _options: {
        type: 'dataset',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            class: 'form-select form-select-sm d-inline-block'
        },
        required: null,
        readonly: null,
        datalist: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
        this._hash    = coreuiFormUtils$1.hashCode();

        let that = this;

        form.on('shown.coreui.form', function () {
            if ( ! that._options.readonly) {
                that._initEvents();
            }
        });

        if (options.hasOwnProperty('options') &&
            typeof options.options === 'object' &&
            Array.isArray(options.options)
        ) {
            $.each(options.options, function (key, option) {
                let name = option.hasOwnProperty('name') && ['string', 'number'].indexOf(typeof (option.name)) >= 0
                    ? option.name
                    : '';
                let type = option.hasOwnProperty('type') && typeof (option.type) === 'string'
                    ? option.type
                    : 'text';
                let attributes = option.hasOwnProperty('attr') && typeof (option.attr) === 'object' && ! Array.isArray(option.attr)
                    ? option.attr
                    : {};
                let items = option.hasOwnProperty('items') && typeof (option.items) === 'object' && Array.isArray(option.items)
                    ? option.items
                    : [];
                let valueY = option.hasOwnProperty('valueY') && ['string', 'numeric'].indexOf(typeof (option.valueY)) >= 0
                    ? option.valueY
                    : 'Y';
                let valueN = option.hasOwnProperty('valueN') && ['string', 'numeric'].indexOf(typeof (option.valueN)) >= 0
                    ? option.valueN
                    : 'N';

                if (name) {
                    attributes.name = name;
                }
                if (options.required) {
                    attributes.required = 'required';
                }

                if (type === 'select') {
                    attributes.class = attributes.hasOwnProperty('class')
                        ? 'form-select form-select-sm ' + attributes.class
                        : 'form-select form-select-sm';

                } else if (type === 'switch') {
                    attributes.class = attributes.hasOwnProperty('class')
                        ? 'form-check-input ' + attributes.class
                        : 'form-check-input';

                    attributes.type = 'checkbox';
                    attributes.value = valueY;

                } else {
                    attributes.class = attributes.hasOwnProperty('class')
                        ? 'form-control form-control-sm ' + attributes.class
                        : 'form-control form-control-sm';

                    attributes.type = type;
                }


                that._renderOptions.push({
                    type  : type,
                    name  : name,
                    attr  : attributes,
                    items : items,
                    valueY: valueY,
                    valueN: valueN,
                });
            });
        }
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );

        if ( ! this._options.readonly) {
            this._initEvents();
        }
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {array}
     */
    getValue: function () {

        if (this._options.readonly) {
            return this._value;

        } else {
            let container = $('.content-' + this._hash);
            let data      = [];

            $('.coreui-form__field-dataset-list .coreui-form__field-dataset-item', container).each(function () {
                let items = {};

                $.each($(this).find('input, select').serializeArray(), function (key, item) {
                    if (item.name) {
                        items[item.name] = item.value;
                    }
                });

                data.push(items);
            });

            return data;
        }
    },


    /**
     * Установка значения в поле
     * @param {object} value
     */
    setValue: function (value) {

        if (typeof value !== 'object' ||
            Array.isArray(value) ||
            value === null
        ) {
            return;
        }

        this._value.push(value);

        if (this._options.readonly) {
            $('.content-' + this._hash + ' .coreui-form__field-dataset-list').append(
                this._renderRowReadonly(value)
            );
        } else {
            this._eventAdd(value);
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);

        container.find('.text-success').remove();
        container.find('.text-danger').remove();

        if (isValid === null) {
            return;
        }

        if (isValid) {
            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-success">' + text + '</div>');
            }

        } else {
            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-danger">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        if (this._options.required && ! this._options.readonly) {
            return this.getValue().length > 0;
        }

        return true;
    },


    /**
     * Удаление всех строк
     */
    removeItems: function () {

        $('#coreui-form-' + this._id + ' .content-' + this._hash + ' .coreui-form__field-dataset-list').empty();
    },


    /**
     * Удаление строки по id
     * @param {int} itemId
     */
    removeItem: function (itemId) {

        let element = '#coreui-form-' + this._id + ' .content-' + this._hash;

        $('#' + itemId).hide('fast', function () {
            $('#' + itemId).remove();

            if ($(element + ' .coreui-form__field-dataset-item').length === 0) {
                $(element + ' .coreui-form__field-dataset-container').hide();
            }
        });
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    _renderContent: function () {

        let options = this.getOptions();
        let rows    = [];
        let headers = [];
        let that    = this;


        if (options.hasOwnProperty('options') &&
            typeof options.options === 'object' &&
            Array.isArray(options.options)
        ) {
            // Заголовок
            $.each(options.options, function (key, option) {
                let title = option.hasOwnProperty('title') && ['string', 'numeric'].indexOf(typeof(option.title)) >= 0
                    ? option.title
                    : '';

                headers.push({
                    title: title
                });
            });

            // Строки
            if (typeof this._value === 'object' && Array.isArray(this._value)) {
                $.each(this._value, function (key, row) {
                    if (typeof row !== 'object' || Array.isArray(row)) {
                        return;
                    }

                    rows.push(that._renderRow(row));
                });
            }
        }

        return ejs.render(tpl['fields/dataset.html'], {
            field: options,
            value: this._value !== null ? this._value : '',
            lang: this._form.getLang(),
            render: {
                headers: headers,
                rows: rows,
            },
        });
    },


    /**
     *
     * @private
     */
    _renderContentReadonly: function () {

        let options = this.getOptions();
        let rows    = [];
        let headers = [];
        let that    = this;


        if (options.hasOwnProperty('options') &&
            typeof options.options === 'object' &&
            Array.isArray(options.options)
        ) {
            // Заголовок
            $.each(options.options, function (key, option) {
                let title = option.hasOwnProperty('title') && ['string', 'numeric'].indexOf(typeof(option.title)) >= 0
                    ? option.title
                    : '';

                headers.push({
                    title: title
                });
            });

            // Строки
            if (typeof this._value === 'object' && Array.isArray(this._value)) {
                $.each(this._value, function (key, row) {
                    if (typeof row !== 'object' || Array.isArray(row)) {
                        return;
                    }

                    rows.push(that._renderRowReadonly(row));
                });
            }
        }

        return ejs.render(tpl['fields/dataset.html'], {
            field: options,
            value: this._value !== null ? this._value : '',
            lang: this._form.getLang(),
            render: {
                headers: headers,
                rows: rows,
            },
        });
    },


    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        let that    = this;
        let element = '#coreui-form-' + this._id + ' .content-' + this._hash;

        // Кнопка удаления
        $(element + ' .btn-dataset-remove').click(function () {
            that.removeItem($(this).data('item-id'));
        });

        // Кнопка добавления
        $(element + ' .btn-dataset-add').click(function () {
            that._eventAdd();
        });
    },


    /**
     * Событие добавления
     */
    _eventAdd: function (row) {

        let that    = this;
        let element = '#coreui-form-' + this._id + ' .content-' + this._hash;
        row = row || {};

        if ($(element + ' .coreui-form__field-dataset-item').length === 0) {
            $(element + ' .coreui-form__field-dataset-container').show();
        }

        $(element + ' .coreui-form__field-dataset-list').append(this._renderRow(row));
        $(element + ' .coreui-form__field-dataset-item:last-child .btn-dataset-remove').click(function () {
            that.removeItem($(this).data('item-id'));
        });
    },


    /**
     * Формирование строки
     * @param {object} row
     * @private
     */
    _renderRow: function (row) {

        let rowOptions  = [];
        let itemOptions = [];

        $.each(this._renderOptions, function (key, option) {

            let cellValue = row.hasOwnProperty(option.name) ? row[option.name] : '';

            if (option.type === 'select') {
                $.each(option.items, function (key, item) {
                    let title = item.hasOwnProperty('title') && ['string', 'numeric'].indexOf(typeof(item.title)) >= 0
                        ? item.title
                        : '';
                    let itemValue = item.hasOwnProperty('value') && ['string', 'numeric'].indexOf(typeof(item.value)) >= 0
                        ? item.value
                        : '';
                    let itemAttr = {};


                    $.each(item, function (name, value) {
                        if (name !== 'title') {
                            itemAttr[name] = value;
                        }
                    });


                    if (typeof(cellValue) === 'object' && Array.isArray(cellValue)) {
                        $.each(cellValue, function (key, cellItemValue) {
                            if (cellItemValue == itemValue) {
                                itemAttr.selected = 'selected';
                                return false;
                            }
                        });

                    } else if (cellValue == item.value) {
                        itemAttr.selected = 'selected';
                    }

                    let attributes = [];
                    $.each(itemAttr, function (name, value) {
                        attributes.push(name + '="' + value + '"');
                    });

                    itemOptions.push({
                        attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                        title: title
                    });
                });

            } else if (option.type === 'switch') {
                if (cellValue == option.valueY) {
                    option.attr.checked = 'checked';
                }

            } else {
                if (['string', 'number'].indexOf(typeof(cellValue)) >= 0) {
                    option.attr.value = cellValue !== null ? cellValue : '';
                }
            }

            let attributes = [];

            $.each(option.attr, function (name, value) {
                attributes.push(name + '="' + value + '"');
            });

            rowOptions.push({
                type: option.type,
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                items: itemOptions
            });
        });

        return ejs.render(tpl['fields/dataset-row.html'], {
            hashItem: coreuiFormUtils$1.hashCode(),
            options: rowOptions,
        });
    },


    /**
     * Формирование строки
     * @param {object} row
     * @private
     */
    _renderRowReadonly: function (row) {

        let rowOptions = [];
        let lang       = this._form.getLang();

        $.each(this._renderOptions, function (key, option) {

            let optionValue = '';
            let cellValue   = row.hasOwnProperty(option.name) ? row[option.name] : '';

            if (option.type === 'select') {
                let itemOptions = [];

                $.each(option.items, function (key, item) {
                    let title = item.hasOwnProperty('title') && ['string', 'numeric'].indexOf(typeof(item.title)) >= 0
                        ? item.title
                        : '';
                    let itemValue = item.hasOwnProperty('value') && ['string', 'numeric'].indexOf(typeof(item.value)) >= 0
                        ? item.value
                        : '';

                    if (typeof(cellValue) === 'object' && Array.isArray(cellValue)) {
                        $.each(cellValue, function (key, cellItemValue) {
                            if (cellItemValue == itemValue) {
                                itemOptions.push(itemValue);
                                return false;
                            }
                        });

                    } else if (cellValue == item.value) {
                        itemOptions.push(cellValue);
                    }
                });

            } else if (option.type === 'switch') {
                let valueY = 'Y';

                if (option.hasOwnProperty('valueY')) {
                    valueY = option.valueY;
                }

                optionValue = cellValue == valueY
                    ? lang.switch_yes
                    : lang.switch_no;

            } else {
                if (['string', 'number'].indexOf(typeof(cellValue)) >= 0) {
                    optionValue = cellValue;

                    switch (option.type) {
                        case 'date':           optionValue = coreuiFormUtils$1.formatDate(optionValue); break;
                        case 'datetime-local': optionValue = coreuiFormUtils$1.formatDateTime(optionValue); break;
                        case 'month':          optionValue = coreuiFormUtils$1.formatDateMonth(optionValue, lang); break;
                        case 'week':           optionValue = coreuiFormUtils$1.formatDateWeek(optionValue, lang); break;
                        default: optionValue = cellValue;
                    }
                }
            }

            rowOptions.push({
                value: optionValue
            });
        });

        return ejs.render(tpl['fields/dataset-row-readonly.html'], {
            options: rowOptions,
        });
    }
};

coreuiForm$1.fields.group = {

    _id: '',
    _form: null,
    _index: 0,
    _options: {
        type: 'group',
        label: '',
        show: true,
        showCollapsible: true,
        fields: [],
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-group-" + index;
        this._options = $.extend(true, {}, this._options, options);

        let that = this;

        form.on('shown.coreui.form', function () {
            that._initEvents();
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options, options);
    },


    /**
     * Скрытие группы
     * @param {int} duration
     */
    collapse: function (duration) {

        let container = '#coreui-form-' + this._id;

        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').removeClass('bi-chevron-down');
        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').addClass('bi-chevron-right');

        $(container + ' .coreui-form__group_content').slideUp(duration);
    },


    /**
     * Показ группы
     * @param {int} duration
     */
    expand: function (duration) {

        let container = '#coreui-form-' + this._id;

        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').removeClass('bi-chevron-right');
        $(container + ' > .coreui-form__group_label .btn-collapsible .bi').addClass('bi-chevron-down');

        $(container + ' .coreui-form__group_content').slideDown(duration);
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        return ejs.render(tpl['form-field-group.html'], {
            id: this._id,
            form:  this._form,
            group: this._options,
            content: this.renderContent(),
        });
    },


    /**
     * Формирование контента поля
     * @return {string}
     */
    renderContent: function () {

        let fields = [];
        let that   = this;

        $.each(this._options.fields, function (key, field) {

            let fieldInstance = that._form.initField(field);

            if (typeof fieldInstance !== 'object') {
                return;
            }

            fields.push(fieldInstance.render());
        });

        return fields.join('');
    },



    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        if (this._options.showCollapsible) {
            let that      = this;
            let container = '#coreui-form-' + this._id;

            $(container + ' > .coreui-form__group_label .btn-collapsible').click(function () {

                if ($(container + ' > .coreui-form__group_content').is(':visible')) {
                    that.collapse(80);
                } else {
                    that.expand(80);
                }
            });
        }
    }
};

coreuiForm$1.fields.hidden = {

    _id: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'hidden',
        name: null,
        attr: {},
        required: null,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('#coreui-form-' + this._id).val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if ( ! this._options.readonly) {
            $('#coreui-form-' + this._id).val(value);
        }
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        return ejs.render(tpl['form-field-content.html'], {
            content: this.renderContent(),
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let attributes = [];
        let options    = this.getOptions();

        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }


        options.attr.id = 'coreui-form-' + this._id;

        if (options.name) {
            options.attr.name = options.name;
        }

        options.attr.type  = 'hidden';
        options.attr.value = this._value !== null ? this._value : '';


        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['fields/hidden.html'], {
            value: this._value !== null ? this._value : '',
            field: options,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
            },
        });
    }
};

coreuiForm$1.fields.input = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'text',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            class: 'form-control form-control-sm d-inline-block'
        },
        required: null,
        invalidText: null,
        validText: null,
        readonly: null,
        datalist: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils$1.hashCode();
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input').val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            $('.content-' + this._hash + ' input').val(value);
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let input     = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            input.removeClass('is-invalid');
            input.removeClass('is-valid');

        } else if (isValid) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid: function () {

        let input = $('.content-' + this._hash + ' input');

        if (input[0]) {
            return input.is(':valid');
        }

        return null;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form: this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    },


    /**
     *
     * @private
     */
    _renderContent: function () {

        let attributes   = [];
        let datalist     = [];
        let options      = this.getOptions();
        let datalistId   = coreuiFormUtils$1.hashCode();

        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }

        if (options.name) {
            options.attr.name = this._options.name;
        }

        options.attr.type  = options.type;
        options.attr.value = this._value !== null ? this._value : '';

        if (options.width) {
            options.attr = coreuiFormUtils$1.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }

        if (options.required) {
            options.attr.required = 'required';
        }


        if (options.hasOwnProperty('datalist') &&
            typeof options.datalist === 'object' &&
            Array.isArray(options.datalist)
        ) {
            options.attr.list = datalistId;

            $.each(options.datalist, function (key, itemAttributes) {
                let datalistAttr = [];

                $.each(itemAttributes, function (name, value) {
                    datalistAttr.push(name + '="' + value + '"');
                });

                datalist.push({
                    attr: datalistAttr.length > 0 ? (' ' + datalistAttr.join(' ')) : ''
                });
            });
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['fields/input.html'], {
            field: options,
            datalistId: datalistId,
            value: this._value !== null ? this._value : '',
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                datalist: datalist
            },
        });
    },


    /**
     *
     * @private
     */
    _renderContentReadonly: function () {

        let options = this.getOptions();
        let type    = 'text';
        let value   = this._value;
        let lang    = this._form.getLang();

        if (options.hasOwnProperty('type') && typeof options.type === 'string') {
            type = options.type;
        }

        try {
            switch (type) {
                case 'date':           value = coreuiFormUtils$1.formatDate(value); break;
                case 'datetime-local': value = coreuiFormUtils$1.formatDateTime(value); break;
                case 'month':          value = coreuiFormUtils$1.formatDateMonth(value, lang); break;
                case 'week':           value = coreuiFormUtils$1.formatDateWeek(value, lang); break;
            }

        } catch (e) {
            console.error(e);
            // ignore
        }

        return ejs.render(tpl['fields/input.html'], {
            field: options,
            value: value,
            hash: this._hash
        });
    }
};

/**
 * jquery.mask.js
 * @version: v1.14.16
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at github.com/igorescobar/jQuery-Mask-Plugin
 *
 * Copyright (c) 2012 Igor Escobar http://igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* jshint laxbreak: true */
/* jshint maxcomplexity:17 */
/* global define */

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js
(function (factory, jQuery, Zepto) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object' && typeof Meteor === 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }

}(function ($) {
    'use strict';

    var Mask = function (el, mask, options) {

        var p = {
            invalid: [],
            getCaret: function () {
                try {
                    var sel,
                        pos = 0,
                        ctrl = el.get(0),
                        dSel = document.selection,
                        cSelStart = ctrl.selectionStart;

                    // IE Support
                    if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                        sel = dSel.createRange();
                        sel.moveStart('character', -p.val().length);
                        pos = sel.text.length;
                    }
                    // Firefox support
                    else if (cSelStart || cSelStart === '0') {
                        pos = cSelStart;
                    }

                    return pos;
                } catch (e) {}
            },
            setCaret: function(pos) {
                try {
                    if (el.is(':focus')) {
                        var range, ctrl = el.get(0);

                        // Firefox, WebKit, etc..
                        if (ctrl.setSelectionRange) {
                            ctrl.setSelectionRange(pos, pos);
                        } else { // IE
                            range = ctrl.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }
                } catch (e) {}
            },
            events: function() {
                el
                .on('keydown.mask', function(e) {
                    el.data('mask-keycode', e.keyCode || e.which);
                    el.data('mask-previus-value', el.val());
                    el.data('mask-previus-caret-pos', p.getCaret());
                    p.maskDigitPosMapOld = p.maskDigitPosMap;
                })
                .on($.jMaskGlobals.useInput ? 'input.mask' : 'keyup.mask', p.behaviour)
                .on('paste.mask drop.mask', function() {
                    setTimeout(function() {
                        el.keydown().keyup();
                    }, 100);
                })
                .on('change.mask', function(){
                    el.data('changed', true);
                })
                .on('blur.mask', function(){
                    if (oldValue !== p.val() && !el.data('changed')) {
                        el.trigger('change');
                    }
                    el.data('changed', false);
                })
                // it's very important that this callback remains in this position
                // otherwhise oldValue it's going to work buggy
                .on('blur.mask', function() {
                    oldValue = p.val();
                })
                // select all text on focus
                .on('focus.mask', function (e) {
                    if (options.selectOnFocus === true) {
                        $(e.target).select();
                    }
                })
                // clear the value if it not complete the mask
                .on('focusout.mask', function() {
                    if (options.clearIfNotMatch && !regexMask.test(p.val())) {
                       p.val('');
                   }
                });
            },
            getRegexMask: function() {
                var maskChunks = [], translation, pattern, optional, recursive, oRecursive, r;

                for (var i = 0; i < mask.length; i++) {
                    translation = jMask.translation[mask.charAt(i)];

                    if (translation) {

                        pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                        optional = translation.optional;
                        recursive = translation.recursive;

                        if (recursive) {
                            maskChunks.push(mask.charAt(i));
                            oRecursive = {digit: mask.charAt(i), pattern: pattern};
                        } else {
                            maskChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
                        }

                    } else {
                        maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                    }
                }

                r = maskChunks.join('');

                if (oRecursive) {
                    r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                         .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
                }

                return new RegExp(r);
            },
            destroyEvents: function() {
                el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
            },
            val: function(v) {
                var isInput = el.is('input'),
                    method = isInput ? 'val' : 'text',
                    r;

                if (arguments.length > 0) {
                    if (el[method]() !== v) {
                        el[method](v);
                    }
                    r = el;
                } else {
                    r = el[method]();
                }

                return r;
            },
            calculateCaretPosition: function(oldVal) {
                var newVal = p.getMasked(),
                    caretPosNew = p.getCaret();
                if (oldVal !== newVal) {
                    var caretPosOld = el.data('mask-previus-caret-pos') || 0,
                        newValL = newVal.length,
                        oldValL = oldVal.length,
                        maskDigitsBeforeCaret = 0,
                        maskDigitsAfterCaret = 0,
                        maskDigitsBeforeCaretAll = 0,
                        maskDigitsBeforeCaretAllOld = 0,
                        i = 0;

                    for (i = caretPosNew; i < newValL; i++) {
                        if (!p.maskDigitPosMap[i]) {
                            break;
                        }
                        maskDigitsAfterCaret++;
                    }

                    for (i = caretPosNew - 1; i >= 0; i--) {
                        if (!p.maskDigitPosMap[i]) {
                            break;
                        }
                        maskDigitsBeforeCaret++;
                    }

                    for (i = caretPosNew - 1; i >= 0; i--) {
                        if (p.maskDigitPosMap[i]) {
                            maskDigitsBeforeCaretAll++;
                        }
                    }

                    for (i = caretPosOld - 1; i >= 0; i--) {
                        if (p.maskDigitPosMapOld[i]) {
                            maskDigitsBeforeCaretAllOld++;
                        }
                    }

                    // if the cursor is at the end keep it there
                    if (caretPosNew > oldValL) {
                      caretPosNew = newValL * 10;
                    } else if (caretPosOld >= caretPosNew && caretPosOld !== oldValL) {
                        if (!p.maskDigitPosMapOld[caretPosNew])  {
                          var caretPos = caretPosNew;
                          caretPosNew -= maskDigitsBeforeCaretAllOld - maskDigitsBeforeCaretAll;
                          caretPosNew -= maskDigitsBeforeCaret;
                          if (p.maskDigitPosMap[caretPosNew])  {
                            caretPosNew = caretPos;
                          }
                        }
                    }
                    else if (caretPosNew > caretPosOld) {
                        caretPosNew += maskDigitsBeforeCaretAll - maskDigitsBeforeCaretAllOld;
                        caretPosNew += maskDigitsAfterCaret;
                    }
                }
                return caretPosNew;
            },
            behaviour: function(e) {
                e = e || window.event;
                p.invalid = [];

                var keyCode = el.data('mask-keycode');

                if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
                    var newVal = p.getMasked(),
                        caretPos = p.getCaret(),
                        oldVal = el.data('mask-previus-value') || '';

                    // this is a compensation to devices/browsers that don't compensate
                    // caret positioning the right way
                    setTimeout(function() {
                      p.setCaret(p.calculateCaretPosition(oldVal));
                    }, $.jMaskGlobals.keyStrokeCompensation);

                    p.val(newVal);
                    p.setCaret(caretPos);
                    return p.callbacks(e);
                }
            },
            getMasked: function(skipMaskChars, val) {
                var buf = [],
                    value = val === undefined ? p.val() : val + '',
                    m = 0, maskLen = mask.length,
                    v = 0, valLen = value.length,
                    offset = 1, addMethod = 'push',
                    resetPos = -1,
                    maskDigitCount = 0,
                    maskDigitPosArr = [],
                    lastMaskChar,
                    check;

                if (options.reverse) {
                    addMethod = 'unshift';
                    offset = -1;
                    lastMaskChar = 0;
                    m = maskLen - 1;
                    v = valLen - 1;
                    check = function () {
                        return m > -1 && v > -1;
                    };
                } else {
                    lastMaskChar = maskLen - 1;
                    check = function () {
                        return m < maskLen && v < valLen;
                    };
                }

                var lastUntranslatedMaskChar;
                while (check()) {
                    var maskDigit = mask.charAt(m),
                        valDigit = value.charAt(v),
                        translation = jMask.translation[maskDigit];

                    if (translation) {
                        if (valDigit.match(translation.pattern)) {
                            buf[addMethod](valDigit);
                             if (translation.recursive) {
                                if (resetPos === -1) {
                                    resetPos = m;
                                } else if (m === lastMaskChar && m !== resetPos) {
                                    m = resetPos - offset;
                                }

                                if (lastMaskChar === resetPos) {
                                    m -= offset;
                                }
                            }
                            m += offset;
                        } else if (valDigit === lastUntranslatedMaskChar) {
                            // matched the last untranslated (raw) mask character that we encountered
                            // likely an insert offset the mask character from the last entry; fall
                            // through and only increment v
                            maskDigitCount--;
                            lastUntranslatedMaskChar = undefined;
                        } else if (translation.optional) {
                            m += offset;
                            v -= offset;
                        } else if (translation.fallback) {
                            buf[addMethod](translation.fallback);
                            m += offset;
                            v -= offset;
                        } else {
                          p.invalid.push({p: v, v: valDigit, e: translation.pattern});
                        }
                        v += offset;
                    } else {
                        if (!skipMaskChars) {
                            buf[addMethod](maskDigit);
                        }

                        if (valDigit === maskDigit) {
                            maskDigitPosArr.push(v);
                            v += offset;
                        } else {
                            lastUntranslatedMaskChar = maskDigit;
                            maskDigitPosArr.push(v + maskDigitCount);
                            maskDigitCount++;
                        }

                        m += offset;
                    }
                }

                var lastMaskCharDigit = mask.charAt(lastMaskChar);
                if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
                    buf.push(lastMaskCharDigit);
                }

                var newVal = buf.join('');
                p.mapMaskdigitPositions(newVal, maskDigitPosArr, valLen);
                return newVal;
            },
            mapMaskdigitPositions: function(newVal, maskDigitPosArr, valLen) {
              var maskDiff = options.reverse ? newVal.length - valLen : 0;
              p.maskDigitPosMap = {};
              for (var i = 0; i < maskDigitPosArr.length; i++) {
                p.maskDigitPosMap[maskDigitPosArr[i] + maskDiff] = 1;
              }
            },
            callbacks: function (e) {
                var val = p.val(),
                    changed = val !== oldValue,
                    defaultArgs = [val, e, el, options],
                    callback = function(name, criteria, args) {
                        if (typeof options[name] === 'function' && criteria) {
                            options[name].apply(this, args);
                        }
                    };

                callback('onChange', changed === true, defaultArgs);
                callback('onKeyPress', changed === true, defaultArgs);
                callback('onComplete', val.length === mask.length, defaultArgs);
                callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
            }
        };

        el = $(el);
        var jMask = this, oldValue = p.val(), regexMask;

        mask = typeof mask === 'function' ? mask(p.val(), undefined, el,  options) : mask;

        // public methods
        jMask.mask = mask;
        jMask.options = options;
        jMask.remove = function() {
            var caret = p.getCaret();
            if (jMask.options.placeholder) {
                el.removeAttr('placeholder');
            }
            if (el.data('mask-maxlength')) {
                el.removeAttr('maxlength');
            }
            p.destroyEvents();
            p.val(jMask.getCleanVal());
            p.setCaret(caret);
            return el;
        };

        // get value without mask
        jMask.getCleanVal = function() {
           return p.getMasked(true);
        };

        // get masked value without the value being in the input or element
        jMask.getMaskedVal = function(val) {
           return p.getMasked(false, val);
        };

       jMask.init = function(onlyMask) {
            onlyMask = onlyMask || false;
            options = options || {};

            jMask.clearIfNotMatch  = $.jMaskGlobals.clearIfNotMatch;
            jMask.byPassKeys       = $.jMaskGlobals.byPassKeys;
            jMask.translation      = $.extend({}, $.jMaskGlobals.translation, options.translation);

            jMask = $.extend(true, {}, jMask, options);

            regexMask = p.getRegexMask();

            if (onlyMask) {
                p.events();
                p.val(p.getMasked());
            } else {
                if (options.placeholder) {
                    el.attr('placeholder' , options.placeholder);
                }

                // this is necessary, otherwise if the user submit the form
                // and then press the "back" button, the autocomplete will erase
                // the data. Works fine on IE9+, FF, Opera, Safari.
                if (el.data('mask')) {
                  el.attr('autocomplete', 'off');
                }

                // detect if is necessary let the user type freely.
                // for is a lot faster than forEach.
                for (var i = 0, maxlength = true; i < mask.length; i++) {
                    var translation = jMask.translation[mask.charAt(i)];
                    if (translation && translation.recursive) {
                        maxlength = false;
                        break;
                    }
                }

                if (maxlength) {
                    el.attr('maxlength', mask.length).data('mask-maxlength', true);
                }

                p.destroyEvents();
                p.events();

                var caret = p.getCaret();
                p.val(p.getMasked());
                p.setCaret(caret);
            }
        };

        jMask.init(!el.is('input'));
    };

    $.maskWatchers = {};
    var HTMLAttributes = function () {
        var input = $(this),
            options = {},
            prefix = 'data-mask-',
            mask = input.attr('data-mask');

        if (input.attr(prefix + 'reverse')) {
            options.reverse = true;
        }

        if (input.attr(prefix + 'clearifnotmatch')) {
            options.clearIfNotMatch = true;
        }

        if (input.attr(prefix + 'selectonfocus') === 'true') {
           options.selectOnFocus = true;
        }

        if (notSameMaskObject(input, mask, options)) {
            return input.data('mask', new Mask(this, mask, options));
        }
    },
    notSameMaskObject = function(field, mask, options) {
        options = options || {};
        var maskObject = $(field).data('mask'),
            stringify = JSON.stringify,
            value = $(field).val() || $(field).text();
        try {
            if (typeof mask === 'function') {
                mask = mask(value);
            }
            return typeof maskObject !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
        } catch (e) {}
    },
    eventSupported = function(eventName) {
        var el = document.createElement('div'), isSupported;

        eventName = 'on' + eventName;
        isSupported = (eventName in el);

        if ( !isSupported ) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] === 'function';
        }
        el = null;

        return isSupported;
    };

    $.fn.mask = function(mask, options) {
        options = options || {};
        var selector = this.selector,
            globals = $.jMaskGlobals,
            interval = globals.watchInterval,
            watchInputs = options.watchInputs || globals.watchInputs,
            maskFunction = function() {
                if (notSameMaskObject(this, mask, options)) {
                    return $(this).data('mask', new Mask(this, mask, options));
                }
            };

        $(this).each(maskFunction);

        if (selector && selector !== '' && watchInputs) {
            clearInterval($.maskWatchers[selector]);
            $.maskWatchers[selector] = setInterval(function(){
                $(document).find(selector).each(maskFunction);
            }, interval);
        }
        return this;
    };

    $.fn.masked = function(val) {
        return this.data('mask').getMaskedVal(val);
    };

    $.fn.unmask = function() {
        clearInterval($.maskWatchers[this.selector]);
        delete $.maskWatchers[this.selector];
        return this.each(function() {
            var dataMask = $(this).data('mask');
            if (dataMask) {
                dataMask.remove().removeData('mask');
            }
        });
    };

    $.fn.cleanVal = function() {
        return this.data('mask').getCleanVal();
    };

    $.applyDataMask = function(selector) {
        selector = selector || $.jMaskGlobals.maskElements;
        var $selector = (selector instanceof $) ? selector : $(selector);
        $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
    };

    var globals = {
        maskElements: 'input,td,span,div',
        dataMaskAttr: '*[data-mask]',
        dataMask: true,
        watchInterval: 300,
        watchInputs: true,
        keyStrokeCompensation: 10,
        // old versions of chrome dont work great with input event
        useInput: !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) && eventSupported('input'),
        watchDataMask: false,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            '0': {pattern: /\d/},
            '9': {pattern: /\d/, optional: true},
            '#': {pattern: /\d/, recursive: true},
            'A': {pattern: /[a-zA-Z0-9]/},
            'S': {pattern: /[a-zA-Z]/}
        }
    };

    $.jMaskGlobals = $.jMaskGlobals || {};
    globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

    // looking for inputs with data-mask attribute
    if (globals.dataMask) {
        $.applyDataMask();
    }

    setInterval(function() {
        if ($.jMaskGlobals.watchDataMask) {
            $.applyDataMask();
        }
    }, globals.watchInterval);
}, window.jQuery, window.Zepto));

coreuiForm$1.fields.mask = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'mask',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            class: 'form-control form-control-sm d-inline-block'
        },
        required: null,
        readonly: null,
        datalist: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
        this._hash    = coreuiFormUtils$1.hashCode();
        let that      = this;

        form.on('shown.coreui.form', function () {
            if ( ! that._options.readonly) {
                that._initEvents();
            }
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );

        if ( ! this._options.readonly) {
            this._initEvents();
        }
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input').val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        value = value.replace(/[^\d\w]/g, '');

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            $('.content-' + this._hash + ' input').val(value);
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let input     = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            input.removeClass('is-invalid');
            input.removeClass('is-valid');

        } else if (isValid) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        let input = $('.content-' + this._hash + ' input');

        if (input[0]) {
            return input.is(':valid');
        }

        return null;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields,
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    },


    /**
     *
     * @return {*}
     * @private
     */
    _renderContent: function () {

        let attributes = [];
        let datalist   = [];
        let options    = this.getOptions();
        let datalistId = coreuiFormUtils$1.hashCode();

        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }

        if (options.name) {
            options.attr.name = this._options.name;
        }

        options.attr.type  = 'text';
        options.attr.value = this._value !== null ? this._value : '';

        if (options.width) {
            options.attr = coreuiFormUtils$1.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }
        if (options.required) {
            options.attr.required = 'required';
        }


        if (options.hasOwnProperty('datalist') &&
            typeof options.datalist === 'object' &&
            Array.isArray(options.datalist)
        ) {
            options.attr.list = datalistId;

            $.each(options.datalist, function (key, itemAttributes) {
                let datalistAttr = [];

                $.each(itemAttributes, function (name, value) {
                    datalistAttr.push(name + '="' + value + '"');
                });

                datalist.push({
                    attr: datalistAttr.length > 0 ? (' ' + datalistAttr.join(' ')) : ''
                });
            });
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['fields/input.html'], {
            field: options,
            datalistId: datalistId,
            value: this._value !== null ? this._value : '',
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                datalist: datalist
            },
        });
    },


    /**
     *
     * @private
     */
    _renderContentReadonly: function () {

        let options = this.getOptions();

        return ejs.render(tpl['fields/input.html'], {
            field: options,
            value: this._value !== null ? this._value : ''
        });
    },


    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        $('#coreui-form-' + this._id + ' .content-' + this._hash + ' input')
            .mask(this._options.mask, this._options.options);
    }
};

coreuiForm$1.fields.modal = {

    _id: '',
    _hash: '',
    _form: null,
    _value: '',
    _text: '',
    _options: {
        type: 'modal',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        fields: [],
        options: {
            title: '',
            size: 'lg',
            url: '',
            onHidden: null,
            onClear: null,
            onChange: null,
        },
        required: null,
        readonly: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function (form, options, index) {

        let formRecord = form.getRecord();

        this._form    = form;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
        this._hash    = coreuiFormUtils$1.hashCode();

        if (typeof options.name === 'string' &&
            formRecord.hasOwnProperty(options.name) &&
            ['object'].indexOf(typeof formRecord[options.name]) >= 0
        ) {
            let record = formRecord[options.name];

            this._value = record.hasOwnProperty('value') && ['number', 'string'].indexOf(typeof(record.value)) >= 0 ? record.value : '';
            this._text  = record.hasOwnProperty('text') && ['number', 'string'].indexOf(typeof(record.text)) >= 0 ? record.text : '';
        }


        let that = this;

        form.on('shown.coreui.form', function () {
            that._initEvents();
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );

        if ( ! this._options.readonly) {
            this._initEvents();
        }
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input.coreui-form-modal-value').val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     * @param {string} text
     */
    setValue: function (value, text) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(text);

        } else {
            let elementValue = $('.content-' + this._hash + ' .coreui-form-modal-value');
            let elementText  = $('.content-' + this._hash + ' .coreui-form-modal-text');
            let oldValue     = elementValue.val();

            elementValue.val(value);
            elementText.val(text);


            if (oldValue != value) {
                let modal = this._options.hasOwnProperty('options') && typeof (this._options.options) === 'object'
                    ? this._options.options
                    : {};

                if (modal.hasOwnProperty('onChange')) {
                    if (typeof(modal.onChange) === 'function') {
                        modal.onChange(this);

                    } else if (typeof(modal.onChange) === 'string') {
                        let func = coreuiFormUtils$1.getFunctionByName(modal.onChange);

                        if (typeof func === 'function') {
                            func(this);
                        } else {
                            eval(modal.onChange);
                        }
                    }
                }

                this._form._trigger('change-modal.coreui.form', this, [this]);
            }
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);

        container.find('.text-success').remove();
        container.find('.text-danger').remove();

        if (isValid === null) {
            return;
        }

        if (isValid) {
            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-success">' + text + '</div>');
            }

        } else {
            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-danger">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        if (this._options.required && ! this._options.readonly) {
            return !! this.getValue();
        }

        return true;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let fieldOptions = this.getOptions();
        let attributes   = [];
        let textAttr     = {
            type: 'text',
            readonly: 'readonly',
            class: 'form-control form-control-sm coreui-form-modal-text',
            value: this._text !== null ? this._text : ''
        };

        if (fieldOptions.required) {
            textAttr.required = 'required';
        }

        if (fieldOptions.hasOwnProperty('attr') &&
            typeof fieldOptions.attr === 'object' &&
            Array.isArray(fieldOptions.attr)
        ) {
            textAttr = coreuiFormUtils$1.mergeAttr(textAttr, fieldOptions.attr);
        }

        $.each(textAttr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['fields/modal.html'], {
            field: fieldOptions,
            value: this._value !== null ? this._value : '',
            text: this._text !== null ? this._text : '',
            lang: this._form.getLang(),
            render: {
                width: this._options.width,
                attr: attributes.length > 0 ? attributes.join(' ') : ''
            },
        });
    },


    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        let that  = this;
        let modal = this._options.hasOwnProperty('options') && typeof(this._options.options) === 'object'
            ? this._options.options
            : {};


        // Очистка
        $('.content-' + this._hash + ' .btn-modal-clear').click(function (e) {
            if (modal.hasOwnProperty('onClear')) {
                if (typeof(modal.onClear) === 'function') {
                    modal.onClear(that);

                } else if (typeof(modal.onClear) === 'string') {
                    let func = coreuiFormUtils$1.getFunctionByName(modal.onClear);

                    if (typeof func === 'function') {
                        func(that);
                    } else {
                        eval(modal.onClear);
                    }
                }
            }

            that._form._trigger('clear-modal.coreui.form', that, [ that, e ]);

            that.setValue('', '');
        });

        // Выбор
        $('.content-' + this._hash + ' .btn-modal-select').click(function (e) {
            let title = modal.hasOwnProperty('title') && typeof(modal.title) === 'string'
                ? modal.title
                : '';

            let size = modal.hasOwnProperty('size') && typeof(modal.size) === 'string'
                ? modal.size
                : 'lg';

            let url = modal.hasOwnProperty('url') && typeof(modal.url) === 'string'
                ? modal.url
                : '';

            if ( ! url) {
                return;
            }


            let modalId      = coreuiFormUtils$1.hashCode();
            let modalLoading = ejs.render(tpl['fields/modal-loading.html'], {
                lang: that._form.getLang(),
            });


            if (CoreUI.hasOwnProperty('modal')) {
                let onShow   = null;
                let onHidden = null;

                if (modal.hasOwnProperty('onHidden')) {
                    if (typeof(modal.onHidden) === 'function') {
                        onHidden = modal.onHidden;

                    } else if (typeof(modal.onHidden) === 'string') {
                        let func = coreuiFormUtils$1.getFunctionByName(modal.onHidden);

                        if (typeof func === 'function') {
                            onHidden = func;
                        }
                    }
                }

                if (modal.hasOwnProperty('onShow')) {
                    if (typeof(modal.onShow) === 'function') {
                        onShow = modal.onShow;

                    } else if (typeof(modal.onShow) === 'string') {
                        let func = coreuiFormUtils$1.getFunctionByName(modal.onShow);

                        if (typeof func === 'function') {
                            onShow = func;
                        }
                    }
                }

                CoreUI.modal.show(title, modalLoading, {
                    id: modalId,
                    size: size,
                    onShow: onShow,
                    onHidden: onHidden
                });
            }

            $.ajax({
                url: url,
                method: 'GET',
                beforeSend: function(xhr) {
                    that._form._trigger('before-load-modal.coreui.form', that, [ that, xhr ]);
                },
                success: function (result) {
                    $('#modal-' + modalId + ' .modal-body').html(result);
                    that._form._trigger('success-load-modal.coreui.form', that, [ that, result ]);
                },
                error: function(xhr, textStatus, errorThrown) {
                    that._form._trigger('error-load-modal.coreui.form', that, [ that, xhr, textStatus, errorThrown ]);
                },
                complete: function(xhr, textStatus) {
                    that._form._trigger('complete-load-modal.coreui.form', that, [ that, xhr, textStatus ]);
                },
            });


            that._form._trigger('select-modal.coreui.form', that, [ that, e ]);
        });
    }
};

coreuiForm$1.fields.number = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'number',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            class: 'form-control form-control-sm d-inline-block',
            step: 'any'
        },
        required: null,
        readonly: null,
        datalist: null,
        show: true,
        column: null,
        precision: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils$1.hashCode();
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);


        // Установка точности
        if (this._options.precision === null) {
            let precision = 0;

            if (this._options.attr.hasOwnProperty('step') &&
                this._options.attr.step !== 'any' &&
                ['string', 'number'].indexOf(typeof this._options.attr.step) >= 0
            ) {
                let match = $.trim(this._options.attr.step.toString()).match(/\.(\d+)$/);

                if (match && match.hasOwnProperty(1)) {
                    precision = match ? match[1].length : precision;
                }
            }

            this._options.precision = precision;
        }


        let that = this;

        form.on('shown.coreui.form', function () {
            if ( ! that._options.readonly) {
                that._initEvents();
            }
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );

        if ( ! this._options.readonly) {
            this._initEvents();
        }
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input').val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0 ||
            ! value.toString().match(/^\-?\d+\.?\d*$/)
        ) {
            return;
        }

        if (this._options.precision >= 0) {
            value = coreuiFormUtils$1.round(value, this._options.precision);
        }

        if (this._options.attr.hasOwnProperty('min')) {
            value = value < Number(this._options.attr.min)
                ? Number(this._options.attr.min)
                : value;
        }

        if (this._options.attr.hasOwnProperty('max')) {
            value = value > Number(this._options.attr.max)
                ? Number(this._options.attr.max)
                : value;
        }

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            $('.content-' + this._hash + ' input').val(value);
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let input     = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            input.removeClass('is-invalid');
            input.removeClass('is-valid');

        } else if (isValid) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        let input = $('.content-' + this._hash + ' input');

        if (input[0]) {
            return input.is(':valid');
        }

        return null;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = $.extend(true, {}, this._options);
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields,
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let attributes = [];
        let datalist   = [];
        let options    = this.getOptions();
        let datalistId = coreuiFormUtils$1.hashCode();


        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }

        if (options.name) {
            options.attr.name = this._options.name;
        }

        options.attr.type  = 'number';
        options.attr.value = this._value !== null ? this._value : '';

        if (options.width) {
            options.attr = coreuiFormUtils$1.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }

        if (options.required) {
            options.attr.required = 'required';
        }


        if (options.hasOwnProperty('datalist') &&
            typeof options.datalist === 'object' &&
            Array.isArray(options.datalist)
        ) {
            options.attr.list = datalistId;

            $.each(options.datalist, function (key, itemAttributes) {
                let datalistAttr = [];

                $.each(itemAttributes, function (name, value) {
                    datalistAttr.push(name + '="' + value + '"');
                });

                datalist.push({
                    attr: datalistAttr.length > 0 ? (' ' + datalistAttr.join(' ')) : ''
                });
            });
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['fields/input.html'], {
            field: options,
            datalistId: datalistId,
            value: this._value !== null ? this._value : '',
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                datalist: datalist
            },
        });
    },


    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        $('.content-' + this._hash + ' input').keydown(function (e) {
            let k = e.keyCode || e.which;
            let ok = k >= 35 && k <= 40 ||      // arrows
                k >= 96 && k <= 105 ||     // 0-9 numpad
                k === 189 || k === 109 ||  // minus
                k === 110 || k === 190 ||  // dot
                k === 9 ||  //tab
                k === 46 || //del
                k === 8 ||  // backspaces
                ( ! e.shiftKey && k >= 48 && k <= 57); // only 0-9 (ignore SHIFT options)

            if ( ! ok || (e.ctrlKey && e.altKey)) {
                e.preventDefault();
            }
        });

        let that = this;

        $('.content-' + this._hash + ' input').blur(function (e) {
            let value = $(this).val();

            if (that._options.precision >= 0) {
                value = coreuiFormUtils$1.round(value, that._options.precision);
            }

            if (that._options.attr.hasOwnProperty('min')) {
                value = value < Number(that._options.attr.min)
                    ? Number(that._options.attr.min)
                    : value;
            }

            if (that._options.attr.hasOwnProperty('max')) {
                value = value > Number(that._options.attr.max)
                    ? Number(that._options.attr.max)
                    : value;
            }

            $(this).val(value);
        });
    }
};

coreuiForm$1.fields.radio = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'radio',
        name: null,
        label: null,
        labelWidth: null,
        inline: false,
        outContent: null,
        description: null,
        errorText: null,
        options: [],
        fields: [],
        required: null,
        readonly: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils$1.hashCode();
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input[type=radio]:checked').val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        if (this._options.readonly) {
            let that         = this;
            let fieldOptions = this.getOptions();

            if (fieldOptions.hasOwnProperty('options') &&
                typeof fieldOptions.options === 'object' &&
                Array.isArray(fieldOptions.options)
            ) {
                $.each(fieldOptions.options, function (key, option) {

                    if (option.hasOwnProperty('value') && option.value == value) {
                        let text = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
                            ? option.text
                            : '';

                        $('.content-' + that._hash).text(text);
                        that._value = value;
                        return false;
                    }
                });
            }

        } else {
            let input = $('.content-' + this._hash + ' input[type=radio][value="' + value + '"]');

            if (input[0]) {
                input.prop('checked', true);
                this._value = value;
            }
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let lastInput = $('.form-check:last-child', container);
        let inputs    = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            inputs.removeClass('is-invalid');
            inputs.removeClass('is-valid');

        } else if (isValid) {
            inputs.removeClass('is-invalid');
            inputs.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                lastInput.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            inputs.removeClass('is-valid');
            inputs.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                lastInput.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        if (this._options.required && ! this._options.readonly) {
            let value = this.getValue();
            return typeof value === 'string' && value !== '';
        }

        return true;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: this._options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let that         = this;
        let radioOptions = [];
        let fieldOptions = this.getOptions();
        let selectedItem = [];

        if (fieldOptions.hasOwnProperty('options') &&
            typeof fieldOptions.options === 'object' &&
            Array.isArray(fieldOptions.options)
        ) {
            $.each(fieldOptions.options, function (key, option) {
                let attributes = [];
                let itemAttr = {
                    type: 'radio',
                    class: 'form-check-input'
                };
                let optionText   = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
                    ? option.text
                    : '';

                if (fieldOptions.name) {
                    itemAttr.name = that._options.name;
                }

                if (fieldOptions.required) {
                    itemAttr.required = 'required';
                }

                $.each(option, function (name, value) {
                    if (name !== 'text') {
                        if (name === 'class') {
                            itemAttr[name] = itemAttr[name] + ' ' + value;
                        } else {
                            itemAttr[name] = value;
                        }
                    }
                });

                itemAttr.id = coreuiFormUtils$1.hashCode();

                if (that._value == option.value) {
                    if (option.hasOwnProperty('text') && option.text) {
                        selectedItem.push(option.text);
                    }
                    itemAttr.checked = 'checked';
                }

                $.each(itemAttr, function (name, value) {
                    attributes.push(name + '="' + value + '"');
                });


                radioOptions.push({
                    id: itemAttr.id,
                    text: optionText,
                    attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : ''
                });
            });
        }

        return ejs.render(tpl['fields/radio.html'], {
            field: fieldOptions,
            value: this._value,
            render: {
                options: radioOptions,
                selectedItem: selectedItem
            },
        });
    }
};

coreuiForm$1.fields.range = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'range',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            class: 'form-range d-inline-block pt-1'
        },
        required: null,
        readonly: null,
        datalist: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils$1.hashCode();
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input').val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            $('.content-' + this._hash + ' input').val(value);
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let input     = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            input.removeClass('is-invalid');
            input.removeClass('is-valid');

        } else if (isValid) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        let input = $('.content-' + this._hash + ' input');

        if (input[0]) {
            return input.is(':valid');
        }

        return null;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields,
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let attributes = [];
        let datalist   = [];
        let options    = this.getOptions();
        let datalistId = coreuiFormUtils$1.hashCode();

        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }

        if (options.name) {
            options.attr.name = this._options.name;
        }

        options.attr.type  = 'range';
        options.attr.value = this._value;

        if (options.width) {
            options.attr = coreuiFormUtils$1.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }
        if (options.required) {
            options.attr.required = 'required';
        }


        if (options.hasOwnProperty('datalist') &&
            typeof options.datalist === 'object' &&
            Array.isArray(options.datalist)
        ) {
            options.attr.list = datalistId;

            $.each(options.datalist, function (key, itemAttributes) {
                let datalistAttr = [];

                $.each(itemAttributes, function (name, value) {
                    datalistAttr.push(name + '="' + value + '"');
                });

                datalist.push({
                    attr: datalistAttr.length > 0 ? (' ' + datalistAttr.join(' ')) : ''
                });
            });
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['fields/input.html'], {
            field: options,
            datalistId: datalistId,
            value: this._value,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                datalist: datalist
            },
        });
    }
};

coreuiForm$1.fields.select = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: [],
    _options: {
        type: 'select',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            class: 'form-select form-select-sm d-inline-block'
        },
        required: null,
        readonly: null,
        datalist: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils$1.hashCode();
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения из поля
     * @returns {array|string}
     */
    getValue: function () {

        if (this._options.readonly) {
            return this._value;

        } else {
            if (this._options.hasOwnProperty('attr') &&
                typeof this._options.attr === 'object' &&
                this._options.attr !== null &&
                ! Array.isArray(this._options.attr) &&
                this._options.attr.hasOwnProperty('multiple')
            ) {
                let values = [];

                $('.content-' + this._hash + ' select option:selected').each(function () {
                    values.push($(this).val());
                });

                return values;

            } else {
                return $('.content-' + this._hash + ' select option:selected').val()
            }
        }
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number', 'object'].indexOf(typeof value) < 0) {
            return;
        }

        if (typeof value === 'object') {
            if (value !== null && ! Array.isArray(value)) {
                return;
            }

        } else {
            value = [ value ];
        }

        let that    = this;
        this._value = [];

        if (this._options.readonly) {
            $('.content-' + that._hash).empty();

            let fieldOptions = this.getOptions();

            if (fieldOptions.hasOwnProperty('options') &&
                typeof fieldOptions.options === 'object' &&
                Array.isArray(fieldOptions.options) &&
                Array.isArray(value)
            ) {
                let selectedItems = [];

                $.each(fieldOptions.options, function (key, option) {

                    if (option.hasOwnProperty('value')) {
                        $.each(value, function (key, val) {

                            if (option.value == val) {
                                if (option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0) {
                                    selectedItems.push(option.text);
                                }

                                that._value.push(val);
                                return false;
                            }
                        });
                    }
                });


                $('.content-' + that._hash).text(selectedItems.join(', '));
            }

        } else {
            $('.content-' + this._hash + ' select > option').prop('selected', false);

            if (Array.isArray(value)) {
                $('.content-' + this._hash + ' select > option').each(function (key, itemValue) {
                    $.each(value, function (key, val) {
                        if (val == $(itemValue).val()) {
                            $(itemValue).prop('selected', true);
                            that._value.push(val);

                            return false;
                        }
                    });
                });
            }
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let select    = $('select', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            select.removeClass('is-invalid');
            select.removeClass('is-valid');

        } else if (isValid) {
            select.removeClass('is-invalid');
            select.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            select.removeClass('is-valid');
            select.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid: function () {

        let select = $('.content-' + this._hash + ' select');

        if (this._options.required && select.val() === '') {
            return false;
        }

        if (select[0]) {
            return select.is(':valid');
        }

        return null;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    },


    /**
     * Формирование контента
     * @return {*}
     * @private
     */
    _renderContent: function () {

        let that          = this;
        let options       = this.getOptions();
        let attributes    = [];
        let selectOptions = [];


        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }

        if (options.name) {
            options.attr.name = this._options.name;
        }

        if (options.width) {
            options.attr = coreuiFormUtils$1.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }

        if (options.required) {
            options.attr.required = 'required';
        }


        if (options.hasOwnProperty('options') &&
            typeof options.options === 'object' &&
            options.options !== null
        ) {
            $.each(options.options, function (key, option) {

                if (typeof option === 'string' || typeof option === 'number') {
                    selectOptions.push(that._renderOption({
                        type: 'option',
                        value: key,
                        text: option
                    }));

                } else if (typeof option === 'object') {
                    let type = option.hasOwnProperty('type') && typeof option.type === 'string'
                        ? option.type
                        : 'option';

                    if (type === 'group') {
                        let renderAttr   = [];
                        let groupAttr    = {};
                        let groupOptions = [];

                        if (option.hasOwnProperty('attr') &&
                            typeof option.attr === 'object' &&
                            option.attr !== null &&
                            ! Array.isArray(option.attr)
                        ) {
                            groupAttr = option.attr;
                        }

                        if (option.hasOwnProperty('label') && ['string', 'number'].indexOf(typeof(option.label)) >= 0) {
                            groupAttr.label = option.label;
                        }

                        $.each(groupAttr, function (name, value) {
                            renderAttr.push(name + '="' + value + '"');
                        });

                        if (Array.isArray(option.options)) {
                            $.each(option.options, function (key, groupOption) {
                                groupOptions.push(that._renderOption(groupOption));
                            });
                        }

                        selectOptions.push({
                            type: 'group',
                            attr: renderAttr.length > 0 ? (' ' + renderAttr.join(' ')) : '',
                            options: groupOptions,
                        });

                    } else {
                        selectOptions.push(that._renderOption(option));
                    }
                }
            });
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['fields/select.html'], {
            field: options,
            value: this._value,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                options: selectOptions
            },
        });
    },


    /**
     *
     * @return {string}
     * @private
     */
    _renderContentReadonly: function () {

        let that            = this;
        let options         = this.getOptions();
        let selectedOptions = [];

        if (options.hasOwnProperty('options') &&
            typeof options.options === 'object' &&
            Array.isArray(options.options)
        ) {
            $.each(options.options, function (key, option) {
                let type = option.hasOwnProperty('type') && typeof option.type === 'string'
                    ? option.type
                    : 'option';

                if (type === 'group') {
                    if (Array.isArray(option.options)) {
                        $.each(option.options, function (key, groupOption) {
                            let optionText = groupOption.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(groupOption.text)) >= 0
                                ? groupOption.text
                                : '';

                            if ( ! optionText || optionText === '') {
                                return;
                            }

                            if (Array.isArray(that._value)) {
                                $.each(that._value, function (key, itemValue) {
                                    if (itemValue == groupOption.value) {
                                        selectedOptions.push(optionText);
                                        return false;
                                    }
                                });

                            } else if (that._value == groupOption.value) {
                                selectedOptions.push(optionText);
                            }
                        });
                    }

                } else {
                    let optionText = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
                        ? option.text
                        : '';

                    if ( ! optionText || optionText === '') {
                        return;
                    }

                    if (Array.isArray(that._value)) {
                        $.each(that._value, function (key, itemValue) {
                            if (itemValue == option.value) {
                                selectedOptions.push(optionText);
                                return false;
                            }
                        });

                    } else if (that._value == option.value) {
                        selectedOptions.push(optionText);
                    }
                }
            });
        }


        return ejs.render(tpl['fields/select.html'], {
            field: options,
            render: {
                selectedOptions: selectedOptions
            },
        });
    },


    /**
     * Сборка опции
     * @param option
     * @return {object}
     * @private
     */
    _renderOption: function (option) {

        let optionAttr = [];
        let optionText = option.hasOwnProperty('text') && ['string', 'number'].indexOf(typeof(option.text)) >= 0
            ? option.text
            : '';

        $.each(option, function (name, value) {
            if (name !== 'text') {
                optionAttr.push(name + '="' + value + '"');
            }
        });


        if (Array.isArray(this._value)) {
            $.each(this._value, function (key, itemValue) {
                if (itemValue == option.value) {
                    optionAttr.push('selected="selected"');
                    return false;
                }
            });

        } else if (this._value == option.value) {
            optionAttr.push('selected="selected"');
        }

        return {
            type: 'option',
            text: optionText,
            attr: optionAttr.length > 0 ? (' ' + optionAttr.join(' ')) : ''
        };
    }
};

coreuiForm$1.fields.switch = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'switch',
        name: null,
        label: null,
        labelWidth: null,
        outContent: null,
        description: null,
        errorText: null,
        valueY: 'Y',
        valueN: 'N',
        fields: [],
        required: null,
        readonly: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils$1.hashCode();
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input').val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            $('.content-' + this._hash + ' input[type=checkbox]').prop('checked', value === this._options.valueY);
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container       = $('.content-' + this._hash);
        let switchContainer = $('.form-switch', container);
        let inputs          = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            inputs.removeClass('is-invalid');
            inputs.removeClass('is-valid');

        } else if (isValid) {
            inputs.removeClass('is-invalid');
            inputs.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                switchContainer.append('<div class="valid-feedback">' + text + '</div>');
            }

        } else {
            inputs.removeClass('is-valid');
            inputs.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                switchContainer.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        return null;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let attributes = [];
        let options    = this.getOptions();
        let itemAttr   = {
            type: 'checkbox',
            class: 'form-check-input',
            value: options.valueY
        };


        if (options.name) {
            itemAttr.name = this._options.name;
        }

        if (options.required) {
            itemAttr.required = 'required';
        }

        if (options.hasOwnProperty('attr') &&
            typeof options.attr === 'object' &&
            Array.isArray(options.attr)
        ) {
            itemAttr = coreuiFormUtils$1.mergeAttr(itemAttr, options.attr);
        }

        if (this._value === options.valueY) {
            itemAttr.checked = 'checked';
        }

        $.each(itemAttr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['fields/switch.html'], {
            field: options,
            value: this._value,
            lang: this._form.getLang(),
            render: {
                attr: attributes.length > 0 ? attributes.join(' ') : ''
            },
        });
    }
};

coreuiForm$1.fields.textarea = {

    _id: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'textarea',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            class: 'form-control form-control-sm d-inline-block'
        },
        required: null,
        readonly: null,
        datalist: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils$1.hashCode();
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' textarea').val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            $('.content-' + this._hash + ' textarea').val(value);
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let textarea  = $('textarea', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            textarea.removeClass('is-invalid');
            textarea.removeClass('is-valid');

        } else if (isValid) {
            textarea.removeClass('is-invalid');
            textarea.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            textarea.removeClass('is-valid');
            textarea.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        let input = $('.content-' + this._hash + ' textarea');

        if (input[0]) {
            return input.is(':valid');
        }
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let attributes = [];
        let options    = this.getOptions();

        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }

        if (options.name) {
            options.attr.name = this._options.name;
        }

        if (options.width) {
            options.attr = coreuiFormUtils$1.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }
        if (options.required) {
            options.attr.required = 'required';
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['fields/textarea.html'], {
            field: options,
            value: this._value !== null ? this._value : '',
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : ''
            },
        });
    }
};

coreuiForm$1.fields.wysiwyg = {

    _id: '',
    _hash: '',
    _form: null,
    _value: null,
    _editor: null,
    _editorHash: null,
    _options: {
        type: 'wysiwyg',
        label: null,
        labelWidth: null,
        width: null,
        minWidth: null,
        maxWidth: null,
        height: null,
        minHeight: null,
        maxHeight: null,
        options: {},
        outContent: null,
        description: null,
        required: null,
        readonly: false,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form       = form;
        this._index      = index;
        this._id         = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash       = coreuiFormUtils$1.hashCode();
        this._editorHash = coreuiFormUtils$1.hashCode();
        this._value      = coreuiFormUtils$1.getFieldValue(form, options);
        this._options    = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);

        let that = this;

        form.on('shown.coreui.form', function () {
            if ( ! that._options.readonly) {
                that._initEvents();
            }
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );

        if ( ! this._options.readonly) {
            this._initEvents();
        }
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration || 0);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration || 0);
    },


    /**
     * Получение значения из поля
     * @return {string|null}
     */
    getValue: function () {

        if (this._options.readonly) {
            return this._value;
        } else {
            return this._editor ? this._editor.getContent() : this._value;
        }
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value);
        } else {
            if (this._editor) {
                this._editor.setContent(value);
            }
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);

        container.find('.text-success').remove();
        container.find('.text-danger').remove();

        if (isValid === null) {
            return;
        }

        if (isValid) {
            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-success">' + text + '</div>');
            }

        } else {
            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="ps-2 text-danger">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function () {

        if (this._options.required && ! this._options.readonly) {
            return !! this.getValue();
        }

        return true;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form:  this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        let options = this.getOptions();

        return ejs.render(tpl['fields/wysiwyg.html'], {
            field: options,
            value: this._value !== null ? this._value : '',
            editorHash: this._editorHash
        });
    },


    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        if (this._options.readonly) {
            return;
        }

        let tinyMceOptions = {};
        let than           = this;
        let textareaId     = 'editor-' + this._editorHash;

        if (typeof this._options.options === 'object' &&
            ! Array.isArray(this._options.options) &&
            Object.keys(this._options.options).length > 0
        ) {
            tinyMceOptions = this._options.options;

        } else if (this._options.options === 'simple') {
            tinyMceOptions = {
                plugins: 'image lists anchor charmap',
                toolbar: 'blocks | bold italic underline | alignleft aligncenter ' +
                         'alignright alignjustify | bullist numlist outdent indent | ' +
                         'forecolor backcolor removeformat',
                menubar: false,
                branding: false
            };

        } else {
            tinyMceOptions = {
                promotion: false,
                branding: false,
                plugins: 'preview importcss searchreplace autolink autosave save directionality code ' +
                         'visualblocks visualchars fullscreen image link media template codesample table ' +
                         'charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
                menubar: 'file edit view insert format tools table help',
                toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | ' +
                         'alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | ' +
                         'forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen ' +
                         'preview save print | insertfile image media template link anchor codesample | ltr rtl',
            };
        }

        tinyMceOptions.selector = '#editor-' + this._editorHash;

        if (['string', 'number'].indexOf(typeof this._options.width) >= 0) {
            tinyMceOptions.width = this._options.width;
        }
        if (['string', 'number'].indexOf(typeof this._options.minWidth) >= 0) {
            tinyMceOptions.min_width = this._options.minWidth;
        }
        if (['string', 'number'].indexOf(typeof this._options.maxWidth) >= 0) {
            tinyMceOptions.max_width = this._options.maxWidth;
        }
        if (['string', 'number'].indexOf(typeof this._options.height) >= 0) {
            tinyMceOptions.height = this._options.height;
        }
        if (['string', 'number'].indexOf(typeof this._options.minHeight) >= 0) {
            tinyMceOptions.min_height = this._options.minHeight;
        }
        if (['string', 'number'].indexOf(typeof this._options.maxHeight) >= 0) {
            tinyMceOptions.max_height = this._options.maxHeight;
        }

        tinymce.init(tinyMceOptions).then(function () {
            than._editor = tinymce.get(textareaId);
        });
    }
};

coreuiForm$1.fields.passwordRepeat = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _isChangeState: true,
    _value: '',
    _options: {
        type: 'password',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            type: 'password',
            class: 'form-control form-control-sm d-inline-block flex-shrink-0'
        },
        required: null,
        invalidText: null,
        validText: null,
        readonly: null,
        datalist: null,
        show: true,
        showBtn: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils$1.hashCode();
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);


        let that = this;

        form.on('shown.coreui.form', function () {
            that._initEvents();
        });
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );

        if ( ! this._options.readonly) {
            this._initEvents();
        }
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function () {

        if (this._options.readonly) {
            return this._value;
        }

        let pass = $('.content-' + this._hash + ' input[type="password"]').eq(0);

        if (typeof pass.attr('disabled') !== 'undefined' && pass.attr('disabled') !== false) {
            return '';
        }

        return pass.val();
    },


    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function (value) {

        if (['string', 'number'].indexOf(typeof value) < 0) {
            return;
        }

        this._value = value;

        if (this._options.readonly) {
            $('.content-' + this._hash).text(value ? '******' : '');
        } else {
            $('.content-' + this._hash + ' input[type="password"]').val(value);
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let input     = $('input[type="password"]', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            input.removeClass('is-invalid');
            input.removeClass('is-valid');

        } else if (isValid) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback d-block">' + text + '</div>');
            }
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback d-block">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid: function () {

        if ( ! this._isChangeState || this._options.readonly) {
            return true;
        }

        let input = $('.content-' + this._hash + ' input[type="password"]');

        if (input.eq(0).val() !== input.eq(1).val()) {
            return false;
        }

        if (input[0]) {
            return input.eq(0).is(':valid');
        }

        return null;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form: this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    },


    /**
     *
     * @private
     */
    _renderContent: function () {

        let attributes  = [];
        let attributes2 = [];
        let datalist    = [];
        let options     = this.getOptions();

        this._isChangeState = ! options.showBtn
            ? true
            : ! this._value;

        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }

        if ( ! this._isChangeState) {
            options.attr.disabled = '';
        }

        if (options.name) {
            options.attr.name = this._options.name;
        }

        options.attr.value = this._value ? '******' : '';

        if (options.width) {
            options.attr = coreuiFormUtils$1.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }

        if (options.required) {
            options.attr.required = 'required';
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });
        $.each(options.attr, function (name, value) {
            if (['name', 'value'].indexOf(name) < 0) {
                attributes2.push(name + '="' + value + '"');
            }
        });

        let lang = this._form.getLang();

        return ejs.render(tpl['fields/passwordRepeat.html'], {
            field: options,
            value: this._value !== null ? this._value : '',
            lang: lang,
            btn_text: this._isChangeState ? lang.cancel : lang.change,
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                attr2: attributes2.length > 0 ? (' ' + attributes2.join(' ')) : '',
                datalist: datalist
            },
        });
    },


    /**
     *
     * @private
     */
    _renderContentReadonly: function () {

        let options = this.getOptions();

        return ejs.render(tpl['fields/passwordRepeat.html'], {
            field: options,
            value: this._value ? '******' : '',
            hash: this._hash
        });
    },


    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function () {

        let that = this;

        $('.content-' + this._hash + ' .btn-password-change').click(function (e) {
            let textChange = $(this).data('change');
            let textCancel = $(this).data('cancel');

            if (that._isChangeState) {
                $('.content-' + that._hash + ' [type="password"]').attr('disabled', 'disabled');
                $(this).text(textChange);
                that._isChangeState = false;

            } else {
                $('.content-' + that._hash + ' [type="password"]').removeAttr('disabled');
                $(this).text(textCancel);
                that._isChangeState = true;
            }
        });
    }
};

coreuiForm$1.fields.file = {

    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
        type: 'file',
        name: null,
        label: null,
        labelWidth: null,
        width: null,
        outContent: null,
        description: null,
        errorText: null,
        attach: null,
        attr: {
            class: 'form-control form-control-sm d-inline-block'
        },
        required: null,
        invalidText: null,
        validText: null,
        readonly: null,
        datalist: null,
        show: true,
        column: null
    },


    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function (form, options, index) {

        this._form    = form;
        this._index   = index;
        this._id      = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
        this._hash    = coreuiFormUtils$1.hashCode();
        this._value   = coreuiFormUtils$1.getFieldValue(form, options);
        this._options = coreuiFormUtils$1.mergeFieldOptions(form, this._options, options);
    },


    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
        return $.extend(true, {}, this._options);
    },


    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function (isReadonly) {

        this._value            = this.getValue();
        this._options.readonly = !! isReadonly;

        $('.content-' + this._hash).html(
            this.renderContent()
        );
    },


    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function (duration) {

        $('#coreui-form-' + this._id).hide(duration);
    },


    /**
     * Показ поля
     * @param {int} duration
     */
    show: function (duration) {

        $('#coreui-form-' + this._id).show(duration);
    },


    /**
     * Получение значения в поле
     * @returns {File[]}
     */
    getValue: function () {

        return this._options.readonly
            ? this._value
            : $('.content-' + this._hash + ' input')[0].files;
    },


    /**
     * Установка значения в поле
     * @param {File|File[]} value
     */
    setValue: function (value) {

        if ( ! (value instanceof File) &&  ! (value instanceof FileList)) {
            return;
        }

        this._value = value;


        if (this._options.readonly) {
            $('.content-' + this._hash).text('');
        } else {
            let container = new DataTransfer();

            if (value instanceof File) {
                container.items.add(value);

            } else {
                $.each(value, function (key, file) {
                    if (value instanceof File) {
                        container.items.add(file);
                    }
                });
            }

            $('.content-' + this._hash + ' input')[0].files = container.files;
        }
    },


    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function (isValid, text) {

        if (this._options.readonly) {
            return;
        }

        let container = $('.content-' + this._hash);
        let input     = $('input', container);

        container.find('.valid-feedback').remove();
        container.find('.invalid-feedback').remove();

        if (isValid === null) {
            input.removeClass('is-invalid');
            input.removeClass('is-valid');

        } else if (isValid) {
            input.removeClass('is-invalid');
            input.addClass('is-valid');

            if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
                text = this._options.validText;
            }

            if (typeof text === 'string') {
                container.append('<div class="valid-feedback">' + text + '</div>');
            }
        } else {
            input.removeClass('is-valid');
            input.addClass('is-invalid');

            if (typeof text === 'undefined') {
                if (typeof this._options.invalidText === 'string') {
                    text = this._options.invalidText;

                } else if ( ! text && this._options.required) {
                    text = this._form.getLang().required_field;
                }
            }

            if (typeof text === 'string') {
                container.append('<div class="invalid-feedback">' + text + '</div>');
            }
        }
    },


    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid: function () {

        let input = $('.content-' + this._hash + ' input');

        if (input[0]) {
            return input.is(':valid');
        }

        return null;
    },


    /**
     * Формирование поля
     * @returns {string}
     */
    render: function() {

        let options      = this.getOptions();
        let attachFields = coreuiFormUtils$1.getAttacheFields(this._form, options);

        return ejs.render(tpl['form-field-label.html'], {
            id: this._id,
            form: this._form,
            hash: this._hash,
            field: options,
            content: this.renderContent(),
            attachFields: attachFields
        });
    },


    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function () {

        return this._options.readonly
            ? this._renderContentReadonly()
            : this._renderContent();
    },


    /**
     *
     * @private
     */
    _renderContent: function () {

        let attributes   = [];
        let datalist     = [];
        let options      = this.getOptions();
        let datalistId   = coreuiFormUtils$1.hashCode();

        if ( ! options.hasOwnProperty('attr') ||
            typeof options.attr !== 'object' ||
            options.attr === null ||
            Array.isArray(options.attr)
        ) {
            options.attr = {};
        }

        if (options.name) {
            options.attr.name = this._options.name;
        }

        options.attr.type  = options.type;
        options.attr.value = this._value !== null ? this._value : '';

        if (options.width) {
            options.attr = coreuiFormUtils$1.mergeAttr(
                { style: 'width:' + options.width },
                options.attr
            );
        }

        if (options.required) {
            options.attr.required = 'required';
        }


        if (options.hasOwnProperty('datalist') &&
            typeof options.datalist === 'object' &&
            Array.isArray(options.datalist)
        ) {
            options.attr.list = datalistId;

            $.each(options.datalist, function (key, itemAttributes) {
                let datalistAttr = [];

                $.each(itemAttributes, function (name, value) {
                    datalistAttr.push(name + '="' + value + '"');
                });

                datalist.push({
                    attr: datalistAttr.length > 0 ? (' ' + datalistAttr.join(' ')) : ''
                });
            });
        }

        $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
        });

        return ejs.render(tpl['fields/input.html'], {
            field: options,
            datalistId: datalistId,
            value: this._value !== null ? this._value : '',
            render: {
                attr: attributes.length > 0 ? (' ' + attributes.join(' ')) : '',
                datalist: datalist
            },
        });
    },


    /**
     *
     * @private
     */
    _renderContentReadonly: function () {

        let options = this.getOptions();
        let type    = 'text';
        let value   = this._value;
        let lang    = this._form.getLang();

        if (options.hasOwnProperty('type') && typeof options.type === 'string') {
            type = options.type;
        }

        try {
            switch (type) {
                case 'date':           value = coreuiFormUtils$1.formatDate(value); break;
                case 'datetime-local': value = coreuiFormUtils$1.formatDateTime(value); break;
                case 'month':          value = coreuiFormUtils$1.formatDateMonth(value, lang); break;
                case 'week':           value = coreuiFormUtils$1.formatDateWeek(value, lang); break;
            }

        } catch (e) {
            console.error(e);
            // ignore
        }

        return ejs.render(tpl['fields/input.html'], {
            field: options,
            value: value,
            hash: this._hash
        });
    }
};

return coreuiForm$1;

})));
