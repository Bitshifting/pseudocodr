var inputText = '';

$(document).ready(function() {

	$('#submitCode').on('click', function() {
		inputText = $('#textInputArea').val();
		//console.log(inputText);
		var parentBlock = new blockObject('', Consts.INIT_TYPE, [], [], '', '','');
		var tmp = Parser(inputText.split('\n'));
		console.log(tmp);
	});

});



var StmtRegExps = {
	objStmt : new RegExp("\s*object\s+\w+\s*", "g"),

	fnStmt : new RegExp("\s*function\s+\w+", "g"),

	ifStmt : new RegExp("\s*if\s+\w+\s*", "g"),

	elseifStmt: new RegExp("\s*elseif\s+\w+\s*", "g"),

	elseStmt : new RegExp("\s*else\s*", "g"),

	whileStmt : new RegExp("\s*while\s+\w+\s*", "g"), 

	endStmt : new RegExp("\s*end\s*", "g"),

	regStmt : new RegExp(".+", "g"),

	condition : new RegExp("\s*.+", "g")
};

function Parser(inputText) {
	var parentBlock = new blockObject('', Consts.INIT_TYPE, [], []);

	var stringStack = [];
	var blockObjStack = [];
	var instructBlock = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
	var newInstructs = false;

	for (var i = 0; i < inputText.length; i++) {
		var currLine = inputText[i];
		if(!currLine.match(StmtRegExps.objStmt) || 
			!currLine.match(StmtRegExps.fnStmt) ||
			!currLine.match(StmtRegExps.ifStmt) ||
			!currLine.match(StmtRegExps.endStmt)) {

			if (currLine.match(StmtRegExps.regStmt)) {
				stringStack.push(currLine);
			}
		}
		else if (currLine.match(StmtRegExps.endStmt)) {
			console.log('found end');
			var currInstructs = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
			var tmpBlockObj = new blockObject('', Consts.INIT_TYPE, [], []);
			var shouldBeIf = false;
			var hitBlock = false;
			for(var j = stringStack.length -1; j >= 0; j--) {
				var currString = stringStack.pop();
				if (currString === Consts.FROM_STACK) {
					if(currInstructs.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						hitBlock = true;
					}
					tmpBlockObj.children.push(blockObjStack.pop());
				}
				else if(currString.match(StmtRegExps.elseStmt)) {
					shouldBeIf = true;
					if(currInstructs.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						hitBlock = true;
					}
					tmpBlockObj.stmts.push(currString);
				}
				else if(currString.match(StmtRegExps.elseifStmt)) {
					shouldBeIf = true;
					if(currInstructs.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						hitBlock = true;
					}
					tmpBlockObj.stmts.push(currString);
				}
				else if(currString.match(StmtRegExps.ifStmt)) {
					if(currInstructs.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						hitBlock = true;
					}
					tmpBlockObj.stmtType = Consts.IF_TYPE;
					break;
				}
				else if(currString.match(StmtRegExps.whileStmt)) {
					if (shouldBeIf) {
						return new blockObject('', Consts.ERROR_TYPE, [], []);
					}
					if(currInstructs.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						hitBlock = true;
					}
					tmpBlockObj.stmtType = Consts.WHILE_TYPE;
					break;
				}
				else if(currString.match(StmtRegExps.fnStmt)) {
					if (shouldBeIf) {
						return new blockObject('', Consts.ERROR_TYPE, [], []);
					}
					if(currInstructs.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						hitBlock = true;
					}
					tmpBlockObj.stmtType = Consts.FN_TYPE;
					break;
				}
				else if(currString.match(StmtRegExps.objStmt)) {
					if (shouldBeIf) {
						return new blockObject('', Consts.ERROR_TYPE, [], []);
					}
					if(currInstructs.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						hitBlock = true;
					}
					tmpBlockObj.stmtType = Consts.OBJ_TYPE;
					break;
				}
				else if(currString.match(StmtRegExps.regStmt)) {
					currInstructs.stmts.push(currString);
				}
			}

			tmpBlockObj.stmts.reverse();
			tmpBlockObj.children.reverse();
			blockObjStack.push(tmpBlockObj);
		}
		else if (i === inputText.length) {
			blockObjStack.reverse();
			parentBlock.children = blockObjStack;
		}

	}
	console.log(stringStack);
	return parentBlock;
}



function blockObject(title, stmtType, stmts, children) {
	this.title = title;
	this.stmtType = stmtType;
	this.stmts = stmts;
	this.children = children;
	this.color = 0;

	this.posX = 0;
	this.poxY = 0;
}



var Consts = {
	INIT_TYPE : 'initType',
	INSTRUCT_TYPE : 'instructionType',
	OBJ_TYPE : 'objectType',
	FN_TYPE : 'fnType',
	IF_TYPE : 'ifType',
	ELSEIF_TYPE : 'elseifType',
	ELSE_TYPE : 'elseType',
	WHILE_TYPE : 'whileType',
	ERROR_TYPE : 'errorType',
	FROM_STACK : '<----STACK---->'
}