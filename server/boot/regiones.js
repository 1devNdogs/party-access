/**
 * REGIONES
 * */
Meteor.startup(function () {

    if (Regiones.find().count() === 0) {
        Regiones.insert({
            _id: 'm',
            name: 'Region Metropolitana de Santiago',
        });
        Regiones.insert({
            _id: '8',
            name: 'Region de Bio-Bio',

        });
    }
});
