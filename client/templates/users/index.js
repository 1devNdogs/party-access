Template.user_manager.onRendered(function() {
  Session.set('searchAllUsers', '')
  Session.set('limitSerchAllUsers', 20);
});

Template.user_manager.onCreated(function() {
  Session.setDefault('searchAllUsers', '')
  Session.setDefault('limitSerchAllUsers', 20);
  var self = this;
  self.autorun(function() {
    var limit = Session.get('limitSerchAllUsers');
    var filter = Session.get('searchAllUsers');
    subs.subscribe("usersApp", filter, limit);
  });
});

Template.user_manager.events = {
  'keyup #search': function(e, t) {
    e.preventDefault();
    Session.set('searchAllUsers', e.target.value)
  },
  'click #loadMoreUsers': function() {
    Session.set('limitSerchAllUsers', Session.get("limitSerchAllUsers") + 20);
  },
  'click #btnRemove': function(e, t) {
    e.preventDefault();
    var userId = this._id;
    swal({
      title: "Eliminar Usuario",
      text: 'Eliminara al usuario, pero no su registro en el sistema',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Confirmar",
      closeOnConfirm: true
    }, function() {
      Meteor.call('Users.remove', userId, function(err, res) {
        if (err) {
          toastr.error(err.details);
        } else {
          toastr.success("Success Inserting Events");
          FlowRouter.go('user_manager');
        }
      });;
    });
  }
};

Template.user_manager.helpers({
  users: function() {
    var limit = Session.get('limitSerchAllUsers');
    var filter = new RegExp(Session.get('searchAllUsers'), 'i');

    return Meteor.users.find({
      'profile.name': filter,
      'profile.userType': {
        $ne: 'invitado',
      },
      'profile.active': true
    }, {
      limit: limit
    });
  }
});
