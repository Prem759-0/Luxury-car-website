# Koenigsegg Jesko | The Art of Speed

A highly cinematic, ultra-premium web experience built to showcase the Koenigsegg Jesko. 

## 🌟 Features
- **Scroll-Linked 360° Videos:** Features 3 distinct hypercar editions (Pure White, Apex Red, Stealth Black), using GSAP ScrollTrigger to tie hundreds of high-res image frames to the user's scroll.
- **Cinematic Pre-loader:** Custom "Ignition Sequence" that pre-loads over 720 images with a glowing progress bar and percentage tracker.
- **Magnetic UX:** High-end magnetic button physics that pull towards the user's cursor.
- **Fullscreen Frosted Menu:** An elegant, blurred overlay navigation system.
- **Horizontal 3D Gallery:** A massive horizontal scroll track featuring GSAP-powered image parallax.
- **Performance Modal:** Animated data-bars revealing the extreme specifications of the car.
- **Responsive:** Fluid typography (`clamp()`) and smart image scaling (`object-fit: cover`) to look stunning on both 4K monitors and mobile phones.

## 🛠 Tech Stack
- **HTML5 & CSS3:** Pure, semantic, and highly optimized styling.
- **Vanilla JavaScript:** Zero bloated frameworks.
- **GSAP:** GreenSock Animation Platform for scroll-linked sequences and staggering text.
- **Lenis:** Extremely smooth inertia scrolling engine.

## 🚀 Quick Start (Local Development)
1. Clone the repository: `git clone https://github.com/Prem759-0/Luxury-car-website.git`
2. Run a local server (e.g. `npx serve` or Python's `python -m http.server 8080`)
3. Open `http://localhost:8080` in your browser.

## 📦 Vercel Deployment
This project is pre-configured for instant Vercel deployment via the Build Output API.
- `package.json` contains a custom build script.
- `vercel.json` maps the output directory to `out/`.
- Deploy directly from GitHub to Vercel with zero configuration needed.
