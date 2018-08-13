json.array!(@users) do |user|
  json.extract! user, :id, :provider, :uid, :name, :email
  json.role_id user.role_id if user.respond_to?(:role_id)
end
