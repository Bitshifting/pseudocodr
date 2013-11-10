var inputText = '';

$(document).ready(function() {

	$('#submitCode').on('click', function() {
		inputText = $('#textInputArea').val();
	});

});


var symbols = (function() {
	var stmts = {
		fnStmt: "function[ ][a-zA-z]+[ ]?\n",

		ifStmt : "if[ ][a-zA-z]+[ ]?\n",

		elseifStmt: "elseif[ ][a-zA-z]+[ ]?\n",

		elseStmt : "else[ ]?\n",

		whileStmt : "while[ ][a-zA-z]+[ ]?\n", 

		endStmt : "end"
	};


});


function blockObject(title, stmtType, stmts, children, posX, posY, color) {
	this.title = title;
	this.stmtType = stmtType;
	this.stmts = stmts;
	this.children = children;
	this.color = color;

	this.posX = posX;
	this.poxY = posY;


}