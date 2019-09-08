class CreateTrips < ActiveRecord::Migration
  def change
    create_table :trips do |t|
      t.string :name, {null: false}
      t.text :description

      t.timestamps null: false
    end
    add_index :trips, :name
  end
end
