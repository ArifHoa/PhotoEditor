function getRandomImage() {
  const image = document.getElementById("random-image");
  const randomNumber = Math.floor(Math.random() * 1000); // Random ID
  image.src = `https://picsum.photos/400/300?random=${randomNumber}`;
}
