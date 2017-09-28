let input = [
	['50321','sn123231','sk654328'],
	['50321','sn123231','sk789345'],
	['50321','sn345699','sk183234'],
	['50321','sn678899','sk432167'],
	['86343','sn876234','sk276833'],
	['86343','sn576523','sk934522'],
	['92313','sn276343','sk567832'],
	['92313','sn276343','sk323545'],
	['73521','sn341234','sk236532']
]

let output =
[
	{"50321":[{"sn123231":["sk654328","sk789345"]},{"sn345699":["sk183234"]},{"sn678899":["sk432167"]}]},
	{"86343":[{"sn876234":["sk276833"]},{"sn576523":["sk934522"]}]},
	{"92313":[{"sn276343":["sk567832","sk323545"]}]},
	{"73521":[{"sn341234":["sk236532"]}]}
]

let online_list = []

const save_map = (online_list,user_id,session_key,socket_id) => {
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
}

for(let i = 0; i < input.length; i++){
	save_map(online_list,input[i][0],input[i][1],input[i][2])
}

console.log(JSON.stringify(online_list))

