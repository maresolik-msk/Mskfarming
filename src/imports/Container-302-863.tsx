import svgPaths from "./svg-691sjzzn6q";

function Group() {
  return (
    <div className="absolute contents inset-0">
      <div className="absolute inset-[15.99%_0_0_8.13%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.4998 14.5041">
          <path d={svgPaths.p47db300} fill="var(--fill-0, #8C3412)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[15.97%_61.35%_44.44%_0]" data-name="Vector_2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.67916 6.83517">
          <path d={svgPaths.p26822580} fill="var(--fill-0, #8C3412)" id="Vector_2" />
        </svg>
      </div>
      <div className="absolute inset-[41.43%_42.6%_45.97%_42.34%]" data-name="Vector_3">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.21314 2.17548">
          <path d={svgPaths.p2e28bd80} fill="var(--fill-0, #8C3412)" id="Vector_3" />
        </svg>
      </div>
      <div className="absolute inset-[0_45.5%_93.64%_47.03%]" data-name="Vector_4">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.09713 1.09752">
          <path d={svgPaths.p3fcf6900} fill="var(--fill-0, #8C3412)" id="Vector_4" />
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[17.265px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col h-[17.265px] items-start relative shrink-0 w-[14.695px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[38px] items-center justify-center relative rounded-[26037400px] shrink-0 w-[39px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.776px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[26037400px]" />
      <Container4 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#8c3412] text-[10px] tracking-[1px] uppercase">mila</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[11.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9912 11.9912">
        <g id="Icon">
          <path d={svgPaths.p20a67d40} id="Vector" stroke="var(--stroke-0, #6B5C5C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999269" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-[#ebe6df] content-stretch flex items-center justify-center left-[123.65px] rounded-[26037400px] size-[19.993px] top-[4px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Button() {
  return (
    <div className="h-[28.008px] relative shrink-0 w-full" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-[58px] not-italic text-[#2a0f05] text-[18px] text-center top-[0.1px]">Tuvva Chenu</p>
      <Container6 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col h-[44.994px] items-center justify-center relative shrink-0 w-[143.64px]" data-name="Container">
      <Button />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[5px] items-center relative">
        <Container3 />
        <Container5 />
      </div>
    </div>
  );
}

function IcRoundMenu() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ic:round-menu">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ic:round-menu">
          <path d={svgPaths.p1050ff80} fill="var(--fill-0, #893211)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center py-[8px] relative w-full">
        <IcRoundMenu />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex h-[44.994px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container7 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start pb-[0.776px] pt-[11.991px] px-[15.992px] relative size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(129,47,15,0.15)] border-b-[0.776px] border-solid inset-0 pointer-events-none" />
      <Container1 />
    </div>
  );
}