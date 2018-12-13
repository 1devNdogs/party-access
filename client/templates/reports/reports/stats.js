Template.reportsEventsStats.helpers({
    getTotalLength: function(eventId) {
        var e = Events.findOne(eventId).entradas
        var count = 0;
        e.forEach(function(e) {
            if (e.sexo === '0' || e.sexo === '1') count++;
        })
        return count
    },
    getTotalLengthMM: function(eventId) {
        var e = Events.findOne(eventId).entradas
        var count = 0;
        e.forEach(function(e) {
            if (e.sexo === '0') count++;
        })
        return count
    },
    getTotalLengthHH: function(eventId) {
        var e = Events.findOne(eventId).entradas
        var count = 0;
        e.forEach(function(e) {
            if (e.sexo === '1') count++;
        })
        return count
    },
});


Template.reportsEventsStats.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var eventId = FlowRouter.current().params.eventId;
        subs.subscribe('invitadosEvento', eventId, 0);
        subs.subscribe("subEventos", eventId);
    })
});
Template.reportsEventsStats.onRendered(function() {
    Meteor.setTimeout(function() {
        builtChart();
    }, 300);
});


var getRangosHoraNamesArray = function(eventId) {
    var salida = [];
    var evento = Events.findOne(eventId)
    var date1 = evento.eventDate;
    var hi = evento.hora;
    var date2 = evento.eventCloseDate;
    var ht = evento.horaCierre;
    var entradas = evento.entradas;
    date1.setHours(hi.split(':')[0]);
    date1.setMinutes(hi.split(':')[1].split(' ')[0]);
    date1.setSeconds(0);

    date2.setHours(ht.split(':')[0]);
    date2.setMinutes(ht.split(':')[1].split(' ')[0]);
    date2.setSeconds(0);

    var salidaHH = [];
    var salidaMM = [];

    var titulos = [];
    for (loopTime = date1.getTime(); loopTime < date2.getTime(); loopTime += 1800000) {
        var loopDay2 = new Date(loopTime + 1800000);
        var loopDay = new Date(loopTime);

        var timeTitle = loopDay.getHours() + ':' + loopDay.getMinutes() + ' - ' + loopDay2.getHours() + ':' + loopDay2.getMinutes();

        var entradasEnRangoHH = [];
        var entradasEnRangoMM = [];


        entradas.forEach(function(entrada) {
            if (entrada.date > loopDay && entrada.date < loopDay2) {
                if (entrada.sexo === '1') {
                    entradasEnRangoHH.push(entrada);
                } else if (entrada.sexo === '0') {
                    entradasEnRangoMM.push(entrada);
                }
            }
        });
        titulos.push(timeTitle)
        salidaHH.push(entradasEnRangoHH.length);
        salidaMM.push(entradasEnRangoMM.length);

    };
    return {
        salidaHH: salidaHH,
        salidaMM: salidaMM,
        titulos: titulos
    }
}

function builtChart() {
    var eventId = FlowRouter.current().params.eventId;
    var data = getRangosHoraNamesArray(eventId);

    $('#chartHoras').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Horas de llegada por sexo'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: data.titulos,
            crosshair: true,
            title: {
                text: 'Rangos de hora cada 30 min.'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cantidad'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Hombres',
            data: data.salidaHH,
            color: '#3b83c0'

        }, {
            name: 'Mujeres',
            data: data.salidaMM,
            color: '#dd2c8f'

        }]
    });
}
