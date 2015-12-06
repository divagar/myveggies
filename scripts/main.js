var DOC_ID = '1rSGZGqy9_2usqOtqarTQSB0NHYZwTkyt6YlrRT3KHQU';

$(document).ready(function() {
    console.log( "I am a veggie!" );

    //call sw
    registerServiceworker();

    //get veggies
    getContent();

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

function getContent() {
  var url = "https://spreadsheets.google.com/feeds/list/" + DOC_ID + "/od6/public/values?alt=json";
  var myVeggies = {};
  $.getJSON(url, function(result) {
      $(result.feed.entry).each(function() {
        myVeggies['name']  = this.gsx$name.$t;
        myVeggies['desc']  = this.gsx$desc.$t;
        myVeggies['price'] = this.gsx$price.$t;
        createMainContent(myVeggies);
      });
      updatePrice();
  }).error(function(jqXHR, textStatus, errorThrown) {
            console.log("error occurred in getting/parsing json!");
    });
}

function createMainContent(data) {
   	$(".container .row").append(
   		"<div class='col-xs-5 col-sm-3 col-md-3 col-lg-2 col-centered'>"+
   			"<div class='veggies-header'>"+
   			"<h3>"+data.name+"</h3>"+
				"<h6>"+data.desc+"</h6>"+
				"<div class='price' data-price='"+data.price+"'>. . .</div>"+
				"<hr/>"+
			"</div>"+
			"<div class='veggies-content'>"+
				"<img src='images/veggies/"+data.name+".png'>"+
			"</div>"+
		"</div>");
}

function updatePrice() {
	$('div.veggies-header div.price').appear();
	$('div.veggies-header div.price').on('appear', function() {
		$(this)[0].innerText = "Rs. " + $(this).data('price');
    	$(this).off();
	});
}