import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="cover"
      onClick={() => router.push("/booth")}
    >
      {/* Full-screen photobooth cover */}
      <img
        src="/cover.png"
        alt="Fotoautomatic"
        className="cover-image"
      />
    </div>
  );
}
