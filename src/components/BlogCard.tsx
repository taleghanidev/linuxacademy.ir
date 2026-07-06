"use client";

import { Calendar } from "lucide-react";
import { getStrapiMediaUrl } from "@/lib/utils";

interface BlogCardProps {
  title: string;
  summary: string;
  date: string;
  imageSrc: string;
  link: string;
}

const BlogCard = ({ title, summary, date, imageSrc, link }: BlogCardProps) => {
  return (
    <div className="blog-card bg-white">
      <div className="overflow-hidden">
        <img src={getStrapiMediaUrl(imageSrc)} alt={title} className="blog-card-image" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-brand-blue-light mb-3">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{date}</span>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 line-clamp-3 mb-4 text-sm">{summary}</p>
        <a
          href={link}
          className="inline-flex items-center text-brand-blue font-medium hover:text-brand-blue-dark transition-colors"
        >
          Read More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default BlogCard;
