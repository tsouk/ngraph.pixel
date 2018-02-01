/**
 * This module provides default settings for three.js graphics. There are a lot
 * of possible configuration parameters, and this file provides reasonable defaults
 */
const THREE = require('three');

module.exports = function (graph, scene) {
  const NODE_SIZE = 5; // default size of a node square
  const HEIGHT_STEP = 60;
  let maxDepth = 0;

  //var nodeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 , specular: 0x111111});
  var nodeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
  //var nodeGeometry = new THREE.CylinderGeometry( 0, NODE_SIZE*3, NODE_SIZE*3, 3, 1 );
  var nodeGeometry = new THREE.BoxGeometry(NODE_SIZE, NODE_SIZE, NODE_SIZE);
  
  var threeGraphics = {
    /**
     * Default node UI creator. Renders a cube
     */
    createNodeUI: createNodeUI,

    /**
     * Default link UI creator. Renders a line
     **/
    createLinkUI: createLinkUI,

    /**
     * Updates cube position
     */
    nodeRenderer: nodeRenderer,

    /**
     * Updates line position
     */
    linkRenderer: linkRenderer,

    /**
     * Updates maxDepth value
     */
    setMaxDepth: setMaxDepth
  }
  return threeGraphics;

  //TODO: Create a point cloud, that updates every time the nodeRenderer is called.


  function createNodeUI(node) {
    //console.log('During AddLink');
    let depth = (node.links &&
      node.links.length > 0 &&
      node.links[0].data &&
      node.links[0].data.depthOfChild) ? node.links[0].data.depthOfChild : 0;
    //console.log(`Depth from link is: ${depth}`);

    var mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
    mesh.userData.depth = depth;
    mesh.userData.nodeID = node.id;
    mesh.userData.seaNodeMesh = null;
    //mesh.userData.seaNodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
    return mesh;
  }

  function createLinkUI(link) {
    var linkGeometry = new THREE.Geometry();
    // we don't care about position here. linkRenderer will update it
    linkGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    linkGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    //linkGeometry.vertices.push(new THREE.Vector3(0, 0, 0));

    var linkMaterial = new THREE.LineBasicMaterial({
      color: 0x0000FF
    });
    var line = new THREE.Line(linkGeometry, linkMaterial);
    line.userData.depthOfChild = link.data.depthOfChild;
    line.userData.lineToSea = false;
    return line;
  }

  // This function is called EVERY frame. Be nice.
  function nodeRenderer(node) {
    node.position.x = node.pos.x;
    node.position.y = node.pos.y;
    if (!node.heighIsset) { //update every frame, based on depth, no. of children, data
      node.position.z = getNodeHeight(node);
      node.heighIsset = true;
    }

    if ((graph.getNode(node.userData.nodeID).data.numberOfChildren === 0) && (node.userData.depth < maxDepth) && (node.userData.seaNodeMesh === null)) {
      node.userData.seaNodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      scene.add(node.userData.seaNodeMesh);
      //console.log(seaNode);
      seaNode = node.userData.seaNodeMesh;
      seaNode.position.x = node.pos.x;
      seaNode.position.y = node.pos.y;
      seaNode.position.z = -1 * maxDepth * HEIGHT_STEP;
    }
    else if ((graph.getNode(node.userData.nodeID).data.numberOfChildren === 0) && (node.userData.depth < maxDepth)){
      seaNode = node.userData.seaNodeMesh;
      seaNode.position.x = node.pos.x;
      seaNode.position.y = node.pos.y;
      seaNode.position.z = -1 * maxDepth * HEIGHT_STEP;
    }

    //console.log(`x: ${node.pos.x}, y: ${node.pos.y}, z: ${node.pos.z}`);
  }

  function linkRenderer(link) {
    var from = link.from;
    var to = link.to;
    link.geometry.vertices[0].set(from.x, from.y, -1 * (link.userData.depthOfChild - 1) * HEIGHT_STEP);
    link.geometry.vertices[1].set(to.x, to.y, -1 * (link.userData.depthOfChild) * HEIGHT_STEP);

    // if (link.userData.depthOfChild < maxDepth) {
    //   link.geometry.vertices[2].set(to.x, to.y, -1 * (maxDepth) * HEIGHT_STEP);
    // } else {
    //   link.geometry.vertices[2].set(to.x, to.y, -1 * (link.userData.depthOfChild) * HEIGHT_STEP);
    // }

    link.geometry.verticesNeedUpdate = true;
  }

  // tsouk from here onwards
  function getNodeHeight(node) {
    return (-1 * node.userData.depth * HEIGHT_STEP);
  }

  function setMaxDepth(depth) {
    maxDepth = depth;
  }


}