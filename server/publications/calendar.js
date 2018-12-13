Meteor.publish('eventsCalendar', function(start, end, localId) {
  console.log("subscribing some eventsCalendar");
  check(start, Date);
  check(end, Date);
  check(localId, String);
  try {
    return Events.find({
      locationId: localId,
      eventDate: {
        $gte: start,
        $lt: end
      }
    });
  } catch (ex) {
    logError(ex)
  }

});
Meteor.publishComposite('invitadosEvento', function(eventId, isBanned) {
  console.log("subscribing some InvitadosEvento");
  check(eventId, String);
  check(isBanned, Number);
  try {
    return {
      find: function() {
        return InvitadosEvento.find({
          eventId: eventId,
          isBanned: isBanned
        });
      },
      children: [{
        find: function(ie) {
          return Meteor.users.find(ie.userId, {
            limit: 1
          });
        },
      },{
        find: function(ie) {
          return SubEventos.find(ie.subEventoId, {
            limit: 1
          });
        },
      }],
    }
  } catch (ex) {
    logError(ex)
  }
});
