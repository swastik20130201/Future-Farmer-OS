import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Package,
  MapPin,
  Sparkles,
  Search,
  Filter,
  Warehouse,
  Plus,
  Clock,
  Check,
  AlertCircle,
  Phone,
  Tag,
  Receipt,
  FileCheck2,
} from 'lucide-react';
import { VillageInfo, MarketItem, MarketOrder } from '../types';
import { useCloudData } from '../context/CloudDataContext';
import { useAuth } from '../context/AuthContext';

interface DirectFarmMarketplaceProps {
  village: VillageInfo;
}

export const DirectFarmMarketplace: React.FC<DirectFarmMarketplaceProps> = ({ village }) => {
  const {
    marketItems,
    marketOrders,
    storageReceipts,
    addMarketItem,
    placeMarketOrder,
    updateOrderStatus,
    isCloudConnected,
  } = useCloudData();
  const { user } = useAuth();

  const [activeMarketTab, setActiveMarketTab] = useState<'browse' | 'orders' | 'architecture'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(false);

  // Modals
  const [showListingModal, setShowListingModal] = useState<boolean>(false);
  const [buyingItem, setBuyingItem] = useState<MarketItem | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: string; trackingCode: string } | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<MarketOrder | null>(null);

  // Buy Form State
  const [buyerName, setBuyerName] = useState<string>(user?.displayName || '');
  const [buyerContact, setBuyerContact] = useState<string>('+91 ');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [orderQuantityKg, setOrderQuantityKg] = useState<number>(20);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  // New Listing Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MarketItem['category']>('Vegetables');
  const [newPrice, setNewPrice] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newFarmerName, setNewFarmerName] = useState(user?.displayName || 'Farmer ' + village.name);
  const [newFarmerContact, setNewFarmerContact] = useState('+91 98450 ');
  const [newGrade, setNewGrade] = useState<'A+' | 'A' | 'B'>('A+');
  const [linkedSacReceiptId, setLinkedSacReceiptId] = useState<string>('');
  const [newImagePreset, setNewImagePreset] = useState<string>(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
  );
  const [newDesc, setNewDesc] = useState('');
  const [isSubmittingListing, setIsSubmittingListing] = useState<boolean>(false);

  const PRESET_IMAGES = [
    { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { label: 'Turmeric', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
    { label: 'Pulses / Dal', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { label: 'Citrus Oranges', url: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80' },
    { label: 'Fresh Vegetables', url: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80' },
    { label: 'Grains & Cereals', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
  ];

  const filteredItems = marketItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesGrade = selectedGrade === 'All' || item.grade === selectedGrade;
    const matchesVerified = !showVerifiedOnly || item.storageVerified;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesGrade && matchesVerified && matchesSearch;
  });

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyingItem || !buyerName || !buyerContact || !deliveryAddress || orderQuantityKg <= 0) return;

    setIsSubmittingOrder(true);
    try {
      const totalAmount = orderQuantityKg * buyingItem.pricePerKg + 250; // include cold-chain delivery fee
      const orderId = await placeMarketOrder({
        itemId: buyingItem.id,
        itemName: buyingItem.name,
        buyerName,
        buyerContact,
        deliveryAddress,
        quantityKg: orderQuantityKg,
        pricePerKg: buyingItem.pricePerKg,
        totalAmountInr: totalAmount,
      });

      const orderRef = marketOrders.find((o) => o.id === orderId);
      setOrderSuccess({
        orderId,
        trackingCode: orderRef?.trackingCode || `TRK-FF-${orderId.slice(-4)}`,
      });
      setBuyingItem(null);
    } catch (err) {
      console.error('Failed to place order in cloud:', err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleAddListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newQty) return;

    setIsSubmittingListing(true);
    try {
      await addMarketItem({
        name: newTitle,
        category: newCategory,
        farmerName: newFarmerName || 'Local Farmer',
        farmerContact: newFarmerContact,
        location: `${village.name}, ${village.state}`,
        pricePerKg: Number(newPrice),
        availableKg: Number(newQty),
        grade: newGrade,
        storageVerified: !!linkedSacReceiptId,
        sacReceiptId: linkedSacReceiptId || undefined,
        image: newImagePreset,
        description:
          newDesc ||
          `Freshly harvested produce from ${village.name}. Cleaned, graded (${newGrade}), and quality verified by FutureFarm OS.`,
      });

      setShowListingModal(false);
      setNewTitle('');
      setNewPrice('');
      setNewQty('');
      setNewDesc('');
      setLinkedSacReceiptId('');
    } catch (err) {
      console.error('Failed to add listing in cloud:', err);
    } finally {
      setIsSubmittingListing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 rounded-2xl border border-emerald-800/50 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <ShoppingBag className="w-3 h-3" /> Direct Cloud Commerce
            </span>
            <span className="text-xs text-emerald-300 font-mono">
              Live Cloud Synced • Zero Intermediary Exploitation
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Direct Farm Marketplace & Logistics Hub
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Directly connect farmers with wholesale buyers, retailers, and households. Transparent farm-gate pricing, verified cold-chain storage certification, and live delivery tracking.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowListingModal(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List Produce on Market</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveMarketTab('browse')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeMarketTab === 'browse'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Browse Farm Produce ({marketItems.length})</span>
        </button>

        <button
          onClick={() => setActiveMarketTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeMarketTab === 'orders'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Live Orders & Cold-Chain Delivery ({marketOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveMarketTab('architecture')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeMarketTab === 'architecture'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Middlemen vs FutureFarm OS Architecture</span>
        </button>
      </div>

      {/* TAB 1: BROWSE PRODUCE */}
      {activeMarketTab === 'browse' && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <Filter className="w-4 h-4 text-emerald-400 shrink-0 ml-1 mr-1" />
                {['All', 'Vegetables', 'Fruits', 'Pulses', 'Cereals', 'Organic Products'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search produce, farmer or city..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-4 text-slate-400">
                <span className="font-semibold text-slate-300">Grade Filter:</span>
                {['All', 'A+', 'A', 'B'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g)}
                    className={`font-semibold cursor-pointer ${
                      selectedGrade === g ? 'text-emerald-400 underline underline-offset-4' : 'hover:text-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={showVerifiedOnly}
                  onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-950"
                />
                <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                  <Warehouse className="w-3.5 h-3.5" /> Show Storage SAC Verified Only
                </span>
              </label>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-emerald-400 px-2.5 py-0.5 rounded-full">
                      {item.category}
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                      <span className="bg-slate-900/90 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Grade {item.grade}
                      </span>
                      {item.storageVerified && (
                        <span className="bg-emerald-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                          <Warehouse className="w-3 h-3" /> SAC Verified
                        </span>
                      )}
                    </div>

                    {item.availableKg <= 0 && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-red-950 text-red-300 border border-red-800 px-3 py-1 rounded-full text-xs font-bold">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{item.farmerName} • {item.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{item.description}</p>

                    {item.sacReceiptId && (
                      <div className="bg-emerald-950/30 border border-emerald-800/40 px-2.5 py-1.5 rounded-xl flex items-center justify-between text-[11px] text-emerald-300 font-mono">
                        <span className="flex items-center gap-1">
                          <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" /> SAC Batch: {item.sacReceiptId}
                        </span>
                        <span className="text-slate-400 text-[10px]">Cold Monitored</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Direct Farm Gate</span>
                        <span className="text-lg font-extrabold text-emerald-400">
                          ₹{item.pricePerKg} <span className="text-xs font-normal text-slate-400">/ kg</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Stock Available</span>
                        <span className={`text-xs font-bold ${item.availableKg > 0 ? 'text-slate-200' : 'text-red-400'}`}>
                          {item.availableKg} kg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    disabled={item.availableKg <= 0}
                    onClick={() => {
                      setBuyingItem(item);
                      setOrderQuantityKg(Math.min(50, Math.max(10, Math.floor(item.availableKg / 4))));
                    }}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Direct via FutureFarm Express</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE ORDERS & LOGISTICS TRACKER */}
      {activeMarketTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                Live Cold-Chain Dispatch & Buyer Orders
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time tracking of farm produce dispatches from Smart Storage Hubs straight to buyers.
              </p>
            </div>
            <span className="text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-3 py-1 rounded-full">
              {marketOrders.length} Cloud Active Orders
            </span>
          </div>

          <div className="space-y-4">
            {marketOrders.map((order) => {
              const statusColors: Record<MarketOrder['status'], string> = {
                'Order Placed': 'bg-amber-950 text-amber-300 border-amber-800',
                'Warehouse QC Verified': 'bg-cyan-950 text-cyan-300 border-cyan-800',
                'In Cold-Chain Transit': 'bg-indigo-950 text-indigo-300 border-indigo-800',
                'Delivered': 'bg-emerald-950 text-emerald-300 border-emerald-800',
                'Cancelled': 'bg-red-950 text-red-300 border-red-800',
              };

              return (
                <div
                  key={order.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{order.itemName}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          Order ID: <strong>{order.id}</strong> • Tracking: <span className="text-emerald-400">{order.trackingCode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-400">₹{order.totalAmountInr.toLocaleString()}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{order.quantityKg} kg @ ₹{order.pricePerKg}/kg</div>
                    </div>
                  </div>

                  {/* Delivery & Buyer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Buyer Name</span>
                      <span className="font-semibold text-slate-200">{order.buyerName}</span>
                      <span className="text-slate-400 block text-[11px]">{order.buyerContact}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Delivery Destination</span>
                      <span className="text-slate-300 line-clamp-2">{order.deliveryAddress}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Carrier & Logistics</span>
                      <span className="text-slate-200 font-medium">{order.carrierName || 'FutureFarm Reefer Express'}</span>
                      <span className="text-[10px] text-emerald-400 block">Temperature Controlled (4-8°C)</span>
                    </div>
                  </div>

                  {/* Order Progress Stepper */}
                  <div className="pt-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { label: 'Order Placed', step: 1 },
                        { label: 'SAC QC Passed', step: 2 },
                        { label: 'In Cold Transit', step: 3 },
                        { label: 'Delivered', step: 4 },
                      ].map((st) => {
                        const isDone =
                          (order.status === 'Order Placed' && st.step <= 1) ||
                          (order.status === 'Warehouse QC Verified' && st.step <= 2) ||
                          (order.status === 'In Cold-Chain Transit' && st.step <= 3) ||
                          order.status === 'Delivered';
                        return (
                          <div key={st.step} className="space-y-1">
                            <div
                              className={`h-1.5 rounded-full transition-colors ${
                                isDone ? 'bg-emerald-500' : 'bg-slate-800'
                              }`}
                            />
                            <span className={`text-[10px] font-semibold ${isDone ? 'text-emerald-300' : 'text-slate-500'}`}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions to Advance Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Created: {new Date(order.createdAt).toLocaleString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {order.status === 'Order Placed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Warehouse QC Verified')}
                          className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Pass SAC QC & Pack
                        </button>
                      )}
                      {order.status === 'Warehouse QC Verified' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'In Cold-Chain Transit')}
                          className="px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-slate-950 border border-indigo-500/40 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Dispatch Reefer Truck
                        </button>
                      )}
                      {order.status === 'In Cold-Chain Transit' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Confirm Delivery at Doorstep
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SUPPLY CHAIN TRANSFORMATION ARCHITECTURE */}
      {activeMarketTab === 'architecture' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Direct Farm Architecture vs Multi-Tier Exploitation
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                How FutureFarm OS disintermediates the supply chain to put 85%+ margin directly into farmer bank accounts.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-950 border border-emerald-800/60 px-3 py-1 rounded-full">
              +40% Net Farmer Earnings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Middlemen Flow (Red) */}
            <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-red-300 border-b border-red-900/50 pb-2">
                <span className="flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-400" /> Traditional Middlemen Flow
                </span>
                <span className="text-[10px] bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded">
                  25-30% Value Retained
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-red-950">
                <div className="flex items-center gap-2 text-red-200">
                  <span>1. Farmer</span> <ArrowRight className="w-3 h-3 text-red-500" />
                  <span>2. Village Broker (Dalal)</span> <ArrowRight className="w-3 h-3 text-red-500" />
                  <span>3. APMC Mandi</span>
                </div>
                <div className="flex items-center gap-2 text-red-200 pl-4">
                  <ArrowRight className="w-3 h-3 text-red-500" />
                  <span>4. City Wholesaler</span> <ArrowRight className="w-3 h-3 text-red-500" />
                  <span>5. Sub-Distributor</span> <ArrowRight className="w-3 h-3 text-red-500" />
                  <span>6. Retailer</span>
                </div>
              </div>

              <ul className="text-xs text-red-200/90 space-y-2 pt-1">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Huge Margin Loss:</strong> Produce sold at ₹20/kg reaches end consumer at ₹80/kg. Farmer only gets ₹20.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>30% Post-Harvest Rotting:</strong> Lack of cold-chain monitoring causes perishable crops to rot in open trucks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Delayed Payments:</strong> Farmers wait 30-90 days for cash settlement from unregulated intermediaries.</span>
                </li>
              </ul>
            </div>

            {/* FutureFarm OS Direct Flow (Green) */}
            <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-2xl p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300 border-b border-emerald-800/60 pb-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> FutureFarm OS Direct Cloud Model
                </span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                  85-90% Value Retained
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-emerald-300 bg-slate-950/60 p-3 rounded-xl border border-emerald-950">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-emerald-400">1. Farmer Sowing Plan</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                  <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-emerald-800 text-[11px]">Smart Storage SAC Hub</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                  <span className="font-bold text-emerald-300">Direct Cloud Order</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Doorstep Reefer Express</span>
                </div>
              </div>

              <ul className="text-xs text-emerald-200 space-y-2 pt-1">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Maximum Farmer Earnings:</strong> Produce listed at ₹55/kg directly reaches consumer at ₹60/kg. Farmer keeps ₹55.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Zero Distress Selling:</strong> Farmers store harvested produce in Smart Storage SACs until peak market prices emerge.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Instant Escrow Cloud Settlement:</strong> Payment released immediately upon QR scan delivery confirmation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: BUY DIRECT PRODUCE MODAL */}
      {buyingItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-800/60 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setBuyingItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Direct Farm Purchase</h3>
                <p className="text-xs text-slate-300">
                  Ordering <strong className="text-emerald-400">{buyingItem.name}</strong> from {buyingItem.farmerName}
                </p>
              </div>
            </div>

            <form onSubmit={handlePlaceOrderSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Farm Gate Price:</span>
                  <span className="font-bold text-emerald-400">₹{buyingItem.pricePerKg} / kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Available in Storage:</span>
                  <span className="text-slate-200">{buyingItem.availableKg} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Storage Quality Grade:</span>
                  <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-bold">
                    Grade {buyingItem.grade} Certified
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Order Quantity (kg)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={5}
                    max={Math.min(200, buyingItem.availableKg)}
                    step={5}
                    value={orderQuantityKg}
                    onChange={(e) => setOrderQuantityKg(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-base font-extrabold text-emerald-400 w-20 text-right">
                    {orderQuantityKg} kg
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Buyer / Company Name</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Ramesh Supermarket"
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={buyerContact}
                    onChange={(e) => setBuyerContact(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Delivery Destination Address</label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Full street address, city, district, pin code for refrigerated express delivery..."
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              {/* Total Calculation */}
              <div className="bg-emerald-950/50 border border-emerald-800/60 p-3 rounded-xl space-y-1.5 text-xs text-emerald-200">
                <div className="flex justify-between">
                  <span>Produce Subtotal ({orderQuantityKg} kg × ₹{buyingItem.pricePerKg}):</span>
                  <span className="font-bold">₹{orderQuantityKg * buyingItem.pricePerKg}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>FutureFarm Cold-Chain Transit & QC:</span>
                  <span>₹250</span>
                </div>
                <div className="flex justify-between border-t border-emerald-800/60 pt-1 text-sm font-extrabold text-emerald-300">
                  <span>Total Payable:</span>
                  <span>₹{(orderQuantityKg * buyingItem.pricePerKg + 250).toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingOrder}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmittingOrder ? 'Placing Cloud Order...' : 'Confirm Direct Purchase & Dispatch'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ORDER SUCCESS NOTIFICATION */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white">Order Confirmed & Cloud Synced!</h3>
            <p className="text-xs text-slate-300">
              Your purchase order has been written to the Firestore Cloud Database. The farmer and cold-storage hub have received the dispatch request.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-400">Tracking Code:</div>
              <div className="text-base font-bold text-emerald-400">{orderSuccess.trackingCode}</div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  setActiveMarketTab('orders');
                }}
                className="flex-1 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition-all cursor-pointer text-xs"
              >
                View in Live Tracker
              </button>
              <button
                onClick={() => setOrderSuccess(null)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: POST PRODUCE LISTING */}
      {showListingModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowListingModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> List Farm Produce on Marketplace
            </h3>

            <form onSubmit={handleAddListingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Crop / Produce Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Organic Salem Turmeric (Curcumin 5%)"
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Cereals">Cereals</option>
                    <option value="Organic Products">Organic Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quality Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none"
                  >
                    <option value="A+">Grade A+ (Export / Premium)</option>
                    <option value="A">Grade A (Standard High Quality)</option>
                    <option value="B">Grade B (Commercial Processing)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Farm-Gate Price (₹ / kg)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 180"
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Available Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Link to Smart Storage SAC */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Link to Stored Smart Storage SAC Receipt (Optional)
                </label>
                <select
                  value={linkedSacReceiptId}
                  onChange={(e) => setLinkedSacReceiptId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none text-xs font-mono"
                >
                  <option value="">-- No SAC Link (Direct Farm Harvest) --</option>
                  {storageReceipts.map((r) => (
                    <option key={r.receiptId} value={r.receiptId}>
                      {r.receiptId} • {r.cropType} ({r.quantityKg} kg in {r.hubLocation})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Linking to an active Smart Storage SAC automatically adds a "SAC Verified" certificate badge to your listing.
                </p>
              </div>

              {/* Photo Preset Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Produce Photo Preset</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      type="button"
                      key={img.label}
                      onClick={() => setNewImagePreset(img.url)}
                      className={`p-1.5 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        newImagePreset === img.url
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-6 h-6 rounded-lg object-cover" />
                      <span className="truncate">{img.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description & Quality Notes</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details about harvesting method, curcumin / moisture percentage, organic certification..."
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 outline-none focus:border-emerald-500 h-20"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingListing}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-950 cursor-pointer text-sm"
              >
                {isSubmittingListing ? 'Publishing to Cloud...' : 'Publish to Cloud Marketplace'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
