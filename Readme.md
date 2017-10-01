# Vid-Jot

Initialization - creating package.json file
- Manifest of app
- Has app name, version, description, author etc.
- File which states dependencies
- index.js is entrypoint (default), we changed this to app.js

Global modules directory:
- npm root -g

package.json
- Can declare scripts here which autorun if app in prod
- e.g.
    "scripts": {
        "start": "node app.js"
    },
    - Enables command: npm start
        - Heroku auto-runs this upon deployment to start app

Running node server:
- node app.js
    - where 'app.js' is the entrypoint declared in the package.json

Nodemon:
- Watching server using nodemon
- npm install -g nodemon
    - Global installation
- Watching files for changes:
    - nodemon


## Libraries used ##
ExpressJS:
- npm install --save express
- Middleware:
    - Functions which have access to the request (req) and response (res) objects
    - http://expressjs.com/en/guide/using-middleware.html


Handlebars (express middleware):
- Express handlebars module: https://github.com/ericf/express-handlebars (optimized for express js)
- Server templating engine
- Rendering templates on the server
    - npm install  --save express-handlebars
- Express-Handlebars uses views directory

Mongoose (database connector):
- npm install --save mongoose
- Decleration of models and schemas, allows us to connect to local (mongoDB) or remote (mlab) database

Body-parser (express middleware):
- Module: https://github.com/expressjs/body-parser
- Allows us to retrieve form body data (sumitted) and send it in http response
- npm install --save body-parser

Method-override:
- Module: https://github.com/expressjs/method-override
- Forms can only have method=get/post, this allows forms to use methods put and delete
- Using this forms can send put request to api which can then process that form and send back response (render new page)
- npm install --save method-override

Express-session:
- Module: https://github.com/expressjs/session
- npm install --save express-session

Connect-Flash:
- Module: https://github.com/jaredhanson/connect-flash
- npm install --save connect-flash

Passport:
- Module: http://passportjs.org/docs
- npm install --save passport
- NodeJS authentication library
- Has over 300+ strategies including:
    - single-sign-ons (google, fb, linkedin, ..., etc.)
    - OAuth, OAuth 2.0, OpenID, Basic/Digest auth
    - webtokens
    - local authentication (storing/retrieving user data to/from db)
    - SAML

BcryptJS:
- Module: https://www.npmjs.com/package/bcryptjs
- npm install --save bcryptjs
- Hashes passwords before storing them in the DB (never store plaintext passwords in db)
- Installing passport strategies:
    - Local strategy (store to local DB):
        - npm install --save passport-local


## Deployment procedure ##
Mlab DB: used for prod deployments
MongoDB: used for local deployments

Heroku deployment procedure:
- git init
- git add .
- git commit -am <message>

- Heroku setup:
    - heroku login
    - heroku create
    - heroku git:remote -a <repo name obtained from heroku create>
    - git push heroku master

- Next: Link and deploy to github which auto-builds (continous integration)