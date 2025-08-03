const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const textLayer = document.getElementById("text-layer");

let image = new Image();
let originalImage = null;
let cropStart = null;
let cropRect = null;
let angle = 0;
let flipH = 1, flipV = 1;

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      drawImage();
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function drawImage() {
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(flipH, flipV);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.restore();
}

function rotate(deg) {
  angle = (angle + deg) % 360;
  drawImage();
}

function flip(direction) {
  if (direction === "horizontal") flipH *= -1;
  if (direction === "vertical") flipV *= -1;
  drawImage();
}

function startCrop() {
  canvas.style.cursor = "crosshair";
  canvas.onmousedown = (e) => {
    const rect = canvas.getBoundingClientRect();
    cropStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    canvas.onmouseup = (e2) => {
      const x2 = e2.clientX - rect.left;
      const y2 = e2.clientY - rect.top;
      cropRect = {
        x: Math.min(cropStart.x, x2),
        y: Math.min(cropStart.y, y2),
        w: Math.abs(cropStart.x - x2),
        h: Math.abs(cropStart.y - y2)
      };
      ctx.strokeStyle = "red";
      ctx.strokeRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
      canvas.onmousedown = null;
    };
  };
}

function applyCrop() {
  if (!cropRect) return;
  const cropped = ctx.getImageData(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
  canvas.width = cropRect.w;
  canvas.height = cropRect.h;
  ctx.putImageData(cropped, 0, 0);
  cropRect = null;
}

function addText() {
  const text = prompt("Enter text:");
  if (!text) return;
  const div = document.createElement("div");
  div.textContent = text;
  div.className = "text-box";
  div.style.left = "50px";
  div.style.top = "50px";
  makeDraggable(div);
  textLayer.appendChild(div);
}

function addSticker() {
  const emoji = prompt("Enter emoji:");
  if (!emoji) return;
  const div = document.createElement("div");
  div.textContent = emoji;
  div.className = "emoji";
  div.style.left = "100px";
  div.style.top = "100px";
  makeDraggable(div);
  textLayer.appendChild(div);
}

function makeDraggable(el) {
  let offsetX, offsetY;
  el.onmousedown = function (e) {
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    document.onmousemove = function (e2) {
      el.style.left = e2.pageX - canvas.offsetLeft - offsetX + "px";
      el.style.top = e2.pageY - canvas.offsetTop - offsetY + "px";
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

function downloadImage() {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);

  // Draw text/stickers
  textLayer.childNodes.forEach((node) => {
    tempCtx.font = "24px Arial";
    tempCtx.fillText(node.textContent, parseInt(node.style.left), parseInt(node.style.top));
  });

  const link = document.createElement("a");
  link.download = "edited-photo.png";
  link.href = tempCanvas.toDataURL();
  link.click();
}

function reset() {
  angle = 0;
  flipH = 1;
  flipV = 1;
  textLayer.innerHTML = "";
  if (image.src) drawImage();
}
