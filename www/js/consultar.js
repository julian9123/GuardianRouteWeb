'use strict';

var fecha;
var posRuta = {};
var gpRutas = [];
var siExiste = "N";
var siEliminar = "N";
var driverRoute = "";
var regDateDriver = "";
var plateRoute = "";
var nameRoute = "";
var codDriverRoute = "";
var codDriverKey;
var intCnsRoute = 0;
var lastRouteAdded = "";
var latLocal;
var lngLocal;
var codePoint = 0;
var imageSchool;
var myTypeRoute = "";
var tableRef;
var refStorages = "";
var source;
var titlePlate;
var startDate;
var endDate;
var numberDoc;
var nameDocument;
var upLoadDoc;
var docDriver;
var UpLoadResult;
var resultValidate;
var dataDriverUpdate = [];
var onlySave = 0;
var docsPdf = ['cedula_ciudadania.pdf', 'licencia_conduccion.pdf', 'hoja_de_vida.pdf', 'soat.pdf', 'matricula.pdf', 'tecnomecanica.pdf', 'tarjeta_funcionamiento.pdf'];

function d2(n) {
    if(n<9) return "0"+n;
    return n;
}

function formatoFecha() {
    fecha = new Date();
    var sDate = fecha.getFullYear() + "-" + d2(parseInt(fecha.getMonth()+1)) + "-" + d2(fecha.getDate()) + " " + d2(fecha.getHours()) + ":" + d2(fecha.getMinutes()) + ":" + d2(fecha.getSeconds());
    fecha = sDate;
}

function formatoHora() {
    var hora = new Date();
    var meridiano = hora.getHours()>12?"P.M.":"A.M.";
    var momento = hora.getHours() + ":" + hora.getMinutes() + " " + meridiano;
    return momento;
}

function formatoFechaCorta() {
    fecha = new Date();
    var sDate = fecha.getFullYear() + "" + d2(parseInt(fecha.getMonth()+1)) + "" + d2(fecha.getDate());
    return sDate;
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
    elem.removeAttribute("class");
    elem.setAttribute("class", "textFormatoError");
    abrirOpcionModal("m-msjError");
}

function registroDatos() {
    var msjError = '';
    userName = $('#txtNombres').val();
    if (userName == "") {
        msjError = 'Debes ingresar por lo menos un nombre para continuar';
        formatoMsjDialog("dataError1", msjError);
        return;
    }
    userLastName = $('#txtApellidos').val();
    if (userLastName == "") {
        msjError = 'Debes ingresar por lo menos un apellido para continuar'; 
        formatoMsjDialog("dataError1", msjError);
        return;
    }
    var pais = document.getElementById("paisCelular");
    var paisSel = pais.options[pais.selectedIndex].value;
    if( paisSel == "" ) {
        msjError = 'Debes seleccionar un indicativo para continuar';
        formatoMsjDialog("dataError1", msjError);
        return;
    }
    userCellPhone = $('#txtCelular').val();
    if (userCellPhone == "") {
        msjError = 'Debes ingresar un numero celular para continuar'; 
        formatoMsjDialog("dataError1", msjError);
        return;
    }
    var codRutaTmp = $('#txtCodRuta').val();
    if (codRutaTmp == "") {
        msjError = 'Debes ingresar el codigo de la empresa para continuar'; 
        formatoMsjDialog("dataError1", msjError);
        return;
    }
    cnsEntGroup(codRutaTmp);
    var datos = conn.database().ref(tblRtAlt[9] + "/" + codRutaTmp);
    datos.orderByValue().on( "value", function( snapshot ) {
        entUser = snapshot.child('entCode').val();
        if (entUser == null) {
            msjError = "Código de empresa erróneo. Comuníquese a la linea de soporte 3214745999 o escribanos soporteguardianrutas@gmail.com";
            formatoMsjDialog("dataError1", msjError);
            codRutaTmp = "";

        } else {
            if( myUserId == "" ){ initApp(); }
            userName = getCapitalLetter(userName);
            userLastName = getCapitalLetter(userLastName);
            var datos = conn.database().ref(tblRtAlt[8] + "/" + myUserId + "/" + codRutaTmp );
            datos.set({ userName : userName,
                        userlastName : userLastName,
                        userCellPhone : userCellPhone,
                        paisSel : paisSel
            }).then( function() {
                console.log('dato almacenado correctamente');
                cambioPagina('mapaRuta.html');

            }).catch(function(error) {
                setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[8], 'registroDatos');
                console.log('detectado un error', error);
            });
        }
    });

}

function cnsUsuarioEmpresa() {

    var timeOut;
    intentos = 0;
    registrado = 0;

    if (entUser != "" && entUser != undefined) return;
    initApp();
    if (myUserId == undefined || myUserId == "") {
        timeOut = setTimeout(cnsUsuarioEmpresa, 1000);
        return;
    } else
        clearTimeout(timeOut);

    var datos = conn.database().ref(tblRtAlt[8] + "/" + myUserId );
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            registrado++;
            entUser = data.key;
            if (entUser == "" || entUser == undefined || entUser == null) {
                msjAlert('Usted no esta autorizado para ingresar a esta opción', 2);
                setTimeout(function () {
                    cambioPagina('index.html');
                }, 5000);
                return;
            }
            var datosX = conn.database().ref( tblRtAlt[9] + "/" + entUser );
            datosX.orderByValue().on("value", function(snapshot) {
                entChoose = "";
                var est = snapshot.child('est').val();
                if (est == 2) entChoose = "enterprise";
/*
                snapshot.forEach( function(dataX) {
                    if (dataX.key == "est" && dataX.val() == 2) entChoose = "enterprise";
                } );
*/
            } );
        } );
    } );
    if (entUser == undefined || entUser == "")
        timeOut = setTimeout(cnsUsuarioEmpresa, 1000);
    else
        clearTimeout(timeOut);
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
            elem.setAttribute("class", "textConfirmVehicleTrue");
//            var elemB = document.getElementById("btnARDialog");
//            if( elemB != undefined ) elemB.removeAttribute("disabled");
            var elemR = document.getElementById("routeFindRem");
            if( elemR != undefined ) elemR.textContent = "Vehiculo encontrado: " + ruta;
            if( elemR != undefined ) elemR.setAttribute("class", "textConfirmVehicleTrue");
        } );
    } );    
    if( srRoute == 0 ) {
        var elemD = document.getElementById("routeFind");
        elemD.textContent = "Vehiculo no encontrado";
        elemD.setAttribute("class", "textConfirmVehicleFalse");
//        var elemB = document.getElementById("btnARDialog");
//        elemB.setAttribute("disabled", "true");
        var elemDR = document.getElementById("routeFindRem");
        elemDR.textContent = "Vehiculo no encontrado";
        elemDR.setAttribute("class", "textConfirmVehicleFalse");
        abrirOpcionModal('m-CnfAddRoute');
    }
}

function cnsUserEnt() {

    intentos = 0;
    registrado = 0;
    var timeOut;

    initApp();
    if (myUserId == undefined || myUserId == "") {
        timeOut = setTimeout(cnsUserEnt, 1000);
        return;
    } else
        clearTimeout(timeOut);

    var datos = conn.database().ref("entUser/" + myUserId );
    datos.orderByValue().on("value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            entUser = data.key;
            entCode = data.key;
            registrado = 1;
        } );
    }, function( errorObj ) {
        console.log("Error:" + errorObj.code);
    } );

    if (entCode == "" || entCode == undefined)
        timeOut = setTimeout(cnsUserEnt, 1000);
    else
        clearTimeout(timeOut);
}

function msjAlert(msjTxt, opcion) {
    abrirOpcionModal('m-MsjAds');
    var elem = document.getElementById("msjAds");
    if (opcion == 1) {
//        elem.textContent = msjTxt;
        elem.innerHTML = msjTxt;
        elem.setAttribute("style", "color: #000000");
    }
    if (opcion == 2) {
        elem.innerHTML = msjTxt;
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
        console.log("UltimaRuta Registrada: "+lastRouteAdded);
        return;
    }
    lastRouteAdded = routeCode;
    csnRouteEnt(routeCode);
    var datos = conn.database().ref( tblRtAlt[8] + "/" + myUserId );
    datos.orderByValue().on("value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            entUser = data.key;
            if (codRuta == undefined) codRuta = "";
            var datosX = conn.database().ref(tblRtAlt[2] + "/" + entUser + "/" + lastRouteAdded);
            datosX.set({ date: fecha,
                         user: myUserId,
                         routeCode: codRuta,
                         plateCode: lastRouteAdded,
                         entCode: entUser
            } ).then( function () {
                msjAlert("dato almacenado correctamente", 1);
                closePopUp('m-AddRoute');
//                console.log(datosX + "dato almacenado correctamente 2");
                $("#txtRuta").val("");
            } ).catch( function (error) {
                setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[2], 'addRoute');
                msjAlert("2 Error al guardar los datos: " + error, 2);

            } );
        } );
    }, function( errorObj ) {
        console.log("Error:" + errorObj.code);

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
        entUser = snapshot.child('entCode').val();
//        console.log('cnsEntGroup: ' + entUser);
/*
        snapshot.forEach( function( data ) {
            registrado++;
            entUser = data.key;
            return;
        } );
*/
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
    var elemR = document.getElementById("routeFindRem");
    if( elemR != undefined ) elemR.textContent = "";

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
    if( entCode == "" ) { cnsUserEnt(); }

    var routeCode = $("#txtRutaRem").val();
    if (routeCode == "") return;
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

    if( myUserId == "" ) initApp();
    if( entCode == "" ) cnsUserEnt();

    var datos = conn.database().ref("entUser/" + myUserId );
    datos.orderByValue().on("value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            entUser = data.key;
            var datosX = conn.database().ref("entRoute/" + entUser + "/" + routeCode);
            datosX.remove().then( function() {
                $("#txtRutaRem").val("");
                msjAlert("Vehiculo desvinculado correctamente", 1);
            } )
            .catch(function(error) {
                setLogErrorData('Error: ' + error, 'Borrar', 'entRoute', 'remRouteEnt');
                msjAlert("Error al borrar el vehiculo: " + error, 2);

            });
        } );
    } );
    location.reload(true);

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
                    if (dataX.key == "est" && dataX.val() == 2) entChoose = "enterprise";
                    if (dataX.key == "est" && dataX.val() != 2) entChoose = "";
//                    console.log("cnsUserExistEnt:" + entChoose);
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
//    console.log("CodigoRuta " + codRoute + ", " + intCnsRoute);
    var obl = {};
    var pos = [];
    var lat1 = 0, lon1 = 0, lat2 = 0, lon2 = 0, latAnt = 0, lonAnt = 0;
    var datos = conn.database().ref("logDetail/" + codRoute );
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            var datos = data.val();
            var obl = {};
            obl.latitud = datos.latitud;
            obl.longitud = datos.longitud;
            obl.fecha = datos.fecha;
            pos.push(obl);
        } );
    } );
//Consulta datos basicos
    initApp();
    if (myUserId == "") initApp();
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
//    console.log("Ruta:" + markers.length);
    if( markers.includes(route) ) {
//        console.log("RutaS:" + markers.includes(route));
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
        setLogErrorData('Error: ' + error, 'Insertar', entGroup, 'createEnterprise');
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
        setLogErrorData('Error: ' + error, 'Insertar', 'datacar', 'confirmaAddRoute');
        msjAlert("Error al guardar los datos: " + error, 2);

    });
    var datos = conn.database().ref("datacars/" + newCar );
    datos.set({ matricula : newCar
    }).then( function() {
//        msjAlert("dato almacenado correctamente", 1);
    }).catch(function(error) {
        setLogErrorData('Error: ' + error, 'Insertar', 'datacars', 'confirmaAddRoute');
        msjAlert("Error al guardar los datos: " + error, 2);

    });
    addRoute();
}

function sendNotification(who) {

    var timeOut;
    var msg = $('#notificacion').val();
    var hora = new Date();
    var meridiano = hora.getHours()>12?"p.m.":"a.m.";
    var momento = hora.getHours() + ":" + hora.getMinutes() + " " + meridiano;

    if (who === "forMe") {
        var datos = conn.database().ref(tblRtAlt[0] + "/" + codeRouteSel);
        datos.set({ type: 9,
                    hour: momento,
                    message: msg,
                    sended: 0
        }).then(function () {
            document.getElementById('footer').innerHTML = '<strong>Notificación enviada la ruta ' + codeRouteSel + '...<strong>';
            document.getElementById('footer').setAttribute('class','visible');
            timeOut = setTimeout("document.getElementById('footer').setAttribute('class','invisible')", 5000);
            $('#notificacion').val('');
        }).catch(function (error) {
            setLogErrorData('Error: ' + error, 'Insertar', 'alert', 'sendNotification');
            msjAlert("Error mensaje enviado: " + error, 2);
            clearTimeout(timeOut);
        });
    }

    if (who === "forAll") {

        var msgSend = 0;
        for( var x = 0; x < markers.length; x++ ) {
            var placa = markers[x].placa;
            var datos = conn.database().ref(tblRtAlt[5] + '/' + placa);
            datos.orderByValue().on("value", function (snapshot) {
                snapshot.forEach(function (data) {
                    var codeRouteSelect = data.val();
                    var datosX = conn.database().ref(tblRtAlt[0] + "/" + codeRouteSelect.id);
                    datosX.set({ type: 9,
                        hour: momento,
                        message: msg,
                        sended: 0
                    }).then(function () {
                        msgSend++;
                        if (msgSend === snapshot.numChildren()) {
                            $('#notificacion').val('');
                            document.getElementById('footer').innerHTML = '<strong>Notificación enviada a todas las rutas...<strong>';
                            document.getElementById('footer').setAttribute('class', 'visible');
                            timeOut = setTimeout("document.getElementById('footer').setAttribute('class', 'invisible');", 5000);
                        }
                    }).catch(function (error) {
                        setLogErrorData('Error: ' + error, 'Insertar', 'alert', 'sendNotification');
                        msjAlert("Error mensaje enviado: " + error + " Ruta: " + codeRouteSelect, 2);
                        clearTimeout(timeOut);
                    });
                });
            });
        }
    }
}

function addRouteEnt() {

    formatoFecha();
    if( myUserId == "" ) { initApp(); }
    if( entCode == "" ) { cnsUserEnt(); }

    var routeCode = $("#txtRuta").val();

    if (routeCode.trim().length < 6) return;
    if (routeCode.trim() == "") return;
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
    var datos = conn.database().ref(tblRtAlt[8] + "/" + myUserId);
    datos.orderByValue().on("value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            entUser = data.key;
            var datosX = conn.database().ref( tblRtAlt[2] + "/" + entUser + "/" + lastRouteAdded );
            datosX.set( { date: fecha,
                          user: myUserId,
                          routeCode: codRuta,
                          plateCode: lastRouteAdded,
                          entCode: entUser
            } ).then( function () {
                console.log("dato almacenado correctamente 2");
            } ).catch( function (error) {
                setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[2], 'addRouteEnt');
                msjAlert("2 Error al guardar los datos: " + error, 2);
                var elem = document.getElementById("routeFind");
                elem.textContent = "";
                $("#txtRuta").val("");
                $('#txtNewRouteV').val("");

            } );
        } );
    }, function( errorObj ) {
        console.log("Error:" + errorObj.code);
        var elem = document.getElementById("routeFind");
        elem.textContent = "";
        $("#txtRuta").val("");
        $('#txtNewRouteV').val("");

    } );
    closePopUp('m-CnfAddRoute');
    complementData(1);
    listVehicle();
    var elem = document.getElementById("routeFind");
    elem.textContent = "";
    $("#txtRuta").val("");
    $('#txtNewRouteV').val("");

}

function confirmaAddRouteEnt() {

    var newCar = $('#txtRuta').val();
    var nameRoute = $('#txtNewRouteV').val();
    var typeRoute = 0;
    var opcion = document.getElementById("txtOptEnt1");
    var opc = opcion.options[opcion.selectedIndex].value;

    if (newCar.trim() == "") {
        msjAlert("No ha ingresado un numero de placa", 2);
        return;
    }
    if (nameRoute.trim() == "") {
        msjAlert("No ha ingresado un nombre de ruta", 2);
        return;
    }
    if (opc == 'escolar')
        typeRoute = 0;
    if (opc == 'empresarial')
        typeRoute = 1;
    if (opc == "") {
        msjAlert('No ha seleccionado el tipo de ruta', 2);
        return;
    }

    myTypeRoute = opc;
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
        setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[3], 'confirmaAddRouteEnt');
        msjAlert("3 Error al guardar los datos: " + error, 2);

    });
    var datos = conn.database().ref(tblRtAlt[4] + "/" + newCar );
    datos.set({ matricula : newCar
    }).then( function() {
        console.log("dato almacenado correctamente 4");
    }).catch(function(error) {
        setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[4], 'confirmaAddRouteEnt');
        msjAlert("4 Error al guardar los datos: " + error, 2);

    });
    addRouteEnt();
}

function complementData(validate) {

    var nameRoute = $('#txtNewRouteV').val();
    if (nameRoute == "") nameRoute = $('#txtNewRoute').val();
    var typeRoute = 0;
    var opcion, opc;

    if (myTypeRoute == "") {
        opcion = document.getElementById("txtOptEnt");
        opc = opcion.options[opcion.selectedIndex].value;
    } else {
        opc = myTypeRoute;
    }
    if (opc == 'escolar')
        typeRoute = 0;
    if (opc == 'empresarial')
        typeRoute = 1;

    if (nameRoute == "") {
        msjAlert('No ha ingresado el nombre de ruta', 2);
        return;
    }
    if (opc == "") {
        msjAlert('No ha seleccionado el tipo de ruta', 2);
        return;
    }

    if (validate != 1) {

        if( myUserId == "" ) initApp();

        lastRouteAdded = plateRouteSel;
        nameRoute = $('#txtNewRoute').val();
        $('#txtOptEnt').get(0).selectedIndex = 0;
        $('#txtOptEnt1').get(0).selectedIndex = 0;
        getCodRoute();
    }
    nameRoute = getCapitalLetter(nameRoute);
    var datos = conn.database().ref(tblRtAlt[5] + "/" + lastRouteAdded + "/" + codRuta );
    datos.set({ id: codRuta,
                name: nameRoute,
                paradas: 0,
                placa: lastRouteAdded,
                preruta: 2,
                tiporuta: typeRoute,
                controlida: 0,
                controlregreso: 0
    } ).then( function() {
        console.log("dato almacenado correctamente 5");
    } ).catch( function(error) {
        setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[5], 'complementData');
        msjAlert("5 Error al guardar los datos: " + error, 2);
        resetComplementData();

    });
    var datos = conn.database().ref(tblRtAlt[6] + "/" + codRuta );
    datos.set({ estado: 0,
                hourfin: "",
                latitud: myLat,
                longitud: myLong,
                tiempo: 0,
                tipo: 0,
                velocidad: 0,
                parada:0
    } ).then( function() {
        console.log("dato almacenado correctamente 6");
    } ).catch( function(error) {
        setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[6], 'complementData');
        msjAlert("6 Error al guardar los datos: " + error, 2);
        resetComplementData();

    });
    if (validate == 1) {
        var datos = conn.database().ref(tblRtAlt[7] + "/" + lastRouteAdded);
        datos.set({
            keyid: myUserId
        }).then(function () {
            console.log("dato almacenado correctamente 7");
        }).catch(function (error) {
            setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[7], 'complementData');
            msjAlert("7 Error al guardar los datos: " + error, 2);
            resetComplementData();

        });
    }
/*
    var datos = conn.database().ref(tblRtAlt[15] + "/" + lastRouteAdded + "/" + codRuta);
    datos.set({ id: codRuta,
                name: nameRoute,
                paradas: 0,
                placa: lastRouteAdded,
                preruta: 0
    } ).then( function() {
        console.log("dato almacenado correctamente 8");
    } ).catch( function(error) {
        msjAlert("8 Error al guardar los datos: " + error, 2);
        resetComplementData();
        return;
    });
*/
    var datos = conn.database().ref(tblRtAlt[0] + "/" + codRuta);
    datos.set({ hour: '00:00 a.m.',
                type: 0
    } ).then( function() {
        console.log("dato almacenado correctamente 9");
    } ).catch( function(error) {
        setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[0], 'complementData');
        msjAlert("9 Error al guardar los datos: " + error, 2);
        resetComplementData();

    });
    if (validate == 1)
        msjAlert('Vehículo ' + minToMayus($('#txtRuta').val()) + ' vinculado', 1);
    else {
        if ($('#txtNewRoute').val() != "")
            msjAlert('Ruta ' + getCapitalLetter($('#txtNewRoute').val()) + ' creada', 1);
        if ($('#txtNewRouteV').val() != "")
            msjAlert('Ruta ' + getCapitalLetter($('#txtNewRouteV').val()) + ' creada', 1);
    }

    resetComplementData();
    deleteLi("listaRutas");
    getDataCar("Placa: " + lastRouteAdded);
    closePopUp('m-CnfAddNewRoute');


}

function resetComplementData() {
    $('#txtNewRoute').val("");
    plateRouteSel = "";
    $('#txtNewRouteV').val("");
    $('#txtOptEnt').get(0).selectedIndex = 0;
    $('#txtOptEnt1').get(0).selectedIndex = 0;
    myTypeRoute = "";
}

function setNewAccessPoint() {

    var nameEmp = $("#txtEmpleado").val();
    var address = $("#txtDireccion").val();
    var ciudad = $("#txtCiudad").val();
    var cellPhone = $("#txtCelularX").val();
    if (nameEmp == "") {
        msjAlert("No ha ingresado el nombre del usuario", 2);
        return;
    }
    if (address == "") {
        msjAlert("No ha ingresado la dirección", 2);
        return;
    }
    if (ciudad == "") {
        msjAlert("No ha ingresado la ciudad", 2);
        return;
    }
    if (cellPhone == "") {
        msjAlert("No ha ingresado el número celular", 2);
        return;
    }
    nameEmp = getCapitalLetter(nameEmp);
    getCodePoint();
    address = getCapitalLetter(address);
    ciudad = getCapitalLetter(ciudad);
    address = address + ' ' + ciudad;
    console.log('setNewAccessPoint ' + address);
    return;
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
        var datos = conn.database().ref(tblRtAlt[6] + "/" + codeRouteSel);
        var hora = formatoHora();
        datos.update({ estado: 2,
                       hourfin: hora
        }).then(function () {
            console.log("setNewAccessPoint Parada llegada: " + codeRouteSel);
        }).catch(function (error) {
            setLogErrorData('Error: ' + error, 'Actualizar', tblRtAlt[6], 'setPositionPoint');
            console.log("Error al actualizar parada llegada: " + error);
        });
        var datos = conn.database().ref(tblRtAlt[5] + "/" + plateRouteSel + "/" + codeRouteSel);
        var hora = formatoHora();
        datos.update({ preruta: 1
        }).then(function () {
            console.log("setNewAccessPoint Parada llegada2: " + codeRouteSel);
        }).catch(function (error) {
            setLogErrorData('Error: ' + error, 'Actualizar', tblRtAlt[5], 'setPositionPoint');
            console.log("Error al actualizar parada llegada2: " + error);
        });
    }
    else {
        codeRouteWorker = codeRouteSel + alphaUp[codePoint];
        imageSchool = 'marketend';
    }
//    console.log("codeRouteWorker: " + codeRouteWorker);
    var datos = conn.database().ref(tblRtAlt[10] + "/" + codeRouteWorker + "/" + codeRouteSel);
    datos.set({ alerttone: 1000,
                code: codeRouteSel,
                nameroute: nameRouteSel
    } ).then( function() {
        console.log("dato almacenado correctamente 10");
    } ).catch( function(error) {
        setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[10], 'setPositionPoint');
        msjAlert("10 Error al guardar los datos: " + error, 2);

    });
    datos = conn.database().ref(tblRtAlt[11] + "/" + codeRouteSel + "/" + codeRouteWorker);
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
                stopedregreso: 0,
                stopedida: 0
    } ).then( function() {
    console.log("dato almacenado correctamente 11");
    } ).catch( function(error) {
        setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[11], 'setPositionPoint');
        msjAlert("11 Error al guardar los datos: " + error, 2);

    });
    datos = conn.database().ref(tblRtAlt[12] + "/" + codeRouteWorker);
    datos.set({ phone: cellPhone,
                user: codeRouteWorker
    } ).then( function() {
        console.log("dato almacenado correctamente 12");
    } ).catch( function(error) {
        setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[12], 'setPositionPoint');
        msjAlert("12 Error al guardar los datos: " + error, 2);

    });
    msjAlert("El usuario: " + getCapitalLetter($("#txtEmpleado").val()) + ", dirección: " + getCapitalLetter($("#txtDireccion").val()) + " " + getCapitalLetter($("#txtCiudad").val()) +", Celular: " + $("#txtCelularX").val() + ", ha sido registrado correctamente", 1);
    $("#txtEmpleado").val("");
    $("#txtDireccion").val("");
    $("#txtCelularX").val("");
    $("#txtCiudad").val("");
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
                centerMap =0;
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
        codePoint = snapshot.numChildren();
        if (codePoint > 1) codePoint++;
    });
//    console.log("codePoint: " + codePoint);
}

function setStopped() {
    var datosX = conn.database().ref(tblRtAlt[5] + "/" + plateRouteSel + "/" + codeRouteSel);
    getCodePoint();
    datosX.update({ paradas: codePoint
    }).then(function () {
        console.log("setStopped Parada guardada: " + codeRouteSel);
    }).catch(function (error) {
        setLogErrorData('Error: ' + error, 'Actualizar', tblRtAlt[5], 'setStopped');
        console.log("Error al actualizar las paradas: " + error);
    });
}

function getDataCar(urlCarSel) {

    var indOf = urlCarSel.indexOf('Placa: ');

    deleteLi("listaRutas");
    cnsUserExistEnt();
    plateRouteSel = "";
    codDriverKey = "";
    document.getElementById('codePlaca').innerHTML = "";

    if (indOf != -1) {
        indOf = indOf + 7;
        plateRouteSel = urlCarSel.substr(indOf, 6);
        document.getElementById('codePlaca').innerHTML = plateRouteSel;
        codDriverKey = plateRouteSel;
        getDataDriver();
        getDataRoutes();

/*
        var datos = conn.database().ref(tblRtAlt[7] + "/" + plateRouteSel);
        datos.orderByValue().on( "value", function( snapshot ) {
            snapshot.forEach( function( data ) {
                if (data.key == "keyid") {
                    codDriverKey = data.val();
                    getDataDriver();
                    getDataRoutes();
                }
            } );
        } );
*/
    }

}

function getDataDriver() {

    var datos = conn.database().ref(tblRtAlt[13] + "/" + codDriverKey);

    document.getElementById('nombreConductor').innerHTML = '<b>' + "Nombre Conductor: " + '</b>' + "Sin definir";
    document.getElementById('telefonoConductor').innerHTML = '<b>' + "Telefono Conductor: " + '</b>' + "Sin definir";
    document.getElementById('fechaConductor').innerHTML = '<b>' + "Fecha Vinculación: " + '</b>' + "Sin definir";
    document.getElementById('documentoConductor').innerHTML = '<b>' + "Documento Conductor: " + '</b>' + "Sin definir";
        datos.orderByValue().on( "value", function( snapshot ) {
            if (snapshot.child('nombreconductor').val() != null)
                document.getElementById('nombreConductor').innerHTML = '<b>' + "Nombre Conductor: " + '</b>' + snapshot.child('nombreconductor').val();
            if (snapshot.child('phone').val() != null)
                document.getElementById('telefonoConductor').innerHTML = '<b>' + "Telefono Conductor: " + '</b>' + snapshot.child('phone').val();
            if (snapshot.child('fecharegistro').val() != null)
                document.getElementById('fechaConductor').innerHTML = '<b>' + "Fecha Vinculación: " + '</b>' + snapshot.child('fecharegistro').val();
            if (snapshot.child('docconductor').val() != null)
                document.getElementById('documentoConductor').innerHTML = '<b>' + "Documento Conductor: " + '</b>' + snapshot.child('docconductor').val();
/*
        snapshot.forEach( function( data ) {
            var datos = data.val();
            var llave = data.key;
            if( llave == "nombreconductor" ) document.getElementById('nombreConductor').innerHTML = '<b>' + "Nombre Conductor: " + '</b>' + datos;
            if( llave == "phone" ) document.getElementById('telefonoConductor').innerHTML = '<b>' + "Telefono Conductor: " + '</b>' + datos;
            if( llave == "fecharegistro" ) document.getElementById('fechaConductor').innerHTML = '<b>' + "Fecha Vinculación: " + '</b>' + datos;
            if( llave == "docconductor" ) document.getElementById('documentoConductor').innerHTML = '<b>' + "Documento Conductor: " + '</b>' + datos;
        } );
*/
    } );

}

function getStateRoute(obj) {

    var datos = conn.database().ref(tblRtAlt[1] + '/' + obj.id);
    datos.orderByValue().on("value", function (snapshot) {
        snapshot.forEach(function (data) {
//            var obj = new Object();
            var dat = data.val();
            if (data.key == "estado") {
                if (dat == 0)
                    obj.estado = "Inactivo";
                else
                    obj.estado = "Activo";
                return obj;
            }
        });
    });
}

function getDataRoutes() {

    var dataRoutes = [];
    var datos = conn.database().ref(tblRtAlt[5] + "/" + codDriverKey);
    var ventanaCns = "'" + "m-CnsRouteDetailEnt" + "'";

    datos.orderByValue().on( "value", function( snapshot ) {
        snapshot.forEach( function( data ) {

            var inf = data.val();
//            console.log('getDataRoutes' + plateRouteSel + " Placa: " + inf.placa);
//            if (plateRouteSel == inf.placa) {

            var obj = {};
            obj.id = inf.id;
            obj.nombre = inf.name;
            obj.placa = inf.placa;
            getStateRoute(obj);
            dataRoutes.push(obj);
//            }

        } );
    } );

    for (var x = 0; x < dataRoutes.length; x++) {

        var liNew = document.createElement("li");
        var variables = "'" + dataRoutes[x].placa + "', '" + dataRoutes[x].id + "', '" + dataRoutes[x].nombre + "'";
        var textLi = dataRoutes[x].id + " - " + dataRoutes[x].nombre + " - " + dataRoutes[x].estado;
//        var btnClick = '<button class="btn_add spaceList" onclick="closePopUp(' + ventanaCns + '); startSelectRoute(' + variables + ');">Ver Usuarios</button>';
        var btnClick = '<button class="btn_add spaceList" id="' + dataRoutes[x].placa + '" onclick="closePopUp(' + ventanaCns + '); startSelectRoute(' + variables + ');"><img src="../img/drawable/usuario.png" style="height: 26px; width: 26px;"></button>';
        liNew.id = dataRoutes[x].id + "" + x;
        liNew.innerHTML = "<div class='listLeftText'>&nbsp;" + textLi + "</div><div class='listRightButton'>" + btnClick + "</div>";
        document.getElementById("listaRutas").appendChild(liNew);
    }
    applyStyle("listaRutas");
}

function getFilterList(fieldText) {
    var texto = "";
    if (fieldText == 'txtRouteCns') {
//        console.log('Aqui vamos: ' + fieldText);
        $("#txtRouteCns").keyup(function () {
            texto = minToMayus($("#txtRouteCns").val());
            $('#listaVehiculosCns li').css("display", "block");
            $('#listaVehiculosCns li').each(function () {
                if (minToMayus($(this).text()).search(texto) != -1)
                    $(this).css("display", "block");
                else
                    $(this).css("display", "none");
                if ($(this).text() == "Listado de Vehiculos") $(this).css("display", "block");
                if ($(this).text() == "Placa - Ruta - Nombre") $(this).css("display", "block");
            });
        });
    }
    if (fieldText == 'txtRutaRem') {
        $("#txtRutaRem").keyup(function () {
            texto = minToMayus($("#txtRutaRem").val());
            $('#listaVehiculosDel li').css("display", "block");
            $('#listaVehiculosDel li').each(function () {
                if (minToMayus($(this).text()).search(texto) != -1)
                    $(this).css("display", "block");
                else
                    $(this).css("display", "none");
                if ($(this).text() == "Listado de Vehiculos a Cargo") $(this).css("display", "block");
                if ($(this).text() == "Placa - Ruta - Nombre Ruta") $(this).css("display", "block");
            });
        });
    }
    if (fieldText == 'txtRuta') {
        $("#txtRuta").keyup(function () {
            texto = minToMayus($("#txtRuta").val());
            $('#listaVehiculos li').css("display", "block");
            $('#listaVehiculos li').each(function () {
                if (minToMayus($(this).text()).search(texto) != -1)
                    $(this).css("display", "block");
                else
                    $(this).css("display", "none");
                if ($(this).text() == "Listado de Vehiculos a Cargo") $(this).css("display", "block");
                if ($(this).text() == "Placa - Ruta - Nombre") $(this).css("display", "block");
            });
        });
    }
    if (fieldText == 'txtUserNameCns') {
        $("#txtUserNameCns").keyup(function () {
            texto = minToMayus($("#txtUserNameCns").val());
            $('#listaUsuariosCns li').css("display", "block");
            $('#listaUsuariosCns li').each(function () {
                if (minToMayus($(this).text()).search(texto) != -1)
                    $(this).css("display", "block");
                else
                    $(this).css("display", "none");
                if ($(this).text() == "Usuarios") $(this).css("display", "block");
                if ($(this).text() == "Nombre - Celular") $(this).css("display", "block");
            });
        });
    }
    if (fieldText == 'txtCelularC') {
        $("#txtCelularC").keyup(function () {
            texto = $("#txtCelularC").val();
            $('#listaUsuariosCns li').css("display", "block");
            $('#listaUsuariosCns li').each(function () {
                if ($(this).text().search(texto) != -1)
                    $(this).css("display", "block");
                else
                    $(this).css("display", "none");
                if ($(this).text() == "Usuarios") $(this).css("display", "block");
                if ($(this).text() == "Nombre - Celular") $(this).css("display", "block");
            });
        });
    }
}

function getDataUserRoute() {

    deleteLi("listaUsuariosCns");
    var datos = conn.database().ref(tblRtAlt[11] + "/" + codeRouteSel);
    datos.orderByValue().on("value", function (snapshot) {
        snapshot.forEach(function (data) {

            var datosU = conn.database().ref(tblRtAlt[11] + "/" + codeRouteSel + "/" + data.key);
            var childname = "", phone = "", idLi = "";
            datosU.orderByValue().on("value", function (snapshot) {
                snapshot.forEach(function (dataU) {
                    var liNew = document.createElement("li");
                    var info = dataU.val();
                    if (dataU.key == 'childname') childname = info;
                    if (dataU.key == 'phone') phone = info;
                    if (dataU.key == 'id') idLi = info;
                    var variables;
                    if (childname != "" && phone != "" && idLi != "") {
                        variables = childname + " - " + phone;
                        var textLi = variables;
                        //var btnClick = '<button class="btn_add spaceList" onclick="closePopUp(' + ventanaCns + '); startSelectRoute(' + variables + ');">Ver Usuarios</button>';
//                        liNew.id = idLi;
                        liNew.setAttribute('id', idLi);
                        liNew.innerHTML = "<div style=\"display: table-cell; width: 270px; padding: 10px;\">&nbsp;" + textLi + '</div>';
                        document.getElementById("listaUsuariosCns").appendChild(liNew);
                        childname = "";
                        phone = "";
                        idLi = "";
                    }
                });
            });
        });
    });
    applyStyle("listaUsuariosCns");
}

function validatePlate(txtText) {
    var text = $('#' + txtText).val();
    if (text.trim() == "")
        msjAlert("Por favor ingresar una placa para continuar", 2);
    if (text.trim().length < 6)
        msjAlert("Placa no valida", 2);

}

function setLogErrorData(message, type, table, func) {

    if( myUserId == "" ) { initApp(); }

    var fecShort = formatoFechaCorta();
    var fecTemp = fecha.getFullYear() + "" + d2(parseInt(fecha.getMonth()+1)) + "" + d2(fecha.getDate()) + "" + d2(fecha.getHours()) + "" + d2(fecha.getMinutes()) + "" + d2(fecha.getSeconds());
    var datos = conn.database().ref(tblRtAlt[16] + "/" + fecShort + '/' + fecTemp);

    formatoFecha();
    datos.set({ user: myUserId,
                date: fecha,
                messaje: message,
                type: type,
                table: table,
                funcion: func
    }).then(function() { console.log('dato almacenado correctamente'); }
    ).catch(function(error) { alert('detectado un error', error); });

}

function setIdRegDoc(title, iniDate, enDate, numberPlate, upLoadRef) {
    titlePlate = title;
    startDate = iniDate;
    endDate = enDate;
    numberDoc = numberPlate;
    upLoadDoc = upLoadRef;
}

function setRemAttributeDocs(src) {
    document.getElementById("" + startDate + src).readonly = false;
    document.getElementById("" + endDate + src).readonly = false;
    document.getElementById("" + numberDoc + src).readonly = false;
}

function setAddAttributeDocs(src) {
    document.getElementById("" + startDate + src).readonly = true;
    document.getElementById("" + endDate + src).readonly = true;
    document.getElementById("" + numberDoc + src).readonly = true;
}

function setDataDocsView(src, fecIni, fecFin, number, download, doc) {
    if (fecIni != null) $("#" + startDate + src).val(fecIni);
    if (fecFin != null) $("#" + endDate + src).val(fecFin);
    if (number != null) $("#" + numberDoc + src).val(number);
    if (download != null && upLoadDoc == 'download') {
        var btn = document.getElementById("btnGet" + src + "Car");
        btn.setAttribute("onclick", "abrirOpcionModal('m-CnsFileDownLoad'); getDownloadFile('" + src + "', '" + download + "', '" + doc + "');");
//        console.log("setDataDocsView: " + src + ", " + download + ", " + doc);
    }

}

function getDataDriverCns(plate) { document.getElementById(titlePlate).innerHTML = '<b>' + plate + '</b>'; }

function getDataDoc(plate) {
    if (entUser == "") cnsUsuarioEmpresa();
    var categorias = ['soat', 'matricula', 'tecnomecanica', 'funcionamiento'];
    document.getElementById(titlePlate).innerHTML = '<b>' + plate + '</b>';
    categorias.forEach(function(element) {
        var datos = conn.database().ref(tblRtAlt[17] + "/" + entUser + "/" + plate + '/' + element);
        datos.orderByValue().on("value", function (snapshot) {
            setRemAttributeDocs(getCapitalLetter(element));
            setDataDocsView(getCapitalLetter(element), snapshot.child('datestart').val(), snapshot.child('dateend').val(), snapshot.child('number').val(), snapshot.child('ref').val(), snapshot.child('document').val());
            setAddAttributeDocs(getCapitalLetter(element));
        });
    });

/*
    var datos = conn.database().ref(tblRtAlt[17] + "/" + entUser + "/" + plate + '/soat');
    datos.orderByValue().on("value", function (snapshot) {
        setRemAttributeDocs('Soat');
        setDataDocsView('Soat', snapshot.child('datestart').val(), snapshot.child('dateend').val(), snapshot.child('number').val(), snapshot.child('ref').val(), snapshot.child('document').val());
        setAddAttributeDocs('Soat');
    });
    var datos = conn.database().ref(tblRtAlt[17] + "/" + entUser + "/" + plate + '/matricula');
    datos.orderByValue().on("value", function (snapshot) {
        setRemAttributeDocs('Matricula');
        setDataDocsView('Matricula', snapshot.child('datestart').val(), snapshot.child('dateend').val(), snapshot.child('number').val(), snapshot.child('ref').val(), snapshot.child('document').val());
        setAddAttributeDocs('Matricula');
    });
    var datos = conn.database().ref(tblRtAlt[17] + "/" + entUser + "/" + plate + '/tecnomecanica');
    datos.orderByValue().on("value", function (snapshot) {
        setRemAttributeDocs('Tecnomecanica');
        setDataDocsView('Tecnomecanica', snapshot.child('datestart').val(), snapshot.child('dateend').val(), snapshot.child('number').val(), snapshot.child('ref').val(), snapshot.child('document').val());
        setAddAttributeDocs('Tecnomecanica');
    });
    var datos = conn.database().ref(tblRtAlt[17] + "/" + entUser + "/" + plate + '/funcionamiento');
    datos.orderByValue().on("value", function (snapshot) {
        setRemAttributeDocs('Funcionamiento');
        setDataDocsView('Funcionamiento', snapshot.child('datestart').val(), snapshot.child('dateend').val(), snapshot.child('number').val(), snapshot.child('ref').val(), snapshot.child('document').val());
        setAddAttributeDocs('Funcionamiento');
    });
*/
}

function getReference(table, text, origen) {
    refStorages = text;
    tableRef = table;
    source = origen;
    docDriver = 0;
    $('#btnUpload').val('');
    document.getElementById('confirmUpload').innerHTML = '';
    moveBar(0);
}

function getReferenceDriver(table, text, origen, driver) {
    refStorages = text;
    tableRef = table;
    source = origen;
    docDriver = driver;
//si driver = 1 para cedula, 2 para licencia, 3 para hoja de vida, 4 contacto
    $('#btnUpload').val('');
    document.getElementById('confirmUpload').innerHTML = '';
    moveBar(0);
}

function setUploadFile(event) {
//Para validar documentos del vehiculo
    if (docDriver == 0) {
        var fecIni = $('#fecInicio' + source).val();
        var fecFin = $('#fecVen' + source).val();
        var numero = $('#txtNumero' + source).val();
        document.getElementById('confirmUpload').innerHTML = '';

        resultValidate = 0;
        validaField(fecIni, "No ha ingresado la fecha de inicio del " + source);
        validaField(fecFin, "No ha ingresado la fecha de vencimiento del " + source);
        validaField(numero, "No ha ingresado el numero del " + source);

        if (resultValidate == 1) return;

        dataDriverUpdate = [];
        dataDriverUpdate.push(fecIni);
        dataDriverUpdate.push(fecFin);
        dataDriverUpdate.push(numero);
        upLoadDocument(event);
    }
//Para guardar los datos personales del conductor
    if (docDriver == 1) {
        var documentCond = $('#txtDocumento').val();
        var tipodocuCond = $('#txtTipoDoc').val();
        var tipoRHConduc = $('#txtRh').val();
        var epsConductor = $('#txtEps').val();
        var nombresCondu = $('#txtNombres').val();
        var apellidoCond = $('#txtApellidos').val();
        var fechaNacCond = $('#txtFechaNac').val();
        var estadoCiCond = $('#txtEstadoCivil').val();

        resultValidate = 0;
        validaField(documentCond, "No ha ingresado el documento del conductor");
        validaField(tipodocuCond, "No ha ingresado el tipo de documento del conductor");
        validaField(tipoRHConduc, "No ha ingresado el tipo de RH del conductor");
        validaField(epsConductor, "No ha ingresado la EPS del conductor");
        validaField(nombresCondu, "No ha ingresado el(los) nombre(s) del conductor");
        validaField(apellidoCond, "No ha ingresado el(los) apellido(s) del conductor");
        validaField(fechaNacCond, "No ha ingresado la fecha de nacimiento del conductor");
        validaField(estadoCiCond, "No ha ingresado el estado civil del conductor");

        if (resultValidate == 1) return;

        dataDriverUpdate = [];
        dataDriverUpdate.push(documentCond);
        dataDriverUpdate.push(tipodocuCond);
        dataDriverUpdate.push(tipoRHConduc);
        dataDriverUpdate.push(epsConductor);
        dataDriverUpdate.push(nombresCondu);
        dataDriverUpdate.push(apellidoCond);
        dataDriverUpdate.push(fechaNacCond);
        dataDriverUpdate.push(estadoCiCond);
        upLoadDocument(event);
    }
//Para guardar los datos de la licencia de conduccion del conductor
    if (docDriver == 2){
        var fecLicencia = $('#txtFechaLicencia').val();
        var vencimiento = $('#txtVencimiento').val();
        var tipoLicencia = $('#txtTipoLicencia').val();
        var numLicencia = $('#txtumeroLicencia').val();
        resultValidate = 0;
        validaField(fecLicencia, "No ha ingresado la fecha de inicio de la licencia");
        validaField(vencimiento, "No ha ingresado la fecha de vigencia de la licencia");
        validaField(tipoLicencia, "No ha ingresado el tipo de licencia");
        validaField(numLicencia, "No ha ingresado el numero de licencia");

        if (resultValidate == 1) return;

        dataDriverUpdate = [];
        dataDriverUpdate.push(fecLicencia);
        dataDriverUpdate.push(vencimiento);
        dataDriverUpdate.push(tipoLicencia);
        dataDriverUpdate.push(numLicencia);
        upLoadDocument(event);
    }
//Para guardar la hoja de vida del conductor
    if (docDriver == 3){ upLoadDocument(event); }
//Para guardar los datos de contacto del conductor
    if (docDriver == 4){
        var nombreContacto = $('#txtNombreContacto').val();
        var apellidoContacto = $('#txtApellidoContacto').val();
        var telefonoContacto = $('#txtTelContacto').val();

        resultValidate = 0;
        validaField(nombreContacto, "No ha ingresado el nombre del contacto");
        validaField(apellidoContacto, "No ha ingresado el apellido del contacto");
        validaField(telefonoContacto, "No ha ingresado el telefono del contacto");

        if (resultValidate == 1) return;

        dataDriverUpdate = [];
        dataDriverUpdate.push(nombreContacto);
        dataDriverUpdate.push(apellidoContacto);
        dataDriverUpdate.push(telefonoContacto);
    }
}

function getnameDocument() {
    switch(docDriver) {
        case 0:
            switch(source) {
                case 'Soat':
                    return $('#txtSoatDocCar').val();
                    break;
                case 'Matricula':
                    return $('#txtMatriculaDocCar').val();
                    break;
                case 'Funcionamiento':
                    return $('#txtFuncDocCar').val();
                    break;
                case 'Tecnomecanica':
                    return $('#txtTecnoDocCar').val();
                    break;
            }
            break;
        case 1:
            return $('#txtNomDocDriver').val();
            break;
        case 2:
            return $('#txtLicDocDriver').val();
            break;
        case 3:
            return $('#txtCVDocDriver').val();
            break;

    }
}

function setDownloadURL(url) {
    formatoFecha();
    if (onlySave == 0) nameDocument = getnameDocument();
    switch(docDriver) {
        case 0:
//Informacion de los documentos del vehiculo
            if (dataDriverUpdate.length <= 0) return;
            var datos = conn.database().ref(tableRef + '/' + entUser + '/' + refStorages);
            datos.set({ download: url,
                        date: fecha,
                        ref: tableRef + '/' + entUser + refStorages,
                        document: nameDocument,
                        user: myUserId,
                        datestart: dataDriverUpdate[0],
                        dateend: dataDriverUpdate[1],
                        number: dataDriverUpdate[2]
            }).then(function () {
                console.log('Dato guardado exitosamente');
                if (onlySave == 0) msjAlert("Datos guardados exitosamente", 1);
            }).catch(function (error) {
                console.log("Error al guardar los datos: " + error);
                setLogErrorData('Error: ' + error, 'Insertar', tableRef + '/' + entUser + '/' + refStorages, 'setDownloadURL');
            });
            break;
        case 1:
//Datos para guardar informacion basica del conductor
            if (dataDriverUpdate.length <= 0) return;
            var datos = conn.database().ref(tblRtAlt[13] + "/" + codDriverKey);
            datos.set({ docconductor: dataDriverUpdate[0],
                        tipdocdonductor: dataDriverUpdate[1],
                        rhconductor: dataDriverUpdate[2],
                        epsconductor: dataDriverUpdate[3],
                        nombres: dataDriverUpdate[4],
                        apellidos: dataDriverUpdate[5],
                        fecnacimiento: dataDriverUpdate[6],
                        estadocivil: dataDriverUpdate[7],
                        nombreconductor: dataDriverUpdate[4] + " " + dataDriverUpdate[5],
                        date: fecha,
                        ref: tableRef + '/' + entUser + refStorages,
                        document: nameDocument,
                        user: myUserId
            }).then(function () {
                console.log('Dato guardado exitosamente caso ' + docDriver);
                if (onlySave == 0) msjAlert("Datos guardados exitosamente", 1);
            }).catch(function (error) {
                console.log("Error al guardar datos: " + error + ", caso: " + docDriver);
                setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[13], 'setDownloadURL');
            });
            break;
        case 2:
//Datos para guardar informacion de la licencia de conduccion
            if (dataDriverUpdate.length <= 0) return;
            var datos = conn.database().ref(tableRef + '/' + entUser + '/' + refStorages);
            console.log("setDownloadURL:" + datos);
            datos.set({ inicio: dataDriverUpdate[0],
                        vencimiento: dataDriverUpdate[1],
                        tipo: dataDriverUpdate[2],
                        numero: dataDriverUpdate[3],
                        ref: tableRef + '/' + entUser + refStorages,
                        document: nameDocument,
                        date: fecha,
                        user: myUserId
            }).then(function () {
                console.log('Dato guardado exitosamente caso ' + docDriver);
                if (onlySave == 0) msjAlert("Datos guardados exitosamente", 1);
            }).catch(function (error) {
                console.log("Error al guardar datos: " + error + ", caso: " + docDriver);
                setLogErrorData('Error: ' + error, 'Insertar', tableRef + '/' + entUser + '/' + refStorages, 'setDownloadURL');
            });
            break;
        case 3:
//Guardar la hoja de vida del conductor
            var datos = conn.database().ref(tableRef + '/' + entUser + refStorages);
            datos.set({ download: url,
                        ref: tableRef + '/' + entUser + refStorages,
                        document: nameDocument,
                        date: fecha,
                        user: myUserId
            }).then(function () {
                console.log('Dato guardado exitosamente caso ' + docDriver);
                if (onlySave == 0) msjAlert("Datos guardados exitosamente", 1);
            }).catch(function (error) {
                console.log("Error al guardar datos: " + error + ", caso: " + docDriver);
                setLogErrorData('Error: ' + error, 'Insertar', tableRef + '/' + entUser + '/' + refStorages, 'setDownloadURL');
            });
            break;
        case 4:
//Datos para guardar informacion del contacto
            if (dataDriverUpdate.length <= 0) return;
            var datos = conn.database().ref(tblRtAlt[18] + "/" + plateRouteSel);
            datos.set({ nombres: dataDriverUpdate[0],
                        apellidos: dataDriverUpdate[1],
                        telefono: dataDriverUpdate[2],
                        date: fecha,
                        user: myUserId
            }).then(function () {
                console.log('Dato guardado exitosamente caso ' + docDriver);
                if (onlySave == 0) msjAlert("Datos guardados exitosamente", 1);
            }).catch(function (error) {
                console.log("Error al guardar datos: " + error + ", caso: " + docDriver);
                setLogErrorData('Error: ' + error, 'Insertar', tblRtAlt[18], 'setDownloadURL');
            });
            break;
    }
}

function setRemoveDocument(){ document.getElementById("iFrameImagen").removeAttribute("src"); }

function getDownloadFile(src, url, doc) {
//    var myHeaders = new Headers();
//    myHeaders.append('Content-Type', 'application/force-download');
    var storageRef = storage.ref(url);
//    var downloadLink = document.createElement("a");
//    document.body.appendChild(downloadLink);
//    var downloadLink = document.getElementById('btnGet' + src + 'Car');

    storageRef.child(doc).getDownloadURL().then(function(urlD) {
//        downloadLink.target = "_blank";
//        downloadLink.href = urlD;
//        downloadLink.download = doc;
//        downloadLink.click();
//        downloadLink.remove();
        var prueba = document.getElementById("iFrameImagen");
        prueba.setAttribute("src", urlD);
    }).catch(function(error) {
        switch (error.code) {
            case 'storage/object-not-found':
                msjAlert("Archivo " + doc + " no existe", 2);
                break;

            case 'storage/unauthorized':
                msjAlert("Usuario no autorizado a descargar el archivo", 2);
                break;

            case 'storage/canceled':
                msjAlert("Descarga cancelada por el usuario", 2);
                break;
            case 'storage/unknown':
                msjAlert("Servidor no responde, intente mas tarde", 2);
                break;
        }
    });
}

function moveBar(intervalo) {
    var elem = document.getElementById("myBar");
//    var id = setInterval(frame, 10);
//    function frame() {

//        if (intervalo >= 100) {
//            clearInterval(id);
//        } else {
            elem.style.width = intervalo + '%';
            elem.innerHTML = intervalo * 1 + '%';
//        }
//    }
}

function upLoadDocument(event) {
    UpLoadResult = 0;

    if (entUser == "") cnsUsuarioEmpresa();

    if (myUserId == "") initApp();

    if (onlySave == 0) return;

    var storageRef = storage.ref(tableRef + '/' + entUser + '/' + refStorages);
    var input = event.target;
    var file = input.files[0];
    var name = file.name;

    switch (docDriver) {
        case 0:
            switch (source) {
                case 'Soat':
                    if (name != docsPdf[3]) {
                        msjAlert("El nombre archivo debe ser<br/>" + docsPdf[3] + "<br/>Por favor renombrar y volver a cargar el archivo", 2);
                        return;
                    }
                    break;
                case 'Matricula':
                    if (name != docsPdf[4]) {
                        msjAlert("El nombre archivo debe ser<br/>" + docsPdf[4] + "<br/>Por favor renombrar y volver a cargar el archivo", 2);
                        return;
                    }
                    break;
                case 'Tecnomecanica':
                    if (name != docsPdf[5]) {
                        msjAlert("El nombre archivo debe ser<br/>" + docsPdf[5] + "<br/>Por favor renombrar y volver a cargar el archivo", 2);
                        return;
                    }
                    break;
                case 'Funcionamiento':
                    if (name != docsPdf[6]) {
                        msjAlert("El nombre archivo debe ser<br/>" + docsPdf[6] + "<br/>Por favor renombrar y volver a cargar el archivo", 2);
                        return;
                    }
                    break;
            }
            break;
        case 1:
        if (name != docsPdf[0]) {
            msjAlert("El nombre archivo debe ser<br/>" + docsPdf[0] + "<br/>Por favor renombrar y volver a cargar el archivo", 2);
            return;
        }
            break;
        case 2:
            if (name != docsPdf[1]) {
                msjAlert("El nombre archivo debe ser<br/>" + docsPdf[1] + "<br/>Por favor renombrar y volver a cargar el archivo", 2);
                return;
            }
            break;
        case 3:
            if (name != docsPdf[2]) {
                msjAlert("El nombre archivo debe ser<br/>" + docsPdf[2] + "<br/>Por favor renombrar y volver a cargar el archivo", 2);
                return;
            }
            break
    }

    if (file.name == "" || file.name == undefined) {
        msjAlert("No ha seleccionado un archivo para subir", 2);
        $('#btnUpload').val('');
        return;
    }

    var metadata = {contentType: file.type, groupId: entUser};
    var task = storageRef.child(name).put(file, metadata);

    nameDocument = name;
    task.on('state_changed', function (snapshot) {
        var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                moveBar(progress);
                break;
        }
    }, function (error) {
        console.log('Error ' + error.code);
        switch (error.code) {
            case 'storage/object_not_found':
                document.getElementById('confirmUpload').innerHTML = '<b>Archivo no encontrado</b>';
                console.log("storage/object_not_found");
                UpLoadResult = 1;
                break;

            case 'storage/unauthorized':
                document.getElementById('confirmUpload').innerHTML = '<b>No esta autorizado a subir archivos</b>';
                console.log("storage/unauthorized");
                UpLoadResult = 1;
                break;

            case 'storage/canceled':
                document.getElementById('confirmUpload').innerHTML = '<b>Subida de archivo cancelada</b>';
                console.log("storage/canceled");
                UpLoadResult = 1;
                break;
            case 'storage/unknown':
                document.getElementById('confirmUpload').innerHTML = '<b>Se presento un error desconocido</b>';
                console.log("storage/unknown");
                UpLoadResult = 1;
                break;
        }

    }, function () {
        task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            document.getElementById('confirmUpload').innerHTML = '<b>Archivo cargado con exito</b>';
            console.log('Archivo cargado con exito!');
            UpLoadResult = 0;
            if (docDriver == 0)
                setDownloadURL(downloadURL);
            if (docDriver == 1)
                setDownloadURL(downloadURL);
            if (docDriver == 2)
                setDownloadURL(downloadURL);
            if (docDriver == 3)
                setDownloadURL(downloadURL);

        });
    });
}

function validaField(field, result) {

    if (resultValidate == 1) return;
    if (field == "" || field == undefined) {
        msjAlert(result, 2);
        $('#btnUpload').val('');
        moveBar(0);
        resultValidate = 1;
    }

}

function setTextMsgCnf(textUpLoad) {
    var eText = document.getElementById('divCnfUpLoadFile');
    document.getElementById('btnUpLoadData').disabled = false;
    eText.innerHTML = 'Desea cargar el archivo <br/><b>' + textUpLoad + '?</b><br/>';
    if (textUpLoad == "Contacto") { document.getElementById('btnUpLoadData').disabled = true; }
}

function setOnlySave(onlyS) { onlySave = onlyS }

function getDataDriverUpLoad(plate, src) {
    var datos = conn.database().ref(tblRtAlt[13] + "/" + plate);
    datos.orderByValue().on("value", function (snapshot) {
        if (snapshot.child('document').val() != null) $('#txtNomDocDriver' + src).val(snapshot.child('document').val());
        if (snapshot.child('docconductor').val() != null) $('#txtDocumento' + src).val(snapshot.child('docconductor').val());
        if (snapshot.child('tipdocdonductor').val() != null) $('#txtTipoDoc' + src).val(snapshot.child('tipdocdonductor').val());
        if (snapshot.child('rhconductor').val() != null) $('#txtRh' + src).val(snapshot.child('rhconductor').val());
        if (snapshot.child('epsconductor').val() != null) $('#txtEps' + src).val(snapshot.child('epsconductor').val());
        if (snapshot.child('nombres').val() != null) $('#txtNombres' + src).val(snapshot.child('nombres').val());
        if (snapshot.child('apellidos').val() != null) $('#txtApellidos' + src).val(snapshot.child('apellidos').val());
        if (snapshot.child('fecnacimiento').val() != null) $('#txtFechaNac' + src).val(snapshot.child('fecnacimiento').val());
        if (snapshot.child('estadocivil').val() != null) $('#txtEstadoCivil' + src).val(snapshot.child('estadocivil').val());
        if (snapshot.child('ref').val() != null) {
            var btn = document.getElementById("btnPersonalDataCns");
            btn.setAttribute("onclick", "abrirOpcionModal('m-CnsFileDownLoad'); getDownloadFile('', '" + snapshot.child('ref').val() + "', '" + snapshot.child('document').val() + "');");
        }
    });

    var datos = conn.database().ref(tblRtAlt[18] + "/" + plateRouteSel);
    datos.orderByValue().on("value", function (snapshot) {
        if (snapshot.child('apellidos').val() != null) $('#txtApellidoContacto' + src).val(snapshot.child('apellidos').val());
        if (snapshot.child('nombres').val() != null) $('#txtNombreContacto' + src).val(snapshot.child('nombres').val());
        if (snapshot.child('telefono').val() != null) $('#txtTelContacto' + src).val(snapshot.child('telefono').val());
    });

    var datos = conn.database().ref(tblRtAlt[17] + '/' + entUser + '/' + plate + '/licencia');
    datos.orderByValue().on("value", function (snapshot) {
        if (snapshot.child('document').val() != null) $('#txtLicDocDriver' + src).val(snapshot.child('document').val());
        if (snapshot.child('inicio').val() != null) $('#txtFechaLicencia' + src).val(snapshot.child('inicio').val());
        if (snapshot.child('vencimiento').val() != null) $('#txtVencimiento' + src).val(snapshot.child('vencimiento').val());
        if (snapshot.child('tipo').val() != null) $('#txtTipoLicencia' + src).val(snapshot.child('tipo').val());
        if (snapshot.child('numero').val() != null) $('#txtumeroLicencia' + src).val(snapshot.child('numero').val());
        if (snapshot.child('ref').val() != null) {
            var btn = document.getElementById("btnDriverDocumentCns");
            btn.setAttribute("onclick", "abrirOpcionModal('m-CnsFileDownLoad'); getDownloadFile('', '" + snapshot.child('ref').val() + "', '" + snapshot.child('document').val() + "');");
        }
    });

    var datos = conn.database().ref(tblRtAlt[17] + '/' + entUser + '/' + plate + '/cv');
    datos.orderByValue().on("value", function (snapshot) {
        if (snapshot.child('document').val() != null) $('#txtCVDocDriver' + src).val(snapshot.child('document').val());
        if (snapshot.child('ref').val() != null) {
            var btn = document.getElementById("btnCurriculumCns");
            btn.setAttribute("onclick", "abrirOpcionModal('m-CnsFileDownLoad'); getDownloadFile('', '" + snapshot.child('ref').val() + "', '" + snapshot.child('document').val() + "');");
        }
    });
}