Meteor.methods({
  'Floor.insert': function(doc) {
    check(doc, Object);
    check(doc.locationId, String);
    check(doc.name, String);
    check(doc.active, Boolean);

    try {
      var count = Floor.find({
        locationId: doc.locationId,
        active: true
      }).count();
      doc.numero = count++;
      Floor.insert(doc);
    } catch (e) {
      logError(e);
    }
  },
  'Floor.remove': function(floorId) {
    check(floorId, String);
    try {
      var sections = Section.find({
        floorId: floorId
      }).map(function(s) {
        return s._id
      });
      sections.forEach(function(sectionId) {
        Meteor.call('Section.remove', sectionId)
      });
      Floor.update(floorId, {
        $set: {
          active: false
        }
      });
    } catch (e) {
      logError(e);
    }
  },
  'Section.insert': function(doc) {
    check(doc, Object);
    check(doc.locationId, String);
    check(doc.floorId, String);
    check(doc.nombre, String);
    check(doc.active, Boolean);
    try {
      var count = Section.find({
        locationId: doc.locationId,
        floorId: doc.floorId,
        active: true
      }).count();
      doc.numero = count++;
      Section.insert(doc);
    } catch (e) {
      logError(e);
    }
  },
  'Section.remove': function(sectionId) {
    check(sectionId, String);
    try {
      Section.update(sectionId, {
        $set: {
          active: false
        }
      });
    } catch (e) {
      logError(e);
    }
  },
  'Locations.remove': function(locationId) {
    check(locationId, String);
    try {
      if (Locations.find().count() === 1) {
        throw new Meteor.error('cant remove unique location', 'cant remove unique location', 'cant remove unique location')
      } else {
        Locations.update(locationId, {
          $set: {
            active: false
          }
        });
      }
    } catch (e) {
      logError(e);
    }
  },
  'Locations.insert': function(doc) {
    try {
      Locations.insert(doc);
    } catch (e) {
      logError(e);
    }
  },
  'Locations.update': function(locationId, doc) {
    check(locationId, String);
    try {
      Locations.update(locationId, {
        $set: doc
      });
    } catch (e) {
      logError(e);
    }
  },

});
