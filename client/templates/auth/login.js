Template.login.events = {
    'click #btnLogin': function(e, t) {
        e.preventDefault()
        var emailOrUsername = t.find('#emailOrUsername').value;
        var password = t.find('#password').value;

        Meteor.loginWithPassword(emailOrUsername, password, function(err) {
            if (err) {
                toastr.error('Error...', err.message);
            } else {
                toastr.success('Login Exitoso', 'Bienvenido');
                FlowRouter.go('eventsCalendar')
            }
        });
    }
}
Template.login.onRendered(function() {
    var self = this;
    self.autorun(function() {
        if (!!Meteor.user() || FlowRouter.current().path === 'login') {
            FlowRouter.go('eventsCalendar')
        }
    });
});
