require "test_helper"

class Api::V1::CitiesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_cities_index_url
    assert_response :success
  end
end
