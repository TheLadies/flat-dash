class DataController < ApplicationController
    def index
      # Repository.get_repos
      # Repository.make_repos
      # Repository.make_pull_requests
    end

    def show
      render "#{params[:id]}.html"
    end
end
