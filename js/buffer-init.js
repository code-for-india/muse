// sourced from : http://www.html5rocks.com/en/tutorials/webaudio/intro/

// create global buffer variables to store sounds

var context = null;

var CLASSICAL_BUFFERS = [];
var BEAT_BUFFERS = [];

// list of best to load

var BEAT_BUFFERS_TO_LOAD = [
  'sounds/90_dub_beat.wav',
  'sounds/95bpm_Loop01.wav',
  'sounds/130_02_4_A.wav',
  'sounds/Bebob_Beat.wav',
  'sounds/danceBeat.wav',
  'sounds/Eaxdub_1.wav',
  'sounds/Electroclash_021_115.wav',
  'sounds/Loop_85.wav',
  'sounds/multibeat2.wav',
  'sounds/Musical_beat.wav',
  'sounds/perforated_beat.wav'
  ];

// list of classicals to load

var CLASSICAL_BUFFERS_TO_LOAD = [
	'sounds/abdul reheman kachwala - sab ka ek hi palanhar.wav',
	'sounds/Ashwathamma of Bangalore - Dheena Ha Priya.wav',
	'sounds/Badi Moti Bai - Vasant Rutu Bahar.wav',
	'sounds/bai gangubai hangal- aye banta ban aaye - BHAIRAVI.wav',
	'sounds/bhimsen Joshi - batiya tora - SHUDH KALYAN.wav',
	'sounds/D K Pattammal - Dharanithanu.wav',
	'sounds/D K Pattammal - Valli kanavan (Kavadichindu) .wav',
	'sounds/M S Subbulakshmi - Yaro Ivar Yaro - Bhairavi.wav',
	'sounds/M. Ramachandra Rao of Bangalore - Carnatic.wav',
	'sounds/Moghubai Kurdikar.wav',
	'sounds/Sawai Gandharva - bin dekhe pade nahi chain.wav'
];

// loads all sound samples into the buffers object.
// TODO: needs to be done only when required.

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

    // console.log("Classical: Loading Complete");
    CLASSICAL_BUFFERS = bufferList;

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

    // console.log("Beats: Loading Complete");
    BEAT_BUFFERS = bufferList;

  });

  bufferLoader.load();

}

document.addEventListener('DOMContentLoaded', function() {

  // check if the browser supports Web Audio API

  try {

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

  }  catch(e) {

    alert("Web Audio API is not supported in this browser. Muse may not function.");
  }

  loadBuffers();

});