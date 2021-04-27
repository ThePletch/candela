Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

	scope :api do
		resources :games, except: [:edit, :destroy], shallow: true do
      member do
        patch 'advance_setup_state'
      end

      resources :participations, only: [:update, :index]

      resources :scenes, only: [:create, :index] do
        resources :truths, only: [:create, :index]

        resources :conflicts, only: [:create, :index] do
          member do
            patch 'finish_narration'
          end

          resources :resolutions, only: [:create, :update, :index] do
            member do
              patch 'confirm'
            end
          end
        end
      end
    end
	end

	# html page routes - only things we expect to pass around URLs for go here
	root to: 'games#index'
	get 'games/:game_id/join', to: 'participations#new', as: 'join_game'
	post 'games/:game_id/join', to: 'participations#create'
	get 'play(/:participation_guid)', to: 'games#play', as: 'play_game'
end
