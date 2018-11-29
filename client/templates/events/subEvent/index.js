Template.subEvents.helpers({
  subEventos: function() {
    var eventId = FlowRouter.current().params.eventId;
    var subEvents = SubEventos.find({
      eventId: eventId
    });
    return subEvents
  }
});
Template.subEvents.onRendered(function() {
  var eventId = FlowRouter.current().params.eventId;
  var self = this;
  self.autorun(function() {
    subs.subscribe("subEventos", eventId);
  });
});
Template.subEvents.events = {
  'click #newSubEventBtn': function(e) {
    e.preventDefault();
    var eventId = FlowRouter.current().params.eventId;
    FlowRouter.go('subEventosInsert', {
      eventId: eventId
    })
  },
  'click #btnRemove': function(e) {
    e.preventDefault();
    var subEventId = this._id
    swal({
      title: "Eliminar Sub Evento",
      text: ' ',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Confirmar",
      closeOnConfirm: true
    }, function() {
      Meteor.call('removeSubEvent', subEventId, function(e, r) {
        if (e) {
          toastr.error(e.message);
        } else {
          toastr.success("Success Removing Sub Event");
          FlowRouter.go('subEvents', {
            eventId: eventId
          })
        }
      });

    });
  },

  'click #btnThisEvento': function(e) {
    e.preventDefault();
    Router.go('eventsUpdate', {
      _id: Session.get('eventoEnEdicionId')
    });
  },
};
