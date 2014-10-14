
$(function() {
	AIEventAdapter.getInstance().addEventListener(AIEvent.DOCUMENT_NEW, function(event) {
		alert("Extension received DOCUMENT_NEW event");
	});
});