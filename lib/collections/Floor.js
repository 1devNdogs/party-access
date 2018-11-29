/**
 * This Code was created on April 2014
 * If you find any bug, unreadable code, messy code, potential bug code, etc
 * Please contact me at:
 * Ega Radiegtya / radiegtya@yahoo.co.id / 085641278479
 */

Floor = new Mongo.Collection("floor");

var schemas = new SimpleSchema({
  numero: {
    type: Number,
    label: 'Piso',
  },
  locationId: {
    type: String,
    label: 'Local',
  },
  name: {
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

Floor.attachSchema(schemas);

/* register helper for default relations */
Floor.helpers({
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
