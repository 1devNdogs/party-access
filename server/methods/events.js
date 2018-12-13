Meteor.methods({
    'Events.update': function(eventId, doc) {
        try {
            console.log("Events.update");
            Events.update({
                _id: eventId
            }, {
                $set: doc
            });

        } catch (e) {
            logError(e);
        }
    },
    'Events.remove': function(eventId) {
        try {
            console.log("Events.remove");
            Events.remove(eventId);
            InvitadosEvento.remove({
                eventId: eventId
            })
        } catch (e) {
            logError(e);
        }
    },
    'removeSubEvent': function(subEventId) {
        check(subEventId, String);
        try {
            console.log("removeSubEvent");
            SubEventos.update(subEventId, {
                $set: {
                    active: false
                }
            })
        } catch (e) {
            logError(e);
        }
    },
    'insertSubEvent': function(doc) {
        try {
            console.log("insertSubEvent");
            SubEventos.insert(doc)
        } catch (e) {
            logError(e);
        }
    },
    'removerInvitado': function(invitadoEventoId) {
        check(invitadoEventoId, String);
        try {
            var ie = InvitadosEvento.findOne(invitadoEventoId);
            var sexo = ie.sexo;
            var eventId = ie.eventId;
            InvitadosEvento.remove(invitadoEventoId);
            if (sexo === '0')
                Events.update(eventId, {
                    $inc: {
                        totalMujeres: -1
                    }
                })
            else if (sexo === '1') Events.update(eventId, {
                $inc: {
                    totalHombres: -1
                }
            });
            Events.update(eventId, {
                $inc: {
                    totalInvitados: -1
                }
            })
        } catch (ex) {
            logError(ex);
        }
    },
    'increaseHombres': function(eventId) {
        check(eventId, String);
        try {
            Events.update(eventId, {
                $inc: {
                    totalHombres: 1
                }
            });
        } catch (ex) {
            logError(ex);
        }
    },
    'increaseMujeres': function(eventId) {
        check(eventId, String);
        try {
            Events.update(eventId, {
                $inc: {
                    totalMujeres: 1
                }
            });
        } catch (ex) {
            logError(ex);
        }
    },
    'updateBan': function(inviteId, doc) {
        try {
            InvitadosEvento.update(inviteId, {
                $set: doc
            });
        } catch (ex) {
            logError(ex);
        }
    },
    'asisteAEvento': function(inviteId, doc) {
        console.log('rrppUserId' + doc.rrppUserId);
        console.log('doc' + doc);
        console.log('doc' + doc);

        check(inviteId, String);
        check(doc.rrppUserId, String);

        try {
            var rrppUserId = doc.rrppUserId;
            InvitadosEvento.update(inviteId, {
                $set: doc
            });
            var ie = InvitadosEvento.findOne(inviteId);
            var sexo = doc.sexo;
            if (sexo != '1' && sexo != '0')
                Meteor.call('setSexUserInvited', sexo, doc.userId, doc.eventId, doc.fechaIngreso)

            Meteor.users.update(ie.userId, {
                $inc: {
                    'profile.totalEntradas': 1
                }
            })
            var u = Meteor.users.findOne(ie.userId);

            // forzar al rrpp o guardia a elejir sexo solo guarda la entrada ingresada si tiene sexo de lo contrario, no registra el ingreso a la collection
            //eventos
            if (doc.sexo === '1' || doc.sexo === '2') {
                var docEntrada = {
                    _id: ie.userId,
                    invitacionId: inviteId,
                    name: u.profile.name,
                    rut: u.profile.rut,
                    date: doc.fechaIngreso,
                    sexo: doc.sexo,
                    rrppUserId: rrppUserId
                };
                Events.update(ie.eventId, {
                    $addToSet: {
                        entradas: docEntrada
                    }
                });
            };
        } catch (ex) {
            logError(ex);
        }
    },
    'setSexUserInvited': function(sexo, userId, eventId, fechaIngreso) {
        console.log(sexo);
        console.log(userId);
        console.log(eventId);

        check(sexo, String);
        check(userId, String);
        check(eventId, String);

        try {
            Meteor.users.update(userId, {
                $set: {
                    'profile.sexo': sexo
                }
            });
            var invitacion = InvitadosEvento.findOne({
                eventId: eventId,
                userId: userId
            })
            InvitadosEvento.update(invitacion._id, {
                $set: {
                    sexo: sexo
                }
            });
            if (sexo === '1') {
                Events.update(eventId, {
                    $inc: {
                        totalHombres: 1
                    }
                });
            } else if (sexo === '0') {
                Events.update(eventId, {
                    $inc: {
                        totalMujeres: 1
                    }
                });
            }
            var u = Meteor.users.findOne(userId)
            var docEntrada = {
                _id: userId,
                invitacionId: invitacion._id,
                name: u.profile.name,
                rut: u.profile.rut,
                date: fechaIngreso,
                sexo: sexo,
                rrppUserId: invitacion.createdUserId
            };
            Events.update(eventId, {
                $addToSet: {
                    entradas: docEntrada
                }
            });
        } catch (ex) {
            logError(ex);
        }
    },
    'banUser': function(userId) {
        check(userId, String);
        try {
            Meteor.users.update(userId, {
                $set: {
                    'profile.isBanned': 1
                }
            });
        } catch (ex) {
            logError(ex);
        }
    },
    'insertEvent': function(doc) {
        check(doc, Object);
        try {
            var _id = Events.insert(doc);
            return {
                _id: _id
            }
        } catch (ex) {
            logError(ex);
        }
    },
    'openEvent': function(eventId) {
        check(eventId, String);
        try {
            Events.update(eventId, {
                $set: {
                    estado: 'Abierto'
                }
            });
        } catch (ex) {
            logError(ex);
        }
    },
    'closeEvent': function(eventId) {
        check(eventId, String);
        try {
            Events.update(eventId, {
                $set: {
                    estado: 'Cerrado'
                }
            });
        } catch (ex) {
            logError(ex);
        }
    },
    //Importar Invitados
    'importInvitados': function(name, rut, creatorUserId, eventId, creatorName, subEventoId) {
        check(name, String);
        check(rut, String);
        check(creatorUserId, String);
        check(eventId, String);
        check(creatorName, String);
        try {
            var totalInvitados = InvitadosEvento.find({
                eventId: eventId
            }).count();
            var maximoInvitados = Events.findOne(eventId).maximoInvitados;
            console.log("max_ "+maximoInvitados)
            console.log("totalInvitados "+totalInvitados)
            console.log(maximoInvitados === 0 || totalInvitados < maximoInvitados)
            
            if (maximoInvitados === 0 || totalInvitados < maximoInvitados) {
                var yainvitados = '';
                /*Buscar invitado como user*/
                var people = Meteor.users.findOne({
                    'profile.rut': rut,
                    'profile.userType': 'invitado'
                });
                /*No existe invitado en sistema, crea el invitado*/

                if (!people) {
                    let rStringId = randomString(9, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                    let rStringEmail = '_' + randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                    let rStringP = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                    let email = name + rStringEmail + '@laotraesquina.cl';
                    Accounts.createUser({
                        username: name + '_' + rStringId,
                        email: email,
                        password: rStringP,
                        profile: {
                            userType: 'invitado',
                            active: true,
                            name: name,
                            rut: rut,
                            isBanned: 0,
                            createdBy: creatorUserId,
                            creatorName: creatorName,
                            firstEvent: eventId,
                            sexo: '2',
                            totalEntradas: 0,
                            entradas: []
                        }
                    });
                    /*Buscar invitado*/
                    people = Meteor.users.findOne({
                        'profile.rut': rut
                    })
                }

                /*Buscar invitacion a evento*/
                var invite = InvitadosEvento.findOne({
                    eventId: eventId,
                    userId: people._id
                });

                /*No existe invitacion en este evento al usuario, crea el invitado*/
                if (invite == null) {
                    let docInvitadosEvento = {
                        eventId: eventId,
                        userId: people._id,
                        subEventoId: '0',
                        nombre: people.profile.name,
                        rut: rut,
                        sexo: people.profile.sexo,
                        isBanned: 0,
                        estadoAsistencia: 0,
                        fechaIngreso: new Date(),
                        creatorId: creatorUserId,
                        totalInvitados: '1',
                    }
                    if (subEventoId) {
                        docInvitadosEvento.subEventoId = subEventoId
                    }
                    let inviteId = InvitadosEvento.insert(docInvitadosEvento);
                    Meteor.users.update(creatorUserId, {
                        $inc: {
                            'profile.totalInvitados': 1
                        }
                    });

                    invite = InvitadosEvento.findOne(inviteId);

                    var updateEventDoc = {
                        totalInvitados: 1,
                    }
                    if (invite.sexo === '1')
                        updateEventDoc.totalHombres = 1
                    if (invite.sexo === '0')
                        updateEventDoc.totalMujeres = 1

                    Events.update(eventId, {
                        $inc: updateEventDoc
                    })
                } else {
                    yainvitados = name + '  ' + rut
                }
                return yainvitados;
            } else {
                return 'Lista llena!, no se pueden invitar mas de '+maximoInvitados+ ' personas un evento';
            }

        } catch (ex) {
            logError(ex);
        }
    }
});

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
