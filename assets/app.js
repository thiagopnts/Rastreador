(function() {

  $(function() {
    var App, codes, rawcodes;
    App = (function() {

      function App() {}

      App.mapsInit = function() {
        var geocoder, map, mapOptions;
        console.log("initializing maps");
        geocoder = new google.maps.Geocoder();
        mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 9,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        return map = new google.maps.Map(document.getElementById("map"), mapOptions);
      };

      App.getPlace = function(address) {
        return geocoder.geocode({
          'address': address
        }, function(results, status) {
          var marker;
          google.maps.event.trigger(map, 'resize');
          if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            return marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });
          } else {
            return $("#map").html("Essa localização não foi encontrada no mapa!");
          }
        });
      };

      App.addCode = function(code) {
        var codes;
        if (codes.indexOf(code) < 0) {
          codes.push(code);
          $("#codes").append($("<li/>").append($("<a>").attr({
            'href': '#dialog',
            'data-transition': 'slide'
          }).html(code)));
          if (codes.length > 5) {
            codes = codes.slice(1, codes.length);
            $("#codes").children().first().remove();
          }
          localStorage.code = codes;
        }
        return $("#codes").listview('refresh');
      };

      App.loadView = function() {
        var i, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = codes.length; _i < _len; _i++) {
          i = codes[_i];
          if (i === 5) break;
          _results.push($("#codes").append($("<li>").append($("<a>").attr({
            "href": "#dialog",
            "data-transition": "slide"
          }).html(codes[i]))));
        }
        return _results;
      };

      App.doPost = function(code) {
        var message, mock;
        mock = "ACF MARCILIO DIAS - ARACATUBA/SP";
        message = "Sua encomenda esta em " + mock;
        $("#response").html("message");
        getPlace(mock);
        return $("#dialog").page('refresh');
      };

      return App;

    })();
    App.mapsInit();
    Utils.check();
    codes = null;
    rawcodes = localStorage.codes;
    if (rawcodes) {
      codes = rawcodes.split(',');
      App.loadView();
    } else {
      codes = [];
    }
    return $("#install").click(function() {
      Utils.check();
      return Utils.install();
    });
  });

}).call(this);
