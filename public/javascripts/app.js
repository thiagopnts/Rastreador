(function() {
  var App, Installer;

  Installer = (function() {

    function Installer() {}

    Installer.check = function() {
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

    Installer.install = function() {
      var appRecord, request;
      request = window.navigator.mozApps.install("http://floating-dusk-6551.herokuapp.com/manifest.webapp");
      appRecord = this.request;
      return $("#install").hide();
    };

    return Installer;

  })();

  App = (function() {

    function App() {}

    App.getPlace = function(address) {
      var map, mapOptions;
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
      if (this.codes.indexOf(code) < 0) {
        this.codes.push(code);
        $("#codes").append($("<li/>").append($("<a>").attr({
          'href': '#dialog',
          'data-transition': 'slide'
        }).html(code)));
        if (this.codes.length > 5) {
          this.codes = this.codes.slice(1, this.codes.length);
          $("#codes").children().first().remove();
        }
        localStorage.code = this.codes;
      }
      return $("#codes").listview('refresh');
    };

    App.loadView = function() {
      var i, _i, _len, _ref, _results;
      _ref = this.codes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i === 5) break;
        _results.push($("#codes").append($("<li>").append($("<a>").attr({
          "href": "#dialog",
          "data-transition": "slide"
        }).html(this.codes[i]))));
      }
      return _results;
    };

    App.doPost = function(code) {
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
      var rawcodes;
      this.codes = null;
      rawcodes = localStorage.codes;
      if (rawcodes) {
        this.codes = rawcodes.split(',');
        App.loadView();
      } else {
        this.codes = [];
      }
      $("#install").click(function() {
        Installer.check();
        return Installer.install();
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
          $("#search").val("");
          App.doPost(code);
          return App.addCode(code);
        } else {
          return alert("Você precisa estar conectado para fazer isso");
        }
      });
    };

    return App;

  })();

  $(document).ready(function() {
    return App.init();
  });

}).call(this);
