const save_mapping = (online_list,user_id,session_key,socket_id) => {
	const find_item = (array,key) => {
		for(let i = 0; i < array.length; i++){
			if(array[i][key] != null){
				return array[i][key]
			}
		}
		return null
	}

	const save_item = (array,key,item) => {
		for(let i = 0; i < array.length; i++){
			if(array[i][key] != null){
				array[i][key] = item
				return true
			}
		}
		return false
	}

	const find_id = (array,id) => {
		for(let i = 0; i < array.length; i++){
			if(array[i] == id){
				return id
			}
		}
		return null
	}

	let item = find_item(online_list,user_id)
	
	if(item){
		let session_item = find_item(item,session_key)
		if(session_item){
			let _socket_id = find_id(session_item,socket_id)
			if(_socket_id){
				console.log('unbelievable! socket id is duplicate.')
			}else{
				session_item.push(socket_id)
			}
			save_item(item,session_key,session_item)
		}else{
			let _session_item = {}
			_session_item[session_key] = []
			_session_item[session_key].push(socket_id)
			item.push(_session_item)
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
	return item
}

const find_socket_id = (online_list,user_id) => {
	for(let i = 0; i < online_list.length; i++){
		if(online_list[i][user_id]!=null){
			let socket_id_list = []
			for(let j = 0; j < online_list[i][user_id].length; j++){
				for(let s in online_list[i][user_id][j]){
					socket_id_list = socket_id_list.concat(online_list[i][user_id][j][s])
				}
			}
			return socket_id_list
		}
	}
}

const find_online_user_id = online_list => {
	let online_user_id_list = []
	for(let i = 0; i < online_list.length; i++){
		for(let j in online_list[i]){
			online_user_id_list.push(j)
		}
	}
	return online_user_id_list
}

module.exports = {save_mapping:save_mapping,find_socket_id:find_socket_id,find_online_user_id:find_online_user_id}

