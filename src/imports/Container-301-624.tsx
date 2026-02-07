import svgPaths from "./svg-j45bkupks";

function Group() {
  return (
    <div className="absolute contents inset-0">
      <div className="absolute inset-[15.99%_0_0_8.13%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.9993 48.33">
          <path d={svgPaths.p32afe600} fill="var(--fill-0, #812F0F)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[15.97%_61.35%_44.44%_0]" data-name="Vector_2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.9305 22.7759">
          <path d={svgPaths.p2698ae00} fill="var(--fill-0, #812F0F)" id="Vector_2" />
        </svg>
      </div>
      <div className="absolute inset-[41.43%_42.6%_45.97%_42.34%]" data-name="Vector_3">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.37714 7.24907">
          <path d={svgPaths.p353d0180} fill="var(--fill-0, #812F0F)" id="Vector_3" />
        </svg>
      </div>
      <div className="absolute inset-[0_45.5%_93.64%_47.03%]" data-name="Vector_4">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.65711 3.65712">
          <path d={svgPaths.p2df16780} fill="var(--fill-0, #812F0F)" id="Vector_4" />
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[57.531px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col h-[57.531px] items-start relative shrink-0 w-[48.983px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex items-center px-[9px] py-[5px] relative rounded-[16px] shrink-0" data-name="Container">
      <Container2 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[24px] relative shrink-0 w-[89px]" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute font-['Kugile:Regular',sans-serif] h-[23px] leading-[36px] left-[calc(50%+0.5px)] not-italic text-[#2a0f05] text-[30px] text-center top-[calc(50%-11.14px)] w-[88px] whitespace-pre-wrap">MILA</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex h-[69px] items-center justify-center relative shrink-0">
      <Container1 />
      <Heading />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex items-center justify-center pl-[20px] relative shrink-0" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[32.651px] not-italic relative shrink-0 text-[#110601] text-[20.093px] text-center">Your Farm Friend</p>
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center px-[24px] relative size-full" data-name="Container">
      <Frame />
      <Paragraph />
    </div>
  );
}