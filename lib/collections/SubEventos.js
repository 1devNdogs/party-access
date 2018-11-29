/**
 * This Code was created on April 2014
 * If you find any bug, unreadable code, messy code, potential bug code, etc
 * Please contact me at:
 * Ega Radiegtya / radiegtya@yahoo.co.id / 085641278479
 */

SubEventos = new Mongo.Collection("subEventos");

var schemas = new SimpleSchema({
  active: {
    type: Boolean,
    defaultValue: true
  },
  eventId: {
    type: String,
    label: 'Evento',
  },
  tipoSubEventoId: {
    type: String,
    label: 'Tipo',
  },
  name: {
    type: String,
    label: 'Nombre',
  },
  comment: {
    type: String,
    label: 'Comentario',
    optional: true,
  },
  reservedBy: {
    type: String,
    label: 'ReservedBy',
  },
  floorId: {
    type: String,
    label: 'Piso',
  },
  sectionId: {
    type: String,
    label: 'Seccion',
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

SubEventos.attachSchema(schemas);


//activate groundDB for subEventos collection to work offline
/* uncomment to use
 Ground.Collection(SubEventos);
 */

/* register helper for default relations */
SubEventos.helpers({
  event: function() {
    return Events.findOne(this.eventId);
  },
  tipoSubEvent: function() {
    return TipoSubEvento.findOne(this.tipoSubEventoId);
  },
  piso: function() {
    return Floor.findOne(this.floorId);
  },
  seccion: function() {
    return Section.findOne(this.sectionId);
  },

  createdUser: function() {
    return Meteor.users.findOne(this.createdUserId);
  },
  updatedUser: function() {
    return Meteor.users.findOne(this.updatedUserId);
  },
});
