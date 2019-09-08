class Trip < ActiveRecord::Base
  validates :name, :presence=>true

  has_many :trip_things, inverse_of: :trip, dependent: :destroy
  has_many :things, through: :trip_things

  alias_attribute :trip_stops, :trip_things
  alias_attribute :stops,      :things
  
  scope :not_linked, ->(thing) { where.not(:id=>TripThing.select(:trip_id)
                                                         .where(:thing=>thing)) }
end
