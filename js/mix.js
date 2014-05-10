$('document').ready(function() {

	$( "#slider" ).slider();

	$( '.slider' ).css('display', 'block');
	$( '.slider' ).css('width', '50%');
	$( '.slider' ).css('margin', '0px auto');
	$( '.slider' ).css('margin-top', '20px');

	var button_record;
	var blink;

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

});