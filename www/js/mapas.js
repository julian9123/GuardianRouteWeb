'use strict';

var map;
var myLat = 4.7513308,
    myLong = -74.0651812,
    myRadius,
    userLocation,
    address,
    panorama,
    streetPlace;
var infoWindow;
var options;
var markers = [];
var markersDup = [];
var rutas = [];
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
    map = new google.maps.Map( document.getElementById('map'), { center: {lat: myLat, lng: myLong}, zoom: 10, 
                              mapTypeId: google.maps.MapTypeId.ROADMAP } );
    infoWindow = new google.maps.InfoWindow({map: map});
    options = { enableHighAccuracy: true, maximumAge: 100, timeout: 100000 };
    setInterval(posicionActual, 3000);
    if( entUser == "" ) { cnsUsuarioEmpresa(); }
    if( entUser == "" ) { cnsUsuarioEmpresa(); }
    if( entUser == "" ) { cnsUsuarioEmpresa(); }
}

function myPositions() {
    var image = { url: '../img/android/drawable-mdpi/marcaruta.png',
                  size: new google.maps.Size(29, 39),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(0, 29)
                };
    var shape = { coords: [1, 1, 1, 20, 18, 20, 18, 1], type: 'poly' };
    var i = 0, j = 0, k = 0, marcador;
    if( rutas.length <= 0 ) {
        var datosE = conn.database().ref("entRoute/" + entUser);
        datosE.orderByValue().on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                var x = data.val();
                    var ruta = x.routeCode;
                    var objE = new Object();
                    objE = ruta.toUpperCase();
//                    objE = minToMayus(ruta);
                    rutas.push(objE);
            } );
        } );
    }
    var datos = conn.database().ref("travel");
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            var rutaCns = data.key;
//            markers.slice(0, markers.length);
            rutaCns = rutaCns.toUpperCase();
            if( rutas.includes(rutaCns) ) {
                var obj = new Object();
                obj.ruta = data.key;
                var reg = data.val();
                obj.longitud = reg.longitud;
                obj.latitud = reg.latitud;
                obj.nombre = reg.nombre;
                obj.url = "https://www.youtube.com/watch?v=bmtbg5b7_Aw";
                markers.push(obj);
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
                
            }
        } );
    } );
    markers = eliminarObjetosDuplicados(markers, "ruta");
    if( rutas.length <= 0 ){ return; }
    google.maps.event.addDomListener(window, 'load', initMap);
}

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
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                      'Servicio de Geolocation Fallo' :
                      'Error: Your browser doesn\'t support geolocation.');
}

function posicionActual() {
    myPositions();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
            };
            guardarPosicion(pos);
            if( contador < 3 ){ map.setCenter(pos); }
        },
        function(error) {
            handleLocationError(true, infoWindow, map.getCenter());
        }, options );
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function listVehicle() {
    var estilo;
    var j = 0;
    for(var x = 0; x < markers.length; x++ ) {
        j = x + 1;
        var liNew = document.createElement("li");
        liNew.id = markers[x].ruta + "la";
//        var textLi = "&nbsp;" + j + ". ASD11" + x + " - " + markers[x].ruta + " - " + markers[x].nombre;
        var textLi = j + ". ASD11" + x + " - " + markers[x].ruta + " - " + markers[x].nombre;
        if(find_li(textLi, "listaVehiculos")) {
//            if( ( j % 2 ) == 0 ) { estilo = "text-align: left; font-size: 12px; background-color: #333333; color: #FFFFFF;"; }
//            else { estilo = "text-align: left; font-size: 12px; background-color: #FFFFFF; color: #333333;"; }
            liNew.innerHTML = textLi;
            liNew.setAttribute("style", "text-align: left; font-size: 12px;");
            document.getElementById("listaVehiculos").appendChild(liNew);
        }
    }
}

function listVehicleDelete() {
    for(var x = 0; x < markers.length; x++ ) {
        var liNew = document.createElement("li");
        liNew.id = markers[x].ruta + "ld";
//        var textLi = "&nbsp;" + 1+x + ". ASD11" + x + " - " + markers[x].ruta + " - " + markers[x].nombre;
        var textLi = 1+x + ". ASD11" + x + " - " + markers[x].ruta + " - " + markers[x].nombre;        
        var btnClick = " <button class='btn_add' id='" + markers[x].ruta + "' onclick='remRouteList(this.id)'>Eliminar</button>";
        if(find_li(textLi, "listaVehiculosDel")) {
            liNew.innerHTML = textLi + btnClick;
            liNew.setAttribute("style", "text-align: left; font-size: 12px;");
            document.getElementById("listaVehiculosDel").appendChild(liNew);
        }
    }
}

/**
 * Funcion que busca si existe ya el <li> dentrol del <ul>
 * Devuelve true si no existe.
 */
function find_li(content, list) {
    var lista = document.getElementById(list).getElementsByTagName("li");
        for (var i = 0; i < lista.length; i++ ) {
        if(lista[i].innerHTML.includes(content)) {
            return false;
        }
    }
    return true;
}