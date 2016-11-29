# Botpress

A bot CMS built with nodejs

![](/images/botpress-dark.png "botpress logo")


## General Concept

Botpress is a Content Managment System for chatbot. Like wordpress, you can install
multiple modules and config them in the dashboard panel.

Each module can communicate each others through centralized event system provided by botpress.
However, you ignore that if you're planning to develop a module.



## Installation

```
> npm install -g botpress
```



## Getting Started

Step 1: Install botpress globally (check the installation section)

Step 2: Create a project

```
> mkdir hello-botpress && cd hello-botpress
> botpress init
```

And fill the name, description ... etc
botpress will install the necessary packages for you automatically

Step 3: install the module you need, for example: botpress-messenger

```
> botpress install botpress-messenger
```

The module will be registered automatically by botpress system.


One thing need to notice is that, the sequence of registering is
the sequence of middleware execution. You can config the order in the dashboard panel.


Step 4: start server

```
> botpress start
```

It will start a server with port 3000, so check the initial project by visiting <http://localhost:3000>.
And you can config the module within the dashboard panel.



## Configuration:

There is a config file `botfile.js` in root folder of the project, please check that file
if you need to customize something like where the data to be stored or access control of
dashboard panel.

### folder structure

- data
  - secret.key

### Security

You can set passowrd dashboard panal in
`process.env.BOTPRESS_ADMIN_PASSWORD` or `botfile.login.password`. But if you run botpress in dev mode,
then by default, it doesn't required.


## How to develop a module

### Initialize a new module

Step 0: Make sure the botpress cli has been installed globally

Step 1: Initialize the project

```
> botpress create
```

It will ask you the name, description and others information of the module,
and generate module within folder with the name prefixed by `botpress-`.

For example your fill the with `hello-module`, then it will generate a folder
`botpress-hello-module`.

Step 2: install this module to your project

```bash
# cd into the module
> cd botpress-sample-module

# link it
> npm link

# link the module to you project
> cd ../to/your/project
> npm link botpress-sample-module
```

Step 3: Develop with following command:

```
> npm run watch
```

Step 3: publish it after you finish development

We use npm as underlining package management system, so just publish it with ordinary npm way.

```bash
> npm run compile
> npm publish
```

### Development Guide

#### Some basic concept

There are two middleware which is just like an event bus:

- outgoing: the events go from botpress to outside.
- incoming: the events go into botpress from outside.

Every modules can send events in to and out from botpress system by using the botpress context object.

#### Botpress context object

The global context object: `botpress`

```javascript
const botpress = {
  hear: (condition, callback) => void,      // register callback for incoming events only in given condition
  outgoing: (message) => void,              // send message to outside
  incoming: (message) => void,              // send message to inside
  getRouter: (scopeName) => ExploreRouter,  // you can register api endpoint on botpress server
}
```

#### Hooks

There are some basic hooks will be invoked:

*init*

```javascript
{
  /**
   * @param bp -- the botpress global context
   */
  init: function(bp) {
    // this function will be invoked after botpress initialized and before the server started
    // registerMiddleware should be invoked here
  }
}
```


*ready*

```javascript
{
  /**
   * @param bp -- the botpress global context
   */
  ready: function(bp) {
    // this function will be invoked after botpress server started

    // here is the an example of adding API endpoint
    // this will add `GET /api/botpress-messenger/config`
    bp.getRouter("botpress-messenger")
    .get("/config", (req, res, next) => {
      res.send("config here")
    })
  }
}
```

And every modules can receive events in to and out from botpress system by registering middlewares.

For example:

```javascript

const outgingMiddleware = (event, next) => {
  // handle event

  if (/* there is an error */) return next(err)

  next() // remember to call next after finish all process
}


bp.registerMiddleware({
  name: 'messenger.sendMessages', // middleware name, should be unique in a project
  type: 'outgoing',               // incoming or outgoing
  order: 100,                     // the order of recieving event, lower is earlier
  handler: outgoingMiddleware,    // the handler callback
  module: 'botpress-messenger',   // belongs to which module, for dispaly

  // description, for display
  description: 'Sends out messages that targets platform = messenger.' +
  ' This middleware should be placed at the end as it swallows events once sent.'
})

```


#### Interfaces:

Every module includes one interface endpoint `src/views/index.jsx`.
As you can see, this is a React component. Botpress will automatically load
this into dashboard panel.

There is a `axios` instance injected by botpress system. Botpress provides this as
a conveninent http client which contains proper authentication headers. You can get that
by `this.props.bp.axios`.

## Contributing

TODO

## License

AGPL 3.0
