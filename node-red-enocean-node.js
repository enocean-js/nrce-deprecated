'use strict';

module.exports = function (RED) {
  // Configuration node
  function EnOceanConfig(n) {
    RED.nodes.createNode(this, n);

    this.serialport = n.serialport;
    this.knownsensorarray = require(__dirname + "/knownSensors.json");
    this.enocean = {};

    this.enocean = require("node-enocean")({
      sensorFilePath: __dirname + "/knownSensors.json",
      configFilePath: __dirname + "/config.json",
      timeout: 30
    });



    var node = this;
    // this.enocean = enocean;

    try {
      node.enocean.listen(node.serialport);
    } catch (err) {
      console.log(err);
    }

    node.enocean.on("error", function (error) {
      //try to reconnect
      setTimeout(function () {
        node.enocean.listen(node.serialport);
      }, 5000);
    });

    node.enocean.on("disconnect", function () {
      // node.enocean.listen(node.serialport);
    });
  };

  RED.nodes.registerType("enocean-config-node", EnOceanConfig);

  function EnOceanListener(n) {
    RED.nodes.createNode(this, n);
    var jsonObject = require(__dirname + "/knownSensors.json");
    //map to Array:
    var knownsensorarray = Object.keys(jsonObject).map(function (key) { return jsonObject[key]; });

    RED.httpAdmin.get('/knownsensors', function(req, res) {
      res.json(knownsensorarray || []);
    });

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
      server.enocean.close();
    });

    node.on('input', function (msg) {
      // we can trigger a learning function
      server.enocean.startLearning();
      server.enocean.on("learned", function (data) {
        if (msg.payload) {
          data.title = msg.payload;
        }
        node.status({
          fill: 'green',
          shape: "ring",
          text: "Sensor teached in"
        });
        sendPayload(data);
      });
    });


    server.enocean.on("data", function (data) {
      // DATA ID means we have no teach in telegram
      if (!data.id) {
        node.status({
          fill: 'green',
          shape: "ring",
          text: "Data received"
        });
        //only react to incoming requests which are already learned in
        if (node.knownsensor) {
          //we can let all sensors through which are learned in or only selected
          if (node.devicefilter === "target") {
            if (node.devices.length > 0) {
              for (var i = 0; i < node.devices.length; i++) {
                if (data.senderId === node.devices[i]) {
                  sendPayload(data);
                }
              }
            }
            // else: all known Sensors are allowed to pass
          } else {
            for (var k = 0; k < knownsensorarray.length; k++) {
              if (data.senderId === knownsensorarray[k].id) {
                sendPayload(data);
              }
            }
          }
        } else {
          sendPayload(data);
        }
      }
    });

    function sendPayload(data) {
      var msg = {};
      msg.payload = {
        data
      };

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
