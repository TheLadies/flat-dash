class DataScrapeController < ApplicationController
  protect_from_forgery except: :solari_data

  def solari_data
    json = [
      {'sDate' => 'today',
       'sTime' => '13:30', 
       'sDeparture' => 'foo@example.com',
       'nStatus' => 1,
       'nTrack' => 17,
       'fLight' => true
      },
      {'sDate' => 'yesterday', 
       'sTime' => '16:00',
       'sDeparture' => 'bar@example.com',
       'nStatus' => 2,
       'nTrack' => 19,
       'fLight' =>false
      },
      {'sDate' => 'July 8th, 2013',
       'sTime' => '16:30',
       'sDeparture' => 'baz@example.com',
       'nStatus' => 2,
       'nTrack' => 23,
       'fLight' => false
      }
   ].to_json

   render json: json, callback: params[:callback]
  end
end