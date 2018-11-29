Meteor.publishComposite('usersApp', function(search, limit) {
    console.log('subscribing some usersApp');
    return {
        find: function() {
            var filter = new RegExp(search, 'i');

            return Meteor.users.find({
                'profile.name': filter,
                'profile.userType': {
                    $ne: 'invitado',
                },
                'profile.active': true
            }, {
                limit: limit
            });
        },
        children: [],
    }
});
Meteor.publishComposite('rrppInEvent', function() {
    console.log('subscribing some usersApp');
    return {
        find: function() {
            return Meteor.users.find({
                'profile.userType': {
                    $in: ['admin', 'rrpp']
                }
            });
        },
        children: [],
    }
});
Meteor.publishComposite('usersAppInvitados', function(search, limit, sort) {
    console.log('subscribing some usersAppInvitados');
    return {
        find: function() {
            var filter = new RegExp(search, 'i');
            var users = Meteor.users.find({
                'profile.name': filter,
                'profile.userType': 'invitado',
                'profile.active': true
            }, {
                sort: {
                    'profile.totalEntradas': sort || 1
                },
                limit: limit
            });
            console.log(limit);

            console.log(users.count());
            return users
        },
        children: [],
    }
});
Meteor.publishComposite('userInUpdate', function(userId) {
    console.log('subscribing some userInUpdate', userId);
    return {
        find: function() {
            return Meteor.users.find({
                _id: userId
            }, {
                limit: 1
            });
        },
        children: [],
    }
});
