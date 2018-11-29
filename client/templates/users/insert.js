Template.insertUser.events = {
  'click #btnSave': function(e, t) {
    e.preventDefault();
    var doc = _getDocinsertUser(t);
    if (doc) {
      swal({
        title: "Crear",
        text: 'Nuevo Usuario',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Confirmar",
        closeOnConfirm: true
      }, function() {
        console.log(doc);

        Meteor.call('Users.insert', doc, function(err, res) {
          if (err) {
            toastr.error(err.message);
          } else {
            toastr.success("Success Inserting User");
            FlowRouter.go('user_manager');
          }
        });
      });
    }
  }
}
var _getDocinsertUser = function(t) {
  if (t.find('#password').value != t.find('#passwordR').value) {
    toastr.error('contraseñas no coinciden');
    return null;
  } else {
    var doc = {
      email: t.find('#email').value,
      password: t.find('#password').value,
      profile: {
        name: t.find('#name').value,
        createdAt: new Date(TimeSync.serverTime()),
        updatedAt: new Date(TimeSync.serverTime()),
        userType: t.find('#userType').value,
        active: true,
        totalInvitados: 0
      }
    };
    return doc;
  }
}
