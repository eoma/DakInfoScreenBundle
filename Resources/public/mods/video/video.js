var video = {
	slide : null,
	activeVideo : null,

	getName : function () {
		return "video";
	},

	identifySlide : function (slide) {
		var t = this;
		// Return true or false
		// will take control if true
		if (slide.hasClass('video')) {
			t.slide = slide;

			t.activeVideo = t.slide.find('video').get(0);

			if (!t.activeVideo.paused) {
				t.activeVideo.pause();
			}

			t.activeVideo.currentTime = 0;

			var bodyHeight = parseInt($('body').css('height').replace('px', ''), 10);
			var bodyWidth = parseInt($('body').css('width').replace('px', ''), 10);

			var bodyRatio = bodyHeight / bodyWidth;

			var videoHeight = parseInt($(t.activeVideo).css('height').replace('px', ''), 10);
			var videoWidth = parseInt($(t.activeVideo).css('width').replace('px', ''), 10);

			var videoRatio = videoHeight / videoWidth;

			var height = 0;
			var width = 0;

			if (videoRatio > bodyRatio) {
				// The transform image's width must be shrinked
				height = bodyHeight;
				width = bodyWidth * bodyRatio / videoRatio;
			} else if (videoRatio < bodyRatio) {
				// The transform image's height must be shrinked
				width = bodyWidth;
				height = bodyHeight * videoRatio / bodyRatio;
			} else {
				height = bodyHeight;
				width = bodyWidth;
			}

			$(t.activeVideo).css({height: height + 'px', width: width + 'px'});

			$(t.activeVideo).css({
				top: ((bodyHeight - height) / 2) + 'px',
				left: ((bodyWidth - width) / 2) + 'px'
			});

			console.log(t.activeVideo);
			return true;
		} else {
			return false;
		}
	},

	cycle : function () {
		var t = this;
		// Will do a single element cycle, will return true or next callback
		//  time if there are more elements to go through, false otherwise.

		var possibleDuration = 0;

		if (t.activeVideo.paused) {
			t.activeVideo.play();
		}

		if (t.activeVideo.duration > t.activeVideo.currentTime) {

			console.log('(t.activeVideo.duration > t.activeVideo.currentTime)', (t.activeVideo.duration > t.activeVideo.currentTime));

			if (t.activeVideo.duration > 0) {
				possibleDuration = t.activeVideo.duration;
				console.log('possibleDuration', possibleDuration);
			}


			if (possibleDuration > 0) {
				return (possibleDuration - t.activeVideo.currentTime) * 1000 + 100;
			} else {
				return true;
			}
		} else {
			return false;
		}
	},

	unbind : function () {
		var t = this;

		console.log(t.activeVideo);

		t.activeVideo.pause();

		t.activeVideo = null;

		t.slide = null;
		
		console.log('module ' + t.getName() + ' unbound');
	}
};
