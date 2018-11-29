/**
 * This Code was created on April 2014
 * If you find any bug, unreadable code, messy code, potential bug code, etc
 * Please contact me at:
 * Ega Radiegtya / radiegtya@yahoo.co.id / 085641278479
 */

Section = new Mongo.Collection("section");

var schemas = new SimpleSchema({
  numero: {
    type: Number,
    label: 'Numero',
  },
  floorId: {
    type: String,
    label: 'Piso',
  },
  locationId: {
    type: String,
    label: 'Local',
  },
  nombre: {
    type: String,
    label: 'Nombre',
  },
  active: {
    type: Boolean,
    label: 'active',
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

Section.attachSchema(schemas);

Section.allow({
  insert: function(userId, doc) {
    var result = Meteor.call('MugenRoleActions.getRoles', 'section', 'insert');
    return result;
  },
  update: function(userId, doc) {
    var result = Meteor.call('MugenRoleActions.getRoles', 'section', 'update');
    return result;
  },
  remove: function(userId, doc) {
    var result = Meteor.call('MugenRoleActions.getRoles', 'section', 'remove');
    return result;
  },
});

//activate groundDB for section collection to work offline
/* uncomment to use
 Ground.Collection(Section);
 */

/* register helper for default relations */
Section.helpers({
  floor: function() {
    return Floor.findOne(this.floorId);
  },
  location: function() {
    return Locations.findOne(this.locationId);
  },

  createdUser: function() {
    return Meteor.users.findOne(this.createdUserId);
  },
  updatedUser: function() {
    return Meteor.users.findOne(this.updatedUserId);
  },
});
