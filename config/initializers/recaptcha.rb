Recaptcha.configure do |config|
  config.public_key  = ENV.fetch('RECAPTCHA_PUBLIC_KEY')
  config.private_key = ENV.fetch('RECAPTCHA_PRIVATE_KEY')
  # Uncomment the following line if you are using a proxy server:
  # config.proxy = 'http://myproxy.com.au:8080'
  config.api_version = 'v2'
end