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

/**
 * Creates the canvas context and assigns it to the 'global' variable context.
 * Call once only once per page load please.
 *
 * Also loads our images into memory.
 */
function initEverything() {
    var element = document.getElementById(canvasName);

    if (element.getContext) {
        context = element.getContext('2d');

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
    if (event.offsetX) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    } else if(event.layerX) {
        mouseX = event.layerX;
        mouseY = event.layerY;
    }
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