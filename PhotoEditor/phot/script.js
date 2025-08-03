const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let originalImage = null;

const upload = document.getElementById('upload');
upload.addEventListener('change', (e) => {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const grayscale = document.getElementById('grayscale');
const sepia = document.getElementById('sepia');
const blur = document.getElementById('blur');

const reset = document.getElementById('reset');
const download = document.getElementById('download');

const filters = [brightness, contrast, grayscale, sepia, blur];
filters.forEach(input => input.addEventListener('input', applyFilters));

reset.addEventListener('click', () => {
  if (originalImage) {
    ctx.putImageData(originalImage, 0, 0);
    filters.forEach(f => {
      if (f.id === 'brightness' || f.id === 'contrast') f.value = 100;
      else f.value = 0;
    });
    applyFilters();
  }
});

download.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'edited-photo.png';
  link.href = canvas.toDataURL();
  link.click();
});

function applyFilters() {
  if (!originalImage) return;

  ctx.putImageData(originalImage, 0, 0);

  canvas.style.filter = `
    brightness(${brightness.value}%)
    contrast(${contrast.value}%)
    grayscale(${grayscale.value}%)
    sepia(${sepia.value}%)
    blur(${blur.value}px)
  `;
}
