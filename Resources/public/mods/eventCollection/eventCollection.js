var eventSlideCollection = {
	currentEvent : null,
	currentEventRef : 0,
	eventReferences : [],
	slide : null,

	identifySlide : function (slide) {
		var t = this;
		// Return true or false
		// will take control if true
		if (slide.hasClass('eventCollection')) {
			t.slide = slide;

			t.setupEventReferences();
			return true;
		}
	},

	cycle : function () {
		var t = this;
		// Will do a single element cycle, will return true or next callback
		//  time if there are more elements to go through, false otherwise.

		t.nextEvent();

		if (t.currentEventRef <= (t.eventReferences.length - 1)) {
			return true;
		} else {
			return false;
		}
	},

	unbind : function () {
		var t = this;

		t.currentEvent.article.removeAttr('aria-selected', true);
		t.currentEvent.ribbon.removeAttr('aria-selected', true);

		t.slide = null;
		t.currentEvent = null;
		t.currentEventRef = 0;
		t.eventReferences = [];
		
		console.log('module eventCollection unbound');
	},

	nextEvent : function () {
		// Will fade out previous event, fade in new event
		var t = this;

		var previousEvent = null;

		if (t.currentEvent != null) {
			previousEvent = t.currentEvent;
		}

		console.log('t.currentEventRef', t.currentEventRef, 't.eventReferences.length', t.eventReferences.length);

		t.currentEvent = t.eventReferences[t.currentEventRef];

		if (t.currentEventRef >= t.eventReferences.length) {
			// This will cause an eternal cycle, keep your tabs on
			// t.currentEventRef and t.eventReferences.length
			t.currentEventRef = 0;
		} else {
			t.currentEventRef++;
		}

		console.log(t.currentEvent);

		if (previousEvent == null) {
			console.log('no previous event');
			t.currentEvent.article.attr('aria-selected', true);
			t.currentEvent.ribbon.attr('aria-selected', true);
		} else {
			console.log('have previous event');
			previousEvent.article.removeAttr('aria-selected');
			previousEvent.ribbon.removeAttr('aria-selected');

			t.currentEvent.article.attr('aria-selected', true);
			t.currentEvent.ribbon.attr('aria-selected', true);
		}

		previousEvent = null;
	},

	setupEventReferences : function () {
		var t = this;
		t.eventReferences = [];

		var articleElements = t.slide.find('article');
		var ribbonElements = t.slide.find('li');

		console.log('will add ' + articleElements.length + ' objects to t.eventReferences');

		for (var i = 0; i < articleElements.length; i++) {
			t.eventReferences.push({
				ribbon : ribbonElements.eq(i),
				article : articleElements.eq(i)
			});
		}

		console.log('t.eventReferences now has ' + t.eventReferences.length + ' elements');

		t.currentEventRef = 0;

		articleElements = null;
		ribbonElements = null;
	}
};