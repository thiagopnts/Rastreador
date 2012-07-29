require 'sinatra'
require 'httparty'
require 'nokogiri'

post '/track' do
  response = HTTParty.get("http://websro.correios.com.br/sro_bin/txect01$.Inexistente?P_LINGUA=001&P_TIPO=002&P_COD_LIS=#{params[:code]}")

  html = Nokogiri::HTML(response.body)
  destinos = []
  html.search('//tr/td').each {|el| destinos << el.text unless el.text == "Data" or el.text == "Local" or el.text.start_with? "Situa" or el.text.include? "Encaminhado" or el.text.include? ":" or el.text == "Postado" }

  destinos.last
end

get "/" do
  '
    <form method="GET" action="/track">
      <input type="text" name="code"/>
      <input type="submit"/>
    </form>
  '
end
