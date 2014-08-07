class DataScrapeController < ApplicationController
  protect_from_forgery except: :solari_data

  def solari_data
    json = [
      {'sDate' => 'today',
       'sTime' => '13:30', 
       'sUsername' => '@jessrudder',
       'sTimeFrame' => 'week',
       'nPullRequests' => 170
      },
      {'sTime' => '16:00',
       'sUsername' => '@denineguy',
       'sTimeFrame' => 'week',
       'nPullRequests' => 19
      },
      {'sTime' => '16:30',
       'sUsername' => '@christinaleuci',
       'sTimeFrame' => 'week',
       'nPullRequests' => 1
      }
   ].to_json

   render json: json, callback: params[:callback]
  end
end