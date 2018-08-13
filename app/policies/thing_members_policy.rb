class ThingMembersPolicy < ApplicationPolicy
  class Scope < Scope
    def user_roles thing_id=0, members_only=true
      member_join = members_only ? "join" : "left join"
      joins_clause=["#{member_join} Roles r on r.user_id = Users.id",
      				"r.mname='Thing'",
      				"r.mid=#{thing_id}"].join(" and ")
      scope.select("Users.*, r.id as role_id")
           .joins(joins_clause)
    end
    def resolve
      user_roles
    end
  end
end
