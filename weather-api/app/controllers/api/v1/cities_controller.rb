class Api::V1::CitiesController < ApplicationController
  def index
    cities = Rails.cache.fetch("cities_list", expires_in: 1.day) do
      response = HTTParty.get("https://search.reservamos.mx/api/v2/places")
      JSON.parse(response.body)
    end
    
    # Make city names unique but keep the original data
    processed_cities = cities.map do |city|
      if city["city_name"]
        # Create a uniqueness key: combine city name with state if available
        state = city["state"] || ""
        city["display_name"] = if state.empty?
          city["city_name"]
        else
          "#{city["city_name"]}, #{state}"
        end
      end
      city
    end
    
    # Filter out cities without names
    filtered_cities = processed_cities.select { |city| city["city_name"] }
    
    render json: filtered_cities
  end

  def show_with_weather
    city_name = URI.decode_www_form_component(params[:id])
    api_key = ENV['OPENWEATHER_API_KEY']
    
    cities = Rails.cache.fetch("cities_list", expires_in: 1.day) do
      response = HTTParty.get("https://search.reservamos.mx/api/v2/places")
      JSON.parse(response.body)
    end
    
    city = cities.find { |c| c["city_name"]&.downcase == city_name.downcase } || 
           cities.find { |c| c["city_ascii_name"]&.downcase == city_name.downcase }
    
    weather = nil
    if city
      query_name = city["city_ascii_name"] || city["city_name"]
      
      weather = Rails.cache.fetch("weather_#{query_name}", expires_in: 1.hours) do 
        encoded_name = URI.encode_www_form_component(query_name)
        response = HTTParty.get("http://api.openweathermap.org/data/2.5/forecast?q=#{encoded_name}&appid=#{api_key}")
        if response.success?
          response.parsed_response
        else
          nil
        end
      end
    end
    
    if city.nil?
      render json: { error: 'City not found' }, status: :not_found
    elsif weather.nil?
      render json: { error: 'Unable to fetch weather data' }, status: :bad_request
    else
      render json: { city: city, weather: weather }
    end
  end
end
