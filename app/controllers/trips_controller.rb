class TripsController < ApplicationController
  before_action :set_trip, only: [:show, :update, :destroy]
  wrap_parameters :trip, include: ["name", "description"]
  
  def index
    @trips = Trip.all
  end

  def show
  end

  def create
    @trip = Trip.new(trip_params)

    User.transaction do
      if @trip.save
        render :show, status: :created, location: @trip
      else
        render json: {errors:@trip.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  def update
    if @trip.update(trip_params)
      head :no_content
    else
      render json: {errors:@trip.errors.messages}, status: :unprocessable_entity
    end
  end

  def destroy
    @trip.destroy

    head :no_content
  end

  private

    def set_trip
      @trip = Trip.find(params[:id])
    end

    def trip_params
      params.require(:trip).tap {|p|
          p.require(:name) #throws ActionController::ParameterMissing
        }.permit(:name, :description)
    end
end
