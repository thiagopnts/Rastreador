$ ->
  class App
    
    @mapsInit: ->
      console.log "initializing maps"
      geocoder = new google.maps.Geocoder()
      mapOptions =
        center: new google.maps.LatLng(-34.397, 150.644)
        zoom: 9
        mapTypeId: google.maps.MapTypeId.ROADMAP

      map = new google.maps.Map(document.getElementById("map"), mapOptions)

    @getPlace: (address) ->
      geocoder.geocode( { 'address': address }, (results, status) ->
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
      if codes.indexOf(code) < 0
        codes.push(code)
        $("#codes").append($("<li/>").append($("<a>").attr({'href':'#dialog','data-transition':'slide'}).html(code)))
        if codes.length > 5
          codes = codes.slice(1, codes.length)
          $("#codes").children().first().remove()

        localStorage.code = codes

      $("#codes").listview('refresh')

    @loadView: ->
      for i in codes
        if i == 5
          break
        $("#codes")
        .append($("<li>")
        .append($("<a>")
        .attr({
          "href": "#dialog",
          "data-transition": "slide"
        })
        .html(codes[i])))

    @doPost: (code) ->
      mock = "ACF MARCILIO DIAS - ARACATUBA/SP"

      message = "Sua encomenda esta em " + mock

      $("#response").html("message")

      getPlace(mock)

      $("#dialog").page('refresh')

  App.mapsInit()

  Utils.check()

  codes = null
  rawcodes = localStorage.codes

  if rawcodes
    codes = rawcodes.split(',')
    App.loadView()
  else
    codes = []

  $("#install").click(->
    Utils.check()
    Utils.install()
  )

  



