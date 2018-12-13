Template.eventMenu.events({
  'click #infoBtn': function(e, t) {
    Session.set('isBanned',0);
    var eventId = FlowRouter.current().params.eventId;
    FlowRouter.go('eventsUpdate', {
      eventId: eventId
    })
  },
  'click #invitadosBtn': function(e, t) {
    Session.set('isBanned',0);
    console.log("asdasd")
    var eventId = FlowRouter.current().params.eventId;
    FlowRouter.go('invitadosEvents', {
      eventId: eventId
    })
  },
  'click #subEventosBtn': function(e, t) {
    var eventId = FlowRouter.current().params.eventId;
    FlowRouter.go('subEvents', {
      eventId: eventId
    })
  },
  'click #statsBtn': function(e, t) {
    var eventId = FlowRouter.current().params.eventId;
    FlowRouter.go('reportsEventsStats', {
      eventId: eventId
    })
  }
});
