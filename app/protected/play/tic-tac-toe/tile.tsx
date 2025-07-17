export default function Tile({ char, isLightMode }: { char: string, isLightMode: boolean }) {
  return (
    <div
      className={`flex flex-col border-2 rounded-lg ${isLightMode && "border-black text-black"} w-20 h-24 text-8xl text-center justify-center hover:cursor-pointer hover:opacity-50`}
    >
      {char}
    </div>
  );
}
