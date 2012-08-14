
class Installer

  @check: ->
    @request = window.navigator.mozApps.getSelf()

    if @request.result
      $("#install").show()
    else
      $("#start").attr(
        'data-theme': 'b'
        'href': '#'
      )
      $("#install").hide()

  @install: ->
    request = window.navigator.mozApps.install("http://localhost:4567/manifest.webapp")

    appRecord = @request
    $("#install").hide()

class App
  
  @getPlace: (address) ->
    @geocoder = new google.maps.Geocoder()
    mapOptions =
      center: new google.maps.LatLng(-34.397, 150.644)
      zoom: 9
      mapTypeId: google.maps.MapTypeId.ROADMAP

    map = new google.maps.Map(document.getElementById("map"), mapOptions)
    @geocoder.geocode( { 'address': address }, (results, status) ->
      google.maps.event.trigger(map,'resize')
      if status == google.maps.GeocoderStatus.OK
        map.setCenter(results[0].geometry.location)
        marker = new google.maps.Marker(
          map: map,
          position: results[0].geometry.location
        )
      else
        $("#map").html("Essa localização não foi encontrada no mapa!")
    )


  @addCode: (code) ->
    if @codes.indexOf(code) < 0
      @codes.push(code)
      $("#codes").append($("<li/>").append($("<a>").attr({'href':'#dialog','data-transition':'slide'}).html(code)))
      if @codes.length > 5
        @codes = @codes.slice(1, @codes.length)
        $("#codes").children().first().remove()

      localStorage.code = @codes

    $("#codes").listview('refresh')

  @loadView: ->
    for i in @codes
      if i == 5
        break
      $("#codes")
      .append($("<li>")
      .append($("<a>")
      .attr({
        "href": "#dialog",
        "data-transition": "slide"
      })
      .html(@codes[i])))

  @doPost: (code) ->
    $.post('/track', {
      code: code
      }, (data) ->
          message = "Sua encomenta está em " + data
          $("#response").html(message)
          App.getPlace(data)
          $("#dialog").page('refresh')
      )

  @init: ->

    @codes = null
    rawcodes = localStorage.codes

    if rawcodes
      @codes = rawcodes.split(',')
      App.loadView()
    else
      @codes = []

    $("#install").click(->
      Installer.check()
      Installer.install()
    )


    $("li").tap(->
      if navigator.onLine
        address = $(this).find('a').html()
        App.doPost(address)
        $("#dialog").page("refresh")
      else
        alert "Você precisa estar conectado para fazer isso!"
    )

    $("#submit").bind('click', ->
      if navigator.onLine
        $("#wrapper").click()
        code = $("#search").val()
        $("#search").val("")
        App.doPost(code)
        App.addCode(code)
      else
        alert "Você precisa estar conectado para fazer isso"
    )
    

$(document).ready(->
  App.init()
)


