var pictureCollection = {
	slide : null,
	images : null,
	activeImage : null,
	activeImageRef : null,

	identifySlide : function (slide) {
		var t = this;
		// Return true or false
		// will take control if true
		if (slide.hasClass('pictureCollection')) {
			t.slide = slide;

			t.images = t.slide.find('img');

			if(t.images.length == 0) {
				return false;
			}

			var bodyHeight = parseInt($('body').css('height').replace('px', ''), 10);
			var bodyWidth = parseInt($('body').css('width').replace('px', ''), 10);

			var bodyRatio = bodyHeight / bodyWidth;

			console.log('bodyRatio', bodyRatio);

			for (var i = 0; i < t.images.length; i++) {
				var image = t.images.eq(i);
				var imageHeight = parseInt(image.css('height').replace('px', ''), 10);
				var imageWidth = parseInt(image.css('width').replace('px', ''), 10);

				console.log('imageWidth', imageWidth, 'imageHeight', imageHeight);

				var imageRatio = imageHeight / imageWidth;

				var height = 0;
				var width = 0;

				if (imageRatio > bodyRatio) {
					// The transform image's width must be shrinked
					height = bodyHeight;
					width = bodyWidth * bodyRatio / imageRatio;
				} else if (imageRatio < bodyRatio) {
					// The transform image's height must be shrinked
					width = bodyWidth;
					height = bodyHeight * imageRatio / bodyRatio;
				} else {
					height = bodyHeight;
					width = bodyWidth;
				}

				image.css({height: height + 'px', width: width + 'px'});

				image.css({
					top: ((bodyHeight - height) / 2) + 'px',
					left: ((bodyWidth - width) / 2) + 'px'
				});

				image = null;
			}

			return true;
		} else {
			return false;
		}
	},

	cycle : function () {
		var t = this;
		// Will do a single element cycle, will return true or next callback
		//  time if there are more elements to go through, false otherwise.

		if (t.images.length > 0) {

			if (t.activeImage != null) {
				t.activeImage.removeAttr('aria-selected');
				t.activeImageRef++;
			}
			
			t.activeImage = t.images.eq(t.activeImageRef);

			t.activeImage.attr('aria-selected', true);

			if (t.activeImageRef < (t.images.length - 1)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	unbind : function () {
		var t = this;

		t.activeImage.removeAttr('aria-selected', true);

		t.slide = null;
		t.activeImage = null;
		t.activeImageRef = 0;
		t.images = null;
		
		console.log('module eventCollection unbound');
		
		t = null;
	}
};
