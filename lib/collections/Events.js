Events = new Mongo.Collection("events");

var schemas = new SimpleSchema({
  name: {
    type: String,
    optional: false
  },
  maximoInvitados: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  totalHombres: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  totalMujeres: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  totalInvitados: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  entradas: {
    type: [Object],
    defaultValue: [],
    blackbox: true
  },
  'entradas.$._id': {
    type: String,
    optional: true
  },
  'entradas.$.invitacionId': {
    type: String,
    optional: true
  },
  'entradas.$.name': {
    type: String,
    optional: true
  },
  'entradas.$.rut': {
    type: String,
    optional: true
  },
  'entradas.$.date': {
    type: Date,
    label: 'Fecha',
  },
  'entradas.$.sexo': {
    type: String,
    label: 'Fecha',
  },
  'entradas.$.rrppUserId': {
    type: String,
    label: 'rrppUserId',
  },
  locationId: {
    type: String,
    label: 'Location',
  },
  eventDate: {
    type: Date,
    label: 'Fecha',
    optional: false
  },
  hora: {
    type: String,
    label: 'hora',
  },
  eventCloseDate: {
    type: Date,
    label: 'Fecha Ciere',
  },
  horaCierre: {
    type: String,
    label: 'Cierre',
  },
  eventDateInv: {
    type: Date,
    label: 'Fecha Invitados',
    optional: false
  },
  horaInv: {
    type: String,
    label: 'hora invitados',
  },
  eventCloseDateInv: {
    type: Date,
    label: 'Fecha Ciere Invitados',
  },
  horaCierreInv: {
    type: String,
    label: 'Cierre',
  },
  creatorId: {
    type: String,
    label: 'Creador',
  },
  tipoEventoId: {
    type: String,
    label: 'Tipo Evento',
  },
  estado: {
    type: String,
    label: 'Abierto Cerrado Cancelado',
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

Events.attachSchema(schemas);

/* register helper for default relations */
Events.helpers({
  location: function() {
    return Locations.findOne(this.locationId);
  },
  user: function() {
    return Meteor.users.find(this.creatorId);

  },
  tipoEvento: function() {
    return TipoEvento.findOne(this.tipoEventoId);
  },

  createdUser: function() {
    return Meteor.users.findOne(this.createdUserId);
  },
  updatedUser: function() {
    return Meteor.users.findOne(this.updatedUserId);
  },
});
