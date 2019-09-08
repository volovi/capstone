class TripThingsController < ApplicationController
  wrap_parameters :trip_stop, include: ["stop_id", "trip_id", "priority"]
  before_action :get_trip, only: [:index, :update, :destroy]
  before_action :get_stop, only: [:stop_trips]
  before_action :get_trip_stop, only: [:update, :destroy]
  before_action :origin, only: [:trip_things]

  def index
    @trip_stops=@trip.trip_stops.prioritized.with_stop_name
  end

  def stop_trips
    @trip_stops=@stop.trip_stops.prioritized.with_trip_name
    render :index 
  end

  def linkable_trips
    stop=Thing.find(params[:stop_id])
    @trips=Trip.not_linked(stop)
    render "trips/index"
  end

  def trip_things
    expires_in 1.minute, :public=>true
    miles=params[:miles] ? params[:miles].to_f : nil
    tripStop=params[:tripStop]
    distance=params[:distance] ||= "false"
    reverse=params[:order] && params[:order].downcase=="desc"  #default to ASC
    last_modified=TripThing.last_modified
    state="#{request.headers['QUERY_STRING']}:#{last_modified}"
    #use eTag versus last_modified -- ng-token-auth munges if-modified-since
    eTag="#{Digest::MD5.hexdigest(state)}"

    if stale?  :etag=>eTag
      @trip_stops=TripThing.within_range(@origin, miles, reverse)
        .with_trip_name
        .with_stop_name
        .with_position
      @trip_stops=@trip_stops.trips if tripStop && tripStop.downcase=="trip"
      @trip_stops=TripThing.with_distance(@origin, @trip_stops) if distance.downcase=="true"
      render "trip_things/index"
    end
  end

  def create
    trip_stop = TripThing.new(trip_stop_create_params.merge({
                                :stop_id=>params[:stop_id],
                                :trip_id=>params[:trip_id],
                                }))
    trip=Trip.where(id:trip_stop.trip_id).first
    if !trip
      full_message_error "cannot find trip[#{params[:trip_id]}]", :bad_request
    elsif !Thing.where(id:trip_stop.stop_id).exists?
      full_message_error "cannot find stop[#{params[:stop_id]}]", :bad_request
    else
      trip_stop.creator_id=current_user.id
      if trip_stop.save
        head :no_content
      else
        render json: {errors:@trip_stop.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  def update
    if @trip_stop.update(trip_stop_update_params)
      head :no_content
    else
      render json: {errors:@trip_stop.errors.messages}, status: :unprocessable_entity
    end
  end

  def destroy
    @trip_stop.destroy
    head :no_content
  end

  private
    def get_trip
      @trip ||= Trip.find(params[:trip_id])
    end
    def get_stop
      @stop ||= Thing.find(params[:stop_id])
    end
    def get_trip_stop
      @trip_stop ||= TripThing.find(params[:id])
    end

    def trip_stop_create_params
      params.require(:trip_stop).tap {|p|
          #_ids only required in payload when not part of URI
          p.require(:stop_id)    if !params[:stop_id]
          p.require(:trip_id)    if !params[:trip_id]
        }.permit(:priority, :stop_id, :trip_id)
    end
    def trip_stop_update_params
      params.require(:trip_stop).permit(:priority)
    end

    def origin
      case
      when params[:lng] && params[:lat]
        @origin=Point.new(params[:lng].to_f, params[:lat].to_f)
      else
        raise ActionController::ParameterMissing.new(
          "an origin [lng/lat] required")
      end
    end
end
