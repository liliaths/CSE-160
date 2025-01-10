let canvas, ctx;

function main() {
  canvas = document.getElementById('example');
  if(!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  ctx = canvas.getContext('2d');

  //ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, 400, 400);

  //var v1 = new Vector3([1, 2, 0.0]);

  //drawVector(v1, "red");
  

}

function drawVector(v, color) {
  ctx.strokeStyle = color;
  const x = v.elements[0] * 20;
  const y = v.elements[1] * 20;
  ctx.beginPath();
  ctx.moveTo(200, 200);
  ctx.lineTo(200 + x, 200 - y);
  ctx.stroke();
}

function handleDrawEvent() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, 400, 400);

  var x = parseFloat(document.getElementById('inputField1').value);
  var y = parseFloat(document.getElementById('inputField2').value);
  var x2 = parseFloat(document.getElementById('inputField3').value);
  var y2 = parseFloat(document.getElementById('inputField4').value);

  var v1 = new Vector3([x, y, 0.0]);
  var v2 = new Vector3([x2, y2, 0.0]);

  drawVector(v1, "red");
  drawVector(v2, "blue");
  
}

function handleDrawOperationEvent() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, 400, 400);
  
  var x = parseFloat(document.getElementById('inputField1').value);
  var y = parseFloat(document.getElementById('inputField2').value);
  var x2 = parseFloat(document.getElementById('inputField3').value);
  var y2 = parseFloat(document.getElementById('inputField4').value);
  var scalar = parseFloat(document.getElementById('inputField5').value);
  var operation = document.getElementById('operation').value;

  var v1 = new Vector3([x, y, 0.0]);
  var v2 = new Vector3([x2, y2, 0.0]);

  
  drawVector(v1, "red");
  drawVector(v2, "blue");

  
  if (operation === "add") {

    var v3 = new Vector3(v1.elements).add(v2);
    drawVector(v3, "green");
  } else if (operation === "subtract") {

    var v3 = new Vector3(v1.elements).sub(v2);
    drawVector(v3, "green");

  } else if (operation === "multiply") {

    var v3 = new Vector3(v1.elements).mul(scalar);
    var v4 = new Vector3(v2.elements).mul(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");

  } else if (operation === "divide") {
    
    var v3 = new Vector3(v1.elements).div(scalar);
    var v4 = new Vector3(v2.elements).div(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");

  } else if (operation == "magnitude") {

    console.log("Magnitude v1: " + v1.magnitude());
    console.log("Magnitude v2: " + v2.magnitude());

  } else if (operation == "normalize") {

    var v3 = new Vector3(v1.elements).normalize();
    var v4 = new Vector3(v2.elements).normalize();
    drawVector(v3, "green");
    drawVector(v4, "green");

  } else if (operation == "angleBetween") {

    console.log("Angle: " + angleBetween(v1, v2));

  } else if (operation == "area") {

    console.log("Area of the triangle: " + areaTriangle(v1, v2));

  }
   
}

function angleBetween(v1, v2) {
  const dotProduct = Vector3.dot(v1, v2);

  const magV1 = v1.magnitude();
  const magV2 = v2.magnitude();

  const cosAlpha = dotProduct / (magV1 * magV2);
  const angle = Math.acos(cosAlpha);
  const angleDegree = angle * (180/Math.PI);

  return angleDegree;
}

function areaTriangle(v1, v2) {
  const crossProduct = Vector3.cross(v1, v2);

  const area = crossProduct.magnitude() / 2;

  return area;



}