Template.rrpp_invitados.onRendered(function() {});

Template.rrpp_invitados.onCreated(function() {
    var self = this;
    self.autorun(function() {
        subs.subscribe('rrppInEvent')
    })
});



Template.chartInvitadosRp.onRendered(function() {
    var self = this;
    self.autorun(function(c) {
        builtChartchartInvitadosRp();
    });
})
Template.chartCaptacionRp.onRendered(function() {
    var self = this;
    self.autorun(function(c) {
        builtChartchartCaptacionRp();
    });
})

function getInvitacion(createdUserId) {
    var eventId = FlowRouter.current().params.eventId;
    var invitadosTotal = InvitadosEvento.find({
        eventId: eventId,
    }).count();
    var invitadosRp = InvitadosEvento.find({
        eventId: eventId,
        createdUserId: createdUserId
    }).count();
    return Math.round((invitadosRp * 100) / invitadosTotal) || 0
}

function getCaptacion(createdUserId) {
    var eventId = FlowRouter.current().params.eventId;
    var invitadosTotal = InvitadosEvento.find({
        eventId: eventId,
        estadoAsistencia: 2
    }).count();
    var invitadosRp = InvitadosEvento.find({
        eventId: eventId,
        createdUserId: createdUserId,
        estadoAsistencia: 2
    }).count();
    return Math.round((invitadosRp * 100) / invitadosTotal) || 0
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function builtChartchartInvitadosRp() {
    Session.set('invitadosChartLoader', true);
    var eventId = FlowRouter.current().params.eventId;
    var invitados = InvitadosEvento.find({
        eventId: eventId
    })
    var entradas = Events.findOne(eventId).entradas;
    var arrayUsersIds = [];
    invitados.forEach(function(invitado) {
        let response = arrayUsersIds.indexOf(invitado.createdUserId)
        if (response === -1) arrayUsersIds.push(invitado.createdUserId);
    });
    var data = []
    arrayUsersIds.forEach(function(userId) {
        let invitadosCountRp = InvitadosEvento.find({
            createdUserId: userId
        }).count();
        if (Meteor.users.findOne(userId))
            data.push({
                name: Meteor.users.findOne(userId).profile.name,
                y: invitadosCountRp,
                color: getRandomColor()
            });
    });

    $('#chartInvitadosRp').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: 'Genero',
            data: data
        }]
    });
    Session.set('invitadosChartLoader', false);

}

function builtChartchartCaptacionRp() {
    Session.set('captacionChartLoader', true);

    var eventId = FlowRouter.current().params.eventId;
    var evento = Events.findOne(eventId);
    var data = new Array();

    var entradas = Events.findOne(eventId).entradas;
    var arrayUsersIds = [];
    entradas.forEach(function(entrada) {
        var response = arrayUsersIds.indexOf(entrada.rrppUserId)
        if (response === -1 ) {
            arrayUsersIds.push(entrada.rrppUserId);
        }
    });

    arrayUsersIds.forEach(function(userId) {
        let entradasCountRp = 0;
        entradas.forEach(function(entrada) {
            if (userId === entrada.rrppUserId && (entrada.sexo === '1' || entrada.sexo == '0')){
              entradasCountRp++
            }
        });
        if (Meteor.users.findOne(userId))
            data.push({
                name: Meteor.users.findOne(userId).profile.name,
                y: entradasCountRp,
                color: getRandomColor()
            });
    })



    $('#chartCaptacionRp').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: 'Genero',
            data: data
        }]
    });
    Session.set('captacionChartLoader', false);

}
