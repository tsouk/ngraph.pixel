const graph = require('ngraph.graph')();
const recurseBF = require('../../lib/recurseBFngraph-three');
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

// What is the max number of nodes?

var layout3d = require('ngraph.forcelayout3d');
var layout2d = layout3d.get2dLayout; // this on it's own is not enough, you need to tell the rendering function to set the z=0
var graphics = nthree(graph, {physicsSettings : physicsSettings, layout: layout2d(graph, physicsSettings)});
const threeGraphics = require('../../lib/threeGraphics')(graph, graphics.scene);
graphics.createNodeUI(threeGraphics.createNodeUI);
graphics.createLinkUI(threeGraphics.createLinkUI);
graphics.renderNode(threeGraphics.nodeRenderer);
graphics.renderLink(threeGraphics.linkRenderer);

// graphics.scene.fog = new graphics.THREE.FogExp2( 0xccccee, 0.001 );
graphics.scene.background = new graphics.THREE.Color( 0xeeeeee );
graphics.run(); // begin animation loop

function start3dgraph (data) {
  recurseBF.recurseBF(graph, recurseBF.getHtmlNode(data));
  recurseBF.events.on('cleared', function() {
    console.log(`Finished adding nodes, stable, maxDepth: ${graph.ilandom.maxDepth}`);
    threeGraphics.setMaxDepth(graph.ilandom.maxDepth);
    graphics.isStable();
  });

  recurseBF.events.on('added', function( parentNodeId, childNodeId ) {
    // console.log(`id: ${graph.getNode(childNodeId).id}, data: ${graph.getNode(childNodeId).data}`);
    threeGraphics.setMaxDepth(graph.ilandom.maxDepth);
    //console.groupEnd();
    graphics.resetStable();
  });
}

if (window) {
  window.start3dgraph = start3dgraph;
  window.scene = graphics.scene;
  window.THREE = THREE;
}