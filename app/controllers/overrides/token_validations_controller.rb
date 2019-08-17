module Overrides
  class TokenValidationsController < DeviseTokenAuth::TokenValidationsController
    def render_validate_token_success
      user = @resource

      response = user.token_validation_response
      response[:image_url] = image_content_url(user.image_id, width:100) if user.image_id

      render json: {
        success: true,
        data: resource_data(resource_json: response)
      }
    end
  end
end
