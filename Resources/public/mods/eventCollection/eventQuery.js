var eventQuery = function() {

	var server = 'http://events.kvarteret.no/api/json/';

	var query = function(url, params, callback) {
		if ( ! jQuery.isPlainObject(params) ) {
			params = {};
		}

		$.ajax(
			{
				url: url,
				data: params,
				success: callback,
				dataType: 'jsonp',
			}
		);
	};

	var arrangerList = function (params, callback) {
		var url = server + 'arranger/list';

		query(url, params, callback);
	};

	var categoryList = function (params, callback) {
		var url = server + 'category/list';

		query(url, params, callback);
	};

	var locationList = function (params, callback) {
		var url = server + 'location/list';

		query(url, params, callback);
	};

	var event = function (id, callback) {
		var url = server + 'event/get';
		var params = {
			id: id,
		};

		query(url, params, callback);
	};

	var festival = function (id, callback) {
		var url = server + 'festival/get';
		var params = {
			id: id,
		};

		query(url, params, callback);
	};

	var filteredEvents = function (params, callback) {
		var url = server + 'filteredEvents';

		query(url, params, callback);
	};

	var festivalList = function (params, callback) {
		var url = server + 'festival/list';

		query(url, params, callback);
	};

	return {
		query: query,
		arrangerList: arrangerList,
		categoryList: categoryList,
		locationList: locationList,
		event: event,
		festival: festival,
		filteredEvents: filteredEvents,
		festivalList: festivalList,
	};

}();
