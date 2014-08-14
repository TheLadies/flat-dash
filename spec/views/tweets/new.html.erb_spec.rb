require 'rails_helper'

RSpec.describe "tweets/new", :type => :view do
  before(:each) do
    assign(:tweet, Tweet.new(
      :name => "MyString",
      :username => "MyString",
      :time => "MyString",
      :text => "MyText"
    ))
  end

  it "renders new tweet form" do
    render

    assert_select "form[action=?][method=?]", tweets_path, "post" do

      assert_select "input#tweet_name[name=?]", "tweet[name]"

      assert_select "input#tweet_username[name=?]", "tweet[username]"

      assert_select "input#tweet_time[name=?]", "tweet[time]"

      assert_select "textarea#tweet_text[name=?]", "tweet[text]"
    end
  end
end
