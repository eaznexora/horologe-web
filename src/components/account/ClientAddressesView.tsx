"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, MapPin, X, Check, Loader2 } from "lucide-react";
import AccountSidebar from "./AccountSidebar";

export interface AddressItem {
  id: string;
  tag?: string;
  isDefault?: boolean;
  name: string;
  line1: string;
  line2?: string;
  line3?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone: string;
}

interface ClientAddressesViewProps {
  user?: any;
  onUpdate?: () => Promise<void> | void;
  onTabChange?: (tab: string) => void;
  hideSidebar?: boolean;
}

export default function ClientAddressesView({
  user,
  onUpdate,
  onTabChange,
  hideSidebar = true,
}: ClientAddressesViewProps) {
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tag: "",
    name: "",
    line1: "",
    line2: "",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
    phone: "",
    isDefault: false,
  });

  // Modal State for Delete Confirmation
  const [addressToDelete, setAddressToDelete] = useState<AddressItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const mapMongoAddresses = (rawList: any[]): AddressItem[] => {
    if (!Array.isArray(rawList)) return [];
    return rawList.map((a: any, idx: number) => ({
      id: a._id ? String(a._id) : `addr-${idx}`,
      tag: a.tag || (a.isDefault ? "Default Vault" : "Vault Destination"),
      isDefault: Boolean(a.isDefault),
      name: a.name || user?.name || "Collector",
      line1: a.line1 || "",
      line2: a.line2 || "",
      city: a.city || "",
      state: a.state || "",
      postalCode: a.postalCode || "",
      country: a.country || "India",
      line3: [a.city, a.state, a.country].filter(Boolean).join(", "),
      phone: a.phone || user?.phone || "",
    }));
  };

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/account/addresses");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.addresses)) {
          setAddresses(mapMongoAddresses(data.addresses));
        }
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.name, user?.phone]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleOpenAddModal = () => {
    setEditingAddressId(null);
    setFormData({
      tag: "",
      name: user?.name || "",
      line1: "",
      line2: "",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
      phone: user?.phone || "",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: AddressItem) => {
    setEditingAddressId(addr.id);
    setFormData({
      tag: addr.tag === "Default Address" || addr.tag === "Default Vault" ? "" : addr.tag || "",
      name: addr.name,
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city || "Mumbai",
      state: addr.state || "Maharashtra",
      postalCode: addr.postalCode || "400001",
      country: addr.country || "India",
      phone: addr.phone,
      isDefault: Boolean(addr.isDefault),
    });
    setIsModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.line1.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingAddressId) {
        // PUT /api/account/addresses
        const res = await fetch("/api/account/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            addressId: editingAddressId,
            tag: formData.tag.trim() || (formData.isDefault ? "Default Vault" : "Vault Destination"),
            isDefault: formData.isDefault,
            name: formData.name.trim(),
            line1: formData.line1.trim(),
            line2: formData.line2.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            postalCode: formData.postalCode.trim(),
            country: formData.country.trim(),
            phone: formData.phone.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to update address");
        }
        setAddresses(mapMongoAddresses(data.addresses));
        showToast("Vault address updated successfully.");
      } else {
        // POST /api/account/addresses
        const res = await fetch("/api/account/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tag: formData.tag.trim() || (formData.isDefault ? "Default Vault" : "Vault Destination"),
            isDefault: formData.isDefault,
            name: formData.name.trim(),
            line1: formData.line1.trim(),
            line2: formData.line2.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            postalCode: formData.postalCode.trim(),
            country: formData.country.trim(),
            phone: formData.phone.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to add address");
        }
        setAddresses(mapMongoAddresses(data.addresses));
        showToast("New vault delivery address saved.");
      }

      if (onUpdate) await onUpdate();
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to persist address";
      showToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/account/addresses?id=${encodeURIComponent(addressToDelete.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to remove address");
      }
      setAddresses(mapMongoAddresses(data.addresses));
      showToast(`Removed address for ${addressToDelete.name}.`);
      if (onUpdate) await onUpdate();
      setAddressToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove address";
      showToast(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Toast Notification (Strict Luxury Bronze - Zero Red Policy) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C241E] text-[#F9F5EF] px-5 py-3 rounded-none shadow-xl border border-[#D4C6B3] text-xs font-sans animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <Check size={14} className="text-[#9D7E50]" />
          <span>{toastMessage}</span>
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

            {/* + Add New Address Button - Sharp Rectangular */}
            <button
              id="add-new-address-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAddModal();
              }}
              className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-center rounded-none"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="border border-[#D4C6B3] bg-[#EFE7DE]/50 p-12 text-center rounded-none">
              <Loader2 className="w-7 h-7 animate-spin text-[#5C4529] mx-auto mb-3" />
              <p className="text-xs uppercase tracking-[0.2em] text-[#5C4529] font-medium font-sans">
                Loading Vault Destinations...
              </p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="font-times-card border border-[#D4C6B3] bg-[#EFE7DE]/80 p-12 text-center rounded-none">
              <div className="w-12 h-12 rounded-none bg-[#E5D7C7] flex items-center justify-center mx-auto mb-4 text-[#5C4529]">
                <MapPin size={22} />
              </div>
              <h3 className="font-serif text-[20px] text-[#2C241E] mb-2">No Addresses Saved</h3>
              <p className="text-sm text-[#786B5D] font-serif max-w-md mx-auto mb-6">
                You currently have no saved shipping addresses in your profile. Add an address now to expedite your timepiece acquisitions.
              </p>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-6 py-2.5 transition-colors cursor-pointer inline-flex items-center gap-2 rounded-none"
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
                    className="font-times-card border border-[#D4C6B3] bg-[#EFE7DE]/80 p-6 sm:p-7 flex justify-between items-start rounded-none transition-shadow hover:shadow-[0_2px_8px_rgba(44,36,30,0.04)]"
                  >
                    {/* Left Content */}
                    <div className="flex-1 pr-4 sm:pr-6">
                      {/* Default Badge - Zero Radius */}
                      {showBadge && (
                        <div>
                          <span className="bg-[#5C4529] text-[#FAF6F0] text-[10px] font-medium px-2.5 py-0.5 mb-2.5 inline-block uppercase tracking-wider rounded-none">
                            Default Address
                          </span>
                        </div>
                      )}

                      {/* Custom Title (Home, Office, Vault, etc.) */}
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
                          className="flex items-center gap-2 text-xs sm:text-sm font-serif text-[#524538] hover:text-[#5C4529] cursor-pointer py-1 transition-colors"
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

      {/* Add / Edit Address Modal - Pure Sharp Corners */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241E]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="font-times-card bg-[#EFE7DE] border border-[#D4C6B3] w-full max-w-lg p-6 sm:p-8 rounded-none shadow-2xl relative">
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
              Enter your shipping details below for swift and secure vault dispatch.
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              {/* Address Label / Tag */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Address Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Primary Residence, Vault Office"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif rounded-none"
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
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif rounded-none"
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
                  placeholder="Street Address, Building, Floor"
                  value={formData.line1}
                  onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif rounded-none"
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Area / Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Heritage Plaza"
                  value={formData.line2}
                  onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif rounded-none"
                />
              </div>

              {/* City & State Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif rounded-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#6B5D4F] mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  pattern="[0-9+\s\-]*"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => {
                    const cleanValue = e.target.value.replace(/[^0-9+\s-]/g, "");
                    setFormData({ ...formData, phone: cleanValue });
                  }}
                  onKeyDown={(e) => {
                    if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) return;
                    if (!/[0-9+\s-]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full bg-[#F7F2EB] border border-[#D4C6B3] px-3.5 py-2 text-sm text-[#2C241E] focus:outline-none focus:border-[#5C4529] font-serif rounded-none"
                />
              </div>

              {/* Default Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-[#5C4529] cursor-pointer rounded-none"
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
                  className="px-4 py-2 text-xs font-serif text-[#6B5D4F] hover:text-[#2C241E] transition-colors cursor-pointer rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#5C4529] hover:bg-[#47341D] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer rounded-none disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingAddressId ? "Save Changes" : "Save Address"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Strict Zero Red Policy */}
      {addressToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C241E]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="font-times-card bg-[#EFE7DE] border border-[#D4C6B3] w-full max-w-md p-6 sm:p-7 rounded-none shadow-2xl relative">
            <h3 className="font-serif text-[22px] text-[#2C241E] mb-2">Delete Address?</h3>
            <p className="font-serif text-sm text-[#6B5D4F] leading-relaxed mb-6">
              Are you sure you want to remove this address for{" "}
              <strong className="text-[#2C241E] font-medium">{addressToDelete.name}</strong> (
              {addressToDelete.line1})? This destination will be permanently pulled from your vault ledger.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAddressToDelete(null)}
                className="px-4 py-2 text-xs font-serif text-[#6B5D4F] hover:text-[#2C241E] transition-colors cursor-pointer rounded-none"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteAddress}
                className="bg-[#5C4529] hover:bg-[#48361F] text-[#F9F5EF] text-xs font-medium uppercase tracking-wider px-5 py-2.5 transition-colors cursor-pointer rounded-none flex items-center gap-2"
              >
                {isDeleting && <Loader2 size={13} className="animate-spin" />}
                <span>Delete Address</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
