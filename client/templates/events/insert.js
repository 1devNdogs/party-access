Template.insertEvent.onRendered(function() {
  this.$('#eventDate').datepicker();
  this.$('#eventCloseDate').datepicker();
  this.$('#eventCloseDateInv').datepicker();
  this.$('#eventDateInv').datepicker();
  this.$('#eventDateInv').datepicker();
  this.$('#eventDateInv').datepicker();
  this.$('#tipoEventoId').dropdown();
});
Template.insertEvent.helpers({
  tipoEvento: function() {
    return TipoEvento.find({});
  },
  getDateNow: function(id) {
    return Session.get('newEventDate');
  },
  getDateNow2: function(id) {
    var tomorrow = Session.get('newEventDate');
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  },
});
Template.insertEvent.events({
  'change #eventDate': function(e, t) {
    var tomorrow = new Date($('#eventDate').val());
    tomorrow.setDate(tomorrow.getDate() + 1);
    $('#eventCloseDate').datepicker('setDate', tomorrow);
  },
  'click #btnSave': function(e, t) {
    e.preventDefault();
    var doc = _getInsertEventDoc(t);

    swal({
      title: "Crear Evento",
      text: doc.name + " " + moment(doc.eventDate).fromNow(),
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Confirmar",
      closeOnConfirm: true
    }, function() {
      Meteor.call('insertEvent', doc, function(err, res) {
        if (err) {
          toastr.error(err.message);
        } else {
          toastr.success("Success Inserting Events");
          FlowRouter.go('eventsCalendar');
        }
      });;
    });


  },
});

_getInsertEventDoc = function(t) {
  return {
    name: t.find('#name').value,
    locationId: Session.get('selectedLocationId'),
    eventDate: new Date(t.find('#eventDate').value +" " +t.find('#hora').value),
    hora: t.find('#hora').value,
    eventCloseDate: t.find('#eventCloseDate').value ? new Date(t.find('#eventCloseDate').value) : null,
    horaCierre: t.find('#horaCierre').value,

    eventDateInv: new Date(t.find('#eventDateInv').value +" " +t.find('#horaInv').value),
    horaInv: t.find('#horaInv').value,
    eventCloseDateInv: t.find('#eventCloseDateInv').value ? new Date(t.find('#eventCloseDateInv').value) : null,
    horaCierreInv: t.find('#horaCierreInv').value,
    maximoInvitados: t.find('#maximoInvitados').value,

    creatorId: Meteor.user()._id,
    tipoEventoId: t.find('#tipoEventoId').value,
    estado: 'Abierto',
  };
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
