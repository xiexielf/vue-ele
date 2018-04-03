export function formatDate(date,format) {
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear()+'').substr(4-RegExp.$1.length))
	}

	let perWay = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	}

	for(var i in perWay) {
		if (new RegExp(`(${i})`).test(format)) {
			let result = perWay[i] + '';
			format = format.replace(RegExp.$1, (RegExp.$1.length===1) ? result : padLeftZero(result));
		}
	}

	return format;
}

function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}