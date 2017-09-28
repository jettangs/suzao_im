let res = {
	code:0,
	info:'',
	data:[]
}

const find_other_id = (chat_log,self_id) => {
	let other_id  
	if(chat_log.fid != self_id && chat_log.sid == self_id){
		other_id = chat_log.fid
	}else if(chat_log.sid != self_id && chat_log.fid == self_id){
		other_id = chat_log.sid
	}
	return other_id
}

const check_user_online = (online_user,other_id) => {
	for(let i = 0; i < online_user.length; i++){
		let _user_id
		for(let j in online_user[i]){
			if(j ==  _user_id){
				return true
			}
		}
	}
}

const check_user_exchanged = async(Card,other_id) => {
	let count = await Card.count({
		where:{
			mebid:other_id,
			$or:[
				{mid:other_id}
			]
		}
	})
	return count > 0
}

exports.chat_people = async(User,Chatlog,Card,Message,online_user,session_user) => {
	let self_id = session_user.id
	let chat_log = await Chatlog.findAll({
		where:{fid:self_id}
	})
	
	let _chat_log = await Chatlog.findAll({
		where:{sid:self_id}
	}) 

	chat_log = chat_log.concat(_chat_log)

	if(chat_log.length==0){
		res.code = 10001,
		res.info = 'Error: not found.'
	}else{
		res.code = 10000,
		res.info = `Success: ${chat_log.length} results was found`
		for(let i = 0; i < chat_log.length; i++){
			let other_id = find_other_id(chat_log[i],self_id)
			let other_user = await User.find({
				where:{
					mebid:other_id
				}
			})
			let people = {}
			people['id'] = other_user.mebid
			people['name'] = other_user.surname+other_user.fame
			people['gender'] = other_user.gender
			people['cellphone'] = other_user.cellphone
			people['online'] = check_user_online(online_user,other_id)
			people['exchanged'] = check_user_exchanged(Card,other_id)
			people['company'] = other_user.company
			people['department']  = other_user.department
			people['position'] = other_user.position
			people['fax'] = other_user.fax
			people['user_email'] = other_user.email
			res.data.push[people]
		}
	}
	return res
}