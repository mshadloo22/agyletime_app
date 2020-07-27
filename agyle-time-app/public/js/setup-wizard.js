(function(b,c){var a=function(f,e){var d;this.$element=b(f);this.options=b.extend({},b.fn.wizard.defaults,e);this.currentStep=1;this.numSteps=this.$element.find("li").length;this.$prevBtn=this.$element.find("button.btn-prev");this.$nextBtn=this.$element.find("button.btn-next");d=this.$nextBtn.children().detach();this.nextText=b.trim(this.$nextBtn.text());this.$nextBtn.append(d);this.$prevBtn.on("click",b.proxy(this.previous,this));this.$nextBtn.on("click",b.proxy(this.next,this));this.$element.on("click","li.complete",b.proxy(this.stepclicked,this))};a.prototype={constructor:a,setState:function(){var n=(this.currentStep>1);var o=(this.currentStep===1);var d=(this.currentStep===this.numSteps);this.$prevBtn.attr("disabled",(o===true||n===false));var h=this.$nextBtn.data();if(h&&h.last){this.lastText=h.last;if(typeof this.lastText!=="undefined"){var l=(d!==true)?this.nextText:this.lastText;var f=this.$nextBtn.children().detach();this.$nextBtn.text(l).append(f)}}var j=this.$element.find("li");j.removeClass("active").removeClass("complete");j.find("span.badge").removeClass("badge-info").removeClass("badge-success");var m="li:lt("+(this.currentStep-1)+")";var g=this.$element.find(m);g.addClass("complete");g.find("span.badge").addClass("badge-success");var e="li:eq("+(this.currentStep-1)+")";var k=this.$element.find(e);k.addClass("active");k.find("span.badge").addClass("badge-info");var i=k.data().target;b(".step-pane").removeClass("active");b(i).addClass("active");this.$element.trigger("changed")},stepclicked:function(h){var d=b(h.currentTarget);var g=b(".steps li").index(d);var f=b.Event("stepclick");this.$element.trigger(f,{step:g+1});if(f.isDefaultPrevented()){return}this.currentStep=(g+1);this.setState()},previous:function(){var d=(this.currentStep>1);if(d){var f=b.Event("change");this.$element.trigger(f,{step:this.currentStep,direction:"previous"});if(f.isDefaultPrevented()){return}this.currentStep-=1;this.setState()}},next:function(){var g=(this.currentStep+1<=this.numSteps);var d=(this.currentStep===this.numSteps);if(g){var f=b.Event("change");this.$element.trigger(f,{step:this.currentStep,direction:"next"});if(f.isDefaultPrevented()){return}this.currentStep+=1;this.setState()}else{if(d){this.$element.trigger("finished")}}},selectedItem:function(d){return{step:this.currentStep}}};b.fn.wizard=function(e,g){var f;var d=this.each(function(){var j=b(this);var i=j.data("wizard");var h=typeof e==="object"&&e;if(!i){j.data("wizard",(i=new a(this,h)))}if(typeof e==="string"){f=i[e](g)}});return(f===c)?d:f};b.fn.wizard.defaults={};b.fn.wizard.Constructor=a;b(function(){b("body").on("mousedown.wizard.data-api",".wizard",function(){var d=b(this);if(d.data("wizard")){return}d.wizard(d.data())})})})(window.jQuery);
function SetupWizardViewModel() {
    var self = this;

    self.opening_hours = ko.observableArray([new OpeningHours(0), new OpeningHours(1), new OpeningHours(2), new OpeningHours(3), new OpeningHours(4), new OpeningHours(5), new OpeningHours(6)]);

    self.admin = ko.observable();

    self.teams = ko.observableArray([]);

    self.organisation = ko.observable();

    self.selected_team = ko.observable();

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function(){}
    };

    self.create_team_modal = {
        name: ko.observable(),
        description: ko.observable(),
        show: ko.observable(false),
        onClose: function() {

        },
        onAction: function() {
            var team = new Team({name: self.create_team_modal.name(), description: self.create_team_modal.description(), id: ""});
            var jsonData = team.toJSON();

            $.post(
                "team/team",
                {data: jsonData},
                function(returnedData) {
                    if(returnedData.result == 0) {
                        if(returnedData.data.team_id != 'undefined') {
                            team.id = returnedData.data.team_id;
                        }
                        self.teams.push(team);
                    } else {
                        self.showErrorModal(returnedData.result, returnedData.message);
                    }
                    self.create_team_modal.show(false);
                    self.create_team_modal.name("");
                    self.create_team_modal.description("");
                }
            );
        }
    };

    self.edit_user_modal = {
        header: "Edit Team Member",
        first_name: ko.observable(),
        last_name: ko.observable(),
        phone_one: ko.observable(),
        phone_two: ko.observable(),
        email: ko.observable(),
        gender: ko.observable(),
        address: ko.observable(),
        post_code: ko.observable(),
        city: ko.observable(),
        pay_rate: ko.observable(),
        closeLabel: "Cancel",
        primaryLabel: "Save",
        show: ko.observable(false),

        onClose: function() {

        },
        onAction: function() {
            self.edit_user_modal.user().first_name(self.edit_user_modal.first_name());
            self.edit_user_modal.user().last_name(self.edit_user_modal.last_name());
            self.edit_user_modal.user().phone_one(self.edit_user_modal.phone_one());
            self.edit_user_modal.user().phone_two(self.edit_user_modal.phone_two());
            self.edit_user_modal.user().email(self.edit_user_modal.email());
            self.edit_user_modal.user().gender(self.edit_user_modal.gender());
            self.edit_user_modal.user().address(self.edit_user_modal.address());
            self.edit_user_modal.user().post_code(self.edit_user_modal.post_code());
            self.edit_user_modal.user().city(self.edit_user_modal.city());
            self.edit_user_modal.user().pay_rate(self.edit_user_modal.pay_rate());
            if( self.edit_user_modal.first_name() === "" ||
                self.edit_user_modal.last_name() === "" ||
                self.edit_user_modal.email() === "" ){
                alert("Error: You have not completed all of the required fields");
            } else {
                self.edit_user_modal.show(false);
                self.edit_user_modal.post_function();
            }
        }
    };

    self.addTeamLeader = function(team) {
        self.addMember(team, team.team_leader);
        self.edit_user_modal.post_function = function() {
            var jsonData = ko.toJSON(self.edit_user_modal.user);
            $.post(
                "user/user",
                {data: jsonData},
                function(returnedData) {
                    if(returnedData.result == 0) {
                        self.edit_user_modal.team.team_leader().user_id(returnedData.data.id);
                        console.log(self.edit_user_modal.team.team_leader().user_id());
                        var team_json = self.edit_user_modal.team.toJSON();
                        $.post(
                            "team/team",
                            { data: team_json },
                            function(returnedData) {
                                if(returnedData.result == 0) {
                                }
                            }
                        )
                    }
                }
            )
        }
    };

    self.addManager = function(team) {
        self.addMember(team, team.manager);
        self.edit_user_modal.post_function = function() {
            var jsonData = ko.toJSON(self.edit_user_modal.user);
            $.post(
                "user/user",
                {data: jsonData},
                function(returnedData) {
                    if(returnedData.result == 0) {
                        self.edit_user_modal.team.manager().user_id(returnedData.data.id);
                        var team_json = self.edit_user_modal.team.toJSON();
                        $.post(
                            "team/team",
                            { data: team_json },
                            function(returnedData) {
                                if(returnedData.result == 0) {

                                }
                            }
                        )
                    }
                }
            )
        }
    };

    self.addTeamMember = function(team) {
        var new_employee = ko.observable(new Employee);
        console.log(new_employee);
        self.addMember(team, new_employee);
        self.edit_user_modal.post_function = function() {
            console.log(self.edit_user_modal.team);
            self.edit_user_modal.user().team_id(self.edit_user_modal.team.id());
            var jsonData = ko.toJSON(self.edit_user_modal.user);
            $.post(
                "user/user",
                {data: jsonData},
                function(returnedData) {
                    if(returnedData.result == 0)
                    {
                        self.edit_user_modal.user().user_id(returnedData.data.id);
                        self.edit_user_modal.team.team_members.push(self.edit_user_modal.user);
                        self.edit_user_modal.team.team_members.notifySubscribers();
                    }
                }
            )
        }
    };

    self.addMember = function(team, employee) {
        self.edit_user_modal.user = employee;
        self.edit_user_modal.team = team;
        self.edit_user_modal.first_name("");
        self.edit_user_modal.last_name("");
        self.edit_user_modal.phone_one("");
        self.edit_user_modal.phone_two("");
        self.edit_user_modal.email("");
        self.edit_user_modal.gender("");
        self.edit_user_modal.address("");
        self.edit_user_modal.post_code("");
        self.edit_user_modal.city("");
        self.edit_user_modal.pay_rate("");
        self.edit_user_modal.show(true);
    };

    self.editTeamMember = function(employee) {
        self.edit_user_modal.user = ko.observable(employee);
        self.edit_user_modal.first_name(employee.first_name());
        self.edit_user_modal.last_name(employee.last_name());
        self.edit_user_modal.phone_one(employee.phone_one());
        self.edit_user_modal.phone_two(employee.phone_two());
        self.edit_user_modal.email(employee.email());
        self.edit_user_modal.gender(employee.gender());
        self.edit_user_modal.address(employee.address());
        self.edit_user_modal.post_code(employee.post_code());
        self.edit_user_modal.city(employee.city());
        self.edit_user_modal.pay_rate(employee.pay_rate());

        self.edit_user_modal.post_function = function() {
            var jsonData = ko.toJSON(self.edit_user_modal.user);
            $.post(
                "user/user",
                {data: jsonData},
                function(returnedData) {}
            )
        };
        self.edit_user_modal.show(true);

    };

    self.hours_is_saved = function (bool) {
        self.hours_saved(bool);
    }.bind(self);

    self.company_info_saved = function (bool) {
        self.company_saved(bool);
    }.bind(self);

    self.admin_info_saved = function (bool) {
        self.admin_saved(bool);
    }.bind(self);

    self.hours_saved = ko.observable(true);
    self.company_saved = ko.observable(true);
    self.admin_saved = ko.observable(true);

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

    self.showCreateTeamModal = function() {
        self.create_team_modal.show(true);
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

    self.getOrganisationProfile = function() {
        $.getJSON("organisation/organisation-profile", [], function(allData) {
            if(allData['result'] == 0) {
                self.organisation(new Organisation(allData['data']));
                self.company_info_saved(true);
            }
        })
    };

    self.getAdminProfile = function() {
        $.getJSON("user/user", [], function(allData) {
            if(allData['result'] == 0) {
                var employee = new Employee();
                employee.addEmployee(allData['data']);
                self.admin(employee);
                self.admin_info_saved(true);

            }
        })
    };

    self.getTeams = function() {
        $.getJSON("team/all-teams", [], function(allData) {
            if(allData['result'] == 0) {
                var mappedTeams = $.map(allData['data'], function(val, key) { return new Team(val)});
                self.teams(mappedTeams);
            }

            if(self.teams().length > 0) {
                self.selected_team(self.teams()[0]);
            }
        });
    };

    self.saveOrganisationProfile = function() {
        var jsonData = ko.toJSON(self.organisation);
        $.post(
            "organisation/organisation-profile",
            {data: jsonData},
            function(returnedData) {
                if(returnedData.result == 0) {
                    self.company_info_saved(true);
                }
            });
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
            });
    };

    self.saveAdminProfile = function() {
        var jsonData = ko.toJSON(self.admin);
        $.post(
            "user/user",
            {data: jsonData},
            function(returnedData) {
                if(returnedData.result == 0) {
                    self.admin_info_saved(true);
                }
            });
    };

    self.deleteTeam = function(team) {
        var jsonData = team.toJSON();

        $.post(
            "team/delete-team",
            {data: jsonData},
            function(returnedData) {
                if(returnedData.result == 0) {
                    self.teams.remove(team);
                } else {
                    self.showErrorModal(returnedData.result, returnedData.message);
                }
            }
        )
    };

    self.completeWizard = function() {
        self.saveAdminProfile();
        self.saveOrganisationProfile();

        window.location.href = "/complete_setup_wizard";
    };

    self.selectTeam = function(data) {
        self.selected_team(data);
    }.bind(self);

    self.getOrganisationProfile();
    self.getAdminProfile();
    self.getTeams();
}

function Organisation(organisation) {
    this.id = ko.observable(organisation.id);
    this.name = ko.observable(organisation.name);
    this.email = ko.observable(organisation.email);
    this.phone = ko.observable(organisation.phone);
    this.address = ko.observable(organisation.address);
    this.post_code = ko.observable(organisation.post_code);
    if(organisation.city !== undefined && organisation.city !== null) {
        this.city = ko.observable(organisation.city.city_name);
        this.country = ko.observable(organisation.city.country );
    } else {
        this.city = ko.observable("");
        this.country = ko.observable("");
    }
    this.timezone = 'Australia/Melbourne';
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
    this.phone_one = ko.observable("");
    this.phone_two = ko.observable("");
    this.address = ko.observable("");
    this.post_code = ko.observable("");
    this.city = ko.observable("");
    this.pay_rate = ko.observable("");
    this.team_id = ko.observable("");
}

Employee.prototype.toJSON = function() {
    return { user_id: this.user_id, first_name: this.first_name, last_name: this.last_name, email: this.email,
        phone_one: this.phone_one, phone_two: this.phone_two, address: this.address, post_code: this.post_code,
        gender: this.gender, city: this.city, pay_rate: this.pay_rate, team_id: this.team_id, active: this.active };
};

Employee.prototype.addEmployee = function(user) {
    this.user_id = ko.observable(user.id);
    this.first_name = ko.observable(user.first_name);
    this.last_name = ko.observable(user.last_name);

    this.full_name = ko.computed(
        function() {
            return this.first_name() + " " + this.last_name();
        },
        this
    );
    this.active = ko.observable(user.active);
    this.email = ko.observable(user.email);
    this.gender = ko.observable(user.gender);
    this.phone_one = ko.observable(user.phone_one);
    this.phone_two = ko.observable(user.phone_two);
    this.address = ko.observable(user.address);
    this.post_code = ko.observable(user.post_code);
    if(user.city !== undefined && user.city !== null) {
        this.city = ko.observable(user.city.city_name);
    }
    if(user.payrate.length != 0){
        this.pay_rate = ko.observable(Math.round(user.payrate[0].pay_rate*100)/100);
    }
    this.team_id = ko.observable(user.team_id);

};

function OpeningHours(weekday) {
    this.open_time = ko.observable("");
    this.close_time = ko.observable("");
    this.weekday = ko.observable(moment(weekday+1, "E").format("dddd"));

    this.error_status = ko.observable();

    this.formatted_open_time = ko.computed({
        read: function () {
            if(this.open_time() == "" || this.open_time() == undefined) {
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
                } else if (new_open_time.isAfter(close_time) && parent.close_time() != "") {
                    parent.open_time.notifySubscribers();
                    alert("Shift start is after shift ending");
                } else {
                    parent.open_time(new_open_time.format('H:mm'));
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.formatted_close_time = ko.computed({
        read: function () {
            if(this.close_time() == "" || this.close_time() == undefined) {
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
                } else if (open_time.isAfter(new_close_time) && parent.open_time() != "") {
                    parent.close_time.notifySubscribers();
                    alert("Shift start is after shift ending");
                } else {
                    parent.close_time(new_close_time.format('H:mm'));
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });
}

OpeningHours.prototype.toJSON = function() {
    return { open_time: this.open_time, close_time: this.close_time, weekday: this.weekday };
};

function Team(team) {
    this.id = ko.observable(team.id);
    this.name = ko.observable(team.name);
    this.description = ko.observable(team.description);

    this.team_leader = ko.observable(new Employee);
    if(typeof team.user_related_by_team_leader_id != 'undefined' && team.user_related_by_team_leader_id != null)
        this.team_leader().addEmployee(team.user_related_by_team_leader_id);

    this.manager = ko.observable(new Employee);
    if(typeof team.user_related_by_manager_id != 'undefined' && team.user_related_by_manager_id != null)
        this.manager().addEmployee(team.user_related_by_manager_id);

    this.team_members = ko.observableArray([]);

    var parent = this;
    if(team.user !== undefined) {
        $.each(team.user, function(key, val) {
            if(typeof val !== 'undefined') {
                var employee = new Employee;
                employee.addEmployee(val)
                parent.team_members.push(employee);
            }
        });
    }
}

Team.prototype.toJSON = function () {
    return {id: this.id, name: this.name, description: this.description, team_leader_id: this.team_leader().user_id(),
        manager_id: this.manager().user_id(), team_members: this.team_members};
}

/* Custom binding for making create team modal */
ko.bindingHandlers.createTeamModal = {
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
        ko.renderTemplate("createTeamModal", vm, null, element);
        var showHide = ko.computed(function() {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
};

/* Custom binding for making add user modal */
ko.bindingHandlers.bootstrapModal = {
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
        ko.renderTemplate("editUserModal", vm, null, element);
        var showHide = ko.computed(function() {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
};

ko.applyBindings(new SetupWizardViewModel());
//# sourceMappingURL=setup-wizard.js.map
