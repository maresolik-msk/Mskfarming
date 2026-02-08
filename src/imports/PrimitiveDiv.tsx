import svgPaths from "./svg-y0vxljn34d";

function Group1() {
  return (
    <div className="absolute contents inset-0">
      <div className="absolute inset-[15.99%_0_0_8.13%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9997 19.3422">
          <path d={svgPaths.p3ee76700} fill="var(--fill-0, #812F0F)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[15.97%_61.35%_44.44%_0]" data-name="Vector_2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.57222 9.11516">
          <path d={svgPaths.p3b84f072} fill="var(--fill-0, #812F0F)" id="Vector_2" />
        </svg>
      </div>
      <div className="absolute inset-[41.43%_42.6%_45.97%_42.34%]" data-name="Vector_3">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.95086 2.90115">
          <path d={svgPaths.pc31e680} fill="var(--fill-0, #812F0F)" id="Vector_3" />
        </svg>
      </div>
      <div className="absolute inset-[0_45.5%_93.64%_47.03%]" data-name="Vector_4">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.46284 1.46362">
          <path d={svgPaths.p28b1e800} fill="var(--fill-0, #812F0F)" id="Vector_4" />
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[23.025px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[23.025px] items-start left-[14.19px] top-[12.38px] w-[19.593px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[47.989px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container3 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[31.985px] relative shrink-0 w-[48.329px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Megrim:Medium',sans-serif] leading-[32px] left-0 not-italic text-[#2a0f05] text-[24px] top-[1.1px]">MILA</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[47.989px] relative shrink-0 w-[108.309px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.991px] items-center relative size-full">
        <Container2 />
        <Text />
      </div>
    </div>
  );
}

function PrimitiveH() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[267.238px]" data-name="Primitive.h2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col h-[75px] items-center justify-center left-[-0.42px] p-[12px] top-0 w-[300px]" data-name="Container">
      <PrimitiveH />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute bg-[#eed5cb] content-stretch flex h-[24px] items-center left-0 px-[12px] py-px top-0 w-[299px]" data-name="Container">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[10px] text-[rgba(51,44,44,0.7)] tracking-[1.5px] uppercase">Navigation</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[9.38%_6.25%_12.42%_6.25%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 18.7683">
        <g id="Group">
          <path d={svgPaths.p3eec5a00} fill="var(--fill-0, white)" id="Vector" opacity="0.2" />
          <path d={svgPaths.p20707f00} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function PhFarmDuotone() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ph:farm-duotone">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Group />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="relative shrink-0 w-[42px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[16px] relative w-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] not-italic relative shrink-0 text-[15px] text-center text-white">Home</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#812f0f] content-stretch flex gap-[16px] h-[54.476px] items-center left-1/2 pl-[19.993px] top-[38.98px] w-[299.223px]" data-name="Button">
      <PhFarmDuotone />
      <Text1 />
    </div>
  );
}

function MdiPlant() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mdi:plant">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mdi:plant">
          <path d={svgPaths.p2ac62300} id="Vector" stroke="var(--stroke-0, black)" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[22.491px] relative shrink-0 w-[103.399px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-[52px] not-italic text-[#2a0f05] text-[15px] text-center top-[-1.45px]">Crop Manager</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54.476px] items-center left-0 pl-[19.993px] top-[101.45px] w-[299.223px]" data-name="Button">
      <MdiPlant />
      <Text2 />
    </div>
  );
}

function SolarWalletBoldDuotone() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="solar:wallet-bold-duotone">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="solar:wallet-bold-duotone">
          <path d={svgPaths.p5a56000} fill="var(--fill-0, #2A0F05)" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.pefb70} fill="var(--fill-0, #2A0F05)" fillRule="evenodd" id="Vector_2" />
          <path d={svgPaths.p7fc9480} fill="var(--fill-0, #2A0F05)" id="Vector_3" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[22.491px] relative shrink-0 w-[70.383px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-[35.5px] not-italic text-[#2a0f05] text-[15px] text-center top-[-1.45px]">Expenses</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54.476px] items-center left-0 pl-[19.993px] rounded-[16px] top-[163.91px] w-[299.223px]" data-name="Button">
      <SolarWalletBoldDuotone />
      <Text3 />
    </div>
  );
}

function FluentPerson16Filled() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="fluent:person-16-filled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="fluent:person-16-filled">
          <path d={svgPaths.p195e7ef0} id="Vector" stroke="var(--stroke-0, #2A0F05)" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[22.491px] relative shrink-0 w-[47.068px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-[24.5px] not-italic text-[#2a0f05] text-[15px] text-center top-[-1.45px]">Profile</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54.476px] items-center left-0 pl-[19.993px] rounded-[16px] top-[226.38px] w-[299.223px]" data-name="Button">
      <FluentPerson16Filled />
      <Text4 />
    </div>
  );
}

function Container6() {
  return <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0)] h-[0.994px] left-0 to-[rgba(0,0,0,0)] top-[312.84px] via-1/2 via-[rgba(129,47,15,0.15)] w-[299.223px]" data-name="Container" />;
}

function Container7() {
  return (
    <div className="absolute h-[14.998px] left-0 top-[345.82px] w-[299.223px]" data-name="Container">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[15px] left-[11.99px] not-italic text-[10px] text-[rgba(107,92,92,0.7)] top-[0.55px] tracking-[1.5px] uppercase">farming tools</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[12.5%]" data-name="Group">
      <div className="absolute inset-[-4.17%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5 19.5">
          <g id="Group">
            <path d={svgPaths.p37f6d900} fill="var(--fill-0, #2A0F05)" fillOpacity="0.16" id="Vector" />
            <path d={svgPaths.p35b6400} id="Vector_2" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function SiSearchDuotone() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="si:search-duotone">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Group2 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[22.491px] relative shrink-0 w-[103.277px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-[52px] not-italic text-[#2a0f05] text-[15px] text-center top-[-1.45px]">Field Scouting</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54.476px] items-center left-0 pl-[19.993px] rounded-[16px] top-[384.8px] w-[299.223px]" data-name="Button">
      <SiSearchDuotone />
      <Text5 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[19.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9935 19.9935">
        <g clipPath="url(#clip0_312_741)" id="Icon">
          <path d={svgPaths.p3d27e100} id="Vector" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d={svgPaths.p130ddf80} id="Vector_2" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d="M9.99673 9.16367H13.329" id="Vector_3" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d="M9.99673 13.329H13.329" id="Vector_4" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d="M6.66448 9.16367H6.67282" id="Vector_5" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d="M6.66448 13.329H6.67282" id="Vector_6" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
        </g>
        <defs>
          <clipPath id="clip0_312_741">
            <rect fill="white" height="19.9935" width="19.9935" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[22.491px] relative shrink-0 w-[131.709px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-[66px] not-italic text-[#2a0f05] text-[15px] text-center top-[-1.45px]">Input Applications</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54.476px] items-center left-0 pl-[19.993px] rounded-[16px] top-[447.26px] w-[299.223px]" data-name="Button">
      <Icon1 />
      <Text6 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[19.993px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9935 19.9935">
        <g clipPath="url(#clip0_312_698)" id="Icon">
          <path d={svgPaths.p3dbd4000} id="Vector" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d={svgPaths.p21280400} id="Vector_2" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d={svgPaths.p3c9e5480} id="Vector_3" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d={svgPaths.p33398900} id="Vector_4" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d={svgPaths.p2183a380} id="Vector_5" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d={svgPaths.p7729680} id="Vector_6" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d={svgPaths.p2afea000} id="Vector_7" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
          <path d={svgPaths.p63fdd00} id="Vector_8" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
        </g>
        <defs>
          <clipPath id="clip0_312_698">
            <rect fill="white" height="19.9935" width="19.9935" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[22.491px] relative shrink-0 w-[120.276px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22.5px] left-[60.5px] not-italic text-[#2a0f05] text-[15px] text-center top-[-1.45px]">Harvest Records</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[54.476px] items-center left-0 pl-[19.993px] rounded-[16px] top-[509.73px] w-[299.223px]" data-name="Button">
      <Icon2 />
      <Text7 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[15.992px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9923 15.9923">
        <g id="Icon">
          <path d={svgPaths.p2d5ed80} id="Vector" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33269" />
          <path d={svgPaths.p17e64d80} id="Vector_2" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33269" />
          <path d="M13.9933 7.99617H5.99713" id="Vector_3" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33269" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[24.007px] relative shrink-0 w-[60.199px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[30.5px] not-italic text-[#fb2c36] text-[16px] text-center top-[-1.45px]">Log Out</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[47.989px] items-center left-0 pl-[19.993px] top-[604.19px] w-[299.223px]" data-name="Button">
      <Icon3 />
      <Text8 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[684.179px] left-[-0.42px] top-[84px] w-[299.223px]" data-name="Container">
      <Container5 />
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <Container6 />
      <Container7 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[15.992px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.32887 9.32887">
            <path d={svgPaths.p157f00} id="Vector" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33269" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.32887 9.32887">
            <path d={svgPaths.pd72fcc0} id="Vector" stroke="var(--stroke-0, #2A0F05)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33269" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[267.58px] opacity-70 rounded-[2px] size-[15.992px] top-[31px]" data-name="Primitive.button">
      <Icon4 />
    </div>
  );
}

export default function PrimitiveDiv() {
  return (
    <div className="bg-[rgba(255,255,255,0.95)] border-[rgba(255,255,255,0.1)] border-l-[0.776px] border-solid relative shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-full" data-name="Primitive.div">
      <Container />
      <Container4 />
      <PrimitiveButton />
    </div>
  );
}