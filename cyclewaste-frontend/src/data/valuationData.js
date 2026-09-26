/**
 * Component keys here MUST match config/valuation_rules.json on the backend
 * (component_base_values), since the actual price calculation happens
 * server-side. This file only drives which questions the calculator asks.
 */
export const CATEGORIES = [
  {
    id: "smartphone",
    label: "Smartphone",
    weightHint: 180,
    icon: "smartphone",
    components: [
      { id: "motherboard", label: "Motherboard" },
      { id: "battery", label: "Baterai" },
      { id: "screen", label: "Layar" },
      { id: "camera", label: "Kamera" },
      { id: "speaker", label: "Speaker" },
    ],
  },
  {
    id: "laptop",
    label: "Laptop",
    weightHint: 1600,
    icon: "laptop",
    components: [
      { id: "motherboard", label: "Motherboard" },
      { id: "ram", label: "RAM" },
      { id: "storage", label: "Storage (HDD/SSD)" },
      { id: "screen", label: "Layar" },
      { id: "battery", label: "Baterai" },
      { id: "keyboard", label: "Keyboard" },
    ],
  },
  {
    id: "tablet",
    label: "Tablet",
    weightHint: 450,
    icon: "tablet",
    components: [
      { id: "motherboard", label: "Motherboard" },
      { id: "battery", label: "Baterai" },
      { id: "screen", label: "Layar" },
      { id: "camera", label: "Kamera" },
      { id: "speaker", label: "Speaker" },
    ],
  },
  {
    id: "desktop",
    label: "Desktop / PC",
    weightHint: 6000,
    icon: "desktop",
    components: [
      { id: "motherboard", label: "Motherboard" },
      { id: "cpu", label: "Processor (CPU)" },
      { id: "ram", label: "RAM" },
      { id: "storage", label: "Storage (HDD/SSD)" },
      { id: "gpu", label: "Kartu Grafis (GPU)" },
      { id: "psu", label: "Power Supply (PSU)" },
    ],
  },
  {
    id: "monitor",
    label: "Monitor",
    weightHint: 3500,
    icon: "monitor",
    components: [
      { id: "panel", label: "Panel Layar" },
      { id: "power_board", label: "Power Board" },
      { id: "controller_board", label: "Controller Board" },
    ],
  },
];

export const CONDITIONS = [
  { id: "baik", label: "Baik", hint: "Berfungsi normal, tidak ada kerusakan berarti" },
  { id: "rusak_ringan", label: "Rusak Ringan", hint: "Masih berfungsi, ada cacat kecil" },
  { id: "rusak_berat", label: "Rusak Berat", hint: "Fungsi terganggu signifikan" },
  { id: "mati", label: "Mati Total", hint: "Tidak berfungsi sama sekali" },
];

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}
