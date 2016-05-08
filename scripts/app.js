$(function() {

	function padLeft(value, length, character) {

		var valLength = (value + '').length,
			padLength = (length - valLength);

		if (padLength <= 0) {
			return value;
		}

		character = character || '0';

		return Array(padLength + 1).join(character) + value;
	}

	function loadProgrammes(channel, date) {

		var month = padLeft(date.getMonth() + 1, 2),
			year = padLeft(date.getYear() + 1900, 4),
			day = padLeft(date.getDate(), 2),
			url = 'http://www.telestar.fr/programme-tv/grille-chaine/' + channel + '/' + day + '-' + month + '-' + year;

			console.log(url);

		$.get(url, function(html) {

			var page = $(html.replace(/<img[^>]*>/g, '')),
				days = page.find('.channel');

			days.each(function (channelIndex, channelElement) {

				var day = $(channelElement),
					programmes = day.find('.program');

				programmes.each(function (programmeIndex, programmeElement) {

					var programme = $(programmeElement),
						synopsis = programme.find('.synopsis').text().trim(),
						title = programme.find('.title').text().trim(),
						time = programme.find('.time').text().trim(),
						date = new Date(currentDate.valueOf());//new Date(year, month, day, time.substring(0, 2), time.substring(3, 2))

					date.setDate(date.getDate() + channelIndex);
					date.setHours(time.substring(0, 2));
					date.setMinutes(time.substring(3, 6));
					date.setSeconds(0);

					console.log(date);

					// console.log(time);
					// console.log(title);
					// console.log(synopsis);
				});
			});
		});
	};

	var currentDate = new Date();

	for (var i = 0; i < channels.length; i++) {

		var channel = channels[i];

		loadProgrammes(channel.title, currentDate);
	}

	var viewModel = {
	    channels: ko.observableArray(channels),
	};

	var bindingOptions = {
		globals: window,
		bindings: ko.bindingHandlers,
		attribute: "data-bind",
		noVirtualElements: false
	};

	ko.bindingProvider.instance = new ko.secureBindingsProvider(bindingOptions);

	ko.applyBindings(viewModel);
});