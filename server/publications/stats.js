Meteor.publishComposite('reportsEvents', function(search, limit) {
  console.log('subscribing some reportsEvents');
  return {
    find: function() {
      var filter = new RegExp(search, 'i');

      return Events.find({
        'name': filter
      }, {
        sort: {
          eventDate: 1
        },
        limit: limit
      });
    },
    children: [],
  }
});
