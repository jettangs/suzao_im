const parse_cookie = cookie => {
	cookie = cookie.replace(/ /g,'')
	cookie = cookie.split(';')
	let _cookie = {}
	for(let i = 0; i < cookie.length; i++){
		let obj = cookie[i].split('=')
		_cookie[obj[0]] = obj[1]
	}
	return _cookie
}

const redis_get_key = (client,key) => {
	return new Promise((resolve,reject)=>{
		client.get(key,function (err, reply) {
			if(err){
				reject(err)
			}
		    resolve(reply)
		})
	})
}

const array_remove_value = (arr, val) => {
	if(!arr) return 
  for(var i = 0; i < arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}

module.exports = {parse_cookie:parse_cookie, redis_get_key:redis_get_key, array_remove_value:array_remove_value}