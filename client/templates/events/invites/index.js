Template.invitadosEvents.onRendered(function() {
    Session.set('searchInvites', '')
    Session.set('invitadosEventsLimit', 20);
    $('.checkbox').checkbox({
        onEnable: function() {
        Session.set('isBanned', 0)
        },
        onChecked: function() {
        Session.set('isBanned', 1)
        },
        onUnchecked: function() {
        Session.set('isBanned', 0)
        },
    });
    Session.setDefault('isBanned', 0)
});

Tracker.autorun(function() {
    var sessionVal = Session.get("isBanned");
    if(sessionVal===1){
        $('.checkbox').checkbox('check')
    }else{
        $('.checkbox').checkbox('uncheck')
    }
});
Template.invitadosEvents.onCreated(function() {

    Session.setDefault('searchInvites', '')
    Session.setDefault('invitadosEventsLimit', 20);
    Session.setDefault('isBanned', 0)
    console.log(Session.get("isBanned"))
    var self = this;
    self.autorun(function() {
        var eventId = FlowRouter.current().params.eventId;
        subs.subscribe("invitadosEvento", eventId, Session.get("isBanned"));
    });
});
Template.invitadosEvents.events = {
    'click #btnThisEvento': function(e, t) {
        e.preventDefault();
        Router.go('eventsUpdate', {
            _id: Session.get('eventoEnEdicionId')
        })
    },
    'click #btnViewSubEventos': function(e, template) {
        Router.go('subEventosIndex')
    },
    'click #btnRemove': function(e, t) {
        e.preventDefault()
        var invitadosEventoId = this._id;
        swal({
            title: "Eliminar Invitacion",
            text: "Eliminara la invitacion seleccionada",
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Confirmar",
            closeOnConfirm: true
        }, function() {
            Meteor.call('removerInvitado', invitadosEventoId, function(err, res) {
                if (err) {
                    toastr.error(err.message);
                } else {
                    toastr.success("Invitacion Eliminada");
                }
            });;
        });
    },
    /* sorting by parameter */
    'keyup #search': function(e, t) {
        e.preventDefault();
        Session.set('searchInvites', e.target.value)
    },
    'click #loadMoreInvitados': function() {
        Session.set('invitadosEventsLimit', Session.get("invitadosEventsLimit") + 20);

    }
};
Template.invitadosEvents.helpers({
    getSex: function(sex) {
        if (sex == '2') {
            return ''
        } else {
            if (sex == '1') return 'blue'
            if (sex == '0') return 'pink'
        }
    },
    getSexIcon: function(sex) {
        if (sex == '2') {
            return 'user'
        } else {
            if (sex == '1') return 'man'
            if (sex == '0') return 'woman'
        }
    },
    invitados: function() {
        var eventId = FlowRouter.current().params.eventId;
        var limit = Session.get('invitadosEventsLimit');
        var filter = new RegExp(Session.get('searchInvites'), 'i');
        if (eventId) return InvitadosEvento.find({
            eventId: eventId,
            nombre: filter,
            isBanned: Session.get("isBanned")
        }, {
            limit: limit
        });
    },
    rrppOwner(userId) {
        var u = Meteor.users.findOne(userId)
        if (u)
            return u.profile.name
    }
});
