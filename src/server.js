import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import router from './routes/userRouting';
import http from 'http'
import socketio from 'socket.io'
import dotenv from 'dotenv'
import passport from "passport";
dotenv.config({silent : true})
import { getRecommendations } from './some Algortithms/recommendation';

// initialize
const app = express();

app.use(passport.initialize());
// enable/disable cross origin resource sharing if necessary
app.use(cors());
//creating the http server
const server =  http.createServer(app);
// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads


// additional init stuff should go before hitting the routing

// default index route
// app.get('/', (req, res) => {
//   res.send('If you recieved this message, it means that I hacked your computer');
// });

getRecommendations(['Destin Niyomufasha', 'pacifique mucyo', 'Honore Tuyizere', 'Marie Chance uwineza'], null)

export const io = socketio(server, {
  cors:{
    origin : "*",
    methods : ['PUT', 'POST', 'GET', "DELETE"]
  }
})



app.use('/', router);

// START THE SERVER
// =============================================================================
async function startServer() {
  try {
    const port = process.env.PORT || 9090;
    console.log(process.env.PORT);
    server.listen(port);
    mongoose.Promise = global.Promise;
    // const MONGO_URI = process.env.MONGO_URI;
    const MONGO_URI = 'mongodb+srv://destinNiyomufasha:WuCSMHLHOPzJ9zzh@cluster0.tnqmhdn.mongodb.net/?retryWrites=true&w=majority'
    console.log(MONGO_URI);
    mongoose.connect(MONGO_URI);
    console.log('connected to mongodb');
    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
}

startServer();
