var createSettingsView = require('config.pixel');
var query = require('query-string').parse(window.location.search.substring(1));
//var graph = getGraphFromQueryString(query);
var renderGraph = require('../../');
var addCurrentNodeSettings = require('./nodeSettings.js');

var graph = require('ngraph.graph')();
const recurseBF = require('./recurseBF');
const html2graphJSON = require('./localhost');
var data = JSON.stringify(html2graphJSON);
var eventify = require('ngraph.events');


// Pin the html node,root? 
// triangle per node? where is three.js?
// set color per node
// set size per node?

/*
  * Breadth First
  */
  var renderer = renderGraph(graph);
  
recurseBF.recurseBF(graph, recurseBF.getHtmlNode(html2graphJSON));
//var renderer = renderGraph(graph);
recurseBF.events.on('cleared', function() {
  console.log('Finished adding nodes, stable');
  renderer.stable(true);
});

var settingsView = createSettingsView(renderer);
var gui = settingsView.gui();

var nodeSettings = addCurrentNodeSettings(gui, renderer);

recurseBF.events.on('added', function( parentNodeId, childNodeId ) {
  renderer.graph().addLink(parentNodeId, childNodeId);
  console.log('Added Node');
  renderer.getNode(childNodeId).size = 100; // this is reset when something is added to the graph
  renderer.getNode(childNodeId).color = 0x000000; // this is reset when something is added to the graph
  renderer.focus(); // not sure what that does... 
  renderer.stable(false);
});

renderer.on('nodeclick', showNodeDetails);

// Make non 3d, and set timestep to 9, slowish
var layout = renderer.layout();
var simulator = layout.simulator;
simulator['timeStep'](9);
layout.is3d(false); //have to update the gui tho
renderer.focus();


function showNodeDetails(node) {
  var nodeUI = renderer.getNode(node.id);
  nodeSettings.setUI(nodeUI);
}

function getGraphFromQueryString(query) {
  var graphGenerators = require('ngraph.generators');
  var createGraph = graphGenerators[query.graph] || graphGenerators.grid;
  return createGraph(getNumber(query.n), getNumber(query.m), getNumber(query.k));
}

function getNumber(string, defaultValue) {
  var number = parseFloat(string);
  return (typeof number === 'number') && !isNaN(number) ? number : (defaultValue || 10);
}
