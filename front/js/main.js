$(document).ready(function() {

		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaDay'
			},
			weekends: false,
			defaultDate: '2017-08-08',
			navLinks: true, // can click day/week names to navigate views
      selectable: true,
			selectHelper: true,
      select: function() {
          $('#createEventModal').modal('show');
      }
});


$('#submitButton').on('click', function(e){
// We don't want this to act as a link so cancel the link action
  e.preventDefault();
  doSubmit();
});

$('#cancelButton').on('click', function(e){
// We don't want this to act as a link so cancel the link action
  $("#createEventModal").modal('hide');
});

function doSubmit(){
	$("#createEventModal").modal('hide');
	  alert("form submitted");

	  $("#calendar").fullCalendar('renderEvent',
	    {
	        title: $('#patientName').val(),
	        idPacient: $('#patientId').val(),
	        departament: $('#departament').val(),
	        when: $('#when').val()
	    },
	    true);
	 }
});