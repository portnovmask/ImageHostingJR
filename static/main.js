document.addEventListener('DOMContentLoaded', () => {

  const heroImages = [
    'hero-images/hero1.jpeg',
    'hero-images/hero2.jpeg',
    'hero-images/hero3.jpeg',
    'hero-images/hero4.jpeg',
    'hero-images/hero5.jpeg',
    'hero-images/hero6.jpeg',
    'hero-images/hero7.jpeg'
  ];

  const randomIndex = Math.floor(Math.random() * heroImages.length);
  const randomImage = heroImages[randomIndex];

  const heroImageEl = document.getElementById('heroImage');
  if (heroImageEl) {
    heroImageEl.src = randomImage;
  }
});