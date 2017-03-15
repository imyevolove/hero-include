"use strict"

var fs = require("fs");
var path = require("path");

module.exports = new (function Utils() {

    var that = this;

    /**
     * Returns the result of checking whether the object is a string
     * @param {string} str
     * @return {bool}
     */
    this.isString = function (str) {
        return typeof str == "string";
    };

    /**
     * @description Check for an existing file or directory by the path
     * @param {string} path
     * @return {bool}
     */
    this.fsExists = function (path) {

        ///
        if (!that.isString(path))
            throw new TypeError("Argument 'path' must be a string");

        try {
            fs.accessSync(path);
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
    * @description Checks if the file has a javascript extension
    * @param {string} filepath
    * @return {bool}
    */
    this.hasJsExtension = function (filepath) {
        return path.extname(filepath).toLowerCase() == ".js";
    }

    /**
     * @description Returns path without file extension
     * @param {string} path
     * @return {string}
     */
    this.removeFileExtension = function (path) {

        if (!that.isString(path))
            throw new TypeError("Argument 'path' must be a string");
        
        return path.replace(/\.[^/.]+$/, "");
    }

})();
