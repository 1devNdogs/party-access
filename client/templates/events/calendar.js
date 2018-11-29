Template.eventsCalendar.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var calendarStart = Session.get('calendarStart')
    var calendarEnd = Session.get('calendarEnd')
    var locationId = Session.get('selectedLocationId')
    if (calendarStart && calendarEnd && locationId)
      subs.subscribe('eventsCalendar', calendarStart, calendarEnd, locationId, function() {});
  });
});

Template.eventsCalendar.helpers({
  calendarOptions: {
    id: 'myid2',
    class: 'myCalendars',
    lang: 'es',
    defaultView: 'month',
    slotDuration: '2:00:00',
    header: {
      center: 'title',
      right: 'prev,next',
      left: 'today'
    },
    dayClick: function(date, jsEvent, view) {
      if (Meteor.user().profile.userType === 'admin') {
        if (Session.get('selectedLocationId') != '0')
          swal({
            title: "Crear",
            text: 'Nuevo Evento',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirmar",
            closeOnConfirm: true
          }, function() {
            Session.setPersistent('newEventDate', date._d.addHours(3))
            FlowRouter.go('insertEvent');
          });
        else
        if (Session.get('selectedLocationId') != '0')
          toastr.error('Para crear un evento debe seleccionar el local en la barra de navegacion.')
      }

    },
    eventClick: function(calEvent, jsEvent, view) {
      FlowRouter.go('eventsUpdate', {
        eventId: calEvent.eventId
      });
    },
    events: function(start, end, tz, callback) {
      Session.set('calendarStart', start._d)
      Session.set('calendarEnd', end._d)

      var events = Events.find({
        locationId: Session.get('selectedLocationId')
      }).map(function(it) {
        var realColor = '#e07b53';
        if (it.eventDate > new Date())
          realColor = '#5bbd72';
        return {
          title: it.name,
          start: it.eventDate,
          eventId: it._id,
          allDay: false,
          color: realColor
        }
      });

      callback(events);
    }
  }

});
Template.eventsCalendar.onRendered(function() {
  this.$('.fc-month-button').addClass('ui blue button');
  this.$('.fc-agendaDay-button').addClass('ui blue button');
  this.$('.fc-basicDay-button').addClass('ui blue button');
  this.$('.fc-today-button').addClass('ui orange button');
  this.$('.fc-prev-button').addClass('ui blue button');
  this.$('.fc-next-button').addClass('ui blue button');
  var self = this;

  Meteor.setTimeout(function() {
    var loc = Locations.findOne();
    $(".localDropdrown").dropdown("refresh");
    $(".localDropdrown").dropdown("set selected", loc._id);
    $(".localDropdrown").dropdown({
      onChange: function(value, text) {
        Session.set('selectedLocationId', value);
      }
    });
    Session.set('selectedLocationId', loc._id);
  }, 800);
});
