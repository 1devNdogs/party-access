Template.insertLocation.events = {
  'click #btnSave': function(e, t) {
    e.preventDefault();
    var doc = _getDocinsertLocation(t);
    if (doc) {
      swal({
        title: "Crear",
        text: 'Nuevo Local',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Confirmar",
        closeOnConfirm: true
      }, function() {
        Meteor.call('Locations.insert', doc, function(err, res) {
          if (err) {
            toastr.error('Error...');
          } else {
            toastr.success("Success Inserting Locations");
            FlowRouter.go('locations');
          }
        });
      });
    }
  }
}
Template.insertLocation.helpers({
  regiones: function() {
    return Regiones.find()
  },
  ciudades: function() {
    return Ciudades.find()
  },
});
var _getDocinsertLocation = function(t) {
  return {
    name: t.find('#name').value,
    rut: t.find('#rut').value,
    regionId: t.find('#regionId').value,
    ciudadId: t.find('#ciudadId').value,
    address: t.find('#address').value,
    active: true
  };
}
