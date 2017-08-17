
'use strict';

module.exports = function (RED) {
  // Configuration node
  function EnOceanConfig(n) {
    RED.nodes.createNode(this, n);

    this.serialport = n.serialport;

    this.enocean = {};

    var enocean = require("node-enocean")({
      sensorFilePath: "./knownSensors.json",
      configFilePath: "./config.json",
      timeout: 30
    });

    var node = this;
    this.enocean = enocean;

    try {
      console.log(this.serialport);
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

    this.knownsensor = n.knownsensor;
    this.devicefilter = n.devicefilter;
    this.devices = n.devices;

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
      //only react to incoming requests which are already learned in
      if (node.knownsensor) {
        //we can let all sensors through which are learned in or only selected
        if (node.devicefilter === "target") {
          var found = false;
          if (node.devices.length > 0) {
            for (var i = 0; i < node.devices.length; i++) {
              // TODO: compare knownSensors from server.enocean.knownsensors to node.devices which were selected
              //maybe lodash to be able to quickly filter and check for matches....
              sendPayload(data);
            }
          }
          // else: all known Sensors are allowed to pass
        } else {
          // TODO: check for match
          sendPayload(data);
        }
      } else {
        sendPayload(data);
      }


    });

    function sendPayload(data) {
      var msg = {};
      msg.payload = { data };
      node.status({
        fill: 'green',
        shape: "ring",
        text: "Data received"
      });
      console.log(data);

      node.send(msg);

    }

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
