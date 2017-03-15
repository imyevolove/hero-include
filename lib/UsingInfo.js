"use strict"

/**
 * @param {string} source
 * @param {string} destination
 * @description Contains information about compiled path
 */
function UsingInfo(source, destination) {
    this.source = source;
    this.destination = destination;
}

module.exports = UsingInfo;