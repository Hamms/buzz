var AudioClip = function(options){
  var defaults = {
    autoLoad : true,
    autoPlay : true,
  }

  var that = {};
  var self = this;

  if (typeof options == 'string'){
    // optionally accept just source string
    options = {src : options};
  } else {
    // assume options is an object with the appropriate settings
  }
  for(var i in defaults ) {
    if(buzz.defaults.hasOwnProperty(i)) {
      options[ i ] = options[ i ] || buzz.defaults[ i ];
    }
  }

  that.addListener = function(){}

  that.play = function(){}
  that.pause = function(){}
  that.stop = function(clean){}
  that.unload = function(){}

  /* private functions */
  self.isSupported = function() {
      return !!self.audio.canPlayType;
  }

  self.isOGGSupported = function() {
      return !!self.audio.canPlayType && self.audio.canPlayType( 'audio/ogg; codecs="vorbis"' );
  }

  self.isWAVSupported = function() {
      return !!self.audio.canPlayType && self.audio.canPlayType( 'audio/wav; codecs="1"' );
  }

  self.isMP3Supported = function() {
      return !!self.audio.canPlayType && self.audio.canPlayType( 'audio/mpeg;' );
  }

  self.isAACSupported = function() {
      return !!self.audio.canPlayType && ( self.audio.canPlayType( 'audio/x-m4a;' ) || self.audio.canPlayType( 'audio/aac;' ) );
  }

  return that;
};
