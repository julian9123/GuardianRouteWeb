var fecha;
var posRuta = new Object();
var gpRutas = [];
//var myUserId;

function d2(n) {
    if(n<9) return "0"+n;
    return n;
}
function formatoFecha(){
    fecha = new Date();
    var sDate = fecha.getFullYear() + "-" + d2(parseInt(fecha.getMonth()+1)) + "-" + d2(fecha.getDate()) + " " + d2(fecha.getHours()) + ":" + d2(fecha.getMinutes()) + ":" + d2(fecha.getSeconds());
    fecha = sDate;
}

//Guardar datos de posicion del usuario
function guardarPosicion(position) {
    if( validBrowser == 1 ){
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
//    var datos = conn.database().ref("usuario/cliente/" + myUserId );
    var datos = conn.database().ref("usuario/" + fec );
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
    datos.set({ usuario : email,
                useId : myUserId,
                fecha : fecha,
                ahora : fec,
                latitud : position.lat + ( distancia / 10000000 ),
                longitud : position.lng + ( distancia / 10000000 ),
                precision : distancia
              }).then(function() { console.log('dato almacenado correctamente'); })
                .catch(function(error) { alert('detectado un error', error); });    
}

function registroDatos() {
    var msjError = "";
    initApp();
    userName = $('#txtNombres').val();
    if( userName == "" ) { msjError += "Debes ingresar por lo menos un nombre para continuar \n"; }
    userLastName = $('#txtApellidos').val();
    if( userLastName == "" ) { msjError += "Debes ingresar por lo menos un apellido para continuar \n"; }
    userCellPhone = $('#txtCelular').val();
    if( userCellPhone == "" ) { msjError += "Debes ingresar un numero celular para continuar \n"; }
    var pais = document.getElementById("paisCelular");
    var paisSel = pais.options[pais.selectedIndex].value;
    if( paisSel == "" ) { msjError += "Debes seleccionar un pais para continuar \n"; }
    obtenercodEmp();
    if( userName != "" && userLastName != "" && userCellPhone != "" && codRuta != "" && paisSel != "" ) {
        var datos = conn.database().ref("enterprise/" + myUserId + "/" + codRuta );
        alert("datos:" + datos);
        datos.set({ userName : userName,
                    userlastName : userLastName,
                    userCellPhone : userCellPhone,
                    paisSel : paisSel
                  }).then( function() { 
                        alert('dato almacenado correctamente'); 
                        cambioPagina('routeSelection.html');
                    } )
                    .catch(function(error) { 
                        alert('detectado un error', error); 
                        return; 
                    });    
    } else {
        var $popUp = $('#mensajeError');
        var $msj = $('#estadoFormulario');
        $msj.val(msjError);
        $popUp[0].showModal();
        return;
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
//            alert("key:" + data.key);
        } );
    } );    
}

function cnsUsuarioEmpresa() {
    intentos = 0;
    registrado = 0;
    var empresa = $('#txtRuta').val();
    var datos = conn.database().ref("enterprise/" + myUserId + "/" + empresa );
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            registrado++;
//            alert("key:" + data.key);
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
    console.log("Inicio:" + new Date().getTime());
}