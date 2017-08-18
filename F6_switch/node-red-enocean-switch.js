
'use strict';




module.exports = function (RED) {
  // Configuration 

  function EnOceanSwitch(n) {
    RED.nodes.createNode(this, n);

    this.baseidcount = n.baseidcount;
    // Retrieve the config node
    var server = RED.nodes.getNode(n.serialport);

    var enocean = server.enocean;

    var Button = require("node-enocean-button");

    var node = this;
    var button = new Button(enocean, this.baseidcount);

    node.on('input', function (msg) {
      // do something with 'msg'
      if (msg.payload === 1) {
        button.A1.click().then(function () {
          console.log("Button A1 clicked");
        });
      } else {
        button.A0.click().then(function () {
          console.log("Button A0 clicked");
        });
      }
    });

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

  RED.nodes.registerType("enocean-switch", EnOceanSwitch);

};
