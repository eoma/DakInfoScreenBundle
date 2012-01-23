/**
 * This file must be loaded last.
 */

function mustReload () {

	var reload = false;

	$.ajax(checkReloadUrl, {
		async: false,
		cache: false,
		dataType: 'json',
		success : function (data) {

			console.log('data.reload', data.reload);

			if (data.reload) {
				reload = true;
			}
		}
	});

	console.log('must reload returns:', reload);

	return reload;
}

$(document).ready(function () {

	window.onload = function () {
		main();

		idx = 0;

		function startCycle () {
			scanForSlides();
			setSlide();
			slideControl.init();

			if ((checkReloadUrl.length > 0) && mustReload()) {
				location.replace(location.href.split('#')[0]);
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

