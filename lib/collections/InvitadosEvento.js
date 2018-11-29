/**
 * This Code was created on April 2014
 * If you find any bug, unreadable code, messy code, potential bug code, etc
 * Please contact me at:
 * Ega Radiegtya / radiegtya@yahoo.co.id / 085641278479
 */

InvitadosEvento = new Mongo.Collection("invitadosEvento");

var schemas = new SimpleSchema({
  eventId: {
    type: String,
    label: 'Evento',
  },
  userId: {
    type: String,
    label: 'User',
  },
  subEventoId: {
    type: String,
    label: 'Sub Evento',
    optional: true,
  },
  nombre: {
    type: String,
    label: 'Nombre',
    optional: true,
  },
  rut: {
    type: String,
    label: 'Rut',
    optional: true,
  },
  sexo: {
    type: String,
    label: 'Sexo',
    optional: true,
  },
  isBanned: {
    type: Number,
    label: 'Baneado',
  },
  fechaIngreso: {
    type: Date,
    label: 'FechaIngreso',
    optional: true,
  },
  estadoAsistencia: {
    type: Number,
    label: 'Estado Asistencia',
    optional: true,
  },
  creatorId: {
    type: String,
    label: 'Creador',
  },
  tipoInvitado: {
    type: String,
    label: 'TipoInvitado',
    optional: true,
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

InvitadosEvento.attachSchema(schemas);


//activate groundDB for invitadosEvento collection to work offline
/* uncomment to use
 Ground.Collection(InvitadosEvento);
 */

/* register helper for default relations */
InvitadosEvento.helpers({
  evento: function() {
    return Events.findOne(this.eventId);
  },
  user: function() {
    return Meteor.users.findOne(this.userId);
  },
  subEvento: function() {
    return SubEventos.findOne(this.subEventoId);
  },
});
