Meteor.startup(function() {
  try {
    var users = Meteor.users.find();
    if (users.count() == 0) {
      Accounts.createUser({
        email: "admin@admin.com",
        password: "admin",
        hiddenName: "adminOwner",
        profile: {
          name: "Administrador",
          userType: "admin",
          active: true,
          totalInvitados: 0
        }
      });
      Accounts.createUser({
        email: "rrpp1@rrpp.com",
        password: "rrpp1",
        hiddenName: "rrpp1",
        profile: {
          name: "RRPP1",
          userType: "rrpp",
          active: true,
          totalInvitados: 0
        }
      });
      var user = Meteor.users.findOne({
        'profile.name': "Administrador"
      })
      if (Locations.find().count() === 0) {
        Locations.insert({
          _id: 'local1',
          name: 'Local 1',
          ownerId: user._id,
          rut: '1-9',
          regionId: '8',
          ciudadId: 'concepcion',
          address: 'Direccion',
          lat: '0.0',
          long: '0.0',
          administradorId: user._id,
          active: true
        });
      }
      if (Floor.find().count() === 0) {
        //  piso 1
        Floor.insert({
          _id: 'floor1',
          numero: 1,
          locationId: 'local1',
          name: 'Piso 1',
          active: true
        });
        Section.insert({
          numero: 1,
          floorId: 'floor1',
          locationId: 'local1',
          nombre: 'Sector 1 Piso 1',
          active: true
        });
        //piso 2
        Floor.insert({
          numero: 2,
          locationId: 'local1',
          name: 'Piso 2',
          active: true
        });
        Section.insert({
          numero: 2,
          floorId: 'floor2',
          locationId: 'local1',
          nombre: 'Sector 1 Piso 2',
          active: true
        });
      }
    }
  } catch (e) {
    console.log(e)
  }
});
