var NWindow = (function () {

  function NWindow(gui, page, options) {
    if (! page) {
      console.error("You must provide a valid page.");
      return false;
    }
    if (! gui) {
      console.error("GUI instance is undefined");
      return false;
    }
    this.gui = gui;
    this.page = page;
    this.options = options || {};
    this.instance = null;
  }

  NWindow.prototype.spawn = function () {
    if (this.page) {
      this.instance = this.gui.Window.open(this.page, this.options);
      return this.instance;
    }
  };

  NWindow.prototype.destroy = function () {
    this.instance = null;
    return ;
  };

  NWindow.prototype.hasSpawned = function () {
    return this.instance !== null;
  };

  return NWindow;
})();

var NWindowManager = (function () {

  function NWindowManager(gui, nWindowList) {
    this.nWindowList = {};
    this.gui = gui;

    if (nWindowList) {
      for (var uid in nWindowList) {
        this.add(uid, nWindowList[uid]);
      }
    }
  }

  NWindowManager.prototype.add = function (key, nWindowData) {
    if (nWindowData.hasOwnProperty('page')) {
      this.nWindowList[key] = new NWindow(this.gui, nWindowData.page, nWindowData.options);
    }
    return this;
  };

  NWindowManager.prototype.exists = function (uid) {
    return this.nWindowList.hasOwnProperty(uid) === true;
  };

  NWindowManager.prototype.open = function (uid) {
    var self = this;

    if (this.exists(uid)) {
      if ( ! this.nWindowList[uid].hasSpawned()) {
        var instance = this.nWindowList[uid].spawn();
        instance.on("loaded", function () {
          this.focus();
          this.on("closed", function () {
            self.nWindowList[uid].destroy();
            this.close(true);
          });
        });
      }
    }
    else {
      // Not in list
    }
  };

  NWindowManager.prototype.closeAll = function () {
    for (var uid in this.nWindowList) {
      var win = this.nWindowList[uid];
      win.instance.close(true);
    }
  };

  return NWindowManager;
})();