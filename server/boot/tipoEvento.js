Meteor.startup(function () {
    if (TipoEvento.find().count() === 0) {
        TipoEvento.insert({
            _id:'0',
            name: 'Normal'
        });
        TipoEvento.insert({
            _id:'1',
            name: 'Stand Up Comedy'
        });
    }
});