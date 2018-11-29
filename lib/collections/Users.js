//activate groundDB for users collection to work offline
//GroundDB(Meteor.users);
 
Meteor.users.allow({
  insert: function(userId, doc) {
    var result = Meteor.call('MugenRoleActions.getRoles', 'users', 'insert');
    return result;
  },
  update: function(userId, doc) {
    if (Meteor.user().profile.mugenRoleGroupId === '1') return true
    return false
  },
  remove: function(userId, doc) {
    var result = Meteor.call('MugenRoleActions.getRoles', 'users', 'remove');
    return result;
  },
});
