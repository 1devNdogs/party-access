Template.user_manager_invitados.onRendered(function() {
  Session.set('searchAllUsersInvitados', '')
  Session.set('limitSerchAllUsersInvitados', 20);
});

Template.user_manager_invitados.onCreated(function() {
  Session.setDefault('searchAllUsersInvitados', '')
  Session.setDefault('limitSerchAllUsersInvitados', 20);
  var self = this;
  self.autorun(function() {
    var limit = Session.get('limitSerchAllUsersInvitados');
    var filter = Session.get('searchAllUsersInvitados');
    var entradasSort = Session.get('entradasSort');
    subs.subscribe("usersAppInvitados", filter, limit, entradasSort);
  });
});

Template.user_manager_invitados.events = {
  'click #entradasSort': function() {
    Session.set('entradasSort', (Session.get('entradasSort') || 1) * (-1))
  },
  'keyup #search': function(e, t) {
    e.preventDefault();
    Session.set('searchAllUsersInvitados', e.target.value)
  },
  'click #loadMoreInvitados': function() {
    Session.set('limitSerchAllUsersInvitados', Session.get("limitSerchAllUsersInvitados") + 20);
  },
  'click #btnRemove': function(e, t) {
    e.preventDefault();
    var userId = this._id;
    swal({
      title: "Banear Invitado",
      text: 'Baneara al Invitado, si es invitado en otro evento no podra ingresar',
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
          toastr.success("Success Ban Invitado");
          FlowRouter.go('user_manager_invitados');
        }
      });;
    });
  }
};

Template.user_manager_invitados.helpers({
  users: function() {
    var limit = Session.get('limitSerchAllUsersInvitados');
    var filter = new RegExp(Session.get('searchAllUsersInvitados'), 'i');

    return Meteor.users.find({
      'profile.name': filter,
      'profile.userType': 'invitado',
      'profile.active': true
    }, {
      sort: {
        'profile.totalEntradas': Session.get('entradasSort') || 1
      },
      limit: limit
    });
  }
});
