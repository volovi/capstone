class RolesController < ApplicationController
  before_action :set_role, only: [:destroy]
  wrap_parameters :role, include: ["role_name", "mname", "mid", "user_id"]
  before_action :authenticate_user!, only: [:create, :destroy]

  def create
    @role = Role.new(role_params)
    if @role.save
      render :show, status: :created, location: @role
    else
      render json: {errors:@role.errors.messages}, status: :unprocessable_entity
    end
  end

  def destroy
    @role.destroy

    head :no_content
  end

  private

    def set_role
      @role = Role.find(params[:id])
    end

    def role_params
      params.require(:role).permit(:role_name, :mname, :mid, :user_id)
    end
end
