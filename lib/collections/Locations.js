/**
 * This Code was created on April 2014
 * If you find any bug, unreadable code, messy code, potential bug code, etc
 * Please contact me at:
 * Ega Radiegtya / radiegtya@yahoo.co.id / 085641278479
 */

Locations = new Mongo.Collection("locations");

var schemas = new SimpleSchema({
  name: {
    type: String,
    label: 'Nombre',
  },
  rut: {
    type: String,
    label: 'Rut',
    optional: true,
  },
  regionId: {
    type: String,
    label: 'Region',
  },
  ciudadId: {
    type: String,
    label: 'Ciudad',
    optional: true,
  },
  address: {
    type: String,
    label: 'Direccion',
    optional: true,
  },
  active: {
    type: Boolean,
    label: 'active',
    optional: false,
  },
  /* AUTOVALUE */

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

Locations.attachSchema(schemas);

/* register helper for default relations */
Locations.helpers({
  region: function() {
    return Regiones.findOne(this.regionId);
  },
  ciudad: function() {
    return Ciudades.findOne(this.ciudadId);
  },
});
