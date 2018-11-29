/**
 * This Code was created on April 2014
 * If you find any bug, unreadable code, messy code, potential bug code, etc
 * Please contact me at:
 * Ega Radiegtya / radiegtya@yahoo.co.id / 085641278479
 */

TipoEvento = new Mongo.Collection("tipoEvento");

var schemas = new SimpleSchema({
  name: {
    type: String,
    label: 'Tipo de evento',
  },


  createdAt: {
    type: Date,
    label: "Created Date",
    autoValue: function() {
      if (this.isInsert)
        return new Date;
    },
    denyUpdate: true,
    optional: true
  },
  updatedAt: {
    type: Date,
    label: "Updated Date",
    autoValue: function() {
      return new Date();
    },
    optional: true
  },
  createdUserId: {
    type: String,
    label: "Created by",
    autoValue: function() {
      if (this.isInsert && !this.value)
        return this.userId;
    },
    denyUpdate: true,
    optional: true
  },
  updatedUserId: {
    type: String,
    label: "Updated by",
    autoValue: function() {
      if (!this.value)
        return this.userId;
    },
    optional: true
  },
});

TipoEvento.attachSchema(schemas);

TipoEvento.allow({
  insert: function(userId, doc) {
    var result = Meteor.call('MugenRoleActions.getRoles', 'tipoEvento', 'insert');
    return result;
  },
  update: function(userId, doc) {
    var result = Meteor.call('MugenRoleActions.getRoles', 'tipoEvento', 'update');
    return result;
  },
  remove: function(userId, doc) {
    var result = Meteor.call('MugenRoleActions.getRoles', 'tipoEvento', 'remove');
    return result;
  },
});

//activate groundDB for tipoEvento collection to work offline
/* uncomment to use
 Ground.Collection(TipoEvento);
 */

/* register helper for default relations */
TipoEvento.helpers({

  createdUser: function() {
    return Meteor.users.findOne(this.createdUserId);
  },
  updatedUser: function() {
    return Meteor.users.findOne(this.updatedUserId);
  },
});
