class DataController < ApplicationController

    def index
      # Repository.get_repos
      # Repository.make_repos
      Repository.new.get_pull_requests
    end

end
