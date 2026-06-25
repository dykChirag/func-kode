"use client";

const IcSearch = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3793 12.3459L10.6228 9.58932C11.2865 8.70583 11.6447 7.63044 11.6435 6.52546C11.6435 3.703 9.34721 1.40671 6.52475 1.40671C3.70229 1.40671 1.40601 3.703 1.40601 6.52546C1.40601 9.34792 3.70229 11.6442 6.52475 11.6442C7.62974 11.6454 8.70513 11.2872 9.58862 10.6235L12.3452 13.38C12.4847 13.5048 12.6667 13.5714 12.8538 13.5661C13.0409 13.5609 13.2188 13.4842 13.3512 13.3519C13.4835 13.2195 13.5602 13.0416 13.5654 12.8545C13.5707 12.6674 13.5041 12.4854 13.3793 12.3459ZM2.86851 6.52546C2.86851 5.80232 3.08294 5.09542 3.48469 4.49415C3.88645 3.89289 4.45748 3.42426 5.12557 3.14752C5.79366 2.87079 6.52881 2.79838 7.23805 2.93946C7.9473 3.08054 8.59878 3.42876 9.11011 3.9401C9.62145 4.45143 9.96967 5.10291 10.1107 5.81216C10.2518 6.5214 10.1794 7.25655 9.90269 7.92464C9.62595 8.59273 9.15732 9.16376 8.55606 9.56551C7.95479 9.96727 7.24789 10.1817 6.52475 10.1817C5.55541 10.1805 4.62611 9.79496 3.94068 9.10953C3.25525 8.4241 2.86967 7.4948 2.86851 6.52546Z" fill="#718096"/>
  </svg>
);

export function DashboardSearch({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: iconOnly ? "center" : "flex-start",
        gap: iconOnly ? 0 : 12,
        width: iconOnly ? 39.5 : 199,
        height: 39.5,
        background: "#0F1535",
        border: "0.5px solid rgba(226, 232, 240, 0.3)",
        borderRadius: 100,
        padding: iconOnly ? 0 : "0 18px 0 14px",
        boxSizing: "border-box",
      }}
    >
      <IcSearch />
      {!iconOnly && (
        <span
          style={{
            color: "var(--Gray-Gray-400, #A0AEC0)",
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "150%",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Type here...
        </span>
      )}
    </div>
  );
}
