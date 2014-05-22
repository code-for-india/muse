$('document').ready(function() {

	var button_record = $(".mix-record"); // TODO: Find where this is used
	var blink;

	var classical_autocomplete = [];
	var beat_autocomplete = [];

	$mixResult = $('.mix-result');

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

	$("#input-classical").autocomplete({

		source: classical_autocomplete,
		select: function(e, ui) {
			var n = $.inArray(ui.item.value, CLASSICAL_BUFFERS_TO_LOAD);
			Crossfade.setClassical( n );
		}
	});

	$( "#input-beat" ).autocomplete({

		source: beat_autocomplete,
		select: function(e, ui) {

			var n = $.inArray(ui.item.value, BEAT_BUFFERS_TO_LOAD);
			Crossfade.setBeat( n );
		}
	});

	// ui event delegations to pick random classical and beat

	$( "#btnPickClassical" ).on("click", "", function() {

		Crossfade.setClassical(-1);
	});

	$( "#btnPickBeat" ).on("click", "", function() {

		Crossfade.setBeat(-1);
	});

	// ui event delegation to start and stop the  mix

	$(".mix-record").on("click", "span", function() {

		if ($(this).hasClass("recording")) {

			$(this).removeClass("recording");

			clearInterval(blink);
			$(button_record).css("color", "#FFF");

			var r1 = $('#btnPickClassical').next().text();
			var r2 = $('#btnPickBeat').next().text();

			$("#resultInfo").text("Remix - " + r1 + " ft. " + r2);

			$mixResult.show();
			$(".mix-result").css( "opacity", "1" );

		} else {

			$(this).addClass("recording");

			button_record = $(this);

			// start the blinking

			blink = setInterval( function() {

				$(button_record).css("color", "#FFF");

				setTimeout( function (){
					$(button_record).css("color", "#A00000");
				}, 100);

			}, 500);

			// hide the recorded element

			$mixResult.hide();
			$(".mix-result").css( "opacity", "0" );
		}

		Crossfade.toggle();

		// show and hide mix value

		$(".mix-guide input").val(0);
		$(".mix-guide").toggle("fast");
	});

	// ui event delegation to play the saved mix

	$('.mix-result').on("click", ".mix-button", function() {

		Crossfade.toggle();
		setTimeout(function() {
				Crossfade.crossfade(50);
		}, 4000);
	});

});