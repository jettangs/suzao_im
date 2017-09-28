const express = require('express');
const app = express();
const http = require('http').Server(app);
const socket = require('socket.io')
const io = socket(http);
const PHPUnserialize = require('php-unserialize');
const redis = require('redis')
const {rds,db} = require('./config')
const {redis_get_key,parse_cookie} = require('./tool.js')
const {save_mapping} = require('./lib.js')

const port = process.argv.splice(2)[0]
const client = redis.createClient(rds.port,rds.host,rds.opt)

const online_user_list = []

io.on('connection', async(socket) => {
	console.log(`socket.id: ${socket.id} connected`);
	let session_key = `_PHCR${parse_cookie(socket.request.headers.cookie).PHPSESSID}`
	if(session_key=='_PHCRundefined'){
		socket.emit('warning',{code:10101,info:'invalid connection: session id is null.'})
		return
	}
	let session_value = await redis_get_key(session_key)
	if(!session_value){
		socket.emit('warning',{code:10102,info:'invalid connection: session value is null'})
		return
	}
	let session_user = PHPUnserialize.unserializeSession(session_value)['frontend#user'];
	if(!session_user){
		socket.emit('warning',{code:10103,info:'invalid connection: user info in session value is null'})
		return
	}
	online_user = save_map(online_user,session_user.id,session_key,socket.id)
	socket.on('chat_people', () => {

	})
});

client.on('connect', () => {
	console.log('connect redis success.')
})

http.listen(port, () => {
  console.log(`listening on port:${port}`);
});