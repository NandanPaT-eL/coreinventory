'use client';

import { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Package, Loader2, Check, AlertCircle } from 'lucide-react';
import {
  EMPTY_WAREHOUSE,
  WAREHOUSE_TYPE_OPTIONS,
  TEMPERATURE_OPTIONS,
  validateWarehouseForm,
} from '../../types/warehouse';

/**
 * WarehouseForm
 * Used for both Create and Edit flows.
 *
 * Props:
 *   initialData   – Warehouse object (edit mode) or undefined (create mode)
 *   onSubmit      – async (formData) => { success, error, errors }
 *   isSubmitting  – bool
 *   submitError   – string | null  (API-level error)
 */
export default function WarehouseForm({ initialData, onSubmit, isSubmitting, submitError }) {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState(EMPTY_WAREHOUSE);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name:     initialData.name     ?? '',
        code:     initialData.code     ?? '',
        isActive: initialData.isActive ?? true,
        location: { ...EMPTY_WAREHOUSE.location, ...initialData.location },
        contact:  { ...EMPTY_WAREHOUSE.contact,  ...initialData.contact  },
        metadata: { ...EMPTY_WAREHOUSE.metadata, ...initialData.metadata },
      });
    }
  }, [initialData]);

  // Helpers
  const set = (section, key, value) => {
    if (section) {
      setForm((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
    if (errors[key] || errors[`${section}.${key}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        delete next[`${section}.${key}`];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    const validationErrors = validateWarehouseForm(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    const result = await onSubmit(form);
    if (result?.success) {
      setSubmitSuccess(true);
      if (!isEdit) setForm(EMPTY_WAREHOUSE);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } else if (result?.errors?.length) {
      const apiErrors = {};
      result.errors.forEach(({ path, msg }) => { apiErrors[path] = msg; });
      setErrors(apiErrors);
    }
  };

  const inputCls = (field) =>
    `wf-input${errors[field] ? ' wf-input-error' : ''}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@700;800&display=swap');

        .wf-wrap { font-family: 'DM Sans', sans-serif; }

        .wf-section {
          background: white; border-radius: 16px;
          border: 1px solid #EDE9FE; padding: 24px;
          margin-bottom: 20px;
        }
        .wf-section-title {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          color: #1a1a2e; margin: 0 0 18px; padding-bottom: 14px;
          border-bottom: 1px solid #F3F0FF;
        }
        .wf-section-icon {
          width: 30px; height: 30px; border-radius: 8px; background: #F3F0FF;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .wf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .wf-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

        @media (max-width: 640px) {
          .wf-grid-2, .wf-grid-3 { grid-template-columns: 1fr; }
        }

        .wf-field { display: flex; flex-direction: column; gap: 6px; }
        .wf-label { font-size: 13px; font-weight: 700; color: #374151; }
        .wf-required { color: #EF4444; }

        .wf-input {
          height: 46px; padding: 0 14px;
          background: #F9F7FF; border: 1.5px solid #EDE9FE;
          border-radius: 12px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #1a1a2e;
          outline: none; transition: border-color 0.2s, background 0.2s;
        }
        .wf-input:focus { border-color: #7C3AED; background: white; }
        .wf-input::placeholder { color: #9CA3AF; }
        .wf-input:disabled { opacity: 0.6; }
        .wf-input-error { border-color: #FCA5A5 !important; background: #FEF2F2 !important; }

        .wf-select {
          height: 46px; padding: 0 14px;
          background: #F9F7FF; border: 1.5px solid #EDE9FE;
          border-radius: 12px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #1a1a2e;
          outline: none; cursor: pointer; appearance: none;
          transition: border-color 0.2s;
        }
        .wf-select:focus { border-color: #7C3AED; background: white; }
        .wf-select:disabled { opacity: 0.6; cursor: not-allowed; }

        .wf-error-msg { font-size: 12px; color: #EF4444; font-weight: 500; }

        .wf-toggle-wrap {
          display: flex; align-items: center; gap: 12px;
          padding: 14px; background: #F9F7FF; border-radius: 12px;
          border: 1.5px solid #EDE9FE;
        }
        .wf-toggle-track {
          width: 44px; height: 24px; border-radius: 999px;
          background: #E5E7EB; cursor: pointer; position: relative;
          transition: background 0.2s; border: none; padding: 0; flex-shrink: 0;
        }
        .wf-toggle-track.on { background: #7C3AED; }
        .wf-toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 18px; height: 18px; border-radius: 50%;
          background: white; transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .wf-toggle-track.on .wf-toggle-thumb { transform: translateX(20px); }

        /* submit row */
        .wf-submit-row {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 12px; flex-wrap: wrap;
        }
        .wf-btn-submit {
          display: flex; align-items: center; gap: 8px;
          padding: 0 28px; height: 48px; border-radius: 999px;
          background: #7C3AED; color: white; border: none;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .wf-btn-submit:hover:not(:disabled) {
          background: #6d28d9; transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.3);
        }
        .wf-btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }
        .wf-btn-cancel {
          display: flex; align-items: center; gap: 8px;
          padding: 0 22px; height: 48px; border-radius: 999px;
          background: white; color: #374151;
          border: 1.5px solid #EDE9FE; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; text-decoration: none;
        }
        .wf-btn-cancel:hover { border-color: #C4B5FD; color: #7C3AED; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; }
      `}</style>

      <form className="wf-wrap" onSubmit={handleSubmit}>

        {/* API submit error */}
        {submitError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 12, marginBottom: 20 }}>
            <AlertCircle size={17} color="#EF4444" />
            <p style={{ fontSize: 13, color: '#B91C1C', margin: 0, fontWeight: 500 }}>{submitError}</p>
          </div>
        )}

        {/* Success banner */}
        {submitSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: '#ECFDF5', border: '1.5px solid #6EE7B7', borderRadius: 12, marginBottom: 20 }}>
            <Check size={17} color="#10B981" />
            <p style={{ fontSize: 13, color: '#065F46', margin: 0, fontWeight: 600 }}>
              Warehouse {isEdit ? 'updated' : 'created'} successfully!
            </p>
          </div>
        )}

        {/* ── Section 1: Basic info ── */}
        <div className="wf-section">
          <h3 className="wf-section-title">
            <div className="wf-section-icon"><Building2 size={15} color="#7C3AED" /></div>
            Basic Information
          </h3>
          <div className="wf-grid-2">
            <div className="wf-field">
              <label className="wf-label">Name <span className="wf-required">*</span></label>
              <input className={inputCls('name')} type="text" placeholder="e.g. Main Warehouse Mumbai"
                value={form.name} onChange={(e) => set(null, 'name', e.target.value)}
                disabled={isSubmitting} />
              {errors.name && <span className="wf-error-msg">{errors.name}</span>}
            </div>
            <div className="wf-field">
              <label className="wf-label">Code <span className="wf-required">*</span></label>
              <input className={inputCls('code')} type="text" placeholder="e.g. WH001"
                value={form.code} onChange={(e) => set(null, 'code', e.target.value.toUpperCase())}
                disabled={isSubmitting || isEdit} />
              {errors.code && <span className="wf-error-msg">{errors.code}</span>}
              {isEdit && <span style={{ fontSize: 11, color: '#9CA3AF' }}>Code cannot be changed</span>}
            </div>
          </div>

          {/* Active toggle */}
          <div style={{ marginTop: 16 }}>
            <label className="wf-label" style={{ marginBottom: 8, display: 'block' }}>Status</label>
            <div className="wf-toggle-wrap">
              <button
                type="button"
                className={`wf-toggle-track${form.isActive ? ' on' : ''}`}
                onClick={() => set(null, 'isActive', !form.isActive)}
                disabled={isSubmitting}
              >
                <div className="wf-toggle-thumb" />
              </button>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: form.isActive ? '#065F46' : '#6B7280', margin: 0 }}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </p>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>
                  {form.isActive ? 'Warehouse is operational' : 'Warehouse is not accepting stock'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Location ── */}
        <div className="wf-section">
          <h3 className="wf-section-title">
            <div className="wf-section-icon"><MapPin size={15} color="#7C3AED" /></div>
            Location
          </h3>
          <div className="wf-field" style={{ marginBottom: 16 }}>
            <label className="wf-label">Address</label>
            <input className="wf-input" type="text" placeholder="Street address"
              value={form.location.address} onChange={(e) => set('location', 'address', e.target.value)}
              disabled={isSubmitting} />
          </div>
          <div className="wf-grid-3">
            <div className="wf-field">
              <label className="wf-label">City</label>
              <input className="wf-input" type="text" placeholder="Mumbai"
                value={form.location.city} onChange={(e) => set('location', 'city', e.target.value)}
                disabled={isSubmitting} />
            </div>
            <div className="wf-field">
              <label className="wf-label">State</label>
              <input className="wf-input" type="text" placeholder="Maharashtra"
                value={form.location.state} onChange={(e) => set('location', 'state', e.target.value)}
                disabled={isSubmitting} />
            </div>
            <div className="wf-field">
              <label className="wf-label">Zip Code</label>
              <input className="wf-input" type="text" placeholder="400001"
                value={form.location.zipCode} onChange={(e) => set('location', 'zipCode', e.target.value)}
                disabled={isSubmitting} />
            </div>
          </div>
          <div className="wf-field" style={{ marginTop: 16 }}>
            <label className="wf-label">Country</label>
            <input className="wf-input" type="text" placeholder="India"
              value={form.location.country} onChange={(e) => set('location', 'country', e.target.value)}
              disabled={isSubmitting} style={{ maxWidth: 240 }} />
          </div>
        </div>

        {/* ── Section 3: Contact ── */}
        <div className="wf-section">
          <h3 className="wf-section-title">
            <div className="wf-section-icon"><Phone size={15} color="#7C3AED" /></div>
            Contact Details
          </h3>
          <div className="wf-grid-3">
            <div className="wf-field">
              <label className="wf-label">Manager Name</label>
              <input className="wf-input" type="text" placeholder="Rajesh Kumar"
                value={form.contact.manager} onChange={(e) => set('contact', 'manager', e.target.value)}
                disabled={isSubmitting} />
            </div>
            <div className="wf-field">
              <label className="wf-label">Phone</label>
              <input className="wf-input" type="tel" placeholder="+91 9876543210"
                value={form.contact.phone} onChange={(e) => set('contact', 'phone', e.target.value)}
                disabled={isSubmitting} />
            </div>
            <div className="wf-field">
              <label className="wf-label">Email</label>
              <input className={inputCls('contact.email')} type="email" placeholder="warehouse@company.com"
                value={form.contact.email} onChange={(e) => set('contact', 'email', e.target.value)}
                disabled={isSubmitting} />
              {errors['contact.email'] && <span className="wf-error-msg">{errors['contact.email']}</span>}
            </div>
          </div>
        </div>

        {/* ── Section 4: Metadata ── */}
        <div className="wf-section">
          <h3 className="wf-section-title">
            <div className="wf-section-icon"><Package size={15} color="#7C3AED" /></div>
            Additional Details
          </h3>
          <div className="wf-grid-3">
            <div className="wf-field">
              <label className="wf-label">Warehouse Type</label>
              <select className="wf-select" value={form.metadata.type}
                onChange={(e) => set('metadata', 'type', e.target.value)} disabled={isSubmitting}>
                <option value="">Select type…</option>
                {WAREHOUSE_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="wf-field">
              <label className="wf-label">Temperature</label>
              <select className="wf-select" value={form.metadata.temperature}
                onChange={(e) => set('metadata', 'temperature', e.target.value)} disabled={isSubmitting}>
                <option value="">Select…</option>
                {TEMPERATURE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="wf-field">
              <label className="wf-label">Capacity</label>
              <input className="wf-input" type="text" placeholder="e.g. 15000 sqft"
                value={form.metadata.capacity} onChange={(e) => set('metadata', 'capacity', e.target.value)}
                disabled={isSubmitting} />
            </div>
          </div>
        </div>

        {/* ── Submit row ── */}
        <div className="wf-submit-row">
          <a href="/settings/warehouses" className="wf-btn-cancel">Cancel</a>
          <button type="submit" className="wf-btn-submit" disabled={isSubmitting}>
            {isSubmitting
              ? <><Loader2 size={16} className="spin" /> {isEdit ? 'Saving…' : 'Creating…'}</>
              : <><Check size={16} /> {isEdit ? 'Save Changes' : 'Create Warehouse'}</>}
          </button>
        </div>
      </form>
    </>
  );
}