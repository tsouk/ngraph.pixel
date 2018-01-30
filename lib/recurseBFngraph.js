// ----------- Lib ---------------

var eventify = require('ngraph.events');

let events = {}
eventify(events);

const SEC = 1000;
const finaleEaseTime = 5 * SEC;
const stepTime = 0.2 * SEC; //this one can crash your shizzle
const nodeSize = 1000;
const nodeColor = '#' + (Math.floor(Math.random() * 16777215).toString(16) + '000000').substr(0, 6);

events.fire('foo');

function getHtmlNode(domObject) {
  var i = 0;
  var htmlNode = domObject;

  // Get the first node of type 1
  while (htmlNode.nodeType !== 1) {
    htmlNode = domObject.childNodes[++i];
  }

  return htmlNode;
}

function createRoot(graph, domNode) {
  // Sigma: graphInstance.graph.nodes()
  // ngrpah: graph.getNodesCount
  //
  // Sigma: graph.addNode
  // Ngraph: graph.addNode
  if (graph.getNodesCount() > 0) {
    console.log("Error creating root object");
    return;
  }

  rootId = (domNode.tagName || domNode.nodeName);

  graph.addNode(rootId, {
    depth: 0
  });

  graph.ilandom = {};
  graph.ilandom.maxDepth = 0;
  
  return rootId;
}

function recurseBF(graph, treeHeadNode) {
  rootId = createRoot(graph, treeHeadNode);
  events.fire('createRoot');

  var stack = [{
    depth: 0,
    nodeId: rootId,
    element: treeHeadNode
  }];
  var stackItem = 0; //could use that too
  var current;
  var parent;
  var children, i, len;
  var depth;
  var childNodeId;

  var nodeIntervalId = setInterval(function () {
    if (current = stack[stackItem++]) {
      // console.log('popped next child that is now a parent, from stack');

      depth = current.depth;
      if (depth > graph.ilandom.maxDepth) { graph.ilandom.maxDepth = depth; }
      parent = current.element;
      parentNodeId = current.nodeId;
      children = parent.childNodes;

      //I should probably check for ...
      if (children) {
        for (i = 0, len = children.length; i < len; i++) {
          if (children[i].nodeType === 1) {
            //console.log('adding child to stack');
            childNodeId = addNewChildNodeToParent(graph, parentNodeId, children[i], depth);
            stack.push({ //pass args via object or array
              element: children[i],
              nodeId: childNodeId,
              depth: depth + 1
            });
          }
        }
      }
    } else {
      clearInterval(nodeIntervalId);
      events.fire('cleared');
    }

  }, stepTime);

}

// Create a node, for every child, and create the edge between it and the parent
function addNewChildNodeToParent(graph, parentNodeId, child, depth) {
  nodeCount = graph.getNodesCount();
  nodeCount++;
  childNodeId = child.tagName + '-' + nodeCount;

  // console.group();
  // console.log('Before AddLink');
  graph.addLink(parentNodeId, childNodeId, {depthOfChild: depth + 1});
  // console.log('After AddLink');

  var justAddedNode = graph.getNode(childNodeId);
  if (justAddedNode.data) {
    justAddedNode.data.depth = depth + 1;
  }
  else {
    justAddedNode.data = {depth: depth + 1};
  }

  events.fire('added', parentNodeId, childNodeId);
  return childNodeId;
}

function hashCode(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

module.exports = {
  getHtmlNode,
  recurseBF,
  events,
  hashCode,
  intToRGB,
};