Template.locations.onRendered(function() {
  Session.set('searchAllLocations', '')
  Session.set('limitSerchAllLocations', 20);
});

Template.locations.onCreated(function() {
  Session.setDefault('searchAllLocations', '')
  Session.setDefault('limitSerchAllLocations', 20);
  var self = this;
  self.autorun(function() {
    subs.subscribe("locations");
  });
});

Template.locations.events = {
  'keyup #search': function(e, t) {
    e.preventDefault();
    Session.set('searchAllLocations', e.target.value)
  },
  'click #loadMoreLocations': function() {
    Session.set('limitSerchAllLocations', Session.get("limitSerchAllLocations") + 20);
  },
  'click #btnRemove': function(e, t) {
    e.preventDefault();
    var locationId = this._id;
    swal({
      title: "Eliminar Location",
      text: 'Eliminara Location, pero no su registro en el sistema',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Confirmar",
      closeOnConfirm: true
    }, function() {
      Meteor.call('Locations.remove', locationId, function(err, res) {
        if (err) {
          console.log(err);
          toastr.error(err.details);
        } else {
          toastr.success("Success Removing Location");
          FlowRouter.go('locations');
        }
      });;
    });
  }
};

Template.locations.helpers({
  locations: function() {
    var limit = Session.get('limitSerchAllLocations');
    var filter = Session.get('searchAllLocations');

    return Locations.find({
      $or: [{
        'name': {
          $regex: filter,
          $options: 'i'
        }
      }, {
        'address': {
          $regex: filter,
          $options: 'i'
        }
      }]
    }, {
      limit: limit
    });
  }
});
