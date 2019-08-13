class Image < ActiveRecord::Base
  include Protectable
  attr_accessor :image_content

  has_one :user
  has_many :thing_images, inverse_of: :image, dependent: :destroy
  has_many :things, through: :thing_images

  scope :except_user_images, -> { where.not(:id=>User.select(:image_id).where.not(image_id:nil)) }

  def basename
    caption || "image-#{id}"
  end
end
