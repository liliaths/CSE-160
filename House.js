class House {
  constructor() {
    this.position = {x: 0, y: 0, z: 0};
    this.rotation = -90; // Degrees around Y axis
  }

  setPosition(x, y, z) {
    this.position = {x, y, z};
  }

  setRotation(degrees) {
    this.rotation = degrees;
  }

  render() {
    // House body (walls)
    var walls = new Cube();
    walls.color = [0.8, 0.8, 0.8, 1.0];
    walls.textureNum = 8;
    walls.matrix = new Matrix4();
    walls.matrix.translate(this.position.x, this.position.y - 1, this.position.z - 10);
    walls.matrix.rotate(this.rotation, 0, 1, 0); // Add rotation
    walls.matrix.scale(10, 7.5, 7.5);
    walls.matrix.translate(-0.5, 0, -0.5);
    walls.render();

    // Roof
    var roof = new Cube();
    roof.color = [0.6, 0.3, 0.1, 1.0];
    roof.textureNum = 7;
    roof.matrix = new Matrix4();
    roof.matrix.translate(this.position.x, this.position.y + 3, this.position.z - 10);
    roof.matrix.rotate(this.rotation, 0, 1, 0); // Add rotation
    roof.matrix.translate(4, -.5, 0.2);
    roof.matrix.scale(8, 5, 7);
    roof.matrix.translate(-0.5, 0, -0.5);
    roof.matrix.rotate(45, 0, 0, 1);
    roof.render();

    var roof1 = new Cube();
    roof1.color = [0.8, 0.8, 0.8, 1.0];
    roof1.textureNum = 8;
    roof1.matrix = new Matrix4();
    roof1.matrix.translate(this.position.x, this.position.y + 3, this.position.z - 10);
    roof1.matrix.rotate(this.rotation, 0, 1, 0); // Add rotation
    roof1.matrix.translate(3.5, -.5, .74);
    roof1.matrix.scale(7, 4, 6);
    roof1.matrix.translate(-0.5, 0, -0.5);
    roof1.matrix.rotate(45, 0, 0, 1);
    roof1.render();

    // Door and windows similarly updated with rotation
    var door = new Cube();
    door.color = [0.4, 0.2, 0.0, 1.0];
    door.textureNum = 9;
    door.matrix = new Matrix4();
    door.matrix.translate(this.position.x, this.position.y - 1, this.position.z - 10);
    door.matrix.rotate(this.rotation, 0, 1, 0); // Add rotation
    door.matrix.translate(-1.25, 0, 3.4);
    door.matrix.scale(2.5, 5, 0.5);
    door.render();

    var window1 = new Cube();
    window1.color = [0.8, 0.9, 1.0, 1.0];
    window1.textureNum = 10;
    window1.matrix = new Matrix4();
    window1.matrix.translate(this.position.x, this.position.y + 3.75, this.position.z - 10);
    window1.matrix.rotate(this.rotation, 0, 1, 0); // Add rotation
    window1.matrix.translate(-3.75, 0, 3.3);
    window1.matrix.scale(2, 2, 0.5);
    window1.render();

    var window2 = new Cube();
    window2.color = [0.8, 0.9, 1.0, 1.0];
    window2.textureNum = 10;
    window2.matrix = new Matrix4();
    window2.matrix.translate(this.position.x, this.position.y + 3.75, this.position.z - 10);
    window2.matrix.rotate(this.rotation, 0, 1, 0); // Add rotation
    window2.matrix.translate(1.75, 0, 3.3);
    window2.matrix.scale(2, 2, 0.5);
    window2.render();
  }
}