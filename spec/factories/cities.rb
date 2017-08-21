FactoryGirl.define do

  factory :city_fixed, class: 'City' do
    name "test"
  end
  
  factory :city, :parent=>:city_fixed do
  end
end
