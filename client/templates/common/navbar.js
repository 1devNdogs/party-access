Template.navbar.events({
    'click #logout': function(e) {
        e.preventDefault();
        Meteor.logout(function() {
            FlowRouter.go('login')
        });
    },
});
Template.navbar.helpers({
    locales: function() {
        return Locations.find()
    }
});
Template.navbar.onCreated(function() {
    var self = this;
    self.autorun(function() {
        subs.subscribe('allInvitados');
        subs.subscribe('allInvitadosHH');
        subs.subscribe('allInvitadosMM');
    })

});
