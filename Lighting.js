var VSHADER_SOURCE = `
   precision mediump float;
   attribute vec4 a_Position;
   attribute vec2 a_UV;
   attribute vec3 a_Normal;
   varying vec2 v_UV;
   varying vec3 v_Normal;
   varying vec4 v_VertPos;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_NormalMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform mat4 u_ViewMatrix;
   uniform mat4 u_ProjectionMatrix;
   void main() {
     gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
     v_UV = a_UV;
     v_Normal = a_Normal;
     v_VertPos = u_ModelMatrix * a_Position;
   }`

// Fragment shader program
var FSHADER_SOURCE = `
   precision mediump float;
   varying vec2 v_UV;
   varying vec3 v_Normal;
   uniform vec4 u_FragColor;
   uniform sampler2D u_Sampler0;
   uniform sampler2D u_Sampler3;
   uniform sampler2D u_Sampler4;
   uniform int u_whichTexture;
   uniform vec3 u_lightPos;
   uniform vec3 u_cameraPos;
   varying vec4 v_VertPos;
   uniform bool u_lightOn;
   uniform vec3 u_spotLightPos;
   uniform float u_spotLightCutOff;
   uniform bool u_spotLightOn;
   void main() {
     
     if(u_whichTexture == -3) {
        gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
     
     } else if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor;
        
     } else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0);

     } else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV);

     } else if (u_whichTexture == 3) {
        gl_FragColor = texture2D(u_Sampler3, v_UV);

     } else if (u_whichTexture == 4) {
        gl_FragColor = texture2D(u_Sampler4, v_UV);

     } else {
        gl_FragColor = vec4(1, .2, .2, 1); 
     }


    if (u_lightOn) {
        vec3 lightVector = u_lightPos - vec3(v_VertPos);
        float r = length(lightVector);
        vec3 L = normalize(lightVector);
        vec3 N = normalize(v_Normal);
        float nDotL = max(dot(N, L), 0.0);

        
        vec3 R = reflect(-L, N);
        vec3 E = normalize(u_cameraPos-vec3(v_VertPos));  
        float specular = pow(max(dot(E,R), 0.0),32.0) * 0.5;
        vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.5;
        vec3 ambient = vec3(gl_FragColor) * 0.3;

        if(u_spotLightOn) {
          float spotLightEffect = dot(normalize(u_spotLightPos), -L);
          float spotLightCutOff = cos(radians(u_spotLightCutOff));  

          if(spotLightEffect > spotLightCutOff) {
            float intensity = (spotLightEffect - spotLightCutOff) / (1.0 - spotLightCutOff);
            gl_FragColor = vec4(specular+diffuse*intensity+ambient, 1.0);
          } else {
            gl_FragColor = vec4(ambient, 1.0); 
          }
     
        } else {
          gl_FragColor = vec4(specular + diffuse + ambient, 1.0); 
        } 
    } else {
        gl_FragColor = gl_FragColor;
    }


  }`

  let canvas;
  let gl;
  let a_Position;
  let a_UV;
  let a_Normal;
  let u_FragColor;
  let u_Size;
  let u_ModelMatrix;
  let u_ProjectionMatrix;
  let u_ViewMatrix;
  let u_GlobalRotateMatrix;
  let u_whichTexture;
  let u_cameraPos;
  let u_lightPos;
  let u_lightOn;
  let u_NormalMatrix;
  let u_SpotLightPos;
  let u_SpotLightCutOff;


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

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix'); 
  if(!u_ProjectionMatrix) {
    console.log('Failed to get u_ProjectionMatrix');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture'); 
  if(!u_whichTexture) {
    console.log('Failed to get u_whichTexture');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }


  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }

  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return false;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  u_spotLightPos = gl.getUniformLocation(gl.program, 'u_spotLightPos');
  if (!u_spotLightPos) {
    console.log('Failed to get the storage location of u_spotLightPos');
    return;
  }

  u_spotLightCutOff = gl.getUniformLocation(gl.program, 'u_spotLightCutOff');
  if (!u_spotLightCutOff) {
    console.log('Failed to get the storage location of u_spotLightCutOff');
    return;
  }

  u_spotLightOn = gl.getUniformLocation(gl.program, 'u_spotLightOn');
  if (!u_spotLightOn) {
    console.log('Failed to get the storage location of u_spotLightOn');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  let projMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMatrix.elements);

  let viewMatrix = new Matrix4(); 
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  }

let g_normalOn = false;
let g_lightPos = [0, 1, -2];
let g_globalAngle = 0;
let g_lightOn = true;
let g_spotLightOn = false;

let g_horizontal = 0;
let g_vertical = 0;
let mouseDown = false;
let mouseX, mouseY;

let g_camera;

let g_leftMouseDown = false;
let g_rightMouseDown = false;

let g_cameraControlActive = false;
const minAngle = -60;
const maxAngle = 0;

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
  let isDragging = false;


  canvas.addEventListener('mousedown', function(event) {
    isDragging = true;
    g_cameraControlActive = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  canvas.addEventListener('mouseup', function() {
    isDragging = false;
    g_cameraControlActive = false;
  });

  canvas.addEventListener('mousemove', function(event) {
    if (isDragging && g_cameraControlActive) {
      let deltaX = event.clientX - mouseX;
      let deltaY = event.clientY - mouseY;
      
      g_horizontal += deltaX * 0.5;
      let newVertical = g_vertical + (deltaY * 0.5);
      g_vertical = Math.max(minAngle, Math.min(maxAngle, newVertical));
      
      mouseX = event.clientX;
      mouseY = event.clientY;
      renderAllShapes();
    }
  });

  document.addEventListener('keydown', function(event) {
    if(event.key === 'Escape') {
      isDragging = false;
      g_cameraControlActive = false;
    }
  });

  document.getElementById('normalOn').onclick = function() {g_normalOn = true;};
  document.getElementById('normalOff').onclick = function() {g_normalOn = false;};

  //light
  document.getElementById('lightSlideX').addEventListener('mousemove', function(event) {if(event.buttons == 1) { g_lightPos[0] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(event) {if(event.buttons == 1) { g_lightPos[1] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(event) {if(event.buttons == 1) { g_lightPos[2] = this.value/100; renderAllShapes();}});
  
  //light buttons
  document.getElementById('lightOn').onclick = function() { g_lightOn = true; renderAllShapes(); };
  document.getElementById('lightOff').onclick = function() { g_lightOn = false; renderAllShapes(); };

  //spotlight buttons
  document.getElementById('spotLightOn').onclick = function() { g_spotLightOn = true; renderAllShapes(); };
  document.getElementById('spotLightOff').onclick = function() { g_spotLightOn = false; renderAllShapes(); };

  //animations
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



function initTextures() {
  
  var image = new Image(); 
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image.onload = function(){ SendImageToTEXTURE0(image); };

  image.src = 'aotSky.jpg';

  var image4 = new Image(); 
  if (!image4) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image4.onload = function(){ SendImageToTEXTURE0(image4); };

  image4.src = 'trees.jpg';

  var image5 = new Image(); 
  if (!image5) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image5.onload = function(){ SendImageToTEXTURE0(image5); };

  image5.src = 'smoothStone.jpg';


  return true;
}

function SendImageToTEXTURE0(image) {

  var texture = gl.createTexture();   
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); 
  if(image.src.includes('aotSky')) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler0, 0);
  } else if(image.src.includes('trees')) {
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler3, 3);
  } else if(image.src.includes('smoothStone')) {
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler4, 4);
  }

  console.log('finished loading texture: ' + image.src);
}

function main() {

  //set up canvas and gl variables
  setupWebGL();

  //set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  g_camera = new Camera();

  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);

  //Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  document.onkeydown = keydown;

  initTextures();

  g_cameraControlActive = false;
  mouseX = canvas.width/2;
  mouseY = canvas.height/2;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
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

  g_lightPos[0] = 2 * Math.cos(3 * g_seconds);
  
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

function keydown(ev) {  
  const speed = 0.2;
  const rotateSpeed = 2;

  switch(ev.key) {
    case 'w':
    case 'W':
      g_camera.moveForward(speed);
      break;
    case 's':
    case 'S':
      g_camera.moveBackward(speed);
      break;
    case 'a':
    case 'A':
      g_camera.moveLeft(speed);
      break;
    case 'd':
    case 'D':
      g_camera.moveRight(speed);
      break;
    case 'q':
    case 'Q':
      g_camera.panLeft(rotateSpeed);
      break;
    case 'e':
    case 'E':
      g_camera.panRight(rotateSpeed);
      break;
    case ' ':
      g_camera.panUp(rotateSpeed);
      break;
    case 'Shift':
      g_camera.panDown(rotateSpeed);
      break;
  }
  
  renderAllShapes();

}




function initCamera() {
  g_camera = new Camera();
  g_camera.map = g_map;
}


function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; 
  var y = ev.clientY; 
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

var g_eye = [0,0,3];
var g_at = [0,0,-100];
var g_up = [0,1,0];



function renderAllShapes() {

  var startTime = performance.now();

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);

  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);

  var globalRotMat= new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.rotate(g_horizontal, 0, 1,0);
  globalRotMat.rotate(g_vertical, 1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  gl.uniform3f(u_cameraPos, g_camera.eye.x, g_camera.eye.y, g_camera.eye.z);

  gl.uniform1i(u_lightOn, g_lightOn);

  gl.uniform1i(u_spotLightOn, g_spotLightOn);

  gl.uniform3f(u_spotLightPos, 0.0, -1.0, 0.0);
  gl.uniform1f(u_spotLightCutOff, 30.0);




  var light = new Cube();
  light.color = [2, 2, 0, 1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1, -.1, -.1);
  light.matrix.translate(-.5,-.5,-.5);
  light.render();

  var grass = new Cube();
  grass.color = [1.0, 1.0, 1.0, 1.0];
  grass.textureNum = 3;
  grass.matrix.translate(0, -1, 0);
  grass.matrix.scale(10, 0, 10);
  grass.matrix.translate(-.5,0,-.5);
  grass.render();

  //sky
  var sky = new Cube();
  sky.color = [1.0, 1.0, 1.0, 1.0];
  sky.textureNum = g_normalOn ? -3 : 0;
  sky.matrix.scale(-5,-5,-5);
  sky.matrix.translate(-.5,-.5,-.5);
  let normalMatrix = new Matrix4();
  normalMatrix.setInverseOf(sky.matrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  sky.render();

  var test = new Sphere();
  test.color = [1.0, 1.0, 1.0, 1.0];
  test.textureNum = g_normalOn ? -3 : 4;
  test.matrix.translate(0,-.65,1.5);
  test.matrix.scale(.4,.4,.4);
  let sphereNormalMatrix = new Matrix4();
  sphereNormalMatrix.setInverseOf(test.matrix);
  sphereNormalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, sphereNormalMatrix.elements);
  test.render();

  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  var animalMatrix = new Matrix4();
  animalMatrix.scale(.5,.5,.5);
  animalMatrix.translate(1.5,-1.5,3);


  var savedMatrix = new Matrix4();


  //Draw face cube
  var face = new Cube();
  face.color = [.49,0.49,0.5,1.0];
  face.textureNum = g_normalOn ? -3 : -2; 
  face.matrix.set(animalMatrix);
  face.matrix.translate(-.25, -.30, -0.5);
  face.matrix.rotate(-5,1,0,0);
  face.matrix.scale(.5, .5, .5);
  face.render();

  var face2 = new Cube();
  face2.color = [.47,0.47,0.47,1.0];
  face2.textureNum = g_normalOn ? -3 : -2; 
  face2.matrix.set(animalMatrix);
  face2.matrix.translate(-.30, -.30, -0.4);
  face2.matrix.rotate(-5,1,0,0);
  face2.matrix.scale(.6, .55, .4);
  face2.render();

  //Draw ears
  var leftEar = new Cube();
  leftEar.color = [.45,0.45,0.45,1.0];
  leftEar.textureNum = g_normalOn ? -3 : -2; 
  leftEar.matrix.set(animalMatrix);
  leftEar.matrix.translate(-.35, .05, -0.52);
  leftEar.matrix.rotate(-5,1,0,0);
  leftEar.matrix.rotate(g_earTranslation, 0, 0, 1); 
  var leftEarCoordinatesMat = new Matrix4(leftEar.matrix);
  leftEar.matrix.scale(.15, .07, .1);
  //leftEar.matrix.rotate(360, 0, 0, 1);
  leftEar.render();

  var rightEar = new Cube();
  rightEar.color = [.45,0.45,0.45,1.0];
  rightEar.textureNum = g_normalOn ? -3 : -2; 
  rightEar.matrix.set(animalMatrix);
  rightEar.matrix.translate(.2, .05, -0.52);
  rightEar.matrix.rotate(-5,1,0,0);
  rightEar.matrix.rotate(-g_earTranslation, 0, 0, 1); 
  var rightEarCoordinatesMat = new Matrix4(rightEar.matrix);
  rightEar.matrix.scale(.15, .07, .1);
  rightEar.render();

  
  //Draw eye
  var rightEye = new Cube();
  rightEye.color = [1.0, 1.0, 1.0, 1.0];
  rightEye.textureNum = g_normalOn ? -3 : -2; 
  rightEye.matrix.set(animalMatrix);
  rightEye.matrix.translate(.12, .05, -0.55);
  rightEye.matrix.rotate(-5,1,0,0);
  rightEye.matrix.scale(.1, .1, .05);
  rightEye.render();

  var leftEye = new Cube();
  leftEye.color = [1.0, 1.0, 1.0, 1.0];
  leftEye.textureNum = g_normalOn ? -3 : -2; 
  leftEye.matrix.set(animalMatrix);
  leftEye.matrix.translate(-.22, .05, -0.55);
  leftEye.matrix.rotate(-5,1,0,0);
  leftEye.matrix.scale(.1, .1, .05);
  leftEye.render();
  
  //Draw pupil
  var rightPupil = new Cube();
  rightPupil.color = [0,0,0,1];
  rightPupil.textureNum = g_normalOn ? -3 : -2; 
  rightPupil.matrix.set(animalMatrix);
  rightPupil.matrix.translate(.17, .05, -0.56);
  rightPupil.matrix.rotate(-5,1,0,0);
  rightPupil.matrix.translate(g_eyeTranslation, 0, 0); // Apply the eye translation
  var rightPupilCoordinatesMat = new Matrix4(rightPupil.matrix);
  rightPupil.matrix.scale(.05, .05, .01);
  rightPupil.render();



  var leftPupil = new Cube();
  leftPupil.color = [0,0,0,1];
  leftPupil.textureNum = g_normalOn ? -3 : -2; 
  leftPupil.matrix.set(animalMatrix);
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
  topMouth.textureNum = g_normalOn ? -3 : -2; 
  topMouth.matrix.set(animalMatrix);
  topMouth.matrix.translate(-.2, -.15, -.65);
  topMouth.matrix.rotate(-5,1,0,0);
  topMouth.matrix.scale(.4, .15, .2);
  topMouth.render();

  var body = new Cube();
  body.color = [0.4,0.4,0.4,1.0];
  body.textureNum = g_normalOn ? -3 : -2; 
  body.matrix.set(animalMatrix);
  body.matrix.translate(-.1, -.03, -.67);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.04, .02, .01);
  body.render();

  var body = new Cube();
  body.color = [0.4,0.4,0.4,1.0];
  body.textureNum = g_normalOn ? -3 : -2; 
  body.matrix.set(animalMatrix);
  body.matrix.translate(.07, -.03, -.67);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.04, .02, .01);
  body.render();

  var bottomMouth = new Cube();
  bottomMouth.color = [.65,0.5,0.5,1.0];
  bottomMouth.textureNum = g_normalOn ? -3 : -2; 
  bottomMouth.matrix.set(animalMatrix);
  bottomMouth.matrix.translate(-.15, -.24, -.6);
  bottomMouth.matrix.rotate(-5,1,0,0);
  bottomMouth.matrix.translate(0, g_shiftClickTranslation, 0); 
  var bottomMouthCoordinatesMat = new Matrix4(bottomMouth.matrix);
  bottomMouth.matrix.scale(.3, .10, .1);
  bottomMouth.render();

  //Draw body
  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.textureNum = g_normalOn ? -3 : -2; 
  body.matrix.set(animalMatrix);
  body.matrix.translate(-.30, -.3, -0.3);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.6, .6, .3);
  body.render();

  var body2 = new Cube();
  body2.color = [.47,0.47,0.47,1.0];
  body2.textureNum = g_normalOn ? -3 : -2; 
  body2.matrix.set(animalMatrix);
  body2.matrix.translate(-.30, -.32, -0.25);
  body2.matrix.rotate(-5,1,0,0);
  body2.matrix.scale(.6, .65, .3);
  body2.render();

  var bigBody = new Cube();
  bigBody.color = [.47,0.47,0.47,1.0];
  bigBody.textureNum = g_normalOn ? -3 : -2; 
  bigBody.matrix.set(animalMatrix);
  bigBody.matrix.translate(-.30, -.301, -0.05);
  bigBody.matrix.rotate(-5,1,0,0);
  bigBody.matrix.scale(.6, .65, .5);
  bigBody.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.textureNum = g_normalOn ? -3 : -2; 
  body.matrix.set(animalMatrix);
  body.matrix.translate(-.27, -.25, .25);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.55, .6, .3);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.textureNum = g_normalOn ? -3 : -2; 
  body.matrix.set(animalMatrix);
  body.matrix.translate(-.27, -.15, .3);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.55, .45, .3);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.textureNum = g_normalOn ? -3 : -2; 
  body.matrix.set(animalMatrix);
  body.matrix.translate(-.32, -.25, -.2);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.5, .5, .6);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.textureNum = g_normalOn ? -3 : -2; 
  body.matrix.set(animalMatrix);
  body.matrix.translate(-.19, -.25, -.2);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.5, .5, .6);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.textureNum = g_normalOn ? -3 : -2; 
  body.matrix.set(animalMatrix);
  body.matrix.translate(-.06, -.2, -.2);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.4, .4, .6);
  body.render();

  var body = new Cube();
  body.color = [.47,0.47,0.47,1.0];
  body.textureNum = g_normalOn ? -3 : -2; 
  body.matrix.set(animalMatrix);
  body.matrix.translate(-.35, -.2, -.2);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.4, .4, .6);
  body.render();

  var body = new Cube();
  body.color = [.65,0.5,0.5,1.0];
  body.textureNum = g_normalOn ? -3 : -2; 
  body.matrix.set(animalMatrix);
  body.matrix.translate(-.3, -.32, -.2);
  body.matrix.rotate(-5,1,0,0);
  body.matrix.scale(.58, .01, .6);
  body.render();

  //Draw right arm
  var rightArm1 = new Cube();
  rightArm1.color = [.47,0.47,0.47,1.0];
  rightArm1.textureNum = g_normalOn ? -3 : -2; 
  rightArm1.matrix.set(animalMatrix);
  rightArm1.matrix.translate(-.30, -.5, -0.18);
  rightArm1.matrix.rotate(-5,1,0,0);
  rightArm1.matrix.translate(0, 0, g_rightArmTranslation);
  var rightArmCoordinatesMat = new Matrix4(rightArm1.matrix);
  rightArm1.matrix.scale(.2, .33, .2);
  rightArm1.render();
  




///////////////////////////////////////////////////////////////////////////////
//Draw right back leg
var rightBackLeg = new Cube();
rightBackLeg.color = [.47,0.47,0.47,1.0];
rightBackLeg.textureNum = g_normalOn ? -3 : -2; 
rightBackLeg.matrix.set(animalMatrix);
rightBackLeg.matrix.translate(-.30, -.47, 0.35);
rightBackLeg.matrix.rotate(-5,1,0,0);
rightBackLeg.matrix.translate(0, 0, g_rightArmTranslation);
var rightArmCoordinatesMat = new Matrix4(rightBackLeg.matrix);
rightBackLeg.matrix.scale(.2, .33, .2);
rightBackLeg.render();





///////////////////////////////////////////////////////////////////////////////
//Draw left back arm
///////////////////////////////////////////////////////////////////////////////

var leftBackLeg = new Cube();
leftBackLeg.color = [.47,0.47,0.47,1.0];
leftBackLeg.textureNum = g_normalOn ? -3 : -2; 
leftBackLeg.matrix.set(animalMatrix);
leftBackLeg.matrix.translate(.1, -.47, 0.35);
leftBackLeg.matrix.rotate(-5,1,0,0);
leftBackLeg.matrix.translate(0, 0, g_leftArmTranslation);
var leftArmCoordinatesMat = new Matrix4(leftBackLeg.matrix);
leftBackLeg.matrix.scale(.2, .33, .2);
leftBackLeg.render();




///////////////////////////////////////////////////////////////////////////////
//Draw left arm
///////////////////////////////////////////////////////////////////////////////

var leftFrontLeg = new Cube();
leftFrontLeg.color = [.47,0.47,0.47,1.0];
leftFrontLeg.textureNum = g_normalOn ? -3 : -2; 
leftFrontLeg.matrix.set(animalMatrix);
leftFrontLeg.matrix.translate(.1, -.5, -0.18);
leftFrontLeg.matrix.rotate(-5,1,0,0);
leftFrontLeg.matrix.translate(0, 0, g_leftArmTranslation);
var leftArmCoordinatesMat = new Matrix4(leftFrontLeg.matrix);
leftFrontLeg.matrix.scale(.2, .33, .2);
leftFrontLeg.render();





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
