# WORK IN PROGRESS: node-red-contrib-enocean

a node-enocean node-red node 

## To install: 

Install node-red.

Download this package as zip (it is not yet on NPM).
Extract to folder of your choice.

Create link between node-red and this module using these installation instructions:

To test a node module locally, the npm link command can be used. This allows you to develop the node in a local directory and have it linked into a local node-red install, as if it had been npm installed.

* in the directory containing the node’s package.json file, run: sudo npm link.
* in your node-red user directory, typically ~/.node-red run: npm link <name of node module>.

This creates the appropriate symbolic links between the two directories so Node-RED will discover the node when it starts. Any changes to the node’s file can be picked up by simply restarting Node-RED.


## Node-red Flows

Example flow to receive data (Change Serialport accordingly):

`[{"id":"b357a38.8e3a36","type":"enocean-listener","z":"83937f01.0e35c","serialport":"17708e1b.221092","name":"Listener","knownsensor":false,"devicefilter":"target","devices":[],"x":479.0625419616699,"y":222.44619941711426,"wires":[["980615d2.4362b8"]]},{"id":"980615d2.4362b8","type":"debug","z":"83937f01.0e35c","name":"","active":true,"console":"false","complete":"payload","x":659.0590476989746,"y":222.9670524597168,"wires":[]},{"id":"17708e1b.221092","type":"enocean-config-node","z":"","serialport":"COM3"}]`

Example flow to send data (Change Serialport accordingly) **untested**:

`[{"id":"751ee4d.fccfc1c","type":"inject","z":"83937f01.0e35c","name":"Switch ON","topic":"","payload":"1","payloadType":"num","repeat":"","crontab":"","once":false,"x":147.05902099609375,"y":372.53646087646484,"wires":[["3ac07c63.1e9f34"]]},{"id":"24231ae3.6d09d6","type":"inject","z":"83937f01.0e35c","name":"Switch OFF","topic":"","payload":"0","payloadType":"num","repeat":"","crontab":"","once":false,"x":154.0086669921875,"y":432.0017395019531,"wires":[["3ac07c63.1e9f34"]]},{"id":"3ac07c63.1e9f34","type":"enocean-switch","z":"83937f01.0e35c","serialport":"17708e1b.221092","name":"","baseidcount":0,"x":379.0642395019531,"y":387.78820037841797,"wires":[]},{"id":"17708e1b.221092","type":"enocean-config-node","z":"","serialport":"COM3"}]`
