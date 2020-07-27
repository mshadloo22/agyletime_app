/// Knockout Mapping plugin v2.4.1
/// (c) 2013 Steven Sanderson, Roy Jacobs - http://knockoutjs.com/
/// License: MIT (http://www.opensource.org/licenses/mit-license.php)
(function(e){"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?e(require("knockout"),exports):"function"===typeof define&&define.amd?define(["knockout","exports"],e):e(ko,ko.mapping={})})(function(e,f){function y(b,c){var a,d;for(d in c)if(c.hasOwnProperty(d)&&c[d])if(a=f.getType(b[d]),d&&b[d]&&"array"!==a&&"string"!==a)y(b[d],c[d]);else if("array"===f.getType(b[d])&&"array"===f.getType(c[d])){a=b;for(var e=d,l=b[d],n=c[d],t={},g=l.length-1;0<=g;--g)t[l[g]]=l[g];for(g=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          n.length-1;0<=g;--g)t[n[g]]=n[g];l=[];n=void 0;for(n in t)l.push(t[n]);a[e]=l}else b[d]=c[d]}function E(b,c){var a={};y(a,b);y(a,c);return a}function z(b,c){for(var a=E({},b),e=L.length-1;0<=e;e--){var f=L[e];a[f]&&(a[""]instanceof Object||(a[""]={}),a[""][f]=a[f],delete a[f])}c&&(a.ignore=h(c.ignore,a.ignore),a.include=h(c.include,a.include),a.copy=h(c.copy,a.copy),a.observe=h(c.observe,a.observe));a.ignore=h(a.ignore,j.ignore);a.include=h(a.include,j.include);a.copy=h(a.copy,j.copy);a.observe=h(a.observe,
    j.observe);a.mappedProperties=a.mappedProperties||{};a.copiedProperties=a.copiedProperties||{};return a}function h(b,c){"array"!==f.getType(b)&&(b="undefined"===f.getType(b)?[]:[b]);"array"!==f.getType(c)&&(c="undefined"===f.getType(c)?[]:[c]);return e.utils.arrayGetDistinctValues(b.concat(c))}function F(b,c,a,d,k,l,n){var t="array"===f.getType(e.utils.unwrapObservable(c));l=l||"";if(f.isMapped(b)){var g=e.utils.unwrapObservable(b)[p];a=E(g,a)}var j=n||k,h=function(){return a[d]&&a[d].create instanceof
    Function},x=function(b){var f=G,g=e.dependentObservable;e.dependentObservable=function(a,b,c){c=c||{};a&&"object"==typeof a&&(c=a);var d=c.deferEvaluation,M=!1;c.deferEvaluation=!0;a=new H(a,b,c);if(!d){var g=a,d=e.dependentObservable;e.dependentObservable=H;a=e.isWriteableObservable(g);e.dependentObservable=d;d=H({read:function(){M||(e.utils.arrayRemoveItem(f,g),M=!0);return g.apply(g,arguments)},write:a&&function(a){return g(a)},deferEvaluation:!0});d.__DO=g;a=d;f.push(a)}return a};e.dependentObservable.fn=
    H.fn;e.computed=e.dependentObservable;b=e.utils.unwrapObservable(k)instanceof Array?a[d].create({data:b||c,parent:j,skip:N}):a[d].create({data:b||c,parent:j});e.dependentObservable=g;e.computed=e.dependentObservable;return b},u=function(){return a[d]&&a[d].update instanceof Function},v=function(b,f){var g={data:f||c,parent:j,target:e.utils.unwrapObservable(b)};e.isWriteableObservable(b)&&(g.observable=b);return a[d].update(g)};if(n=I.get(c))return n;d=d||"";if(t){var t=[],s=!1,m=function(a){return a};
    a[d]&&a[d].key&&(m=a[d].key,s=!0);e.isObservable(b)||(b=e.observableArray([]),b.mappedRemove=function(a){var c="function"==typeof a?a:function(b){return b===m(a)};return b.remove(function(a){return c(m(a))})},b.mappedRemoveAll=function(a){var c=C(a,m);return b.remove(function(a){return-1!=e.utils.arrayIndexOf(c,m(a))})},b.mappedDestroy=function(a){var c="function"==typeof a?a:function(b){return b===m(a)};return b.destroy(function(a){return c(m(a))})},b.mappedDestroyAll=function(a){var c=C(a,m);return b.destroy(function(a){return-1!=
        e.utils.arrayIndexOf(c,m(a))})},b.mappedIndexOf=function(a){var c=C(b(),m);a=m(a);return e.utils.arrayIndexOf(c,a)},b.mappedGet=function(a){return b()[b.mappedIndexOf(a)]},b.mappedCreate=function(a){if(-1!==b.mappedIndexOf(a))throw Error("There already is an object with the key that you specified.");var c=h()?x(a):a;u()&&(a=v(c,a),e.isWriteableObservable(c)?c(a):c=a);b.push(c);return c});n=C(e.utils.unwrapObservable(b),m).sort();g=C(c,m);s&&g.sort();s=e.utils.compareArrays(n,g);n={};var J,A=e.utils.unwrapObservable(c),
        y={},z=!0,g=0;for(J=A.length;g<J;g++){var r=m(A[g]);if(void 0===r||r instanceof Object){z=!1;break}y[r]=A[g]}var A=[],B=0,g=0;for(J=s.length;g<J;g++){var r=s[g],q,w=l+"["+g+"]";switch(r.status){case "added":var D=z?y[r.value]:K(e.utils.unwrapObservable(c),r.value,m);q=F(void 0,D,a,d,b,w,k);h()||(q=e.utils.unwrapObservable(q));w=O(e.utils.unwrapObservable(c),D,n);q===N?B++:A[w-B]=q;n[w]=!0;break;case "retained":D=z?y[r.value]:K(e.utils.unwrapObservable(c),r.value,m);q=K(b,r.value,m);F(q,D,a,d,b,w,
        k);w=O(e.utils.unwrapObservable(c),D,n);A[w]=q;n[w]=!0;break;case "deleted":q=K(b,r.value,m)}t.push({event:r.status,item:q})}b(A);a[d]&&a[d].arrayChanged&&e.utils.arrayForEach(t,function(b){a[d].arrayChanged(b.event,b.item)})}else if(P(c)){b=e.utils.unwrapObservable(b);if(!b){if(h())return s=x(),u()&&(s=v(s)),s;if(u())return v(s);b={}}u()&&(b=v(b));I.save(c,b);if(u())return b;Q(c,function(d){var f=l.length?l+"."+d:d;if(-1==e.utils.arrayIndexOf(a.ignore,f))if(-1!=e.utils.arrayIndexOf(a.copy,f))b[d]=
    c[d];else if("object"!=typeof c[d]&&"array"!=typeof c[d]&&0<a.observe.length&&-1==e.utils.arrayIndexOf(a.observe,f))b[d]=c[d],a.copiedProperties[f]=!0;else{var g=I.get(c[d]),k=F(b[d],c[d],a,d,b,f,b),g=g||k;if(0<a.observe.length&&-1==e.utils.arrayIndexOf(a.observe,f))b[d]=g(),a.copiedProperties[f]=!0;else{if(e.isWriteableObservable(b[d])){if(g=e.utils.unwrapObservable(g),b[d]()!==g)b[d](g)}else g=void 0===b[d]?g:e.utils.unwrapObservable(g),b[d]=g;a.mappedProperties[f]=!0}}})}else switch(f.getType(c)){case "function":u()?
    e.isWriteableObservable(c)?(c(v(c)),b=c):b=v(c):b=c;break;default:if(e.isWriteableObservable(b))return q=u()?v(b):e.utils.unwrapObservable(c),b(q),q;h()||u();b=h()?x():e.observable(e.utils.unwrapObservable(c));u()&&b(v(b))}return b}function O(b,c,a){for(var d=0,e=b.length;d<e;d++)if(!0!==a[d]&&b[d]===c)return d;return null}function R(b,c){var a;c&&(a=c(b));"undefined"===f.getType(a)&&(a=b);return e.utils.unwrapObservable(a)}function K(b,c,a){b=e.utils.unwrapObservable(b);for(var d=0,f=b.length;d<
    f;d++){var l=b[d];if(R(l,a)===c)return l}throw Error("When calling ko.update*, the key '"+c+"' was not found!");}function C(b,c){return e.utils.arrayMap(e.utils.unwrapObservable(b),function(a){return c?R(a,c):a})}function Q(b,c){if("array"===f.getType(b))for(var a=0;a<b.length;a++)c(a);else for(a in b)c(a)}function P(b){var c=f.getType(b);return("object"===c||"array"===c)&&null!==b}function T(){var b=[],c=[];this.save=function(a,d){var f=e.utils.arrayIndexOf(b,a);0<=f?c[f]=d:(b.push(a),c.push(d))};
    this.get=function(a){a=e.utils.arrayIndexOf(b,a);return 0<=a?c[a]:void 0}}function S(){var b={},c=function(a){var c;try{c=a}catch(e){c="$$$"}a=b[c];void 0===a&&(a=new T,b[c]=a);return a};this.save=function(a,b){c(a).save(a,b)};this.get=function(a){return c(a).get(a)}}var p="__ko_mapping__",H=e.dependentObservable,B=0,G,I,L=["create","update","key","arrayChanged"],N={},x={include:["_destroy"],ignore:[],copy:[],observe:[]},j=x;f.isMapped=function(b){return(b=e.utils.unwrapObservable(b))&&b[p]};f.fromJS=
    function(b){if(0==arguments.length)throw Error("When calling ko.fromJS, pass the object you want to convert.");try{B++||(G=[],I=new S);var c,a;2==arguments.length&&(arguments[1][p]?a=arguments[1]:c=arguments[1]);3==arguments.length&&(c=arguments[1],a=arguments[2]);a&&(c=E(c,a[p]));c=z(c);var d=F(a,b,c);a&&(d=a);if(!--B)for(;G.length;){var e=G.pop();e&&(e(),e.__DO.throttleEvaluation=e.throttleEvaluation)}d[p]=E(d[p],c);return d}catch(f){throw B=0,f;}};f.fromJSON=function(b){var c=e.utils.parseJson(b);
    arguments[0]=c;return f.fromJS.apply(this,arguments)};f.updateFromJS=function(){throw Error("ko.mapping.updateFromJS, use ko.mapping.fromJS instead. Please note that the order of parameters is different!");};f.updateFromJSON=function(){throw Error("ko.mapping.updateFromJSON, use ko.mapping.fromJSON instead. Please note that the order of parameters is different!");};f.toJS=function(b,c){j||f.resetDefaultOptions();if(0==arguments.length)throw Error("When calling ko.mapping.toJS, pass the object you want to convert.");
    if("array"!==f.getType(j.ignore))throw Error("ko.mapping.defaultOptions().ignore should be an array.");if("array"!==f.getType(j.include))throw Error("ko.mapping.defaultOptions().include should be an array.");if("array"!==f.getType(j.copy))throw Error("ko.mapping.defaultOptions().copy should be an array.");c=z(c,b[p]);return f.visitModel(b,function(a){return e.utils.unwrapObservable(a)},c)};f.toJSON=function(b,c){var a=f.toJS(b,c);return e.utils.stringifyJson(a)};f.defaultOptions=function(){if(0<arguments.length)j=
    arguments[0];else return j};f.resetDefaultOptions=function(){j={include:x.include.slice(0),ignore:x.ignore.slice(0),copy:x.copy.slice(0)}};f.getType=function(b){if(b&&"object"===typeof b){if(b.constructor===Date)return"date";if(b.constructor===Array)return"array"}return typeof b};f.visitModel=function(b,c,a){a=a||{};a.visitedObjects=a.visitedObjects||new S;var d,k=e.utils.unwrapObservable(b);if(P(k))a=z(a,k[p]),c(b,a.parentName),d="array"===f.getType(k)?[]:{};else return c(b,a.parentName);a.visitedObjects.save(b,
    d);var l=a.parentName;Q(k,function(b){if(!(a.ignore&&-1!=e.utils.arrayIndexOf(a.ignore,b))){var j=k[b],g=a,h=l||"";"array"===f.getType(k)?l&&(h+="["+b+"]"):(l&&(h+="."),h+=b);g.parentName=h;if(!(-1===e.utils.arrayIndexOf(a.copy,b)&&-1===e.utils.arrayIndexOf(a.include,b)&&k[p]&&k[p].mappedProperties&&!k[p].mappedProperties[b]&&k[p].copiedProperties&&!k[p].copiedProperties[b]&&"array"!==f.getType(k)))switch(f.getType(e.utils.unwrapObservable(j))){case "object":case "array":case "undefined":g=a.visitedObjects.get(j);
    d[b]="undefined"!==f.getType(g)?g:f.visitModel(j,c,a);break;default:d[b]=c(j,a.parentName)}}});return d}});
$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return results[1] || 0;
    }
};

var manage_team_view_model = new ManageTeamViewModel();

function ManageTeamViewModel() {
    var self = this;

    self.selected_team = ko.observable();

    self.team_found = ko.observable(false);

    self.team = ko.observable();

    self.organisation = ko.observable();

    self.organisation_teams = ko.observableArray([]);

    self.show_inactive = ko.observable(false);

    self.roles = ko.observableArray([]);

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {

        }
    };

    self.confirm_modal = {
        confirm_message: ko.observable(),
        active: ko.observable(),
        show: ko.observable(false),
        onClose: function(){},
        onAction: function() {
            if(self.confirm_modal.active()) {
                $.post(
                    "user/activate-user",
                    {user_id: self.confirm_modal.user.user_id()},
                    function(returnedData) {
                        self.confirm_modal.show(false);
                        self.confirm_modal.user.active(true);
                    }
                );
            } else {
                $.post(
                    "user/deactivate-user",
                    {user_id: self.confirm_modal.user.user_id()},
                    function(returnedData) {
                        self.confirm_modal.show(false);
                        self.confirm_modal.user.active(false);
                    }
                );
            }
        }
    };

    self.cti_softphone_modal = {
        integration: new Integration({'EmployeeAlias': 0}),
        show: ko.observable(false),
        onClose: function(){},
        onAction: function() {
            $.post(
                "integration/user-integration",
                ko.toJSON(this.integration),
                function(returnedData) {
                    self.cti_softphone_modal.show(false);
                }
            );
        }
    };

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

    self.showConfirmModal = function(user, active, confirm_message) {
        self.confirm_modal.show(true);
        self.confirm_modal.user = user;
        self.confirm_modal.active(active);
        self.confirm_modal.confirm_message(confirm_message);
    };

    self.showCtiSoftphoneModal = function(integration_id, user) {
        var modal = self.cti_softphone_modal;
        modal.user = user;
        $.getJSON("integration/user-integration", {user_id: user.user_id(), integration_id: integration_id}, function(data) {
            modal.integration.addIntegration(data.data);
            modal.show(true);
        });
    };

    self.deactivateMember = function(user) {
        self.showConfirmModal(user, false, "Are you sure you want to deactivate this user?");
    };

    self.reactivateMember = function(user) {
        self.showConfirmModal(user, true, "Are you sure you want to reactivate this user?");
    };
    self.team_selection = ko.observable(); //for moving users from teams
    self.organisation_teams = ko.observableArray();
    self.getTeam = function() {
        var data = { team_id: self.selected_team() };
        $.getJSON("team/team", data, function(allData) {
            if(allData['result'] == 0) {
                self.team_found(true);
                self.team(null);
                if(allData.data.organisation != undefined) {
                    self.organisation(allData.data.organisation);
                }
                var tmpTeamList = allData.data.organisation_teams;
                var teamList = [];
                for(var i = 0; i < tmpTeamList.length; i++) {
                    var team = new Team(tmpTeamList[i]);
                    teamList.push(team);
                }
                self.organisation_teams(teamList);
                if(typeof allData.data.team !== 'undefined'){
                    self.team(new Team(allData.data.team));
                    self.team_selection(allData.data.team.id);
                    self.edit_modal.team_name(allData.data.team.name);
                    history.pushState({}, null, "manage_users?team_id=" + self.team().id());
                }
            } else {
                self.showErrorModal(allData['result'], allData['message']);
            }
        });
    };

    self.edit_modal = {
        header: "Edit Team Member",
        first_name: ko.observable(),
        last_name: ko.observable(),
        phone_one: ko.observable(),
        phone_two: ko.observable(),
        email: ko.observable(),
        gender: ko.observable(),
        role_ids: ko.observableArray(),
        address: ko.observable(),
        post_code: ko.observable(),
        city: ko.observable(),
        pay_rate: ko.observable(),
        billable_rate: ko.observable(),
        unit_type: ko.observable(),
        primary_contact: ko.observable(),
        team_id: ko.observable(),
        team_name: ko.observable(),
        timezone: ko.observable(),
        closeLabel: "Cancel",
        primaryLabel: "Save",
        show: ko.observable(false),

        onClose: function() {

        },
        onAction: function() {
            self.edit_modal.user.first_name(self.edit_modal.first_name());
            self.edit_modal.user.last_name(self.edit_modal.last_name());
            self.edit_modal.user.phone_one(self.edit_modal.phone_one());
            self.edit_modal.user.phone_two(self.edit_modal.phone_two());
            self.edit_modal.user.email(self.edit_modal.email());
            self.edit_modal.user.gender(self.edit_modal.gender());
            self.edit_modal.user.roles(self.edit_modal.role_ids());
            self.edit_modal.user.address(self.edit_modal.address());
            self.edit_modal.user.post_code(self.edit_modal.post_code());
            self.edit_modal.user.city(self.edit_modal.city());
            self.edit_modal.user.pay_rate(self.edit_modal.pay_rate());
            self.edit_modal.user.billable_rate(self.edit_modal.billable_rate());
            self.edit_modal.user.unit_type(self.edit_modal.unit_type());
            self.edit_modal.user.team_id(self.team_selection());
            self.edit_modal.user.timezone(self.edit_modal.timezone());
            self.edit_modal.user.primary_contact(self.edit_modal.primary_contact());
            if( self.edit_modal.first_name() === "" ||
                self.edit_modal.last_name() === "" ||
                self.edit_modal.email() === "" ){
                alert("Error: You have not completed all of the required fields");
            } else {
                self.edit_modal.show(false);
                var jsonData = ko.toJSON(self.edit_modal.user);
                $.post(
                    "user/user",
                    {data: jsonData},
                    function(returnedData) {
                        if(returnedData['result'] == 0) {

                            //remove this member if change teams.;
                            if(self.team_selection() != self.team().id()) {
                                var tmp_index = 0;
                                for(var i = 0; i < self.team().team_members().length; i++) {
                                    var member = self.team().team_members()[i];
                                    if(member.user_id() == returnedData.data.id) {
                                        tmp_index = i;
                                    }
                                }
                                self.team().team_members.splice(tmp_index, 1);
                                self.team().team_members.notifySubscribers();
                            }
                            if(typeof returnedData.data.id !== 'undefined' && self.edit_modal.user.user_id() === "") {
                                self.edit_modal.user.user_id(returnedData.data.id);
                                self.team().team_members.push(self.edit_modal.user);
                                self.team().team_members.notifySubscribers();
                            }
                        } else {
                            alert("Error " + returnedData['result'] + ": " + returnedData['message']);
                        }
                    }
                );
            }
        }
    };

    self.editMember = function(user) {
        self.edit_modal.user = user;
        self.edit_modal.first_name(user.first_name());
        self.edit_modal.last_name(user.last_name());
        self.edit_modal.phone_one(user.phone_one());
        self.edit_modal.phone_two(user.phone_two());
        self.edit_modal.email(user.email());
        self.edit_modal.gender(user.gender());
        self.edit_modal.role_ids(user.roles());
        self.edit_modal.address(user.address());
        self.edit_modal.post_code(user.post_code());
        self.edit_modal.city(user.city());
        self.edit_modal.pay_rate(user.pay_rate());
        //self.edit_modal.billable_rate(user.billable_rate());
        self.edit_modal.timezone(user.timezone());
        self.edit_modal.unit_type(user.unit_type());
        self.edit_modal.primary_contact(user.primary_contact());
        self.team_selection(user.team_id());
        self.edit_modal.show(true);
    };

    self.addMember = function() {
        self.edit_modal.user = new Employee;
        self.edit_modal.first_name("");
        self.edit_modal.last_name("");
        self.edit_modal.phone_one("");
        self.edit_modal.phone_two("");
        self.edit_modal.email("");
        self.edit_modal.gender("");
        self.edit_modal.role_ids([]);
        self.edit_modal.address("");
        self.edit_modal.post_code("");
        self.edit_modal.city("");
        self.edit_modal.pay_rate("");
        self.edit_modal.billable_rate("");
        self.edit_modal.unit_type("");
        if(self.organisation() != undefined) {
            if(self.organisation().timezone != undefined && self.organisation().timezone != null) {
                self.edit_modal.timezone(self.organisation().timezone);
            } else {
                self.edit_modal.timezone("");
            }
        } else {
            self.edit_modal.timezone("");
        }
        self.edit_modal.primary_contact(false);
        self.edit_modal.show(true);
    };

    self.resetPassword = function(user) {
        var r = confirm("Are you sure you want to reset " + user.full_name() +"'s password?");

        if(r == true) {
            $.post(
                "remindajax",
                {email: user.email()},
                function(returnedData) {
                }
            );
        }
    };

    $.getJSON("role/available-roles", function(allData) {
        if(allData.result == 0) {
            $.each(allData.data, function(key, val) {
                self.roles.push(new Role(key, val));
            });
        }
    });

    if($.urlParam('team_id') != null) {
        self.selected_team($.urlParam('team_id'));
        self.getTeam();
    }
}

function Team(team) {
    this.id = ko.observable(team.id);
    this.name = ko.observable(team.name);
    this.team_leader_id = ko.observable(team.team_leader_id);
    this.manager_id = ko.observable(team.manager_id);

    this.team_members = ko.observableArray([]);

    var parent = this;
    if(team.user !== undefined) {
        $.each(team.user, function(key, val) {
            if(typeof val !== 'undefined') {
                var employee = new Employee;
                employee.addEmployee(val);
                parent.team_members.push(employee);
            }
        });
    }
}

function Employee() {
    this.user_id = ko.observable("");
    this.first_name = ko.observable("");
    this.last_name = ko.observable("");

    this.full_name = ko.computed(
        function() {
            return this.first_name() + " " + this.last_name();
        },
        this
    );
    this.active = ko.observable(true);
    this.email = ko.observable("");
    this.gender = ko.observable("");
    this.roles = ko.observableArray([]);
    this.phone_one = ko.observable("");
    this.phone_two = ko.observable("");
    this.address = ko.observable("");
    this.post_code = ko.observable("");
    this.city = ko.observable("");
    this.pay_rate = ko.observable("");
    this.billable_rate = ko.observable("");
    this.timezone = ko.observable("");
    this.unit_type = ko.observable("");
    this.team_id = ko.observable("");
    this.team_name = ko.observable("");
    this.gravatar_address = ko.observable("");
    this.primary_contact = ko.observable(false);
}

Employee.prototype.addEmployee = function(user) {
    var self = this;
    this.user_id(user.id);
    this.first_name(user.first_name);
    this.last_name(user.last_name);

    this.active(user.active);
    this.email(user.email);
    this.gender(user.gender);
    $.each(user.role, function(key, val) {
        self.roles.push(val.id);
    });
    this.phone_one(user.phone_one);
    this.phone_two(user.phone_two);
    this.address(user.address);
    this.post_code(user.post_code);
    this.primary_contact(user.primary_contact);
    if(typeof user.city !== 'undefined' && user.city !== null) {
        this.city(user.city.city_name);
    }
    if(typeof user.timezone !== 'undefined' && user.timezone !== null) {
        this.timezone(user.timezone);
    }
    if(user.payrate.length != 0){
        this.pay_rate(Math.round(user.payrate[0].pay_rate*100)/100);
        this.unit_type(user.payrate[0].unit_type);
    }
    if(user.billablerate.length != 0) this.billable_rate(Math.round(user.billablerate[0].billable_rate*100)/100);
    this.team_id(user.team_id);
    this.gravatar_address('//www.gravatar.com/avatar/' + md5(this.email()) + '?s=50&d=retro');
};

function Integration(user_configs) {
    this.id = ko.observable("");
    this.user_id = ko.observable("");
    this.name = ko.observable("");
    this.configuration = {};
    this.user_configuration = ko.mapping.fromJS(user_configs);
}

Integration.prototype.addIntegration = function(integration) {
    this.id(integration.id);
    this.user_id(integration.user[0].id);
    this.name(integration.name);
    this.configuration = ko.mapping.fromJSON(integration.configuration);
    this.user_configuration = ko.mapping.fromJSON(integration.user[0].pivot.configuration, this.user_configuration);
};

Integration.prototype.toJSON = function() {
    return {
        id: this.id,
        user_id: this.user_id,
        name: this.name,
        configuration: ko.mapping.toJS(this.configuration),
        user_configuration: ko.mapping.toJS(this.user_configuration)
    };
};

function Role(id, name) {
    this.id = ko.observable(parseInt(id));
    this.name = ko.observable(name);
}

/* Custom binding for making user edit modal */
ko.bindingHandlers.bootstrapModal = modal_handler("editModal");

/* Custom binding for making denial modal */
ko.bindingHandlers.bootstrapConfirmModal = modal_handler("bootstrapConfirmModal");

/* Custom binding for making cti/softphone modal */
ko.bindingHandlers.ctiSoftphoneIntegrationModal = modal_handler("ctiSoftphoneIntegrationModal");

function modal_handler(template) {
    return {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var props = valueAccessor(),
                vm = bindingContext.createChildContext(viewModel);
            ko.utils.extend(vm, props);
            vm.close = function() {
                vm.show(false);
                vm.onClose();
            };
            vm.action = function() {
                vm.onAction();
            };
            ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
            ko.renderTemplate(template, vm, null, element);
            var showHide = ko.computed(function() {
                $(element).modal(vm.show() ? 'show' : 'hide');
            });
            return {
                controlsDescendantBindings: true
            };
        }
    };
}


// Activates knockout.js
ko.applyBindings(manage_team_view_model);
//# sourceMappingURL=manage-users.js.map
