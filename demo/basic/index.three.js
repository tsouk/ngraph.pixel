const graph = require('ngraph.graph')();
const recurseBF = require('../../lib/recurseBFngraph-three');
const eventify = require('ngraph.events');
const nthree = require('ngraph.three');
const THREE = require('three');

const MAX_CHILDREN_PER_NODE = 12;

// Configure
var physicsSettings = {
  springLength: 30,
  springCoeff: 0.0008,
  gravity: -1.2,
  theta: 0.8,
  dragCoeff: 0.02,
  timeStep: 10
};


function start3dgraph (data) {
  // What is the max number of nodes?
  let maxDepth = recurseBF.findMaxDepth(recurseBF.getHtmlNode(data), MAX_CHILDREN_PER_NODE);
  let maxParticleCount = recurseBF.getChildrenCount();

  var layout3d = require('ngraph.forcelayout3d');
  var layout2d = layout3d.get2dLayout; // this on it's own is not enough, you need to tell the rendering function to set the z=0
  var graphics = nthree(graph, {physicsSettings : physicsSettings, layout: layout2d(graph, physicsSettings)}, maxParticleCount, maxDepth);
  const threeGraphics = require('../../lib/threeGraphics')(graph, graphics.scene);
  graphics.createNodeUI(threeGraphics.createNodeUI);
  graphics.createLinkUI(threeGraphics.createLinkUI);
  graphics.renderNode(threeGraphics.nodeRenderer);
  graphics.renderLink(threeGraphics.linkRenderer);

  // graphics.scene.fog = new graphics.THREE.FogExp2( 0xccccee, 0.001 );
  graphics.scene.background = new graphics.THREE.Color( 0xeeeeee );
  graphics.run(); // begin animation loop
  //graphics.setMaxDepth(maxDepth);
  //graphics.setMaxParticleCount(recurseBF.getChildrenCount());
  recurseBF.recurseBF(graph, recurseBF.getHtmlNode(data), MAX_CHILDREN_PER_NODE);
  
  recurseBF.events.on('added', function( parentNodeId, childNodeId ) {
    graphics.resetStable();
  });

  recurseBF.events.on('cleared', function() {
    console.log(`Finished adding nodes, stable, maxDepth: ${maxDepth}`);
    graphics.isStable();
  });
}

if (window) {
  window.start3dgraph = start3dgraph;
  //window.scene = graphics.scene;
  window.THREE = THREE;
}