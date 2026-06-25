"use client";

import { useState } from "react";

const DiscordIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.2467 1.19435C14.0872 0.656765 12.8468 0.263839 11.5498 0.0378418C11.5265 0.0335693 11.5032 0.0442505 11.4914 0.0656149C11.3332 0.352496 11.1579 0.727129 11.034 1.02091C9.64354 0.810178 8.26016 0.810178 6.89795 1.02091C6.774 0.720638 6.59237 0.352496 6.43352 0.0656149C6.42171 0.0449381 6.39843 0.0342569 6.37512 0.0378418C5.07887 0.263126 3.83848 0.656052 2.67826 1.19435C2.6686 1.19863 2.66037 1.20576 2.65498 1.21503C0.291785 4.79977 -0.349258 8.2948 -0.0349565 11.7469C-0.0335815 11.7641 -0.0235815 11.7805 -0.00994399 11.7905C1.53872 12.9256 3.03088 13.6171 4.49492 14.074C4.51823 14.0811 4.54297 14.0726 4.55764 14.0534C4.9064 13.5713 5.21639 13.0634 5.48214 12.5298C5.49752 12.4991 5.48285 12.4627 5.45098 12.4506C4.95378 12.2613 4.47994 12.0278 4.02396 11.7626C3.98851 11.7412 3.98565 11.6906 4.01823 11.6656C4.11325 11.5935 4.20828 11.5185 4.29901 11.4428C4.31512 11.4292 4.33771 11.4264 4.35668 11.4349C7.37138 12.7969 10.6468 12.7969 13.6266 11.4349C13.6456 11.4257 13.6682 11.4285 13.685 11.4421C13.7757 11.5178 13.8707 11.5935 13.9665 11.6656C13.9991 11.6906 13.997 11.7412 13.9615 11.7626C13.5055 12.0328 13.0317 12.2613 12.5338 12.4499C12.5019 12.462 12.488 12.4991 12.5034 12.5298C12.7748 13.0627 13.0848 13.5706 13.4271 14.0527C13.4411 14.0726 13.4665 14.0811 13.4898 14.074C14.9617 13.6171 16.4539 12.9256 17.9925 11.7905C18.0069 11.7805 18.0161 11.7648 18.0175 11.7476C18.3925 7.76098 17.3818 4.29559 15.2704 1.21574C15.2657 1.20576 15.2574 1.19863 15.2467 1.19435ZM6.01316 9.66895C5.12174 9.66895 4.38956 8.84957 4.38956 7.84276C4.38956 6.83595 5.10748 6.01657 6.01316 6.01657C6.92594 6.01657 7.65103 6.84309 7.63676 7.84276C7.63676 8.84957 6.91884 9.66895 6.01316 9.66895ZM11.998 9.66895C11.1066 9.66895 10.3744 8.84957 10.3744 7.84276C10.3744 6.83595 11.0923 6.01657 11.998 6.01657C12.9108 6.01657 13.6359 6.84309 13.6216 7.84276C13.6216 8.84957 12.9108 9.66895 11.998 9.66895Z" fill="white"/>
  </svg>
);

export function DiscordButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://discord.gg/uSECAhRet"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: iconOnly ? "center" : "flex-start",
        gap: iconOnly ? 0 : 10,
        width: iconOnly ? 39.5 : "auto",
        height: 39.5,
        padding: iconOnly ? "0" : "0 18px",
        background: hovered ? "#5865F2" : "#0F1535",
        border: "0.5px solid rgba(226, 232, 240, 0.3)",
        borderRadius: 100,
        textDecoration: "none",
        flexShrink: 0,
        boxSizing: "border-box",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: "none",
        transition: "all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      <DiscordIcon />
      {!iconOnly && (
        <span
          style={{
            color: "#fff",
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            fontWeight: 500,
            lineHeight: "150%",
            whiteSpace: "nowrap",
            letterSpacing: "0.01em",
          }}
        >
          Join Our Discord Server
        </span>
      )}
      {/* External Link Indicator Arrow */}
      {!iconOnly && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: hovered ? "translate(1px, -1px)" : "translate(0, 0)",
            transition: "transform 0.25s ease",
            flexShrink: 0,
          }}
        >
          <path
            d="M1 9L9 1M9 1H3M9 1V7"
            stroke="#A0AEC0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ stroke: hovered ? "#FFF" : "#A0AEC0", transition: "stroke 0.25s ease" }}
          />
        </svg>
      )}
    </a>
  );
}
