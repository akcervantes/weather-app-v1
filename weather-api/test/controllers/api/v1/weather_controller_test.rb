require "test_helper"

class Api::V1::WeatherControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get api_v1_weather_show_url
    assert_response :success
  end
end
