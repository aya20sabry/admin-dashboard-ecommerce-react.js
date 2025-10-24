module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Mobile-first breakpoints
      screens: {
        xs: "475px", // Extra small devices (large phones)
        sm: "640px", // Small devices (tablets)
        md: "768px", // Medium devices (small laptops)
        lg: "1024px", // Large devices (desktops)
        xl: "1280px", // Extra large devices (large desktops)
        "2xl": "1536px", // 2X Extra large devices
      },
      // Touch-friendly tap targets
      minHeight: {
        touch: "44px", // Apple/Google minimum tap target
      },
      minWidth: {
        touch: "44px",
      },
      // Mobile-optimized spacing
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      // Mobile-friendly font sizes
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      // Z-index scale for layering
      zIndex: {
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
      },
      // Mobile-optimized transitions
      transitionDuration: {
        250: "250ms",
        350: "350ms",
      },
    },
  },
  plugins: [
    // Custom plugin for mobile utilities
    function ({ addUtilities }) {
      const newUtilities = {
        ".tap-highlight-transparent": {
          "-webkit-tap-highlight-color": "transparent",
        },
        ".touch-manipulation": {
          "touch-action": "manipulation",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
        },
      };
      addUtilities(newUtilities, ["responsive"]);
    },
  ],
};
