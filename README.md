# nWindowManager - Managing multiple windows for NW.js
---------------
@version 1.0.0-alpha

Inspired by: [https://github.com/varunvairavan/node-webkit-window-manager](https://github.com/varunvairavan/node-webkit-window-manager)

NWindowManager manages your pre-defined windows easily by simply calling its unique ID without further configuration. 
There is no need to manually keep track of which window has already opened nor worry about reopening the same window over again and again. 


#### Installation
Currently only manually installation is available as I haven't officially published it
- Manual Installation
    - Clone this repo
    - Put it into your app directory
    - Use `npm link` to create a symlink

#### Example

##### Simple usage: 
```js
var gui = require("nw.gui");
var masterWindow = gui.Window.get();
var NWindowManager = require('nWindowManager').NWindowManager

global.nWindowManager = new NWindowManager(gui, {
  foo: {
    page: "path/to/your/page.html",
    options: {
      frame: true,
      toolbar: false,
      width: 860,
      height: 450,
      show: true,
      resizable: false
    }
  },
  preferences: {
    page: "modules/preferences/panel.html"
  }
});

onload = function () {
  masterWindow.show();
  masterWindow.focus();
  masterWindow.on("closed", function () {
    this.hide();
    // Show close all windows when main window is closed. 
    global.nWindowManager.closeAll();
    this.close(true);
  });
};
```


##### To open a new window:
```js
global.nWindowManager.open("foo");
```

##### To call a function defined in a page of a new window
```js
global.nWindowManager.get("foo").window.myFunction();
```

##### Re-opening windows with saved session, (Using arvindr21's [diskDB](https://github.com/arvindr21/diskDB) for example. )
```js
// Save sessions
var db = require('diskdb');
db = db.connect('db/', ['nwindows']);

var openedWindows = global.nWindowManager.openedWindows();
db.nwindows.save(openedWindows.data());
global.nWindowManager.closeAll();


// Re-open
if (db.nwindows.count() > 0) {
  var openedWindows = db.nwindows.find();
  for (var i in openedWindows) {
    var uid = openedWindows[i].uid;
    var position = openedWindows[i].position;
    var size = openedWindows[i].size;
    var nWindow = global.nWindowManager.open(uid);
    if (nWindow) {
      nWindow.instance.moveTo(position.x, position.y);
      nWindow.instance.resizeTo(size.width, size.height);
    }
  }
  db.nwindows.remove();
}
```



#### Notes
- Passing data to other windows is still in consideration. 


#### Release Notes
* 2015/05/28 - @version 1.0.0-alpha


#### Issues / Error Reporting
[https://github.com/awsp/nWindowManager/issues](https://github.com/awsp/nWindowManager/issues)