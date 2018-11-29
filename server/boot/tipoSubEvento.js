Meteor.startup(function () {
    if (TipoSubEvento.find().count() === 0) {
        TipoSubEvento.insert({
            name: 'Cumpleaños'
        });
        TipoSubEvento.insert({
            name: 'Vip o Reserva'
        });
        TipoSubEvento.insert({
            name: 'Otro'
        });
    }
});
