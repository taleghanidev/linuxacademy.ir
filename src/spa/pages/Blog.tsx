"use client";

import moment from "moment-jalaali";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import PageShell, { useIsFa } from "@/components/PageShell";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getArticles } from "@/config/content";
import contactFormEn from "@/language/en/components/contactForm";
import navBarEn from "@/language/en/components/navBar";
import blogPageEn from "@/language/en/pages/blog";
import contactFormFa from "@/language/fa/components/contactForm";
import navBarFa from "@/language/fa/components/navBar";
import blogPageFa from "@/language/fa/pages/blog";
import { Link } from "@/lib/router";
import { getStrapiMediaUrl } from "@/lib/utils";

const Blog = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState(false);
  const articlesPerPage = 9; // Increased number of articles per page

  const isFa = useIsFa();
  const _contactFormLang = isFa ? contactFormFa : contactFormEn;
  const blogLang = isFa ? blogPageFa : blogPageEn;

  useEffect(() => {
    // Articles are static now (no Strapi).
    const all = getArticles() as any[];
    setArticles(all);
    setTotalArticles(all.length);
    setCategories([]);
    setLoading(false);
    setIsVisible(true);
  }, []);

  const handleCategoryClick = (categorySlug) => {
    if (categorySlug === "all") {
      setSelectedCategory(null); // Reset to show all articles
    } else {
      setSelectedCategory(categorySlug);
    }
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Maximum number of page links to show

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 2);
        endPage = totalPages - 1;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page if there's more than one page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <NavBar lang={isFa ? navBarFa : navBarEn} />
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold text-red-600 mb-4">خطا در بارگذاری اطلاعات</h2>
          <p className="text-gray-700 mb-6">
            متاسفانه ارتباط با سرور برقرار نشد. لطفاً بعداً دوباره تلاش کنید.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageShell container={false}>
      {/* Blog Header Section */}
      <section className="container mx-auto pt-24 pb-4">
        <h1 className="text-4xl font-bold mb-6 text-center">{blogLang.header.title}</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{blogLang.header.intro}</p>
      </section>

      {/* Category Filter Section */}
      <section className="bg-white p-4 rounded-lg shadow-sm">
        <div className="container">
          <div className="text-2xl font-semibold">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? "bg-brand-purple text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {blogLang.categories.all}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.slug
                    ? "bg-brand-purple text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container">
          {loading ? (
            <>
              {/* Skeleton for category filter */}
              <div className="flex gap-2 mb-8 animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-20 bg-gray-200 rounded" />
                <div className="h-8 w-28 bg-gray-200 rounded" />
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </div>
              {/* Skeleton for blog cards grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(articlesPerPage)].map((_, idx) => (
                  <div
                    key={idx}
                    className="blog-card shadow-md bg-white rounded-lg overflow-hidden"
                  >
                    <div className="relative overflow-hidden h-48 bg-gray-200 animate-pulse" />
                    <div className="p-5">
                      <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-3" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">{blogLang.categories.noArticles}</h2>
              <button
                onClick={() => handleCategoryClick("all")}
                className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90 transition-colors"
              >
                {blogLang.categories.viewAll}
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
              >
                {articles.map((article, index) => {
                  // Cycle through colors for consistency
                  const colorIndex = index % 3;
                  const colorClass =
                    colorIndex === 0
                      ? "bg-brand-purple"
                      : colorIndex === 1
                        ? "bg-brand-magenta"
                        : "bg-brand-cyan";

                  return (
                    <div
                      key={article.id}
                      className="blog-card shadow-md bg-white rounded-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative overflow-hidden h-48">
                        <Link to={`/blog/${article.slug}`}>
                          <img
                            src={getStrapiMediaUrl(article.cover?.url)}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div
                          className={`absolute top-3 left-3 ${colorClass} text-white text-xs px-2 py-1 rounded-md`}
                        >
                          {isFa
                            ? moment(article.publishedAt).format("jYYYY/jMM/jDD")
                            : new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold mb-2 transition-colors line-clamp-2">
                          <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{article.summary}</p>
                        <div className={isFa ? "flex justify-end" : "flex justify-start"}>
                          <Link
                            to={`/blog/${article.slug}`}
                            className={`text-${colorIndex === 0 ? "brand-purple" : colorIndex === 1 ? "brand-magenta" : "brand-cyan"} font-medium text-sm flex items-center`}
                          >
                            {blogLang.post.readMore}
                            {isFa ? (
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
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            )}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shadcn/UI Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          className={
                            currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                          }
                          aria-disabled={currentPage === 1}
                        />
                      </PaginationItem>

                      {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === "..." ? (
                            <span className="flex h-9 w-9 items-center justify-center">...</span>
                          ) : (
                            <PaginationLink
                              onClick={() => typeof page === "number" && setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                          aria-disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default Blog;
