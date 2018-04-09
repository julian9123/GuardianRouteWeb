/*
var config = {
                apiKey: 'AIzaSyB5lqBfnODzRWdigNjIdmLBUIvsUmW13uk',
                authDomain: 'juliancorp-9123.firebaseapp.com',
                databaseURL: 'https://juliancorp-9123.firebaseio.com',
                storageBucket: 'juliancorp-9123.appspot.com',
                messagingSenderId: '1085529323533'
             };
*/
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
//Conexion con  persistencia
function conectar(opt) {
    autor.onAuthStateChanged( function( user ) {
        if ( user ) {
            displayName = user.displayName;
            email = user.email;
            photoURL = user.photoURL;
            myUserId = user.uid;
            phoneNumber = user.phoneNumber;
            user.getIdToken().then( function( accessToken ) {
                if( contador > 0 || intentos > 0 ) { return; }
                if( registrado > 0 ) {
                    if( opt == "Ent" )
                        cambioPagina("mapaRuta.html");
                    if( opt == "Sch" )
                        cambioPagina("mapaRutaSchool.html");
                } else {
                    if( opt == "Ent" )
                        cambioPagina("createEnterprise.html");
                    if( opt == "Sch" )
                        cambioPagina("createUserSchool.html");
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
    var ui = new firebaseui.auth.AuthUI(autor);
    ui.start('#firebaseui-auth-container', uiConfig);
    if(opt == ""){
        $('#imgDivImg').hide();
    }
}

function showOptions() {
    $('#imgDivImg').show();
    $('#firebaseui-auth-container').hide();
    $('#btnGoogleLogin').hide();
    document.getElementById('fondoGuardian2').style.background = '#333333';
    document.getElementById('logoGuardianTexto2').style.background = '#333333';
}

function initApp() {
    if( autor.currentUser )  {
        myUserId = autor.currentUser.uid;
//        console.log("Intento 3" + myUserId);
    }
    autor.onAuthStateChanged( function( user ) {
        if ( user ) {
            displayName = user.displayName;
            email = user.email;
            photoURL = user.photoURL;
            myUserId = user.uid;
            phoneNumber = user.phoneNumber;
//            console.log("Intento 2" + myUserId);
/*            
            user.getIdToken().then( function( accessToken ) {
                if( contador > 0 || intentos > 0 ) { return; }
                cnsRutasEmpresa();
                if( registrado > 0 ) { 
                    cambioPagina("mapaRuta.html");
                } else {
                    cambioPagina("createEnterprise.html");
                }
            });
*/            
        } else {
            if( autor.currentUser )  {
                myUserId = autor.currentUser.uid;
//                console.log("Intento 3" + myUserId);
            }
        }
    }, function( error ) {
      console.log("Error Login:" + error);
    } );
}

function cerrarSesion(){
    autor.signOut();
    redireccionar("index.html");
}