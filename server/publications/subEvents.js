Meteor.publishComposite('subEventos', function(eventId) {
  console.log("subscribing some SubEventos");
  return {
    find: function() {
      return SubEventos.find({
        eventId: eventId,
        active: true
      });
    },
    children: [


    ],
  }
});
