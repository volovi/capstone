#
source 'https://rubygems.org'


gem 'rails', '4.2.6'
gem 'rails-api', '~>0.4', '>=0.4.0'
gem 'rack-cors', '~>0.4', '>=0.4.0', require: 'rack/cors'
gem 'pry-rails', '~>0.3', '>=0.3.4'
gem 'devise_token_auth', '~>0.1.39'

gem 'sass-rails', '~>5.0', '>=3.4.22'
gem 'uglifier', '~> 3.0', '>=3.0.2'
gem 'coffee-rails', '~> 4.1', '>= 4.1.0'
gem 'jquery-rails', '~>4.2', '>=4.2.1'

group :development do
  gem 'spring', '~>2.0', '>=2.0.0'
end

group :development, :test do
  gem 'tzinfo-data', :platforms=>[:mingw, :mswin, :x64_mingw, :jruby]
  gem 'httparty', '~>0.14', '>=0.14.0'
  gem 'pry-byebug', '~>3.4', '>=3.4.0'
  gem 'byebug', '~>9.0', '>=9.0.6'

  gem 'rspec-rails', '~> 3.5', '>=3.5.2'
  gem 'mongoid-rspec', '~> 3.0', '>=3.0.0'
  gem 'capybara', '~> 2.10', '>=2.10.1'
  gem 'poltergeist', '~> 1.11', '>=1.11.0'
  gem 'selenium-webdriver', '~> 2.53', '>=2.53.4'
  gem 'chromedriver-helper', '~>1.0', '>=1.0.0'
  gem 'launchy', '~>2.4', '>=2.4.3'
  gem 'simplecov', '~>0', '>=0.12', :require=>false
end  

group :production do
  gem 'rails_12factor', '~>0.0', '>= 0.0.3'
end

gem 'pg', '0.19'
gem 'puma', '~>3.6', '>=3.6.0', :platforms=>:ruby
gem 'jbuilder', '~>2.0', '>=2.6.0'
gem 'mongoid', '~>5.1', '>=5.1.5'
gem 'database_cleaner', '~>1.5', '>=1.5.3'
gem 'factory_girl_rails', '~>4.7', '>=4.7.0'
gem 'faker', '~>1.6', '>=1.6.6'

source 'https://rails-assets.org' do
  gem 'rails-assets-bootstrap', '~>3.3', '>= 3.3.7'
  gem 'rails-assets-angular', '~>1.5', '>= 1.5.8'
  gem 'rails-assets-angular-ui-router', '~>0.3', '>= 0.3.1'
  gem 'rails-assets-angular-resource', '1.5.10'
  gem 'rails-assets-ng-token-auth'
  gem 'rails-assets-angular-cookie' #required by ng-token-auth
end
