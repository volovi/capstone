class ThingMembersController < ApplicationController
  before_action :set_thing, only: [:thing_members]
  before_action :authenticate_user!, only: [:thing_members]
  after_action :verify_authorized
  #after_action :verify_policy_scoped, only: [:thing_members]

  def thing_members
    authorize @thing
    #@users=policy_scope(User.all)
    #need to pass arguments to ThingMembersPolicy::Scope
    members_only = !current_user.has_role([Role::ORGANIZER], 
                    "Thing", @thing.id)  
    @users = ThingMembersPolicy::Scope.new(current_user, 
                    User.all)
                    .user_roles(@thing.id.to_i, members_only)
    render :index
  end

  private

    def set_thing
      @thing = Thing.find(params[:thing_id])
    end
end
