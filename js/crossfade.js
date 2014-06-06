/*
* Crossfade Factory Function
*
* @return: a Crossfade Object
*
*/
var Crossfade = function () {

  // private variables

  var playing = false;

  var index_classical = null;
  var index_beat = null;

  var $nameClassical = $('#btnPickClassical').next();
  var $nameBeat = $('#btnPickBeat').next();

  // private helper function to strip file to get song title

  function getSongTitle(fileName) {

    var s = fileName.lastIndexOf('/')
    var e = fileName.lastIndexOf('.wav');

    return fileName.substring( s+1, e );
  }

  // private factory function to create source

  function createSource(buffer) {

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

  return {

    isPlaying : function (){

      return playing;
    },

    // getter and setter for classical index

    getClassical: function() {

      return index_classical;
    },

    setClassical : function(i) {
        
      // if i equals -1, use a random number

      index_classical = (i == -1)
        ? Math.floor(Math.random() * 9) + 1 : i;

      var name = CLASSICAL_BUFFERS_TO_LOAD[index_classical];

      $nameClassical.html( getSongTitle(name) );

      // TODO: Load the buffer here, expect a delay
    },

    // getter and setter for beat index

    getBeat: function() {

      return index_beat;
    },

    setBeat : function(i) {
        
      // if i equals -1, use a random number  

      index_beat = (i == -1)
        ? Math.floor(Math.random() * 9) + 1 : i;

      var name = BEAT_BUFFERS_TO_LOAD[index_beat];

      $nameBeat.html( getSongTitle(name) );

      // TODO: Load the buffer here, expect a delay
    },

    // play and stop functions

    play : function() {

      if (playing)
        return;

      playing = true;

      // try index_classical || Crossfade.setClassical(-1)

      if (!index_classical) {

        this.setClassical(-1);
        this.setBeat(-1);
      }

      ctl1 = createSource(CLASSICAL_BUFFERS[index_classical]);
      ctl2 = createSource(BEAT_BUFFERS[index_beat]);

      // mute the beats for starters
      ctl2.gainNode.gain.value = 0;

      // playback in a loop
      if (!ctl1.source.start) {
        ctl1.source.noteOn(0);
        ctl2.source.noteOn(0);
      } else {
        ctl1.source.start(0);
        ctl2.source.start(0);
      }
    },

    stop : function() {

      if (!playing)
        return;

      playing = false;

      if (!ctl1.source.stop) {
        ctl1.source.noteOff(0);
        ctl2.source.noteOff(0);
      } else {
        ctl1.source.stop(0);
        ctl2.source.stop(0);
        }
    },

    // toggle function : use when the same button is used for play and stop

    toggle : function() {

      playing ? this.stop() : this.play();
    },

    // crossfade function: fades the play between 0 (all source 1) and 1 (all source 2),
    // @param element: takes a range input element or a value;

    crossfade : function(element) {

      if (!playing)
        return;

      // element could be the scroll or a hack value

      var value = parseInt(element.value) || element;
      var max = parseInt(element.max) || 100;

      var mix = value / max;

        // using an equal-power crossfading curve:

      var gain1 = Math.cos( mix * 0.5 * Math.PI );
      var gain2 = Math.cos( (1.0 - mix) * 0.5 * Math.PI );

      ctl1.gainNode.gain.value = gain1;
      ctl2.gainNode.gain.value = gain2;
    }
  };
}