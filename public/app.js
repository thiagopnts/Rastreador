(function() {

  $(function() {
    var App, Utils;
    Utils = (function() {

      function Utils() {}

      Utils.check = function() {
        this.request = window.navigator.mozApps.getSelf();
        if (this.request.result) {
          return $("#install").show();
        } else {
          $("#start").attr({
            'data-theme': 'b',
            'href': '#'
          });
          return $("#install").hide();
        }
      };

      Utils.install = function() {
        var appRecord, request;
        request = window.navigator.mozApps.install("http://localhost:4567/manifest.webapp");
        appRecord = this.request;
        return $("#install").hide();
      };

      return Utils;

    })();
    App = (function() {

      function App() {}

      App.getPlace = function(address) {
        var map, mapOptions;
        console.log("initializing maps");
        this.geocoder = new google.maps.Geocoder();
        mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 9,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        return this.geocoder.geocode({
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
        return $("#codes").listview();
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
        var mock;
        mock = "ACF MARCILIO DIAS - ARACATUBA/SP";
        return $.post('/track', {
          code: code
        }, function(data) {
          var message;
          message = "Sua encomenta está em " + data;
          $("#response").html(message);
          App.getPlace(data);
          return $("#dialog").page('refresh');
        });
      };

      App.init = function() {
        var codes, rawcodes;
        $("#start").attr({
          'data-theme': 'a',
          'href': '#new-track'
        });
        codes = null;
        rawcodes = localStorage.codes;
        if (rawcodes) {
          codes = rawcodes.split(',');
          App.loadView();
        } else {
          codes = [];
        }
        $("#install").click(function() {
          Utils.check();
          return Utils.install();
        });
        $("li").tap(function() {
          var address;
          if (navigator.onLine) {
            address = $(this).find('a').html();
            App.doPost(address);
            return $("#dialog").page("refresh");
          } else {
            return alert("Você precisa estar conectado para fazer isso!");
          }
        });
        return $("#submit").bind('click', function() {
          var code;
          if (navigator.onLine) {
            $("#wrapper").click();
            code = $("#search").val();
            App.doPost(code);
            return App.addCode(code);
          } else {
            return alert("Você precisa estar conectado para fazer isso");
          }
        });
      };

      return App;

    })();
    return $(document).ready(function() {
      return App.init();
    });
  });

}).call(this);
