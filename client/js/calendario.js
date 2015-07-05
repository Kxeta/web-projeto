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
    
    $('button#addTarefa').on('click', function(event){
        event.preventDefault();
        $.ajax({
            url: '../app', 
            type: 'POST',
            data: $('#form-add-tarefa').serialize(),
            success: function(data){
                 $('#form-add-tarefa').children('input').val('');
                 $('#form-add-tarefa').children('textarea').val('');
                alert("Tarefa Adicionada com Sucesso!");
//                var calendar = $('#calendar').calendar({events_source: function(){
//    return  [
//       {
//           "id": 293,
//           "title": "Event 1",
//           "url": "http://example.com",
//           "class": "event-important",
//           "start": 12039485678000, // Milliseconds
//           "end": 1234576967000 // Milliseconds
//       },
//       ...
//   ];
//}});
                
            },
            error: function(data){
                alert("Erro ao adicionar a tarefa");
            }
        });
    });
}(jQuery));

