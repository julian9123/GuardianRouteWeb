'use strict';

var map;
var myLat = 4.7513308,
    myLong = -74.0651812;
var infoWindow;
var options;
var markers = [];
var markersDup = [];
var varUrlRet = [];
var rutas = [];
var errorMap = 0;
var centerMap = 0;
var indexLine = 0;
var typeRouteMap = 0;
var codeRouteSel = "";
var plateRouteSel = "";
var nameRouteSel = "";
var limitLoops = 3;
var direcciones = [];
var msgAlerts = [];
var alertas = ['¡Estamos en un congestión vehicular grave!', '¡Sufrimos un accidente!', '¡Tenemos un daño mecánico!'];
var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
var shape = {coords: [0, 0, 50], type: 'circle'};
var starandfinish = [];
var routeNP = [];

$(document).ready(function() {

});
var app = {
    initialize: function() {
        document.addEventListener('deviceready', function () {
            cordova.plugins.backgroundMode.setEnabled(true);
            cordova.plugins.backgroundMode.onactivate = function() {
                setInterval(posicionActual, 3000);
            };
        });
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        
    }
};
app.initialize();

function initMap() {
    map = null;
    map = new google.maps.Map( document.getElementById('map'),
                               { center: {lat: myLat, lng: myLong},
                                  zoom: 10,
                                  mapTypeId: google.maps.MapTypeId.ROADMAP } );
    options = { enableHighAccuracy: true, maximumAge: 100, timeout: 100000 };
    infoWindow = new google.maps.InfoWindow({map: map});
    setInterval(posicionActual, 3000);
    if( entUser == "" ) { cnsUsuarioEmpresa(); }
    if( entUser == "" ) { cnsUsuarioEmpresa(); }
    if( entUser == "" ) { cnsUsuarioEmpresa(); }
    distancia = 1;
}

function myRoutes() {
    if (rutas.length <= 0) {
        var datosE = conn.database().ref("entRoute/" + entUser);
        datosE.orderByValue().on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                var x = data.val();
                var ruta = x.routeCode;
                var objE = new Object();
                if (ruta != "") {
                    objE = ruta;
                    rutas.push(objE);
                }
            });
        });
    }
}

function driversNRoutes() {
    if( routeNP.length <= 0 ) {
        var markTemp = [];
        var drivers = [];
        var datos = conn.database().ref("drivervstravel");
        datos.orderByValue().on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                var rutaCns = data.key;
                drivers.push(rutaCns);
            });
        });
        var conductor;
        for (var i = 0; i < drivers.length; i++) {
            conductor = drivers[i];
            if (conductor == '[object Object]') {
                continue;
            }
            var datos = conn.database().ref("drivervstravel/" + conductor);
            datos.orderByValue().on("value", function (snapshot) {
                snapshot.forEach(function (data) {
                    var rutaCns = data.val();
                    var obj = new Object();
                    obj.id = rutaCns.id;
                    obj.name = rutaCns.name;
                    obj.placa = rutaCns.placa;
                    markTemp.push(obj);
                });
            });
        }
        routeNP = markTemp;
    }
}


function myPositions() {
    infoWindow = new google.maps.InfoWindow({map: map});
    var markTemp = [];
    markTemp = routeNP;
    var markTempX = [];
    for (var i = 0; i < markTemp.length; i++) {
        //console.log("obj.id: " + markTemp[i].id + " obj.placa: " + markTemp[i].placa);
/*
        var jsonString = Object.keys(markTemp[i]);
        var indice = jsonString[0];
        var jsonString = JSON.stringify(markTemp[i], [indice, 'id', 'placa', 'name']);
        var res = JSON.parse(jsonString);
*/
        for (var j = 0; j < rutas.length; j++) {
//            if (res[indice]['placa'] == rutas[j]) {
            if (markTemp[i].placa == rutas[j]) {
//                console.log("starandfinish.length: " + starandfinish.length);
                var objT = new Object();
                for(var l = 0; l < starandfinish.length; l++) {
                    if( markTemp[i].id == starandfinish[l].ruta ) {
//                        console.log("Ruta Si: " + starandfinish[l].ruta + " Nombre: " + markTemp[i].name + " Placa: " + markTemp[i].placa);
                        objT.ruta = markTemp[i].id;
                        objT.placa = markTemp[i].placa;
                        objT.nombre = markTemp[i].name;
                        objT.destino =  starandfinish[l].tipo;
                        objT.act = "ok";
                        markTempX.push(objT);
                    }
                }
            }
        }
    }
    var ofCourse = 'no';
    for (var i = 0; i < rutas.length; i++) {
        ofCourse = 'no';
        for (var j = 0; j < markTempX.length; j++) {
            if( rutas[i] == markTempX[j].placa ) {
                ofCourse = 'yes';
            }
        }
        if( ofCourse == 'no' ) {
            for (var l = 0; l < markTemp.length; l++) {
/*
                var jsonString = Object.keys(markTemp[l]);
                var indice = jsonString[0];
                var jsonString = JSON.stringify(markTemp[l], [indice, 'id', 'placa', 'name']);
                var res = JSON.parse(jsonString);
*/
                if (markTemp[l].placa == rutas[i]) {
                    var objT = new Object();
                    objT.ruta = markTemp[l].id;
                    objT.placa = markTemp[l].placa;
                    objT.nombre = markTemp[l].name;
                    objT.destino =  "Sin definir";
                    objT.act = "notOk";
                    markTempX.push(objT);
                }
            }
        }
    }
    var datos = conn.database().ref("datacar");
    datos.orderByValue().on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            var rutaCns = data.key;
            for (var i = 0; i < markTempX.length; i++) {
                if (markTempX[i].placa == rutaCns) {
                    var obj = new Object();
                    obj.placa = data.key;
                    var reg = data.val();
                    obj.longitud = reg.longitud;
                    obj.latitud = reg.latitud;
                    obj.nombre = markTempX[i].nombre;
                    obj.ruta = markTempX[i].ruta;
                    obj.marca = reg.marca;
                    obj.modelo = reg.modelo;
                    obj.velocidad = reg.velocidad;
                    obj.destino = markTempX[i].destino;
                    obj.act = 'Activa';
                    obj.imagen = 'marcaruta';
                    if( markTempX[i].act == 'notOk' ) {
                        obj.nombre = 'Ruta en transito';
                        obj.act = 'En transito';
                        obj.imagen = 'marcadorgris';
                    }
//                    obj.url = "https://www.youtube.com/watch?v=bmtbg5b7_Aw";
                    markers.push(obj);
                }
            }
            distancia++;
        });
        markers = eliminarObjetosDuplicados(markers, "placa");
        setMapOnAll();
        myPositionsRefresh(markers);
        if (rutas.length <= 0) {
            return;
        }
        google.maps.event.addDomListener(window, 'load', initMap);
    });
}
/*
    var datos = conn.database().ref("travel");
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            var rutaCns = data.key;
            rutaCns = rutaCns;//.toUpperCase();
            if( rutas.includes(rutaCns) ) {
                var obj = new Object();
                obj.ruta = data.key;
                var reg = data.val();
                obj.longitud = reg.longitud + ( distancia / 10000 );
                obj.latitud = reg.latitud + ( distancia / 30000 );
                obj.nombre = reg.nombre;
                obj.url = "https://www.youtube.com/watch?v=bmtbg5b7_Aw";
                markers.push(obj);
/*
                marcador = new google.maps.Marker({ position: new google.maps.LatLng(obj.latitud, obj.longitud),
                                                    map: map,
                                                    title: 'Ruta:' + obj.nombre,
                                                    icon: image,
                                                    shape: shape,
                                                    animation: google.maps.Animation.DROP });
                google.maps.event.addListener(marcador, 'click', (function(marker, i) {
                    return function() {
                        infowindow.setContent('Ruta:' + obj.nombre);

//                        infowindow.open(map, marker);
//                        console.log("obj.nombre:" + JSON.stringify(marker) + " i:" + i);
                    }
                })(marcador, i));
*/
/*
            }
            distancia++;
        } );
    } );
    markers = eliminarObjetosDuplicados(markers, "ruta");
    setMapOnAll();
    myPositionsRefresh(markers);
    if( rutas.length <= 0 ){ return; }
    google.maps.event.addDomListener(window, 'load', initMap);
}
*/

function eliminarObjetosDuplicados(arr, prop) {
     var nuevoArray = [];
     var lookup  = {};
 
     for (var i in arr) {
         lookup[arr[i][prop]] = arr[i];
     }
     for (i in lookup) {
         nuevoArray.push(lookup[i]);
     }
     return nuevoArray;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//    if( errorMap > 1 ) { return; }
//    infoWindow.setPosition(pos);
//    infoWindow.setContent(browserHasGeolocation ? 'Servicio de Geolocation Fallo' : 'Error: Your browser doesn\'t support geolocation.');
    errorMap++;
    document.location.reload();
    console.log("Recargar Pagina");
    initMap();
}

function posicionActual() {
    var getVar = {};
    getVar = getGET();
    cnsDtStrFnsh();
    myRoutes();
    driversNRoutes();
    if (getVar != undefined) {
        var dataUrl = getVar;
        if( dataUrl[0] != undefined ) codeRouteSel = dataUrl[0];
        if( dataUrl[1] != undefined ) nameRouteSel = dataUrl[1];
        if( dataUrl[2] != undefined ) plateRouteSel = dataUrl[2];
        if( dataUrl[3] != undefined ) typeRouteMap = dataUrl[3];
    } else {
        typeRouteMap = 0;
    }
    centerMap++;
    if( typeRouteMap == 0 ) {
        myPositions();
    } else {
        mapUsersRoute();
    }
    cnsAlerts();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
            };
//            guardarPosicion(pos);
            if( contador < 3 ){ map.setCenter(pos); }
            contador++;
        },
        function(error) {
            handleLocationError(true, infoWindow, map.getCenter());
        }, options );
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function listVehicle() {
    markers = [];
    rutas = [];
    routeNP = [];
    myRoutes();
    driversNRoutes();
    posicionActual();
    var liNew;
    var j = 0;
    for( var x = 0; x < markers.length; x++ ) {
        var textLi = markers[x].placa + " - " + markers[x].ruta + " - " + markers[x].nombre;
        if(find_li(textLi, "listaVehiculos")) {
            liNew = document.createElement("li");
            liNew.id = markers[x].ruta + "la";
            j = x + 1;
            textLi = "&nbsp;" + j + " - " + textLi;
            liNew.innerHTML = textLi;
            document.getElementById("listaVehiculos").appendChild(liNew);
        }
    }
    applyStyle("listaVehiculos");
}

function listVehicleCns() {
    markers = [];
    rutas = [];
    routeNP = [];
    posicionActual();
    var liNew;
    for( var x = 0; x < markers.length; x++ ) {
        var textLi = markers[x].placa + " - " + markers[x].ruta + " - " + markers[x].nombre;
        var variables = "'" + markers[x].placa + "', '" + markers[x].ruta + "', '" + markers[x].nombre + "'";
        var ventanaCns = "'" + "m-SearchRoute" + "'";
        var btnClick = ' <button class="btn_add spaceList" id="' + markers[x].ruta + '" onclick="closePopUp(' + ventanaCns + '); startSelectRoute(' + variables + ');">Ver Usuarios</button>';
        if(find_li(textLi, "listaVehiculosCns")) {
            liNew = document.createElement("li");
            liNew.id = markers[x].ruta + "Cn";
            textLi = "&nbsp;" + textLi + btnClick;
            liNew.innerHTML = textLi;
            document.getElementById("listaVehiculosCns").appendChild(liNew);
        }
    }
    applyStyle("listaVehiculosCns");
}

function applyStyle(list) {
    var estilo;
    var lista = document.getElementById(list).getElementsByTagName("li");
    for ( var i = 2; i < lista.length; i++ ) {
        lista[i].removeAttribute("style");
        if (( i % 2 ) == 0) {
            estilo = "text-align: left; font-size: 12px; background-color: #333333; color: #FFFFFF;";
        }
        else {
            estilo = "text-align: left; font-size: 12px; background-color: #FFFFFF; color: #333333;";
        }
        lista[i].setAttribute("style", estilo);
    }
}
function listVehicleDelete() {
    markers = [];
    rutas = [];
    routeNP = [];
    posicionActual();
    var j = 0;
    for(var x = 0; x < markers.length; x++ ) {
        j = x + 1;
        var liNew = document.createElement("li");
        liNew.id = markers[x].ruta + "ld";
        var textLi = markers[x].ruta + " - " + markers[x].nombre;
        var btnClick = " <button class='btn_add spaceList' id='" + markers[x].placa + "' onclick='remRouteList(this.id)'>Eliminar</button>";
        if(find_li(textLi, "listaVehiculosDel")) {
            liNew.innerHTML = "&nbsp;" + markers[x].placa + x + " - " + textLi + btnClick;
            document.getElementById("listaVehiculosDel").appendChild(liNew);
        }
    }
    applyStyle("listaVehiculosDel");
}

/**
 * Funcion que busca si existe ya el <li> dentrol del <ul>
 * Devuelve true si no existe.
 */
function find_li(content, list) {
    var lista = document.getElementById(list).getElementsByTagName("li");
        for (var i = 0; i < lista.length; i++ ) {
        if(lista[i].innerHTML.includes(content)) {
            indexLine = i;
            return false;
        }
    }
    return true;
}

function myPositionsRefresh(positions) {
//    var shape = {coords: [1, 1, 1, 20, 18, 20, 18, 1], type: 'poly'};
    var limites = new google.maps.LatLngBounds();
    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        var image = {
            url: '../img/android/drawable-mdpi/' + pos.imagen + '.png',
            size: new google.maps.Size(29, 39),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 29)
        };
        var geocoder = new google.maps.Geocoder;
        var myLatlng = new google.maps.LatLng(pos.latitud, pos.longitud);
        geocodeLatLng(geocoder, myLatlng, i);
        var act = 'En transito';
        if(positions.act == 'ok' ) { act = 'Activa'; }
        var marcador = new google.maps.Marker( {
                position: myLatlng,
                map: map,
                title: 'Ruta: ' + pos.nombre + ', Placa: ' + pos.placa + ", Dir: " + direcciones[i] + ", Destino: " + pos.destino,
                icon: image,
                shape: shape,
                zIndex: i
            }
        );
        marcador.addListener('dblclick', function() {
            abrirOpcionModal('m-SearchRoute');
            listVehicleCns();
        });
        marcador.addListener('mouseover', function() {
            document.getElementById('dtsVehiculo').innerHTML = '<strong>&nbsp;&nbsp;' + this.title + '&nbsp;&nbsp;<strong>';
            document.getElementById('dtsVehiculo').style.display='block';
            setTimeout("document.getElementById('dtsVehiculo').style.display='none';", 5000);
        });
        markersDup.push(marcador);
        if(centerMap == 10) {
            limites.extend(marcador.position);
        }
    }
//    centerMap++;
//    console.log("CentrarMap:" + centerMap  + "   " + markersDup.length);
    if(centerMap == 10 && markersDup.length > 0) {
        console.log("Centrar Rutas: " + centerMap);
        map.fitBounds(limites);
        centerMap = 0;
    }
}

function leyendMap(pos, marcador) {
    var contentString = '<div style="text-align: center; color: #000000;"><strong>Ruta</strong></div>';
    contentString += '<div style="text-align: center; color: #000000;">Conductor: ' + pos.nombre + '</div>';
    contentString += '<div style="text-align: center; color: #000000;">Placa: ' + pos.placa + '</div>';
/*
    var infoWindowX = new google.maps.InfoWindow({
        content: contentString
    });
    infoWindow.setContent(contentString);
    infoWindow.open(map, marcador);
*/
}

function setMapOnAll() {
    for (var i = 0; i < markersDup.length; i++) {
        markersDup[i].setMap(null);
    }
    markersDup = [];
}

function setMapOnSelRoute() {
    for (var i = 0; i < markersDup.length; i++) {
        if( markersDup[i].ruta == codeRouteSel ) {
            markersDup[i].setMap(null);
            console.log("Borrando:" + codeRouteSel);
        }
    }
}

function deleteLi(list) {
    var lista = document.getElementById(list).getElementsByTagName("li");
    var nodo = "";
    for (var i = 0; i < lista.length; i++ ) {
        nodo = lista[i].getAttribute("id");
//        console.log("Nodo:"+nodo+" : "+i);
//        if(nodo == "titulo" || nodo == "tituloDel" || nodo == "columnas" || nodo == "columnasDel"){
//            continue;
//        }
        var child = document.getElementById(nodo);
        child.parentNode.removeChild(child);
    }
}

function mapUsersRoute() {
    typeRouteMap++;
    infoWindow = new google.maps.InfoWindow({map: map});
    var datos = conn.database().ref("usersvstravel/" + codeRouteSel);
    datos.orderByValue().on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            var dataUsers = data.val();
            var obj = new Object();
            obj.nombre = dataUsers.childname;
            obj.icon = dataUsers.icon;
            if(obj.icon == undefined){
                obj.icon = 'marketend';
            }
            obj.latitud = dataUsers.latitud;
            obj.longitud = dataUsers.longitud;
            obj.phone = dataUsers.phone;
            obj.id = dataUsers.id;
            obj.stoped = dataUsers.stoped;
            markers.push(obj);
        });
    });
    if (markers.length <= 0) {
        return;
    }
    if( centerMap < limitLoops ) {
        setMapOnAll();
        myPositionsRefreshChild(markers);
    }
    myPositionRefreshRoute();
    google.maps.event.addDomListener(window, 'load', initMap);
}

function myPositionsRefreshChild(positions) {
    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        var image = {
            url: '../img/android/drawable-mdpi/' + pos.icon + '.png',
//            url: '../img/android/drawable-mdpi/avatarcir5.png',
            size: new google.maps.Size(39, 39),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 39)
        };
        var myLatlng = new google.maps.LatLng(pos.latitud, pos.longitud);
        var marcador = new google.maps.Marker( {
            position: myLatlng,
            map: map,
            title: 'Usuario: ' + pos.nombre + " Parada: " + pos.stoped,
            icon: image,
            shape: shape,
            zIndex: i
        });
        markersDup.push(marcador);
    }
}

function myPositionRefreshRoute() {
    var shape = {coords: [0, 0, 50], type: 'circle'};
    var image = {
        url: '../img/android/drawable-mdpi/marcaruta.png',
        size: new google.maps.Size(39, 39),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 39)
    };
    setMapOnSelRoute();
    var obj = new Object();
    var datos = conn.database().ref("datacar/" + plateRouteSel);
    datos.orderByValue().on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            var reg = data.val();
            if( data.key == 'longitud' ) { obj.longitud = reg }
            if( data.key == 'latitud' ) { obj.latitud = reg }
            if( data.key == 'marca' ) { obj.phone = reg }
            if( data.key == 'velocidad' ) { obj.id = reg }
            obj.nombre = nameRouteSel;
            obj.icon = 'marcaruta.png';
        });
    });
    if( obj.latitud == undefined ){ return; }
    var myLatlng = new google.maps.LatLng(obj.latitud, obj.longitud);
    var marcador = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Ruta: ' + codeRouteSel + ', Nombre: ' + nameRouteSel + ', Placa: ' + plateRouteSel,
        icon: image,
        shape: shape,
        zIndex: 999
    });
    markersDup.push(marcador);
    markersDup = eliminarObjetosDuplicados(markersDup, "nombre");
    limitLoops = 10;
    if(centerMap > limitLoops && markersDup.length > 0) {
        map.setCenter(myLatlng);
        console.log("Centrar Detalle Rutas");
/*
        var limites = new google.maps.LatLngBounds();
        for (var i = 0; i < markersDup.length; i++) {
//            console.log("Titulo:" + markersDup[i].title + ":" + i);
            limites.extend(markersDup[i].position);
        }
        map.fitBounds(limites);
*/
        centerMap = 0;
    }

//    centerMap++;
}

function startSelectRoute(plateRoute, codeRoute, nameRoute) {
    codeRouteSel = codeRoute;
    nameRouteSel = nameRoute;
    plateRouteSel = plateRoute;
    typeRouteMap = 1;
    markers = [];
    markersDup = [];
    rutas = [];
    routeNP = [];
    if (entChoose == "")
        var url = "mapRouteDetail.html?routeSel=" + codeRouteSel + "&routeName=" + nameRouteSel + "&routePlate=" + plateRouteSel + "&typeRouteMap=" + typeRouteMap;
    if (entChoose == "enterprise")
        var url = "mapRouteDetailEnt.html?routeSel=" + codeRouteSel + "&routeName=" + nameRouteSel + "&routePlate=" + plateRouteSel + "&typeRouteMap=" + typeRouteMap;
    openeNewTab(url);
}

function openeNewTab(url) {
    var a = document.createElement("a");
    a.target = "_blank";
    a.href = url;
    a.click();
}

function getGET() {
    var loc = document.location.href;
    if( loc.indexOf('?') > 0 )
    {
        var getString = loc.split('?')[1];
        var GET = getString.split('&');
        for(var i = 0, l = GET.length; i < l; i++){
            var tmp = GET[i].split('=');
            varUrlRet.push(unescape(decodeURI(tmp[1])));
        }
        return varUrlRet;
    }
}

function geocodeLatLng(geocoder, latlng, pos){
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[1]) {
                direcciones[pos] = results[1].formatted_address;
 //               console.log("Dreccion Econtrada:" + direcciones[pos]);
            } else {
                window.alert('Sin direccion encontrada');
            }
        } else {
            if (status == "OVER_QUERY_LIMIT")
//            setTimeout(null, 3000);
            return;
        }
    });
}

function cnsAlerts() {
    var datos = conn.database().ref(tblRtAlt[0]);
    var msgAlrtTmp = [];
    var ind = rutas.length;
    var i = 0;
    var currentDiv = document.getElementById('dtsAlertParent');
    var dts;
    datos.orderByValue().on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            dts = data.val();
            if(dts.type > 0) {
                var obj = new Object();
                obj.hour = dts.hour;
                obj.type = dts.type;
                if(dts.message != undefined)
                    obj.message = dts.message;
                obj.ruta = data.key;
//                console.log("obj: " + obj.ruta);
                msgAlrtTmp.push(obj);
            }
        });
    });
    var msgIs, ifNew = 0, inx;
    for(var i = 0; i < msgAlrtTmp.length; i++) {
        msgIs = "no";
        inx = -1;
        for(var j = 0; j < msgAlerts.length; j++) {
            if (msgAlerts[j].ruta == msgAlrtTmp[i].ruta) inx = j;
            if (inx >= 0 && msgAlerts[j].hour == msgAlrtTmp[i].hour) msgIs = "si";
        }
        if(msgIs == "no") {
            var obj = new Object();
            obj = msgAlrtTmp[i];
            if(inx >= 0) msgAlerts[inx] = obj;
            else msgAlerts.push(obj);
            ifNew++;
        }
    }
    if(ifNew == 0) return;
    currentDiv.style.display='block';
    var liNew, textLi, idAlert = 0, msg, fechaTmp, dia, mes;
    fecha = new Date();
    dia = fecha.getDate()<10?'0' + fecha.getDate(): fecha.getDate();
    mes = meses[fecha.getMonth()];
    fechaTmp = dia + " de " + mes + " de " + fecha.getFullYear();
    for(var i = 0; i < markers.length; i++) {
        for(var j = 0; j < msgAlerts.length; j++) {
            if(markers[i].ruta == msgAlerts[j].ruta) {
                liNew = document.createElement("li");
                liNew.id = msgAlerts[j].ruta + "Alert";
                if(msgAlerts[j].type < 9){
                    idAlert = msgAlerts[j].type - 1;
                    msg = alertas[idAlert]
                } else
                    msg = msgAlerts[j].message;
                textLi = "&nbsp;" + fechaTmp + ' ' + msgAlerts[j].hour + ' - Ruta: ' + msgAlerts[j].ruta + ' - Mensaje: ' + msg;
//                console.log("textLi: " + textLi);
                liNew.innerHTML = textLi;
                document.getElementById("dtsAlertParent").appendChild(liNew);
            }
        }
    }
    setTimeout("document.getElementById('dtsAlertParent').style.display='none';", 10000);
    setInterval(function() {
    for(var j = 0; j < msgAlerts.length; j++) {
        var list = document.getElementById("dtsAlertParent").getElementsByTagName("li");
        remFile(list, msgAlerts[j].ruta);
    } }, 10000);

}

function cnsDtStrFnsh() {
    var datos = conn.database().ref(tblRtAlt[1]);
    starandfinish = [];
    datos.orderByValue().on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            var obj = new Object();
            var dat = data.val();
            if (dat.estado == 1) {
                obj.ruta = data.key;
                obj.estado = dat.estado;
                obj.tipo = "";
                if( dat.tipo == 1 ){ obj.tipo = "Colegio" }
                if( dat.tipo == 2 ){ obj.tipo = "Entrega" }
//            console.log('Estado: ' + dat.estado + ', Ruta: ' + obj.ruta);
                starandfinish.push(obj);
            }
        });
    });
}