module Overrides
  class SessionsController < DeviseTokenAuth::SessionsController

    # See https://github.com/lynndylanhurley/devise_token_auth/issues/59

    def render_create_success
      user = @resource

      response = user.token_validation_response
      response[:image_url] = image_content_url(user.image_id, width:100) if user.image_id

      render json: {
        data: resource_data(resource_json: response)
      }
    end
  end
end
