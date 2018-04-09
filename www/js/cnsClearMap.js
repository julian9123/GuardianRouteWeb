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

function registroDatosSch() {
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
        cnsSchGroup(codRutaTmp);
        if( registrado == 0 ) {
            msjError = 'Codigo de colegio no existente';
            formatoMsjDialog("dataError6", msjError);
            codRutaTmp = "";
        }
    }
    if( userName != "" && userLastName != "" && userCellPhone != "" && codRutaTmp != "" && paisSel != "" ) {
        if( myUserId == "" ){ initApp(); }
        if( myUserId == "" ){ initApp(); }
        if( myUserId == "" ){ initApp(); }
        var datos = conn.database().ref("schUser/" + myUserId + "/" + codRutaTmp );
        datos.set({ userName : userName,
                    userlastName : userLastName,
                    userCellPhone : userCellPhone,
                    paisSel : paisSel
                  }).then( function() { 
                        console.log('dato almacenado correctamente');
                        cambioPagina('mapaRutaSchool.html');
                        return;
                    } )
                    .catch(function(error) {
                        console.log('detectado un error', error);
                    });    
    } else {
        abrirOpcionModal("m-msjError");
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
    var datos = conn.database().ref("entUser/" + myUserId );
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            registrado++;
            var arrayX = [];
            arrayX.push(empresa);
            for( var x in data.val() ) {
                var empresa = x;
            }
            entUser = empresa;
        } );
    } );    
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
    var datos = conn.database().ref("datacar/" + ruta);
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            srRoute = 1;
            var elem = document.getElementById("routeFind");
            elem.textContent = "Vehiculo encontrado: " + ruta;
            elem.setAttribute("style", "color: #000000");
            var elemB = document.getElementById("btnARDialog");
            elemB.removeAttribute("disabled");
            var elemR = document.getElementById("routeFindRem");
            elemR.textContent = "Vehiculo encontrado: " + ruta;
            elemR.setAttribute("style", "color: #000000");
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
    console.log("cnsUserEnt:" + myUserId);
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

function cnsSchGroup(codSchool) {
    intentos = 0;
    registrado = 0;
    if( myUserId == "" ){ initApp(); }
    if( myUserId == "" ){ initApp(); }
    if( myUserId == "" ){ initApp(); }
    var datos = conn.database().ref( "schGroup/" + codSchool );
    datos.orderByValue().on( "value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            registrado++;
            entUser = data.key;
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

function cnsUserExistShc() {
    intentos = 0;
    registrado = 0;
    initApp();
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    if( myUserId == "" ) { initApp(); }
    var datos = conn.database().ref( "schUser/" + myUserId );
    datos.orderByValue().on( "value", function( snapshot ) {
        snapshot.forEach( function( data ) {
            registrado++;
            entRoute = data.key;
            cambioPagina("mapaRutaSchool.html");
            return;
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
//    console.log("inicio " + new Date());
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

function createSchool() {
    formatoFecha();
    obtenercodEmp("SCH");
    if(codRuta == ""){ return; }
    var datos = conn.database().ref("schGroup/" + codRuta );
    datos.set({  dir: "Calle " + codRuta,
        est: 1,
        fecreg: fecha,
        nit: "80000000",
        tel: "300456889",
        nom: "Colegio " + codRuta,
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
        msjAlert("dato almacenado correctamente", 1);
    }).catch(function(error) {
        msjAlert("Error al guardar los datos: " + error, 2);
        return;
    });
    lastRouteAdded = newCar;
    addRoute();
}