const {array_remove_value} = require('../tool')

exports.initial_data = async(Member,uid) => {
	let uid_list = ['6140','6135','6143']
	array_remove_value(uid_list,uid)
	let member_list = await Member.findAll({limit: 10})
	let _member = await Member.findAll({
		where:{
			id:uid_list
		}
	})
	member_list = _member.concat(member_list)
	let _member_list = []
	for(let i = 0; i < member_list.length; i++){
		let obj = {}
		obj['uid'] = member_list[i].id
		obj['name'] = member_list[i].surname + member_list[i].fame
		obj['company'] = member_list[i].company
		_member_list.push(obj)
	}
	return _member_list
}