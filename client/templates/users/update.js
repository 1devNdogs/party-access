Template.updateUser.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var userId = FlowRouter.current().params.userId;
    subs.subscribe('userInUpdate', userId);
  });
});

Template.updateUser.events = {
  'click #btnSave': function(e, t) {
    e.preventDefault();
    var userId = FlowRouter.current().params.userId;
    var doc = _getDocUpdateUser(t);
    if (doc) {
      swal({
        title: "Update",
        text: 'Update Usuario',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Confirmar",
        closeOnConfirm: true
      }, function() {
        Meteor.call('Users.update', userId, doc, function(err, res) {
          if (err) {
            toastr.error(err.message);
          } else {
            toastr.success("Success Updating User");
            FlowRouter.go('user_manager');
          }
        });
      });
    }
  }
}
Template.updateUser.helpers({
  selected: function(userType, isType) {
    if (userType === isType) return 'selected'
  },
  userInEdit: function() {
    var userId = FlowRouter.current().params.userId;
    return Meteor.users.findOne(userId)
  }
});
var _getDocUpdateUser = function(t) {
  var newPassword = t.find('#password').value;
  var confirmNewPassword = t.find('#passwordR').value;

  var doc = {
    email: t.find('#email').value,
    profile: {
      name: t.find('#name').value,
      userType: t.find('#userType').value
    },
    newPassword: newPassword,
    confirmNewPassword: confirmNewPassword
  };
  console.log(doc);
  return doc;
}
