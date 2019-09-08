class Thing < ActiveRecord::Base
  include Protectable
  validates :name, :presence=>true

  has_many :thing_images, inverse_of: :thing, dependent: :destroy  
  has_many :images, through: :thing_images

  has_many :trip_things, inverse_of: :thing, dependent: :destroy
  has_many :trips, through: :trip_things

  alias_attribute :stop_images, :thing_images
  alias_attribute :trip_stops,  :trip_things
  
  scope :not_linked, ->(image) { where.not(:id=>ThingImage.select(:thing_id)
                                                          .where(:image=>image)) }
end
