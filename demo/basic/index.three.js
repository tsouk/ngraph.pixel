const graph = require('ngraph.graph')();
const recurseBF = require('../../lib/recurseBFngraph');
const threeGraphics = require('../../lib/threeGraphics');
const eventify = require('ngraph.events');
const nthree = require('ngraph.three');
const THREE = require('three');

// Configure
var physicsSettings = {
  springLength: 30,
  springCoeff: 0.0008,
  gravity: -1.2,
  theta: 0.8,
  dragCoeff: 0.02,
  timeStep: 10
};

var layout3d = require('ngraph.forcelayout3d');
var layout2d = layout3d.get2dLayout; // this on it's own is not enough, you need to tell the rendering function to set the z=0
var graphics = nthree(graph, {physicsSettings : physicsSettings, layout: layout2d(graph, physicsSettings)});
graphics.createNodeUI(threeGraphics.createNodeUI);
graphics.createLinkUI(threeGraphics.createLinkUI);
graphics.renderNode(threeGraphics.nodeRenderer);
graphics.renderLink(threeGraphics.linkRenderer);

graphics.scene.fog = new graphics.THREE.FogExp2( 0xccccee, 0.001 );
graphics.scene.background = new graphics.THREE.Color( 0xeeeeee );
var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
graphics.scene.add( directionalLight );

graphics.run(); // begin animation loop

/*
  * Breadth First
  */
function start3dgraph (data) {
  recurseBF.recurseBF(graph, recurseBF.getHtmlNode(data));
  //const regex = /^[a-z]*/;

  recurseBF.events.on('cleared', function() {
    console.log(`Finished adding nodes, stable, maxDepth: ${graph.ilandom.maxDepth}`);
    // got to stop the fucking layout here, did that do it?
    // graphics.layout.dispose();
    // don't think so.


    // graph.forEachNode(function(nodeUI){
    //   nodeUI.color = '0x' + recurseBF.intToRGB(recurseBF.hashCode(regex.exec(nodeUI.id)[0] + colorPalette));
    //   nodeUI.size = 50;
    // })
    graphics.isStable();
  });

  recurseBF.events.on('added', function( parentNodeId, childNodeId ) {
    // console.log(`id: ${graph.getNode(childNodeId).id}, data: ${graph.getNode(childNodeId).data}`);
    // console.groupEnd();
    //renderer.graph().addLink(parentNodeId, childNodeId);
    // graph.forEachNode(function(nodeUI){
    //   myArray = regex.exec(nodeUI.id);
    //   nodeUI.color = '0x' + recurseBF.intToRGB(recurseBF.hashCode(regex.exec(nodeUI.id)[0] + colorPalette));
    //   nodeUI.size = 50;
    // })
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