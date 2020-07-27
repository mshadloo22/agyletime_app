function Task() {
    this.id = ko.observable("");
    this.name = ko.observable("");
    this.description = ko.observable("");
    this.identifier = ko.observable("");
    this.color = ko.observable("");
    this.available = ko.observable(false);
    this.paid = ko.observable(false);
    this.planned = ko.observable(false);
    this.timeout = ko.observable(false);
    this.leave = ko.observable(false);
    this.break = ko.observable(false);
    this.saved = ko.observable(true);
    this.loaded = false;

    this.isBreak = ko.computed({
        read: function(){
            return this.break();
        },
        write: function(data) {
            this.break(data);
        },
        owner: this
    })
}

Task.prototype.addTask = function(task) {
    this.id(task.id);
    this.name(task.name);
    this.description(task.description);
    this.identifier(task.identifier);
    this.color(task.color);
    this.available(task.available);
    this.paid(task.paid);
    this.planned(task.planned);
    this.leave(task.leave);
    this.break(task.break);
    this.timeout(task.timeout);
    return this;
};

Task.prototype.setTimeout = function(parent) {
    //This.loaded hax to get around KO executing everything on first load. No1 Solution NA
    if(this.loaded == true) {
        ko.utils.arrayForEach(parent.tasks(), function (child) {
            child.timeout(false);
        });
        this.timeout(true);
    }else{
        this.loaded = true;
    }
};

Task.prototype.radioTimeoutSelected = function(){
    if(this.timeout){
        return this.identifier;
    }else{
        return "";
    }
};