import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
  MarketItem,
  MarketOrder,
  StorageReceipt,
  AnonymousCropRegistration,
  DigitalTwinFarm as TwinType,
  FarmSeasonLog,
  KnowledgeEntry,
  VillageInfo,
} from '../types';
import { SAMPLE_DIGITAL_TWIN } from '../data/mockAgricultureData';

// Initial default items if Firestore collection is brand new
const SEED_MARKET_ITEMS: MarketItem[] = [
  {
    id: 'm1',
    name: 'Organic Salem Turmeric Powder',
    category: 'Organic Products',
    farmerName: 'Rameshwar Sahoo',
    farmerContact: '+91 98450 11203',
    location: 'Cuttack, Odisha',
    pricePerKg: 180,
    availableKg: 450,
    grade: 'A+',
    storageVerified: true,
    sacReceiptId: 'FF-SAC-1082',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    description: 'High curcumin content (5.2%) grown with zero chemical pesticides. Monitored & cold-stored in Smart Storage Sac #04 at 16°C.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm2',
    name: 'Fresh Hydroponic Vine Tomatoes',
    category: 'Vegetables',
    farmerName: 'Priya Sharma',
    farmerContact: '+91 94140 22910',
    location: 'Jaipur, Rajasthan',
    pricePerKg: 32,
    availableKg: 1200,
    grade: 'A',
    storageVerified: true,
    sacReceiptId: 'FF-SAC-4109',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    description: 'Firm, pesticide-free vine-ripe tomatoes harvested daily directly from climate-controlled solar greenhouse.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm3',
    name: 'Desi Toor Dal (Unpolished Pigeon Pea)',
    category: 'Pulses',
    farmerName: 'Anil Kumar',
    farmerContact: '+91 98260 44921',
    location: 'Indore, MP',
    pricePerKg: 125,
    availableKg: 800,
    grade: 'A+',
    storageVerified: true,
    sacReceiptId: 'FF-SAC-3019',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Unpolished protein-dense pigeon peas cleaned & graded in certified Indore Smart Storage Hub.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm4',
    name: 'Premium Aged Basmati Rice (1121)',
    category: 'Cereals',
    farmerName: 'Harpal Singh',
    farmerContact: '+91 98120 77334',
    location: 'Karnal, Haryana',
    pricePerKg: 95,
    availableKg: 2500,
    grade: 'A+',
    storageVerified: true,
    sacReceiptId: 'FF-SAC-5520',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Extra long-grain aged aromatic basmati with zero broken grains. Direct farm-gate transparent pricing.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm5',
    name: 'Nagpur Organic Sweet Oranges',
    category: 'Fruits',
    farmerName: 'Sunil Deshmukh',
    farmerContact: '+91 97630 88129',
    location: 'Nagpur, Maharashtra',
    pricePerKg: 70,
    availableKg: 600,
    grade: 'A+',
    storageVerified: true,
    sacReceiptId: 'FF-SAC-2041',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80',
    description: 'Juicy, farm-fresh citrus oranges preserved in Nagpur Cold Preservation Hub at 4°C with 85% relative humidity.',
    createdAt: new Date().toISOString(),
  },
];

const SEED_STORAGE_RECEIPTS: StorageReceipt[] = [
  {
    receiptId: 'FF-SAC-1082',
    farmerName: 'Dhananjay Das',
    village: 'Cuttack District, Odisha',
    cropType: 'Salem Turmeric',
    variety: 'Curcumin Rich Grade-1',
    quantityKg: 850,
    depositDate: '2026-07-15',
    expiryDate: '2027-07-15',
    grade: 'A+',
    hubLocation: 'Cuttack Central Storage Sac Hub #1',
    chamberType: 'Cold Dehumidifier Sac Chamber',
    temperature: 16.2,
    humidity: 54,
    ethylenePpm: 0.12,
    spoilageRiskPct: 3.5,
    shelfLifeDays: 320,
    sacTagId: 'RFID-SAC-1082-OR',
    status: 'Listed on Market',
    notes: 'Hermetically vacuum sealed with wireless moisture probe monitoring.',
    createdAt: new Date().toISOString(),
  },
  {
    receiptId: 'FF-SAC-2041',
    farmerName: 'Mahesh Patil',
    village: 'Nagpur Region, Maharashtra',
    cropType: 'Nagpur Oranges',
    variety: 'Mandarins Grade-A',
    quantityKg: 1200,
    depositDate: '2026-07-28',
    expiryDate: '2026-10-28',
    grade: 'A',
    hubLocation: 'Nagpur Cold Preservation Hub',
    chamberType: 'Solar Micro-Cold Room (4°C)',
    temperature: 4.1,
    humidity: 86,
    ethylenePpm: 0.45,
    spoilageRiskPct: 7.8,
    shelfLifeDays: 75,
    sacTagId: 'RFID-SAC-2041-MH',
    status: 'Listed on Market',
    notes: 'Preserved at 4°C with active ozone scrubber to prevent citrus mold.',
    createdAt: new Date().toISOString(),
  },
  {
    receiptId: 'FF-SAC-3019',
    farmerName: 'Suraj Pal',
    village: 'Indore Region, MP',
    cropType: 'Pigeon Pea (Toor)',
    variety: 'Unpolished Desi Toor',
    quantityKg: 2000,
    depositDate: '2026-06-10',
    expiryDate: '2027-06-10',
    grade: 'A+',
    hubLocation: 'Malwa Dry Storage Vault',
    chamberType: 'Grain Silo Hermetic Sac',
    temperature: 21.5,
    humidity: 44,
    ethylenePpm: 0.05,
    spoilageRiskPct: 2.1,
    shelfLifeDays: 340,
    sacTagId: 'RFID-SAC-3019-MP',
    status: 'In Storage (Safe)',
    notes: 'Zero pesticide nitrogen-flushed silo sac bag.',
    createdAt: new Date().toISOString(),
  },
  {
    receiptId: 'FF-SAC-4109',
    farmerName: 'Priya Sharma',
    village: 'Jaipur Region, Rajasthan',
    cropType: 'Hydroponic Tomatoes',
    variety: 'Red Vine Cherry & Beefsteak',
    quantityKg: 650,
    depositDate: '2026-08-25',
    expiryDate: '2026-09-25',
    grade: 'A',
    hubLocation: 'Jaipur Cold Hub Sac Pod #3',
    chamberType: 'Controlled Atmosphere (10°C)',
    temperature: 10.4,
    humidity: 88,
    ethylenePpm: 0.32,
    spoilageRiskPct: 5.2,
    shelfLifeDays: 24,
    sacTagId: 'RFID-SAC-4109-RJ',
    status: 'In Storage (Safe)',
    notes: 'Pre-cooled within 2 hours of harvest to preserve vitamin C & firmness.',
    createdAt: new Date().toISOString(),
  },
];

const SEED_ORDERS: MarketOrder[] = [
  {
    id: 'ord-8812',
    itemId: 'm1',
    itemName: 'Organic Salem Turmeric Powder',
    buyerName: 'Akash Organic Retail & Spices',
    buyerContact: '+91 98310 99012',
    deliveryAddress: 'Plot 44, Industrial Area, Sector 5, Bhubaneswar, Odisha',
    quantityKg: 50,
    pricePerKg: 180,
    totalAmountInr: 9000,
    status: 'In Cold-Chain Transit',
    trackingCode: 'TRK-FF-8812-IN',
    carrierName: 'AgriCold Logistics Express',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'ord-9043',
    itemId: 'm5',
    itemName: 'Nagpur Organic Sweet Oranges',
    buyerName: 'FreshBasket Supermarkets Ltd',
    buyerContact: '+91 99220 54100',
    deliveryAddress: 'Distribution Hub 12, APMC Market, Vashi, Navi Mumbai',
    quantityKg: 150,
    pricePerKg: 70,
    totalAmountInr: 10500,
    status: 'Warehouse QC Verified',
    trackingCode: 'TRK-FF-9043-MH',
    carrierName: 'Kisan Rath Reefer Transport',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

interface CloudDataContextType {
  isCloudConnected: boolean;
  isSyncing: boolean;
  marketItems: MarketItem[];
  marketOrders: MarketOrder[];
  storageReceipts: StorageReceipt[];
  cropRegistrations: AnonymousCropRegistration[];
  twinFarm: TwinType;
  knowledgeEntries: KnowledgeEntry[];
  
  // Real Marketplace Actions
  addMarketItem: (item: Omit<MarketItem, 'id' | 'createdAt'>) => Promise<string>;
  updateMarketItem: (id: string, updates: Partial<MarketItem>) => Promise<void>;
  placeMarketOrder: (order: Omit<MarketOrder, 'id' | 'createdAt' | 'status' | 'trackingCode'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: MarketOrder['status']) => Promise<void>;
  
  // Real Smart Storage SAC Actions
  depositCropToSac: (receipt: Omit<StorageReceipt, 'id' | 'receiptId' | 'createdAt' | 'sacTagId'>) => Promise<string>;
  listSacOnMarketplace: (receiptId: string, pricePerKg: number, description?: string) => Promise<string>;
  dispatchSac: (receiptId: string, action: 'Sold & Dispatched' | 'Withdrawn by Farmer') => Promise<void>;
  updateSacTelemetry: (receiptId: string, telemetry: { temperature: number; humidity: number; ethylenePpm?: number; spoilageRiskPct: number }) => Promise<void>;

  // Real Farm Section Actions
  addCropRegistration: (reg: Omit<AnonymousCropRegistration, 'id' | 'registeredAt'>) => Promise<string>;
  addSeasonLog: (log: Omit<FarmSeasonLog, 'id'>) => Promise<void>;
  updateTwinFarm: (updates: Partial<TwinType>) => Promise<void>;

  // Real Knowledge Vault Actions
  addKnowledgeEntry: (entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'upvotes'>) => Promise<string>;
  upvoteKnowledgeEntry: (id: string) => Promise<void>;
}

const CloudDataContext = createContext<CloudDataContextType | null>(null);

export const CloudDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [marketItems, setMarketItems] = useState<MarketItem[]>(SEED_MARKET_ITEMS);
  const [marketOrders, setMarketOrders] = useState<MarketOrder[]>(SEED_ORDERS);
  const [storageReceipts, setStorageReceipts] = useState<StorageReceipt[]>(SEED_STORAGE_RECEIPTS);
  const [cropRegistrations, setCropRegistrations] = useState<AnonymousCropRegistration[]>([]);
  const [twinFarm, setTwinFarm] = useState<TwinType>(SAMPLE_DIGITAL_TWIN);
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([]);

  // 1. Initial connection test and real-time Firestore listeners setup
  useEffect(() => {
    let unsubItems: () => void = () => {};
    let unsubOrders: () => void = () => {};
    let unsubReceipts: () => void = () => {};
    let unsubRegs: () => void = () => {};
    let unsubTwin: () => void = () => {};
    let unsubKnowledge: () => void = () => {};

    const initializeCloud = async () => {
      setIsSyncing(true);
      const connected = await testFirestoreConnection();
      setIsCloudConnected(connected);

      // --- 1. Market Items Live Listener ---
      const itemsCollection = collection(db, 'market_items');
      unsubItems = onSnapshot(
        itemsCollection,
        async (snapshot) => {
          if (snapshot.empty) {
            // Seed initial items to Firestore so they persist in the cloud
            for (const item of SEED_MARKET_ITEMS) {
              await setDoc(doc(db, 'market_items', item.id), item).catch((e) =>
                console.warn('Seed item save:', e)
              );
            }
            setMarketItems(SEED_MARKET_ITEMS);
          } else {
            const list: MarketItem[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...(d.data() as Omit<MarketItem, 'id'>) });
            });
            setMarketItems(list);
          }
          setIsSyncing(false);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'market_items');
          setIsSyncing(false);
        }
      );

      // --- 2. Market Orders Live Listener ---
      const ordersCollection = collection(db, 'market_orders');
      unsubOrders = onSnapshot(
        ordersCollection,
        async (snapshot) => {
          if (snapshot.empty) {
            for (const order of SEED_ORDERS) {
              await setDoc(doc(db, 'market_orders', order.id), order).catch((e) =>
                console.warn('Seed order save:', e)
              );
            }
            setMarketOrders(SEED_ORDERS);
          } else {
            const list: MarketOrder[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...(d.data() as Omit<MarketOrder, 'id'>) });
            });
            // Sort by most recent
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setMarketOrders(list);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'market_orders');
        }
      );

      // --- 3. Smart Storage SACS Receipts Live Listener ---
      const receiptsCollection = collection(db, 'storage_receipts');
      unsubReceipts = onSnapshot(
        receiptsCollection,
        async (snapshot) => {
          if (snapshot.empty) {
            for (const rec of SEED_STORAGE_RECEIPTS) {
              await setDoc(doc(db, 'storage_receipts', rec.receiptId), rec).catch((e) =>
                console.warn('Seed storage receipt save:', e)
              );
            }
            setStorageReceipts(SEED_STORAGE_RECEIPTS);
          } else {
            const list: StorageReceipt[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...(d.data() as Omit<StorageReceipt, 'id'>) });
            });
            list.sort((a, b) => new Date(b.depositDate).getTime() - new Date(a.depositDate).getTime());
            setStorageReceipts(list);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'storage_receipts');
        }
      );

      // --- 4. Crop Registrations Live Listener ---
      const regsCollection = collection(db, 'crop_registrations');
      unsubRegs = onSnapshot(
        regsCollection,
        (snapshot) => {
          const list: AnonymousCropRegistration[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...(d.data() as Omit<AnonymousCropRegistration, 'id'>) });
          });
          setCropRegistrations(list);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'crop_registrations');
        }
      );

      // --- 5. Digital Twin Live Listener ---
      const twinDocRef = doc(db, 'digital_twins', 'main_twin');
      unsubTwin = onSnapshot(
        twinDocRef,
        async (docSnap) => {
          if (docSnap.exists()) {
            setTwinFarm(docSnap.data() as TwinType);
          } else {
            await setDoc(twinDocRef, SAMPLE_DIGITAL_TWIN).catch((e) =>
              console.warn('Seed twin save:', e)
            );
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'digital_twins/main_twin');
        }
      );

      // --- 6. Knowledge Vault Live Listener ---
      const knowledgeCollection = collection(db, 'knowledge_vault');
      unsubKnowledge = onSnapshot(
        knowledgeCollection,
        (snapshot) => {
          const list: KnowledgeEntry[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...(d.data() as Omit<KnowledgeEntry, 'id'>) });
          });
          list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
          setKnowledgeEntries(list);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'knowledge_vault');
        }
      );
    };

    initializeCloud();

    return () => {
      unsubItems();
      unsubOrders();
      unsubReceipts();
      unsubRegs();
      unsubTwin();
      unsubKnowledge();
    };
  }, []);

  // --- Real Marketplace Actions ---
  const addMarketItem = async (item: Omit<MarketItem, 'id' | 'createdAt'>): Promise<string> => {
    const id = `m-${Date.now()}`;
    const newItem: MarketItem = {
      ...item,
      id,
      farmerUid: user?.uid || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'market_items', id), newItem);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `market_items/${id}`);
      return id;
    }
  };

  const updateMarketItem = async (id: string, updates: Partial<MarketItem>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'market_items', id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `market_items/${id}`);
    }
  };

  const placeMarketOrder = async (
    orderData: Omit<MarketOrder, 'id' | 'createdAt' | 'status' | 'trackingCode'>
  ): Promise<string> => {
    const id = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingCode = `TRK-FF-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: MarketOrder = {
      ...orderData,
      id,
      status: 'Order Placed',
      trackingCode,
      carrierName: 'AgriCold Express Logistics',
      buyerUid: user?.uid || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Create order doc in Firestore
      await setDoc(doc(db, 'market_orders', id), newOrder);

      // 2. Reduce available quantity in the item doc
      const targetItem = marketItems.find((i) => i.id === orderData.itemId);
      if (targetItem) {
        const remainingKg = Math.max(0, targetItem.availableKg - orderData.quantityKg);
        await updateDoc(doc(db, 'market_items', targetItem.id), {
          availableKg: remainingKg,
          updatedAt: new Date().toISOString(),
        });
      }

      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `market_orders/${id}`);
      return id;
    }
  };

  const updateOrderStatus = async (orderId: string, status: MarketOrder['status']): Promise<void> => {
    try {
      await updateDoc(doc(db, 'market_orders', orderId), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `market_orders/${orderId}`);
    }
  };

  // --- Real Smart Storage SAC Actions ---
  const depositCropToSac = async (
    receiptData: Omit<StorageReceipt, 'id' | 'receiptId' | 'createdAt' | 'sacTagId'>
  ): Promise<string> => {
    const num = Math.floor(1000 + Math.random() * 9000);
    const receiptId = `FF-SAC-${num}`;
    const sacTagId = `RFID-SAC-${num}`;

    const newReceipt: StorageReceipt = {
      ...receiptData,
      receiptId,
      sacTagId,
      farmerUid: user?.uid || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'storage_receipts', receiptId), newReceipt);
      return receiptId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `storage_receipts/${receiptId}`);
      return receiptId;
    }
  };

  const listSacOnMarketplace = async (
    receiptId: string,
    pricePerKg: number,
    customDescription?: string
  ): Promise<string> => {
    const rec = storageReceipts.find((r) => r.receiptId === receiptId);
    if (!rec) throw new Error('Storage SAC receipt not found');

    // 1. Update receipt status in Firestore
    await updateDoc(doc(db, 'storage_receipts', receiptId), {
      status: 'Listed on Market',
      updatedAt: new Date().toISOString(),
    });

    // 2. Create verified marketplace listing in Firestore
    const categoryMap: Record<string, MarketItem['category']> = {
      Turmeric: 'Organic Products',
      Oranges: 'Fruits',
      Tomato: 'Vegetables',
      Tomatoes: 'Vegetables',
      'Pigeon Pea': 'Pulses',
      Toor: 'Pulses',
      Rice: 'Cereals',
      Wheat: 'Cereals',
      Mustard: 'Organic Products',
    };

    let category: MarketItem['category'] = 'Organic Products';
    for (const [key, cat] of Object.entries(categoryMap)) {
      if (rec.cropType.toLowerCase().includes(key.toLowerCase())) {
        category = cat;
        break;
      }
    }

    const defaultImages: Record<string, string> = {
      Fruits: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80',
      Vegetables: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
      Pulses: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      Cereals: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      'Organic Products': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    };

    const itemId = `m-sac-${Date.now()}`;
    const newMarketItem: MarketItem = {
      id: itemId,
      name: `${rec.cropType} (${rec.variety || 'Premium Batch'})`,
      category,
      farmerName: rec.farmerName,
      location: rec.village,
      pricePerKg,
      availableKg: rec.quantityKg,
      grade: rec.grade,
      storageVerified: true,
      sacReceiptId: rec.receiptId,
      image: defaultImages[category] || defaultImages['Organic Products'],
      description:
        customDescription ||
        `Verified Smart Storage SAC crop batch. Preserved at ${rec.temperature}°C in ${rec.hubLocation}. Low spoilage risk (${rec.spoilageRiskPct}%). Direct farm dispatch guarantee.`,
      farmerUid: user?.uid || undefined,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'market_items', itemId), newMarketItem);
    return itemId;
  };

  const dispatchSac = async (
    receiptId: string,
    action: 'Sold & Dispatched' | 'Withdrawn by Farmer'
  ): Promise<void> => {
    try {
      await updateDoc(doc(db, 'storage_receipts', receiptId), {
        status: action,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `storage_receipts/${receiptId}`);
    }
  };

  const updateSacTelemetry = async (
    receiptId: string,
    telemetry: { temperature: number; humidity: number; ethylenePpm?: number; spoilageRiskPct: number }
  ): Promise<void> => {
    try {
      await updateDoc(doc(db, 'storage_receipts', receiptId), {
        ...telemetry,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `storage_receipts/${receiptId}`);
    }
  };

  // --- Real Farm Section Actions ---
  const addCropRegistration = async (
    reg: Omit<AnonymousCropRegistration, 'id' | 'registeredAt'>
  ): Promise<string> => {
    const id = `reg-${Date.now()}`;
    const newReg: AnonymousCropRegistration = {
      ...reg,
      id,
      registeredAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'crop_registrations', id), newReg);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `crop_registrations/${id}`);
      return id;
    }
  };

  const addSeasonLog = async (log: Omit<FarmSeasonLog, 'id'>): Promise<void> => {
    const newLogId = `s-${Date.now()}`;
    const newSeasonLog: FarmSeasonLog = {
      ...log,
      id: newLogId,
    };

    const updatedSeasons = [newSeasonLog, ...(twinFarm.seasons || [])];
    const newScore = Math.min(99, (twinFarm.twinIntelligenceScore || 72) + 3);

    const updatedTwin: TwinType = {
      ...twinFarm,
      seasons: updatedSeasons,
      twinIntelligenceScore: newScore,
    };

    try {
      await setDoc(doc(db, 'digital_twins', 'main_twin'), updatedTwin);
      setTwinFarm(updatedTwin);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'digital_twins/main_twin');
    }
  };

  const updateTwinFarm = async (updates: Partial<TwinType>): Promise<void> => {
    const updated = { ...twinFarm, ...updates };
    try {
      await setDoc(doc(db, 'digital_twins', 'main_twin'), updated);
      setTwinFarm(updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'digital_twins/main_twin');
    }
  };

  // --- Real Knowledge Vault Actions ---
  const addKnowledgeEntry = async (
    entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'upvotes'>
  ): Promise<string> => {
    const id = `kv-${Date.now()}`;
    const newEntry: KnowledgeEntry = {
      ...entry,
      id,
      upvotes: 1,
      userId: user?.uid || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'knowledge_vault', id), newEntry);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `knowledge_vault/${id}`);
      return id;
    }
  };

  const upvoteKnowledgeEntry = async (id: string): Promise<void> => {
    const target = knowledgeEntries.find((k) => k.id === id);
    if (!target) return;

    try {
      await updateDoc(doc(db, 'knowledge_vault', id), {
        upvotes: (target.upvotes || 0) + 1,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `knowledge_vault/${id}`);
    }
  };

  return (
    <CloudDataContext.Provider
      value={{
        isCloudConnected,
        isSyncing,
        marketItems,
        marketOrders,
        storageReceipts,
        cropRegistrations,
        twinFarm,
        knowledgeEntries,
        addMarketItem,
        updateMarketItem,
        placeMarketOrder,
        updateOrderStatus,
        depositCropToSac,
        listSacOnMarketplace,
        dispatchSac,
        updateSacTelemetry,
        addCropRegistration,
        addSeasonLog,
        updateTwinFarm,
        addKnowledgeEntry,
        upvoteKnowledgeEntry,
      }}
    >
      {children}
    </CloudDataContext.Provider>
  );
};

export const useCloudData = () => {
  const context = useContext(CloudDataContext);
  if (!context) {
    throw new Error('useCloudData must be used within a CloudDataProvider');
  }
  return context;
};
