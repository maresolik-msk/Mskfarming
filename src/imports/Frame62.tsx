import svgPaths from "./svg-e5rwwffqw7";

function Group() {
  return (
    <div className="absolute inset-[13.75%_19.41%_14.34%_19.38%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.4264 25.1669">
        <g id="Group 1">
          <path d={svgPaths.p33acc980} fill="var(--fill-0, #810F37)" id="Vector" />
          <path d={svgPaths.p11110080} fill="var(--fill-0, #810F37)" id="Vector_2" />
          <path d={svgPaths.p2c30eb70} fill="var(--fill-0, #810F37)" id="Vector_3" />
          <path d={svgPaths.p2e86fb80} fill="var(--fill-0, #810F37)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="overflow-clip relative shrink-0 size-[35px]" data-name="Logo 3">
      <Group />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[2px] items-center justify-center p-[4px] relative size-full">
          <Logo />
          <p className="font-['Kugile:Regular',sans-serif] h-[19px] leading-[normal] not-italic relative shrink-0 text-[#810f37] text-[14px] text-center tracking-[3px] w-[50px]">MILA</p>
        </div>
      </div>
    </div>
  );
}