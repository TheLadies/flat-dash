require 'rails_helper'

RSpec.describe "tweets/edit", :type => :view do
  before(:each) do
    @tweet = assign(:tweet, Tweet.create!(
      :name => "MyString",
      :username => "MyString",
      :time => "MyString",
      :text => "MyText"
    ))
  end

  it "renders the edit tweet form" do
    render

    assert_select "form[action=?][method=?]", tweet_path(@tweet), "post" do

      assert_select "input#tweet_name[name=?]", "tweet[name]"

      assert_select "input#tweet_username[name=?]", "tweet[username]"

      assert_select "input#tweet_time[name=?]", "tweet[time]"

      assert_select "textarea#tweet_text[name=?]", "tweet[text]"
    end
  end
end
