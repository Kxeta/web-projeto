(function($) {

	"use strict";

	var options = {
        events_source: function () { return []; },
		view: 'month',
		tmpl_path: '/plugin/bootstrap-calendar/tmpls/',
		language: 'pt-BR',
		onAfterEventsLoad: function(events) {
			if(!events) {
				return;
			}
			var list = $('#eventlist');
			list.html('');

			$.each(events, function(key, val) {
				$(document.createElement('li'))
					.html('<a href="' + val.url + '">' + val.title + '</a>')
					.appendTo(list);
			});
		},
		onAfterViewLoad: function(view) {
			$('.page-header h3').text(this.getTitle());
			$('.btn-group button').removeClass('active');
			$('btn-group-views button[data-calendar-view="' + view + '"]').addClass('active');
		},
		classes: {
			months: {
				general: 'label'
			}
		}
	};

	var calendar = $('#calendar').calendar(options);

	$('.btn-group button[data-calendar-nav]').each(function() {
		var $this = $(this);
		$this.click(function() {
			calendar.navigate($this.data('calendar-nav'));
		});
	});

	$('.btn-group-views button').click(function() {
        var $this = $(this);
        var view = $this.data('calendar-view');
        calendar.view(view);
        $('.btn-group button').removeClass('active');
        $('.btn-group-views button[data-calendar-view="' + view + '"]').addClass('active');
	});
}(jQuery));