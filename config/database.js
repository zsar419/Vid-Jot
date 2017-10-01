if(process.env.NODE_ENV === 'production') {
    module.exports = { mongoURI: 'mongodb://zeta:zeta@ds155934.mlab.com:55934/vidjot-prod-z' }  // DB for production mlab (heroku deployment)
} else {
    module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' }                             // DB for local deployment
}