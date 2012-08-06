
class Utils

  @check: ->
    @request = window.navigator.mozApps.getSelf()

    if @request.result
      $("#start").attr(
        'data-theme': 'a',
        'href': '#new-track'
      )
      $("#install").show()
    else
      $("#start").attr(
        'data-theme': 'b'
        'href': '#'
      )
      $("#install").hide()

    request.onerror = ->
      alert "Error checking installation status"

  @install: ->
    request = window.navigator.mozApps.install("http://localhost:4567/manifest.webapp")

    appRecord = @request
    $("#install").hide()
