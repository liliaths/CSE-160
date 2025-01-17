var VSHADER_SOURCE = `
   attribute vec4 a_Position;
   uniform float u_Size;
   void main() {
     gl_Position = a_Position;
     gl_PointSize = 30.0;
     gl_PointSize = u_Size;
   }`

// Fragment shader program
var FSHADER_SOURCE = `
   precision mediump float;
   uniform vec4 u_FragColor;
   void main() {
     gl_FragColor = u_FragColor;
  }`

  let canvas;
  let gl;
  let a_Position;
  let u_FragColor;
  let u_Size;


function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const CAT = 3;

let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;

function addActionsForHtmlUI() {

  //Button events
  document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };

  document.getElementById('pointButton').onclick = function() { g_selectedType = POINT };
  document.getElementById('triButton').onclick = function() { g_selectedType = TRIANGLE };
  document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE };
  document.getElementById('catBrushButton').onclick = function() { g_selectedType = CAT };

  document.getElementById('drawPictureButton').onclick = function() { drawMyPicture(); };

  //Clear button
  document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); };

  //Slider events
  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

  //Size slider
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });

  //Circle segment slider
  //document.getElementById('segmentSlide').addEventListener('input', function() { let segmentValue = parseInt(this.value); g_selectedSegments = segmentValue; document.getElementById('segmentValue').innerHTML = segmentValue;});
  document.getElementById('segmentSlide').addEventListener('input', function() {
    let segmentValue = parseInt(this.value);
    g_selectedSegments = segmentValue;
    let segmentDisplay = document.getElementById('segmentValue');
    if(segmentDisplay) {
      segmentDisplay.innerHTML = segmentValue;
    }
  });

}

function main() {

  //set up canvas and gl variables
  setupWebGL();

  //set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  //Set up actions for the HTML UI elements
  addActionsForHtmlUI();
  

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //canvas.onmousemove = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}



var g_shapesList = [];

function click(ev) {

  let [x,y] = convertCoordinatesEventToGL(ev)
  
  //Create and store the new point
  let point;
  if(g_selectedType === POINT) {
    point = new Point();
  } else if (g_selectedType === TRIANGLE) {
    point = new Triangle();
  } else if (g_selectedType === CAT) {
    point = new Cat();
  } else {
    point = new Circle();
  }

  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);
  

  renderAllShapes() 
}


function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}


function renderAllShapes() {
  // Clear <canvas>
  var startTime = performance.now();

  gl.clear(gl.COLOR_BUFFER_BIT);



  //var len = g_points.length;
  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + "  ms: " + Math.floor(duration) + "  fps: " + Math.floor(10000/duration), 'numdot');
}

//Set the text of a HTML element
function sendTextToHTML(text, htmlID= 'stats') {
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}


// cat drawing & awesomeness

const DRAW_TRIANGLES = [

  //ears
  [-0.1,0.7, -0.4,0.7, -0.3,0.9, 1.0, 0.45, 0.0],
  [0.1,0.7, 0.4,0.7, 0.3,0.9, 1.0, 0.45, 0.0],
  //head
  [-0.4,0.0, -0.4,0.7, 0.0,0.0, 1.0, 0.5, 0.0],
  [0.4,0.0, 0.4,0.7, 0.0,0.0, 1.0, 0.5, 0.0],
  [-0.4,0.7, 0.4,0.7, 0.0,0.0, 1.0, 0.5, 0.0],
  [-0.5,0.0, -0.4,0.1, 0.4,0.0, 1.0, 0.5, 0.0],
  [0.5,0.0, 0.4,0.1, 0.4,0.0, 1.0, 0.5, 0.0],

  //eyes

  [-0.1,0.4, -0.2,0.4, -0.2,0.5, 0, 0, 0.0],
  [-0.1,0.4, -0.1,0.5, -0.2,0.5, 0, 0, 0.0],

  [0.1,0.4, 0.2,0.4, 0.2,0.5, 0, 0, 0.0],
  [0.1,0.4, 0.1,0.5, 0.2,0.5, 0, 0, 0.0],

  //nose
  [0.0,0.24, -0.05,0.3, 0.05,0.3, 1, 0.6, 0.7],

  //whiskers
  [0.0,0.24, -0.3,0.35, -0.32,0.33, 0, 0, 0],
  [0.0,0.24, -0.25,0.25, -0.22,0.23, 0, 0, 0],
  [0.0,0.24, -0.25,0.15, -0.26,0.13, 0, 0, 0],
  

  [0.0,0.24, 0.3,0.35, 0.32,0.33, 0, 0, 0],
  [0.0,0.24, 0.25,0.25, 0.22,0.23, 0, 0, 0],
  [0.0,0.24, 0.25,0.15, 0.26,0.13, 0, 0, 0],

  
  //body
  [0.5,0.0, -0.5,0.0, 0.0,-0.8, .9, 0.4, 0.0],
  [-0.5,-0.8, -0.5,0.0, 0.0,-0.8, .9, 0.4, 0.0],
  [0.5,-0.8, 0.5,0.0, 0.0,-0.8, .9, 0.4, 0.0],

  //paws
  [-0.25,-0.8, -0.5,0.0, -0.5,-0.8, 1.0, 0.45, 0.0],
  [0.25,-0.8, 0.5,0.0, 0.5,-0.8, 1.0, 0.45, 0.0],

  [-0.5,-0.7, -0.5,-0.9, -0.4,-0.9,  1.0, 0.45, 0.0],
  [-0.5,-0.7, -0.3,-0.7, -0.4,-0.9,  1.0, 0.45, 0.0],
  [-0.2,-0.9, -0.3,-0.7, -0.4,-0.9,  1.0, 0.45, 0.0],

  [0.5,-0.7, 0.5,-0.9, 0.4,-0.9,  1.0, 0.45, 0.0],
  [0.5,-0.7, 0.3,-0.7, 0.4,-0.9,  1.0, 0.45, 0.0],
  [0.2,-0.9, 0.3,-0.7, 0.4,-0.9,  1.0, 0.45, 0.0],
  
  //tail
  [-0.5,-0.7, -0.85,-0.3, -0.8,-0.1, 1.0, 0.45, 0.0],
  [-0.5,-0.7, -0.75,0.15, -0.8,-0.1, 1.0, 0.45, 0.0],
  [-0.85,-0.3, -0.73,0.15, -0.85,0.15, 1.0, 0.45, 0.0],
  

];

function drawMyPicture() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  DRAW_TRIANGLES.forEach(triangle => {

    let vertices = triangle.slice(0, 6);
    let color = triangle.slice(6, 9);

    gl.uniform4f(u_FragColor, color[0], color[1], color[2], 1.0);

    drawTriangle(vertices);
  });
}

function drawCat(x, y) {
  for (let i = 0; i < CAT_VERTICES.length; i += 6) {
    let vertices = [
      x + CAT_VERTICES[i], y + CAT_VERTICES[i + 1],
      x + CAT_VERTICES[i + 2], y + CAT_VERTICES[i + 3],
      x + CAT_VERTICES[i + 4], y + CAT_VERTICES[i + 5]
    ];

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.uniform4f(u_FragColor, 0.0, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}