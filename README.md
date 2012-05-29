# AudioClip, a Javascript HTML5 Audio library

	var clip = AudioClip({
		'src' : './test',
		'formats' : ['mp3', 'ogg'],
	});

	clip.addListener('ended', function(){
		console.log(arguments);
	})

	setTimeout(function(){
		clip.play();
	}, 2000);

