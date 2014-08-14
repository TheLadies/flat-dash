require 'rails_helper'

RSpec.describe "tweets/show", :type => :view do
  before(:each) do
    @tweet = assign(:tweet, Tweet.create!(
      :name => "Name",
      :username => "Username",
      :time => "Time",
      :text => "MyText"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
    expect(rendered).to match(/Username/)
    expect(rendered).to match(/Time/)
    expect(rendered).to match(/MyText/)
  end
end
