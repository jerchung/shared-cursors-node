function Client(id, x, y, name, text) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.name = name;
	this.text = text;
}

Client.prototype.updatePos = function(x, y) {
	this.x = x;
	this.y = y;
}

module.exports = Client;