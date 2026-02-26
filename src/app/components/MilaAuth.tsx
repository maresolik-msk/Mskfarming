import { useState, useEffect, useRef } from "react";
import { toast } from 'sonner';
import { setAuthToken, getAuthToken } from '../../lib/api';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

// ─── THEME ────────────────────────────────────────────────────────────────────
const theme = {
  green: "#2D6A4F",
  greenLight: "#40916C",
  greenPale: "#D8F3DC",
  earth: "#7C4E1E",
  earthLight: "#B07D3C",
  gold: "#F4A300",
  goldLight: "#FFD166",
  cream: "#FFF8EE",
  creamDark: "#F5ECD7",
  text: "#1B2B20",
  textMuted: "#5A7565",
  white: "#FFFFFF",
  error: "#C0392B",
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById('mila-auth-styles')) return;
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@400;500;600&display=swap');

    .mila-root {
      font-family: 'DM Sans', sans-serif;
      background: ${theme.cream};
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    .bg-blob {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.35;
      pointer-events: none;
      animation: blobFloat 8s ease-in-out infinite alternate;
    }
    .bg-blob-1 { width: 400px; height: 400px; background: ${theme.greenPale}; top: -100px; left: -100px; animation-delay: 0s; }
    .bg-blob-2 { width: 300px; height: 300px; background: ${theme.goldLight}; bottom: -80px; right: -80px; animation-delay: 2s; }
    .bg-blob-3 { width: 250px; height: 250px; background: #D4E9C0; top: 40%; left: 60%; animation-delay: 4s; }

    @keyframes blobFloat {
      from { transform: translate(0, 0) scale(1); }
      to   { transform: translate(20px, 30px) scale(1.08); }
    }

    .auth-card {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .card-inner {
      background: rgba(255,255,255,0.88);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,0.7);
      border-radius: 28px;
      padding: 40px 36px;
      box-shadow: 0 8px 48px rgba(45,106,79,0.10), 0 2px 12px rgba(0,0,0,0.06);
    }

    .logo-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 28px;
    }
    .logo-icon {
      width: 44px; height: 44px;
      background: linear-gradient(135deg, ${theme.green} 0%, ${theme.greenLight} 100%);
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      box-shadow: 0 4px 12px rgba(45,106,79,0.3);
    }
    .logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 700;
      color: ${theme.green};
      letter-spacing: -0.5px;
    }
    .logo-tagline {
      font-size: 11px;
      color: ${theme.textMuted};
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-top: -2px;
    }

    .screen-title {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 700;
      color: ${theme.text};
      margin-bottom: 6px;
      line-height: 1.25;
    }
    .screen-subtitle {
      font-size: 14px;
      color: ${theme.textMuted};
      margin-bottom: 28px;
      line-height: 1.55;
    }

    .lang-switcher {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }
    .lang-btn {
      padding: 6px 14px;
      border-radius: 20px;
      border: 1.5px solid ${theme.greenPale};
      background: transparent;
      font-size: 13px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      color: ${theme.textMuted};
      cursor: pointer;
      transition: all 0.18s;
    }
    .lang-btn.active {
      background: ${theme.green};
      border-color: ${theme.green};
      color: white;
    }

    .phone-row {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
    }
    .country-code {
      flex-shrink: 0;
      width: 72px;
      padding: 14px 10px;
      border-radius: 14px;
      border: 1.5px solid ${theme.creamDark};
      background: ${theme.creamDark};
      font-size: 15px;
      font-family: 'DM Sans', sans-serif;
      color: ${theme.text};
      text-align: center;
      font-weight: 600;
    }
    .input-field {
      width: 100%;
      padding: 14px 16px;
      border-radius: 14px;
      border: 1.5px solid ${theme.creamDark};
      background: ${theme.creamDark};
      font-size: 15px;
      font-family: 'DM Sans', sans-serif;
      color: ${theme.text};
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-field:focus {
      border-color: ${theme.greenLight};
      background: white;
      box-shadow: 0 0 0 4px rgba(64,145,108,0.1);
    }
    .input-field.error {
      border-color: ${theme.error};
      background: #FEF0EE;
    }
    .input-label {
      font-size: 12px;
      font-weight: 600;
      color: ${theme.textMuted};
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 6px;
      display: block;
    }
    .input-group {
      margin-bottom: 16px;
    }
    .error-text {
      font-size: 12px;
      color: ${theme.error};
      margin-top: 5px;
    }

    .otp-row {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-bottom: 20px;
    }
    .otp-box {
      width: 52px; height: 58px;
      border-radius: 14px;
      border: 2px solid ${theme.creamDark};
      background: ${theme.creamDark};
      font-size: 22px;
      font-weight: 700;
      font-family: 'Playfair Display', serif;
      color: ${theme.green};
      text-align: center;
      outline: none;
      transition: all 0.2s;
    }
    .otp-box:focus {
      border-color: ${theme.green};
      background: white;
      box-shadow: 0 0 0 4px rgba(45,106,79,0.12);
      transform: scale(1.06);
    }
    .otp-box.filled {
      border-color: ${theme.green};
      background: ${theme.greenPale};
    }

    .resend-row {
      text-align: center;
      font-size: 13px;
      color: ${theme.textMuted};
      margin-bottom: 24px;
    }
    .resend-btn {
      background: none;
      border: none;
      font-size: 13px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: ${theme.green};
      cursor: pointer;
      text-decoration: underline;
    }
    .resend-btn:disabled {
      color: ${theme.textMuted};
      cursor: default;
      text-decoration: none;
    }

    .btn-primary {
      width: 100%;
      padding: 16px;
      border-radius: 16px;
      border: none;
      background: linear-gradient(135deg, ${theme.green} 0%, ${theme.greenLight} 100%);
      color: white;
      font-size: 16px;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.22s;
      box-shadow: 0 4px 20px rgba(45,106,79,0.28);
      position: relative;
      overflow: hidden;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(45,106,79,0.36);
    }
    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }
    .btn-primary:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .btn-primary.loading::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
      animation: shimmer 1.2s infinite;
    }
    @keyframes shimmer {
      from { transform: translateX(-100%); }
      to   { transform: translateX(100%); }
    }

    .btn-back {
      display: flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      font-size: 14px;
      font-family: 'DM Sans', sans-serif;
      color: ${theme.textMuted};
      cursor: pointer;
      padding: 0;
      margin-bottom: 24px;
      transition: color 0.15s;
    }
    .btn-back:hover { color: ${theme.green}; }

    .progress-bar {
      display: flex;
      gap: 6px;
      margin-bottom: 28px;
    }
    .progress-dot {
      height: 4px;
      border-radius: 2px;
      background: ${theme.creamDark};
      transition: all 0.3s;
      flex: 1;
    }
    .progress-dot.active { background: ${theme.green}; }
    .progress-dot.done   { background: ${theme.greenLight}; }

    .option-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
    }
    .option-card {
      padding: 16px 12px;
      border-radius: 16px;
      border: 2px solid ${theme.creamDark};
      background: ${theme.creamDark};
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .option-card:hover { border-color: ${theme.greenLight}; background: ${theme.greenPale}; }
    .option-card.selected {
      border-color: ${theme.green};
      background: ${theme.greenPale};
      box-shadow: 0 0 0 1px ${theme.green};
    }
    .option-icon { font-size: 28px; margin-bottom: 6px; }
    .option-label { font-size: 13px; font-weight: 600; color: ${theme.text}; }

    .state-select {
      width: 100%;
      padding: 14px 16px;
      border-radius: 14px;
      border: 1.5px solid ${theme.creamDark};
      background: ${theme.creamDark};
      font-size: 15px;
      font-family: 'DM Sans', sans-serif;
      color: ${theme.text};
      outline: none;
      cursor: pointer;
      appearance: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      margin-bottom: 16px;
    }
    .state-select:focus {
      border-color: ${theme.greenLight};
      background: white;
      box-shadow: 0 0 0 4px rgba(64,145,108,0.1);
    }

    .screen { animation: slideIn 0.3s ease-out; }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .success-icon {
      width: 72px; height: 72px;
      background: linear-gradient(135deg, ${theme.green}, ${theme.greenLight});
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 32px;
      margin: 0 auto 20px;
      animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn {
      from { transform: scale(0); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }

    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      cursor: pointer;
    }
    .checkbox-box {
      width: 20px; height: 20px;
      border-radius: 6px;
      border: 2px solid ${theme.creamDark};
      background: ${theme.creamDark};
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
      flex-shrink: 0;
    }
    .checkbox-box.checked {
      background: ${theme.green};
      border-color: ${theme.green};
      color: white;
      font-size: 12px;
    }
    .checkbox-label { font-size: 13px; color: ${theme.textMuted}; line-height: 1.4; }

    .name-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .terms-text {
      font-size: 12px;
      color: ${theme.textMuted};
      text-align: center;
      line-height: 1.6;
      margin-top: 16px;
    }
    .terms-text a { color: ${theme.green}; text-decoration: none; font-weight: 500; }

    .mila-toast {
      position: fixed;
      top: 20px; left: 50%;
      transform: translateX(-50%) translateY(-80px);
      background: ${theme.text};
      color: white;
      padding: 12px 24px;
      border-radius: 100px;
      font-size: 14px;
      font-family: 'DM Sans', sans-serif;
      z-index: 1000;
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      white-space: nowrap;
    }
    .mila-toast.show { transform: translateX(-50%) translateY(0); }
  `;
  const style = document.createElement("style");
  style.id = 'mila-auth-styles';
  style.textContent = css;
  document.head.appendChild(style);
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];

const CROPS = [
  { label: "Rice",    icon: "\u{1F33E}" },
  { label: "Wheat",   icon: "\u{1F33F}" },
  { label: "Cotton",  icon: "\u{1F338}" },
  { label: "Maize",   icon: "\u{1F33D}" },
  { label: "Soybean", icon: "\u{1FAD8}" },
  { label: "Sugarcane",icon: "\u{1F38B}" },
];

const LAND_SIZES = [
  { label: "< 1 acre",    icon: "\u{1F3E1}" },
  { label: "1\u20135 acres",   icon: "\u{1F331}" },
  { label: "5\u201320 acres",  icon: "\u{1F69C}" },
  { label: "> 20 acres",  icon: "\u{1F30D}" },
];

function useTimer(duration = 30) {
  const [remaining, setRemaining] = useState(duration);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    setRemaining(duration);
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(id); setActive(false); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, duration]);

  const restart = () => setActive(true);
  return { remaining, active, restart };
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function MilaToast({ message, show }: { message: string; show: boolean }) {
  return <div className={`mila-toast ${show ? "show" : ""}`}>{message}</div>;
}

// ─── PROPS ────────────────────────────────────────────────────────────────────
interface MilaAuthProps {
  onLogin: (user: any) => void;
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function PhoneScreen({ onNext, lang, setLang }: { onNext: (phone: string) => void; lang: string; setLang: (l: string) => void }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d`;

  const validate = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }
    setError("");
    return true;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/auth/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ mobile_number: phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      if (data.otp) {
        toast.success(`OTP sent! (Dev: ${data.otp})`);
      } else {
        toast.success('OTP sent successfully');
      }
      onNext(phone);
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send OTP');
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <div className="logo-wrap">
        <div className="logo-icon">{"\u{1F33F}"}</div>
        <div>
          <div className="logo-text">Mila</div>
          <div className="logo-tagline">Smart Farming Partner</div>
        </div>
      </div>

      <div className="lang-switcher">
        {["EN", "\u0C24\u0C46"].map(l => (
          <button key={l} className={`lang-btn ${lang === l ? "active" : ""}`} onClick={() => setLang(l)}>{l}</button>
        ))}
      </div>

      <h1 className="screen-title">{lang === "EN" ? "Welcome, Farmer \u{1F64F}" : "\u0C38\u0C4D\u0C35\u0C3E\u0C17\u0C24\u0C02, \u0C30\u0C48\u0C24\u0C41 \u{1F64F}"}</h1>
      <p className="screen-subtitle">{lang === "EN" ? "Enter your mobile number to get started with smarter farming." : "\u0C38\u0C4D\u0C2E\u0C3E\u0C30\u0C4D\u0C1F\u0C4D \u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C3E\u0C2F\u0C02 \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C2E\u0C40 \u0C28\u0C02\u0C2C\u0C30\u0C4D \u0C28\u0C2E\u0C4B\u0C26\u0C41 \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F."}</p>

      <div className="input-group">
        <label className="input-label">Mobile Number</label>
        <div className="phone-row">
          <div className="country-code">{"\u{1F1EE}\u{1F1F3}"} +91</div>
          <input
            className={`input-field ${error ? "error" : ""}`}
            type="tel"
            maxLength={10}
            placeholder="98765 43210"
            value={phone}
            onChange={e => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
        </div>
        {error && <div className="error-text">{error}</div>}
      </div>

      <button
        className={`btn-primary ${loading ? "loading" : ""}`}
        onClick={handleSend}
        disabled={loading || phone.length !== 10}
      >
        {loading ? "Sending OTP\u2026" : "Send OTP \u2192"}
      </button>

      <div className="terms-text">
        By continuing, you agree to Mila's <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
}

function OTPScreen({ phone, onBack, onVerify }: { phone: string; onBack: () => void; onVerify: (user: any) => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const { remaining, active, restart } = useTimer(30);

  const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d`;

  useEffect(() => { restart(); refs[0].current?.focus(); }, []);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    setError("");
    if (val && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs[i - 1].current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = [...otp];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    refs[Math.min(digits.length, 5)].current?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter the complete 6-digit OTP"); return; }
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          mobile_number: phone,
          otp: code,
          role: 'farmer',
          language: 'english',
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to verify OTP');
      
      if (data.session?.access_token) {
        setAuthToken(data.session.access_token);
        localStorage.setItem('refresh_token', data.session.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store current_session for session restoration on page reload
        localStorage.setItem('current_session', JSON.stringify({
          access_token: data.session.access_token,
          user: data.user,
        }));
        
        toast.success(data.isNewUser ? 'Account created!' : 'Welcome back!');
        onVerify({ ...data.user, _isNewUser: data.isNewUser });
      } else {
        throw new Error('No access token received');
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(err.message || 'Invalid OTP');
      toast.error(err.message || 'Invalid OTP');
      setOtp(["","","","","",""]);
      refs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/auth/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ mobile_number: phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to resend OTP');
      if (data.otp) toast.success(`OTP resent! (Dev: ${data.otp})`);
      else toast.success('OTP resent successfully');
      restart();
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="screen">
      <button className="btn-back" onClick={onBack}>{"\u2190"} Back</button>

      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 48 }}>{"\u{1F4F1}"}</div>
      </div>

      <h1 className="screen-title" style={{ textAlign: "center" }}>Verify Your Number</h1>
      <p className="screen-subtitle" style={{ textAlign: "center" }}>
        We sent a 6-digit OTP to <strong>+91 {phone}</strong>
      </p>

      <div className="otp-row" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={refs[i]}
            className={`otp-box ${digit ? "filled" : ""}`}
            type="tel"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
          />
        ))}
      </div>
      {error && <div className="error-text" style={{ textAlign: "center", marginBottom: 12 }}>{error}</div>}

      <div className="resend-row">
        {active ? (
          <span>Resend OTP in <strong>{remaining}s</strong></span>
        ) : (
          <>Didn't get it? <button className="resend-btn" onClick={handleResend}>Resend OTP</button></>
        )}
      </div>

      <button
        className={`btn-primary ${loading ? "loading" : ""}`}
        onClick={handleVerify}
        disabled={loading || otp.join("").length < 6}
      >
        {loading ? "Verifying\u2026" : "Verify OTP \u2713"}
      </button>
    </div>
  );
}

function OnboardStep1({ data, onChange, onNext, onBack }: { data: any; onChange: (p: any) => void; onNext: () => void; onBack: () => void }) {
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const e: any = {};
    if (!data.firstName?.trim()) e.firstName = "Required";
    if (!data.lastName?.trim())  e.lastName  = "Required";
    if (!data.state)             e.state     = "Please select your state";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="screen">
      <button className="btn-back" onClick={onBack}>{"\u2190"} Back</button>
      <div className="progress-bar">
        {[0,1,2].map(i => <div key={i} className={`progress-dot ${i === 0 ? "active" : ""}`} />)}
      </div>

      <h1 className="screen-title">Tell us about yourself</h1>
      <p className="screen-subtitle">This helps us personalise your experience</p>

      <div className="name-row" style={{ marginBottom: 16 }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">First Name</label>
          <input
            className={`input-field ${errors.firstName ? "error" : ""}`}
            placeholder="Ravi"
            value={data.firstName || ""}
            onChange={e => { onChange({ firstName: e.target.value }); setErrors((prev: any) => ({...prev, firstName: ""})); }}
          />
          {errors.firstName && <div className="error-text">{errors.firstName}</div>}
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Last Name</label>
          <input
            className={`input-field ${errors.lastName ? "error" : ""}`}
            placeholder="Kumar"
            value={data.lastName || ""}
            onChange={e => { onChange({ lastName: e.target.value }); setErrors((prev: any) => ({...prev, lastName: ""})); }}
          />
          {errors.lastName && <div className="error-text">{errors.lastName}</div>}
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">State</label>
        <select
          className={`state-select ${errors.state ? "error" : ""}`}
          value={data.state || ""}
          onChange={e => { onChange({ state: e.target.value }); setErrors((prev: any) => ({...prev, state: ""})); }}
        >
          <option value="">Select your state...</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.state && <div className="error-text" style={{ marginTop: -10, marginBottom: 8 }}>{errors.state}</div>}
      </div>

      <div className="input-group">
        <label className="input-label">Village / Town (Optional)</label>
        <input
          className="input-field"
          placeholder="e.g. Nandyal"
          value={data.village || ""}
          onChange={e => onChange({ village: e.target.value })}
        />
      </div>

      <button className="btn-primary" onClick={() => validate() && onNext()}>
        Continue {"\u2192"}
      </button>
    </div>
  );
}

function OnboardStep2({ data, onChange, onNext, onBack }: { data: any; onChange: (p: any) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div className="screen">
      <button className="btn-back" onClick={onBack}>{"\u2190"} Back</button>
      <div className="progress-bar">
        {[0,1,2].map(i => <div key={i} className={`progress-dot ${i <= 1 ? (i === 1 ? "active" : "done") : ""}`} />)}
      </div>

      <h1 className="screen-title">What do you grow?</h1>
      <p className="screen-subtitle">Select your main crops (pick all that apply)</p>

      <div className="option-grid">
        {CROPS.map(c => (
          <div
            key={c.label}
            className={`option-card ${(data.crops || []).includes(c.label) ? "selected" : ""}`}
            onClick={() => {
              const crops = data.crops || [];
              onChange({ crops: crops.includes(c.label) ? crops.filter((x: string) => x !== c.label) : [...crops, c.label] });
            }}
          >
            <div className="option-icon">{c.icon}</div>
            <div className="option-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="input-group">
        <label className="input-label">Other crops (optional)</label>
        <input
          className="input-field"
          placeholder="e.g. Groundnut, Turmeric..."
          value={data.otherCrop || ""}
          onChange={e => onChange({ otherCrop: e.target.value })}
        />
      </div>

      <button className="btn-primary" onClick={onNext} disabled={(data.crops || []).length === 0 && !data.otherCrop}>
        Continue {"\u2192"}
      </button>
    </div>
  );
}

function OnboardStep3({ data, onChange, onNext, onBack }: { data: any; onChange: (p: any) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div className="screen">
      <button className="btn-back" onClick={onBack}>{"\u2190"} Back</button>
      <div className="progress-bar">
        {[0,1,2].map(i => <div key={i} className={`progress-dot ${i <= 2 ? (i === 2 ? "active" : "done") : ""}`} />)}
      </div>

      <h1 className="screen-title">How much land do you farm?</h1>
      <p className="screen-subtitle">We'll tailor recommendations to your farm size</p>

      <div className="option-grid" style={{ marginBottom: 24 }}>
        {LAND_SIZES.map(l => (
          <div
            key={l.label}
            className={`option-card ${data.landSize === l.label ? "selected" : ""}`}
            onClick={() => onChange({ landSize: l.label })}
          >
            <div className="option-icon">{l.icon}</div>
            <div className="option-label">{l.label}</div>
          </div>
        ))}
      </div>

      <label className="checkbox-row" onClick={() => onChange({ soilTest: !data.soilTest })}>
        <div className={`checkbox-box ${data.soilTest ? "checked" : ""}`}>{data.soilTest ? "\u2713" : ""}</div>
        <span className="checkbox-label">I'm interested in soil testing services</span>
      </label>

      <label className="checkbox-row" onClick={() => onChange({ govSchemes: !data.govSchemes })}>
        <div className={`checkbox-box ${data.govSchemes ? "checked" : ""}`}>{data.govSchemes ? "\u2713" : ""}</div>
        <span className="checkbox-label">Notify me about government schemes & subsidies</span>
      </label>

      <button className="btn-primary" onClick={onNext} disabled={!data.landSize}>
        Complete Setup {"\u{1F331}"}
      </button>
    </div>
  );
}

function SuccessScreen({ data, onGoToDashboard }: { data: any; onGoToDashboard: () => void }) {
  return (
    <div className="screen" style={{ textAlign: "center" }}>
      <div className="success-icon">{"\u2705"}</div>
      <h1 className="screen-title">You're all set, {data.firstName}!</h1>
      <p className="screen-subtitle" style={{ textAlign: "center" }}>
        Welcome to Mila. Your smart farming journey starts now {"\u{1F33E}"}
      </p>

      <div style={{
        background: theme.greenPale,
        borderRadius: 20,
        padding: "20px 24px",
        textAlign: "left",
        marginBottom: 24,
      }}>
        {[
          ["\u{1F4CD}", "State", data.state],
          ["\u{1F33E}", "Crops", (data.crops || []).join(", ") || data.otherCrop || "\u2014"],
          ["\u{1F3E1}", "Land",  data.landSize || "\u2014"],
        ].map(([icon, label, val]) => (
          <div key={label as string} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: 13, color: theme.textMuted, width: 52, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{val}</span>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={onGoToDashboard} style={{ marginBottom: 12 }}>
        Go to Dashboard {"\u{1F680}"}
      </button>
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function MilaAuth({ onLogin }: MilaAuthProps) {
  const [screen, setScreen] = useState<string>("phone");
  const [phone, setPhone]   = useState("");
  const [lang, setLang]     = useState("EN");
  const [profile, setProfile] = useState<any>({});
  const [milaToast, setMilaToast] = useState({ show: false, msg: "" });
  const [currentUser, setCurrentUser] = useState<any>(null);

  const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d`;

  useEffect(() => { injectStyles(); }, []);

  const showToast = (msg: string) => {
    setMilaToast({ show: true, msg });
    setTimeout(() => setMilaToast({ show: false, msg: "" }), 2500);
  };

  const update = (patch: any) => setProfile((p: any) => ({ ...p, ...patch }));

  const handleVerified = (user: any) => {
    setCurrentUser(user);
    showToast("Verified! \u2713");
    
    // If returning user (profile already complete), skip onboarding entirely
    const isProfileComplete = 
      user?.profile_complete === true || 
      user?.onboarding_status?.completed === true ||
      !user?._isNewUser;
    
    if (isProfileComplete && !user?._isNewUser) {
      // Returning user - go straight to dashboard
      localStorage.setItem('hasOnboarded', 'true');
      onLogin(user);
    } else {
      // New user - show onboarding
      setScreen("onboard1");
    }
  };

  const handleComplete = async () => {
    showToast("Saving profile\u2026");
    
    // Persist onboarding data to backend
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      };
      if (token) {
        headers['X-Access-Token'] = token;
      }
      
      const onboardingPayload = {
        completed: true,
        completed_steps: ['profile', 'crops', 'land'],
        location: {
          state: profile.state,
          village: profile.village || '',
        },
        field: profile.landSize ? {
          name: 'My Farm',
          area: profile.landSize === '< 1 acre' ? 0.5 : 
                profile.landSize === '1\u20135 acres' ? 3 : 
                profile.landSize === '5\u201320 acres' ? 10 : 25,
          area_unit: 'acres',
        } : null,
        crop: (profile.crops && profile.crops.length > 0) ? {
          crop_id: profile.crops[0].toLowerCase().replace(/\s+/g, '_'),
          crop_name: profile.crops[0],
          season: 'Kharif',
        } : null,
      };
      
      const response = await fetch(`${SERVER_URL}/onboarding/complete`, {
        method: 'POST',
        headers,
        body: JSON.stringify(onboardingPayload),
      });
      
      const data = await response.json();
      if (!response.ok) {
        console.error('Onboarding save error:', data.error);
        // Don't block the flow - continue even if save fails
      } else {
        console.log('Onboarding saved to backend:', data);
        // Update stored user and session with new profile_complete status
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          const sessionStr = localStorage.getItem('current_session');
          if (sessionStr) {
            const session = JSON.parse(sessionStr);
            session.user = data.user;
            localStorage.setItem('current_session', JSON.stringify(session));
          }
        }
      }
    } catch (err) {
      console.error('Failed to save onboarding to backend:', err);
      // Non-blocking - continue to success screen
    }
    
    // Mark onboarding complete locally regardless
    localStorage.setItem('hasOnboarded', 'true');
    
    showToast("Profile saved! \u{1F331}");
    setScreen("success");
  };

  const handleGoToDashboard = () => {
    if (currentUser) {
      // Pass user with profile_complete flag so App.tsx doesn't show duplicate onboarding
      const updatedUser = {
        ...currentUser,
        profile_complete: true,
        full_name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        onboarding_status: { completed: true },
      };
      
      // Update stored session with completed profile
      const sessionStr = localStorage.getItem('current_session');
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          session.user = updatedUser;
          localStorage.setItem('current_session', JSON.stringify(session));
        } catch (e) {
          console.error('Failed to update session:', e);
        }
      }
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      onLogin(updatedUser);
    }
  };

  return (
    <div className="mila-root">
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      <MilaToast message={milaToast.msg} show={milaToast.show} />

      <div className="auth-card">
        <div className="card-inner">
          {screen === "phone" && (
            <PhoneScreen
              onNext={p => { setPhone(p); setScreen("otp"); showToast("OTP sent to +91 " + p); }}
              lang={lang}
              setLang={setLang}
            />
          )}
          {screen === "otp" && (
            <OTPScreen
              phone={phone}
              onBack={() => setScreen("phone")}
              onVerify={handleVerified}
            />
          )}
          {screen === "onboard1" && <OnboardStep1 data={profile} onChange={update} onNext={() => setScreen("onboard2")} onBack={() => setScreen("phone")} />}
          {screen === "onboard2" && <OnboardStep2 data={profile} onChange={update} onNext={() => setScreen("onboard3")} onBack={() => setScreen("onboard1")} />}
          {screen === "onboard3" && <OnboardStep3 data={profile} onChange={update} onNext={handleComplete} onBack={() => setScreen("onboard2")} />}
          {screen === "success" && <SuccessScreen data={profile} onGoToDashboard={handleGoToDashboard} />}
        </div>
      </div>
    </div>
  );
}