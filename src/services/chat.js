import { io } from "../server";

io.on('connection', (socket)=>{
    console.log('server connevted')
})