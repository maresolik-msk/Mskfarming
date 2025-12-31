import svgPaths from "./svg-1h70b4npco";

function Group() {
  return (
    <div className="absolute inset-[13.75%_19.41%_14.34%_19.38%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 97.9493 115.049">
        <g id="Group 1">
          <path d={svgPaths.p25773930} fill="var(--fill-0, #0F8144)" id="Vector" />
          <path d={svgPaths.p520900} fill="var(--fill-0, #0F8144)" id="Vector_2" />
          <path d={svgPaths.pc808840} fill="var(--fill-0, #0F8144)" id="Vector_3" />
          <path d={svgPaths.p34d7f8f0} fill="var(--fill-0, #0F8144)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="overflow-clip relative shrink-0 size-[160px]" data-name="Logo 3">
      <Group />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center relative size-full">
      <Logo />
      <p className="font-['Kugile:Regular',sans-serif] h-[114px] leading-[normal] not-italic relative shrink-0 text-[#0f8144] text-[99.474px] text-center tracking-[9px] w-[321px]">MILA</p>
    </div>
  );
}