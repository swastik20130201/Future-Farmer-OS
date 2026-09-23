import React, { useState } from 'react';
import {
  Warehouse,
  FileCheck,
  Thermometer,
  Droplets,
  ShieldAlert,
  CheckCircle2,
  Plus,
  QrCode,
  Sparkles,
  ArrowRight,
  Clock,
  Tag,
  Wind,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  ExternalLink,
} from 'lucide-react';
import { VillageInfo, StorageReceipt } from '../types';
import { useCloudData } from '../context/CloudDataContext';
import { useAuth } from '../context/AuthContext';

interface SmartStorageNetworkProps {
  village: VillageInfo;
}

export const SmartStorageNetwork: React.FC<SmartStorageNetworkProps> = ({ village }) => {
  const {
    storageReceipts,
    addStorageDeposit,
    updateStorageTelemetry,
    withdrawStorageDeposit,
    convertSacToMarketListing,
    isCloudConnected,
  } = useCloudData();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'receipts' | 'chambers' | 'workflow'>('receipts');
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<StorageReceipt | null>(null);
  const [listingModalReceipt, setListingModalReceipt] = useState<StorageReceipt | null>(null);
  const [listingPrice, setListingPrice] = useState<string>('55');
  const [isListingInCloud, setIsListingInCloud] = useState<boolean>(false);
  const [purgingReceiptId, setPurgingReceiptId] = useState<string | null>(null);

  // Deposit Form state
  const [farmerName, setFarmerName] = useState(user?.displayName || 'Farmer ' + village.name);
  const [farmerContact, setFarmerContact] = useState('+91 98450 ');
  const [cropType, setCropType] = useState('Salem Turmeric');
  const [quantityKg, setQuantityKg] = useState('');
  const [grade, setGrade] = useState<'A+' | 'A' | 'B'>('A+');
  const [chamberSelect, setChamberSelect] = useState<'Chamber-1 Cold' | 'Chamber-2 Dry' | 'Chamber-3 Controlled'>(
    'Chamber-1 Cold'
  );
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

  const handleDepositCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !quantityKg) return;

    setIsSubmittingDeposit(true);
    try {
      const isCold = chamberSelect === 'Chamber-1 Cold';
      const isDry = chamberSelect === 'Chamber-2 Dry';
      const initialTemp = isCold ? 4 : isDry ? 22 : 15;
      const initialHumidity = isCold ? 85 : isDry ? 45 : 55;

      await addStorageDeposit({
        farmerName,
        farmerContact,
        village: `${village.name}, ${village.district}`,
        cropType,
        quantityKg: Number(quantityKg),
        grade,
        hubLocation: `${village.name} Central Storage Sac Hub`,
        temperature: initialTemp,
        humidity: initialHumidity,
        spoilageRiskPct: 2,
      });

      setShowDepositModal(false);
      setQuantityKg('');
    } catch (err) {
      console.error('Failed to add storage deposit:', err);
    } finally {
      setIsSubmittingDeposit(false);
    }
  };

  const handlePurgeAtmosphere = async (receipt: StorageReceipt) => {
    setPurgingReceiptId(receipt.receiptId);
    try {
      // simulate nitrogen flush / climate stabilization
      const newTemp = Math.max(2, receipt.temperature - 1.5);
      const newHumidity = Math.max(35, receipt.humidity - 4);
      const newRisk = Math.max(1, Math.floor(receipt.spoilageRiskPct / 2));
      await updateStorageTelemetry(receipt.receiptId, newTemp, newHumidity, newRisk);
    } catch (err) {
      console.error('Failed to purge atmosphere:', err);
    } finally {
      setTimeout(() => setPurgingReceiptId(null), 800);
    }
  };

  const handleConfirmMarketListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingModalReceipt || !listingPrice) return;

    setIsListingInCloud(true);
    try {
      await convertSacToMarketListing(listingModalReceipt.receiptId, Number(listingPrice));
      setListingModalReceipt(null);
    } catch (err) {
      console.error('Failed to convert SAC to marketplace listing:', err);
    } finally {
      setIsListingInCloud(false);
    }
  };

  const totalKgStored = storageReceipts.reduce((sum, r) => sum + (r.status !== 'Sold & Dispatched' ? r.quantityKg : 0), 0);
  const avgRisk = storageReceipts.length > 0
    ? (storageReceipts.reduce((sum, r) => sum + r.spoilageRiskPct, 0) / storageReceipts.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-2xl border border-emerald-800/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Warehouse className="w-3 h-3" /> Smart Storage SAC Network
            </span>
            <span className="text-xs text-emerald-300 font-mono">
              Live Cloud Telemetry • Zero Post-Harvest Distress Sales
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Smart Crop Storage Hubs & IoT Sac Preservation
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Store harvested crops in climate-controlled IoT vaults with real-time moisture & ethylene monitoring. Hold inventory safely until market prices peak, or convert SAC receipts into live marketplace listings with 1 click.
          </p>
        </div>

        <button
          onClick={() => setShowDepositModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Deposit Harvest & Issue SAC Receipt</span>
        </button>
      </div>

      {/* Metrics Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Stored Volume</span>
          <span className="text-xl font-extrabold text-white">{totalKgStored.toLocaleString()} <span className="text-xs font-normal text-slate-400">KG</span></span>
          <span className="text-[10px] text-emerald-400 block font-mono">100% Verified Quality</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Digital SACs</span>
          <span className="text-xl font-extrabold text-emerald-400">{storageReceipts.length} <span className="text-xs font-normal text-slate-400">Receipts</span></span>
          <span className="text-[10px] text-cyan-400 block font-mono">Cloud Synced</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg Spoilage Risk</span>
          <span className="text-xl font-extrabold text-cyan-300">{avgRisk}%</span>
          <span className="text-[10px] text-emerald-400 block font-mono">Well Below 10% Threshold</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Collateral Value</span>
          <span className="text-xl font-extrabold text-amber-300">₹{(totalKgStored * 52).toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block font-mono">Bank Loan Eligible</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('receipts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'receipts'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Active Digital SAC Receipts ({storageReceipts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('chambers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'chambers'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>IoT Climate Chambers & Live Sensors</span>
        </button>

        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'workflow'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Storage Sacs Operating Lifecycle</span>
        </button>
      </div>

      {/* TAB 1: RECEIPTS & ACTIVE INVENTORY */}
      {activeTab === 'receipts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storageReceipts.map((rec) => {
              const statusColors: Record<StorageReceipt['status'], string> = {
                'In Storage (Safe)': 'bg-emerald-950 text-emerald-300 border-emerald-800',
                'Listed on Market': 'bg-cyan-950 text-cyan-300 border-cyan-800',
                'Sold & Dispatched': 'bg-slate-900 text-slate-400 border-slate-700',
                'Withdrawn by Farmer': 'bg-amber-950 text-amber-300 border-amber-800',
              };

              return (
                <div
                  key={rec.receiptId}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        <span className="font-mono text-xs font-bold text-emerald-300">
                          {rec.receiptId}
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                        Grade {rec.grade}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-white">{rec.cropType}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[rec.status]}`}>
                          {rec.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Farmer: <strong className="text-slate-200">{rec.farmerName}</strong> ({rec.village})
                      </div>
                    </div>

                    {/* Sensor Monitoring metrics */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Quantity</span>
                        <span className="font-bold text-slate-200">{rec.quantityKg} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Vault Temp</span>
                        <span className="font-bold text-cyan-300">{rec.temperature}°C</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">Spoilage Risk</span>
                        <span className={`font-bold ${rec.spoilageRiskPct > 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {rec.spoilageRiskPct}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Deposited: {rec.depositDate}</span>
                      <button
                        onClick={() => handlePurgeAtmosphere(rec)}
                        disabled={purgingReceiptId === rec.receiptId}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
                        title="Purge ethylene gas & stabilize humidity"
                      >
                        <Wind className={`w-3 h-3 ${purgingReceiptId === rec.receiptId ? 'animate-spin' : ''}`} />
                        <span>{purgingReceiptId === rec.receiptId ? 'Flushing...' : 'Purge Gas'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReceipt(rec)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Certificate</span>
                    </button>

                    {rec.status === 'In Storage (Safe)' && (
                      <button
                        onClick={() => setListingModalReceipt(rec)}
                        className="py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md"
                      >
                        <Tag className="w-3.5 h-3.5" /> <span>List to Sell</span>
                      </button>
                    )}

                    {rec.status === 'Listed on Market' && (
                      <span className="py-2 px-3 bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-[11px] font-bold rounded-xl flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Live on Market
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: IOT CLIMATE CHAMBERS & SENSORS */}
      {activeTab === 'chambers' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-emerald-400" />
                Live Cold-Chain & Moisture Vault Chambers
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-chamber environmental control preserving moisture content, preventing fungal aflatoxins, and inhibiting premature ripening.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Chamber 1 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-xs">Chamber 1: Cold Perishables</span>
                  <span className="bg-cyan-950 text-cyan-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">4°C Active</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Crops:</span>
                    <span className="font-semibold text-slate-200">Tomatoes, Oranges, Leafy Greens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Relative Humidity:</span>
                    <span className="font-bold text-cyan-300">85% ± 2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ethylene Scrubber:</span>
                    <span className="text-emerald-400 font-semibold">Active & Filtering</span>
                  </div>
                </div>
              </div>

              {/* Chamber 2 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-xs">Chamber 2: Dry Grain & Pulses</span>
                  <span className="bg-amber-950 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">22°C Controlled</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Crops:</span>
                    <span className="font-semibold text-slate-200">Pigeon Pea, Mustard, Wheat</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Moisture Threshold:</span>
                    <span className="font-bold text-amber-300">&lt; 12% Moisture</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pest Infestation:</span>
                    <span className="text-emerald-400 font-semibold">0% (Hermetic Seal)</span>
                  </div>
                </div>
              </div>

              {/* Chamber 3 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-xs">Chamber 3: Spices & High Value</span>
                  <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">16°C Nitrogen</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Crops:</span>
                    <span className="font-semibold text-slate-200">Turmeric, Ginger, Cardamom</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Curcumin Preservation:</span>
                    <span className="font-bold text-emerald-300">99.4% Active Potency</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nitrogen Blanket:</span>
                    <span className="text-emerald-400 font-semibold">Enabled (98% N2)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OPERATING LIFECYCLE */}
      {activeTab === 'workflow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> FutureFarm Storage Sac Lifecycle
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {[
              { num: '1', title: 'Harvest Crop', desc: 'Farmer harvests crop at peak maturity and delivers to regional hub' },
              { num: '2', title: 'Store in Hub', desc: 'Deposit in nearby FutureFarm Storage Sac climate vault' },
              { num: '3', title: 'Grade & Record', desc: 'IoT sensors test moisture, curcurmin/protein, and certify grade' },
              { num: '4', title: 'Digital Receipt', desc: 'Farmer receives verified QR Storage Sac receipt on cloud' },
              { num: '5', title: 'Marketplace Listing', desc: '1-click direct sale to buyers when market prices peak' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                    {item.num}
                  </span>
                  {idx < 4 && <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />}
                </div>
                <div>
                  <div className="font-bold text-slate-200">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: DIGITAL CERTIFICATE QR MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative font-mono text-slate-200">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>

            <div className="text-center border-b border-slate-800 pb-3 space-y-1">
              <div className="flex justify-center mb-1">
                <QrCode className="w-14 h-14 text-emerald-400 p-1.5 bg-slate-950 rounded-xl border border-emerald-800" />
              </div>
              <h3 className="text-base font-bold text-emerald-400 uppercase tracking-widest">
                FutureFarm Storage Sac Receipt
              </h3>
              <p className="text-[10px] text-slate-400">TAMPER-PROOF IOT WAREHOUSE CERTIFICATE</p>
            </div>

            <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Receipt ID:</span>
                <span className="font-bold text-emerald-300">{selectedReceipt.receiptId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Farmer Name:</span>
                <span>{selectedReceipt.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Village / District:</span>
                <span>{selectedReceipt.village}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Crop Commodity:</span>
                <span className="font-bold text-white">{selectedReceipt.cropType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity Stored:</span>
                <span className="font-bold text-emerald-400">{selectedReceipt.quantityKg} KG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lab Certified Grade:</span>
                <span className="text-amber-300 font-bold">Grade {selectedReceipt.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hub Location:</span>
                <span className="text-[10px] text-slate-300">{selectedReceipt.hubLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Spoilage Risk:</span>
                <span className="text-emerald-400 font-bold">{selectedReceipt.spoilageRiskPct}% (Optimal)</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center">
              Verified by FutureFarm OS IoT Sensors • Collateral Loan Eligible
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 1-CLICK MARKETPLACE LISTING CONVERSION */}
      {listingModalReceipt && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/60 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setListingModalReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">List Storage SAC on Marketplace</h3>
                <p className="text-xs text-slate-400">
                  Listing {listingModalReceipt.quantityKg} kg of {listingModalReceipt.cropType}
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmMarketListing} className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">SAC Receipt ID:</span>
                  <span className="font-mono text-emerald-300">{listingModalReceipt.receiptId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity Stored:</span>
                  <span className="font-bold text-white">{listingModalReceipt.quantityKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Certified Grade:</span>
                  <span className="text-amber-300 font-bold">Grade {listingModalReceipt.grade}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Set Asking Price (₹ / kg)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  placeholder="e.g. 60"
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500 text-sm font-bold text-emerald-400"
                />
              </div>

              <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-xl text-[11px] text-emerald-200">
                <span>Estimated Gross Revenue: </span>
                <strong className="text-emerald-300 text-sm">
                  ₹{(listingModalReceipt.quantityKg * Number(listingPrice || 0)).toLocaleString()}
                </strong>
              </div>

              <button
                type="submit"
                disabled={isListingInCloud}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-950 cursor-pointer text-xs"
              >
                {isListingInCloud ? 'Publishing to Cloud...' : 'Publish to Direct Farm Market'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DEPOSIT CROP HARVEST */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowDepositModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Deposit Harvest to Smart Storage SAC
            </h3>

            <form onSubmit={handleDepositCrop} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Farmer Name</label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={farmerContact}
                    onChange={(e) => setFarmerContact(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Crop Type</label>
                  <input
                    type="text"
                    required
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder="e.g. Salem Turmeric, Toor Dal"
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deposit Quantity (KG)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quality Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                  >
                    <option value="A+">Grade A+ (Export Quality)</option>
                    <option value="A">Grade A (Standard Commercial)</option>
                    <option value="B">Grade B (Local Process Grade)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Storage Chamber Type</label>
                  <select
                    value={chamberSelect}
                    onChange={(e) => setChamberSelect(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                  >
                    <option value="Chamber-1 Cold">Chamber 1: Cold (4°C)</option>
                    <option value="Chamber-2 Dry">Chamber 2: Dry Grain (22°C)</option>
                    <option value="Chamber-3 Controlled">Chamber 3: Spices (16°C)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingDeposit}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-950 cursor-pointer text-xs"
              >
                {isSubmittingDeposit ? 'Generating Digital SAC in Cloud...' : 'Confirm Deposit & Generate Cloud SAC Receipt'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
