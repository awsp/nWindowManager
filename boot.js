/**
 * NWindow Collection Manager
 *
 * @author Anthony S. Wu <anthonyspwu@gmail.com>
 * @version 1.0
 */

var NWindow, NWindowManager;

/**
 * NWindow Class
 */
NWindow = (function () {
  "use strict";

  function NWindow(gui, page, options) {
    if (!gui) {
      console.error("GUI instance is undefined");
    }
    if (!page) {
      console.error("You must provide a valid page.");
    }

    this.gui = gui;
    this.page = page;
    this.options = options || {};
    this.instance = null;
  }

  /**
   * Spawn a new nWindow using nw.gui API
   * @returns {null|*}
   */
  NWindow.prototype.spawn = function () {
    if (this.page) {
      this.instance = this.gui.Window.open(this.page, this.options);
      return this.instance;
    }
  };

  /**
   * Destroy the nWindow instance.
   */
  NWindow.prototype.destroy = function () {
    this.instance = null;
  };

  /**
   * Check if this nWindow has spawned.
   * @returns {boolean}
   */
  NWindow.prototype.hasSpawned = function () {
    return this.instance !== null;
  };

  return NWindow;
})();


/**
 * NWindowList Class
 */
var NWindowList = (function () {

  function NWindowList() {
    this.nWindowList = [];
  }

  NWindowList.prototype.add = function (uid, nWindow) {
    this.nWindowList.push({
      uid: uid,
      nWindow: nWindow
    });
  };

  NWindowList.prototype.get = function () {
    return this.nWindowList;
  };

  NWindowList.prototype.data = function () {
    var data = [];
    for (var i in this.nWindowList) {
      var win = this.nWindowList[i];
      data.push({
        uid: win.uid,
        position: {
          x: win.nWindow.instance.x,
          y: win.nWindow.instance.y
        },
        size: {
          width: win.nWindow.instance.width,
          height: win.nWindow.instance.height
        }
      });
    }

    return data;
  };

  return NWindowList;
})();


/**
 * NWindowManager Class
 */
NWindowManager = (function () {
  "use strict";

  function NWindowManager(gui, nWindowList) {
    this.nWindowList = {};
    this.gui = gui;

    if (nWindowList) {
      for (var uid in nWindowList) {
        this.add(uid, nWindowList[uid]);
      }
    }
  }

  /**
   * Initialize a new nWindow.
   * @param key
   * @param nWindowData
   * @returns {NWindowManager}
   */
  NWindowManager.prototype.add = function (key, nWindowData) {
    if (nWindowData.hasOwnProperty('page')) {
      this.nWindowList[key] = new NWindow(this.gui, nWindowData.page, nWindowData.options);
    }
    return this;
  };

  /**
   * Spawn and focus to a new nWindow
   * @param uid
   * @returns {null|NWindow}
   */
  NWindowManager.prototype.open = function (uid) {
    var nWindow = this.find(uid);

    if (nWindow) {
      if (! nWindow.hasSpawned()) {
        var instance = nWindow.spawn();
        instance.on("loaded", function () {
          this.focus();
          this.on("closed", function () {
            nWindow.destroy();
            this.close(true);
          });
        });
      }
      return nWindow;
    }
    else {
      // Not in list
      console.error("Window with uid " + uid + " is not found. ");
    }
  };

  /**
   * Check if a nWindow with provided uid exists.
   * @param uid
   * @returns {boolean}
   */
  NWindowManager.prototype.exists = function (uid) {
    return this.nWindowList.hasOwnProperty(uid) === true;
  };

  /**
   * Find a nWindow with its uid
   * @param uid
   * @returns {*}
   */
  NWindowManager.prototype.find = function (uid) {
    return this.exists(uid) ? this.nWindowList[uid] : null;
  };

  /**
   * Return the instance of nWindow's Window context.
   * If you would like to look for the nWindow instance, use find() instead.
   * @param uid
   * @returns {*}
   */
  NWindowManager.prototype.get = function (uid) {
    var nWindow = this.find(uid);
    if (nWindow) {
      return nWindow.instance;
    }
    return null;
  };

  /**
   * Close a nWindow by its uid
   * @param uid
   */
  NWindowManager.prototype.close = function (uid) {
    var nWindow = this.find(uid);
    if (nWindow && nWindow.hasSpawned()) {
      nWindow.instance.close();
    }
  };

  /**
   * Close all nWindow, useful when quiting an app with multiple windows
   */
  NWindowManager.prototype.closeAll = function () {
    for (var uid in this.nWindowList) {
      var nWindow = this.find(uid);
      if (nWindow.hasSpawned()) {
        nWindow.instance.close(true);
      }
    }
  };

  /**
   * Obtain current position, size and uid of opened windows.
   * Allow for saved session when re-opening windows.
   * @returns {NWindowList}
   */
  NWindowManager.prototype.openedWindows = function () {
    var openedWindows = new NWindowList();
    for (var uid in this.nWindowList) {
      var nWindow = this.find(uid);
      if (nWindow.hasSpawned()) {
        openedWindows.add(uid, nWindow);
      }
    }
    return openedWindows;
  };

  return NWindowManager;
})();

exports.NWindowManager = NWindowManager;