var query = require('query-string').parse(window.location.search.substring(1));
// var graph = getGraphFromQueryString(query);
var renderGraph = require('../../');

var graph = require('ngraph.graph')();
const recurseBF = require('./recurseBF');
const html2graphJSON = require('./www.bbc.co.uk-gel');
var data = JSON.stringify(html2graphJSON);
var eventify = require('ngraph.events');


// Pin the html node,root? 
// triangle per node? where is three.js?
// set color per node
// set size per node?

/*
  * Breadth First
  */
  
recurseBF.recurseBF(graph, recurseBF.getHtmlNode(html2graphJSON));
var renderer = renderGraph(graph);

recurseBF.events.on('cleared', function() {
  console.log('Finished adding nodes, stable');
  renderer.stable(true);
});

recurseBF.events.on('added', function( parentNodeId, childNodeId ) {
  //renderer.graph().addLink(parentNodeId, childNodeId);
  console.log('Added Node');
  console.log('0x' + recurseBF.intToRGB(recurseBF.hashCode(childNodeId)));
  renderer.forEachNode(function(nodeUI){
    nodeUI.color = '0x' + recurseBF.intToRGB(recurseBF.hashCode(nodeUI.id));
  })
  //renderer.getNode(childNodeId).size = 100; // this is reset when something is added to the graph
  //renderer.getNode(childNodeId).color = 0x000000; // this is reset when something is added to the graph
  renderer.focus(); // not sure what that does... 
  renderer.stable(false);
});



// Make non 3d, and set timestep to 9, slowish
var layout = renderer.layout();
var simulator = layout.simulator;
simulator['timeStep'](9);
//layout.is3d(false); //have to update the gui tho
renderer.focus();

function getGraphFromQueryString(query) {
  var graphGenerators = require('ngraph.generators');
  var createGraph = graphGenerators[query.graph] || graphGenerators.grid;
  return createGraph(getNumber(query.n), getNumber(query.m), getNumber(query.k));
}

function getNumber(string, defaultValue) {
  var number = parseFloat(string);
  return (typeof number === 'number') && !isNaN(number) ? number : (defaultValue || 10);
}
