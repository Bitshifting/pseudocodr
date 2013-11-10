function visualizerObject() {
//Name of the canvas element in our HTML markup.
var canvasName = 'mainCanvas';

//Context for the main canvas, Should be safe to draw to since we call
//initCanvas right away.
var context;

//The width and height will be determined by reading their HTML attributes.
var canvasWidth, canvasHeight, centerX, centerY;

//Local mouse positions within the canvas.
var mouseX = 0, mouseY = 0;

//Setup yet?
var inited = false;

//The root node that we'll be drawing from.
var rootN;

//X and Y offsets for dragging...
var offX = 0;
var offY = 0;

var boundingRect;

/**
 * Creates the canvas context and assigns it to the 'global' variable context.
 * Call once only once per page load please.
 *
 * Also loads our images into memory.
 */
function initEverything() {
    var element = document.getElementById(canvasName);
    boundingRect = element.getBoundingClientRect();
    if (element.getContext) {
        context = element.getContext('2d');
        
        context.font = "12px Courier New";
        
        /*var canvas = document.querySelector('canvas');
        canvas.style.width ='100%';
        canvas.style.height='100%';
        // ...then set the internal size to match
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
*/
        //Determine width and height for local use.
        canvasWidth = element.getAttribute('width');
        canvasHeight = element.getAttribute('height');

        centerX = canvasWidth / 2;
        centerY = canvasHeight / 2;

        //Load the images.
        //imgBorderNormal = new Image();
        //imgBorderNormal.src = "res/border_normal.png";
        repaint();
        inited = true;
    } else {
        alert('This browser doesn\'t support HTML5, sorry!');
    }
}

/**
 * Fills the background considering current circumstances.
 */
function paintBackground() {
    //Default. Paint the background black.
    context.fillStyle = "#010101";
    
    context.beginPath();
    context.rect(0, 0, canvasWidth, canvasHeight);
    context.closePath();
    context.fill();
}

/**
 * What we'll probably be calling every update.
 *
 */
function repaint() {
    //Clear the background first, don't want any remnants left in places we
    //forgot to repaint.
    paintBackground();

    //Draw logic here...
    if (rootN != null) {
        rootN.posX = 0;
        rootN.posY = 0;
        //Need to calculate sizes!
        //And draw from there...
        drawNodeRecurse(rootN);
    }
}

/**
 * Called by the onmousemove attribute of the canvas - keeps the local mouse
 * position up to date, and then repaints the screen to reflect any changes.
 */
function updateMousePosition(event) {
    if (!inited) {
        return;
    }

    //From stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas
    //if (event.offsetX) {
   //     mouseX = event.offsetX;
   //     mouseY = event.offsetY;
  //  } else if(event.layerX) {
        mouseX = event.layerX - boundingRect.left;
        mouseY = event.layerY - boundingRect.top;
   // }
    //End from ----------------------------------------------------------------

    repaint();

    context.fillStyle = "#696900";
    context.beginPath();
    context.rect(mouseX - 5, mouseY - 5, 10, 10);
    context.closePath();
    context.fill();
}


function mouseClicked() {

}

/**
 * Sets the root node and recursively draws its children...
 * @returns {undefined}
 */
function setRootNode(rootnode) {
    rootN = rootnode;
}

/**
 * Call when you change a node so the entire tree is recalculated starting from the
 * root node...
 * @returns {undefined}
 */
function thereWasANodeUpdate() {
     //Calculate node positions...
     calculateNodeSizesAndPositions(rootN, 1);
    //and rewdraw everything!
    repaint();
}

var CHILD_INDENT = 24;
var INTERNODE_SPACING = 24;
var FONT_SIZE = 12;
var FONT_LEADING = 3; //Pixels between lines...
var HEADER_HEIGHT = 24;
var HEADER_BORDER_SIZE = 2;
var ARROW_WIDTH = 8;

function calculateNodeSizesAndPositions(node, level) {
    /*
     * philosophy: starting from the root, we don't know how big the container
     * has to be. traverse its children until hitting a node with no children
     * and calculate back up the sizes by setting them
     */
    
    if (node.childBlockObjects.length != 0) {
        //Reset this node's height since it's getting recalculated.
        node.height = INTERNODE_SPACING;
        node.width = 0;
        
        
        //Add to our height any content we have too...
        //Unless this is an if statement, cuz we won't be displaying those...
        if (node.statementType == "if") {
            node.height += HEADER_HEIGHT;
        } else {
            node.height += node.content.length * (FONT_SIZE + FONT_LEADING) + HEADER_HEIGHT;
        }
        
        for (var i = 0; i < node.childBlockObjects.length; i++) {
            //We know that the child will have to be indented from the parent.
            node.childBlockObjects[i].posX = node.posX + CHILD_INDENT;
            
            if (i === 0) {
                //Set the first node to start at the Y of this node and down a bit...
                //Include our content height
                //node.childBlockObjects[i].posY = node.posY + INTERNODE_SPACING;
                node.childBlockObjects[i].posY = node.posY + node.height;
            }
            
            //Have the node find its height and width...
            calculateNodeSizesAndPositions(node.childBlockObjects[i], level + 1);
           
           
           if (i + 1 < node.childBlockObjects.length) {
               //Set the next child's height to start after this one...
               node.childBlockObjects[i+1].posY = node.childBlockObjects[i].posY + node.childBlockObjects[i].height + INTERNODE_SPACING;
           }
           
           //Coming up from the child, let's recalculate our own height...
           node.height += node.childBlockObjects[i].height + INTERNODE_SPACING;
           
           //Our width is the width of the best child...
           if (node.childBlockObjects[i].width > node.width) {
               node.width = node.childBlockObjects[i].width + (CHILD_INDENT * (level + 1));
           }
           
           //Or if the title's longer.
           if (node.title.length * FONT_SIZE + CHILD_INDENT / 2 > node.width) {
               node.width = node.title.length * FONT_SIZE + CHILD_INDENT / 2;
           }
        }
    } else {
        //Base case, need to tell the parent how big we are..
        //Calculate the width as the widest line in our content...
        var max = 0;
        for (var i = 0; i < node.content.length; i++) {
            if (node.content[i].length > max) {
                max = node.content[i].length;
            }
        }
        
        
        //Or if the title's longer.
        if (node.title.length > max) {
            max = node.title.length;
        }
        
        //multiply by width and height of the font...
        node.width = max * FONT_SIZE;
        
        //Height is the number of lines... and then some leading at the end.
        //Also, some for the header describing each block type.
        node.height = node.content.length * (FONT_SIZE + FONT_LEADING)  + FONT_SIZE + HEADER_HEIGHT;
    }    
    
}

function colorLookup(type) {
    if (type === "if") {
        return "#440000";
    }
    if (type === "instructions") {
        return "#777";
    }
    if (type === "file") {
        return "#333";
    }
    if (type === "function") {
        return "#733";
    }
    if (type === "loop") {
        return "#373";
    }
    if (type === "object") {
        return "#337";
    }
    return "#f00";
}


function colorLookupMute(type) {
    if (type === "if") {
        return "#220000";
    }
    if (type === "instructions") {
        return "#444";
    }
    if (type === "file") {
        return "#111";
    }
    if (type === "function") {
        return "#411";
    }
    if (type === "loop") {
        return "#141";
    }
    if (type === "object") {
        return "#114";
    }
    return "#d00";
}

function isExecutableBlock(node) {
    //Whether this block should have an arrow coming into it..
    if (node.statementType == "if" || node.statementType == "instructions" || node.statementType == "loop") {
        return true;
    }
    return false;
}

/**
 * The sizes of these nodes have already been calculated by calculateNodeSizesAndPositions(),
 * so be sure to call thereWasANodeUpdate() whenever stuff changes!
 * 
 * @param {type} node
 * @returns {undefined}
 */
function drawNodeRecurse(node, arrowToNextNode) {
    //draw each node
    context.fillStyle = colorLookup(node.statementType);

    context.beginPath();
    context.rect(offX + node.posX, offY + node.posY, node.width, node.height);
    context.closePath();
    context.fill();
    
    //Draw the header including the block title..
    context.fillStyle = colorLookupMute(node.statementType);
    context.beginPath();
    context.rect(offX + node.posX + HEADER_BORDER_SIZE, offY + node.posY + HEADER_BORDER_SIZE, node.width - HEADER_BORDER_SIZE * 2, HEADER_HEIGHT - HEADER_BORDER_SIZE * 2);
    context.closePath();
    context.fill();
    
    //Draw each line of its text... Inlcuding the title
    context.fillStyle = '#eee';
    context.fillText(node.title, offX + node.posX + HEADER_BORDER_SIZE + CHILD_INDENT / 2, offY + node.posY + HEADER_BORDER_SIZE + FONT_SIZE + FONT_LEADING);
    for (var i = 0; i < node.content.length; i++) {
        context.fillText(node.content[i], offX + node.posX + CHILD_INDENT / 4, offY + HEADER_HEIGHT + node.posY + (i + 1) * (FONT_SIZE + FONT_LEADING));
    }
    
    //Check if the next node is valid and something executable...
 if (arrowToNextNode) {
    //Draw an arrow out of this node to the next one...
    context.beginPath();
    context.rect(offX + node.posX + node.width / 2 - ARROW_WIDTH, offY + node.posY + node.height, ARROW_WIDTH / 2, INTERNODE_SPACING);
    context.closePath();
    context.fill();

//Draw LHS arrow
    context.strokeStyle = '#eee';
    context.lineWidth = ARROW_WIDTH / 2;
    context.beginPath();
    context.moveTo(offX + node.posX + node.width / 2 - ARROW_WIDTH - INTERNODE_SPACING / 2, offY + node.posY + node.height + INTERNODE_SPACING / 2);
    context.lineTo(offX + node.posX + node.width / 2 - ARROW_WIDTH, offY + node.posY + node.height + INTERNODE_SPACING - 2);
    context.stroke();

//Draw RHS arrow
    context.lineWidth = ARROW_WIDTH / 2;
    context.beginPath();
    context.moveTo(offX + node.posX + node.width / 2 - ARROW_WIDTH / 2 + INTERNODE_SPACING / 2, offY + node.posY + node.height + INTERNODE_SPACING / 2);
    context.lineTo(offX + node.posX + node.width / 2 - ARROW_WIDTH / 2, offY + node.posY + node.height + INTERNODE_SPACING - 2);
    context.stroke();
 }
    //and all of its children inside
    if (node.childBlockObjects != null) {
        for (var i = 0; i < node.childBlockObjects.length; i++) {
            if (i + 1 < node.childBlockObjects.length) {
           drawNodeRecurse(node.childBlockObjects[i], (node.statementType == "if" ? false : isExecutableBlock(node.childBlockObjects[i]) && isExecutableBlock(node.childBlockObjects[i+1])));
            } else
                {
                    //No chance of an arrow..
                    drawNodeRecurse(node.childBlockObjects[i]);
                }
        }
    }
}


var dragX, dragY;
var dragging = false;

function dragBegin() {
    dragX = mouseX;
    dragY = mouseY;
    dragging = true;
}

function dragUpdate() {
    if (dragging) {
        offX += mouseX - dragX;
        offY += mouseY - dragY;
        dragX = mouseX;
        dragY = mouseY;
    }
}

function dragEnd() {
    dragging = false;
}

//Object function prototyping.
this.mouseClicked = mouseClicked;
this.updateMousePosition = updateMousePosition;
this.repaint = repaint;
this.paintBackground = paintBackground;
this.initEverything = initEverything;
this.setRootNode = setRootNode;
this.thereWasANodeUpdate = thereWasANodeUpdate;

this.dragBegin = dragBegin;
this.dragEnd = dragEnd;
this.dragUpdate = dragUpdate;
}

var visualizer = new visualizerObject();