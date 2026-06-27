"use client";
import React from "react";

interface Avatar {
  initials: string;
  bg: string;
  color: string;
}

interface ProjectRow {
  iconBg: string;
  icon: React.ReactNode;
  name: string;
  avatars: Avatar[];
  activePRs: number;
  status: number;
}

const DEFAULT_PROJECTS: ProjectRow[] = [
  {
    iconBg: "#470137",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#xd1)"><path d="M3.54167 0H16.4583C18.4167 0 20 1.58333 20 3.54167V15.9583C20 17.9167 18.4167 19.5 16.4583 19.5H3.54167C1.58333 19.5 0 17.9167 0 15.9583V3.54167C0 1.58333 1.58333 0 3.54167 0Z" fill="#470137"/><path d="M10.5166 5.125L8.0166 9.25L10.6833 13.625C10.6999 13.6583 10.7083 13.6917 10.6999 13.725C10.6916 13.7583 10.6583 13.7333 10.6083 13.7417H8.69993C8.5666 13.7417 8.47493 13.7333 8.4166 13.65C8.2416 13.3 8.05827 12.9583 7.88327 12.6083C7.70827 12.2667 7.5166 11.9167 7.3166 11.5583C7.1166 11.2 6.9166 10.8417 6.7166 10.475H6.69993C6.52493 10.8333 6.33327 11.1917 6.1416 11.55C5.94993 11.9083 5.75827 12.2667 5.57493 12.6167C5.38327 12.9667 5.1916 13.325 4.99993 13.6667C4.9666 13.75 4.89993 13.7583 4.80827 13.7583H2.97493C2.9416 13.7583 2.9166 13.775 2.9166 13.7333C2.90827 13.7 2.9166 13.6667 2.93327 13.6417L5.52493 9.39167L2.99993 5.11667C2.97493 5.08333 2.9666 5.05 2.98327 5.03333C2.99993 5.00833 3.03327 5 3.0666 5H4.95827C4.99993 5 5.0416 5.00833 5.07493 5.01667C5.10827 5.03333 5.13327 5.05833 5.15827 5.09167C5.3166 5.45 5.49993 5.80833 5.6916 6.16667C5.8916 6.525 6.08327 6.875 6.2916 7.225C6.4916 7.575 6.67493 7.925 6.84993 8.28333H6.8666C7.0416 7.91667 7.22493 7.55833 7.40827 7.20833C7.5916 6.85833 7.78327 6.50833 7.97493 6.15833C8.1666 5.80833 8.34993 5.45 8.53327 5.10833C8.5416 5.075 8.55827 5.04167 8.58327 5.025C8.6166 5.00833 8.64993 5 8.6916 5.00833H10.4499C10.4916 5 10.5333 5.025 10.5416 5.06667C10.5499 5.075 10.5333 5.10833 10.5166 5.125Z" fill="#FF61F6"/><path d="M14.3667 13.9166C13.75 13.925 13.1333 13.8 12.575 13.5416C12.05 13.3 11.6167 12.9 11.3167 12.4083C11.0083 11.9 10.8583 11.2666 10.8583 10.5083C10.85 9.89164 11.0083 9.28331 11.3167 8.74998C11.6333 8.20831 12.0917 7.75831 12.6417 7.45831C13.225 7.13331 13.925 6.97498 14.75 6.97498C14.7917 6.97498 14.85 6.97498 14.925 6.98331C15 6.99164 15.0833 6.99164 15.1833 6.99998V4.36664C15.1833 4.30831 15.2083 4.27498 15.2667 4.27498H16.9583C17 4.26664 17.0333 4.29998 17.0417 4.33331C17.0417 4.34164 17.0417 4.34998 17.0417 4.34998V12.2833C17.0417 12.4333 17.05 12.6 17.0583 12.7833C17.075 12.9583 17.0833 13.125 17.0917 13.2666C17.0917 13.325 17.0667 13.375 17.0083 13.4C16.575 13.5833 16.1167 13.7166 15.65 13.8C15.225 13.875 14.8 13.9166 14.3667 13.9166ZM15.1833 12.25V8.58331C15.1083 8.56664 15.0333 8.54998 14.9583 8.54164C14.8667 8.53331 14.775 8.52498 14.6833 8.52498C14.3583 8.52498 14.0333 8.59164 13.7417 8.74164C13.4583 8.88331 13.2167 9.09164 13.0333 9.35831C12.85 9.62498 12.7583 9.98331 12.7583 10.4166C12.75 10.7083 12.8 11 12.9 11.275C12.9833 11.5 13.1083 11.7 13.275 11.8666C13.4333 12.0166 13.625 12.1333 13.8417 12.2C14.0667 12.275 14.3 12.3083 14.5333 12.3083C14.6583 12.3083 14.775 12.3 14.8833 12.2916C14.9917 12.3 15.0833 12.2833 15.1833 12.25Z" fill="#FF61F6"/></g><defs><clipPath id="xd1"><rect width="20" height="19.5" fill="white"/></clipPath></defs></svg>
    ),
    name: "Chakra Soft UI Version",
    avatars: [
      { initials: "AK", bg: "#E53E3E", color: "#fff" },
      { initials: "MJ", bg: "#3182CE", color: "#fff" },
      { initials: "SR", bg: "#38A169", color: "#fff" },
      { initials: "PL", bg: "#D69E2E", color: "#fff" },
    ],
    activePRs: 25,
    status: 60,
  },
  {
    iconBg: "#0a0a0a",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.92676 9.23904C5.83498 9.11922 5.69949 9.04064 5.54991 9.02049C5.40034 9.00034 5.24888 9.04026 5.12867 9.13152C5.05795 9.18729 5.00091 9.25848 4.96189 9.33966L0.0617556 19.1427C-0.00764703 19.2816 -0.0190467 19.4424 0.0300624 19.5897C0.0791714 19.7371 0.18477 19.8589 0.323647 19.9284C0.404824 19.9694 0.494569 19.9907 0.585539 19.9904H7.41265C7.522 19.9932 7.62979 19.964 7.72282 19.9065C7.81585 19.849 7.89009 19.7655 7.93643 19.6665C9.40992 16.623 8.51673 11.9958 5.92676 9.23904Z" fill="url(#atl1)"/><path d="M9.52841 0.318096C8.30686 2.19786 7.59495 4.36289 7.46253 6.60078C7.3301 8.83867 7.78172 11.0726 8.77306 13.0833L12.0646 19.6664C12.1133 19.7637 12.188 19.8455 12.2805 19.9027C12.373 19.9599 12.4796 19.9903 12.5884 19.9903H19.4141C19.4911 19.9905 19.5674 19.9755 19.6385 19.9461C19.7097 19.9167 19.7743 19.8736 19.8288 19.8191C19.8832 19.7647 19.9264 19.7001 19.9557 19.6289C19.9851 19.5577 20.0001 19.4815 20 19.4045C20 19.3137 19.9793 19.2241 19.9393 19.1426L10.525 0.31534C10.4803 0.220998 10.4097 0.141281 10.3215 0.0854577C10.2333 0.0296347 10.1311 0 10.0267 0C9.9223 0 9.82006 0.0296347 9.73185 0.0854577C9.64364 0.141281 9.57309 0.220998 9.52841 0.31534V0.318096Z" fill="#2684FF"/><defs><linearGradient id="atl1" x1="8.62424" y1="10.7373" x2="3.44981" y2="19.6995" gradientUnits="userSpaceOnUse"><stop stopColor="#0052CC"/><stop offset="0.92" stopColor="#2684FF"/></linearGradient></defs></svg>
    ),
    name: "Add Progress Track",
    avatars: [
      { initials: "TN", bg: "#3182CE", color: "#fff" },
      { initials: "OP", bg: "#805AD5", color: "#fff" },
    ],
    activePRs: 12,
    status: 10,
  },
  {
    iconBg: "#0a0a0a",
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#slk1)"><path fillRule="evenodd" clipRule="evenodd" d="M7.33266 0C6.22708 0.000835882 5.33233 0.918634 5.33315 2.04958C5.33233 3.18053 6.2279 4.09833 7.33347 4.09916H9.3338V2.05042C9.33462 0.91947 8.43905 0.00167176 7.33266 0C7.33347 0 7.33347 0 7.33266 0V0ZM7.33266 5.46667H2.00009C0.894512 5.4675 -0.00105903 6.3853 -0.000241908 7.51625C-0.00187616 8.6472 0.893695 9.56499 1.99927 9.56667H7.33266C8.43823 9.56583 9.3338 8.64803 9.33298 7.51708C9.3338 6.3853 8.43823 5.4675 7.33266 5.46667Z" fill="#36C5F0"/><path fillRule="evenodd" clipRule="evenodd" d="M20 7.51698C20.0008 6.38603 19.1052 5.46824 17.9997 5.4674C16.8941 5.46824 15.9985 6.38603 15.9993 7.51698V9.5674H17.9997C19.1052 9.56656 20.0008 8.64877 20 7.51698ZM14.6666 7.51698V2.05031C14.6674 0.920202 13.7727 0.00240419 12.6671 0.000732422C11.5615 0.0015683 10.6659 0.919366 10.6668 2.05031V7.51698C10.6651 8.64793 11.5607 9.56573 12.6663 9.5674C13.7718 9.56656 14.6674 8.64877 14.6666 7.51698Z" fill="#2EB67D"/><path fillRule="evenodd" clipRule="evenodd" d="M12.6663 20.5007C13.7719 20.4999 14.6675 19.5821 14.6667 18.4511C14.6675 17.3202 13.7719 16.4024 12.6663 16.4016H10.666V18.4511C10.6652 19.5813 11.5608 20.4991 12.6663 20.5007ZM12.6663 15.0332H17.9997C19.1053 15.0324 20.0009 14.1146 20.0001 12.9836C20.0017 11.8527 19.1061 10.9349 18.0005 10.9332H12.6672C11.5616 10.9341 10.666 11.8519 10.6668 12.9828C10.666 14.1146 11.5608 15.0324 12.6663 15.0332Z" fill="#ECB22E"/><path fillRule="evenodd" clipRule="evenodd" d="M6.15939e-05 12.9837C-0.000755533 14.1146 0.894816 15.0324 2.00039 15.0333C3.10596 15.0324 4.00153 14.1146 4.00072 12.9837V10.9341H2.00039C0.894816 10.9349 -0.000755533 11.8527 6.15939e-05 12.9837ZM5.33345 12.9837V18.4503C5.33182 19.5813 6.22739 20.4991 7.33296 20.5008C8.43853 20.4999 9.3341 19.5821 9.33329 18.4512V12.9853C9.33492 11.8544 8.43935 10.9366 7.33378 10.9349C6.22739 10.9349 5.33263 11.8527 5.33345 12.9837C5.33345 12.9845 5.33345 12.9837 5.33345 12.9837Z" fill="#E01E5A"/></g><defs><clipPath id="slk1"><rect width="20" height="20.5" fill="white"/></clipPath></defs></svg>
    ),
    name: "Fix Platform Errors",
    avatars: [
      { initials: "DW", bg: "#38A169", color: "#fff" },
      { initials: "RK", bg: "#E53E3E", color: "#fff" },
    ],
    activePRs: 20,
    status: 100,
  },
  {
    iconBg: "#191414",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#spt1)"><path d="M10 0C4.47697 0 0 4.47697 0 10C0 15.523 4.47697 20 10 20C15.523 20 20 15.523 20 10C20 4.47765 15.523 0.000682361 10 0ZM14.5861 14.4224C14.4067 14.7172 14.0225 14.8093 13.7291 14.6298C11.3811 13.1948 8.42511 12.8707 4.94439 13.6656C4.60867 13.7427 4.27431 13.5326 4.19788 13.1969C4.12078 12.8611 4.33026 12.5268 4.66667 12.4504C8.47561 11.5803 11.7434 11.955 14.3794 13.5653C14.6728 13.7462 14.7663 14.129 14.5861 14.4224ZM15.8096 11.7004C15.5838 12.0676 15.1034 12.1822 14.7369 11.957C12.0498 10.305 7.95155 9.82668 4.77243 10.7915C4.36029 10.9164 3.92494 10.6837 3.79939 10.2723C3.6752 9.86012 3.90788 9.42545 4.31934 9.2999C7.95087 8.19788 12.4661 8.73149 15.5524 10.6285C15.9195 10.8543 16.0355 11.334 15.8096 11.7004ZM15.9147 8.86455C12.6912 6.95053 7.37427 6.77448 4.29683 7.70795C3.8028 7.85807 3.28011 7.57898 3.13067 7.08495C2.98124 6.59092 3.25964 6.06824 3.75435 5.91812C7.28693 4.84613 13.1586 5.05288 16.8693 7.25554C17.3135 7.51962 17.4596 8.09348 17.1962 8.53702C16.9335 8.98192 16.3582 9.12862 15.9147 8.86455Z" fill="#2EBD59"/></g><defs><clipPath id="spt1"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
    ),
    name: "Launch our Mobile App",
    avatars: [
      { initials: "YB", bg: "#D69E2E", color: "#fff" },
      { initials: "CM", bg: "#3182CE", color: "#fff" },
      { initials: "VH", bg: "#805AD5", color: "#fff" },
    ],
    activePRs: 1,
    status: 100,
  },
  {
    iconBg: "#0a0a0a",
    icon: (
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#jra1)"><path d="M19.7594 9.9197L10.8966 0.990581L10.0378 0.125366L3.36613 6.84699L0.315322 9.9197C0.162936 10.074 0.0773926 10.2828 0.0773926 10.5005C0.0773926 10.7182 0.162936 10.927 0.315322 11.0814L6.41049 17.2222L10.0378 20.8757L16.7086 14.1541L16.8125 14.0503L19.7594 11.086C19.8357 11.0096 19.8963 10.9188 19.9377 10.8187C19.9791 10.7186 20.0004 10.6113 20.0004 10.5028C20.0004 10.3944 19.9791 10.2871 19.9377 10.187C19.8963 10.0869 19.8357 9.99608 19.7594 9.9197ZM10.0378 13.5686L6.99252 10.5005L10.0378 7.43244L13.0822 10.5005L10.0378 13.5686Z" fill="#2684FF"/><path d="M10.0375 7.4327C9.07972 6.46801 8.53982 5.16068 8.53569 3.79625C8.53155 2.43183 9.06352 1.1212 10.0154 0.150635L3.35199 6.86114L6.97838 10.5147L10.0375 7.4327Z" fill="url(#jra1g1)"/><path d="M13.0901 10.4924L10.0375 13.5689C10.9988 14.5377 11.5389 15.8515 11.5389 17.2215C11.5389 18.5914 10.9988 19.9053 10.0375 20.8741L16.7193 14.146L13.0901 10.4924Z" fill="url(#jra1g2)"/></g><defs><linearGradient id="jra1g1" x1="9.49222" y1="4.32849" x2="5.20796" y2="8.58" gradientUnits="userSpaceOnUse"><stop offset="0.18" stopColor="#0052CC"/><stop offset="1" stopColor="#2684FF"/></linearGradient><linearGradient id="jra1g2" x1="776.104" y1="900.926" x2="1212.24" y2="1181.57" gradientUnits="userSpaceOnUse"><stop offset="0.18" stopColor="#0052CC"/><stop offset="1" stopColor="#2684FF"/></linearGradient><clipPath id="jra1"><rect width="20" height="21" fill="white"/></clipPath></defs></svg>
    ),
    name: "Add the New Pricing Page",
    avatars: [
      { initials: "FS", bg: "#E53E3E", color: "#fff" },
      { initials: "NG", bg: "#38A169", color: "#fff" },
      { initials: "BT", bg: "#805AD5", color: "#fff" },
      { initials: "LC", bg: "#D69E2E", color: "#fff" },
    ],
    activePRs: 8,
    status: 25,
  },
  {
    iconBg: "#DC395F",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#inv1)"><path d="M18.187 0H1.81305C0.811719 0 0 0.811719 0 1.81305V18.187C0 19.1883 0.811719 20 1.81305 20H18.187C19.1883 20 20 19.1883 20 18.187V1.81305C20 0.811719 19.1883 0 18.187 0Z" fill="#DC395F"/><path d="M6.68391 6.29345C7.34876 6.29345 7.90571 5.77235 7.90571 5.08938C7.90571 4.40688 7.34876 3.88586 6.68391 3.88586C6.01907 3.88586 5.46227 4.40688 5.46227 5.08938C5.46227 5.77227 6.01907 6.29345 6.68391 6.29345ZM4.15063 12.7403C4.07883 13.0458 4.04282 13.3756 4.04282 13.6447C4.04282 14.7049 4.61774 15.4088 5.83954 15.4088C6.85282 15.4088 7.6743 14.8071 8.26579 13.8354L7.90461 15.2849H9.91672L11.0667 10.6724C11.3542 9.50462 11.9112 8.89845 12.7557 8.89845C13.4205 8.89845 13.8337 9.31189 13.8337 9.99439C13.8337 10.1921 13.8157 10.4075 13.7438 10.6412L13.1509 12.7613C13.061 13.0667 13.0252 13.3724 13.0252 13.6596C13.0252 14.6661 13.618 15.4023 14.8577 15.4023C15.9178 15.4023 16.7622 14.7199 17.2294 13.0848L16.4389 12.7796C16.0436 13.875 15.7022 14.0731 15.4327 14.0731C15.1631 14.0731 15.0194 13.8935 15.0194 13.5344C15.0194 13.3727 15.0555 13.1932 15.1092 12.9771L15.6843 10.9117C15.828 10.4267 15.882 9.99658 15.882 9.60142C15.882 8.05626 14.9476 7.24985 13.8157 7.24985C12.7557 7.24985 11.6776 8.20603 11.1387 9.21236L11.5338 7.4061H8.46165L8.0304 8.99704H9.46782L8.58266 12.5408C7.88758 14.086 6.61079 14.111 6.45055 14.0752C6.18743 14.0158 6.01915 13.9159 6.01915 13.574C6.01915 13.3767 6.05508 13.0934 6.14493 12.7517L7.49258 7.4061H4.07883L3.64758 8.99704H5.06688L4.15071 12.7403" fill="white"/></g><defs><clipPath id="inv1"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
    ),
    name: "Redesign New Online Shop",
    avatars: [
      { initials: "KA", bg: "#3182CE", color: "#fff" },
      { initials: "ZR", bg: "#E53E3E", color: "#fff" },
    ],
    activePRs: 15,
    status: 40,
  },
];

interface ProjectsCardProps {
  projects?: ProjectRow[];
  activeProjectsCount?: number;
  isMobile?: boolean;
}

export function ProjectsCard({
  projects = DEFAULT_PROJECTS,
  activeProjectsCount = 6,
  isMobile = false,
}: ProjectsCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: isMobile ? "auto" : 519,
        borderRadius: 20,
        padding: "24px 24px 20px 24px",
        boxSizing: "border-box",
        overflow: "hidden",
        background:
          "linear-gradient(127deg, rgba(6,11,40,0.74) 28.26%, rgba(10,14,35,0.71) 91.2%)",
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
        border: "1.5px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3
            style={{
              margin: 0,
              color: "#FFF",
              fontFamily: "Poppins, sans-serif",
              fontSize: 18,
              fontWeight: 700,
              lineHeight: "140%",
            }}
          >
            Projects
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.50006 1.40601C4.14 1.40601 1.40631 4.1397 1.40631 7.49976C1.40631 10.8598 4.14 13.5935 7.50006 13.5935C10.8601 13.5935 13.5938 10.8598 13.5938 7.49976C13.5938 4.1397 10.8601 1.40601 7.50006 1.40601ZM10.6714 5.45747L6.73395 10.145C6.69076 10.1964 6.63701 10.238 6.57635 10.2668C6.5157 10.2957 6.44955 10.3112 6.38238 10.3123H6.37447C6.30877 10.3122 6.24381 10.2984 6.1838 10.2716C6.12379 10.2449 6.07007 10.2058 6.02613 10.157L4.33863 8.28198C4.29578 8.23653 4.26244 8.18296 4.24058 8.12444C4.21872 8.06592 4.20878 8.00361 4.21134 7.94119C4.2139 7.87877 4.22892 7.8175 4.2555 7.76096C4.28208 7.70443 4.3197 7.65377 4.36614 7.61198C4.41257 7.57019 4.4669 7.53811 4.52591 7.51761C4.58493 7.49712 4.64744 7.48862 4.70979 7.49263C4.77213 7.49664 4.83304 7.51308 4.88895 7.54096C4.94485 7.56885 4.99461 7.60763 5.03531 7.65503L6.36217 9.12925L9.95367 4.85454C10.0342 4.7614 10.1482 4.7037 10.271 4.69392C10.3937 4.68414 10.5154 4.72306 10.6097 4.80226C10.704 4.88147 10.7633 4.99461 10.7749 5.11721C10.7864 5.23981 10.7493 5.36204 10.6714 5.45747Z" fill="#01B574"/></svg>
            <span
              style={{
                color: "#FFF",
                fontFamily: "Poppins, sans-serif",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: "140%",
              }}
            >
              {activeProjectsCount} Active Projects
            </span>
          </div>
        </div>
        {/* Three dots menu */}
        <svg width="5" height="20" viewBox="0 0 5 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="2.5" cy="2.5" r="2.5" fill="#A0AEC0" />
          <circle cx="2.5" cy="10" r="2.5" fill="#A0AEC0" />
          <circle cx="2.5" cy="17.5" r="2.5" fill="#A0AEC0" />
        </svg>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "18px 0 0 0" }} />

      {/* Table — horizontally scrollable on mobile, vertically scrollable via card */}
      <div style={isMobile ? { overflowX: "auto" } : undefined}>
        <div style={{ minWidth: isMobile ? 620 : undefined }}>
          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "200px 160px 140px 120px" : "2fr 200px 250px 180px",
              alignItems: "center",
              padding: "14px 0",
            }}
          >
            {(isMobile
              ? ["Your Projects", "Contributors", "Active PRs", "Status"]
              : ["Your Projects", "Contributors", "Active Pull Requests", "Status"]
            ).map((h) => (
              <span
                key={h}
                style={{
                  color: "#A0AEC0",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: "140%",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.1)" }} />

          {/* Rows */}
          <div style={isMobile ? { maxHeight: 320, overflowY: "auto", overflowX: "hidden" } : undefined}>
          {projects.map((project, i) => (
            <div key={project.name}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "200px 160px 140px 120px" : "2fr 200px 250px 180px",
                  alignItems: "center",
                  height: 60,
                }}
              >
                {/* Icon + Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: project.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {project.icon}
                  </div>
                  <span
                    style={{
                      color: "#FFF",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 13,
                      fontWeight: 400,
                      lineHeight: "150%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.name}
                  </span>
                </div>

                {/* Avatar stack */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  {project.avatars.map((av, j) => (
                    <div
                      key={j}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: av.bg,
                        border: "2px solid rgba(6,11,40,0.9)",
                        marginLeft: j > 0 ? -8 : 0,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 8,
                        fontWeight: 700,
                        color: av.color,
                        fontFamily: "Poppins, sans-serif",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {av.initials}
                    </div>
                  ))}
                </div>

                {/* Active PRs */}
                <span
                  style={{
                    color: "#FFF",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    lineHeight: "140%",
                  }}
                >
                  {project.activePRs}
                </span>

                {/* Status */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span
                    style={{
                      color: "#FFF",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      lineHeight: "140%",
                    }}
                  >
                    {project.status}%
                  </span>
                  <svg
                    width="100%"
                    height="3"
                    viewBox="0 0 100 3"
                    fill="none"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="1.5" y1="1.5" x2="98.5" y2="1.5" stroke="#2D2E5F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="1.5" y1="1.5" x2={1.5 + (project.status / 100) * 97} y2="1.5" stroke="#0075FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {i < projects.length - 1 && (
                <div style={{ height: 1, background: "rgba(255,255,255,0.1)" }} />
              )}
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
