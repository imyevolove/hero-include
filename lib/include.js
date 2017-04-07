"use strict"

var callsite = require("callsite");
var path = require("path");
var utils = require("./utils");
var UsingInfo = require("./UsingInfo");

///////////////////////////////////////////////////////////
////////////////////////// INCLUDE ////////////////////////
///////////////////////////////////////////////////////////

/**
 * Smart module require
 * @param {string} file
 * @return {module|undefined}
 */
function include(file) {
    if (!utils.isString(file))
        throw new TypeError("Argument 'file' must be a string");
    
    try {
        
        if (include._modules[file])
            return include._modules[file];
        
        return include.cacheModule(file, require(file));

    } catch (err) {
        return includeWithExtension(file, 0);
    }
}

/// Fast fix for ts scripts
function includeWithExtension(file, index) {
    
    if (index >= include.EXTENSIONS.length)
        throw new Error("Module \"" + file + "\" not found");
    
    try {
        
        var filepath = include.convertFilePath(file);
        
        if (include._modules[filepath]) {
            return include._modules[filepath];
        }
        
        return include.cacheModule(filepath, require(filepath));

    } catch (err) {
        return includeWithExtension(file, index++);
    }
}

include.EXTENSIONS = [
    ".js",
    ".ts"
];

include.utils = utils;
include.getCallerScriptFileName = function () {
    var stack = callsite();
    var filename = "";

    var cCallStack,
        nCallStack;

    try {
        for (var i = 0; i < stack.length; i++) {
            cCallStack = stack[i];
            nCallStack = stack[i + 1];
            
            if (!nCallStack) break;

            if (cCallStack.getFileName() == __filename && nCallStack.getFileName() != __filename) {
                filename = nCallStack.getFileName();
                break;
            }
        }
    } 
    catch (err) { console.log(err) }
    finally { return filename; }
}

///////////////////////////////////////////////////////////
/////////////////////// REQUIRE STYLE /////////////////////
///////////////////////////////////////////////////////////
/*
include.REQUIRE_STYLES = {
    PATH: 1 << 0,
    NAMESPACE: 1 << 1
};

include.convertPathByRequireStyleRule = function (filepath)
{
    switch (include.config.requireStyle)
    {
        case include.REQUIRE_STYLES.NAMESPACE:
            return filepath;
        case include.REQUIRE_STYLES.PATH:
        default:
            return filepath
    }
}

///////////////////////////////////////////////////////////
////////////////////////// CONFIGS ////////////////////////
///////////////////////////////////////////////////////////

include.config = {
    requireStyle: include.REQUIRE_STYLES.PATH
};
*/
///////////////////////////////////////////////////////////
////////////////////////// CONVERT ////////////////////////
///////////////////////////////////////////////////////////

include.convertFilePath = function (path, extension) {

    /// Append file extension if not exists
    if (!utils.hasAnyExtension(path) && !utils.hasJsExtension(path)) {
        path += !extension ? ".js" : extension;
    }
    
    path = include.convertDirectoryPath(path);
    path = utils.removeFileExtension(path);

    return path;
}

include.convertDirectoryPath = function (directoryPath) {
    var destinationDirectory = "";

    /// File path is absolute
    if (path.isAbsolute(directoryPath)) {

        destinationDirectory = directoryPath;

    }

    /// File path is relative
    else {
        destinationDirectory = directoryPath;

        /// Smart require
        try {

            var stack = callsite();
            var dirpath = include.getCallerScriptFileName();

            dirpath = path.dirname(dirpath)
            dirpath = path.join(dirpath, directoryPath);
            dirpath = path.normalize(dirpath);

            var dirExists = utils.fsExists(dirpath);
            if (dirExists) destinationDirectory = dirpath;
            else throw new Error();
        }

        /// Find file in directories
        catch (err) {
            var _dpath = "";

            for (var i in include.using._paths) {
                _dpath = path.join(include.using._paths[i].destination, directoryPath);

                if (utils.fsExists(_dpath)) {
                    destinationDirectory = _dpath;
                    break;
                }
            }

        }
    }

    return destinationDirectory;
}

///////////////////////////////////////////////////////////
////////////////////////// USING //////////////////////////
///////////////////////////////////////////////////////////

/**
 * @description Add tracking path. Return include
 * @param {string} directory
 * @return {object} include
 */
include.using = function (directory) {
    var destination = include.convertDirectoryPath(directory);
    include.using._paths.push(new UsingInfo(directory, destination));

    return include;
}

///
include.using._paths = [];

/**
 * @description The search for the final path along the original path
 * @param {string} directory
 * @returns {string|undefined} Destination pathg or undefined
 */
include.using.find = function (directory) {
    var info = include.using._paths.find(function (info) {
        return info.source == directory;
    });

    return info ? info.destination : undefined;
}

///////////////////////////////////////////////////////////
////////////////////////// CACHE //////////////////////////
///////////////////////////////////////////////////////////

include._modules = {};

include.cacheModule = function (path, module) {
    include._modules[path] = module;
    return module;
}

module.exports = include;