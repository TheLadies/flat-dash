class DataController < ApplicationController

    def index
      Repository.get_repos
      # Repository.make_repos
      Repository.make_pull_requests
    end

end
