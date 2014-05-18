
var Crossfade = {

	playing: false,

	index_classical: null,
	index_beat: null,

  	el_ClassicalName: $('#btnPickClassical').next(),
  	el_BeatName: $('#btnPickBeat').next(),

  	getSongTitle: function (fileName) {

    	var s = fileName.lastIndexOf('/')
	    var e = fileName.lastIndexOf('.wav');

    	return fileName.substring( s+1, e );
  	}
};

Crossfade.setClassical = function( i ) {

  this.index_classical = (i == -1)
    ? Math.floor(Math.random() * 9) + 1 : i;

	var name = CLASSICAL_BUFFERS_TO_LOAD[this.index_classical];

	$(this.el_ClassicalName).html( this.getSongTitle(name) );
}

Crossfade.setBeat = function( i ) {

	this.index_beat = (i == -1)
    ? Math.floor(Math.random() * 9) + 1 : i;

	var name = BEAT_BUFFERS_TO_LOAD[this.index_beat];

	$(this.el_BeatName).html( this.getSongTitle(name) );
}

Crossfade.play = function() {

	if (!this.index_classical) {

		Crossfade.setClassical(-1);
		Crossfade.setBeat(-1);
	}

	this.ctl1 = createSource(CLASSICAL_BUFFERS[this.index_classical]);
	this.ctl2 = createSource(BEAT_BUFFERS[this.index_beat]);

  // mute the beats for starters
  this.ctl2.gainNode.gain.value = 0;

  // playback in a loop
  if (!this.ctl1.source.start) {
  	this.ctl1.source.noteOn(0);
  	this.ctl2.source.noteOn(0);
  } else {
  	this.ctl1.source.start(0);
  	this.ctl2.source.start(0);
  }

  function createSource(buffer) {
  	var source = context.createBufferSource();
  	var gainNode = context.createGain ? context.createGain() : context.createGainNode();
  	source.buffer = buffer;
	// Turn on looping
	source.loop = true;
	// Connect source to gain.
	source.connect(gainNode);

	// Connect gain to destination.
	gainNode.connect(context.destination);

	return {
		source: source,
		gainNode: gainNode
	};
}
};


Crossfade.stop = function() {
	if (!this.ctl1.source.stop) {
		this.ctl1.source.noteOff(0);
		this.ctl2.source.noteOff(0);
	} else {
		this.ctl1.source.stop(0);
		this.ctl2.source.stop(0);
  }
};

function createDownloadLink() {
	RecorderGlobal && RecorderGlobal.exportWAV(function(blob) {
		var url = URL.createObjectURL(blob);
		var li = document.createElement('li');
		var au = document.createElement('audio');
		var hf = document.createElement('a');

		au.controls = true;
		au.src = url;
		hf.href = url;
		hf.download = new Date().toISOString() + '.wav';
		hf.innerHTML = hf.download;
		li.appendChild(au);
		li.appendChild(hf);
});
}

// Fades between 0 (all source 1) and 1 (all source 2)
Crossfade.crossfade = function(element) {

	var x = parseInt(element.value) / parseInt(element.max);
  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(x * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
  this.ctl1.gainNode.gain.value = gain1;
  this.ctl2.gainNode.gain.value = gain2;

};

// this is a hack. calling crossfade as required
Crossfade.hackingcrossfade = function(n) {

	var x = n / 100;
  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(x * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
  this.ctl1.gainNode.gain.value = gain1;
  this.ctl2.gainNode.gain.value = gain2;

};

Crossfade.toggle = function() {

	this.playing ? this.stop() : this.play();
	this.playing = !this.playing;
};