(function(){
	Utils = function(){
		checkToInstall = function(){
			var request = window.navigator.mozApps.getSelf(); 

			request.onsuccess = function() {  
			  if (request.result) {  
                $("#start").attr({'data-theme': 'a', href: '#new-track'});
			  } else {  
                $("#start").attr({'data-theme': 'b', href: '#'});
			  }  
			}  
			request.onerror = function() {  
			  alert("Error checking installation status");
			}
		};

		doInstall = function(){
			var request2 = window.navigator.mozApps.install('http://localhost:4567/manifest.webapp');
			request2.onsuccess = function () {
			  var appRecord = this.result;
              $("#install").hide();
			};
			request2.onerror = function () {
              alert("something went wrong.");
			};
		};

		return {
			check: function(){
				checkToInstall();
			},
			install: function(){
				doInstall();
			},
		}
	}();
})();

var geocoder;
var map;

function MapsInit() {
  geocoder = new google.maps.Geocoder();
  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 9,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function getPlace(address) {
  geocoder.geocode( { 'address': address }, function(results, status) {
    google.maps.event.trigger(map,'resize');
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      $("#map").html("Essa localização não foi encontrada no mapa!")
    }
  });
}

jQuery(document).ready(function($) {

  function addCode(code) {
    if(codes.indexOf(code) < 0) {
      codes.push(code);
      $("#codes").append($("<li/>").append($("<a>").attr({'href':'#dialog','data-transition':'slide'}).html(code)));
      if(codes.length > 5) {
        codes = codes.slice(1, codes.length);
        $("#codes").children().first().remove();
      }
      localStorage.codes = codes;
    }
    $("#codes").listview('refresh');
  }

  function loadView() {
    for(var i=0; i < codes.length; i++){
      if(i == 5) break; 
      $("#codes")
      .append($("<li>")
      .append($("<a>")
      .attr({
        "href": "#dialog",
        "data-transition": "slide"
      })
      .html(codes[i])));
    }
    $("#codes").listview('refresh');
  }

  function doPost(code) {
      var mock = "ACF MARCILIO DIAS - ARACATUBA/SP";
//    $.post('/search', {
//      code: code
//      }, function(data) {
        var message = "Sua encomenta está em " + mock;
        $("#response").html(message);
        getPlace(mock);
        $("#dialog").page('refresh');
//      });
  }
  
  MapsInit();

  Utils.check();

  var codes;
  var rawcodes = localStorage.codes;

  if(rawcodes) {
    codes = rawcodes.split(',');
    loadView();

  } else {
    codes = [];
  }

  var request = window.navigator.mozApps.getSelf();
  if(!request.result) {
    $("#install").show();
  } 
  
  $("#install").click(function() {
    Utils.check();
    Utils.install();
  });

  $('li').click(function(event) {
    if(navigator.onLine) {
      var address = $(this).find('a').html();
      doPost(address);
      $("#dialog").page('refresh');
    } else {
      alert("Você precisa estar conectado para fazer isso!");
    }
  });

  $('form').submit(function(event) {
    if(navigator.onLine) {
      $("#wrapper").click();
      event.stopImmediatePropagation();
      event.preventDefault();
      event.stopPropagation();
      var code = $("#search").val();
      doPost(code);
      addCode(code);
    } else {
      alert("Você precisa estar conectado para fazer isso!");
    }
  });

});

