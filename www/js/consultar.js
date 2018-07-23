'use strict';

var fecha;
var posRuta = new Object();
var gpRutas = [];
var siExiste = "N";
var siEliminar = "N";
var driverRoute = "";
var regDateDriver = "";
var plateRoute = "";
var nameRoute = "";
var codDriverRoute = "";
var intCnsRoute = 0;
var lastRouteAdded = "";
var latLocal;
var lngLocal;
var codePoint = 0;
var imageSchool;

function d2(n) {
    if(n<9) return "0"+n;
    return n;
}

function formatoFecha() {
    fecha = new Date();
    var sDate = fecha.getFullYear() + "-" + d2(parseInt(fecha.getMonth()+1)) + "-" + d2(fecha.getDate()) + " " + d2(fecha.getHours()) + ":" + d2(fecha.getMinutes()) + ":" + d2(fecha.getSeconds());
    fecha = sDate;
}

//Guardar datos de posicion del usuario
function guardarPosicion(position) {
    if( validBrowser == 1 ) {
        return;
    }
    contador++;
    formatoFecha();
    if( myUserId == "" ) { initApp(); }
    if( myUserId == ""  && contador > 3 ) { 
        alert('Este navegador no soporta Firebase.  Se recomienda Google Crhome');
        validBrowser = 1;
        return; 
    }
    distancia++;
    var fec = new Date().getTime();
    var fechaHoy = new Date();
//    var datos = conn.database().ref("usuario/cliente/" + myUserId );
    var datos = conn.database().ref("logDetail/JOAG1013/" + fec );
/*
    datos.set({ usuario : {
                    clientes : {
                        usuario : email,
                        useId : myUserId,
                        fecha : fecha,
                        ahora : fec,
                        latitud : position.lat + ( distancia / 10000000 ),
                        longitud : position.lng + ( distancia / 10000000 ),
                        precision : 'true'
                    }
                }
              }).then(function() { console.log('dato almacenado correctamente'); })
                .catch(function(error) { alert('detectado un error', error); });
*/
    datos.set({ hour: fechaHoy.getHours(),
                minutes: fechaHoy.getMinutes(),
                useId : myUserId,
                fecha : fecha,
                ahora : fec,
                latitud : position.lat + ( distancia / 100000 ),
                longitud : position.lng + ( distancia / 100000 ),
                precision : distancia
              }).then(function() { console.log('dato almacenado correctamente'); })
                .catch(function(error) { alert('detectado un error', error); });    
}

function formatoMsjDialog(etiqueta, msjError) {
    var elem = document.getElementById(etiqueta);
    elem.textContent = msjError;
    elem.removeAttribute("style")
    elem.setAttribute("style", "visibility: visible; display:block; color: #333333; text-align: left;");
}

function registroDatos() {
    var msjError = '';
    userName = $('#txtNombres').val();
    if( userName == "" ) { 
        msjError = 'Debes ingresar por lo menos un nombre para continuar'; 
        formatoMsjDialog("dataError1", msjError);
    }
    userLastName = $('#txtApellidos').val();
    if( userLastName == "" ) { 
        msjError = 'Debes ingresar por lo menos un apellido para continuar'; 
        formatoMsjDialog("dataError2", msjError);
    }
    userCellPhone = $('#txtCelular').val();
    if( userCellPhone == "" ) { 
        msjError = 'Debes ingresar un numero celular para continuar'; 
        formatoMsjDialog("dataError3", msjError);
    }
    var pais = document.getElementById("paisCelular");
    var paisSel = pais.options[pais.selectedIndex].value;
    if( paisSel == "" ) { 
        msjError = 'Debes seleccionar un pais para continuar'; 
        formatoMsjDialog("dataError4", msjError);
    }
    var codRutaTmp = $('#txtCodRuta').val();
    if( codRutaTmp == "" ) { 
        msjError = 'Debes ingresar el codigo de la empresa para continuar'; 
        formatoMsjDialog("dataError5", msjError);
    } else {
        cnsEntGroup(codRutaTmp);
        if( registrado == 0 ) {
            msjError = "Codigo de ruta " + codRutaTmp + " no existente";
            formatoMsjDialog("dataError6", msjError);
            codRutaTmp = "";
            return;
        }
    }
    if( userName != "" && userLastName != "" && userCellPhone != "" && codRutaTmp != "" && paisSel != "" ) {
        if( myUserId == "" ){ initApp(); }
        if( myUserId == "" ){ initApp(); }
        if( myUserId == "" ){ initApp(); }
        var datos = conn.database().ref("entUser/" + myUserId + "/" + codRutaTmp );
        datos.set({ userName : userName,
                    userlastName : userLastName,
                    userCellPhone : userCellPhone,
                    paisSel : paisSel
                  }).then( function() { 
                        console.log('dato almacenado correctamente');
                        cambioPagina('mapaRuta.html');
                        return;
                    } )
                    .catch(function(error) {
                        console.log('detectado un error', error);
                    });    
    } else {
        abrirOpcionModal("m-msjError");
//        var $popUp = $('#mensajeError');
//        var $msj = $('#estadoFormulario');
//        $msj.val(msjError);
//        var elem = document.getElementById("dataError");
//        elem.textContent = msjError;
//        elem.setAttribute("style", "color: #000000");        
//        $popUp[0].showModal();
    }
}

function cnsEmpresaCreada() {
/*
    while( myUserId == "" ) {
        intentos++;
        initApp();
    }
*/    
    intentos = 0;
    registrado = 0;
    var empresa = $('#txtRuta').val();
    var datos = conn.database().ref("entGroup/" + empresa );
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            registrado++;
        } );
    } );    
}

function cnsUsuarioEmpresa() {
    intentos = 0;
    registrado = 0;
    initApp();
    if (entUser != "" && entUser != undefined) return;
    var datos = conn.database().ref("entUser/" + myUserId );
    console.log("datos: " + datos);
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            registrado++;
            var arrayX = [];
            var empresa;
            for( var x in data.val() )
                empresa = x;
            entUser = empresa;
            arrayX.push(empresa);
            entChoose = "";
            var datosX = conn.database().ref( tblRtAlt[9] + "/" + entUser );
            datosX.orderByValue().on("value", function(snapshot) {
                snapshot.forEach( function(dataX) {
//                    console.log("data2: " + dataX.key + " - " + dataX.val());
                    if (dataX.key == "est" && dataX.val() == 2) entChoose = "enterprise";
//                    console.log("entChoose: " + entChoose);
                } );
            } );
        } );
    } );
    if (entUser == undefined || entUser == "") setTimeout( cnsUsuarioEmpresa, 1000 );
}

function cnsMovRutasDetalle() {
    var datos = conn.database().ref("logDetail/" + myUserId + "/" + empresa );
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            registrado++;
//            alert("key:" + data.key);
        } );
    } );    
}

function cnsMovRutasDetalleXX() {
/*    
    console.log("Inicio:" + new Date().getTime());
    var datos = conn.database().ref("usuario" );
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            posRuta.latitud = data.latitud;
            posRuta.longitud = data.longitud;
            posRuta.ruta = data.usuario;
            registrado = data.precision;
            gpRutas.push(posRuta);
        } );
    } );
    for( int i = 1; i < gpRutas.length; i++ ) {
        
    }
    console.log("Fin:" + new Date().getTime());
*/    
}

function csnRouteEnt(ruta) {
    var srRoute = 0;
    if (ruta == "" || ruta == undefined ) return;
    var datos = conn.database().ref("datacar/" + ruta);
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            srRoute = 1;
//            console.log("Lo encontre " + ruta);
            var elem = document.getElementById("routeFind");
            elem.textContent = "Vehiculo encontrado: " + ruta;
            elem.setAttribute("style", "color: #000000");
            var elemB = document.getElementById("btnARDialog");
            if( elemB != undefined ) elemB.removeAttribute("disabled");
            var elemR = document.getElementById("routeFindRem");
            if( elemR != undefined ) elemR.textContent = "Vehiculo encontrado: " + ruta;
            if( elemR != undefined ) elemR.setAttribute("style", "color: #000000");
        } );
    } );    
    if( srRoute == 0 ) {
        var elemD = document.getElementById("routeFind");
        elemD.textContent = "Vehiculo no encontrado";
        elemD.setAttribute("style", "color: #DF0101");
        var elemB = document.getElementById("btnARDialog");
        elemB.setAttribute("disabled", "true");
        var elemDR = document.getElementById("routeFindRem");
        elemDR.textContent = "Vehiculo no encontrado";
        elemDR.setAttribute("style", "color: #DF0101");
        abrirOpcionModal('m-CnfAddRoute');
    }
}

function cnsUserEnt() {
    intentos = 0;
    registrado = 0;
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    var datos = conn.database().ref("entUser/" + myUserId );
//    console.log("cnsUserEnt:" + myUserId);
    datos.orderByValue().on("value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            entUser = data.key;
            registrado = 1;            
        } );
    }, function( errorObj ) {
        console.log("Error:" + errorObj.code);
    } );
}

function msjAlert(msjTxt, opcion) {
    abrirOpcionModal('m-MsjAds');
    var elem = document.getElementById("msjAds");
    if( opcion == 1 ) {
        elem.textContent = msjTxt;
        elem.setAttribute("style", "color: #000000");
    }
    if( opcion == 2 ) {
        elem.textContent = msjTxt;
        elem.setAttribute("style", "color: #DF0101");
    }    
}

function addRoute() {
    formatoFecha();
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    if( entCode == "" ) { cnsUserEnt(); }
    if( entCode == "" ) { cnsUserEnt(); }
    if( entCode == "" ) { cnsUserEnt(); }
    var routeCode = $("#txtRuta").val();
    routeCode = minToMayus(routeCode);
    cnsRouteExistEnt(myUserId, routeCode);
    if( registrado > 0 ) {
        msjAlert("Ruta " + routeCode + " ya fue registrada", 2);
        return;
    }
    if( lastRouteAdded == routeCode ) {
        console.log("UltimaRuta:"+lastRouteAdded);
        return;
    }
    console.log("UltimaRuta:"+lastRouteAdded);
    csnRouteEnt(routeCode);
    var datos = conn.database().ref("entUser/" + myUserId );
    datos.orderByValue().on("value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            entUser = data.key;
            var datosX = conn.database().ref("entRoute/" + entUser + "/" + routeCode );
            datosX.set({ date : fecha,
                         user : myUserId,
                         routeCode: routeCode,
                         entCode: entUser
                      }).then( function() {
                            msjAlert("dato almacenado correctamente", 1);
                            $("#txtRuta").val("");
                        } )
                        .catch(function(error) {
                            msjAlert("Error al guardar los datos: " + error, 2);
                            return;
                        });
        } );
    }, function( errorObj ) {
        console.log("Error:" + errorObj.code);
        return;
    } );
    listVehicle();
}

function cnsRouteExistEnt(myUseridTmp, routeCodeTmp) {
    registrado = 0;
    var datos = conn.database().ref("entUser/" + myUseridTmp );
    datos.orderByValue().on("value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            var empresa = data.key;
            entUser = empresa;
            var datosX = conn.database().ref("entRoute/" + entUser + "/" + routeCodeTmp );
            datosX.orderByValue().on( "value", function( snapshotX ) {
                snapshotX.forEach( function( dataX ) {
                    registrado = 1;
                    siExiste = "S";
                } );
            } );    
        } );
    }, function( errorObj ) {
        console.log("Error:" + errorObj.code);
    } );
}

function cnsEntGroup(codEmpresa) {
    intentos = 0;
    registrado = 0;
    var datos = conn.database().ref( "entGroup/" + codEmpresa );
    datos.orderByValue().on( "value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            registrado++;
            entUser = data.key;
            return;
        } );
    } );    
}

function confirmaRemRoute() {
    siEliminar = "S";
    var routeCode = $("#txtRutaRem").val();
    remRouteEnt(routeCode);
    closePopUp('m-CnfRemRoute');
    $("#txtRutaRem").val("");
    var list = document.getElementById("listaVehiculosDel").getElementsByTagName("li");
    remFile(list, routeCode);
    var list = document.getElementById("listaVehiculos").getElementsByTagName("li");
    remFile(list, routeCode);
}

function remFile(list, routeCode) {
    for (var i = 0; i < list.length; i++ ) {
        if(list[i].innerHTML.includes(routeCode)) {
            var nodo = list[i].getAttribute("id");
            var child = document.getElementById(nodo);
//            var node = document.getElementById(nodo).parentNode.remove();//            var node = document.getElementById(nodo).parentNode.remove();
            child.parentNode.removeChild(child);
        }
    }
}

function remRoute() {
    formatoFecha();
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    if( entCode == "" ) { cnsUserEnt(); }
    if( entCode == "" ) { cnsUserEnt(); }
    if( entCode == "" ) { cnsUserEnt(); }
    var routeCode = $("#txtRutaRem").val();
    cnsRouteExistEnt(myUserId, routeCode);
    if( registrado == 0 ) {
        msjAlert("Ruta " + routeCode + " no pertenece a la empresa", 2);
        return;
    }
    csnRouteEnt(routeCode);
    if( siExiste == "N" ) { return; }
    abrirOpcionModal('m-CnfRemRoute');
}

function remRouteList(routeCode) {
    campoDiligenciado('RutaRem');
    $("#txtRutaRem").val(routeCode);
    remRoute();
}
    
function remRouteEnt(routeCode) {
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    if( entCode == "" ) { cnsUserEnt(); }
    if( entCode == "" ) { cnsUserEnt(); }
    if( entCode == "" ) { cnsUserEnt(); }
    var datos = conn.database().ref("entUser/" + myUserId );
    datos.orderByValue().on("value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            entUser = data.key;
            var datosX = conn.database().ref("entRoute/" + entUser + "/" + routeCode );
            datosX.update({ date : null,
                            user : null,
                            routeCode: null,
                            entCode: null
                      }).then( function() {
                            msjAlert("dato borrado correctamente", 1);
                            $("#txtRutaRem").val("");
                        } )
                        .catch(function(error) {
                            msjAlert("Error al guardar los datos: " + error, 2);
                            return;
                        });
        } );
    } );

            
            
/*            
            datosX.remove().then( function() {
                            msjAlert("dato eliminado correctamente", 1);
                        } )
                        .catch( function( error ) {
                            msjAlert("Error al borrat los datos: " + error, 2);
                            return;
                        } );
        } );
    }, function( errorObj ) {
        console.log("Error:" + errorObj.code);
    } );
*/    
}

function cnsUserExistEnt() {
    intentos = 0;
    registrado = 0;
    var dirURL = "";
    if( myUserId == "" ) initApp();
    if( myUserId == "" || myUserId == undefined ) return;
    var datos = conn.database().ref( "entUser/" + myUserId );
    datos.orderByValue().on( "value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            registrado++;
            entRoute = data.key;
            var datosX = conn.database().ref( tblRtAlt[9] + "/" + entRoute );
            datosX.orderByValue().on("value", function(snapshot) {
                snapshot.forEach( function(dataX) {
                    if (dataX.key == "est" && dataX.val() == 2) dirURL = "mapaRutaEnt.html";
                    if (dataX.key == "est" && dataX.val() != 2) dirURL = "mapaRuta.html";
                    if (dirURL != "") {
                        cambioPagina(dirURL);
                        return;
                    }
                } );
            } );
        } );
    } );    
}

function strDataRoute() {
    return;
    var elem = document.getElementById("placaRuta");
    elem.textContent = "Placa: ";
    var elem = document.getElementById("nomCoductor");
    elem.textContent = "Condutor: ";
    var elem = document.getElementById("nomRuta");
    elem.textContent = "Ruta: ";
    var elem = document.getElementById("fechaRuta");
    elem.textContent = "Fecha Inicio: ";
    var elem = document.getElementById("distanciaRuta");
    elem.textContent = "Distancia Recorrida: 0 Km";
    var elem = document.getElementById("kiloRuta");
    elem.textContent = "Velocidad Promedio: 0 Km/H";
    plateRoute = "";
    nameRoute = "";
}

function cnsDataRoute() {
    intentos = 0;
    registrado = 0;
    var codRoute = $('#txtRutaCns').val().trim();
    if( codRoute.trim() == "" ){ return; }
    var contTiempo = 0;
    console.log("CodigoRuta " + codRoute + ", " + intCnsRoute);
    var obl = new Object();
    var pos = [];
    var lat1 = 0, lon1 = 0, lat2 = 0, lon2 = 0, latAnt = 0, lonAnt = 0;
    var datos = conn.database().ref("logDetail/" + codRoute );
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            var datos = data.val();
            var obl = new Object();
            obl.latitud = datos.latitud;
            obl.longitud = datos.longitud;
            obl.fecha = datos.fecha;
            pos.push(obl);
        } );
    } );
//Consulta datos basicos
    initApp();
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    var datos = conn.database().ref( "drivervstravel" );
    datos.orderByValue().on( "value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            var datos = data.val();
            var llave = data.key;
//            console.log("Conductor " + data.key);
//            console.log("Conductor " + JSON.stringify(datos));
            var datosCon = conn.database().ref( "drivervstravel/" + llave );
            datosCon.orderByValue().on( "value", function( snapshotCon ) {
                snapshotCon.forEach( function( dataCon ) {
                    if( dataCon.key == codRoute.trim() ) {
//                        console.log("Ruta: " + dataCon.key + " CodRoute: " + codRoute);
                        var dts = dataCon.val();
                        codDriverRoute = llave;
                        nameRoute = dts.name;
                        plateRoute = dts.plate;
                        intCnsRoute++;
                    }
                } );
            } );
        } );
    } );
    if( ( intCnsRoute > 1 && intCnsRoute < 4 ) && plateRoute.trim() == "" ) {
        strDataRoute();
        cnsDataRoute();
        return;
    }
    intCnsRoute = 0;
    if( plateRoute.trim() == "" ){ strDataRoute(); return; }
    var datos = conn.database().ref( "datadriver/" + codDriverRoute );
    datos.orderByValue().on( "value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            var datos = data.val();
            var llave = data.key;
            if( llave == "lastnameconductor" ) { driverRoute = datos; }
            if( llave == "nameconductor" ) { driverRoute += " " + datos; }
            if( llave == "registerDate" ) { regDateDriver = datos; }
//            console.log("Datos " + datos + ", Llave " + llave);
        } );
    } );    
    var elem = document.getElementById("placaRuta");
    elem.textContent = "Placa: " + plateRoute;
    var elem = document.getElementById("nomCoductor");
    elem.textContent = "Condutor: " + driverRoute;
    var elem = document.getElementById("nomRuta");
    elem.textContent = "Ruta: " + nameRoute;
    var elem = document.getElementById("fechaRuta");
    elem.textContent = "Fecha Inicio: " + regDateDriver;
    console.log("Largo " + pos.length);
//    return;
    registrado = 0;
    var posGeo = 0;
    for( var i = 1; i < pos.length; i++ ) {
        lat2 = pos[i].latitud;
        lon2 = pos[i].longitud;
//        console.log("lat:" + pos[i-1].latitud + ":" + pos[i-1].longitud + ":" + pos[i].latitud + ":" + pos[i].longitud + " Reg:" + i);
//        console.log("lat:" + lat1 + ":" + lon1 + ":" + lat2 + ":" + lon2 + " Reg:" + registrado);
        if( registrado == 0 ) { 
            lat1 = pos[i-1].latitud;
            lon1 = pos[i-1].longitud;
            posGeo = getKilometros(lat1,lon1,lat2,lon2);
//            console.log("lat:" + lat1 + ":" + lon1 + ":" + lat2 + ":" + lon2 + " Reg:" + i);            
            intentos = intentos + posGeo;
//            console.log("Distancia Recorrida :" + intentos + " PosGeo:" + posGeo);
            contTiempo++;
        }
        registrado++;
        if( registrado == 19 ) {
            registrado = 0;
            continue; 
        }
    }
    var elem = document.getElementById("distanciaRuta");
    elem.textContent = "Distancia Recorrida: " + intentos.toPrecision(3) + " Km";
    var elem = document.getElementById("kiloRuta");
    elem.textContent = "Velocidad Promedio: " + intentos.toPrecision(3) + " Km/H";
//    console.log("Distancia Recorrida Final:" + intentos.toPrecision(3) + " Km");
//    console.log("Tiempo Final Final:" + parseFloat( ( contTiempo / 20 ) / 60 ).toPrecision(2) + " Horas" );
}

function cnsUrlRoute() {
    var route = $('#txtRutaUrl').val();
    if( route == "" ){ return; }
    console.log("Ruta:" + markers.length);
    if( markers.includes(route) ) {
        console.log("RutaS:" + markers.includes(route));
        for( var x in markers ) {
            console.log("RutaM:" + markers[x].ruta);
            if( markers[x].ruta == route ) {
                console.log("URlM:" + markers[x].url);
                var url = "<iframe width='560' height='315' src='" + markers[x].url + "' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>";
                
            }
        }
//        https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG
    } else {
        var elem = document.getElementById("youtubeFrame");
        elem.textContent = "Ruta " + route + " no pertenece a la empresa";
        elem.setAttribute("style", "color: #DF0101");
    }

}

function createEnterprise() {
    formatoFecha();
    obtenercodEmp("EMP");
    console.log(codRuta);
    if(codRuta == ""){ return; }
    var datos = conn.database().ref("entGroup/" + codRuta );
    datos.set({  dir: "Calle " + codRuta,
                 est: 1,
                 fecreg: fecha,
                 nit: "80000000",
                 tel: "300456889",
                 nom: "Empresa " + codRuta,
                 entCode: codRuta
    }).then( function() {
        msjAlert("dato almacenado correctamente", 1);
        $("#txtRuta").val("");
    }).catch(function(error) {
            msjAlert("Error al guardar los datos: " + error, 2);
    });
}

function confirmaAddRoute() {
    var newCar = $('#txtRuta').val();
    if( newCar.trim() == "" ){ return; }
    newCar = minToMayus(newCar);
    var datos = conn.database().ref("datacar/" + newCar );
    datos.set({ coderoute : "",
                distancia : 0,
                latitud: myLat,
                longitud: myLong
    }).then( function() {
//        msjAlert("dato almacenado correctamente", 1);
    }).catch(function(error) {
        msjAlert("Error al guardar los datos: " + error, 2);
        return;
    });
    var datos = conn.database().ref("datacars/" + newCar );
    datos.set({ matricula : newCar
    }).then( function() {
        msjAlert("dato almacenado correctamente", 1);
    }).catch(function(error) {
        msjAlert("Error al guardar los datos: " + error, 2);
        return;
    });
    lastRouteAdded = newCar;
    addRoute();
}

function sendNotification(who) {
    var msg = $('#notificacion').val();
    var hora = new Date();
    var meridiano = hora.getHours()>12?"p.m.":"a.m.";
    var momento = hora.getHours() + ":" + hora.getMinutes() + " " + meridiano;
    if (who == "forMe") {
        var datos = conn.database().ref("alert/" + codeRouteSel);
        datos.set({
            type: 9,
            hour: momento,
            message: msg,
            sended: 0
        }).then(function () {
            document.getElementById('footer').innerHTML = '<strong>Notificación enviada la ruta ' + codeRouteSel + '...<strong>';
            document.getElementById('footer').style.display='block';
            setTimeout("document.getElementById('footer').style.display='none';", 5000);
            $('#notificacion').val('');
        }).catch(function (error) {
            msjAlert("Error mensaje enviado: " + error, 2);
            return;
        });
    }
    if (who == "forAll") {
        var msgSend = 0;
        var datos = conn.database().ref("alert");
        datos.orderByValue().on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                var codeRouteSelect = data.key;
                var datos = conn.database().ref("alert/" + codeRouteSelect);
                datos.set({
                    type: 9,
                    hour: momento,
                    message: msg,
                    sended: 0
                }).then(function () {
                    msgSend++;
                    $('#notificacion').val('');
                    document.getElementById('footer').innerHTML = '<strong>Notificación enviada a todas las rutas...<strong>';
                    document.getElementById('footer').style.display='block';
                    setTimeout("document.getElementById('footer').style.display='none';", 5000);
                }).catch(function (error) {
                    msjAlert("Error mensaje enviado: " + error + " Ruta: " + codeRouteSelect, 2);
                });
            });
        });
        if(msgSend > 0) {
            $('#notificacion').val('');
        }
    }
}

function addRouteEnt() {
    formatoFecha();
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    if( entCode == "" ) { cnsUserEnt(); }
    if( entCode == "" ) { cnsUserEnt(); }
    if( entCode == "" ) { cnsUserEnt(); }
    var routeCode = $("#txtRuta").val();
    routeCode = minToMayus(routeCode);
    cnsRouteExistEnt(myUserId, routeCode);
    if( registrado > 0 ) {
        msjAlert("Ruta " + routeCode + " ya fue registrada", 2);
        return;
    }
    if( lastRouteAdded == routeCode ) {
        console.log("UltimaRuta Registrada: "+lastRouteAdded);
        return;
    }
    lastRouteAdded = routeCode;
    csnRouteEnt(routeCode);
    var datos = conn.database().ref( tblRtAlt[8] + "/" + myUserId );
    console.log(datos.toString());
    datos.orderByValue().on("value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            entUser = data.key;
            var datosX = conn.database().ref( tblRtAlt[2] + "/" + entUser + "/" + lastRouteAdded );
            datosX.set( { date: fecha,
                          user: myUserId,
                          routeCode: lastRouteAdded,
                          plateCode: codRuta,
                          entCode: entUser
            } ).then( function () {
                msjAlert("dato almacenado correctamente", 1);
                console.log(datosX + "dato almacenado correctamente 2");
                $("#txtRuta").val("");
            } ).catch( function (error) {
                    msjAlert("2 Error al guardar los datos: " + error, 2);
                    return;
                } );
        } );
    }, function( errorObj ) {
        console.log("Error:" + errorObj.code);
        return;
    } );
    complementData(1);
    listVehicle();
}

function confirmaAddRouteEnt() {
    var newCar = $('#txtRuta').val();
    var nameRoute = $('#txtNewRoute').val();
    if( newCar.trim() == "" ){
        msjAlert("No ha ingresado un numero de placa", 2);
        return;
    }
    if( nameRoute.trim() == "" ){
        msjAlert("No ha ingresado un nombre de ruta", 2);
        return;
    }
    newCar = minToMayus(newCar);
    getCodRoute();
    var datos = conn.database().ref(tblRtAlt[3] + "/" + newCar );
    datos.set({ coderoute : codRuta,
        distancia : 0,
        latitud: myLat,
        longitud: myLong
    }).then( function() {
        console.log("dato almacenado correctamente 3");
    }).catch(function(error) {
        msjAlert("3 Error al guardar los datos: " + error, 2);
        return;
    });
    var datos = conn.database().ref(tblRtAlt[4] + "/" + newCar );
    datos.set({ matricula : newCar
    }).then( function() {
        console.log("dato almacenado correctamente 4");
    }).catch(function(error) {
        msjAlert("4 Error al guardar los datos: " + error, 2);
        return;
    });
    addRouteEnt();
}

function complementData(validate) {
    var nameRoute = $('#txtNewRoute').val();
    if (validate != 1) {
        lastRouteAdded = plateRouteSel;
        if( myUserId == "" ) { initApp(); }
        getCodRoute();
    }
    var datos = conn.database().ref(tblRtAlt[5] + "/" + myUserId + "/" + codRuta );
    datos.set({ id: codRuta,
                name: nameRoute,
                paradas: 0,
                placa: lastRouteAdded,
                preruta: 2
    } ).then( function() {
        console.log("dato almacenado correctamente 5");
    } ).catch( function(error) {
        msjAlert("5 Error al guardar los datos: " + error, 2);
        return;
    });
    var datos = conn.database().ref(tblRtAlt[6] + "/" + codRuta );
    datos.set({ estado: 0,
                hourfin: "",
                latitud: myLat,
                longitud: myLong,
                tiempo: 0,
                tipo: 0,
                velocidad: 0
    } ).then( function() {
        console.log("dato almacenado correctamente 6");
    } ).catch( function(error) {
        msjAlert("6 Error al guardar los datos: " + error, 2);
        return;
    });
    var datos = conn.database().ref(tblRtAlt[7] + "/" + lastRouteAdded );
    datos.set({ keyid: myUserId
    } ).then( function() {
        console.log("dato almacenado correctamente 7");
    } ).catch( function(error) {
        msjAlert("7 Error al guardar los datos: " + error, 2);
        return;
    });
}

function setNewAccessPoint() {
    var nameEmp = $("#txtEmpleado").val();
    var address = $("#txtDireccion").val();
    var cellPhone = $("#txtCelularX").val();
    if (nameEmp == "") {
        msjAlert("No ha ingresado el nombre del empleado", 2);
        return;
    }
    if (address == "") {
        msjAlert("No ha ingresado la dirección", 2);
        return;
    }
    if (cellPhone == "") {
        msjAlert("No ha ingresado el número celular", 2);
        return;
    }
    getCodePoint();
    getLatLngDireccion(address, nameEmp, cellPhone);
}

function setPositionPoint(address, nameEmp, cellPhone) {
    var codeRouteWorker = "";
    if (latLocal == 0 || lngLocal == 0) {
        msjAlert("No ha ingresado una dirección correcta", 2);
        return;
    }
    if ($("#ckbPuntoLlegada").is(':checked')) {
        codeRouteWorker = codeRouteSel + "ZZSCHOOL";
        imageSchool = 'schoolmarket';
    }
    else {
        codeRouteWorker = codeRouteSel + alphaUp[codePoint];
        imageSchool = 'marketend';
    }
    console.log("codeRouteWorker: " + codeRouteWorker);
    var datos = conn.database().ref(tblRtAlt[10] + "/" + codeRouteWorker + "/" + codeRouteSel);
    datos.set({ alerttone: 1000,
                code: codeRouteSel,
                nameroute: nameRouteSel
    } ).then( function() {
        console.log("dato almacenado correctamente 10");
    } ).catch( function(error) {
        msjAlert("10 Error al guardar los datos: " + error, 2);
        return;
    });
    var datos = conn.database().ref(tblRtAlt[11] + "/" + codeRouteSel + "/" + codeRouteWorker);
    datos.set({ check: 'n',
                childname: nameEmp,
                code: codeRouteSel,
                direccion: address,
                distance: 100000,
                icon: imageSchool,
                iconface: 'R.drawable.' + imageSchool,
                id: codeRouteWorker,
                latitud: latLocal,
                longitud: lngLocal,
                messageuser: 'go',
                nametutor: nameEmp,
                phone: cellPhone,
                stoped: 1
    } ).then( function() {
    console.log("dato almacenado correctamente 11");
    } ).catch( function(error) {
        msjAlert("11 Error al guardar los datos: " + error, 2);
        return;
    });
    var datos = conn.database().ref(tblRtAlt[12] + "/" + codeRouteWorker);
    datos.set({ phone: cellPhone,
                user: codeRouteWorker
    } ).then( function() {
        console.log("dato almacenado correctamente 12");
    } ).catch( function(error) {
        msjAlert("12 Error al guardar los datos: " + error, 2);
        return;
    });
    msjAlert('<lu><li>' + "El empleado: " + $("#txtEmpleado").val() + '</li><li>' + ", dirección: " + $("#txtDireccion").val()+ ", Celular: " + $("#txtCelularX").val() + ", ha sido registrado correctamente", 1);
    $("#txtEmpleado").val("");
    $("#txtDireccion").val("");
    $("#txtCelularX").val("");
}

function getLatLngDireccion(address, nameEmp, CellPhone) {
    var geocoder = new google.maps.Geocoder();
    latLocal = 0;
    lngLocal = 0;
    if (address != "") {
 // Llamamos a la función geodecode pasandole la dirección que hemos introducido en la caja de texto.
        geocoder.geocode({ 'address': address}, function(results, status) {
            if (status == 'OK') {
// Mostramos las coordenadas obtenidas en el p con id coordenadas
//                msjAlert('Coordenadas:   ' + results[0].geometry.location.lat() + ', ' + results[0].geometry.location.lng(),1);
                latLocal = results[0].geometry.location.lat();
                lngLocal = results[0].geometry.location.lng();
                setPositionPoint(address, nameEmp, CellPhone);
// Posicionamos el marcador en las coordenadas obtenidas
//                map.marker.setPosition(results[0].geometry.location);
// Centramos el mapa en las coordenadas obtenidas
//                map.map.setCenter(map.marker.getPosition());
//                agendaForm.showMapaEventForm();
            } else {
                msjAlert("Error al obtener coordenadas de la dirección: " + status, 2);
                console.log("Error getLatLngDireccion(): " + status);
            }
        });
    }
}

function getCodePoint() {
    codePoint = 0;
    var datos = conn.database().ref(tblRtAlt[11] + "/" + codeRouteSel);
    datos.orderByValue().on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            codePoint++;
        });
    });
//    console.log("codePoint: " + codePoint);
}

function setStopped() {
    var datosX = conn.database().ref(tblRtAlt[5] + "/" + myUserId + "/" + codeRouteSel);
    getCodePoint();
    datosX.update({ paradas: codePoint
    }).then(function () {
        console.log("Paradas guardadas");
    }).catch(function (error) {
        console.log("Error al actualizar las paradas: " + error);
    });
}