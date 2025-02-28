class Camera {
  constructor() {

    this.fov = 100;

    this.eye = new Vector3([0, 0, 0]);
    this.at = new Vector3([0, 0, -1]);
    this.up = new Vector3([0, 1, 0]);

    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();

    this.viewMatrix.setLookAt(
      this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
      this.at.elements[0], this.at.elements[1], this.at.elements[2],
      this.up.elements[0], this.up.elements[1], this.up.elements[2]
    )

    this.projectionMatrix.setPerspective(this.fov, canvas.width/canvas.height, .1, 1000);

    this.map = g_map;
  }

  isLookingThroughWall(eye, at) {
    let mapX = Math.floor((eye[0] + (this.map.length/2) * 10) / 10);
    let mapZ = Math.floor((eye[2] + (this.map[0].length/2) * 10) / 10);

    if (mapX >= 0 && mapX < this.map.length && 
        mapZ >= 0 && mapZ < this.map[0].length) {
        if (this.map[mapX][mapZ] === 1) {
            return true;
        }
    }

    let direction = new Vector3([
        at[0] - eye[0],
        0,  
        at[2] - eye[2]
    ]);
    direction.normalize();

    let nextX = Math.floor(((eye[0] + direction.elements[0]) + (this.map.length/2) * 10) / 10);
    let nextZ = Math.floor(((eye[2] + direction.elements[2]) + (this.map[0].length/2) * 10) / 10);
    
    if (nextX >= 0 && nextX < this.map.length && 
        nextZ >= 0 && nextZ < this.map[0].length) {
        return this.map[nextX][nextZ] === 1;
    }
    
    return false;
}

  updateViewMatrix() {
    this.viewMatrix.setLookAt(
        this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
        this.at.elements[0], this.at.elements[1], this.at.elements[2],
        this.up.elements[0], this.up.elements[1], this.up.elements[2]
    );
}

moveForward(distance) {
    let direction = new Vector3([
        this.at.elements[0] - this.eye.elements[0],
        0,  
        this.at.elements[2] - this.eye.elements[2]
    ]);
    direction.normalize();


    let newEye = [
        this.eye.elements[0] + direction.elements[0] * distance,
        this.eye.elements[1],
        this.eye.elements[2] + direction.elements[2] * distance
    ];

    let newAt = [
        newEye[0] + (this.at.elements[0] - this.eye.elements[0]),
        this.at.elements[1],   
        newEye[2] + (this.at.elements[2] - this.eye.elements[2])
    ];

    if (!this.isLookingThroughWall(newEye, newAt)) {
        this.eye = new Vector3(newEye);
        this.at = new Vector3(newAt);
        this.updateViewMatrix();
    }
}


moveBackward(distance) {
    let direction = new Vector3([
        this.at.elements[0] - this.eye.elements[0],
        0,  
        this.at.elements[2] - this.eye.elements[2]
    ]);
    direction.normalize();

    let newEye = [
        this.eye.elements[0] - direction.elements[0] * distance,
        this.eye.elements[1], 
        this.eye.elements[2] - direction.elements[2] * distance
    ];

    let newAt = [
        newEye[0] + (this.at.elements[0] - this.eye.elements[0]),
        this.at.elements[1],  
        newEye[2] + (this.at.elements[2] - this.eye.elements[2])
    ];

    if (!this.isLookingThroughWall(newEye, newAt)) {
        this.eye = new Vector3(newEye);
        this.at = new Vector3(newAt);
        this.updateViewMatrix();
    }
}

  moveLeft(speed) {

    let f = new Vector3([
        this.at.elements[0] - this.eye.elements[0],
        this.at.elements[1] - this.eye.elements[1],
        this.at.elements[2] - this.eye.elements[2]
    ]);
    f.normalize();

    let r = Vector3.cross(f, this.up);
    r.normalize();

    let newEye = [
        this.eye.elements[0] - r.elements[0] * speed,
        this.eye.elements[1] - r.elements[1] * speed,
        this.eye.elements[2] - r.elements[2] * speed
    ];

    let newAt = [
        this.at.elements[0] - r.elements[0] * speed,
        this.at.elements[1] - r.elements[1] * speed,
        this.at.elements[2] - r.elements[2] * speed
    ];

    if (!this.isLookingThroughWall(newEye, newAt)) {
        this.eye = new Vector3(newEye);
        this.at = new Vector3(newAt);
        this.updateViewMatrix();
    }
  }

  moveRight(speed) {

    let f = new Vector3([
        this.at.elements[0] - this.eye.elements[0],
        this.at.elements[1] - this.eye.elements[1],
        this.at.elements[2] - this.eye.elements[2]
    ]);
    f.normalize();

    let r = Vector3.cross(f, this.up);
    r.normalize();

    let newEye = [
        this.eye.elements[0] + r.elements[0] * speed,
        this.eye.elements[1] + r.elements[1] * speed,
        this.eye.elements[2] + r.elements[2] * speed
    ];

    let newAt = [
        this.at.elements[0] + r.elements[0] * speed,
        this.at.elements[1] + r.elements[1] * speed,
        this.at.elements[2] + r.elements[2] * speed
    ];

    if (!this.isLookingThroughWall(newEye, newAt)) {
        this.eye = new Vector3(newEye);
        this.at = new Vector3(newAt);
        this.updateViewMatrix();
    }
  }

  panLeft(alpha) {

    let f = new Vector3([
        this.at.elements[0] - this.eye.elements[0],
        this.at.elements[1] - this.eye.elements[1],
        this.at.elements[2] - this.eye.elements[2]
    ]);

    let rotation = new Matrix4();
    rotation.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

    let newF = rotation.multiplyVector3(f);

    let newAt = [
        this.eye.elements[0] + newF.elements[0],
        this.eye.elements[1] + newF.elements[1],
        this.eye.elements[2] + newF.elements[2]
    ];

    if (!this.isLookingThroughWall(this.eye.elements, newAt)) {
        this.at = new Vector3(newAt);
        this.updateViewMatrix();
    }
  }

  panRight(alpha) {
    let f = new Vector3([
        this.at.elements[0] - this.eye.elements[0],
        this.at.elements[1] - this.eye.elements[1],
        this.at.elements[2] - this.eye.elements[2]
    ]);

    let rotation = new Matrix4();
    rotation.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

    let newF = rotation.multiplyVector3(f);

    let newAt = [
        this.eye.elements[0] + newF.elements[0],
        this.eye.elements[1] + newF.elements[1],
        this.eye.elements[2] + newF.elements[2]
    ];

    if (!this.isLookingThroughWall(this.eye.elements, newAt)) {
        this.at = new Vector3(newAt);
        this.updateViewMatrix();
    }
  }

  panUp(alpha) {

    let f = new Vector3([
        this.at.elements[0] - this.eye.elements[0],
        this.at.elements[1] - this.eye.elements[1],
        this.at.elements[2] - this.eye.elements[2]
    ]);

    let r = Vector3.cross(f, this.up);
    r.normalize();

    let rotation = new Matrix4();
    rotation.setRotate(alpha, r.elements[0], r.elements[1], r.elements[2]);

    let newF = rotation.multiplyVector3(f);

    let newAt = [
        this.eye.elements[0] + newF.elements[0],
        this.eye.elements[1] + newF.elements[1],
        this.eye.elements[2] + newF.elements[2]
    ];

    if (!this.isLookingThroughWall(this.eye.elements, newAt)) {
        this.at = new Vector3(newAt);
        this.updateViewMatrix();
    }
  }

  panDown(alpha) {

    let f = new Vector3([
        this.at.elements[0] - this.eye.elements[0],
        this.at.elements[1] - this.eye.elements[1],
        this.at.elements[2] - this.eye.elements[2]
    ]);

    let r = Vector3.cross(f, this.up);
    r.normalize();

    let rotation = new Matrix4();
    rotation.setRotate(-alpha, r.elements[0], r.elements[1], r.elements[2]);

    let newF = rotation.multiplyVector3(f);

    let newAt = [
        this.eye.elements[0] + newF.elements[0],
        this.eye.elements[1] + newF.elements[1],
        this.eye.elements[2] + newF.elements[2]
    ];

    if (!this.isLookingThroughWall(this.eye.elements, newAt)) {
        this.at = new Vector3(newAt);
        this.updateViewMatrix();
    }
  }




}
