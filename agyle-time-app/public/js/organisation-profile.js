/*=============================================================================
 Author:			Eric M. Barnard - @ericmbarnard
 License:		MIT (http://opensource.org/licenses/mit-license.php)

 Description:	Validation Library for KnockoutJS
 ===============================================================================
 */
!function(a){"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?a(require("knockout"),exports):"function"==typeof define&&define.amd?define(["knockout","exports"],a):a(ko,ko.validation={})}(function(a,b){function c(a){var b="max"===a;return function(c,d){if(f.utils.isEmptyVal(c))return!0;var e,g;void 0===d.typeAttr?(g="text",e=d):(g=d.typeAttr,e=d.value),isNaN(e)||(g="number");var h,i,j;switch(g.toLowerCase()){case"week":if(h=/^(\d{4})-W(\d{2})$/,i=c.match(h),null===i)throw"Invalid value for "+a+" attribute for week input.  Should look like '2000-W33' http://www.w3.org/TR/html-markup/input.week.html#input.week.attrs.min";return j=e.match(h),j?b?i[1]<j[1]||i[1]===j[1]&&i[2]<=j[2]:i[1]>j[1]||i[1]===j[1]&&i[2]>=j[2]:!1;case"month":if(h=/^(\d{4})-(\d{2})$/,i=c.match(h),null===i)throw"Invalid value for "+a+" attribute for month input.  Should look like '2000-03' http://www.w3.org/TR/html-markup/input.month.html#input.month.attrs.min";return j=e.match(h),j?b?i[1]<j[1]||i[1]===j[1]&&i[2]<=j[2]:i[1]>j[1]||i[1]===j[1]&&i[2]>=j[2]:!1;case"number":case"range":return b?!isNaN(c)&&parseFloat(c)<=parseFloat(e):!isNaN(c)&&parseFloat(c)>=parseFloat(e);default:return b?e>=c:c>=e}}}function d(a,b,c){return b.validator(a(),void 0===c.params?!0:h(c.params))?!0:(a.setError(f.formatMessage(c.message||b.message,h(c.params),a)),!1)}function e(a,b,c){a.isValidating(!0);var d=function(d){var e=!1,g="";return a.__valid__()?(d.message?(e=d.isValid,g=d.message):e=d,e||(a.error(f.formatMessage(g||c.message||b.message,h(c.params),a)),a.__valid__(e)),void a.isValidating(!1)):void a.isValidating(!1)};b.validator(a(),h(c.params||!0),d)}if(void 0===typeof a)throw"Knockout is required, please ensure it is loaded before loading this validation plug-in";a.validation=b;var f=a.validation,g=a.utils,h=g.unwrapObservable,i=g.arrayForEach,j=g.extend,k={registerExtenders:!0,messagesOnModified:!0,errorsAsTitle:!0,errorsAsTitleOnModified:!1,messageTemplate:null,insertMessages:!0,parseInputAttributes:!1,writeInputAttributes:!1,decorateInputElement:!1,decorateElementOnModified:!0,errorClass:null,errorElementClass:"validationElement",errorMessageClass:"validationMessage",allowHtmlMessages:!1,grouping:{deep:!1,observable:!0,live:!1},validate:{}},l=j({},k);l.html5Attributes=["required","pattern","min","max","step"],l.html5InputTypes=["email","number","date"],l.reset=function(){j(l,k)},f.configuration=l,f.utils=function(){var a=(new Date).getTime(),b={},c="__ko_validation__";return{isArray:function(a){return a.isArray||"[object Array]"===Object.prototype.toString.call(a)},isObject:function(a){return null!==a&&"object"==typeof a},isNumber:function(a){return!isNaN(a)},isObservableArray:function(a){return!!a&&"function"==typeof a.remove&&"function"==typeof a.removeAll&&"function"==typeof a.destroy&&"function"==typeof a.destroyAll&&"function"==typeof a.indexOf&&"function"==typeof a.replace},values:function(a){var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(a[c]);return b},getValue:function(a){return"function"==typeof a?a():a},hasAttribute:function(a,b){return null!==a.getAttribute(b)},getAttribute:function(a,b){return a.getAttribute(b)},setAttribute:function(a,b,c){return a.setAttribute(b,c)},isValidatable:function(a){return!!(a&&a.rules&&a.isValid&&a.isModified)},insertAfter:function(a,b){a.parentNode.insertBefore(b,a.nextSibling)},newId:function(){return a+=1},getConfigOptions:function(a){var b=f.utils.contextFor(a);return b||f.configuration},setDomData:function(a,d){var e=a[c];e||(a[c]=e=f.utils.newId()),b[e]=d},getDomData:function(a){var d=a[c];return d?b[d]:void 0},contextFor:function(a){switch(a.nodeType){case 1:case 8:var b=f.utils.getDomData(a);if(b)return b;if(a.parentNode)return f.utils.contextFor(a.parentNode)}return void 0},isEmptyVal:function(a){return void 0===a?!0:null===a?!0:""===a?!0:void 0},getOriginalElementTitle:function(a){var b=f.utils.getAttribute(a,"data-orig-title"),c=a.title,d=f.utils.hasAttribute(a,"data-orig-title");return d?b:c},async:function(a){window.setImmediate?window.setImmediate(a):window.setTimeout(a,0)},forEach:function(a,b){if(f.utils.isArray(a))return i(a,b);for(var c in a)a.hasOwnProperty(c)&&b(a[c],c)}}}();var m=function(){function b(a){i(a.subscriptions,function(a){a.dispose()}),a.subscriptions=[]}function c(a){a.options.deep&&(i(a.flagged,function(a){delete a.__kv_traversed}),a.flagged.length=0),a.options.live||b(a)}function d(a,d){d.validatables=[],b(d),e(a,d),c(d)}function e(b,c,d){var f=[],g=b.peek?b.peek():b;b.__kv_traversed!==!0&&(c.options.deep&&(b.__kv_traversed=!0,c.flagged.push(b)),d=void 0!==d?d:c.options.deep?1:-1,a.isObservable(b)&&(b.isValid||b.extend({validatable:!0}),c.validatables.push(b),c.options.live&&n.isObservableArray(b)&&c.subscriptions.push(b.subscribe(function(){c.graphMonitor.valueHasMutated()}))),g&&!g._destroy&&(n.isArray(g)?f=g:n.isObject(g)&&(f=n.values(g))),0!==d&&n.forEach(f,function(a){a&&!a.nodeType&&e(a,c,d+1)}))}function k(a){var b=[];return i(a,function(a){a.isValid()||b.push(a.error())}),b}var l=0,m=f.configuration,n=f.utils;return{init:function(a,b){l>0&&!b||(a=a||{},a.errorElementClass=a.errorElementClass||a.errorClass||m.errorElementClass,a.errorMessageClass=a.errorMessageClass||a.errorClass||m.errorMessageClass,j(m,a),m.registerExtenders&&f.registerExtenders(),l=1)},configure:function(a){f.init(a)},reset:f.configuration.reset,group:function(b,c){c=j(j({},m.grouping),c);var e={options:c,graphMonitor:a.observable(),flagged:[],subscriptions:[],validatables:[]},f=null;return c.observable?(d(b,e),f=a.computed(function(){return e.graphMonitor(),d(b,e),k(e.validatables)})):f=function(){return d(b,e),k(e.validatables)},f.showAllMessages=function(a){void 0===a&&(a=!0),f(),i(e.validatables,function(b){b.isModified(a)})},b.errors=f,b.isValid=function(){return 0===b.errors().length},b.isAnyMessageShown=function(){var a=!1;return f(),a=!!g.arrayFirst(e.validatables,function(a){return!a.isValid()&&a.isModified()})},f},formatMessage:function(a,b,c){return"function"==typeof a?a(b,c):a.replace(/\{0\}/gi,h(b))},addRule:function(a,b){return a.extend({validatable:!0}),a.rules.push(b),a},addAnonymousRule:function(a,b){void 0===b.message&&(b.message="Error"),b.onlyIf&&(b.condition=b.onlyIf),f.addRule(a,b)},addExtender:function(b){a.extenders[b]=function(a,c){return c&&(c.message||c.onlyIf)?f.addRule(a,{rule:b,message:c.message,params:n.isEmptyVal(c.params)?!0:c.params,condition:c.onlyIf}):f.addRule(a,{rule:b,params:c})}},registerExtenders:function(){if(m.registerExtenders)for(var b in f.rules)f.rules.hasOwnProperty(b)&&(a.extenders[b]||f.addExtender(b))},insertValidationMessage:function(a){var b=document.createElement("SPAN");return b.className=n.getConfigOptions(a).errorMessageClass,n.insertAfter(a,b),b},parseInputValidationAttributes:function(a,b){i(f.configuration.html5Attributes,function(c){if(n.hasAttribute(a,c)){var d=a.getAttribute(c)||!0;if("min"===c||"max"===c){var e=a.getAttribute("type");"undefined"!=typeof e&&e||(e="text"),d={typeAttr:e,value:d}}f.addRule(b(),{rule:c,params:d})}});var c=a.getAttribute("type");i(f.configuration.html5InputTypes,function(a){a===c&&f.addRule(b(),{rule:"date"===a?"dateISO":a,params:!0})})},writeInputValidationAttributes:function(a,b){var c=b();if(c&&c.rules){var d=c.rules();i(f.configuration.html5Attributes,function(b){var c,e=g.arrayFirst(d,function(a){return a.rule.toLowerCase()===b.toLowerCase()});e&&(c=e.params,"pattern"===e.rule&&e.params instanceof RegExp&&(c=e.params.source),a.setAttribute(b,c))}),d=null}},makeBindingHandlerValidatable:function(b){var c=a.bindingHandlers[b].init;a.bindingHandlers[b].init=function(b,d,e,f,g){return c(b,d,e,f,g),a.bindingHandlers.validationCore.init(b,d,e,f,g)}},setRules:function(b,c){var d=function(b,c){if(b&&c)for(var e in c)if(c.hasOwnProperty(e)){var g=c[e];if(b[e]){var i=b[e],j=h(i),k={},l={};for(var m in g)g.hasOwnProperty(m)&&(f.rules[m]?k[m]=g[m]:l[m]=g[m]);if(a.isObservable(i)&&i.extend(k),j&&n.isArray(j))for(var o=0;o<j.length;o++)d(j[o],l);else d(j,l)}}};d(b,c)}}}();j(a.validation,m),f.rules={},f.rules.required={validator:function(a,b){var c,d=/^\s+|\s+$/g;return void 0===a||null===a?!b:(c=a,"string"==typeof a&&(c=a.replace(d,"")),b?(c+"").length>0:!0)},message:"This field is required."},f.rules.min={validator:c("min"),message:"Please enter a value greater than or equal to {0}."},f.rules.max={validator:c("max"),message:"Please enter a value less than or equal to {0}."},f.rules.minLength={validator:function(a,b){if(f.utils.isEmptyVal(a))return!0;var c=f.utils.isNumber(a)?""+a:a;return c.length>=b},message:"Please enter at least {0} characters."},f.rules.maxLength={validator:function(a,b){if(f.utils.isEmptyVal(a))return!0;var c=f.utils.isNumber(a)?""+a:a;return c.length<=b},message:"Please enter no more than {0} characters."},f.rules.pattern={validator:function(a,b){return f.utils.isEmptyVal(a)||null!==a.toString().match(b)},message:"Please check this value."},f.rules.step={validator:function(a,b){if(f.utils.isEmptyVal(a)||"any"===b)return!0;var c=100*a%(100*b);return Math.abs(c)<1e-5||Math.abs(1-c)<1e-5},message:"The value must increment by {0}."},f.rules.email={validator:function(a,b){return b?f.utils.isEmptyVal(a)||b&&/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(a):!0},message:"Please enter a proper email address."},f.rules.date={validator:function(a,b){return b?f.utils.isEmptyVal(a)||b&&!/Invalid|NaN/.test(new Date(a)):!0},message:"Please enter a proper date."},f.rules.dateISO={validator:function(a,b){return b?f.utils.isEmptyVal(a)||b&&/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(a):!0},message:"Please enter a proper date."},f.rules.number={validator:function(a,b){return b?f.utils.isEmptyVal(a)||b&&/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a):!0},message:"Please enter a number."},f.rules.digit={validator:function(a,b){return b?f.utils.isEmptyVal(a)||b&&/^\d+$/.test(a):!0},message:"Please enter a digit."},f.rules.phoneUS={validator:function(a,b){return b?f.utils.isEmptyVal(a)?!0:"string"!=typeof a?!1:(a=a.replace(/\s+/g,""),b&&a.length>9&&a.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)):!0},message:"Please specify a valid phone number."},f.rules.equal={validator:function(a,b){var c=b;return a===f.utils.getValue(c)},message:"Values must equal."},f.rules.notEqual={validator:function(a,b){var c=b;return a!==f.utils.getValue(c)},message:"Please choose another value."},f.rules.unique={validator:function(a,b){var c=f.utils.getValue(b.collection),d=f.utils.getValue(b.externalValue),e=0;return a&&c?(g.arrayFilter(c,function(c){a===(b.valueAccessor?b.valueAccessor(c):c)&&e++}),(d?1:2)>e):!0},message:"Please make sure the value is unique."},function(){f.registerExtenders()}(),a.bindingHandlers.validationCore=function(){return{init:function(b,c){var d=f.utils.getConfigOptions(b),e=c();if(d.parseInputAttributes&&f.utils.async(function(){f.parseInputValidationAttributes(b,c)}),d.insertMessages&&f.utils.isValidatable(e)){var g=f.insertValidationMessage(b);d.messageTemplate?a.renderTemplate(d.messageTemplate,{field:e},null,g,"replaceNode"):a.applyBindingsToNode(g,{validationMessage:e})}d.writeInputAttributes&&f.utils.isValidatable(e)&&f.writeInputValidationAttributes(b,c),d.decorateInputElement&&f.utils.isValidatable(e)&&a.applyBindingsToNode(b,{validationElement:e})}}}(),f.makeBindingHandlerValidatable("value"),f.makeBindingHandlerValidatable("checked"),a.bindingHandlers.validationMessage={update:function(b,c){var d=c(),e=f.utils.getConfigOptions(b),i=(h(d),!1),j=!1;if(!d.isValid||!d.isModified)throw new Error("Observable is not validatable");i=d.isModified(),j=d.isValid();var k=null;(!e.messagesOnModified||i)&&(k=j?null:d.error);var l=!e.messagesOnModified||i?!j:!1,m="none"!==b.style.display;e.allowHtmlMessages?g.setHtml(b,k):a.bindingHandlers.text.update(b,function(){return k}),m&&!l?b.style.display="none":!m&&l&&(b.style.display="")}},a.bindingHandlers.validationElement={update:function(b,c,d){var e=c(),g=f.utils.getConfigOptions(b),i=(h(e),!1),j=!1;if(!e.isValid||!e.isModified)throw new Error("Observable is not validatable");i=e.isModified(),j=e.isValid();var k=function(){var a={},b=!g.decorateElementOnModified||i?!j:!1;return a[g.errorElementClass]=b,a};a.bindingHandlers.css.update(b,k,d),g.errorsAsTitle&&a.bindingHandlers.attr.update(b,function(){var a=!g.errorsAsTitleOnModified||i,c=f.utils.getOriginalElementTitle(b);return a&&!j?{title:e.error,"data-orig-title":c}:!a||j?{title:c,"data-orig-title":null}:void 0})}},a.bindingHandlers.validationOptions=function(){return{init:function(a,b){var c=h(b());if(c){var d=j({},f.configuration);j(d,c),f.utils.setDomData(a,d)}}}}(),a.extenders.validation=function(a,b){return i(f.utils.isArray(b)?b:[b],function(b){f.addAnonymousRule(a,b)}),a},a.extenders.validatable=function(b,c){if(f.utils.isObject(c)||(c={enable:c}),"enable"in c||(c.enable=!0),c.enable&&!f.utils.isValidatable(b)){var d=f.configuration.validate||{},e={throttleEvaluation:c.throttle||d.throttle};b.error=a.observable(null),b.rules=a.observableArray(),b.isValidating=a.observable(!1),b.__valid__=a.observable(!0),b.isModified=a.observable(!1),b.isValid=a.computed(b.__valid__),b.setError=function(a){b.error(a),b.__valid__(!1)},b.clearError=function(){return b.error(null),b.__valid__(!0),b};var g=b.subscribe(function(){b.isModified(!0)}),h=a.computed(j({read:function(){b(),b.rules();return f.validateObservable(b),!0}},e));j(h,e),b._disposeValidation=function(){b.isValid.dispose(),b.rules.removeAll(),b.isModified.getSubscriptionsCount()>0&&(b.isModified._subscriptions.change=[]),b.isValidating.getSubscriptionsCount()>0&&(b.isValidating._subscriptions.change=[]),b.__valid__.getSubscriptionsCount()>0&&(b.__valid__._subscriptions.change=[]),g.dispose(),h.dispose(),delete b.rules,delete b.error,delete b.isValid,delete b.isValidating,delete b.__valid__,delete b.isModified}}else c.enable===!1&&b._disposeValidation&&b._disposeValidation();return b},f.validateObservable=function(a){for(var b,c,g=0,h=a.rules(),i=h.length;i>g;g++)if(c=h[g],!c.condition||c.condition())if(b=c.rule?f.rules[c.rule]:c,b.async||c.async)e(a,b,c);else if(!d(a,b,c))return!1;return a.clearError(),!0},f.localize=function(a){var b;for(b in a)f.rules.hasOwnProperty(b)&&(f.rules[b].message=a[b])},a.applyBindingsWithValidation=function(b,c,d){var e,g,h=arguments.length;h>2?(e=c,g=d):2>h?e=document.body:arguments[1].nodeType?e=c:g=arguments[1],f.init(),g&&f.utils.setDomData(e,g),a.applyBindings(b,c)};var n=a.applyBindings;a.applyBindings=function(a,b){f.init(),n(a,b)},a.validatedObservable=function(b){if(!f.utils.isObject(b))return a.observable(b).extend({validatable:!0});var c=a.observable(b);return c.errors=f.group(b),c.isValid=a.observable(b.isValid()),c.errors.subscribe(function(a){c.isValid(0===a.length)}),c}});
function OrganisationProfileViewModel() {
    var self = this;

    self.opening_hours = ko.observableArray([new OpeningHours(0), new OpeningHours(1), new OpeningHours(2), new OpeningHours(3), new OpeningHours(4), new OpeningHours(5), new OpeningHours(6)]);
    self.opening_hours().hasErrors = ko.computed({
        read: function() {
            for(var i = 0; i < this.length; i++) {
                if(this[i].errors().length > 0) return true;
            }
            return false;
        },
        owner: this.opening_hours()
    });
    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {

        }
    };

    self.organisation = ko.observable();

    self.hours_is_saved = function (bool) {
        self.hours_saved(bool);
    }.bind(self);

    self.profile_is_saved = function (bool) {
        self.profile_saved(bool);
    }.bind(self);

    self.hours_saved = ko.observable(true);
    self.profile_saved = ko.observable(true);

    self.showErrorModal = function(error_message, error_code) {
        self.error_modal.show(true);
        self.error_modal.error_message(error_message);
        self.error_modal.error_code(error_code);

        if(error_code < 500) {
            self.error_modal.header("Notice");
            self.error_modal.body("Please Note:");
        } else if(error_code < 1000) {
            self.error_modal.header("Warning");
            self.error_modal.body("Warning:");
        } else if(error_code < 1500) {
            self.error_modal.header("Error");
            self.error_modal.body("The application has encountered an error:");
        } else {
            self.error_modal.header("Fatal Error");
            self.error_modal.body("The application has encountered a fatal error:");
        }
    };

    self.getOrganisationAvailabilities = function() {
        $.getJSON("organisation/organisation-opening-hours" , [], function(allData) {
            if(allData['result'] == 0) {
                $.each(allData['data'], function(key, val){

                    var day = self.opening_hours()[moment(val.day, "dddd").format("E")-1];
                    day.formatted_open_time(val.start_time);
                    day.formatted_close_time(val.end_time);

                });
                self.hours_is_saved(true);
            }
        })

    };
    self.timezone = ko.observable();

    self.getOrganisationProfile = function() {
        $.getJSON("organisation/organisation-profile", [], function(allData) {

            if(allData['result'] == 0) {
                self.timezone(allData['data'].timezone || '');
                self.organisation(new Organisation(allData['data']));
                self.profile_is_saved(true);
            }
        })
    };

    self.saveOrganisationProfile = function() {
        self.organisation().timezone = self.timezone();
        var jsonData = ko.toJSON(self.organisation);
        $.post(
            "organisation/organisation-profile",
            {data: jsonData},
            function(returnedData) {
                if(returnedData.result == 0) {
                    self.profile_is_saved(true);
                }
            }
        );
    };

    self.saveOpeningHours = function() {
        var jsonData = ko.toJSON(self);
        $.post(
            "organisation/organisation-opening-hours",
            {data: jsonData},
            function(returnedData) {
                if(returnedData.result == 0) {
                    self.hours_is_saved(true);
                }
            }
        );
    };

    self.syncWithXero = function() {
        var jsonData = {};

        jsonData.callback = 'xero-employees';
        jsonData = JSON.stringify(jsonData);
        $.post(
            "xero/oauth-url",
            { data: jsonData },
            function(returnedData) {
                if(returnedData.result == '0' && typeof returnedData.data.url !== 'undefined') {
                    window.location.href = returnedData.data.url;
                }
            },
            "json"
        );
    };

    self.retrieveConfigsFromXero = function() {
        var jsonData = {};

        jsonData.callback = 'invoice-config-from-xero';
        jsonData = JSON.stringify(jsonData);
        $.post(
            "xero/oauth-url",
            { data: jsonData },
            function(returnedData) {
                if(returnedData.result == '0' && typeof returnedData.data.url !== 'undefined') {
                    window.location.href = returnedData.data.url;
                }
            },
            "json"
        );
    };
    self.getOrganisationAvailabilities();
    self.getOrganisationProfile();
}

function Organisation(organisation) {
    this.id = ko.observable(organisation.id);
    this.name = ko.observable(organisation.name);
    this.email = ko.observable(organisation.email);
    this.phone = ko.observable(organisation.phone);
    this.address = ko.observable(organisation.address);
    this.post_code = ko.observable(organisation.post_code);
    this.city = ko.observable(organisation.city.city_name);
    this.country = ko.observable(organisation.city.country );
}

function OpeningHours(weekday) {
    this.open_time = ko.observable("");
    this.close_time = ko.observable("");

    this.open_time.extend({ isBefore: this.close_time });
    this.close_time.extend({ isAfter: this.open_time });

    this.weekday = ko.observable(moment(weekday+1, "E").format("dddd"));

    this.error_status = ko.observable();

    this.formatted_open_time = ko.computed({
        read: function () {
            if(this.open_time() == "" || typeof this.open_time() === 'undefined') {
                return "";
            } else {
                return moment(this.open_time(), 'H:mm').format('H:mm');
            }
        },
        write: function (value) {
            var parent = this;

            if(value == "") {
                parent.open_time("");

            } else {
                var new_open_time = moment(value, 'H:mm');
                var close_time = moment(parent.close_time(), 'H:mm');

                if(!new_open_time.isValid()) {
                    parent.open_time.notifySubscribers();
                } /*else if (new_open_time.isAfter(close_time) && parent.close_time() != "") {
                    //parent.open_time.notifySubscribers();
                    //alert("Open time is after Close time.");
                } */else {
                    parent.open_time(new_open_time.format('H:mm'));
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.formatted_close_time = ko.computed({
        read: function () {
            if(this.close_time() == "" || typeof this.close_time() === 'undefined') {
                return "";
            } else {
                return moment(this.close_time(), 'H:mm').format('H:mm');
            }
        },
        write: function (value) {
            var parent = this;
            if(value == "") {
                parent.close_time("");

            } else {
                var new_close_time = moment(value, 'H:mm');
                var open_time = moment(parent.open_time(), 'H:mm');

                if(!new_close_time.isValid()) {
                    parent.close_time.notifySubscribers();
                } /*else if (open_time.isAfter(new_close_time) && parent.open_time() != "") {
                    //parent.close_time.notifySubscribers();
                    //alert("Open time is after Close time.");
                } */else {
                    parent.close_time(new_close_time.format('H:mm'));
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.errors = ko.validation.group(this);
}

OpeningHours.prototype.toJSON = function() {
    return { open_time: this.open_time, close_time: this.close_time, weekday: this.weekday };
};

ko.validation.rules['isBefore'] = {
    validator: function(start_time, end_time) {
        if(start_time !== "" && end_time !== "") {
            var start = moment(start_time, 'H:mm'),
                end = moment(end_time, 'H:mm');
            return start.isValid() && end.isValid() && start.isBefore(end);
        }
    },
    message: 'Open time is after Close time.'
};

ko.validation.rules['isAfter'] = {
    validator: function(end_time, start_time) {
        if(start_time !== "" && end_time !== "") {
            var start = moment(start_time, 'H:mm'),
                end = moment(end_time, 'H:mm');
            return start.isValid() && end.isValid() && start.isBefore(end);
        }
    },
    message: 'Open time is after Close time.'
};

ko.validation.registerExtenders();
var organisation_profile_view_model = new OrganisationProfileViewModel;
ko.applyBindings(organisation_profile_view_model);
//# sourceMappingURL=organisation-profile.js.map
