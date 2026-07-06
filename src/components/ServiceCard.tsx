"use client";

import { Building, Cpu, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link } from "@/lib/router";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: JSX.Element; // Made icon optional
  linkUrl: string; // Make linkUrl required
  serviceCardLang: any; // Pass the language object for ServiceCard
}

const ServiceCard = ({ title, description, icon, linkUrl, serviceCardLang }: ServiceCardProps) => {
  const [hovered, setHovered] = useState(false);

  // Determine direction for arrow
  const isRTL = typeof window !== "undefined" && document.documentElement.dir === "rtl";

  // Icon and color mapping based on language keys
  const iconMap: Record<string, JSX.Element> = {
    [serviceCardLang.consult]: (
      <MessageSquare size={24} style={{ color: hovered ? "#8B5CF6" : "#8B5CF6" }} />
    ),
    [serviceCardLang.architect]: (
      <Building size={24} style={{ color: hovered ? "#D946EF" : "#D946EF" }} />
    ),
    [serviceCardLang.implement]: (
      <Cpu size={24} style={{ color: hovered ? "#06B6D4" : "#06B6D4" }} />
    ),
  };

  // Use provided icon or mapped icon
  const getIcon = () => {
    if (icon) return icon;
    return iconMap[title] || null;
  };

  return (
    <Link
      to={linkUrl}
      className={`service-card p-5 flex flex-col items-center text-center group transition-colors ${hovered ? "bg-gray-100" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Service card for ${title}`}
    >
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 group-hover:scale-110 transition-transform">
        {getIcon()}
      </div>
      <h3 className={`text-lg font-semibold mb-3 transition-colors`}>{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <span className="text-sm font-medium flex items-center mt-auto" style={{ color: "#8B5CF6" }}>
        {isRTL ? (
          <>
            {serviceCardLang.readMore}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </>
        ) : (
          <>
            {serviceCardLang.readMore}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </span>
    </Link>
  );
};

export default ServiceCard;
