var directionsService;
var directionsDisplay;

function initMap() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: myLat, lng: myLong}
  });
  directionsDisplay.setMap(map);
    plateRouteSel = "UDDC7951";
//  document.getElementById('submit').addEventListener('click', function() {
    
//  });
}

function iniciarlavaina(){
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [];
    markersDup = [];
    var checkboxArray = markersDup;
    
    var datos = conn.database().ref("usersvstravel/" + plateRouteSel);
    console.log("D:"+datos);
    datos.orderByValue().on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            var reg = data.val();
            var obj = new Object();
            
//            console.log(reg.latitud);
            obj.longitud = reg.longitud;
            obj.latitud = reg.latitud;
            markersDup.push(obj);
//            var myLatlng = new google.maps.LatLng(obj.latitud, obj.longitud);
//            waypts.push({ location: myLatlng, stopover: true });            
        });
        
    });    
    for (var i = 0; i < markersDup.length; i++) {
        var myLatlng = new google.maps.LatLng(markersDup[i].latitud, markersDup[i].longitud);
        console.log(JSON.stringify(myLatlng));
        waypts.push({ location: myLatlng, stopover: true });
    }
    console.log("O:"+waypts.length);
  directionsService.route({
    origin: new google.maps.LatLng(myLat, myLong),
    destination: new google.maps.LatLng(4.57754, -74.23198166666666),
    waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
      /*var summaryPanel = document.getElementById('directions-panel');
      //summaryPanel.innerHTML = '';
      // For each route, display summary information.
      for (var i = 0; i < route.legs.length; i++) {
        var routeSegment = i + 1;
        summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
            '</b><br>';
        summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
        summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
        summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }
      */
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

}



/*
var directionsDisplay;
var directionsService;

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
    
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
    zoom:7,
    center: chicago
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsDisplay.setMap(map);
}

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
}





*/