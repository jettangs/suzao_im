const {array_remove_value} = require('./tool')

const find_item = (array,key) => {
	if(!array) return null
	for(let i = 0; i < array.length; i++){
		if(array[i][key] != null){
			return array[i][key]
		}
	}
	return null
}

const add_item = (array,key,item) => {
	for(let i = 0; i < array.length; i++){
		if(array[i][key] != null){
			array[i][key] = array[i][key].concat(item)
		}
	}
	return false
}

const new_item = (array,key,item) => {
	for(let i = 0; i < array.length; i++){
		if(array[i][key] != null){
			array[i][key] = item
		}
	}
}

const delete_item = (array,key) => {
	for(let i = 0; i < array.length; i++){
		if(array[i][key] != null){
			array.splice(i,1)
		}
	}
}

const find_id = (array,id) => {
	for(let i = 0; i < array.length; i++){
		if(array[i] == id){
			return id
		}
	}
	return null
}

const add_mapping = (online_list,user_id,session_key,socket_id) => {
	let session_items = find_item(online_list,user_id)
	if(session_items){
		let socket_items = find_item(session_items,session_key)
		if(socket_items){
			let _socket_id = find_id(socket_items,socket_id)
			if(_socket_id){
				console.log('unbelievable! socket id is duplicate.')
			}else{
				socket_items.push(socket_id)
			}
			add_item(session_items,session_key,socket_items)
			new_item(online_list,user_id,session_items)
		}else{
			let _session_items = {}
			_session_items[session_key] = []
			_session_items[session_key].push(socket_id)
			add_item(online_list,user_id,_session_items)
		}
	}else{
		let _session_item = {}
		_session_item[session_key] = []
		_session_item[session_key].push(socket_id)
		let _user_info = {}
		_user_info[user_id] = []
		_user_info[user_id].push(_session_item)
		online_list.push(_user_info)
	}
	return online_list
}

const delete_mapping = (online_list,user_id,session_key,socket_id) => {
	let session_items = find_item(online_list,user_id)
	let socket_items = find_item(session_items,session_key)
	array_remove_value(socket_items,socket_id)
	if(socket_items.length == 0){
		delete_item(session_items,session_key)
		if(session_items.length == 0){
			delete_item(online_list,user_id)
		}else{
			add_item(online_list,user_id,session_items)
		}
	}else{
		add_item(session_items,session_key,socket_items)
	}
	return online_list
}

const emit_message = (socket_list,event,message) => {
	if(!socket_list){
		return
	}
	for(let i = 0; i < socket_list.length; i++){
		socket_list[i].emit(event,message)
	}
}

module.exports = {add_mapping:add_mapping,emit_message:emit_message,delete_mapping:delete_mapping}

