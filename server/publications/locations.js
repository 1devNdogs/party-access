Meteor.publishComposite('locations', function() {
  console.log("subscribing some Locations");
  return {
    find: function() {
      return Locations.find({
        active: true
      });
    },
    children: [
      /* return all related Ciudades */
      {
        find: function(loc) {
          return Ciudades.find(loc.ciudadId);
        }
      },
    ],
  }
});
