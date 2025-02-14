var VSHADER_SOURCE = `
   precision mediump float;
   attribute vec4 a_Position;
   attribute vec2 a_UV;
   varying vec2 v_UV;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform mat4 u_ViewMatrix;
   uniform mat4 u_ProjectionMatrix;
   void main() {
     gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
     v_UV = a_UV;
   }`

// Fragment shader program
var FSHADER_SOURCE = `
   precision mediump float;
   varying vec2 v_UV;
   uniform vec4 u_FragColor;
   uniform sampler2D u_Sampler0;
   uniform sampler2D u_Sampler1;
   uniform sampler2D u_Sampler2;
   uniform sampler2D u_Sampler3;
   uniform sampler2D u_Sampler4;
   uniform sampler2D u_Sampler5;
   uniform sampler2D u_Sampler6;
   uniform sampler2D u_Sampler7;
   uniform sampler2D u_Sampler8;
   uniform sampler2D u_Sampler9;
   uniform sampler2D u_Sampler10;
   uniform int u_whichTexture;
   void main() {
     
     if(u_whichTexture == -2) {
        gl_FragColor = u_FragColor;
     
     } else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0);

     } else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV);

     } else if (u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV);

     } else if (u_whichTexture == 2) {
        gl_FragColor = texture2D(u_Sampler2, v_UV);

     } else if (u_whichTexture == 3) {
        gl_FragColor = texture2D(u_Sampler3, v_UV);

     } else if (u_whichTexture == 4) {
        gl_FragColor = texture2D(u_Sampler4, v_UV);

     } else if (u_whichTexture == 5) {
        gl_FragColor = texture2D(u_Sampler5, v_UV);

     } else if (u_whichTexture == 6) {
        gl_FragColor = texture2D(u_Sampler6, v_UV);

     } else if (u_whichTexture == 7) {
        gl_FragColor = texture2D(u_Sampler7, v_UV);
     
     } else if (u_whichTexture == 8) {
        gl_FragColor = texture2D(u_Sampler8, v_UV);

     } else if (u_whichTexture == 9) {
        gl_FragColor = texture2D(u_Sampler9, v_UV);
     
        } else if (u_whichTexture == 10) {
        gl_FragColor = texture2D(u_Sampler10, v_UV);

     } else {
        gl_FragColor = vec4(1, .2, .2, 1); 
     }
  
  }`

  let canvas;
  let gl;
  let a_Position;
  let a_UV;
  let u_FragColor;
  let u_Size;
  let u_ModelMatrix;
  let u_ProjectionMatrix;
  let u_ViewMatrix;
  let u_GlobalRotateMatrix;
  let u_whichTexture;


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

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
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

  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
  if (!u_Sampler5) {
    console.log('Failed to get the storage location of u_Sampler5');
    return false;
  }

  u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
  if (!u_Sampler6) {
    console.log('Failed to get the storage location of u_Sampler6');
    return false;
  }

  u_Sampler7 = gl.getUniformLocation(gl.program, 'u_Sampler7');
  if (!u_Sampler7) {
    console.log('Failed to get the storage location of u_Sampler7');
    return false;
  }
  
  u_Sampler8 = gl.getUniformLocation(gl.program, 'u_Sampler8');
  if (!u_Sampler8) {
    console.log('Failed to get the storage location of u_Sampler8');
    return false;
  }
  
  u_Sampler9 = gl.getUniformLocation(gl.program, 'u_Sampler9');
  if (!u_Sampler9) {
    console.log('Failed to get the storage location of u_Sampler9');
    return false;
  }

  u_Sampler10 = gl.getUniformLocation(gl.program, 'u_Sampler10');
  if (!u_Sampler10) {
    console.log('Failed to get the storage location of u_Sampler10');
    return false;
  }


  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  let projMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMatrix.elements);

  let viewMatrix = new Matrix4(); 
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  }


let g_globalAngle = 0;

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



function addActionsForHtmlUI() {
  let isDragging = false;
  const backgroundMusic = new Audio('backgroundMusic.mp3');
  const soundEffect = new Audio('titanSteps.mp3');

  backgroundMusic.preload = 'auto';
  soundEffect.preload = 'auto';

  backgroundMusic.loop = true; 
  soundEffect.loop = true;
  soundEffect.volume = 1.0;

  document.getElementById('musicON').addEventListener('click', () => {backgroundMusic.play();});
  document.getElementById('musicOFF').addEventListener('click', () => {backgroundMusic.pause();backgroundMusic.currentTime = 0;});

  document.getElementById('soundON').addEventListener('click', () => {
    soundEffect.currentTime = 0; 
    soundEffect.play();
  });
  document.getElementById('soundOFF').addEventListener('click', () => {
    soundEffect.pause();
    soundEffect.currentTime = 0;
  });
  

  document.getElementById('musicSlider').addEventListener('input', (e) => {backgroundMusic.volume = e.target.value / 10;});
  document.getElementById('soundSlider').addEventListener('input', (e) => {
    let volume = e.target.value / 10;

    if (e.target.value > 8) {
      volume = volume * 2;
    }
    soundEffect.volume = Math.min(2.0, volume); 
  });
  

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

}

function playSoundEffect() {
  if (!soundEffect.muted) {
      soundEffect.currentTime = 0; 
      soundEffect.play();
  }
}

function initTextures() {
  
  var image = new Image(); 
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image.onload = function(){ SendImageToTEXTURE0(image); };

  image.src = 'aotSky.jpg';


  var image2 = new Image(); 
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image2.onload = function(){ SendImageToTEXTURE0(image2); };

  image2.src = 'stoneFloor.jpg';


  var image3 = new Image(); 
  if (!image3) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image3.onload = function(){ SendImageToTEXTURE0(image3); };

  image3.src = 'wall.jpg';

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

  image5.src = 'titan1.jpg';

  var image6 = new Image(); 
  if (!image6) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image6.onload = function(){ SendImageToTEXTURE0(image6); };

  image6.src = 'water.jpg';

  var image7 = new Image(); 
  if (!image7) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image7.onload = function(){ SendImageToTEXTURE0(image7); };

  image7.src = 'gate.jpg';

  var image8 = new Image(); 
  if (!image8) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image8.onload = function(){ SendImageToTEXTURE0(image8); };

  image8.src = 'brick.jpg';

  var image9 = new Image(); 
  if (!image9) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image9.onload = function(){ SendImageToTEXTURE0(image9); };

  image9.src = 'stoneHouse.jpg';

  var image10 = new Image(); 
  if (!image10) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image10.onload = function(){ SendImageToTEXTURE0(image10); };

  image10.src = 'door.jpg';

  var image11 = new Image(); 
  if (!image11) {
    console.log('Failed to create the image object');
    return false;
  }
  
  image11.onload = function(){ SendImageToTEXTURE0(image11); };

  image11.src = 'window.jpg';

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
  } else if(image.src.includes('stoneFloor')) {
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler1, 1);
  } else if(image.src.includes('wall')) {
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler2, 2);
  } else if(image.src.includes('trees')) {
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler3, 3);
  } else if(image.src.includes('titan1')) {
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler4, 4);
  } else if(image.src.includes('water')) {
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler5, 5);
  } else if(image.src.includes('gate')) {
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler6, 6);
  } else if(image.src.includes('brick')) {
    gl.activeTexture(gl.TEXTURE7);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler7, 7);
  } else if(image.src.includes('stoneHouse')) {
    gl.activeTexture(gl.TEXTURE8);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler8, 8);
  } else if(image.src.includes('door')) {
    gl.activeTexture(gl.TEXTURE9);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler9, 9);
  } else if(image.src.includes('window')) {
    gl.activeTexture(gl.TEXTURE10);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler10, 10);
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


var g_map = [
  [0,0,1,1,1,1,1,1],  
  [1,1,0,0,0,0,0,1], 
  [1,0,0,0,0,0,0,1],  
  [1,0,0,0,0,0,0,1],  
  [1,0,0,0,0,0,0,1],  
  [1,0,0,0,0,0,0,1],  
  [1,1,0,0,0,0,0,1], 
  [0,0,1,1,1,1,1,1]   
];

var g_houseMap = [
  [0,0,0,0,0,0,0,0],  
  [0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0],  
  [1,0,1,0,1,0,1,0],  
  [0,1,0,1,0,1,0,1],  
  [1,0,1,0,1,0,1,0],  
  [0,1,0,1,0,1,0,1], 
  [0,0,0,0,0,0,0,0]   
];

var g_houseLeft = [
  [0,1,0,1,0,1,0,1],  
  [0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0],  
  [0,0,0,0,0,0,0,0],  
  [0,0,0,0,0,0,0,0],  
  [0,0,0,0,0,0,0,0],  
  [0,0,0,0,0,0,0,0], 
  [0,0,0,0,0,0,0,0]    
];

var g_water = [
  [0,0,0,0,0,0,0,0],  
  [0,0,0,0,0,0,0,0],  
  [0,0,0,0,0,0,0,0],  
  [0,0,0,0,0,0,0,0],  
  [0,0,0,0,0,0,0,0],  
  [1,1,1,1,1,1,1,1], 
  [1,1,1,1,1,1,1,1],  
  [0,0,0,0,0,0,0,0]   
];


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


function drawMap() {
  var body = new Cube();
  for (var x = 0; x < g_map.length; x++) {
    for (var y = 0; y < g_map[x].length; y++) {
      if (g_map[x][y] === 1) {
        body.color = [.8, 1, 1, 1];
        body.textureNum = 2;
        body.matrix.setTranslate(0, -.75, 0);
        body.matrix.scale(20, 100, 20); 
        body.matrix.translate(x - g_map.length / 2, 0, y - g_map[0].length / 2);
        body.render();
      }
    }
  }
}

function drawHouses() {
  const spacing = 15; 
  var house = new House();
  
  for(let x = 0; x < g_houseMap.length; x++) {
    for(let y = 0; y < g_houseMap[x].length; y++) {
      if(g_houseMap[x][y] === 1) {

        house.setPosition(
          x * spacing - (g_houseMap.length * spacing / 2) + 5,
          0,  
          y * spacing - (g_houseMap[0].length * spacing / 2) +20
        );
        house.render();
      }
    }
  }
}

function drawHouses2() {
  const spacing = 15; 
  var house = new House();
  
  for(let x = 0; x < g_houseLeft.length; x++) {
    for(let y = 0; y < g_houseLeft[x].length; y++) {
      if(g_houseLeft[x][y] === 1) {

        house.setPosition(
          x * spacing - (g_houseLeft.length * spacing / 2) + 10,
          0,  
          y * spacing - (g_houseLeft[0].length * spacing / 2) + 20,
          180 
        );
        house.render();
      }
    }
  }
}

function drawWater() {
  var body = new Cube();
  for(var x = 0; x < g_water.length; x++) {
    for(var y = 0; y < g_water[x].length; y++)  {
      if(g_water[x][y] === 1) {
        body.color = [0.0, 0.0, 1.0, 0.7];
        body.textureNum = 5;
        body.matrix.setTranslate(-50, -1, 0);
        body.matrix.scale(10, 0.3, 20); 
        body.matrix.translate(x - g_map.length / 2, 0, y - g_map[0].length / 2);
        body.render();
      }
    }
  }
}


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

  drawMap();
  drawHouses();
  drawWater();
  drawHouses2();

  var gate = new Cube();
  gate.color = [0.5, 0.5, 0.5, 1.0];
  gate.textureNum = 6;
  gate.matrix.translate(0, -2, -60);
  gate.matrix.scale(20, 95, .1);
  gate.matrix.translate(-.5, 0, -.5);
  gate.render();

  var rightPalm = new Cube();
  rightPalm.color = [238/255,91/255,101/255,1.0];
  rightPalm.matrix.translate(-25, 100, -65);
  rightPalm.matrix.rotate(180, 0, 1, 0);  
  rightPalm.matrix.scale(28, 10, 20);
  rightPalm.matrix.translate(-.5, 0, -.5);
  rightPalm.render();

  for(let i = 0; i < 4; i++) {
      var finger = new Cube();
      finger.color = [238/255,91/255,101/255,1.0];
      finger.matrix.translate(-35 + (i*7), 90, -55);
      finger.matrix.rotate(180, 0, 1, 0);  
      finger.matrix.scale(5, 20, 5);
      finger.matrix.translate(-.5, 0, -.5);
      finger.matrix.rotate(45, 1, 0, 0);  
      finger.render();
  }

  var thumb = new Cube();
  thumb.color = [238/255,91/255,101/255,1.0];
  thumb.matrix.translate(0, 95, -60);
  thumb.matrix.rotate(180, 0, 1, 0);   
  thumb.matrix.rotate(-45, 0, 0, 1);    
  thumb.matrix.scale(5, 15, 5);        
  thumb.matrix.translate(-.5, 0, -.5);
  thumb.render();

  //colossal titan
  var titan = new Cube();
  titan.color = [.47,0.47,0.47,1.0];
  titan.textureNum = 4;
  titan.matrix.translate(0, 200, -50);
  titan.matrix.scale(50, 65, 65);
  titan.matrix.translate(-.5,0,-.5);
  titan.matrix.rotate(65, 1, 0, 0); 
  titan.render();

  var body = new Cube();
  body.color = [238/255,91/255,101/255,1.0];
  body.matrix.translate(0, 180, -70);
  body.matrix.scale(170, 100, 20);
  body.matrix.translate(-.5,0,-.5);
  body.matrix.rotate(65, 1, 0, 0); 
  body.render();

  var head = new Sphere();
  head.color = [154/255, 108/255, 108/255, 1.0]; 
  head.matrix.translate(0, 194, -3);    
  head.matrix.scale(30, 30, 25);     
  head.render();

  //floor
  var floor = new Cube();
  floor.color = [1.0, 0.0, 0.0, 1.0];
  floor.textureNum = 1;
  floor.matrix.translate(0, -.75, 0);
  floor.matrix.scale(130, 0, 130);
  floor.matrix.translate(-.5,0,-.5);
  floor.render();

  var grass = new Cube();
  grass.color = [1.0, 0.0, 0.0, 1.0];
  grass.textureNum = 3;
  grass.matrix.translate(0, -1, 0);
  grass.matrix.scale(400, 0, 400);
  grass.matrix.translate(-.5,0,-.5);
  grass.render();

  //sky
  var sky = new Cube();
  sky.color = [1.0, 0.0, 0.0, 1.0];
  sky.textureNum = 0;
  sky.matrix.scale(600,800,600);
  sky.matrix.translate(-.5,-.5,-.5);
  sky.render();

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
