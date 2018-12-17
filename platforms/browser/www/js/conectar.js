/*
var config = {
                apiKey: 'AIzaSyB5lqBfnODzRWdigNjIdmLBUIvsUmW13uk',
                authDomain: 'juliancorp-9123.firebaseapp.com',
                databaseURL: 'https://juliancorp-9123.firebaseio.com',
                storageBucket: 'juliancorp-9123.appspot.com',
                messagingSenderId: '1085529323533'
             };
*/

"use strict";

var config = {
    apiKey: 'AIzaSyD0s53gqHP_mjfiy2qLAgH2GXe9VGZslFo',
    authDomain: 'gardianapps.firebaseapp.com',
    databaseURL: 'https://gardianapps.firebaseio.com/',
    storageBucket: 'gardianapps.appspot.com',
    messagingSenderId: '435530095671'
};
var conn = firebase.initializeApp(config);
var proveedor = new firebase.auth.GoogleAuthProvider();
proveedor.addScope('https://www.googleapis.com/auth/contacts.readonly');
proveedor.addScope('profile');
proveedor.addScope('email');
proveedor.addScope('openid');
var autor = conn.auth();
var msg = conn.messaging();
var storage = conn.storage();
//Conexion con  persistencia
function conectar(opt) {
    if (document.getElementsByClassName('dialog') != undefined) {
        abrirOpcionModal('m-WaitRoute');
        getMoveImage();
    }
    autor.onAuthStateChanged( function( user ) {
        if (user) {
            displayName = user.displayName;
            email = user.email;
            photoURL = user.photoURL;
            myUserId = user.uid;
            phoneNumber = user.phoneNumber;
            user.getIdToken().then( function( accessToken ) {
                if (contador > 0 || intentos > 0) { return; }
                myUserId = autor.currentUser.uid;
                var dirURL = "";
                if (opt == "Ent") {
                    var datos = conn.database().ref( "entUser/" + myUserId );
                    datos.orderByValue().on( "value", function( snapshot ) {
                        snapshot.forEach( function( data ) {
                            registrado++;
                            entRoute = data.key;
                            var datosX = conn.database().ref( tblRtAlt[9] + "/" + entRoute );
                            datosX.orderByValue().on("value", function(snapshot) {

                                if (snapshot.numChildren() > 0) {
                                    dirURL = "mapaRutaEnt.html";
                                    entChoose = "enterprise";
                                    cambioPagina(dirURL);
                                    return;
                                }
/*
                                snapshot.forEach( function(dataX) {
                                    if (dataX.key == "est" && dataX.val() == 2) {
                                        dirURL = "mapaRutaEnt.html";
                                        entChoose = "enterprise";
                                    }
                                    if (dataX.key == "est" && dataX.val() != 2) dirURL = "mapaRutaEnt.html";
                                    if (dirURL != "") {
                                        cambioPagina(dirURL);
                                        return;
                                    }
                                } );
*/
                            } );
                        } );
                        setTimeout(function () {
                            if( opt == "Ent" )
                                cambioPagina("createEnterprise.html");
                        }, 3000);
                    } );
                }
                if (opt == "Sch") {
                    var datos = conn.database().ref( "schUser/" + myUserId );
                    datos.orderByValue().on( "value", function( snapshot ) {
                        snapshot.forEach( function( data ) {
                            registrado++;
                            entRoute = data.key;
                            var datosX = conn.database().ref( tblRtAlt[14] + "/" + entRoute );
                            datosX.orderByValue().on("value", function(snapshot) {
                                snapshot.forEach( function(dataX) {
                                    dirURL = "mapaRutaSchool.html";
                                    if (dirURL != "") {
                                        cambioPagina(dirURL);
                                        return;
                                    }
                                } );
                            } );
                        } );
                        setTimeout(function (){
                            if( opt == "Sch" )
                                cambioPagina("createUserSchool.html");
                        }, 3000);
                    } );
                }
                showOptions();
            } );
        } 
    } );
//Valida si hay conexion
    var uiConfig = {
        signInSuccessUrl: '#',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            /*
                      firebase.auth.FacebookAuthProvider.PROVIDER_ID
                      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                      firebase.auth.GithubAuthProvider.PROVIDER_ID,
                      firebase.auth.EmailAuthProvider.PROVIDER_ID,
                      firebase.auth.PhoneAuthProvider.PROVIDER_ID
            */
        ],
        tosUrl: 'http://guardianrutas.com/politicas-y-condiciones-de-uso-guardian-app-padres/'
    };
    if (opt == "") {
        var ui = new firebaseui.auth.AuthUI(autor);
        ui.start('#firebaseui-auth-container', uiConfig);
        $('#imgDivImg').hide();
        document.getElementById('termino').style.color = '#333333';
        document.getElementById('condicionesHref').style.color = '#333333';
        closePopUp('m-WaitRoute');
    }
}

function showOptions() {
    $('#imgDivImg').show();
    $('#firebaseui-auth-container').hide();
    $('#btnGoogleLogin').hide();
//    document.getElementById('fondoGuardian2').style.background = '#333333';
//    document.getElementById('logoGuardianTexto2').style.background = '#333333';
    document.getElementById('fondoGuardian2').style.background = '#FFFFFF';
    document.getElementById('logoGuardianTexto2').style.background = '#FFFFFF';
    document.getElementById('termino').style.color = '#333333';
    document.getElementById('condicionesHref').style.color = '#333333';
}

function initApp() {

    var obj = new Object();
    var timeOut;
    if (autor.currentUser) {
        obj.myUserId = autor.currentUser.uid;
        myUserId = autor.currentUser.uid;
//        console.log("Intento 1" + myUserId);
    }
    autor.onAuthStateChanged( function( user ) {
        if (tokenSesion > 2 && (myUserId == "" || myUserId == undefined || myUserId == null)) {
            msjAlert('Usted no esta autorizado para ingresar a esta opción', 2);
            setTimeout(function () {
                cambioPagina('index.html');
            }, 5000);
            return;
        }
        tokenSesion++;
        if (user) {
            obj.displayName = user.displayName;
            obj.email = user.email;
            obj.photoURL = user.photoURL;
            obj.myUserId = user.uid;
            myUserId = user.uid;
            obj.phoneNumber = user.phoneNumber;
            obj.myUserId = autor.currentUser.uid;
        } else {
            if (autor.currentUser)  {
                obj.myUserId = autor.currentUser.uid;
                myUserId = autor.currentUser.uid;
            }
        }
    }, function( error ) {
      console.log("Error Login:" + error);
    } );
    if (myUserId == "" || myUserId == undefined)
        timeOut = setTimeout( initApp, 1000 );
    else
        clearTimeout(timeOut);
//    objCnx.push(obj);
//    console.log(myUserId + "" + myUserId + "" + myUserId);
    return myUserId;
}

function cerrarSesion(){
    autor.signOut();
    cambioPagina("index.html");
}

function getEventWindow() {
    document.addEventListener("visibilitychange", function() {
//        console.log( "getEventWindow: " + document.visibilityState );
    });
}