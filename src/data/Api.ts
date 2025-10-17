

type ApiPath = "weather";


const putCache = (key:any, value:any) => {
	localStorage.setItem(JSON.stringify(key), JSON.stringify(value));
}

const getCache = (key:any) => {
	return localStorage.getItem(JSON.stringify(key));
}


// const fetchCache = async (input: RequestInfo | URL, init?: RequestInit) => {
	// const key = {
	// 	input: input,
	// 	init: init
	// };
	// return fetchCache('');
	// declare function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
	// return localStorage.getItem(JSON.stringify(key));
// }

const post = async (url:ApiPath, data:any) => await (await fetch(`/api/${url}`, {
	method: 'POST',
	body: JSON.stringify(data)
})).json();

const weather = async (date:Date) => await post('weather', { 
	date: date 
});

