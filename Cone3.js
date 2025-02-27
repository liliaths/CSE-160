class Cone {
  constructor() {
    this.type = 'cone';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.textureNum = -2;
    this.segments = 12; 
  }

  render() {
    var rgba = this.color;
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform1i(u_whichTexture, this.textureNum);   
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    let angle = 360 / this.segments;
    for(var i = 0; i < this.segments; i++) {
      let cur_angle = i * angle;
      let next_angle = (i + 1) * angle;
      
      let x1 = Math.cos(cur_angle * Math.PI / 180);
      let z1 = Math.sin(cur_angle * Math.PI / 180);
      let x2 = Math.cos(next_angle * Math.PI / 180);
      let z2 = Math.sin(next_angle * Math.PI / 180);
      
      let nx1 = x1;
      let nz1 = z1;
      let ny1 = 0.5; 
      let norm1 = Math.sqrt(nx1*nx1 + ny1*ny1 + nz1*nz1);
      
      let nx2 = x2;
      let nz2 = z2;
      let ny2 = 0.5;
      let norm2 = Math.sqrt(nx2*nx2 + ny2*ny2 + nz2*nz2);

 
      drawTriangle3DUVNormal(
        [x1, 0, z1, x2, 0, z2, 0, 1, 0],   
        [i/this.segments, 0, (i+1)/this.segments, 0, (i+0.5)/this.segments, 1],  
        [nx1/norm1, ny1/norm1, nz1/norm1, nx2/norm2, ny2/norm2, nz2/norm2, 0, 1, 0]                        
      );


      drawTriangle3DUVNormal(
        [0, 0, 0, x1, 0, z1, x2, 0, z2],  
        [0.5, 0, i/this.segments, 0, (i+1)/this.segments, 0],  
        [0, -1, 0, 0,-1,0, 0,-1,0] 
      );
    }
  }
}