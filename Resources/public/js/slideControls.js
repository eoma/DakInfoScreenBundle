"use strict";

var slideControl = {
	currentSlide : null,
	defaultSlideDuration : 5000,

	modules : [],
	activeModule : null,

	init : function () {
		var t = this;
		t.currentSlide = jQuery('#slides > section:nth-of-type(' + idx + ')');
		
		var slideMaster = jQuery('#slides');
		var possibleDefaultSlideDuration = slideMaster.data('defaultSlideDuration');

		console.log('possibleDefaultSlideDuration', typeof possibleDefaultSlideDuration, possibleDefaultSlideDuration);

		if ((typeof possibleDefaultSlideDuration == 'number') &&
		    (possibleDefaultSlideDuration >= 100)) {
			t.defaultSlideDuration = possibleDefaultSlideDuration;
		}
		slideMaster = null;

		t.identifySlide();
	},

	registerModule : function (moduleInstance) {
		var t = this;

		if (jQuery.isFunction(moduleInstance.getName) &&
		    jQuery.isFunction(moduleInstance.identifySlide) &&
			jQuery.isFunction(moduleInstance.unbind) && 
		    jQuery.isFunction(moduleInstance.cycle)) {
			console.log('registered module', moduleInstance.getName());

			t.modules.push(moduleInstance);
		}
	},

	initializeModules : function (callbackWhenFinished) {
		var t = this;

		var i = 0;
		var len = t.modules.length;

		function iterateAndInitializeModules () {
			if (i < len) {
				var mod = t.modules[i];
				i++;

				console.log("Initializes module " + mod.getName());
				if (jQuery.isFunction(mod.initialize)) {
					mod.initialize(iterateAndInitializeModules);
				} else {
					iterateAndInitializeModules();
				}
			} else {
				callbackWhenFinished();
			}
		}

		iterateAndInitializeModules();
	},

	identifySlide : function () {
		var t = this;

		//console.log(t.modules.length);

		for (var i in t.modules) {
			if (t.modules[i].identifySlide(t.currentSlide)) {
				t.activeModule = i;
				break;
			}
		}
	},

	nextSlide : function () {
		var t = this;

		if (t.activeModule != null) {
			t.modules[t.activeModule].unbind();
		}
		
		t.activeModule = null;
		
		if (idx >= slides.length) {
			idx = 0;
		}
		forward();

		t.currentSlide = jQuery('#slides > section:nth-of-type(' + idx + ')');
		
		t.identifySlide();
	},

	completeCycle : function (callbackWhenFinished) {
		var t = this;

		var timeout;
		var goToNextSlide = false;

		if (idx >= slides.length) {
			// This will restart the slide cycle
			t.nextSlide();
		}

		function unbindThenCallback () {
			if (t.activeModule != null) {
				t.modules[t.activeModule].unbind();
			}
			t.activeModule = null;
			callbackWhenFinished();
		}

		function cycleTrigger () {
			console.log('cycle_trigger', idx, slides.length);

			if (goToNextSlide) {
				t.nextSlide();
			} else {
				goToNextSlide = true;
			}

			var timeoutInterval = t.defaultSlideDuration;
			var possibleDuration = t.currentSlide.data('duration');
			
			var callTrigger = false;

			if (t.activeModule != null) {
				var moduleCycleResponse = t.modules[t.activeModule].cycle();

				if (moduleCycleResponse == true) {
					goToNextSlide = false;
				} else if (typeof moduleCycleResponse == 'number') {
					if (moduleCycleResponse > 0) {
						goToNextSlide = false;
						possibleDuration = moduleCycleResponse;
					} else {
						console.log(t.modules[t.activeModule].getName() +": cycle returned negative number!");
					}
				}
			}

			if ((typeof possibleDuration == 'number') && (possibleDuration >= 100)) {
				timeoutInterval = possibleDuration;
			}
			
			if (goToNextSlide && (idx >= slides.length)) callTrigger = true;

			if (!callTrigger) {
				//console.log('will not call callbackWhenFinished');
				timeout = setTimeout(cycleTrigger, timeoutInterval);
			} else if (callTrigger && $.isFunction(callbackWhenFinished)) {
				//console.log('callback triggered in cycle_trigger');

				if (t.activeModule != null) {
					timeout = setTimeout(unbindThenCallback, timeoutInterval);
				} else {
					timeout = setTimeout(callbackWhenFinished, timeoutInterval);
				}
			}
		}

		cycleTrigger();
	}
};
