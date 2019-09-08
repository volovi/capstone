json.array!(@trip_stops) do |ts|
  json.extract! ts, :id, :trip_id, :stop_id, :priority, :creator_id, :created_at, :updated_at
  json.trip_name ts.trip_name        if ts.respond_to?(:trip_name)
  json.stop_name ts.stop_name        if ts.respond_to?(:stop_name)
  json.image_content_url image_content_url(ts.image_id)    if ts.image_id

  if ts.respond_to?(:lng) && ts.lng
    json.position do
      json.lng ts.lng
      json.lat ts.lat
    end
  end
  if ts.respond_to?(:distance) && ts.distance && ts.distance >= 0
    json.distance ts.distance.to_f
  end
end
