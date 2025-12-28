import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import buildStrip from "../utils/buildStrip";

export default function Booth() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [flashing, setFlashing] = useState(false);

  // Start hidden camera
  useEffect(() => {
    const video = document.createElement("video");
    video.setAttribute("playsinline", "");
    video.muted = true;
    videoRef.current = video;

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "user", width: 400, height: 300 }
      })
      .then(stream => {
        video.srcObject = stream;
        video.onloadeddata = () => {
          video.play();
          setReady(true);
        };
      });
  }, []);

  // Start once ready
  useEffect(() => {
    if (ready && photos.length === 0) {
      startSequence();
    }
  }, [ready]);

  const startSequence = async () => {
    const ctx = canvasRef.current.getContext("2d");
    const shots = [];

    // initial delay
    await sleep(4000);

    for (let i = 0; i < 4; i++) {
      setFlashing(true);

      await nextPaint();
      await nextPaint();

      ctx.filter = "grayscale(100%) contrast(140%) brightness(112%)";
      ctx.drawImage(videoRef.current, 0, 0, 400, 300);
      ctx.filter = "none";

      shots.push(ctx.getImageData(0, 0, 400, 300));

      setFlashing(false);
      await sleep(2000);
    }

    setPhotos(shots);
  };

  // build strip → download → return home
  useEffect(() => {
    if (photos.length === 4) {
      const strip = buildStrip(photos);

      const link = document.createElement("a");
      link.download = "fotoautomatic.png";
      link.href = strip.toDataURL("image/png");
      link.click();

      setTimeout(() => router.push("/"), 1200);
    }
  }, [photos]);

  return (
    <div className="booth">
      <div className="flash-panel" />
      {flashing && <div className="flash-overlay" />}
      <canvas ref={canvasRef} width={400} height={300} hidden />
    </div>
  );
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function nextPaint() {
  return new Promise(r => requestAnimationFrame(r));
}
