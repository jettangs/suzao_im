const express = require('express');
const app = express();
const http = require('http').Server(app);
const socket = require('socket.io')
const io = socket(http);
const redis = require('redis')
const Sequelize = require('sequelize')
const PHPUnserialize = require('php-unserialize');
const {rds,db} = require('./config')
const {chat_people,private_chat} = require('./api')
const {save_mapping,emit_message} = require('./lib')
const {redis_get_key,parse_cookie} = require('./tool')

const port = process.argv.splice(2)[0]

const sequelize = new Sequelize(`postgres://${db.username}:${db.password}@${db.host}:${db.port}/${db.dbname}`,{logging: false});
const client = redis.createClient(rds.port,rds.host,rds.opt)

const Member = sequelize.import('./model/member')
const Message = sequelize.import('./model/message')
const Chatlog = sequelize.import('./model/chatlog')
const Card = sequelize.import('./model/card')

let online_user = []
let socket_list = {}

io.on('connection', async(socket) => {
	console.log(`socket.id: ${socket.id} connected.`);
	let session_key = `_PHCR${parse_cookie(socket.request.headers.cookie).PHPSESSID}`
	if(session_key=='_PHCRundefined'){
		socket.emit('warning',{code:10101,info:'invalid connection: session id is null.'})
		return
	}
	let session_value = await redis_get_key(client,session_key)
	if(!session_value){
		socket.emit('warning',{code:10102,info:'invalid connection: session value is null'})
		return
	}
	let session_user = PHPUnserialize.unserializeSession(session_value)['frontend#user'];
	let user_id = session_user.id
	if(!session_user){
		socket.emit('warning',{code:10103,info:'invalid connection: user info in session value is null'})
		return
	}
	online_user = save_mapping(online_user,user_id,session_key,socket.id)
	socket_list[user_id] = []
	socket_list[user_id].push(socket)
	socket.on('chat_people', () => {
		socket.emit('chat_people',chat_people(Member,Chatlog,Card,Message,online_user,session_user))
	})
	socket.on('private_chat', message => {
		if(message.ack==0){
			emit_message(socket_list[message.uid],message)
			emit_message(socket_list[user_id],message)
			socket.emit('private_chat',private_chat(Member,Chatlog,Card,Message,online_user,session_user,message))
		}else{
			console.log(`Receive ack from socket id: ${socket.id}`)
		}
	})
	socket.on('disconnect', () => {
		console.log(`socket.id: ${socket.id} disconnected.`);
    });
});

client.on('connect', () => {
	console.log('connect redis success.')
})

http.listen(port, () => {
  console.log(`listening on port:${port}`);
});