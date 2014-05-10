// Keep track of all loaded buffers.
var CLASSICAL_BUFFERS = [];
var BEAT_BUFFERS = [];
// Page-wide audio context.
var context = null;

// An object to track the buffers to load {name: path}
var CLASSICAL_BUFFERS_TO_LOAD = [
  'sounds/beat1.wav',
  'sounds/beat2.wav'
  //carnatic2: 'http://api.soundcloud.com/tracks/6981096/stream?client_id=90a62526f8faf6afefa28fcc99ec3b35'
  ];

var BEAT_BUFFERS_TO_LOAD = [
	'sounds/carnatic1.wav',
	'sounds/hindustani1.wav' 
];

// Loads all sound samples into the buffers object.
function loadBuffers() {
  // Array-ify
  var names = [];
  var paths = [];
  
  for (var i = 0; i < CLASSICAL_BUFFERS_TO_LOAD.length; i++) {
    var path = CLASSICAL_BUFFERS_TO_LOAD[i];
    names.push(i);
    paths.push(path);
  }
  
  bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      // var name = names[i];
      CLASSICAL_BUFFERS[i] = buffer;
    }
  });
  
  bufferLoader.load();
  
  var names = [];
  var paths = [];
  
  for (var i = 0; i < BEAT_BUFFERS_TO_LOAD.length; i++) {
    var path = BEAT_BUFFERS_TO_LOAD[i];
    names.push(i);
    paths.push(path);
  }
  
  bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      // var name = names[i];
      BEAT_BUFFERS[i] = buffer;
    }
  });
  
  bufferLoader.load();
  
  
}

document.addEventListener('DOMContentLoaded', function() {
  try {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert("Web Audio API is not supported in this browser");
  }
  loadBuffers();
});
