export default function buildStrip(images) {
    const WIDTH = 400;
    const HEIGHT = 300;
    const GAP = 2;
  
    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = images.length * HEIGHT + (images.length - 1) * GAP;
  
    const ctx = canvas.getContext("2d");
  
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    images.forEach((img, i) => {
      const y = i * (HEIGHT + GAP);
  
      ctx.putImageData(img, 0, y);
      const imageData = ctx.getImageData(0, y, WIDTH, HEIGHT);
      const d = imageData.data;
  
      for (let p = 0; p < d.length; p += 4) {
        const r = d[p];
        const g = d[p + 1];
        const b = d[p + 2];
  
        // luminance
        let lum = 0.299 * r + 0.587 * g + 0.114 * b;
        let x = lum / 255;

        x = 0.5 + (x-0.5) * 0.88;

        if (x > 0.25 && x < 0.75) {
          x -= 0.08;
        }
  
        // highlight roll-off (prevents blotches)
        if (x > 0.65) {
          x = 0.65 + (x - 0.65) * 0.35;
        }
  
        // film-like contrast curve
        x = x < 0.5
          ? Math.pow(x, 1.22)
          : 1 - Math.pow(1 - x, 1.06);
  
        lum = x * 255;
  
        // 🌞 slightly warmer monochrome (still subtle)
        d[p]     = lum + 15;  // red
        d[p + 1] = lum + 9;  // green
        d[p + 2] = lum - 11;  // blue
      }
  
      ctx.putImageData(imageData, 0, y);
    });
  
    return canvas;
  }
  