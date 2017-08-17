
'use strict';

module.exports = function (RED) {
  // Configuration node
  function EnOceanConfig(n) {
    RED.nodes.createNode(this, n);

    this.serialport = n.serialport;

    this.enocean = {};

    var enocean = require("node-enocean")({
      sensorFilePath: "/knownSensors.json",
      configFilePath: "/config.json",
      timeout: 30
    });

    var node = this;
    this.enocean = enocean;

    try {
      //timout needed in case of redeploy (serialport could be still open)
      this.enocean.listen(this.serialport);
    } catch (err) {
      console.log(err);
    }

    this.enocean.on("error", function (error) {
      console.log(error);
      node.error(error);
    });

  };

  RED.nodes.registerType("enocean-config-node", EnOceanConfig);


  function EnOceanListener(n) {
    RED.nodes.createNode(this, n);

    var server = RED.nodes.getNode(n.serialport);

    var node = this;
    server.enocean.on("ready", function () {
      node.status({
        fill: 'green',
        shape: "ring",
        text: "connected"
      });
    });

    node.on('close', function () {
      console.log("CONNECTION GETS CLOSED"); // <-- no 'done' argument, nothing more is needed
      server.enocean.close();
    });

    server.enocean.on("data", function (data) {
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

    server.enocean.on("error", function (error) {
      console.log(error);
      node.status({
        fill: 'red',
        shape: "ring",
        text: "Error: " + error
      });
      node.error(error);
    });

    server.enocean.on("close", function () {
      node.status({
        fill: 'red',
        shape: "ring",
        text: "No Connection to Serialport"
      });
    });

    server.enocean.on("disconnect", function () {
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
