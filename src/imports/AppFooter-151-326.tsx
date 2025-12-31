import svgPaths from "./svg-7e64h2v130";
import imgFooterIllustrstion1 from "figma:asset/172b9bdf4429e9780a0743b76be1fdd2d87b53b5.png";
import { RainEffect } from "../app/components/RainEffect";
import ImportedContainer from "./Container";
import ImportedConnectSection from "./Container-152-301";

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
    <div className="absolute content-stretch flex flex-col h-[28.769px] items-start left-[7.75px] top-[5.49px] w-[24.487px]" data-name="Group">
      <Icon />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute content-stretch flex h-[18.995px] items-start left-[51.98px] top-[10.5px] w-[49.989px]" data-name="Paragraph">
      <p className="font-['Kugile:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[3px]">MILA</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[39.991px] relative shrink-0 w-full" data-name="Container">
      <Group />
      <Paragraph />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[98px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute bg-clip-text font-['Clash_Display_Variable:Medium',sans-serif] font-medium leading-[54px] left-0 text-[48px] text-[rgba(0,0,0,0)] top-[4.72px] tracking-[-2.4px] w-[339px]" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.4) 100%)" }}>
        <span>{`Smart Farming. `}</span>
        <span className="font-['Clash_Display_Variable:Light',sans-serif] font-light">Zero Waste.</span>
      </p>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] h-[49.647px] left-0 top-0 w-[344.88px]" data-name="Email Input">
      <div className="content-stretch flex items-center overflow-clip px-[24px] py-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.2)] text-nowrap">Enter your email</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.843px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white h-[47.974px] left-0 shadow-[0px_0px_20px_-5px_rgba(255,255,255,0.3)] top-[65.64px] w-[188.8px]" data-name="Button">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[94.5px] not-italic text-[#812f0f] text-[16px] text-center text-nowrap top-[10.67px] translate-x-[-50%]">Join Community</p>
    </div>
  );
}

function Form() {
  return (
    <div className="h-[113.612px] relative shrink-0 w-[344.88px]" data-name="Form">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <EmailInput />
        <Button />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[31.982px] h-[204.054px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-['Mplus_1p:Light',sans-serif] leading-[26px] min-w-full not-italic relative shrink-0 text-[18px] text-[rgba(255,255,255,0.7)] w-[min-content]">Empowering Indian farmers with data-driven insights.</p>
      <Form />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[406px] relative shrink-0 w-[345px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[31.996px] items-start relative size-full">
        <div className="h-[39.991px] relative shrink-0 w-full">
          <ImportedContainer />
        </div>
        <Heading1 />
        <Container1 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-[0.84px] tracking-[1.2px] uppercase">Platform</p>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute h-[19.996px] left-0 top-0 w-[148.44px]" data-name="Link">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-nowrap top-[-0.16px] tracking-[0.35px] uppercase">How it Works</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[19.996px] relative shrink-0 w-full" data-name="List Item">
      <Link />
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute h-[19.996px] left-0 top-0 w-[148.44px]" data-name="Link">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-nowrap top-[-0.16px] tracking-[0.35px] uppercase">Features</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[19.996px] relative shrink-0 w-full" data-name="List Item">
      <Link1 />
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute h-[19.996px] left-0 top-0 w-[148.44px]" data-name="Link">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-nowrap top-[-0.16px] tracking-[0.35px] uppercase">Impact</p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[19.996px] relative shrink-0 w-full" data-name="List Item">
      <Link2 />
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute h-[19.996px] left-0 top-0 w-[148.44px]" data-name="Link">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-nowrap top-[-0.16px] tracking-[0.35px] uppercase">Communities</p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[19.996px] relative shrink-0 w-full" data-name="List Item">
      <Link3 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[15.992px] h-[127.957px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[23.986px] h-[167.935px] items-start left-0 top-0 w-[148.44px]" data-name="Container">
      <Heading2 />
      <List />
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.6)] text-nowrap top-[0.84px] tracking-[1.2px] uppercase">Company</p>
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute h-[19.996px] left-0 top-0 w-[148.453px]" data-name="Link">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-nowrap top-[-0.16px] tracking-[0.35px] uppercase">About Us</p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[19.996px] relative shrink-0 w-full" data-name="List Item">
      <Link4 />
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute h-[19.996px] left-0 top-0 w-[148.453px]" data-name="Link">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[14px] text-[rgba(255,255,255,0.4)] text-nowrap top-[-0.16px] tracking-[0.35px] uppercase">Contact</p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[19.996px] relative shrink-0 w-full" data-name="List Item">
      <Link5 />
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[15.992px] h-[55.983px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem4 />
      <ListItem5 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[23.986px] h-[167.935px] items-start left-[196.43px] top-0 w-[148.453px]" data-name="Container">
      <Heading3 />
      <List1 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[23.986px] h-[73.647px] items-start left-0 top-[215.92px] w-[148.44px]" data-name="Container">
      <ImportedConnectSection />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[289.569px] relative shrink-0 w-[344.88px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container3 />
        <Container4 />
        <Container5 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] h-[775.973px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container6 />
    </div>
  );
}

function Button5() {
  return (
    <div className="h-[24px] relative shrink-0 w-[231.136px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[16px] text-[rgba(255,255,255,0.4)] text-nowrap top-[-0.47px]">PRIVACY POLICY</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[24px] relative shrink-0 w-[231.136px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[16px] text-[rgba(255,255,255,0.4)] text-nowrap top-[-0.47px]">TERMS OF SERVICE</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-[231.136px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] top-[0.84px] w-[232px]">© 2025 MILA</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[95.974px] relative shrink-0 w-[231.136px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[15.991px] items-start relative size-full">
        <Button5 />
        <Button6 />
        <Text />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[15.991px] left-[109.12px] opacity-[0.503] top-0 w-[79.456px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#ff7640] text-[12px] text-nowrap top-[0.84px]">OPERATIONAL</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[15.991px] relative shrink-0 w-[188.576px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.4)] text-nowrap top-[0.84px]">SYSTEM STATUS:</p>
        <Text1 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col h-[135.952px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[17.862px] relative shadow-[0px_1px_4px_0px_rgba(0,0,0,0.15)] shrink-0 w-full" data-name="Paragraph">
      <p className="absolute bg-clip-text font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17.875px] left-[172.71px] not-italic text-[11px] text-[rgba(0,0,0,0)] text-center text-nowrap top-[0.53px] tracking-[4.4px] translate-x-[-50%] uppercase" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 198, 179, 0.8) 50%, rgba(255, 255, 255, 0.2) 100%)" }}>
        Product by MARESOLIK INC.
      </p>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-full" data-name="Heading 1">
      <p className="font-['Merriweather:Bold',sans-serif] leading-[56.571px] not-italic relative shrink-0 text-[70.714px] text-[rgba(255,255,255,0.04)] text-center text-nowrap tracking-[-3.5357px]">MILA</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[63.992px] h-[371.185px] items-center justify-center pb-0 pt-[48.83px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.843px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Container10 />
      <Paragraph1 />
      <Heading />
    </div>
  );
}

export default function AppFooter() {
  return (
    <div className="bg-[#812f0f] relative w-full" data-name="AppFooter">
      <div className="absolute bottom-0 h-[370px] left-1/2 translate-x-[-50%] w-[393px] pointer-events-none" data-name="Footer illustrstion 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgFooterIllustrstion1} />
      </div>
      <RainEffect />
      <div className="relative content-stretch flex flex-col gap-[47px] items-center px-[16px] py-[24px] w-full max-w-[392.854px] mx-auto" data-name="Container">
        <Container7 />
        <Container11 />
      </div>
    </div>
  );
}