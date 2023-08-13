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
import {getConversations} from './services/chat'

// initialize
const app = express();

dotenv.config({silent:true});

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

export const io = socketio(server, {
  cors:{
    origin : "*", // change to the your the url of the platform
    methods : ['PUT', 'POST', 'GET', "DELETE"]
  }
})

// app.post('/webhook', express.raw({type: 'application/json'}), async(req, res)=>{
//   console.log('obtained a webhook');
// })

io.on('connection', (socket)=>{
  socket.on('get_conversations', (userId, callback)=>{
    const returnedConversations = getConversations(userId);
    callback(returnedConversations);
  })

  socket.on('join_room', roomId=>{
    socket.join(roomId); // join the room
  })

  socket.on('detele_message', ()=>{
    console.log('user attempting to delete a message');
  })

  socket.on('new_message', (newMessage, currentRoom)=>{
    socket.to(currentRoom).emit('recieve_message', newMessage);
    const conversation = Conversation.findById(currentRoom);
    conversation.messages = [...conversation.messages, newMessage]; // add the message to the messages of the conversation of the user
  })

  socket.on('get_messages', (conversationId, callBack)=>{
    const messages = Conversation.findById(conversationId); // getting the messages
    callBack(messages);
  })
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
    mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb');
    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
}


startServer();
