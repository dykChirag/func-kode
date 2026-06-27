"use client";
import React from "react";

interface ContributionsChartProps {
  moreThan?: number;
  year?: number;
  isMobile?: boolean;
}

export function ContributionsChart({
  moreThan = 5,
  year = 2021,
  isMobile = false,
}: ContributionsChartProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: isMobile ? "auto" : 445,
        borderRadius: 20,
        padding: "24px 21.5px 20px 21.5px",
        boxSizing: "border-box",
        background:
          "linear-gradient(127deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(10, 14, 35, 0.71) 91.2%)",
        backdropFilter: "blur(60px)",
        WebkitBackdropFilter: "blur(60px)",
        border: "1.5px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title row */}
      <div style={{ marginBottom: isMobile ? 16 : 36 }}>
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
          Your Contributions
        </h3>
        <span
          style={{
            color: "#01B574",
            fontFamily: "Poppins, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            lineHeight: "140%",
          }}
        >
          (+{moreThan}){" "}
          <span style={{ fontWeight: 400, color: "#A0AEC0" }}>
            more in {year}
          </span>
        </span>
      </div>

      {/* Exact Figma SVG — swap paths below when GitHub data is wired up */}
      <div style={isMobile ? { width: "100%", aspectRatio: "884/297" } : { flex: 1, overflow: "hidden" }}>
      <svg
        width="100%"
        height="100%"
        viewBox="-5 -18 920 325"
        preserveAspectRatio={isMobile ? "xMidYMid meet" : "none"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* Y-axis labels */}
        <text x="36" y="261" fill="#CBD5E0" fontSize={isMobile ? 26 : 12} textAnchor="end" fontFamily="sans-serif">0</text>
        <text x="36" y="211" fill="#CBD5E0" fontSize={isMobile ? 26 : 12} textAnchor="end" fontFamily="sans-serif">100</text>
        <text x="36" y="161" fill="#CBD5E0" fontSize={isMobile ? 26 : 12} textAnchor="end" fontFamily="sans-serif">200</text>
        <text x="36" y="111" fill="#CBD5E0" fontSize={isMobile ? 26 : 12} textAnchor="end" fontFamily="sans-serif">300</text>
        <text x="36" y="61"  fill="#CBD5E0" fontSize={isMobile ? 26 : 12} textAnchor="end" fontFamily="sans-serif">400</text>
        <text x="36" y="14"  fill="#CBD5E0" fontSize={isMobile ? 26 : 12} textAnchor="end" fontFamily="sans-serif">500</text>

        {/* X-axis labels */}
        {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
          <text key={m} x={41 + i * 76.3} y="292" fill="#CBD5E0" fontSize={isMobile ? 26 : 12} textAnchor="middle" fontFamily="sans-serif">{m}</text>
        ))}

        {/* Grid lines */}
        <line x1="41.5" y1="257" x2="880.5" y2="257" stroke="#56577A" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.5 3.5"/>
        <line x1="41.5" y1="207" x2="880.5" y2="207" stroke="#56577A" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.5 3.5"/>
        <line x1="41.5" y1="157" x2="880.5" y2="157" stroke="#56577A" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.5 3.5"/>
        <line x1="41.5" y1="107" x2="880.5" y2="107" stroke="#56577A" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.5 3.5"/>
        <line x1="41.5" y1="57"  x2="880.5" y2="57"  stroke="#56577A" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.5 3.5"/>
        <line x1="41.5" y1="7"   x2="880.5" y2="7"   stroke="#56577A" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3.5 3.5"/>

        {/* Cyan fill area */}
        <path
          d="M766.203 177.045C809.811 163.948 860.904 182.503 881 193.417V257.25H40.9999V7.5C83.2009 14.9922 110.33 76.5946 117.112 115.72C122.644 147.632 122.89 170.386 152.28 177.045C181.827 183.74 216.859 162.436 246.5 133.577C270.213 110.49 305.615 123.957 320.352 133.577C346.476 150.319 389.509 161.672 424.074 144.579C467.28 123.213 491.143 129.317 545.653 144.579C600.163 159.841 594.636 169.553 640.103 193.417C685.569 217.281 711.694 193.417 766.203 177.045Z"
          fill="url(#paint0_linear_2105_661)"
        />
        {/* Cyan line */}
        <path
          d="M881 193.417C860.904 182.503 809.811 163.948 766.203 177.045C711.694 193.417 685.569 217.281 640.103 193.417C594.636 169.553 600.163 159.841 545.653 144.579C491.143 129.317 467.28 123.213 424.074 144.579C389.51 161.672 346.476 150.319 320.352 133.577C305.615 123.957 270.213 110.49 246.5 133.577C216.859 162.436 181.827 183.74 152.28 177.045C122.89 170.386 122.644 147.632 117.112 115.72C110.33 76.5946 83.2009 14.9922 40.9999 7.5"
          stroke="#2CD9FF"
          strokeWidth="3"
        />

        {/* Blue fill area */}
        <path
          d="M154.414 150.456C111.142 137.369 60.4414 155.91 40.5002 166.816V257.5H879.5V42.9072C837.624 50.3939 802.05 48.4524 795.32 87.5496C789.831 119.437 789.587 142.175 760.423 148.829C731.103 155.52 714.059 116.387 684.646 87.5496C661.115 64.4795 621.486 94.4997 606.862 104.112C580.939 120.842 522.007 84.3405 496.468 55.6478C460 14.6778 412.043 10.9306 375.823 55.6478C339.604 100.365 303.678 63.7031 258.561 87.5496C213.444 111.396 208.505 166.816 154.414 150.456Z"
          fill="url(#paint1_linear_2105_661)"
        />
        {/* Blue line */}
        <path
          d="M41 166.5C60.9412 155.579 111.642 137.015 154.914 150.119C209.005 166.5 213.944 111.009 259.061 87.1318C304.178 63.2548 340.104 99.9636 376.323 55.1892C412.543 10.4147 460.5 14.1668 496.967 55.1892C522.507 83.9187 581.439 120.467 607.362 103.716C621.986 94.0909 661.615 64.0322 685.146 87.1318C714.559 116.006 731.603 155.189 760.923 148.49C790.087 141.827 790.331 119.06 795.82 87.1318C802.55 47.9846 838.123 49.9285 880 42.4323"
          stroke="#0075FF"
          strokeWidth="3"
        />

        <defs>
          <linearGradient id="paint0_linear_2105_661" x1="461" y1="7.5" x2="461" y2="257.25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2CD9FF" stopOpacity="0.36"/>
            <stop offset="1" stopColor="#2CD9FF" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="paint1_linear_2105_661" x1="460" y1="23.4998" x2="460" y2="257.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0075FF"/>
            <stop offset="1" stopColor="#0075FF" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
      </div>
    </div>
  );
}
