json.array!(@tweets) do |tweet|
  json.extract! tweet, :id, :name, :username, :time, :text
  json.url tweet_url(tweet, format: :json)
end
