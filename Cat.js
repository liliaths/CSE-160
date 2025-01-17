class Cat {
  constructor() {
    this.position = [0, 0];
    this.color = [0, 0, 0, 1];
    this.size = 0.05;
  }

  render() {
    const CAT_VERTICES = [
      // Ears
      -0.04, 0.07, -0.02, 0.07, -0.03, 0.09,
      0.04, 0.07, 0.02, 0.07, 0.03, 0.09,
      // Head
      -0.04, 0.0, -0.04, 0.07, 0.0, 0.0,
      0.04, 0.0, 0.04, 0.07, 0.0, 0.0,
      -0.04, 0.07, 0.04, 0.07, 0.0, 0.0,

      ///////////////////////////////////////////



            
          
            0.00,0.024, 0.03,0.035, 0.032,0.033, 
            0.00,0.024, 0.025,0.025, 0.022,0.023, 
            0.00,0.024, 0.025,0.015, 0.026,0.013, 
          
            
            //body
            0.05,0.00, -0.05,0.00, 0.00,-0.08, 
            -0.05,-0.08, -0.05,0.00, 0.00,-0.08, 
            0.05,-0.08, 0.05,0.00, 0.00,-0.08, 
          
            //paws 1.0, 0.045, 0.00,
            0.025,-0.08, 0.05,0.00, 0.05,-0.08, 
          
            -0.05,-0.07, -0.05,-0.09, -0.04,-0.09, 
            -0.05,-0.07, -0.03,-0.07, -0.04,-0.09,  
            -0.02,-0.09, -0.03,-0.07, -0.04,-0.09,  
          
            0.05,-0.07, 0.05,-0.09, 0.04,-0.09,  
            0.05,-0.07, 0.03,-0.07, 0.04,-0.09,  
            0.02,-0.09, 0.03,-0.07, 0.04,-0.09,  
            
            //tail
            -0.05,-0.07, -0.085,-0.03, -0.08,-0.01, 
            -0.05,-0.07, -0.075,0.015, -0.08,-0.01, 
            -0.085,-0.03, -0.073,0.015, -0.085,0.015,
      


    ];

    for (let i = 0; i < CAT_VERTICES.length; i += 6) {
      let vertices = [
        this.position[0] + CAT_VERTICES[i] * this.size, this.position[1] + CAT_VERTICES[i + 1] * this.size,
        this.position[0] + CAT_VERTICES[i + 2] * this.size, this.position[1] + CAT_VERTICES[i + 3] * this.size,
        this.position[0] + CAT_VERTICES[i + 4] * this.size, this.position[1] + CAT_VERTICES[i + 5] * this.size
      ];

      let vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

      let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);

      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
}