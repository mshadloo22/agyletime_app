/*! knockout-bootstrap version: 0.2.1
 *  2014-02-08
 *  Author: Bill Pullen
 *  Website: http://billpull.github.com/knockout-bootstrap
 *  MIT License http://www.opensource.org/licenses/mit-license.php
 */
function s4(){"use strict";return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}function guid(){"use strict";return s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4()}function setupKoBootstrap(a){"use strict";a.bindingHandlers.typeahead={init:function(b,c,d){var e=$(b),f=d(),g=a.utils.unwrapObservable(c());e.attr("autocomplete","off").typeahead({source:g,minLength:f.minLength,items:f.items,updater:f.updater})}},a.bindingHandlers.progress={init:function(b,c,d,e){var f=$(b),g=$("<div/>",{"class":"bar","data-bind":"style: { width:"+c()+" }"});f.attr("id",guid()).addClass("progress progress-info").append(g),a.applyBindingsToDescendants(e,f[0])}},a.bindingHandlers.alert={init:function(b,c){var d=$(b),e=a.utils.unwrapObservable(c()),f=$("<button/>",{type:"button","class":"close","data-dismiss":"alert"}).html("&times;"),g=$("<p/>").html(e.message);d.addClass("alert alert-"+e.priority).append(f).append(g)}},a.bindingHandlers.tooltip={update:function(b,c){var d,e,f;if(e=a.utils.unwrapObservable(c()),d=$(b),a.isObservable(e.title)){var g=!1;d.on("show.bs.tooltip",function(){g=!0}),d.on("hide.bs.tooltip",function(){g=!1});var h=e.animation||!0;e.title.subscribe(function(){g&&(d.data("bs.tooltip").options.animation=!1,d.tooltip("fixTitle").tooltip("show"),d.data("bs.tooltip").options.animation=h)})}f=d.data("bs.tooltip"),f?$.extend(f.options,e):d.tooltip(e)}},a.bindingHandlers.popover={init:function(b,c,d,e,f){var g=a.utils.unwrapObservable(c()),h=g.title,i=g.template,j=g.data,k="click";g.trigger&&(k=g.trigger),"hover"===k?k="mouseenter mouseleave":"focus"===k&&(k="focus blur");var l,m=g.placement;l=j?function(){var b=$('<div data-bind="template: { name: template, if: data, data: data }"></div>');return a.applyBindings({template:i,data:j},b[0]),b}:$("#"+i).html();var n=guid(),o="ko-bs-popover-"+n,p=(f.createChildContext(e),$("<div/>",{"class":"ko-popover",id:o}).html(l)),q={content:$(p[0]).outerHtml(),title:h};m&&(q.placement=m),g.container&&(q.container=g.container);var r=$.extend({},a.bindingHandlers.popover.options,q);$(b).bind(k,function(){var a="show",c=$(this);"click"!==k&&(a="toggle"),c.popover(r).popover(a);var d=$("#"+o);if($(".ko-popover").not(d).parents(".popover").remove(),$("#"+o).is(":visible")){var e=$(b).offset().top,f=$(b).offset().left,g=$(b).outerHeight(),h=$(b).outerWidth(),i=$(d).parents(".popover"),j=i.outerHeight(),l=i.outerWidth(),m=10;switch(r.placement){case"left":i.offset({top:e-j/2+g/2,left:f-m-l});break;case"right":i.offset({top:e-j/2+g/2});break;case"top":i.offset({top:e-j-m,left:f-l/2+h/2});break;case"bottom":i.offset({top:e+g+m,left:f-l/2+h/2})}}$(document).on("click",'[data-dismiss="popover"]',function(){c.popover("hide")})})},options:{placement:"right",title:"",html:!0,content:"",trigger:"manual"}}}!function(a){"use strict";a.fn.outerHtml=function(){if(0===this.length)return!1;var b=this[0],c=b.tagName.toLowerCase();if(b.outerHTML)return b.outerHTML;var d=a.map(b.attributes,function(a){return a.name+'="'+a.value+'"'});return"<"+c+(d.length>0?" "+d.join(" "):"")+">"+b.innerHTML+"</"+c+">"}}(jQuery),function(a){"use strict";"function"==typeof define&&define.amd?define(["require","exports","knockout"],function(b,c,d){a(d)}):a(window.ko)}(setupKoBootstrap);