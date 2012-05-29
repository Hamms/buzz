var AudioClip = function(options){
	var defaults = {
		autoLoad : true,
		autoPlay : true,
	}

	var clip = {};

	//
	// Init
	//
	clip.audio = document.createElement('audio');

	if (typeof options == 'string'){
		// optionally accept just source string
		// which should specify format
		clip.audio.src = options;
		options = {};
	} else {
		if (!(options.formats && options.formats.length)){
			clip.audio.src = options.src;
		} else {
			// I'm not sure if I should do support checking, or if html
			// wants to handle that itself.
			for (var i in options.formats) {
				var source = document.createElement('source');
				source.src = options.src + '.' + options.formats[i];
				clip.audio.appendChild(source);
			}
		}
	}
	for (var i in defaults) {
		if (defaults.hasOwnProperty(i)) {
			options[i] = options[i] || defaults[i];
		}
	}

	if (options.autoplay) {
		clip.audio.autoplay = 'autoplay';
	}
	clip.audio.preload = 'auto';

	// bind events
	var audioEvents = {
		'playing' : 'play',
		'pause' : 'pause',
		'ended' : 'complete',
	};
	for (var e in audioEvents) {
		clip.audio.addEventListener(e, function(){
			clip.dispatchEvent(audioEvents[e], arguments);
		})
	}

	// set up clip event handlers
	clip.events = {};

	clip.addListener = function(event, cb){
		if (clip.events[event] && clip.events[event].length) {
			clip.events[event].push(cb);
		} else {
			clip.events[event] = [cb];
		}
	}

	clip.dispatchEvent = function(event, args){
		var listeners = clip.events[event];
		if (listeners && listeners.length) {
			for (var i in listeners) {
				listeners[i].apply(this, args);
			}
		}
	}

	clip.play = function(){
		clip.audio.play();
	}
	clip.pause = function(){
		clip.audio.pause();
	}
	clip.stop = function(clean){}
	clip.unload = function(){}

	// various support functions ... I don't know how many of these are
	// actually necessary
	clip.isHtml5Supported = function() {
		return !!clip.audio.canPlayType;
	}

	clip.isOGGSupported = function() {
		return !!clip.audio.canPlayType && clip.audio.canPlayType( 'audio/ogg; codecs="vorbis"' );
	}

	clip.isWAVSupported = function() {
		return !!clip.audio.canPlayType && clip.audio.canPlayType( 'audio/wav; codecs="1"' );
	}

	clip.isMP3Supported = function() {
		return !!clip.audio.canPlayType && clip.audio.canPlayType( 'audio/mpeg;' );
	}

	clip.isAACSupported = function() {
		return !!clip.audio.canPlayType && ( clip.audio.canPlayType( 'audio/x-m4a;' ) || clip.audio.canPlayType( 'audio/aac;' ) );
	}

	return clip;
};
