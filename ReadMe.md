###SimpleBrowserifyWatch - require management using unfashionable techniques.


###Why

1. Dependency management is a nightmare for front-end programmers - `browserify` elegantly manages complexities in dependencies. However as you start using a lot of

`requires` browserify slows down. 

2. Even for a simple app it takes a lot of time for browserify to compile all your dependencies. 

3. A simple solution is to have your 'static.js' assets compiled **once** - however if you are like me you like playing around with your static files too ! `npm` makes it simple to quickly play around with different modules.

4. This is why I created `simple-browserify-watch` - to assit workflows that use a `header.js` file that outputs all your static depedencies like jquery/angular/react etc. 

5. Whenever you make changes to your `header.js` file - browserify recompiles your static assets. In my case its mostly just a single file.




###How it Works


Lets say you have a simple application

```HTML
<script type="text/javascript" src ="static.js"></script>
<script type="text/javascript" src ="app.js"></script>
```

You are constantly making rapid changes to your `app.js` file but hardly ever touch `static.js`. This type of workflow becames more logical as your increase the number of dependencies. Its also powerful since it enables the browser to cache the `static.js` file.


```javascript
// app.js

var depend = require("./headers.js");

var _ = depend.underscore;

// .
// .
// .
// .

```

```javascript
// headers.js

var Main = {};

Main._ = require ("underscore");

modules.exports = Main;

```


What you want to do is compile `headers.js` into a static asset - a browserified javascript file. Lets call it `static.js`

With this module in your terminal you can set up a watch for `headers.js`

```
> node SimpleBrowserifyWatch headers.js static.js
```

You get output like this:

![Message](http://i.imgur.com/leEJo6s.png)

### Installation

You could also just save the raw `.js` source code.

If you want to install from the terminal use wget

```
> wget --no-check-certificate http://raw.githubusercontent.com/JoyKrishnaMondal/SimpleBrowserifyWatch/master/SimpleBrowserifyWatch.js
```


### Features

The main feature is error handling - as the module is self contained there is no `package.json`. Any required modules will be installed `locally` by the script itself - to bootstrap itself.


### Testing

I have tested the script for windows but I have no idea how well it will run on mac/linux.

#### NOTE

I will not be maintaining this module unless people inform me they are using it. 

If you find any error or problems please raise it as an issue. 

I will try to solve it as quickly as time permits.