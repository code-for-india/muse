$('document').ready(function() {

	var button_record;
	var blink;

	var classical_autocomplete = [];
	var beat_autocomplete = [];

	for (var i = CLASSICAL_BUFFERS_TO_LOAD.length - 1; i >= 0; i--) {

		var v = CLASSICAL_BUFFERS_TO_LOAD[i]
		var l = v.substring( v.lastIndexOf('/')+1, v.lastIndexOf('.wav') );

		classical_autocomplete.push({
			value: v,
			label: l,
		});
	};

	console.log(classical_autocomplete);

	for (var i = BEAT_BUFFERS_TO_LOAD.length - 1; i >= 0; i--) {

		var v = BEAT_BUFFERS_TO_LOAD[i]
		var l = v.substring( v.lastIndexOf('/')+1, v.lastIndexOf('.wav') );

		beat_autocomplete.push({
			value: v,
			label: l,
		});
	};

	console.log(beat_autocomplete);

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

	$( "#input-beat" ).autocomplete({
	      source: BEAT_BUFFERS_TO_LOAD
		});

	$( "#btnPickClassical" ).on("click", "", function() {

		Crossfade.setClassical( -1 );
	});

	$( "#btnPickBeat" ).on("click", "", function() {

		Crossfade.setBeat( -1 );
	});

	$(".mix-add").on("click", "span", function() {

		// if ($(this).parent().hasClass("disabled"))
		// 	return;

		var mix = document.createElement( "li" );
		$(mix).addClass("mix");

		var mix_source = document.createElement( "div" );
		$(mix_source).addClass("mix_source");

 		var mix_button = document.createElement( "div" );
 		$(mix_button).addClass("mix_button");
 		$(mix_button).html("<span class=\"glyphicon glyphicon-play\"></span>");

		var mix_info = document.createElement( "div" );
		$(mix_info).addClass("mix_info");
		$(mix_info).html("<p> Vande Mataram by A.R.Rahman </p>");

		$(mix).append(mix_source);
		$(mix).append(mix_button);
		$(mix).append(mix_info);

		$(".mixes").append('div').listview("refresh");
	});


	$(".mix-record").on("click", "span", function() {

		if ($(this).hasClass("recording")) {

			$(this).removeClass("recording");

			clearInterval(blink)

			$(button_record).css("color", "#000");

			button_record = "";

			$(".mix-result").toggle();
			$(".mix-result").css( "opacity", "1" );

			var r1 = $('#btnPickClassical').next().text();
			var r2 = $('#btnPickBeat').next().text();

			$("#resultInfo").text("Remix - " + r1 + " ft. " + r2);


		} else {

			$(this).addClass("recording");

			$( ".mix-result" ).css( "opacity", "0" );

			button_record = $(this);

			blink = setInterval( function() {

				$(button_record).css("color", "#FFF");

				setTimeout( function (){
					$(button_record).css("color", "#A00000");
				}, 100);

			}, 500);
		}

		Crossfade.toggle();
		$(".mix-guide").toggle("fast");

	});

	$('.mix-result').on("click", ".mix-button", function() {

		Crossfade.toggle();
		setTimeout(function() {
				Crossfade.hackingcrossfade(50);
		}, 4000);

	});

});