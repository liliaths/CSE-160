class Triangle{
  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;

    this.buffer = gl.createBuffer();
    if (!this.buffer) {
      console.log('Failed to create the buffer object');
      return;
    }

    // Pre-allocate the typed array
    this.vertices = new Float32Array(9);
    
  }

  render() {
    var xy = this.position;
    var rgba = this.color;
    var d = this.size/200.0;

    // Update vertices data
    this.vertices[0] = xy[0];     // First vertex x
    this.vertices[1] = xy[1];     // First vertex y
    this.vertices[2] = 0;         // First vertex z
    this.vertices[3] = xy[0] + d; // Second vertex x
    this.vertices[4] = xy[1];     // Second vertex y 
    this.vertices[5] = 0;         // Second vertex z
    this.vertices[6] = xy[0];     // Third vertex x
    this.vertices[7] = xy[1] + d; // Third vertex y
    this.vertices[8] = 0;         // Third vertex z

    // Reuse the existing buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    // Set vertex attribute
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Set color
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

function drawTriangle3D(vertices) {

  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);


  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  
  gl.drawArrays(gl.TRIANGLES, 0, n);

}


