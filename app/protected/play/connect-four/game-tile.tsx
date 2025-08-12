export default function GameTile({ char, isLightMode, r, c, handleClick }: { char: string | null, isLightMode: boolean, r: number, c: number, handleClick: (r: number, c: number) => string | null}) {
  return (
    <div
      className={`flex flex-col border-2 ${isLightMode && "border-black text-black"} w-20 h-16 text-xl text-center justify-center hover:cursor-pointer hover:opacity-50`}
      onClick={() => handleClick(r, c)}
    >
      {char}
    </div>
  );
}
