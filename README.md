# WORK IN PROGRESS: node-red-contrib-enocean
a node-enocean node-red node 

To install: 

Install node-red.

Download this package as zip (it is not yet on NPM).
Extract to folder of your choice.

Create link between node-red and this module using these installation instructions:

To test a node module locally, the npm link command can be used. This allows you to develop the node in a local directory and have it linked into a local node-red install, as if it had been npm installed.

* in the directory containing the node’s package.json file, run: sudo npm link.
* in your node-red user directory, typically ~/.node-red run: npm link <name of node module>.

This creates the appropriate symbolic links between the two directories so Node-RED will discover the node when it starts. Any changes to the node’s file can be picked up by simply restarting Node-RED.
