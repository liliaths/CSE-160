class Cone {
  constructor() {
    this.type = 'cone';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
    this.segments = 12; 
    
  }

  render() {
    var rgba = this.color;
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    let angle = 360 / this.segments;
    for(var i = 0; i < this.segments; i++) {
      let cur_angle = i * angle;
      let next_angle = (i + 1) * angle;
      

      let x1 = Math.cos(cur_angle * Math.PI / 180);
      let z1 = Math.sin(cur_angle * Math.PI / 180);
      let x2 = Math.cos(next_angle * Math.PI / 180);
      let z2 = Math.sin(next_angle * Math.PI / 180);
    

      drawTriangle3D([
        x1, 0, z1,    
        0, 1, 0,      
        x2, 0, z2     
      ]);

      drawTriangle3D([
        0, 0, 0,     
        x1, 0, z1,   
        x2, 0, z2    
      ]);
    }
  }
}