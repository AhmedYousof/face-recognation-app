const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const knex = require('knex');
const helmet = require('helmet');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'root',
    database : 'smart-brain'
  }
});

const store = new KnexSessionStore({
  knex: db
});

var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 's3Cur3',
  name: 'session',
  autoReconnect: true,
  cookie: {
    secure: true,
    httpOnly: true,
    expires: expiryDate
  },
  store: store,
}))

app.set('trust proxy', 1); // trust first proxy
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());


app.get('/', (req, res) => { 
  var n = req.session.views || 0;
  req.session.views = ++n;
  res.end(n + ' views') ;
});
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.post('/register', (req, res) =>{register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res)=> { profile.handleProfileGet(req, res, db)});
app.put('/image', (req, res)=> {image.handleImage(req, res, db)});


app.listen(3000, ()=>{
    console.log('app is running on port 3000');
});