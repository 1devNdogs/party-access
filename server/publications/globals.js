Meteor.publishComposite('tipoEvento', function() {
  console.log("subscribing some TipoEvento");
  return {
    find: function() {
      return TipoEvento.find();
    },
    children: [],
  }
});
Meteor.publishComposite('tipoSubEvento', function() {
  console.log("subscribing some TipoSubEvento");
  return {
    find: function() {
      return TipoSubEvento.find();
    },
    children: [],
  }
});
Meteor.publishComposite('sections', function() {
  console.log("subscribing some Section  ");
  return {
    find: function() {
      return Section.find({
        active: true
      });
    },
    children: [],
  }
});

Meteor.publishComposite('floor', function() {
  console.log("subscribing some Floor");
  return {
    find: function() {
      return Floor.find({
        active: true
      });
    },
    children: [],
  }
});
Meteor.publishComposite('regiones', function() {
  console.log("subscribing some Regiones ");
  return {
    find: function() {
      return Regiones.find();
    },
    children: [],
  }
});
Meteor.publishComposite('ciudades', function() {

  console.log("subscribing some Ciudades");
  return {
    find: function() {
      return Ciudades.find();
    },
    children: [],
  }
});

Meteor.publish('allInvitados', function() {
  Counts.publish(this, 'allInvitados', Meteor.users.find({
    'profile.userType': 'invitado'
  }));
});

Meteor.publish('allInvitadosHH', function() {
  Counts.publish(this, 'allInvitadosHH', Meteor.users.find({
    'profile.sexo': '1',
    'profile.userType': 'invitado',
  }));
});

Meteor.publish('allInvitadosMM', function() {
  Counts.publish(this, 'allInvitadosMM', Meteor.users.find({
    'profile.userType': 'invitado',
    'profile.sexo': '0',

  }));
});
