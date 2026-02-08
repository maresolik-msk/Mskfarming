import svgPaths from "./svg-9v20g2g09i";

function Icon() {
  return (
    <div className="h-[19.993px] overflow-clip relative w-full" data-name="Icon">
      <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6628 6.66448">
            <path d={svgPaths.p134eaf00} id="Vector" stroke="var(--stroke-0, #6B5C5C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[26037400px] shrink-0 size-[35.974px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[7.99px] px-[7.99px] relative size-full">
        <div className="flex h-[19.993px] items-center justify-center relative shrink-0 w-full" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
          <div className="flex-none rotate-90 w-full">
            <Icon />
          </div>
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Merriweather:Bold',sans-serif] leading-[32px] left-[0.03px] not-italic text-[#812f0f] text-[24px] top-[15.86px] w-[246px] whitespace-pre-wrap">{`Budget &  Expenses`}</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[22.746px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-0 not-italic text-[#6b5c5c] text-[14px] top-[1.1px]">{`Track your farm's financial health`}</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[75px] relative shrink-0 w-[234px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[87px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button />
        <Container2 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[15.992px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9923 15.9923">
        <g id="Icon">
          <path d="M3.33174 7.99617H12.6606" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33269" />
          <path d="M7.99617 3.33174V12.6606" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33269" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[24.007px] relative shrink-0 w-[30.99px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[15px] not-italic text-[16px] text-center text-white top-[-1.45px]">Add</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#812f0f] h-[41px] relative rounded-[20px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center justify-center pl-[15.992px] relative size-full">
          <Icon1 />
          <Text />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[126px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Button1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[13.992px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.33%_8.34%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8257 12.8255">
            <path d={svgPaths.p325a6e80} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16598" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_20.83%_62.5%_62.5%]" data-name="Vector">
        <div className="absolute inset-[-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.49795 3.49795">
            <path d={svgPaths.p3bc76280} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16598" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[104.49px] pt-[3.989px] px-[3.989px] rounded-[16px] size-[21.97px] top-[1.02px]" data-name="Button">
      <Icon2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[24.007px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#90a1b9] text-[16px] top-[-1.45px]">Total Budget</p>
      <Button2 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[35.986px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] left-[0.01px] not-italic text-[30px] text-white top-[-0.99px] w-[142px] whitespace-pre-wrap">₹80,000</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[63.981px] relative shrink-0 w-[126.46px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.989px] items-start relative size-full">
        <Container7 />
        <Heading1 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[rgba(0,188,60,0.2)] h-[25.534px] relative rounded-[26037400px] shrink-0 w-[88.497px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.776px] border-[rgba(0,188,125,0.5)] border-solid inset-0 pointer-events-none rounded-[26037400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[12.77px] not-italic text-[#5ee9b5] text-[12px] top-[4.76px] w-[63px] whitespace-pre-wrap">26% USED</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex h-[63.981px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container8 />
    </div>
  );
}

function Container11() {
  return <div className="bg-[#fbe8e0] h-[15.992px] rounded-[26037400px] shrink-0 w-full" data-name="Container" />;
}

function Container10() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] h-[15.992px] relative rounded-[26037400px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[230.21px] relative size-full">
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20.006px] relative shrink-0 w-[96.136px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] left-[0.01px] not-italic text-[#cad5e2] text-[14px] top-[1.04px] w-[104px] whitespace-pre-wrap">
          <span className="font-['Inter:Light',sans-serif] font-light leading-[20px]">Spent:</span>
          <span className="leading-[20px]">{` ₹21,100`}</span>
        </p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20.006px] relative shrink-0 w-[133.698px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#cad5e2] text-[14px] top-[0.55px] w-[134px] whitespace-pre-wrap">Remaining: ₹58,900</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex h-[20.006px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Text1 />
      <Text2 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[7.99px] h-[43.988px] items-start relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container12 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[31.997px] h-[139.966px] items-start left-[23.99px] top-[23.99px] w-[312.669px]" data-name="Container">
      <Container5 />
      <Container9 />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#2c231f] h-[211.95px] overflow-clip relative rounded-[24px] shrink-0 w-full" data-name="Container">
      <Container4 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative size-full">
      <Container />
      <Container3 />
    </div>
  );
}