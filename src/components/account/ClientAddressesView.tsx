"use client";

import React, { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, X, Check } from "lucide-react";
import AccountSidebar from "./AccountSidebar";

export interface AddressItem {
  id: string;
  tag?: string; // e.g., "Default Address", "Home", "University"
  isDefault?: boolean;
  name: string;
  line1: string;
  line2: string;
  line3?: string;
  phone: string;
}

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: "addr-1",
    tag: "Default Address",
    isDefault: true,
    name: "Ameen Sarguroh",
    line1: "Room 1205, Al Barsha 1",
    line2: "Dubai, United Arab Emirates",
    phone: "+971 50 123 4567",
  },
  {
    id: "addr-2",
    tag: "Home",
    isDefault: false,
    name: "Ameen Sarguroh",
    line1: "Villa 23, Al Nahda 2",
    line2: "Dubai, United Arab Emirates",
    phone: "+971 50 123 4567",
  },
  {
    id: "addr-3",
    tag: "University",
    isDefault: false,
    name: "Ameen Sarguroh",
    line1: "Middlesex University Dubai",
    line2: "Dubai Knowledge Park",
    line3: "Dubai, United Arab Emirates",
    phone: "+971 50 123 4567",
  },
];

interface ClientAddressesViewProps {
  onTabChange?: (tab: string) => void;
  hideSidebar?: boolean;
}

export default function ClientAddressesView({ onTabChange, hideSidebar = true }: ClientAddressesViewProps) {
  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tag: "",
    name: "",
    line1: "",
    line2: "",
    line3: "",
    phone: "",
    isDefault: false,
  });

  // Modal State for Delete Confirmation
  const [addressToDelete, setAddressToDelete] = useState<AddressItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setFormData({
      tag: "",
      name: "Ameen Sarguroh",
      line1: "",
      line2: "Dubai, United Arab Emirates",
      line3: "",
      phone: "+971 50 123 4567",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: AddressItem) => {
    setEditingAddressId(addr.id);
    setFormData({
      tag: addr.tag === "Default Address" ? "" : addr.tag || "",
      name: addr.name,
      line1: addr.line1,
      line2: addr.line2,
      line3: addr.line3 || "",
      phone: addr.phone,
      isDefault: Boolean(addr.isDefault),
    });
    setIsModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.line1.trim()) return;

    if (editingAddressId) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id === editingAddressId) {
            const updated: AddressItem = {
              ...addr,
              name: formData.name.trim(),
              tag: formData.tag.trim() || (formData.isDefault ? "Default Address" : "Address"),
              line1: formData.line1.trim(),
              line2: formData.line2.trim(),
              line3: formData.line3.trim() || undefined,
              phone: formData.phone.trim(),
              isDefault: formData.isDefault,
            };
            return updated;
          }
          if (formData.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        })
      );
      showToast("Address updated successfully.");
    } else {
      // Add new address
      const newAddress: AddressItem = {
        id: `addr-${Date.now()}`,
        name: formData.name.trim(),
        tag: formData.tag.trim() || (formData.isDefault ? "Default Address" : "Address"),
        line1: formData.line1.trim(),
        line2: formData.line2.trim(),
        line3: formData.line3.trim() || undefined,
        phone: formData.phone.trim(),
        isDefault: formData.isDefault || addresses.length === 0,
      };

      setAddresses((prev) => {
        if (newAddress.isDefault) {
          return [newAddress, ...prev.map((a) => ({ ...a, isDefault: false }))];
        }
        return [...prev, newAddress];
      });
      showToast("New address added successfully.");
    }

    setIsModalOpen(false);
  };

  const confirmDeleteAddress = () => {
    if (!addressToDelete) return;
    setAddresses((prev) => prev.filter((a) => a.id !== addressToDelete.id));
    showToast(`Removed address for ${addressToDelete.name}.`);
    setAddressToDelete(null);
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C241E] text-[#F9F5EF] px-5 py-3 rounded-none shadow-xl border border-[#D4C6B3] text-xs font-sans animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main Grid Layout: Left Sidebar + Main Content */}
      <div className={hideSidebar ? "w-full" : "grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr] gap-10 md:gap-12 lg:gap-16 items-start"}>
        {/* Left Navigation Sidebar */}
        {!hideSidebar && <AccountSidebar activeTab="addresses" onTabChange={onTabChange} />}

        {/* Right Main Content Area */}
        <div className="w-full">
          {/* Header & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-[32px] lg:text-[40px] text-[#2C241E] leading-tight">
                My Addresses
              </h1>
              <p className="text-sm text-[#786B5D] font-serif mt-1">
                Manage your saved addresses for faster and more convenient checkout.
              </p>
            </div>

            {/* + Add New Address Button */}
            <button
              id="add-new-address-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAddModal();
              }}
              className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-center"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Address Cards List */}
          {addresses.length === 0 ? (
            <div className="font-times-card border border-[#D4C6B3] bg-[#EFE7DE]/80 p-12 text-center rounded-[3px]">
              <div className="w-12 h-12 rounded-full bg-[#E5D7C7] flex items-center justify-center mx-auto mb-4 text-[#5C4529]">
                <MapPin size={22} />
              </div>
              <h3 className="font-serif text-[20px] text-[#2C241E] mb-2">No Addresses Saved</h3>
              <p className="text-sm text-[#786B5D] font-serif max-w-md mx-auto mb-6">
                You currently have no saved shipping addresses. Add an address now to expedite your timepiece acquisitions.
              </p>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-6 py-2.5 transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Plus size={14} />
                <span>Add Your First Address</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => {
                const showBadge = address.isDefault;
                const showTagTitle = !showBadge && address.tag;

                return (
                  <div
                    key={address.id}
                    className="font-times-card border border-[#D4C6B3] bg-[#EFE7DE]/80 p-6 sm:p-7 flex justify-between items-start rounded-[3px] transition-shadow hover:shadow-[0_2px_8px_rgba(44,36,30,0.04)]"
                  >
                    {/* Left Content */}
                    <div className="flex-1 pr-4 sm:pr-6">
                      {/* Default Badge */}
                      {showBadge && (
                        <div>
                          <span className="bg-[#F5DFC6] text-[#6D5333] text-[11px] font-medium px-3 py-1 mb-2.5 inline-block rounded-full">
                            Default Address
                          </span>
                        </div>
                      )}

                      {/* Custom Title (Home, University, etc.) */}
                      {showTagTitle && (
                        <h3 className="font-serif text-[18px] text-[#2C241E] mb-2 leading-snug">
                          {address.tag}
                        </h3>
                      )}

                      {/* Recipient Name */}
                      <p className="font-serif text-[16px] font-medium text-[#2C241E] mb-1">
                        {address.name}
                      </p>

                      {/* Address Lines */}
                      <div className="font-serif text-sm text-[#6B5D4F] leading-relaxed">
                        <p>{address.line1}</p>
                        {address.line2 && <p>{address.line2}</p>}
                        {address.line3 && <p>{address.line3}</p>}
                      </div>

                      {/* Phone Number */}
                      {address.phone && (
                        <p className="font-serif text-sm text-[#6B5D4F] mt-1">
                          {address.phone}
                        </p>
                      )}
                    </div>

                    {/* Right Actions with Vertical Separator */}
                    <div className="flex items-center self-stretch pl-6 sm:pl-8 border-l border-[#DECFC0]/80 shrink-0">
                      <div className="flex flex-col space-y-3">
                        <button
                          id={`edit-btn-${address.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(address);
                          }}
                          className="flex items-center gap-2 text-xs sm:text-sm font-serif text-[#524538] hover:text-[#2C241E] cursor-pointer py-1 transition-colors"
                        >
                          <Pencil size={15} className="text-[#524538]" />
                          <span>Edit</span>
                        </button>
                        <button
                          id={`delete-btn-${address.id}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddressToDelete(address);
                          }}
                          className="flex items-center gap-2 text-xs sm:text-sm font-serif text-[#524538] hover:text-[#9E3535] cursor-pointer py-1 transition-colors"
                        >
                          <Trash2 size={15} className="text-[#524538]" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241E]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="font-times-card bg-[#EFE7DE] border border-[#D4C6B3] w-full max-w-lg p-6 sm:p-8 rounded-[3px] shadow-2xl relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#786B5D] hover:text-[#2C241E] p-1 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <h2 className="font-serif text-[24px] text-[#2C241E] mb-1">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h2>
            <p className="font-serif text-xs text-[#786B5D] mb-6">
              Enter your shipping details below for swift and secure delivery.
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              {/* Address Label / Tag */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Address Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Home, University, Office"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif"
                />
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Street Address / Room / Apartment *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 1205, Al Barsha 1"
                  value={formData.line1}
                  onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif"
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Area / Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dubai Knowledge Park or Building Name"
                  value={formData.line2}
                  onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif"
                />
              </div>

              {/* Address Line 3 / City & Country */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  City, Country
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dubai, United Arab Emirates"
                  value={formData.line3}
                  onChange={(e) => setFormData({ ...formData, line3: e.target.value })}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif"
                />
              </div>

              {/* Default Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-[#5C4529] cursor-pointer"
                  />
                  <span className="text-xs font-serif text-[#2C241E]">
                    Set as default delivery address
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4C6B3]/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-serif text-[#6B5D4F] hover:text-[#2C241E] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer"
                >
                  {editingAddressId ? "Save Changes" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {addressToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241E]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="font-times-card bg-[#EFE7DE] border border-[#D4C6B3] w-full max-w-md p-6 sm:p-7 rounded-[3px] shadow-2xl relative">
            <h3 className="font-serif text-[22px] text-[#2C241E] mb-2">Delete Address?</h3>
            <p className="font-serif text-sm text-[#6B5D4F] leading-relaxed mb-6">
              Are you sure you want to remove this address for{" "}
              <strong className="text-[#2C241E] font-medium">{addressToDelete.name}</strong> (
              {addressToDelete.line1})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAddressToDelete(null)}
                className="px-4 py-2 text-xs font-serif text-[#6B5D4F] hover:text-[#2C241E] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAddress}
                className="bg-[#9E3535] hover:bg-[#852828] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer"
              >
                Delete Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
