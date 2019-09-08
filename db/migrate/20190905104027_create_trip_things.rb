class CreateTripThings < ActiveRecord::Migration
  def change
    create_table :trip_things do |t|
      t.references :trip, {index: true, foreign_key: true, null:false}
      t.references :thing, {index: true, foreign_key: true, null:false}
      t.integer :priority, {null:false, default:5}
      t.integer :creator_id, {null:false}

      t.timestamps null: false
    end
    add_index :trip_things, [:thing_id, :trip_id], unique:true
  end
end
