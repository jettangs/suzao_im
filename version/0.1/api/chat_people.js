let res = {
	code:0,
	info:'',
	data:{
		count:0,
		online:0,
		exchanged:0,
		people:[]
	}
} 

const count_online_user(online_user,chat_log,user_id) = {
	let count = 0
	for(let i = 0; i < online_user.length; i++){
		if(user_id in online_user[i]){
			continue
		}
		for(let k = 0; k < chat_log.length; k++){
			if(chat_log[k].fid == _user_id || chat_log[k].fid == _user_id){
				count++
			}
		}
	}
	return count
}

exports.chat_people = async(online_user,Chatlog,user_id) => {
	let chat_log = await Chatlog.findAll({
		where:{fid:session_user.id}
	})
	
	let _chat_log = await Chatlog.findAll({
		where:{sid:session_user.id}
	}) 

	chat_log = chat_log.concat(_chat_log)

	if(chat_log.length==0){
		res.code = 10001,
		res.info = 'Error: not found.'
		res.data = {}
	}else{
		res.code = 10000,
		res.info = `Success: ${chat_log.length} results was found`
		res.data.count = chat_log.length
		res.data.online = count_online_user(online_user,chat_log,user_id)
	}
}