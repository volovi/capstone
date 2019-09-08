class TripThing < ActiveRecord::Base
  belongs_to :trip
  belongs_to :thing

  alias_attribute :stop,    :thing
  alias_attribute :stop_id, :thing_id

  acts_as_mappable :through => { :thing => :thing_images }

  validates :thing, :trip, presence: true

  scope :prioritized,-> { order(:priority=>:asc) }
  scope :trips,      -> { where(:priority=>0) }
  scope :primary,    -> { where(:priority=>0).first }

  scope :with_trip,  -> { joins("left outer join trips on trips.id = trip_things.trip_id")
                         .select("trip_things.*")}
  scope :with_thing, -> { joins("right outer join things on things.id = trip_things.thing_id")
                         .select("trip_things.*","things.id as thing_id")}
  
  scope :with_trip_name, -> { with_trip.select("trips.name as trip_name")}
  scope :with_stop_name, -> { with_thing.select("things.name as stop_name")}
  scope :with_position,  -> { with_thing.joins("join thing_images on thing_images.thing_id = things.id")
  	             .where(:thing_images=>{:priority=>0})
  	             .joins("right outer join images on images.id = thing_images.image_id")
  	             .select("trip_things.*","images.id as image_id, images.lng, images.lat") }
  scope :within_range, ->(origin, limit=nil, reverse=nil) {
    scope=with_position
    scope=scope.within(limit,:origin=>origin)                   if limit
    scope=scope.by_distance(:origin=>origin, :reverse=>reverse) unless reverse.nil?
    return scope
  }

  def self.with_distance(origin, scope)
    scope.select("-1.0 as distance").with_position
         .each {|tt| tt.distance = tt.distance_from(origin) }
  end

  def self.last_modified
=begin
    m1=Trip.maximum(:updated_at)
    m2=Thing.maximum(:updated_at)
    m3=TripThing.maximum(:updated_at)
    [m1,m2,m3].max
=end
    unions=[Trip,Thing,TripThing].map {|t| 
              "select max(updated_at) as modified from #{t.table_name}\n" 
            }.join(" union\n")
    sql  ="select max(modified) as last_modified from (\n#{unions}) as x"
    value=connection.select_value(sql)
    Time.parse(value + "UTC") if value
  end
end

=begin
SELECT thing_images.*, images.id as image_id, images.lng, images.lat FROM "trip_things" 
INNER JOIN "things" ON "things"."id" = "trip_things"."thing_id" 
INNER JOIN "thing_images" ON "thing_images"."thing_id" = "things"."id" 
right outer join images on images.id = thing_images.image_id

scope :with_thing_image, ->{ with_thing.joins("INNER JOIN thing_images ON thing_images.thing_id = things.id")
                        .select("trip_things.*","thing_images.id as thing_images_id")}
=end