var VSHADER_SOURCE = `
   attribute vec4 a_Position;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   void main() {
     gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
  let u_ModelMatrix;
  let u_GlobalRotateMatrix;


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

    gl.enable(gl.DEPTH_TEST);
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

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;

let g_rightArmAnimation = false;
let g_rightFeetAnimation = false;
let g_rightFeetBottomAnimation = false;

let g_leftArmAnimation = false
let g_leftFeetAnimation = false;
let g_leftFeetBottomAnimation = false;

let g_eyeAnimation = false;

let g_leftEyeAnimation = false;

let g_earAnimation = false;

let g_allAnimations = false;

let g_shiftAnimation = false;

let g_horizontal = 0;
let g_vertical = 0;
let mouseDown = false;
let mouseX = null;
let mouseY = null;

let g_rightArmTranslation = 0;
let g_rightFeetTranslation = 0;
let g_rightFeetBottomTranslation = 0;

let g_leftArmTranslation = 0;
let g_leftFeetTranslation = 0;
let g_leftFeetBottomTranslation = 0;

let g_eyeTranslation = 0;

let g_leftEyeTranslation = 0;

let g_earTranslation = 0;

let g_shiftClickTranslation = 0;

let g_leftLegsDelay = 3;


function addActionsForHtmlUI() {

  canvas.addEventListener('mousedown', function(event) {
    mouseDown = true; 
    mouseX = event.clientX; 
    mouseY= event.clientY;
  });

  canvas.addEventListener('mousemove', function(event) {
    if(mouseDown) {
      let deltaX = event.clientX - mouseX;
      let deltaY = event.clientY - mouseY;
      g_horizontal += deltaX * .5;
      g_vertical += deltaY * .5;
      mouseX = event.clientX;
      mouseY = event.clientY;
      renderAllShapes();
    }
  });

  canvas.addEventListener('mouseup', function(event) {
    mouseDown = false;
  });

  canvas.addEventListener('mouseleave', function(event) {
    mouseDown = false;
  })
  //Button events
  document.getElementById('animationAllOnButton').onclick = function() {
    g_allAnimations = true;
    g_rightArmAnimation = true;
    g_rightFeetAnimation = true;
    g_rightFeetBottomAnimation = true;
    g_leftArmAnimation = true;
    g_leftFeetAnimation = true;
    g_leftFeetBottomAnimation = true;
    g_earAnimation = true;
    g_eyeAnimation = true;
    g_leftEyeAnimation = true;
  }

  document.getElementById('animationAllOffButton').onclick = function() {
    g_allAnimations = false;
    g_rightArmAnimation = false;
    g_rightFeetAnimation = false;
    g_rightFeetBottomAnimation = false;
    g_leftArmAnimation = false;
    g_leftFeetAnimation = false;
    g_leftFeetBottomAnimation = false;
    g_earAnimation = false;
    g_eyeAnimation = false;
    g_leftEyeAnimation = false;
  }

  /*
  document.getElementById('animationYellowOffButton').onclick = function() { g_yellowAnimation = false; };
  document.getElementById('animationYellowOnButton').onclick = function() { g_yellowAnimation = true; };

  document.getElementById('animationMagentaOffButton').onclick = function() { g_magentaAnimation = false; };
  document.getElementById('animationMagentaOnButton').onclick = function() { g_magentaAnimation = true; };
  */

  document.getElementById('animationRightArmOffButton').onclick = function() { g_rightArmAnimation = false; };
  document.getElementById('animationRightArmOnButton').onclick = function() { g_rightArmAnimation = true; };
  document.getElementById('animationRightFeetOffButton').onclick = function() { g_rightFeetAnimation = false; };
  document.getElementById('animationRightFeetOnButton').onclick = function() { g_rightFeetAnimation = true; };
  document.getElementById('animationRightFeetBottomOffButton').onclick = function() { g_rightFeetBottomAnimation = false; };
  document.getElementById('animationRightFeetBottomOnButton').onclick = function() { g_rightFeetBottomAnimation = true; };

  document.getElementById('animationLeftArmOffButton').onclick = function() { g_leftArmAnimation = false; };
  document.getElementById('animationLeftArmOnButton').onclick = function() { g_leftArmAnimation = true; };
  document.getElementById('animationLeftFeetOffButton').onclick = function() { g_leftFeetAnimation = false; };
  document.getElementById('animationLeftFeetOnButton').onclick = function() { g_leftFeetAnimation = true; };
  document.getElementById('animationLeftFeetBottomOffButton').onclick = function() { g_leftFeetBottomAnimation = false; };
  document.getElementById('animationLeftFeetBottomOnButton').onclick = function() { g_leftFeetBottomAnimation = true; };

  document.getElementById('animationEarsOffButton').onclick = function() { g_earAnimation = false; };
  document.getElementById('animationEarsOnButton').onclick = function() { g_earAnimation = true; };

  document.getElementById('animationEyesOffButton').onclick = function() { g_eyeAnimation = false; };
  document.getElementById('animationEyesOnButton').onclick = function() { g_eyeAnimation = true; };

  document.getElementById('animationEyes2OffButton').onclick = function() { g_leftEyeAnimation = false; };
  document.getElementById('animationEyes2OnButton').onclick = function() { g_leftEyeAnimation = true; };

  /*
  //Color slider
  document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes(); });
  document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes(); });
  */
  //Camera angle slider
  document.getElementById('angleSlide').addEventListener('input', function() { g_globalAngle = this.value; renderAllShapes(); });
  
  //Right arm slider
  document.getElementById('rightArmTranslateSlide').addEventListener('input', function() { g_rightArmTranslation = parseFloat(this.value); renderAllShapes(); });
  document.getElementById('rightFeetTranslateSlide').addEventListener('input', function() { g_rightFeetTranslation = parseFloat(this.value); renderAllShapes(); });
  document.getElementById('rightFeetBottomTranslateSlide').addEventListener('input', function() { g_rightFeetBottomTranslation = parseFloat(this.value); renderAllShapes(); });

  document.getElementById('leftArmTranslateSlide').addEventListener('input', function() { g_leftArmTranslation = parseFloat(this.value); renderAllShapes(); });
  document.getElementById('leftFeetTranslateSlide').addEventListener('input', function() { g_leftFeetTranslation = parseFloat(this.value); renderAllShapes(); });
  document.getElementById('leftFeetBottomTranslateSlide').addEventListener('input', function() { g_leftFeetBottomTranslation = parseFloat(this.value); renderAllShapes(); });

  document.getElementById('EarsTranslateSlide').addEventListener('input', function() { g_earTranslation = parseFloat(this.value); renderAllShapes(); });

  document.getElementById('EyesTranslateSlide').addEventListener('input', function() { g_eyeTranslation = parseFloat(this.value); renderAllShapes(); });

  document.getElementById('Eyes2TranslateSlide').addEventListener('input', function() { g_leftEyeTranslation = parseFloat(this.value); renderAllShapes(); });
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

  document.addEventListener('keydown', function(ev) {
    if (ev.key === 'Shift') {
      g_shiftAnimation = !g_shiftAnimation; // Toggle animation state
    }
  });

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

var g_shapesList = [];

function click(ev) {
  


  let [x,y] = convertCoordinatesEventToGL(ev)
  
  let point;
  if(g_selectedType === POINT) {
    point = new Point();
  } else if (g_selectedType === TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  }

  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  renderAllShapes() 
}

var g_startTime = performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

function tick() {
  
  g_seconds = performance.now()/1000.0-g_startTime;

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
}

function updateAnimationAngles() {

  /*
  if(g_yellowAnimation) {
    g_yellowAngle = (45*Math.sin(g_seconds));
  }

  if(g_magentaAnimation) {
    g_magentaAngle = (45*Math.sin(3*g_seconds));
  }
  */

  if(g_rightArmAnimation) {
    g_rightArmTranslation = 0.1 * Math.sin(3*g_seconds);
  }
  
  if(g_rightFeetAnimation) {
    g_rightFeetTranslation = 15 * Math.sin(3*g_seconds);
  }

  if(g_rightFeetBottomAnimation) {
    g_rightFeetBottomTranslation = 10 * Math.sin(3*g_seconds);
  }

  if(g_leftArmAnimation) {
    g_leftArmTranslation = 0.1 * Math.sin(3*g_seconds - g_leftLegsDelay);
  }
  
  if(g_leftFeetAnimation) {
    g_leftFeetTranslation = 15 * Math.sin(3*g_seconds - g_leftLegsDelay);
  }

  if(g_leftFeetBottomAnimation) {
    g_leftFeetBottomTranslation = 10 * Math.sin(3*g_seconds - g_leftLegsDelay);
  }

  if(g_earAnimation) {
    g_earTranslation = 15 * Math.sin(20*g_seconds);
  }

  if(g_eyeAnimation) {
    g_eyeTranslation = -0.05 * Math.abs(Math.sin(.5 * g_seconds));
  }

  if(g_leftEyeAnimation) {

      g_leftEyeTranslation = -0.05 * Math.abs(Math.sin(.5 * (g_seconds)));

  }

  if(g_shiftAnimation) {
    g_shiftClickTranslation = .03 * Math.sin(5*g_seconds);
  }
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; 
  var y = ev.clientY; 
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderAllShapes() {
  var startTime = performance.now();

  var globalRotMat= new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.rotate(g_horizontal, 0, 1,0);
  globalRotMat.rotate(g_vertical, 1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let cone4 = new Cone();
  cone4.color = [.42,0.42,0.42,1.0];
  cone4.matrix.setTranslate(0, 0, 0);
  cone4.matrix.translate(0, 0.1, 0.55);
  cone4.matrix.rotate(90, 1, 0, 0); 
  cone4.matrix.scale(.23, .23, .23);
  cone4.render();

  let cone = new Cone();
  cone.color = [.42,0.42,0.42,1.0];
  cone.matrix.setTranslate(0, 0, 0);
  cone.matrix.translate(0, 0.05, 0.55);
  cone.matrix.rotate(90, 1, 0, 0); 
  cone.matrix.scale(.27, .27, .27);
  cone.render();

  let cone5 = new Cone();
  cone5.color = [.42,0.42,0.42,1.0];
  cone5.matrix.setTranslate(0, 0, 0);
  cone5.matrix.translate(0, 0, 0.53);
  cone5.matrix.rotate(90, 1, 0, 0); 
  cone5.matrix.scale(.23, .23, .23);
  cone5.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.matrix.translate(-.15, -.25, 0.42);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.3, .3, .3);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.matrix.translate(-.25, -.1, 0.55);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.2, .4, .1);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.matrix.translate(-.15, -.15, 0.6);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.2, .2, .2);
  body.render();

  //Draw face cube
  var face = new Cube();
  face.color = [.49,0.49,0.5,1.0];
  face.matrix.translate(-.25, -.30, -0.5);
  face.matrix.rotate(-5,1,0,0);
  face.matrix.scale(.5, .5, .5);
  face.render();

  var face2 = new Cube();
  face2.color = [.47,0.47,0.47,1.0];
  face2.matrix.translate(-.30, -.30, -0.4);
  face2.matrix.rotate(-5,1,0,0);
  face2.matrix.scale(.6, .55, .4);
  face2.render();

  //Draw ears
  var leftEar = new Cube();
  leftEar.color = [.45,0.45,0.45,1.0];
  leftEar.matrix.translate(-.2, .05, -0.52);
  leftEar.matrix.rotate(-5,1,0,0);
  leftEar.matrix.rotate(g_earTranslation, 0, 0, 1); 
  var leftEarCoordinatesMat = new Matrix4(leftEar.matrix);
  leftEar.matrix.scale(.15, .07, .1);
  leftEar.matrix.rotate(-90, 0, 1, 0);
  leftEar.render();

  var leftEarPink = new Cube();
  leftEarPink.color = [.65,0.5,0.5,1.0];
  leftEarPink.matrix = leftEarCoordinatesMat;
  leftEarPink.matrix.translate(-.15, 0.0, 0.0);
  leftEarPink.matrix.scale(.1, -.01, .1);
  leftEarPink.render();

  var rightEar = new Cube();
  rightEar.color = [.45,0.45,0.45,1.0];
  rightEar.matrix.translate(.2, .05, -0.52);
  rightEar.matrix.rotate(-5,1,0,0);
  rightEar.matrix.rotate(-g_earTranslation, 0, 0, 1); 
  var rightEarCoordinatesMat = new Matrix4(rightEar.matrix);
  rightEar.matrix.scale(.15, .07, .1);
  rightEar.render();

  var rightEarPink = new Cube();
  rightEarPink.color = [.65,0.5,0.5,1.0];
  rightEarPink.matrix = rightEarCoordinatesMat;
  rightEarPink.matrix.translate(.05, .0, 0);
  rightEarPink.matrix.scale(.1, -.01, .1);
  rightEarPink.render();
  
  //Draw eye
  var rightEye = new Cube();
  rightEye.color = [0,0,0,0];
  rightEye.matrix.translate(.12, .05, -0.55);
  rightEye.matrix.rotate(-5,1,0,0);
  rightEye.matrix.scale(.1, .1, .05);
  rightEye.render();

  var leftEye = new Cube();
  leftEye.color = [0,0,0,0];
  leftEye.matrix.translate(-.22, .05, -0.55);
  leftEye.matrix.rotate(-5,1,0,0);
  leftEye.matrix.scale(.1, .1, .05);
  leftEye.render();
  
  //Draw pupil
  var rightPupil = new Cube();
  rightPupil.color = [0,0,0,1];
  rightPupil.matrix.translate(.17, .05, -0.56);
  rightPupil.matrix.rotate(-5,1,0,0);
  rightPupil.matrix.translate(g_eyeTranslation, 0, 0); // Apply the eye translation
  var rightPupilCoordinatesMat = new Matrix4(rightPupil.matrix);
  rightPupil.matrix.scale(.05, .05, .01);
  rightPupil.render();



  var leftPupil = new Cube();
  leftPupil.color = [0,0,0,1];
  leftPupil.matrix.translate(-.17, .05, -0.56);
  leftPupil.matrix.rotate(-5,1,0,0);
  leftPupil.matrix.translate(g_leftEyeTranslation, 0, 0); // Apply the eye translation
  var leftPupilCoordinatesMat = new Matrix4(leftPupil.matrix);
  leftPupil.matrix.scale(.05, .05, .01);
  leftPupil.render();
  
  //Draw Nose
  //Draw Body

  //Draw mouth
  var topMouth = new Cube();
  topMouth.color = [.47,0.47,0.47,1.0];
  topMouth.matrix.translate(-.2, -.15, -.65);
  topMouth.matrix.rotate(-5,1,0,0);
  topMouth.matrix.scale(.4, .15, .2);
  topMouth.render();

  var body = new Cube();
  body.color = [0.4,0.4,0.4,1.0];
  body.matrix.translate(-.1, -.03, -.67);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.04, .02, .01);
  body.render();

  var body = new Cube();
  body.color = [0.4,0.4,0.4,1.0];
  body.matrix.translate(.07, -.03, -.67);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.04, .02, .01);
  body.render();

  var bottomMouth = new Cube();
  bottomMouth.color = [.65,0.5,0.5,1.0];
  bottomMouth.matrix.translate(-.15, -.24, -.6);
  bottomMouth.matrix.rotate(-5,1,0,0);
  bottomMouth.matrix.translate(0, g_shiftClickTranslation, 0); 
  var bottomMouthCoordinatesMat = new Matrix4(bottomMouth.matrix);
  bottomMouth.matrix.scale(.3, .10, .1);
  bottomMouth.render();

  //Draw body
  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.matrix.translate(-.30, -.3, -0.3);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.6, .6, .3);
  body.render();

  var body2 = new Cube();
  body2.color = [.47,0.47,0.47,1.0];
  body2.matrix.translate(-.30, -.32, -0.25);
  body2.matrix.rotate(-5,1,0,0);
  body2.matrix.scale(.6, .65, .3);
  body2.render();

  var bigBody = new Cube();
  bigBody.color = [.47,0.47,0.47,1.0];
  bigBody.matrix.translate(-.30, -.301, -0.05);
  bigBody.matrix.rotate(-5,1,0,0);
  bigBody.matrix.scale(.6, .65, .5);
  bigBody.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.matrix.translate(-.27, -.25, .25);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.55, .6, .3);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.matrix.translate(-.27, -.15, .3);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.55, .45, .3);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.matrix.translate(-.32, -.25, -.2);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.5, .5, .6);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.matrix.translate(-.19, -.25, -.2);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.5, .5, .6);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.matrix.translate(-.06, -.2, -.2);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.4, .4, .6);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.matrix.translate(-.35, -.2, -.2);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.4, .4, .6);
  body.render();

  var body = new Cube();
  body.color = [.65,0.5,0.5,1.0];
  body.matrix.translate(-.3, -.32, -.2);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.58, .01, .6);
  body.render();

  //Draw right arm
  var rightArm1 = new Cube();
  rightArm1.color = [.47,0.47,0.47,1.0];
  rightArm1.matrix.translate(-.30, -.5, -0.18);
  rightArm1.matrix.rotate(-5,1,0,0);
  rightArm1.matrix.translate(0, 0, g_rightArmTranslation);
  var rightArmCoordinatesMat = new Matrix4(rightArm1.matrix);
  rightArm1.matrix.scale(.2, .33, .2);
  rightArm1.render();
  
  // Draw right feet connected to right arm
  var rightFeet = new Cube();
  rightFeet.color = [.47,0.47,0.47,1.0];
  rightFeet.matrix = rightArmCoordinatesMat;
  rightFeet.matrix.translate(0, 0.025, 0.05);
  rightFeet.matrix.rotate(-180, 1, 0, 0);
  rightFeet.matrix.rotate(g_rightFeetTranslation, 1, 0, 0);
  rightFeet.matrix.scale(.2, .03, .1);
  var rightFeetCoordinatesMat = new Matrix4(rightFeet.matrix);
  rightFeet.render();

  var rightClaw1 = new Cube();
  rightClaw1.color = [.0,0.0,0.0,.0];
  rightClaw1.matrix = rightFeetCoordinatesMat;
  rightClaw1.matrix.translate(0, 0.0, 1);
  rightClaw1.matrix.rotate(g_rightFeetBottomTranslation, 1, 0, 0); 
  rightClaw1.matrix.scale(.1, .3, .25); 
  rightClaw1.render();

  var rightClaw2 = new Cube();
  rightClaw2.color = [.0,0.0,0.0,0.0];
  rightClaw2.matrix = rightFeetCoordinatesMat;
  rightClaw2.matrix.translate(2.9, 0.0, 0); 
  rightClaw2.matrix.rotate(g_rightFeetBottomTranslation, 1, 0, 0); 
  rightClaw2.render();

  var rightClaw2 = new Cube();
  rightClaw2.color = [.0,0.0,0.0,0.0];
  rightClaw2.matrix = rightFeetCoordinatesMat;
  rightClaw2.matrix.translate(2.9, 0.0, 0); 
  rightClaw2.matrix.rotate(g_rightFeetBottomTranslation, 1, 0, 0); 
  rightClaw2.render();

  var rightClaw2 = new Cube();
  rightClaw2.color = [.0,0.0,0.0,0.0];
  rightClaw2.matrix = rightFeetCoordinatesMat;
  rightClaw2.matrix.translate(2.9, 0.0, 0); 
  rightClaw2.matrix.rotate(g_rightFeetBottomTranslation, 1, 0, 0); 
  rightClaw2.render();

///////////////////////////////////////////////////////////////////////////////
//Draw right back leg
var rightBackLeg = new Cube();
rightBackLeg.color = [.47,0.47,0.47,1.0];
rightBackLeg.matrix.translate(-.30, -.47, 0.35);
rightBackLeg.matrix.rotate(-5,1,0,0);
rightBackLeg.matrix.translate(0, 0, g_rightArmTranslation);
var rightArmCoordinatesMat = new Matrix4(rightBackLeg.matrix);
rightBackLeg.matrix.scale(.2, .33, .2);
rightBackLeg.render();

// Draw right feet connected to right arm
var rightFeet = new Cube();
rightFeet.color = [.47,0.47,0.47,1.0];
rightFeet.matrix = rightArmCoordinatesMat;
rightFeet.matrix.translate(0, 0.025, 0.05);
rightFeet.matrix.rotate(-180, 1, 0, 0);
rightFeet.matrix.rotate(g_rightFeetTranslation, 1, 0, 0);
rightFeet.matrix.scale(.2, .03, .1);
var rightFeetCoordinatesMat = new Matrix4(rightFeet.matrix);
rightFeet.render();

var rightClaw1 = new Cube();
rightClaw1.color = [.0,0.0,0.0,.0];
rightClaw1.matrix = rightFeetCoordinatesMat;
rightClaw1.matrix.translate(0, 0.0, 1);
rightClaw1.matrix.rotate(g_rightFeetBottomTranslation, 1, 0, 0); 
rightClaw1.matrix.scale(.1, .3, .25); 
rightClaw1.render();

var rightClaw2 = new Cube();
rightClaw2.color = [.0,0.0,0.0,0.0];
rightClaw2.matrix = rightFeetCoordinatesMat;
rightClaw2.matrix.translate(2.9, 0.0, 0); 
rightClaw2.matrix.rotate(g_rightFeetBottomTranslation, 1, 0, 0); 
rightClaw2.render();

var rightClaw2 = new Cube();
rightClaw2.color = [.0,0.0,0.0,0.0];
rightClaw2.matrix = rightFeetCoordinatesMat;
rightClaw2.matrix.translate(2.9, 0.0, 0); 
rightClaw2.matrix.rotate(g_rightFeetBottomTranslation, 1, 0, 0); 
rightClaw2.render();

var rightClaw2 = new Cube();
rightClaw2.color = [.0,0.0,0.0,0.0];
rightClaw2.matrix = rightFeetCoordinatesMat;
rightClaw2.matrix.translate(2.9, 0.0, 0); 
rightClaw2.matrix.rotate(g_rightFeetBottomTranslation, 1, 0, 0); 
rightClaw2.render();

///////////////////////////////////////////////////////////////////////////////
//Draw left back arm
///////////////////////////////////////////////////////////////////////////////

var leftBackLeg = new Cube();
leftBackLeg.color = [.47,0.47,0.47,1.0];
leftBackLeg.matrix.translate(.1, -.47, 0.35);
leftBackLeg.matrix.rotate(-5,1,0,0);
leftBackLeg.matrix.translate(0, 0, g_leftArmTranslation);
var leftArmCoordinatesMat = new Matrix4(leftBackLeg.matrix);
leftBackLeg.matrix.scale(.2, .33, .2);
leftBackLeg.render();

var leftFeet = new Cube();
leftFeet.color = [.47,0.47,0.47,1.0];
leftFeet.matrix = leftArmCoordinatesMat;
leftFeet.matrix.translate(0, 0.025, 0.05);
leftFeet.matrix.rotate(-180, 1, 0, 0);
leftFeet.matrix.rotate(g_leftFeetTranslation, 1, 0, 0);
leftFeet.matrix.scale(.2, .03, .1);
var leftFeetCoordinatesMat = new Matrix4(leftFeet.matrix);
leftFeet.render();

var leftClaw1 = new Cube();
leftClaw1.color = [.0,0.0,0.0,.0];
leftClaw1.matrix = leftFeetCoordinatesMat;
leftClaw1.matrix.translate(0, 0.0, 1);
leftClaw1.matrix.rotate(g_leftFeetBottomTranslation, 1, 0, 0); 
leftClaw1.matrix.scale(.1, .3, .25); 
leftClaw1.render();

var leftClaw2 = new Cube();
leftClaw2.color = [.0,0.0,0.0,0.0];
leftClaw2.matrix = leftFeetCoordinatesMat;
leftClaw2.matrix.translate(2.9, 0.0, 0); 
leftClaw2.matrix.rotate(g_leftFeetBottomTranslation, 1, 0, 0); 
leftClaw2.render();

var leftClaw3 = new Cube();
leftClaw3.color = [.0,0.0,0.0,0.0];
leftClaw3.matrix = leftFeetCoordinatesMat;
leftClaw3.matrix.translate(2.9, 0.0, 0); 
leftClaw3.matrix.rotate(g_leftFeetBottomTranslation, 1, 0, 0); 
leftClaw3.render();

var leftClaw4 = new Cube();
leftClaw4.color = [.0,0.0,0.0,0.0];
leftClaw4.matrix = leftFeetCoordinatesMat;
leftClaw4.matrix.translate(2.9, 0.0, 0); 
leftClaw4.matrix.rotate(g_leftFeetBottomTranslation, 1, 0, 0); 
leftClaw4.render();

///////////////////////////////////////////////////////////////////////////////
//Draw left arm
///////////////////////////////////////////////////////////////////////////////

var leftFrontLeg = new Cube();
leftFrontLeg.color = [.47,0.47,0.47,1.0];
leftFrontLeg.matrix.translate(.1, -.5, -0.18);
leftFrontLeg.matrix.rotate(-5,1,0,0);
leftFrontLeg.matrix.translate(0, 0, g_leftArmTranslation);
var leftArmCoordinatesMat = new Matrix4(leftFrontLeg.matrix);
leftFrontLeg.matrix.scale(.2, .33, .2);
leftFrontLeg.render();

// Draw right feet connected to right arm
var leftFeet = new Cube();
leftFeet.color = [.47,0.47,0.47,1.0];
leftFeet.matrix = leftArmCoordinatesMat;
leftFeet.matrix.translate(0, 0.025, 0.05);
leftFeet.matrix.rotate(-180, 1, 0, 0);
leftFeet.matrix.rotate(g_leftFeetTranslation, 1, 0, 0);
leftFeet.matrix.scale(.2, .03, .1);
var leftFeetCoordinatesMat = new Matrix4(leftFeet.matrix);
leftFeet.render();

var leftClaw1 = new Cube();
leftClaw1.color = [.0,0.0,0.0,.0];
leftClaw1.matrix = leftFeetCoordinatesMat;
leftClaw1.matrix.translate(0, 0.0, 1);
leftClaw1.matrix.rotate(g_leftFeetBottomTranslation, 1, 0, 0); 
leftClaw1.matrix.scale(.1, .3, .25); 
leftClaw1.render();

var leftClaw2 = new Cube();
leftClaw2.color = [.0,0.0,0.0,0.0];
leftClaw2.matrix = leftFeetCoordinatesMat;
leftClaw2.matrix.translate(2.9, 0.0, 0); 
leftClaw2.matrix.rotate(g_leftFeetBottomTranslation, 1, 0, 0); 
leftClaw2.render();

var leftClaw3 = new Cube();
leftClaw3.color = [.0,0.0,0.0,0.0];
leftClaw3.matrix = leftFeetCoordinatesMat;
leftClaw3.matrix.translate(2.9, 0.0, 0); 
leftClaw3.matrix.rotate(g_leftFeetBottomTranslation, 1, 0, 0); 
leftClaw3.render();

var leftClaw4 = new Cube();
leftClaw4.color = [.0,0.0,0.0,0.0];
leftClaw4.matrix = leftFeetCoordinatesMat;
leftClaw4.matrix.translate(2.9, 0.0, 0); 
leftClaw4.matrix.rotate(g_leftFeetBottomTranslation, 1, 0, 0); 
leftClaw4.render();



  //Draw left arm
  
  
  /*
  var leftArm = new Cube();
  leftArm.color = [1,1,0,1];
  leftArm.matrix.setTranslate(0,-.5, 0.0);
  leftArm.matrix.rotate(-5,1,0,0);
  leftArm.matrix.rotate(-g_yellowAngle,0,0,1);
  var yellowCoordinatesMat= new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(.25, .7, .5);
  leftArm.matrix.translate(-.5,0,0);
  leftArm.render();

  //Test box
  var box = new Cube();
  box.color = [1,0,1,1];
  box.matrix = yellowCoordinatesMat;
  box.matrix.translate(0,.65,0);
  box.matrix.rotate(g_magentaAngle,0,0,1);
  box.matrix.scale(.3,.3,.3);
  box.matrix.translate(-.5,0,-.001);
  box.render();
  
  /*
  var K =300.0;
  for(var i =1; i<K; i++) {
    var c = new Cube();
    c.matrix.translate(-.8,1.9*i/K-1.0,0);
    c.matrix.rotate(g_seconds*100,1,1,1);
    c.matrix.scale(-1,0.5/K, 1.0/K);
    c.render();
  }
*/

  var duration = performance.now() - startTime;
  sendTextToHTML("  ms: " + Math.floor(duration) + "  fps: " + Math.floor(10000/duration), 'numdot');
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
