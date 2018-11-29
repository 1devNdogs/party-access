Template.updateLocation.events = {
  'click #selectFloor': function(e) {
    e.preventDefault();
    Session.set('selectedFloor', this._id)
  },
  'click #btnRemoveFloor': function(e, t) {
    e.preventDefault();
    var floorId = this._id;
    swal({
      title: "Borrar",
      text: 'Borrar Piso, se removeran las secciones del piso',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Confirmar",
      closeOnConfirm: true
    }, function() {
      Meteor.call('Floor.remove', floorId, function(err, res) {
        if (err) {
          toastr.error('Error...');
        } else {
          toastr.success("Success Removing Floor");
        }
      });
    });
  },
  'click #btnRemoveSection': function(e, t) {
    e.preventDefault();
    var sectionId = this._id;
    swal({
      title: "Borrar",
      text: 'Borrar Seccion',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Confirmar",
      closeOnConfirm: true
    }, function() {
      Meteor.call('Section.remove', sectionId, function(err, res) {
        if (err) {
          toastr.error('Error...');
        } else {
          toastr.success("Success Removing Floor");
        }
      });
    });
  },
  'click #btnSaveSection': function(e, t) {
    e.preventDefault();
    var doc = _getDocInsertSection(t);
    if (doc) {
      swal({
        title: "Crear",
        text: 'Nueva Seccion',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Confirmar",
        closeOnConfirm: true
      }, function() {
        Meteor.call('Section.insert', doc, function(err, res) {
          if (err) {
            toastr.error('Error...');
          } else {
            toastr.success("Success Inserting Seccion");
          }
        });
      });
    }
  },
  'click #btnSave': function(e, t) {
    e.preventDefault();
    var locationId = FlowRouter.current().params.locationId;
    var doc = _getDocUpdateLocation(t);
    if (doc) {
      swal({
        title: "Actualizar",
        text: 'Actualizar Local',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Confirmar",
        closeOnConfirm: true
      }, function() {
        Meteor.call('Locations.update', locationId, doc, function(err, res) {
          if (err) {
            toastr.error('Error...');
          } else {
            toastr.success("Success Updating Locations");
            FlowRouter.go('locations');
          }
        });
      });
    }
  }
}
Template.updateLocation.helpers({
  selectedFloor: function(floorId) {
    return Session.get('selectedFloor') === floorId ? 'active' : ''
  },
  regiones: function() {
    return Regiones.find()
  },
  ciudades: function() {
    return Ciudades.find()
  },
  locationInEdit: function() {
    var locationId = FlowRouter.current().params.locationId;
    var loc = Locations.findOne(locationId);
    return loc
  },
  selected: function(_id) {
    if (this._id === _id)
      return "selected";
  },
  floors: function() {
    var locationId = FlowRouter.current().params.locationId;
    var loc = Locations.findOne(locationId);
    return Floor.find({
      locationId: locationId
    });
  },
  sections: function() {
    var locationId = FlowRouter.current().params.locationId;
    var loc = Locations.findOne(locationId);
    return Section.find({
      floorId: Session.get('selectedFloor')
    });
  },
});
var _getDocUpdateLocation = function(t) {
  return {
    name: t.find('#name').value,
    rut: t.find('#rut').value,
    regionId: t.find('#regionId').value,
    ciudadId: t.find('#ciudadId').value,
    address: t.find('#address').value,
  };
}

var _getDocInsertFloor = function(t) {
  var locationId = FlowRouter.current().params.locationId;
  return {
    name: t.find('#floorName').value,
    locationId: locationId,
    active: true
  };
}

var _getDocInsertSection = function(t) {

  var locationId = FlowRouter.current().params.locationId;
  return {
    nombre: t.find('#sectionName').value,
    locationId: locationId,
    floorId: Session.get('selectedFloor'),
    active: true
  };
}
