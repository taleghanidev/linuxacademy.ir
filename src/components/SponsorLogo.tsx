"use client";

import { motion } from "framer-motion";
import { cn, getStrapiMediaUrl } from "@/lib/utils";

interface SponsorLogoProps {
  name: string;
  imgSrc: string;
  className?: string;
  width?: number;
  height?: number;
}

const SponsorLogo = ({ name, imgSrc, className, width = 120, height = 60 }: SponsorLogoProps) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
      transition={{
        duration: 0.2,
      }}
      className={cn(
        // Fixed size for all sponsor boxes
        "flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm",
        "hover:border-brand-purple transition-all duration-300 cursor-pointer",
        "w-[200px] h-[120px] min-w-[200px] min-h-[120px] max-w-[200px] max-h-[120px]", // Fixed size
        className,
      )}
      tabIndex={0}
      role="button"
      aria-label={name}
    >
      <div className="flex-1 flex items-center justify-center w-full h-16 overflow-hidden">
        {imgSrc ? (
          <img
            src={getStrapiMediaUrl(imgSrc)}
            alt={`${name} logo`}
            className="object-contain max-h-12 max-w-full mx-auto"
            loading="lazy"
            style={{ height: "48px", width: "auto" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md">
            <svg
              width={width}
              height={height}
              viewBox="0 0 120 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="120" height="60" rx="12" fill="#F3F4F6" />
              <text
                x="60"
                y="35"
                textAnchor="middle"
                fontSize="18"
                fill="#8B5CF6"
                fontWeight="bold"
              >
                LOGO
              </text>
            </svg>
          </div>
        )}
      </div>
      <div className="w-full mt-3 text-center">
        <span className="font-medium text-sm text-gray-800 line-clamp-2 hover:text-brand-purple transition-colors">
          {name}
        </span>
      </div>
    </motion.div>
  );
};

export default SponsorLogo;
