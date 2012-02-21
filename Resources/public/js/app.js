/**
 * This file must be loaded last.
 */

"use strict";

var reloadControl = {};

$(document).ready(function () {

	window.onload = function () {
		main();

		idx = 0;

		function startCycle () {
			scanForSlides();
			setSlide();
			slideControl.init();

			if (reloadControl.mustReload()) {
				reloadControl.reloadPage();
			} else {
				slideControl.completeCycle(cycleControl);
			}
		};

		function cycleControl () {
			slideControl.initializeModules(startCycle);
		};

		cycleControl();
	}
});

reloadControl = function(){

	var reload = false;

	var reloadPage = function() {
		location.replace(location.href.split('#')[0]);
	}

	var checkResult = function(data) {
		console.log('data.reload', data.reload);

		if (data.reload) {
			reload = true;
		}

		if (data.reloadNow) {
			reloadPage();
		}
	}

	var pollServer = function () {
		if ( (typeof checkReloadUrl === "string") && (checkReloadUrl.length > 0) ) {
			$.ajax(checkReloadUrl, {
				cache: false,
				dataType: 'json',
				success : checkResult,
			});
		}
	}

	var startCycle = function() {
		pollServer();
		setTimeout(startCycle, 10 * 1000); // Execute every 10th second.
	};

	var mustReload = function() {
		return reload;
	};

	startCycle();

	return {
		reloadPage : reloadPage,
		mustReload : mustReload,
	};
}();

