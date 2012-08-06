(function() {
  var Utils;

  Utils = (function() {

    function Utils() {}

    Utils.check = function() {
      this.request = window.navigator.mozApps.getSelf();
      if (this.request.result) {
        $("#start").attr({
          'data-theme': 'a',
          'href': '#new-track'
        });
        $("#install").show();
      } else {
        $("#start").attr({
          'data-theme': 'b',
          'href': '#'
        });
        $("#install").hide();
      }
      return request.onerror = function() {
        return alert("Error checking installation status");
      };
    };

    Utils.install = function() {
      var appRecord, request;
      request = window.navigator.mozApps.install("http://localhost:4567/manifest.webapp");
      appRecord = this.request;
      return $("#install").hide();
    };

    return Utils;

  })();

}).call(this);
