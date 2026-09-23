import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Wifi,
  Thermometer,
  Droplets,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Bell,
  Wind,
  Gauge,
  Sparkles,
  Zap,
  Mail,
  ShoppingBag,
  PackageCheck,
  Truck,
  ShieldCheck,
  Check,
  Copy,
  Send,
  BatteryCharging,
  CircuitBoard,
  Award,
  Phone,
  MapPin,
  ExternalLink,
  Layers,
  Sparkle,
} from 'lucide-react';
import { VillageInfo } from '../types';

interface FarmGuardHardwareProps {
  village: VillageInfo;
  soundEnabled: boolean;
}

export const FarmGuardHardware: React.FC<FarmGuardHardwareProps> = ({
  village,
  soundEnabled,
}) => {
  // Live Simulated Hardware Sensor Values
  const [soilMoisture, setSoilMoisture] = useState<number>(38); // %
  const [temperature, setTemperature] = useState<number>(31); // °C
  const [humidity, setHumidity] = useState<number>(64); // %
  const [wifiConnected, setWifiConnected] = useState<boolean>(true);
  const [irrigationPumpActive, setIrrigationPumpActive] = useState<boolean>(false);
  const [buzzerTriggered, setBuzzerTriggered] = useState<boolean>(false);

  // Buy Hardware Form State
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>('');
  const [buyerVillage, setBuyerVillage] = useState<string>(village.name || '');
  const [buyerAddress, setBuyerAddress] = useState<string>('');
  const [selectedKit, setSelectedKit] = useState<'standard' | 'solar_pro'>('standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [orderSentNotification, setOrderSentNotification] = useState<boolean>(false);

  const TARGET_EMAIL = 'swastik20130201@gmail.com';

  // Auto calculate health metrics based on sensors
  const cropStressIndex = Math.min(
    100,
    Math.max(0, Math.round((45 - soilMoisture) * 1.8 + (temperature - 28) * 2.2))
  );

  const farmHealthScore = Math.min(
    100,
    Math.max(10, Math.round(100 - cropStressIndex * 0.75))
  );

  const irrigationNeedLevel =
    soilMoisture < 30 ? 'CRITICAL (Watering Needed NOW)' : soilMoisture < 50 ? 'MODERATE' : 'OPTIMAL (Moist)';

  // Handle auto buzzer alert if stress > 65
  useEffect(() => {
    if (cropStressIndex > 65 && !buzzerTriggered) {
      setBuzzerTriggered(true);
      if (soundEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Alert! High crop stress detected at ${village.name}. Soil moisture is ${soilMoisture} percent. Irrigation pump recommended.`
        );
        window.speechSynthesis.speak(utterance);
      }
    } else if (cropStressIndex <= 65) {
      setBuzzerTriggered(false);
    }
  }, [cropStressIndex, soilMoisture, village.name, soundEnabled, buzzerTriggered]);

  const togglePump = () => {
    setIrrigationPumpActive((prev) => !prev);
    if (!irrigationPumpActive) {
      setSoilMoisture((prev) => Math.min(85, prev + 25));
    }
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(TARGET_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const generateMailToLink = () => {
    const kitTitle = selectedKit === 'solar_pro' ? 'FarmGuard Solar Pro Field Station (₹3,499)' : 'FarmGuard Standard AI IoT Kit (₹2,499)';
    const subject = encodeURIComponent(`Purchase Order: ${kitTitle} - ${buyerName || 'Farmer'}`);
    const bodyText = `Hello FarmGuard AI Hardware Team,\n\nI would like to order the FarmGuard AI Hardware kit automatically:\n\n` +
      `----------------------------------------\n` +
      `ORDER DETAILS:\n` +
      `• Selected Kit: ${kitTitle}\n` +
      `• Quantity: ${quantity} Unit(s)\n` +
      `• Buyer / Farmer Name: ${buyerName || 'Not specified'}\n` +
      `• Contact Phone: ${buyerPhone || 'Not specified'}\n` +
      `• Village / Location: ${buyerVillage || village.name}\n` +
      `• Delivery Address: ${buyerAddress || 'Not specified'}\n` +
      `----------------------------------------\n\n` +
      `Please confirm payment instructions (COD / UPI / NetBanking) and delivery timeline.\n\nThank you!`;
    
    return `mailto:${TARGET_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  const handleDirectEmailOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const mailLink = generateMailToLink();
    window.location.href = mailLink;
    setOrderSentNotification(true);
    setTimeout(() => setOrderSentNotification(false), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-2xl border border-emerald-800/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Cpu className="w-3 h-3" /> Hardware Device #FG-882
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800/60 px-2 py-0.5 rounded">
              ESP8266 + Arduino Nano
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            FarmGuard AI Hardware & Live Sensor Telemetry
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time IoT field sensor unit deployed in <strong className="text-emerald-400">{village.name} ({village.district})</strong>. Detects crop stress before visible leaf symptoms appear and automates smart irrigation.
          </p>
        </div>

        {/* Status Badge */}
        <div className="bg-slate-900/80 border border-slate-700/80 p-3 rounded-xl flex items-center gap-3 shrink-0">
          <div className="relative">
            <div className={`w-3.5 h-3.5 rounded-full ${wifiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
            <div className={`absolute -inset-1 rounded-full ${wifiConnected ? 'bg-emerald-400/30 animate-ping' : ''}`} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200">
              {wifiConnected ? 'Cloud Sync Online' : 'Offline Mode'}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              IP: 192.168.4.101 • 2.4GHz
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Hardware OLED Simulator + Sensor Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Physical Arduino OLED Hardware Device Box */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  FarmGuard AI Microcontroller
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                v2.4 IoT Firmware
              </span>
            </div>

            {/* OLED Display Container (Monochrome Blue/Yellow OLED Aesthetic) */}
            <div className="bg-black border-4 border-slate-800 rounded-xl p-4 font-mono text-cyan-400 shadow-inner min-h-[220px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-1 right-2 text-[9px] text-slate-600 uppercase">
                OLED 128x64 SSD1306
              </div>

              {/* OLED Header */}
              <div className="flex justify-between items-center text-xs border-b border-cyan-900/60 pb-1 mb-2 text-yellow-400">
                <span>[FUTUREFARM-OS]</span>
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> 100%
                </span>
              </div>

              {/* OLED Sensor Readings */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">SOIL MOIST:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {soilMoisture}% {soilMoisture < 30 ? '[DRY!]' : '[OK]'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">DHT22 TEMP:</span>
                  <span className="text-cyan-300 font-bold">
                    {temperature}°C
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">DHT22 HUMID:</span>
                  <span className="text-cyan-300 font-bold">
                    {humidity}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">CROP STRESS:</span>
                  <span className={cropStressIndex > 60 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {cropStressIndex}% [{cropStressIndex > 60 ? 'HIGH' : 'LOW'}]
                  </span>
                </div>
              </div>

              {/* OLED Footer status bar */}
              <div className="mt-3 pt-2 border-t border-cyan-900/60 flex justify-between items-center text-[11px]">
                <span className="text-yellow-300 flex items-center gap-1">
                  PUMP: {irrigationPumpActive ? '>> ON <<' : 'OFF'}
                </span>
                <span className="text-emerald-400 font-bold">HEALTH: {farmHealthScore}/100</span>
              </div>
            </div>

            {/* Hardware Component Legend Table */}
            <div className="mt-4 bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Hardware Components List</span>
                <span className="text-[10px] text-slate-500">Arduino Nano Based</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
                  <strong className="text-emerald-400">Soil Moisture:</strong> Capacitive v1.2
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
                  <strong className="text-cyan-400">DHT22:</strong> Precision Temp/Hum
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
                  <strong className="text-amber-400">ESP8266:</strong> Wi-Fi Cloud Bridge
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-300">
                  <strong className="text-red-400">Buzzer/LED:</strong> Active Audio Alert
                </div>
              </div>
            </div>
          </div>

          {/* Manual Control Actions */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={togglePump}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                irrigationPumpActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{irrigationPumpActive ? 'Stop Irrigation Pump' : 'Start Smart Drip Pump'}</span>
            </button>
            <button
              onClick={() => setBuzzerTriggered(!buzzerTriggered)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              title="Test Alarm Buzzer"
            >
              <Bell className={`w-4 h-4 ${buzzerTriggered ? 'text-red-400 animate-bounce' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Column: Sensor Controls & Weather Report */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Hardware Sensor Adjustment Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" />
                Live Field Environment Simulation Sliders
              </h3>
              <span className="text-xs text-slate-400">Drag to test AI triggers</span>
            </div>

            {/* Slider 1: Soil Moisture */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Soil Moisture (Capacitive Sensor)
                </span>
                <span className={soilMoisture < 35 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {soilMoisture}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10% (Bone Dry)</span>
                <span>50% (Ideal)</span>
                <span>90% (Waterlogged)</span>
              </div>
            </div>

            {/* Slider 2: Air Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Air Temperature (DHT22)
                </span>
                <span className="text-amber-400 font-bold">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>15°C (Cool)</span>
                <span>30°C (Optimal)</span>
                <span>45°C (Severe Heatwave)</span>
              </div>
            </div>

            {/* Slider 3: Humidity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-indigo-400" /> Relative Humidity (DHT22)
                </span>
                <span className="text-indigo-400 font-bold">{humidity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NEW SECTION: FARMGUARD AI HARDWARE FEATURES & AUTOMATIC MAIL BUY OPTION */}
      {/* ========================================================================= */}

      {/* Section Header */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> Direct Factory Hardware Order
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Buy FarmGuard AI Hardware & Features Guide
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Equip your field with plug-and-play IoT sensors. Order automatically by emailing <strong className="text-emerald-400 underline decoration-dashed">swastik20130201@gmail.com</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyEmailToClipboard}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
              title="Copy email address"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedEmail ? 'Email Copied!' : 'swastik20130201@gmail.com'}</span>
            </button>
            <a
              href={`mailto:${TARGET_EMAIL}?subject=FarmGuard%20Hardware%20Inquiry`}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Direct Mail</span>
            </a>
          </div>
        </div>

        {/* 2-Column Section Layout: Left Features Grid | Right Auto-Mail Order Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT 7-COL: Comprehensive Features of FarmGuard AI Hardware */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <CircuitBoard className="w-5 h-5 text-emerald-400" />
                FarmGuard AI Hardware Core Specifications & Capabilities
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Feature 1 */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 hover:border-emerald-800/50 transition-all space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-100">ESP8266 + Arduino Nano Core</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Dual Microcontroller design. 80MHz 32-bit RISC processor with 2.4GHz Wi-Fi cloud transceiver for reliable field telemetry streaming.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 hover:border-cyan-800/50 transition-all space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-100">Capacitive Moisture Probe v1.2</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Corrosion-resistant PCB probe measuring volumetric water content (% VWC) without rusting in moist or acidic soils over long seasons.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 hover:border-amber-800/50 transition-all space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-100">DHT22 Microclimate Sensor</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    High precision Air Temperature (-40 to 80°C ±0.5°C) and Humidity (0-100% ±2%) sensor for calculating Vapor Pressure Deficit (VPD).
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 hover:border-indigo-800/50 transition-all space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                    <Radio className="w-4 h-4" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-100">128x64 OLED Field Display</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ultra-low power monochrome OLED screen mounted on the field box allowing farmers to check soil moisture and crop status instantly without a smartphone.
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 hover:border-yellow-800/50 transition-all space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-950 border border-yellow-800/60 flex items-center justify-center text-yellow-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-100">Automated 12V Drip Pump Relay</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Built-in optocoupled 10A relay board to trigger irrigation solenoid valves automatically when soil moisture drops below critical levels.
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 hover:border-teal-800/50 transition-all space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400">
                    <BatteryCharging className="w-4 h-4" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-100">Solar & Off-Grid Ready</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Compatible with 5V Solar panel modules & 18650 LiFePO4 batteries with deep-sleep power optimization for 24/7 remote field operation.
                  </p>
                </div>
              </div>

              {/* What's Included in the Box Badge */}
              <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-950 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4" /> What's Included in Box:
                </span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">✓ Waterproof IP65 Casing</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">✓ 5m Sensor Cable Wire</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">✓ 1 Year Free Hardware Warranty</span>
                  <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-300">✓ FarmGuard AI Dashboard Activation</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 5-COL: Automatic Email Order Form */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/50 border border-emerald-800/60 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-base font-bold text-white">
                    Auto-Order Hardware via Mail
                  </h4>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                  Direct Factory Purchase
                </span>
              </div>

              {/* Target Email Banner */}
              <div className="bg-slate-950 border border-emerald-900/60 p-3 rounded-xl flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Order Dispatch Email:</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 truncate">
                    swastik20130201@gmail.com
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyEmailToClipboard}
                  className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Notification Banner on Order Click */}
              {orderSentNotification && (
                <div className="bg-emerald-900/90 border border-emerald-400 text-white p-3 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                  <div>
                    <strong>Email Client Opened!</strong> Your order draft to <span className="underline font-mono">swastik20130201@gmail.com</span> has been prepared. Please hit Send in your email app.
                  </div>
                </div>
              )}

              {/* Order Form */}
              <form onSubmit={handleDirectEmailOrder} className="space-y-3">
                
                {/* Kit Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Hardware Package
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedKit('standard')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedKit === 'standard'
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-emerald-400">Standard AI IoT Kit</div>
                      <div className="text-[11px] font-bold text-white mt-0.5">₹2,499 / $29</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">ESP8266 + Soil + DHT22</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedKit('solar_pro')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedKit === 'solar_pro'
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Solar Pro Kit
                      </div>
                      <div className="text-[11px] font-bold text-white mt-0.5">₹3,499 / $42</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">Includes Solar + Battery</div>
                    </button>
                  </div>
                </div>

                {/* Farmer Name & Contact */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Farmer / Buyer Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Phone / Whatsapp No.
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Village & Quantity */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Village / District
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Village Name"
                      value={buyerVillage}
                      onChange={(e) => setBuyerVillage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Quantity
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value={1}>1 Unit</option>
                      <option value={2}>2 Units</option>
                      <option value={3}>3 Units</option>
                      <option value={5}>5 Units (Farm Pack)</option>
                      <option value={10}>10 Units (Bulk Cooperative)</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Delivery Address / Landmark
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter delivery pin code, street, or landmark"
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Submit / Mail Trigger Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Auto Order Email to swastik20130201@gmail.com</span>
                </button>
              </form>

              {/* Order Guarantees */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-around text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" /> Free Dispatch
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Cash on Delivery (COD)
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> 1-Yr Warranty
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

