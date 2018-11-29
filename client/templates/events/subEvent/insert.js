 Template.subEventosInsert.events({
   'click #btnViewInvites': function() {
     Router.go('invitadosEventoIndex')
   },
   'click #btnThisEvento': function() {
     Router.go('eventsUpdate', {
       _id: Session.get('eventoEnEdicionId')
     })
   },
   'click #btnViewSubEventos': function() {
     Router.go('subEventosIndex')
   },
   'click #btnSave': function(e, t) {
     e.preventDefault();
     var eventId = FlowRouter.current().params.eventId;
     var doc = getDocSubEventInsert(t);
     swal({
       title: "Crear Sub Evento",
       text: 'Nuevo Sub Evento',
       type: 'info',
       showCancelButton: true,
       confirmButtonColor: "#DD6B55",
       confirmButtonText: "Confirmar",
       closeOnConfirm: true
     }, function() {
       Meteor.call('insertSubEvent', doc, function(e, r) {
         if (e) {
           toastr.error(e.message);
         } else {
           toastr.success("Success Inserting Sub Event");
           FlowRouter.go('subEvents', {
             eventId: eventId
           })
         }
       });

     });
   },
 });
 Template.subEventosInsert.helpers({
   /* get current selected dropdown */
   selected: function(_id) {
     if (this._id === _id)
       return "selected";
   },
   events: function() {
     return Events.find({
       _id: Session.get('eventoEnEdicionId')
     });
   },
   tiposubevento: function() {
     return TipoSubEvento.find({});
   },
   floor: function() {
     return Floor.find({
       locationId: Session.get('selectedLocationId')
     });
   },
   section: function() {
     return Section.find({
       locationId: Session.get('selectedLocationId')
     });
   },

 });
 Template.subEventosInsert.onRendered(function() {
   this.$('.ui.dropdown').dropdown();
 });
 getDocSubEventInsert = function(t) {
   return {
     eventId: FlowRouter.current().params.eventId,
     tipoSubEventoId: t.find('#tipoSubEventoId').value,
     name: t.find('#name').value,
     comment: t.find('#comment').value,
     reservedBy: t.find('#reservedBy').value,
     floorId: t.find('#floorId').value,
     sectionId: t.find('#sectionId').value,
   };
 }
