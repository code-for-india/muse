$('document').ready(function() {

	// cache all required elements from DOM

	var $divMixer = $('.mix-guide');
  	var $divResult = $('.mix-result');

	var $inputClassical = $('#input-classical');
	var $inputBeat = $('#input-beat');

	var $btnLivePlay = $('.mix-record span');
	var $btnRePlay = $('.mix-button');
	var $btnPickClassical = $('#btnPickClassical');
	var $btnPickBeat = $('#btnPickBeat');

	var $nameClassical = $btnPickClassical.next();
  	var $nameBeat = $btnPickBeat.next();
  	var $nameResult = $("#resultInfo");

  	// playing and blinking setInterval variables

	var playing;
	var blinking;

	var LiveCrossfade = new Crossfade();
	var ReCrossfade = new Crossfade();

	// arrays to store elements for autocomplete

	var classical_autocomplete = [];
	var beat_autocomplete = [];

	// generating value and label objects for autocomplete
	// TODO: move this autocomplete info code online to the API

	for (var i = CLASSICAL_BUFFERS_TO_LOAD.length - 1; i >= 0; i--) {

		var v = CLASSICAL_BUFFERS_TO_LOAD[i]
		var l = v.substring( v.lastIndexOf('/')+1, v.lastIndexOf('.wav') );

		classical_autocomplete.push({
			value: v,
			label: l,
		});
	};

	for (var i = BEAT_BUFFERS_TO_LOAD.length - 1; i >= 0; i--) {

		var v = BEAT_BUFFERS_TO_LOAD[i]
		var l = v.substring( v.lastIndexOf('/')+1, v.lastIndexOf('.wav') );

		beat_autocomplete.push({
			value: v,
			label: l,
		});
	};

	// code to perform autocomplete on two inputs: classical, and beat

	$inputClassical.autocomplete({

		source: classical_autocomplete,
		select: function(e, ui) {
			var n = $.inArray(ui.item.value, CLASSICAL_BUFFERS_TO_LOAD);
			LiveCrossfade.setClassical(n);
		}
	});

	$inputBeat.autocomplete({

		source: beat_autocomplete,
		select: function(e, ui) {

			var n = $.inArray(ui.item.value, BEAT_BUFFERS_TO_LOAD);
			LiveCrossfade.setBeat( n );
		}
	});

	// ui event delegations to pick random classical and beat

	$btnPickClassical.on('click', '', function() {

		LiveCrossfade.setClassical(-1);
	});

	$btnPickBeat.on('click', '', function() {

		LiveCrossfade.setBeat(-1);
	});

	// ui event delegation to live play the mix

	$btnLivePlay.on("click", '', function() {

		// stop ReCrossfade if it was playing

		ReCrossfade.stop();

		// show and hide mix value

		$divMixer.find('input').val(0);
		$divMixer.toggle("fast");

		console.log(playing);

		if (LiveCrossfade.isPlaying()) {

			// stop the music

			LiveCrossfade.stop();

			// change the apperance of the button

			$btnLivePlay.css('color','#FFF');
			$btnLivePlay.css('font-size', '5em');

			// stop the blinking

			clearInterval(blinking);

			// show the result element

			$divResult.show();
			$divResult.css( "opacity", "1" );

		} else {

			// start the mix

			LiveCrossfade.play();

			// change the color of the button

			$btnLivePlay.css('font-size', '6em');

			// start the blinking

			blinking = setInterval( function() {

				$btnLivePlay.css("color", "#FFF");

				setTimeout( function (){
					$btnLivePlay.css("color", "#A00000");
				}, 100);

			}, 500);

			// hide the existing result element

			$divResult.hide();
			$divResult.css( "opacity", "0" );

			// build the result element

			ReCrossfade.setClassical(LiveCrossfade.getClassical());
			ReCrossfade.setBeat(LiveCrossfade.getBeat());

			var r1 = $nameClassical.text();
			var r2 = $nameBeat.text();

			$nameResult.text("Remix - " + r1 + " ft. " + r2);

		}
	});

	// ui event delegation to vary the mix

	$divMixer.find('input').on('change', '', function (e){

		LiveCrossfade.crossfade(e.target);
	});

	// ui event delegation to replay the mix

	$btnRePlay.on("click", '', function() {

		ReCrossfade.toggle();

		// TODO: match url to array from database and call crossfade accordingly

		setTimeout(function() {
				ReCrossfade.crossfade(50);
		}, 4000);
	});

});