module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["'Noto Sans'", "'Inter'", "sans-serif"],
        hindi:   ["'Noto Sans Devanagari'", "sans-serif"],
        display: ["'Inter'", "'Noto Sans'", "sans-serif"],
        mono:    ["'Roboto Mono'", "monospace"],
      },
      colors: {
        // Government India palette
        gov: {
          blue:     "#1A4FA0",   // primary — DigiLocker / UMANG blue
          "blue-dark": "#0F3278",
          "blue-light": "#E8EFFC",
          "blue-mid":   "#2D6BE4",
          saffron:  "#FF6600",   // India saffron
          "saffron-light": "#FFF3E0",
          green:    "#2E7D32",   // success / verify
          "green-light": "#E8F5E9",
          white:    "#FFFFFF",
          bg:       "#F4F6FB",   // page background
          "bg-card":"#FFFFFF",
          border:   "#D0D7E8",
          muted:    "#6B7A99",
          text:     "#1A1F36",
          "text-2": "#3D4966",
          "text-3": "#6B7A99",
        },
      },
      boxShadow: {
        card:   "0 1px 4px rgba(26,79,160,0.08), 0 4px 16px rgba(26,79,160,0.05)",
        "card-hover": "0 4px 12px rgba(26,79,160,0.14), 0 8px 24px rgba(26,79,160,0.08)",
        header: "0 2px 8px rgba(26,79,160,0.1)",
        btn:    "0 2px 6px rgba(26,79,160,0.25)",
      },
      borderRadius: {
        "2xl": "12px",
        "3xl": "16px",
      },
      fontSize: {
        "2xs": "11px",
        xs:    "13px",
        sm:    "14px",
        base:  "16px",
        lg:    "18px",
        xl:    "20px",
        "2xl": "22px",
        "3xl": "26px",
        "4xl": "30px",
      },
    },
  },
  plugins: [],
};
