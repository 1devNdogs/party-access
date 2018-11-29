Template.reportsEvents.onRendered(function() {

  Session.set('searchAllEvents', '')
  Session.set('limitSerchAllEvents', 20);
});

Template.reportsEvents.onCreated(function() {
  Session.setDefault('searchAllEvents', '')
  Session.setDefault('limitSerchAllEvents', 20);
  var self = this;
  self.autorun(function() {
    var limit = Session.get('limitSerchAllEvents');
    var filter = Session.get('searchAllEvents');
    subs.subscribe("reportsEvents", filter, limit);
  });
});

Template.reportsEvents.events = {
  'keyup #search': function(e, t) {
    e.preventDefault();
    Session.set('searchAllEvents', e.target.value)
  },
  'click #loadMoreEvents': function() {
    Session.set('limitSerchAllEvents', Session.get("limitSerchAllEvents") + 20);
  },
};

Template.reportsEvents.helpers({
  events: function() {
    var limit = Session.get('limitSerchAllEvents');
    var filter = new RegExp(Session.get('searchAllEvents'), 'i');
    return Events.find({
      name: filter,
    }, {
      sort: {
        eventDate: 1
      },
      limit: limit
    });
  }
});
