class Sphere {
    constructor() {
        this.type = 'sphere';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2; 
        this.segments = 12; 
    }
  
    render() {
        var rgba = this.color;
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        let sphereVertices = [];
        let sphereUVs = [];
        let sphereNormals = [];
  
        for(let latNumber = 0; latNumber <= this.segments; latNumber++) {
            let theta = latNumber * Math.PI / this.segments;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);
  
            for(let longNumber = 0; longNumber <= this.segments; longNumber++) {
                let phi = longNumber * 2 * Math.PI / this.segments;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);
        
                let x = cosPhi * sinTheta;
                let y = cosTheta;
                let z = sinPhi * sinTheta;
        
                let u = 1 - (longNumber / this.segments);
                let v = 1 - (latNumber / this.segments);
        
                sphereVertices.push(x, y, z);
                sphereUVs.push(u, v);
                sphereNormals.push(x, y, z); 
            }
        }
  
        for(let latNumber = 0; latNumber < this.segments; latNumber++) {
            for(let longNumber = 0; longNumber < this.segments; longNumber++) {
                let first = (latNumber * (this.segments + 1)) + longNumber;
                let second = first + this.segments + 1;
  
                let v1 = sphereVertices.slice(first * 3, (first + 1) * 3);
                let v2 = sphereVertices.slice(second * 3, (second + 1) * 3);
                let v3 = sphereVertices.slice((first + 1) * 3, (first + 2) * 3);
                let v4 = sphereVertices.slice((second + 1) * 3, (second + 2) * 3);
  
                let uv1 = sphereUVs.slice(first * 2, (first + 1) * 2);
                let uv2 = sphereUVs.slice(second * 2, (second + 1) * 2);
                let uv3 = sphereUVs.slice((first + 1) * 2, (first + 2) * 2);
                let uv4 = sphereUVs.slice((second + 1) * 2, (second + 2) * 2);
  
                let n1 = sphereNormals.slice(first * 3, (first + 1) * 3);
                let n2 = sphereNormals.slice(second * 3, (second + 1) * 3);
                let n3 = sphereNormals.slice((first + 1) * 3, (first + 2) * 3);
                let n4 = sphereNormals.slice((second + 1) * 3, (second + 2) * 3);
  
                gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
                drawTriangle3DUVNormal(
                    v1.concat(v2).concat(v3), 
                    uv1.concat(uv2).concat(uv3),
                    n1.concat(n2).concat(n3)
                );
                drawTriangle3DUVNormal(
                    v2.concat(v4).concat(v3),
                    uv2.concat(uv4).concat(uv3),
                    n2.concat(n4).concat(n3)
                );
            }
        }
    }
  }