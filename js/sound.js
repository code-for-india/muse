	
var CrossfadeSample = {playing:false};
var RecorderGlobal;

var index_classical = 0; 
var index_beat = 0; 

CrossfadeSample.setClassical = function() {
	
	index_classical = Math.floor(Math.random() * 9) + 1;
	// index_classical = 1;
}

CrossfadeSample.setBeat = function() {
	
	index_beat = index_classical;
}


CrossfadeSample.play = function() {
  // Create two sources.
  //this.ctl1 = createSource(BUFFERS.drums);
  //this.ctl2 = createSource(BUFFERS.organ);
  
  
  
  this.ctl1 = createSource(CLASSICAL_BUFFERS[index_classical]);
  this.ctl2 = createSource(BEAT_BUFFERS[index_beat]);
  
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
  
  RecorderGlobal = new Recorder(this.ctl2.source);
  RecorderGlobal.record();
  
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


CrossfadeSample.stop = function() {
  if (!this.ctl1.source.stop) {
    this.ctl1.source.noteOff(0);
    this.ctl2.source.noteOff(0);
  } else {
    this.ctl1.source.stop(0);
    this.ctl2.source.stop(0);
	//RecorderGlobal.clear();
	RecorderGlobal.stop();
	createDownloadLink();
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
	  // $('.stage').append(li);
      //recordingslist.appendChild(li);
    });
  }

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
};
