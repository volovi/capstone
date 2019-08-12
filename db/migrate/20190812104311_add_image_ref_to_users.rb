class AddImageRefToUsers < ActiveRecord::Migration
  def change
    add_reference :users, :image, index: true, foreign_key: true
  end
end
