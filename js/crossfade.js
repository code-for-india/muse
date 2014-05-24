var Crossfade = {

	playing: false,

	index_classical: null,
	index_beat: null,

  	$nameClassical: $('#btnPickClassical').next(),
  	$nameBeat: $('#btnPickBeat').next(),

  	// helper function to strip song title from the filename

  	getSongTitle: function (fileName) {

    	var s = fileName.lastIndexOf('/')
	    var e = fileName.lastIndexOf('.wav');

    	return fileName.substring( s+1, e );
  	},

  	// helper function to create

  	createSource: function (buffer) {

  		// TODO: context is global and runs the risk of being overwritten

  		// closure to create source and gainNode

	  	var source = context.createBufferSource();
	  	source.buffer = buffer;
		source.loop = true;

	  	var gainNode = context.createGain ? context.createGain() : context.createGainNode();
		gainNode.connect(context.destination);

		source.connect(gainNode);

		return {
			source: source,
			gainNode: gainNode
		};
	}
};

Crossfade.setClassical = function( i ) {

  this.index_classical = (i == -1)
    ? Math.floor(Math.random() * 9) + 1 : i;

	var name = CLASSICAL_BUFFERS_TO_LOAD[this.index_classical];

	this.$nameClassical.html( this.getSongTitle(name) );
}

Crossfade.setBeat = function( i ) {

	this.index_beat = (i == -1)
    ? Math.floor(Math.random() * 9) + 1 : i;

	var name = BEAT_BUFFERS_TO_LOAD[this.index_beat];

	this.$nameBeat.html( this.getSongTitle(name) );
}

Crossfade.play = function() {

	// try this.index_classical || Crossfade.setClassical(-1)

	if (!this.index_classical) {

		Crossfade.setClassical(-1);
		Crossfade.setBeat(-1);
	}

	this.ctl1 = this.createSource(CLASSICAL_BUFFERS[this.index_classical]);
	this.ctl2 = this.createSource(BEAT_BUFFERS[this.index_beat]);

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

// fades between 0 (all source 1) and 1 (all source 2), takes a scrollbar element or a value;

Crossfade.crossfade = function(element) {

	// element could be the scroll or a hack value

	var value = parseInt(element.value) || element;
	var max = parseInt(element.max) || 100;

	var mix = value / max;

  	// using an equal-power crossfading curve:

  	var gain1 = Math.cos( mix * 0.5 * Math.PI );
	var gain2 = Math.cos( (1.0 - mix) * 0.5 * Math.PI );

	this.ctl1.gainNode.gain.value = gain1;
	this.ctl2.gainNode.gain.value = gain2;

};

Crossfade.toggle = function() {

	this.playing ? this.stop() : this.play();
	this.playing = !this.playing;
};