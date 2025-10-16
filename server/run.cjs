const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000; 

const publicPath = path.join(path.dirname(__dirname), 'dist/');
const publicFePath = path.join(path.dirname(__dirname), 'fe/');

console.log('public', publicPath);
console.log('public/fe', publicFePath);
app.use(express.static(path.join(__dirname, publicPath)));
app.use((req, res, next) => {
	if(publicPath.startsWith("fe/")) {
		publicPath = publicPath.substring(3);
		let file = path.resolve(__dirname, path.resolve(__dirname, `${publicFePath}/${req.url}`));
		if(!path.extname(file)) file = path.join(file, "index.html");
		res.sendFile(file);
		return
	}
	let file = path.resolve(__dirname, path.resolve(__dirname, `${publicPath}/${req.url}`));
	if(!path.extname(file)) file = path.join(file, "index.html");
	res.sendFile(file);
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

