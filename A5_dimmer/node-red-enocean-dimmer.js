
'use strict';

module.exports = function (RED) {
  // Configuration 

  function EnOceanDimmer(n) {
    RED.nodes.createNode(this, n);

    this.baseidcount = n.baseidcount;
    // Retrieve the config node
    var server = RED.nodes.getNode(n.serialport);

    var enocean = server.enocean;

    var Dimmer = require("node-enocean-dimmer");
    console.log("we reached this");
    var node = this;
    var dimmer = new Dimmer(enocean, this.baseidcount);

    enocean.set

    node.on('input', function (msg) {
      // do something with 'msg'
      dimmer.speed = "80"

      switch( msg.payload ) {
      case 1:
        dimmer.teach( );
      break;
      case 0:
        dimmer.off( );
      break;
      default:
        dimmer.setValue( msg.payload );
      break;
      }
    });

    enocean.setMaxListeners(Infinity);

    enocean.on("sent", function () {
      node.status({
        fill: 'green',
        shape: "ring",
        text: "Telegram sent"
      });
    });

    enocean.on("sent-error", function () {
      node.status({
        fill: 'red',
        shape: "ring",
        text: "Telegram not sent"
      });
    });

    enocean.on("ready", function () {
      node.status({
        fill: 'green',
        shape: "ring",
        text: "connected"
      });
    });

    node.on('close', function () {
      enocean.close();
    });

    enocean.on("error", function (error) {
      console.log(error);
      node.status({
        fill: 'red',
        shape: "ring",
        text: "Error: " + error
      });
      node.error(error);
    });

    enocean.on("close", function () {
      node.status({
        fill: 'red',
        shape: "ring",
        text: "No Connection to Serialport"
      });
    });

    enocean.on("disconnect", function () {
      node.status({
        fill: 'yellow',
        shape: "ring",
        text: "Disconnected"
      });
    });

    node.status({
      fill: 'yellow',
      shape: "ring",
      text: "Connecting..."
    });

  };

  RED.nodes.registerType("enocean-dimmer", EnOceanDimmer);

};
