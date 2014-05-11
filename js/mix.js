$('document').ready(function() {

	$( "#slider" ).slider();

	$( '.slider' ).css('display', 'block');
	$( '.slider' ).css('width', '50%');
	$( '.slider' ).css('margin', '0px auto');
	$( '.slider' ).css('margin-top', '20px');

	var button_record;
	var blink;

	$( "#input-classical" ).autocomplete({
	      source: CLASSICAL_BUFFERS_TO_LOAD,
		select: function(e, ui) {

			var n = $.inArray(ui.item.value, CLASSICAL_BUFFERS_TO_LOAD);
			console.log(n);

			CrossfadeSample.setStrictClassical(document.getElementById('btnPickClassical'), n);
		}
	});

	$( "#input-beat" ).autocomplete({
	      source: BEAT_BUFFERS_TO_LOAD,
		select: function(e, ui) {

			var n = $.inArray(ui.item.value, BEAT_BUFFERS_TO_LOAD);
			console.log(n);

			CrossfadeSample.setStrictBeat(document.getElementById('btnPickBeat'), n);
		}
	});

	$( "#input-beat" ).autocomplete({
	      source: BEAT_BUFFERS_TO_LOAD
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

			// upload result to soundcloud

			$( ".mix-result" ).css( "opacity", "1" );

			var r1 = $('#btnPickClassical').next().text();
			var r2 = $('#btnPickBeat').next().text();

			console.log(r1);
			console.log(r2);

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

		CrossfadeSample.toggle();
	});

	$('.mix-result').on("click", ".mix-button", function() {

		CrossfadeSample.toggle();
		setTimeout(function() {
				CrossfadeSample.hackingcrossfade(50);
		}, 4000);

	});

});