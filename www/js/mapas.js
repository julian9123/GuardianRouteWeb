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
var obj = new Object();
var markers = [];
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
                    rutas.push(objE);
            } );
        } );
    }
    var datos = conn.database().ref("travel");
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            var rutaCns = data.key;
            rutaCns = rutaCns.toUpperCase();
            if( rutas.includes(rutaCns) ) {
                obj.ruta = data.key;
                var reg = data.val();
                obj.longitud = reg.longitud;
                obj.latitud = reg.latitud;
                obj.nombre = reg.nombre;
                markers.push(obj);
                marcador = new google.maps.Marker({ position: new google.maps.LatLng(obj.latitud, obj.longitud), map: map, 
                                                 title: 'Ruta:' + obj.nombre, icon: image, shape: shape });
            }
        } );
    } );
    if( rutas.length <= 0 ){ return; }
    google.maps.event.addListener(marcador, 'click', (function(marker, i) {
        return function() {
            infowindow.setContent('Ruta:' + obj.nombre);
            infowindow.open(map, marker);
      }
    })(marcador, i));
    google.maps.event.addDomListener(window, 'load', initMap);
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