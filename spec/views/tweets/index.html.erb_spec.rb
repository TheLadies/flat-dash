require 'rails_helper'

RSpec.describe "tweets/index", :type => :view do
  before(:each) do
    assign(:tweets, [
      Tweet.create!(
        :name => "Name",
        :username => "Username",
        :time => "Time",
        :text => "MyText"
      ),
      Tweet.create!(
        :name => "Name",
        :username => "Username",
        :time => "Time",
        :text => "MyText"
      )
    ])
  end

  it "renders a list of tweets" do
    render
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => "Username".to_s, :count => 2
    assert_select "tr>td", :text => "Time".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
  end
end
