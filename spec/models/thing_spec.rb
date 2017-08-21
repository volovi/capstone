require 'rails_helper'

RSpec.describe Thing, type: :model do
  include_context "db_cleanup"

  context "build valid thing" do
    it "default thing created with random name" do
    	thing = FactoryGirl.build(:thing)
    	expect(thing.name).to_not be_nil
    	expect(thing.save).to be true
    end

    it "thing with non-nil description" do
    	thing = FactoryGirl.build(:thing, :with_description)
    	expect(thing.description).to_not be_nil
    	expect(thing.save).to be true
    end

    it "thing with explicit nil description" do
        thing = FactoryGirl.build(:thing, description:nil)
    	expect(thing.description).to be_nil
    	expect(thing.save).to be true
    end

    it "thing with non-nil notes" do
    	thing = FactoryGirl.build(:thing, :with_notes)
    	expect(thing.notes).to_not be_nil
    	expect(thing.save).to be true
    end

    it "thing with explicit nil notes" do
        thing = FactoryGirl.build(:thing, notes:nil)
    	expect(thing.notes).to be_nil
    	expect(thing.save).to be true
    end
  end
end
