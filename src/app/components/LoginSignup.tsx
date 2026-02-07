import React, { useState } from 'react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { setAuthToken } from '../../lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';
import loginSvgPaths from "../../imports/svg-stnqk53fi4";
import otpSvgPaths from "../../imports/svg-y5h2tipvnv";
import logoSvgPaths from "../../imports/svg-j45bkupks";

// --- Shared Components ---

function BackgroundBlobs() {
  return (
    <>
      <div className="absolute bg-[rgba(129,47,15,0)] blur-[64px] left-[182.2px] rounded-[26037400px] size-[319.992px] top-[-160px]" data-name="Container" />
      <div className="absolute bg-[rgba(245,232,233,0)] blur-[64px] left-[-160px] rounded-[26037400px] size-[319.992px] top-[692.02px]" data-name="Container" />
    </>
  );
}

// --- Login / Mobile Entry Components ---

function FaarmerSvg() {
  return (
    <div className="-translate-x-1/2 absolute bottom-[0.01px] h-[248px] left-[calc(50%+0.04px)] w-[308.714px]" data-name="Faarmer svg">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 308.714 248">
        <g clipPath="url(#clip0_299_3100_login)" id="Faarmer svg">
          {Object.entries(loginSvgPaths).map(([key, d]) => (
            <path key={key} d={d} fill="var(--fill-0, #812F0F)" id={key} />
          ))}
        </g>
        <defs>
          <clipPath id="clip0_299_3100_login">
            <rect fill="white" height="248" width="308.714" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// --- New Login Logo Components ---

function LogoGroup() {
  return (
    <div className="absolute contents inset-0">
      <div className="absolute inset-[15.99%_0_0_8.13%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.9993 48.33">
          <path d={logoSvgPaths.p32afe600} fill="var(--fill-0, #812F0F)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[15.97%_61.35%_44.44%_0]" data-name="Vector_2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.9305 22.7759">
          <path d={logoSvgPaths.p2698ae00} fill="var(--fill-0, #812F0F)" id="Vector_2" />
        </svg>
      </div>
      <div className="absolute inset-[41.43%_42.6%_45.97%_42.34%]" data-name="Vector_3">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.37714 7.24907">
          <path d={logoSvgPaths.p353d0180} fill="var(--fill-0, #812F0F)" id="Vector_3" />
        </svg>
      </div>
      <div className="absolute inset-[0_45.5%_93.64%_47.03%]" data-name="Vector_4">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.65711 3.65712">
          <path d={logoSvgPaths.p2df16780} fill="var(--fill-0, #812F0F)" id="Vector_4" />
        </svg>
      </div>
    </div>
  );
}

function LogoIcon() {
  return (
    <div className="h-[57.531px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <LogoGroup />
    </div>
  );
}

function LogoContainer2() {
  return (
    <div className="content-stretch flex flex-col h-[57.531px] items-start relative shrink-0 w-[48.983px]" data-name="Container">
      <LogoIcon />
    </div>
  );
}

function LogoContainer1() {
  return (
    <div className="content-stretch flex items-center px-[9px] py-[5px] relative rounded-[16px] shrink-0" data-name="Container">
      <LogoContainer2 />
    </div>
  );
}

function LogoHeading() {
  return (
    <div className="h-[24px] relative shrink-0 w-[89px]" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute font-['Kugile:Regular',sans-serif] h-[23px] leading-[36px] left-[calc(50%+0.5px)] not-italic text-[#2a0f05] text-[30px] text-center top-[calc(50%-11.14px)] w-[88px] whitespace-pre-wrap">MILA</p>
    </div>
  );
}

function LogoFrame() {
  return (
    <div className="content-stretch flex h-[69px] items-center justify-center relative shrink-0">
      <LogoContainer1 />
      <LogoHeading />
    </div>
  );
}

function LogoParagraph() {
  return (
    <div className="content-stretch flex items-center justify-center pl-[20px] relative shrink-0" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[32.651px] not-italic relative shrink-0 text-[#110601] text-[20.093px] text-center">Your Farm Friend</p>
    </div>
  );
}

function LoginLogo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center px-[24px] relative size-full" data-name="Container">
      <LogoFrame />
      <LogoParagraph />
    </div>
  );
}

// --- OTP Components ---

function DroneGraphic() {
  return (
    <div className="absolute h-[71.392px] left-[38.12px] top-[688.24px] w-[265.551px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 265.551 71.3917">
        <g clipPath="url(#clip0_300_351)" id="Frame 63">
          <path d={otpSvgPaths.p25418c00} fill="#202021" />
          <path d={otpSvgPaths.p362cc580} fill="#1B1A1C" />
          <path d={otpSvgPaths.p1a12ce00} fill="#383839" />
          <path d={otpSvgPaths.p386b500} fill="#F29671" />
          <path d={otpSvgPaths.p1ccf2000} fill="#F29671" />
          <path d={otpSvgPaths.p2325e00} fill="#F29671" />
          <path d={otpSvgPaths.p1139ff0} fill="#F29671" />
          <path d={otpSvgPaths.p7abe880} fill="#F29671" />
          <path d={otpSvgPaths.p3d945600} fill="#F29671" />
          <path d={otpSvgPaths.p34e2f400} fill="#F29671" />
          <path d={otpSvgPaths.p26148e00} fill="#F29671" />
          <path d={otpSvgPaths.pa8c5800} fill="#FBD0BF" />
          <path d={otpSvgPaths.p3b17c5f0} fill="#FBD0BF" />
          <path d={otpSvgPaths.p24f9c00} fill="#FBD0BF" />
          <path d={otpSvgPaths.p9963280} fill="#FBD0BF" />
          <path d={otpSvgPaths.p1473c400} fill="#FBD0BF" />
          <path d={otpSvgPaths.p16fff300} fill="#FBD0BF" />
          <path d={otpSvgPaths.p3a36ee40} fill="#FBD0BF" />
          <path d={otpSvgPaths.p2d2d9e00} fill="#FBD0BF" />
          <path d={otpSvgPaths.p9ee0e00} fill="#812F0F" />
          <path d={otpSvgPaths.p3bf78600} fill="#FBD0BF" />
          <path d={otpSvgPaths.p331f0500} fill="#FBD0BF" />
          <path d={otpSvgPaths.p15e12c00} fill="#FBD0BF" />
          <path d={otpSvgPaths.p1f0c7d00} fill="#FBD0BF" />
          <path d={otpSvgPaths.p3b79c000} fill="#FBD0BF" />
          <path d={otpSvgPaths.p1b2ddb00} fill="#812F0F" />
          <path d={otpSvgPaths.p3f0a200} fill="#FBD0BF" />
          <path d={otpSvgPaths.p3309c80} fill="#FBD0BF" />
          <path d={otpSvgPaths.p19edf100} fill="#FBD0BF" />
          <path d={otpSvgPaths.p3ae26f00} fill="#FBD0BF" />
          <path d={otpSvgPaths.pd955e00} fill="#812F0F" />
          <path d={otpSvgPaths.p162ead00} fill="#FBD0BF" />
          <path d={otpSvgPaths.p1f0e9b00} fill="#FBD0BF" />
          <path d={otpSvgPaths.p25ed600} fill="#FBD0BF" />
          <path d={otpSvgPaths.p2014d500} fill="#FBD0BF" />
        </g>
        <defs>
          <clipPath id="clip0_300_351">
            <rect fill="white" height="71.3917" width="265.551" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// --- Main Component ---

export default function LoginSignup({ onLogin }: { onLogin: (user: any) => void }) {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d`;

  const handleBack = () => {
    if (step === 'otp') {
      setStep('mobile');
      setOtp('');
    }
  };

  const handleSendOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/auth/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          mobile_number: mobileNumber,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');

      setIsNewUser(data.isNewUser);
      if (data.otp) {
        toast.success(`OTP sent! (Dev: ${data.otp})`);
      } else {
        toast.success('OTP sent successfully');
      }
      setStep('otp');
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          otp: otp,
          role: 'farmer', 
          language: 'english'
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to verify OTP');

      if (data.session?.access_token) {
        setAuthToken(data.session.access_token);
        localStorage.setItem('refresh_token', data.session.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(data.isNewUser ? 'Account created!' : 'Welcome back!');
        
        setTimeout(() => {
           onLogin(data.user);
        }, 500);
      } else {
        throw new Error('No access token received');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Render Login View
  const renderMobileView = () => (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[32px] h-[475px] items-center justify-center left-[calc(50%-1px)] top-[112px] w-[343px]" data-name="Container">
      <LoginLogo />
      
      {/* Form Container */}
      <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
        {/* Header Text */}
        <div className="content-stretch flex flex-col gap-[7.99px] h-[62.721px] items-start justify-center relative shrink-0 w-full" data-name="Container">
          <div className="content-stretch flex items-center relative shrink-0 w-full">
            <p className="font-['Merriweather:Bold',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#1d0902] text-[24px]">Login or Signup</p>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-full">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] not-italic relative shrink-0 text-[#6b5c5c] text-[14px]">We'll send you a one-time password</p>
          </div>
        </div>

        {/* Card */}
        <div className="relative rounded-[8px] shrink-0 w-full" data-name="Container">
          <div aria-hidden="true" className="absolute border-[0.776px] border-[rgba(64,21,4,0.59)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <div className="flex flex-col items-center justify-center size-full">
            <div className="content-stretch flex flex-col items-center justify-center p-[16px] relative w-full">
              
              {/* Form Inputs */}
              <div className="content-stretch flex flex-col gap-[16px] h-[166px] items-start justify-center relative shrink-0 w-full" data-name="Form">
                <div className="content-stretch flex flex-col gap-[7.99px] h-[102.55px] items-start relative shrink-0 w-full" data-name="Container">
                  <div className="h-[20.006px] relative shrink-0 w-full" data-name="Label">
                    <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[0] left-0 not-italic text-[#2a0f05] text-[14px] top-[0.55px]">
                      <span className="leading-[20px]">Mobile Number </span>
                      <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] text-[#de1e1e]">*</span>
                    </p>
                  </div>
                  
                  {/* Input Field */}
                  <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="Container">
                    <div className="flex flex-row items-center size-full">
                      <div className="content-stretch flex gap-[12px] items-center p-[8px] relative w-full">
                        <div className="relative shrink-0 size-[24px]">
                          <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                            <path d={loginSvgPaths.p127ab700} fill="#812F0F" fillOpacity="0.25" />
                            <path clipRule="evenodd" d={loginSvgPaths.p117b8c00} fill="#812F0F" fillRule="evenodd" />
                          </svg>
                        </div>
                        <input 
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="9876543210"
                          maxLength={10}
                          className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[#2a0f05] bg-transparent outline-none w-full placeholder:text-[rgba(42,15,5,0.5)]"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[19.496px] relative shrink-0 w-full" data-name="Paragraph">
                    <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#6b5c5c] text-[12px] top-[0.33px]">Enter 10-digit Indian mobile number</p>
                  </div>
                </div>

                <button 
                  onClick={handleSendOTP}
                  disabled={loading || mobileNumber.length !== 10}
                  className="bg-[#812f0f] hover:bg-[#6b250b] disabled:opacity-50 disabled:cursor-not-allowed relative rounded-[4px] shrink-0 w-full transition-colors"
                >
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="content-stretch flex gap-[16px] items-center justify-center px-[77px] py-[11px] relative w-full">
                      {loading ? <Loader2 className="animate-spin text-white h-5 w-5" /> : (
                        <>
                          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Get OTP</p>
                          <div className="relative shrink-0 size-[19.993px]">
                            <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                              <path d="M4.1653 9.99673H15.8282" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
                              <path d={loginSvgPaths.p18584b80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
                            </svg>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render OTP View
  const renderOtpView = () => (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[32px] h-[532px] items-start left-1/2 top-[112px] w-[343px]" data-name="Container">
      {/* Use LoginLogo here as well to match the Login view header */}
      <LoginLogo />
      
      {/* Content Wrapper */}
      <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
        
        {/* OTP Sent Banner */}
        <div className="bg-[rgba(129,47,15,0.1)] h-[37.029px] relative shrink-0 w-full rounded-[4px] overflow-hidden" data-name="Container">
          <div aria-hidden="true" className="absolute border-[0.776px] border-[rgba(129,47,15,0.3)] border-solid inset-0 pointer-events-none" />
          <div className="content-stretch flex flex-col items-start pb-[0.776px] pt-[8.766px] px-[8.766px] relative size-full">
            <div className="h-[19.496px] relative shrink-0 w-full" data-name="Paragraph">
              <div className="absolute left-0 size-[15.992px] top-[1.75px]" data-name="Icon">
                <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                  <path d={otpSvgPaths.pa4b98c0} stroke="#2A0F05" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33269" />
                  <path d={otpSvgPaths.p1786300} stroke="#2A0F05" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33269" />
                </svg>
              </div>
              <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[23.98px] not-italic text-[#2a0f05] text-[12px] top-[0.33px]">OTP sent!</p>
            </div>
          </div>
        </div>

        {/* Header Text */}
        <div className="content-stretch flex flex-col gap-[7.99px] h-[62.721px] items-start relative shrink-0 w-full" data-name="Container">
          <div className="h-[31.985px] relative shrink-0 w-full" data-name="Heading 2">
            <p className="absolute font-['Merriweather:Bold',sans-serif] leading-[32px] left-0 not-italic text-[#2a0f05] text-[24px] top-[-0.22px]">Enter OTP</p>
          </div>
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Paragraph">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] not-italic relative shrink-0 text-[#6b5c5c] text-[14px] w-[143px] whitespace-pre-wrap">Sent to {mobileNumber}</p>
            <div className="h-[24.007px] relative shrink-0 w-[59.362px] cursor-pointer hover:opacity-80" onClick={() => setStep('mobile')} data-name="Button">
              <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[30px] not-italic text-[#812f0f] text-[16px] text-center top-[-1.45px]">Change</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="relative rounded-[8px] shrink-0 w-full" data-name="Container">
          <div aria-hidden="true" className="absolute border-[0.776px] border-[rgba(64,21,4,0.59)] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <div className="flex flex-col items-center justify-center size-full">
            <div className="content-stretch flex flex-col items-center justify-center p-[16px] relative w-full">
              
              <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-full" data-name="Form">
                <div className="content-stretch flex flex-col gap-[7.99px] h-[110px] items-start justify-center relative shrink-0 w-full" data-name="Container">
                  <div className="h-[20.006px] relative shrink-0 w-full" data-name="Label">
                    <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#2a0f05] text-[14px] top-[0.55px]">6-Digit OTP</p>
                  </div>
                  
                  {/* Input Field */}
                  <div className="h-[59.071px] relative rounded-[4px] shrink-0 w-full" data-name="Container">
                    <div className="absolute h-[59px] left-0 rounded-[4px] top-[0.43px] w-full" data-name="Text Input">
                      <div className="content-stretch flex items-center overflow-clip pl-[44px] pr-[16px] py-[12px] relative rounded-[inherit] size-full">
                        <input 
                          type="text"
                          inputMode="numeric"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="123456"
                          maxLength={6}
                          className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-[#2a0f05] text-center tracking-[2.4px] bg-transparent outline-none w-full placeholder:text-[rgba(42,15,5,0.5)]"
                        />
                      </div>
                      <div aria-hidden="true" className="absolute border-[1.552px] border-[rgba(129,47,15,0.82)] border-solid inset-0 pointer-events-none rounded-[4px]" />
                    </div>
                    <div className="absolute left-[11.99px] size-[19.993px] top-[19.54px]" data-name="Icon">
                      <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                        <path d="M3.33224 7.49755H16.6612" stroke="#6B5C5C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
                        <path d="M3.33224 12.4959H16.6612" stroke="#6B5C5C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
                        <path d={otpSvgPaths.p3bf86e00} stroke="#6B5C5C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
                        <path d={otpSvgPaths.p2d915ef0} stroke="#6B5C5C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
                      </svg>
                    </div>
                  </div>

                  <div className="h-[19.496px] relative shrink-0 w-full" data-name="Paragraph">
                    <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#6b5c5c] text-[12px] top-[0.33px]">OTP expires in 5 minutes</p>
                  </div>
                </div>

                <button 
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="bg-[#812f0f] hover:bg-[#6b250b] disabled:opacity-50 disabled:cursor-not-allowed relative shrink-0 w-full rounded-[4px] transition-colors" 
                  data-name="Button"
                >
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="content-stretch flex gap-[16px] items-center justify-center px-[64px] py-[11px] relative w-full">
                      {loading ? <Loader2 className="animate-spin text-white h-5 w-5" /> : (
                        <>
                          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Verify & Login</p>
                          <div className="relative shrink-0 size-[19.993px]">
                            <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                              <path d="M4.1653 9.99673H15.8282" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
                              <path d={otpSvgPaths.p18584b80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66612" />
                            </svg>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f7f6f2] content-stretch flex flex-col items-start relative size-full min-h-screen overflow-hidden" data-name="Login/Signup">
      <div className="bg-[#f7f6f2] h-[884.004px] overflow-clip relative shrink-0 w-full max-w-md mx-auto" data-name="pq">
        
        {/* Background (Shared) */}
        <div className="absolute h-[852.019px] left-[25.22px] overflow-clip top-[15.99px] w-[342.192px]" data-name="Container">
          <BackgroundBlobs />
          {step === 'mobile' ? <FaarmerSvg /> : <DroneGraphic />}
        </div>

        {/* Content */}
        {step === 'mobile' ? renderMobileView() : renderOtpView()}

        {/* Back Button (Only for OTP) */}
        <div className="absolute content-stretch flex flex-col items-start left-[41.21px] pb-[0.776px] pt-[8.766px] px-[8.766px] size-[41.527px] top-[31.98px] cursor-pointer hover:opacity-70 transition-opacity" onClick={handleBack} data-name="Button">
          <div className="h-[23.995px] overflow-clip relative shrink-0 w-full" data-name="Icon">
             {step === 'mobile' ? (
                // Login Back Icon (Arrow Left)
                <div className="absolute bottom-[20.83%] left-[20.83%] right-1/2 top-[20.83%]">
                   <ArrowLeft className="w-6 h-6 text-[#2A0F05]" />
                </div>
             ) : (
                // OTP Back Icon (Arrow Left matching design)
                <div className="size-full relative">
                   <ArrowLeft className="w-6 h-6 text-[#2A0F05]" />
                </div>
             )}
          </div>
        </div>

        <div className="absolute h-0 left-[25.21px] top-[31.98px] w-[342.192px]" data-name="Container" />
        <div className="absolute h-0 left-0 top-[15.99px] w-[392.643px]" data-name="Container" />
      </div>
    </div>
  );
}
