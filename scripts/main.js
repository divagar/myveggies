$(document).ready(function() {
    console.log( "I am a veggie!" );

    //call sw
    registerServiceworker();

    //get veggies
    getContent('veggies');

    //get fruits
    getContent('fruits');

});


function registerServiceworker() {
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    console.log('ServiceWorker registration failed: ', err);
  });
}
}

function getContent(name) {
	$.getJSON("data/"+name+".json", function(result) {
	    $.each(result[name], function(i, data) {
	 		createMainContent(name, data);
	    });
	    updatePrice();
	}).error(function(jqXHR, textStatus, errorThrown) {
            console.log("error occurred in getting/parsing json!");
    });
}

function createMainContent(name, data) {
   	$(".container .row").append(
   			"<div class='col-xs-5 col-sm-3 col-md-3 col-lg-2'>"+
   				"<div class='veggies-header'>"+
	      			"<h3>"+data.name+"</h3>"+
					"<h6>"+data.desc+"</h6>"+
					"<div class='price' data-price='"+data.price+"'>. . .</div>"+
					"<hr/>"+
				"</div>"+
				"<div class='veggies-content'>"+
					"<img src='images/"+name+"/"+data.name+".png'>"+
				"</div>"+
			"</div>");
}

function updatePrice() {
	$('div.veggies-header div.price').appear();
	$('div.veggies-header div.price').on('appear', function() {
		console.log($(this));
		$(this)[0].innerText = "Rs. " + $(this).data('price');
    	$(this).off();
	});
}