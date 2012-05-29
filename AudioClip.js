var AudioClip = function(options){
	var defaults = {
		autoLoad : true,
		autoPlay : true,
	}

	var clip = {};

	// event handlers
	clip.addListener = function(event, cb){
		if (options.events[event] && options.events[event] instanceof Array) {
			options.events[event].push(cb);
		} else {
			options.events[event] = [cb];
		}
		return clip;
	}

	clip.dispatchEvent = function(event, args){
		var listeners = options.events[event];
		if (listeners && listeners instanceof Array) {
			for (var i in listeners) {
				listeners[i].apply(this, args);
			}
		}
		return clip;
	}

	// support detection
	clip.isHtml5Supported = function() {
		return !!clip.audio.canPlayType;
	}

	clip.isFormatSupported = function(format){
		if (!clip.isHtml5Supported()){
			return false;
		} else if (format == 'ogg') {
			return !!clip.audio.canPlayType('audio/ogg; codecs="vorbis"');
		} else if (format == 'wav') {
			return !!clip.audio.canPlayType('audio/wav; codecs="1"');
		} else if (format == 'mp3') {
			return !!clip.audio.canPlayType('audio/mpeg;');
		} else if (format == 'aac') {
			return !!(clip.audio.canPlayType('audio/x-m4a;') || clip.audio.canPlayType('audio/aac;'));
		} else {
			return false;
		}
	}

	// API
	clip.play = function(){
		clip.audio.play();
		return clip;
	}
	clip.pause = function(){
		clip.audio.pause();
		return clip;
	}
	clip.stop = function(clean){
		clip.audio.pause();
		if (clean) {
			clip.unload();
		} else {
			clip.audio.currentTime = 0.0;
		}
		return clip;
	}
	clip.unload = function(){
		throw new Error('unimplemented');
		return clip;
	}

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
				if (clip.isFormatSupported(options.formats[i])) {
					var source = document.createElement('source');
					source.src = options.src + '.' + options.formats[i];
					clip.audio.appendChild(source);
				}
			}
		}
	}
	for (var i in defaults) {
		if (defaults.hasOwnProperty(i) && !options.hasOwnProperty(i)) {
			options[i] = defaults[i];
		}
	}

	// option handling
	if (options.autoPlay) {
		clip.audio.autoplay = 'autoplay';
	}
	if (options.autoLoad === true) {
		clip.audio.preload = 'auto';
	} else if (options.autoLoad === false) {
		clip.audio.preload = 'none';
	} else {
		clip.audio.preload = options.preload;
	}

	// bind events
	clip.audio.addEventListener('playing', function(){ clip.dispatchEvent('play', arguments); })
	clip.audio.addEventListener('pause', function(){ clip.dispatchEvent('pause', arguments); })
	clip.audio.addEventListener('ended', function(){ clip.dispatchEvent('complete', arguments); })

	// set up clip event handlers
	options.events = options.events || {};
	for (var event in options.events) {
		if (!(options.events[event] instanceof Array)) {
			options.events[event] = [options.events[event]];
		}
	}

	return clip;
};
