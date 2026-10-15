import React from "react";
import { User, Phone, MapPin, Building, Flag, Mailbox } from "lucide-react";

const CheckoutForm = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  return (
    <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Delivery Address</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Please enter your delivery destination accurately.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none ${
                errors.fullName
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none ${
                errors.phone
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              }`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Pincode *
          </label>
          <div className="relative">
            <Mailbox className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="6-digit pincode"
              maxLength={6}
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none ${
                errors.pincode
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              }`}
            />
          </div>
          {errors.pincode && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.pincode}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Street Address *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="House, building, street, locality"
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none ${
                errors.addressLine1
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              }`}
            />
          </div>
          {errors.addressLine1 && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.addressLine1}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            City *
          </label>
          <div className="relative">
            <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Bengaluru"
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none ${
                errors.city
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              }`}
            />
          </div>
          {errors.city && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            State *
          </label>
          <div className="relative">
            <Flag className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Karnataka"
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none ${
                errors.state
                  ? "border-red-400 focus:border-red-500 bg-red-50/20"
                  : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              }`}
            />
          </div>
          {errors.state && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.state}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
