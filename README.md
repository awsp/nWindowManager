# nWindowManager - Managing multiple windows for NW.js
---------------
@version 1.0.0-alpha

Inspired by: [https://github.com/varunvairavan/node-webkit-window-manager](https://github.com/varunvairavan/node-webkit-window-manager)

NWindowManager manages your pre-defined windows easily by simply calling its unique ID without further configuration. 
There is no need to manually keep track of which window has already opened nor worry about reopening the same window over again and again. 


#### Installation
Currently only manually installation is availabile sa I haven't publish it to NPM registry. 
- Manual Installation
    - Clone this repo
    - Put it into your app directory
    - Use `npm link` to create a symlink

#### Usage
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


// To open a new window
global.nWindowManager.open("foo");

// To call a function defined in a page of a new window
global.nWindowManager.get("foo").window.myFunction();


```


#### Notes
- Passing data to other windows is still in consideration. 


#### Release Notes
* 2015/05/28 - @version 1.0.0-alpha


#### Issues / Error Reporting
[https://github.com/awsp/nWindowManager/issues](https://github.com/awsp/nWindowManager/issues)