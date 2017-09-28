const express = require('express');
const app = express();
const http = require('http').Server(app);
const socket = require('socket.io')
const io = socket(http);
const redis = require('redis')
const Sequelize = require('sequelize')
const dateFormat = require('dateformat');
const PHPUnserialize = require('php-unserialize');
const {rds,db} = require('./config')
const {initial_data,my_profile,chat_people,private_chat} = require('./api')
const {add_mapping,delete_mapping,emit_message} = require('./lib')
const {redis_get_key,parse_cookie} = require('./tool')
const {check} = require('./check')

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
	//console.log(`socket.id: ${socket.id} connected.`);
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
	if(!session_user){
		socket.emit('warning',{code:10103,info:'invalid connection: user info in session value is null'})
		return
	}
	let user_id = session_user.id
	online_user = add_mapping(online_user,user_id,session_key,socket.id)
	console.log('connected:'+JSON.stringify(online_user))
	if(!socket_list[user_id]){
		socket_list[user_id] = []
	}
	socket_list[user_id].push(socket)
	socket.on('_initial_data', async(message,callback) => {
		if(callback) callback(await initial_data(Member,user_id))
	})
	socket.on('my_profile', async(message,callback) => {
		if(callback) callback(await my_profile(Member,user_id))
	})
	socket.on('chat_people', async(message,callback) => {
		if(callback) callback(await chat_people(Member,Chatlog,Card,online_user,user_id))
	})
	socket.on('private_chat', async(message,callback) => {
		let res = check('private_chat',message)
		if(res.code == 10000){
			message['time'] = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")
			message['sid'] = user_id
			await private_chat(Message,Chatlog,message)
			console.log(JSON.stringify(message))
			console.log(user_id+' '+socket.id+' '+socket_list[user_id].length)
			emit_message(socket_list[message.rid],'private_chat',message)
			emit_message(socket_list[user_id],'private_chat',message)
		}
		if(callback) callback(res)
	})
	socket.on('disconnect', () => {
		//console.log(`socket.id: ${socket.id} disconnected.`);
		online_user = delete_mapping(online_user,user_id,session_key,socket.id)
		console.log('disconnected:'+JSON.stringify(online_user))
    });
});

client.on('connect', () => {
	console.log('connect redis success.')
})

http.listen(port, () => {
  console.log(`listening on port:${port}`);
});