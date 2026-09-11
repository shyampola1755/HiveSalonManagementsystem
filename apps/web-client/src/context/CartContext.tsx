import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  id: string; // unique cart row id
  itemId: string;
  name: string;
  itemType: 'SERVICE' | 'PRODUCT' | 'PACKAGE' | 'MEMBERSHIP';
  unitPrice: number;
  quantity: number;
  taxRate: number;
  discountAmount: number;
  staffId?: string;
  staffName?: string;
}

export interface SelectedCustomer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  walletBalance?: number;
  loyaltyPoints?: number;
}

interface CartContextType {
  items: CartItem[];
  customer: SelectedCustomer | null;
  appointmentId: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  tipAmount: number;
  notes: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  addItem: (item: Omit<CartItem, 'id' | 'quantity' | 'discountAmount'>) => void;
  removeItem: (cartItemId: string) => void;
  updateItemQuantity: (cartItemId: string, quantity: number) => void;
  setCustomer: (customer: SelectedCustomer | null) => void;
  setAppointmentId: (appId: string | null) => void;
  setDiscount: (type: 'PERCENTAGE' | 'FIXED', value: number) => void;
  setTipAmount: (amount: number) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<SelectedCustomer | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const addItem = (itemData: Omit<CartItem, 'id' | 'quantity' | 'discountAmount'>) => {
    setItems((prev) => {
      // Check if item already exists in cart with same staff assignment
      const existingIdx = prev.findIndex((i) => i.itemId === itemData.itemId && i.staffId === itemData.staffId);
      if (existingIdx > -1 && itemData.itemType === 'PRODUCT') {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          ...itemData,
          id: `${itemData.itemId}_${Date.now()}_${Math.random()}`,
          quantity: 1,
          discountAmount: 0,
        },
      ];
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const updateItemQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i)));
  };

  const setDiscount = (type: 'PERCENTAGE' | 'FIXED', value: number) => {
    setDiscountType(type);
    setDiscountValue(Math.max(0, value));
  };

  const clearCart = () => {
    setItems([]);
    setCustomer(null);
    setAppointmentId(null);
    setDiscountType('FIXED');
    setDiscountValue(0);
    setTipAmount(0);
    setNotes('');
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const discountAmount =
    discountType === 'PERCENTAGE' ? (subtotal * discountValue) / 100 : Math.min(subtotal, discountValue);
  const taxable = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxable * 18) / 100;
  const grandTotal = Math.round(taxable + taxAmount + Number(tipAmount || 0));

  return (
    <CartContext.Provider
      value={{
        items,
        customer,
        appointmentId,
        discountType,
        discountValue,
        tipAmount,
        notes,
        subtotal,
        discountAmount,
        taxAmount,
        grandTotal,
        addItem,
        removeItem,
        updateItemQuantity,
        setCustomer,
        setAppointmentId,
        setDiscount,
        setTipAmount,
        setNotes,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
