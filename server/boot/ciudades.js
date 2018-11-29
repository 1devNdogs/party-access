Meteor.startup(function () {
    if (Ciudades.find().count() === 0) {
        Ciudades.insert({
            _id: 'concepcion',
            regionId: '8',
            name: 'Concepcion'
        });
        Ciudades.insert({
            _id: 'santiago',
            regionId: 'm',
            name: 'Santiago'
        });
    }
});