/**
 * A slide module should be an object (not necessarily a global object)
 * with four required methods: getName, identifySlide, cycle and unbind.
 *
 * If you require to eg. fetch some data before the slideshow starts,
 * you should provide a method called initialize.
 */
var dummy = {
	slide : null,
	intialized : false,

	/**
	 * Returns the name of this module. Required.
	 * Mostly used in debugging.
	 * 
	 * @return string
	 */
	getName : function () {
		return "dummy";
	},

	/**
	 * This method will be called at the start of a slideshow. Ie. right
	 * before it starts a new cycle.
	 */
	initialize : function () {
		var t = this;

		if ( ! t.initialized ) {
			// Do something if this is the first time the module initializer
			// has been called or it's time change some of the content in the
			// slides, eg. tweets, events, pictures, latest news...
			
			t.initialized = true;
		}
	},

	/**
	 * This method is called every time the slide controller changes to a new slide.
	 * The slide controller goes through the list of registered modules and
	 * will pick the first module that returns true from the identofySlide method.
	 * If you return true, you will have "complete" control of the slide.
	 *
	 * @param object slide
	 * @return bool
	 */
	identifySlide : function (slide) {
		var t = this;
		// Return true or false
		// will take control if true
		if (slide.hasClass('dummy')) {
			t.slide = slide;

			return true;
		} else {
			return false;
		}
	},

	/**
	 * Will do a single element cycle, will return true or next callback
	 * time if there are more elements to go through, false otherwise.
	 */
	cycle : function () {
		var t = this;

		return false;
	},

	/**
	 * Remove your connection to the current slide
	 */
	unbind : function () {
		var t = this;
		
		t.slide = null;
	}
};
