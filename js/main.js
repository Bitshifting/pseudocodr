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
	objStmt : /\s*object\s+\w+\s*/,

	fnStmt : /\s*function\s+\w+/,

	ifStmt : /\s*if\s+\w+\s*/,

	elseifStmt: /\s*elseif\s+\w+\s*/,

	elseStmt : /\s*else\s*/,

	whileStmt : /\s*while\s+\w+\s*/, 

	endStmt : /\s*end\s*/,

	regStmt : /.+/,

	condition : /\s*.+/
};

function Parser(inputText) {
	var parentBlock = new blockObject('', Consts.INIT_TYPE, [], []);

	var stringStack = [];
	var blockObjStack = [];
	var instructBlock = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
	var newInstructs = false;

	for (var i = 0; i < inputText.length; i++) {
		var currLine = inputText[i];
		if(!StmtRegExps.endStmt.test(currLine)) {

			if (StmtRegExps.objStmt.test(currLine) ||
				StmtRegExps.fnStmt.test(currLine) ||
				StmtRegExps.ifStmt.test(currLine) ||
				StmtRegExps.whileStmt.test(currLine) ||
				StmtRegExps.elseifStmt.test(currLine) ||
				StmtRegExps.elseStmt.test(currLine)) {
				if (instructBlock.stmts.length !== 0) {
					blockObjStack.push(instructBlock);
					instructBlock = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
					stringStack.push(Consts.FROM_STACK);
				}
				stringStack.push(currLine);
			}
			else if (StmtRegExps.regStmt.test(currLine)) {
				instructBlock.stmts.push(currLine);
			}
			if (i === inputText.length -1) {
				blockObjStack.push(instructBlock);
			}
		}
		else if(StmtRegExps.endStmt.test(currLine.toString())) {
			console.log('found end');
			if(instructBlock.stmts.length !== 0) {
				blockObjStack.push(instructBlock);
				instructBlock = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
				stringStack.push(Consts.FROM_STACK);
			}
			var currInstructs = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
			var tmpBlockObj = new blockObject('', Consts.INIT_TYPE, [], []);
			var shouldBeIf = false;
			var hitBlock = false;
			for(var j = stringStack.length -1; j >= 0; j--) {
				var currString = stringStack.pop();
				if (currString === Consts.FROM_STACK) {
					if(currInstructs.stmts.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						currInstructs = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
					}
					tmpBlockObj.children.push(blockObjStack.pop());
				}
				else if(StmtRegExps.elseStmt.test(currString)) {
					shouldBeIf = true;
					if(currInstructs.stmts.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						currInstructs = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
					}
					tmpBlockObj.stmts.push(currString);
				}
				else if(StmtRegExps.elseifStmt.test(currString)) {
					shouldBeIf = true;
					if(currInstructs.stmts.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						currInstructs = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
					}
					tmpBlockObj.stmts.push(currString);
				}
				else if(StmtRegExps.ifStmt.test(currString)) {
					if(currInstructs.stmts.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						currInstructs = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
					}
					tmpBlockObj.stmtType = Consts.IF_TYPE;
					break;
				}
				else if(StmtRegExps.whileStmt.test(currString)) {
					if (shouldBeIf) {
						return new blockObject('', Consts.ERROR_TYPE, [], []);
					}
					if(currInstructs.stmts.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						currInstructs = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
					}
					tmpBlockObj.stmtType = Consts.WHILE_TYPE;
					break;
				}
				else if(StmtRegExps.fnStmt.test(currString)) {
					if (shouldBeIf) {
						return new blockObject('', Consts.ERROR_TYPE, [], []);
					}
					if(currInstructs.stmts.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						currInstructs = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
					}
					tmpBlockObj.stmtType = Consts.FN_TYPE;
					break;
				}
				else if(StmtRegExps.objStmt.test(currString)) {
					if (shouldBeIf) {
						return new blockObject('', Consts.ERROR_TYPE, [], []);
					}
					if(currInstructs.stmts.length !== 0) {
						tmpBlockObj.children.push(currInstructs);
						currInstructs = new blockObject('', Consts.INSTRUCT_TYPE, [], []);
					}
					tmpBlockObj.stmtType = Consts.OBJ_TYPE;
					break;
				}
				else if(StmtRegExps.regStmt.test(currString)) {
					currInstructs.stmts.unshift(currString);
				}
				console.log(blockObjStack);
				console.log(stringStack);
			}

			tmpBlockObj.stmts.reverse();
			tmpBlockObj.children.reverse();
			blockObjStack.push(tmpBlockObj);
			stringStack.push(Consts.FROM_STACK);
			//console.log(blockObjStack);
		}
	}
	//console.log(stringStack);
	//blockObjStack.reverse();
	parentBlock.children = blockObjStack;
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