isLoggedIn = function() {
  return false
}
UI.registerHelper('getTotalInvitados', function(userId) {
  var count = InvitadosEvento.find({
    createdUserId: userId
  }).count();
  return count
});
UI.registerHelper('getTotalInvitadosHH', function(userId) {
  var count = InvitadosEvento.find({
    createdUserId: userId,
    sexo: '1'
  }).count();
  return count
});
UI.registerHelper('getTotalInvitadosMM', function(userId) {
  var count = InvitadosEvento.find({
    createdUserId: userId,
    sexo: '0'
  }).count();
  return count
});
UI.registerHelper('getTotalAsistents', function(userId) {
  var count = InvitadosEvento.find({
    reatedUserId: userId,
    estadoAsistencia: 2
  }).count();
  return count
});
UI.registerHelper('getTotalAsistentsHH', function(userId) {
  var count = InvitadosEvento.find({
    createdUserId: userId,
    sexo: '1',
    estadoAsistencia: 2
  }).count();
  return count
});
UI.registerHelper('getTotalAsistentsMM', function(userId) {
  var count = InvitadosEvento.find({
    createdUserId: userId,
    sexo: '0',
    estadoAsistencia: 2
  }).count();
  return count
});
UI.registerHelper('getEstadoColor', function(estado) {
  if (estado == 'Abierto')
    return "green";
  if (estado == 'Cerrado')
    return "red";
});
UI.registerHelper('eventInEdit', function() {
  var eventId = FlowRouter.current().params.eventId
  var event = Events.findOne(eventId);
  return event;
});
UI.registerHelper('fromNowInput', function(date) {
  try {
    return moment(date).format('L')
  } catch (e) {}
});
UI.registerHelper('condition', function(v1, operator, v2, options) {
  var types = {
    '==': function() {
      return (v1 == v2);
    },
    '===': function() {
      return (v1 === v2);
    },
    '<': function() {
      return (v1 < v2);
    },
    '<=': function() {
      return (v1 <= v2);
    },
    '>': function() {
      return (v1 > v2);
    },
    '>=': function() {
      return (v1 >= v2);
    },
    '&&': function() {
      return (v1 && v2);
    },
    '||': function() {
      return (v1 || v2);
    },
    'regex': function() {
      return (RegExp(v2, 'i').test(v1));
    },
  };

  if (types[operator]) {
    return types[operator]();
  } else {
    console.error('Operator: ' + operator + ' not defined!');
    return false;
  }
});
UI.registerHelper('getEventoClosed', function() {
  var evento = Events.findOne(Session.get('eventoEnEdicionId'))
  if (evento != null && evento.estado == 'Cerrado') {
    return true
  } else {
    return false
  }
});
UI.registerHelper('getPermissionEvent', function() {
  var evento = Events.findOne(Session.get('eventoEnEdicionId'))
  if (evento != null && evento.estado == 'Abierto') {
    if (Meteor.user().profile.userType == 'admin') {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
});
UI.registerHelper('onlyAdmin', function() {
  if (Meteor.user()) {
    if (Meteor.user().profile.userType == 'admin')
      return true
    else
      return false
  } else return false
});
