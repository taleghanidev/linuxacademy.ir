"use client";

import { Home, Mail, Phone } from "lucide-react";

interface ContactInfoProps {
  lang: {
    phone1: string;
    phone2: string;
    email: string;
    address: string;
    whatsapp: string;
    telegram: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}

const ContactInfo = ({ lang }: ContactInfoProps) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2">
        <div
          className="p-0 rounded-md"
          style={{
            color: "#8B5CF6",
          }}
        >
          <Phone className="h-5 w-5" />
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-2">
          <a
            href={`tel:${lang.phone1.replace(/\s+/g, "")}`}
            className="text-sm text-gray-600 text-left"
            dir="ltr"
          >
            {lang.phone1}
          </a>
          <span className="hidden sm:inline text-gray-400">|</span>
          <a
            href={`tel:${lang.phone2.replace(/\s+/g, "")}`}
            className="text-sm text-gray-600 text-left"
            dir="ltr"
          >
            {lang.phone2}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="p-0 rounded-md"
          style={{
            color: "#D946EF",
          }}
        >
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <a href={`mailto:${lang.email}`} className="text-sm text-gray-600">
            {lang.email}
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="p-0 rounded-md"
          style={{
            color: "#06B6D4",
          }}
        >
          <Home className="h-5 w-5" />
        </div>
        <div>
          <a className="text-sm text-gray-600">{lang.address}</a>
        </div>
      </div>

      <div className="flex flex-col mt-4">
        <div className="flex flex-wrap gap-3 justify-start">
          {/* WhatsApp */}
          <a
            href="https://wa.me/989389151100"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-md border border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-green-600"
            >
              <path d="M17.6 6.8A7.8 7.8 0 0 0 12 4.5a8 8 0 0 0-8 8 8 8 0 0 0 1 3.9L4 22l5.8-1.5a8 8 0 0 0 3.8 1 8 8 0 0 0 8-8 8 8 0 0 0-4-6.7" />
              <path d="M14.5 14.2a1.2 1.2 0 0 1-1.8 1.5c-1-.4-2.1-.8-3.1-1.8s-1.4-2.1-1.8-3.1a1.2 1.2 0 0 1 1.5-1.8 1.2 1.2 0 0 1 .6.6c.2.5-.3 1 .1 1.8s1.2 1.2 1.8 1.8 1.3.6 1.8.1a1.2 1.2 0 0 1 .6-.6.7.7 0 0 1 .3-.5" />
            </svg>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/linuxacademyir"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-md border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-blue-500"
            >
              <path d="M22 2L15 22L11 13L2 9L22 2Z M22 2L11 13" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/linuxacademy.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-md border border-gray-300 hover:border-pink-500 hover:bg-pink-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-pink-600"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/taleghanipv"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-md border border-gray-300 hover:border-blue-700 hover:bg-blue-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-blue-700"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com/@linuxacademyir"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-md border border-gray-300 hover:border-red-500 hover:bg-red-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-red-600"
            >
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
export default ContactInfo;
