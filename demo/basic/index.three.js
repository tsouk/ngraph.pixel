
const graph = require('ngraph.graph')();
const recurseBF = require('../../lib/recurseBFngraph');
const threeGraphics = require('../../lib/threeGraphics');
const eventify = require('ngraph.events');
const nthree = require('ngraph.three');
const THREE = require('three');

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xdddddd );
scene.fog = new THREE.FogExp2( 0xdddddd, 0.002 );

var graphics = nthree(graph, {physicsSettings : {timeStep: 20}, scene: scene });
graphics.createNodeUI(threeGraphics.createNodeUI);
//graphics.scene.fog = new graphics.THREE.FogExp2( 0xcccccc, 0.2 );
//graphics.scene.background = new graphics.THREE.Color( 0xffffff );
graphics.run(); // begin animation loop
// layout.is3d(false); // Make non 3d, have to update the gui tho


/*
  * Breadth First
  */
function start3dgraph (data) {
  const colorPalette = '5555000000';
  recurseBF.recurseBF(graph, recurseBF.getHtmlNode(data));
  const regex = /^[a-z]*/;

  recurseBF.events.on('cleared', function() {
    console.log('Finished adding nodes, stable');
    graph.forEachNode(function(nodeUI){
      nodeUI.color = '0x' + recurseBF.intToRGB(recurseBF.hashCode(regex.exec(nodeUI.id)[0] + colorPalette));
      nodeUI.size = 50;
    })
    //renderer.stable(true);
  });

  recurseBF.events.on('added', function( parentNodeId, childNodeId ) {
    //renderer.graph().addLink(parentNodeId, childNodeId);
    graph.forEachNode(function(nodeUI){
      myArray = regex.exec(nodeUI.id);
      nodeUI.color = '0x' + recurseBF.intToRGB(recurseBF.hashCode(regex.exec(nodeUI.id)[0] + colorPalette));
      nodeUI.size = 50;
    })
    //renderer.getNode(childNodeId).size = 100; // this is reset when something is added to the graph
    //renderer.getNode(childNodeId).color = 0x000000; // this is reset when something is added to the graph
    graphics.resetStable();
  });
}

if (window) {
  window.start3dgraph = start3dgraph;
  window.scene = graphics.scene;
  window.THREE = THREE;
}