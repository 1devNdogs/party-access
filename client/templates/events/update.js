Template.adminChartLevel.onRendered(function() {
    var self = this;
    self.autorun(function(c) {
        builtChart();
    });
})

Template.eventsUpdate.onCreated(function() {
    var self = this;
    self.autorun(function() {
        var eventId = FlowRouter.current().params.eventId;
        subs.subscribe('invitadosEvento', eventId, 0);
        subs.subscribe("subEventos", eventId);
    })
})

Template.eventsUpdate.onRendered(function() {
    this.$('#eventDate').datepicker();
    this.$('#eventCloseDate').datepicker();
    this.$('#eventDateInv').datepicker();
    this.$('#eventCloseDateInv').datepicker();
    this.$('.rutpistola').focus();
    this.$('.ui.dropdown').dropdown();
    /**Desactiva el modo feo */
    Session.set('isUglyModeOn', false);
});

Template.eventsUpdate.helpers({
    subEventos: function() {
        var eventId = FlowRouter.current().params.eventId
        return SubEventos.find({
            eventId: eventId
        });
    },
    importStep: _.throttle(function() {
            try {
                var is = Session.get('importStep');
                var importlength = Session.get('importlength');
                var perc = (is * 100) / importlength
                if (perc) return Math.round(perc);
                else return 0
            } catch (e) {
                return 0
            }

        },
        600),
    getEstadoText: function(estado) {
        if (estado == 'Abierto')
            return "Abierto";
        if (estado == 'Cerrado')
            return "Cerrado";
    },
    locations: function() {
        return Locations.find({});
    },
    tipoevento: function() {
        return TipoEvento.find({});
    },
});

Template.eventsUpdate.events({
    'click .top.menu .item': function(e, t) {
        var menu = e.target.dataset.tab
        if (menu === "info") {
            selectedTab = 'info'
        } else if (menu === "subEventos") {
            selectedTab = 'subEventos'
        } else if (menu === "invitados") {
            selectedTab = 'invitados'
        }
    },
    'click #openSubEvent': function(e, template) {
        e.preventDefault();
        var eventId = FlowRouter.current().params.eventId;
        FlowRouter.go('subEvents', {
            eventId: eventId
        })
    },
    'click #closeEvent': function(e, template) {
        if (this.estado === 'Abierto') {
            Meteor.call('closeEvent', this._id)
        } else {
            toastr.error('Evento ya cerrado.')
        }
    },
    'keydown': function(e, template) {
        var key = e.keyCode;
        var eventId = FlowRouter.current().params.eventId;
        var userIdPickingSex = Session.get('pickSexForPeopleId');
        if (e.ctrlKey && key == 67 || key == 86) {
            return true;
        }
        //activado el modo ban entra aca
        //previo a ingresar un rut revisa si el modo ban esta activado = uglumode o ban mode es lo mismo
        if (e.ctrlKey && key == 32) {
            Session.set('isUglyModeOn', !Session.get('isUglyModeOn'));
            if (Session.get('isUglyModeOn'))
                $('.uglydiv').addClass('disabled')
            else
                $('.uglydiv').removeClass('disabled')
        } else if (key == 77 || key == 72) {
            if (e.ctrlKey) {
                e.preventDefault();
                return false;
            }
            //si el guardia esta presionando M o F en el teclado
            if (userIdPickingSex != '0') {
                try {
                    Meteor.call('setSexUserInvited', key === 77 ? '0' : '1', userIdPickingSex, eventId, new Date());
                    if (key == 77)
                        changeSexMujer();
                    else {
                        chageSexHombre();
                    }
                } catch (e) {}
                $('.rutpistola').focus();
                Session.set('pickSexForPeopleId', '0');
            } else
                return false;
        }
    },
    'click .hbtn': function(e, template) {
        var eventId = FlowRouter.current().params.eventId;
        var userIdPickingSex = Session.get('pickSexForPeopleId');
        if (userIdPickingSex != '0') {
            try {
                Meteor.call('setSexUserInvited', '1', userIdPickingSex, eventId, new Date());
                chageSexHombre();
            } catch (e) {
                console.log(e);
            }
            $('.rutpistola').focus();
            Session.set('pickSexForPeopleId', '0');
        } else {
            return null
        }
    },
    'click .mbtn': function(e, template) {
        var eventId = FlowRouter.current().params.eventId;
        var userIdPickingSex = Session.get('pickSexForPeopleId');
        if (userIdPickingSex != '0') {
            try {
                Meteor.call('setSexUserInvited', '0', userIdPickingSex, eventId, new Date());
                changeSexMujer();
            } catch (e) {}
            $('.rutpistola').focus();
            Session.set('pickSexForPeopleId', '0');
        } else {
            return null;
        }
    },
    'keypress .rutpistola': function(e, template) {
        var openDate = new Date(template.find('#eventDateInv').value +" " +template.find('#horaInv').value);
        var closeDate = new Date(template.find('#eventCloseDateInv').value +" " +template.find('#horaCierreInv').value);

        if(new Date() < openDate || new Date() > closeDate){
            swal({
                title: "Invitaciones cerradas",
                text: 'Invitaciones cerradas',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Confirmar",
                closeOnConfirm: true
            }, function(){
                return;
            });
            return;
        }

        if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 77 || e.keyCode == 13 || e.keyCode == 75) {

   
            var nombreinvitado = $('.nombreinvitado');
            var rutinvitado = $('.rutinvitado');
            var enlistabtn = $('.enlistabtn');
            var noenlistabtn = $('.noenlistabtn');
            var hbtn = $('.hbtn');
            var mbtn = $('.mbtn');
            var picksex = $('.picksex');
            var rutpistola = template.find('#rutpistola');

            var specialKeys = new Array();
            specialKeys.push(8); //Backspace
            specialKeys.push(46); //Delete
            specialKeys.push(13); //enter

            var rutPeople = rutpistola.value;
            rutPeople = rutPeople.toUpperCase();

            var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;

            if (rutPeople.length > 9)
                if (keyCode != 13)
                    return false

            if (keyCode == 13) {
                /**
                 *BUSCA EN PEOPLE
                 */
                if ($.validateRut(rutPeople.substring(0, 9))) {
                    rutPeople = $.formatRut(rutPeople.substring(0, 9));
                } else {
                    if ($.validateRut(rutPeople.substring(0, 8))) {
                        rutPeople = $.formatRut(rutPeople.substring(0, 8));
                    } else {}
                }
                console.log("validando"+ rutPeople)
                var invitado = Meteor.users.findOne({
                    'profile.rut': rutPeople
                });
                /**
                 *valida si existe la persona en el sistema
                 */
                if (invitado != null) {
                    /**
                     *SET NOMBRE DE LA PERSONA SI EXISTE EN EL CAMPO DE TEXTO
                     */
                    nombreinvitado.val(invitado.profile.name);
                    rutinvitado.val(invitado.profile.rut);
                    /**
                     * BUSCA EN Invites
                     */
                    var invitacion = InvitadosEvento.findOne({
                        eventId: FlowRouter.current().params.eventId,
                        rut: invitado.profile.rut
                    });
                    /**
                     *SI ES QUE ESTA INVITADO
                     */
                    if (invitacion) {
                        /**
                         * SET STATUS DE INVITE
                         */
                        /**Si guardia acivo modo ban*/
                        var isBanned = 0;
                        if (Session.get('isUglyModeOn')) {
                            /**Invitado baneado*/
                            console.log("baneando user")
                            Meteor.call('banUser', invitado._id)
                            Session.set('isUglyModeOn', false);
                            $('.uglydiv').removeClass('disabled')
                            toPickSexDisabled();
                            isBanned = 1;
                        }

                        if (isBanned == 1)
                            setStatusInviteNoEnLista(enlistabtn, noenlistabtn)
                        else
                            setStatusInviteEnLista(enlistabtn, noenlistabtn);

                        if (invitacion.estadoAsistencia != 2) {
                            var doc = {
                                fechaIngreso: new Date(),
                                rrppUserId: invitacion.createdUserId,
                                isBanned: isBanned,
                                sexo: invitado.profile.sexo,
                                estadoAsistencia: 2,
                                userId: invitado._id,
                                eventId: FlowRouter.current().params.eventId,
                            };
                            Meteor.call('asisteAEvento', invitacion._id, doc, function() {})
                        }
                        Meteor.call('updateBan', invitacion._id, {isBanned:isBanned}, function() {})

                        if (isBanned == 0) {
                            /** EVALUAR EL SEXO Y SETEAR COMPONENTES*/
                            switch (invitacion.sexo) {
                                case '0':
                                    changeSexMujer();
                                    Session.set('pickSexForPeopleId', '0');
                                    break
                                case '1':
                                    chageSexHombre();
                                    Session.set('pickSexForPeopleId', '0');
                                    break
                                case '2':
                                    toPickSex();
                                    Session.set('pickSexForPeopleId', invitado._id);
                                    break
                                default:
                                    toPickSexDisabled();
                                    Session.set('pickSexForPeopleId', '0');
                                    break
                            }
                        }
                    } else {
                        nombreinvitado.val(invitado.profile.name);
                        rutinvitado.val(invitado.profile.rut);
                        setStatusInviteNoEnLista(enlistabtn, noenlistabtn)
                        toPickSexDisabled();
                    }
                } else {
                    nombreinvitado.val('');
                    rutinvitado.val('');
                    setStatusInviteNoEnLista(enlistabtn, noenlistabtn)
                    toPickSexDisabled();
                }
                setTimeout(function() {
                    $('.rutpistola').val('')
                }, 300);
            } else {
                var ret = ((keyCode >= 48 && keyCode <= 57) || keyCode == 75 || keyCode == 107 || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
                return ret;
            }
        } else {
            e.preventDefault();
            return false
        }

    },
    'click .invitarbtn': function(e, template) {
        e.preventDefault();
        var contadorOK = 0;
        /**Reset Errores de importacion*/
        template.find('.yainvitados').innerHTML = '';
        var errorLines = ''
            /**Obtiene todas las lineas a importar en un array*/
            var enteredText = $('#invitadosarea').val();
            var arrayOfLines = enteredText.split(/\n/g);
        Session.set('importStep', 0)
            /**Se recorre cada linea del array*/
        for (var i = 0; i < arrayOfLines.length; i++) {
            /**Se selecciona la linea a evaluar en el ciclo*/
            var lineToEval = arrayOfLines[i];
            /**se eliminan todas las tabulaciones*/
            lineToEval = lineToEval.replace('\t', ' ');
            /** Se valida que al menos contenga un rut de 9 numeros*/
            if (lineToEval != null && lineToEval.length >= 9) {
                try {
                    /**Elimina todos los espacios despues de la ultima palabra osea rut*/
                    lineToEval = lineToEval.replace(/\s+$/, '');
                    /**Obtiene la ultima palabra*/
                    var rut = lineToEval.split(' ').pop();
                    rut = rut.toUpperCase();
                    rut = rut.replace(/\W/g, '')
                    if ($.validateRut(rut)) {
                        rut = $.formatRut(rut)
                        try { //si se cae con el nombre simplemente pone nombre vacio pues el rut ya es validado y es suficiente
                            /**Obtiene el nombre*/
                            var lastIndex = lineToEval.lastIndexOf(' ')
                            var lineToEval2 = lineToEval.substring(0, lastIndex);
                            var name = lineToEval2;
                            var subEvento = template.find('#subEvento').value;

                            Meteor.call('importInvitados', name, rut, Meteor.userId(), this._id, Meteor.user().profile.name, subEvento, function(error, result) {
                                Session.set('importStep', Session.get('importStep') + 1)

                                if (result.length > 7)
                                    template.find('.yainvitados').innerHTML = template.find('.yainvitados').innerHTML + '</br>' + result;
                            });
                            contadorOK++;
                            Session.set('importlength', contadorOK)

                        } catch (e) {
                            errorLines = errorLines + '\n' + lineToEval;
                        }
                    } else {
                        errorLines = errorLines + '\n' + lineToEval;
                    }
                } catch (e) {
                    errorLines = errorLines + '\n' + lineToEval;
                }
            } else {}
        }
        $('#invitadosarea').val(errorLines);
        if (errorLines.length > 5) {
            template.find('.salida').innerHTML = contadorOK + ' invitados agregados a la lista' + ' <br> ** Ha ocurrido un error con algunos invitados, en el cuadro de texto estan los datos de quien no pudo ser invitado, revisar rut y nombre';
            $('#salida').removeClass('green');
            $('#salida').addClass('red ');

        } else {
            template.find('.salida').innerHTML = 'Todo bien =)' + contadorOK + ' invitados agregados a la lista';
            $('#salida').removeClass('red');
            $('#salida').addClass('green');
        }
    },
    'click #btnRemoveEvent': function(e, t) {
        e.preventDefault();
        if (Meteor.user().profile.userType === 'admin') {
            swal({
                title: "Eliminar",
                text: 'Eliminar Evento',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Confirmar",
                closeOnConfirm: true
            }, function() {
                var eventId = FlowRouter.current().params.eventId;
                Meteor.call('Events.remove', eventId, function(err, res) {
                    if (err) {
                        toastr.error('Error...');
                    } else {
                        toastr.success("Success Removing Event");
                        FlowRouter.go('eventsCalendar')
                    }
                });
            });
        }
    },
    'click #btnSave': function(e, t) {
        e.preventDefault();
        if (Meteor.user().profile.userType === 'admin') {
            var doc = _getUpdateEventDoc(t);

            if (doc) {
                swal({
                    title: "Actualizar",
                    text: 'Actualizar Evento',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Confirmar",
                    closeOnConfirm: true
                }, function() {
                    let eventId = FlowRouter.current().params.eventId;
                    Meteor.call('Events.update', eventId, doc, function(err, res) {
                        if (err) {
                            toastr.error('Error...');
                        } else {
                            toastr.success("Success Updating Event");
                        }
                    });
                });
            }
        }
    },
});

_getUpdateEventDoc = function(t) {
    return {
        name: t.find('#name').value,
        eventDate: new Date(t.find('#eventDate').value + " " + t.find('#hora').value),
        hora: t.find('#hora').value,
        eventCloseDate: t.find('#eventCloseDate').value ? new Date(t.find('#eventCloseDate').value) : null,
        horaCierre: t.find('#horaCierre').value,
        eventDateInv: new Date(t.find('#eventDateInv').value +" " +t.find('#horaInv').value),
        horaInv: t.find('#horaInv').value,
        eventCloseDateInv: t.find('#eventCloseDateInv').value ? new Date(t.find('#eventCloseDateInv').value) : null,
        horaCierreInv: t.find('#horaCierreInv').value,
        maximoInvitados: t.find('#maximoInvitados').value,
    };
}
setStatusInviteEnLista = function(enlistabtn, noenlistabtn) {

    enlistabtn.removeClass('gray disabled');
    enlistabtn.addClass('green enabled active');
    noenlistabtn.removeClass('red enabled active');
    noenlistabtn.addClass('gray disabled');
}
setStatusInviteNoEnLista = function(enlistabtn, noenlistabtn) {

    enlistabtn.removeClass('green enabled');
    enlistabtn.addClass('gray disabled');
    noenlistabtn.removeClass('gray disabled');
    noenlistabtn.addClass('red enabled active');
}
changeSexMujer = function() {

    var hbtn = $('.hbtn');
    var mbtn = $('.mbtn');
    var picksex = $('.picksex');
    hbtn.removeClass('blue enabled disabled active');
    hbtn.addClass('gray disabled');
    mbtn.removeClass('gray enabled active disabled');
    mbtn.addClass('pink enabled');
    picksex.removeClass('red enabled disabled active');
    picksex.addClass('gray disabled');
}
chageSexHombre = function() {

    var hbtn = $('.hbtn');
    var mbtn = $('.mbtn');
    var picksex = $('.picksex');
    hbtn.removeClass('gray disabled');
    hbtn.addClass('blue enabled active');
    mbtn.removeClass('pink enabled active');
    mbtn.addClass('gray disabled');
    picksex.removeClass('red enabled active');
    picksex.addClass('gray disabled');
}
toPickSex = function() {

    var hbtn = $('.hbtn');
    var mbtn = $('.mbtn');
    var picksex = $('.picksex');
    hbtn.removeClass('gray disabled active');
    hbtn.addClass('blue enabled');
    mbtn.removeClass('gray disabled active');
    mbtn.addClass('pink enabled');
    picksex.removeClass('gray disabled active');
    picksex.addClass('red enabled');
}
toPickSexDisabled = function() {

    var hbtn = $('.hbtn');
    var mbtn = $('.mbtn');
    var picksex = $('.picksex');
    hbtn.removeClass('blue gray enabled disabled active');
    hbtn.addClass('gray disabled');
    mbtn.removeClass('pink gray enabled disabled active');
    mbtn.addClass('gray disabled');
    picksex.removeClass('red gray enabled disabled active');
    picksex.addClass('gray disabled');
}


function builtChart() {
    var eventoId = FlowRouter.current().params.eventId;
    var evento = Events.findOne(eventoId);
    var data = new Array();
    var invh = 0;
    var invm = 0;
    if (evento) {
        if (evento.totalHombres) {
            var invh = evento.totalHombres || 0;
            var invm = evento.totalMujeres || 0;
        }
    }
    data.push({
        name: 'Hombres',
        y: invh,
        color: '#f0ad4e'
    });
    data.push({
        name: 'Mujeres',
        y: invm,
        color: '#5cb85c'
    });
    $('#adminChartLevel').highcharts({
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
}
