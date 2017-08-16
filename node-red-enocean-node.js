
'use strict';

var enocean = require("node-enocean")({
  sensorFilePath:"/knownSensors.json",
  configFilePath:"/config.json",
  timeout:30
  });


module.exports = function (RED) {
  // Configuration node
  function EnOceanConfig(n) {
    RED.nodes.createNode(this, n);
    var self = this;
    this.config = n;
    try {
      enocean.listen(this.config.serialport);
    } catch (err) {
      console.log(err);
    }

    enocean.on("error", function (error) {
      console.log(error);
      node.error(error);
    });
    

  };

  RED.nodes.registerType("enocean-config-node", EnOceanConfig);


  function EnOceanListener(n) {
    RED.nodes.createNode(this, n);

    var node = this;
    enocean.on("ready", function () {
      node.status({
        fill: 'green',
        shape: "ring",
        text: "connected"
      });
    });

    enocean.on("data", function (data) {
      console.log(data);
      var msg = {};
      msg.payload = { data: data };
      node.status({
        fill: 'green',
        shape: "ring",
        text: "Data received"
      });
      node.send(msg);
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

  RED.nodes.registerType("enocean-listener", EnOceanListener);

};
