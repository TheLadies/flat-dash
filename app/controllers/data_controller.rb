class DataController < ApplicationController

    def index
      # Repository.get_repos
      # Repository.make_repos
      # Repository.make_pull_requests
    end

    def show
      @pull_count = Repository.pull_request_by_user
      
      render "#{params[:id]}.html"
    end

end
