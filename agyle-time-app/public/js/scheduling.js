/*
 AngularJS v1.2.28
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(W,X,u){'use strict';function z(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.2.28/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function Sa(b){if(null==b||Ja(b))return!1;
var a=b.length;return 1===b.nodeType&&a?!0:G(b)||L(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function r(b,a,c){var d;if(b)if(N(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(L(b)||Sa(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else if(b.forEach&&b.forEach!==r)b.forEach(a,c);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function Xb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function Sc(b,
a,c){for(var d=Xb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function Yb(b){return function(a,c){b(c,a)}}function ib(){for(var b=na.length,a;b;){b--;a=na[b].charCodeAt(0);if(57==a)return na[b]="A",na.join("");if(90==a)na[b]="0";else return na[b]=String.fromCharCode(a+1),na.join("")}na.unshift("0");return na.join("")}function Zb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function E(b){var a=b.$$hashKey;r(arguments,function(a){a!==b&&r(a,function(a,c){b[c]=a})});Zb(b,a);return b}function U(b){return parseInt(b,
10)}function $b(b,a){return E(new (E(function(){},{prototype:b})),a)}function v(){}function ga(b){return b}function aa(b){return function(){return b}}function F(b){return"undefined"===typeof b}function D(b){return"undefined"!==typeof b}function T(b){return null!=b&&"object"===typeof b}function G(b){return"string"===typeof b}function jb(b){return"number"===typeof b}function va(b){return"[object Date]"===Ba.call(b)}function N(b){return"function"===typeof b}function kb(b){return"[object RegExp]"===Ba.call(b)}
function Ja(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function Tc(b){return!(!b||!(b.nodeName||b.prop&&b.attr&&b.find))}function Uc(b,a,c){var d=[];r(b,function(b,f,g){d.push(a.call(c,b,f,g))});return d}function Ta(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Ua(b,a){var c=Ta(b,a);0<=c&&b.splice(c,1);return a}function Ka(b,a,c,d){if(Ja(b)||b&&b.$evalAsync&&b.$watch)throw Va("cpws");if(a){if(b===a)throw Va("cpi");c=c||[];
d=d||[];if(T(b)){var e=Ta(c,b);if(-1!==e)return d[e];c.push(b);d.push(a)}if(L(b))for(var f=a.length=0;f<b.length;f++)e=Ka(b[f],null,c,d),T(b[f])&&(c.push(b[f]),d.push(e)),a.push(e);else{var g=a.$$hashKey;L(a)?a.length=0:r(a,function(b,c){delete a[c]});for(f in b)e=Ka(b[f],null,c,d),T(b[f])&&(c.push(b[f]),d.push(e)),a[f]=e;Zb(a,g)}}else if(a=b)L(b)?a=Ka(b,[],c,d):va(b)?a=new Date(b.getTime()):kb(b)?(a=RegExp(b.source,b.toString().match(/[^\/]*$/)[0]),a.lastIndex=b.lastIndex):T(b)&&(a=Ka(b,{},c,d));
return a}function ha(b,a){if(L(b)){a=a||[];for(var c=0;c<b.length;c++)a[c]=b[c]}else if(T(b))for(c in a=a||{},b)!lb.call(b,c)||"$"===c.charAt(0)&&"$"===c.charAt(1)||(a[c]=b[c]);return a||b}function Ca(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,d;if(c==typeof a&&"object"==c)if(L(b)){if(!L(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!Ca(b[d],a[d]))return!1;return!0}}else{if(va(b))return va(a)?isNaN(b.getTime())&&isNaN(a.getTime())||b.getTime()===
a.getTime():!1;if(kb(b)&&kb(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||Ja(b)||Ja(a)||L(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!N(b[d])){if(!Ca(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==u&&!N(a[d]))return!1;return!0}return!1}function Bb(b,a){var c=2<arguments.length?wa.call(arguments,2):[];return!N(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?a.apply(b,c.concat(wa.call(arguments,
0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Vc(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)?c=u:Ja(a)?c="$WINDOW":a&&X===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function oa(b,a){return"undefined"===typeof b?u:JSON.stringify(b,Vc,a?"  ":null)}function ac(b){return G(b)?JSON.parse(b):b}function Wa(b){"function"===typeof b?b=!0:b&&0!==b.length?(b=x(""+b),b=!("f"==b||"0"==b||"false"==b||"no"==b||"n"==b||"[]"==b)):b=!1;
return b}function ia(b){b=A(b).clone();try{b.empty()}catch(a){}var c=A("<div>").append(b).html();try{return 3===b[0].nodeType?x(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(a,b){return"<"+x(b)})}catch(d){return x(c)}}function bc(b){try{return decodeURIComponent(b)}catch(a){}}function cc(b){var a={},c,d;r((b||"").split("&"),function(b){b&&(c=b.replace(/\+/g,"%20").split("="),d=bc(c[0]),D(d)&&(b=D(c[1])?bc(c[1]):!0,lb.call(a,d)?L(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}function Cb(b){var a=
[];r(b,function(b,d){L(b)?r(b,function(b){a.push(Da(d,!0)+(!0===b?"":"="+Da(b,!0)))}):a.push(Da(d,!0)+(!0===b?"":"="+Da(b,!0)))});return a.length?a.join("&"):""}function mb(b){return Da(b,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function Da(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function Wc(b,a){function c(a){a&&d.push(a)}var d=[b],e,f,g=["ng:app","ng-app","x-ng-app",
"data-ng-app"],h=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;r(g,function(a){g[a]=!0;c(X.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(r(b.querySelectorAll("."+a),c),r(b.querySelectorAll("."+a+"\\:"),c),r(b.querySelectorAll("["+a+"]"),c))});r(d,function(a){if(!e){var b=h.exec(" "+a.className+" ");b?(e=a,f=(b[2]||"").replace(/\s+/g,",")):r(a.attributes,function(b){!e&&g[b.name]&&(e=a,f=b.value)})}});e&&a(e,f?[f]:[])}function dc(b,a){var c=function(){b=A(b);if(b.injector()){var c=b[0]===X?
"document":ia(b);throw Va("btstrpd",c.replace(/</,"&lt;").replace(/>/,"&gt;"));}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");c=ec(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animate",function(a,b,c,d,e){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(W&&!d.test(W.name))return c();W.name=W.name.replace(d,"");Xa.resumeBootstrap=function(b){r(b,function(b){a.push(b)});c()}}function nb(b,a){a=
a||"_";return b.replace(Xc,function(b,d){return(d?a:"")+b.toLowerCase()})}function Db(b,a,c){if(!b)throw Va("areq",a||"?",c||"required");return b}function Ya(b,a,c){c&&L(b)&&(b=b[b.length-1]);Db(N(b),a,"not a function, got "+(b&&"object"===typeof b?b.constructor.name||"Object":typeof b));return b}function Ea(b,a){if("hasOwnProperty"===b)throw Va("badname",a);}function fc(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,f=a.length,g=0;g<f;g++)d=a[g],b&&(b=(e=b)[d]);return!c&&N(b)?Bb(e,b):b}function Eb(b){var a=
b[0];b=b[b.length-1];if(a===b)return A(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return A(c)}function Yc(b){var a=z("$injector"),c=z("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||z;return b.module||(b.module=function(){var b={};return function(e,f,g){if("hasOwnProperty"===e)throw c("badname","module");f&&b.hasOwnProperty(e)&&(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e){return function(){c[e||"push"]([a,d,arguments]);return n}}if(!f)throw a("nomod",
e);var c=[],d=[],l=b("$injector","invoke"),n={_invokeQueue:c,_runBlocks:d,requires:f,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide","constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider","register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:l,run:function(a){d.push(a);return this}};g&&l(g);return n}())}}())}
function Zc(b){E(b,{bootstrap:dc,copy:Ka,extend:E,equals:Ca,element:A,forEach:r,injector:ec,noop:v,bind:Bb,toJson:oa,fromJson:ac,identity:ga,isUndefined:F,isDefined:D,isString:G,isFunction:N,isObject:T,isNumber:jb,isElement:Tc,isArray:L,version:$c,isDate:va,lowercase:x,uppercase:La,callbacks:{counter:0},$$minErr:z,$$csp:Za});$a=Yc(W);try{$a("ngLocale")}catch(a){$a("ngLocale",[]).provider("$locale",ad)}$a("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:bd});a.provider("$compile",
gc).directive({a:cd,input:hc,textarea:hc,form:dd,script:ed,select:fd,style:gd,option:hd,ngBind:id,ngBindHtml:jd,ngBindTemplate:kd,ngClass:ld,ngClassEven:md,ngClassOdd:nd,ngCloak:od,ngController:pd,ngForm:qd,ngHide:rd,ngIf:sd,ngInclude:td,ngInit:ud,ngNonBindable:vd,ngPluralize:wd,ngRepeat:xd,ngShow:yd,ngStyle:zd,ngSwitch:Ad,ngSwitchWhen:Bd,ngSwitchDefault:Cd,ngOptions:Dd,ngTransclude:Ed,ngModel:Fd,ngList:Gd,ngChange:Hd,required:ic,ngRequired:ic,ngValue:Id}).directive({ngInclude:Jd}).directive(Fb).directive(jc);
a.provider({$anchorScroll:Kd,$animate:Ld,$browser:Md,$cacheFactory:Nd,$controller:Od,$document:Pd,$exceptionHandler:Qd,$filter:kc,$interpolate:Rd,$interval:Sd,$http:Td,$httpBackend:Ud,$location:Vd,$log:Wd,$parse:Xd,$rootScope:Yd,$q:Zd,$sce:$d,$sceDelegate:ae,$sniffer:be,$templateCache:ce,$timeout:de,$window:ee,$$rAF:fe,$$asyncCallback:ge})}])}function ab(b){return b.replace(he,function(a,b,d,e){return e?d.toUpperCase():d}).replace(ie,"Moz$1")}function Gb(b,a,c,d){function e(b){var e=c&&b?[this.filter(b)]:
[this],k=a,m,l,n,q,p,s;if(!d||null!=b)for(;e.length;)for(m=e.shift(),l=0,n=m.length;l<n;l++)for(q=A(m[l]),k?q.triggerHandler("$destroy"):k=!k,p=0,q=(s=q.children()).length;p<q;p++)e.push(Fa(s[p]));return f.apply(this,arguments)}var f=Fa.fn[b],f=f.$original||f;e.$original=f;Fa.fn[b]=e}function S(b){if(b instanceof S)return b;G(b)&&(b=$(b));if(!(this instanceof S)){if(G(b)&&"<"!=b.charAt(0))throw Hb("nosel");return new S(b)}if(G(b)){var a=b;b=X;var c;if(c=je.exec(a))b=[b.createElement(c[1])];else{var d=
b,e;b=d.createDocumentFragment();c=[];if(Ib.test(a)){d=b.appendChild(d.createElement("div"));e=(ke.exec(a)||["",""])[1].toLowerCase();e=da[e]||da._default;d.innerHTML="<div>&#160;</div>"+e[1]+a.replace(le,"<$1></$2>")+e[2];d.removeChild(d.firstChild);for(a=e[0];a--;)d=d.lastChild;a=0;for(e=d.childNodes.length;a<e;++a)c.push(d.childNodes[a]);d=b.firstChild;d.textContent=""}else c.push(d.createTextNode(a));b.textContent="";b.innerHTML="";b=c}Jb(this,b);A(X.createDocumentFragment()).append(this)}else Jb(this,
b)}function Kb(b){return b.cloneNode(!0)}function Ma(b){Lb(b);var a=0;for(b=b.childNodes||[];a<b.length;a++)Ma(b[a])}function lc(b,a,c,d){if(D(d))throw Hb("offargs");var e=pa(b,"events");pa(b,"handle")&&(F(a)?r(e,function(a,c){bb(b,c,a);delete e[c]}):r(a.split(" "),function(a){F(c)?(bb(b,a,e[a]),delete e[a]):Ua(e[a]||[],c)}))}function Lb(b,a){var c=b.ng339,d=cb[c];d&&(a?delete cb[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),lc(b)),delete cb[c],b.ng339=u))}function pa(b,a,c){var d=
b.ng339,d=cb[d||-1];if(D(c))d||(b.ng339=d=++me,d=cb[d]={}),d[a]=c;else return d&&d[a]}function Mb(b,a,c){var d=pa(b,"data"),e=D(c),f=!e&&D(a),g=f&&!T(a);d||g||pa(b,"data",d={});if(e)d[a]=c;else if(f){if(g)return d&&d[a];E(d,a)}else return d}function Nb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function ob(b,a){a&&b.setAttribute&&r(a.split(" "),function(a){b.setAttribute("class",$((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g,
" ").replace(" "+$(a)+" "," ")))})}function pb(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");r(a.split(" "),function(a){a=$(a);-1===c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",$(c))}}function Jb(b,a){if(a){a=a.nodeName||!D(a.length)||Ja(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function mc(b,a){return qb(b,"$"+(a||"ngController")+"Controller")}function qb(b,a,c){9==b.nodeType&&(b=b.documentElement);for(a=L(a)?a:[a];b;){for(var d=
0,e=a.length;d<e;d++)if((c=A.data(b,a[d]))!==u)return c;b=b.parentNode||11===b.nodeType&&b.host}}function nc(b){for(var a=0,c=b.childNodes;a<c.length;a++)Ma(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}function oc(b,a){var c=rb[a.toLowerCase()];return c&&pc[b.nodeName]&&c}function ne(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||X);if(F(c.defaultPrevented)){var f=
c.preventDefault;c.preventDefault=function(){c.defaultPrevented=!0;f.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var g=ha(a[e||c.type]||[]);r(g,function(a){a.call(b,c)});8>=R?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Na(b,a){var c=typeof b,d;"function"==c||"object"==c&&null!==b?"function"==typeof(d=
b.$$hashKey)?d=b.$$hashKey():d===u&&(d=b.$$hashKey=(a||ib)()):d=b;return c+":"+d}function db(b,a){if(a){var c=0;this.nextUid=function(){return++c}}r(b,this.put,this)}function qc(b){var a,c;"function"===typeof b?(a=b.$inject)||(a=[],b.length&&(c=b.toString().replace(oe,""),c=c.match(pe),r(c[1].split(qe),function(b){b.replace(re,function(b,c,d){a.push(d)})})),b.$inject=a):L(b)?(c=b.length-1,Ya(b[c],"fn"),a=b.slice(0,c)):Ya(b,"fn",!0);return a}function ec(b){function a(a){return function(b,c){if(T(b))r(b,
Yb(a));else return a(b,c)}}function c(a,b){Ea(a,"service");if(N(b)||L(b))b=n.instantiate(b);if(!b.$get)throw eb("pget",a);return l[a+h]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[],c,d,f,h;r(a,function(a){if(!m.get(a)){m.put(a,!0);try{if(G(a))for(c=$a(a),b=b.concat(e(c.requires)).concat(c._runBlocks),d=c._invokeQueue,f=0,h=d.length;f<h;f++){var g=d[f],k=n.get(g[0]);k[g[1]].apply(k,g[2])}else N(a)?b.push(n.invoke(a)):L(a)?b.push(n.invoke(a)):Ya(a,"module")}catch(p){throw L(a)&&(a=
a[a.length-1]),p.message&&(p.stack&&-1==p.stack.indexOf(p.message))&&(p=p.message+"\n"+p.stack),eb("modulerr",a,p.stack||p.message||p);}}});return b}function f(a,b){function c(d){if(a.hasOwnProperty(d)){if(a[d]===g)throw eb("cdep",d+" <- "+k.join(" <- "));return a[d]}try{return k.unshift(d),a[d]=g,a[d]=b(d)}catch(e){throw a[d]===g&&delete a[d],e;}finally{k.shift()}}function d(a,b,e){var f=[],h=qc(a),g,k,p;k=0;for(g=h.length;k<g;k++){p=h[k];if("string"!==typeof p)throw eb("itkn",p);f.push(e&&e.hasOwnProperty(p)?
e[p]:c(p))}L(a)&&(a=a[g]);return a.apply(b,f)}return{invoke:d,instantiate:function(a,b){var c=function(){},e;c.prototype=(L(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return T(e)||N(e)?e:c},get:c,annotate:qc,has:function(b){return l.hasOwnProperty(b+h)||a.hasOwnProperty(b)}}}var g={},h="Provider",k=[],m=new db([],!0),l={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,aa(b))}),constant:a(function(a,
b){Ea(a,"constant");l[a]=b;q[a]=b}),decorator:function(a,b){var c=n.get(a+h),d=c.$get;c.$get=function(){var a=p.invoke(d,c);return p.invoke(b,null,{$delegate:a})}}}},n=l.$injector=f(l,function(){throw eb("unpr",k.join(" <- "));}),q={},p=q.$injector=f(q,function(a){a=n.get(a+h);return p.invoke(a.$get,a)});r(e(b),function(a){p.invoke(a||v)});return p}function Kd(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;
r(a,function(a){b||"a"!==x(a.nodeName)||(b=a)});return b}function f(){var b=c.hash(),d;b?(d=g.getElementById(b))?d.scrollIntoView():(d=e(g.getElementsByName(b)))?d.scrollIntoView():"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var g=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(f)});return f}]}function ge(){this.$get=["$$rAF","$timeout",function(b,a){return b.supported?function(a){return b(a)}:function(b){return a(b,0,!1)}}]}function se(b,a,c,d){function e(a){try{a.apply(null,
wa.call(arguments,1))}finally{if(s--,0===s)for(;J.length;)try{J.pop()()}catch(b){c.error(b)}}}function f(a,b){(function ea(){r(w,function(a){a()});t=b(ea,a)})()}function g(){y!=h.url()&&(y=h.url(),r(ba,function(a){a(h.url())}))}var h=this,k=a[0],m=b.location,l=b.history,n=b.setTimeout,q=b.clearTimeout,p={};h.isMock=!1;var s=0,J=[];h.$$completeOutstandingRequest=e;h.$$incOutstandingRequestCount=function(){s++};h.notifyWhenNoOutstandingRequests=function(a){r(w,function(a){a()});0===s?a():J.push(a)};
var w=[],t;h.addPollFn=function(a){F(t)&&f(100,n);w.push(a);return a};var y=m.href,K=a.find("base"),B=null;h.url=function(a,c){m!==b.location&&(m=b.location);l!==b.history&&(l=b.history);if(a){if(y!=a){var e=y&&Ga(y)===Ga(a);y=a;!e&&d.history?c?l.replaceState(null,"",a):(l.pushState(null,"",a),K.attr("href",K.attr("href"))):(e||(B=a),c?m.replace(a):m.href=a);return h}}else return B||m.href.replace(/%27/g,"'")};var ba=[],O=!1;h.onUrlChange=function(a){if(!O){if(d.history)A(b).on("popstate",g);if(d.hashchange)A(b).on("hashchange",
g);else h.addPollFn(g);O=!0}ba.push(a);return a};h.$$checkUrlChange=g;h.baseHref=function(){var a=K.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};var M={},ca="",P=h.baseHref();h.cookies=function(a,b){var d,e,f,h;if(a)b===u?k.cookie=escape(a)+"=;path="+P+";expires=Thu, 01 Jan 1970 00:00:00 GMT":G(b)&&(d=(k.cookie=escape(a)+"="+escape(b)+";path="+P).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(k.cookie!==
ca)for(ca=k.cookie,d=ca.split("; "),M={},f=0;f<d.length;f++)e=d[f],h=e.indexOf("="),0<h&&(a=unescape(e.substring(0,h)),M[a]===u&&(M[a]=unescape(e.substring(h+1))));return M}};h.defer=function(a,b){var c;s++;c=n(function(){delete p[c];e(a)},b||0);p[c]=!0;return c};h.defer.cancel=function(a){return p[a]?(delete p[a],q(a),e(v),!0):!1}}function Md(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new se(b,d,a,c)}]}function Nd(){this.$get=function(){function b(b,d){function e(a){a!=
n&&(q?q==a&&(q=a.n):q=a,f(a.n,a.p),f(a,n),n=a,n.n=null)}function f(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw z("$cacheFactory")("iid",b);var g=0,h=E({},d,{id:b}),k={},m=d&&d.capacity||Number.MAX_VALUE,l={},n=null,q=null;return a[b]={put:function(a,b){if(m<Number.MAX_VALUE){var c=l[a]||(l[a]={key:a});e(c)}if(!F(b))return a in k||g++,k[a]=b,g>m&&this.remove(q.key),b},get:function(a){if(m<Number.MAX_VALUE){var b=l[a];if(!b)return;e(b)}return k[a]},remove:function(a){if(m<Number.MAX_VALUE){var b=
l[a];if(!b)return;b==n&&(n=b.p);b==q&&(q=b.n);f(b.n,b.p);delete l[a]}delete k[a];g--},removeAll:function(){k={};g=0;l={};n=q=null},destroy:function(){l=h=k=null;delete a[b]},info:function(){return E({},h,{size:g})}}}var a={};b.info=function(){var b={};r(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function ce(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function gc(b,a){var c={},d="Directive",e=/^\s*directive\:\s*([\d\w_\-]+)\s+(.*)$/,f=/(([\d\w_\-]+)(?:\:([^;]+))?;?)/,
g=/^(on[a-z]+|formaction)$/;this.directive=function k(a,e){Ea(a,"directive");G(a)?(Db(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];r(c[a],function(c,f){try{var g=b.invoke(c);N(g)?g={compile:aa(g)}:!g.compile&&g.link&&(g.compile=aa(g.link));g.priority=g.priority||0;g.index=f;g.name=g.name||a;g.require=g.require||g.controller&&g.name;g.restrict=g.restrict||"A";e.push(g)}catch(k){d(k)}});return e}])),c[a].push(e)):r(a,Yb(k));
return this};this.aHrefSanitizationWhitelist=function(b){return D(b)?(a.aHrefSanitizationWhitelist(b),this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return D(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate","$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,l,n,q,p,s,J,w,t,y,K){function B(a,b,c,d,e){a instanceof
A||(a=A(a));r(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=A(b).wrap("<span></span>").parent()[0])});var f=O(a,b,a,c,d,e);ba(a,"ng-scope");return function(b,c,d,e){Db(b,"scope");var g=c?Oa.clone.call(a):a;r(d,function(a,b){g.data("$"+b+"Controller",a)});d=0;for(var k=g.length;d<k;d++){var p=g[d].nodeType;1!==p&&9!==p||g.eq(d).data("$scope",b)}c&&c(g,b);f&&f(b,g,g,e);return g}}function ba(a,b){try{a.addClass(b)}catch(c){}}function O(a,b,c,d,e,f){function g(a,c,d,e){var f,p,l,m,q,
n,w;f=c.length;var s=Array(f);for(m=0;m<f;m++)s[m]=c[m];n=m=0;for(q=k.length;m<q;n++)p=s[n],c=k[m++],f=k[m++],c?(c.scope?(l=a.$new(),A.data(p,"$scope",l)):l=a,w=c.transcludeOnThisElement?M(a,c.transclude,e):!c.templateOnThisElement&&e?e:!e&&b?M(a,b):null,c(f,l,p,d,w)):f&&f(a,p.childNodes,u,e)}for(var k=[],p,l,m,q,n=0;n<a.length;n++)p=new Ob,l=ca(a[n],[],p,0===n?d:u,e),(f=l.length?I(l,a[n],p,b,c,null,[],[],f):null)&&f.scope&&ba(p.$$element,"ng-scope"),p=f&&f.terminal||!(m=a[n].childNodes)||!m.length?
null:O(m,f?(f.transcludeOnThisElement||!f.templateOnThisElement)&&f.transclude:b),k.push(f,p),q=q||f||p,f=null;return q?g:null}function M(a,b,c){return function(d,e,f){var g=!1;d||(d=a.$new(),g=d.$$transcluded=!0);e=b(d,e,f,c);if(g)e.on("$destroy",function(){d.$destroy()});return e}}function ca(a,b,c,d,g){var k=c.$attr,p;switch(a.nodeType){case 1:ea(b,qa(Pa(a).toLowerCase()),"E",d,g);for(var l,m,q,n=a.attributes,w=0,s=n&&n.length;w<s;w++){var t=!1,J=!1;l=n[w];if(!R||8<=R||l.specified){p=l.name;m=
$(l.value);l=qa(p);if(q=U.test(l))p=nb(l.substr(6),"-");var y=l.replace(/(Start|End)$/,"");l===y+"Start"&&(t=p,J=p.substr(0,p.length-5)+"end",p=p.substr(0,p.length-6));l=qa(p.toLowerCase());k[l]=p;if(q||!c.hasOwnProperty(l))c[l]=m,oc(a,l)&&(c[l]=!0);S(a,b,m,l);ea(b,l,"A",d,g,t,J)}}a=a.className;if(G(a)&&""!==a)for(;p=f.exec(a);)l=qa(p[2]),ea(b,l,"C",d,g)&&(c[l]=$(p[3])),a=a.substr(p.index+p[0].length);break;case 3:x(b,a.nodeValue);break;case 8:try{if(p=e.exec(a.nodeValue))l=qa(p[1]),ea(b,l,"M",d,
g)&&(c[l]=$(p[2]))}catch(B){}}b.sort(F);return b}function P(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ja("uterdir",b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return A(d)}function C(a,b,c){return function(d,e,f,g,k){e=P(e[0],b,c);return a(d,e,f,g,k)}}function I(a,c,d,e,f,g,k,q,n){function w(a,b,c,d){if(a){c&&(a=C(a,c,d));a.require=H.require;a.directiveName=z;if(K===H||H.$$isolateScope)a=rc(a,
{isolateScope:!0});k.push(a)}if(b){c&&(b=C(b,c,d));b.require=H.require;b.directiveName=z;if(K===H||H.$$isolateScope)b=rc(b,{isolateScope:!0});q.push(b)}}function t(a,b,c,d){var e,f="data",g=!1;if(G(b)){for(;"^"==(e=b.charAt(0))||"?"==e;)b=b.substr(1),"^"==e&&(f="inheritedData"),g=g||"?"==e;e=null;d&&"data"===f&&(e=d[b]);e=e||c[f]("$"+b+"Controller");if(!e&&!g)throw ja("ctreq",b,a);}else L(b)&&(e=[],r(b,function(b){e.push(t(a,b,c,d))}));return e}function J(a,e,f,g,n){function w(a,b){var c;2>arguments.length&&
(b=a,a=u);Ia&&(c=ca);return n(a,b,c)}var y,Q,B,M,C,P,ca={},ra;y=c===f?d:ha(d,new Ob(A(f),d.$attr));Q=y.$$element;if(K){var ue=/^\s*([@=&])(\??)\s*(\w*)\s*$/;P=e.$new(!0);!I||I!==K&&I!==K.$$originalDirective?Q.data("$isolateScopeNoTemplate",P):Q.data("$isolateScope",P);ba(Q,"ng-isolate-scope");r(K.scope,function(a,c){var d=a.match(ue)||[],f=d[3]||c,g="?"==d[2],d=d[1],k,l,n,q;P.$$isolateBindings[c]=d+f;switch(d){case "@":y.$observe(f,function(a){P[c]=a});y.$$observers[f].$$scope=e;y[f]&&(P[c]=b(y[f])(e));
break;case "=":if(g&&!y[f])break;l=p(y[f]);q=l.literal?Ca:function(a,b){return a===b||a!==a&&b!==b};n=l.assign||function(){k=P[c]=l(e);throw ja("nonassign",y[f],K.name);};k=P[c]=l(e);P.$watch(function(){var a=l(e);q(a,P[c])||(q(a,k)?n(e,a=P[c]):P[c]=a);return k=a},null,l.literal);break;case "&":l=p(y[f]);P[c]=function(a){return l(e,a)};break;default:throw ja("iscp",K.name,c,a);}})}ra=n&&w;O&&r(O,function(a){var b={$scope:a===K||a.$$isolateScope?P:e,$element:Q,$attrs:y,$transclude:ra},c;C=a.controller;
"@"==C&&(C=y[a.name]);c=s(C,b);ca[a.name]=c;Ia||Q.data("$"+a.name+"Controller",c);a.controllerAs&&(b.$scope[a.controllerAs]=c)});g=0;for(B=k.length;g<B;g++)try{M=k[g],M(M.isolateScope?P:e,Q,y,M.require&&t(M.directiveName,M.require,Q,ca),ra)}catch(H){l(H,ia(Q))}g=e;K&&(K.template||null===K.templateUrl)&&(g=P);a&&a(g,f.childNodes,u,n);for(g=q.length-1;0<=g;g--)try{M=q[g],M(M.isolateScope?P:e,Q,y,M.require&&t(M.directiveName,M.require,Q,ca),ra)}catch(D){l(D,ia(Q))}}n=n||{};for(var y=-Number.MAX_VALUE,
M,O=n.controllerDirectives,K=n.newIsolateScopeDirective,I=n.templateDirective,ea=n.nonTlbTranscludeDirective,F=!1,E=!1,Ia=n.hasElementTranscludeDirective,x=d.$$element=A(c),H,z,V,S=e,R,Ha=0,sa=a.length;Ha<sa;Ha++){H=a[Ha];var U=H.$$start,Y=H.$$end;U&&(x=P(c,U,Y));V=u;if(y>H.priority)break;if(V=H.scope)M=M||H,H.templateUrl||(fb("new/isolated scope",K,H,x),T(V)&&(K=H));z=H.name;!H.templateUrl&&H.controller&&(V=H.controller,O=O||{},fb("'"+z+"' controller",O[z],H,x),O[z]=H);if(V=H.transclude)F=!0,H.$$tlb||
(fb("transclusion",ea,H,x),ea=H),"element"==V?(Ia=!0,y=H.priority,V=x,x=d.$$element=A(X.createComment(" "+z+": "+d[z]+" ")),c=x[0],ra(f,wa.call(V,0),c),S=B(V,e,y,g&&g.name,{nonTlbTranscludeDirective:ea})):(V=A(Kb(c)).contents(),x.empty(),S=B(V,e));if(H.template)if(E=!0,fb("template",I,H,x),I=H,V=N(H.template)?H.template(x,d):H.template,V=W(V),H.replace){g=H;V=Ib.test(V)?A($(V)):[];c=V[0];if(1!=V.length||1!==c.nodeType)throw ja("tplrt",z,"");ra(f,x,c);sa={$attr:{}};V=ca(c,[],sa);var Z=a.splice(Ha+
1,a.length-(Ha+1));K&&D(V);a=a.concat(V).concat(Z);v(d,sa);sa=a.length}else x.html(V);if(H.templateUrl)E=!0,fb("template",I,H,x),I=H,H.replace&&(g=H),J=te(a.splice(Ha,a.length-Ha),x,d,f,F&&S,k,q,{controllerDirectives:O,newIsolateScopeDirective:K,templateDirective:I,nonTlbTranscludeDirective:ea}),sa=a.length;else if(H.compile)try{R=H.compile(x,d,S),N(R)?w(null,R,U,Y):R&&w(R.pre,R.post,U,Y)}catch(ve){l(ve,ia(x))}H.terminal&&(J.terminal=!0,y=Math.max(y,H.priority))}J.scope=M&&!0===M.scope;J.transcludeOnThisElement=
F;J.templateOnThisElement=E;J.transclude=S;n.hasElementTranscludeDirective=Ia;return J}function D(a){for(var b=0,c=a.length;b<c;b++)a[b]=$b(a[b],{$$isolateScope:!0})}function ea(b,e,f,g,p,m,n){if(e===p)return null;p=null;if(c.hasOwnProperty(e)){var q;e=a.get(e+d);for(var w=0,s=e.length;w<s;w++)try{q=e[w],(g===u||g>q.priority)&&-1!=q.restrict.indexOf(f)&&(m&&(q=$b(q,{$$start:m,$$end:n})),b.push(q),p=q)}catch(y){l(y)}}return p}function v(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;r(a,function(d,e){"$"!=
e.charAt(0)&&(b[e]&&b[e]!==d&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});r(b,function(b,f){"class"==f?(ba(e,b),a["class"]=(a["class"]?a["class"]+" ":"")+b):"style"==f?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==f.charAt(0)||a.hasOwnProperty(f)||(a[f]=b,d[f]=c[f])})}function te(a,b,c,d,e,f,g,k){var p=[],l,m,w=b[0],s=a.shift(),y=E({},s,{templateUrl:null,transclude:null,replace:null,$$originalDirective:s}),J=N(s.templateUrl)?s.templateUrl(b,c):s.templateUrl;
b.empty();n.get(t.getTrustedResourceUrl(J),{cache:q}).success(function(q){var n,t;q=W(q);if(s.replace){q=Ib.test(q)?A($(q)):[];n=q[0];if(1!=q.length||1!==n.nodeType)throw ja("tplrt",s.name,J);q={$attr:{}};ra(d,b,n);var B=ca(n,[],q);T(s.scope)&&D(B);a=B.concat(a);v(c,q)}else n=w,b.html(q);a.unshift(y);l=I(a,n,c,e,b,s,f,g,k);r(d,function(a,c){a==n&&(d[c]=b[0])});for(m=O(b[0].childNodes,e);p.length;){q=p.shift();t=p.shift();var K=p.shift(),C=p.shift(),B=b[0];if(t!==w){var P=t.className;k.hasElementTranscludeDirective&&
s.replace||(B=Kb(n));ra(K,A(t),B);ba(A(B),P)}t=l.transcludeOnThisElement?M(q,l.transclude,C):C;l(m,q,B,d,t)}p=null}).error(function(a,b,c,d){throw ja("tpload",d.url);});return function(a,b,c,d,e){a=e;p?(p.push(b),p.push(c),p.push(d),p.push(a)):(l.transcludeOnThisElement&&(a=M(b,l.transclude,e)),l(m,b,c,d,a))}}function F(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function fb(a,b,c,d){if(b)throw ja("multidir",b.name,c.name,a,ia(d));}function x(a,
c){var d=b(c,!0);d&&a.push({priority:0,compile:function(a){var b=a.parent().length;b&&ba(a.parent(),"ng-binding");return function(a,c){var e=c.parent(),f=e.data("$binding")||[];f.push(d);e.data("$binding",f);b||ba(e,"ng-binding");a.$watch(d,function(a){c[0].nodeValue=a})}}})}function z(a,b){if("srcdoc"==b)return t.HTML;var c=Pa(a);if("xlinkHref"==b||"FORM"==c&&"action"==b||"IMG"!=c&&("src"==b||"ngSrc"==b))return t.RESOURCE_URL}function S(a,c,d,e){var f=b(d,!0);if(f){if("multiple"===e&&"SELECT"===
Pa(a))throw ja("selmulti",ia(a));c.push({priority:100,compile:function(){return{pre:function(c,d,k){d=k.$$observers||(k.$$observers={});if(g.test(e))throw ja("nodomevents");if(f=b(k[e],!0,z(a,e)))k[e]=f(c),(d[e]||(d[e]=[])).$$inter=!0,(k.$$observers&&k.$$observers[e].$$scope||c).$watch(f,function(a,b){"class"===e&&a!=b?k.$updateClass(a,b):k.$set(e,a)})}}}})}}function ra(a,b,c){var d=b[0],e=b.length,f=d.parentNode,g,k;if(a)for(g=0,k=a.length;g<k;g++)if(a[g]==d){a[g++]=c;k=g+e-1;for(var p=a.length;g<
p;g++,k++)k<p?a[g]=a[k]:delete a[g];a.length-=e-1;break}f&&f.replaceChild(c,d);a=X.createDocumentFragment();a.appendChild(d);c[A.expando]=d[A.expando];d=1;for(e=b.length;d<e;d++)f=b[d],A(f).remove(),a.appendChild(f),delete b[d];b[0]=c;b.length=1}function rc(a,b){return E(function(){return a.apply(null,arguments)},a,b)}var Ob=function(a,b){this.$$element=a;this.$attr=b||{}};Ob.prototype={$normalize:qa,$addClass:function(a){a&&0<a.length&&y.addClass(this.$$element,a)},$removeClass:function(a){a&&0<
a.length&&y.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=sc(a,b),d=sc(b,a);0===c.length?y.removeClass(this.$$element,d):0===d.length?y.addClass(this.$$element,c):y.setClass(this.$$element,c,d)},$set:function(a,b,c,d){var e=oc(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=d:(d=this.$attr[a])||(this.$attr[a]=d=nb(a,"-"));e=Pa(this.$$element);if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=b=K(b,"src"===a);!1!==c&&(null===b||b===u?this.$$element.removeAttr(d):
this.$$element.attr(d,b));(c=this.$$observers)&&r(c[a],function(a){try{a(b)}catch(c){l(c)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);J.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var sa=b.startSymbol(),Ia=b.endSymbol(),W="{{"==sa||"}}"==Ia?ga:function(a){return a.replace(/\{\{/g,sa).replace(/}}/g,Ia)},U=/^ngAttr[A-Z]/;return B}]}function qa(b){return ab(b.replace(we,""))}function sc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),
f=0;a:for(;f<d.length;f++){for(var g=d[f],h=0;h<e.length;h++)if(g==e[h])continue a;c+=(0<c.length?" ":"")+g}return c}function Od(){var b={},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){Ea(a,"controller");T(a)?E(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,f){var g,h,k;G(e)&&(g=e.match(a),h=g[1],k=g[3],e=b.hasOwnProperty(h)?b[h]:fc(f.$scope,h,!0)||fc(d,h,!0),Ya(e,h,!0));g=c.instantiate(e,f);if(k){if(!f||"object"!==typeof f.$scope)throw z("$controller")("noscp",
h||e.name,k);f.$scope[k]=g}return g}}]}function Pd(){this.$get=["$window",function(b){return A(b.document)}]}function Qd(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function tc(b){var a={},c,d,e;if(!b)return a;r(b.split("\n"),function(b){e=b.indexOf(":");c=x($(b.substr(0,e)));d=$(b.substr(e+1));c&&(a[c]=a[c]?a[c]+", "+d:d)});return a}function uc(b){var a=T(b)?b:u;return function(c){a||(a=tc(b));return c?a[x(c)]||null:a}}function vc(b,a,c){if(N(c))return c(b,
a);r(c,function(c){b=c(b,a)});return b}function Td(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},e=this.defaults={transformResponse:[function(d){G(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=ac(d)));return d}],transformRequest:[function(a){return T(a)&&"[object File]"!==Ba.call(a)&&"[object Blob]"!==Ba.call(a)?oa(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:ha(d),put:ha(d),patch:ha(d)},xsrfCookieName:"XSRF-TOKEN",
xsrfHeaderName:"X-XSRF-TOKEN"},f=this.interceptors=[],g=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,d,n,q){function p(a){function b(a){var d=E({},a,{data:vc(a.data,a.headers,c.transformResponse)});return 200<=a.status&&300>a.status?d:n.reject(d)}var c={method:"get",transformRequest:e.transformRequest,transformResponse:e.transformResponse},d=function(a){var b=e.headers,c=E({},a.headers),d,f,b=E({},b.common,b[x(a.method)]);
a:for(d in b){a=x(d);for(f in c)if(x(f)===a)continue a;c[d]=b[d]}(function(a){var b;r(a,function(c,d){N(c)&&(b=c(),null!=b?a[d]=b:delete a[d])})})(c);return c}(a);E(c,a);c.headers=d;c.method=La(c.method);var f=[function(a){d=a.headers;var c=vc(a.data,uc(d),a.transformRequest);F(c)&&r(d,function(a,b){"content-type"===x(b)&&delete d[b]});F(a.withCredentials)&&!F(e.withCredentials)&&(a.withCredentials=e.withCredentials);return s(a,c,d).then(b,b)},u],g=n.when(c);for(r(t,function(a){(a.request||a.requestError)&&
f.unshift(a.request,a.requestError);(a.response||a.responseError)&&f.push(a.response,a.responseError)});f.length;){a=f.shift();var h=f.shift(),g=g.then(a,h)}g.success=function(a){g.then(function(b){a(b.data,b.status,b.headers,c)});return g};g.error=function(a){g.then(null,function(b){a(b.data,b.status,b.headers,c)});return g};return g}function s(c,f,g){function m(a,b,c,e){C&&(200<=a&&300>a?C.put(A,[a,b,tc(c),e]):C.remove(A));q(b,a,c,e);d.$$phase||d.$apply()}function q(a,b,d,e){b=Math.max(b,0);(200<=
b&&300>b?t.resolve:t.reject)({data:a,status:b,headers:uc(d),config:c,statusText:e})}function s(){var a=Ta(p.pendingRequests,c);-1!==a&&p.pendingRequests.splice(a,1)}var t=n.defer(),r=t.promise,C,I,A=J(c.url,c.params);p.pendingRequests.push(c);r.then(s,s);!c.cache&&!e.cache||(!1===c.cache||"GET"!==c.method&&"JSONP"!==c.method)||(C=T(c.cache)?c.cache:T(e.cache)?e.cache:w);if(C)if(I=C.get(A),D(I)){if(I&&N(I.then))return I.then(s,s),I;L(I)?q(I[1],I[0],ha(I[2]),I[3]):q(I,200,{},"OK")}else C.put(A,r);F(I)&&
((I=Pb(c.url)?b.cookies()[c.xsrfCookieName||e.xsrfCookieName]:u)&&(g[c.xsrfHeaderName||e.xsrfHeaderName]=I),a(c.method,A,f,m,g,c.timeout,c.withCredentials,c.responseType));return r}function J(a,b){if(!b)return a;var c=[];Sc(b,function(a,b){null===a||F(a)||(L(a)||(a=[a]),r(a,function(a){T(a)&&(a=va(a)?a.toISOString():oa(a));c.push(Da(b)+"="+Da(a))}))});0<c.length&&(a+=(-1==a.indexOf("?")?"?":"&")+c.join("&"));return a}var w=c("$http"),t=[];r(f,function(a){t.unshift(G(a)?q.get(a):q.invoke(a))});r(g,
function(a,b){var c=G(a)?q.get(a):q.invoke(a);t.splice(b,0,{response:function(a){return c(n.when(a))},responseError:function(a){return c(n.reject(a))}})});p.pendingRequests=[];(function(a){r(arguments,function(a){p[a]=function(b,c){return p(E(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){r(arguments,function(a){p[a]=function(b,c,d){return p(E(d||{},{method:a,url:b,data:c}))}})})("post","put","patch");p.defaults=e;return p}]}function xe(b){if(8>=R&&(!b.match(/^(get|post|head|put|delete|options)$/i)||
!W.XMLHttpRequest))return new W.ActiveXObject("Microsoft.XMLHTTP");if(W.XMLHttpRequest)return new W.XMLHttpRequest;throw z("$httpBackend")("noxhr");}function Ud(){this.$get=["$browser","$window","$document",function(b,a,c){return ye(b,xe,b.defer,a.angular.callbacks,c[0])}]}function ye(b,a,c,d,e){function f(a,b,c){var f=e.createElement("script"),g=null;f.type="text/javascript";f.src=a;f.async=!0;g=function(a){bb(f,"load",g);bb(f,"error",g);e.body.removeChild(f);f=null;var h=-1,s="unknown";a&&("load"!==
a.type||d[b].called||(a={type:"error"}),s=a.type,h="error"===a.type?404:200);c&&c(h,s)};sb(f,"load",g);sb(f,"error",g);8>=R&&(f.onreadystatechange=function(){G(f.readyState)&&/loaded|complete/.test(f.readyState)&&(f.onreadystatechange=null,g({type:"load"}))});e.body.appendChild(f);return g}var g=-1;return function(e,k,m,l,n,q,p,s){function J(){t=g;K&&K();B&&B.abort()}function w(a,d,e,f,g){O&&c.cancel(O);K=B=null;0===d&&(d=e?200:"file"==xa(k).protocol?404:0);a(1223===d?204:d,e,f,g||"");b.$$completeOutstandingRequest(v)}
var t;b.$$incOutstandingRequestCount();k=k||b.url();if("jsonp"==x(e)){var y="_"+(d.counter++).toString(36);d[y]=function(a){d[y].data=a;d[y].called=!0};var K=f(k.replace("JSON_CALLBACK","angular.callbacks."+y),y,function(a,b){w(l,a,d[y].data,"",b);d[y]=v})}else{var B=a(e);B.open(e,k,!0);r(n,function(a,b){D(a)&&B.setRequestHeader(b,a)});B.onreadystatechange=function(){if(B&&4==B.readyState){var a=null,b=null,c="";t!==g&&(a=B.getAllResponseHeaders(),b="response"in B?B.response:B.responseText);t===g&&
10>R||(c=B.statusText);w(l,t||B.status,b,a,c)}};p&&(B.withCredentials=!0);if(s)try{B.responseType=s}catch(ba){if("json"!==s)throw ba;}B.send(m||null)}if(0<q)var O=c(J,q);else q&&N(q.then)&&q.then(J)}}function Rd(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function f(f,m,l){for(var n,q,p=0,s=[],J=f.length,w=!1,t=[];p<J;)-1!=(n=f.indexOf(b,p))&&-1!=(q=f.indexOf(a,
n+g))?(p!=n&&s.push(f.substring(p,n)),s.push(p=c(w=f.substring(n+g,q))),p.exp=w,p=q+h,w=!0):(p!=J&&s.push(f.substring(p)),p=J);(J=s.length)||(s.push(""),J=1);if(l&&1<s.length)throw wc("noconcat",f);if(!m||w)return t.length=J,p=function(a){try{for(var b=0,c=J,g;b<c;b++){if("function"==typeof(g=s[b]))if(g=g(a),g=l?e.getTrusted(l,g):e.valueOf(g),null==g)g="";else switch(typeof g){case "string":break;case "number":g=""+g;break;default:g=oa(g)}t[b]=g}return t.join("")}catch(h){a=wc("interr",f,h.toString()),
d(a)}},p.exp=f,p.parts=s,p}var g=b.length,h=a.length;f.startSymbol=function(){return b};f.endSymbol=function(){return a};return f}]}function Sd(){this.$get=["$rootScope","$window","$q",function(b,a,c){function d(d,g,h,k){var m=a.setInterval,l=a.clearInterval,n=c.defer(),q=n.promise,p=0,s=D(k)&&!k;h=D(h)?h:0;q.then(null,null,d);q.$$intervalId=m(function(){n.notify(p++);0<h&&p>=h&&(n.resolve(p),l(q.$$intervalId),delete e[q.$$intervalId]);s||b.$apply()},g);e[q.$$intervalId]=n;return q}var e={};d.cancel=
function(b){return b&&b.$$intervalId in e?(e[b.$$intervalId].reject("canceled"),a.clearInterval(b.$$intervalId),delete e[b.$$intervalId],!0):!1};return d}]}function ad(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),
SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function Qb(b){b=b.split("/");for(var a=b.length;a--;)b[a]=
mb(b[a]);return b.join("/")}function xc(b,a,c){b=xa(b,c);a.$$protocol=b.protocol;a.$$host=b.hostname;a.$$port=U(b.port)||ze[b.protocol]||null}function yc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=xa(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=cc(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function ta(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Ga(b){var a=
b.indexOf("#");return-1==a?b:b.substr(0,a)}function Rb(b){return b.substr(0,Ga(b).lastIndexOf("/")+1)}function zc(b,a){this.$$html5=!0;a=a||"";var c=Rb(b);xc(b,this,b);this.$$parse=function(a){var e=ta(c,a);if(!G(e))throw Sb("ipthprfx",a,c);yc(e,this,b);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Cb(this.$$search),b=this.$$hash?"#"+mb(this.$$hash):"";this.$$url=Qb(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$parseLinkUrl=function(d,
e){var f,g;(f=ta(b,d))!==u?(g=f,g=(f=ta(a,f))!==u?c+(ta("/",f)||f):b+g):(f=ta(c,d))!==u?g=c+f:c==d+"/"&&(g=c);g&&this.$$parse(g);return!!g}}function Tb(b,a){var c=Rb(b);xc(b,this,b);this.$$parse=function(d){var e=ta(b,d)||ta(c,d),e="#"==e.charAt(0)?ta(a,e):this.$$html5?e:"";if(!G(e))throw Sb("ihshprfx",d,a);yc(e,this,b);d=this.$$path;var f=/^\/[A-Z]:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));f.exec(e)||(d=(e=f.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Cb(this.$$search),
e=this.$$hash?"#"+mb(this.$$hash):"";this.$$url=Qb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+(this.$$url?a+this.$$url:"")};this.$$parseLinkUrl=function(a,c){return Ga(b)==Ga(a)?(this.$$parse(a),!0):!1}}function Ac(b,a){this.$$html5=!0;Tb.apply(this,arguments);var c=Rb(b);this.$$parseLinkUrl=function(d,e){var f,g;b==Ga(d)?f=d:(g=ta(c,d))?f=b+a+g:c===d+"/"&&(f=c);f&&this.$$parse(f);return!!f};this.$$compose=function(){var c=Cb(this.$$search),e=this.$$hash?"#"+mb(this.$$hash):"";this.$$url=Qb(this.$$path)+
(c?"?"+c:"")+e;this.$$absUrl=b+a+this.$$url}}function tb(b){return function(){return this[b]}}function Bc(b,a){return function(c){if(F(c))return this[b];this[b]=a(c);this.$$compose();return this}}function Vd(){var b="",a=!1;this.hashPrefix=function(a){return D(a)?(b=a,this):b};this.html5Mode=function(b){return D(b)?(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,f){function g(a){c.$broadcast("$locationChangeSuccess",h.absUrl(),a)}var h,k=d.baseHref(),m=d.url();
a?(k=m.substring(0,m.indexOf("/",m.indexOf("//")+2))+(k||"/"),e=e.history?zc:Ac):(k=Ga(m),e=Tb);h=new e(k,"#"+b);h.$$parseLinkUrl(m,m);var l=/^\s*(javascript|mailto):/i;f.on("click",function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var b=A(a.target);"a"!==x(b[0].nodeName);)if(b[0]===f[0]||!(b=b.parent())[0])return;var e=b.prop("href"),g=b.attr("href")||b.attr("xlink:href");T(e)&&"[object SVGAnimatedString]"===e.toString()&&(e=xa(e.animVal).href);l.test(e)||(!e||(b.attr("target")||a.isDefaultPrevented())||
!h.$$parseLinkUrl(e,g))||(a.preventDefault(),h.absUrl()!=d.url()&&(c.$apply(),W.angular["ff-684208-preventDefault"]=!0))}});h.absUrl()!=m&&d.url(h.absUrl(),!0);d.onUrlChange(function(a){h.absUrl()!=a&&(c.$evalAsync(function(){var b=h.absUrl();h.$$parse(a);c.$broadcast("$locationChangeStart",a,b).defaultPrevented?(h.$$parse(b),d.url(b)):g(b)}),c.$$phase||c.$digest())});var n=0;c.$watch(function(){var a=d.url(),b=h.$$replace;n&&a==h.absUrl()||(n++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",
h.absUrl(),a).defaultPrevented?h.$$parse(a):(d.url(h.absUrl(),b),g(a))}));h.$$replace=!1;return n});return h}]}function Wd(){var b=!0,a=this;this.debugEnabled=function(a){return D(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||v;a=!1;try{a=!!e.apply}catch(k){}return a?
function(){var a=[];r(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function ka(b,a){if("__defineGetter__"===b||"__defineSetter__"===b||"__lookupGetter__"===b||"__lookupSetter__"===b||"__proto__"===b)throw la("isecfld",a);return b}function ma(b,a){if(b){if(b.constructor===b)throw la("isecfn",a);if(b.document&&
b.location&&b.alert&&b.setInterval)throw la("isecwindow",a);if(b.children&&(b.nodeName||b.prop&&b.attr&&b.find))throw la("isecdom",a);if(b===Object)throw la("isecobj",a);}return b}function ub(b,a,c,d,e){ma(b,d);e=e||{};a=a.split(".");for(var f,g=0;1<a.length;g++){f=ka(a.shift(),d);var h=ma(b[f],d);h||(h={},b[f]=h);b=h;b.then&&e.unwrapPromises&&(ya(d),"$$v"in b||function(a){a.then(function(b){a.$$v=b})}(b),b.$$v===u&&(b.$$v={}),b=b.$$v)}f=ka(a.shift(),d);ma(b[f],d);return b[f]=c}function Qa(b){return"constructor"==
b}function Cc(b,a,c,d,e,f,g){ka(b,f);ka(a,f);ka(c,f);ka(d,f);ka(e,f);var h=function(a){return ma(a,f)},k=g.expensiveChecks,m=k||Qa(b)?h:ga,l=k||Qa(a)?h:ga,n=k||Qa(c)?h:ga,q=k||Qa(d)?h:ga,p=k||Qa(e)?h:ga;return g.unwrapPromises?function(g,h){var k=h&&h.hasOwnProperty(b)?h:g,t;if(null==k)return k;(k=m(k[b]))&&k.then&&(ya(f),"$$v"in k||(t=k,t.$$v=u,t.then(function(a){t.$$v=m(a)})),k=m(k.$$v));if(!a)return k;if(null==k)return u;(k=l(k[a]))&&k.then&&(ya(f),"$$v"in k||(t=k,t.$$v=u,t.then(function(a){t.$$v=
l(a)})),k=l(k.$$v));if(!c)return k;if(null==k)return u;(k=n(k[c]))&&k.then&&(ya(f),"$$v"in k||(t=k,t.$$v=u,t.then(function(a){t.$$v=n(a)})),k=n(k.$$v));if(!d)return k;if(null==k)return u;(k=q(k[d]))&&k.then&&(ya(f),"$$v"in k||(t=k,t.$$v=u,t.then(function(a){t.$$v=q(a)})),k=q(k.$$v));if(!e)return k;if(null==k)return u;(k=p(k[e]))&&k.then&&(ya(f),"$$v"in k||(t=k,t.$$v=u,t.then(function(a){t.$$v=p(a)})),k=p(k.$$v));return k}:function(f,g){var h=g&&g.hasOwnProperty(b)?g:f;if(null==h)return h;h=m(h[b]);
if(!a)return h;if(null==h)return u;h=l(h[a]);if(!c)return h;if(null==h)return u;h=n(h[c]);if(!d)return h;if(null==h)return u;h=q(h[d]);return e?null==h?u:h=p(h[e]):h}}function Ae(b,a){return function(c,d){return b(c,d,ya,ma,a)}}function Dc(b,a,c){var d=a.expensiveChecks,e=d?Be:Ce;if(e.hasOwnProperty(b))return e[b];var f=b.split("."),g=f.length,h;if(a.csp)h=6>g?Cc(f[0],f[1],f[2],f[3],f[4],c,a):function(b,d){var e=0,h;do h=Cc(f[e++],f[e++],f[e++],f[e++],f[e++],c,a)(b,d),d=u,b=h;while(e<g);return h};
else{var k="var p;\n";d&&(k+="s = eso(s, fe);\nl = eso(l, fe);\n");var m=d;r(f,function(b,e){ka(b,c);var f=(e?"s":'((l&&l.hasOwnProperty("'+b+'"))?l:s)')+'["'+b+'"]',g=d||Qa(b);g&&(f="eso("+f+", fe)",m=!0);k+="if(s == null) return undefined;\ns="+f+";\n";a.unwrapPromises&&(k+='if (s && s.then) {\n pw("'+c.replace(/(["\r\n])/g,"\\$1")+'");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v='+(g?"eso(v)":"v")+";});\n}\n s="+(g?"eso(s.$$v)":"s.$$v")+"\n}\n")});k+="return s;";
h=new Function("s","l","pw","eso","fe",k);h.toString=aa(k);if(m||a.unwrapPromises)h=Ae(h,c)}"hasOwnProperty"!==b&&(e[b]=h);return h}function Xd(){var b={},a={},c={csp:!1,unwrapPromises:!1,logPromiseWarnings:!0,expensiveChecks:!1};this.unwrapPromises=function(a){return D(a)?(c.unwrapPromises=!!a,this):c.unwrapPromises};this.logPromiseWarnings=function(a){return D(a)?(c.logPromiseWarnings=a,this):c.logPromiseWarnings};this.$get=["$filter","$sniffer","$log",function(d,e,f){c.csp=e.csp;var g={csp:c.csp,
unwrapPromises:c.unwrapPromises,logPromiseWarnings:c.logPromiseWarnings,expensiveChecks:!0};ya=function(a){c.logPromiseWarnings&&!Ec.hasOwnProperty(a)&&(Ec[a]=!0,f.warn("[$parse] Promise found in the expression `"+a+"`. Automatic unwrapping of promises in Angular expressions is deprecated."))};return function(e,f){var m;switch(typeof e){case "string":var l=f?a:b;if(l.hasOwnProperty(e))return l[e];m=f?g:c;var n=new Ub(m);m=(new gb(n,d,m)).parse(e);"hasOwnProperty"!==e&&(l[e]=m);return m;case "function":return e;
default:return v}}}]}function Zd(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return De(function(a){b.$evalAsync(a)},a)}]}function De(b,a){function c(a){return a}function d(a){return g(a)}var e=function(){var g=[],m,l;return l={resolve:function(a){if(g){var c=g;g=u;m=f(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],m.then(a[0],a[1],a[2])})}},reject:function(a){l.resolve(h(a))},notify:function(a){if(g){var c=g;g.length&&b(function(){for(var b,d=0,e=c.length;d<e;d++)b=
c[d],b[2](a)})}},promise:{then:function(b,f,h){var l=e(),J=function(d){try{l.resolve((N(b)?b:c)(d))}catch(e){l.reject(e),a(e)}},w=function(b){try{l.resolve((N(f)?f:d)(b))}catch(c){l.reject(c),a(c)}},t=function(b){try{l.notify((N(h)?h:c)(b))}catch(d){a(d)}};g?g.push([J,w,t]):m.then(J,w,t);return l.promise},"catch":function(a){return this.then(null,a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):d.reject(a);return d.promise}function d(e,f){var g=null;try{g=(a||c)()}catch(h){return b(h,
!1)}return g&&N(g.then)?g.then(function(){return b(e,f)},function(a){return b(a,!1)}):b(e,f)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},f=function(a){return a&&N(a.then)?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},g=function(a){var b=e();b.reject(a);return b.promise},h=function(c){return{then:function(f,g){var h=e();b(function(){try{h.resolve((N(g)?g:d)(c))}catch(b){h.reject(b),a(b)}});return h.promise}}};return{defer:e,reject:g,
when:function(h,m,l,n){var q=e(),p,s=function(b){try{return(N(m)?m:c)(b)}catch(d){return a(d),g(d)}},J=function(b){try{return(N(l)?l:d)(b)}catch(c){return a(c),g(c)}},w=function(b){try{return(N(n)?n:c)(b)}catch(d){a(d)}};b(function(){f(h).then(function(a){p||(p=!0,q.resolve(f(a).then(s,J,w)))},function(a){p||(p=!0,q.resolve(J(a)))},function(a){p||q.notify(w(a))})});return q.promise},all:function(a){var b=e(),c=0,d=L(a)?[]:{};r(a,function(a,e){c++;f(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,
--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function fe(){this.$get=["$window","$timeout",function(b,a){var c=b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame,d=b.cancelAnimationFrame||b.webkitCancelAnimationFrame||b.mozCancelAnimationFrame||b.webkitCancelRequestAnimationFrame,e=!!c,f=e?function(a){var b=c(a);return function(){d(b)}}:function(b){var c=a(b,16.66,!1);return function(){a.cancel(c)}};f.supported=
e;return f}]}function Yd(){var b=10,a=z("$rootScope"),c=null;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(d,e,f,g){function h(){this.$id=ib();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings=
{}}function k(b){if(q.$$phase)throw a("inprog",q.$$phase);q.$$phase=b}function m(a,b){var c=f(a);Ya(c,b);return c}function l(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function n(){}h.prototype={constructor:h,$new:function(a){a?(a=new h,a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=this.$$postDigestQueue):(this.$$childScopeClass||(this.$$childScopeClass=function(){this.$$watchers=this.$$nextSibling=this.$$childHead=
this.$$childTail=null;this.$$listeners={};this.$$listenerCount={};this.$id=ib();this.$$childScopeClass=null},this.$$childScopeClass.prototype=this),a=new this.$$childScopeClass);a["this"]=a;a.$parent=this;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,d){var e=m(a,"watch"),f=this.$$watchers,g={fn:b,last:n,get:e,exp:a,eq:!!d};c=null;if(!N(b)){var h=m(b||v,"listener");g.fn=function(a,
b,c){h(c)}}if("string"==typeof a&&e.constant){var k=g.fn;g.fn=function(a,b,c){k.call(this,a,b,c);Ua(f,g)}}f||(f=this.$$watchers=[]);f.unshift(g);return function(){Ua(f,g);c=null}},$watchCollection:function(a,b){var c=this,d,e,g,h=1<b.length,k=0,l=f(a),m=[],n={},q=!0,r=0;return this.$watch(function(){d=l(c);var a,b,f;if(T(d))if(Sa(d))for(e!==m&&(e=m,r=e.length=0,k++),a=d.length,r!==a&&(k++,e.length=r=a),b=0;b<a;b++)f=e[b]!==e[b]&&d[b]!==d[b],f||e[b]===d[b]||(k++,e[b]=d[b]);else{e!==n&&(e=n={},r=0,
k++);a=0;for(b in d)d.hasOwnProperty(b)&&(a++,e.hasOwnProperty(b)?(f=e[b]!==e[b]&&d[b]!==d[b],f||e[b]===d[b]||(k++,e[b]=d[b])):(r++,e[b]=d[b],k++));if(r>a)for(b in k++,e)e.hasOwnProperty(b)&&!d.hasOwnProperty(b)&&(r--,delete e[b])}else e!==d&&(e=d,k++);return k},function(){q?(q=!1,b(d,d,c)):b(d,g,c);if(h)if(T(d))if(Sa(d)){g=Array(d.length);for(var a=0;a<d.length;a++)g[a]=d[a]}else for(a in g={},d)lb.call(d,a)&&(g[a]=d[a]);else g=d})},$digest:function(){var d,f,h,l,m=this.$$asyncQueue,r=this.$$postDigestQueue,
K,B,u=b,O,M=[],A,P,C;k("$digest");g.$$checkUrlChange();c=null;do{B=!1;for(O=this;m.length;){try{C=m.shift(),C.scope.$eval(C.expression)}catch(I){q.$$phase=null,e(I)}c=null}a:do{if(l=O.$$watchers)for(K=l.length;K--;)try{if(d=l[K])if((f=d.get(O))!==(h=d.last)&&!(d.eq?Ca(f,h):"number"===typeof f&&"number"===typeof h&&isNaN(f)&&isNaN(h)))B=!0,c=d,d.last=d.eq?Ka(f,null):f,d.fn(f,h===n?f:h,O),5>u&&(A=4-u,M[A]||(M[A]=[]),P=N(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,P+="; newVal: "+oa(f)+"; oldVal: "+
oa(h),M[A].push(P));else if(d===c){B=!1;break a}}catch(D){q.$$phase=null,e(D)}if(!(l=O.$$childHead||O!==this&&O.$$nextSibling))for(;O!==this&&!(l=O.$$nextSibling);)O=O.$parent}while(O=l);if((B||m.length)&&!u--)throw q.$$phase=null,a("infdig",b,oa(M));}while(B||m.length);for(q.$$phase=null;r.length;)try{r.shift()()}catch(x){e(x)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==q&&(r(this.$$listenerCount,Bb(null,l,this)),a.$$childHead==
this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&(a.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=this.$root=null,this.$$listeners={},this.$$watchers=this.$$asyncQueue=this.$$postDigestQueue=[],this.$destroy=this.$digest=this.$apply=v,this.$on=this.$watch=function(){return v})}},
$eval:function(a,b){return f(a)(this,b)},$evalAsync:function(a){q.$$phase||q.$$asyncQueue.length||g.defer(function(){q.$$asyncQueue.length&&q.$digest()});this.$$asyncQueue.push({scope:this,expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},$apply:function(a){try{return k("$apply"),this.$eval(a)}catch(b){e(b)}finally{q.$$phase=null;try{q.$digest()}catch(c){throw e(c),c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||
(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){var d=Ta(c,b);-1!==d&&(c[d]=null,l(e,1,a))}},$emit:function(a,b){var c=[],d,f=this,g=!1,h={name:a,targetScope:f,stopPropagation:function(){g=!0},preventDefault:function(){h.defaultPrevented=!0},defaultPrevented:!1},k=[h].concat(wa.call(arguments,1)),l,m;do{d=f.$$listeners[a]||c;h.currentScope=f;l=0;for(m=d.length;l<m;l++)if(d[l])try{d[l].apply(null,k)}catch(n){e(n)}else d.splice(l,1),l--,m--;if(g)break;
f=f.$parent}while(f);return h},$broadcast:function(a,b){for(var c=this,d=this,f={name:a,targetScope:this,preventDefault:function(){f.defaultPrevented=!0},defaultPrevented:!1},g=[f].concat(wa.call(arguments,1)),h,k;c=d;){f.currentScope=c;d=c.$$listeners[a]||[];h=0;for(k=d.length;h<k;h++)if(d[h])try{d[h].apply(null,g)}catch(l){e(l)}else d.splice(h,1),h--,k--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}return f}};var q=new h;
return q}]}function bd(){var b=/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*((https?|ftp|file):|data:image\/)/;this.aHrefSanitizationWhitelist=function(a){return D(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return D(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,f;if(!R||8<=R)if(f=xa(c).href,""!==f&&!f.match(e))return"unsafe:"+f;return c}}}function Ee(b){if("self"===b)return b;if(G(b)){if(-1<b.indexOf("***"))throw za("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,
"\\$1").replace(/\x08/g,"\\x08").replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return RegExp("^"+b+"$")}if(kb(b))return RegExp("^"+b.source+"$");throw za("imatcher");}function Fc(b){var a=[];D(b)&&r(b,function(b){a.push(Ee(b))});return a}function ae(){this.SCE_CONTEXTS=fa;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=Fc(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=Fc(b));return a};this.$get=["$injector",function(c){function d(a){var b=
function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var e=function(a){throw za("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));var f=d(),g={};g[fa.HTML]=d(f);g[fa.CSS]=d(f);g[fa.URL]=d(f);g[fa.JS]=d(f);g[fa.RESOURCE_URL]=d(g[fa.URL]);return{trustAs:function(a,b){var c=g.hasOwnProperty(a)?g[a]:null;if(!c)throw za("icontext",
a,b);if(null===b||b===u||""===b)return b;if("string"!==typeof b)throw za("itype",a);return new c(b)},getTrusted:function(c,d){if(null===d||d===u||""===d)return d;var f=g.hasOwnProperty(c)?g[c]:null;if(f&&d instanceof f)return d.$$unwrapTrustedValue();if(c===fa.RESOURCE_URL){var f=xa(d.toString()),l,n,q=!1;l=0;for(n=b.length;l<n;l++)if("self"===b[l]?Pb(f):b[l].exec(f.href)){q=!0;break}if(q)for(l=0,n=a.length;l<n;l++)if("self"===a[l]?Pb(f):a[l].exec(f.href)){q=!1;break}if(q)return d;throw za("insecurl",
d.toString());}if(c===fa.HTML)return e(d);throw za("unsafe");},valueOf:function(a){return a instanceof f?a.$$unwrapTrustedValue():a}}}]}function $d(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw za("iequirks");var e=ha(fa);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},
e.valueOf=ga);e.parseAs=function(b,c){var d=a(c);return d.literal&&d.constant?d:function(a,c){return e.getTrusted(b,d(a,c))}};var f=e.parseAs,g=e.getTrusted,h=e.trustAs;r(fa,function(a,b){var c=x(b);e[ab("parse_as_"+c)]=function(b){return f(a,b)};e[ab("get_trusted_"+c)]=function(b){return g(a,b)};e[ab("trust_as_"+c)]=function(b){return h(a,b)}});return e}]}function be(){this.$get=["$window","$document",function(b,a){var c={},d=U((/android (\d+)/.exec(x((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||
{}).userAgent),f=a[0]||{},g=f.documentMode,h,k=/^(Moz|webkit|O|ms)(?=[A-Z])/,m=f.body&&f.body.style,l=!1,n=!1;if(m){for(var q in m)if(l=k.exec(q)){h=l[0];h=h.substr(0,1).toUpperCase()+h.substr(1);break}h||(h="WebkitOpacity"in m&&"webkit");l=!!("transition"in m||h+"Transition"in m);n=!!("animation"in m||h+"Animation"in m);!d||l&&n||(l=G(f.body.style.webkitTransition),n=G(f.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!g||7<
g),hasEvent:function(a){if("input"==a&&9==R)return!1;if(F(c[a])){var b=f.createElement("div");c[a]="on"+a in b}return c[a]},csp:Za(),vendorPrefix:h,transitions:l,animations:n,android:d,msie:R,msieDocumentMode:g}}]}function de(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,h,k){var m=c.defer(),l=m.promise,n=D(k)&&!k;h=a.defer(function(){try{m.resolve(e())}catch(a){m.reject(a),d(a)}finally{delete f[l.$$timeoutId]}n||b.$apply()},h);l.$$timeoutId=h;f[h]=m;
return l}var f={};e.cancel=function(b){return b&&b.$$timeoutId in f?(f[b.$$timeoutId].reject("canceled"),delete f[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function xa(b,a){var c=b;R&&(Y.setAttribute("href",c),c=Y.href);Y.setAttribute("href",c);return{href:Y.href,protocol:Y.protocol?Y.protocol.replace(/:$/,""):"",host:Y.host,search:Y.search?Y.search.replace(/^\?/,""):"",hash:Y.hash?Y.hash.replace(/^#/,""):"",hostname:Y.hostname,port:Y.port,pathname:"/"===Y.pathname.charAt(0)?Y.pathname:
"/"+Y.pathname}}function Pb(b){b=G(b)?xa(b):b;return b.protocol===Gc.protocol&&b.host===Gc.host}function ee(){this.$get=aa(W)}function kc(b){function a(d,e){if(T(d)){var f={};r(d,function(b,c){f[c]=a(c,b)});return f}return b.factory(d+c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+c)}}];a("currency",Hc);a("date",Ic);a("filter",Fe);a("json",Ge);a("limitTo",He);a("lowercase",Ie);a("number",Jc);a("orderBy",Kc);a("uppercase",Je)}function Fe(){return function(b,
a,c){if(!L(b))return b;var d=typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Xa.equals(a,b)}:function(a,b){if(a&&b&&"object"===typeof a&&"object"===typeof b){for(var d in a)if("$"!==d.charAt(0)&&lb.call(a,d)&&c(a[d],b[d]))return!0;return!1}b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var f=function(a,b){if("string"===typeof b&&"!"===b.charAt(0))return!f(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,
b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&f(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(f(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var g in a)(function(b){"undefined"!==typeof a[b]&&e.push(function(c){return f("$"==b?c:c&&c[b],a[b])})})(g);break;case "function":e.push(a);break;default:return b}d=[];for(g=0;g<b.length;g++){var h=
b[g];e.check(h)&&d.push(h)}return d}}function Hc(b){var a=b.NUMBER_FORMATS;return function(b,d){F(d)&&(d=a.CURRENCY_SYM);return Lc(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Jc(b){var a=b.NUMBER_FORMATS;return function(b,d){return Lc(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Lc(b,a,c,d,e){if(null==b||!isFinite(b)||T(b))return"";var f=0>b;b=Math.abs(b);var g=b+"",h="",k=[],m=!1;if(-1!==g.indexOf("e")){var l=g.match(/([\d\.]+)e(-?)(\d+)/);l&&"-"==l[2]&&
l[3]>e+1?(g="0",b=0):(h=g,m=!0)}if(m)0<e&&(-1<b&&1>b)&&(h=b.toFixed(e));else{g=(g.split(Mc)[1]||"").length;F(e)&&(e=Math.min(Math.max(a.minFrac,g),a.maxFrac));b=+(Math.round(+(b.toString()+"e"+e)).toString()+"e"+-e);0===b&&(f=!1);b=(""+b).split(Mc);g=b[0];b=b[1]||"";var l=0,n=a.lgSize,q=a.gSize;if(g.length>=n+q)for(l=g.length-n,m=0;m<l;m++)0===(l-m)%q&&0!==m&&(h+=c),h+=g.charAt(m);for(m=l;m<g.length;m++)0===(g.length-m)%n&&0!==m&&(h+=c),h+=g.charAt(m);for(;b.length<e;)b+="0";e&&"0"!==e&&(h+=d+b.substr(0,
e))}k.push(f?a.negPre:a.posPre);k.push(h);k.push(f?a.negSuf:a.posSuf);return k.join("")}function Vb(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function Z(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Vb(e,a,d)}}function vb(b,a){return function(c,d){var e=c["get"+b](),f=La(a?"SHORT"+b:b);return d[f][e]}}function Ic(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var f=0,g=0,h=b[8]?
a.setUTCFullYear:a.setFullYear,k=b[8]?a.setUTCHours:a.setHours;b[9]&&(f=U(b[9]+b[10]),g=U(b[9]+b[11]));h.call(a,U(b[1]),U(b[2])-1,U(b[3]));f=U(b[4]||0)-f;g=U(b[5]||0)-g;h=U(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));k.call(a,f,g,h,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e){var f="",g=[],h,k;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;G(c)&&(c=Ke.test(c)?U(c):a(c));jb(c)&&(c=new Date(c));
if(!va(c))return c;for(;e;)(k=Le.exec(e))?(g=g.concat(wa.call(k,1)),e=g.pop()):(g.push(e),e=null);r(g,function(a){h=Me[a];f+=h?h(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return f}}function Ge(){return function(b){return oa(b,!0)}}function He(){return function(b,a){if(!L(b)&&!G(b))return b;a=Infinity===Math.abs(Number(a))?Number(a):U(a);if(G(b))return a?0<=a?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,e=a):(d=
b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function Kc(b){return function(a,c,d){function e(a,b){return Wa(b)?function(b,c){return a(c,b)}:a}function f(a,b){var c=typeof a,d=typeof b;return c==d?(va(a)&&va(b)&&(a=a.valueOf(),b=b.valueOf()),"string"==c&&(a=a.toLowerCase(),b=b.toLowerCase()),a===b?0:a<b?-1:1):c<d?-1:1}if(!Sa(a))return a;c=L(c)?c:[c];0===c.length&&(c=["+"]);c=Uc(c,function(a){var c=!1,d=a||ga;if(G(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),a=a.substring(1);
if(""===a)return e(function(a,b){return f(a,b)},c);d=b(a);if(d.constant){var m=d();return e(function(a,b){return f(a[m],b[m])},c)}}return e(function(a,b){return f(d(a),d(b))},c)});return wa.call(a).sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function Aa(b){N(b)&&(b={link:b});b.restrict=b.restrict||"AC";return aa(b)}function Nc(b,a,c,d){function e(a,c){c=c?"-"+nb(c,"-"):"";d.setClass(b,(a?wb:xb)+c,(a?xb:wb)+c)}var f=this,g=b.parent().controller("form")||
yb,h=0,k=f.$error={},m=[];f.$name=a.name||a.ngForm;f.$dirty=!1;f.$pristine=!0;f.$valid=!0;f.$invalid=!1;g.$addControl(f);b.addClass(Ra);e(!0);f.$addControl=function(a){Ea(a.$name,"input");m.push(a);a.$name&&(f[a.$name]=a)};f.$removeControl=function(a){a.$name&&f[a.$name]===a&&delete f[a.$name];r(k,function(b,c){f.$setValidity(c,!0,a)});Ua(m,a)};f.$setValidity=function(a,b,c){var d=k[a];if(b)d&&(Ua(d,c),d.length||(h--,h||(e(b),f.$valid=!0,f.$invalid=!1),k[a]=!1,e(!0,a),g.$setValidity(a,!0,f)));else{h||
e(b);if(d){if(-1!=Ta(d,c))return}else k[a]=d=[],h++,e(!1,a),g.$setValidity(a,!1,f);d.push(c);f.$valid=!1;f.$invalid=!0}};f.$setDirty=function(){d.removeClass(b,Ra);d.addClass(b,zb);f.$dirty=!0;f.$pristine=!1;g.$setDirty()};f.$setPristine=function(){d.removeClass(b,zb);d.addClass(b,Ra);f.$dirty=!1;f.$pristine=!0;r(m,function(a){a.$setPristine()})}}function ua(b,a,c,d){b.$setValidity(a,c);return c?d:u}function Oc(b,a){var c,d;if(a)for(c=0;c<a.length;++c)if(d=a[c],b[d])return!0;return!1}function Ne(b,
a,c,d,e){T(e)&&(b.$$hasNativeValidators=!0,b.$parsers.push(function(f){if(b.$error[a]||Oc(e,d)||!Oc(e,c))return f;b.$setValidity(a,!1)}))}function Ab(b,a,c,d,e,f){var g=a.prop(Oe),h=a[0].placeholder,k={},m=x(a[0].type);d.$$validityState=g;if(!e.android){var l=!1;a.on("compositionstart",function(a){l=!0});a.on("compositionend",function(){l=!1;n()})}var n=function(e){if(!l){var f=a.val();if(R&&"input"===(e||k).type&&a[0].placeholder!==h)h=a[0].placeholder;else if("password"!==m&&Wa(c.ngTrim||"T")&&
(f=$(f)),e=g&&d.$$hasNativeValidators,d.$viewValue!==f||""===f&&e)b.$root.$$phase?d.$setViewValue(f):b.$apply(function(){d.$setViewValue(f)})}};if(e.hasEvent("input"))a.on("input",n);else{var q,p=function(){q||(q=f.defer(function(){n();q=null}))};a.on("keydown",function(a){a=a.keyCode;91===a||(15<a&&19>a||37<=a&&40>=a)||p()});if(e.hasEvent("paste"))a.on("paste cut",p)}a.on("change",n);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?"":d.$viewValue)};var s=c.ngPattern;s&&((e=s.match(/^\/(.*)\/([gim]*)$/))?
(s=RegExp(e[1],e[2]),e=function(a){return ua(d,"pattern",d.$isEmpty(a)||s.test(a),a)}):e=function(c){var e=b.$eval(s);if(!e||!e.test)throw z("ngPattern")("noregexp",s,e,ia(a));return ua(d,"pattern",d.$isEmpty(c)||e.test(c),c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var r=U(c.ngMinlength);e=function(a){return ua(d,"minlength",d.$isEmpty(a)||a.length>=r,a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var w=U(c.ngMaxlength);e=function(a){return ua(d,"maxlength",d.$isEmpty(a)||
a.length<=w,a)};d.$parsers.push(e);d.$formatters.push(e)}}function Wb(b,a){b="ngClass"+b;return["$animate",function(c){function d(a,b){var c=[],d=0;a:for(;d<a.length;d++){for(var e=a[d],l=0;l<b.length;l++)if(e==b[l])continue a;c.push(e)}return c}function e(a){if(!L(a)){if(G(a))return a.split(" ");if(T(a)){var b=[];r(a,function(a,c){a&&(b=b.concat(c.split(" ")))});return b}}return a}return{restrict:"AC",link:function(f,g,h){function k(a,b){var c=g.data("$classCounts")||{},d=[];r(a,function(a){if(0<
b||c[a])c[a]=(c[a]||0)+b,c[a]===+(0<b)&&d.push(a)});g.data("$classCounts",c);return d.join(" ")}function m(b){if(!0===a||f.$index%2===a){var m=e(b||[]);if(!l){var p=k(m,1);h.$addClass(p)}else if(!Ca(b,l)){var s=e(l),p=d(m,s),m=d(s,m),m=k(m,-1),p=k(p,1);0===p.length?c.removeClass(g,m):0===m.length?c.addClass(g,p):c.setClass(g,p,m)}}l=ha(b)}var l;f.$watch(h[b],m,!0);h.$observe("class",function(a){m(f.$eval(h[b]))});"ngClass"!==b&&f.$watch("$index",function(c,d){var g=c&1;if(g!==(d&1)){var l=e(f.$eval(h[b]));
g===a?(g=k(l,1),h.$addClass(g)):(g=k(l,-1),h.$removeClass(g))}})}}}]}var Oe="validity",x=function(b){return G(b)?b.toLowerCase():b},lb=Object.prototype.hasOwnProperty,La=function(b){return G(b)?b.toUpperCase():b},R,A,Fa,wa=[].slice,Pe=[].push,Ba=Object.prototype.toString,Va=z("ng"),Xa=W.angular||(W.angular={}),$a,Pa,na=["0","0","0"];R=U((/msie (\d+)/.exec(x(navigator.userAgent))||[])[1]);isNaN(R)&&(R=U((/trident\/.*; rv:(\d+)/.exec(x(navigator.userAgent))||[])[1]));v.$inject=[];ga.$inject=[];var L=
function(){return N(Array.isArray)?Array.isArray:function(b){return"[object Array]"===Ba.call(b)}}(),$=function(){return String.prototype.trim?function(b){return G(b)?b.trim():b}:function(b){return G(b)?b.replace(/^\s\s*/,"").replace(/\s\s*$/,""):b}}();Pa=9>R?function(b){b=b.nodeName?b:b[0];return b.scopeName&&"HTML"!=b.scopeName?La(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var Za=function(){if(D(Za.isActive_))return Za.isActive_;var b=!(!X.querySelector("[ng-csp]")&&
!X.querySelector("[data-ng-csp]"));if(!b)try{new Function("")}catch(a){b=!0}return Za.isActive_=b},Xc=/[A-Z]/g,$c={full:"1.2.28",major:1,minor:2,dot:28,codeName:"finnish-disembarkation"};S.expando="ng339";var cb=S.cache={},me=1,sb=W.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},bb=W.document.removeEventListener?function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)};S._data=function(b){return this.cache[b[this.expando]]||
{}};var he=/([\:\-\_]+(.))/g,ie=/^moz([A-Z])/,Hb=z("jqLite"),je=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,Ib=/<|&#?\w+;/,ke=/<([\w:]+)/,le=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,da={option:[1,'<select multiple="multiple">',"</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};da.optgroup=da.option;da.tbody=da.tfoot=da.colgroup=
da.caption=da.thead;da.th=da.td;var Oa=S.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===X.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),S(W).on("load",a))},toString:function(){var b=[];r(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?A(this[b]):A(this[this.length+b])},length:0,push:Pe,sort:[].sort,splice:[].splice},rb={};r("multiple selected checked disabled readOnly required open".split(" "),function(b){rb[x(b)]=b});
var pc={};r("input select option textarea button form details".split(" "),function(b){pc[La(b)]=!0});r({data:Mb,removeData:Lb},function(b,a){S[a]=b});r({data:Mb,inheritedData:qb,scope:function(b){return A.data(b,"$scope")||qb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return A.data(b,"$isolateScope")||A.data(b,"$isolateScopeNoTemplate")},controller:mc,injector:function(b){return qb(b,"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Nb,css:function(b,
a,c){a=ab(a);if(D(c))b.style[a]=c;else{var d;8>=R&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=R&&(d=""===d?u:d);return d}},attr:function(b,a,c){var d=x(a);if(rb[d])if(D(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||v).specified?d:u;else if(D(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),null===b?u:b},prop:function(b,a,c){if(D(c))b[a]=c;else return b[a]},text:function(){function b(b,
d){var e=a[b.nodeType];if(F(d))return e?b[e]:"";b[e]=d}var a=[];9>R?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,a){if(F(a)){if("SELECT"===Pa(b)&&b.multiple){var c=[];r(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(F(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<d.length;c++)Ma(d[c]);b.innerHTML=a},empty:nc},function(b,a){S.prototype[a]=function(a,d){var e,
f,g=this.length;if(b!==nc&&(2==b.length&&b!==Nb&&b!==mc?a:d)===u){if(T(a)){for(e=0;e<g;e++)if(b===Mb)b(this[e],a);else for(f in a)b(this[e],f,a[f]);return this}e=b.$dv;g=e===u?Math.min(g,1):g;for(f=0;f<g;f++){var h=b(this[f],a,d);e=e?e+h:h}return e}for(e=0;e<g;e++)b(this[e],a,d);return this}});r({removeData:Lb,dealoc:Ma,on:function a(c,d,e,f){if(D(f))throw Hb("onargs");var g=pa(c,"events"),h=pa(c,"handle");g||pa(c,"events",g={});h||pa(c,"handle",h=ne(c,g));r(d.split(" "),function(d){var f=g[d];if(!f){if("mouseenter"==
d||"mouseleave"==d){var l=X.body.contains||X.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};g[d]=[];a(c,{mouseleave:"mouseout",mouseenter:"mouseover"}[d],function(a){var c=a.relatedTarget;c&&(c===this||l(this,c))||h(a,d)})}else sb(c,d,h),g[d]=[];f=g[d]}f.push(e)})},
off:lc,one:function(a,c,d){a=A(a);a.on(c,function f(){a.off(c,d);a.off(c,f)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;Ma(a);r(new S(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];r(a.childNodes,function(a){1===a.nodeType&&c.push(a)});return c},contents:function(a){return a.contentDocument||a.childNodes||[]},append:function(a,c){r(new S(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,
c){if(1===a.nodeType){var d=a.firstChild;r(new S(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=A(c)[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Ma(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;r(new S(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:pb,removeClass:ob,toggleClass:function(a,c,d){c&&r(c.split(" "),function(c){var f=d;F(f)&&(f=!Nb(a,c));(f?pb:ob)(a,c)})},parent:function(a){return(a=
a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:Kb,triggerHandler:function(a,c,d){var e,f;e=c.type||c;var g=(pa(a,"events")||{})[e];g&&(e={preventDefault:function(){this.defaultPrevented=!0},isDefaultPrevented:function(){return!0===this.defaultPrevented},stopPropagation:v,type:e,target:a},
c.type&&(e=E(e,c)),c=ha(g),f=d?[e].concat(d):[e],r(c,function(c){c.apply(a,f)}))}},function(a,c){S.prototype[c]=function(c,e,f){for(var g,h=0;h<this.length;h++)F(g)?(g=a(this[h],c,e,f),D(g)&&(g=A(g))):Jb(g,a(this[h],c,e,f));return D(g)?g:this};S.prototype.bind=S.prototype.on;S.prototype.unbind=S.prototype.off});db.prototype={put:function(a,c){this[Na(a,this.nextUid)]=c},get:function(a){return this[Na(a,this.nextUid)]},remove:function(a){var c=this[a=Na(a,this.nextUid)];delete this[a];return c}};var pe=
/^function\s*[^\(]*\(\s*([^\)]*)\)/m,qe=/,/,re=/^\s*(_?)(\S+?)\1\s*$/,oe=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,eb=z("$injector"),Qe=z("$animate"),Ld=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Qe("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$timeout","$$asyncCallback",
function(a,d){return{enter:function(a,c,g,h){g?g.after(a):(c&&c[0]||(c=g.parent()),c.append(a));h&&d(h)},leave:function(a,c){a.remove();c&&d(c)},move:function(a,c,d,h){this.enter(a,c,d,h)},addClass:function(a,c,g){c=G(c)?c:L(c)?c.join(" "):"";r(a,function(a){pb(a,c)});g&&d(g)},removeClass:function(a,c,g){c=G(c)?c:L(c)?c.join(" "):"";r(a,function(a){ob(a,c)});g&&d(g)},setClass:function(a,c,g,h){r(a,function(a){pb(a,c);ob(a,g)});h&&d(h)},enabled:v}}]}],ja=z("$compile");gc.$inject=["$provide","$$sanitizeUriProvider"];
var we=/^(x[\:\-_]|data[\:\-_])/i,wc=z("$interpolate"),Re=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,ze={http:80,https:443,ftp:21},Sb=z("$location");Ac.prototype=Tb.prototype=zc.prototype={$$html5:!1,$$replace:!1,absUrl:tb("$$absUrl"),url:function(a){if(F(a))return this.$$url;a=Re.exec(a);a[1]&&this.path(decodeURIComponent(a[1]));(a[2]||a[1])&&this.search(a[3]||"");this.hash(a[5]||"");return this},protocol:tb("$$protocol"),host:tb("$$host"),port:tb("$$port"),path:Bc("$$path",function(a){a=null!==a?a.toString():
"";return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;case 1:if(G(a)||jb(a))a=a.toString(),this.$$search=cc(a);else if(T(a))r(a,function(c,e){null==c&&delete a[e]}),this.$$search=a;else throw Sb("isrcharg");break;default:F(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:Bc("$$hash",function(a){return null!==a?a.toString():""}),replace:function(){this.$$replace=!0;return this}};var la=z("$parse"),Ec=
{},ya,Se=Function.prototype.call,Te=Function.prototype.apply,Pc=Function.prototype.bind,hb={"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:v,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return D(d)?D(e)?d+e:d:D(e)?e:u},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(D(d)?d:0)-(D(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^
e(a,c)},"=":v,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,
c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},Ue={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},Ub=function(a){this.options=a};Ub.prototype={constructor:Ub,lex:function(a){this.text=a;this.index=0;this.ch=u;this.lastCh=":";for(this.tokens=[];this.index<this.text.length;){this.ch=this.text.charAt(this.index);if(this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent();
else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch}),this.index++;else if(this.isWhitespace(this.ch)){this.index++;continue}else{a=this.ch+this.peek();var c=a+this.peek(2),d=hb[this.ch],e=hb[a],f=hb[c];f?(this.tokens.push({index:this.index,text:c,fn:f}),this.index+=3):e?(this.tokens.push({index:this.index,text:a,fn:e}),this.index+=2):d?(this.tokens.push({index:this.index,text:this.ch,fn:d}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+
1)}this.lastCh=this.ch}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},was:function(a){return-1!==a.indexOf(this.lastCh)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},
throwError:function(a,c,d){d=d||this.index;c=D(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw la("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=x(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-
1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,literal:!0,constant:!0,fn:function(){return a}})},readIdent:function(){for(var a=this,c="",d=this.index,e,f,g,h;this.index<this.text.length;){h=this.text.charAt(this.index);if("."===h||this.isIdent(h)||this.isNumber(h))"."===h&&(e=this.index),c+=h;else break;this.index++}if(e)for(f=this.index;f<this.text.length;){h=this.text.charAt(f);if("("===h){g=c.substr(e-d+1);c=c.substr(0,e-d);this.index=f;break}if(this.isWhitespace(h))f++;
else break}d={index:d,text:c};if(hb.hasOwnProperty(c))d.fn=hb[c],d.literal=!0,d.constant=!0;else{var k=Dc(c,this.options,this.text);d.fn=E(function(a,c){return k(a,c)},{assign:function(d,e){return ub(d,c,e,a.text,a.options)}})}this.tokens.push(d);g&&(this.tokens.push({index:e,text:"."}),this.tokens.push({index:e+1,text:g}))},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,f=!1;this.index<this.text.length;){var g=this.text.charAt(this.index),e=e+g;if(f)"u"===g?(f=this.text.substring(this.index+
1,this.index+5),f.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+f+"]"),this.index+=4,d+=String.fromCharCode(parseInt(f,16))):d+=Ue[g]||g,f=!1;else if("\\"===g)f=!0;else{if(g===a){this.index++;this.tokens.push({index:c,text:e,string:d,literal:!0,constant:!0,fn:function(){return d}});return}d+=g}this.index++}this.throwError("Unterminated quote",c)}};var gb=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};gb.ZERO=E(function(){return 0},{constant:!0});gb.prototype={constructor:gb,
parse:function(a){this.text=a;this.tokens=this.lexer.lex(a);a=this.statements();0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]);a.literal=!!a.literal;a.constant=!!a.constant;return a},primary:function(){var a;if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=this.expect();(a=c.fn)||this.throwError("not a primary expression",c);a.literal=!!c.literal;a.constant=
!!c.constant}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw la("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw la("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){if(0<this.tokens.length){var f=this.tokens[0],g=f.text;if(g===
a||g===c||g===d||g===e||!(a||c||d||e))return f}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,e))?(this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},unaryFn:function(a,c){return E(function(d,e){return a(d,e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return E(function(e,f){return a(e,f)?c(e,f):d(e,f)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return E(function(e,f){return c(e,
f,a,d)},{constant:a.constant&&d.constant})},statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,f=0;f<a.length;f++){var g=a[f];g&&(e=g(c,d))}return e}},filterChain:function(){for(var a=this.expression(),c;;)if(c=this.expect("|"))a=this.binaryFn(a,c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];;)if(a=this.expect(":"))d.push(this.expression());
else{var e=function(a,e,h){h=[h];for(var k=0;k<d.length;k++)h.push(d[k](a,e));return c.apply(a,h)};return function(){return e}}},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),function(d,f){return a.assign(d,c(d,f),f)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.assignment();
if(d=this.expect(":"))return this.ternaryFn(a,c,this.assignment());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND());return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},
relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(gb.ZERO,a.fn,
this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=Dc(d,this.options,this.text);return E(function(c,d,h){return e(h||a(c,d))},{assign:function(e,g,h){(h=a(e,h))||a.assign(e,h={});return ub(h,d,g,c.text,c.options)}})},objectIndex:function(a){var c=this,d=this.expression();this.consume("]");return E(function(e,f){var g=a(e,f),h=d(e,f),k;ka(h,c.text);if(!g)return u;(g=ma(g[h],c.text))&&(g.then&&c.options.unwrapPromises)&&
(k=g,"$$v"in g||(k.$$v=u,k.then(function(a){k.$$v=a})),g=g.$$v);return g},{assign:function(e,f,g){var h=ka(d(e,g),c.text);(g=ma(a(e,g),c.text))||a.assign(e,g={});return g[h]=f}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");var e=this;return function(f,g){for(var h=[],k=c?c(f,g):f,m=0;m<d.length;m++)h.push(ma(d[m](f,g),e.text));m=a(f,g,k)||v;ma(k,e.text);var l=e.text;if(m){if(m.constructor===m)throw la("isecfn",
l);if(m===Se||m===Te||Pc&&m===Pc)throw la("isecff",l);}h=m.apply?m.apply(k,h):m(h[0],h[1],h[2],h[3],h[4]);return ma(h,e.text)}},arrayDeclaration:function(){var a=[],c=!0;if("]"!==this.peekToken().text){do{if(this.peek("]"))break;var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return E(function(c,d){for(var g=[],h=0;h<a.length;h++)g.push(a[h](c,d));return g},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{if(this.peek("}"))break;
var d=this.expect(),d=d.string||d.text;this.consume(":");var e=this.expression();a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return E(function(c,d){for(var e={},k=0;k<a.length;k++){var m=a[k];e[m.key]=m.value(c,d)}return e},{literal:!0,constant:c})}};var Ce={},Be={},za=z("$sce"),fa={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},Y=X.createElement("a"),Gc=xa(W.location.href,!0);kc.$inject=["$provide"];Hc.$inject=["$locale"];Jc.$inject=["$locale"];
var Mc=".",Me={yyyy:Z("FullYear",4),yy:Z("FullYear",2,0,!0),y:Z("FullYear",1),MMMM:vb("Month"),MMM:vb("Month",!0),MM:Z("Month",2,1),M:Z("Month",1,1),dd:Z("Date",2),d:Z("Date",1),HH:Z("Hours",2),H:Z("Hours",1),hh:Z("Hours",2,-12),h:Z("Hours",1,-12),mm:Z("Minutes",2),m:Z("Minutes",1),ss:Z("Seconds",2),s:Z("Seconds",1),sss:Z("Milliseconds",3),EEEE:vb("Day"),EEE:vb("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Vb(Math[0<
a?"floor":"ceil"](a/60),2)+Vb(Math.abs(a%60),2))}},Le=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,Ke=/^\-?\d+$/;Ic.$inject=["$locale"];var Ie=aa(x),Je=aa(La);Kc.$inject=["$parse"];var cd=aa({restrict:"E",compile:function(a,c){8>=R&&(c.href||c.name||c.$set("href",""),a.append(X.createComment("IE fix")));if(!c.href&&!c.xlinkHref&&!c.name)return function(a,c){var f="[object SVGAnimatedString]"===Ba.call(c.prop("href"))?"xlink:href":"href";c.on("click",function(a){c.attr(f)||
a.preventDefault()})}}}),Fb={};r(rb,function(a,c){if("multiple"!=a){var d=qa("ng-"+c);Fb[d]=function(){return{priority:100,link:function(a,f,g){a.$watch(g[d],function(a){g.$set(c,!!a)})}}}}});r(["src","srcset","href"],function(a){var c=qa("ng-"+a);Fb[c]=function(){return{priority:99,link:function(d,e,f){var g=a,h=a;"href"===a&&"[object SVGAnimatedString]"===Ba.call(e.prop("href"))&&(h="xlinkHref",f.$attr[h]="xlink:href",g=null);f.$observe(c,function(c){c?(f.$set(h,c),R&&g&&e.prop(g,f[h])):"href"===
a&&f.$set(h,null)})}}}});var yb={$addControl:v,$removeControl:v,$setValidity:v,$setDirty:v,$setPristine:v};Nc.$inject=["$element","$attrs","$scope","$animate"];var Qc=function(a){return["$timeout",function(c){return{name:"form",restrict:a?"EAC":"E",controller:Nc,compile:function(){return{pre:function(a,e,f,g){if(!f.action){var h=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};sb(e[0],"submit",h);e.on("$destroy",function(){c(function(){bb(e[0],"submit",h)},0,!1)})}var k=e.parent().controller("form"),
m=f.name||f.ngForm;m&&ub(a,m,g,m);if(k)e.on("$destroy",function(){k.$removeControl(g);m&&ub(a,m,u,m);E(g,yb)})}}}}}]},dd=Qc(),qd=Qc(!0),Ve=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,We=/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,Xe=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,Rc={text:Ab,number:function(a,c,d,e,f,g){Ab(a,c,d,e,f,g);e.$parsers.push(function(a){var c=e.$isEmpty(a);if(c||Xe.test(a))return e.$setValidity("number",
!0),""===a?null:c?a:parseFloat(a);e.$setValidity("number",!1);return u});Ne(e,"number",Ye,null,e.$$validityState);e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=parseFloat(d.min);return ua(e,"min",e.$isEmpty(a)||a>=c,a)},e.$parsers.push(a),e.$formatters.push(a));d.max&&(a=function(a){var c=parseFloat(d.max);return ua(e,"max",e.$isEmpty(a)||a<=c,a)},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){return ua(e,"number",e.$isEmpty(a)||
jb(a),a)})},url:function(a,c,d,e,f,g){Ab(a,c,d,e,f,g);a=function(a){return ua(e,"url",e.$isEmpty(a)||Ve.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,f,g){Ab(a,c,d,e,f,g);a=function(a){return ua(e,"email",e.$isEmpty(a)||We.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){F(d.name)&&c.attr("name",ib());c.on("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};
d.$observe("value",e.$render)},checkbox:function(a,c,d,e){var f=d.ngTrueValue,g=d.ngFalseValue;G(f)||(f=!0);G(g)||(g=!1);c.on("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==f};e.$formatters.push(function(a){return a===f});e.$parsers.push(function(a){return a?f:g})},hidden:v,button:v,submit:v,reset:v,file:v},Ye=["badInput"],hc=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",
link:function(d,e,f,g){g&&(Rc[x(f.type)]||Rc.text)(d,e,f,g,c,a)}}}],wb="ng-valid",xb="ng-invalid",Ra="ng-pristine",zb="ng-dirty",Ze=["$scope","$exceptionHandler","$attrs","$element","$parse","$animate",function(a,c,d,e,f,g){function h(a,c){c=c?"-"+nb(c,"-"):"";g.removeClass(e,(a?xb:wb)+c);g.addClass(e,(a?wb:xb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=
d.name;var k=f(d.ngModel),m=k.assign;if(!m)throw z("ngModel")("nonassign",d.ngModel,ia(e));this.$render=v;this.$isEmpty=function(a){return F(a)||""===a||null===a||a!==a};var l=e.inheritedData("$formController")||yb,n=0,q=this.$error={};e.addClass(Ra);h(!0);this.$setValidity=function(a,c){q[a]!==!c&&(c?(q[a]&&n--,n||(h(!0),this.$valid=!0,this.$invalid=!1)):(h(!1),this.$invalid=!0,this.$valid=!1,n++),q[a]=!c,h(c,a),l.$setValidity(a,c,this))};this.$setPristine=function(){this.$dirty=!1;this.$pristine=
!0;g.removeClass(e,zb);g.addClass(e,Ra)};this.$setViewValue=function(d){this.$viewValue=d;this.$pristine&&(this.$dirty=!0,this.$pristine=!1,g.removeClass(e,Ra),g.addClass(e,zb),l.$setDirty());r(this.$parsers,function(a){d=a(d)});this.$modelValue!==d&&(this.$modelValue=d,m(a,d),r(this.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}}))};var p=this;a.$watch(function(){var c=k(a);if(p.$modelValue!==c){var d=p.$formatters,e=d.length;for(p.$modelValue=c;e--;)c=d[e](c);p.$viewValue!==c&&(p.$viewValue=
c,p.$render())}return c})}],Fd=function(){return{require:["ngModel","^?form"],controller:Ze,link:function(a,c,d,e){var f=e[0],g=e[1]||yb;g.$addControl(f);a.$on("$destroy",function(){g.$removeControl(f)})}}},Hd=aa({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),ic=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var f=function(a){if(d.required&&e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",
!0),a};e.$formatters.push(f);e.$parsers.unshift(f);d.$observe("required",function(){f(e.$viewValue)})}}}},Gd=function(){return{require:"ngModel",link:function(a,c,d,e){var f=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){if(!F(a)){var c=[];a&&r(a.split(f),function(a){a&&c.push($(a))});return c}});e.$formatters.push(function(a){return L(a)?a.join(", "):u});e.$isEmpty=function(a){return!a||!a.length}}}},$e=/^(true|false|\d+)$/,Id=function(){return{priority:100,
compile:function(a,c){return $e.test(c.ngValue)?function(a,c,f){f.$set("value",a.$eval(f.ngValue))}:function(a,c,f){a.$watch(f.ngValue,function(a){f.$set("value",a)})}}}},id=Aa({compile:function(a){a.addClass("ng-binding");return function(a,d,e){d.data("$binding",e.ngBind);a.$watch(e.ngBind,function(a){d.text(a==u?"":a)})}}}),kd=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],
jd=["$sce","$parse",function(a,c){return{compile:function(d){d.addClass("ng-binding");return function(d,f,g){f.data("$binding",g.ngBindHtml);var h=c(g.ngBindHtml);d.$watch(function(){return(h(d)||"").toString()},function(c){f.html(a.getTrustedHtml(h(d))||"")})}}}}],ld=Wb("",!0),nd=Wb("Odd",0),md=Wb("Even",1),od=Aa({compile:function(a,c){c.$set("ngCloak",u);a.removeClass("ng-cloak")}}),pd=[function(){return{scope:!0,controller:"@",priority:500}}],jc={},af={blur:!0,focus:!0};r("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),
function(a){var c=qa("ng-"+a);jc[c]=["$parse","$rootScope",function(d,e){return{compile:function(f,g){var h=d(g[c],!0);return function(c,d){d.on(a,function(d){var f=function(){h(c,{$event:d})};af[a]&&e.$$phase?c.$evalAsync(f):c.$apply(f)})}}}}]});var sd=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,f,g){var h,k,m;c.$watch(e.ngIf,function(f){Wa(f)?k||(k=c.$new(),g(k,function(c){c[c.length++]=X.createComment(" end ngIf: "+e.ngIf+
" ");h={clone:c};a.enter(c,d.parent(),d)})):(m&&(m.remove(),m=null),k&&(k.$destroy(),k=null),h&&(m=Eb(h.clone),a.leave(m,function(){m=null}),h=null))})}}}],td=["$http","$templateCache","$anchorScroll","$animate","$sce",function(a,c,d,e,f){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:Xa.noop,compile:function(g,h){var k=h.ngInclude||h.src,m=h.onload||"",l=h.autoscroll;return function(g,h,p,r,J){var w=0,t,y,u,B=function(){y&&(y.remove(),y=null);t&&(t.$destroy(),t=null);
u&&(e.leave(u,function(){y=null}),y=u,u=null)};g.$watch(f.parseAsResourceUrl(k),function(f){var k=function(){!D(l)||l&&!g.$eval(l)||d()},p=++w;f?(a.get(f,{cache:c}).success(function(a){if(p===w){var c=g.$new();r.template=a;a=J(c,function(a){B();e.enter(a,null,h,k)});t=c;u=a;t.$emit("$includeContentLoaded");g.$eval(m)}}).error(function(){p===w&&B()}),g.$emit("$includeContentRequested")):(B(),r.template=null)})}}}}],Jd=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",
link:function(c,d,e,f){d.html(f.template);a(d.contents())(c)}}}],ud=Aa({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),vd=Aa({terminal:!0,priority:1E3}),wd=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,f,g){var h=g.count,k=g.$attr.when&&f.attr(g.$attr.when),m=g.offset||0,l=e.$eval(k)||{},n={},q=c.startSymbol(),p=c.endSymbol(),s=/^when(Minus)?(.+)$/;r(g,function(a,c){s.test(c)&&(l[x(c.replace("when","").replace("Minus","-"))]=
f.attr(g.$attr[c]))});r(l,function(a,e){n[e]=c(a.replace(d,q+h+"-"+m+p))});e.$watch(function(){var c=parseFloat(e.$eval(h));if(isNaN(c))return"";c in l||(c=a.pluralCat(c-m));return n[c](e,f,!0)},function(a){f.text(a)})}}}],xd=["$parse","$animate",function(a,c){var d=z("ngRepeat");return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,link:function(e,f,g,h,k){var m=g.ngRepeat,l=m.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),n,q,p,s,u,w,t={$id:Na};if(!l)throw d("iexp",
m);g=l[1];h=l[2];(l=l[3])?(n=a(l),q=function(a,c,d){w&&(t[w]=a);t[u]=c;t.$index=d;return n(e,t)}):(p=function(a,c){return Na(c)},s=function(a){return a});l=g.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!l)throw d("iidexp",g);u=l[3]||l[1];w=l[2];var y={};e.$watchCollection(h,function(a){var g,h,l=f[0],n,t={},D,C,I,x,G,v,z,F=[];if(Sa(a))v=a,G=q||p;else{G=q||s;v=[];for(I in a)a.hasOwnProperty(I)&&"$"!=I.charAt(0)&&v.push(I);v.sort()}D=v.length;h=F.length=v.length;for(g=0;g<h;g++)if(I=a===
v?g:v[g],x=a[I],n=G(I,x,g),Ea(n,"`track by` id"),y.hasOwnProperty(n))z=y[n],delete y[n],t[n]=z,F[g]=z;else{if(t.hasOwnProperty(n))throw r(F,function(a){a&&a.scope&&(y[a.id]=a)}),d("dupes",m,n,oa(x));F[g]={id:n};t[n]=!1}for(I in y)y.hasOwnProperty(I)&&(z=y[I],g=Eb(z.clone),c.leave(g),r(g,function(a){a.$$NG_REMOVED=!0}),z.scope.$destroy());g=0;for(h=v.length;g<h;g++){I=a===v?g:v[g];x=a[I];z=F[g];F[g-1]&&(l=F[g-1].clone[F[g-1].clone.length-1]);if(z.scope){C=z.scope;n=l;do n=n.nextSibling;while(n&&n.$$NG_REMOVED);
z.clone[0]!=n&&c.move(Eb(z.clone),null,A(l));l=z.clone[z.clone.length-1]}else C=e.$new();C[u]=x;w&&(C[w]=I);C.$index=g;C.$first=0===g;C.$last=g===D-1;C.$middle=!(C.$first||C.$last);C.$odd=!(C.$even=0===(g&1));z.scope||k(C,function(a){a[a.length++]=X.createComment(" end ngRepeat: "+m+" ");c.enter(a,null,A(l));l=a;z.scope=C;z.clone=a;t[z.id]=z})}y=t})}}}],yd=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Wa(c)?"removeClass":"addClass"](d,"ng-hide")})}}],rd=["$animate",
function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Wa(c)?"addClass":"removeClass"](d,"ng-hide")})}}],zd=Aa(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&r(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Ad=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,f){var g=[],h=[],k=[],m=[];c.$watch(e.ngSwitch||e.on,function(d){var n,q;n=0;for(q=k.length;n<q;++n)k[n].remove();n=k.length=0;for(q=
m.length;n<q;++n){var p=h[n];m[n].$destroy();k[n]=p;a.leave(p,function(){k.splice(n,1)})}h.length=0;m.length=0;if(g=f.cases["!"+d]||f.cases["?"])c.$eval(e.change),r(g,function(d){var e=c.$new();m.push(e);d.transclude(e,function(c){var e=d.element;h.push(c);a.enter(c,e.parent(),e)})})})}}}],Bd=Aa({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,f){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:f,element:c})}}),Cd=
Aa({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,f){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:f,element:c})}}),Ed=Aa({link:function(a,c,d,e,f){if(!f)throw z("ngTransclude")("orphan",ia(c));f(function(a){c.empty();c.append(a)})}}),ed=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],bf=z("ngOptions"),Dd=aa({terminal:!0}),fd=["$compile","$parse",function(a,c){var d=
/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,e={$setViewValue:v};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var k=this,m={},l=e,n;k.databound=d.ngModel;k.init=function(a,c,d){l=a;n=d};k.addOption=function(c){Ea(c,'"option value"');m[c]=!0;l.$viewValue==c&&(a.val(c),n.parent()&&n.remove())};
k.removeOption=function(a){this.hasOption(a)&&(delete m[a],l.$viewValue==a&&this.renderUnknownOption(a))};k.renderUnknownOption=function(c){c="? "+Na(c)+" ?";n.val(c);a.prepend(n);a.val(c);n.prop("selected",!0)};k.hasOption=function(a){return m.hasOwnProperty(a)};c.$on("$destroy",function(){k.renderUnknownOption=v})}],link:function(e,g,h,k){function m(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(x.parent()&&x.remove(),c.val(a),""===a&&w.prop("selected",!0)):F(a)&&w?c.val(""):e.renderUnknownOption(a)};
c.on("change",function(){a.$apply(function(){x.parent()&&x.remove();d.$setViewValue(c.val())})})}function l(a,c,d){var e;d.$render=function(){var a=new db(d.$viewValue);r(c.find("option"),function(c){c.selected=D(a.get(c.value))})};a.$watch(function(){Ca(e,d.$viewValue)||(e=ha(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=[];r(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function n(e,f,g){function h(){var a={"":[]},c=[""],d,k,
s,u,v;s=g.$modelValue;u=A(e)||[];var F=n?Xb(u):u,G,Q,C;Q={};C=!1;if(p)if(k=g.$modelValue,w&&L(k))for(C=new db([]),d={},v=0;v<k.length;v++)d[m]=k[v],C.put(w(e,d),k[v]);else C=new db(k);v=C;var E,K;for(C=0;G=F.length,C<G;C++){k=C;if(n){k=F[C];if("$"===k.charAt(0))continue;Q[n]=k}Q[m]=u[k];d=r(e,Q)||"";(k=a[d])||(k=a[d]=[],c.push(d));p?d=D(v.remove(w?w(e,Q):x(e,Q))):(w?(d={},d[m]=s,d=w(e,d)===w(e,Q)):d=s===x(e,Q),v=v||d);E=l(e,Q);E=D(E)?E:"";k.push({id:w?w(e,Q):n?F[C]:C,label:E,selected:d})}p||(z||null===
s?a[""].unshift({id:"",label:"",selected:!v}):v||a[""].unshift({id:"?",label:"",selected:!0}));Q=0;for(F=c.length;Q<F;Q++){d=c[Q];k=a[d];B.length<=Q?(s={element:y.clone().attr("label",d),label:k.label},u=[s],B.push(u),f.append(s.element)):(u=B[Q],s=u[0],s.label!=d&&s.element.attr("label",s.label=d));E=null;C=0;for(G=k.length;C<G;C++)d=k[C],(v=u[C+1])?(E=v.element,v.label!==d.label&&(E.text(v.label=d.label),E.prop("label",v.label)),v.id!==d.id&&E.val(v.id=d.id),E[0].selected!==d.selected&&(E.prop("selected",
v.selected=d.selected),R&&E.prop("selected",v.selected))):(""===d.id&&z?K=z:(K=t.clone()).val(d.id).prop("selected",d.selected).attr("selected",d.selected).prop("label",d.label).text(d.label),u.push({element:K,label:d.label,id:d.id,selected:d.selected}),q.addOption(d.label,K),E?E.after(K):s.element.append(K),E=K);for(C++;u.length>C;)d=u.pop(),q.removeOption(d.label),d.element.remove()}for(;B.length>Q;)B.pop()[0].element.remove()}var k;if(!(k=s.match(d)))throw bf("iexp",s,ia(f));var l=c(k[2]||k[1]),
m=k[4]||k[6],n=k[5],r=c(k[3]||""),x=c(k[2]?k[1]:m),A=c(k[7]),w=k[8]?c(k[8]):null,B=[[{element:f,label:""}]];z&&(a(z)(e),z.removeClass("ng-scope"),z.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=A(e)||[],d={},k,l,q,r,s,t,v;if(p)for(l=[],r=0,t=B.length;r<t;r++)for(a=B[r],q=1,s=a.length;q<s;q++){if((k=a[q].element)[0].selected){k=k.val();n&&(d[n]=k);if(w)for(v=0;v<c.length&&(d[m]=c[v],w(e,d)!=k);v++);else d[m]=c[k];l.push(x(e,d))}}else if(k=f.val(),"?"==k)l=u;else if(""===
k)l=null;else if(w)for(v=0;v<c.length;v++){if(d[m]=c[v],w(e,d)==k){l=x(e,d);break}}else d[m]=c[k],n&&(d[n]=k),l=x(e,d);g.$setViewValue(l);h()})});g.$render=h;e.$watchCollection(A,h);e.$watchCollection(function(){var a={},c=A(e);if(c){for(var d=Array(c.length),f=0,g=c.length;f<g;f++)a[m]=c[f],d[f]=l(e,a);return d}},h);p&&e.$watchCollection(function(){return g.$modelValue},h)}if(k[1]){var q=k[0];k=k[1];var p=h.multiple,s=h.ngOptions,z=!1,w,t=A(X.createElement("option")),y=A(X.createElement("optgroup")),
x=t.clone();h=0;for(var B=g.children(),v=B.length;h<v;h++)if(""===B[h].value){w=z=B.eq(h);break}q.init(k,z,x);p&&(k.$isEmpty=function(a){return!a||0===a.length});s?n(e,g,k):p?l(e,g,k):m(e,g,k,q)}}}}],hd=["$interpolate",function(a){var c={addOption:v,removeOption:v};return{restrict:"E",priority:100,compile:function(d,e){if(F(e.value)){var f=a(d.text(),!0);f||e.$set("value",d.text())}return function(a,d,e){var m=d.parent(),l=m.data("$selectController")||m.parent().data("$selectController");l&&l.databound?
d.prop("selected",!1):l=c;f?a.$watch(f,function(a,c){e.$set("value",a);a!==c&&l.removeOption(c);l.addOption(a)}):l.addOption(e.value);d.on("$destroy",function(){l.removeOption(e.value)})}}}}],gd=aa({restrict:"E",terminal:!0});W.angular.bootstrap?console.log("WARNING: Tried to load angular more than once."):((Fa=W.jQuery)&&Fa.fn.on?(A=Fa,E(Fa.fn,{scope:Oa.scope,isolateScope:Oa.isolateScope,controller:Oa.controller,injector:Oa.injector,inheritedData:Oa.inheritedData}),Gb("remove",!0,!0,!1),Gb("empty",
!1,!1,!1),Gb("html",!1,!1,!0)):A=S,Xa.element=A,Zc(Xa),A(X).ready(function(){Wc(X,dc)}))})(window,document);!window.angular.$$csp()&&window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}.ng-hide-add-active,.ng-hide-remove{display:block!important;}</style>');
//# sourceMappingURL=angular.min.js.map

/**
 * @license AngularJS v1.2.14
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

    var $sanitizeMinErr = angular.$$minErr('$sanitize');

    /**
     * @ngdoc module
     * @name ngSanitize
     * @description
     *
     * # ngSanitize
     *
     * The `ngSanitize` module provides functionality to sanitize HTML.
     *
     *
     * <div doc-module-components="ngSanitize"></div>
     *
     * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
     */

    /*
     * HTML Parser By Misko Hevery (misko@hevery.com)
     * based on:  HTML Parser By John Resig (ejohn.org)
     * Original code by Erik Arvidsson, Mozilla Public License
     * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
     *
     * // Use like so:
     * htmlParser(htmlString, {
     *     start: function(tag, attrs, unary) {},
     *     end: function(tag) {},
     *     chars: function(text) {},
     *     comment: function(text) {}
     * });
     *
     */


    /**
     * @ngdoc service
     * @name $sanitize
     * @function
     *
     * @description
     *   The input is sanitized by parsing the html into tokens. All safe tokens (from a whitelist) are
     *   then serialized back to properly escaped html string. This means that no unsafe input can make
     *   it into the returned string, however, since our parser is more strict than a typical browser
     *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
     *   browser, won't make it through the sanitizer.
     *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
     *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
     *
     * @param {string} html Html input.
     * @returns {string} Sanitized html.
     *
     * @example
     <example module="ngSanitize" deps="angular-sanitize.js">
     <file name="index.html">
     <script>
     function Ctrl($scope, $sce) {
         $scope.snippet =
           '<p style="color:blue">an html\n' +
           '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
           'snippet</p>';
         $scope.deliberatelyTrustDangerousSnippet = function() {
           return $sce.trustAsHtml($scope.snippet);
         };
       }
     </script>
     <div ng-controller="Ctrl">
     Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
     <table>
     <tr>
     <td>Directive</td>
     <td>How</td>
     <td>Source</td>
     <td>Rendered</td>
     </tr>
     <tr id="bind-html-with-sanitize">
     <td>ng-bind-html</td>
     <td>Automatically uses $sanitize</td>
     <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
     <td><div ng-bind-html="snippet"></div></td>
     </tr>
     <tr id="bind-html-with-trust">
     <td>ng-bind-html</td>
     <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
     <td>
     <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
     &lt;/div&gt;</pre>
     </td>
     <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
     </tr>
     <tr id="bind-default">
     <td>ng-bind</td>
     <td>Automatically escapes</td>
     <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
     <td><div ng-bind="snippet"></div></td>
     </tr>
     </table>
     </div>
     </file>
     <file name="protractor.js" type="protractor">
     it('should sanitize the html snippet by default', function() {
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(element(by.css('#bind-default div')).getInnerHtml()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       element(by.model('snippet')).clear();
       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('new <b>text</b>');
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
     </file>
     </example>
     */
    function $SanitizeProvider() {
        this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
            return function(html) {
                var buf = [];
                htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
                    return !/^unsafe/.test($$sanitizeUri(uri, isImage));
                }));
                return buf.join('');
            };
        }];
    }

    function sanitizeText(chars) {
        var buf = [];
        var writer = htmlSanitizeWriter(buf, angular.noop);
        writer.chars(chars);
        return buf.join('');
    }


// Regular Expressions for parsing tags and attributes
    var START_TAG_REGEXP =
            /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
        END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/,
        ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
        BEGIN_TAG_REGEXP = /^</,
        BEGING_END_TAGE_REGEXP = /^<\s*\//,
        COMMENT_REGEXP = /<!--(.*?)-->/g,
        DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
        CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
    // Match everything outside of normal chars and " (quote character)
        NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
    var voidElements = makeMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
    var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        optionalEndTagInlineElements = makeMap("rp,rt"),
        optionalEndTagElements = angular.extend({},
            optionalEndTagInlineElements,
            optionalEndTagBlockElements);

// Safe Block Elements - HTML5
    var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

// Inline Elements - HTML5
    var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));


// Special Elements (can contain anything)
    var specialElements = makeMap("script,style");

    var validElements = angular.extend({},
        voidElements,
        blockElements,
        inlineElements,
        optionalEndTagElements);

//Attributes that have href and hence need to be sanitized
    var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
    var validAttrs = angular.extend({}, uriAttrs, makeMap(
        'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
            'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+
            'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+
            'scope,scrolling,shape,size,span,start,summary,target,title,type,'+
            'valign,value,vspace,width'));

    function makeMap(str) {
        var obj = {}, items = str.split(','), i;
        for (i = 0; i < items.length; i++) obj[items[i]] = true;
        return obj;
    }


    /**
     * @example
     * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
     *
     * @param {string} html string
     * @param {object} handler
     */
    function htmlParser( html, handler ) {
        var index, chars, match, stack = [], last = html;
        stack.last = function() { return stack[ stack.length - 1 ]; };

        while ( html ) {
            chars = true;

            // Make sure we're not in a script or style element
            if ( !stack.last() || !specialElements[ stack.last() ] ) {

                // Comment
                if ( html.indexOf("<!--") === 0 ) {
                    // comments containing -- are not allowed unless they terminate the comment
                    index = html.indexOf("--", 4);

                    if ( index >= 0 && html.lastIndexOf("-->", index) === index) {
                        if (handler.comment) handler.comment( html.substring( 4, index ) );
                        html = html.substring( index + 3 );
                        chars = false;
                    }
                    // DOCTYPE
                } else if ( DOCTYPE_REGEXP.test(html) ) {
                    match = html.match( DOCTYPE_REGEXP );

                    if ( match ) {
                        html = html.replace( match[0] , '');
                        chars = false;
                    }
                    // end tag
                } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
                    match = html.match( END_TAG_REGEXP );

                    if ( match ) {
                        html = html.substring( match[0].length );
                        match[0].replace( END_TAG_REGEXP, parseEndTag );
                        chars = false;
                    }

                    // start tag
                } else if ( BEGIN_TAG_REGEXP.test(html) ) {
                    match = html.match( START_TAG_REGEXP );

                    if ( match ) {
                        html = html.substring( match[0].length );
                        match[0].replace( START_TAG_REGEXP, parseStartTag );
                        chars = false;
                    }
                }

                if ( chars ) {
                    index = html.indexOf("<");

                    var text = index < 0 ? html : html.substring( 0, index );
                    html = index < 0 ? "" : html.substring( index );

                    if (handler.chars) handler.chars( decodeEntities(text) );
                }

            } else {
                html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
                    function(all, text){
                        text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

                        if (handler.chars) handler.chars( decodeEntities(text) );

                        return "";
                    });

                parseEndTag( "", stack.last() );
            }

            if ( html == last ) {
                throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
                    "of html: {0}", html);
            }
            last = html;
        }

        // Clean up any remaining tags
        parseEndTag();

        function parseStartTag( tag, tagName, rest, unary ) {
            tagName = angular.lowercase(tagName);
            if ( blockElements[ tagName ] ) {
                while ( stack.last() && inlineElements[ stack.last() ] ) {
                    parseEndTag( "", stack.last() );
                }
            }

            if ( optionalEndTagElements[ tagName ] && stack.last() == tagName ) {
                parseEndTag( "", tagName );
            }

            unary = voidElements[ tagName ] || !!unary;

            if ( !unary )
                stack.push( tagName );

            var attrs = {};

            rest.replace(ATTR_REGEXP,
                function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
                    var value = doubleQuotedValue
                        || singleQuotedValue
                        || unquotedValue
                        || '';

                    attrs[name] = decodeEntities(value);
                });
            if (handler.start) handler.start( tagName, attrs, unary );
        }

        function parseEndTag( tag, tagName ) {
            var pos = 0, i;
            tagName = angular.lowercase(tagName);
            if ( tagName )
            // Find the closest opened tag of the same type
                for ( pos = stack.length - 1; pos >= 0; pos-- )
                    if ( stack[ pos ] == tagName )
                        break;

            if ( pos >= 0 ) {
                // Close all the open elements, up the stack
                for ( i = stack.length - 1; i >= pos; i-- )
                    if (handler.end) handler.end( stack[ i ] );

                // Remove the open elements from the stack
                stack.length = pos;
            }
        }
    }

    var hiddenPre=document.createElement("pre");
    var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
    /**
     * decodes all entities into regular string
     * @param value
     * @returns {string} A string with decoded entities.
     */
    function decodeEntities(value) {
        if (!value) { return ''; }

        // Note: IE8 does not preserve spaces at the start/end of innerHTML
        // so we must capture them and reattach them afterward
        var parts = spaceRe.exec(value);
        var spaceBefore = parts[1];
        var spaceAfter = parts[3];
        var content = parts[2];
        if (content) {
            hiddenPre.innerHTML=content.replace(/</g,"&lt;");
            // innerText depends on styling as it doesn't display hidden elements.
            // Therefore, it's better to use textContent not to cause unnecessary
            // reflows. However, IE<9 don't support textContent so the innerText
            // fallback is necessary.
            content = 'textContent' in hiddenPre ?
                hiddenPre.textContent : hiddenPre.innerText;
        }
        return spaceBefore + content + spaceAfter;
    }

    /**
     * Escapes all potentially dangerous characters, so that the
     * resulting string can be safely inserted into attribute or
     * element text.
     * @param value
     * @returns {string} escaped text
     */
    function encodeEntities(value) {
        return value.
            replace(/&/g, '&amp;').
            replace(NON_ALPHANUMERIC_REGEXP, function(value){
                return '&#' + value.charCodeAt(0) + ';';
            }).
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;');
    }

    /**
     * create an HTML/XML writer which writes to buffer
     * @param {Array} buf use buf.jain('') to get out sanitized html string
     * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
     */
    function htmlSanitizeWriter(buf, uriValidator){
        var ignore = false;
        var out = angular.bind(buf, buf.push);
        return {
            start: function(tag, attrs, unary){
                tag = angular.lowercase(tag);
                if (!ignore && specialElements[tag]) {
                    ignore = tag;
                }
                if (!ignore && validElements[tag] === true) {
                    out('<');
                    out(tag);
                    angular.forEach(attrs, function(value, key){
                        var lkey=angular.lowercase(key);
                        var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
                        if (validAttrs[lkey] === true &&
                            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
                            out(' ');
                            out(key);
                            out('="');
                            out(encodeEntities(value));
                            out('"');
                        }
                    });
                    out(unary ? '/>' : '>');
                }
            },
            end: function(tag){
                tag = angular.lowercase(tag);
                if (!ignore && validElements[tag] === true) {
                    out('</');
                    out(tag);
                    out('>');
                }
                if (tag == ignore) {
                    ignore = false;
                }
            },
            chars: function(chars){
                if (!ignore) {
                    out(encodeEntities(chars));
                }
            }
        };
    }


// define ngSanitize module and register $sanitize service
    angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

    /* global sanitizeText: false */

    /**
     * @ngdoc filter
     * @name linky
     * @function
     *
     * @description
     * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
     * plain email address links.
     *
     * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
     *
     * @param {string} text Input text.
     * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
     * @returns {string} Html-linkified text.
     *
     * @usage
     <span ng-bind-html="linky_expression | linky"></span>
     *
     * @example
     <example module="ngSanitize" deps="angular-sanitize.js">
     <file name="index.html">
     <script>
     function Ctrl($scope) {
           $scope.snippet =
             'Pretty text with some links:\n'+
             'http://angularjs.org/,\n'+
             'mailto:us@somewhere.org,\n'+
     'another@somewhere.org,\n'+
     'and one more: ftp://127.0.0.1/.';
     $scope.snippetWithTarget = 'http://angularjs.org/';
     }
     </script>
     <div ng-controller="Ctrl">
     Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
     <table>
     <tr>
     <td>Filter</td>
     <td>Source</td>
     <td>Rendered</td>
     </tr>
     <tr id="linky-filter">
     <td>linky filter</td>
     <td>
     <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
     </td>
     <td>
     <div ng-bind-html="snippet | linky"></div>
     </td>
     </tr>
     <tr id="linky-target">
     <td>linky target</td>
     <td>
     <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
     </td>
     <td>
     <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
     </td>
     </tr>
     <tr id="escaped-html">
     <td>no filter</td>
     <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
     <td><div ng-bind="snippet"></div></td>
     </tr>
     </table>
     </file>
     <file name="protractor.js" type="protractor">
     it('should linkify the snippet with urls', function() {
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
     'another@somewhere.org, and one more: ftp://127.0.0.1/.');
     expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
     });

     it('should not linkify snippet without the linky filter', function() {
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
     'another@somewhere.org, and one more: ftp://127.0.0.1/.');
     expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
     });

     it('should update', function() {
         element(by.model('snippet')).clear();
         element(by.model('snippet')).sendKeys('new http://link.');
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('new http://link.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
             .toBe('new http://link.');
       });

     it('should work with the target property', function() {
        expect(element(by.id('linky-target')).
            element(by.binding("snippetWithTarget | linky:'_blank'")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
       });
     </file>
     </example>
     */
    angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
        var LINKY_URL_REGEXP =
                /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/,
            MAILTO_REGEXP = /^mailto:/;

        return function(text, target) {
            if (!text) return text;
            var match;
            var raw = text;
            var html = [];
            var url;
            var i;
            while ((match = raw.match(LINKY_URL_REGEXP))) {
                // We can not end in these as they are sometimes found at the end of the sentence
                url = match[0];
                // if we did not match ftp/http/mailto then assume mailto
                if (match[2] == match[3]) url = 'mailto:' + url;
                i = match.index;
                addText(raw.substr(0, i));
                addLink(url, match[0].replace(MAILTO_REGEXP, ''));
                raw = raw.substring(i + match[0].length);
            }
            addText(raw);
            return $sanitize(html.join(''));

            function addText(text) {
                if (!text) {
                    return;
                }
                html.push(sanitizeText(text));
            }

            function addLink(url, text) {
                html.push('<a ');
                if (angular.isDefined(target)) {
                    html.push('target="');
                    html.push(target);
                    html.push('" ');
                }
                html.push('href="');
                html.push(url);
                html.push('">');
                addText(text);
                html.push('</a>');
            }
        };
    }]);


})(window, window.angular);
/* =========================================================
 * bootstrap-datepicker.js
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 * Improvements by Andrew Rowls
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function( $ ) {

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
	}

	// Picker object

	var Datepicker = function(element, options) {
		var that = this;

		this.element = $(element);
		this.language = options.language||this.element.data('date-language')||"en";
		this.language = this.language in dates ? this.language : this.language.split('-')[0]; //Check if "de-DE" style date is available, if not language should fallback to 2 letter code eg "de"
		this.language = this.language in dates ? this.language : "en";
		this.isRTL = dates[this.language].rtl||false;
		this.format = DPGlobal.parseFormat(options.format||this.element.data('date-format')||dates[this.language].format||'mm/dd/yyyy');
		this.isInline = false;
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on') : false;
		this.hasInput = this.component && this.element.find('input').length;
		if(this.component && this.component.length === 0)
			this.component = false;

		this._attachEvents();

		this.forceParse = true;
		if ('forceParse' in options) {
			this.forceParse = options.forceParse;
		} else if ('dateForceParse' in this.element.data()) {
			this.forceParse = this.element.data('date-force-parse');
		}


		this.picker = $(DPGlobal.template)
							.appendTo(this.isInline ? this.element : 'body')
							.on({
								click: $.proxy(this.click, this),
								mousedown: $.proxy(this.mousedown, this)
							});

		if(this.isInline) {
			this.picker.addClass('datepicker-inline');
		} else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}
		if (this.isRTL){
			this.picker.addClass('datepicker-rtl');
			this.picker.find('.prev i, .next i')
						.toggleClass('fa fa-arrow-left fa fa-arrow-right');
		}
		$(document).on('mousedown', function (e) {
			// Clicked outside the datepicker, hide it
			if ($(e.target).closest('.datepicker.datepicker-inline, .datepicker.datepicker-dropdown').length === 0) {
				that.hide();
			}
		});

		this.autoclose = false;
		if ('autoclose' in options) {
			this.autoclose = options.autoclose;
		} else if ('dateAutoclose' in this.element.data()) {
			this.autoclose = this.element.data('date-autoclose');
		}

		this.keyboardNavigation = true;
		if ('keyboardNavigation' in options) {
			this.keyboardNavigation = options.keyboardNavigation;
		} else if ('dateKeyboardNavigation' in this.element.data()) {
			this.keyboardNavigation = this.element.data('date-keyboard-navigation');
		}

		this.viewMode = this.startViewMode = 0;
		switch(options.startView || this.element.data('date-start-view')){
			case 2:
			case 'decade':
				this.viewMode = this.startViewMode = 2;
				break;
			case 1:
			case 'year':
				this.viewMode = this.startViewMode = 1;
				break;
		}

		this.todayBtn = (options.todayBtn||this.element.data('date-today-btn')||false);
		this.todayHighlight = (options.todayHighlight||this.element.data('date-today-highlight')||false);

		this.calendarWeeks = false;
		if ('calendarWeeks' in options) {
			this.calendarWeeks = options.calendarWeeks;
		} else if ('dateCalendarWeeks' in this.element.data()) {
			this.calendarWeeks = this.element.data('date-calendar-weeks');
		}
		if (this.calendarWeeks)
			this.picker.find('tfoot th.today')
						.attr('colspan', function(i, val){
							return parseInt(val) + 1;
						});

		this.weekStart = ((options.weekStart||this.element.data('date-weekstart')||dates[this.language].weekStart||0) % 7);
		this.weekEnd = ((this.weekStart + 6) % 7);
		this.startDate = -Infinity;
		this.endDate = Infinity;
		this.daysOfWeekDisabled = [];
		this.setStartDate(options.startDate||this.element.data('date-startdate'));
		this.setEndDate(options.endDate||this.element.data('date-enddate'));
		this.setDaysOfWeekDisabled(options.daysOfWeekDisabled||this.element.data('date-days-of-week-disabled'));
		this.fillDow();
		this.fillMonths();
		this.update();
		this.showMode();

		if(this.isInline) {
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_events: [],
		_attachEvents: function(){
			this._detachEvents();
			if (this.isInput) { // single input
				this._events = [
					[this.element, {
						// focus: $.proxy(this.show, this),
						keyup: $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this),
						click: $.proxy(this.show, this)
					}]
				];
			}
			else if (this.component && this.hasInput){ // component: input + button
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
						focus: $.proxy(this.show, this),
						keyup: $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
			}
						else if (this.element.is('div')) {  // inline datepicker
							this.isInline = true;
						}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			for (var i=0, el, ev; i<this._events.length; i++){
				el = this._events[i][0];
				ev = this._events[i][1];
				el.on(ev);
			}
		},
		_detachEvents: function(){
			for (var i=0, el, ev; i<this._events.length; i++){
				el = this._events[i][0];
				ev = this._events[i][1];
				el.off(ev);
			}
			this._events = [];
		},

		show: function(e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			this.update();
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e ) {
				e.stopPropagation();
				e.preventDefault();
			}
			this.element.trigger({
				type: 'show',
				date: this.date
			});
		},

		hide: function(e){
			if(this.isInline) return;
			if (!this.picker.is(':visible')) return;
			this.picker.hide();
			$(window).off('resize', this.place);
			this.viewMode = this.startViewMode;
			this.showMode();
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}

			if (
				this.forceParse &&
				(
					this.isInput && this.element.val() ||
					this.hasInput && this.element.find('input').val()
				)
			)
				this.setValue();
			this.element.trigger({
				type: 'hide',
				date: this.date
			});
		},

		remove: function() {
			this._detachEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
		},

		getDate: function() {
			var d = this.getUTCDate();
			return new Date(d.getTime() + (d.getTimezoneOffset()*60000));
		},

		getUTCDate: function() {
			return this.date;
		},

		setDate: function(d) {
			this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset()*60000)));
		},

		setUTCDate: function(d) {
			this.date = d;
			this.setValue();
		},

		setValue: function() {
			var formatted = this.getFormattedDate();
			if (!this.isInput) {
				if (this.component){
					this.element.find('input').val(formatted);
				}
				this.element.data('date', formatted);
			} else {
				this.element.val(formatted);
			}
		},

		getFormattedDate: function(format) {
			if (format === undefined)
				format = this.format;
			return DPGlobal.formatDate(this.date, format, this.language);
		},

		setStartDate: function(startDate){
			this.startDate = startDate||-Infinity;
			if (this.startDate !== -Infinity) {
				this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language);
			}
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function(endDate){
			this.endDate = endDate||Infinity;
			if (this.endDate !== Infinity) {
				this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language);
			}
			this.update();
			this.updateNavArrows();
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this.daysOfWeekDisabled = daysOfWeekDisabled||[];
			if (!$.isArray(this.daysOfWeekDisabled)) {
				this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
			}
			this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function (d) {
				return parseInt(d, 10);
			});
			this.update();
			this.updateNavArrows();
		},

		place: function(){
						if(this.isInline) return;
			var zIndex = parseInt(this.element.parents().filter(function() {
							return $(this).css('z-index') != 'auto';
						}).first().css('z-index'))+10;
			var offset = this.component ? this.component.offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(true);
			this.picker.css({
				top: offset.top + height,
				left: offset.left,
				zIndex: zIndex
			});
		},

		update: function(){
			var date, fromArgs = false;
			if(arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
				date = arguments[0];
				fromArgs = true;
			} else {
				date = this.isInput ? this.element.val() : this.element.data('date') || this.element.find('input').val();
			}

			this.date = DPGlobal.parseDate(date, this.format, this.language);

			if(fromArgs) this.setValue();

			if (this.date < this.startDate) {
				this.viewDate = new Date(this.startDate);
			} else if (this.date > this.endDate) {
				this.viewDate = new Date(this.endDate);
			} else {
				this.viewDate = new Date(this.date);
			}
			this.fill();
		},

		fillDow: function(){
			var dowCnt = this.weekStart,
			html = '<tr>';
			if(this.calendarWeeks){
				var cell = '<th class="cw">&nbsp;</th>';
				html += cell;
				this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
			}
			while (dowCnt < this.weekStart + 7) {
				html += '<th class="dow">'+dates[this.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '',
			i = 0;
			while (i < 12) {
				html += '<span class="month">'+dates[this.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		fill: function() {
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.startDate !== -Infinity ? this.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.startDate !== -Infinity ? this.startDate.getUTCMonth() : -Infinity,
				endYear = this.endDate !== Infinity ? this.endDate.getUTCFullYear() : Infinity,
				endMonth = this.endDate !== Infinity ? this.endDate.getUTCMonth() : Infinity,
				currentDate = this.date && this.date.valueOf(),
				today = new Date();
			this.picker.find('.datepicker-days thead th.switch')
						.text(dates[this.language].months[month]+' '+year);
			this.picker.find('tfoot th.today')
						.text(dates[this.language].today)
						.toggle(this.todayBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month-1, 28,0,0,0,0),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while(prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getUTCDay() == this.weekStart) {
					html.push('<tr>');
					if(this.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(+ws + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(+(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek =  (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');

					}
				}
				clsName = '';
				if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month)) {
					clsName += ' old';
				} else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month)) {
					clsName += ' new';
				}
				// Compare internal UTC date with local today, not UTC today
				if (this.todayHighlight &&
					prevMonth.getUTCFullYear() == today.getFullYear() &&
					prevMonth.getUTCMonth() == today.getMonth() &&
					prevMonth.getUTCDate() == today.getDate()) {
					clsName += ' today';
				}
				if (currentDate && prevMonth.valueOf() == currentDate) {
					clsName += ' active';
				}
				if (prevMonth.valueOf() < this.startDate || prevMonth.valueOf() > this.endDate ||
					$.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1) {
					clsName += ' disabled';
				}
				html.push('<td class="day'+clsName+'">'+prevMonth.getUTCDate() + '</td>');
				if (prevMonth.getUTCDay() == this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
			var currentYear = this.date && this.date.getUTCFullYear();

			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');
			if (currentYear && currentYear == year) {
				months.eq(this.date.getUTCMonth()).addClass('active');
			}
			if (year < startYear || year > endYear) {
				months.addClass('disabled');
			}
			if (year == startYear) {
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year == endYear) {
				months.slice(endMonth+1).addClass('disabled');
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year'+(i == -1 || i == 10 ? ' old' : '')+(currentYear == year ? ' active' : '')+(year < startYear || year > endYear ? ' disabled' : '')+'">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		updateNavArrows: function() {
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
			switch (this.viewMode) {
				case 0:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear() && month <= this.startDate.getUTCMonth()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear() && month >= this.endDate.getUTCMonth()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e) {
			e.stopPropagation();
			e.preventDefault();
			var target = $(e.target).closest('span, td, th');
			if (target.length == 1) {
				switch(target[0].nodeName.toLowerCase()) {
					case 'th':
						switch(target[0].className) {
							case 'switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
								switch(this.viewMode){
									case 0:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										break;
									case 1:
									case 2:
										this.viewDate = this.moveYear(this.viewDate, dir);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

								this.showMode(-2);
								var which = this.todayBtn == 'linked' ? null : 'view';
								this._setDate(date, which);
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')) {
							this.viewDate.setUTCDate(1);
							if (target.is('.month')) {
								var month = target.parent().find('span').index(target);
								this.viewDate.setUTCMonth(month);
								this.element.trigger({
									type: 'changeMonth',
									date: this.viewDate
								});
							} else {
								var year = parseInt(target.text(), 10)||0;
								this.viewDate.setUTCFullYear(year);
								this.element.trigger({
									type: 'changeYear',
									date: this.viewDate
								});
							}
							this.showMode(-1);
							this.fill();
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')){
							var day = parseInt(target.text(), 10)||1;
							var year = this.viewDate.getUTCFullYear(),
								month = this.viewDate.getUTCMonth();
							if (target.is('.old')) {
								if (month === 0) {
									month = 11;
									year -= 1;
								} else {
									month -= 1;
								}
							} else if (target.is('.new')) {
								if (month == 11) {
									month = 0;
									year += 1;
								} else {
									month += 1;
								}
							}
							this._setDate(UTCDate(year, month, day,0,0,0,0));
						}
						break;
				}
			}
		},

		_setDate: function(date, which){
			if (!which || which == 'date')
				this.date = date;
			if (!which || which  == 'view')
				this.viewDate = date;
			this.fill();
			this.setValue();
			this.element.trigger({
				type: 'changeDate',
				date: this.date
			});
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component){
				element = this.element.find('input');
			}
			if (element) {
				element.change();
				if (this.autoclose && (!which || which == 'date')) {
					this.hide();
				}
			}
		},

		moveMonth: function(date, dir){
			if (!dir) return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag == 1){
				test = dir == -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){ return new_date.getUTCMonth() == month; }
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){ return new_date.getUTCMonth() != new_month; };
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			} else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i<mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){ return new_month != new_date.getUTCMonth(); };
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		dateWithinRange: function(date){
			return date >= this.startDate && date <= this.endDate;
		},

		keydown: function(e){
			if (this.picker.is(':not(:visible)')){
				if (e.keyCode == 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, day, month,
				newDate, newViewDate;
			switch(e.keyCode){
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 37 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (e.shiftKey){
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else {
						newDate = new Date(this.date);
						newDate.setUTCDate(this.date.getUTCDate() + dir);
						newViewDate = new Date(this.viewDate);
						newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir);
					}
					if (this.dateWithinRange(newDate)){
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 38 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (e.shiftKey){
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else {
						newDate = new Date(this.date);
						newDate.setUTCDate(this.date.getUTCDate() + dir * 7);
						newViewDate = new Date(this.viewDate);
						newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir * 7);
					}
					if (this.dateWithinRange(newDate)){
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 13: // enter
					this.hide();
					e.preventDefault();
					break;
				case 9: // tab
					this.hide();
					break;
			}
			if (dateChanged){
				this.element.trigger({
					type: 'changeDate',
					date: this.date
				});
				var element;
				if (this.isInput) {
					element = this.element;
				} else if (this.component){
					element = this.element.find('input');
				}
				if (element) {
					element.change();
				}
			}
		},

		showMode: function(dir) {
			if (dir) {
				this.viewMode = Math.max(0, Math.min(2, this.viewMode + dir));
			}
			/*
				vitalets: fixing bug of very special conditions:
				jquery 1.7.1 + webkit + show inline datepicker in bootstrap popover.
				Method show() does not set display css correctly and datepicker is not shown.
				Changed to .css('display', 'block') solve the problem.
				See https://github.com/vitalets/x-editable/issues/37

				In jquery 1.7.2+ everything works fine.
			*/
			//this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
			this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
			this.updateNavArrows();
		}
	};

	$.fn.datepicker = function ( option ) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function () {
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults,options))));
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				data[option].apply(data, args);
			}
		});
	};

	$.fn.datepicker.defaults = {
	};
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
		    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		    daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
		    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		    today: "Today"
		}
	};

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language) {
			if (date instanceof Date) return date;
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
				var part_re = /([\-+]\d+)([dmwy])/,
					parts = date.match(/([\-+]\d+)([dmwy])/g),
					part, dir;
				date = new Date();
				for (var i=0; i<parts.length; i++) {
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch(part[2]){
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
			}
			var parts = date && date.match(this.nonpunctuation) || [],
				date = new Date(),
				parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){ return d.setUTCFullYear(v); },
					yy: function(d,v){ return d.setUTCFullYear(2000+v); },
					m: function(d,v){
						v -= 1;
						while (v<0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() != v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){ return d.setUTCDate(v); }
				},
				val, filtered, part;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length != fparts.length) {
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			if (parts.length == fparts.length) {
				for (var i=0, cnt = fparts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)) {
						switch(part) {
							case 'MM':
								filtered = $(dates[language].months).filter(function(){
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(function(){
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				for (var i=0, s; i<setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s]))
						setters_map[s](date, parsed[s]);
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			var date = [],
				seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i < cnt; i++) {
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev"><i class="fa fa-arrow-left"/></th>'+
								'<th colspan="5" class="switch"></th>'+
								'<th class="next"><i class="fa fa-arrow-right"/></th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;

}( window.jQuery );

/*function calculateNumAgents(expected_volume, average_duration, wait_time, period_length) {
    var agents = Math.round((average_duration*expected_volume/period_length)-0.5)+1;
    var traffic = expected_volume*average_duration/period_length;

    while (eCDelayAll(traffic,agents,average_duration)>wait_time) {agents++}

    return agents;
}*/

function calculateNumAgents(expected_volume, average_duration, wait_time, period_length, service_level) {
    var traffic = expected_volume*average_duration/period_length,
        agents = Math.round((traffic)-0.5)+1;

    if(traffic <= 0.02) {
        agents = 0;
    } else {
        while (serviceLevel(traffic,agents,wait_time, average_duration)<service_level) {agents ++}
    }

    return agents;
}
function eB(traffic,plines) {
    var PBR,index;

    if (traffic>0) {
        PBR=(1+traffic)/traffic;

        for (index=2;index!=plines+1;index++) {
            PBR = index/traffic*PBR+1;

            if(PBR>10000) return 0;
        }
        return 1/PBR;
    }
    else {
        return 0;
    }
}
function eC(traffic,plines) {
    var EBResult,
        probability;

    EBResult = eB(traffic,plines);
    probability = EBResult/(1-(traffic/plines)*(1-EBResult));

    return (probability>1) ?  1 : probability;
}

function eCDelayAll(traffic,plines,HoldTime) {
    return eC(traffic,plines)*HoldTime/(plines-traffic);
}

function serviceLevel(traffic, plines, HoldTime, duration) {
    var serviceLevel = 1 - (eC(traffic, plines) * Math.exp(-(plines-traffic) * HoldTime / duration));

    if(serviceLevel > 1) {
        return 1;
    } else if(serviceLevel < 0) {
        return 0;
    } else {
        return serviceLevel;
    }
}
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.12.0 - 2015-10-17
 * License: MIT
 */
angular.module("ui.bootstrap",["ui.bootstrap.collapse","ui.bootstrap.transition","ui.bootstrap.accordion"]),angular.module("ui.bootstrap.collapse",["ui.bootstrap.transition"]).directive("collapse",["$transition",function(n){return{link:function(i,o,t){function e(i){function t(){l===e&&(l=void 0)}var e=n(o,i);return l&&l.cancel(),l=e,e.then(t,t),e}function r(){u?(u=!1,a()):(o.removeClass("collapse").addClass("collapsing"),e({height:o[0].scrollHeight+"px"}).then(a))}function a(){o.removeClass("collapsing"),o.addClass("collapse in"),o.css({height:"auto"})}function c(){if(u)u=!1,s(),o.css({height:0});else{o.css({height:o[0].scrollHeight+"px"});{o[0].offsetWidth}o.removeClass("collapse in").addClass("collapsing"),e({height:0}).then(s)}}function s(){o.removeClass("collapsing"),o.addClass("collapse")}var l,u=!0;i.$watch(t.collapse,function(n){n?c():r()})}}}]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(n,i,o){function t(n){for(var i in n)if(void 0!==r.style[i])return n[i]}var e=function(t,r,a){a=a||{};var c=n.defer(),s=e[a.animation?"animationEndEventName":"transitionEndEventName"],l=function(){o.$apply(function(){t.unbind(s,l),c.resolve(t)})};return s&&t.bind(s,l),i(function(){angular.isString(r)?t.addClass(r):angular.isFunction(r)?r(t):angular.isObject(r)&&t.css(r),s||c.resolve(t)}),c.promise.cancel=function(){s&&t.unbind(s,l),c.reject("Transition cancelled")},c.promise},r=document.createElement("trans"),a={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},c={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return e.transitionEndEventName=t(a),e.animationEndEventName=t(c),e}]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(n,i,o){this.groups=[],this.closeOthers=function(t){var e=angular.isDefined(i.closeOthers)?n.$eval(i.closeOthers):o.closeOthers;e&&angular.forEach(this.groups,function(n){n!==t&&(n.isOpen=!1)})},this.addGroup=function(n){var i=this;this.groups.push(n),n.$on("$destroy",function(){i.removeGroup(n)})},this.removeGroup=function(n){var i=this.groups.indexOf(n);-1!==i&&this.groups.splice(i,1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",function(){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@",isOpen:"=?",isDisabled:"=?"},controller:function(){this.setHeading=function(n){this.heading=n}},link:function(n,i,o,t){t.addGroup(n),n.$watch("isOpen",function(i){i&&t.closeOthers(n)}),n.toggleOpen=function(){n.isDisabled||(n.isOpen=!n.isOpen)}}}}).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",link:function(n,i,o,t,e){t.setHeading(e(n,function(){}))}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(n,i,o,t){n.$watch(function(){return t[o.accordionTransclude]},function(n){n&&(i.html(""),i.append(n))})}}});
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.12.0 - 2015-10-17
 * License: MIT
 */
angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.collapse","ui.bootstrap.transition","ui.bootstrap.accordion"]),angular.module("ui.bootstrap.tpls",["template/accordion/accordion-group.html","template/accordion/accordion.html"]),angular.module("ui.bootstrap.collapse",["ui.bootstrap.transition"]).directive("collapse",["$transition",function(n){return{link:function(o,i,t){function e(o){function t(){l===e&&(l=void 0)}var e=n(i,o);return l&&l.cancel(),l=e,e.then(t,t),e}function a(){u?(u=!1,r()):(i.removeClass("collapse").addClass("collapsing"),e({height:i[0].scrollHeight+"px"}).then(r))}function r(){i.removeClass("collapsing"),i.addClass("collapse in"),i.css({height:"auto"})}function c(){if(u)u=!1,s(),i.css({height:0});else{i.css({height:i[0].scrollHeight+"px"});{i[0].offsetWidth}i.removeClass("collapse in").addClass("collapsing"),e({height:0}).then(s)}}function s(){i.removeClass("collapsing"),i.addClass("collapse")}var l,u=!0;o.$watch(t.collapse,function(n){n?c():a()})}}}]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(n,o,i){function t(n){for(var o in n)if(void 0!==a.style[o])return n[o]}var e=function(t,a,r){r=r||{};var c=n.defer(),s=e[r.animation?"animationEndEventName":"transitionEndEventName"],l=function(){i.$apply(function(){t.unbind(s,l),c.resolve(t)})};return s&&t.bind(s,l),o(function(){angular.isString(a)?t.addClass(a):angular.isFunction(a)?a(t):angular.isObject(a)&&t.css(a),s||c.resolve(t)}),c.promise.cancel=function(){s&&t.unbind(s,l),c.reject("Transition cancelled")},c.promise},a=document.createElement("trans"),r={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},c={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return e.transitionEndEventName=t(r),e.animationEndEventName=t(c),e}]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(n,o,i){this.groups=[],this.closeOthers=function(t){var e=angular.isDefined(o.closeOthers)?n.$eval(o.closeOthers):i.closeOthers;e&&angular.forEach(this.groups,function(n){n!==t&&(n.isOpen=!1)})},this.addGroup=function(n){var o=this;this.groups.push(n),n.$on("$destroy",function(){o.removeGroup(n)})},this.removeGroup=function(n){var o=this.groups.indexOf(n);-1!==o&&this.groups.splice(o,1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",function(){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@",isOpen:"=?",isDisabled:"=?"},controller:function(){this.setHeading=function(n){this.heading=n}},link:function(n,o,i,t){t.addGroup(n),n.$watch("isOpen",function(o){o&&t.closeOthers(n)}),n.toggleOpen=function(){n.isDisabled||(n.isOpen=!n.isOpen)}}}}).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",link:function(n,o,i,t,e){t.setHeading(e(n,function(){}))}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(n,o,i,t){n.$watch(function(){return t[i.accordionTransclude]},function(n){n&&(o.html(""),o.append(n))})}}}),angular.module("template/accordion/accordion-group.html",[]).run(["$templateCache",function(n){n.put("template/accordion/accordion-group.html",'<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href class="accordion-toggle" ng-click="toggleOpen()" accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse" collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n')}]),angular.module("template/accordion/accordion.html",[]).run(["$templateCache",function(n){n.put("template/accordion/accordion.html",'<div class="panel-group" ng-transclude></div>')}]);
/**
 * Enhanced Select2 Dropmenus
 *
 * @AJAX Mode - When in this mode, your value will be an object (or array of objects) of the data used by Select2
 *     This change is so that you do not have to do an additional query yourself on top of Select2's own query
 * @params [options] {object} The configuration options passed to $.fn.select2(). Refer to the documentation
 */
angular.module('ui.select2', []).value('uiSelect2Config', {}).directive('uiSelect2', ['uiSelect2Config', '$timeout', function (uiSelect2Config, $timeout) {
    var options = {};
    if (uiSelect2Config) {
        angular.extend(options, uiSelect2Config);
    }
    return {
        require: 'ngModel',
        priority: 1,
        compile: function (tElm, tAttrs) {
            var watch,
                repeatOption,
                repeatAttr,
                isSelect = tElm.is('select'),
                isMultiple = angular.isDefined(tAttrs.multiple);

            // Enable watching of the options dataset if in use
            if (tElm.is('select')) {
                repeatOption = tElm.find( 'optgroup[ng-repeat], optgroup[data-ng-repeat], option[ng-repeat], option[data-ng-repeat]');

                if (repeatOption.length) {
                    repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
                    watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop();
                }
            }

            return function (scope, elm, attrs, controller) {
                // instance-specific options
                var opts = angular.extend({}, options, scope.$eval(attrs.uiSelect2));

                /*
                 Convert from Select2 view-model to Angular view-model.
                 */
                var convertToAngularModel = function(select2_data) {
                    var model;
                    if (opts.simple_tags) {
                        model = [];
                        angular.forEach(select2_data, function(value, index) {
                            model.push(value.id);
                        });
                    } else {
                        model = select2_data;
                    }
                    return model;
                };

                /*
                 Convert from Angular view-model to Select2 view-model.
                 */
                var convertToSelect2Model = function(angular_data) {
                    var model = [];
                    if (!angular_data) {
                        return model;
                    }

                    if (opts.simple_tags) {
                        model = [];
                        angular.forEach(
                            angular_data,
                            function(value, index) {
                                model.push({'id': value, 'text': value});
                            });
                    } else {
                        model = angular_data;
                    }
                    return model;
                };

                if (isSelect) {
                    // Use <select multiple> instead
                    delete opts.multiple;
                    delete opts.initSelection;
                } else if (isMultiple) {
                    opts.multiple = true;
                }

                if (controller) {
                    // Watch the model for programmatic changes
                    scope.$watch(tAttrs.ngModel, function(current, old) {
                        if (!current) {
                            return;
                        }
                        if (current === old) {
                            return;
                        }
                        controller.$render();
                    }, true);
                    controller.$render = function () {
                        if (isSelect) {
                            elm.select2('val', controller.$viewValue);
                        } else {
                            if (opts.multiple) {
                                var viewValue = controller.$viewValue;
                                if (angular.isString(viewValue)) {
                                    viewValue = viewValue.split(',');
                                }
                                elm.select2(
                                    'data', convertToSelect2Model(viewValue));
                            } else {
                                if (angular.isObject(controller.$viewValue)) {
                                    elm.select2('data', controller.$viewValue);
                                } else if (!controller.$viewValue) {
                                    elm.select2('data', null);
                                } else {
                                    elm.select2('val', controller.$viewValue);
                                }
                            }
                        }
                    };

                    // Watch the options dataset for changes
                    if (watch) {
                        scope.$watch(watch, function (newVal, oldVal, scope) {
                            if (angular.equals(newVal, oldVal)) {
                                return;
                            }
                            // Delayed so that the options have time to be rendered
                            $timeout(function () {
                                elm.select2('val', controller.$viewValue);
                                // Refresh angular to remove the superfluous option
                                elm.trigger('change');
                                if(newVal && !oldVal && controller.$setPristine) {
                                    controller.$setPristine(true);
                                }
                            });
                        });
                    }

                    // Update valid and dirty statuses
                    controller.$parsers.push(function (value) {
                        var div = elm.prev();
                        div
                            .toggleClass('ng-invalid', !controller.$valid)
                            .toggleClass('ng-valid', controller.$valid)
                            .toggleClass('ng-invalid-required', !controller.$valid)
                            .toggleClass('ng-valid-required', controller.$valid)
                            .toggleClass('ng-dirty', controller.$dirty)
                            .toggleClass('ng-pristine', controller.$pristine);
                        return value;
                    });

                    if (!isSelect) {
                        // Set the view and model value and update the angular template manually for the ajax/multiple select2.
                        elm.bind("change", function (e) {
                            e.stopImmediatePropagation();

                            if (scope.$$phase || scope.$root.$$phase) {
                                return;
                            }
                            scope.$apply(function () {
                                controller.$setViewValue(
                                    convertToAngularModel(elm.select2('data')));
                            });
                        });

                        if (opts.initSelection) {
                            var initSelection = opts.initSelection;
                            opts.initSelection = function (element, callback) {
                                initSelection(element, function (value) {
                                    var isPristine = controller.$pristine;
                                    controller.$setViewValue(convertToAngularModel(value));
                                    callback(value);
                                    if (isPristine) {
                                        controller.$setPristine();
                                    }
                                    elm.prev().toggleClass('ng-pristine', controller.$pristine);
                                });
                            };
                        }
                    }
                }

                elm.bind("$destroy", function() {
                    elm.select2("destroy");
                });

                attrs.$observe('disabled', function (value) {
                    elm.select2('enable', !value);
                });

                attrs.$observe('readonly', function (value) {
                    elm.select2('readonly', !!value);
                });

                if (attrs.ngMultiple) {
                    scope.$watch(attrs.ngMultiple, function(newVal) {
                        attrs.$set('multiple', !!newVal);
                        elm.select2(opts);
                    });
                }

                // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
                $timeout(function () {
                    elm.select2(opts);

                    // Set initial value - I'm not sure about this but it seems to need to be there
                    elm.select2('data', controller.$modelValue);
                    // important!
                    controller.$render();

                    // Not sure if I should just check for !isSelect OR if I should check for 'tags' key
                    if (!opts.initSelection && !isSelect) {
                        var isPristine = controller.$pristine;
                        controller.$setViewValue(
                            convertToAngularModel(elm.select2('data'))
                        );
                        if (isPristine) {
                            controller.$setPristine();
                        }
                        elm.prev().toggleClass('ng-pristine', controller.$pristine);
                    }
                });
            };
        }
    };
}]);
(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('moment'));
    }
    else if(typeof define === 'function' && define.amd) {
        define('moment-range', ['moment'], factory);
    }
    else {
        root.moment = factory(root.moment);
    }
}(this, function(moment) {
    var DateRange, INTERVALS;

    INTERVALS = {
        year: true,
        month: true,
        week: true,
        day: true,
        hour: true,
        minute: true,
        second: true
    };

    /**
     * DateRange class to store ranges and query dates.
     * @typedef {!Object}
     *
     */


    DateRange = (function() {
        /**
         * DateRange instance.
         * @param {(Moment|Date)} start Start of interval.
         * @param {(Moment|Date)} end   End of interval.
         * @constructor
         *
         */

        function DateRange(start, end) {
            this.start = moment(start);
            this.end = moment(end);
        }

        /**
         * Determine if the current interval contains a given moment/date/range.
         * @param {(Moment|Date|DateRange)} other Date to check.
         * @return {!boolean}
         *
         */


        DateRange.prototype.contains = function(other) {
            if (other instanceof DateRange) {
                return this.start <= other.start && this.end >= other.end;
            } else {
                return (this.start <= other && other <= this.end);
            }
        };

        /**
         * @private
         *
         */


        DateRange.prototype._by_string = function(interval, hollaback) {
            var current, _results;
            current = moment(this.start);
            _results = [];
            while (this.contains(current)) {
                hollaback.call(this, current.clone());
                _results.push(current.add(interval, 1));
            }
            return _results;
        };

        /**
         * @private
         *
         */


        DateRange.prototype._by_range = function(range_interval, hollaback) {
            var i, l, _i, _results;
            l = Math.round(this / range_interval);
            if (l === Infinity) {
                return this;
            }
            _results = [];
            for (i = _i = 0; 0 <= l ? _i <= l : _i >= l; i = 0 <= l ? ++_i : --_i) {
                _results.push(hollaback.call(this, moment(this.start.valueOf() + range_interval.valueOf() * i)));
            }
            return _results;
        };

        /**
         * Determine if the current date range overlaps a given date range.
         * @param {!DateRange} range Date range to check.
         * @return {!boolean}
         *
         */


        DateRange.prototype.overlaps = function(range) {
            return this.intersect(range) !== null;
        };

        /**
         * Determine the intersecting periods from one or more date ranges.
         * @param {!DateRange} other A date range to intersect with this one.
         * @return {!DateRange|null}
         *
         */


        DateRange.prototype.intersect = function(other) {
            var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
            if (((this.start <= (_ref1 = other.start) && _ref1 < (_ref = this.end)) && _ref < other.end)) {
                return new DateRange(other.start, this.end);
            } else if (((other.start < (_ref3 = this.start) && _ref3 < (_ref2 = other.end)) && _ref2 <= this.end)) {
                return new DateRange(this.start, other.end);
            } else if (((other.start < (_ref5 = this.start) && _ref5 < (_ref4 = this.end)) && _ref4 < other.end)) {
                return this;
            } else if (((this.start <= (_ref7 = other.start) && _ref7 < (_ref6 = other.end)) && _ref6 <= this.end)) {
                return other;
            } else {
                return null;
            }
        };

        /**
         * Subtract one range from another.
         * @param {!DateRange} other A date range to substract from this one.
         * @return {!DateRange[]}
         *
         */


        DateRange.prototype.subtract = function(other) {
            var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
            if (this.intersect(other) === null) {
                return [this];
            } else if (((other.start <= (_ref1 = this.start) && _ref1 < (_ref = this.end)) && _ref <= other.end)) {
                return [];
            } else if (((other.start <= (_ref3 = this.start) && _ref3 < (_ref2 = other.end)) && _ref2 < this.end)) {
                return [new DateRange(other.end, this.end)];
            } else if (((this.start < (_ref5 = other.start) && _ref5 < (_ref4 = this.end)) && _ref4 <= other.end)) {
                return [new DateRange(this.start, other.start)];
            } else if (((this.start < (_ref7 = other.start) && _ref7 < (_ref6 = other.end)) && _ref6 < this.end)) {
                return [new DateRange(this.start, other.start), new DateRange(other.end, this.end)];
            }
        };

        /**
         * Iterate over the date range by a given date range, executing a function
         * for each sub-range.
         * @param {!DateRange|String} range     Date range to be used for iteration
         *                                      or shorthand string (shorthands:
         *                                      http://momentjs.com/docs/#/manipulating/add/)
         * @param {!function(Moment)} hollaback Function to execute for each sub-range.
         * @return {!boolean}
         *
         */


        DateRange.prototype.by = function(range, hollaback) {
            if (typeof range === 'string') {
                this._by_string(range, hollaback);
            } else {
                this._by_range(range, hollaback);
            }
            return this;
        };

        /**
         * Date range in milliseconds. Allows basic coercion math of date ranges.
         * @return {!number}
         *
         */


        DateRange.prototype.valueOf = function() {
            return this.end - this.start;
        };

        /**
         * Date range toDate
         * @return  {!Array}
         *
         */


        DateRange.prototype.toDate = function() {
            return [this.start.toDate(), this.end.toDate()];
        };

        /**
         * Determine if this date range is the same as another.
         * @param {!DateRange} other Another date range to compare to.
         * @return {!boolean}
         *
         */


        DateRange.prototype.isSame = function(other) {
            return this.start.isSame(other.start) && this.end.isSame(other.end);
        };

        /**
         * Return the difference of the end vs start.
         *   - To get the difference in milliseconds, use range#diff
         *   - To get the difference in another unit of measurement, pass that measurement as the second argument.
         * @return milliseconds if no measure is passed in, otherwise an increment of measure
         *
         */


        DateRange.prototype.diff = function(unit) {
            if (unit == null) {
                unit = void 0;
            }
            return this.end.diff(this.start, unit);
        };

        /**
         * Clones the current DateRange
         * @returns {DateRange}
         */
        DateRange.prototype.clone = function() {
            return new DateRange(this.start.clone(), this.end.clone());
        };

        return DateRange;

    })();

    /**
     * Build a date range.
     * @param {(Moment|Date)} start Start of range.
     * @param {(Moment|Date)} end   End of range.
     * @this {Moment}
     * @return {!DateRange}
     *
     */


    moment.fn.range = function(start, end) {
        if (start in INTERVALS) {
            return new DateRange(moment(this).startOf(start), moment(this).endOf(start));
        } else {
            return new DateRange(start, end);
        }
    };

    /**
     * Build a date range.
     * @param {(Moment|Date)} start Start of range.
     * @param {(Moment|Date)} end   End of range.
     * @this {Moment}
     * @return {!DateRange}
     *
     */


    moment.range = function(start, end) {
        return new DateRange(start, end);
    };

    /**
     * Check if the current moment is within a given date range.
     * @param {!DateRange} range Date range to check.
     * @this {Moment}
     * @return {!boolean}
     *
     */


    moment.fn.within = function(range) {
        return range.contains(this._d);
    };

    return moment;
}));
/*
 Highstock JS v2.0.0 (2014-04-22)

 (c) 2009-2014 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(){function v(a,b){var c;a||(a={});for(c in b)a[c]=b[c];return a}function y(){var a,b=arguments,c,d={},e=function(a,b){var c,d;typeof a!=="object"&&(a={});for(d in b)b.hasOwnProperty(d)&&(c=b[d],a[d]=c&&typeof c==="object"&&Object.prototype.toString.call(c)!=="[object Array]"&&d!=="renderTo"&&typeof c.nodeType!=="number"?e(a[d]||{},c):b[d]);return a};b[0]===!0&&(d=b[1],b=Array.prototype.slice.call(b,2));c=b.length;for(a=0;a<c;a++)d=e(d,b[a]);return d}function Kb(){for(var a=0,b=arguments,
c=b.length,d={};a<c;a++)d[b[a++]]=b[a];return d}function J(a,b){return parseInt(a,b||10)}function Oa(a){return typeof a==="string"}function ea(a){return typeof a==="object"}function Pa(a){return Object.prototype.toString.call(a)==="[object Array]"}function ka(a){return typeof a==="number"}function Ga(a){return U.log(a)/U.LN10}function na(a){return U.pow(10,a)}function oa(a,b){for(var c=a.length;c--;)if(a[c]===b){a.splice(c,1);break}}function t(a){return a!==r&&a!==null}function V(a,b,c){var d,e;if(Oa(b))t(c)?
a.setAttribute(b,c):a&&a.getAttribute&&(e=a.getAttribute(b));else if(t(b)&&ea(b))for(d in b)a.setAttribute(d,b[d]);return e}function la(a){return Pa(a)?a:[a]}function o(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++)if(c=a[b],typeof c!=="undefined"&&c!==null)return c}function E(a,b){if(Ha&&!ba&&b&&b.opacity!==r)b.filter="alpha(opacity="+b.opacity*100+")";v(a.style,b)}function Y(a,b,c,d,e){a=B.createElement(a);b&&v(a,b);e&&E(a,{padding:0,border:X,margin:0});c&&E(a,c);d&&d.appendChild(a);return a}
function fa(a,b){var c=function(){};c.prototype=new a;v(c.prototype,b);return c}function Ia(a,b,c,d){var e=I.lang,a=+a||0,f=b===-1?(a.toString().split(".")[1]||"").length:isNaN(b=N(b))?2:b,b=c===void 0?e.decimalPoint:c,d=d===void 0?e.thousandsSep:d,e=a<0?"-":"",c=String(J(a=N(a).toFixed(f))),g=c.length>3?c.length%3:0;return e+(g?c.substr(0,g)+d:"")+c.substr(g).replace(/(\d{3})(?=\d)/g,"$1"+d)+(f?b+N(a-c).toFixed(f).slice(2):"")}function Qa(a,b){return Array((b||2)+1-String(a).length).join(0)+a}function O(a,
b,c){var d=a[b];a[b]=function(){var a=Array.prototype.slice.call(arguments);a.unshift(d);return c.apply(this,a)}}function Ja(a,b){for(var c="{",d=!1,e,f,g,h,i,k=[];(c=a.indexOf(c))!==-1;){e=a.slice(0,c);if(d){f=e.split(":");g=f.shift().split(".");i=g.length;e=b;for(h=0;h<i;h++)e=e[g[h]];if(f.length)f=f.join(":"),g=/\.([0-9])/,h=I.lang,i=void 0,/f$/.test(f)?(i=(i=f.match(g))?i[1]:-1,e!==null&&(e=Ia(e,i,h.decimalPoint,f.indexOf(",")>-1?h.thousandsSep:""))):e=ua(f,e)}k.push(e);a=a.slice(c+1);c=(d=!d)?
"}":"{"}k.push(a);return k.join("")}function rb(a){return U.pow(10,S(U.log(a)/U.LN10))}function sb(a,b,c,d){var e,c=o(c,1);e=a/c;b||(b=[1,2,2.5,5,10],d&&d.allowDecimals===!1&&(c===1?b=[1,2,5,10]:c<=0.1&&(b=[1/c])));for(d=0;d<b.length;d++)if(a=b[d],e<=(b[d]+(b[d+1]||b[d]))/2)break;a*=c;return a}function Lb(){this.symbol=this.color=0}function tb(a,b){var c=a.length,d,e;for(e=0;e<c;e++)a[e].ss_i=e;a.sort(function(a,c){d=b(a,c);return d===0?a.ss_i-c.ss_i:d});for(e=0;e<c;e++)delete a[e].ss_i}function Ra(a){for(var b=
a.length,c=a[0];b--;)a[b]<c&&(c=a[b]);return c}function Ba(a){for(var b=a.length,c=a[0];b--;)a[b]>c&&(c=a[b]);return c}function Ka(a,b){for(var c in a)a[c]&&a[c]!==b&&a[c].destroy&&a[c].destroy(),delete a[c]}function Sa(a){hb||(hb=Y(Ta));a&&hb.appendChild(a);hb.innerHTML=""}function pa(a,b){var c="Highcharts error #"+a+": www.highcharts.com/errors/"+a;if(b)throw c;else W.console&&console.log(c)}function ga(a){return parseFloat(a.toPrecision(14))}function Ya(a,b){Ca=o(a,b.animation)}function Mb(){var a=
I.global.useUTC,b=a?"getUTC":"get",c=a?"setUTC":"set";La=(a&&I.global.timezoneOffset||0)*6E4;ib=a?Date.UTC:function(a,b,c,g,h,i){return(new Date(a,b,o(c,1),o(g,0),o(h,0),o(i,0))).getTime()};ub=b+"Minutes";vb=b+"Hours";wb=b+"Day";Ua=b+"Date";jb=b+"Month";kb=b+"FullYear";Nb=c+"Minutes";Ob=c+"Hours";xb=c+"Date";Pb=c+"Month";Qb=c+"FullYear"}function Z(){}function Za(a,b,c,d){this.axis=a;this.pos=b;this.type=c||"";this.isNew=!0;!c&&!d&&this.addLabel()}function F(){this.init.apply(this,arguments)}function va(){this.init.apply(this,
arguments)}function Rb(a,b,c,d,e){var f=a.chart.inverted;this.axis=a;this.isNegative=c;this.options=b;this.x=d;this.total=null;this.points={};this.stack=e;this.alignOptions={align:b.align||(f?c?"left":"right":"center"),verticalAlign:b.verticalAlign||(f?"middle":c?"bottom":"top"),y:o(b.y,f?4:c?14:-6),x:o(b.x,f?c?-6:6:0)};this.textAlign=b.textAlign||(f?c?"right":"left":"center")}function yb(a){var b=a.options,c=b.navigator,d=c.enabled,b=b.scrollbar,e=b.enabled,f=d?c.height:0,g=e?b.height:0;this.handles=
[];this.scrollbarButtons=[];this.elementsToDestroy=[];this.chart=a;this.setBaseSeries();this.height=f;this.scrollbarHeight=g;this.scrollbarEnabled=e;this.navigatorEnabled=d;this.navigatorOptions=c;this.scrollbarOptions=b;this.outlineHeight=f+g;this.init()}function zb(a){this.init(a)}var r,B=document,W=window,U=Math,s=U.round,S=U.floor,Va=U.ceil,w=U.max,z=U.min,N=U.abs,ca=U.cos,ha=U.sin,qa=U.PI,Ma=qa*2/360,Da=navigator.userAgent,Sb=W.opera,Ha=/msie/i.test(Da)&&!Sb,lb=B.documentMode===8,mb=/AppleWebKit/.test(Da),
$a=/Firefox/.test(Da),db=/(Mobile|Android|Windows Phone)/.test(Da),Ea="http://www.w3.org/2000/svg",ba=!!B.createElementNS&&!!B.createElementNS(Ea,"svg").createSVGRect,Yb=$a&&parseInt(Da.split("Firefox/")[1],10)<4,ia=!ba&&!Ha&&!!B.createElement("canvas").getContext,Wa,ab,Tb={},Ab=0,hb,I,ua,Ca,Bb,H,ma=function(){},$=[],eb=0,Ta="div",X="none",Zb=/^[0-9]+$/,$b="stroke-width",ib,La,ub,vb,wb,Ua,jb,kb,Nb,Ob,xb,Pb,Qb,C={},P=W.Highcharts=W.Highcharts?pa(16,!0):{};ua=function(a,b,c){if(!t(b)||isNaN(b))return"Invalid date";
var a=o(a,"%Y-%m-%d %H:%M:%S"),d=new Date(b-La),e,f=d[vb](),g=d[wb](),h=d[Ua](),i=d[jb](),k=d[kb](),j=I.lang,l=j.weekdays,d=v({a:l[g].substr(0,3),A:l[g],d:Qa(h),e:h,b:j.shortMonths[i],B:j.months[i],m:Qa(i+1),y:k.toString().substr(2,2),Y:k,H:Qa(f),I:Qa(f%12||12),l:f%12||12,M:Qa(d[ub]()),p:f<12?"AM":"PM",P:f<12?"am":"pm",S:Qa(d.getSeconds()),L:Qa(s(b%1E3),3)},P.dateFormats);for(e in d)for(;a.indexOf("%"+e)!==-1;)a=a.replace("%"+e,typeof d[e]==="function"?d[e](b):d[e]);return c?a.substr(0,1).toUpperCase()+
a.substr(1):a};Lb.prototype={wrapColor:function(a){if(this.color>=a)this.color=0},wrapSymbol:function(a){if(this.symbol>=a)this.symbol=0}};H=Kb("millisecond",1,"second",1E3,"minute",6E4,"hour",36E5,"day",864E5,"week",6048E5,"month",26784E5,"year",31556952E3);Bb={init:function(a,b,c){var b=b||"",d=a.shift,e=b.indexOf("C")>-1,f=e?7:3,g,b=b.split(" "),c=[].concat(c),h,i,k=function(a){for(g=a.length;g--;)a[g]==="M"&&a.splice(g+1,0,a[g+1],a[g+2],a[g+1],a[g+2])};e&&(k(b),k(c));a.isArea&&(h=b.splice(b.length-
6,6),i=c.splice(c.length-6,6));if(d<=c.length/f&&b.length===c.length)for(;d--;)c=[].concat(c).splice(0,f).concat(c);a.shift=0;if(b.length)for(a=c.length;b.length<a;)d=[].concat(b).splice(b.length-f,f),e&&(d[f-6]=d[f-2],d[f-5]=d[f-1]),b=b.concat(d);h&&(b=b.concat(h),c=c.concat(i));return[b,c]},step:function(a,b,c,d){var e=[],f=a.length;if(c===1)e=d;else if(f===b.length&&c<1)for(;f--;)d=parseFloat(a[f]),e[f]=isNaN(d)?a[f]:c*parseFloat(b[f]-d)+d;else e=b;return e}};(function(a){W.HighchartsAdapter=W.HighchartsAdapter||
a&&{init:function(b){var c=a.fx,d=c.step,e,f=a.Tween,g=f&&f.propHooks;e=a.cssHooks.opacity;a.extend(a.easing,{easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c}});a.each(["cur","_default","width","height","opacity"],function(a,b){var e=d,j;b==="cur"?e=c.prototype:b==="_default"&&f&&(e=g[b],b="set");(j=e[b])&&(e[b]=function(c){var d,c=a?c:this;if(c.prop!=="align")return d=c.elem,d.attr?d.attr(c.prop,b==="cur"?r:c.now):j.apply(this,arguments)})});O(e,"get",function(a,b,c){return b.attr?b.opacity||
0:a.call(this,b,c)});e=function(a){var c=a.elem,d;if(!a.started)d=b.init(c,c.d,c.toD),a.start=d[0],a.end=d[1],a.started=!0;c.attr("d",b.step(a.start,a.end,a.pos,c.toD))};f?g.d={set:e}:d.d=e;this.each=Array.prototype.forEach?function(a,b){return Array.prototype.forEach.call(a,b)}:function(a,b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],a[c],c,a)===!1)return c};a.fn.highcharts=function(){var a="Chart",b=arguments,c,d;if(this[0]){Oa(b[0])&&(a=b[0],b=Array.prototype.slice.call(b,1));c=b[0];if(c!==
r)c.chart=c.chart||{},c.chart.renderTo=this[0],new P[a](c,b[1]),d=this;c===r&&(d=$[V(this[0],"data-highcharts-chart")])}return d}},getScript:a.getScript,inArray:a.inArray,adapterRun:function(b,c){return a(b)[c]()},grep:a.grep,map:function(a,c){for(var d=[],e=0,f=a.length;e<f;e++)d[e]=c.call(a[e],a[e],e,a);return d},offset:function(b){return a(b).offset()},addEvent:function(b,c,d){a(b).bind(c,d)},removeEvent:function(b,c,d){var e=B.removeEventListener?"removeEventListener":"detachEvent";B[e]&&b&&!b[e]&&
(b[e]=function(){});a(b).unbind(c,d)},fireEvent:function(b,c,d,e){var f=a.Event(c),g="detached"+c,h;!Ha&&d&&(delete d.layerX,delete d.layerY,delete d.returnValue);v(f,d);b[c]&&(b[g]=b[c],b[c]=null);a.each(["preventDefault","stopPropagation"],function(a,b){var c=f[b];f[b]=function(){try{c.call(f)}catch(a){b==="preventDefault"&&(h=!0)}}});a(b).trigger(f);b[g]&&(b[c]=b[g],b[g]=null);e&&!f.isDefaultPrevented()&&!h&&e(f)},washMouseEvent:function(a){var c=a.originalEvent||a;if(c.pageX===r)c.pageX=a.pageX,
c.pageY=a.pageY;return c},animate:function(b,c,d){var e=a(b);if(!b.style)b.style={};if(c.d)b.toD=c.d,c.d=1;e.stop();c.opacity!==r&&b.attr&&(c.opacity+="px");e.animate(c,d)},stop:function(b){a(b).stop()}}})(W.jQuery);var M=W.HighchartsAdapter,Q=M||{};M&&M.init.call(M,Bb);var nb=Q.adapterRun,ac=Q.getScript,wa=Q.inArray,q=Q.each,Cb=Q.grep,bc=Q.offset,xa=Q.map,A=Q.addEvent,R=Q.removeEvent,K=Q.fireEvent,cc=Q.washMouseEvent,ob=Q.animate,fb=Q.stop,Q={enabled:!0,x:0,y:15,style:{color:"#606060",cursor:"default",
fontSize:"11px"}};I={colors:"#7cb5ec,#434348,#90ed7d,#f7a35c,#8085e9,#f15c80,#e4d354,#8085e8,#8d4653,#91e8e1".split(","),symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),shortMonths:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),weekdays:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),decimalPoint:".",numericSymbols:"k,M,G,T,P,E".split(","),
resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:","},global:{useUTC:!0,canvasToolsURL:"http://code.highcharts.com/stock/2.0.0/modules/canvas-tools.js",VMLRadialGradientURL:"http://code.highcharts.com/stock/2.0.0/gfx/vml-radial-gradient.png"},chart:{borderColor:"#4572A7",borderRadius:0,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0",resetZoomButton:{theme:{zIndex:20},position:{align:"right",x:-10,y:10}}},
title:{text:"Chart title",align:"center",margin:15,style:{color:"#333333",fontSize:"18px"}},subtitle:{text:"",align:"center",style:{color:"#555555"}},plotOptions:{line:{allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},lineWidth:2,marker:{lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{enabled:!0},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:y(Q,{align:"center",enabled:!1,formatter:function(){return this.y===null?"":Ia(this.y,
-1)},verticalAlign:"bottom",y:0}),cropThreshold:300,pointRange:0,states:{hover:{marker:{},halo:{size:10,opacity:0.25}},select:{marker:{}}},stickyTracking:!0,turboThreshold:1E3}},labels:{style:{position:"absolute",color:"#3E576F"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#909090",borderRadius:0,navigation:{activeColor:"#274b6d",inactiveColor:"#CCC"},shadow:!1,itemStyle:{color:"#333333",fontSize:"12px",fontWeight:"bold"},itemHoverStyle:{color:"#000"},
itemHiddenStyle:{color:"#CCC"},itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"1em"},style:{position:"absolute",backgroundColor:"white",opacity:0.5,textAlign:"center"}},tooltip:{enabled:!0,animation:ba,backgroundColor:"rgba(249, 249, 249, .85)",borderWidth:1,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",
minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b><br/>',shadow:!0,snap:db?25:10,style:{color:"#333333",cursor:"default",fontSize:"12px",padding:"8px",whiteSpace:"nowrap"}},credits:{enabled:!0,text:"Highcharts.com",href:"http://www.highcharts.com",position:{align:"right",
x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#909090",fontSize:"9px"}}};var T=I.plotOptions,M=T.line;Mb();var dc=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,ec=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,fc=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,Fa=function(a){var b=[],c,d;(function(a){a&&a.stops?d=xa(a.stops,function(a){return Fa(a[1])}):(c=dc.exec(a))?b=[J(c[1]),J(c[2]),J(c[3]),parseFloat(c[4],
10)]:(c=ec.exec(a))?b=[J(c[1],16),J(c[2],16),J(c[3],16),1]:(c=fc.exec(a))&&(b=[J(c[1]),J(c[2]),J(c[3]),1])})(a);return{get:function(c){var f;d?(f=y(a),f.stops=[].concat(f.stops),q(d,function(a,b){f.stops[b]=[f.stops[b][0],a.get(c)]})):f=b&&!isNaN(b[0])?c==="rgb"?"rgb("+b[0]+","+b[1]+","+b[2]+")":c==="a"?b[3]:"rgba("+b.join(",")+")":a;return f},brighten:function(a){if(d)q(d,function(b){b.brighten(a)});else if(ka(a)&&a!==0){var c;for(c=0;c<3;c++)b[c]+=J(a*255),b[c]<0&&(b[c]=0),b[c]>255&&(b[c]=255)}return this},
rgba:b,setOpacity:function(a){b[3]=a;return this}}};Z.prototype={init:function(a,b){this.element=b==="span"?Y(b):B.createElementNS(Ea,b);this.renderer=a},opacity:1,animate:function(a,b,c){b=o(b,Ca,!0);fb(this);if(b){b=y(b,{});if(c)b.complete=c;ob(this,a,b)}else this.attr(a),c&&c()},colorGradient:function(a,b,c){var d=this.renderer,e,f,g,h,i,k,j,l,m,n,p=[];a.linearGradient?f="linearGradient":a.radialGradient&&(f="radialGradient");if(f){g=a[f];h=d.gradients;k=a.stops;m=c.radialReference;Pa(g)&&(a[f]=
g={x1:g[0],y1:g[1],x2:g[2],y2:g[3],gradientUnits:"userSpaceOnUse"});f==="radialGradient"&&m&&!t(g.gradientUnits)&&(g=y(g,{cx:m[0]-m[2]/2+g.cx*m[2],cy:m[1]-m[2]/2+g.cy*m[2],r:g.r*m[2],gradientUnits:"userSpaceOnUse"}));for(n in g)n!=="id"&&p.push(n,g[n]);for(n in k)p.push(k[n]);p=p.join(",");h[p]?a=h[p].attr("id"):(g.id=a="highcharts-"+Ab++,h[p]=i=d.createElement(f).attr(g).add(d.defs),i.stops=[],q(k,function(a){a[1].indexOf("rgba")===0?(e=Fa(a[1]),j=e.get("rgb"),l=e.get("a")):(j=a[1],l=1);a=d.createElement("stop").attr({offset:a[0],
"stop-color":j,"stop-opacity":l}).add(i);i.stops.push(a)}));c.setAttribute(b,"url("+d.url+"#"+a+")")}},attr:function(a,b){var c,d,e=this.element,f,g=this,h;typeof a==="string"&&b!==r&&(c=a,a={},a[c]=b);if(typeof a==="string")g=(this[a+"Getter"]||this._defaultGetter).call(this,a,e);else{for(c in a){d=a[c];h=!1;this.symbolName&&/^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(c)&&(f||(this.symbolAttr(a),f=!0),h=!0);if(this.rotation&&(c==="x"||c==="y"))this.doTransform=!0;h||(this[c+"Setter"]||
this._defaultSetter).call(this,d,c,e);this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(c)&&this.updateShadows(c,d)}if(this.doTransform)this.updateTransform(),this.doTransform=!1}return g},updateShadows:function(a,b){for(var c=this.shadows,d=c.length;d--;)c[d].setAttribute(a,a==="height"?w(b-(c[d].cutHeight||0),0):a==="d"?this.d:b)},addClass:function(a){var b=this.element,c=V(b,"class")||"";c.indexOf(a)===-1&&V(b,"class",c+" "+a);return this},symbolAttr:function(a){var b=this;
q("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","),function(c){b[c]=o(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)})},clip:function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":X)},crisp:function(a){var b,c={},d,e=a.strokeWidth||this.strokeWidth||this.attr&&this.attr("stroke-width")||0;d=s(e)%2/2;a.x=S(a.x||this.x||0)+d;a.y=S(a.y||this.y||0)+d;a.width=S((a.width||this.width||0)-2*d);a.height=S((a.height||this.height||
0)-2*d);a.strokeWidth=e;for(b in a)this[b]!==a[b]&&(this[b]=c[b]=a[b]);return c},css:function(a){var b=this.styles,c={},d=this.element,e,f,g="";e=!b;if(a&&a.color)a.fill=a.color;if(b)for(f in a)a[f]!==b[f]&&(c[f]=a[f],e=!0);if(e){e=this.textWidth=a&&a.width&&d.nodeName.toLowerCase()==="text"&&J(a.width);b&&(a=v(b,c));this.styles=a;e&&(ia||!ba&&this.renderer.forExport)&&delete a.width;if(Ha&&!ba)E(this.element,a);else{b=function(a,b){return"-"+b.toLowerCase()};for(f in a)g+=f.replace(/([A-Z])/g,b)+
":"+a[f]+";";V(d,"style",g)}e&&this.added&&this.renderer.buildText(this)}return this},on:function(a,b){var c=this,d=c.element;ab&&a==="click"?(d.ontouchstart=function(a){c.touchEventFired=Date.now();a.preventDefault();b.call(d,a)},d.onclick=function(a){(Da.indexOf("Android")===-1||Date.now()-(c.touchEventFired||0)>1100)&&b.call(d,a)}):d["on"+a]=b;return this},setRadialReference:function(a){this.element.radialReference=a;return this},translate:function(a,b){return this.attr({translateX:a,translateY:b})},
invert:function(){this.inverted=!0;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,b=this.translateY||0,c=this.scaleX,d=this.scaleY,e=this.inverted,f=this.rotation,g=this.element;e&&(a+=this.attr("width"),b+=this.attr("height"));a=["translate("+a+","+b+")"];e?a.push("rotate(90) scale(-1,1)"):f&&a.push("rotate("+f+" "+(g.getAttribute("x")||0)+" "+(g.getAttribute("y")||0)+")");(t(c)||t(d))&&a.push("scale("+o(c,1)+" "+o(d,1)+")");a.length&&g.setAttribute("transform",
a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,b,c){var d,e,f,g,h={};e=this.renderer;f=e.alignedObjects;if(a){if(this.alignOptions=a,this.alignByTranslate=b,!c||Oa(c))this.alignTo=d=c||"renderer",oa(f,this),f.push(this),c=null}else a=this.alignOptions,b=this.alignByTranslate,d=this.alignTo;c=o(c,e[d],e);d=a.align;e=a.verticalAlign;f=(c.x||0)+(a.x||0);g=(c.y||0)+(a.y||0);if(d==="right"||d==="center")f+=(c.width-(a.width||0))/{right:1,center:2}[d];
h[b?"translateX":"x"]=s(f);if(e==="bottom"||e==="middle")g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||1);h[b?"translateY":"y"]=s(g);this[this.placed?"animate":"attr"](h);this.placed=!0;this.alignAttr=h;return this},getBBox:function(){var a=this.bBox,b=this.renderer,c,d,e=this.rotation;c=this.element;var f=this.styles,g=e*Ma;d=this.textStr;var h;if(d===""||Zb.test(d))h="num."+d.toString().length+(f?"|"+f.fontSize+"|"+f.fontFamily:"");h&&(a=b.cache[h]);if(!a){if(c.namespaceURI===Ea||b.forExport){try{a=
c.getBBox?v({},c.getBBox()):{width:c.offsetWidth,height:c.offsetHeight}}catch(i){}if(!a||a.width<0)a={width:0,height:0}}else a=this.htmlGetBBox();if(b.isSVG){c=a.width;d=a.height;if(Ha&&f&&f.fontSize==="11px"&&d.toPrecision(3)==="16.9")a.height=d=14;if(e)a.width=N(d*ha(g))+N(c*ca(g)),a.height=N(d*ca(g))+N(c*ha(g))}this.bBox=a;h&&(b.cache[h]=a)}return a},show:function(a){return a&&this.element.namespaceURI===Ea?(this.element.removeAttribute("visibility"),this):this.attr({visibility:a?"inherit":"visible"})},
hide:function(){return this.attr({visibility:"hidden"})},fadeOut:function(a){var b=this;b.animate({opacity:0},{duration:a||150,complete:function(){b.hide()}})},add:function(a){var b=this.renderer,c=a||b,d=c.element||b.box,e=this.element,f=this.zIndex,g,h;if(a)this.parentGroup=a;this.parentInverted=a&&a.inverted;this.textStr!==void 0&&b.buildText(this);if(f)c.handleZ=!0,f=J(f);if(c.handleZ){a=d.childNodes;for(g=0;g<a.length;g++)if(b=a[g],c=V(b,"zIndex"),b!==e&&(J(c)>f||!t(f)&&t(c))){d.insertBefore(e,
b);h=!0;break}}h||d.appendChild(e);this.added=!0;if(this.onAdd)this.onAdd();return this},safeRemoveChild:function(a){var b=a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=this,b=a.element||{},c=a.shadows,d=a.renderer.isSVG&&b.nodeName==="SPAN"&&a.parentGroup,e,f;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=b.point=null;fb(a);if(a.clipPath)a.clipPath=a.clipPath.destroy();if(a.stops){for(f=0;f<a.stops.length;f++)a.stops[f]=a.stops[f].destroy();a.stops=null}a.safeRemoveChild(b);for(c&&
q(c,function(b){a.safeRemoveChild(b)});d&&d.div.childNodes.length===0;)b=d.parentGroup,a.safeRemoveChild(d.div),delete d.div,d=b;a.alignTo&&oa(a.renderer.alignedObjects,a);for(e in a)delete a[e];return null},shadow:function(a,b,c){var d=[],e,f,g=this.element,h,i,k,j;if(a){i=o(a.width,3);k=(a.opacity||0.15)/i;j=this.parentInverted?"(-1,-1)":"("+o(a.offsetX,1)+", "+o(a.offsetY,1)+")";for(e=1;e<=i;e++){f=g.cloneNode(0);h=i*2+1-2*e;V(f,{isShadow:"true",stroke:a.color||"black","stroke-opacity":k*e,"stroke-width":h,
transform:"translate"+j,fill:X});if(c)V(f,"height",w(V(f,"height")-h,0)),f.cutHeight=h;b?b.element.appendChild(f):g.parentNode.insertBefore(f,g);d.push(f)}this.shadows=d}return this},xGetter:function(a){this.element.nodeName==="circle"&&(a={x:"cx",y:"cy"}[a]||a);return this._defaultGetter(a)},_defaultGetter:function(a){a=o(this[a],this.element?this.element.getAttribute(a):null,0);/^[0-9\.]+$/.test(a)&&(a=parseFloat(a));return a},dSetter:function(a,b,c){a&&a.join&&(a=a.join(" "));/(NaN| {2}|^$)/.test(a)&&
(a="M 0 0");c.setAttribute(b,a);this[b]=a},dashstyleSetter:function(a){var b;if(a=a&&a.toLowerCase()){a=a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(b=a.length;b--;)a[b]=J(a[b])*this.element.getAttribute("stroke-width");a=a.join(",");this.element.setAttribute("stroke-dasharray",a)}},alignSetter:function(a){this.element.setAttribute("text-anchor",
{left:"start",center:"middle",right:"end"}[a])},opacitySetter:function(a,b,c){this[b]=a;c.setAttribute(b,a)},"stroke-widthSetter":function(a,b,c){a===0&&(a=1.0E-5);this.strokeWidth=a;c.setAttribute(b,a)},titleSetter:function(a){var b=this.element.getElementsByTagName("title")[0];b||(b=B.createElementNS(Ea,"title"),this.element.appendChild(b));b.textContent=a},textSetter:function(a){if(a!==this.textStr)delete this.bBox,this.textStr=a,this.added&&this.renderer.buildText(this)},fillSetter:function(a,
b,c){typeof a==="string"?c.setAttribute(b,a):a&&this.colorGradient(a,b,c)},zIndexSetter:function(a,b,c){c.setAttribute(b,a);this[b]=a},_defaultSetter:function(a,b,c){c.setAttribute(b,a)}};Z.prototype.yGetter=Z.prototype.xGetter;Z.prototype.translateXSetter=Z.prototype.translateYSetter=Z.prototype.rotationSetter=Z.prototype.verticalAlignSetter=Z.prototype.scaleXSetter=Z.prototype.scaleYSetter=function(a,b){this[b]=a;this.doTransform=!0};var ja=function(){this.init.apply(this,arguments)};ja.prototype=
{Element:Z,init:function(a,b,c,d,e){var f=location,g,d=this.createElement("svg").attr({version:"1.1"}).css(this.getStyle(d));g=d.element;a.appendChild(g);a.innerHTML.indexOf("xmlns")===-1&&V(g,"xmlns",Ea);this.isSVG=!0;this.box=g;this.boxWrapper=d;this.alignedObjects=[];this.url=($a||mb)&&B.getElementsByTagName("base").length?f.href.replace(/#.*?$/,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(B.createTextNode("Created with Highstock 2.0.0"));
this.defs=this.createElement("defs").add();this.forExport=e;this.gradients={};this.cache={};this.setSize(b,c,!1);var h;if($a&&a.getBoundingClientRect)this.subPixelFix=b=function(){E(a,{left:0,top:0});h=a.getBoundingClientRect();E(a,{left:Va(h.left)-h.left+"px",top:Va(h.top)-h.top+"px"})},b(),A(W,"resize",b)},getStyle:function(a){return this.style=v({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},a)},isHidden:function(){return!this.boxWrapper.getBBox().width},
destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();Ka(this.gradients||{});this.gradients=null;if(a)this.defs=a.destroy();this.subPixelFix&&R(W,"resize",this.subPixelFix);return this.alignedObjects=null},createElement:function(a){var b=new this.Element;b.init(this,a);return b},draw:function(){},buildText:function(a){for(var b=a.element,c=this,d=c.forExport,e=o(a.textStr,"").toString(),f=e.indexOf("<")!==-1,g=b.childNodes,h,i,k=V(b,"x"),j=a.styles,l=a.textWidth,
m=j&&j.lineHeight,n=g.length,p=function(a){return m?J(m):c.fontMetrics(/(px|em)$/.test(a&&a.style.fontSize)?a.style.fontSize:j&&j.fontSize||c.style.fontSize||12).h};n--;)b.removeChild(g[n]);!f&&e.indexOf(" ")===-1?b.appendChild(B.createTextNode(e)):(h=/<.*style="([^"]+)".*>/,i=/<.*href="(http[^"]+)".*>/,l&&!a.added&&this.box.appendChild(b),e=f?e.replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,
"</span>").split(/<br.*?>/g):[e],e[e.length-1]===""&&e.pop(),q(e,function(e,f){var g,m=0,e=e.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");g=e.split("|||");q(g,function(e){if(e!==""||g.length===1){var n={},u=B.createElementNS(Ea,"tspan"),o;h.test(e)&&(o=e.match(h)[1].replace(/(;| |^)color([ :])/,"$1fill$2"),V(u,"style",o));i.test(e)&&!d&&(V(u,"onclick",'location.href="'+e.match(i)[1]+'"'),E(u,{cursor:"pointer"}));e=(e.replace(/<(.|\n)*?>/g,"")||" ").replace(/&lt;/g,"<").replace(/&gt;/g,
">");if(e!==" "){u.appendChild(B.createTextNode(e));if(m)n.dx=0;else if(f&&k!==null)n.x=k;V(u,n);!m&&f&&(!ba&&d&&E(u,{display:"block"}),V(u,"dy",p(u),mb&&u.offsetHeight));b.appendChild(u);m++;if(l)for(var e=e.replace(/([^\^])-/g,"$1- ").split(" "),n=e.length>1&&j.whiteSpace!=="nowrap",q,r,D=a._clipHeight,t=[],s=p(),w=1;n&&(e.length||t.length);)delete a.bBox,q=a.getBBox(),r=q.width,!ba&&c.forExport&&(r=c.measureSpanWidth(u.firstChild.data,a.styles)),q=r>l,!q||e.length===1?(e=t,t=[],e.length&&(w++,
D&&w*s>D?(e=["..."],a.attr("title",a.textStr)):(u=B.createElementNS(Ea,"tspan"),V(u,{dy:s,x:k}),o&&V(u,"style",o),b.appendChild(u),r>l&&(l=r)))):(u.removeChild(u.firstChild),t.unshift(e.pop())),e.length&&u.appendChild(B.createTextNode(e.join(" ").replace(/- /g,"-")))}}})}))},button:function(a,b,c,d,e,f,g,h,i){var k=this.label(a,b,c,i,null,null,null,null,"button"),j=0,l,m,n,p,u,o,a={x1:0,y1:0,x2:0,y2:1},e=y({"stroke-width":1,stroke:"#CCCCCC",fill:{linearGradient:a,stops:[[0,"#FEFEFE"],[1,"#F6F6F6"]]},
r:2,padding:5,style:{color:"black"}},e);n=e.style;delete e.style;f=y(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#FFF"],[1,"#ACF"]]}},f);p=f.style;delete f.style;g=y(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#9BD"],[1,"#CDF"]]}},g);u=g.style;delete g.style;h=y(e,{style:{color:"#CCC"}},h);o=h.style;delete h.style;A(k.element,Ha?"mouseover":"mouseenter",function(){j!==3&&k.attr(f).css(p)});A(k.element,Ha?"mouseout":"mouseleave",function(){j!==3&&(l=[e,f,g][j],m=[n,p,u][j],k.attr(l).css(m))});
k.setState=function(a){(k.state=j=a)?a===2?k.attr(g).css(u):a===3&&k.attr(h).css(o):k.attr(e).css(n)};return k.on("click",function(){j!==3&&d.call(k)}).attr(e).css(v({cursor:"default"},n))},crispLine:function(a,b){a[1]===a[4]&&(a[1]=a[4]=s(a[1])-b%2/2);a[2]===a[5]&&(a[2]=a[5]=s(a[2])+b%2/2);return a},path:function(a){var b={fill:X};Pa(a)?b.d=a:ea(a)&&v(b,a);return this.createElement("path").attr(b)},circle:function(a,b,c){a=ea(a)?a:{x:a,y:b,r:c};b=this.createElement("circle");b.xSetter=function(a){this.element.setAttribute("cx",
a)};b.ySetter=function(a){this.element.setAttribute("cy",a)};return b.attr(a)},arc:function(a,b,c,d,e,f){if(ea(a))b=a.y,c=a.r,d=a.innerR,e=a.start,f=a.end,a=a.x;a=this.symbol("arc",a||0,b||0,c||0,c||0,{innerR:d||0,start:e||0,end:f||0});a.r=c;return a},rect:function(a,b,c,d,e,f){var e=ea(a)?a.r:e,g=this.createElement("rect"),a=ea(a)?a:a===r?{}:{x:a,y:b,width:w(c,0),height:w(d,0)};if(f!==r)a.strokeWidth=f,a=g.crisp(a);if(e)a.r=e;g.rSetter=function(a){V(this.element,{rx:a,ry:a})};return g.attr(a)},setSize:function(a,
b,c){var d=this.alignedObjects,e=d.length;this.width=a;this.height=b;for(this.boxWrapper[o(c,!0)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},g:function(a){var b=this.createElement("g");return t(a)?b.attr({"class":"highcharts-"+a}):b},image:function(a,b,c,d,e){var f={preserveAspectRatio:X};arguments.length>1&&v(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);f.element.setAttributeNS?f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):f.element.setAttribute("hc-svg-href",
a);return f},symbol:function(a,b,c,d,e,f){var g,h=this.symbols[a],h=h&&h(s(b),s(c),d,e,f),i=/^url\((.*?)\)$/,k,j;if(h)g=this.path(h),v(g,{symbolName:a,x:b,y:c,width:d,height:e}),f&&v(g,f);else if(i.test(a))j=function(a,b){a.element&&(a.attr({width:b[0],height:b[1]}),a.alignByTranslate||a.translate(s((d-b[0])/2),s((e-b[1])/2)))},k=a.match(i)[1],a=Tb[k],g=this.image(k).attr({x:b,y:c}),g.isImg=!0,a?j(g,a):(g.attr({width:0,height:0}),Y("img",{onload:function(){j(g,Tb[k]=[this.width,this.height])},src:k}));
return g},symbols:{circle:function(a,b,c,d){var e=0.166*c;return["M",a+c/2,b,"C",a+c+e,b,a+c+e,b+d,a+c/2,b+d,"C",a-e,b+d,a-e,b,a+c/2,b,"Z"]},square:function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c,b+d,a,b+d,"Z"]},triangle:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d,a,b+d,"Z"]},"triangle-down":function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c/2,b+d,"Z"]},diamond:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d/2,a+c/2,b+d,a,b+d/2,"Z"]},arc:function(a,b,c,d,e){var f=e.start,c=e.r||c||d,g=e.end-0.001,
d=e.innerR,h=e.open,i=ca(f),k=ha(f),j=ca(g),g=ha(g),e=e.end-f<qa?0:1;return["M",a+c*i,b+c*k,"A",c,c,0,e,1,a+c*j,b+c*g,h?"M":"L",a+d*j,b+d*g,"A",d,d,0,e,0,a+d*i,b+d*k,h?"":"Z"]},callout:function(a,b,c,d,e){var f=z(e&&e.r||0,c,d),g=f+6,h=e&&e.anchorX,i=e&&e.anchorY,e=s(e.strokeWidth||0)%2/2;a+=e;b+=e;e=["M",a+f,b,"L",a+c-f,b,"C",a+c,b,a+c,b,a+c,b+f,"L",a+c,b+d-f,"C",a+c,b+d,a+c,b+d,a+c-f,b+d,"L",a+f,b+d,"C",a,b+d,a,b+d,a,b+d-f,"L",a,b+f,"C",a,b,a,b,a+f,b];h&&h>c&&i>b+g&&i<b+d-g?e.splice(13,3,"L",a+
c,i-6,a+c+6,i,a+c,i+6,a+c,b+d-f):h&&h<0&&i>b+g&&i<b+d-g?e.splice(33,3,"L",a,i+6,a-6,i,a,i-6,a,b+f):i&&i>d&&h>a+g&&h<a+c-g?e.splice(23,3,"L",h+6,b+d,h,b+d+6,h-6,b+d,a+f,b+d):i&&i<0&&h>a+g&&h<a+c-g&&e.splice(3,3,"L",h-6,b,h,b-6,h+6,b,c-f,b);return e}},clipRect:function(a,b,c,d){var e="highcharts-"+Ab++,f=this.createElement("clipPath").attr({id:e}).add(this.defs),a=this.rect(a,b,c,d,0).add(f);a.id=e;a.clipPath=f;return a},text:function(a,b,c,d){var e=ia||!ba&&this.forExport,f={};if(d&&!this.forExport)return this.html(a,
b,c);f.x=Math.round(b||0);if(c)f.y=Math.round(c);if(a||a===0)f.text=a;a=this.createElement("text").attr(f);e&&a.css({position:"absolute"});if(!d)a.xSetter=function(a,b,c){var d=c.childNodes,e,f;for(f=1;f<d.length;f++)e=d[f],e.getAttribute("x")===c.getAttribute("x")&&e.setAttribute("x",a);c.setAttribute(b,a)};return a},fontMetrics:function(a){var a=a||this.style.fontSize,a=/px/.test(a)?J(a):/em/.test(a)?parseFloat(a)*12:12,a=a<24?a+4:s(a*1.2),b=s(a*0.8);return{h:a,b:b}},label:function(a,b,c,d,e,f,
g,h,i){function k(){var a,b;a=p.element.style;o=(bb===void 0||Eb===void 0||n.styles.textAlign)&&p.textStr&&p.getBBox();n.width=(bb||o.width||0)+2*x+w;n.height=(Eb||o.height||0)+2*x;ra=x+m.fontMetrics(a&&a.fontSize).b;if(z){if(!u)a=s(-G*x),b=h?-ra:0,n.box=u=d?m.symbol(d,a,b,n.width,n.height,D):m.rect(a,b,n.width,n.height,0,D[$b]),u.attr("fill",X).add(n);u.isImg||u.attr(v({width:s(n.width),height:s(n.height)},D));D=null}}function j(){var a=n.styles,a=a&&a.textAlign,b=w+x*(1-G),c;c=h?0:ra;if(t(bb)&&
o&&(a==="center"||a==="right"))b+={center:0.5,right:1}[a]*(bb-o.width);if(b!==p.x||c!==p.y)p.attr("x",b),c!==r&&p.attr("y",c);p.x=b;p.y=c}function l(a,b){u?u.attr(a,b):D[a]=b}var m=this,n=m.g(i),p=m.text("",0,0,g).attr({zIndex:1}),u,o,G=0,x=3,w=0,bb,Eb,Fb,Gb,Ub=0,D={},ra,z;n.onAdd=function(){p.add(n);n.attr({text:a||"",x:b,y:c});u&&t(e)&&n.attr({anchorX:e,anchorY:f})};n.widthSetter=function(a){bb=a};n.heightSetter=function(a){Eb=a};n.paddingSetter=function(a){t(a)&&a!==x&&(x=a,j())};n.paddingLeftSetter=
function(a){t(a)&&a!==w&&(w=a,j())};n.alignSetter=function(a){G={left:0,center:0.5,right:1}[a]};n.textSetter=function(a){a!==r&&p.textSetter(a);k();j()};n["stroke-widthSetter"]=function(a,b){a&&(z=!0);Ub=a%2/2;l(b,a)};n.strokeSetter=n.fillSetter=n.rSetter=function(a,b){b==="fill"&&a&&(z=!0);l(b,a)};n.anchorXSetter=function(a,b){e=a;l(b,a+Ub-Fb)};n.anchorYSetter=function(a,b){f=a;l(b,a-Gb)};n.xSetter=function(a){n.x=a;G&&(a-=G*((bb||o.width)+x));Fb=s(a);n.attr("translateX",Fb)};n.ySetter=function(a){Gb=
n.y=s(a);n.attr("translateY",Gb)};var A=n.css;return v(n,{css:function(a){if(a){var b={},a=y(a);q("fontSize,fontWeight,fontFamily,color,lineHeight,width,textDecoration,textShadow".split(","),function(c){a[c]!==r&&(b[c]=a[c],delete a[c])});p.css(b)}return A.call(n,a)},getBBox:function(){return{width:o.width+2*x,height:o.height+2*x,x:o.x-x,y:o.y-x}},shadow:function(a){u&&u.shadow(a);return n},destroy:function(){R(n.element,"mouseenter");R(n.element,"mouseleave");p&&(p=p.destroy());u&&(u=u.destroy());
Z.prototype.destroy.call(n);n=m=k=j=l=null}})}};Wa=ja;v(Z.prototype,{htmlCss:function(a){var b=this.element;if(b=a&&b.tagName==="SPAN"&&a.width)delete a.width,this.textWidth=b,this.updateTransform();this.styles=v(this.styles,a);E(this.element,a);return this},htmlGetBBox:function(){var a=this.element,b=this.bBox;if(!b){if(a.nodeName==="text")a.style.position="absolute";b=this.bBox={x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}}return b},htmlUpdateTransform:function(){if(this.added){var a=
this.renderer,b=this.element,c=this.translateX||0,d=this.translateY||0,e=this.x||0,f=this.y||0,g=this.textAlign||"left",h={left:0,center:0.5,right:1}[g],i=this.shadows;E(b,{marginLeft:c,marginTop:d});i&&q(i,function(a){E(a,{marginLeft:c+1,marginTop:d+1})});this.inverted&&q(b.childNodes,function(c){a.invertChild(c,b)});if(b.tagName==="SPAN"){var k=this.rotation,j,l=J(this.textWidth),m=[k,g,b.innerHTML,this.textWidth].join(",");if(m!==this.cTT){j=a.fontMetrics(b.style.fontSize).b;t(k)&&this.setSpanRotation(k,
h,j);i=o(this.elemWidth,b.offsetWidth);if(i>l&&/[ \-]/.test(b.textContent||b.innerText))E(b,{width:l+"px",display:"block",whiteSpace:"normal"}),i=l;this.getSpanCorrection(i,j,h,k,g)}E(b,{left:e+(this.xCorr||0)+"px",top:f+(this.yCorr||0)+"px"});if(mb)j=b.offsetHeight;this.cTT=m}}else this.alignOnAdd=!0},setSpanRotation:function(a,b,c){var d={},e=Ha?"-ms-transform":mb?"-webkit-transform":$a?"MozTransform":Sb?"-o-transform":"";d[e]=d.transform="rotate("+a+"deg)";d[e+($a?"Origin":"-origin")]=d.transformOrigin=
b*100+"% "+c+"px";E(this.element,d)},getSpanCorrection:function(a,b,c){this.xCorr=-a*c;this.yCorr=-b}});v(ja.prototype,{html:function(a,b,c){var d=this.createElement("span"),e=d.element,f=d.renderer;d.textSetter=function(a){a!==e.innerHTML&&delete this.bBox;e.innerHTML=this.textStr=a};d.xSetter=d.ySetter=d.alignSetter=d.rotationSetter=function(a,b){b==="align"&&(b="textAlign");d[b]=a;d.htmlUpdateTransform()};d.attr({text:a,x:s(b),y:s(c)}).css({position:"absolute",whiteSpace:"nowrap",fontFamily:this.style.fontFamily,
fontSize:this.style.fontSize});d.css=d.htmlCss;if(f.isSVG)d.add=function(a){var b,c=f.box.parentNode,k=[];if(this.parentGroup=a){if(b=a.div,!b){for(;a;)k.push(a),a=a.parentGroup;q(k.reverse(),function(a){var d;b=a.div=a.div||Y(Ta,{className:V(a.element,"class")},{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px"},b||c);d=b.style;v(a,{translateXSetter:function(b,c){d.left=b+"px";a[c]=b;a.doTransform=!0},translateYSetter:function(b,c){d.top=b+"px";a[c]=b;a.doTransform=!0},visibilitySetter:function(a,
b){d[b]=a}})})}}else b=c;b.appendChild(e);d.added=!0;d.alignOnAdd&&d.htmlUpdateTransform();return d};return d}});var gb,da;if(!ba&&!ia)P.VMLElement=da={init:function(a,b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ","absolute",";"],e=b===Ta;(b==="shape"||e)&&d.push("left:0;top:0;width:1px;height:1px;");d.push("visibility: ",e?"hidden":"visible");c.push(' style="',d.join(""),'"/>');if(b)c=e||b==="span"||b==="img"?c.join(""):a.prepVML(c),this.element=Y(c);this.renderer=a},add:function(a){var b=
this.renderer,c=this.element,d=b.box,d=a?a.element||a:d;a&&a.inverted&&b.invertChild(c,d);d.appendChild(c);this.added=!0;this.alignOnAdd&&!this.deferUpdateTransform&&this.updateTransform();if(this.onAdd)this.onAdd();return this},updateTransform:Z.prototype.htmlUpdateTransform,setSpanRotation:function(){var a=this.rotation,b=ca(a*Ma),c=ha(a*Ma);E(this.element,{filter:a?["progid:DXImageTransform.Microsoft.Matrix(M11=",b,", M12=",-c,", M21=",c,", M22=",b,", sizingMethod='auto expand')"].join(""):X})},
getSpanCorrection:function(a,b,c,d,e){var f=d?ca(d*Ma):1,g=d?ha(d*Ma):0,h=o(this.elemHeight,this.element.offsetHeight),i;this.xCorr=f<0&&-a;this.yCorr=g<0&&-h;i=f*g<0;this.xCorr+=g*b*(i?1-c:c);this.yCorr-=f*b*(d?i?c:1-c:1);e&&e!=="left"&&(this.xCorr-=a*c*(f<0?-1:1),d&&(this.yCorr-=h*c*(g<0?-1:1)),E(this.element,{textAlign:e}))},pathToVML:function(a){for(var b=a.length,c=[];b--;)if(ka(a[b]))c[b]=s(a[b]*10)-5;else if(a[b]==="Z")c[b]="x";else if(c[b]=a[b],a.isArc&&(a[b]==="wa"||a[b]==="at"))c[b+5]===
c[b+7]&&(c[b+7]+=a[b+7]>a[b+5]?1:-1),c[b+6]===c[b+8]&&(c[b+8]+=a[b+8]>a[b+6]?1:-1);return c.join(" ")||"x"},clip:function(a){var b=this,c;a?(c=a.members,oa(c,b),c.push(b),b.destroyClip=function(){oa(c,b)},a=a.getCSS(b)):(b.destroyClip&&b.destroyClip(),a={clip:lb?"inherit":"rect(auto)"});return b.css(a)},css:Z.prototype.htmlCss,safeRemoveChild:function(a){a.parentNode&&Sa(a)},destroy:function(){this.destroyClip&&this.destroyClip();return Z.prototype.destroy.apply(this)},on:function(a,b){this.element["on"+
a]=function(){var a=W.event;a.target=a.srcElement;b(a)};return this},cutOffPath:function(a,b){var c,a=a.split(/[ ,]/);c=a.length;if(c===9||c===11)a[c-4]=a[c-2]=J(a[c-2])-10*b;return a.join(" ")},shadow:function(a,b,c){var d=[],e,f=this.element,g=this.renderer,h,i=f.style,k,j=f.path,l,m,n,p;j&&typeof j.value!=="string"&&(j="x");m=j;if(a){n=o(a.width,3);p=(a.opacity||0.15)/n;for(e=1;e<=3;e++){l=n*2+1-2*e;c&&(m=this.cutOffPath(j.value,l+0.5));k=['<shape isShadow="true" strokeweight="',l,'" filled="false" path="',
m,'" coordsize="10 10" style="',f.style.cssText,'" />'];h=Y(g.prepVML(k),null,{left:J(i.left)+o(a.offsetX,1),top:J(i.top)+o(a.offsetY,1)});if(c)h.cutOff=l+1;k=['<stroke color="',a.color||"black",'" opacity="',p*e,'"/>'];Y(g.prepVML(k),null,null,h);b?b.element.appendChild(h):f.parentNode.insertBefore(h,f);d.push(h)}this.shadows=d}return this},updateShadows:ma,setAttr:function(a,b){lb?this.element[a]=b:this.element.setAttribute(a,b)},classSetter:function(a){this.element.className=a},dashstyleSetter:function(a,
b,c){(c.getElementsByTagName("stroke")[0]||Y(this.renderer.prepVML(["<stroke/>"]),null,null,c))[b]=a||"solid";this[b]=a},dSetter:function(a,b,c){var d=this.shadows,a=a||[];this.d=a.join(" ");c.path=a=this.pathToVML(a);if(d)for(c=d.length;c--;)d[c].path=d[c].cutOff?this.cutOffPath(a,d[c].cutOff):a;this.setAttr(b,a)},fillSetter:function(a,b,c){var d=c.nodeName;if(d==="SPAN")c.style.color=a;else if(d!=="IMG")c.filled=a!==X,this.setAttr("fillcolor",this.renderer.color(a,c,b,this))},opacitySetter:ma,rotationSetter:function(a,
b,c){c=c.style;this[b]=c[b]=a;c.left=-s(ha(a*Ma)+1)+"px";c.top=s(ca(a*Ma))+"px"},strokeSetter:function(a,b,c){this.setAttr("strokecolor",this.renderer.color(a,c,b))},"stroke-widthSetter":function(a,b,c){c.stroked=!!a;this[b]=a;ka(a)&&(a+="px");this.setAttr("strokeweight",a)},titleSetter:function(a,b){this.setAttr(b,a)},visibilitySetter:function(a,b,c){a==="inherit"&&(a="visible");this.shadows&&q(this.shadows,function(c){c.style[b]=a});c.nodeName==="DIV"&&(a=a==="hidden"?"-999em":0,lb||(c.style[b]=
a?"visible":"hidden"),b="top");c.style[b]=a},xSetter:function(a,b,c){this[b]=a;b==="x"?b="left":b==="y"&&(b="top");this.updateClipping?(this[b]=a,this.updateClipping()):c.style[b]=a},zIndexSetter:function(a,b,c){c.style[b]=a}},da=fa(Z,da),da.prototype.ySetter=da.prototype.widthSetter=da.prototype.heightSetter=da.prototype.xSetter,da={Element:da,isIE8:Da.indexOf("MSIE 8.0")>-1,init:function(a,b,c,d){var e;this.alignedObjects=[];d=this.createElement(Ta).css(v(this.getStyle(d),{position:"relative"}));
e=d.element;a.appendChild(d.element);this.isVML=!0;this.box=e;this.boxWrapper=d;this.cache={};this.setSize(b,c,!1);if(!B.namespaces.hcv){B.namespaces.add("hcv","urn:schemas-microsoft-com:vml");try{B.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}catch(f){B.styleSheets[0].cssText+="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}}},isHidden:function(){return!this.box.offsetWidth},
clipRect:function(a,b,c,d){var e=this.createElement(),f=ea(a);return v(e,{members:[],left:(f?a.x:a)+1,top:(f?a.y:b)+1,width:(f?a.width:c)-1,height:(f?a.height:d)-1,getCSS:function(a){var b=a.element,c=b.nodeName,a=a.inverted,d=this.top-(c==="shape"?b.offsetTop:0),e=this.left,b=e+this.width,f=d+this.height,d={clip:"rect("+s(a?e:d)+"px,"+s(a?f:b)+"px,"+s(a?b:f)+"px,"+s(a?d:e)+"px)"};!a&&lb&&c==="DIV"&&v(d,{width:b+"px",height:f+"px"});return d},updateClipping:function(){q(e.members,function(a){a.element&&
a.css(e.getCSS(a))})}})},color:function(a,b,c,d){var e=this,f,g=/^rgba/,h,i,k=X;a&&a.linearGradient?i="gradient":a&&a.radialGradient&&(i="pattern");if(i){var j,l,m=a.linearGradient||a.radialGradient,n,p,u,o,G,x="",a=a.stops,r,t=[],s=function(){h=['<fill colors="'+t.join(",")+'" opacity="',u,'" o:opacity2="',p,'" type="',i,'" ',x,'focus="100%" method="any" />'];Y(e.prepVML(h),null,null,b)};n=a[0];r=a[a.length-1];n[0]>0&&a.unshift([0,n[1]]);r[0]<1&&a.push([1,r[1]]);q(a,function(a,b){g.test(a[1])?(f=
Fa(a[1]),j=f.get("rgb"),l=f.get("a")):(j=a[1],l=1);t.push(a[0]*100+"% "+j);b?(u=l,o=j):(p=l,G=j)});if(c==="fill")if(i==="gradient")c=m.x1||m[0]||0,a=m.y1||m[1]||0,n=m.x2||m[2]||0,m=m.y2||m[3]||0,x='angle="'+(90-U.atan((m-a)/(n-c))*180/qa)+'"',s();else{var k=m.r,w=k*2,v=k*2,y=m.cx,D=m.cy,ra=b.radialReference,z,k=function(){ra&&(z=d.getBBox(),y+=(ra[0]-z.x)/z.width-0.5,D+=(ra[1]-z.y)/z.height-0.5,w*=ra[2]/z.width,v*=ra[2]/z.height);x='src="'+I.global.VMLRadialGradientURL+'" size="'+w+","+v+'" origin="0.5,0.5" position="'+
y+","+D+'" color2="'+G+'" ';s()};d.added?k():d.onAdd=k;k=o}else k=j}else if(g.test(a)&&b.tagName!=="IMG")f=Fa(a),h=["<",c,' opacity="',f.get("a"),'"/>'],Y(this.prepVML(h),null,null,b),k=f.get("rgb");else{k=b.getElementsByTagName(c);if(k.length)k[0].opacity=1,k[0].type="solid";k=a}return k},prepVML:function(a){var b=this.isIE8,a=a.join("");b?(a=a.replace("/>",' xmlns="urn:schemas-microsoft-com:vml" />'),a=a.indexOf('style="')===-1?a.replace("/>",' style="display:inline-block;behavior:url(#default#VML);" />'):
a.replace('style="','style="display:inline-block;behavior:url(#default#VML);')):a=a.replace("<","<hcv:");return a},text:ja.prototype.html,path:function(a){var b={coordsize:"10 10"};Pa(a)?b.d=a:ea(a)&&v(b,a);return this.createElement("shape").attr(b)},circle:function(a,b,c){var d=this.symbol("circle");if(ea(a))c=a.r,b=a.y,a=a.x;d.isCircle=!0;d.r=c;return d.attr({x:a,y:b})},g:function(a){var b;a&&(b={className:"highcharts-"+a,"class":"highcharts-"+a});return this.createElement(Ta).attr(b)},image:function(a,
b,c,d,e){var f=this.createElement("img").attr({src:a});arguments.length>1&&f.attr({x:b,y:c,width:d,height:e});return f},createElement:function(a){return a==="rect"?this.symbol(a):ja.prototype.createElement.call(this,a)},invertChild:function(a,b){var c=this,d=b.style,e=a.tagName==="IMG"&&a.style;E(a,{flip:"x",left:J(d.width)-(e?J(e.top):1),top:J(d.height)-(e?J(e.left):1),rotation:-90});q(a.childNodes,function(b){c.invertChild(b,a)})},symbols:{arc:function(a,b,c,d,e){var f=e.start,g=e.end,h=e.r||c||
d,c=e.innerR,d=ca(f),i=ha(f),k=ca(g),j=ha(g);if(g-f===0)return["x"];f=["wa",a-h,b-h,a+h,b+h,a+h*d,b+h*i,a+h*k,b+h*j];e.open&&!c&&f.push("e","M",a,b);f.push("at",a-c,b-c,a+c,b+c,a+c*k,b+c*j,a+c*d,b+c*i,"x","e");f.isArc=!0;return f},circle:function(a,b,c,d,e){e&&(c=d=2*e.r);e&&e.isCircle&&(a-=c/2,b-=d/2);return["wa",a,b,a+c,b+d,a+c,b+d/2,a+c,b+d/2,"e"]},rect:function(a,b,c,d,e){return ja.prototype.symbols[!t(e)||!e.r?"square":"callout"].call(0,a,b,c,d,e)}}},P.VMLRenderer=gb=function(){this.init.apply(this,
arguments)},gb.prototype=y(ja.prototype,da),Wa=gb;ja.prototype.measureSpanWidth=function(a,b){var c=B.createElement("span"),d;d=B.createTextNode(a);c.appendChild(d);E(c,b);this.box.appendChild(c);d=c.offsetWidth;Sa(c);return d};var Vb;if(ia)P.CanVGRenderer=da=function(){Ea="http://www.w3.org/1999/xhtml"},da.prototype.symbols={},Vb=function(){function a(){var a=b.length,d;for(d=0;d<a;d++)b[d]();b=[]}var b=[];return{push:function(c,d){b.length===0&&ac(d,a);b.push(c)}}}(),Wa=da;Za.prototype={addLabel:function(){var a=
this.axis,b=a.options,c=a.chart,d=a.horiz,e=a.categories,f=a.names,g=this.pos,h=b.labels,i=a.tickPositions,d=d&&e&&!h.step&&!h.staggerLines&&!h.rotation&&c.plotWidth/i.length||!d&&(c.margin[3]||c.chartWidth*0.33),k=g===i[0],j=g===i[i.length-1],l,f=e?o(e[g],f[g],g):g,e=this.label,m=i.info;a.isDatetimeAxis&&m&&(l=b.dateTimeLabelFormats[m.higherRanks[g]||m.unitName]);this.isFirst=k;this.isLast=j;b=a.labelFormatter.call({axis:a,chart:c,isFirst:k,isLast:j,dateTimeLabelFormat:l,value:a.isLog?ga(na(f)):
f});g=d&&{width:w(1,s(d-2*(h.padding||10)))+"px"};g=v(g,h.style);if(t(e))e&&e.attr({text:b}).css(g);else{l={align:a.labelAlign};if(ka(h.rotation))l.rotation=h.rotation;if(d&&h.ellipsis)l._clipHeight=a.len/i.length;this.label=t(b)&&h.enabled?c.renderer.text(b,0,0,h.useHTML).attr(l).css(g).add(a.labelGroup):null}},getLabelSize:function(){var a=this.label,b=this.axis;return a?a.getBBox()[b.horiz?"height":"width"]:0},getLabelSides:function(){var a=this.label.getBBox(),b=this.axis,c=b.horiz,d=b.options.labels,
a=c?a.width:a.height,b=c?d.x-a*{left:0,center:0.5,right:1}[b.labelAlign]:0;return[b,c?a+b:a]},handleOverflow:function(a,b){var c=!0,d=this.axis,e=this.isFirst,f=this.isLast,g=d.horiz?b.x:b.y,h=d.reversed,i=d.tickPositions,k=this.getLabelSides(),j=k[0],k=k[1],l,m,n,p=this.label.line||0;l=d.labelEdge;m=d.justifyLabels&&(e||f);l[p]===r||g+j>l[p]?l[p]=g+k:m||(c=!1);if(m){l=(m=d.justifyToPlot)?d.pos:0;m=m?l+d.len:d.chart.chartWidth;do a+=e?1:-1,n=d.ticks[i[a]];while(i[a]&&(!n||n.label.line!==p));d=n&&
n.label.xy&&n.label.xy.x+n.getLabelSides()[e?0:1];e&&!h||f&&h?g+j<l&&(g=l-j,n&&g+k>d&&(c=!1)):g+k>m&&(g=m-k,n&&g+j<d&&(c=!1));b.x=g}return c},getPosition:function(a,b,c,d){var e=this.axis,f=e.chart,g=d&&f.oldChartHeight||f.chartHeight;return{x:a?e.translate(b+c,null,null,d)+e.transB:e.left+e.offset+(e.opposite?(d&&f.oldChartWidth||f.chartWidth)-e.right-e.left:0),y:a?g-e.bottom+e.offset-(e.opposite?e.height:0):g-e.translate(b+c,null,null,d)-e.transB}},getLabelPosition:function(a,b,c,d,e,f,g,h){var i=
this.axis,k=i.transA,j=i.reversed,l=i.staggerLines,m=i.chart.renderer.fontMetrics(e.style.fontSize).b,n=e.rotation,a=a+e.x-(f&&d?f*k*(j?-1:1):0),b=b+e.y-(f&&!d?f*k*(j?1:-1):0);n&&i.side===2&&(b-=m-m*ca(n*Ma));!t(e.y)&&!n&&(b+=m-c.getBBox().height/2);if(l)c.line=g/(h||1)%l,b+=c.line*(i.labelOffset/l);return{x:a,y:b}},getMarkPath:function(a,b,c,d,e,f){return f.crispLine(["M",a,b,"L",a+(e?0:-c),b+(e?c:0)],d)},render:function(a,b,c){var d=this.axis,e=d.options,f=d.chart.renderer,g=d.horiz,h=this.type,
i=this.label,k=this.pos,j=e.labels,l=this.gridLine,m=h?h+"Grid":"grid",n=h?h+"Tick":"tick",p=e[m+"LineWidth"],u=e[m+"LineColor"],q=e[m+"LineDashStyle"],G=e[n+"Length"],m=e[n+"Width"]||0,x=e[n+"Color"],t=e[n+"Position"],n=this.mark,s=j.step,w=!0,v=d.tickmarkOffset,y=this.getPosition(g,k,v,b),z=y.x,y=y.y,D=g&&z===d.pos+d.len||!g&&y===d.pos?-1:1;this.isActive=!0;if(p){k=d.getPlotLinePath(k+v,p*D,b,!0);if(l===r){l={stroke:u,"stroke-width":p};if(q)l.dashstyle=q;if(!h)l.zIndex=1;if(b)l.opacity=0;this.gridLine=
l=p?f.path(k).attr(l).add(d.gridGroup):null}if(!b&&l&&k)l[this.isNew?"attr":"animate"]({d:k,opacity:c})}if(m&&G)t==="inside"&&(G=-G),d.opposite&&(G=-G),h=this.getMarkPath(z,y,G,m*D,g,f),n?n.animate({d:h,opacity:c}):this.mark=f.path(h).attr({stroke:x,"stroke-width":m,opacity:c}).add(d.axisGroup);if(i&&!isNaN(z))i.xy=y=this.getLabelPosition(z,y,i,g,j,v,a,s),this.isFirst&&!this.isLast&&!o(e.showFirstLabel,1)||this.isLast&&!this.isFirst&&!o(e.showLastLabel,1)?w=!1:!d.isRadial&&!j.step&&!j.rotation&&!b&&
c!==0&&(w=this.handleOverflow(a,y)),s&&a%s&&(w=!1),w&&!isNaN(y.y)?(y.opacity=c,i[this.isNew?"attr":"animate"](y),this.isNew=!1):i.attr("y",-9999)},destroy:function(){Ka(this,this.axis)}};P.PlotLineOrBand=function(a,b){this.axis=a;if(b)this.options=b,this.id=b.id};P.PlotLineOrBand.prototype={render:function(){var a=this,b=a.axis,c=b.horiz,d=(b.pointRange||0)/2,e=a.options,f=e.label,g=a.label,h=e.width,i=e.to,k=e.from,j=t(k)&&t(i),l=e.value,m=e.dashStyle,n=a.svgElem,p=[],u,q=e.color,G=e.zIndex,x=e.events,
r={},s=b.chart.renderer;b.isLog&&(k=Ga(k),i=Ga(i),l=Ga(l));if(h){if(p=b.getPlotLinePath(l,h),r={stroke:q,"stroke-width":h},m)r.dashstyle=m}else if(j){k=w(k,b.min-d);i=z(i,b.max+d);p=b.getPlotBandPath(k,i,e);if(q)r.fill=q;if(e.borderWidth)r.stroke=e.borderColor,r["stroke-width"]=e.borderWidth}else return;if(t(G))r.zIndex=G;if(n)if(p)n.animate({d:p},null,n.onGetPath);else{if(n.hide(),n.onGetPath=function(){n.show()},g)a.label=g=g.destroy()}else if(p&&p.length&&(a.svgElem=n=s.path(p).attr(r).add(),x))for(u in d=
function(b){n.on(b,function(c){x[b].apply(a,[c])})},x)d(u);if(f&&t(f.text)&&p&&p.length&&b.width>0&&b.height>0){f=y({align:c&&j&&"center",x:c?!j&&4:10,verticalAlign:!c&&j&&"middle",y:c?j?16:10:j?6:-4,rotation:c&&!j&&90},f);if(!g){r={align:f.textAlign||f.align,rotation:f.rotation};if(t(G))r.zIndex=G;a.label=g=s.text(f.text,0,0,f.useHTML).attr(r).css(f.style).add()}b=[p[1],p[4],o(p[6],p[1])];p=[p[2],p[5],o(p[7],p[2])];c=Ra(b);j=Ra(p);g.align(f,!1,{x:c,y:j,width:Ba(b)-c,height:Ba(p)-j});g.show()}else g&&
g.hide();return a},destroy:function(){oa(this.axis.plotLinesAndBands,this);delete this.axis;Ka(this)}};F.prototype={defaultOptions:{dateTimeLabelFormats:{millisecond:"%H:%M:%S.%L",second:"%H:%M:%S",minute:"%H:%M",hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:!1,gridLineColor:"#C0C0C0",labels:Q,lineColor:"#C0D0E0",lineWidth:1,minPadding:0.01,maxPadding:0.01,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",
startOfWeek:1,startOnTick:!1,tickColor:"#C0D0E0",tickLength:10,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",tickWidth:1,title:{align:"middle",style:{color:"#707070"}},type:"linear"},defaultYAxisOptions:{endOnTick:!0,gridLineWidth:1,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8,y:3},lineWidth:0,maxPadding:0.05,minPadding:0.05,startOnTick:!0,tickWidth:0,title:{rotation:270,text:"Values"},stackLabels:{enabled:!1,formatter:function(){return Ia(this.total,-1)},style:Q.style}},
defaultLeftAxisOptions:{labels:{x:-15,y:null},title:{rotation:270}},defaultRightAxisOptions:{labels:{x:15,y:null},title:{rotation:90}},defaultBottomAxisOptions:{labels:{x:0,y:20},title:{rotation:0}},defaultTopAxisOptions:{labels:{x:0,y:-15},title:{rotation:0}},init:function(a,b){var c=b.isX;this.horiz=a.inverted?!c:c;this.coll=(this.isXAxis=c)?"xAxis":"yAxis";this.opposite=b.opposite;this.side=b.side||(this.horiz?this.opposite?0:2:this.opposite?1:3);this.setOptions(b);var d=this.options,e=d.type;
this.labelFormatter=d.labels.formatter||this.defaultLabelFormatter;this.userOptions=b;this.minPixelPadding=0;this.chart=a;this.reversed=d.reversed;this.zoomEnabled=d.zoomEnabled!==!1;this.categories=d.categories||e==="category";this.names=[];this.isLog=e==="logarithmic";this.isDatetimeAxis=e==="datetime";this.isLinked=t(d.linkedTo);this.tickmarkOffset=this.categories&&d.tickmarkPlacement==="between"?0.5:0;this.ticks={};this.labelEdge=[];this.minorTicks={};this.plotLinesAndBands=[];this.alternateBands=
{};this.len=0;this.minRange=this.userMinRange=d.minRange||d.maxZoom;this.range=d.range;this.offset=d.offset||0;this.stacks={};this.oldStacks={};this.min=this.max=null;this.crosshair=o(d.crosshair,la(a.options.tooltip.crosshairs)[c?0:1],!1);var f,d=this.options.events;wa(this,a.axes)===-1&&(c&&!this.isColorAxis?a.axes.splice(a.xAxis.length,0,this):a.axes.push(this),a[this.coll].push(this));this.series=this.series||[];if(a.inverted&&c&&this.reversed===r)this.reversed=!0;this.removePlotLine=this.removePlotBand=
this.removePlotBandOrLine;for(f in d)A(this,f,d[f]);if(this.isLog)this.val2lin=Ga,this.lin2val=na},setOptions:function(a){this.options=y(this.defaultOptions,this.isXAxis?{}:this.defaultYAxisOptions,[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],y(I[this.coll],a))},defaultLabelFormatter:function(){var a=this.axis,b=this.value,c=a.categories,d=this.dateTimeLabelFormat,e=I.lang.numericSymbols,f=e&&e.length,g,h=a.options.labels.format,
a=a.isLog?b:a.tickInterval;if(h)g=Ja(h,this);else if(c)g=b;else if(d)g=ua(d,b);else if(f&&a>=1E3)for(;f--&&g===r;)c=Math.pow(1E3,f+1),a>=c&&e[f]!==null&&(g=Ia(b/c,-1)+e[f]);g===r&&(g=b>=1E4?Ia(b,0):Ia(b,-1,r,""));return g},getSeriesExtremes:function(){var a=this,b=a.chart;a.hasVisibleSeries=!1;a.dataMin=a.dataMax=null;a.buildStacks&&a.buildStacks();q(a.series,function(c){if(c.visible||!b.options.chart.ignoreHiddenSeries){var d;d=c.options.threshold;var e;a.hasVisibleSeries=!0;a.isLog&&d<=0&&(d=null);
if(a.isXAxis){if(d=c.xData,d.length)a.dataMin=z(o(a.dataMin,d[0]),Ra(d)),a.dataMax=w(o(a.dataMax,d[0]),Ba(d))}else{c.getExtremes();e=c.dataMax;c=c.dataMin;if(t(c)&&t(e))a.dataMin=z(o(a.dataMin,c),c),a.dataMax=w(o(a.dataMax,e),e);if(t(d))if(a.dataMin>=d)a.dataMin=d,a.ignoreMinPadding=!0;else if(a.dataMax<d)a.dataMax=d,a.ignoreMaxPadding=!0}}})},translate:function(a,b,c,d,e,f){var g=1,h=0,i=d?this.oldTransA:this.transA,d=d?this.oldMin:this.min,k=this.minPixelPadding,e=(this.options.ordinal||this.isLog&&
e)&&this.lin2val;if(!i)i=this.transA;if(c)g*=-1,h=this.len;this.reversed&&(g*=-1,h-=g*(this.sector||this.len));b?(a=a*g+h,a-=k,a=a/i+d,e&&(a=this.lin2val(a))):(e&&(a=this.val2lin(a)),f==="between"&&(f=0.5),a=g*(a-d)*i+h+g*k+(ka(f)?i*f*this.pointRange:0));return a},toPixels:function(a,b){return this.translate(a,!1,!this.horiz,null,!0)+(b?0:this.pos)},toValue:function(a,b){return this.translate(a-(b?0:this.pos),!0,!this.horiz,null,!0)},getPlotLinePath:function(a,b,c,d,e){var f=this.chart,g=this.left,
h=this.top,i,k,j=c&&f.oldChartHeight||f.chartHeight,l=c&&f.oldChartWidth||f.chartWidth,m;i=this.transB;e=o(e,this.translate(a,null,null,c));a=c=s(e+i);i=k=s(j-e-i);if(isNaN(e))m=!0;else if(this.horiz){if(i=h,k=j-this.bottom,a<g||a>g+this.width)m=!0}else if(a=g,c=l-this.right,i<h||i>h+this.height)m=!0;return m&&!d?null:f.renderer.crispLine(["M",a,i,"L",c,k],b||1)},getLinearTickPositions:function(a,b,c){var d,e=ga(S(b/a)*a),f=ga(Va(c/a)*a),g=[];if(b===c&&ka(b))return[b];for(b=e;b<=f;){g.push(b);b=ga(b+
a);if(b===d)break;d=b}return g},getMinorTickPositions:function(){var a=this.options,b=this.tickPositions,c=this.minorTickInterval,d=[],e;if(this.isLog){e=b.length;for(a=1;a<e;a++)d=d.concat(this.getLogTickPositions(c,b[a-1],b[a],!0))}else if(this.isDatetimeAxis&&a.minorTickInterval==="auto")d=d.concat(this.getTimeTicks(this.normalizeTimeTickInterval(c),this.min,this.max,a.startOfWeek)),d[0]<this.min&&d.shift();else for(b=this.min+(b[0]-this.min)%c;b<=this.max;b+=c)d.push(b);return d},adjustForMinRange:function(){var a=
this.options,b=this.min,c=this.max,d,e=this.dataMax-this.dataMin>=this.minRange,f,g,h,i,k;if(this.isXAxis&&this.minRange===r&&!this.isLog)t(a.min)||t(a.max)?this.minRange=null:(q(this.series,function(a){i=a.xData;for(g=k=a.xIncrement?1:i.length-1;g>0;g--)if(h=i[g]-i[g-1],f===r||h<f)f=h}),this.minRange=z(f*5,this.dataMax-this.dataMin));if(c-b<this.minRange){var j=this.minRange;d=(j-c+b)/2;d=[b-d,o(a.min,b-d)];if(e)d[2]=this.dataMin;b=Ba(d);c=[b+j,o(a.max,b+j)];if(e)c[2]=this.dataMax;c=Ra(c);c-b<j&&
(d[0]=c-j,d[1]=o(a.min,c-j),b=Ba(d))}this.min=b;this.max=c},setAxisTranslation:function(a){var b=this,c=b.max-b.min,d=b.axisPointRange||0,e,f=0,g=0,h=b.linkedParent,i=!!b.categories,k=b.transA;if(b.isXAxis||i||d)h?(f=h.minPointOffset,g=h.pointRangePadding):q(b.series,function(a){var h=i?1:b.isXAxis?a.pointRange:b.axisPointRange||0,k=a.options.pointPlacement,n=a.closestPointRange;h>c&&(h=0);d=w(d,h);f=w(f,Oa(k)?0:h/2);g=w(g,k==="on"?0:h);!a.noSharedTooltip&&t(n)&&(e=t(e)?z(e,n):n)}),h=b.ordinalSlope&&
e?b.ordinalSlope/e:1,b.minPointOffset=f*=h,b.pointRangePadding=g*=h,b.pointRange=z(d,c),b.closestPointRange=e;if(a)b.oldTransA=k;b.translationSlope=b.transA=k=b.len/(c+g||1);b.transB=b.horiz?b.left:b.bottom;b.minPixelPadding=k*f},setTickPositions:function(a){var b=this,c=b.chart,d=b.options,e=b.isLog,f=b.isDatetimeAxis,g=b.isXAxis,h=b.isLinked,i=b.options.tickPositioner,k=d.maxPadding,j=d.minPadding,l=d.tickInterval,m=d.minTickInterval,n=d.tickPixelInterval,p,u=b.categories;h?(b.linkedParent=c[b.coll][d.linkedTo],
c=b.linkedParent.getExtremes(),b.min=o(c.min,c.dataMin),b.max=o(c.max,c.dataMax),d.type!==b.linkedParent.options.type&&pa(11,1)):(b.min=o(b.userMin,d.min,b.dataMin),b.max=o(b.userMax,d.max,b.dataMax));if(e)!a&&z(b.min,o(b.dataMin,b.min))<=0&&pa(10,1),b.min=ga(Ga(b.min)),b.max=ga(Ga(b.max));if(b.range&&t(b.max))b.userMin=b.min=w(b.min,b.max-b.range),b.userMax=b.max,b.range=null;b.beforePadding&&b.beforePadding();b.adjustForMinRange();if(!u&&!b.axisPointRange&&!b.usePercentage&&!h&&t(b.min)&&t(b.max)&&
(c=b.max-b.min)){if(!t(d.min)&&!t(b.userMin)&&j&&(b.dataMin<0||!b.ignoreMinPadding))b.min-=c*j;if(!t(d.max)&&!t(b.userMax)&&k&&(b.dataMax>0||!b.ignoreMaxPadding))b.max+=c*k}if(ka(d.floor))b.min=w(b.min,d.floor);if(ka(d.ceiling))b.max=z(b.max,d.ceiling);b.min===b.max||b.min===void 0||b.max===void 0?b.tickInterval=1:h&&!l&&n===b.linkedParent.options.tickPixelInterval?b.tickInterval=b.linkedParent.tickInterval:(b.tickInterval=o(l,u?1:(b.max-b.min)*n/w(b.len,n)),!t(l)&&b.len<n&&!this.isRadial&&!this.isLog&&
!u&&d.startOnTick&&d.endOnTick&&(p=!0,b.tickInterval/=4));g&&!a&&q(b.series,function(a){a.processData(b.min!==b.oldMin||b.max!==b.oldMax)});b.setAxisTranslation(!0);b.beforeSetTickPositions&&b.beforeSetTickPositions();if(b.postProcessTickInterval)b.tickInterval=b.postProcessTickInterval(b.tickInterval);if(b.pointRange)b.tickInterval=w(b.pointRange,b.tickInterval);if(!l&&b.tickInterval<m)b.tickInterval=m;if(!f&&!e&&!l)b.tickInterval=sb(b.tickInterval,null,rb(b.tickInterval),d);b.minorTickInterval=
d.minorTickInterval==="auto"&&b.tickInterval?b.tickInterval/5:d.minorTickInterval;b.tickPositions=a=d.tickPositions?[].concat(d.tickPositions):i&&i.apply(b,[b.min,b.max]);if(!a)!b.ordinalPositions&&(b.max-b.min)/b.tickInterval>w(2*b.len,200)&&pa(19,!0),a=f?b.getTimeTicks(b.normalizeTimeTickInterval(b.tickInterval,d.units),b.min,b.max,d.startOfWeek,b.ordinalPositions,b.closestPointRange,!0):e?b.getLogTickPositions(b.tickInterval,b.min,b.max):b.getLinearTickPositions(b.tickInterval,b.min,b.max),p&&
a.splice(1,a.length-2),b.tickPositions=a;if(!h)e=a[0],f=a[a.length-1],h=b.minPointOffset||0,d.startOnTick?b.min=e:b.min-h>e&&a.shift(),d.endOnTick?b.max=f:b.max+h<f&&a.pop(),a.length===1&&(d=N(b.max)>1E13?1:0.001,b.min-=d,b.max+=d)},setMaxTicks:function(){var a=this.chart,b=a.maxTicks||{},c=this.tickPositions,d=this._maxTicksKey=[this.coll,this.pos,this.len].join("-");if(!this.isLinked&&!this.isDatetimeAxis&&c&&c.length>(b[d]||0)&&this.options.alignTicks!==!1)b[d]=c.length;a.maxTicks=b},adjustTickAmount:function(){var a=
this._maxTicksKey,b=this.tickPositions,c=this.chart.maxTicks;if(c&&c[a]&&!this.isDatetimeAxis&&!this.categories&&!this.isLinked&&this.options.alignTicks!==!1&&this.min!==r){var d=this.tickAmount,e=b.length;this.tickAmount=a=c[a];if(e<a){for(;b.length<a;)b.push(ga(b[b.length-1]+this.tickInterval));this.transA*=(e-1)/(a-1);this.max=b[b.length-1]}if(t(d)&&a!==d)this.isDirty=!0}},setScale:function(){var a=this.stacks,b,c,d,e;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();
e=this.len!==this.oldAxisLength;q(this.series,function(a){if(a.isDirtyData||a.isDirty||a.xAxis.isDirty)d=!0});if(e||d||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax){if(!this.isXAxis)for(b in a)for(c in a[b])a[b][c].total=null,a[b][c].cum=0;this.forceRedraw=!1;this.getSeriesExtremes();this.setTickPositions();this.oldUserMin=this.userMin;this.oldUserMax=this.userMax;if(!this.isDirty)this.isDirty=e||this.min!==this.oldMin||this.max!==this.oldMax}else if(!this.isXAxis){if(this.oldStacks)a=
this.stacks=this.oldStacks;for(b in a)for(c in a[b])a[b][c].cum=a[b][c].total}this.setMaxTicks()},setExtremes:function(a,b,c,d,e){var f=this,g=f.chart,c=o(c,!0),e=v(e,{min:a,max:b});K(f,"setExtremes",e,function(){f.userMin=a;f.userMax=b;f.eventArgs=e;f.isDirtyExtremes=!0;c&&g.redraw(d)})},zoom:function(a,b){var c=this.dataMin,d=this.dataMax,e=this.options;this.allowZoomOutside||(t(c)&&a<=z(c,o(e.min,c))&&(a=r),t(d)&&b>=w(d,o(e.max,d))&&(b=r));this.displayBtn=a!==r||b!==r;this.setExtremes(a,b,!1,r,
{trigger:"zoom"});return!0},setAxisSize:function(){var a=this.chart,b=this.options,c=b.offsetLeft||0,d=this.horiz,e=o(b.width,a.plotWidth-c+(b.offsetRight||0)),f=o(b.height,a.plotHeight),g=o(b.top,a.plotTop),b=o(b.left,a.plotLeft+c),c=/%$/;c.test(f)&&(f=parseInt(f,10)/100*a.plotHeight);c.test(g)&&(g=parseInt(g,10)/100*a.plotHeight+a.plotTop);this.left=b;this.top=g;this.width=e;this.height=f;this.bottom=a.chartHeight-f-g;this.right=a.chartWidth-e-b;this.len=w(d?e:f,0);this.pos=d?b:g},getExtremes:function(){var a=
this.isLog;return{min:a?ga(na(this.min)):this.min,max:a?ga(na(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var b=this.isLog,c=b?na(this.min):this.min,b=b?na(this.max):this.max;c>a||a===null?a=c:b<a&&(a=b);return this.translate(a,0,1,0,1)},autoLabelAlign:function(a){a=(o(a,0)-this.side*90+720)%360;return a>15&&a<165?"right":a>195&&a<345?"left":"center"},getOffset:function(){var a=this,b=a.chart,c=b.renderer,d=a.options,
e=a.tickPositions,f=a.ticks,g=a.horiz,h=a.side,i=b.inverted?[1,0,3,2][h]:h,k,j=0,l,m=0,n=d.title,p=d.labels,u=0,Db=b.axisOffset,G=b.clipOffset,x=[-1,1,1,-1][h],s,v=1,y=o(p.maxStaggerLines,5),z,A,B,D,ra=h===2?c.fontMetrics(p.style.fontSize).b:0;a.hasData=k=a.hasVisibleSeries||t(a.min)&&t(a.max)&&!!e;a.showAxis=b=k||o(d.showEmpty,!0);a.staggerLines=a.horiz&&p.staggerLines;if(!a.axisGroup)a.gridGroup=c.g("grid").attr({zIndex:d.gridZIndex||1}).add(),a.axisGroup=c.g("axis").attr({zIndex:d.zIndex||2}).add(),
a.labelGroup=c.g("axis-labels").attr({zIndex:p.zIndex||7}).addClass("highcharts-"+a.coll.toLowerCase()+"-labels").add();if(k||a.isLinked){a.labelAlign=o(p.align||a.autoLabelAlign(p.rotation));q(e,function(b){f[b]?f[b].addLabel():f[b]=new Za(a,b)});if(a.horiz&&!a.staggerLines&&y&&!p.rotation){for(s=a.reversed?[].concat(e).reverse():e;v<y;){k=[];z=!1;for(p=0;p<s.length;p++)A=s[p],B=(B=f[A].label&&f[A].label.getBBox())?B.width:0,D=p%v,B&&(A=a.translate(A),k[D]!==r&&A<k[D]&&(z=!0),k[D]=A+B);if(z)v++;
else break}if(v>1)a.staggerLines=v}q(e,function(b){if(h===0||h===2||{1:"left",3:"right"}[h]===a.labelAlign)u=w(f[b].getLabelSize(),u)});if(a.staggerLines)u*=a.staggerLines,a.labelOffset=u}else for(s in f)f[s].destroy(),delete f[s];if(n&&n.text&&n.enabled!==!1){if(!a.axisTitle)a.axisTitle=c.text(n.text,0,0,n.useHTML).attr({zIndex:7,rotation:n.rotation||0,align:n.textAlign||{low:"left",middle:"center",high:"right"}[n.align]}).addClass("highcharts-"+this.coll.toLowerCase()+"-title").css(n.style).add(a.axisGroup),
a.axisTitle.isNew=!0;if(b)j=a.axisTitle.getBBox()[g?"height":"width"],m=o(n.margin,g?5:10),l=n.offset;a.axisTitle[b?"show":"hide"]()}a.offset=x*o(d.offset,Db[h]);a.axisTitleMargin=o(l,u+m+(u&&x*d.labels[g?"y":"x"]-ra));Db[h]=w(Db[h],a.axisTitleMargin+j+x*a.offset);G[i]=w(G[i],S(d.lineWidth/2)*2)},getLinePath:function(a){var b=this.chart,c=this.opposite,d=this.offset,e=this.horiz,f=this.left+(c?this.width:0)+d,d=b.chartHeight-this.bottom-(c?this.height:0)+d;c&&(a*=-1);return b.renderer.crispLine(["M",
e?this.left:f,e?d:this.top,"L",e?b.chartWidth-this.right:f,e?d:b.chartHeight-this.bottom],a)},getTitlePosition:function(){var a=this.horiz,b=this.left,c=this.top,d=this.len,e=this.options.title,f=a?b:c,g=this.opposite,h=this.offset,i=J(e.style.fontSize||12),d={low:f+(a?0:d),middle:f+d/2,high:f+(a?d:0)}[e.align],b=(a?c+this.height:b)+(a?1:-1)*(g?-1:1)*this.axisTitleMargin+(this.side===2?i:0);return{x:a?d:b+(g?this.width:0)+h+(e.x||0),y:a?b-(g?this.height:0)+h:d+(e.y||0)}},render:function(){var a=this,
b=a.horiz,c=a.reversed,d=a.chart,e=d.renderer,f=a.options,g=a.isLog,h=a.isLinked,i=a.tickPositions,k,j=a.axisTitle,l=a.ticks,m=a.minorTicks,n=a.alternateBands,p=f.stackLabels,u=f.alternateGridColor,o=a.tickmarkOffset,G=f.lineWidth,x=d.hasRendered&&t(a.oldMin)&&!isNaN(a.oldMin),s=a.hasData,w=a.showAxis,v,y=f.labels.overflow,z=a.justifyLabels=b&&y!==!1,A;a.labelEdge.length=0;a.justifyToPlot=y==="justify";q([l,m,n],function(a){for(var b in a)a[b].isActive=!1});if(s||h)if(a.minorTickInterval&&!a.categories&&
q(a.getMinorTickPositions(),function(b){m[b]||(m[b]=new Za(a,b,"minor"));x&&m[b].isNew&&m[b].render(null,!0);m[b].render(null,!1,1)}),i.length&&(k=i.slice(),(b&&c||!b&&!c)&&k.reverse(),z&&(k=k.slice(1).concat([k[0]])),q(k,function(b,c){z&&(c=c===k.length-1?0:c+1);if(!h||b>=a.min&&b<=a.max)l[b]||(l[b]=new Za(a,b)),x&&l[b].isNew&&l[b].render(c,!0,0.1),l[b].render(c,!1,1)}),o&&a.min===0&&(l[-1]||(l[-1]=new Za(a,-1,null,!0)),l[-1].render(-1))),u&&q(i,function(b,c){if(c%2===0&&b<a.max)n[b]||(n[b]=new P.PlotLineOrBand(a)),
v=b+o,A=i[c+1]!==r?i[c+1]+o:a.max,n[b].options={from:g?na(v):v,to:g?na(A):A,color:u},n[b].render(),n[b].isActive=!0}),!a._addedPlotLB)q((f.plotLines||[]).concat(f.plotBands||[]),function(b){a.addPlotBandOrLine(b)}),a._addedPlotLB=!0;q([l,m,n],function(a){var b,c,e=[],f=Ca?Ca.duration||500:0,g=function(){for(c=e.length;c--;)a[e[c]]&&!a[e[c]].isActive&&(a[e[c]].destroy(),delete a[e[c]])};for(b in a)if(!a[b].isActive)a[b].render(b,!1,0),a[b].isActive=!1,e.push(b);a===n||!d.hasRendered||!f?g():f&&setTimeout(g,
f)});if(G)b=a.getLinePath(G),a.axisLine?a.axisLine.animate({d:b}):a.axisLine=e.path(b).attr({stroke:f.lineColor,"stroke-width":G,zIndex:7}).add(a.axisGroup),a.axisLine[w?"show":"hide"]();if(j&&w)j[j.isNew?"attr":"animate"](a.getTitlePosition()),j.isNew=!1;p&&p.enabled&&a.renderStackTotals();a.isDirty=!1},redraw:function(){var a=this.chart.pointer;a&&a.reset(!0);this.render();q(this.plotLinesAndBands,function(a){a.render()});q(this.series,function(a){a.isDirty=!0})},destroy:function(a){var b=this,
c=b.stacks,d,e=b.plotLinesAndBands;a||R(b);for(d in c)Ka(c[d]),c[d]=null;q([b.ticks,b.minorTicks,b.alternateBands],function(a){Ka(a)});for(a=e.length;a--;)e[a].destroy();q("stackTotalGroup,axisLine,axisTitle,axisGroup,cross,gridGroup,labelGroup".split(","),function(a){b[a]&&(b[a]=b[a].destroy())});this.cross&&this.cross.destroy()},drawCrosshair:function(a,b){if(this.crosshair)if((t(b)||!o(this.crosshair.snap,!0))===!1)this.hideCrosshair();else{var c,d=this.crosshair,e=d.animation;o(d.snap,!0)?t(b)&&
(c=this.chart.inverted!=this.horiz?b.plotX:this.len-b.plotY):c=this.horiz?a.chartX-this.pos:this.len-a.chartY+this.pos;c=this.isRadial?this.getPlotLinePath(this.isXAxis?b.x:o(b.stackY,b.y)):this.getPlotLinePath(null,null,null,null,c);if(c===null)this.hideCrosshair();else if(this.cross)this.cross.attr({visibility:"visible"})[e?"animate":"attr"]({d:c},e);else{e={"stroke-width":d.width||1,stroke:d.color||"#C0C0C0",zIndex:d.zIndex||2};if(d.dashStyle)e.dashstyle=d.dashStyle;this.cross=this.chart.renderer.path(c).attr(e).add()}}},
hideCrosshair:function(){this.cross&&this.cross.hide()}};v(F.prototype,{getPlotBandPath:function(a,b){var c=this.getPlotLinePath(b),d=this.getPlotLinePath(a);d&&c?d.push(c[4],c[5],c[1],c[2]):d=null;return d},addPlotBand:function(a){this.addPlotBandOrLine(a,"plotBands")},addPlotLine:function(a){this.addPlotBandOrLine(a,"plotLines")},addPlotBandOrLine:function(a,b){var c=(new P.PlotLineOrBand(this,a)).render(),d=this.userOptions;c&&(b&&(d[b]=d[b]||[],d[b].push(a)),this.plotLinesAndBands.push(c));return c},
removePlotBandOrLine:function(a){for(var b=this.plotLinesAndBands,c=this.options,d=this.userOptions,e=b.length;e--;)b[e].id===a&&b[e].destroy();q([c.plotLines||[],d.plotLines||[],c.plotBands||[],d.plotBands||[]],function(b){for(e=b.length;e--;)b[e].id===a&&oa(b,b[e])})}});F.prototype.getTimeTicks=function(a,b,c,d){var e=[],f={},g=I.global.useUTC,h,i=new Date(b-La),k=a.unitRange,j=a.count;if(t(b)){k>=H.second&&(i.setMilliseconds(0),i.setSeconds(k>=H.minute?0:j*S(i.getSeconds()/j)));if(k>=H.minute)i[Nb](k>=
H.hour?0:j*S(i[ub]()/j));if(k>=H.hour)i[Ob](k>=H.day?0:j*S(i[vb]()/j));if(k>=H.day)i[xb](k>=H.month?1:j*S(i[Ua]()/j));k>=H.month&&(i[Pb](k>=H.year?0:j*S(i[jb]()/j)),h=i[kb]());k>=H.year&&(h-=h%j,i[Qb](h));if(k===H.week)i[xb](i[Ua]()-i[wb]()+o(d,1));b=1;La&&(i=new Date(i.getTime()+La));h=i[kb]();for(var d=i.getTime(),l=i[jb](),m=i[Ua](),n=g?La:(864E5+i.getTimezoneOffset()*6E4)%864E5;d<c;)e.push(d),k===H.year?d=ib(h+b*j,0):k===H.month?d=ib(h,l+b*j):!g&&(k===H.day||k===H.week)?d=ib(h,l,m+b*j*(k===H.day?
1:7)):d+=k*j,b++;e.push(d);q(Cb(e,function(a){return k<=H.hour&&a%H.day===n}),function(a){f[a]="day"})}e.info=v(a,{higherRanks:f,totalRange:k*j});return e};F.prototype.normalizeTimeTickInterval=function(a,b){var c=b||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]],d=c[c.length-1],e=H[d[0]],f=d[1],g;for(g=0;g<c.length;g++)if(d=c[g],e=H[d[0]],f=d[1],c[g+
1]&&a<=(e*f[f.length-1]+H[c[g+1][0]])/2)break;e===H.year&&a<5*e&&(f=[1,2,5]);c=sb(a/e,f,d[0]==="year"?w(rb(a/e),1):1);return{unitRange:e,count:c,unitName:d[0]}};F.prototype.getLogTickPositions=function(a,b,c,d){var e=this.options,f=this.len,g=[];if(!d)this._minorAutoInterval=null;if(a>=0.5)a=s(a),g=this.getLinearTickPositions(a,b,c);else if(a>=0.08)for(var f=S(b),h,i,k,j,l,e=a>0.3?[1,2,4]:a>0.15?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];f<c+1&&!l;f++){i=e.length;for(h=0;h<i&&!l;h++)k=Ga(na(f)*e[h]),k>b&&(!d||
j<=c)&&g.push(j),j>c&&(l=!0),j=k}else if(b=na(b),c=na(c),a=e[d?"minorTickInterval":"tickInterval"],a=o(a==="auto"?null:a,this._minorAutoInterval,(c-b)*(e.tickPixelInterval/(d?5:1))/((d?f/this.tickPositions.length:f)||1)),a=sb(a,null,rb(a)),g=xa(this.getLinearTickPositions(a,b,c),Ga),!d)this._minorAutoInterval=a/5;if(!d)this.tickInterval=a;return g};var Hb=P.Tooltip=function(){this.init.apply(this,arguments)};Hb.prototype={init:function(a,b){var c=b.borderWidth,d=b.style,e=J(d.padding);this.chart=
a;this.options=b;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.label=a.renderer.label("",0,0,b.shape||"callout",null,null,b.useHTML,null,"tooltip").attr({padding:e,fill:b.backgroundColor,"stroke-width":c,r:b.borderRadius,zIndex:8}).css(d).css({padding:0}).add().attr({y:-9999});ia||this.label.shadow(b.shadow);this.shared=b.shared},destroy:function(){if(this.label)this.label=this.label.destroy();clearTimeout(this.hideTimer);clearTimeout(this.tooltipTimeout)},move:function(a,b,c,d){var e=
this,f=e.now,g=e.options.animation!==!1&&!e.isHidden,h=e.followPointer||e.len>1;v(f,{x:g?(2*f.x+a)/3:a,y:g?(f.y+b)/2:b,anchorX:h?r:g?(2*f.anchorX+c)/3:c,anchorY:h?r:g?(f.anchorY+d)/2:d});e.label.attr(f);if(g&&(N(a-f.x)>1||N(b-f.y)>1))clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){e&&e.move(a,b,c,d)},32)},hide:function(){var a=this,b;clearTimeout(this.hideTimer);if(!this.isHidden)b=this.chart.hoverPoints,this.hideTimer=setTimeout(function(){a.label.fadeOut();a.isHidden=
!0},o(this.options.hideDelay,500)),b&&q(b,function(a){a.setState()}),this.chart.hoverPoints=null},getAnchor:function(a,b){var c,d=this.chart,e=d.inverted,f=d.plotTop,g=0,h=0,i,a=la(a);c=a[0].tooltipPos;this.followPointer&&b&&(b.chartX===r&&(b=d.pointer.normalize(b)),c=[b.chartX-d.plotLeft,b.chartY-f]);c||(q(a,function(a){i=a.series.yAxis;g+=a.plotX;h+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+(!e&&i?i.top-f:0)}),g/=a.length,h/=a.length,c=[e?d.plotWidth-h:g,this.shared&&!e&&a.length>1&&b?b.chartY-
f:e?d.plotHeight-g:h]);return xa(c,s)},getPosition:function(a,b,c){var d=this.chart,e=this.distance,f={},g,h=["y",d.chartHeight,b,c.plotY+d.plotTop],i=["x",d.chartWidth,a,c.plotX+d.plotLeft],k=c.ttBelow||d.inverted&&!c.negative||!d.inverted&&c.negative,j=function(a,b,c,d){var g=c<d-e,b=d+e+c<b,c=d-e-c;d+=e;if(k&&b)f[a]=d;else if(!k&&g)f[a]=c;else if(g)f[a]=c;else if(b)f[a]=d;else return!1},l=function(a,b,c,d){if(d<e||d>b-e)return!1;else f[a]=d<c/2?1:d>b-c/2?b-c-2:d-c/2},m=function(a){var b=h;h=i;
i=b;g=a},n=function(){j.apply(0,h)!==!1?l.apply(0,i)===!1&&!g&&(m(!0),n()):g?f.x=f.y=0:(m(!0),n())};(d.inverted||this.len>1)&&m();n();return f},defaultFormatter:function(a){var b=this.points||la(this),c=b[0].series,d;d=[a.tooltipHeaderFormatter(b[0])];q(b,function(a){c=a.series;d.push(c.tooltipFormatter&&c.tooltipFormatter(a)||a.point.tooltipFormatter(c.tooltipOptions.pointFormat))});d.push(a.options.footerFormat||"");return d.join("")},refresh:function(a,b){var c=this.chart,d=this.label,e=this.options,
f,g,h={},i,k=[];i=e.formatter||this.defaultFormatter;var h=c.hoverPoints,j,l=this.shared;clearTimeout(this.hideTimer);this.followPointer=la(a)[0].series.tooltipOptions.followPointer;g=this.getAnchor(a,b);f=g[0];g=g[1];l&&(!a.series||!a.series.noSharedTooltip)?(c.hoverPoints=a,h&&q(h,function(a){a.setState()}),q(a,function(a){a.setState("hover");k.push(a.getLabelConfig())}),h={x:a[0].category,y:a[0].y},h.points=k,this.len=k.length,a=a[0]):h=a.getLabelConfig();i=i.call(h,this);h=a.series;this.distance=
o(h.tooltipOptions.distance,16);i===!1?this.hide():(this.isHidden&&(fb(d),d.attr("opacity",1).show()),d.attr({text:i}),j=e.borderColor||a.color||h.color||"#606060",d.attr({stroke:j}),this.updatePosition({plotX:f,plotY:g,negative:a.negative,ttBelow:a.ttBelow}),this.isHidden=!1);K(c,"tooltipRefresh",{text:i,x:f+c.plotLeft,y:g+c.plotTop,borderColor:j})},updatePosition:function(a){var b=this.chart,c=this.label,c=(this.options.positioner||this.getPosition).call(this,c.width,c.height,a);this.move(s(c.x),
s(c.y),a.plotX+b.plotLeft,a.plotY+b.plotTop)},tooltipHeaderFormatter:function(a){var b=a.series,c=b.tooltipOptions,d=c.dateTimeLabelFormats,e=c.xDateFormat,f=b.xAxis,g=f&&f.options.type==="datetime"&&ka(a.key),c=c.headerFormat,f=f&&f.closestPointRange,h;if(g&&!e){if(f)for(h in H){if(H[h]>=f||H[h]<=H.day&&a.key%H[h]>0){e=d[h];break}}else e=d.day;e=e||d.year}g&&e&&(c=c.replace("{point.key}","{point.key:"+e+"}"));return Ja(c,{point:a,series:b})}};var sa;ab=B.documentElement.ontouchstart!==r;var Xa=P.Pointer=
function(a,b){this.init(a,b)};Xa.prototype={init:function(a,b){var c=b.chart,d=c.events,e=ia?"":c.zoomType,c=a.inverted,f;this.options=b;this.chart=a;this.zoomX=f=/x/.test(e);this.zoomY=e=/y/.test(e);this.zoomHor=f&&!c||e&&c;this.zoomVert=e&&!c||f&&c;this.hasZoom=f||e;this.runChartClick=d&&!!d.click;this.pinchDown=[];this.lastValidTouch={};if(P.Tooltip&&b.tooltip.enabled)a.tooltip=new Hb(a,b.tooltip),this.followTouchMove=b.tooltip.followTouchMove;this.setDOMEvents()},normalize:function(a,b){var c,
d,a=a||window.event,a=cc(a);if(!a.target)a.target=a.srcElement;d=a.touches?a.touches.length?a.touches.item(0):a.changedTouches[0]:a;if(!b)this.chartPosition=b=bc(this.chart.container);d.pageX===r?(c=w(a.x,a.clientX-b.left),d=a.y):(c=d.pageX-b.left,d=d.pageY-b.top);return v(a,{chartX:s(c),chartY:s(d)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};q(this.chart.axes,function(c){b[c.isXAxis?"xAxis":"yAxis"].push({axis:c,value:c.toValue(a[c.horiz?"chartX":"chartY"])})});return b},getIndex:function(a){var b=
this.chart;return b.inverted?b.plotHeight+b.plotTop-a.chartY:a.chartX-b.plotLeft},runPointActions:function(a){var b=this.chart,c=b.series,d=b.tooltip,e,f,g=b.hoverPoint,h=b.hoverSeries,i,k,j=b.chartWidth,l=this.getIndex(a);if(d&&this.options.tooltip.shared&&(!h||!h.noSharedTooltip)){f=[];i=c.length;for(k=0;k<i;k++)if(c[k].visible&&c[k].options.enableMouseTracking!==!1&&!c[k].noSharedTooltip&&c[k].singularTooltips!==!0&&c[k].tooltipPoints.length&&(e=c[k].tooltipPoints[l])&&e.series)e._dist=N(l-e.clientX),
j=z(j,e._dist),f.push(e);for(i=f.length;i--;)f[i]._dist>j&&f.splice(i,1);if(f.length&&f[0].clientX!==this.hoverX)d.refresh(f,a),this.hoverX=f[0].clientX}c=h&&h.tooltipOptions.followPointer;if(h&&h.tracker&&!c){if((e=h.tooltipPoints[l])&&e!==g)e.onMouseOver(a)}else d&&c&&!d.isHidden&&(h=d.getAnchor([{}],a),d.updatePosition({plotX:h[0],plotY:h[1]}));if(d&&!this._onDocumentMouseMove)this._onDocumentMouseMove=function(a){if($[sa])$[sa].pointer.onDocumentMouseMove(a)},A(B,"mousemove",this._onDocumentMouseMove);
q(b.axes,function(b){b.drawCrosshair(a,o(e,g))})},reset:function(a){var b=this.chart,c=b.hoverSeries,d=b.hoverPoint,e=b.tooltip,f=e&&e.shared?b.hoverPoints:d;(a=a&&e&&f)&&la(f)[0].plotX===r&&(a=!1);if(a)e.refresh(f),d&&d.setState(d.state,!0);else{if(d)d.onMouseOut();if(c)c.onMouseOut();e&&e.hide();if(this._onDocumentMouseMove)R(B,"mousemove",this._onDocumentMouseMove),this._onDocumentMouseMove=null;q(b.axes,function(a){a.hideCrosshair()});this.hoverX=null}},scaleGroups:function(a,b){var c=this.chart,
d;q(c.series,function(e){d=a||e.getPlotBox();e.xAxis&&e.xAxis.zoomEnabled&&(e.group.attr(d),e.markerGroup&&(e.markerGroup.attr(d),e.markerGroup.clip(b?c.clipRect:null)),e.dataLabelsGroup&&e.dataLabelsGroup.attr(d))});c.clipRect.attr(b||c.clipBox)},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=!1;b.mouseDownX=this.mouseDownX=a.chartX;b.mouseDownY=this.mouseDownY=a.chartY},drag:function(a){var b=this.chart,c=b.options.chart,d=a.chartX,e=a.chartY,f=this.zoomHor,g=this.zoomVert,
h=b.plotLeft,i=b.plotTop,k=b.plotWidth,j=b.plotHeight,l,m=this.mouseDownX,n=this.mouseDownY;d<h?d=h:d>h+k&&(d=h+k);e<i?e=i:e>i+j&&(e=i+j);this.hasDragged=Math.sqrt(Math.pow(m-d,2)+Math.pow(n-e,2));if(this.hasDragged>10){l=b.isInsidePlot(m-h,n-i);if(b.hasCartesianSeries&&(this.zoomX||this.zoomY)&&l&&!this.selectionMarker)this.selectionMarker=b.renderer.rect(h,i,f?1:k,g?1:j,0).attr({fill:c.selectionMarkerFill||"rgba(69,114,167,0.25)",zIndex:7}).add();this.selectionMarker&&f&&(d-=m,this.selectionMarker.attr({width:N(d),
x:(d>0?0:d)+m}));this.selectionMarker&&g&&(d=e-n,this.selectionMarker.attr({height:N(d),y:(d>0?0:d)+n}));l&&!this.selectionMarker&&c.panning&&b.pan(a,c.panning)}},drop:function(a){var b=this.chart,c=this.hasPinched;if(this.selectionMarker){var d={xAxis:[],yAxis:[],originalEvent:a.originalEvent||a},a=this.selectionMarker,e=a.attr?a.attr("x"):a.x,f=a.attr?a.attr("y"):a.y,g=a.attr?a.attr("width"):a.width,h=a.attr?a.attr("height"):a.height,i;if(this.hasDragged||c)q(b.axes,function(a){if(a.zoomEnabled){var b=
a.horiz,c=a.toValue(b?e:f),b=a.toValue(b?e+g:f+h);!isNaN(c)&&!isNaN(b)&&(d[a.coll].push({axis:a,min:z(c,b),max:w(c,b)}),i=!0)}}),i&&K(b,"selection",d,function(a){b.zoom(v(a,c?{animation:!1}:null))});this.selectionMarker=this.selectionMarker.destroy();c&&this.scaleGroups()}if(b)E(b.container,{cursor:b._cursor}),b.cancelClick=this.hasDragged>10,b.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[]},onContainerMouseDown:function(a){a=this.normalize(a);a.preventDefault&&a.preventDefault();
this.dragStart(a)},onDocumentMouseUp:function(a){$[sa]&&$[sa].pointer.drop(a)},onDocumentMouseMove:function(a){var b=this.chart,c=this.chartPosition,d=b.hoverSeries,a=this.normalize(a,c);c&&d&&!this.inClass(a.target,"highcharts-tracker")&&!b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)&&this.reset()},onContainerMouseLeave:function(){var a=$[sa];if(a)a.pointer.reset(),a.pointer.chartPosition=null},onContainerMouseMove:function(a){var b=this.chart;sa=b.index;a=this.normalize(a);b.mouseIsDown===
"mousedown"&&this.drag(a);(this.inClass(a.target,"highcharts-tracker")||b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop))&&!b.openMenu&&this.runPointActions(a)},inClass:function(a,b){for(var c;a;){if(c=V(a,"class"))if(c.indexOf(b)!==-1)return!0;else if(c.indexOf("highcharts-container")!==-1)return!1;a=a.parentNode}},onTrackerMouseOut:function(a){var b=this.chart.hoverSeries,c=(a=a.relatedTarget||a.toElement)&&a.point&&a.point.series;if(b&&!b.options.stickyTracking&&!this.inClass(a,"highcharts-tooltip")&&
c!==b)b.onMouseOut()},onContainerClick:function(a){var b=this.chart,c=b.hoverPoint,d=b.plotLeft,e=b.plotTop,f=b.inverted,g,h,i,a=this.normalize(a);a.cancelBubble=!0;if(!b.cancelClick)c&&this.inClass(a.target,"highcharts-tracker")?(g=this.chartPosition,h=c.plotX,i=c.plotY,v(c,{pageX:g.left+d+(f?b.plotWidth-i:h),pageY:g.top+e+(f?b.plotHeight-h:i)}),K(c.series,"click",v(a,{point:c})),b.hoverPoint&&c.firePointEvent("click",a)):(v(a,this.getCoordinates(a)),b.isInsidePlot(a.chartX-d,a.chartY-e)&&K(b,"click",
a))},setDOMEvents:function(){var a=this,b=a.chart.container;b.onmousedown=function(b){a.onContainerMouseDown(b)};b.onmousemove=function(b){a.onContainerMouseMove(b)};b.onclick=function(b){a.onContainerClick(b)};A(b,"mouseleave",a.onContainerMouseLeave);eb===1&&A(B,"mouseup",a.onDocumentMouseUp);if(ab)b.ontouchstart=function(b){a.onContainerTouchStart(b)},b.ontouchmove=function(b){a.onContainerTouchMove(b)},eb===1&&A(B,"touchend",a.onDocumentTouchEnd)},destroy:function(){var a;R(this.chart.container,
"mouseleave",this.onContainerMouseLeave);eb||(R(B,"mouseup",this.onDocumentMouseUp),R(B,"touchend",this.onDocumentTouchEnd));clearInterval(this.tooltipTimeout);for(a in this)this[a]=null}};v(P.Pointer.prototype,{pinchTranslate:function(a,b,c,d,e,f){(this.zoomHor||this.pinchHor)&&this.pinchTranslateDirection(!0,a,b,c,d,e,f);(this.zoomVert||this.pinchVert)&&this.pinchTranslateDirection(!1,a,b,c,d,e,f)},pinchTranslateDirection:function(a,b,c,d,e,f,g,h){var i=this.chart,k=a?"x":"y",j=a?"X":"Y",l="chart"+
j,m=a?"width":"height",n=i["plot"+(a?"Left":"Top")],p,u,o=h||1,q=i.inverted,x=i.bounds[a?"h":"v"],r=b.length===1,s=b[0][l],t=c[0][l],w=!r&&b[1][l],v=!r&&c[1][l],y,c=function(){!r&&N(s-w)>20&&(o=h||N(t-v)/N(s-w));u=(n-t)/o+s;p=i["plot"+(a?"Width":"Height")]/o};c();b=u;b<x.min?(b=x.min,y=!0):b+p>x.max&&(b=x.max-p,y=!0);y?(t-=0.8*(t-g[k][0]),r||(v-=0.8*(v-g[k][1])),c()):g[k]=[t,v];q||(f[k]=u-n,f[m]=p);f=q?1/o:o;e[m]=p;e[k]=b;d[q?a?"scaleY":"scaleX":"scale"+j]=o;d["translate"+j]=f*n+(t-f*s)},pinch:function(a){var b=
this,c=b.chart,d=b.pinchDown,e=b.followTouchMove,f=a.touches,g=f.length,h=b.lastValidTouch,i=b.hasZoom,k=b.selectionMarker,j={},l=g===1&&(b.inClass(a.target,"highcharts-tracker")&&c.runTrackerClick||c.runChartClick),m={};(i||e)&&!l&&a.preventDefault();xa(f,function(a){return b.normalize(a)});if(a.type==="touchstart")q(f,function(a,b){d[b]={chartX:a.chartX,chartY:a.chartY}}),h.x=[d[0].chartX,d[1]&&d[1].chartX],h.y=[d[0].chartY,d[1]&&d[1].chartY],q(c.axes,function(a){if(a.zoomEnabled){var b=c.bounds[a.horiz?
"h":"v"],d=a.minPixelPadding,e=a.toPixels(a.dataMin),f=a.toPixels(a.dataMax),g=z(e,f),e=w(e,f);b.min=z(a.pos,g-d);b.max=w(a.pos+a.len,e+d)}});else if(d.length){if(!k)b.selectionMarker=k=v({destroy:ma},c.plotBox);b.pinchTranslate(d,f,j,k,m,h);b.hasPinched=i;b.scaleGroups(j,m);!i&&e&&g===1&&this.runPointActions(b.normalize(a))}},onContainerTouchStart:function(a){var b=this.chart;sa=b.index;a.touches.length===1?(a=this.normalize(a),b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)?(this.runPointActions(a),
this.pinch(a)):this.reset()):a.touches.length===2&&this.pinch(a)},onContainerTouchMove:function(a){(a.touches.length===1||a.touches.length===2)&&this.pinch(a)},onDocumentTouchEnd:function(a){$[sa]&&$[sa].pointer.drop(a)}});if(W.PointerEvent||W.MSPointerEvent){var ya={},Ib=!!W.PointerEvent,gc=function(){var a,b=[];b.item=function(a){return this[a]};for(a in ya)ya.hasOwnProperty(a)&&b.push({pageX:ya[a].pageX,pageY:ya[a].pageY,target:ya[a].target});return b},Jb=function(a,b,c,d){a=a.originalEvent||a;
if((a.pointerType==="touch"||a.pointerType===a.MSPOINTER_TYPE_TOUCH)&&$[sa])d(a),d=$[sa].pointer,d[b]({type:c,target:a.currentTarget,preventDefault:ma,touches:gc()})};v(Xa.prototype,{onContainerPointerDown:function(a){Jb(a,"onContainerTouchStart","touchstart",function(a){ya[a.pointerId]={pageX:a.pageX,pageY:a.pageY,target:a.currentTarget}})},onContainerPointerMove:function(a){Jb(a,"onContainerTouchMove","touchmove",function(a){ya[a.pointerId]={pageX:a.pageX,pageY:a.pageY};if(!ya[a.pointerId].target)ya[a.pointerId].target=
a.currentTarget})},onDocumentPointerUp:function(a){Jb(a,"onContainerTouchEnd","touchend",function(a){delete ya[a.pointerId]})},batchMSEvents:function(a){a(this.chart.container,Ib?"pointerdown":"MSPointerDown",this.onContainerPointerDown);a(this.chart.container,Ib?"pointermove":"MSPointerMove",this.onContainerPointerMove);a(B,Ib?"pointerup":"MSPointerUp",this.onDocumentPointerUp)}});O(Xa.prototype,"init",function(a,b,c){a.call(this,b,c);(this.hasZoom||this.followTouchMove)&&E(b.container,{"-ms-touch-action":X,
"touch-action":X})});O(Xa.prototype,"setDOMEvents",function(a){a.apply(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(A)});O(Xa.prototype,"destroy",function(a){this.batchMSEvents(R);a.call(this)})}var pb=P.Legend=function(a,b){this.init(a,b)};pb.prototype={init:function(a,b){var c=this,d=b.itemStyle,e=o(b.padding,8),f=b.itemMarginTop||0;this.options=b;if(b.enabled)c.baseline=J(d.fontSize)+3+f,c.itemStyle=d,c.itemHiddenStyle=y(d,b.itemHiddenStyle),c.itemMarginTop=f,c.padding=e,c.initialItemX=
e,c.initialItemY=e-5,c.maxItemWidth=0,c.chart=a,c.itemHeight=0,c.lastLineHeight=0,c.symbolWidth=o(b.symbolWidth,16),c.pages=[],c.render(),A(c.chart,"endResize",function(){c.positionCheckboxes()})},colorizeItem:function(a,b){var c=this.options,d=a.legendItem,e=a.legendLine,f=a.legendSymbol,g=this.itemHiddenStyle.color,c=b?c.itemStyle.color:g,h=b?a.legendColor||a.color||"#CCC":g,g=a.options&&a.options.marker,i={fill:h},k;d&&d.css({fill:c,color:c});e&&e.attr({stroke:h});if(f){if(g&&f.isMarker)for(k in i.stroke=
h,g=a.convertAttribs(g),g)d=g[k],d!==r&&(i[k]=d);f.attr(i)}},positionItem:function(a){var b=this.options,c=b.symbolPadding,b=!b.rtl,d=a._legendItemPos,e=d[0],d=d[1],f=a.checkbox;a.legendGroup&&a.legendGroup.translate(b?e:this.legendWidth-e-2*c-4,d);if(f)f.x=e,f.y=d},destroyItem:function(a){var b=a.checkbox;q(["legendItem","legendLine","legendSymbol","legendGroup"],function(b){a[b]&&(a[b]=a[b].destroy())});b&&Sa(a.checkbox)},destroy:function(){var a=this.group,b=this.box;if(b)this.box=b.destroy();
if(a)this.group=a.destroy()},positionCheckboxes:function(a){var b=this.group.alignAttr,c,d=this.clipHeight||this.legendHeight;if(b)c=b.translateY,q(this.allItems,function(e){var f=e.checkbox,g;f&&(g=c+f.y+(a||0)+3,E(f,{left:b.translateX+e.legendItemWidth+f.x-20+"px",top:g+"px",display:g>c-6&&g<c+d-6?"":X}))})},renderTitle:function(){var a=this.padding,b=this.options.title,c=0;if(b.text){if(!this.title)this.title=this.chart.renderer.label(b.text,a-3,a-4,null,null,null,null,null,"legend-title").attr({zIndex:1}).css(b.style).add(this.group);
a=this.title.getBBox();c=a.height;this.offsetWidth=a.width;this.contentGroup.attr({translateY:c})}this.titleHeight=c},renderItem:function(a){var b=this.chart,c=b.renderer,d=this.options,e=d.layout==="horizontal",f=this.symbolWidth,g=d.symbolPadding,h=this.itemStyle,i=this.itemHiddenStyle,k=this.padding,j=e?o(d.itemDistance,20):0,l=!d.rtl,m=d.width,n=d.itemMarginBottom||0,p=this.itemMarginTop,u=this.initialItemX,q=a.legendItem,G=a.series&&a.series.drawLegendSymbol?a.series:a,x=G.options,x=this.createCheckboxForItem&&
x&&x.showCheckbox,r=d.useHTML;if(!q)a.legendGroup=c.g("legend-item").attr({zIndex:1}).add(this.scrollGroup),G.drawLegendSymbol(this,a),a.legendItem=q=c.text(d.labelFormat?Ja(d.labelFormat,a):d.labelFormatter.call(a),l?f+g:-g,this.baseline,r).css(y(a.visible?h:i)).attr({align:l?"left":"right",zIndex:2}).add(a.legendGroup),this.setItemEvents&&this.setItemEvents(a,q,r,h,i),this.colorizeItem(a,a.visible),x&&this.createCheckboxForItem(a);c=q.getBBox();f=a.legendItemWidth=d.itemWidth||a.legendItemWidth||
f+g+c.width+j+(x?20:0);this.itemHeight=g=s(a.legendItemHeight||c.height);if(e&&this.itemX-u+f>(m||b.chartWidth-2*k-u-d.x))this.itemX=u,this.itemY+=p+this.lastLineHeight+n,this.lastLineHeight=0;this.maxItemWidth=w(this.maxItemWidth,f);this.lastItemY=p+this.itemY+n;this.lastLineHeight=w(g,this.lastLineHeight);a._legendItemPos=[this.itemX,this.itemY];e?this.itemX+=f:(this.itemY+=p+g+n,this.lastLineHeight=g);this.offsetWidth=m||w((e?this.itemX-u-j:f)+k,this.offsetWidth)},getAllItems:function(){var a=
[];q(this.chart.series,function(b){var c=b.options;if(o(c.showInLegend,!t(c.linkedTo)?r:!1,!0))a=a.concat(b.legendItems||(c.legendType==="point"?b.data:b))});return a},render:function(){var a=this,b=a.chart,c=b.renderer,d=a.group,e,f,g,h,i=a.box,k=a.options,j=a.padding,l=k.borderWidth,m=k.backgroundColor;a.itemX=a.initialItemX;a.itemY=a.initialItemY;a.offsetWidth=0;a.lastItemY=0;if(!d)a.group=d=c.g("legend").attr({zIndex:7}).add(),a.contentGroup=c.g().attr({zIndex:1}).add(d),a.scrollGroup=c.g().add(a.contentGroup);
a.renderTitle();e=a.getAllItems();tb(e,function(a,b){return(a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||0)});k.reversed&&e.reverse();a.allItems=e;a.display=f=!!e.length;q(e,function(b){a.renderItem(b)});g=k.width||a.offsetWidth;h=a.lastItemY+a.lastLineHeight+a.titleHeight;h=a.handleOverflow(h);if(l||m){g+=j;h+=j;if(i){if(g>0&&h>0)i[i.isNew?"attr":"animate"](i.crisp({width:g,height:h})),i.isNew=!1}else a.box=i=c.rect(0,0,g,h,k.borderRadius,l||0).attr({stroke:k.borderColor,
"stroke-width":l||0,fill:m||X}).add(d).shadow(k.shadow),i.isNew=!0;i[f?"show":"hide"]()}a.legendWidth=g;a.legendHeight=h;q(e,function(b){a.positionItem(b)});f&&d.align(v({width:g,height:h},k),!0,"spacingBox");b.isResizing||this.positionCheckboxes()},handleOverflow:function(a){var b=this,c=this.chart,d=c.renderer,e=this.options,f=e.y,f=c.spacingBox.height+(e.verticalAlign==="top"?-f:f)-this.padding,g=e.maxHeight,h,i=this.clipRect,k=e.navigation,j=o(k.animation,!0),l=k.arrowSize||12,m=this.nav,n=this.pages,
p,u=this.allItems;e.layout==="horizontal"&&(f/=2);g&&(f=z(f,g));n.length=0;if(a>f&&!e.useHTML){this.clipHeight=h=f-20-this.titleHeight-this.padding;this.currentPage=o(this.currentPage,1);this.fullHeight=a;q(u,function(a,b){var c=a._legendItemPos[1],d=s(a.legendItem.getBBox().height),e=n.length;if(!e||c-n[e-1]>h&&(p||c)!==n[e-1])n.push(p||c),e++;b===u.length-1&&c+d-n[e-1]>h&&n.push(c);c!==p&&(p=c)});if(!i)i=b.clipRect=d.clipRect(0,this.padding,9999,0),b.contentGroup.clip(i);i.attr({height:h});if(!m)this.nav=
m=d.g().attr({zIndex:1}).add(this.group),this.up=d.symbol("triangle",0,0,l,l).on("click",function(){b.scroll(-1,j)}).add(m),this.pager=d.text("",15,10).css(k.style).add(m),this.down=d.symbol("triangle-down",0,0,l,l).on("click",function(){b.scroll(1,j)}).add(m);b.scroll(0);a=f}else if(m)i.attr({height:c.chartHeight}),m.hide(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0;return a},scroll:function(a,b){var c=this.pages,d=c.length,e=this.currentPage+a,f=this.clipHeight,g=this.options.navigation,
h=g.activeColor,g=g.inactiveColor,i=this.pager,k=this.padding;e>d&&(e=d);if(e>0)b!==r&&Ya(b,this.chart),this.nav.attr({translateX:k,translateY:f+this.padding+7+this.titleHeight,visibility:"visible"}),this.up.attr({fill:e===1?g:h}).css({cursor:e===1?"default":"pointer"}),i.attr({text:e+"/"+d}),this.down.attr({x:18+this.pager.getBBox().width,fill:e===d?g:h}).css({cursor:e===d?"default":"pointer"}),c=-c[e-1]+this.initialItemY,this.scrollGroup.animate({translateY:c}),this.currentPage=e,this.positionCheckboxes(c)}};
Q=P.LegendSymbolMixin={drawRectangle:function(a,b){var c=a.options.symbolHeight||12;b.legendSymbol=this.chart.renderer.rect(0,a.baseline-5-c/2,a.symbolWidth,c,a.options.symbolRadius||0).attr({zIndex:3}).add(b.legendGroup)},drawLineMarker:function(a){var b=this.options,c=b.marker,d;d=a.symbolWidth;var e=this.chart.renderer,f=this.legendGroup,a=a.baseline-s(e.fontMetrics(a.options.itemStyle.fontSize).b*0.3),g;if(b.lineWidth){g={"stroke-width":b.lineWidth};if(b.dashStyle)g.dashstyle=b.dashStyle;this.legendLine=
e.path(["M",0,a,"L",d,a]).attr(g).add(f)}if(c&&c.enabled!==!1)b=c.radius,this.legendSymbol=d=e.symbol(this.symbol,d/2-b,a-b,2*b,2*b).add(f),d.isMarker=!0}};(/Trident\/7\.0/.test(Da)||$a)&&O(pb.prototype,"positionItem",function(a,b){var c=this,d=function(){b._legendItemPos&&a.call(c,b)};d();setTimeout(d)});va.prototype={init:function(a,b){var c,d=a.series;a.series=null;c=y(I,a);c.series=a.series=d;this.userOptions=a;d=c.chart;this.margin=this.splashArray("margin",d);this.spacing=this.splashArray("spacing",
d);var e=d.events;this.bounds={h:{},v:{}};this.callback=b;this.isResizing=0;this.options=c;this.axes=[];this.series=[];this.hasCartesianSeries=d.showAxes;var f=this,g;f.index=$.length;$.push(f);eb++;d.reflow!==!1&&A(f,"load",function(){f.initReflow()});if(e)for(g in e)A(f,g,e[g]);f.xAxis=[];f.yAxis=[];f.animation=ia?!1:o(d.animation,!0);f.pointCount=0;f.counters=new Lb;f.firstRender()},initSeries:function(a){var b=this.options.chart;(b=C[a.type||b.type||b.defaultSeriesType])||pa(17,!0);b=new b;b.init(this,
a);return b},isInsidePlot:function(a,b,c){var d=c?b:a,a=c?a:b;return d>=0&&d<=this.plotWidth&&a>=0&&a<=this.plotHeight},adjustTickAmounts:function(){this.options.chart.alignTicks!==!1&&q(this.axes,function(a){a.adjustTickAmount()});this.maxTicks=null},redraw:function(a){var b=this.axes,c=this.series,d=this.pointer,e=this.legend,f=this.isDirtyLegend,g,h,i=this.isDirtyBox,k=c.length,j=k,l=this.renderer,m=l.isHidden(),n=[];Ya(a,this);m&&this.cloneRenderTo();for(this.layOutTitles();j--;)if(a=c[j],a.options.stacking&&
(g=!0,a.isDirty)){h=!0;break}if(h)for(j=k;j--;)if(a=c[j],a.options.stacking)a.isDirty=!0;q(c,function(a){a.isDirty&&a.options.legendType==="point"&&(f=!0)});if(f&&e.options.enabled)e.render(),this.isDirtyLegend=!1;g&&this.getStacks();if(this.hasCartesianSeries){if(!this.isResizing)this.maxTicks=null,q(b,function(a){a.setScale()});this.adjustTickAmounts();this.getMargins();q(b,function(a){a.isDirty&&(i=!0)});q(b,function(a){if(a.isDirtyExtremes)a.isDirtyExtremes=!1,n.push(function(){K(a,"afterSetExtremes",
v(a.eventArgs,a.getExtremes()));delete a.eventArgs});(i||g)&&a.redraw()})}i&&this.drawChartBox();q(c,function(a){a.isDirty&&a.visible&&(!a.isCartesian||a.xAxis)&&a.redraw()});d&&d.reset(!0);l.draw();K(this,"redraw");m&&this.cloneRenderTo(!0);q(n,function(a){a.call()})},get:function(a){var b=this.axes,c=this.series,d,e;for(d=0;d<b.length;d++)if(b[d].options.id===a)return b[d];for(d=0;d<c.length;d++)if(c[d].options.id===a)return c[d];for(d=0;d<c.length;d++){e=c[d].points||[];for(b=0;b<e.length;b++)if(e[b].id===
a)return e[b]}return null},getAxes:function(){var a=this,b=this.options,c=b.xAxis=la(b.xAxis||{}),b=b.yAxis=la(b.yAxis||{});q(c,function(a,b){a.index=b;a.isX=!0});q(b,function(a,b){a.index=b});c=c.concat(b);q(c,function(b){new F(a,b)});a.adjustTickAmounts()},getSelectedPoints:function(){var a=[];q(this.series,function(b){a=a.concat(Cb(b.points||[],function(a){return a.selected}))});return a},getSelectedSeries:function(){return Cb(this.series,function(a){return a.selected})},getStacks:function(){var a=
this;q(a.yAxis,function(a){if(a.stacks&&a.hasVisibleSeries)a.oldStacks=a.stacks});q(a.series,function(b){if(b.options.stacking&&(b.visible===!0||a.options.chart.ignoreHiddenSeries===!1))b.stackKey=b.type+o(b.options.stack,"")})},setTitle:function(a,b,c){var g;var d=this,e=d.options,f;f=e.title=y(e.title,a);g=e.subtitle=y(e.subtitle,b),e=g;q([["title",a,f],["subtitle",b,e]],function(a){var b=a[0],c=d[b],e=a[1],a=a[2];c&&e&&(d[b]=c=c.destroy());a&&a.text&&!c&&(d[b]=d.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,
"class":"highcharts-"+b,zIndex:a.zIndex||4}).css(a.style).add())});d.layOutTitles(c)},layOutTitles:function(a){var b=0,c=this.title,d=this.subtitle,e=this.options,f=e.title,e=e.subtitle,g=this.spacingBox.width-44;if(c&&(c.css({width:(f.width||g)+"px"}).align(v({y:15},f),!1,"spacingBox"),!f.floating&&!f.verticalAlign))b=c.getBBox().height;d&&(d.css({width:(e.width||g)+"px"}).align(v({y:b+f.margin},e),!1,"spacingBox"),!e.floating&&!e.verticalAlign&&(b=Va(b+d.getBBox().height)));c=this.titleOffset!==
b;this.titleOffset=b;if(!this.isDirtyBox&&c)this.isDirtyBox=c,this.hasRendered&&o(a,!0)&&this.isDirtyBox&&this.redraw()},getChartSize:function(){var a=this.options.chart,b=a.width,a=a.height,c=this.renderToClone||this.renderTo;if(!t(b))this.containerWidth=nb(c,"width");if(!t(a))this.containerHeight=nb(c,"height");this.chartWidth=w(0,b||this.containerWidth||600);this.chartHeight=w(0,o(a,this.containerHeight>19?this.containerHeight:400))},cloneRenderTo:function(a){var b=this.renderToClone,c=this.container;
a?b&&(this.renderTo.appendChild(c),Sa(b),delete this.renderToClone):(c&&c.parentNode===this.renderTo&&this.renderTo.removeChild(c),this.renderToClone=b=this.renderTo.cloneNode(0),E(b,{position:"absolute",top:"-9999px",display:"block"}),b.style.setProperty&&b.style.setProperty("display","block","important"),B.body.appendChild(b),c&&b.appendChild(c))},getContainer:function(){var a,b=this.options.chart,c,d,e;this.renderTo=a=b.renderTo;e="highcharts-"+Ab++;if(Oa(a))this.renderTo=a=B.getElementById(a);
a||pa(13,!0);c=J(V(a,"data-highcharts-chart"));!isNaN(c)&&$[c]&&$[c].hasRendered&&$[c].destroy();V(a,"data-highcharts-chart",this.index);a.innerHTML="";!b.skipClone&&!a.offsetWidth&&this.cloneRenderTo();this.getChartSize();c=this.chartWidth;d=this.chartHeight;this.container=a=Y(Ta,{className:"highcharts-container"+(b.className?" "+b.className:""),id:e},v({position:"relative",overflow:"hidden",width:c+"px",height:d+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},
b.style),this.renderToClone||a);this._cursor=a.style.cursor;this.renderer=b.forExport?new ja(a,c,d,b.style,!0):new Wa(a,c,d,b.style);ia&&this.renderer.create(this,a,c,d)},getMargins:function(){var a=this.spacing,b,c=this.legend,d=this.margin,e=this.options.legend,f=o(e.margin,20),g=e.x,h=e.y,i=e.align,k=e.verticalAlign,j=this.titleOffset;this.resetMargins();b=this.axisOffset;if(j&&!t(d[0]))this.plotTop=w(this.plotTop,j+this.options.title.margin+a[0]);if(c.display&&!e.floating)if(i==="right"){if(!t(d[1]))this.marginRight=
w(this.marginRight,c.legendWidth-g+f+a[1])}else if(i==="left"){if(!t(d[3]))this.plotLeft=w(this.plotLeft,c.legendWidth+g+f+a[3])}else if(k==="top"){if(!t(d[0]))this.plotTop=w(this.plotTop,c.legendHeight+h+f+a[0])}else if(k==="bottom"&&!t(d[2]))this.marginBottom=w(this.marginBottom,c.legendHeight-h+f+a[2]);this.extraBottomMargin&&(this.marginBottom+=this.extraBottomMargin);this.extraTopMargin&&(this.plotTop+=this.extraTopMargin);this.hasCartesianSeries&&q(this.axes,function(a){a.getOffset()});t(d[3])||
(this.plotLeft+=b[3]);t(d[0])||(this.plotTop+=b[0]);t(d[2])||(this.marginBottom+=b[2]);t(d[1])||(this.marginRight+=b[1]);this.setChartSize()},reflow:function(a){var b=this,c=b.options.chart,d=b.renderTo,e=c.width||nb(d,"width"),f=c.height||nb(d,"height"),c=a?a.target:W,d=function(){if(b.container)b.setSize(e,f,!1),b.hasUserSize=null};if(!b.hasUserSize&&e&&f&&(c===W||c===B)){if(e!==b.containerWidth||f!==b.containerHeight)clearTimeout(b.reflowTimeout),a?b.reflowTimeout=setTimeout(d,100):d();b.containerWidth=
e;b.containerHeight=f}},initReflow:function(){var a=this,b=function(b){a.reflow(b)};A(W,"resize",b);A(a,"destroy",function(){R(W,"resize",b)})},setSize:function(a,b,c){var d=this,e,f,g;d.isResizing+=1;g=function(){d&&K(d,"endResize",null,function(){d.isResizing-=1})};Ya(c,d);d.oldChartHeight=d.chartHeight;d.oldChartWidth=d.chartWidth;if(t(a))d.chartWidth=e=w(0,s(a)),d.hasUserSize=!!e;if(t(b))d.chartHeight=f=w(0,s(b));(Ca?ob:E)(d.container,{width:e+"px",height:f+"px"},Ca);d.setChartSize(!0);d.renderer.setSize(e,
f,c);d.maxTicks=null;q(d.axes,function(a){a.isDirty=!0;a.setScale()});q(d.series,function(a){a.isDirty=!0});d.isDirtyLegend=!0;d.isDirtyBox=!0;d.layOutTitles();d.getMargins();d.redraw(c);d.oldChartHeight=null;K(d,"resize");Ca===!1?g():setTimeout(g,Ca&&Ca.duration||500)},setChartSize:function(a){var b=this.inverted,c=this.renderer,d=this.chartWidth,e=this.chartHeight,f=this.options.chart,g=this.spacing,h=this.clipOffset,i,k,j,l;this.plotLeft=i=s(this.plotLeft);this.plotTop=k=s(this.plotTop);this.plotWidth=
j=w(0,s(d-i-this.marginRight));this.plotHeight=l=w(0,s(e-k-this.marginBottom));this.plotSizeX=b?l:j;this.plotSizeY=b?j:l;this.plotBorderWidth=f.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:g[3],y:g[0],width:d-g[3]-g[1],height:e-g[0]-g[2]};this.plotBox=c.plotBox={x:i,y:k,width:j,height:l};d=2*S(this.plotBorderWidth/2);b=Va(w(d,h[3])/2);c=Va(w(d,h[0])/2);this.clipBox={x:b,y:c,width:S(this.plotSizeX-w(d,h[1])/2-b),height:S(this.plotSizeY-w(d,h[2])/2-c)};a||q(this.axes,function(a){a.setAxisSize();
a.setAxisTranslation()})},resetMargins:function(){var a=this.spacing,b=this.margin;this.plotTop=o(b[0],a[0]);this.marginRight=o(b[1],a[1]);this.marginBottom=o(b[2],a[2]);this.plotLeft=o(b[3],a[3]);this.axisOffset=[0,0,0,0];this.clipOffset=[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,b=this.renderer,c=this.chartWidth,d=this.chartHeight,e=this.chartBackground,f=this.plotBackground,g=this.plotBorder,h=this.plotBGImage,i=a.borderWidth||0,k=a.backgroundColor,j=a.plotBackgroundColor,l=a.plotBackgroundImage,
m=a.plotBorderWidth||0,n,p=this.plotLeft,u=this.plotTop,o=this.plotWidth,q=this.plotHeight,x=this.plotBox,r=this.clipRect,s=this.clipBox;n=i+(a.shadow?8:0);if(i||k)if(e)e.animate(e.crisp({width:c-n,height:d-n}));else{e={fill:k||X};if(i)e.stroke=a.borderColor,e["stroke-width"]=i;this.chartBackground=b.rect(n/2,n/2,c-n,d-n,a.borderRadius,i).attr(e).addClass("highcharts-background").add().shadow(a.shadow)}if(j)f?f.animate(x):this.plotBackground=b.rect(p,u,o,q,0).attr({fill:j}).add().shadow(a.plotShadow);
if(l)h?h.animate(x):this.plotBGImage=b.image(l,p,u,o,q).add();r?r.animate({width:s.width,height:s.height}):this.clipRect=b.clipRect(s);if(m)g?g.animate(g.crisp({x:p,y:u,width:o,height:q})):this.plotBorder=b.rect(p,u,o,q,0,-m).attr({stroke:a.plotBorderColor,"stroke-width":m,fill:X,zIndex:1}).add();this.isDirtyBox=!1},propFromSeries:function(){var a=this,b=a.options.chart,c,d=a.options.series,e,f;q(["inverted","angular","polar"],function(g){c=C[b.type||b.defaultSeriesType];f=a[g]||b[g]||c&&c.prototype[g];
for(e=d&&d.length;!f&&e--;)(c=C[d[e].type])&&c.prototype[g]&&(f=!0);a[g]=f})},linkSeries:function(){var a=this,b=a.series;q(b,function(a){a.linkedSeries.length=0});q(b,function(b){var d=b.options.linkedTo;if(Oa(d)&&(d=d===":previous"?a.series[b.index-1]:a.get(d)))d.linkedSeries.push(b),b.linkedParent=d})},renderSeries:function(){q(this.series,function(a){a.translate();a.setTooltipPoints&&a.setTooltipPoints();a.render()})},render:function(){var a=this,b=a.axes,c=a.renderer,d=a.options,e=d.labels,f=
d.credits,g;a.setTitle();a.legend=new pb(a,d.legend);a.getStacks();q(b,function(a){a.setScale()});a.getMargins();a.maxTicks=null;q(b,function(a){a.setTickPositions(!0);a.setMaxTicks()});a.adjustTickAmounts();a.getMargins();a.drawChartBox();a.hasCartesianSeries&&q(b,function(a){a.render()});if(!a.seriesGroup)a.seriesGroup=c.g("series-group").attr({zIndex:3}).add();a.renderSeries();e.items&&q(e.items,function(b){var d=v(e.style,b.style),f=J(d.left)+a.plotLeft,g=J(d.top)+a.plotTop+12;delete d.left;delete d.top;
c.text(b.html,f,g).attr({zIndex:2}).css(d).add()});if(f.enabled&&!a.credits)g=f.href,a.credits=c.text(f.text,0,0).on("click",function(){if(g)location.href=g}).attr({align:f.position.align,zIndex:8}).css(f.style).add().align(f.position);a.hasRendered=!0},destroy:function(){var a=this,b=a.axes,c=a.series,d=a.container,e,f=d&&d.parentNode;K(a,"destroy");$[a.index]=r;eb--;a.renderTo.removeAttribute("data-highcharts-chart");R(a);for(e=b.length;e--;)b[e]=b[e].destroy();for(e=c.length;e--;)c[e]=c[e].destroy();
q("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,pointer,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","),function(b){var c=a[b];c&&c.destroy&&(a[b]=c.destroy())});if(d)d.innerHTML="",R(d),f&&Sa(d);for(e in a)delete a[e]},isReadyToRender:function(){var a=this;return!ba&&W==W.top&&B.readyState!=="complete"||ia&&!W.canvg?(ia?Vb.push(function(){a.firstRender()},a.options.global.canvasToolsURL):B.attachEvent("onreadystatechange",
function(){B.detachEvent("onreadystatechange",a.firstRender);B.readyState==="complete"&&a.firstRender()}),!1):!0},firstRender:function(){var a=this,b=a.options,c=a.callback;if(a.isReadyToRender()){a.getContainer();K(a,"init");a.resetMargins();a.setChartSize();a.propFromSeries();a.getAxes();q(b.series||[],function(b){a.initSeries(b)});a.linkSeries();K(a,"beforeRender");if(P.Pointer)a.pointer=new Xa(a,b);a.render();a.renderer.draw();c&&c.apply(a,[a]);q(a.callbacks,function(b){b.apply(a,[a])});a.cloneRenderTo(!0);
K(a,"load")}},splashArray:function(a,b){var c=b[a],c=ea(c)?c:[c,c,c,c];return[o(b[a+"Top"],c[0]),o(b[a+"Right"],c[1]),o(b[a+"Bottom"],c[2]),o(b[a+"Left"],c[3])]}};va.prototype.callbacks=[];da=P.CenteredSeriesMixin={getCenter:function(){var a=this.options,b=this.chart,c=2*(a.slicedOffset||0),d,e=b.plotWidth-2*c,f=b.plotHeight-2*c,b=a.center,a=[o(b[0],"50%"),o(b[1],"50%"),a.size||"100%",a.innerSize||0],g=z(e,f),h;return xa(a,function(a,b){h=/%$/.test(a);d=b<2||b===2&&h;return(h?[e,f,g,g][b]*J(a)/100:
a)+(d?c:0)})}};var za=function(){};za.prototype={init:function(a,b,c){this.series=a;this.applyOptions(b,c);this.pointAttr={};if(a.options.colorByPoint&&(b=a.options.colors||a.chart.options.colors,this.color=this.color||b[a.colorCounter++],a.colorCounter===b.length))a.colorCounter=0;a.chart.pointCount++;return this},applyOptions:function(a,b){var c=this.series,d=c.pointValKey,a=za.prototype.optionsToObject.call(this,a);v(this,a);this.options=this.options?v(this.options,a):a;if(d)this.y=this[d];if(this.x===
r&&c)this.x=b===r?c.autoIncrement():b;return this},optionsToObject:function(a){var b={},c=this.series,d=c.pointArrayMap||["y"],e=d.length,f=0,g=0;if(typeof a==="number"||a===null)b[d[0]]=a;else if(Pa(a)){if(a.length>e){c=typeof a[0];if(c==="string")b.name=a[0];else if(c==="number")b.x=a[0];f++}for(;g<e;)b[d[g++]]=a[f++]}else if(typeof a==="object"){b=a;if(a.dataLabels)c._hasPointLabels=!0;if(a.marker)c._hasPointMarkers=!0}return b},destroy:function(){var a=this.series.chart,b=a.hoverPoints,c;a.pointCount--;
if(b&&(this.setState(),oa(b,this),!b.length))a.hoverPoints=null;if(this===a.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel)R(this),this.destroyElements();this.legendItem&&a.legend.destroyItem(this);for(c in this)this[c]=null},destroyElements:function(){for(var a="graphic,dataLabel,dataLabelUpper,group,connector,shadowGroup".split(","),b,c=6;c--;)b=a[c],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,y:this.y,key:this.name||this.category,series:this.series,
point:this,percentage:this.percentage,total:this.total||this.stackTotal}},tooltipFormatter:function(a){var b=this.series,c=b.tooltipOptions,d=o(c.valueDecimals,""),e=c.valuePrefix||"",f=c.valueSuffix||"";q(b.pointArrayMap||["y"],function(b){b="{point."+b;if(e||f)a=a.replace(b+"}",e+b+"}"+f);a=a.replace(b+"}",b+":,."+d+"f}")});return Ja(a,{point:this,series:this.series})},firePointEvent:function(a,b,c){var d=this,e=this.series.options;(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&
this.importEvents();a==="click"&&e.allowPointSelect&&(c=function(a){d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});K(this,a,b,c)}};var L=function(){};L.prototype={isCartesian:!0,type:"line",pointClass:za,sorted:!0,requireSorting:!0,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},axisTypes:["xAxis","yAxis"],colorCounter:0,parallelArrays:["x","y"],init:function(a,b){var c=this,d,e,f=a.series,g=function(a,b){return o(a.options.index,a._i)-o(b.options.index,
b._i)};c.chart=a;c.options=b=c.setOptions(b);c.linkedSeries=[];c.bindAxes();v(c,{name:b.name,state:"",pointAttr:{},visible:b.visible!==!1,selected:b.selected===!0});if(ia)b.animation=!1;e=b.events;for(d in e)A(c,d,e[d]);if(e&&e.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;c.getColor();c.getSymbol();q(c.parallelArrays,function(a){c[a+"Data"]=[]});c.setData(b.data,!1);if(c.isCartesian)a.hasCartesianSeries=!0;f.push(c);c._i=f.length-1;tb(f,g);this.yAxis&&
tb(this.yAxis.series,g);q(f,function(a,b){a.index=b;a.name=a.name||"Series "+(b+1)})},bindAxes:function(){var a=this,b=a.options,c=a.chart,d;q(a.axisTypes||[],function(e){q(c[e],function(c){d=c.options;if(b[e]===d.index||b[e]!==r&&b[e]===d.id||b[e]===r&&d.index===0)c.series.push(a),a[e]=c,c.isDirty=!0});!a[e]&&a.optionalAxis!==e&&pa(18,!0)})},updateParallelArrays:function(a,b){var c=a.series,d=arguments;q(c.parallelArrays,typeof b==="number"?function(d){var f=d==="y"&&c.toYData?c.toYData(a):a[d];
c[d+"Data"][b]=f}:function(a){Array.prototype[b].apply(c[a+"Data"],Array.prototype.slice.call(d,2))})},autoIncrement:function(){var a=this.options,b=this.xIncrement,b=o(b,a.pointStart,0);this.pointInterval=o(this.pointInterval,a.pointInterval,1);this.xIncrement=b+this.pointInterval;return b},getSegments:function(){var a=-1,b=[],c,d=this.points,e=d.length;if(e)if(this.options.connectNulls){for(c=e;c--;)d[c].y===null&&d.splice(c,1);d.length&&(b=[d])}else q(d,function(c,g){c.y===null?(g>a+1&&b.push(d.slice(a+
1,g)),a=g):g===e-1&&b.push(d.slice(a+1,g+1))});this.segments=b},setOptions:function(a){var b=this.chart,c=b.options.plotOptions,b=b.userOptions||{},d=b.plotOptions||{},e=c[this.type];this.userOptions=a;c=y(e,c.series,a);this.tooltipOptions=y(I.tooltip,I.plotOptions[this.type].tooltip,b.tooltip,d.series&&d.series.tooltip,d[this.type]&&d[this.type].tooltip,a.tooltip);e.marker===null&&delete c.marker;return c},getColor:function(){var a=this.options,b=this.userOptions,c=this.chart.options.colors,d=this.chart.counters,
e;e=a.color||T[this.type].color;if(!e&&!a.colorByPoint)t(b._colorIndex)?a=b._colorIndex:(b._colorIndex=d.color,a=d.color++),e=c[a];this.color=e;d.wrapColor(c.length)},getSymbol:function(){var a=this.userOptions,b=this.options.marker,c=this.chart,d=c.options.symbols,c=c.counters;this.symbol=b.symbol;if(!this.symbol)t(a._symbolIndex)?a=a._symbolIndex:(a._symbolIndex=c.symbol,a=c.symbol++),this.symbol=d[a];if(/^url/.test(this.symbol))b.radius=0;c.wrapSymbol(d.length)},drawLegendSymbol:Q.drawLineMarker,
setData:function(a,b,c,d){var e=this,f=e.points,g=f&&f.length||0,h,i=e.options,k=e.chart,j=null,l=e.xAxis,m=l&&!!l.categories,n=e.tooltipPoints,p=i.turboThreshold,u=this.xData,s=this.yData,G=(h=e.pointArrayMap)&&h.length,a=a||[];h=a.length;b=o(b,!0);if(d!==!1&&h&&g===h&&!e.cropped&&!e.hasGroupedData)q(a,function(a,b){f[b].update(a,!1)});else{e.xIncrement=null;e.pointRange=m?1:i.pointRange;e.colorCounter=0;q(this.parallelArrays,function(a){e[a+"Data"].length=0});if(p&&h>p){for(c=0;j===null&&c<h;)j=
a[c],c++;if(ka(j)){m=o(i.pointStart,0);i=o(i.pointInterval,1);for(c=0;c<h;c++)u[c]=m,s[c]=a[c],m+=i;e.xIncrement=m}else if(Pa(j))if(G)for(c=0;c<h;c++)i=a[c],u[c]=i[0],s[c]=i.slice(1,G+1);else for(c=0;c<h;c++)i=a[c],u[c]=i[0],s[c]=i[1];else pa(12)}else for(c=0;c<h;c++)if(a[c]!==r&&(i={series:e},e.pointClass.prototype.applyOptions.apply(i,[a[c]]),e.updateParallelArrays(i,c),m&&i.name))l.names[i.x]=i.name;Oa(s[0])&&pa(14,!0);e.data=[];e.options.data=a;for(c=g;c--;)f[c]&&f[c].destroy&&f[c].destroy();
if(n)n.length=0;if(l)l.minRange=l.userMinRange;e.isDirty=e.isDirtyData=k.isDirtyBox=!0;c=!1}b&&k.redraw(c)},processData:function(a){var b=this.xData,c=this.yData,d=b.length,e;e=0;var f,g,h=this.xAxis,i=this.options,k=i.cropThreshold,j=0,l=this.isCartesian,m,n;if(l&&!this.isDirty&&!h.isDirty&&!this.yAxis.isDirty&&!a)return!1;if(l&&this.sorted&&(!k||d>k||this.forceCrop))if(m=h.min,n=h.max,b[d-1]<m||b[0]>n)b=[],c=[];else if(b[0]<m||b[d-1]>n)e=this.cropData(this.xData,this.yData,m,n),b=e.xData,c=e.yData,
e=e.start,f=!0,j=b.length;for(d=b.length-1;d>=0;d--)a=b[d]-b[d-1],!f&&b[d]>m&&b[d]<n&&j++,a>0&&(g===r||a<g)?g=a:a<0&&this.requireSorting&&pa(15);this.cropped=f;this.cropStart=e;this.processedXData=b;this.processedYData=c;this.activePointCount=j;if(i.pointRange===null)this.pointRange=g||1;this.closestPointRange=g},cropData:function(a,b,c,d){var e=a.length,f=0,g=e,h=o(this.cropShoulder,1),i;for(i=0;i<e;i++)if(a[i]>=c){f=w(0,i-h);break}for(;i<e;i++)if(a[i]>d){g=i+h;break}return{xData:a.slice(f,g),yData:b.slice(f,
g),start:f,end:g}},generatePoints:function(){var a=this.options.data,b=this.data,c,d=this.processedXData,e=this.processedYData,f=this.pointClass,g=d.length,h=this.cropStart||0,i,k=this.hasGroupedData,j,l=[],m;if(!b&&!k)b=[],b.length=a.length,b=this.data=b;for(m=0;m<g;m++)i=h+m,k?l[m]=(new f).init(this,[d[m]].concat(la(e[m]))):(b[i]?j=b[i]:a[i]!==r&&(b[i]=j=(new f).init(this,a[i],d[m])),l[m]=j);if(b&&(g!==(c=b.length)||k))for(m=0;m<c;m++)if(m===h&&!k&&(m+=g),b[m])b[m].destroyElements(),b[m].plotX=
r;this.data=b;this.points=l},getExtremes:function(a){var b=this.yAxis,c=this.processedXData,d,e=[],f=0;d=this.xAxis.getExtremes();var g=d.min,h=d.max,i,k,j,l,a=a||this.stackedYData||this.processedYData;d=a.length;for(l=0;l<d;l++)if(k=c[l],j=a[l],i=j!==null&&j!==r&&(!b.isLog||j.length||j>0),k=this.getExtremesFromAll||this.cropped||(c[l+1]||k)>=g&&(c[l-1]||k)<=h,i&&k)if(i=j.length)for(;i--;)j[i]!==null&&(e[f++]=j[i]);else e[f++]=j;this.dataMin=o(void 0,Ra(e));this.dataMax=o(void 0,Ba(e))},translate:function(){this.processedXData||
this.processData();this.generatePoints();for(var a=this.options,b=a.stacking,c=this.xAxis,d=c.categories,e=this.yAxis,f=this.points,g=f.length,h=!!this.modifyValue,i=a.pointPlacement,k=i==="between"||ka(i),j=a.threshold,a=0;a<g;a++){var l=f[a],m=l.x,n=l.y,p=l.low,u=b&&e.stacks[(this.negStacks&&n<j?"-":"")+this.stackKey];if(e.isLog&&n<=0)l.y=n=null;l.plotX=c.translate(m,0,0,0,1,i,this.type==="flags");if(b&&this.visible&&u&&u[m])u=u[m],n=u.points[this.index+","+a],p=n[0],n=n[1],p===0&&(p=o(j,e.min)),
e.isLog&&p<=0&&(p=null),l.total=l.stackTotal=u.total,l.percentage=u.total&&l.y/u.total*100,l.stackY=n,u.setOffset(this.pointXOffset||0,this.barW||0);l.yBottom=t(p)?e.translate(p,0,1,0,1):null;h&&(n=this.modifyValue(n,l));l.plotY=typeof n==="number"&&n!==Infinity?e.translate(n,0,1,0,1):r;l.clientX=k?c.translate(m,0,0,0,1):l.plotX;l.negative=l.y<(j||0);l.category=d&&d[l.x]!==r?d[l.x]:l.x}this.getSegments()},animate:function(a){var b=this.chart,c=b.renderer,d;d=this.options.animation;var e=this.clipBox||
b.clipBox,f=b.inverted,g;if(d&&!ea(d))d=T[this.type].animation;g=["_sharedClip",d.duration,d.easing,e.height].join(",");a?(a=b[g],d=b[g+"m"],a||(b[g]=a=c.clipRect(v(e,{width:0})),b[g+"m"]=d=c.clipRect(-99,f?-b.plotLeft:-b.plotTop,99,f?b.chartWidth:b.chartHeight)),this.group.clip(a),this.markerGroup.clip(d),this.sharedClipKey=g):((a=b[g])&&a.animate({width:b.plotSizeX},d),b[g+"m"]&&b[g+"m"].animate({width:b.plotSizeX+99},d),this.animate=null)},afterAnimate:function(){var a=this.chart,b=this.sharedClipKey,
c=this.group,d=this.clipBox;if(c&&this.options.clip!==!1){if(!b||!d)c.clip(d?a.renderer.clipRect(d):a.clipRect);this.markerGroup.clip()}K(this,"afterAnimate");setTimeout(function(){b&&a[b]&&(d||(a[b]=a[b].destroy()),a[b+"m"]&&(a[b+"m"]=a[b+"m"].destroy()))},100)},drawPoints:function(){var a,b=this.points,c=this.chart,d,e,f,g,h,i,k,j;d=this.options.marker;var l=this.pointAttr[""],m,n=this.markerGroup,p=o(d.enabled,this.activePointCount<0.5*this.xAxis.len/d.radius);if(d.enabled!==!1||this._hasPointMarkers)for(f=
b.length;f--;)if(g=b[f],d=S(g.plotX),e=g.plotY,j=g.graphic,i=g.marker||{},a=p&&i.enabled===r||i.enabled,m=c.isInsidePlot(s(d),e,c.inverted),a&&e!==r&&!isNaN(e)&&g.y!==null)if(a=g.pointAttr[g.selected?"select":""]||l,h=a.r,i=o(i.symbol,this.symbol),k=i.indexOf("url")===0,j)j[m?"show":"hide"](!0).animate(v({x:d-h,y:e-h},j.symbolName?{width:2*h,height:2*h}:{}));else{if(m&&(h>0||k))g.graphic=c.renderer.symbol(i,d-h,e-h,2*h,2*h).attr(a).add(n)}else if(j)g.graphic=j.destroy()},convertAttribs:function(a,
b,c,d){var e=this.pointAttrToOptions,f,g,h={},a=a||{},b=b||{},c=c||{},d=d||{};for(f in e)g=e[f],h[f]=o(a[g],b[f],c[f],d[f]);return h},getAttribs:function(){var a=this,b=a.options,c=T[a.type].marker?b.marker:b,d=c.states,e=d.hover,f,g=a.color;f={stroke:g,fill:g};var h=a.points||[],i,k=[],j,l=a.pointAttrToOptions;j=a.hasPointSpecificOptions;var m=b.negativeColor,n=c.lineColor,p=c.fillColor;i=b.turboThreshold;var u;b.marker?(e.radius=e.radius||c.radius+2,e.lineWidth=e.lineWidth||c.lineWidth+1):e.color=
e.color||Fa(e.color||g).brighten(e.brightness).get();k[""]=a.convertAttribs(c,f);q(["hover","select"],function(b){k[b]=a.convertAttribs(d[b],k[""])});a.pointAttr=k;g=h.length;if(!i||g<i||j)for(;g--;){i=h[g];if((c=i.options&&i.options.marker||i.options)&&c.enabled===!1)c.radius=0;if(i.negative&&m)i.color=i.fillColor=m;j=b.colorByPoint||i.color;if(i.options)for(u in l)t(c[l[u]])&&(j=!0);if(j){c=c||{};j=[];d=c.states||{};f=d.hover=d.hover||{};if(!b.marker)f.color=f.color||!i.options.color&&e.color||
Fa(i.color).brighten(f.brightness||e.brightness).get();f={color:i.color};if(!p)f.fillColor=i.color;if(!n)f.lineColor=i.color;j[""]=a.convertAttribs(v(f,c),k[""]);j.hover=a.convertAttribs(d.hover,k.hover,j[""]);j.select=a.convertAttribs(d.select,k.select,j[""])}else j=k;i.pointAttr=j}},destroy:function(){var a=this,b=a.chart,c=/AppleWebKit\/533/.test(Da),d,e,f=a.data||[],g,h,i;K(a,"destroy");R(a);q(a.axisTypes||[],function(b){if(i=a[b])oa(i.series,a),i.isDirty=i.forceRedraw=!0});a.legendItem&&a.chart.legend.destroyItem(a);
for(e=f.length;e--;)(g=f[e])&&g.destroy&&g.destroy();a.points=null;clearTimeout(a.animationTimeout);q("area,graph,dataLabelsGroup,group,markerGroup,tracker,graphNeg,areaNeg,posClip,negClip".split(","),function(b){a[b]&&(d=c&&b==="group"?"hide":"destroy",a[b][d]())});if(b.hoverSeries===a)b.hoverSeries=null;oa(b.series,a);for(h in a)delete a[h]},getSegmentPath:function(a){var b=this,c=[],d=b.options.step;q(a,function(e,f){var g=e.plotX,h=e.plotY,i;b.getPointSpline?c.push.apply(c,b.getPointSpline(a,
e,f)):(c.push(f?"L":"M"),d&&f&&(i=a[f-1],d==="right"?c.push(i.plotX,h):d==="center"?c.push((i.plotX+g)/2,i.plotY,(i.plotX+g)/2,h):c.push(g,i.plotY)),c.push(e.plotX,e.plotY))});return c},getGraphPath:function(){var a=this,b=[],c,d=[];q(a.segments,function(e){c=a.getSegmentPath(e);e.length>1?b=b.concat(c):d.push(e[0])});a.singlePoints=d;return a.graphPath=b},drawGraph:function(){var a=this,b=this.options,c=[["graph",b.lineColor||this.color]],d=b.lineWidth,e=b.dashStyle,f=b.linecap!=="square",g=this.getGraphPath(),
h=b.negativeColor;h&&c.push(["graphNeg",h]);q(c,function(c,h){var j=c[0],l=a[j];if(l)fb(l),l.animate({d:g});else if(d&&g.length)l={stroke:c[1],"stroke-width":d,fill:X,zIndex:1},e?l.dashstyle=e:f&&(l["stroke-linecap"]=l["stroke-linejoin"]="round"),a[j]=a.chart.renderer.path(g).attr(l).add(a.group).shadow(!h&&b.shadow)})},clipNeg:function(){var a=this.options,b=this.chart,c=b.renderer,d=a.negativeColor||a.negativeFillColor,e,f=this.graph,g=this.area,h=this.posClip,i=this.negClip;e=b.chartWidth;var k=
b.chartHeight,j=w(e,k),l=this.yAxis;if(d&&(f||g)){d=s(l.toPixels(a.threshold||0,!0));d<0&&(j-=d);a={x:0,y:0,width:j,height:d};j={x:0,y:d,width:j,height:j};if(b.inverted)a.height=j.y=b.plotWidth-d,c.isVML&&(a={x:b.plotWidth-d-b.plotLeft,y:0,width:e,height:k},j={x:d+b.plotLeft-e,y:0,width:b.plotLeft+d,height:e});l.reversed?(b=j,e=a):(b=a,e=j);h?(h.animate(b),i.animate(e)):(this.posClip=h=c.clipRect(b),this.negClip=i=c.clipRect(e),f&&this.graphNeg&&(f.clip(h),this.graphNeg.clip(i)),g&&(g.clip(h),this.areaNeg.clip(i)))}},
invertGroups:function(){function a(){var a={width:b.yAxis.len,height:b.xAxis.len};q(["group","markerGroup"],function(c){b[c]&&b[c].attr(a).invert()})}var b=this,c=b.chart;if(b.xAxis)A(c,"resize",a),A(b,"destroy",function(){R(c,"resize",a)}),a(),b.invertGroups=a},plotGroup:function(a,b,c,d,e){var f=this[a],g=!f;g&&(this[a]=f=this.chart.renderer.g(b).attr({visibility:c,zIndex:d||0.1}).add(e));f[g?"attr":"animate"](this.getPlotBox());return f},getPlotBox:function(){var a=this.chart,b=this.xAxis,c=this.yAxis;
if(a.inverted)b=c,c=this.xAxis;return{translateX:b?b.left:a.plotLeft,translateY:c?c.top:a.plotTop,scaleX:1,scaleY:1}},render:function(){var a=this,b=a.chart,c,d=a.options,e=(c=d.animation)&&!!a.animate&&b.renderer.isSVG&&o(c.duration,500)||0,f=a.visible?"visible":"hidden",g=d.zIndex,h=a.hasRendered,i=b.seriesGroup;c=a.plotGroup("group","series",f,g,i);a.markerGroup=a.plotGroup("markerGroup","markers",f,g,i);e&&a.animate(!0);a.getAttribs();c.inverted=a.isCartesian?b.inverted:!1;a.drawGraph&&(a.drawGraph(),
a.clipNeg());a.drawDataLabels&&a.drawDataLabels();a.visible&&a.drawPoints();a.drawTracker&&a.options.enableMouseTracking!==!1&&a.drawTracker();b.inverted&&a.invertGroups();d.clip!==!1&&!a.sharedClipKey&&!h&&c.clip(b.clipRect);e&&a.animate();if(!h)e?a.animationTimeout=setTimeout(function(){a.afterAnimate()},e):a.afterAnimate();a.isDirty=a.isDirtyData=!1;a.hasRendered=!0},redraw:function(){var a=this.chart,b=this.isDirtyData,c=this.group,d=this.xAxis,e=this.yAxis;c&&(a.inverted&&c.attr({width:a.plotWidth,
height:a.plotHeight}),c.animate({translateX:o(d&&d.left,a.plotLeft),translateY:o(e&&e.top,a.plotTop)}));this.translate();this.setTooltipPoints&&this.setTooltipPoints(!0);this.render();b&&K(this,"updatedData")}};Rb.prototype={destroy:function(){Ka(this,this.axis)},render:function(a){var b=this.options,c=b.format,c=c?Ja(c,this):b.formatter.call(this);this.label?this.label.attr({text:c,visibility:"hidden"}):this.label=this.axis.chart.renderer.text(c,null,null,b.useHTML).css(b.style).attr({align:this.textAlign,
rotation:b.rotation,visibility:"hidden"}).add(a)},setOffset:function(a,b){var c=this.axis,d=c.chart,e=d.inverted,f=this.isNegative,g=c.translate(c.usePercentage?100:this.total,0,0,0,1),c=c.translate(0),c=N(g-c),h=d.xAxis[0].translate(this.x)+a,i=d.plotHeight,f={x:e?f?g:g-c:h,y:e?i-h-b:f?i-g-c:i-g,width:e?c:b,height:e?b:c};if(e=this.label)e.align(this.alignOptions,null,f),f=e.alignAttr,e[this.options.crop===!1||d.isInsidePlot(f.x,f.y)?"show":"hide"](!0)}};F.prototype.buildStacks=function(){var a=this.series,
b=o(this.options.reversedStacks,!0),c=a.length;if(!this.isXAxis){for(this.usePercentage=!1;c--;)a[b?c:a.length-c-1].setStackedPoints();if(this.usePercentage)for(c=0;c<a.length;c++)a[c].setPercentStacks()}};F.prototype.renderStackTotals=function(){var a=this.chart,b=a.renderer,c=this.stacks,d,e,f=this.stackTotalGroup;if(!f)this.stackTotalGroup=f=b.g("stack-labels").attr({visibility:"visible",zIndex:6}).add();f.translate(a.plotLeft,a.plotTop);for(d in c)for(e in a=c[d],a)a[e].render(f)};L.prototype.setStackedPoints=
function(){if(this.options.stacking&&!(this.visible!==!0&&this.chart.options.chart.ignoreHiddenSeries!==!1)){var a=this.processedXData,b=this.processedYData,c=[],d=b.length,e=this.options,f=e.threshold,g=e.stack,e=e.stacking,h=this.stackKey,i="-"+h,k=this.negStacks,j=this.yAxis,l=j.stacks,m=j.oldStacks,n,p,u,o,q,x;for(o=0;o<d;o++){q=a[o];x=b[o];u=this.index+","+o;p=(n=k&&x<f)?i:h;l[p]||(l[p]={});if(!l[p][q])m[p]&&m[p][q]?(l[p][q]=m[p][q],l[p][q].total=null):l[p][q]=new Rb(j,j.options.stackLabels,
n,q,g);p=l[p][q];p.points[u]=[p.cum||0];e==="percent"?(n=n?h:i,k&&l[n]&&l[n][q]?(n=l[n][q],p.total=n.total=w(n.total,p.total)+N(x)||0):p.total=ga(p.total+(N(x)||0))):p.total=ga(p.total+(x||0));p.cum=(p.cum||0)+(x||0);p.points[u].push(p.cum);c[o]=p.cum}if(e==="percent")j.usePercentage=!0;this.stackedYData=c;j.oldStacks={}}};L.prototype.setPercentStacks=function(){var a=this,b=a.stackKey,c=a.yAxis.stacks,d=a.processedXData;q([b,"-"+b],function(b){var e;for(var f=d.length,g,h;f--;)if(g=d[f],e=(h=c[b]&&
c[b][g])&&h.points[a.index+","+f],g=e)h=h.total?100/h.total:0,g[0]=ga(g[0]*h),g[1]=ga(g[1]*h),a.stackedYData[f]=g[1]})};v(va.prototype,{addSeries:function(a,b,c){var d,e=this;a&&(b=o(b,!0),K(e,"addSeries",{options:a},function(){d=e.initSeries(a);e.isDirtyLegend=!0;e.linkSeries();b&&e.redraw(c)}));return d},addAxis:function(a,b,c,d){var e=b?"xAxis":"yAxis",f=this.options;new F(this,y(a,{index:this[e].length,isX:b}));f[e]=la(f[e]||{});f[e].push(a);o(c,!0)&&this.redraw(d)},showLoading:function(a){var b=
this.options,c=this.loadingDiv,d=b.loading;if(!c)this.loadingDiv=c=Y(Ta,{className:"highcharts-loading"},v(d.style,{zIndex:10,display:X}),this.container),this.loadingSpan=Y("span",null,d.labelStyle,c);this.loadingSpan.innerHTML=a||b.lang.loading;if(!this.loadingShown)E(c,{opacity:0,display:"",left:this.plotLeft+"px",top:this.plotTop+"px",width:this.plotWidth+"px",height:this.plotHeight+"px"}),ob(c,{opacity:d.style.opacity},{duration:d.showDuration||0}),this.loadingShown=!0},hideLoading:function(){var a=
this.options,b=this.loadingDiv;b&&ob(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){E(b,{display:X})}});this.loadingShown=!1}});v(za.prototype,{update:function(a,b,c){var d=this,e=d.series,f=d.graphic,g,h=e.data,i=e.chart,k=e.options,b=o(b,!0);d.firePointEvent("update",{options:a},function(){d.applyOptions(a);if(ea(a)){e.getAttribs();if(f)a&&a.marker&&a.marker.symbol?d.graphic=f.destroy():f.attr(d.pointAttr[d.state||""]);if(a&&a.dataLabels&&d.dataLabel)d.dataLabel=d.dataLabel.destroy()}g=
wa(d,h);e.updateParallelArrays(d,g);k.data[g]=d.options;e.isDirty=e.isDirtyData=!0;if(!e.fixedBox&&e.hasCartesianSeries)i.isDirtyBox=!0;k.legendType==="point"&&i.legend.destroyItem(d);b&&i.redraw(c)})},remove:function(a,b){var c=this,d=c.series,e=d.points,f=d.chart,g,h=d.data;Ya(b,f);a=o(a,!0);c.firePointEvent("remove",null,function(){g=wa(c,h);h.length===e.length&&e.splice(g,1);h.splice(g,1);d.options.data.splice(g,1);d.updateParallelArrays(c,"splice",g,1);c.destroy();d.isDirty=!0;d.isDirtyData=
!0;a&&f.redraw()})}});v(L.prototype,{addPoint:function(a,b,c,d){var e=this.options,f=this.data,g=this.graph,h=this.area,i=this.chart,k=this.xAxis&&this.xAxis.names,j=g&&g.shift||0,l=e.data,m,n=this.xData;Ya(d,i);c&&q([g,h,this.graphNeg,this.areaNeg],function(a){if(a)a.shift=j+1});if(h)h.isArea=!0;b=o(b,!0);d={series:this};this.pointClass.prototype.applyOptions.apply(d,[a]);g=d.x;h=n.length;if(this.requireSorting&&g<n[h-1])for(m=!0;h&&n[h-1]>g;)h--;this.updateParallelArrays(d,"splice",h,0,0);this.updateParallelArrays(d,
h);if(k)k[g]=d.name;l.splice(h,0,a);m&&(this.data.splice(h,0,null),this.processData());e.legendType==="point"&&this.generatePoints();c&&(f[0]&&f[0].remove?f[0].remove(!1):(f.shift(),this.updateParallelArrays(d,"shift"),l.shift()));this.isDirtyData=this.isDirty=!0;b&&(this.getAttribs(),i.redraw())},remove:function(a,b){var c=this,d=c.chart,a=o(a,!0);if(!c.isRemoving)c.isRemoving=!0,K(c,"remove",null,function(){c.destroy();d.isDirtyLegend=d.isDirtyBox=!0;d.linkSeries();a&&d.redraw(b)});c.isRemoving=
!1},update:function(a,b){var c=this.chart,d=this.type,e=C[d].prototype,f,a=y(this.userOptions,{animation:!1,index:this.index,pointStart:this.xData[0]},{data:this.options.data},a);this.remove(!1);for(f in e)e.hasOwnProperty(f)&&(this[f]=r);v(this,C[a.type||d].prototype);this.init(c,a);o(b,!0)&&c.redraw(!1)}});v(F.prototype,{update:function(a,b){var c=this.chart,a=c.options[this.coll][this.options.index]=y(this.userOptions,a);this.destroy(!0);this._addedPlotLB=r;this.init(c,v(a,{events:r}));c.isDirtyBox=
!0;o(b,!0)&&c.redraw()},remove:function(a){for(var b=this.chart,c=this.coll,d=this.series,e=d.length;e--;)d[e]&&d[e].remove(!1);oa(b.axes,this);oa(b[c],this);b.options[c].splice(this.options.index,1);q(b[c],function(a,b){a.options.index=b});this.destroy();b.isDirtyBox=!0;o(a,!0)&&b.redraw()},setTitle:function(a,b){this.update({title:a},b)},setCategories:function(a,b){this.update({categories:a},b)}});var Aa=fa(L);C.line=Aa;T.area=y(M,{threshold:0});var ta=fa(L,{type:"area",getSegments:function(){var a=
[],b=[],c=[],d=this.xAxis,e=this.yAxis,f=e.stacks[this.stackKey],g={},h,i,k=this.points,j=this.options.connectNulls,l,m,n;if(this.options.stacking&&!this.cropped){for(m=0;m<k.length;m++)g[k[m].x]=k[m];for(n in f)f[n].total!==null&&c.push(+n);c.sort(function(a,b){return a-b});q(c,function(a){if(!j||g[a]&&g[a].y!==null)g[a]?b.push(g[a]):(h=d.translate(a),l=f[a].percent?f[a].total?f[a].cum*100/f[a].total:0:f[a].cum,i=e.toPixels(l,!0),b.push({y:null,plotX:h,clientX:h,plotY:i,yBottom:i,onMouseOver:ma}))});
b.length&&a.push(b)}else L.prototype.getSegments.call(this),a=this.segments;this.segments=a},getSegmentPath:function(a){var b=L.prototype.getSegmentPath.call(this,a),c=[].concat(b),d,e=this.options;d=b.length;var f=this.yAxis.getThreshold(e.threshold),g;d===3&&c.push("L",b[1],b[2]);if(e.stacking&&!this.closedStacks)for(d=a.length-1;d>=0;d--)g=o(a[d].yBottom,f),d<a.length-1&&e.step&&c.push(a[d+1].plotX,g),c.push(a[d].plotX,g);else this.closeSegment(c,a,f);this.areaPath=this.areaPath.concat(c);return b},
closeSegment:function(a,b,c){a.push("L",b[b.length-1].plotX,c,"L",b[0].plotX,c)},drawGraph:function(){this.areaPath=[];L.prototype.drawGraph.apply(this);var a=this,b=this.areaPath,c=this.options,d=c.negativeColor,e=c.negativeFillColor,f=[["area",this.color,c.fillColor]];(d||e)&&f.push(["areaNeg",d,e]);q(f,function(d){var e=d[0],f=a[e];f?f.animate({d:b}):a[e]=a.chart.renderer.path(b).attr({fill:o(d[2],Fa(d[1]).setOpacity(o(c.fillOpacity,0.75)).get()),zIndex:0}).add(a.group)})},drawLegendSymbol:Q.drawRectangle});
C.area=ta;T.spline=y(M);Aa=fa(L,{type:"spline",getPointSpline:function(a,b,c){var d=b.plotX,e=b.plotY,f=a[c-1],g=a[c+1],h,i,k,j;if(f&&g){a=f.plotY;k=g.plotX;var g=g.plotY,l;h=(1.5*d+f.plotX)/2.5;i=(1.5*e+a)/2.5;k=(1.5*d+k)/2.5;j=(1.5*e+g)/2.5;l=(j-i)*(k-d)/(k-h)+e-j;i+=l;j+=l;i>a&&i>e?(i=w(a,e),j=2*e-i):i<a&&i<e&&(i=z(a,e),j=2*e-i);j>g&&j>e?(j=w(g,e),i=2*e-j):j<g&&j<e&&(j=z(g,e),i=2*e-j);b.rightContX=k;b.rightContY=j}c?(b=["C",f.rightContX||f.plotX,f.rightContY||f.plotY,h||d,i||e,d,e],f.rightContX=
f.rightContY=null):b=["M",d,e];return b}});C.spline=Aa;T.areaspline=y(T.area);ta=ta.prototype;Aa=fa(Aa,{type:"areaspline",closedStacks:!0,getSegmentPath:ta.getSegmentPath,closeSegment:ta.closeSegment,drawGraph:ta.drawGraph,drawLegendSymbol:Q.drawRectangle});C.areaspline=Aa;T.column=y(M,{borderColor:"#FFFFFF",borderRadius:0,groupPadding:0.2,marker:null,pointPadding:0.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{brightness:0.1,shadow:!1,halo:!1},select:{color:"#C0C0C0",borderColor:"#000000",
shadow:!1}},dataLabels:{align:null,verticalAlign:null,y:null},stickyTracking:!1,tooltip:{distance:6},threshold:0});Aa=fa(L,{type:"column",pointAttrToOptions:{stroke:"borderColor",fill:"color",r:"borderRadius"},cropShoulder:0,trackerGroups:["group","dataLabelsGroup"],negStacks:!0,init:function(){L.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&q(b.series,function(b){if(b.type===a.type)b.isDirty=!0})},getColumnMetrics:function(){var a=this,b=a.options,c=a.xAxis,d=a.yAxis,e=
c.reversed,f,g={},h,i=0;b.grouping===!1?i=1:q(a.chart.series,function(b){var c=b.options,e=b.yAxis;if(b.type===a.type&&b.visible&&d.len===e.len&&d.pos===e.pos)c.stacking?(f=b.stackKey,g[f]===r&&(g[f]=i++),h=g[f]):c.grouping!==!1&&(h=i++),b.columnIndex=h});var c=z(N(c.transA)*(c.ordinalSlope||b.pointRange||c.closestPointRange||c.tickInterval||1),c.len),k=c*b.groupPadding,j=(c-2*k)/i,l=b.pointWidth,b=t(l)?(j-l)/2:j*b.pointPadding,l=o(l,j-2*b);return a.columnMetrics={width:l,offset:b+(k+((e?i-(a.columnIndex||
0):a.columnIndex)||0)*j-c/2)*(e?-1:1)}},translate:function(){var a=this,b=a.chart,c=a.options,d=a.borderWidth=o(c.borderWidth,a.activePointCount>0.5*a.xAxis.len?0:1),e=a.yAxis,f=a.translatedThreshold=e.getThreshold(c.threshold),g=o(c.minPointLength,5),c=a.getColumnMetrics(),h=c.width,i=a.barW=Va(w(h,1+2*d)),k=a.pointXOffset=c.offset,j=-(d%2?0.5:0),l=d%2?0.5:1;b.renderer.isVML&&b.inverted&&(l+=1);L.prototype.translate.apply(a);q(a.points,function(c){var d=o(c.yBottom,f),p=z(w(-999-d,c.plotY),e.len+
999+d),u=c.plotX+k,q=i,r=z(p,d),x;x=w(p,d)-r;N(x)<g&&g&&(x=g,r=s(N(r-f)>g?d-g:f-(e.translate(c.y,0,1,0,1)<=f?g:0)));c.barX=u;c.pointWidth=h;c.tooltipPos=b.inverted?[e.len-p,a.xAxis.len-u-q/2]:[u+q/2,p];d=N(u)<0.5;q=s(u+q)+j;u=s(u)+j;q-=u;p=N(r)<0.5;x=s(r+x)+l;r=s(r)+l;x-=r;d&&(u+=1,q-=1);p&&(r-=1,x+=1);c.shapeType="rect";c.shapeArgs={x:u,y:r,width:q,height:x}})},getSymbol:ma,drawLegendSymbol:Q.drawRectangle,drawGraph:ma,drawPoints:function(){var a=this,b=this.chart,c=a.options,d=b.renderer,e=c.animationLimit||
250,f,g,h;q(a.points,function(i){var k=i.plotY,j=i.graphic;if(k!==r&&!isNaN(k)&&i.y!==null)f=i.shapeArgs,h=t(a.borderWidth)?{"stroke-width":a.borderWidth}:{},g=i.pointAttr[i.selected?"select":""]||a.pointAttr[""],j?(fb(j),j.attr(h)[b.pointCount<e?"animate":"attr"](y(f))):i.graphic=d[i.shapeType](f).attr(g).attr(h).add(a.group).shadow(c.shadow,null,c.stacking&&!c.borderRadius);else if(j)i.graphic=j.destroy()})},animate:function(a){var b=this.yAxis,c=this.options,d=this.chart.inverted,e={};if(ba)a?
(e.scaleY=0.001,a=z(b.pos+b.len,w(b.pos,b.toPixels(c.threshold))),d?e.translateX=a-b.len:e.translateY=a,this.group.attr(e)):(e.scaleY=1,e[d?"translateX":"translateY"]=b.pos,this.group.animate(e,this.options.animation),this.animate=null)},remove:function(){var a=this,b=a.chart;b.hasRendered&&q(b.series,function(b){if(b.type===a.type)b.isDirty=!0});L.prototype.remove.apply(a,arguments)}});C.column=Aa;T.bar=y(T.column);ta=fa(Aa,{type:"bar",inverted:!0});C.bar=ta;T.scatter=y(M,{lineWidth:0,tooltip:{headerFormat:'<span style="color:{series.color}">●</span> <span style="font-size: 10px;"> {series.name}</span><br/>',
pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"},stickyTracking:!1});ta=fa(L,{type:"scatter",sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["markerGroup"],takeOrdinalPosition:!1,singularTooltips:!0,drawGraph:function(){this.options.lineWidth&&L.prototype.drawGraph.call(this)}});C.scatter=ta;T.pie=y(M,{borderColor:"#FFFFFF",borderWidth:1,center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{distance:30,enabled:!0,format:"{point.name}"},ignoreHiddenPoint:!0,legendType:"point",
marker:null,size:null,showInLegend:!1,slicedOffset:10,states:{hover:{brightness:0.1,shadow:!1}},stickyTracking:!1,tooltip:{followPointer:!0}});M={type:"pie",isCartesian:!1,pointClass:fa(za,{init:function(){za.prototype.init.apply(this,arguments);var a=this,b;if(a.y<0)a.y=null;v(a,{visible:a.visible!==!1,name:o(a.name,"Slice")});b=function(b){a.slice(b.type==="select")};A(a,"select",b);A(a,"unselect",b);return a},setVisible:function(a){var b=this,c=b.series,d=c.chart;b.visible=b.options.visible=a=
a===r?!b.visible:a;c.options.data[wa(b,c.data)]=b.options;q(["graphic","dataLabel","connector","shadowGroup"],function(c){if(b[c])b[c][a?"show":"hide"](!0)});b.legendItem&&d.legend.colorizeItem(b,a);if(!c.isDirty&&c.options.ignoreHiddenPoint)c.isDirty=!0,d.redraw()},slice:function(a,b,c){var d=this.series;Ya(c,d.chart);o(b,!0);this.sliced=this.options.sliced=a=t(a)?a:!this.sliced;d.options.data[wa(this,d.data)]=this.options;a=a?this.slicedTranslation:{translateX:0,translateY:0};this.graphic.animate(a);
this.shadowGroup&&this.shadowGroup.animate(a)},haloPath:function(a){var b=this.shapeArgs,c=this.series.chart;return this.series.chart.renderer.symbols.arc(c.plotLeft+b.x,c.plotTop+b.y,b.r+a,b.r+a,{innerR:this.shapeArgs.r,start:b.start,end:b.end})}}),requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],axisTypes:[],pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color"},singularTooltips:!0,getColor:ma,animate:function(a){var b=this,c=b.points,d=
b.startAngleRad;if(!a)q(c,function(a){var c=a.graphic,a=a.shapeArgs;c&&(c.attr({r:b.center[3]/2,start:d,end:d}),c.animate({r:a.r,start:a.start,end:a.end},b.options.animation))}),b.animate=null},setData:function(a,b,c,d){L.prototype.setData.call(this,a,!1,c,d);this.processData();this.generatePoints();o(b,!0)&&this.chart.redraw(c)},generatePoints:function(){var a,b=0,c,d,e,f=this.options.ignoreHiddenPoint;L.prototype.generatePoints.call(this);c=this.points;d=c.length;for(a=0;a<d;a++)e=c[a],b+=f&&!e.visible?
0:e.y;this.total=b;for(a=0;a<d;a++)e=c[a],e.percentage=b>0?e.y/b*100:0,e.total=b},translate:function(a){this.generatePoints();var b=0,c=this.options,d=c.slicedOffset,e=d+c.borderWidth,f,g,h,i=c.startAngle||0,k=this.startAngleRad=qa/180*(i-90),i=(this.endAngleRad=qa/180*(o(c.endAngle,i+360)-90))-k,j=this.points,l=c.dataLabels.distance,c=c.ignoreHiddenPoint,m,n=j.length,p;if(!a)this.center=a=this.getCenter();this.getX=function(b,c){h=U.asin(z((b-a[1])/(a[2]/2+l),1));return a[0]+(c?-1:1)*ca(h)*(a[2]/
2+l)};for(m=0;m<n;m++){p=j[m];f=k+b*i;if(!c||p.visible)b+=p.percentage/100;g=k+b*i;p.shapeType="arc";p.shapeArgs={x:a[0],y:a[1],r:a[2]/2,innerR:a[3]/2,start:s(f*1E3)/1E3,end:s(g*1E3)/1E3};h=(g+f)/2;h>1.5*qa?h-=2*qa:h<-qa/2&&(h+=2*qa);p.slicedTranslation={translateX:s(ca(h)*d),translateY:s(ha(h)*d)};f=ca(h)*a[2]/2;g=ha(h)*a[2]/2;p.tooltipPos=[a[0]+f*0.7,a[1]+g*0.7];p.half=h<-qa/2||h>qa/2?1:0;p.angle=h;e=z(e,l/2);p.labelPos=[a[0]+f+ca(h)*l,a[1]+g+ha(h)*l,a[0]+f+ca(h)*e,a[1]+g+ha(h)*e,a[0]+f,a[1]+g,
l<0?"center":p.half?"right":"left",h]}},drawGraph:null,drawPoints:function(){var a=this,b=a.chart.renderer,c,d,e=a.options.shadow,f,g;if(e&&!a.shadowGroup)a.shadowGroup=b.g("shadow").add(a.group);q(a.points,function(h){d=h.graphic;g=h.shapeArgs;f=h.shadowGroup;if(e&&!f)f=h.shadowGroup=b.g("shadow").add(a.shadowGroup);c=h.sliced?h.slicedTranslation:{translateX:0,translateY:0};f&&f.attr(c);d?d.animate(v(g,c)):h.graphic=d=b[h.shapeType](g).setRadialReference(a.center).attr(h.pointAttr[h.selected?"select":
""]).attr({"stroke-linejoin":"round"}).attr(c).add(a.group).shadow(e,f);h.visible!==void 0&&h.setVisible(h.visible)})},sortByAngle:function(a,b){a.sort(function(a,d){return a.angle!==void 0&&(d.angle-a.angle)*b})},drawLegendSymbol:Q.drawRectangle,getCenter:da.getCenter,getSymbol:ma};M=fa(L,M);C.pie=M;L.prototype.drawDataLabels=function(){var a=this,b=a.options,c=b.cursor,d=b.dataLabels,e=a.points,f,g,h,i;if(d.enabled||a._hasPointLabels)a.dlProcessOptions&&a.dlProcessOptions(d),i=a.plotGroup("dataLabelsGroup",
"data-labels","hidden",d.zIndex||6),!a.hasRendered&&o(d.defer,!0)&&(i.attr({opacity:0}),A(a,"afterAnimate",function(){a.dataLabelsGroup.show()[b.animation?"animate":"attr"]({opacity:1},{duration:200})})),g=d,q(e,function(b){var e,l=b.dataLabel,m,n,p=b.connector,u=!0;f=b.options&&b.options.dataLabels;e=o(f&&f.enabled,g.enabled);if(l&&!e)b.dataLabel=l.destroy();else if(e){d=y(g,f);e=d.rotation;m=b.getLabelConfig();h=d.format?Ja(d.format,m):d.formatter.call(m,d);d.style.color=o(d.color,d.style.color,
a.color,"black");if(l)if(t(h))l.attr({text:h}),u=!1;else{if(b.dataLabel=l=l.destroy(),p)b.connector=p.destroy()}else if(t(h)){l={fill:d.backgroundColor,stroke:d.borderColor,"stroke-width":d.borderWidth,r:d.borderRadius||0,rotation:e,padding:d.padding,zIndex:1};for(n in l)l[n]===r&&delete l[n];l=b.dataLabel=a.chart.renderer[e?"text":"label"](h,0,-999,null,null,null,d.useHTML).attr(l).css(v(d.style,c&&{cursor:c})).add(i).shadow(d.shadow)}l&&a.alignDataLabel(b,l,d,null,u)}})};L.prototype.alignDataLabel=
function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=o(a.plotX,-999),i=o(a.plotY,-999),k=b.getBBox();if(a=this.visible&&(a.series.forceDL||f.isInsidePlot(h,s(i),g)||d&&f.isInsidePlot(h,g?d.x+1:d.y+d.height-1,g)))d=v({x:g?f.plotWidth-i:h,y:s(g?f.plotHeight-h:i),width:0,height:0},d),v(c,{width:k.width,height:k.height}),c.rotation?(g={align:c.align,x:d.x+c.x+d.width/2,y:d.y+c.y+d.height/2},b[e?"attr":"animate"](g)):(b.align(c,null,d),g=b.alignAttr,o(c.overflow,"justify")==="justify"?this.justifyDataLabel(b,
c,g,k,d,e):o(c.crop,!0)&&(a=f.isInsidePlot(g.x,g.y)&&f.isInsidePlot(g.x+k.width,g.y+k.height)));if(!a)b.attr({y:-999}),b.placed=!1};L.prototype.justifyDataLabel=function(a,b,c,d,e,f){var g=this.chart,h=b.align,i=b.verticalAlign,k,j;k=c.x;if(k<0)h==="right"?b.align="left":b.x=-k,j=!0;k=c.x+d.width;if(k>g.plotWidth)h==="left"?b.align="right":b.x=g.plotWidth-k,j=!0;k=c.y;if(k<0)i==="bottom"?b.verticalAlign="top":b.y=-k,j=!0;k=c.y+d.height;if(k>g.plotHeight)i==="top"?b.verticalAlign="bottom":b.y=g.plotHeight-
k,j=!0;if(j)a.placed=!f,a.align(b,null,e)};if(C.pie)C.pie.prototype.drawDataLabels=function(){var a=this,b=a.data,c,d=a.chart,e=a.options.dataLabels,f=o(e.connectorPadding,10),g=o(e.connectorWidth,1),h=d.plotWidth,d=d.plotHeight,i,k,j=o(e.softConnector,!0),l=e.distance,m=a.center,n=m[2]/2,p=m[1],u=l>0,r,G,x,t,v=[[],[]],y,z,A,B,D,C=[0,0,0,0],J=function(a,b){return b.y-a.y};if(a.visible&&(e.enabled||a._hasPointLabels)){L.prototype.drawDataLabels.apply(a);q(b,function(a){a.dataLabel&&a.visible&&v[a.half].push(a)});
for(B=0;!t&&b[B];)t=b[B]&&b[B].dataLabel&&(b[B].dataLabel.getBBox().height||21),B++;for(B=2;B--;){var b=[],H=[],E=v[B],I=E.length,F;a.sortByAngle(E,B-0.5);if(l>0){for(D=p-n-l;D<=p+n+l;D+=t)b.push(D);G=b.length;if(I>G){c=[].concat(E);c.sort(J);for(D=I;D--;)c[D].rank=D;for(D=I;D--;)E[D].rank>=G&&E.splice(D,1);I=E.length}for(D=0;D<I;D++){c=E[D];x=c.labelPos;c=9999;var M,K;for(K=0;K<G;K++)M=N(b[K]-x[1]),M<c&&(c=M,F=K);if(F<D&&b[D]!==null)F=D;else for(G<I-D+F&&b[D]!==null&&(F=G-I+D);b[F]===null;)F++;H.push({i:F,
y:b[F]});b[F]=null}H.sort(J)}for(D=0;D<I;D++){c=E[D];x=c.labelPos;r=c.dataLabel;A=c.visible===!1?"hidden":"visible";c=x[1];if(l>0){if(G=H.pop(),F=G.i,z=G.y,c>z&&b[F+1]!==null||c<z&&b[F-1]!==null)z=c}else z=c;y=e.justify?m[0]+(B?-1:1)*(n+l):a.getX(F===0||F===b.length-1?c:z,B);r._attr={visibility:A,align:x[6]};r._pos={x:y+e.x+({left:f,right:-f}[x[6]]||0),y:z+e.y-10};r.connX=y;r.connY=z;if(this.options.size===null)G=r.width,y-G<f?C[3]=w(s(G-y+f),C[3]):y+G>h-f&&(C[1]=w(s(y+G-h+f),C[1])),z-t/2<0?C[0]=
w(s(-z+t/2),C[0]):z+t/2>d&&(C[2]=w(s(z+t/2-d),C[2]))}}if(Ba(C)===0||this.verifyDataLabelOverflow(C))this.placeDataLabels(),u&&g&&q(this.points,function(b){i=b.connector;x=b.labelPos;if((r=b.dataLabel)&&r._pos)A=r._attr.visibility,y=r.connX,z=r.connY,k=j?["M",y+(x[6]==="left"?5:-5),z,"C",y,z,2*x[2]-x[4],2*x[3]-x[5],x[2],x[3],"L",x[4],x[5]]:["M",y+(x[6]==="left"?5:-5),z,"L",x[2],x[3],"L",x[4],x[5]],i?(i.animate({d:k}),i.attr("visibility",A)):b.connector=i=a.chart.renderer.path(k).attr({"stroke-width":g,
stroke:e.connectorColor||b.color||"#606060",visibility:A}).add(a.dataLabelsGroup);else if(i)b.connector=i.destroy()})}},C.pie.prototype.placeDataLabels=function(){q(this.points,function(a){var a=a.dataLabel,b;if(a)(b=a._pos)?(a.attr(a._attr),a[a.moved?"animate":"attr"](b),a.moved=!0):a&&a.attr({y:-999})})},C.pie.prototype.alignDataLabel=ma,C.pie.prototype.verifyDataLabelOverflow=function(a){var b=this.center,c=this.options,d=c.center,e=c=c.minSize||80,f;d[0]!==null?e=w(b[2]-w(a[1],a[3]),c):(e=w(b[2]-
a[1]-a[3],c),b[0]+=(a[3]-a[1])/2);d[1]!==null?e=w(z(e,b[2]-w(a[0],a[2])),c):(e=w(z(e,b[2]-a[0]-a[2]),c),b[1]+=(a[0]-a[2])/2);e<b[2]?(b[2]=e,this.translate(b),q(this.points,function(a){if(a.dataLabel)a.dataLabel._pos=null}),this.drawDataLabels&&this.drawDataLabels()):f=!0;return f};if(C.column)C.column.prototype.alignDataLabel=function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=a.dlBox||a.shapeArgs,i=a.below||a.plotY>o(this.translatedThreshold,f.plotSizeY),k=o(c.inside,!!this.options.stacking);if(h&&
(d=y(h),g&&(d={x:f.plotWidth-d.y-d.height,y:f.plotHeight-d.x-d.width,width:d.height,height:d.width}),!k))g?(d.x+=i?0:d.width,d.width=0):(d.y+=i?d.height:0,d.height=0);c.align=o(c.align,!g||k?"center":i?"right":"left");c.verticalAlign=o(c.verticalAlign,g||k?"middle":i?"top":"bottom");L.prototype.alignDataLabel.call(this,a,b,c,d,e)};var cb=P.TrackerMixin={drawTrackerPoint:function(){var a=this,b=a.chart,c=b.pointer,d=a.options.cursor,e=d&&{cursor:d},f=function(c){var d=c.target,e;if(b.hoverSeries!==
a)a.onMouseOver();for(;d&&!e;)e=d.point,d=d.parentNode;if(e!==r&&e!==b.hoverPoint)e.onMouseOver(c)};q(a.points,function(a){if(a.graphic)a.graphic.element.point=a;if(a.dataLabel)a.dataLabel.element.point=a});if(!a._hasTracking)q(a.trackerGroups,function(b){if(a[b]&&(a[b].addClass("highcharts-tracker").on("mouseover",f).on("mouseout",function(a){c.onTrackerMouseOut(a)}).css(e),ab))a[b].on("touchstart",f)}),a._hasTracking=!0},drawTrackerGraph:function(){var a=this,b=a.options,c=b.trackByArea,d=[].concat(c?
a.areaPath:a.graphPath),e=d.length,f=a.chart,g=f.pointer,h=f.renderer,i=f.options.tooltip.snap,k=a.tracker,j=b.cursor,l=j&&{cursor:j},j=a.singlePoints,m,n=function(){if(f.hoverSeries!==a)a.onMouseOver()},p="rgba(192,192,192,"+(ba?1.0E-4:0.002)+")";if(e&&!c)for(m=e+1;m--;)d[m]==="M"&&d.splice(m+1,0,d[m+1]-i,d[m+2],"L"),(m&&d[m]==="M"||m===e)&&d.splice(m,0,"L",d[m-2]+i,d[m-1]);for(m=0;m<j.length;m++)e=j[m],d.push("M",e.plotX-i,e.plotY,"L",e.plotX+i,e.plotY);k?k.attr({d:d}):(a.tracker=h.path(d).attr({"stroke-linejoin":"round",
visibility:a.visible?"visible":"hidden",stroke:p,fill:c?p:X,"stroke-width":b.lineWidth+(c?0:2*i),zIndex:2}).add(a.group),q([a.tracker,a.markerGroup],function(a){a.addClass("highcharts-tracker").on("mouseover",n).on("mouseout",function(a){g.onTrackerMouseOut(a)}).css(l);if(ab)a.on("touchstart",n)}))}};if(C.column)Aa.prototype.drawTracker=cb.drawTrackerPoint;if(C.pie)C.pie.prototype.drawTracker=cb.drawTrackerPoint;if(C.scatter)ta.prototype.drawTracker=cb.drawTrackerPoint;if(C.gauge)C.gauge.prototype.drawTracker=
cb.drawTrackerPoint;v(pb.prototype,{setItemEvents:function(a,b,c,d,e){var f=this;(c?b:a.legendGroup).on("mouseover",function(){a.setState("hover");b.css(f.options.itemHoverStyle)}).on("mouseout",function(){b.css(a.visible?d:e);a.setState()}).on("click",function(b){var c=function(){a.setVisible()},b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,c):K(a,"legendItemClick",b,c)})},createCheckboxForItem:function(a){a.checkbox=Y("input",{type:"checkbox",checked:a.selected,defaultChecked:a.selected},
this.options.itemCheckboxStyle,this.chart.container);A(a.checkbox,"click",function(b){K(a,"checkboxClick",{checked:b.target.checked},function(){a.select()})})}});I.legend.itemStyle.cursor="pointer";v(va.prototype,{showResetZoom:function(){var a=this,b=I.lang,c=a.options.chart.resetZoomButton,d=c.theme,e=d.states,f=c.relativeTo==="chart"?null:"plotBox";this.resetZoomButton=a.renderer.button(b.resetZoom,null,null,function(){a.zoomOut()},d,e&&e.hover).attr({align:c.position.align,title:b.resetZoomTitle}).add().align(c.position,
!1,f)},zoomOut:function(){var a=this;K(a,"selection",{resetSelection:!0},function(){a.zoom()})},zoom:function(a){var b,c=this.pointer,d=!1,e;!a||a.resetSelection?q(this.axes,function(a){b=a.zoom()}):q(a.xAxis.concat(a.yAxis),function(a){var e=a.axis,h=e.isXAxis;if(c[h?"zoomX":"zoomY"]||c[h?"pinchX":"pinchY"])b=e.zoom(a.min,a.max),e.displayBtn&&(d=!0)});e=this.resetZoomButton;if(d&&!e)this.showResetZoom();else if(!d&&ea(e))this.resetZoomButton=e.destroy();b&&this.redraw(o(this.options.chart.animation,
a&&a.animation,this.pointCount<100))},pan:function(a,b){var c=this,d=c.hoverPoints,e;d&&q(d,function(a){a.setState()});q(b==="xy"?[1,0]:[1],function(b){var d=a[b?"chartX":"chartY"],h=c[b?"xAxis":"yAxis"][0],i=c[b?"mouseDownX":"mouseDownY"],k=(h.pointRange||0)/2,j=h.getExtremes(),l=h.toValue(i-d,!0)+k,i=h.toValue(i+c[b?"plotWidth":"plotHeight"]-d,!0)-k;h.series.length&&l>z(j.dataMin,j.min)&&i<w(j.dataMax,j.max)&&(h.setExtremes(l,i,!1,!1,{trigger:"pan"}),e=!0);c[b?"mouseDownX":"mouseDownY"]=d});e&&
c.redraw(!1);E(c.container,{cursor:"move"})}});v(za.prototype,{select:function(a,b){var c=this,d=c.series,e=d.chart,a=o(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=c.options.selected=a;d.options.data[wa(c,d.data)]=c.options;c.setState(a&&"select");b||q(e.getSelectedPoints(),function(a){if(a.selected&&a!==c)a.selected=a.options.selected=!1,d.options.data[wa(a,d.data)]=a.options,a.setState(""),a.firePointEvent("unselect")})})},onMouseOver:function(a){var b=
this.series,c=b.chart,d=c.tooltip,e=c.hoverPoint;if(e&&e!==this)e.onMouseOut();this.firePointEvent("mouseOver");d&&(!d.shared||b.noSharedTooltip)&&d.refresh(this,a);this.setState("hover");c.hoverPoint=this},onMouseOut:function(){var a=this.series.chart,b=a.hoverPoints;if(!b||wa(this,b)===-1)this.firePointEvent("mouseOut"),this.setState(),a.hoverPoint=null},importEvents:function(){if(!this.hasImportedEvents){var a=y(this.series.options.point,this.options).events,b;this.events=a;for(b in a)A(this,b,
a[b]);this.hasImportedEvents=!0}},setState:function(a,b){var c=this.plotX,d=this.plotY,e=this.series,f=e.options.states,g=T[e.type].marker&&e.options.marker,h=g&&!g.enabled,i=g&&g.states[a],k=i&&i.enabled===!1,j=e.stateMarkerGraphic,l=this.marker||{},m=e.chart,n=e.halo,p,a=a||"";p=this.pointAttr[a]||e.pointAttr[a];if(!(a===this.state&&!b||this.selected&&a!=="select"||f[a]&&f[a].enabled===!1||a&&(k||h&&i.enabled===!1)||a&&l.states&&l.states[a]&&l.states[a].enabled===!1)){if(this.graphic)g=g&&this.graphic.symbolName&&
p.r,this.graphic.attr(y(p,g?{x:c-g,y:d-g,width:2*g,height:2*g}:{})),j&&j.hide();else{if(a&&i)if(g=i.radius,l=l.symbol||e.symbol,j&&j.currentSymbol!==l&&(j=j.destroy()),j)j[b?"animate":"attr"]({x:c-g,y:d-g});else if(l)e.stateMarkerGraphic=j=m.renderer.symbol(l,c-g,d-g,2*g,2*g).attr(p).add(e.markerGroup),j.currentSymbol=l;if(j)j[a&&m.isInsidePlot(c,d,m.inverted)?"show":"hide"]()}if((c=f[a]&&f[a].halo)&&c.size){if(!n)e.halo=n=m.renderer.path().add(e.seriesGroup);n.attr(v({fill:Fa(this.color||e.color).setOpacity(c.opacity).get()},
c.attributes))[b?"animate":"attr"]({d:this.haloPath(c.size)})}else n&&n.attr({d:[]});this.state=a}},haloPath:function(a){var b=this.series.chart;return b.renderer.symbols.circle(b.plotLeft+this.plotX-a,b.plotTop+this.plotY-a,a*2,a*2)}});v(L.prototype,{onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&K(this,"mouseOver");this.setState("hover");a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;
if(d)d.onMouseOut();this&&a.events.mouseOut&&K(this,"mouseOut");c&&!a.stickyTracking&&(!c.shared||this.noSharedTooltip)&&c.hide();this.setState();b.hoverSeries=null},setState:function(a){var b=this.options,c=this.graph,d=this.graphNeg,e=b.states,b=b.lineWidth,a=a||"";if(this.state!==a)this.state=a,e[a]&&e[a].enabled===!1||(a&&(b=e[a].lineWidth||b+1),c&&!c.dashstyle&&(a={"stroke-width":b},c.attr(a),d&&d.attr(a)))},setVisible:function(a,b){var c=this,d=c.chart,e=c.legendItem,f,g=d.options.chart.ignoreHiddenSeries,
h=c.visible;f=(c.visible=a=c.userOptions.visible=a===r?!h:a)?"show":"hide";q(["group","dataLabelsGroup","markerGroup","tracker"],function(a){if(c[a])c[a][f]()});if(d.hoverSeries===c)c.onMouseOut();e&&d.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&q(d.series,function(a){if(a.options.stacking&&a.visible)a.isDirty=!0});q(c.linkedSeries,function(b){b.setVisible(a,!1)});if(g)d.isDirtyBox=!0;b!==!1&&d.redraw();K(c,f)},setTooltipPoints:function(a){var b=[],c,d,e=this.xAxis,f=e&&e.getExtremes(),
g=e?e.tooltipLen||e.len:this.chart.plotSizeX,h,i,k=[];if(!(this.options.enableMouseTracking===!1||this.singularTooltips)){if(a)this.tooltipPoints=null;q(this.segments||this.points,function(a){b=b.concat(a)});e&&e.reversed&&(b=b.reverse());this.orderTooltipPoints&&this.orderTooltipPoints(b);a=b.length;for(i=0;i<a;i++)if(e=b[i],c=e.x,c>=f.min&&c<=f.max){h=b[i+1];c=d===r?0:d+1;for(d=b[i+1]?z(w(0,S((e.clientX+(h?h.wrappedClientX||h.clientX:g))/2)),g):g;c>=0&&c<=d;)k[c++]=e}this.tooltipPoints=k}},show:function(){this.setVisible(!0)},
hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=a===r?!this.selected:a;if(this.checkbox)this.checkbox.checked=a;K(this,a?"select":"unselect")},drawTracker:cb.drawTrackerGraph});O(L.prototype,"init",function(a){var b;a.apply(this,Array.prototype.slice.call(arguments,1));(b=this.xAxis)&&b.options.ordinal&&A(this,"updatedData",function(){delete b.ordinalIndex})});O(F.prototype,"getTimeTicks",function(a,b,c,d,e,f,g,h){var i=0,k=0,j,l={},m,n,p,o=[],q=-Number.MAX_VALUE,s=this.options.tickPixelInterval;
if(!this.options.ordinal||!f||f.length<3||c===r)return a.call(this,b,c,d,e);for(n=f.length;k<n;k++){p=k&&f[k-1]>d;f[k]<c&&(i=k);if(k===n-1||f[k+1]-f[k]>g*5||p){if(f[k]>q){for(j=a.call(this,b,f[i],f[k],e);j.length&&j[0]<=q;)j.shift();j.length&&(q=j[j.length-1]);o=o.concat(j)}i=k+1}if(p)break}a=j.info;if(h&&a.unitRange<=H.hour){k=o.length-1;for(i=1;i<k;i++)(new Date(o[i]-La))[Ua]()!==(new Date(o[i-1]-La))[Ua]()&&(l[o[i]]="day",m=!0);m&&(l[o[0]]="day");a.higherRanks=l}o.info=a;if(h&&t(s)){var h=a=o.length,
k=[],x;for(m=[];h--;)i=this.translate(o[h]),x&&(m[h]=x-i),k[h]=x=i;m.sort();m=m[S(m.length/2)];m<s*0.6&&(m=null);h=o[a-1]>d?a-1:a;for(x=void 0;h--;)i=k[h],d=x-i,x&&d<s*0.8&&(m===null||d<m*0.8)?(l[o[h]]&&!l[o[h+1]]?(d=h+1,x=i):d=h,o.splice(d,1)):x=i}return o});v(F.prototype,{beforeSetTickPositions:function(){var a,b=[],c=!1,d,e=this.getExtremes(),f=e.min,e=e.max,g;if(this.options.ordinal){q(this.series,function(c,d){if(c.visible!==!1&&c.takeOrdinalPosition!==!1&&(b=b.concat(c.processedXData),a=b.length,
b.sort(function(a,b){return a-b}),a))for(d=a-1;d--;)b[d]===b[d+1]&&b.splice(d,1)});a=b.length;if(a>2){d=b[1]-b[0];for(g=a-1;g--&&!c;)b[g+1]-b[g]!==d&&(c=!0);if(!this.options.keepOrdinalPadding&&(b[0]-f>d||e-b[b.length-1]>d))c=!0}c?(this.ordinalPositions=b,c=this.val2lin(w(f,b[0]),!0),d=this.val2lin(z(e,b[b.length-1]),!0),this.ordinalSlope=e=(e-f)/(d-c),this.ordinalOffset=f-c*e):this.ordinalPositions=this.ordinalSlope=this.ordinalOffset=r}this.groupIntervalFactor=null},val2lin:function(a,b){var c=
this.ordinalPositions;if(c){var d=c.length,e,f;for(e=d;e--;)if(c[e]===a){f=e;break}for(e=d-1;e--;)if(a>c[e]||e===0){c=(a-c[e])/(c[e+1]-c[e]);f=e+c;break}return b?f:this.ordinalSlope*(f||0)+this.ordinalOffset}else return a},lin2val:function(a,b){var c=this.ordinalPositions;if(c){var d=this.ordinalSlope,e=this.ordinalOffset,f=c.length-1,g,h;if(b)a<0?a=c[0]:a>f?a=c[f]:(f=S(a),h=a-f);else for(;f--;)if(g=d*f+e,a>=g){d=d*(f+1)+e;h=(a-g)/(d-g);break}return h!==r&&c[f]!==r?c[f]+(h?h*(c[f+1]-c[f]):0):a}else return a},
getExtendedPositions:function(){var a=this.chart,b=this.series[0].currentDataGrouping,c=this.ordinalIndex,d=b?b.count+b.unitName:"raw",e=this.getExtremes(),f,g;if(!c)c=this.ordinalIndex={};if(!c[d])f={series:[],getExtremes:function(){return{min:e.dataMin,max:e.dataMax}},options:{ordinal:!0},val2lin:F.prototype.val2lin},q(this.series,function(c){g={xAxis:f,xData:c.xData,chart:a,destroyGroupedData:ma};g.options={dataGrouping:b?{enabled:!0,forced:!0,approximation:"open",units:[[b.unitName,[b.count]]]}:
{enabled:!1}};c.processData.apply(g);f.series.push(g)}),this.beforeSetTickPositions.apply(f),c[d]=f.ordinalPositions;return c[d]},getGroupIntervalFactor:function(a,b,c){var d=0,c=c.processedXData,e=c.length,f=[],g=this.groupIntervalFactor;if(!g){for(;d<e-1;d++)f[d]=c[d+1]-c[d];f.sort(function(a,b){return a-b});d=f[S(e/2)];a=w(a,c[0]);b=z(b,c[e-1]);this.groupIntervalFactor=g=e*d/(b-a)}return g},postProcessTickInterval:function(a){var b=this.ordinalSlope;return b?a/(b/this.closestPointRange):a}});O(va.prototype,
"pan",function(a,b){var c=this.xAxis[0],d=b.chartX,e=!1;if(c.options.ordinal&&c.series.length){var f=this.mouseDownX,g=c.getExtremes(),h=g.dataMax,i=g.min,k=g.max,j=this.hoverPoints,l=c.closestPointRange,f=(f-d)/(c.translationSlope*(c.ordinalSlope||l)),m={ordinalPositions:c.getExtendedPositions()},l=c.lin2val,n=c.val2lin,p;if(m.ordinalPositions){if(N(f)>1)j&&q(j,function(a){a.setState()}),f<0?(j=m,p=c.ordinalPositions?c:m):(j=c.ordinalPositions?c:m,p=m),m=p.ordinalPositions,h>m[m.length-1]&&m.push(h),
this.fixedRange=k-i,f=c.toFixedRange(null,null,l.apply(j,[n.apply(j,[i,!0])+f,!0]),l.apply(p,[n.apply(p,[k,!0])+f,!0])),f.min>=z(g.dataMin,i)&&f.max<=w(h,k)&&c.setExtremes(f.min,f.max,!0,!1,{trigger:"pan"}),this.mouseDownX=d,E(this.container,{cursor:"move"})}else e=!0}else e=!0;e&&a.apply(this,Array.prototype.slice.call(arguments,1))});O(L.prototype,"getSegments",function(a){var b,c=this.options.gapSize,d=this.xAxis;a.apply(this,Array.prototype.slice.call(arguments,1));if(c)b=this.segments,q(b,function(a,
f){for(var g=a.length-1;g--;)a[g+1].x-a[g].x>d.closestPointRange*c&&b.splice(f+1,0,a.splice(g+1,a.length-g))})});var aa=L.prototype,M=Hb.prototype,hc=aa.processData,ic=aa.generatePoints,jc=aa.destroy,kc=M.tooltipHeaderFormatter,lc={approximation:"average",groupPixelWidth:2,dateTimeLabelFormats:Kb("millisecond",["%A, %b %e, %H:%M:%S.%L","%A, %b %e, %H:%M:%S.%L","-%H:%M:%S.%L"],"second",["%A, %b %e, %H:%M:%S","%A, %b %e, %H:%M:%S","-%H:%M:%S"],"minute",["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],
"hour",["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],"day",["%A, %b %e, %Y","%A, %b %e","-%A, %b %e, %Y"],"week",["Week from %A, %b %e, %Y","%A, %b %e","-%A, %b %e, %Y"],"month",["%B %Y","%B","-%B %Y"],"year",["%Y","%Y","-%Y"])},Wb={line:{},spline:{},area:{},areaspline:{},column:{approximation:"sum",groupPixelWidth:10},arearange:{approximation:"range"},areasplinerange:{approximation:"range"},columnrange:{approximation:"range",groupPixelWidth:10},candlestick:{approximation:"ohlc",groupPixelWidth:10},
ohlc:{approximation:"ohlc",groupPixelWidth:5}},Xb=[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1]],["week",[1]],["month",[1,3,6]],["year",null]],Na={sum:function(a){var b=a.length,c;if(!b&&a.hasNulls)c=null;else if(b)for(c=0;b--;)c+=a[b];return c},average:function(a){var b=a.length,a=Na.sum(a);typeof a==="number"&&b&&(a/=b);return a},open:function(a){return a.length?a[0]:a.hasNulls?null:r},high:function(a){return a.length?
Ba(a):a.hasNulls?null:r},low:function(a){return a.length?Ra(a):a.hasNulls?null:r},close:function(a){return a.length?a[a.length-1]:a.hasNulls?null:r},ohlc:function(a,b,c,d){a=Na.open(a);b=Na.high(b);c=Na.low(c);d=Na.close(d);if(typeof a==="number"||typeof b==="number"||typeof c==="number"||typeof d==="number")return[a,b,c,d]},range:function(a,b){a=Na.low(a);b=Na.high(b);if(typeof a==="number"||typeof b==="number")return[a,b]}};aa.groupData=function(a,b,c,d){var e=this.data,f=this.options.data,g=[],
h=[],i=a.length,k,j,l=!!b,m=[[],[],[],[]],d=typeof d==="function"?d:Na[d],n=this.pointArrayMap,p=n&&n.length,o;for(o=0;o<=i;o++)if(a[o]>=c[0])break;for(;o<=i;o++){for(;c[1]!==r&&a[o]>=c[1]||o===i;)if(k=c.shift(),j=d.apply(0,m),j!==r&&(g.push(k),h.push(j)),m[0]=[],m[1]=[],m[2]=[],m[3]=[],o===i)break;if(o===i)break;if(n){k=this.cropStart+o;k=e&&e[k]||this.pointClass.prototype.applyOptions.apply({series:this},[f[k]]);var q;for(j=0;j<p;j++)if(q=k[n[j]],typeof q==="number")m[j].push(q);else if(q===null)m[j].hasNulls=
!0}else if(k=l?b[o]:null,typeof k==="number")m[0].push(k);else if(k===null)m[0].hasNulls=!0}return[g,h]};aa.processData=function(){var a=this.chart,b=this.options,c=b.dataGrouping,d=c&&o(c.enabled,a.options._stock),e;this.forceCrop=d;this.groupPixelWidth=null;this.hasProcessed=!0;if(hc.apply(this,arguments)!==!1&&d){this.destroyGroupedData();var f=this.processedXData,g=this.processedYData,h=a.plotSizeX,a=this.xAxis,i=a.options.ordinal,k=this.groupPixelWidth=a.getGroupPixelWidth&&a.getGroupPixelWidth(),
d=this.pointRange;if(k){e=!0;this.points=null;var j=a.getExtremes(),d=j.min,j=j.max,i=i&&a.getGroupIntervalFactor(d,j,this)||1,h=k*(j-d)/h*i,k=a.getTimeTicks(a.normalizeTimeTickInterval(h,c.units||Xb),d,j,null,f,this.closestPointRange),g=aa.groupData.apply(this,[f,g,k,c.approximation]),f=g[0],g=g[1];if(c.smoothed){c=f.length-1;for(f[c]=j;c--&&c>0;)f[c]+=h/2;f[0]=d}this.currentDataGrouping=k.info;if(b.pointRange===null)this.pointRange=k.info.totalRange;this.closestPointRange=k.info.totalRange;if(t(f[0])&&
f[0]<a.dataMin)a.dataMin=f[0];this.processedXData=f;this.processedYData=g}else this.currentDataGrouping=null,this.pointRange=d;this.hasGroupedData=e}};aa.destroyGroupedData=function(){var a=this.groupedData;q(a||[],function(b,c){b&&(a[c]=b.destroy?b.destroy():null)});this.groupedData=null};aa.generatePoints=function(){ic.apply(this);this.destroyGroupedData();this.groupedData=this.hasGroupedData?this.points:null};M.tooltipHeaderFormatter=function(a){var b=a.series,c=b.tooltipOptions,d=b.options.dataGrouping,
e=c.xDateFormat,f,g=b.xAxis,h;if(g&&g.options.type==="datetime"&&d&&ka(a.key)){b=b.currentDataGrouping;d=d.dateTimeLabelFormats;if(b)g=d[b.unitName],b.count===1?e=g[0]:(e=g[1],f=g[2]);else if(!e&&d)for(h in H)if(H[h]>=g.closestPointRange||H[h]<=H.day&&a.key%H[h]>0){e=d[h][0];break}e=ua(e,a.key);f&&(e+=ua(f,a.key+b.totalRange-1));a=c.headerFormat.replace("{point.key}",e)}else a=kc.call(this,a);return a};aa.destroy=function(){for(var a=this.groupedData||[],b=a.length;b--;)a[b]&&a[b].destroy();jc.apply(this)};
O(aa,"setOptions",function(a,b){var c=a.call(this,b),d=this.type,e=this.chart.options.plotOptions,f=T[d].dataGrouping;if(Wb[d])f||(f=y(lc,Wb[d])),c.dataGrouping=y(f,e.series&&e.series.dataGrouping,e[d].dataGrouping,b.dataGrouping);if(this.chart.options._stock)this.requireSorting=!0;return c});O(F.prototype,"setScale",function(a){a.call(this);q(this.series,function(a){a.hasProcessed=!1})});F.prototype.getGroupPixelWidth=function(){var a=this.series,b=a.length,c,d=0,e=!1,f;for(c=b;c--;)(f=a[c].options.dataGrouping)&&
(d=w(d,f.groupPixelWidth));for(c=b;c--;)if((f=a[c].options.dataGrouping)&&a[c].hasProcessed)if(b=(a[c].processedXData||a[c].data).length,a[c].groupPixelWidth||b>this.chart.plotSizeX/d||b&&f.forced)e=!0;return e?d:0};T.ohlc=y(T.column,{lineWidth:1,tooltip:{pointFormat:'<span style="color:{series.color}">●</span> <b> {series.name}</b><br/>Open: {point.open}<br/>High: {point.high}<br/>Low: {point.low}<br/>Close: {point.close}<br/>'},states:{hover:{lineWidth:3}},threshold:null});M=fa(C.column,{type:"ohlc",
pointArrayMap:["open","high","low","close"],toYData:function(a){return[a.open,a.high,a.low,a.close]},pointValKey:"high",pointAttrToOptions:{stroke:"color","stroke-width":"lineWidth"},upColorProp:"stroke",getAttribs:function(){C.column.prototype.getAttribs.apply(this,arguments);var a=this.options,b=a.states,a=a.upColor||this.color,c=y(this.pointAttr),d=this.upColorProp;c[""][d]=a;c.hover[d]=b.hover.upColor||a;c.select[d]=b.select.upColor||a;q(this.points,function(a){if(a.open<a.close)a.pointAttr=c})},
translate:function(){var a=this.yAxis;C.column.prototype.translate.apply(this);q(this.points,function(b){if(b.open!==null)b.plotOpen=a.translate(b.open,0,1,0,1);if(b.close!==null)b.plotClose=a.translate(b.close,0,1,0,1)})},drawPoints:function(){var a=this,b=a.chart,c,d,e,f,g,h,i,k;q(a.points,function(j){if(j.plotY!==r)i=j.graphic,c=j.pointAttr[j.selected?"selected":""],f=c["stroke-width"]%2/2,k=s(j.plotX)-f,g=s(j.shapeArgs.width/2),h=["M",k,s(j.yBottom),"L",k,s(j.plotY)],j.open!==null&&(d=s(j.plotOpen)+
f,h.push("M",k,d,"L",k-g,d)),j.close!==null&&(e=s(j.plotClose)+f,h.push("M",k,e,"L",k+g,e)),i?i.animate({d:h}):j.graphic=b.renderer.path(h).attr(c).add(a.group)})},animate:null});C.ohlc=M;T.candlestick=y(T.column,{lineColor:"black",lineWidth:1,states:{hover:{lineWidth:2}},tooltip:T.ohlc.tooltip,threshold:null,upColor:"white"});M=fa(M,{type:"candlestick",pointAttrToOptions:{fill:"color",stroke:"lineColor","stroke-width":"lineWidth"},upColorProp:"fill",getAttribs:function(){C.ohlc.prototype.getAttribs.apply(this,
arguments);var a=this.options,b=a.states,c=a.upLineColor||a.lineColor,d=b.hover.upLineColor||c,e=b.select.upLineColor||c;q(this.points,function(a){if(a.open<a.close)a.pointAttr[""].stroke=c,a.pointAttr.hover.stroke=d,a.pointAttr.select.stroke=e})},drawPoints:function(){var a=this,b=a.chart,c,d=a.pointAttr[""],e,f,g,h,i,k,j,l,m,n,p;q(a.points,function(o){m=o.graphic;if(o.plotY!==r)c=o.pointAttr[o.selected?"selected":""]||d,j=c["stroke-width"]%2/2,l=s(o.plotX)-j,e=o.plotOpen,f=o.plotClose,g=U.min(e,
f),h=U.max(e,f),p=s(o.shapeArgs.width/2),i=s(g)!==s(o.plotY),k=h!==o.yBottom,g=s(g)+j,h=s(h)+j,n=["M",l-p,h,"L",l-p,g,"L",l+p,g,"L",l+p,h,"Z","M",l,g,"L",l,i?s(o.plotY):g,"M",l,h,"L",l,k?s(o.yBottom):h,"Z"],m?m.animate({d:n}):o.graphic=b.renderer.path(n).attr(c).add(a.group).shadow(a.options.shadow)})}});C.candlestick=M;var qb=ja.prototype.symbols;T.flags=y(T.column,{dataGrouping:null,fillColor:"white",lineWidth:1,pointRange:0,shape:"flag",stackDistance:12,states:{hover:{lineColor:"black",fillColor:"#FCFFC5"}},
style:{fontSize:"11px",fontWeight:"bold",textAlign:"center"},tooltip:{pointFormat:"{point.text}<br/>"},threshold:null,y:-30});C.flags=fa(C.column,{type:"flags",sorted:!1,noSharedTooltip:!0,takeOrdinalPosition:!1,trackerGroups:["markerGroup"],forceCrop:!0,init:L.prototype.init,pointAttrToOptions:{fill:"fillColor",stroke:"color","stroke-width":"lineWidth",r:"radius"},translate:function(){C.column.prototype.translate.apply(this);var a=this.chart,b=this.points,c=b.length-1,d,e,f=this.options.onSeries,
f=(d=f&&a.get(f))&&d.options.step,g=d&&d.points,h=g&&g.length,i=this.xAxis,k=i.getExtremes(),j,l,m;if(d&&d.visible&&h){d=d.currentDataGrouping;l=g[h-1].x+(d?d.totalRange:0);for(b.sort(function(a,b){return a.x-b.x});h--&&b[c];)if(d=b[c],j=g[h],j.x<=d.x&&j.plotY!==r){if(d.x<=l)d.plotY=j.plotY,j.x<d.x&&!f&&(m=g[h+1])&&m.plotY!==r&&(d.plotY+=(d.x-j.x)/(m.x-j.x)*(m.plotY-j.plotY));c--;h++;if(c<0)break}}q(b,function(c,d){if(c.plotY===r)c.x>=k.min&&c.x<=k.max?c.plotY=a.chartHeight-i.bottom-(i.opposite?i.height:
0)+i.offset-a.plotTop:c.shapeArgs={};if((e=b[d-1])&&e.plotX===c.plotX){if(e.stackIndex===r)e.stackIndex=0;c.stackIndex=e.stackIndex+1}})},drawPoints:function(){var a,b=this.pointAttr[""],c=this.points,d=this.chart.renderer,e,f,g=this.options,h=g.y,i,k,j,l,m=g.lineWidth%2/2,n,o;for(k=c.length;k--;)if(j=c[k],a=j.plotX>this.xAxis.len,e=j.plotX+(a?m:-m),l=j.stackIndex,i=j.options.shape||g.shape,f=j.plotY,f!==r&&(f=j.plotY+h+m-(l!==r&&l*g.stackDistance)),n=l?r:j.plotX+m,o=l?r:j.plotY,l=j.graphic,f!==r&&
e>=0&&!a)a=j.pointAttr[j.selected?"select":""]||b,l?l.attr({x:e,y:f,r:a.r,anchorX:n,anchorY:o}):j.graphic=d.label(j.options.title||g.title||"A",e,f,i,n,o,g.useHTML).css(y(g.style,j.style)).attr(a).attr({align:i==="flag"?"left":"center",width:g.width,height:g.height}).add(this.markerGroup).shadow(g.shadow),j.tooltipPos=[e,f];else if(l)j.graphic=l.destroy()},drawTracker:function(){var a=this.points;cb.drawTrackerPoint.apply(this);q(a,function(b){var c=b.graphic;c&&A(c.element,"mouseover",function(){if(b.stackIndex>
0&&!b.raised)b._y=c.y,c.attr({y:b._y-8}),b.raised=!0;q(a,function(a){if(a!==b&&a.raised&&a.graphic)a.graphic.attr({y:a._y}),a.raised=!1})})})},animate:ma});qb.flag=function(a,b,c,d,e){var f=e&&e.anchorX||a,e=e&&e.anchorY||b;return["M",f,e,"L",a,b+d,a,b,a+c,b,a+c,b+d,a,b+d,"M",f,e,"Z"]};q(["circle","square"],function(a){qb[a+"pin"]=function(b,c,d,e,f){var g=f&&f.anchorX,f=f&&f.anchorY,b=qb[a](b,c,d,e);g&&f&&b.push("M",g,c>f?c:c+e,"L",g,f);return b}});Wa===P.VMLRenderer&&q(["flag","circlepin","squarepin"],
function(a){gb.prototype.symbols[a]=qb[a]});M=[].concat(Xb);M[4]=["day",[1,2,3,4]];M[5]=["week",[1,2,3]];v(I,{navigator:{handles:{backgroundColor:"#ebe7e8",borderColor:"#b2b1b6"},height:40,margin:25,maskFill:"rgba(128,179,236,0.3)",maskInside:!0,outlineColor:"#b2b1b6",outlineWidth:1,series:{type:C.areaspline===r?"line":"areaspline",color:"#4572A7",compare:null,fillOpacity:0.05,dataGrouping:{approximation:"average",enabled:!0,groupPixelWidth:2,smoothed:!0,units:M},dataLabels:{enabled:!1,zIndex:2},
id:"highcharts-navigator-series",lineColor:"#4572A7",lineWidth:1,marker:{enabled:!1},pointRange:0,shadow:!1,threshold:null},xAxis:{tickWidth:0,lineWidth:0,gridLineColor:"#EEE",gridLineWidth:1,tickPixelInterval:200,labels:{align:"left",style:{color:"#888"},x:3,y:-4},crosshair:!1},yAxis:{gridLineWidth:0,startOnTick:!1,endOnTick:!1,minPadding:0.1,maxPadding:0.1,labels:{enabled:!1},crosshair:!1,title:{text:null},tickWidth:0}},scrollbar:{height:db?20:14,barBackgroundColor:"#bfc8d1",barBorderRadius:0,barBorderWidth:1,
barBorderColor:"#bfc8d1",buttonArrowColor:"#666",buttonBackgroundColor:"#ebe7e8",buttonBorderColor:"#bbb",buttonBorderRadius:0,buttonBorderWidth:1,minWidth:6,rifleColor:"#666",trackBackgroundColor:"#eeeeee",trackBorderColor:"#eeeeee",trackBorderWidth:1,liveRedraw:ba&&!db}});yb.prototype={drawHandle:function(a,b){var c=this.chart,d=c.renderer,e=this.elementsToDestroy,f=this.handles,g=this.navigatorOptions.handles,g={fill:g.backgroundColor,stroke:g.borderColor,"stroke-width":1},h;this.rendered||(f[b]=
d.g("navigator-handle-"+["left","right"][b]).css({cursor:"e-resize"}).attr({zIndex:4-b}).add(),h=d.rect(-4.5,0,9,16,0,1).attr(g).add(f[b]),e.push(h),h=d.path(["M",-1.5,4,"L",-1.5,12,"M",0.5,4,"L",0.5,12]).attr(g).add(f[b]),e.push(h));f[b][c.isResizing?"animate":"attr"]({translateX:this.scrollerLeft+this.scrollbarHeight+parseInt(a,10),translateY:this.top+this.height/2-8})},drawScrollbarButton:function(a){var b=this.chart.renderer,c=this.elementsToDestroy,d=this.scrollbarButtons,e=this.scrollbarHeight,
f=this.scrollbarOptions,g;this.rendered||(d[a]=b.g().add(this.scrollbarGroup),g=b.rect(-0.5,-0.5,e+1,e+1,f.buttonBorderRadius,f.buttonBorderWidth).attr({stroke:f.buttonBorderColor,"stroke-width":f.buttonBorderWidth,fill:f.buttonBackgroundColor}).add(d[a]),c.push(g),g=b.path(["M",e/2+(a?-1:1),e/2-3,"L",e/2+(a?-1:1),e/2+3,e/2+(a?2:-2),e/2]).attr({fill:f.buttonArrowColor}).add(d[a]),c.push(g));a&&d[a].attr({translateX:this.scrollerWidth-e})},render:function(a,b,c,d){var e=this.chart,f=e.renderer,g,h,
i,k,j=this.scrollbarGroup,l=this.navigatorGroup,m=this.scrollbar,l=this.xAxis,n=this.scrollbarTrack,p=this.scrollbarHeight,q=this.scrollbarEnabled,r=this.navigatorOptions,t=this.scrollbarOptions,x=t.minWidth,v=this.height,y=this.top,A=this.navigatorEnabled,B=r.outlineWidth,C=B/2,F=0,D=this.outlineHeight,J=t.barBorderRadius,H=t.barBorderWidth,E=y+C,I;if(!isNaN(a)){this.navigatorLeft=g=o(l.left,e.plotLeft+p);this.navigatorWidth=h=o(l.len,e.plotWidth-2*p);this.scrollerLeft=i=g-p;this.scrollerWidth=k=
k=h+2*p;l.getExtremes&&(I=this.getUnionExtremes(!0))&&(I.dataMin!==l.min||I.dataMax!==l.max)&&l.setExtremes(I.dataMin,I.dataMax,!0,!1);c=o(c,l.translate(a));d=o(d,l.translate(b));if(isNaN(c)||N(c)===Infinity)c=0,d=k;if(!(l.translate(d,!0)-l.translate(c,!0)<e.xAxis[0].minRange)){this.zoomedMax=z(w(c,d),h);this.zoomedMin=w(this.fixedWidth?this.zoomedMax-this.fixedWidth:z(c,d),0);this.range=this.zoomedMax-this.zoomedMin;c=s(this.zoomedMax);b=s(this.zoomedMin);a=c-b;if(!this.rendered){if(A){this.navigatorGroup=
l=f.g("navigator").attr({zIndex:3}).add();this.leftShade=f.rect().attr({fill:r.maskFill}).add(l);if(!r.maskInside)this.rightShade=f.rect().attr({fill:r.maskFill}).add(l);this.outline=f.path().attr({"stroke-width":B,stroke:r.outlineColor}).add(l)}if(q)this.scrollbarGroup=j=f.g("scrollbar").add(),m=t.trackBorderWidth,this.scrollbarTrack=n=f.rect().attr({x:0,y:-m%2/2,fill:t.trackBackgroundColor,stroke:t.trackBorderColor,"stroke-width":m,r:t.trackBorderRadius||0,height:p}).add(j),this.scrollbar=m=f.rect().attr({y:-H%
2/2,height:p,fill:t.barBackgroundColor,stroke:t.barBorderColor,"stroke-width":H,r:J}).add(j),this.scrollbarRifles=f.path().attr({stroke:t.rifleColor,"stroke-width":1}).add(j)}e=e.isResizing?"animate":"attr";if(A){this.leftShade[e](r.maskInside?{x:g+b,y:y,width:c-b,height:v}:{x:g,y:y,width:b,height:v});if(this.rightShade)this.rightShade[e]({x:g+c,y:y,width:h-c,height:v});this.outline[e]({d:["M",i,E,"L",g+b+C,E,g+b+C,E+D,"L",g+c-C,E+D,"L",g+c-C,E,i+k,E].concat(r.maskInside?["M",g+b+C,E,"L",g+c-C,E]:
[])});this.drawHandle(b+C,0);this.drawHandle(c+C,1)}if(q&&j)this.drawScrollbarButton(0),this.drawScrollbarButton(1),j[e]({translateX:i,translateY:s(E+v)}),n[e]({width:k}),g=p+b,h=a-H,h<x&&(F=(x-h)/2,h=x,g-=F),this.scrollbarPad=F,m[e]({x:S(g)+H%2/2,width:h}),x=p+b+a/2-0.5,this.scrollbarRifles.attr({visibility:a>12?"visible":"hidden"})[e]({d:["M",x-3,p/4,"L",x-3,2*p/3,"M",x,p/4,"L",x,2*p/3,"M",x+3,p/4,"L",x+3,2*p/3]});this.scrollbarPad=F;this.rendered=!0}}},addEvents:function(){var a=this.chart.container,
b=this.mouseDownHandler,c=this.mouseMoveHandler,d=this.mouseUpHandler,e;e=[[a,"mousedown",b],[a,"mousemove",c],[document,"mouseup",d]];ab&&e.push([a,"touchstart",b],[a,"touchmove",c],[document,"touchend",d]);q(e,function(a){A.apply(null,a)});this._events=e},removeEvents:function(){q(this._events,function(a){R.apply(null,a)});this._events=r;this.navigatorEnabled&&this.baseSeries&&R(this.baseSeries,"updatedData",this.updatedDataHandler)},init:function(){var a=this,b=a.chart,c,d,e=a.scrollbarHeight,
f=a.navigatorOptions,g=a.height,h=a.top,i,k,j=document.body.style,l,m=a.baseSeries;a.mouseDownHandler=function(d){var d=b.pointer.normalize(d),e=a.zoomedMin,f=a.zoomedMax,h=a.top,k=a.scrollbarHeight,m=a.scrollerLeft,n=a.scrollerWidth,o=a.navigatorLeft,p=a.navigatorWidth,q=a.scrollbarPad,r=a.range,s=d.chartX,t=d.chartY,d=b.xAxis[0],v,w=db?10:7;if(t>h&&t<h+g+k)if((h=!a.scrollbarEnabled||t<h+g)&&U.abs(s-e-o)<w)a.grabbedLeft=!0,a.otherHandlePos=f,a.fixedExtreme=d.max,b.fixedRange=null;else if(h&&U.abs(s-
f-o)<w)a.grabbedRight=!0,a.otherHandlePos=e,a.fixedExtreme=d.min,b.fixedRange=null;else if(s>o+e-q&&s<o+f+q){a.grabbedCenter=s;a.fixedWidth=r;if(b.renderer.isSVG)l=j.cursor,j.cursor="ew-resize";i=s-e}else if(s>m&&s<m+n){f=h?s-o-r/2:s<o?e-r*0.2:s>m+n-k?e+r*0.2:s<o+e?e-r:f;if(f<0)f=0;else if(f+r>=p)f=p-r,v=c.dataMax;if(f!==e)a.fixedWidth=r,e=c.toFixedRange(f,f+r,null,v),d.setExtremes(e.min,e.max,!0,!1,{trigger:"navigator"})}};a.mouseMoveHandler=function(c){var d=a.scrollbarHeight,e=a.navigatorLeft,
f=a.navigatorWidth,g=a.scrollerLeft,h=a.scrollerWidth,j=a.range,l;if(c.pageX!==0)c=b.pointer.normalize(c),l=c.chartX,l<e?l=e:l>g+h-d&&(l=g+h-d),a.grabbedLeft?(k=!0,a.render(0,0,l-e,a.otherHandlePos)):a.grabbedRight?(k=!0,a.render(0,0,a.otherHandlePos,l-e)):a.grabbedCenter&&(k=!0,l<i?l=i:l>f+i-j&&(l=f+i-j),a.render(0,0,l-i,l-i+j)),k&&a.scrollbarOptions.liveRedraw&&setTimeout(function(){a.mouseUpHandler(c)},0)};a.mouseUpHandler=function(d){var e,f;if(k){if(a.zoomedMin===a.otherHandlePos)e=a.fixedExtreme;
else if(a.zoomedMax===a.otherHandlePos)f=a.fixedExtreme;e=c.toFixedRange(a.zoomedMin,a.zoomedMax,e,f);b.xAxis[0].setExtremes(e.min,e.max,!0,!1,{trigger:"navigator",triggerOp:"navigator-drag",DOMEvent:d})}if(d.type!=="mousemove")a.grabbedLeft=a.grabbedRight=a.grabbedCenter=a.fixedWidth=a.fixedExtreme=a.otherHandlePos=k=i=null,j.cursor=l||""};var n=b.xAxis.length,p=b.yAxis.length;b.extraBottomMargin=a.outlineHeight+f.margin;a.navigatorEnabled?(a.xAxis=c=new F(b,y({ordinal:m&&m.xAxis.options.ordinal},
f.xAxis,{id:"navigator-x-axis",isX:!0,type:"datetime",index:n,height:g,offset:0,offsetLeft:e,offsetRight:-e,keepOrdinalPadding:!0,startOnTick:!1,endOnTick:!1,minPadding:0,maxPadding:0,zoomEnabled:!1})),a.yAxis=d=new F(b,y(f.yAxis,{id:"navigator-y-axis",alignTicks:!1,height:g,offset:0,index:p,zoomEnabled:!1})),m||f.series.data?a.addBaseSeries():b.series.length===0&&O(b,"redraw",function(c,d){if(b.series.length>0&&!a.series)a.setBaseSeries(),b.redraw=c;c.call(b,d)})):a.xAxis=c={translate:function(a,
c){var d=b.xAxis[0].getExtremes(),f=b.plotWidth-2*e,g=d.dataMin,d=d.dataMax-g;return c?a*d/f+g:f*(a-g)/d},toFixedRange:F.prototype.toFixedRange};O(b,"getMargins",function(b){var e=this.legend,f=e.options;b.call(this);a.top=h=a.navigatorOptions.top||this.chartHeight-a.height-a.scrollbarHeight-this.spacing[2]-(f.verticalAlign==="bottom"&&f.enabled&&!f.floating?e.legendHeight+o(f.margin,10):0);if(c&&d)c.options.top=d.options.top=h,c.setAxisSize(),d.setAxisSize()});a.addEvents()},getUnionExtremes:function(a){var b=
this.chart.xAxis[0],c=this.xAxis,d=c.options;if(!a||b.dataMin!==null)return{dataMin:o(d&&d.min,(t(b.dataMin)&&t(c.dataMin)?z:o)(b.dataMin,c.dataMin)),dataMax:o(d&&d.max,(t(b.dataMax)&&t(c.dataMax)?w:o)(b.dataMax,c.dataMax))}},setBaseSeries:function(a){var b=this.chart,a=a||b.options.navigator.baseSeries;this.series&&this.series.remove();this.baseSeries=b.series[a]||typeof a==="string"&&b.get(a)||b.series[0];this.xAxis&&this.addBaseSeries()},addBaseSeries:function(){var a=this.baseSeries,b=a?a.options:
{},c=b.data,d=this.navigatorOptions.series,e;e=d.data;this.hasNavigatorData=!!e;b=y(b,d,{enableMouseTracking:!1,group:"nav",padXAxis:!1,xAxis:"navigator-x-axis",yAxis:"navigator-y-axis",name:"Navigator",showInLegend:!1,isInternal:!0,visible:!0});b.data=e||c;this.series=this.chart.initSeries(b);if(a&&this.navigatorOptions.adaptToUpdatedData!==!1)A(a,"updatedData",this.updatedDataHandler),a.userOptions.events=v(a.userOptions.event,{updatedData:this.updatedDataHandler})},updatedDataHandler:function(){var a=
this.chart.scroller,b=a.baseSeries,c=b.xAxis,d=c.getExtremes(),e=d.min,f=d.max,g=d.dataMin,d=d.dataMax,h=f-e,i,k,j,l,m,n=a.series;i=n.xData;var o=!!c.setExtremes;k=f>=i[i.length-1]-(this.closestPointRange||0);i=e<=g;if(!a.hasNavigatorData)n.options.pointStart=b.xData[0],n.setData(b.options.data,!1),m=!0;i&&(l=g,j=l+h);k&&(j=d,i||(l=w(j-h,n.xData[0])));o&&(i||k)?isNaN(l)||c.setExtremes(l,j,!0,!1,{trigger:"updatedData"}):(m&&this.chart.redraw(!1),a.render(w(e,g),z(f,d)))},destroy:function(){this.removeEvents();
q([this.xAxis,this.yAxis,this.leftShade,this.rightShade,this.outline,this.scrollbarTrack,this.scrollbarRifles,this.scrollbarGroup,this.scrollbar],function(a){a&&a.destroy&&a.destroy()});this.xAxis=this.yAxis=this.leftShade=this.rightShade=this.outline=this.scrollbarTrack=this.scrollbarRifles=this.scrollbarGroup=this.scrollbar=null;q([this.scrollbarButtons,this.handles,this.elementsToDestroy],function(a){Ka(a)})}};P.Scroller=yb;O(F.prototype,"zoom",function(a,b,c){var d=this.chart,e=d.options,f=e.chart.zoomType,
g=e.navigator,e=e.rangeSelector,h;if(this.isXAxis&&(g&&g.enabled||e&&e.enabled))if(f==="x")d.resetZoomButton="blocked";else if(f==="y")h=!1;else if(f==="xy")d=this.previousZoom,t(b)?this.previousZoom=[this.min,this.max]:d&&(b=d[0],c=d[1],delete this.previousZoom);return h!==r?h:a.call(this,b,c)});O(va.prototype,"init",function(a,b,c){A(this,"beforeRender",function(){var a=this.options;if(a.navigator.enabled||a.scrollbar.enabled)this.scroller=new yb(this)});a.call(this,b,c)});O(L.prototype,"addPoint",
function(a,b,c,d,e){var f=this.options.turboThreshold;f&&this.xData.length>f&&ea(b)&&!Pa(b)&&this.chart.scroller&&pa(20,!0);a.call(this,b,c,d,e)});v(I,{rangeSelector:{buttonTheme:{width:28,height:18,fill:"#f7f7f7",padding:2,r:0,"stroke-width":0,style:{color:"#444",fontWeight:"normal"},zIndex:7,states:{hover:{fill:"#e7e7e7"},select:{fill:"#e7f0f9",style:{color:"black",fontWeight:"bold"}}}},inputPosition:{align:"right"},labelStyle:{color:"#666"}}});I.lang=y(I.lang,{rangeSelectorZoom:"Zoom",rangeSelectorFrom:"From",
rangeSelectorTo:"To"});zb.prototype={clickButton:function(a,b){var c=this,d=c.selected,e=c.chart,f=c.buttons,g=c.buttonOptions[a],h=e.xAxis[0],i=e.scroller&&e.scroller.getUnionExtremes()||h||{},k=i.dataMin,j=i.dataMax,l,m=h&&s(z(h.max,o(j,h.max))),n=new Date(m),p=g.type,u=g.count,i=g._range,t;if(!(k===null||j===null||a===c.selected)){if(p==="month"||p==="year")l={month:"Month",year:"FullYear"}[p],n["set"+l](n["get"+l]()-u),l=n.getTime(),k=o(k,Number.MIN_VALUE),isNaN(l)||l<k?(l=k,m=z(l+i,j)):i=m-l;
else if(i)l=w(m-i,k),m=z(l+i,j);else if(p==="ytd")if(h){if(j===r)k=Number.MAX_VALUE,j=Number.MIN_VALUE,q(e.series,function(a){a=a.xData;k=z(a[0],k);j=w(a[a.length-1],j)}),b=!1;m=new Date(j);t=m.getFullYear();l=t=w(k||0,Date.UTC(t,0,1));m=m.getTime();m=z(j||m,m)}else{A(e,"beforeRender",function(){c.clickButton(a)});return}else p==="all"&&h&&(l=k,m=j);f[d]&&f[d].setState(0);f[a]&&f[a].setState(2);e.fixedRange=i;h?h.setExtremes(l,m,o(b,1),0,{trigger:"rangeSelectorButton",rangeSelectorButton:g}):(d=e.options.xAxis,
d[0]=y(d[0],{range:i,min:t}));c.setSelected(a)}},setSelected:function(a){this.selected=this.options.selected=a},defaultButtons:[{type:"month",count:1,text:"1m"},{type:"month",count:3,text:"3m"},{type:"month",count:6,text:"6m"},{type:"ytd",text:"YTD"},{type:"year",count:1,text:"1y"},{type:"all",text:"All"}],init:function(a){var b=this,c=a.options.rangeSelector,d=c.buttons||[].concat(b.defaultButtons),e=c.selected,f=b.blurInputs=function(){var a=b.minInput,c=b.maxInput;a&&a.blur();c&&c.blur()};b.chart=
a;b.options=c;b.buttons=[];a.extraTopMargin=35;b.buttonOptions=d;A(a.container,"mousedown",f);A(a,"resize",f);q(d,b.computeButtonRange);e!==r&&d[e]&&this.clickButton(e,!1);A(a,"load",function(){A(a.xAxis[0],"afterSetExtremes",function(){b.updateButtonStates(!0)})})},updateButtonStates:function(a){var b=this,c=this.chart,d=c.xAxis[0],e=c.scroller&&c.scroller.getUnionExtremes()||d,f=e.dataMin,g=e.dataMax,h=b.selected,i=b.buttons;a&&c.fixedRange!==s(d.max-d.min)&&(i[h]&&i[h].setState(0),b.setSelected(null));
q(b.buttonOptions,function(a,c){var e=a._range,m=e>g-f,n=e<d.minRange,o=a.type==="all"&&d.max-d.min>=g-f&&i[c].state!==2,q=a.type==="ytd"&&ua("%Y",f)===ua("%Y",g);e===s(d.max-d.min)&&c!==h?(b.setSelected(c),i[c].setState(2)):m||n||o||q?i[c].setState(3):i[c].state===3&&i[c].setState(0)})},computeButtonRange:function(a){var b=a.type,c=a.count||1,d={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5};if(d[b])a._range=d[b]*c;else if(b==="month"||b==="year")a._range={month:30,year:365}[b]*
864E5*c},setInputValue:function(a,b){var c=this.chart.options.rangeSelector;if(t(b))this[a+"Input"].HCTime=b;this[a+"Input"].value=ua(c.inputEditDateFormat||"%Y-%m-%d",this[a+"Input"].HCTime);this[a+"DateBox"].attr({text:ua(c.inputDateFormat||"%b %e, %Y",this[a+"Input"].HCTime)})},drawInput:function(a){var b=this,c=b.chart,d=c.renderer.style,e=c.renderer,f=c.options.rangeSelector,g=b.div,h=a==="min",i,k,j,l=this.inputGroup;this[a+"Label"]=k=e.label(I.lang[h?"rangeSelectorFrom":"rangeSelectorTo"],
this.inputGroup.offset).attr({padding:2}).css(y(d,f.labelStyle)).add(l);l.offset+=k.width+5;this[a+"DateBox"]=j=e.label("",l.offset).attr({padding:2,width:f.inputBoxWidth||90,height:f.inputBoxHeight||17,stroke:f.inputBoxBorderColor||"silver","stroke-width":1}).css(y({textAlign:"center",color:"#444"},d,f.inputStyle)).on("click",function(){b[a+"Input"].focus()}).add(l);l.offset+=j.width+(h?10:0);this[a+"Input"]=i=Y("input",{name:a,className:"highcharts-range-selector",type:"text"},v({position:"absolute",
border:0,width:"1px",height:"1px",padding:0,textAlign:"center",fontSize:d.fontSize,fontFamily:d.fontFamily,top:c.plotTop+"px"},f.inputStyle),g);i.onfocus=function(){E(this,{left:l.translateX+j.x+"px",top:l.translateY+"px",width:j.width-2+"px",height:j.height-2+"px",border:"2px solid silver"})};i.onblur=function(){E(this,{border:0,width:"1px",height:"1px"});b.setInputValue(a)};i.onchange=function(){var a=i.value,d=(f.inputDateParser||Date.parse)(a),e=c.xAxis[0],g=e.dataMin,j=e.dataMax;isNaN(d)&&(d=
a.split("-"),d=Date.UTC(J(d[0]),J(d[1])-1,J(d[2])));isNaN(d)||(I.global.useUTC||(d+=(new Date).getTimezoneOffset()*6E4),h?d>b.maxInput.HCTime?d=r:d<g&&(d=g):d<b.minInput.HCTime?d=r:d>j&&(d=j),d!==r&&c.xAxis[0].setExtremes(h?d:e.min,h?e.max:d,r,r,{trigger:"rangeSelectorInput"}))}},render:function(a,b){var c=this,d=c.chart,e=d.renderer,f=d.container,g=d.options,h=g.exporting&&g.navigation&&g.navigation.buttonOptions,i=g.rangeSelector,k=c.buttons,g=I.lang,j=c.div,j=c.inputGroup,l=i.buttonTheme,m=i.inputEnabled!==
!1,n=l&&l.states,p=d.plotLeft,r;if(!c.rendered&&(c.zoomText=e.text(g.rangeSelectorZoom,p,d.plotTop-20).css(i.labelStyle).add(),r=p+c.zoomText.getBBox().width+5,q(c.buttonOptions,function(a,b){k[b]=e.button(a.text,r,d.plotTop-35,function(){c.clickButton(b);c.isActive=!0},l,n&&n.hover,n&&n.select).css({textAlign:"center"}).add();r+=k[b].width+o(i.buttonSpacing,5);c.selected===b&&k[b].setState(2)}),c.updateButtonStates(),m))c.div=j=Y("div",null,{position:"relative",height:0,zIndex:1}),f.parentNode.insertBefore(j,
f),c.inputGroup=j=e.g("input-group").add(),j.offset=0,c.drawInput("min"),c.drawInput("max");m&&(f=d.plotTop-45,j.align(v({y:f,width:j.offset,x:h&&f<(h.y||0)+h.height-d.spacing[0]?-40:0},i.inputPosition),!0,d.spacingBox),c.setInputValue("min",a),c.setInputValue("max",b));c.rendered=!0},destroy:function(){var a=this.minInput,b=this.maxInput,c=this.chart,d=this.blurInputs,e;R(c.container,"mousedown",d);R(c,"resize",d);Ka(this.buttons);if(a)a.onfocus=a.onblur=a.onchange=null;if(b)b.onfocus=b.onblur=b.onchange=
null;for(e in this)this[e]&&e!=="chart"&&(this[e].destroy?this[e].destroy():this[e].nodeType&&Sa(this[e])),this[e]=null}};F.prototype.toFixedRange=function(a,b,c,d){var e=this.chart&&this.chart.fixedRange,a=o(c,this.translate(a,!0)),b=o(d,this.translate(b,!0)),c=e&&(b-a)/e;c>0.7&&c<1.3&&(d?a=b-e:b=a+e);return{min:a,max:b}};O(va.prototype,"init",function(a,b,c){A(this,"init",function(){if(this.options.rangeSelector.enabled)this.rangeSelector=new zb(this)});a.call(this,b,c)});P.RangeSelector=zb;va.prototype.callbacks.push(function(a){function b(){f=
a.xAxis[0].getExtremes();g.render(f.min,f.max)}function c(){f=a.xAxis[0].getExtremes();isNaN(f.min)||h.render(f.min,f.max)}function d(a){a.triggerOp!=="navigator-drag"&&g.render(a.min,a.max)}function e(a){h.render(a.min,a.max)}var f,g=a.scroller,h=a.rangeSelector;g&&(A(a.xAxis[0],"afterSetExtremes",d),O(a,"drawChartBox",function(a){var c=this.isDirtyBox;a.call(this);c&&b()}),b());h&&(A(a.xAxis[0],"afterSetExtremes",e),A(a,"resize",c),c());A(a,"destroy",function(){g&&R(a.xAxis[0],"afterSetExtremes",
d);h&&(R(a,"resize",c),R(a.xAxis[0],"afterSetExtremes",e))})});P.StockChart=function(a,b){var c=a.series,d,e=o(a.navigator&&a.navigator.enabled,!0)?{startOnTick:!1,endOnTick:!1}:null,f={marker:{enabled:!1,radius:2},states:{hover:{lineWidth:2}}},g={shadow:!1,borderWidth:0};a.xAxis=xa(la(a.xAxis||{}),function(a){return y({minPadding:0,maxPadding:0,ordinal:!0,title:{text:null},labels:{overflow:"justify"},showLastLabel:!0},a,{type:"datetime",categories:null},e)});a.yAxis=xa(la(a.yAxis||{}),function(a){d=
o(a.opposite,!0);return y({labels:{y:-2},opposite:d,showLastLabel:!1,title:{text:null}},a)});a.series=null;a=y({chart:{panning:!0,pinchType:"x"},navigator:{enabled:!0},scrollbar:{enabled:!0},rangeSelector:{enabled:!0},title:{text:null,style:{fontSize:"16px"}},tooltip:{shared:!0,crosshairs:!0},legend:{enabled:!1},plotOptions:{line:f,spline:f,area:f,areaspline:f,arearange:f,areasplinerange:f,column:g,columnrange:g,candlestick:g,ohlc:g}},a,{_stock:!0,chart:{inverted:!1}});a.series=c;return new va(a,
b)};O(Xa.prototype,"init",function(a,b,c){var d=c.chart.pinchType||"";a.call(this,b,c);this.pinchX=this.pinchHor=d.indexOf("x")!==-1;this.pinchY=this.pinchVert=d.indexOf("y")!==-1;this.hasZoom=this.hasZoom||this.pinchHor||this.pinchVert});O(F.prototype,"autoLabelAlign",function(a){if(this.chart.options._stock&&this.coll==="yAxis"&&wa(this,this.chart.yAxis)===0){if(this.options.labels.x===15)this.options.labels.x=0;return"right"}return a.call(this)});F.prototype.getPlotLinePath=function(a,b,c,d,e){var f=
this,g=this.isLinked&&!this.series?this.linkedParent.series:this.series,h=f.chart,i=h.renderer,k=f.left,j=f.top,l,m,n,p,r=[],v,w;v=f.isXAxis?t(f.options.yAxis)?[h.yAxis[f.options.yAxis]]:xa(g,function(a){return a.yAxis}):t(f.options.xAxis)?[h.xAxis[f.options.xAxis]]:xa(g,function(a){return a.xAxis});q(f.isXAxis?h.yAxis:h.xAxis,function(a){if(t(a.options.id)?a.options.id.indexOf("navigator")===-1:1){var b=a.isXAxis?"yAxis":"xAxis",b=t(a.options[b])?h[b][a.options[b]]:h[b][0];f===b&&v.push(a)}});w=
v.length?[]:[f];q(v,function(a){wa(a,w)===-1&&w.push(a)});e=o(e,f.translate(a,null,null,c));isNaN(e)||(f.horiz?q(w,function(a){m=a.top;p=m+a.len;l=n=s(e+f.transB);(l>=k&&l<=k+f.width||d)&&r.push("M",l,m,"L",n,p)}):q(w,function(a){l=a.left;n=l+a.width;m=p=s(j+f.height-e);(m>=j&&m<=j+f.height||d)&&r.push("M",l,m,"L",n,p)}));if(r.length>0)return i.crispPolyLine(r,b||1)};F.prototype.getPlotBandPath=function(a,b){var c=this.getPlotLinePath(b),d=this.getPlotLinePath(a),e=[],f;if(d&&c)for(f=0;f<d.length;f+=
6)e.push("M",d[f+1],d[f+2],"L",d[f+4],d[f+5],c[f+4],c[f+5],c[f+1],c[f+2]);else e=null;return e};ja.prototype.crispPolyLine=function(a,b){var c;for(c=0;c<a.length;c+=6)a[c+1]===a[c+4]&&(a[c+1]=a[c+4]=s(a[c+1])-b%2/2),a[c+2]===a[c+5]&&(a[c+2]=a[c+5]=s(a[c+2])+b%2/2);return a};if(Wa===P.VMLRenderer)gb.prototype.crispPolyLine=ja.prototype.crispPolyLine;O(F.prototype,"hideCrosshair",function(a,b){a.call(this,b);t(this.crossLabelArray)&&(t(b)?this.crossLabelArray[b]&&this.crossLabelArray[b].hide():q(this.crossLabelArray,
function(a){a.hide()}))});O(F.prototype,"drawCrosshair",function(a,b,c){var d,e;a.call(this,b,c);if(t(this.crosshair.label)&&this.crosshair.label.enabled&&t(c)){var a=this.chart,f=this.options.crosshair.label,g=this.isXAxis?"x":"y",b=this.horiz,h=this.opposite,i=this.left,k=this.top,j=this.crossLabel,l,m,n=f.format,p="";if(!j)j=this.crossLabel=a.renderer.label().attr({align:f.align||(b?"center":h?this.labelAlign==="right"?"right":"left":this.labelAlign==="left"?"left":"center"),zIndex:12,height:b?
16:r,fill:f.backgroundColor||this.series[0]&&this.series[0].color||"gray",padding:o(f.padding,2),stroke:f.borderColor||null,"stroke-width":f.borderWidth||0}).css(v({color:"white",fontWeight:"normal",fontSize:"11px",textAlign:"center"},f.style)).add();b?(l=c.plotX+i,m=k+(h?0:this.height)):(l=h?this.width+i:0,m=c.plotY+k);if(m<k||m>k+this.height)this.hideCrosshair();else{!n&&!f.formatter&&(this.isDatetimeAxis&&(p="%b %d, %Y"),n="{value"+(p?":"+p:"")+"}");j.attr({text:n?Ja(n,{value:c[g]}):f.formatter.call(this,
c[g]),x:l,y:m,visibility:"visible"});c=j.getBBox();if(b){if(this.options.tickPosition==="inside"&&!h||this.options.tickPosition!=="inside"&&h)m=j.y-c.height}else m=j.y-c.height/2;b?(d=i-c.x,e=i+this.width-c.x):(d=this.labelAlign==="left"?i:0,e=this.labelAlign==="right"?i+this.width:a.chartWidth);j.translateX<d&&(l+=d-j.translateX);j.translateX+c.width>=e&&(l-=j.translateX+c.width-e);j.attr({x:l,y:m,visibility:"visible"})}}});var mc=aa.init,nc=aa.processData,oc=za.prototype.tooltipFormatter;aa.init=
function(){mc.apply(this,arguments);this.setCompare(this.options.compare)};aa.setCompare=function(a){this.modifyValue=a==="value"||a==="percent"?function(b,c){var d=this.compareValue;if(b!==r&&(b=a==="value"?b-d:b=100*(b/d)-100,c))c.change=b;return b}:null;if(this.chart.hasRendered)this.isDirty=!0};aa.processData=function(){var a=0,b,c,d;nc.apply(this,arguments);if(this.xAxis&&this.processedYData){b=this.processedXData;c=this.processedYData;for(d=c.length;a<d;a++)if(typeof c[a]==="number"&&b[a]>=
this.xAxis.min){this.compareValue=c[a];break}}};O(aa,"getExtremes",function(a){a.call(this);if(this.modifyValue)this.dataMax=this.modifyValue(this.dataMax),this.dataMin=this.modifyValue(this.dataMin)});F.prototype.setCompare=function(a,b){this.isXAxis||(q(this.series,function(b){b.setCompare(a)}),o(b,!0)&&this.chart.redraw())};za.prototype.tooltipFormatter=function(a){a=a.replace("{point.change}",(this.change>0?"+":"")+Ia(this.change,o(this.series.tooltipOptions.changeDecimals,2)));return oc.apply(this,
[a])};O(L.prototype,"render",function(a){if(this.isCartesian)this.clipBox?this.chart[this.sharedClipKey]&&this.chart[this.sharedClipKey].attr({width:this.xAxis.len,height:this.yAxis.len}):(this.clipBox=y(this.chart.clipBox),this.clipBox.width=this.xAxis.len,this.clipBox.height=this.yAxis.len);a.call(this)});v(P,{Axis:F,Chart:va,Color:Fa,Point:za,Tick:Za,Renderer:Wa,Series:L,SVGElement:Z,SVGRenderer:ja,arrayMin:Ra,arrayMax:Ba,charts:$,dateFormat:ua,format:Ja,pathAnim:Bb,getOptions:function(){return I},
hasBidiBug:Yb,isTouchDevice:db,numberFormat:Ia,seriesTypes:C,setOptions:function(a){I=y(!0,I,a);Mb();return I},addEvent:A,removeEvent:R,createElement:Y,discardElement:Sa,css:E,each:q,extend:v,map:xa,merge:y,pick:o,splat:la,extendClass:fa,pInt:J,wrap:O,svg:ba,canvas:ia,vml:!ba&&!ia,product:"Highstock",version:"2.0.0"})})();

'use strict';
/*global angular: false, Highcharts: false */

angular.module('highcharts-ng', [])
    .directive('highchart', function () {

        //IE8 support
        var indexOf = function(arr, find, i /*opt*/) {
            if (i===undefined) i= 0;
            if (i<0) i+= arr.length;
            if (i<0) i= 0;
            for (var n= arr.length; i<n; i++)
                if (i in arr && arr[i]===find)
                    return i;
            return -1;
        };


        function prependMethod(obj, method, func) {
            var original = obj[method];
            obj[method] = function () {
                var args = Array.prototype.slice.call(arguments);
                func.apply(this, args);
                if(original) {
                    return original.apply(this, args);
                }  else {
                    return;
                }

            };
        }

        function deepExtend(destination, source) {
            for (var property in source) {
                if (source[property] && source[property].constructor &&
                    source[property].constructor === Object) {
                    destination[property] = destination[property] || {};
                    deepExtend(destination[property], source[property]);
                } else {
                    destination[property] = source[property];
                }
            }
            return destination;
        }

        // acceptable shared state
        var seriesId = 0;
        var ensureIds = function (series) {
            var changed = false;
            angular.forEach(series, function(s) {
                if (!angular.isDefined(s.id)) {
                    s.id = 'series-' + seriesId++;
                    changed = true;
                }
            });
            return changed;
        };

        // immutable
        var axisNames = [ 'xAxis', 'yAxis' ];

        var getMergedOptions = function (scope, element, config) {
            var mergedOptions = {};

            var defaultOptions = {
                chart: {
                    events: {}
                },
                title: {},
                subtitle: {},
                series: [],
                credits: {},
                plotOptions: {},
                navigator: {enabled: false}
            };

            if (config.options) {
                mergedOptions = deepExtend(defaultOptions, config.options);
            } else {
                mergedOptions = defaultOptions;
            }
            mergedOptions.chart.renderTo = element[0];
            angular.forEach(axisNames, function(axisName) {
                if (config[axisName]) {
                    prependMethod(mergedOptions.chart.events, 'selection', function(e){
                        var thisChart = this;
                        if (e[axisName]) {
                            scope.$apply(function () {
                                scope.config[axisName].currentMin = e[axisName][0].min;
                                scope.config[axisName].currentMax = e[axisName][0].max;
                            });
                        } else {
                            //handle reset button - zoom out to all
                            scope.$apply(function () {
                                scope.config[axisName].currentMin = thisChart[axisName][0].dataMin;
                                scope.config[axisName].currentMax = thisChart[axisName][0].dataMax;
                            });
                        }
                    });

                    prependMethod(mergedOptions.chart.events, 'addSeries', function(e){
                        scope.config[axisName].currentMin = this[axisName][0].min || scope.config[axisName].currentMin;
                        scope.config[axisName].currentMax = this[axisName][0].max || scope.config[axisName].currentMax;
                    });

                    mergedOptions[axisName] = angular.copy(config[axisName]);
                }
            });

            if(config.title) {
                mergedOptions.title = config.title;
            }
            if (config.subtitle) {
                mergedOptions.subtitle = config.subtitle;
            }
            if (config.credits) {
                mergedOptions.credits = config.credits;
            }
            return mergedOptions;
        };

        var updateZoom = function (axis, modelAxis) {
            var extremes = axis.getExtremes();
            if(modelAxis.currentMin !== extremes.dataMin || modelAxis.currentMax !== extremes.dataMax) {
                axis.setExtremes(modelAxis.currentMin, modelAxis.currentMax, false);
            }
        };

        var processExtremes = function(chart, axis, axisName) {
            if(axis.currentMin || axis.currentMax) {
                chart[axisName][0].setExtremes(axis.currentMin, axis.currentMax, true);
            }
        };

        var chartOptionsWithoutEasyOptions = function (options) {
            return angular.extend({}, options, {data: null, visible: null});
        };

        return {
            restrict: 'EAC',
            replace: true,
            template: '<div></div>',
            scope: {
                config: '='
            },
            link: function (scope, element, attrs) {
                // We keep some chart-specific variables here as a closure
                // instead of storing them on 'scope'.

                // prevSeriesOptions is maintained by processSeries
                var prevSeriesOptions = {};

                var processSeries = function(series) {
                    var ids = [];
                    if(series) {
                        var setIds = ensureIds(series);
                        if(setIds) {
                            //If we have set some ids this will trigger another digest cycle.
                            //In this scenario just return early and let the next cycle take care of changes
                            return false;
                        }

                        //Find series to add or update
                        angular.forEach(series, function(s) {
                            ids.push(s.id);
                            var chartSeries = chart.get(s.id);
                            if (chartSeries) {
                                if (!angular.equals(prevSeriesOptions[s.id], chartOptionsWithoutEasyOptions(s))) {
                                    chartSeries.update(angular.copy(s), false);
                                } else {
                                    if (s.visible !== undefined && chartSeries.visible !== s.visible) {
                                        chartSeries.setVisible(s.visible, false);
                                    }
                                    chartSeries.setData(angular.copy(s.data), false);
                                }
                            } else {
                                chart.addSeries(angular.copy(s), false);
                            }
                            prevSeriesOptions[s.id] = chartOptionsWithoutEasyOptions(s);
                        });
                    }

                    //Now remove any missing series
                    for(var i = chart.series.length - 1; i >= 0; i--) {
                        var s = chart.series[i];
                        if (indexOf(ids, s.options.id) < 0) {
                            s.remove(false);
                        }
                    }
                    return true;
                };

                // chart is maintained by initChart
                var chart = false;
                var initChart = function() {
                    if (chart) chart.destroy();
                    prevSeriesOptions = {};
                    var config = scope.config || {};
                    var mergedOptions = getMergedOptions(scope, element, config);
                    chart = config.useHighStocks ? new Highcharts.StockChart(mergedOptions) : new Highcharts.Chart(mergedOptions);
                    for (var i = 0; i < axisNames.length; i++) {
                        if (config[axisNames[i]]) {
                            processExtremes(chart, config[axisNames[i]], axisNames[i]);
                        }
                    }
                    if(config.loading) {
                        chart.showLoading();
                    }

                };
                initChart();


                scope.$watch('config.series', function (newSeries, oldSeries) {
                    var needsRedraw = processSeries(newSeries);
                    if(needsRedraw) {
                        chart.redraw();
                    }
                }, true);

                scope.$watch('config.title', function (newTitle) {
                    chart.setTitle(newTitle, true);
                }, true);

                scope.$watch('config.subtitle', function (newSubtitle) {
                    chart.setTitle(true, newSubtitle);
                }, true);

                scope.$watch('config.loading', function (loading) {
                    if(loading) {
                        chart.showLoading();
                    } else {
                        chart.hideLoading();
                    }
                });

                scope.$watch('config.credits.enabled', function (enabled) {
                    if (enabled) {
                        chart.credits.show();
                    } else if (chart.credits) {
                        chart.credits.hide();
                    }
                });

                scope.$watch('config.useHighStocks', function (useHighStocks) {
                    initChart();
                });

                angular.forEach(axisNames, function(axisName) {
                    scope.$watch('config.' + axisName, function (newAxes, oldAxes) {
                        if (newAxes === oldAxes) return;
                        if(newAxes) {
                            chart[axisName][0].update(newAxes, false);
                            updateZoom(chart[axisName][0], angular.copy(newAxes));
                            chart.redraw();
                        }
                    }, true);
                });
                scope.$watch('config.options', function (newOptions, oldOptions, scope) {
                    //do nothing when called on registration
                    if (newOptions === oldOptions) return;
                    initChart();
                    processSeries(scope.config.series);
                    chart.redraw();
                }, true);

                scope.$on('$destroy', function() {
                    if (chart) chart.destroy();
                    element.remove();
                });

            }
        };
    });
/*! angular-gantt 23-10-2014 */
var gantt=angular.module("gantt",[]);gantt.directive("gantt",["Gantt","dateFunctions","mouseOffset","debounce","keepScrollPos",function(a,b,c,d,e){return{restrict:"EA",replace:!0,templateUrl:function(a,b){return void 0===b.templateUrl?"template/gantt.tmpl.html":b.templateUrl},scope:{sortMode:"=?",viewScale:"=?",columnWidth:"=?",columnSubScale:"=?",allowTaskMoving:"=?",allowTaskResizing:"=?",allowRowSorting:"=?",fromDate:"=?",toDate:"=?",firstDayOfWeek:"=?",weekendDays:"=?",showWeekends:"=?",workHours:"=?",showNonWorkHours:"=?",autoExpand:"=?",maxHeight:"=?",labelsWidth:"=?",data:"=?",loadData:"&",removeData:"&",clearData:"&",centerDate:"&",onGanttReady:"&",onRowAdded:"&",onRowClicked:"&",onRowUpdated:"&",onScroll:"&",onTaskClicked:"&",onTaskUpdated:"&"},controller:["$scope","$element",function(f,g){void 0===f.sortMode&&(f.sortMode="name"),void 0===f.viewScale&&(f.viewScale="hour"),void 0===f.columnWidth&&(f.columnWidth=2),void 0===f.columnSubScale&&(f.columnSubScale=4),void 0===f.allowTaskMoving&&(f.allowTaskMoving=!0),void 0===f.allowTaskResizing&&(f.allowTaskResizing=!0),void 0===f.allowRowSorting&&(f.allowRowSorting=!0),void 0===f.firstDayOfWeek&&(f.firstDayOfWeek=1),void 0===f.weekendDays&&(f.weekendDays=[0,6]),void 0===f.showWeekends&&(f.showWeekends=!0),void 0===f.workHours&&(f.workHours=[8,9,10,11,12,13,14,15,16]),void 0===f.showNonWorkHours&&(f.showNonWorkHours=!0),void 0===f.maxHeight&&(f.maxHeight=0),void 0===f.autoExpand&&(f.autoExpand=!1),void 0===f.labelsWidth&&(f.labelsWidth=0),f.gantt=new a(f.viewScale,f.columnWidth,f.columnSubScale,f.firstDayOfWeek,f.weekendDays,f.showWeekends,f.workHours,f.showNonWorkHours),f.gantt.expandDefaultDateRange(f.fromDate,f.toDate),f.ganttScroll=angular.element(g.children()[2]),f.getGantt=function(){return f.gantt},f.$watch("sortMode",function(a,b){angular.equals(a,b)||f.sortRows()}),f.$watch("data",function(a,b){angular.equals(a,b)||(f.removeAllData(),f.setData(a))}),f.$watch("viewScale+columnWidth+columnSubScale+fromDate+toDate+firstDayOfWeek+weekendDays+showWeekends+workHours+showNonWorkHours",function(a,b){angular.equals(a,b)||(f.gantt.setViewScale(f.viewScale,f.columnWidth,f.columnSubScale,f.firstDayOfWeek,f.weekendDays,f.showWeekends,f.workHours,f.showNonWorkHours),f.gantt.reGenerateColumns())}),f.$watch("fromDate+toDate",function(a,b){angular.equals(a,b)||f.gantt.expandDefaultDateRange(f.fromDate,f.toDate)}),f.getPxToEmFactor=function(){return f.ganttScroll.children()[0].offsetWidth/f.gantt.width},f.swapRows=function(a,b){f.gantt.swapRows(a,b),f.raiseRowUpdatedEvent(a),f.raiseRowUpdatedEvent(b),"custom"!==f.sortMode?f.sortMode="custom":f.sortRows()},f.sortRows=function(){f.gantt.sortRows(f.sortMode)},f.scrollTo=function(a){f.ganttScroll[0].scrollLeft=a,f.ganttScroll.triggerHandler("scroll")},f.scrollLeft=function(a){f.ganttScroll[0].scrollLeft-=a,f.ganttScroll.triggerHandler("scroll")},f.scrollRight=function(a){f.ganttScroll[0].scrollLeft+=a,f.ganttScroll.triggerHandler("scroll")},f.scrollToDate=function(a){var b=f.gantt.getColumnByDate(a);if(void 0!==b){var c=(b.left+b.width/2)*f.getPxToEmFactor();f.ganttScroll[0].scrollLeft=c-f.ganttScroll[0].offsetWidth/2}},f.autoExpandColumns=e(f,function(a,c,d){if(f.autoExpand===!0){var e,g,h=1,i=31;"left"===d?(e="hour"===f.viewScale?b.addDays(c,-h,!0):b.addDays(c,-i,!0),g=c):(e=c,g="hour"===f.viewScale?b.addDays(c,h,!0):b.addDays(c,i,!0)),f.gantt.expandDefaultDateRange(e,g)}}),f.raiseRowAddedEvent=function(a){f.onRowAdded({event:{row:a}})},f.raiseDOMRowClickedEvent=function(a,b){var d=c.getOffset(a).x,e=d/f.getPxToEmFactor(),g=f.gantt.getColumnByPosition(e),h=f.gantt.getDateByPosition(e);taskHasBeenMoved===!1&&f.raiseRowClickedEvent(b,g,h),a.stopPropagation(),a.preventDefault()},f.raiseRowClickedEvent=function(a,b,c){f.taskUpdated?f.taskUpdated=!1:f.onRowClicked({event:{row:a,column:b.clone(),date:c}})},f.raiseRowUpdatedEvent=function(a){f.onRowUpdated({event:{row:a}})},f.raiseScrollEvent=d(function(){var a,b,c=f.ganttScroll[0];0===c.scrollLeft?(a="left",b=f.gantt.getDateRange().from):c.offsetWidth+c.scrollLeft>=c.scrollWidth&&(a="right",b=f.gantt.getDateRange().to),void 0!==b&&(f.autoExpandColumns(c,b,a),f.onScroll({event:{date:b,direction:a}}))},5),f.raiseDOMTaskClickedEvent=function(a,b){var d=c.getOffset(a).x,e=d/f.getPxToEmFactor(),g=f.gantt.getPositionByDate(b.from),h=f.gantt.getDateByPosition(e+g);f.raiseTaskClickedEvent(a,b,h),a.stopPropagation(),a.preventDefault()},f.raiseTaskClickedEvent=function(a,b,c){f.taskUpdated?f.taskUpdated=!1:f.onTaskClicked({event:{event:a,task:b,date:c}})},f.raiseTaskUpdatedEvent=function(a){f.onTaskUpdated({event:{task:a}}),f.taskUpdated=!0},f.setData=e(f,function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b],e=f.gantt.addRow(d),g=f.gantt.rowsMap[d.id];e===!0?f.raiseRowUpdatedEvent(g):f.raiseRowAddedEvent(g)}f.sortRows()}),f.removeData({fn:function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];if(void 0!==d.tasks&&d.tasks.length>0){if(d.id in f.gantt.rowsMap){for(var e=f.gantt.rowsMap[d.id],g=0,h=d.tasks.length;h>g;g++)e.removeTask(d.tasks[g].id);f.raiseRowUpdatedEvent(e)}}else f.gantt.removeRow(d.id)}f.sortRows()}}),f.removeAllData=function(){f.gantt.removeRows()},f.ganttScroll.bind("scroll",f.raiseScrollEvent),f.loadData({fn:f.setData}),f.clearData({fn:f.removeAllData}),f.centerDate({fn:f.scrollToDate}),f.onGanttReady({gantt:f.gantt})}]}}]),gantt.factory("Column",["dateFunctions",function(a){var b=function(a,b,c){return Math.round(b/a.width*c/(b/a.subScale))*(b/a.subScale)},c=function(a,b,c,d,e,f){var g;return g=b-a.date>0&&e!==f?1:Math.round(d/c*a.subScale)/a.subScale,Math.round(10*(a.left+a.width*g))/10},d=function(a,b,c,e){var f=this;f.date=a,f.left=b,f.width=c,f.subScale=e,f.clone=function(){return new d(f.date,f.left,f.width,f.subScale)},f.equals=function(a){return f.date===a.date}},e=function(e,f,g,h){var i=new d(e,f,g,h);return i.daysInMonth=a.getDaysInMonth(i.date),i.clone=function(){return new d(i.date,i.left,i.width,i.subScale)},i.getDateByPosition=function(c){0>c&&(c=0),c>i.width&&(c=i.width);var d=a.clone(i.date);return d.setDate(1+b(i,i.daysInMonth,c)),d},i.getPositionByDate=function(a){return c(i,a,i.daysInMonth,a.getDate(),a.getMonth(),i.date.getMonth())},i},f=function(e,f,g,h,i){var j=new d(e,f,g,h);j.week=a.getWeek(e),j.firstDayOfWeek=i,j.daysInWeek=7,j.clone=function(){var a=new d(j.date,j.left,j.width,j.subScale);return a.week=j.week,a};var k=function(a){return(j.daysInWeek-j.firstDayOfWeek+a)%j.daysInWeek},l=function(a){return(j.firstDayOfWeek+a)%j.daysInWeek};return j.getDateByPosition=function(c){0>c&&(c=0),c>j.width&&(c=j.width);var d=a.clone(j.date),e=Math.round(b(j,j.daysInWeek,c)),f=7!==e&&e<j.firstDayOfWeek?-1:1;return a.setToDayOfWeek(d,7!==e?l(e):l(e)+7,!1,f),d},j.getPositionByDate=function(b){return c(j,b,j.daysInWeek,k(b.getDay()),a.getWeek(b),a.getWeek(j.date))},j},g=function(e,f,g,h,i){var j=new d(e,f,g,h);return j.isWeekend=i,j.clone=function(){var a=new d(j.date,j.left,j.width,j.subScale);return a.isWeekend=j.isWeekend,a},j.getDateByPosition=function(c){0>c&&(c=0),c>j.width&&(c=j.width);var d=a.clone(j.date);return d.setHours(b(j,24,c)),d},j.getPositionByDate=function(a){return c(j,a,24,a.getHours(),a.getDate(),j.date.getDate())},j},h=function(e,f,g,h,i,j){var k=new d(e,f,g,h);return k.isWeekend=i,k.isWorkHour=j,k.clone=function(){var a=new d(k.date,k.left,k.width,k.subScale);return a.isWeekend=k.isWeekend,a.isWorkHour=k.isWorkHour,a},k.getDateByPosition=function(c){0>c&&(c=0),c>k.width&&(c=k.width);var d=a.clone(k.date);return d.setMinutes(b(k,60,c)),d},k.getPositionByDate=function(a){return c(k,a,60,a.getMinutes(),a.getHours(),k.date.getHours())},k},i=function(e,f,g,h,i,j){var k=new d(e,f,g,h);return k.isWeekend=i,k.isWorkHour=j,k.clone=function(){var a=new d(k.date,k.left,k.width,k.subScale);return a.isWeekend=k.isWeekend,a.isWorkHour=k.isWorkHour,a},k.getDateByPosition=function(c){0>c&&(c=0),c>k.width&&(c=k.width);var d=a.clone(k.date);return d.setMinutes(b(k,60,c)),d},k.getPositionByDate=function(a){return c(k,a,60,a.getMinutes(),a.getHours(),k.date.getHours())},k};return{QuarterHour:i,Hour:h,Day:g,Week:f,Month:e}}]),gantt.factory("ColumnGenerator",["Column","dateFunctions",function(a,b){var c=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return!0;return!1},d=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return!0;return!1},e=function(e,f,g,h,i,j){this.generate=function(k,l){var m=b.isTimeZero(l);k=b.setTimeZero(k,!0),l=b.setTimeZero(l,!0);for(var n=b.clone(k),o=[],p=0;m&&l-n>0||!m&&l-n>=0;){for(var q=c(g,n.getDay()),r=0;24>r;r++)for(var s=d(i,r),t=0;60>t;t+=15){var u=new Date(n.getFullYear(),n.getMonth(),n.getDate(),r,t,0);console.log(u),(q&&h||!q)&&(!s&&j||s)&&(o.push(new a.Hour(u,p,e,f,q,s)),p+=e)}n=b.addDays(n,1)}return o}},f=function(e,f,g,h,i,j){this.generate=function(k,l){var m=b.isTimeZero(l);k=b.setTimeZero(k,!0),l=b.setTimeZero(l,!0);for(var n=b.clone(k),o=[],p=0;m&&l-n>0||!m&&l-n>=0;){for(var q=c(g,n.getDay()),r=0;24>r;r++){var s=new Date(n.getFullYear(),n.getMonth(),n.getDate(),r,0,0),t=d(i,r);(q&&h||!q)&&(!t&&j||t)&&(o.push(new a.Hour(s,p,e,f,q,t)),p+=e)}n=b.addDays(n,1)}return o}},g=function(d,e,f,g){this.generate=function(h,i){var j=b.isTimeZero(i);h=b.setTimeZero(h,!0),i=b.setTimeZero(i,!0);for(var k=b.clone(h),l=[],m=0;j&&i-k>0||!j&&i-k>=0;){var n=c(f,k.getDay());(n&&g||!n)&&(l.push(new a.Day(b.clone(k),m,d,e,n)),m+=d),k=b.addDays(k,1)}return l}},h=function(c,d,e){this.generate=function(f,g){var h=g.getDay()===e&&b.isTimeZero(g);f=b.setToDayOfWeek(b.setTimeZero(f,!0),e,!1),g=b.setToDayOfWeek(b.setTimeZero(g,!0),e,!1);for(var i=b.clone(f),j=[],k=0;h&&g-i>0||!h&&g-i>=0;)j.push(new a.Week(b.clone(i),k,c,d,e)),k+=c,i=b.addWeeks(i,1);return j}},i=function(c,d){this.generate=function(e,f){var g=1===f.getDate()&&b.isTimeZero(f);e=b.setToFirstDayOfMonth(b.setTimeZero(e,!0),!1),f=b.setToFirstDayOfMonth(b.setTimeZero(f,!0),!1);for(var h=b.clone(e),i=[],j=0;g&&f-h>0||!g&&f-h>=0;)i.push(new a.Month(b.clone(h),j,c,d)),j+=c,h=b.addMonths(h,1);return i}};return{QuarterHourGenerator:e,HourGenerator:f,DayGenerator:g,WeekGenerator:h,MonthGenerator:i}}]),gantt.factory("Gantt",["Row","ColumnGenerator","HeaderGenerator","dateFunctions","binarySearch",function(a,b,c,d,e){var f=function(f,g,h,i,j,k,l,m){var n=this;n.rowsMap={},n.rows=[],n.columns=[],n.headers={},n.width=0;var o;n.setViewScale=function(a,d,e,f,g,h,i,j){switch(a){case"hour":n.columnGenerator=new b.HourGenerator(d,e,g,h,i,j);break;case"day":n.columnGenerator=new b.DayGenerator(d,e,g,h);break;case"week":n.columnGenerator=new b.WeekGenerator(d,e,f);break;case"month":n.columnGenerator=new b.MonthGenerator(d,e);break;default:throw"Unsupported view scale: "+a}n.headerGenerator=new c.instance(a)},n.setViewScale(f,g,h,i,j,k,l,m),n.expandDefaultDateRange=function(a,b){void 0!==a&&void 0!==b&&(p(a,b),r())},n.setDefaultDateRange=function(a,b){void 0!==a&&void 0!==b&&(q(a,b),n.reGenerateColumns())};var p=function(a,b){a=d.clone(a),b=d.clone(b),void 0===o?(o={},o.from=a,o.to=b):(a<o.from&&(o.from=a),b>o.to&&(o.to=b))},q=function(a,b){a=d.clone(a),b=d.clone(b),void 0===o&&(o={}),o.from=a,o.to=b};n.toJSON=function(){for(var a={rows:[]},b=0,c=n.rows.length;c>b;b++)a.rows.push(n.rows[b].toJSON());return a};var r=function(){if(void 0===o)throw"From and to date range cannot be undefined";if(0===n.columns.length)s(o.from,o.to);else if(n.getFirstColumn().date>o.from||n.getLastColumn().date<o.to){var a=n.getFirstColumn().date>o.from?o.from:n.getFirstColumn().date,b=n.getLastColumn().date<o.to?o.to:n.getLastColumn().date;s(a,b)}},s=function(a,b){n.columns=n.columnGenerator.generate(a,b),n.headers=n.headerGenerator.generate(n.columns),n.updateTasksPosAndSize();var c=n.getLastColumn();n.width=void 0!==c?c.left+c.width:0};n.reGenerateColumns=function(){n.columns=[],r()},n.updateTasksPosAndSize=function(){for(var a=0,b=n.rows.length;b>a;a++)for(var c=0,d=n.rows[a].tasks.length;d>c;c++)n.rows[a].tasks[c].updatePosAndSize()},n.getLastColumn=function(){return n.columns.length>0?n.columns[n.columns.length-1]:void 0},n.getFirstColumn=function(){return n.columns.length>0?n.columns[0]:void 0},n.getColumnByDate=function(a){return e.get(n.columns,a,function(a){return a.date})[0]},n.getColumnByPosition=function(a){return e.get(n.columns,a,function(a){return a.left})[0]},n.getDateByPosition=function(a){var b=n.getColumnByPosition(a);return void 0!==b?b.getDateByPosition(a-b.left):void 0},n.getPositionByDate=function(a){var b=n.getColumnByDate(a);return void 0!==b?b.getPositionByDate(a):void 0},n.getDateRange=function(){return void 0===o?void 0:{from:d.clone(o.from),to:d.clone(o.to)}},n.getTasksDateRange=function(){if(0===n.rows.length)return void 0;for(var a,b,c=0,d=n.rows.length;d>c;c++){var e=n.rows[c];(void 0===a||e.minFromDate<a)&&(a=e.minFromDate),(void 0===b||e.maxToDate>b)&&(b=e.maxToDate)}return{from:a,to:b}},n.getActiveHeadersCount=function(){var a,b=0;for(a in n.headers)n.headers.hasOwnProperty(a)&&b++;return b},n.addRow=function(b){var c,d=!1;if(b.id in n.rowsMap)c=n.rowsMap[b.id],c.copy(b),d=!0;else{var e=b.order;void 0===e&&(e=n.highestRowOrder),e>=n.highestRowOrder&&(n.highestRowOrder=e+1),c=new a(b.id,n,b.description,e,b.data),n.rowsMap[b.id]=c,n.rows.push(c)}if(void 0!==b.tasks){for(var f=0,g=b.tasks.length;g>f;f++){var h=c.addTask(b.tasks[f]);if(p(h.from,h.to),h.updatePosAndSize(),void 0!==b.tasks[f].child)for(var i=0,j=b.tasks[f].child.length;j>i;i++){var k=b.tasks[f].child[i];k.data.parent=h,k=h.row.addTask(k),h.child.push(k),k.updatePosAndSize()}}r()}return d},n.removeRow=function(a){if(a in n.rowsMap){delete n.rowsMap[a];for(var b=0,c=n.rows.length;c>b;b++){var d=n.rows[b];if(d.id===a)return n.rows.splice(b,1),d}}return void 0},n.removeRows=function(){n.rowsMap={},n.rows=[],n.highestRowOrder=0,n.columns=[],o=void 0},n.swapRows=function(a,b){var c=a.order;a.order=b.order,b.order=c};var t=function(a,b){return void 0===a.minFromDate&&void 0===b.minFromDate?u(a,b):void 0===a.minFromDate?1:void 0===b.minFromDate?-1:a.minFromDate-b.minFromDate},u=function(a,b){return a.description===b.description?0:a.description<b.description?-1:1},v=function(a,b){return void 0===a.order&&void 0===b.order?u(a,b):void 0===a.order?1:void 0===b.order?-1:a.order-b.order};n.sortRows=function(a){switch(a){case"name":n.rows.sort(u);break;case"custom":n.rows.sort(v);break;default:n.rows.sort(t)}}};return f}]),gantt.factory("HeaderGenerator",["Column","dateFunctions",function(a,b){var c=function(c){var d=[];console.log(c);for(var e,f=0,g=c.length;g>f;f++){var h=c[f];0===f||c[f-1].date.getHours()!==h.date.getHours()?(e=new a.QuarterHour(b.clone(h.date),h.left,h.width,h.isWeekend,h.isWorkHour),d.push(e)):e.width+=h.width}return d},d=function(c){for(var d,e=[],f=0,g=c.length;g>f;f++){var h=c[f];0===f||c[f-1].date.getHours()!==h.date.getHours()?(d=new a.Hour(b.clone(h.date),h.left,h.width,h.isWeekend,h.isWorkHour),e.push(d)):d.width+=h.width}return e},e=function(c){for(var d,e=[],f=0,g=c.length;g>f;f++){var h=c[f];0===f||c[f-1].date.getDay()!==h.date.getDay()?(d=new a.Day(b.clone(h.date),h.left,h.width,h.isWeekend),e.push(d)):d.width+=h.width}return e},f=function(c){for(var d,e=[],f=0,g=c.length;g>f;f++){var h=c[f];0===f||b.getWeek(c[f-1].date)!==b.getWeek(h.date)?(d=new a.Week(b.clone(h.date),h.left,h.width,b.getWeek(h.date)),e.push(d)):d.width+=h.width}return e},g=function(c){for(var d,e=[],f=0,g=c.length;g>f;f++){var h=c[f];0===f||c[f-1].date.getMonth()!==h.date.getMonth()?(d=new a.Month(b.clone(h.date),h.left,h.width),e.push(d)):d.width+=h.width}return e};return{instance:function(a){this.generate=function(b){var h={};switch(a){case"quarter hour":h.quarterhour=c(b),h.hour=d(b),h.day=e(b);break;case"hour":h.hour=d(b),h.day=e(b);break;case"day":h.day=e(b),h.week=f(b),h.month=g(b);break;case"week":h.week=f(b),h.month=g(b);break;case"month":h.month=g(b);break;default:throw"Unsupported view scale: "+a}return h}}}}]),gantt.factory("Row",["Task","dateFunctions",function(a,b){var c=function(d,e,f,g,h){var i=this;i.id=d,i.gantt=e,i.description=f,i.order=g,i.tasksMap={},i.tasks=[],i.data=h,i.addTask=function(b){var c;return b.id in i.tasksMap?(c=i.tasksMap[b.id],c.copy(b)):(c=new a(b.id,i,b.subject,b.color,b.from,b.to,b.data),i.tasksMap[b.id]=c,i.tasks.push(c)),i.sortTasks(),i.setMinMaxDateByTask(c),c},i.toJSON=function(){for(var a={id:i.id,description:i.description,data:i.data,tasks:[]},b=0,c=i.tasks.length;c>b;b++)i.tasks[b].data.parent===!1&&a.tasks.push(i.tasks[b].toJSON());return a},i.moveTaskToRow=function(a){if(!a.data.locked){for(var b=0;b<a.child.length;b++)i.moveTaskToRow(a.child[b]);a.row.removeTask(a.id),i.tasksMap[a.id]=a,i.tasks.push(a),i.setTasksMinMaxDate(),a.row=i,a.updatePosAndSize()}},i.removeTask=function(a){if(a in i.tasksMap){delete i.tasksMap[a];for(var b=0,c=i.tasks.length;c>b;b++){var d=i.tasks[b];if(d.id===a){if(d.data.parent===!1)for(var e=0;e<d.child.length;e++)i.removeTask(d.child[e].id);return i.tasks.splice(b,1),(i.minFromDate-d.from===0||i.maxToDate-d.to===0)&&i.setTasksMinMaxDate(),d}}}},i.setTasksMinMaxDate=function(){i.minFromDate=void 0,i.maxToDate=void 0;for(var a=0,b=i.tasks.length;b>a;a++)i.setMinMaxDateByTask(i.tasks[a])},i.setMinMaxDateByTask=function(a){void 0===i.minFromDate?i.minFromDate=b.clone(a.from):a.from<i.minFromDate&&(i.minFromDate=b.clone(a.from)),void 0===i.maxToDate?i.maxToDate=b.clone(a.to):a.to>i.maxToDate&&(i.maxToDate=b.clone(a.to))},i.sortTasks=function(){i.tasks.sort(function(a,b){return a.left-b.left})},i.copy=function(a){i.description=a.description,i.data=a.data,void 0!==a.order&&(i.order=a.order)},i.clone=function(){for(var a=new c(i.id,i.gantt,i.description,i.order,i.data),b=0,d=i.tasks.length;d>b;b++)a.addTask(i.tasks[b].clone());return a}};return c}]),gantt.factory("Task",["dateFunctions",function(a){var b=function(c,d,e,f,g,h,i){var j=this;j.id=c,j.gantt=d.gantt,j.row=d,j.subject=e,j.color=f,j.from=a.clone(g),j.to=a.clone(h),j.data=i,j.child=[],"undefined"==typeof j.data?j.data={parent:!1,locked:!1}:("undefined"==typeof j.data.parent&&(j.data.parent=!1),"undefined"==typeof j.data.locked&&(j.data.locked=!1)),j.toJSON=function(){var a={subject:j.subject,id:c,from:j.from.valueOf(),to:j.to.valueOf(),data:j.objectClone(j.data),child:[]};a.data.parent=!1;for(var b=0,d=j.child.length;d>b;b++)a.child.push(j.child[b].toJSON());return a},j.checkIfMilestone=function(){j.isMilestone=j.from-j.to===0},j.checkIfMilestone(),j.updatePosAndSize=function(){j.left=j.gantt.getPositionByDate(j.from),j.width=Math.round(10*(j.gantt.getPositionByDate(j.to)-j.left))/10},j.setFrom=function(a){if(!j.data.locked){j.data.parent===!1?a>j.left+j.width?a=j.left+j.width:0>a&&(a=0):a>j.left+j.width?a=j.left+j.width:a<j.data.parent.left&&(a=j.data.parent.left);for(var b=0;b<j.child.length;b++)a>j.child[b].left&&(a=j.child[b].left);j.from=j.gantt.getDateByPosition(a),j.row.setMinMaxDateByTask(j),j.updatePosAndSize(),j.checkIfMilestone()}},j.setTo=function(a){if(!j.data.locked){j.data.parent===!1?a<j.left?a=j.left:a>j.gantt.width&&(a=j.gantt.width):a<j.left?a=j.left:a>j.data.parent.width+j.data.parent.left&&(a=j.data.parent.width+j.data.parent.left);for(var b=0;b<j.child.length;b++)a<j.child[b].left+j.child[b].width&&(a=j.child[b].left+j.child[b].width);j.to=j.gantt.getDateByPosition(a),j.row.setMinMaxDateByTask(j),j.updatePosAndSize(),j.checkIfMilestone()}},j.updateZIndex=function(a){$.each(j.row.tasks,function(b,c){c[a+"ZIndex"]()})},j.removeFromParent=function(){for(var a=j.data.parent,b=0;b<a.child.length;b++)a.child[b].id===j.id&&a.child.splice(b,1)},j.boostZIndex=function(){"undefined"!=typeof j.data.zIndex&&(j.data.tempZIndex=j.data.zIndex,j.data.zIndex+=1e3)},j.clearZIndex=function(){"undefined"!=typeof j.data.tempZIndex&&(j.data.zIndex=j.data.tempZIndex,delete j.data.tempZIndex)},j.moveTo=function(a){j.data.locked||(j.data.parent===!1?0>a?a=0:a+j.width>=j.gantt.width&&(a=j.gantt.width-j.width):a<j.data.parent.left?a=j.data.parent.left:a+j.width>=j.data.parent.width+j.data.parent.left&&(a=j.data.parent.left+j.data.parent.width-j.width),j.from=j.gantt.getDateByPosition(a),j.left=j.gantt.getPositionByDate(j.from),j.to=j.gantt.getDateByPosition(j.left+j.width),j.width=Math.round(10*(j.gantt.getPositionByDate(j.to)-j.left))/10,j.row.setMinMaxDateByTask(j))},j.copy=function(b){j.subject=b.subject,j.color=b.color,j.from=a.clone(b.from),j.to=a.clone(b.to),j.data=b.data,j.isMilestone=b.isMilestone},j.clone=function(){return new b(j.id,j.row,j.subject,j.color,j.from,j.to,j.data)},j.objectClone=function(a){var b={};return angular.forEach(a,function(a,c){b[c]=a}),b}};return b}]),gantt.service("binarySearch",[function(){return{getIndicesOnly:function(a,b,c){for(var d=-1,e=a.length;e-d>1;){var f=Math.floor((d+e)/2);c(a[f])<=b?d=f:e=f}return void 0!==a[d]&&c(a[d])===b&&(e=d),[d,e]},get:function(a,b,c){var d=this.getIndicesOnly(a,b,c);return[a[d[0]],a[d[1]]]}}}]),gantt.service("dateFunctions",[function(){return{isNumber:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},isString:function(a){return"string"==typeof a||"object"==typeof a&&a.constructor===String},clone:function(a){return new Date(this.isString(a)?Date.parse(a):this.isNumber(a)?a:a.getTime())},setTimeZero:function(a,b){var c=b===!0?this.clone(a):a;return c.setHours(0),c.setMinutes(0),c.setMilliseconds(0),c},setTimeComponent:function(a,b){return new Date(a.getFullYear(),a.getMonth(),a.getDate(),0,0,0,b)},setToFirstDayOfMonth:function(a,b){var c=b===!0?this.clone(a):a;return c.setDate(1),c},setToDayOfWeek:function(a,b,c,d){var e=c===!0?this.clone(a):a;if(e.getDay()===b)return e;d=d||-1;var f=(b-e.getDay()+7*(d||1))%7;return this.addDays(e,0===f?f+=7*(d||1):f)},addMonths:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setDate(1),d.setMonth(d.getMonth()+b),d},addWeeks:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setDate(d.getDate()+7*b),d},addDays:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setDate(d.getDate()+b),d},addHours:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setHours(d.getHours()+b),d},addMinutes:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setMinutes(d.getMinutes()+b),d},addMilliseconds:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setMilliseconds(d.getMilliseconds()+b),d},isTimeZero:function(a){return 0===a.getHours()&&0===a.getMinutes()&&0===a.getMinutes()&&0===a.getMilliseconds()},getDaysInMonth:function(a){return new Date(a.getYear(),a.getMonth()+1,0).getDate()},getWeek:function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n;return b=a.getFullYear(),c=a.getMonth()+1,d=a.getDate(),2>=c?(e=b-1,f=(e/4|0)-(e/100|0)+(e/400|0),g=((e-1)/4|0)-((e-1)/100|0)+((e-1)/400|0),m=f-g,i=0,j=d-1+31*(c-1)):(e=b,f=(e/4|0)-(e/100|0)+(e/400|0),g=((e-1)/4|0)-((e-1)/100|0)+((e-1)/400|0),m=f-g,i=m+1,j=d+(153*(c-3)+2)/5+58+m),k=(e+f)%7,h=(j+k-i)%7,l=j+3-h|0,n=0>l?53-((k-m)/5|0):l>364+m?1:(l/7|0)+1,b=c=d=null,n}}}]),gantt.filter("ganttColumnLimit",["binarySearch",function(a){return function(b,c,d){var e=function(a){return a.left},f=a.getIndicesOnly(b,c,e)[0],g=a.getIndicesOnly(b,c+d,e)[1];return b.slice(f,g)}}]),gantt.directive("ganttLimitUpdater",["$timeout",function(a){return{restrict:"A",controller:["$scope","$element",function(b,c){var d=c[0],e=function(){b.scroll_start=d.scrollLeft/b.getPxToEmFactor(),b.scroll_width=d.offsetWidth/b.getPxToEmFactor()};c.bind("scroll",function(){b.$apply(function(){e()})}),b.$watch("gantt.width",function(){a(function(){e()},20,!0)})}]}}]),gantt.filter("ganttTaskLimit",[function(){return function(a,b,c){for(var d=[],e=0,f=a.length;f>e;e++){var g=a[e];(g.left>=b&&g.left<=b+c||g.left+g.width>=b&&g.left+g.width<=b+c||g.left<b&&g.left+g.width>b+c)&&d.push(g)}return d}}]),gantt.directive("ganttLabelResizable",["$document","debounce","mouseOffset",function(a,b,c){return{restrict:"A",scope:{width:"=ganttLabelResizable",minWidth:"=resizeMin"},controller:["$scope","$element",function(d,e){var f,g=5,h="ew-resize";e.bind("mousedown",function(a){j(a)&&(k(a),a.preventDefault())}),e.bind("mousemove",function(a){j(a)?e.css("cursor",h):e.css("cursor","")});var i=function(a){0===d.width&&(d.width=e[0].offsetWidth),d.width+=a-f,d.width<d.minWidth&&(d.width=d.minWidth),f=a},j=function(a){var b=c.getOffset(a).x;return b>e[0].offsetWidth-g},k=function(c){f=c.screenX,angular.element(a[0].body).css({"-moz-user-select":"-moz-none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none",cursor:h});var d=b(function(a){i(a.screenX)},5);angular.element(a[0].body).bind("mousemove",d),angular.element(a[0].body).one("mouseup",function(){angular.element(a[0].body).unbind("mousemove",d),l()})},l=function(){e.css("cursor",""),angular.element(a[0].body).css({"-moz-user-select":"","-webkit-user-select":"","-ms-user-select":"","user-select":"",cursor:""})}}]}}]);var taskHasBeenMoved=!1;gantt.directive("ganttTaskMoveable",["$document","$timeout","debounce","dateFunctions","mouseOffset",function(a,b,c,d,e){return{restrict:"A",controller:["$scope","$element",function(d,f){var g,h,i,j=10,k=6,l=15,m=1,n=angular.element(a[0].body),o=f.parent().parent(),p=o.parent().parent();f.bind("mousedown",function(a){var b=v(a);""!==b&&(x(b,a),a.preventDefault())}),f.bind("mousemove",function(a){var b=v(a);""!==b&&"M"!==b?f.css("cursor",w(b)):f.css("cursor","")});var q=function(a,b){d.task.isMoving!==!1&&(r(a,b),s(a,b))},r=function(a,b){var c=b.x/d.getPxToEmFactor(),e=0;if("M"===a){var f=d.task.child;if(d.task.data.parent===!1){var h=u(b.y);if(void 0!==h&&d.task.row.id!==h.id)for(h.moveTaskToRow(d.task),e=0;e<d.task.child.length;e++)h.moveTaskToRow(d.task.child[e])}var i=d.task.left;for(d.task.moveTo(c-g),d.task.child=f,e=0;e<d.task.child.length;e++){var j=d.task.child[e].left-i;d.task.child[e].moveTo(d.task.left+j)}}else"E"===a?d.task.setTo(c):d.task.setFrom(c);taskHasBeenMoved=!0},s=function(a,c){var e=p[0].scrollLeft;if(c.x<h)c.x<=e+m&&(c.x-=l,d.scrollLeft(l),i=b(function(){q(a,c)},100,!0));else{var f=p[0].offsetWidth,g=e+f;c.x>=g-m&&(c.x+=l,d.scrollRight(l),i=b(function(){q(a,c)},100,!0))}},t=function(){void 0!==i&&(b.cancel(i),i=void 0)},u=function(a){var b=o[0].offsetHeight/d.task.row.gantt.rows.length,c=Math.floor(a/b);return d.task.row.gantt.rows[c]},v=function(a){var b=e.getOffset(a).x,c=0;return d.allowTaskResizing&&(c=f[0].offsetWidth<10?k:j),d.allowTaskResizing&&b>f[0].offsetWidth-c?"E":d.allowTaskResizing&&c>b?"W":d.allowTaskMoving&&b>=c&&b<=f[0].offsetWidth-c?"M":""},w=function(a){switch(a){case"E":return"e-resize";case"W":return"w-resize";case"M":return"move"}},x=function(b,f){d.task.isMoving=!0,h=e.getOffsetForElement(o[0],f).x;var i=h/d.getPxToEmFactor();g=i-d.task.left,angular.element(a[0].body).css({"-moz-user-select":"-moz-none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none",cursor:w(b)});var j=c(function(a){var c=e.getOffsetForElement(o[0],a);t(),q(b,c)},5);n.bind("mousemove",j),n.one("mouseup",function(){n.unbind("mousemove",j),y(f)})},y=function(){d.task.isMoving=!1,t(),taskHasBeenMoved===!0&&(d.task.row.sortTasks(),d.raiseTaskUpdatedEvent(d.task),taskHasBeenMoved=!1),f.css("cursor",""),angular.element(a[0].body).css({"-moz-user-select":"","-webkit-user-select":"","-ms-user-select":"","user-select":"",cursor:""})}}]}}]),gantt.directive("ganttHorizontalScrollReceiver",["scrollManager",function(a){return{restrict:"A",controller:["$scope","$element",function(b,c){a.horizontal.push(c[0])}]}}]),gantt.service("scrollManager",[function(){return{vertical:[],horizontal:[]}}]),gantt.directive("ganttScrollSender",["scrollManager","$timeout",function(a,b){return{restrict:"A",controller:["$scope","$element",function(c,d){var e=d[0],f=function(){var b,c;for(b=0,c=a.vertical.length;c>b;b++){var d=a.vertical[b];d.style.top!==-e.scrollTop&&(d.style.top=-e.scrollTop+"px")}for(b=0,c=a.horizontal.length;c>b;b++){var f=a.horizontal[b];f.style.left!==-e.scrollLeft&&(f.style.left=-e.scrollLeft+"px")}};d.bind("scroll",f),c.$watch("gantt.width",function(a){0===a&&b(function(){f()},20,!0)})}]}}]),gantt.directive("ganttVerticalScrollReceiver",["scrollManager",function(a){return{restrict:"A",controller:["$scope","$element",function(b,c){a.vertical.push(c[0])}]}}]),gantt.service("sortManager",[function(){return{startRow:void 0}}]),gantt.directive("ganttSortable",["$document","sortManager",function(a,b){return{restrict:"E",template:"<div ng-transclude></div>",replace:!0,transclude:!0,scope:{row:"=ngModel",swap:"&",active:"=?"},controller:["$scope","$element",function(c,d){d.bind("mousedown",function(){if(c.active===!0){f();var b=function(){c.$apply(function(){angular.element(a[0].body).unbind("mouseup",b),g()})};angular.element(a[0].body).bind("mouseup",b)}}),d.bind("mousemove",function(d){if(e()){var f=angular.element(a[0].elementFromPoint(d.clientX,d.clientY)),g=f.controller("ngModel").$modelValue;c.$apply(function(){c.swap({a:g,b:b.startRow})})}});var e=function(){return void 0!==b.startRow&&!angular.equals(c.row,b.startRow)},f=function(){b.startRow=c.row,d.css("cursor","move"),angular.element(a[0].body).css({"-moz-user-select":"-moz-none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none",cursor:"no-drop"})},g=function(){b.startRow=void 0,d.css("cursor","pointer"),angular.element(a[0].body).css({"-moz-user-select":"","-webkit-user-select":"","-ms-user-select":"","user-select":"",cursor:"auto"})}}]}}]),gantt.directive("ganttTooltip",["$timeout","$document","debounce","smartEvent",function(a,b,c,d){return{restrict:"E",template:"<div ng-mouseenter='mouseEnter($event)' ng-mouseleave='mouseLeave($event)'><div ng-if='visible' class='gantt-task-info' ng-style='css'><div class='gantt-task-info-content'>{{ task.subject }}</br><small>{{ task.isMilestone === true && (task.from | date:'MMM d, HH:mm') || (task.from | date:'MMM d, HH:mm') + ' - ' + (task.to | date:'MMM d, HH:mm') }}</small></div></div><div ng-transclude></div></div>",replace:!0,transclude:!0,scope:{task:"=ngModel"},controller:["$scope","$element",function(e,f){var g=angular.element(b[0].body);e.visible=!1,e.css={},e.mouseEnter=function(a){e.task.isMoving||j(a.clientX)},e.mouseLeave=function(){e.task.isMoving||l()};var h=d(e,g,"mousemove",c(function(a){e.visible===!0?k(a.clientX):j(a.clientX)},1));e.$watch("task.isMoving",function(a){a===!0?h.bind():a===!1&&(h.unbind(),l())});var i=function(){var a=b[0];return a.documentElement.clientWidth||a.documentElement.getElementById("body")[0].clientWidth},j=function(b){e.task.updateZIndex("boost"),e.visible=!0,a(function(){var a=angular.element(f.children()[0]);k(b),e.css.top=f[0].getBoundingClientRect().top+"px",e.css.marginTop=-a[0].offsetHeight-8+"px",e.css.opacity=1},1,!0)},k=function(a){var b=angular.element(f.children()[0]);b.removeClass("gantt-task-infoArrow"),b.removeClass("gantt-task-infoArrowR"),a+b[0].offsetWidth>i()?(e.css.left=a+20-b[0].offsetWidth+"px",b.addClass("gantt-task-infoArrowR")):(e.css.left=a-20+"px",b.addClass("gantt-task-infoArrow"))},l=function(){e.task.updateZIndex("clear"),e.css.opacity=0,e.visible=!1}}]}}]),gantt.factory("debounce",["$timeout",function(a){function b(b,c){var d=0;return function(){var e=this,f=arguments;d++;var g=function(a){return function(){return a===d?b.apply(e,f):void 0}}(d);return a(g,c,!0)}}return b}]),gantt.factory("keepScrollPos",["$timeout",function(a){function b(b,c){return function(){var d=b.ganttScroll[0],e=d.scrollLeft,f=b.gantt.getFirstColumn(),g=b.getPxToEmFactor();c.apply(this,arguments),f=void 0===f?0:b.gantt.getColumnByDate(f.date).left*g,d.scrollLeft=f+e,d.scrollLeft!=f+e&&a(function(){d.scrollLeft=f+e},0,!1)}}return b}]),gantt.service("mouseOffset",[function(){return{getOffset:function(a){return a.offsetX&&a.offsetY?{x:a.offsetX,y:a.offsetY}:a.layerX&&a.layerY?{x:a.layerX,y:a.layerY}:this.getOffsetForElement(a.target,a)},getOffsetForElement:function(a,b){var c=a.getBoundingClientRect();return{x:b.clientX-c.left,y:b.clientY-c.top}}}}]),gantt.factory("smartEvent",[function(){function a(a,b,c,d){return a.$on("$destroy",function(){b.unbind(c,d)}),{bindOnce:function(){b.one(c,d)},bind:function(){b.bind(c,d)
},unbind:function(){b.unbind(c,d)}}}return a}]);
/*
Copyright 2014 Igor Vaynberg

Version: 3.4.6 Timestamp: Sat Mar 22 22:30:15 EDT 2014

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

http://www.apache.org/licenses/LICENSE-2.0
http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the Apache License
or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied. See the Apache License and the GPL License for the specific language governing
permissions and limitations under the Apache License and the GPL License.
*/
!function(a){"undefined"==typeof a.fn.each2&&a.extend(a.fn,{each2:function(b){for(var c=a([0]),d=-1,e=this.length;++d<e&&(c.context=c[0]=this[d])&&b.call(c[0],d,c)!==!1;);return this}})}(jQuery),function(a,b){"use strict";function n(b){var c=a(document.createTextNode(""));b.before(c),c.before(b),c.remove()}function o(a){var b,c,d,e;if(!a||a.length<1)return a;for(b="",c=0,d=a.length;d>c;c++)e=a.charAt(c),b+=m[e]||e;return b}function p(a,b){for(var c=0,d=b.length;d>c;c+=1)if(r(a,b[c]))return c;return-1}function q(){var b=a(l);b.appendTo("body");var c={width:b.width()-b[0].clientWidth,height:b.height()-b[0].clientHeight};return b.remove(),c}function r(a,c){return a===c?!0:a===b||c===b?!1:null===a||null===c?!1:a.constructor===String?a+""==c+"":c.constructor===String?c+""==a+"":!1}function s(b,c){var d,e,f;if(null===b||b.length<1)return[];for(d=b.split(c),e=0,f=d.length;f>e;e+=1)d[e]=a.trim(d[e]);return d}function t(a){return a.outerWidth(!1)-a.width()}function u(c){var d="keyup-change-value";c.on("keydown",function(){a.data(c,d)===b&&a.data(c,d,c.val())}),c.on("keyup",function(){var e=a.data(c,d);e!==b&&c.val()!==e&&(a.removeData(c,d),c.trigger("keyup-change"))})}function v(c){c.on("mousemove",function(c){var d=i;(d===b||d.x!==c.pageX||d.y!==c.pageY)&&a(c.target).trigger("mousemove-filtered",c)})}function w(a,c,d){d=d||b;var e;return function(){var b=arguments;window.clearTimeout(e),e=window.setTimeout(function(){c.apply(d,b)},a)}}function x(a){var c,b=!1;return function(){return b===!1&&(c=a(),b=!0),c}}function y(a,b){var c=w(a,function(a){b.trigger("scroll-debounced",a)});b.on("scroll",function(a){p(a.target,b.get())>=0&&c(a)})}function z(a){a[0]!==document.activeElement&&window.setTimeout(function(){var d,b=a[0],c=a.val().length;a.focus();var e=b.offsetWidth>0||b.offsetHeight>0;e&&b===document.activeElement&&(b.setSelectionRange?b.setSelectionRange(c,c):b.createTextRange&&(d=b.createTextRange(),d.collapse(!1),d.select()))},0)}function A(b){b=a(b)[0];var c=0,d=0;if("selectionStart"in b)c=b.selectionStart,d=b.selectionEnd-c;else if("selection"in document){b.focus();var e=document.selection.createRange();d=document.selection.createRange().text.length,e.moveStart("character",-b.value.length),c=e.text.length-d}return{offset:c,length:d}}function B(a){a.preventDefault(),a.stopPropagation()}function C(a){a.preventDefault(),a.stopImmediatePropagation()}function D(b){if(!h){var c=b[0].currentStyle||window.getComputedStyle(b[0],null);h=a(document.createElement("div")).css({position:"absolute",left:"-10000px",top:"-10000px",display:"none",fontSize:c.fontSize,fontFamily:c.fontFamily,fontStyle:c.fontStyle,fontWeight:c.fontWeight,letterSpacing:c.letterSpacing,textTransform:c.textTransform,whiteSpace:"nowrap"}),h.attr("class","select2-sizer"),a("body").append(h)}return h.text(b.val()),h.width()}function E(b,c,d){var e,g,f=[];e=b.attr("class"),e&&(e=""+e,a(e.split(" ")).each2(function(){0===this.indexOf("select2-")&&f.push(this)})),e=c.attr("class"),e&&(e=""+e,a(e.split(" ")).each2(function(){0!==this.indexOf("select2-")&&(g=d(this),g&&f.push(g))})),b.attr("class",f.join(" "))}function F(a,b,c,d){var e=o(a.toUpperCase()).indexOf(o(b.toUpperCase())),f=b.length;return 0>e?(c.push(d(a)),void 0):(c.push(d(a.substring(0,e))),c.push("<span class='select2-match'>"),c.push(d(a.substring(e,e+f))),c.push("</span>"),c.push(d(a.substring(e+f,a.length))),void 0)}function G(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})}function H(c){var d,e=null,f=c.quietMillis||100,g=c.url,h=this;return function(i){window.clearTimeout(d),d=window.setTimeout(function(){var d=c.data,f=g,j=c.transport||a.fn.select2.ajaxDefaults.transport,k={type:c.type||"GET",cache:c.cache||!1,jsonpCallback:c.jsonpCallback||b,dataType:c.dataType||"json"},l=a.extend({},a.fn.select2.ajaxDefaults.params,k);d=d?d.call(h,i.term,i.page,i.context):null,f="function"==typeof f?f.call(h,i.term,i.page,i.context):f,e&&"function"==typeof e.abort&&e.abort(),c.params&&(a.isFunction(c.params)?a.extend(l,c.params.call(h)):a.extend(l,c.params)),a.extend(l,{url:f,dataType:c.dataType,data:d,success:function(a){var b=c.results(a,i.page);i.callback(b)}}),e=j.call(h,l)},f)}}function I(b){var d,e,c=b,f=function(a){return""+a.text};a.isArray(c)&&(e=c,c={results:e}),a.isFunction(c)===!1&&(e=c,c=function(){return e});var g=c();return g.text&&(f=g.text,a.isFunction(f)||(d=g.text,f=function(a){return a[d]})),function(b){var g,d=b.term,e={results:[]};return""===d?(b.callback(c()),void 0):(g=function(c,e){var h,i;if(c=c[0],c.children){h={};for(i in c)c.hasOwnProperty(i)&&(h[i]=c[i]);h.children=[],a(c.children).each2(function(a,b){g(b,h.children)}),(h.children.length||b.matcher(d,f(h),c))&&e.push(h)}else b.matcher(d,f(c),c)&&e.push(c)},a(c().results).each2(function(a,b){g(b,e.results)}),b.callback(e),void 0)}}function J(c){var d=a.isFunction(c);return function(e){var f=e.term,g={results:[]};a(d?c():c).each(function(){var a=this.text!==b,c=a?this.text:this;(""===f||e.matcher(f,c))&&g.results.push(a?this:{id:this,text:this})}),e.callback(g)}}function K(b,c){if(a.isFunction(b))return!0;if(!b)return!1;if("string"==typeof b)return!0;throw new Error(c+" must be a string, function, or falsy value")}function L(b){if(a.isFunction(b)){var c=Array.prototype.slice.call(arguments,1);return b.apply(null,c)}return b}function M(b){var c=0;return a.each(b,function(a,b){b.children?c+=M(b.children):c++}),c}function N(a,c,d,e){var h,i,j,k,l,f=a,g=!1;if(!e.createSearchChoice||!e.tokenSeparators||e.tokenSeparators.length<1)return b;for(;;){for(i=-1,j=0,k=e.tokenSeparators.length;k>j&&(l=e.tokenSeparators[j],i=a.indexOf(l),!(i>=0));j++);if(0>i)break;if(h=a.substring(0,i),a=a.substring(i+l.length),h.length>0&&(h=e.createSearchChoice.call(this,h,c),h!==b&&null!==h&&e.id(h)!==b&&null!==e.id(h))){for(g=!1,j=0,k=c.length;k>j;j++)if(r(e.id(h),e.id(c[j]))){g=!0;break}g||d(h)}}return f!==a?a:void 0}function O(b,c){var d=function(){};return d.prototype=new b,d.prototype.constructor=d,d.prototype.parent=b.prototype,d.prototype=a.extend(d.prototype,c),d}if(window.Select2===b){var c,d,e,f,g,h,j,k,i={x:0,y:0},c={TAB:9,ENTER:13,ESC:27,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,SHIFT:16,CTRL:17,ALT:18,PAGE_UP:33,PAGE_DOWN:34,HOME:36,END:35,BACKSPACE:8,DELETE:46,isArrow:function(a){switch(a=a.which?a.which:a){case c.LEFT:case c.RIGHT:case c.UP:case c.DOWN:return!0}return!1},isControl:function(a){var b=a.which;switch(b){case c.SHIFT:case c.CTRL:case c.ALT:return!0}return a.metaKey?!0:!1},isFunctionKey:function(a){return a=a.which?a.which:a,a>=112&&123>=a}},l="<div class='select2-measure-scrollbar'></div>",m={"\u24b6":"A","\uff21":"A","\xc0":"A","\xc1":"A","\xc2":"A","\u1ea6":"A","\u1ea4":"A","\u1eaa":"A","\u1ea8":"A","\xc3":"A","\u0100":"A","\u0102":"A","\u1eb0":"A","\u1eae":"A","\u1eb4":"A","\u1eb2":"A","\u0226":"A","\u01e0":"A","\xc4":"A","\u01de":"A","\u1ea2":"A","\xc5":"A","\u01fa":"A","\u01cd":"A","\u0200":"A","\u0202":"A","\u1ea0":"A","\u1eac":"A","\u1eb6":"A","\u1e00":"A","\u0104":"A","\u023a":"A","\u2c6f":"A","\ua732":"AA","\xc6":"AE","\u01fc":"AE","\u01e2":"AE","\ua734":"AO","\ua736":"AU","\ua738":"AV","\ua73a":"AV","\ua73c":"AY","\u24b7":"B","\uff22":"B","\u1e02":"B","\u1e04":"B","\u1e06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24b8":"C","\uff23":"C","\u0106":"C","\u0108":"C","\u010a":"C","\u010c":"C","\xc7":"C","\u1e08":"C","\u0187":"C","\u023b":"C","\ua73e":"C","\u24b9":"D","\uff24":"D","\u1e0a":"D","\u010e":"D","\u1e0c":"D","\u1e10":"D","\u1e12":"D","\u1e0e":"D","\u0110":"D","\u018b":"D","\u018a":"D","\u0189":"D","\ua779":"D","\u01f1":"DZ","\u01c4":"DZ","\u01f2":"Dz","\u01c5":"Dz","\u24ba":"E","\uff25":"E","\xc8":"E","\xc9":"E","\xca":"E","\u1ec0":"E","\u1ebe":"E","\u1ec4":"E","\u1ec2":"E","\u1ebc":"E","\u0112":"E","\u1e14":"E","\u1e16":"E","\u0114":"E","\u0116":"E","\xcb":"E","\u1eba":"E","\u011a":"E","\u0204":"E","\u0206":"E","\u1eb8":"E","\u1ec6":"E","\u0228":"E","\u1e1c":"E","\u0118":"E","\u1e18":"E","\u1e1a":"E","\u0190":"E","\u018e":"E","\u24bb":"F","\uff26":"F","\u1e1e":"F","\u0191":"F","\ua77b":"F","\u24bc":"G","\uff27":"G","\u01f4":"G","\u011c":"G","\u1e20":"G","\u011e":"G","\u0120":"G","\u01e6":"G","\u0122":"G","\u01e4":"G","\u0193":"G","\ua7a0":"G","\ua77d":"G","\ua77e":"G","\u24bd":"H","\uff28":"H","\u0124":"H","\u1e22":"H","\u1e26":"H","\u021e":"H","\u1e24":"H","\u1e28":"H","\u1e2a":"H","\u0126":"H","\u2c67":"H","\u2c75":"H","\ua78d":"H","\u24be":"I","\uff29":"I","\xcc":"I","\xcd":"I","\xce":"I","\u0128":"I","\u012a":"I","\u012c":"I","\u0130":"I","\xcf":"I","\u1e2e":"I","\u1ec8":"I","\u01cf":"I","\u0208":"I","\u020a":"I","\u1eca":"I","\u012e":"I","\u1e2c":"I","\u0197":"I","\u24bf":"J","\uff2a":"J","\u0134":"J","\u0248":"J","\u24c0":"K","\uff2b":"K","\u1e30":"K","\u01e8":"K","\u1e32":"K","\u0136":"K","\u1e34":"K","\u0198":"K","\u2c69":"K","\ua740":"K","\ua742":"K","\ua744":"K","\ua7a2":"K","\u24c1":"L","\uff2c":"L","\u013f":"L","\u0139":"L","\u013d":"L","\u1e36":"L","\u1e38":"L","\u013b":"L","\u1e3c":"L","\u1e3a":"L","\u0141":"L","\u023d":"L","\u2c62":"L","\u2c60":"L","\ua748":"L","\ua746":"L","\ua780":"L","\u01c7":"LJ","\u01c8":"Lj","\u24c2":"M","\uff2d":"M","\u1e3e":"M","\u1e40":"M","\u1e42":"M","\u2c6e":"M","\u019c":"M","\u24c3":"N","\uff2e":"N","\u01f8":"N","\u0143":"N","\xd1":"N","\u1e44":"N","\u0147":"N","\u1e46":"N","\u0145":"N","\u1e4a":"N","\u1e48":"N","\u0220":"N","\u019d":"N","\ua790":"N","\ua7a4":"N","\u01ca":"NJ","\u01cb":"Nj","\u24c4":"O","\uff2f":"O","\xd2":"O","\xd3":"O","\xd4":"O","\u1ed2":"O","\u1ed0":"O","\u1ed6":"O","\u1ed4":"O","\xd5":"O","\u1e4c":"O","\u022c":"O","\u1e4e":"O","\u014c":"O","\u1e50":"O","\u1e52":"O","\u014e":"O","\u022e":"O","\u0230":"O","\xd6":"O","\u022a":"O","\u1ece":"O","\u0150":"O","\u01d1":"O","\u020c":"O","\u020e":"O","\u01a0":"O","\u1edc":"O","\u1eda":"O","\u1ee0":"O","\u1ede":"O","\u1ee2":"O","\u1ecc":"O","\u1ed8":"O","\u01ea":"O","\u01ec":"O","\xd8":"O","\u01fe":"O","\u0186":"O","\u019f":"O","\ua74a":"O","\ua74c":"O","\u01a2":"OI","\ua74e":"OO","\u0222":"OU","\u24c5":"P","\uff30":"P","\u1e54":"P","\u1e56":"P","\u01a4":"P","\u2c63":"P","\ua750":"P","\ua752":"P","\ua754":"P","\u24c6":"Q","\uff31":"Q","\ua756":"Q","\ua758":"Q","\u024a":"Q","\u24c7":"R","\uff32":"R","\u0154":"R","\u1e58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1e5a":"R","\u1e5c":"R","\u0156":"R","\u1e5e":"R","\u024c":"R","\u2c64":"R","\ua75a":"R","\ua7a6":"R","\ua782":"R","\u24c8":"S","\uff33":"S","\u1e9e":"S","\u015a":"S","\u1e64":"S","\u015c":"S","\u1e60":"S","\u0160":"S","\u1e66":"S","\u1e62":"S","\u1e68":"S","\u0218":"S","\u015e":"S","\u2c7e":"S","\ua7a8":"S","\ua784":"S","\u24c9":"T","\uff34":"T","\u1e6a":"T","\u0164":"T","\u1e6c":"T","\u021a":"T","\u0162":"T","\u1e70":"T","\u1e6e":"T","\u0166":"T","\u01ac":"T","\u01ae":"T","\u023e":"T","\ua786":"T","\ua728":"TZ","\u24ca":"U","\uff35":"U","\xd9":"U","\xda":"U","\xdb":"U","\u0168":"U","\u1e78":"U","\u016a":"U","\u1e7a":"U","\u016c":"U","\xdc":"U","\u01db":"U","\u01d7":"U","\u01d5":"U","\u01d9":"U","\u1ee6":"U","\u016e":"U","\u0170":"U","\u01d3":"U","\u0214":"U","\u0216":"U","\u01af":"U","\u1eea":"U","\u1ee8":"U","\u1eee":"U","\u1eec":"U","\u1ef0":"U","\u1ee4":"U","\u1e72":"U","\u0172":"U","\u1e76":"U","\u1e74":"U","\u0244":"U","\u24cb":"V","\uff36":"V","\u1e7c":"V","\u1e7e":"V","\u01b2":"V","\ua75e":"V","\u0245":"V","\ua760":"VY","\u24cc":"W","\uff37":"W","\u1e80":"W","\u1e82":"W","\u0174":"W","\u1e86":"W","\u1e84":"W","\u1e88":"W","\u2c72":"W","\u24cd":"X","\uff38":"X","\u1e8a":"X","\u1e8c":"X","\u24ce":"Y","\uff39":"Y","\u1ef2":"Y","\xdd":"Y","\u0176":"Y","\u1ef8":"Y","\u0232":"Y","\u1e8e":"Y","\u0178":"Y","\u1ef6":"Y","\u1ef4":"Y","\u01b3":"Y","\u024e":"Y","\u1efe":"Y","\u24cf":"Z","\uff3a":"Z","\u0179":"Z","\u1e90":"Z","\u017b":"Z","\u017d":"Z","\u1e92":"Z","\u1e94":"Z","\u01b5":"Z","\u0224":"Z","\u2c7f":"Z","\u2c6b":"Z","\ua762":"Z","\u24d0":"a","\uff41":"a","\u1e9a":"a","\xe0":"a","\xe1":"a","\xe2":"a","\u1ea7":"a","\u1ea5":"a","\u1eab":"a","\u1ea9":"a","\xe3":"a","\u0101":"a","\u0103":"a","\u1eb1":"a","\u1eaf":"a","\u1eb5":"a","\u1eb3":"a","\u0227":"a","\u01e1":"a","\xe4":"a","\u01df":"a","\u1ea3":"a","\xe5":"a","\u01fb":"a","\u01ce":"a","\u0201":"a","\u0203":"a","\u1ea1":"a","\u1ead":"a","\u1eb7":"a","\u1e01":"a","\u0105":"a","\u2c65":"a","\u0250":"a","\ua733":"aa","\xe6":"ae","\u01fd":"ae","\u01e3":"ae","\ua735":"ao","\ua737":"au","\ua739":"av","\ua73b":"av","\ua73d":"ay","\u24d1":"b","\uff42":"b","\u1e03":"b","\u1e05":"b","\u1e07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24d2":"c","\uff43":"c","\u0107":"c","\u0109":"c","\u010b":"c","\u010d":"c","\xe7":"c","\u1e09":"c","\u0188":"c","\u023c":"c","\ua73f":"c","\u2184":"c","\u24d3":"d","\uff44":"d","\u1e0b":"d","\u010f":"d","\u1e0d":"d","\u1e11":"d","\u1e13":"d","\u1e0f":"d","\u0111":"d","\u018c":"d","\u0256":"d","\u0257":"d","\ua77a":"d","\u01f3":"dz","\u01c6":"dz","\u24d4":"e","\uff45":"e","\xe8":"e","\xe9":"e","\xea":"e","\u1ec1":"e","\u1ebf":"e","\u1ec5":"e","\u1ec3":"e","\u1ebd":"e","\u0113":"e","\u1e15":"e","\u1e17":"e","\u0115":"e","\u0117":"e","\xeb":"e","\u1ebb":"e","\u011b":"e","\u0205":"e","\u0207":"e","\u1eb9":"e","\u1ec7":"e","\u0229":"e","\u1e1d":"e","\u0119":"e","\u1e19":"e","\u1e1b":"e","\u0247":"e","\u025b":"e","\u01dd":"e","\u24d5":"f","\uff46":"f","\u1e1f":"f","\u0192":"f","\ua77c":"f","\u24d6":"g","\uff47":"g","\u01f5":"g","\u011d":"g","\u1e21":"g","\u011f":"g","\u0121":"g","\u01e7":"g","\u0123":"g","\u01e5":"g","\u0260":"g","\ua7a1":"g","\u1d79":"g","\ua77f":"g","\u24d7":"h","\uff48":"h","\u0125":"h","\u1e23":"h","\u1e27":"h","\u021f":"h","\u1e25":"h","\u1e29":"h","\u1e2b":"h","\u1e96":"h","\u0127":"h","\u2c68":"h","\u2c76":"h","\u0265":"h","\u0195":"hv","\u24d8":"i","\uff49":"i","\xec":"i","\xed":"i","\xee":"i","\u0129":"i","\u012b":"i","\u012d":"i","\xef":"i","\u1e2f":"i","\u1ec9":"i","\u01d0":"i","\u0209":"i","\u020b":"i","\u1ecb":"i","\u012f":"i","\u1e2d":"i","\u0268":"i","\u0131":"i","\u24d9":"j","\uff4a":"j","\u0135":"j","\u01f0":"j","\u0249":"j","\u24da":"k","\uff4b":"k","\u1e31":"k","\u01e9":"k","\u1e33":"k","\u0137":"k","\u1e35":"k","\u0199":"k","\u2c6a":"k","\ua741":"k","\ua743":"k","\ua745":"k","\ua7a3":"k","\u24db":"l","\uff4c":"l","\u0140":"l","\u013a":"l","\u013e":"l","\u1e37":"l","\u1e39":"l","\u013c":"l","\u1e3d":"l","\u1e3b":"l","\u017f":"l","\u0142":"l","\u019a":"l","\u026b":"l","\u2c61":"l","\ua749":"l","\ua781":"l","\ua747":"l","\u01c9":"lj","\u24dc":"m","\uff4d":"m","\u1e3f":"m","\u1e41":"m","\u1e43":"m","\u0271":"m","\u026f":"m","\u24dd":"n","\uff4e":"n","\u01f9":"n","\u0144":"n","\xf1":"n","\u1e45":"n","\u0148":"n","\u1e47":"n","\u0146":"n","\u1e4b":"n","\u1e49":"n","\u019e":"n","\u0272":"n","\u0149":"n","\ua791":"n","\ua7a5":"n","\u01cc":"nj","\u24de":"o","\uff4f":"o","\xf2":"o","\xf3":"o","\xf4":"o","\u1ed3":"o","\u1ed1":"o","\u1ed7":"o","\u1ed5":"o","\xf5":"o","\u1e4d":"o","\u022d":"o","\u1e4f":"o","\u014d":"o","\u1e51":"o","\u1e53":"o","\u014f":"o","\u022f":"o","\u0231":"o","\xf6":"o","\u022b":"o","\u1ecf":"o","\u0151":"o","\u01d2":"o","\u020d":"o","\u020f":"o","\u01a1":"o","\u1edd":"o","\u1edb":"o","\u1ee1":"o","\u1edf":"o","\u1ee3":"o","\u1ecd":"o","\u1ed9":"o","\u01eb":"o","\u01ed":"o","\xf8":"o","\u01ff":"o","\u0254":"o","\ua74b":"o","\ua74d":"o","\u0275":"o","\u01a3":"oi","\u0223":"ou","\ua74f":"oo","\u24df":"p","\uff50":"p","\u1e55":"p","\u1e57":"p","\u01a5":"p","\u1d7d":"p","\ua751":"p","\ua753":"p","\ua755":"p","\u24e0":"q","\uff51":"q","\u024b":"q","\ua757":"q","\ua759":"q","\u24e1":"r","\uff52":"r","\u0155":"r","\u1e59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1e5b":"r","\u1e5d":"r","\u0157":"r","\u1e5f":"r","\u024d":"r","\u027d":"r","\ua75b":"r","\ua7a7":"r","\ua783":"r","\u24e2":"s","\uff53":"s","\xdf":"s","\u015b":"s","\u1e65":"s","\u015d":"s","\u1e61":"s","\u0161":"s","\u1e67":"s","\u1e63":"s","\u1e69":"s","\u0219":"s","\u015f":"s","\u023f":"s","\ua7a9":"s","\ua785":"s","\u1e9b":"s","\u24e3":"t","\uff54":"t","\u1e6b":"t","\u1e97":"t","\u0165":"t","\u1e6d":"t","\u021b":"t","\u0163":"t","\u1e71":"t","\u1e6f":"t","\u0167":"t","\u01ad":"t","\u0288":"t","\u2c66":"t","\ua787":"t","\ua729":"tz","\u24e4":"u","\uff55":"u","\xf9":"u","\xfa":"u","\xfb":"u","\u0169":"u","\u1e79":"u","\u016b":"u","\u1e7b":"u","\u016d":"u","\xfc":"u","\u01dc":"u","\u01d8":"u","\u01d6":"u","\u01da":"u","\u1ee7":"u","\u016f":"u","\u0171":"u","\u01d4":"u","\u0215":"u","\u0217":"u","\u01b0":"u","\u1eeb":"u","\u1ee9":"u","\u1eef":"u","\u1eed":"u","\u1ef1":"u","\u1ee5":"u","\u1e73":"u","\u0173":"u","\u1e77":"u","\u1e75":"u","\u0289":"u","\u24e5":"v","\uff56":"v","\u1e7d":"v","\u1e7f":"v","\u028b":"v","\ua75f":"v","\u028c":"v","\ua761":"vy","\u24e6":"w","\uff57":"w","\u1e81":"w","\u1e83":"w","\u0175":"w","\u1e87":"w","\u1e85":"w","\u1e98":"w","\u1e89":"w","\u2c73":"w","\u24e7":"x","\uff58":"x","\u1e8b":"x","\u1e8d":"x","\u24e8":"y","\uff59":"y","\u1ef3":"y","\xfd":"y","\u0177":"y","\u1ef9":"y","\u0233":"y","\u1e8f":"y","\xff":"y","\u1ef7":"y","\u1e99":"y","\u1ef5":"y","\u01b4":"y","\u024f":"y","\u1eff":"y","\u24e9":"z","\uff5a":"z","\u017a":"z","\u1e91":"z","\u017c":"z","\u017e":"z","\u1e93":"z","\u1e95":"z","\u01b6":"z","\u0225":"z","\u0240":"z","\u2c6c":"z","\ua763":"z"};j=a(document),g=function(){var a=1;return function(){return a++}}(),j.on("mousemove",function(a){i.x=a.pageX,i.y=a.pageY}),d=O(Object,{bind:function(a){var b=this;return function(){a.apply(b,arguments)}},init:function(c){var d,e,f=".select2-results";this.opts=c=this.prepareOpts(c),this.id=c.id,c.element.data("select2")!==b&&null!==c.element.data("select2")&&c.element.data("select2").destroy(),this.container=this.createContainer(),this.liveRegion=a("<span>",{role:"status","aria-live":"polite"}).addClass("select2-hidden-accessible").appendTo(document.body),this.containerId="s2id_"+(c.element.attr("id")||"autogen"+g()).replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g,"\\$1"),this.containerSelector="#"+this.containerId,this.container.attr("id",this.containerId),this.body=x(function(){return c.element.closest("body")}),E(this.container,this.opts.element,this.opts.adaptContainerCssClass),this.container.attr("style",c.element.attr("style")),this.container.css(L(c.containerCss)),this.container.addClass(L(c.containerCssClass)),this.elementTabIndex=this.opts.element.attr("tabindex"),this.opts.element.data("select2",this).attr("tabindex","-1").before(this.container).on("click.select2",B),this.container.data("select2",this),this.dropdown=this.container.find(".select2-drop"),E(this.dropdown,this.opts.element,this.opts.adaptDropdownCssClass),this.dropdown.addClass(L(c.dropdownCssClass)),this.dropdown.data("select2",this),this.dropdown.on("click",B),this.results=d=this.container.find(f),this.search=e=this.container.find("input.select2-input"),this.queryCount=0,this.resultsPage=0,this.context=null,this.initContainer(),this.container.on("click",B),v(this.results),this.dropdown.on("mousemove-filtered touchstart touchmove touchend",f,this.bind(this.highlightUnderEvent)),this.dropdown.on("touchend",f,this.bind(this.selectHighlighted)),this.dropdown.on("touchmove",f,this.bind(this.touchMoved)),this.dropdown.on("touchstart touchend",f,this.bind(this.clearTouchMoved)),y(80,this.results),this.dropdown.on("scroll-debounced",f,this.bind(this.loadMoreIfNeeded)),a(this.container).on("change",".select2-input",function(a){a.stopPropagation()}),a(this.dropdown).on("change",".select2-input",function(a){a.stopPropagation()}),a.fn.mousewheel&&d.mousewheel(function(a,b,c,e){var f=d.scrollTop();e>0&&0>=f-e?(d.scrollTop(0),B(a)):0>e&&d.get(0).scrollHeight-d.scrollTop()+e<=d.height()&&(d.scrollTop(d.get(0).scrollHeight-d.height()),B(a))}),u(e),e.on("keyup-change input paste",this.bind(this.updateResults)),e.on("focus",function(){e.addClass("select2-focused")}),e.on("blur",function(){e.removeClass("select2-focused")}),this.dropdown.on("mouseup",f,this.bind(function(b){a(b.target).closest(".select2-result-selectable").length>0&&(this.highlightUnderEvent(b),this.selectHighlighted(b))})),this.dropdown.on("click mouseup mousedown focusin",function(a){a.stopPropagation()}),this.nextSearchTerm=b,a.isFunction(this.opts.initSelection)&&(this.initSelection(),this.monitorSource()),null!==c.maximumInputLength&&this.search.attr("maxlength",c.maximumInputLength);var h=c.element.prop("disabled");h===b&&(h=!1),this.enable(!h);var i=c.element.prop("readonly");i===b&&(i=!1),this.readonly(i),k=k||q(),this.autofocus=c.element.prop("autofocus"),c.element.prop("autofocus",!1),this.autofocus&&this.focus(),this.search.attr("placeholder",c.searchInputPlaceholder)},destroy:function(){var a=this.opts.element,c=a.data("select2");this.close(),this.propertyObserver&&(delete this.propertyObserver,this.propertyObserver=null),c!==b&&(c.container.remove(),c.liveRegion.remove(),c.dropdown.remove(),a.removeClass("select2-offscreen").removeData("select2").off(".select2").prop("autofocus",this.autofocus||!1),this.elementTabIndex?a.attr({tabindex:this.elementTabIndex}):a.removeAttr("tabindex"),a.show())},optionToData:function(a){return a.is("option")?{id:a.prop("value"),text:a.text(),element:a.get(),css:a.attr("class"),disabled:a.prop("disabled"),locked:r(a.attr("locked"),"locked")||r(a.data("locked"),!0)}:a.is("optgroup")?{text:a.attr("label"),children:[],element:a.get(),css:a.attr("class")}:void 0},prepareOpts:function(c){var d,e,f,h,i=this;if(d=c.element,"select"===d.get(0).tagName.toLowerCase()&&(this.select=e=c.element),e&&a.each(["id","multiple","ajax","query","createSearchChoice","initSelection","data","tags"],function(){if(this in c)throw new Error("Option '"+this+"' is not allowed for Select2 when attached to a <select> element.")}),c=a.extend({},{populateResults:function(d,e,f){var h,j=this.opts.id,k=this.liveRegion;h=function(d,e,l){var m,n,o,p,q,r,s,t,u,v;for(d=c.sortResults(d,e,f),m=0,n=d.length;n>m;m+=1)o=d[m],q=o.disabled===!0,p=!q&&j(o)!==b,r=o.children&&o.children.length>0,s=a("<li></li>"),s.addClass("select2-results-dept-"+l),s.addClass("select2-result"),s.addClass(p?"select2-result-selectable":"select2-result-unselectable"),q&&s.addClass("select2-disabled"),r&&s.addClass("select2-result-with-children"),s.addClass(i.opts.formatResultCssClass(o)),s.attr("role","presentation"),t=a(document.createElement("div")),t.addClass("select2-result-label"),t.attr("id","select2-result-label-"+g()),t.attr("role","option"),v=c.formatResult(o,t,f,i.opts.escapeMarkup),v!==b&&(t.html(v),s.append(t)),r&&(u=a("<ul></ul>"),u.addClass("select2-result-sub"),h(o.children,u,l+1),s.append(u)),s.data("select2-data",o),e.append(s);k.text(c.formatMatches(d.length))},h(e,d,0)}},a.fn.select2.defaults,c),"function"!=typeof c.id&&(f=c.id,c.id=function(a){return a[f]}),a.isArray(c.element.data("select2Tags"))){if("tags"in c)throw"tags specified as both an attribute 'data-select2-tags' and in options of Select2 "+c.element.attr("id");c.tags=c.element.data("select2Tags")}if(e?(c.query=this.bind(function(a){var f,g,h,c={results:[],more:!1},e=a.term;h=function(b,c){var d;b.is("option")?a.matcher(e,b.text(),b)&&c.push(i.optionToData(b)):b.is("optgroup")&&(d=i.optionToData(b),b.children().each2(function(a,b){h(b,d.children)}),d.children.length>0&&c.push(d))},f=d.children(),this.getPlaceholder()!==b&&f.length>0&&(g=this.getPlaceholderOption(),g&&(f=f.not(g))),f.each2(function(a,b){h(b,c.results)}),a.callback(c)}),c.id=function(a){return a.id}):"query"in c||("ajax"in c?(h=c.element.data("ajax-url"),h&&h.length>0&&(c.ajax.url=h),c.query=H.call(c.element,c.ajax)):"data"in c?c.query=I(c.data):"tags"in c&&(c.query=J(c.tags),c.createSearchChoice===b&&(c.createSearchChoice=function(b){return{id:a.trim(b),text:a.trim(b)}}),c.initSelection===b&&(c.initSelection=function(b,d){var e=[];a(s(b.val(),c.separator)).each(function(){var b={id:this,text:this},d=c.tags;a.isFunction(d)&&(d=d()),a(d).each(function(){return r(this.id,b.id)?(b=this,!1):void 0}),e.push(b)}),d(e)}))),"function"!=typeof c.query)throw"query function not defined for Select2 "+c.element.attr("id");if("top"===c.createSearchChoicePosition)c.createSearchChoicePosition=function(a,b){a.unshift(b)};else if("bottom"===c.createSearchChoicePosition)c.createSearchChoicePosition=function(a,b){a.push(b)};else if("function"!=typeof c.createSearchChoicePosition)throw"invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";return c},monitorSource:function(){var c,d,a=this.opts.element;a.on("change.select2",this.bind(function(){this.opts.element.data("select2-change-triggered")!==!0&&this.initSelection()})),c=this.bind(function(){var c=a.prop("disabled");c===b&&(c=!1),this.enable(!c);var d=a.prop("readonly");d===b&&(d=!1),this.readonly(d),E(this.container,this.opts.element,this.opts.adaptContainerCssClass),this.container.addClass(L(this.opts.containerCssClass)),E(this.dropdown,this.opts.element,this.opts.adaptDropdownCssClass),this.dropdown.addClass(L(this.opts.dropdownCssClass))}),a.on("propertychange.select2",c),this.mutationCallback===b&&(this.mutationCallback=function(a){a.forEach(c)}),d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,d!==b&&(this.propertyObserver&&(delete this.propertyObserver,this.propertyObserver=null),this.propertyObserver=new d(this.mutationCallback),this.propertyObserver.observe(a.get(0),{attributes:!0,subtree:!1}))},triggerSelect:function(b){var c=a.Event("select2-selecting",{val:this.id(b),object:b});return this.opts.element.trigger(c),!c.isDefaultPrevented()},triggerChange:function(b){b=b||{},b=a.extend({},b,{type:"change",val:this.val()}),this.opts.element.data("select2-change-triggered",!0),this.opts.element.trigger(b),this.opts.element.data("select2-change-triggered",!1),this.opts.element.click(),this.opts.blurOnChange&&this.opts.element.blur()},isInterfaceEnabled:function(){return this.enabledInterface===!0},enableInterface:function(){var a=this._enabled&&!this._readonly,b=!a;return a===this.enabledInterface?!1:(this.container.toggleClass("select2-container-disabled",b),this.close(),this.enabledInterface=a,!0)},enable:function(a){a===b&&(a=!0),this._enabled!==a&&(this._enabled=a,this.opts.element.prop("disabled",!a),this.enableInterface())},disable:function(){this.enable(!1)},readonly:function(a){a===b&&(a=!1),this._readonly!==a&&(this._readonly=a,this.opts.element.prop("readonly",a),this.enableInterface())},opened:function(){return this.container.hasClass("select2-dropdown-open")},positionDropdown:function(){var t,u,v,w,x,b=this.dropdown,c=this.container.offset(),d=this.container.outerHeight(!1),e=this.container.outerWidth(!1),f=b.outerHeight(!1),g=a(window),h=g.width(),i=g.height(),j=g.scrollLeft()+h,l=g.scrollTop()+i,m=c.top+d,n=c.left,o=l>=m+f,p=c.top-f>=g.scrollTop(),q=b.outerWidth(!1),r=j>=n+q,s=b.hasClass("select2-drop-above");s?(u=!0,!p&&o&&(v=!0,u=!1)):(u=!1,!o&&p&&(v=!0,u=!0)),v&&(b.hide(),c=this.container.offset(),d=this.container.outerHeight(!1),e=this.container.outerWidth(!1),f=b.outerHeight(!1),j=g.scrollLeft()+h,l=g.scrollTop()+i,m=c.top+d,n=c.left,q=b.outerWidth(!1),r=j>=n+q,b.show()),this.opts.dropdownAutoWidth?(x=a(".select2-results",b)[0],b.addClass("select2-drop-auto-width"),b.css("width",""),q=b.outerWidth(!1)+(x.scrollHeight===x.clientHeight?0:k.width),q>e?e=q:q=e,r=j>=n+q):this.container.removeClass("select2-drop-auto-width"),"static"!==this.body().css("position")&&(t=this.body().offset(),m-=t.top,n-=t.left),r||(n=c.left+this.container.outerWidth(!1)-q),w={left:n,width:e},u?(w.top=c.top-f,w.bottom="auto",this.container.addClass("select2-drop-above"),b.addClass("select2-drop-above")):(w.top=m,w.bottom="auto",this.container.removeClass("select2-drop-above"),b.removeClass("select2-drop-above")),w=a.extend(w,L(this.opts.dropdownCss)),b.css(w)},shouldOpen:function(){var b;return this.opened()?!1:this._enabled===!1||this._readonly===!0?!1:(b=a.Event("select2-opening"),this.opts.element.trigger(b),!b.isDefaultPrevented())},clearDropdownAlignmentPreference:function(){this.container.removeClass("select2-drop-above"),this.dropdown.removeClass("select2-drop-above")},open:function(){return this.shouldOpen()?(this.opening(),!0):!1},opening:function(){var f,b=this.containerId,c="scroll."+b,d="resize."+b,e="orientationchange."+b;this.container.addClass("select2-dropdown-open").addClass("select2-container-active"),this.clearDropdownAlignmentPreference(),this.dropdown[0]!==this.body().children().last()[0]&&this.dropdown.detach().appendTo(this.body()),f=a("#select2-drop-mask"),0==f.length&&(f=a(document.createElement("div")),f.attr("id","select2-drop-mask").attr("class","select2-drop-mask"),f.hide(),f.appendTo(this.body()),f.on("mousedown touchstart click",function(b){n(f);var d,c=a("#select2-drop");c.length>0&&(d=c.data("select2"),d.opts.selectOnBlur&&d.selectHighlighted({noFocus:!0}),d.close(),b.preventDefault(),b.stopPropagation())})),this.dropdown.prev()[0]!==f[0]&&this.dropdown.before(f),a("#select2-drop").removeAttr("id"),this.dropdown.attr("id","select2-drop"),f.show(),this.positionDropdown(),this.dropdown.show(),this.positionDropdown(),this.dropdown.addClass("select2-drop-active");var g=this;this.container.parents().add(window).each(function(){a(this).on(d+" "+c+" "+e,function(){g.positionDropdown()})})},close:function(){if(this.opened()){var b=this.containerId,c="scroll."+b,d="resize."+b,e="orientationchange."+b;this.container.parents().add(window).each(function(){a(this).off(c).off(d).off(e)}),this.clearDropdownAlignmentPreference(),a("#select2-drop-mask").hide(),this.dropdown.removeAttr("id"),this.dropdown.hide(),this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active"),this.results.empty(),this.clearSearch(),this.search.removeClass("select2-active"),this.opts.element.trigger(a.Event("select2-close"))}},externalSearch:function(a){this.open(),this.search.val(a),this.updateResults(!1)},clearSearch:function(){},getMaximumSelectionSize:function(){return L(this.opts.maximumSelectionSize)},ensureHighlightVisible:function(){var c,d,e,f,g,h,i,b=this.results;if(d=this.highlight(),!(0>d)){if(0==d)return b.scrollTop(0),void 0;c=this.findHighlightableChoices().find(".select2-result-label"),e=a(c[d]),f=e.offset().top+e.outerHeight(!0),d===c.length-1&&(i=b.find("li.select2-more-results"),i.length>0&&(f=i.offset().top+i.outerHeight(!0))),g=b.offset().top+b.outerHeight(!0),f>g&&b.scrollTop(b.scrollTop()+(f-g)),h=e.offset().top-b.offset().top,0>h&&"none"!=e.css("display")&&b.scrollTop(b.scrollTop()+h)}},findHighlightableChoices:function(){return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)")},moveHighlight:function(b){for(var c=this.findHighlightableChoices(),d=this.highlight();d>-1&&d<c.length;){d+=b;var e=a(c[d]);if(e.hasClass("select2-result-selectable")&&!e.hasClass("select2-disabled")&&!e.hasClass("select2-selected")){this.highlight(d);break}}},highlight:function(b){var d,e,c=this.findHighlightableChoices();return 0===arguments.length?p(c.filter(".select2-highlighted")[0],c.get()):(b>=c.length&&(b=c.length-1),0>b&&(b=0),this.removeHighlight(),d=a(c[b]),d.addClass("select2-highlighted"),this.search.attr("aria-activedescendant",d.find(".select2-result-label").attr("id")),this.ensureHighlightVisible(),this.liveRegion.text(d.text()),e=d.data("select2-data"),e&&this.opts.element.trigger({type:"select2-highlight",val:this.id(e),choice:e}),void 0)},removeHighlight:function(){this.results.find(".select2-highlighted").removeClass("select2-highlighted")},touchMoved:function(){this._touchMoved=!0},clearTouchMoved:function(){this._touchMoved=!1},countSelectableResults:function(){return this.findHighlightableChoices().length},highlightUnderEvent:function(b){var c=a(b.target).closest(".select2-result-selectable");if(c.length>0&&!c.is(".select2-highlighted")){var d=this.findHighlightableChoices();this.highlight(d.index(c))}else 0==c.length&&this.removeHighlight()},loadMoreIfNeeded:function(){var c,a=this.results,b=a.find("li.select2-more-results"),d=this.resultsPage+1,e=this,f=this.search.val(),g=this.context;
0!==b.length&&(c=b.offset().top-a.offset().top-a.height(),c<=this.opts.loadMorePadding&&(b.addClass("select2-active"),this.opts.query({element:this.opts.element,term:f,page:d,context:g,matcher:this.opts.matcher,callback:this.bind(function(c){e.opened()&&(e.opts.populateResults.call(this,a,c.results,{term:f,page:d,context:g}),e.postprocessResults(c,!1,!1),c.more===!0?(b.detach().appendTo(a).text(L(e.opts.formatLoadMore,d+1)),window.setTimeout(function(){e.loadMoreIfNeeded()},10)):b.remove(),e.positionDropdown(),e.resultsPage=d,e.context=c.context,this.opts.element.trigger({type:"select2-loaded",items:c}))})})))},tokenize:function(){},updateResults:function(c){function m(){d.removeClass("select2-active"),h.positionDropdown(),e.find(".select2-no-results,.select2-selection-limit,.select2-searching").length?h.liveRegion.text(e.text()):h.liveRegion.text(h.opts.formatMatches(e.find(".select2-result-selectable").length))}function n(a){e.html(a),m()}var g,i,l,d=this.search,e=this.results,f=this.opts,h=this,j=d.val(),k=a.data(this.container,"select2-last-term");if((c===!0||!k||!r(j,k))&&(a.data(this.container,"select2-last-term",j),c===!0||this.showSearchInput!==!1&&this.opened())){l=++this.queryCount;var o=this.getMaximumSelectionSize();if(o>=1&&(g=this.data(),a.isArray(g)&&g.length>=o&&K(f.formatSelectionTooBig,"formatSelectionTooBig")))return n("<li class='select2-selection-limit'>"+L(f.formatSelectionTooBig,o)+"</li>"),void 0;if(d.val().length<f.minimumInputLength)return K(f.formatInputTooShort,"formatInputTooShort")?n("<li class='select2-no-results'>"+L(f.formatInputTooShort,d.val(),f.minimumInputLength)+"</li>"):n(""),c&&this.showSearch&&this.showSearch(!0),void 0;if(f.maximumInputLength&&d.val().length>f.maximumInputLength)return K(f.formatInputTooLong,"formatInputTooLong")?n("<li class='select2-no-results'>"+L(f.formatInputTooLong,d.val(),f.maximumInputLength)+"</li>"):n(""),void 0;f.formatSearching&&0===this.findHighlightableChoices().length&&n("<li class='select2-searching'>"+L(f.formatSearching)+"</li>"),d.addClass("select2-active"),this.removeHighlight(),i=this.tokenize(),i!=b&&null!=i&&d.val(i),this.resultsPage=1,f.query({element:f.element,term:d.val(),page:this.resultsPage,context:null,matcher:f.matcher,callback:this.bind(function(g){var i;if(l==this.queryCount){if(!this.opened())return this.search.removeClass("select2-active"),void 0;if(this.context=g.context===b?null:g.context,this.opts.createSearchChoice&&""!==d.val()&&(i=this.opts.createSearchChoice.call(h,d.val(),g.results),i!==b&&null!==i&&h.id(i)!==b&&null!==h.id(i)&&0===a(g.results).filter(function(){return r(h.id(this),h.id(i))}).length&&this.opts.createSearchChoicePosition(g.results,i)),0===g.results.length&&K(f.formatNoMatches,"formatNoMatches"))return n("<li class='select2-no-results'>"+L(f.formatNoMatches,d.val())+"</li>"),void 0;e.empty(),h.opts.populateResults.call(this,e,g.results,{term:d.val(),page:this.resultsPage,context:null}),g.more===!0&&K(f.formatLoadMore,"formatLoadMore")&&(e.append("<li class='select2-more-results'>"+h.opts.escapeMarkup(L(f.formatLoadMore,this.resultsPage))+"</li>"),window.setTimeout(function(){h.loadMoreIfNeeded()},10)),this.postprocessResults(g,c),m(),this.opts.element.trigger({type:"select2-loaded",items:g})}})})}},cancel:function(){this.close()},blur:function(){this.opts.selectOnBlur&&this.selectHighlighted({noFocus:!0}),this.close(),this.container.removeClass("select2-container-active"),this.search[0]===document.activeElement&&this.search.blur(),this.clearSearch(),this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus")},focusSearch:function(){z(this.search)},selectHighlighted:function(a){if(this._touchMoved)return this.clearTouchMoved(),void 0;var b=this.highlight(),c=this.results.find(".select2-highlighted"),d=c.closest(".select2-result").data("select2-data");d?(this.highlight(b),this.onSelect(d,a)):a&&a.noFocus&&this.close()},getPlaceholder:function(){var a;return this.opts.element.attr("placeholder")||this.opts.element.attr("data-placeholder")||this.opts.element.data("placeholder")||this.opts.placeholder||((a=this.getPlaceholderOption())!==b?a.text():b)},getPlaceholderOption:function(){if(this.select){var a=this.select.children("option").first();if(this.opts.placeholderOption!==b)return"first"===this.opts.placeholderOption&&a||"function"==typeof this.opts.placeholderOption&&this.opts.placeholderOption(this.select);if(""===a.text()&&""===a.val())return a}},initContainerWidth:function(){function c(){var c,d,e,f,g,h;if("off"===this.opts.width)return null;if("element"===this.opts.width)return 0===this.opts.element.outerWidth(!1)?"auto":this.opts.element.outerWidth(!1)+"px";if("copy"===this.opts.width||"resolve"===this.opts.width){if(c=this.opts.element.attr("style"),c!==b)for(d=c.split(";"),f=0,g=d.length;g>f;f+=1)if(h=d[f].replace(/\s/g,""),e=h.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i),null!==e&&e.length>=1)return e[1];return"resolve"===this.opts.width?(c=this.opts.element.css("width"),c.indexOf("%")>0?c:0===this.opts.element.outerWidth(!1)?"auto":this.opts.element.outerWidth(!1)+"px"):null}return a.isFunction(this.opts.width)?this.opts.width():this.opts.width}var d=c.call(this);null!==d&&this.container.css("width",d)}}),e=O(d,{createContainer:function(){var b=a(document.createElement("div")).attr({"class":"select2-container"}).html(["<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>","   <span class='select2-chosen'>&nbsp;</span><abbr class='select2-search-choice-close'></abbr>","   <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>","</a>","<label for='' class='select2-offscreen'></label>","<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />","<div class='select2-drop select2-display-none'>","   <div class='select2-search'>","       <label for='' class='select2-offscreen'></label>","       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'","       aria-autocomplete='list' />","   </div>","   <ul class='select2-results' role='listbox'>","   </ul>","</div>"].join(""));return b},enableInterface:function(){this.parent.enableInterface.apply(this,arguments)&&this.focusser.prop("disabled",!this.isInterfaceEnabled())},opening:function(){var c,d,e;this.opts.minimumResultsForSearch>=0&&this.showSearch(!0),this.parent.opening.apply(this,arguments),this.showSearchInput!==!1&&this.search.val(this.focusser.val()),this.search.focus(),c=this.search.get(0),c.createTextRange?(d=c.createTextRange(),d.collapse(!1),d.select()):c.setSelectionRange&&(e=this.search.val().length,c.setSelectionRange(e,e)),""===this.search.val()&&this.nextSearchTerm!=b&&(this.search.val(this.nextSearchTerm),this.search.select()),this.focusser.prop("disabled",!0).val(""),this.updateResults(!0),this.opts.element.trigger(a.Event("select2-open"))},close:function(){this.opened()&&(this.parent.close.apply(this,arguments),this.focusser.prop("disabled",!1),this.opts.shouldFocusInput(this)&&this.focusser.focus())},focus:function(){this.opened()?this.close():(this.focusser.prop("disabled",!1),this.opts.shouldFocusInput(this)&&this.focusser.focus())},isFocused:function(){return this.container.hasClass("select2-container-active")},cancel:function(){this.parent.cancel.apply(this,arguments),this.focusser.prop("disabled",!1),this.opts.shouldFocusInput(this)&&this.focusser.focus()},destroy:function(){a("label[for='"+this.focusser.attr("id")+"']").attr("for",this.opts.element.attr("id")),this.parent.destroy.apply(this,arguments)},initContainer:function(){var b,h,d=this.container,e=this.dropdown,f=g();this.opts.minimumResultsForSearch<0?this.showSearch(!1):this.showSearch(!0),this.selection=b=d.find(".select2-choice"),this.focusser=d.find(".select2-focusser"),b.find(".select2-chosen").attr("id","select2-chosen-"+f),this.focusser.attr("aria-labelledby","select2-chosen-"+f),this.results.attr("id","select2-results-"+f),this.search.attr("aria-owns","select2-results-"+f),this.focusser.attr("id","s2id_autogen"+f),h=a("label[for='"+this.opts.element.attr("id")+"']"),this.focusser.prev().text(h.text()).attr("for",this.focusser.attr("id"));var i=this.opts.element.attr("title");this.opts.element.attr("title",i||h.text()),this.focusser.attr("tabindex",this.elementTabIndex),this.search.attr("id",this.focusser.attr("id")+"_search"),this.search.prev().text(a("label[for='"+this.focusser.attr("id")+"']").text()).attr("for",this.search.attr("id")),this.search.on("keydown",this.bind(function(a){if(this.isInterfaceEnabled()){if(a.which===c.PAGE_UP||a.which===c.PAGE_DOWN)return B(a),void 0;switch(a.which){case c.UP:case c.DOWN:return this.moveHighlight(a.which===c.UP?-1:1),B(a),void 0;case c.ENTER:return this.selectHighlighted(),B(a),void 0;case c.TAB:return this.selectHighlighted({noFocus:!0}),void 0;case c.ESC:return this.cancel(a),B(a),void 0}}})),this.search.on("blur",this.bind(function(){document.activeElement===this.body().get(0)&&window.setTimeout(this.bind(function(){this.opened()&&this.search.focus()}),0)})),this.focusser.on("keydown",this.bind(function(a){if(this.isInterfaceEnabled()&&a.which!==c.TAB&&!c.isControl(a)&&!c.isFunctionKey(a)&&a.which!==c.ESC){if(this.opts.openOnEnter===!1&&a.which===c.ENTER)return B(a),void 0;if(a.which==c.DOWN||a.which==c.UP||a.which==c.ENTER&&this.opts.openOnEnter){if(a.altKey||a.ctrlKey||a.shiftKey||a.metaKey)return;return this.open(),B(a),void 0}return a.which==c.DELETE||a.which==c.BACKSPACE?(this.opts.allowClear&&this.clear(),B(a),void 0):void 0}})),u(this.focusser),this.focusser.on("keyup-change input",this.bind(function(a){if(this.opts.minimumResultsForSearch>=0){if(a.stopPropagation(),this.opened())return;this.open()}})),b.on("mousedown touchstart","abbr",this.bind(function(a){this.isInterfaceEnabled()&&(this.clear(),C(a),this.close(),this.selection.focus())})),b.on("mousedown touchstart",this.bind(function(c){n(b),this.container.hasClass("select2-container-active")||this.opts.element.trigger(a.Event("select2-focus")),this.opened()?this.close():this.isInterfaceEnabled()&&this.open(),B(c)})),e.on("mousedown touchstart",this.bind(function(){this.search.focus()})),b.on("focus",this.bind(function(a){B(a)})),this.focusser.on("focus",this.bind(function(){this.container.hasClass("select2-container-active")||this.opts.element.trigger(a.Event("select2-focus")),this.container.addClass("select2-container-active")})).on("blur",this.bind(function(){this.opened()||(this.container.removeClass("select2-container-active"),this.opts.element.trigger(a.Event("select2-blur")))})),this.search.on("focus",this.bind(function(){this.container.hasClass("select2-container-active")||this.opts.element.trigger(a.Event("select2-focus")),this.container.addClass("select2-container-active")})),this.initContainerWidth(),this.opts.element.addClass("select2-offscreen"),this.setPlaceholder()},clear:function(b){var c=this.selection.data("select2-data");if(c){var d=a.Event("select2-clearing");if(this.opts.element.trigger(d),d.isDefaultPrevented())return;var e=this.getPlaceholderOption();this.opts.element.val(e?e.val():""),this.selection.find(".select2-chosen").empty(),this.selection.removeData("select2-data"),this.setPlaceholder(),b!==!1&&(this.opts.element.trigger({type:"select2-removed",val:this.id(c),choice:c}),this.triggerChange({removed:c}))}},initSelection:function(){if(this.isPlaceholderOptionSelected())this.updateSelection(null),this.close(),this.setPlaceholder();else{var c=this;this.opts.initSelection.call(null,this.opts.element,function(a){a!==b&&null!==a&&(c.updateSelection(a),c.close(),c.setPlaceholder(),c.nextSearchTerm=c.opts.nextSearchTerm(a,c.search.val()))})}},isPlaceholderOptionSelected:function(){var a;return this.getPlaceholder()?(a=this.getPlaceholderOption())!==b&&a.prop("selected")||""===this.opts.element.val()||this.opts.element.val()===b||null===this.opts.element.val():!1},prepareOpts:function(){var b=this.parent.prepareOpts.apply(this,arguments),c=this;return"select"===b.element.get(0).tagName.toLowerCase()?b.initSelection=function(a,b){var d=a.find("option").filter(function(){return this.selected&&!this.disabled});b(c.optionToData(d))}:"data"in b&&(b.initSelection=b.initSelection||function(c,d){var e=c.val(),f=null;b.query({matcher:function(a,c,d){var g=r(e,b.id(d));return g&&(f=d),g},callback:a.isFunction(d)?function(){d(f)}:a.noop})}),b},getPlaceholder:function(){return this.select&&this.getPlaceholderOption()===b?b:this.parent.getPlaceholder.apply(this,arguments)},setPlaceholder:function(){var a=this.getPlaceholder();if(this.isPlaceholderOptionSelected()&&a!==b){if(this.select&&this.getPlaceholderOption()===b)return;this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(a)),this.selection.addClass("select2-default"),this.container.removeClass("select2-allowclear")}},postprocessResults:function(a,b,c){var d=0,e=this;if(this.findHighlightableChoices().each2(function(a,b){return r(e.id(b.data("select2-data")),e.opts.element.val())?(d=a,!1):void 0}),c!==!1&&(b===!0&&d>=0?this.highlight(d):this.highlight(0)),b===!0){var g=this.opts.minimumResultsForSearch;g>=0&&this.showSearch(M(a.results)>=g)}},showSearch:function(b){this.showSearchInput!==b&&(this.showSearchInput=b,this.dropdown.find(".select2-search").toggleClass("select2-search-hidden",!b),this.dropdown.find(".select2-search").toggleClass("select2-offscreen",!b),a(this.dropdown,this.container).toggleClass("select2-with-searchbox",b))},onSelect:function(a,b){if(this.triggerSelect(a)){var c=this.opts.element.val(),d=this.data();this.opts.element.val(this.id(a)),this.updateSelection(a),this.opts.element.trigger({type:"select2-selected",val:this.id(a),choice:a}),this.nextSearchTerm=this.opts.nextSearchTerm(a,this.search.val()),this.close(),b&&b.noFocus||!this.opts.shouldFocusInput(this)||this.focusser.focus(),r(c,this.id(a))||this.triggerChange({added:a,removed:d})}},updateSelection:function(a){var d,e,c=this.selection.find(".select2-chosen");this.selection.data("select2-data",a),c.empty(),null!==a&&(d=this.opts.formatSelection(a,c,this.opts.escapeMarkup)),d!==b&&c.append(d),e=this.opts.formatSelectionCssClass(a,c),e!==b&&c.addClass(e),this.selection.removeClass("select2-default"),this.opts.allowClear&&this.getPlaceholder()!==b&&this.container.addClass("select2-allowclear")},val:function(){var a,c=!1,d=null,e=this,f=this.data();if(0===arguments.length)return this.opts.element.val();if(a=arguments[0],arguments.length>1&&(c=arguments[1]),this.select)this.select.val(a).find("option").filter(function(){return this.selected}).each2(function(a,b){return d=e.optionToData(b),!1}),this.updateSelection(d),this.setPlaceholder(),c&&this.triggerChange({added:d,removed:f});else{if(!a&&0!==a)return this.clear(c),void 0;if(this.opts.initSelection===b)throw new Error("cannot call val() if initSelection() is not defined");this.opts.element.val(a),this.opts.initSelection(this.opts.element,function(a){e.opts.element.val(a?e.id(a):""),e.updateSelection(a),e.setPlaceholder(),c&&e.triggerChange({added:a,removed:f})})}},clearSearch:function(){this.search.val(""),this.focusser.val("")},data:function(a){var c,d=!1;return 0===arguments.length?(c=this.selection.data("select2-data"),c==b&&(c=null),c):(arguments.length>1&&(d=arguments[1]),a?(c=this.data(),this.opts.element.val(a?this.id(a):""),this.updateSelection(a),d&&this.triggerChange({added:a,removed:c})):this.clear(d),void 0)}}),f=O(d,{createContainer:function(){var b=a(document.createElement("div")).attr({"class":"select2-container select2-container-multi"}).html(["<ul class='select2-choices'>","  <li class='select2-search-field'>","    <label for='' class='select2-offscreen'></label>","    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>","  </li>","</ul>","<div class='select2-drop select2-drop-multi select2-display-none'>","   <ul class='select2-results'>","   </ul>","</div>"].join(""));return b},prepareOpts:function(){var b=this.parent.prepareOpts.apply(this,arguments),c=this;return"select"===b.element.get(0).tagName.toLowerCase()?b.initSelection=function(a,b){var d=[];a.find("option").filter(function(){return this.selected&&!this.disabled}).each2(function(a,b){d.push(c.optionToData(b))}),b(d)}:"data"in b&&(b.initSelection=b.initSelection||function(c,d){var e=s(c.val(),b.separator),f=[];b.query({matcher:function(c,d,g){var h=a.grep(e,function(a){return r(a,b.id(g))}).length;return h&&f.push(g),h},callback:a.isFunction(d)?function(){for(var a=[],c=0;c<e.length;c++)for(var g=e[c],h=0;h<f.length;h++){var i=f[h];if(r(g,b.id(i))){a.push(i),f.splice(h,1);break}}d(a)}:a.noop})}),b},selectChoice:function(a){var b=this.container.find(".select2-search-choice-focus");b.length&&a&&a[0]==b[0]||(b.length&&this.opts.element.trigger("choice-deselected",b),b.removeClass("select2-search-choice-focus"),a&&a.length&&(this.close(),a.addClass("select2-search-choice-focus"),this.opts.element.trigger("choice-selected",a)))},destroy:function(){a("label[for='"+this.search.attr("id")+"']").attr("for",this.opts.element.attr("id")),this.parent.destroy.apply(this,arguments)},initContainer:function(){var d,b=".select2-choices";this.searchContainer=this.container.find(".select2-search-field"),this.selection=d=this.container.find(b);var e=this;this.selection.on("click",".select2-search-choice:not(.select2-locked)",function(){e.search[0].focus(),e.selectChoice(a(this))}),this.search.attr("id","s2id_autogen"+g()),this.search.prev().text(a("label[for='"+this.opts.element.attr("id")+"']").text()).attr("for",this.search.attr("id")),this.search.on("input paste",this.bind(function(){this.isInterfaceEnabled()&&(this.opened()||this.open())})),this.search.attr("tabindex",this.elementTabIndex),this.keydowns=0,this.search.on("keydown",this.bind(function(a){if(this.isInterfaceEnabled()){++this.keydowns;var b=d.find(".select2-search-choice-focus"),e=b.prev(".select2-search-choice:not(.select2-locked)"),f=b.next(".select2-search-choice:not(.select2-locked)"),g=A(this.search);if(b.length&&(a.which==c.LEFT||a.which==c.RIGHT||a.which==c.BACKSPACE||a.which==c.DELETE||a.which==c.ENTER)){var h=b;return a.which==c.LEFT&&e.length?h=e:a.which==c.RIGHT?h=f.length?f:null:a.which===c.BACKSPACE?this.unselect(b.first())&&(this.search.width(10),h=e.length?e:f):a.which==c.DELETE?this.unselect(b.first())&&(this.search.width(10),h=f.length?f:null):a.which==c.ENTER&&(h=null),this.selectChoice(h),B(a),h&&h.length||this.open(),void 0}if((a.which===c.BACKSPACE&&1==this.keydowns||a.which==c.LEFT)&&0==g.offset&&!g.length)return this.selectChoice(d.find(".select2-search-choice:not(.select2-locked)").last()),B(a),void 0;if(this.selectChoice(null),this.opened())switch(a.which){case c.UP:case c.DOWN:return this.moveHighlight(a.which===c.UP?-1:1),B(a),void 0;case c.ENTER:return this.selectHighlighted(),B(a),void 0;case c.TAB:return this.selectHighlighted({noFocus:!0}),this.close(),void 0;case c.ESC:return this.cancel(a),B(a),void 0}if(a.which!==c.TAB&&!c.isControl(a)&&!c.isFunctionKey(a)&&a.which!==c.BACKSPACE&&a.which!==c.ESC){if(a.which===c.ENTER){if(this.opts.openOnEnter===!1)return;if(a.altKey||a.ctrlKey||a.shiftKey||a.metaKey)return}this.open(),(a.which===c.PAGE_UP||a.which===c.PAGE_DOWN)&&B(a),a.which===c.ENTER&&B(a)}}})),this.search.on("keyup",this.bind(function(){this.keydowns=0,this.resizeSearch()})),this.search.on("blur",this.bind(function(b){this.container.removeClass("select2-container-active"),this.search.removeClass("select2-focused"),this.selectChoice(null),this.opened()||this.clearSearch(),b.stopImmediatePropagation(),this.opts.element.trigger(a.Event("select2-blur"))})),this.container.on("click",b,this.bind(function(b){this.isInterfaceEnabled()&&(a(b.target).closest(".select2-search-choice").length>0||(this.selectChoice(null),this.clearPlaceholder(),this.container.hasClass("select2-container-active")||this.opts.element.trigger(a.Event("select2-focus")),this.open(),this.focusSearch(),b.preventDefault()))})),this.container.on("focus",b,this.bind(function(){this.isInterfaceEnabled()&&(this.container.hasClass("select2-container-active")||this.opts.element.trigger(a.Event("select2-focus")),this.container.addClass("select2-container-active"),this.dropdown.addClass("select2-drop-active"),this.clearPlaceholder())})),this.initContainerWidth(),this.opts.element.addClass("select2-offscreen"),this.clearSearch()},enableInterface:function(){this.parent.enableInterface.apply(this,arguments)&&this.search.prop("disabled",!this.isInterfaceEnabled())},initSelection:function(){if(""===this.opts.element.val()&&""===this.opts.element.text()&&(this.updateSelection([]),this.close(),this.clearSearch()),this.select||""!==this.opts.element.val()){var c=this;this.opts.initSelection.call(null,this.opts.element,function(a){a!==b&&null!==a&&(c.updateSelection(a),c.close(),c.clearSearch())})}},clearSearch:function(){var a=this.getPlaceholder(),c=this.getMaxSearchWidth();a!==b&&0===this.getVal().length&&this.search.hasClass("select2-focused")===!1?(this.search.val(a).addClass("select2-default"),this.search.width(c>0?c:this.container.css("width"))):this.search.val("").width(10)},clearPlaceholder:function(){this.search.hasClass("select2-default")&&this.search.val("").removeClass("select2-default")},opening:function(){this.clearPlaceholder(),this.resizeSearch(),this.parent.opening.apply(this,arguments),this.focusSearch(),""===this.search.val()&&this.nextSearchTerm!=b&&(this.search.val(this.nextSearchTerm),this.search.select()),this.updateResults(!0),this.search.focus(),this.opts.element.trigger(a.Event("select2-open"))},close:function(){this.opened()&&this.parent.close.apply(this,arguments)},focus:function(){this.close(),this.search.focus()},isFocused:function(){return this.search.hasClass("select2-focused")},updateSelection:function(b){var c=[],d=[],e=this;a(b).each(function(){p(e.id(this),c)<0&&(c.push(e.id(this)),d.push(this))}),b=d,this.selection.find(".select2-search-choice").remove(),a(b).each(function(){e.addSelectedChoice(this)}),e.postprocessResults()},tokenize:function(){var a=this.search.val();a=this.opts.tokenizer.call(this,a,this.data(),this.bind(this.onSelect),this.opts),null!=a&&a!=b&&(this.search.val(a),a.length>0&&this.open())},onSelect:function(a,c){this.triggerSelect(a)&&(this.addSelectedChoice(a),this.opts.element.trigger({type:"selected",val:this.id(a),choice:a}),this.nextSearchTerm=this.opts.nextSearchTerm(a,this.search.val()),this.clearSearch(),this.updateResults(),(this.select||!this.opts.closeOnSelect)&&this.postprocessResults(a,!1,this.opts.closeOnSelect===!0),this.opts.closeOnSelect?(this.close(),this.search.width(10)):this.countSelectableResults()>0?(this.search.width(10),this.resizeSearch(),this.getMaximumSelectionSize()>0&&this.val().length>=this.getMaximumSelectionSize()?this.updateResults(!0):this.nextSearchTerm!=b&&(this.search.val(this.nextSearchTerm),this.updateResults(),this.search.select()),this.positionDropdown()):(this.close(),this.search.width(10)),this.triggerChange({added:a}),c&&c.noFocus||this.focusSearch())},cancel:function(){this.close(),this.focusSearch()},addSelectedChoice:function(c){var j,k,d=!c.locked,e=a("<li class='select2-search-choice'>    <div></div>    <a href='#' class='select2-search-choice-close' tabindex='-1'></a></li>"),f=a("<li class='select2-search-choice select2-locked'><div></div></li>"),g=d?e:f,h=this.id(c),i=this.getVal();j=this.opts.formatSelection(c,g.find("div"),this.opts.escapeMarkup),j!=b&&g.find("div").replaceWith("<div>"+j+"</div>"),k=this.opts.formatSelectionCssClass(c,g.find("div")),k!=b&&g.addClass(k),d&&g.find(".select2-search-choice-close").on("mousedown",B).on("click dblclick",this.bind(function(b){this.isInterfaceEnabled()&&(this.unselect(a(b.target)),this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus"),B(b),this.close(),this.focusSearch())})).on("focus",this.bind(function(){this.isInterfaceEnabled()&&(this.container.addClass("select2-container-active"),this.dropdown.addClass("select2-drop-active"))})),g.data("select2-data",c),g.insertBefore(this.searchContainer),i.push(h),this.setVal(i)},unselect:function(b){var d,e,c=this.getVal();if(b=b.closest(".select2-search-choice"),0===b.length)throw"Invalid argument: "+b+". Must be .select2-search-choice";if(d=b.data("select2-data")){var f=a.Event("select2-removing");if(f.val=this.id(d),f.choice=d,this.opts.element.trigger(f),f.isDefaultPrevented())return!1;for(;(e=p(this.id(d),c))>=0;)c.splice(e,1),this.setVal(c),this.select&&this.postprocessResults();return b.remove(),this.opts.element.trigger({type:"select2-removed",val:this.id(d),choice:d}),this.triggerChange({removed:d}),!0}},postprocessResults:function(a,b,c){var d=this.getVal(),e=this.results.find(".select2-result"),f=this.results.find(".select2-result-with-children"),g=this;e.each2(function(a,b){var c=g.id(b.data("select2-data"));p(c,d)>=0&&(b.addClass("select2-selected"),b.find(".select2-result-selectable").addClass("select2-selected"))}),f.each2(function(a,b){b.is(".select2-result-selectable")||0!==b.find(".select2-result-selectable:not(.select2-selected)").length||b.addClass("select2-selected")}),-1==this.highlight()&&c!==!1&&g.highlight(0),!this.opts.createSearchChoice&&!e.filter(".select2-result:not(.select2-selected)").length>0&&(!a||a&&!a.more&&0===this.results.find(".select2-no-results").length)&&K(g.opts.formatNoMatches,"formatNoMatches")&&this.results.append("<li class='select2-no-results'>"+L(g.opts.formatNoMatches,g.search.val())+"</li>")},getMaxSearchWidth:function(){return this.selection.width()-t(this.search)},resizeSearch:function(){var a,b,c,d,e,f=t(this.search);a=D(this.search)+10,b=this.search.offset().left,c=this.selection.width(),d=this.selection.offset().left,e=c-(b-d)-f,a>e&&(e=c-f),40>e&&(e=c-f),0>=e&&(e=a),this.search.width(Math.floor(e))},getVal:function(){var a;return this.select?(a=this.select.val(),null===a?[]:a):(a=this.opts.element.val(),s(a,this.opts.separator))},setVal:function(b){var c;this.select?this.select.val(b):(c=[],a(b).each(function(){p(this,c)<0&&c.push(this)}),this.opts.element.val(0===c.length?"":c.join(this.opts.separator)))},buildChangeDetails:function(a,b){for(var b=b.slice(0),a=a.slice(0),c=0;c<b.length;c++)for(var d=0;d<a.length;d++)r(this.opts.id(b[c]),this.opts.id(a[d]))&&(b.splice(c,1),c>0&&c--,a.splice(d,1),d--);return{added:b,removed:a}},val:function(c,d){var e,f=this;if(0===arguments.length)return this.getVal();if(e=this.data(),e.length||(e=[]),!c&&0!==c)return this.opts.element.val(""),this.updateSelection([]),this.clearSearch(),d&&this.triggerChange({added:this.data(),removed:e}),void 0;if(this.setVal(c),this.select)this.opts.initSelection(this.select,this.bind(this.updateSelection)),d&&this.triggerChange(this.buildChangeDetails(e,this.data()));else{if(this.opts.initSelection===b)throw new Error("val() cannot be called if initSelection() is not defined");this.opts.initSelection(this.opts.element,function(b){var c=a.map(b,f.id);f.setVal(c),f.updateSelection(b),f.clearSearch(),d&&f.triggerChange(f.buildChangeDetails(e,f.data()))})}this.clearSearch()},onSortStart:function(){if(this.select)throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");this.search.width(0),this.searchContainer.hide()},onSortEnd:function(){var b=[],c=this;this.searchContainer.show(),this.searchContainer.appendTo(this.searchContainer.parent()),this.resizeSearch(),this.selection.find(".select2-search-choice").each(function(){b.push(c.opts.id(a(this).data("select2-data")))}),this.setVal(b),this.triggerChange()},data:function(b,c){var e,f,d=this;return 0===arguments.length?this.selection.children(".select2-search-choice").map(function(){return a(this).data("select2-data")}).get():(f=this.data(),b||(b=[]),e=a.map(b,function(a){return d.opts.id(a)}),this.setVal(e),this.updateSelection(b),this.clearSearch(),c&&this.triggerChange(this.buildChangeDetails(f,this.data())),void 0)}}),a.fn.select2=function(){var d,e,f,g,h,c=Array.prototype.slice.call(arguments,0),i=["val","destroy","opened","open","close","focus","isFocused","container","dropdown","onSortStart","onSortEnd","enable","disable","readonly","positionDropdown","data","search"],j=["opened","isFocused","container","dropdown"],k=["val","data"],l={search:"externalSearch"};return this.each(function(){if(0===c.length||"object"==typeof c[0])d=0===c.length?{}:a.extend({},c[0]),d.element=a(this),"select"===d.element.get(0).tagName.toLowerCase()?h=d.element.prop("multiple"):(h=d.multiple||!1,"tags"in d&&(d.multiple=h=!0)),e=h?new window.Select2["class"].multi:new window.Select2["class"].single,e.init(d);else{if("string"!=typeof c[0])throw"Invalid arguments to select2 plugin: "+c;if(p(c[0],i)<0)throw"Unknown method: "+c[0];if(g=b,e=a(this).data("select2"),e===b)return;if(f=c[0],"container"===f?g=e.container:"dropdown"===f?g=e.dropdown:(l[f]&&(f=l[f]),g=e[f].apply(e,c.slice(1))),p(c[0],j)>=0||p(c[0],k)&&1==c.length)return!1}}),g===b?this:g},a.fn.select2.defaults={width:"copy",loadMorePadding:0,closeOnSelect:!0,openOnEnter:!0,containerCss:{},dropdownCss:{},containerCssClass:"",dropdownCssClass:"",formatResult:function(a,b,c,d){var e=[];return F(a.text,c.term,e,d),e.join("")},formatSelection:function(a,c,d){return a?d(a.text):b},sortResults:function(a){return a},formatResultCssClass:function(a){return a.css},formatSelectionCssClass:function(){return b},formatMatches:function(a){return a+" results are available, use up and down arrow keys to navigate."},formatNoMatches:function(){return"No matches found"},formatInputTooShort:function(a,b){var c=b-a.length;return"Please enter "+c+" or more character"+(1==c?"":"s")},formatInputTooLong:function(a,b){var c=a.length-b;return"Please delete "+c+" character"+(1==c?"":"s")},formatSelectionTooBig:function(a){return"You can only select "+a+" item"+(1==a?"":"s")},formatLoadMore:function(){return"Loading more results\u2026"},formatSearching:function(){return"Searching\u2026"},minimumResultsForSearch:0,minimumInputLength:0,maximumInputLength:null,maximumSelectionSize:0,id:function(a){return a==b?null:a.id},matcher:function(a,b){return o(""+b).toUpperCase().indexOf(o(""+a).toUpperCase())>=0},separator:",",tokenSeparators:[],tokenizer:N,escapeMarkup:G,blurOnChange:!1,selectOnBlur:!1,adaptContainerCssClass:function(a){return a},adaptDropdownCssClass:function(){return null},nextSearchTerm:function(){return b},searchInputPlaceholder:"",createSearchChoicePosition:"top",shouldFocusInput:function(a){return a.opts.minimumResultsForSearch<0?!1:!0}},a.fn.select2.ajaxDefaults={transport:a.ajax,params:{type:"GET",cache:!1,dataType:"json"}},window.Select2={query:{ajax:H,local:I,tags:J},util:{debounce:w,markMatch:F,escapeMarkup:G,stripDiacritics:o},"class":{"abstract":d,single:e,multi:f}}}}(jQuery);
var scheduleApp = angular.module('scheduleApp', ['ngSanitize', 'highcharts-ng', 'gantt', 'ui.select2', 'ui.bootstrap'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('<&');
    $interpolateProvider.endSymbol('&>');
});

scheduleApp.controller('scheduleCtrl', function ($scope, $rootScope, dataService, taskService) {
    window.my_scope = $scope;
    $scope.isCollapsed = {
        revision: true
    }
    $scope.mode = "custom";
    $scope.firstDay = 1;
    $scope.weekendDays = [0, 6];
    $scope.maxHeight = 0;
    $scope.showWeekends = true;
    $scope.date = moment().format("YYYY-MM-DD");
    $scope.timezone_offset = 0;
    $scope.roster_series = {};
    $scope.curr_id = 1000;
    $scope.available_tasks = dataService.getAvailableTasks();
    $scope.available_teams = [];
    $scope.selected_task = {};
    $scope.selected_team = {};
    $scope.gantt = undefined;
    $scope.saving = false;
    //$scope.revisions = {};
    $scope.deleted_objects = {
        "shifts": [],
        "tasks": []
    };
    $scope.roster = {};
    $scope.selected_scale = {};
    $scope.scale_options = [
        {
            value: 'day',
            display: 'Day'
        },
        {
            value: 'week',
            display: 'Week'
        }
    ];

    $scope.getInitialData = function () {
        chart.showLoading();
        var from = $scope.setFromDate($scope.selected_scale.value),
            to = $scope.setToDate($scope.selected_scale.value);

        dataService.getTeamSchedule($scope.date, $scope.selected_team.id, from, to).then(function (gantt_response) {
                $scope.timezone_offset = gantt_response.timezone;
                if ($scope.gantt !== undefined) {
                    $scope.gantt.setDefaultDateRange(from, to);
                }
                if (gantt_response.initial_tasks.length > 0) {
                    $scope.roster = gantt_response.roster;
                    $scope.loadData(gantt_response.initial_tasks);
                    $scope.gantt.setDefaultDateRange(from, to);
                }
            }
        );
        dataService.getRevisions(from, to, $scope.selected_team.id).then(function (data) {
            $scope.revisions = data.revisions;
            angular.forEach($scope.revisions, function (value, key) {
                angular.forEach(value.revision_shifts, function (value2, key2) {
                    if (value2.old_date != null) {
                        $scope.revisions[key].revision_shifts[key2].old_date = new Date(value2.old_date);
                    }
                    if (value2.new_date != null) {
                        $scope.revisions[key].revision_shifts[key2].new_date = new Date(value2.new_date);

                    }
                    if (value2.old_start_time != null) {
                        $scope.revisions[key].revision_shifts[key2].old_start_time = new Date(value2.old_start_time);

                    }
                    if (value2.old_end_time != null) {
                        $scope.revisions[key].revision_shifts[key2].old_end_time = new Date(value2.old_end_time);

                    }
                    if (value2.new_start_time != null) {
                        $scope.revisions[key].revision_shifts[key2].new_start_time = new Date(value2.new_start_time);

                    }
                    if (value2.new_end_time != null) {
                        $scope.revisions[key].revision_shifts[key2].new_end_time = new Date(value2.new_end_time);

                    }
                    if (value2.old_shift_task_start_time != null) {
                        $scope.revisions[key].revision_shifts[key2].old_shift_task_start_time = new Date(value2.old_shift_task_start_time);

                    }
                    if (value2.old_shift_task_end_time != null) {
                        $scope.revisions[key].revision_shifts[key2].old_shift_task_end_time = new Date(value2.old_shift_task_end_time);

                    }
                    if (value2.new_shift_task_start_time != null) {
                        $scope.revisions[key].revision_shifts[key2].new_shift_task_start_time = new Date(value2.new_shift_task_start_time);

                    }
                    if (value2.new_shift_task_end_time != null) {
                        $scope.revisions[key].revision_shifts[key2].new_shift_task_end_time = new Date(value2.new_shift_task_end_time);

                    }
                });
            });
        });
    };

    $scope.initializePage = function (gantt) {
        $scope.gantt = gantt;
        $scope.getAvailableTeams();
    };

    $scope.getAvailableTeams = function () {
        dataService.getAvailableTeams().then(function (response) {
            $scope.available_teams = response;
            $scope.selected_team = response[0];
            $scope.getInitialData();
        });
    };

    $scope.addDay = function (num) {
        $scope.date = moment($scope.date).add('d', num).format("YYYY-MM-DD");
    };

    $scope.changeWeek = function () {
console.log('hiiii change date in scheduling1122');
        if ($scope.gantt !== undefined) {
            if ($scope.gantt.rows.length > 0) {
                $scope.clearData();
                $scope.clearHighcharts();
                $scope.buildRosterSeries(true);
            }
        }
        $scope.getInitialData();
    };

    $scope.saveSchedule = function () {
        console.log('saveSchedule3239 clicked');
        var employees = $scope.gantt.toJSON(),
            timezone_diff = (moment().zone() + $scope.timezone_offset) * 60000;
        $scope.saving = true;

        angular.forEach(employees.rows, function (val, key) {
            angular.forEach(val.tasks, function (val, key) {
                val.from -= timezone_diff;
                val.to -= timezone_diff;
                angular.forEach(val.child, function (val, key) {
                    val.from -= timezone_diff;
                    val.to -= timezone_diff;
                });
            });
        });

        var jsonData = {
            "roster": $scope.roster,
            "deleted_objects": $scope.deleted_objects,
            "employees": employees
        };
        $.post(
            "schedule/schedule",
            jsonData,
            function (returnedData) {
                console.log('return daaya for save'+returnedData);
                if (returnedData.result == 0) {
                    $scope.clearData();
                    $scope.clearHighcharts();
                    $scope.buildRosterSeries(true);
                    $scope.getInitialData();
                } else {
                    self.showErrorModal(returnedData['result'], returnedData['message']);
                   // sweetAlert('Error: ' + returnedData['result'], 'Message: ' + returnedData['message'], "error");
                }
                $scope.saving = false;
            }
        );
    };

    $scope.addRow = function (event) {
        for (var i = 0, l = event.row.tasks.length; i < l; i++) {
            $scope.updateRosterSeries(event.row.tasks[i]);
        }
        $scope.updateHighChart();
    };

    $scope.rowEvent = function (event) {
        // A row has been added, updated or clicked. Use this event to save back the updated row e.g. after a user re-ordered it.
        //console.log('Row event: ' + event.date + ' '  + event.row.description + ' (Custom data: ' + event.row.data + ')');
        if (event.date !== undefined && event.row !== undefined) {
            taskService.addTask($scope, event.row, event.date);
        }
    };

    $scope.scrollEvent = function (event) {
        if (angular.equals(event.direction, "left")) {
            // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
            //console.log('Scroll event: Left');
        } else if (angular.equals(event.direction, "right")) {
            // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
            //console.log('Scroll event: Right');
        }
    };

    $scope.taskEvent = function (event) {
        // A task has been updated or clicked.
        if (event.date !== undefined && event.task !== undefined && event.event !== undefined) {
            if (event.event.ctrlKey) {
                $scope.removeFromSeries(event.task);

                if (event.task.data.parent === false) {
                    angular.forEach(event.task.child, function (val, key) {
                        $scope.removeFromSeries(val);
                    });

                    if (event.task.data.db_id !== undefined)
                        $scope.deleted_objects.shifts.push(event.task.data.db_id);

                    for (var i = 0, l = event.task.child.length; i < l; i++) {
                        if (event.task.child[i].data.db_id !== undefined)
                            $scope.deleted_objects.tasks.push(event.task.child[i].data.db_id);
                    }
                } else {
                    event.task.removeFromParent();

                    if (event.task.data.db_id !== undefined)
                        $scope.deleted_objects.tasks.push(event.task.data.db_id);
                }
                event.task.row.removeTask(event.task.id);

            } else {
                taskService.addSubTask($scope, event.task, event.date, $scope.available_tasks[$scope.selected_task]);
            }
        }

        if (event.task.data.parent == false || event.task.data.available == false) {
            if (event.event === undefined || !event.event.ctrlKey) $scope.updateRosterSeries(event.task);
            $scope.updateHighChart();
        }
    };

    $scope.updateHighChart = function () {
        var roster_series = [],
            shrinkage_series = [],
            roster_with_shrinkage_series = [];

        angular.forEach($scope.roster_series, function (val, key) {
            roster_series.push([key * 1, val.shifts]);
            shrinkage_series.push([key * 1, val.shrinkage]);
            roster_with_shrinkage_series.push([key * 1, val.shifts - val.shrinkage]);
        });

        roster_series.sort(function (a, b) {
            return a[0] - b[0];
        });
        shrinkage_series.sort(function (a, b) {
            return a[0] - b[0];
        });
        roster_with_shrinkage_series.sort(function (a, b) {
            return a[0] - b[0];
        });

        chart.get('Roster').setData(roster_series, false);
        chart.get('Shrinkage').setData(shrinkage_series, false);
        chart.get('Roster With Shrinkage').setData(roster_with_shrinkage_series, false);

        if (roster_series.length > 0) chart.hideLoading();

        chart.redraw();
    };

    $scope.setFromDate = function (type) {
        if (type == 'day') {
            return moment($scope.date).format("YYYY-MM-DD");
        } else {
            return moment($scope.date).startOf('isoWeek').format("YYYY-MM-DD");
        }
    };
    $scope.setToDate = function (type) {
        if (type == 'day') {
            return moment($scope.date).format("YYYY-MM-DD");
        } else {
            return moment($scope.date).endOf('isoWeek').format("YYYY-MM-DD");
        }

    };
    $scope.start_date = $scope.setFromDate($scope.selected_scale.value);
    $scope.end_date = $scope.setToDate($scope.selected_scale.value);

    $scope.buildRosterSeries = function (reset) {
        var from = moment($scope.setFromDate($scope.selected_scale.value)),
            to = moment($scope.setToDate($scope.selected_scale.value));

        if (reset === true)
            $scope.roster_series = {};

        for (from; from.isBefore(to); from.add('minutes', 15)) {
            if ($scope.roster_series[+from] === undefined) {
                $scope.roster_series[+from] = {shifts: 0, shrinkage: 0, ids: []};
            }
        }
    };

    $scope.clearHighcharts = function () {
        chart.get('Roster').setData([]);
        chart.get('Shrinkage').setData([]);
        chart.get('Roster With Shrinkage').setData([]);
    };

    $scope.removeFromSeries = function (task) {
        angular.forEach($scope.roster_series, function (val, key) {
            for (var i = 0; i < val.ids.length; i++) {
                if (val.ids[i] === task.id) {
                    if (task.data.parent === false) {
                        val.shifts -= 1;
                    } else if (!task.data.available) {
                        val.shrinkage -= 1;
                    }
                    val.ids.splice(i, 1);
                    break;
                }
            }
        });
    };

    $scope.updateRosterSeries = function (task) {
        if (task.subject !== 'Leave' && task.subject !== 'Not Available') {
            $scope.removeFromSeries(task);

            angular.forEach(task.child, function (val, key) {
                $scope.updateRosterSeries(val);
            });

            for (var i = moment(task.from); i.isBefore(task.to); i.add('minutes', 15)) {
                if ($scope.roster_series[+i] === undefined) {
                    $scope.roster_series[+i] = {shifts: 0, shrinkage: 0, ids: []};
                }
                if (task.data.parent === false) {
                    $scope.roster_series[+i].shifts += 1;
                } else if (!task.data.available) {
                    $scope.roster_series[+i].shrinkage += 1;
                }
                $scope.roster_series[+i].ids.push(task.id);
            }
            var pointBefore = moment(task.from).subtract(15, 'minutes');
            if ($scope.roster_series[+pointBefore] === undefined) $scope.roster_series[+pointBefore] = {
                shifts: 0,
                shrinkage: 0,
                ids: []
            };
            if ($scope.roster_series[+i] === undefined) $scope.roster_series[+i] = {shifts: 0, shrinkage: 0, ids: []};
        }
    };

});

function AvailableTask(task) {
    this.name = task.name;
    this.identifier = task.identifier;
    this.available = task.available;
    this.paid = task.paid;
    this.color = '#' + task.color;
    this.times_added = 0;
}


Highcharts.setOptions({
    global: {
        useUTC: false
    },
    lang: {
        loading: "Please begin creating shifts below."
    }
});


var chart = new Highcharts.StockChart({
    chart: {
        renderTo: 'container',
        defaultSeriesType: 'spline',
        events: {}
    },
    series: [
        {
            id: 'Roster',
            name: 'Roster',
            color: '#0062FF',
            data: [],
            type: 'line',
            marker: {
                enabled: false
            },
            zIndex: 3
        },
        {
            id: 'Shrinkage',
            name: 'Shrinkage',
            color: '#FF6A00',
            data: [],
            type: 'area',
            marker: {
                enabled: false
            },
            zIndex: 2
        },
        {
            id: 'Roster With Shrinkage',
            name: 'Roster With Shrinkage',
            color: '#00BA98',
            data: [],
            type: 'area',
            marker: {
                enabled: false
            },
            zIndex: 1
        },
        {
            id: 'Forecast',
            name: 'Forecast',
            color: '#000000',
            data: [],
            type: 'line',
            marker: {
                enabled: false
            },
            zIndex: 4
        }
    ],
    credits: {
        enabled: false
    },
    rangeSelector: {
        enabled: false
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
        },
        ordinal: false
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1,
            marker: {
                lineWidth: 1,
                lineColor: '#666666'
            }
        },
        series: {
            fillOpacity: 0.6
        }
    },
    yAxis: {
        minPadding: 0.2,
        maxPadding: 0.2
    }
});

scheduleApp.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});

gantt.config(function ($provide) {

    $provide.decorator('ganttTaskMoveableDirective', function ($document, $delegate, $timeout, debounce, mouseOffset) {

        var directive = $delegate[0];
        directive.controller = ['$scope', '$element', function ($scope, $element) {
            var resizeAreaWidthBig = 10;
            var resizeAreaWidthSmall = 6;
            var scrollSpeed = 15;
            var scrollTriggerDistance = 1;

            var bodyElement = angular.element($document[0].body);
            var ganttBodyElement = $element.parent().parent();
            var ganttScrollElement = ganttBodyElement.parent().parent();

            var mouseOffsetInEm;
            var moveStartX;
            var scrollInterval;
            var curMousePos = {
                x: 0,
                y: 0
            };

            $element.bind('mousedown', function (e) {
                var mode = getMode(e);
                if (mode !== "") {
                    var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], e);
                    curMousePos.x = mousePos.x;
                    curMousePos.y = mousePos.y;
                    enableMoveMode(mode, e);

                    e.preventDefault();
                }
            });

            $element.bind("mousemove", function (e) {
                var mode = getMode(e);
                if (mode !== "" && mode !== "M") {
                    $element.css("cursor", getCursor(mode));
                } else {
                    $element.css("cursor", '');
                }
            });

            var handleMove = function (mode, mousePos) {
                if ($scope.task.isMoving === false) {
                    return;
                }
                var diff = mousePos.x - curMousePos.x;
                var targetRow = getRow(mousePos.y);

                var cur_range = moment.range(moment($scope.task.from).subtract(15, 'minutes'), moment($scope.task.to).add(15, 'minutes'));
                if($scope.task.subject == 'Shift') {
                    var movableShift = true;
                } else {
                    var movableTask = true;

                }
                angular.forEach(targetRow.tasks, function (value, key) {
                    if (value.subject == 'Shift' && value.id != $scope.task.id) {
                        var new_range = moment.range(new Date(value.from), new Date(value.to));
                        var temp_cur_from = moment($scope.task.from);
                        var temp_new_from = moment(value.from);
                        if (diff < 0) {//MOVE TO LEFT
                            if (temp_new_from.diff(temp_cur_from) <= 0) {
                                if (new_range.overlaps(cur_range)) {
                                    movableShift = false;
                                }
                            }
                        } else if (diff > 0) { //RIGHT or Still
                            if (temp_new_from.diff(temp_cur_from) > 0) {
                                if (new_range.overlaps(cur_range)) {
                                    movableShift = false;
                                }
                            }
                        }
                    }
                    else if (value.id != $scope.task.id) {
                        var new_range = moment.range(new Date(value.from), new Date(value.to));
                        var temp_cur_from = moment($scope.task.from);
                        var temp_new_from = moment(value.from);
                        if (diff < 0) {//MOVE TO LEFT
                            if (temp_new_from.diff(temp_cur_from) <= 0) {
                                if (new_range.overlaps(cur_range)) {
                                    movableTask = false;
                                }
                            }
                        } else if (diff > 0) { //RIGHT or Still
                            if (temp_new_from.diff(temp_cur_from) > 0) {
                                if (new_range.overlaps(cur_range)) {
                                    movableTask = false;
                                }
                            }
                        }
                    }
                });
                if($scope.task.subject == 'Shift') {
                    if (movableShift) {
                        moveTask(mode, mousePos);
                        scrollScreen(mode, mousePos);
                        curMousePos.x = mousePos.x;
                    }
                } else {
                    if (movableTask) {
                        moveTask(mode, mousePos);
                        scrollScreen(mode, mousePos);
                        curMousePos.x = mousePos.x;
                    }
                }
            };

            var moveTask = function (mode, mousePos) {
                var xInEm = mousePos.x / $scope.getPxToEmFactor();
                var i = 0;
                if (mode === "M") {
                    var children = $scope.task.child;
                    var targetRow = getRow(mousePos.y);
                    if ($scope.task.data.parent === false) {
                        //change row
                        if (targetRow !== undefined && $scope.task.row.id !== targetRow.id) {
                            targetRow.moveTaskToRow($scope.task);
                            for (i = 0; i < $scope.task.child.length; i++) {
                                targetRow.moveTaskToRow($scope.task.child[i]);
                            }
                        }
                    }
                    var oldLeft = $scope.task.left;
                    $scope.task.moveTo(xInEm - mouseOffsetInEm);
                    $scope.task.child = children;
                    for (i = 0; i < $scope.task.child.length; i++) {
                        var leftDiff = $scope.task.child[i].left - oldLeft;
                        $scope.task.child[i].moveTo($scope.task.left + leftDiff);
                    }

                } else if (mode === "E") {
                    $scope.task.setTo(xInEm);
                } else {
                    $scope.task.setFrom(xInEm);
                }
                taskHasBeenMoved = true;
            };

            var scrollScreen = function (mode, mousePos) {
                var leftScreenBorder = ganttScrollElement[0].scrollLeft;

                if (mousePos.x < moveStartX) {
                    // Scroll to the left
                    if (mousePos.x <= leftScreenBorder + scrollTriggerDistance) {
                        mousePos.x -= scrollSpeed;
                        $scope.scrollLeft(scrollSpeed);
                        scrollInterval = $timeout(function () {
                            handleMove(mode, mousePos);
                        }, 100, true); // Keep on scrolling
                    }
                } else {
                    // Scroll to the right
                    var screenWidth = ganttScrollElement[0].offsetWidth;
                    var rightScreenBorder = leftScreenBorder + screenWidth;

                    if (mousePos.x >= rightScreenBorder - scrollTriggerDistance) {
                        mousePos.x += scrollSpeed;
                        $scope.scrollRight(scrollSpeed);
                        scrollInterval = $timeout(function () {
                            handleMove(mode, mousePos);
                        }, 100, true); // Keep on scrolling
                    }
                }
            };

            var clearScrollInterval = function () {
                if (scrollInterval !== undefined) {
                    $timeout.cancel(scrollInterval);
                    scrollInterval = undefined;
                }
            };

            var getRow = function (y) {
                var rowHeight = ganttBodyElement[0].offsetHeight / $scope.task.row.gantt.rows.length;
                var pos = Math.floor(y / rowHeight);
                return $scope.task.row.gantt.rows[pos];
            };
            //
            var getMode = function (e) {
                var x = mouseOffset.getOffset(e).x;

                var distance = 0;

                // Define resize&move area. Make sure the move area does not get too small.
                if ($scope.allowTaskResizing) {
                    distance = $element[0].offsetWidth < 10 ? resizeAreaWidthSmall : resizeAreaWidthBig;
                }

                if ($scope.allowTaskResizing && x > $element[0].offsetWidth - distance) {
                    return "E"; //End of bars
                } else if ($scope.allowTaskResizing && x < distance) {
                    return "W"; //start of bars
                } else if ($scope.allowTaskMoving && x >= distance && x <= $element[0].offsetWidth - distance) {
                    return "M"; // rest area
                } else {
                    return "";
                }
            };

            var getCursor = function (mode) {
                switch (mode) {
                    case "E":
                        return 'e-resize';
                    case "W":
                        return 'w-resize';
                    case "M":
                        return 'move';
                }
            };

            var enableMoveMode = function (mode, e) {
                $scope.task.isMoving = true;

                moveStartX = mouseOffset.getOffsetForElement(ganttBodyElement[0], e).x;
                var xInEm = moveStartX / $scope.getPxToEmFactor();
                mouseOffsetInEm = xInEm - $scope.task.left;

                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': getCursor(mode)
                });
                var taskMoveHandler = debounce(function (e) {

                    var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], e);
                    clearScrollInterval();
                    handleMove(mode, mousePos);
                }, 0.1);
                bodyElement.bind('mousemove', taskMoveHandler);

                bodyElement.one('mouseup', function () {
                    bodyElement.unbind('mousemove', taskMoveHandler);
                    disableMoveMode(e);

                });
            };

            var disableMoveMode = function (event) {
                $scope.task.isMoving = false;
                clearScrollInterval();
                if (taskHasBeenMoved === true) {
                    $scope.task.row.sortTasks(); // Sort tasks so they have the right z-order
                    $scope.raiseTaskUpdatedEvent($scope.task);
                    taskHasBeenMoved = false;
                }

                $element.css("cursor", '');

                angular.element($document[0].body).css({
                    '-moz-user-select': '',
                    '-webkit-user-select': '',
                    '-ms-user-select': '',
                    'user-select': '',
                    'cursor': ''
                });
            };
        }];
        return $delegate;
    });
});
scheduleApp.factory("dataService", function ($q) {
    function _getTeamSchedule(date, selected_team, from, to) {
        var defer = $q.defer();
        $.getJSON('schedule/schedule', {team_id: selected_team, date: date}, function (allData) {
            var roster = allData.data,
                team = roster.team,
                shifts = roster.rosteredshift,
                id_list = [],
                user_object = {},
                user_array = [],
                timezone = allData.data.timezone,
                roster_obj = {
                    "id": roster.id,
                    "team_id": roster.team_id,
                    "date_start": roster.date_start,
                    "date_ending": roster.date_ending
                };

            $.getJSON('organisation/max-opening-hours', function (allData) {
                var open_time = allData.data.start_time,
                    close_time = allData.data.end_time;

                from = moment(from + " " + open_time);
                to = moment(to + " " + close_time);

                angular.forEach(team.user, function (val, key) {
                    var leave = [],
                        current_day = from.clone();
                    while (current_day.isBefore(to)) {
                        var day = dayAvails(val.availgeneral, current_day);
                        if (day) {
                            if (from.format("HH:mm:ss") !== day.start_time) {
                                leave.push({
                                    "id": "not_available_start" + day.id + day.pivot.user_id,
                                    "subject": 'Not Available',
                                    "color": '#000000',
                                    "from": +moment(current_day.format('YYYY-MM-DD') + " " + from.format("HH:mm:ss")),
                                    "to": +moment(current_day.format('YYYY-MM-DD') + " " + day.start_time),
                                    "child": [],
                                    "data": {
                                        "locked": true,
                                        //"zIndex": 995
                                    }
                                });
                            }
                            if (to.format("HH:mm:ss") !== day.end_time) {
                                leave.push({
                                    "id": "not_available_end" + day.id + day.pivot.user_id,
                                    "subject": 'Not Available',
                                    "color": '#000000',
                                    "from": +moment(current_day.format('YYYY-MM-DD') + " " + day.end_time),
                                    "to": +moment(current_day.format('YYYY-MM-DD') + " " + to.clone().add('h', 1).format("HH:mm:ss")),
                                    "child": [],
                                    "data": {
                                        "locked": true,
                                        //"zIndex": 995
                                    },
                                });
                            }
                        }
                        current_day.add('d', 1);
                    }
                    angular.forEach(val.availspecific, function (avail_val, avail_key) {
                        var avail_from = null,
                            avail_to = null;
                        if (avail_val.all_day) {
                            avail_from = moment(avail_val.start_date).startOf('day').isBefore(from) ?
                                from :
                                moment(avail_val.start_date).startOf('day');
                            avail_to = moment(avail_val.end_date).endOf('day').isAfter(to) ?
                                to :
                                moment(avail_val.end_date).endOf('day');
                        } else if (moment(avail_val.start_date + " " + avail_val.start_time).isAfter(from) && moment(avail_val.end_date + " " + avail_val.end_time).isBefore(to)) {
                            avail_from = moment(avail_val.start_date + " " + avail_val.start_time);
                            avail_to = moment(avail_val.end_date + " " + avail_val.end_time);
                        }

                        if (avail_from && avail_to) {
                            leave.push({
                                "id": "leave" + avail_val.id,
                                "subject": 'Leave',
                                "color": '#D35400',
                                "from": +avail_from,
                                "to": +avail_to,
                                "child": [],
                                "data": {
                                    "db_id": avail_val.id,
                                    "locked": true,
                                    //"zIndex": 996
                                }
                            })
                        }
                    });

                    user_object[val.id] = {
                        "id": val.id,
                        "description": val.first_name + " " + val.last_name,
                        "order": "0",
                        "tasks": leave
                    };
                });

                angular.forEach(shifts, function (val, key) {

                    //Cast moments to epoch and check do an integer comparison - momentjs does not >= or <=
                    if (+moment(val.rostered_start_time) >= +from.clone().subtract(1, 'hour') && +moment(val.rostered_end_time) <= +to.clone().add(1, 'hour')) {
                        var task = {
                            "id": val.id,
                            "subject": 'Shift',
                            "color": '#00BA98',
                            "from": +moment(val.rostered_start_time),
                            "to": +moment(val.rostered_end_time),
                            "child": [],
                            "data": {
                                "db_id": val.id,
                                //"zIndex": 997
                            },
                            "user_id": val.user_id
                        };

                        angular.forEach(val.task, function (val, key) {
                            task.child.push({
                                "id": task.id + " " + val.pivot.id,
                                "subject": val.name,
                                "color": "#" + val.color,
                                "from": +moment(val.pivot.start_time),
                                "to": +moment(val.pivot.end_time),
                                "data": {
                                    available: val.available,
                                    paid: val.available,
                                    planned: val.planned,
                                    "db_id": val.pivot.id,
                                    "identifier": val.identifier,
                                    //"zIndex": 998
                                }
                            });
                        });
                        if (typeof user_object !== 'undefined') {
                            user_object[val.user_id].tasks.push(task);
                        }
                    }
                });

                angular.forEach(user_object, function (val, key) {
                    user_array.push(val);
                });

                defer.resolve({"initial_tasks": user_array, "roster": roster_obj, "timezone": timezone});
            });
        });

        return defer.promise;
    }

    function _getRevisions(from, to, teamId) {
        var defer = $q.defer();
        $.getJSON('revision/revision', {date_start: from, date_end: to, team_id: teamId}, function (allData) {
            defer.resolve({"revisions": allData.data});
        });
        return defer.promise;

    }

    function _getAvailableTasks() {
        var tasks = {};
        $.getJSON('task/schedulable-tasks', {}, function (allData) {
            angular.forEach(allData.data, function (val, key) {
                tasks[val.identifier] = new AvailableTask(val);
            });
        });
        return tasks;
    }

    function _getAvailableTeams() {
        var defer = $q.defer(),
            teams = [];
        $.getJSON('team/available-teams', {}, function (allData) {
            angular.forEach(allData, function (val, key) {
                teams.push({
                    id: key,
                    name: val
                })
            });
            defer.resolve(teams);
        });
        return defer.promise;
    }

    function _getForecastData(team_id, start_time, end_time, interval) {
        var data = {
                team_id: team_id,
                start_time: start_time,
                end_time: end_time,
                interval: interval
            },
            x_axis = [],
            number_of_agents = [],
            defer = $q.defer();

        $.getJSON("forecast/team-forecast", data, function (allData) {
            if (allData['result'] == 0) {
                var wait_time = allData.data.workstream.wait_time_threshold,
                    period_length = 900; //15 minute periods (in seconds)
                $.each(allData.data.data, function (key, val) {
                    var point = moment(val.prediction_start_time, 'YYYY-MM-DD HH:mm:ss').unix() * 1000;
                    x_axis.push(point);
                    number_of_agents.push(calculateNumAgents(val.expected_volume, val.expected_average_handle_time, wait_time, period_length));
                });
            }

            var chart_data = createSeries(x_axis, number_of_agents);
            chart_data.sort(function (a, b) {
                return a[0] - b[0];
            });
            defer.resolve(chart_data);
        });

        return defer.promise;
    }

    return {
        getTeamSchedule: _getTeamSchedule,
        getAvailableTasks: _getAvailableTasks,
        getAvailableTeams: _getAvailableTeams,
        getForecastData: _getForecastData,
        getRevisions: _getRevisions
    };
});

function dayAvails(avail_generals, current_day) {
    var day = false;

    angular.forEach(avail_generals, function (val, key) {
        if (val.day === current_day.format('dddd')) day = val;
    });

    return day;
}

function createSeries(xValues, yValues) {
    var chart_data = [];
    for (var i = 0; i < yValues.length; i++) {
        chart_data[i] = [xValues[i], yValues[i]];
    }

    return chart_data;
}
scheduleApp.factory("taskService", function() {

    function _addTask($scope, row, date) {
        var fromDate = new Date(date),
            toDate = new Date(date);
        toDate.setHours(date.getHours()+8);
        var taskRange = moment().range(fromDate, toDate);

        angular.forEach(row.tasks, function(val,key) {
            var otherTask = moment().range(moment(val.from), moment(val.to));
            taskRange = taskRange.subtract(otherTask)[0];
        });

        var taskData = {
                id: $scope.curr_id,
                subject: "Shift",
                color: "#00BA98",
                from: +taskRange.start,
                to: +taskRange.end,
                parent: null,
                //zIndex: 997
            },
            newTask = row.addTask(taskData);
        $scope.updateRosterSeries(newTask);

        $scope.updateHighChart();
        $scope.curr_id++;
        row.gantt.updateTasksPosAndSize();
    }

    function _addSubTask($scope, task, date, selected_task) {
        if(!task.data.parent && selected_task !== undefined && task.subject !== "Not Available" && task.subject !== "Leave") {
            $scope.available_tasks[$scope.selected_task].times_added++;
            var fromDate = new Date(date),
                toDate = new Date(date);
            toDate.setMinutes(date.getMinutes()+30);
            var taskData = {
                id: $scope.curr_id,
                subject: selected_task.name,
                color: selected_task.color,
                from: fromDate,
                to: toDate,
                data: {
                    parent: event.task,
                    //"zIndex": 1998
                }
            };
            var newTask = task.row.addTask(taskData);
            newTask.data.identifier = selected_task.identifier;
            newTask.data.available = selected_task.available;
            newTask.data.paid = selected_task.paid;
            newTask.data.parent = task;
            //if(typeof task.data.tempZIndex !== 'undefined')
                //newTask.boostZIndex();
            task.child.push(newTask);
            if(newTask.data.parent == false || newTask.data.available == false) {
                $scope.updateRosterSeries(newTask);
            }
            $scope.curr_id++;
            task.gantt.updateTasksPosAndSize();
        }
    }

    return {
        addTask: _addTask,
        addSubTask: _addSubTask
    }
});
//# sourceMappingURL=scheduling.js.map
