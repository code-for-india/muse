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

  	// blinking setInterval variable

	var blink;

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
			Crossfade.setClassical( n );
		}
	});

	$inputBeat.autocomplete({

		source: beat_autocomplete,
		select: function(e, ui) {

			var n = $.inArray(ui.item.value, BEAT_BUFFERS_TO_LOAD);
			Crossfade.setBeat( n );
		}
	});

	// ui event delegations to pick random classical and beat

	$btnPickClassical.on('click', '', function() {

		Crossfade.setClassical(-1);
	});

	$btnPickBeat.on('click', '', function() {

		Crossfade.setBeat(-1);
	});

	// ui event delegation to live play the mix

	$btnLivePlay.on("click", '', function() {

		if ($(this).hasClass("recording")) {

			$(this).removeClass("recording");

			clearInterval(blink);
			$btnLivePlay.css("color", "#FFF");

			// TODO: get this from Crossfade and not from display

			var r1 = $nameClassical.text();
			var r2 = $nameBeat.text();

			$nameResult.text("Remix - " + r1 + " ft. " + r2);

			$divResult.show();
			$divResult.css( "opacity", "1" );

		} else {

			$(this).addClass("recording");

			// start the blinking

			blink = setInterval( function() {

				$btnLivePlay.css("color", "#FFF");

				setTimeout( function (){
					$btnLivePlay.css("color", "#A00000");
				}, 100);

			}, 500);

			// hide the recorded element

			$divResult.hide();
			$divResult.css( "opacity", "0" );
		}

		Crossfade.toggle();

		// show and hide mix value

		$divMixer.find('input').val(0);
		$divMixer.toggle("fast");
	});

	// ui event delegation to replay the mix

	$btnRePlay.on("click", '', function() {

		Crossfade.toggle();
		setTimeout(function() {
				Crossfade.crossfade(50);
		}, 4000);
	});

});