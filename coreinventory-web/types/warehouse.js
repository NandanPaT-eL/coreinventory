/**
 * types/warehouse.js
 * Type definitions, constants, and helpers for the Warehouse module.
 * Used across components, hooks, store, and API layer.
 */

// ─────────────────────────────────────────
// WAREHOUSE STATUS
// ─────────────────────────────────────────

export const WAREHOUSE_STATUS = {
  ACTIVE:   'active',
  INACTIVE: 'inactive',
};

// ─────────────────────────────────────────
// WAREHOUSE TYPES (metadata.type)
// ─────────────────────────────────────────

export const WAREHOUSE_TYPES = {
  FINISHED_GOODS: 'finished goods',
  DISTRIBUTION:   'distribution',
  RAW_MATERIAL:   'raw material',
  TECH_HUB:       'tech hub',
  COLD_STORAGE:   'cold storage',
  BONDED:         'bonded',
};

export const WAREHOUSE_TYPE_LABELS = {
  [WAREHOUSE_TYPES.FINISHED_GOODS]: 'Finished Goods',
  [WAREHOUSE_TYPES.DISTRIBUTION]:   'Distribution',
  [WAREHOUSE_TYPES.RAW_MATERIAL]:   'Raw Material',
  [WAREHOUSE_TYPES.TECH_HUB]:       'Tech Hub',
  [WAREHOUSE_TYPES.COLD_STORAGE]:   'Cold Storage',
  [WAREHOUSE_TYPES.BONDED]:         'Bonded',
};

export const WAREHOUSE_TYPE_OPTIONS = Object.entries(WAREHOUSE_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

// ─────────────────────────────────────────
// TEMPERATURE TYPES (metadata.temperature)
// ─────────────────────────────────────────

export const TEMPERATURE_TYPES = {
  AMBIENT:    'ambient',
  CONTROLLED: 'controlled',
  COLD:       'cold',
  FROZEN:     'frozen',
};

export const TEMPERATURE_LABELS = {
  [TEMPERATURE_TYPES.AMBIENT]:    'Ambient',
  [TEMPERATURE_TYPES.CONTROLLED]: 'Controlled',
  [TEMPERATURE_TYPES.COLD]:       'Cold',
  [TEMPERATURE_TYPES.FROZEN]:     'Frozen',
};

export const TEMPERATURE_OPTIONS = Object.entries(TEMPERATURE_LABELS).map(
  ([value, label]) => ({ value, label })
);

// ─────────────────────────────────────────
// DEFAULT / EMPTY SHAPES
// Use these to initialise forms and avoid undefined errors.
// ─────────────────────────────────────────

/** Empty location sub-object — use as form default */
export const EMPTY_LOCATION = {
  address: '',
  city:    '',
  state:   '',
  country: '',
  zipCode: '',
};

/** Empty contact sub-object — use as form default */
export const EMPTY_CONTACT = {
  phone:   '',
  email:   '',
  manager: '',
};

/** Empty metadata sub-object — use as form default */
export const EMPTY_METADATA = {
  capacity:    '',
  type:        '',
  temperature: '',
};

/** Full empty warehouse — safe initialiser for create form */
export const EMPTY_WAREHOUSE = {
  name:     '',
  code:     '',
  location: { ...EMPTY_LOCATION },
  contact:  { ...EMPTY_CONTACT },
  isActive: true,
  metadata: { ...EMPTY_METADATA },
};

// ─────────────────────────────────────────
// QUERY PARAM DEFAULTS
// Mirror the API defaults so the hook and store stay in sync.
// ─────────────────────────────────────────

export const DEFAULT_WAREHOUSE_PARAMS = {
  page:     1,
  limit:    10,
  search:   '',
  isActive: '',   // '' = all, 'true' = active only, 'false' = inactive only
  city:     '',
  country:  '',
};

// ─────────────────────────────────────────
// FILTER OPTIONS (for WarehouseFilters component)
// ─────────────────────────────────────────

export const STATUS_FILTER_OPTIONS = [
  { value: '',      label: 'All Status' },
  { value: 'true',  label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

// ─────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────

/**
 * Returns a human-readable label for isActive boolean.
 * @param {boolean} isActive
 * @returns {'Active' | 'Inactive'}
 */
export function getStatusLabel(isActive) {
  return isActive ? 'Active' : 'Inactive';
}

/**
 * Returns Tailwind-style color tokens for StatusBadge.
 * Keys: bg, text, border
 * @param {boolean} isActive
 */
export function getStatusColors(isActive) {
  return isActive
    ? { bg: '#ECFDF5', text: '#065F46', border: '#6EE7B7' }
    : { bg: '#FEF2F2', text: '#991B1B', border: '#FCA5A5' };
}

/**
 * Returns the display label for a warehouse type key.
 * Falls back to the raw value if key is not found.
 * @param {string} type
 * @returns {string}
 */
export function getWarehouseTypeLabel(type) {
  return WAREHOUSE_TYPE_LABELS[type] ?? type ?? '—';
}

/**
 * Returns the display label for a temperature key.
 * @param {string} temperature
 * @returns {string}
 */
export function getTemperatureLabel(temperature) {
  return TEMPERATURE_LABELS[temperature] ?? temperature ?? '—';
}

/**
 * Builds the one-line address string from a location object.
 * Skips empty parts so it doesn't produce trailing commas.
 * @param {{ address?: string, city?: string, state?: string, country?: string }} location
 * @returns {string}
 */
export function formatAddress(location) {
  if (!location) return '—';
  return [location.address, location.city, location.state, location.country]
    .filter(Boolean)
    .join(', ') || '—';
}

/**
 * Strips empty string values from an object so they aren't
 * sent as query params or in request bodies.
 * @param {Record<string, any>} params
 * @returns {Record<string, any>}
 */
export function stripEmptyParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  );
}

/**
 * Validates the minimum required fields for warehouse creation.
 * Returns an object of { field: errorMessage } or {} if valid.
 * @param {{ name: string, code: string }} data
 * @returns {Record<string, string>}
 */
export function validateWarehouseForm(data) {
  const errors = {};
  if (!data.name?.trim())  errors.name  = 'Warehouse name is required';
  if (!data.code?.trim())  errors.code  = 'Warehouse code is required';
  if (data.code && !/^[A-Z0-9_-]{2,20}$/i.test(data.code.trim())) {
    errors.code = 'Code must be 2–20 alphanumeric characters';
  }
  if (data.contact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email)) {
    errors['contact.email'] = 'Invalid email address';
  }
  return errors;
}