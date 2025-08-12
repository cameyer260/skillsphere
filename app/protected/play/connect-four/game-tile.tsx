export default function GameTile({
  color,
  isLightMode,
  r,
  c,
  handleClick,
}: {
  color: string | null;
  isLightMode: boolean;
  r: number;
  c: number;
  handleClick: (r: number, c: number) => string | null;
}) {
  return (
    <div
      className={`flex flex-col border-2 ${isLightMode && "border-black text-black"} w-20 h-16 text-xl text-center justify-center hover:cursor-pointer hover:opacity-50 items-center`}
      onClick={() => handleClick(r, c)}
    >
      <div
        className={`w-16 h-16 rounded-full ${color === "red" ? "bg-red-500" : color === "yellow" ? "bg-yellow-500" : ""}`}
      ></div>
    </div>
  );
}
