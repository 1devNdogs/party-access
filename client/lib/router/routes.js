FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "login"
    });
  },
  name: 'login'
});

FlowRouter.route('/login', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "login"
    });
  },
  name: 'login'
});

FlowRouter.route('/eventsCalendar', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "eventsCalendar"
    });
  },
  name: 'eventsCalendar'
});

FlowRouter.route('/user_manager', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "user_manager"
    });
  },
  name: 'user_manager'
});

FlowRouter.route('/user_manager_invitados', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "user_manager_invitados"
    });
  },
  name: 'user_manager_invitados'
});

FlowRouter.route('/insertUser', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "insertUser"
    });
  },
  name: 'insertUser'
});
FlowRouter.route('/updateUser/:userId', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "updateUser"
    });
  },
  name: 'updateUser'
});

FlowRouter.route('/insertEvent', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "insertEvent"
    });
  },
  name: 'insertEvent'
});


FlowRouter.route('/eventsUpdate/:eventId', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "eventsUpdate"
    });
  },
  name: 'eventsUpdate'
});
FlowRouter.route('/reportsEvents', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "reportsEvents"
    });
  },
  name: 'reportsEvents'
});
FlowRouter.route('/reportsEventsStats/:eventId', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "reportsEventsStats"
    });
  },
  name: 'reportsEventsStats'
});
FlowRouter.route('/subEvents/:eventId', {
  action: function(params, queryParams) {
    console.log("Params:", params);
    console.log("Query Params:", queryParams);
    BlazeLayout.render("appLayout", {
      content: "subEvents"
    });
  },
  name: 'subEvents'
});

FlowRouter.route('/invitadosEvents/:eventId', {
  action: function(params, queryParams) {
    console.log("Params:", params);
    console.log("Query Params:", queryParams);
    BlazeLayout.render("appLayout", {
      content: "invitadosEvents"
    });
  },
  name: 'invitadosEvents'
});

FlowRouter.route('/subEventosInsert/:eventId', {
  action: function(params, queryParams) {
    console.log("Params:", params);
    console.log("Query Params:", queryParams);
    BlazeLayout.render("appLayout", {
      content: "subEventosInsert"
    });
  },
  name: 'subEventosInsert'
});
FlowRouter.route('/locations', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "locations"
    });
  },
  name: 'locations'
});

FlowRouter.route('/insertLocation', {
  action: function() {
    BlazeLayout.render("appLayout", {
      content: "insertLocation"
    });
  },
  name: 'insertLocation'
});

FlowRouter.route('/updateLocation/:locationId', {
  action: function(params, queryParams) {
    console.log("Params:", params);
    console.log("Query Params:", queryParams);
    BlazeLayout.render("appLayout", {
      content: "updateLocation"
    });
  },
  name: 'updateLocation'
});
