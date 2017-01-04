# Senderos

Dispatcher Javascript que ejecuta en los navegadores. Está inspirado en Express de Node.js

## Instalación

Se puede instalar utilizando npm o bower
```
$ npm install senderos
or 
$ bower install senderos
```

## Inicio Rapido

Con este ejemplo vas a poder ver de que es capaz Senderos y ver lo fácil que es utilizarlo y extenderlo.

**Nota:** Todos los ejemplos están escritos con ES2015.

Primero creamos un archivo `main.js` con nuestro editor favorito e importamos el objeto `dispatcher.js`.

```javascript
// Import Dispatcher.js 
import dispatcher from './node_modules/Senderos/lib/Dispatcher';
```


A continuación declaramos las rutas que queremos utilizar. Para más informacion ver la seccion [declare] del dispatcher.

```javascript
// Declaramos la raiz del sitio
dispatcher.declare( '/', function( req, data, next ) {
    console.log( 'Home del Blog' );
} );

// Declaramos la sección del blog
dispatcher.declare( '/blog', 
    function( req, data, next) {
        console.log( 'Mi primer callback' );
        
        // Pueden ejecutar la vista que gusten.
        // React, Handlebars, etc.

        // Ejecutamos next para pasar al siguiente CB
        next();
    },
    function( req, data ) {
        console.log( 'Mi segundo callback' );

        // Ejetutamos y damos paso a la vista del segundo cb 
    }
);
```


Por último inicializamos el Dispatcher:

```javascript
dispatcher.init();
```

Para navegar entre las rutas o eventos, sin recargar la página, se utiliza el método dispatch:

```javascript
dispatcher.dispatch( '/blog' );
```


# 1- Dispatcher

## 1.1- Declare

El método declare se utiliza para agregar o modificar una ruta/evento dentro del dispatcher de Senderos.

El método posee la siguiente estructura:
```javascript
let idPath = dispatcher.declare( Path, ...Callbacks );
```
Donde:
* **dispatcher:** Es una instancia del dispatcher de Senderos.
* **Path:** Es un String, expreción regular o un Objeto.
* **Callbacks:** Un Array de funciones.
* **Devuelve:** un String con un ID de la ruta.

Ejemplo:
```javascript
let idRootPath = dispatcher.declare( '/', function( req, data ) {
    console.log( 'Home Callback' );
} );
```

### 1.1.1- Path

El parámetro Path del método declare, define los eventos o endpoints en los que la aplicación aceptará una solicitud de ejecución.
Los Paths pueden ser String, RegEx o bien un Objeto con una combinación de los anteriores.

#### Con String:

La ruta se ejecuta cuando el evento / se invoca.

```javascript
dispatcher.declare( '/', function( req, data ) {
    console.log( 'Home Callback' );
    // Render Home view
} );
```

La ruta se ejecuta cuando el evento /profile.html se invoca

```javascript
dispatcher.declare( '/profile.html', function( req, data ) {
    console.log( 'Profile' );
    // Render Profile view
} );
```

#### Con RegEx:
Se puede crear una expreción regular con cualquier patron que sea necesario.

La ruta se ejecuta cuando se llama a /regex o /reex 

```javascript
dispatcher.declare( '/reg?ex', function( req, data ) {
    console.log('reg?ex');
} );
```

La ruta se ejecuta cuando se llama /regex, /reggex, /regasdfex y así sucesivamente.

```javascript
dispatcher.declare( '/reg*ex', function( req, data ) {
    console.log('reg*ex');
} );
```

#### Con Objeto

La declaración de una ruta con un Objeto, tiene el siguiente formato:

```javascript
{
    path: '/profile/edit',
    context: 'get',
    history: true
}
```
Donde:
* **path:** Es un String o RegEx como se vio anteriormente.
* **context:** Es un String y define en que contexto se ejecuta la ruta. Un Path puede tener múltipes contextos que ejecuten lógica diferente. El default: `get`
* **history:** Un boolean que indica si la ruta maneja o no la URL y el historico del navegador. Default: `true`

Ejemplo de una llamada:

```javascript
dispatcher.declare( {
    path: '/',
    context: 'get', // Default context
    history: true
}, function ( req, data ) {
    console.log( 'Se ejecuta con el path / y el contexto get que es el default.' );
} );

// Se agrega una nueva funcionalidad al path / con diferente context.
dispatcher.declare( {
    path: '/',
    context: 'save',
    history: false // No modifica la URL ni cambia el History del navegador.
}, function ( req, data ) {
    console.log( 'Se ejecuta con el path / y el contexto save.' );
} );
```

#### Variables en el Path

Un Path ya sea un String, RegEx o un Objeto puede recibir variables como parámetros.
Las variables comienzan con el simbolo `:` y finalizan con la primer `/` que se encuentra.

```javascript
// Path como String o RegEx
dispatcher.declare( '/blog/:id/:title', function( req, data ) {
    console.log(req.params.id);
    console.log(req.params.title);
} );

// Path como Objeto
dispatcher.declare( {
    path: '/profile/:id',
    context: 'get', // Default context
    history: true
}, function ( req, data ) {
    console.log( req.params.id );
} );
```

En muchos casos, es necesario contar con una variables opcionales, es decir que pueden o no estar en el Path.
Este tipo de variables se declaran de la siguiente manera:

```javascript
// Path como String o RegEx
dispatcher.declare( '/blog/:id/:title?', function( req, data ) {
    console.log(req.params);
} );

// Path como Objeto
dispatcher.declare( {
    path: '/profile/:id?',
    context: 'get', // Default context
    history: true
}, function ( req, data ) {
    if ( req.params.id ) {
        console.log( req.params.id );
    }
} );
```
Este tipo de variable puede o no estar presente en el Objeto request se envía a los callbacks de la ruta.
Antes de utilizarlo, hay que consultar la existencia o no de la variable.


### 1.1.2- Callbacks

Los Callbacks del método declare componen lo que se llama una cadena de ejecución.
Cada función compone un eslabon de la cadena y se ejecutan de forma sincrónica hasta finalizar la cadena o bien se trunque o salga por error.

Los parametros de entrada de un eslabon son los parametros de salida del eslabon anterior. Así sucesivamente hasta finalizar la cadena.

Ejemplo:

```javascript
dispatcher.declare( '/', 
    function( request, data, next) {
        console.log( 'Primer eslabon de la cadena' );

        // Ejecutamos next para pasar al siguiente
        next();
    },
    function( request, data ) {
        console.log( 'Segundo y último eslabon de la cadena' );
    }
);
```

Cada Callback recibe tres parametros:
* **request:** En el Objeto Request obtendremos las variables del Path visto anteriormente y también los Query Strings y el anchor que pueda haber en la url.
* **data:** Un Objeto que puede recibir información del evento. Muy útil para manejar formularios.
* **next:** *(Opcional)* Callback para indicar que finalizó la ejecución del eslabon. 


#### Request

El Objeto tiene el siguiente formato:
```javascript
{
    params: {}, // Donde se encuentran las variables del Path
    query: {},  // Podemos obtener los Query Strings de la URL
    anchor: ''  // El anchor de la URL
}
```


##### Ejemplo:

Supongamos que tenemos el evento `/blog/:id` declarado en nuestro dispatcher y llega el siguiente pedido de ejecución `/blog/123`
El request generado será el siguiente:

```javascript
{
    params: {
        id: 123
    },
    query: {},
    anchor: ''
}
```

Si por el contrario recibimos `/blog/123?test=hi#myAnchor` el request generado será:

```javascript
{
    params: {
        id: 123
    },
    query: {
        test: 'hi'
    },
    anchor: 'myAnchor'
}
```

#### Data

Este Objeto por defecto se encuentra vacío y se utiliza en el caso de necesitar pasar valores a un Evento. Comunmente se utiliza para enviar información de un formulario.


#### Next (Opcional)

Es un callback que permite terminar la ejecución de un eslabon de la cadena y saltar al siguiente. En el caso de necesitar salir por error y terminar la ejecución, se le puede pasar un objeto como parametro indicando el error ocurrido.

En el caso que no se encuentre el callback, el dispatcher presupone que el eslabon es el último y de forma automática finaliza la ejecución de la cadena.

##### Ejemplo:

```javascript
dispatcher.declare( '/', function( req, data, next ) {
    // Ejecuta una lógica compleja
    if ( err ) {
        return next ( err ); // Finaliza la cadena con error
    }
    next();
}, function( req, data, next ) {
    console.log( 'Mi segundo eslabon' );
    next();
}, function( req, data ) {
    // La cadena ejecuta el último eslabon y manda a finalizar con éxito la cadena.
    console.log( 'Fin de la cadena' );
} );
```


## 1.2- Inicialization

## 1.3- Dispatch

## 1.4- Remove 


# 2- Events

## Eventos del Dispatcher

## Como suscribirse evento

## Como publicar un evento

## Desuscribirse de un evento
