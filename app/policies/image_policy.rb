class ImagePolicy < ApplicationPolicy
  def index?
  	true
  end
 def create?
  	@user
 end

  class Scope < Scope
    def resolve
      if @user
        scope
      else
      	scope.where("1!=1")
      end
    end
  end
end
