#json.array! @roles, partial: 'roles/role', as: :role

json.array!(@roles) do |role|
  json.extract! role, :id, :role_name, :mname, :mid, :user_id
end
