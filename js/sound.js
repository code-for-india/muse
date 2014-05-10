	
var CrossfadeSample = {playing:false};

CrossfadeSample.play = function() {
  // Create two sources.
  //this.ctl1 = createSource(BUFFERS.drums);
  //this.ctl2 = createSource(BUFFERS.organ);
  this.ctl1 = createSource(BUFFERS.beat2);
  this.ctl2 = createSource(BUFFERS.hindustani1);
  
  // Mute the second source.
  this.ctl1.gainNode.gain.value = 0;
  // Start playback in a loop
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
  
  function createSourceFromUrl(url) {
	var context = new webkitAudioContext(),
	    audio = new Audio(),
	    source,
	    // `stream_url` you'd get from 
	    // requesting http://api.soundcloud.com/tracks/6981096.json
	    url = url;
	audio.src = url;
	source = context.createMediaElementSource(audio);
	source.connect(context.destination);
	//var source = context.createBufferSource();
	var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    //source.buffer = buffer;
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


CrossfadeSample.stop = function() {
  if (!this.ctl1.source.stop) {
    this.ctl1.source.noteOff(0);
    this.ctl2.source.noteOff(0);
  } else {
    this.ctl1.source.stop(0);
    this.ctl2.source.stop(0);
  }
};

// Fades between 0 (all source 1) and 1 (all source 2)
CrossfadeSample.crossfade = function(element) {
  var x = parseInt(element.value) / parseInt(element.max);
  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(x * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
  this.ctl1.gainNode.gain.value = gain1;
  this.ctl2.gainNode.gain.value = gain2;
};

CrossfadeSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
  var rec = new Recorder(this.source);
  rec.record();
  rec.stop();  
};
