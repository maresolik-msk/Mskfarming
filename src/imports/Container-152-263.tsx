import svgPaths from "./svg-swme7hcgbg";

function Group1() {
  return (
    <div className="absolute contents inset-[0_0_0.01%_0]">
      <div className="absolute inset-[15.99%_0_0_8.13%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.4958 24.1674">
          <path d={svgPaths.p8b33c00} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[15.97%_61.35%_44.44%_0]" data-name="Vector_2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.46366 11.3891">
          <path d={svgPaths.p2b024500} fill="var(--fill-0, white)" id="Vector_2" />
        </svg>
      </div>
      <div className="absolute inset-[41.43%_42.6%_45.97%_42.34%]" data-name="Vector_3">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.68794 3.6249">
          <path d={svgPaths.p2eccbe00} fill="var(--fill-0, white)" id="Vector_3" />
        </svg>
      </div>
      <div className="absolute inset-[0_45.5%_93.64%_47.03%]" data-name="Vector_4">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.82824 1.82874">
          <path d={svgPaths.p23f64600} fill="var(--fill-0, white)" id="Vector_4" />
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[28.768px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group1 />
    </div>
  );
}

function Group() {
  return (
    <div className="content-stretch flex flex-col h-[28.769px] items-start relative shrink-0 w-[24.487px]" data-name="Group">
      <Icon />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center p-[4px] relative shrink-0 size-[32px]">
      <Group />
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[18px] relative shrink-0 w-[56px]">
      <p className="absolute font-['Kugile:Regular',sans-serif] h-[18px] leading-[normal] left-[28px] not-italic text-[16px] text-center text-white top-0 tracking-[3px] translate-x-[-50%] w-[56px]">MILA</p>
    </div>
  );
}

export default function Container() {
  return (
    <div className="relative size-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[8px] py-[5px] relative size-full">
          <Frame1 />
          <Frame />
        </div>
      </div>
    </div>
  );
}