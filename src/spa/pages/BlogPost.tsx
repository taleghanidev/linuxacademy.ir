"use client";

import { ArrowDown } from "lucide-react";
import moment from "moment-jalaali";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import NavBar from "@/components/NavBar";
import { getArticleBySlug } from "@/config/content";
import navBarEn from "@/language/en/components/navBar";
import blogPostPageEn from "@/language/en/pages/blogPost";
import navBarFa from "@/language/fa/components/navBar";
import blogPostPageFa from "@/language/fa/pages/blogPost";
import { Link, useParams } from "@/lib/router";
import { getStrapiMediaUrl } from "@/lib/utils";

const BlogPost = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState(null);

  const blogPostLang = document.documentElement.dir === "rtl" ? blogPostPageFa : blogPostPageEn;
  const isJalali = document.documentElement.dir === "rtl";

  useEffect(() => {
    // Articles are static now (no Strapi).
    const found = getArticleBySlug(String(slug));
    setArticle(found as any);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar lang={document.documentElement.dir === "rtl" ? navBarFa : navBarEn} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full text-center border border-gray-200 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-6" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
          </div>
        </div>
      </div>
    );
  if (error) return <div>{blogPostLang.error}</div>;
  if (!article)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar lang={document.documentElement.dir === "rtl" ? navBarFa : navBarEn} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-lg w-full text-center border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-brand-purple">
              {blogPostLang.unavailableContent.split("\n")[0]}
            </h2>
            <p className="mb-2 text-gray-700 whitespace-pre-line">
              {blogPostLang.unavailableContent.split("\n").slice(1).join("\n")}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                to="/"
                className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90 transition-colors"
              >
                {document.documentElement.dir === "rtl" ? "صفحه نخست" : "Home Page"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );

  // Function to render each block type
  function renderBlock(block) {
    if (block.__component === "shared.rich-text") {
      if (typeof block.body !== "string") return null;
      return (
        <div key={block.id} className="prose max-w-none my-6">
          <ReactMarkdown>{block.body}</ReactMarkdown>
        </div>
      );
    }
    if (block.__component === "shared.media" && block.file && block.file.url) {
      return (
        <div key={block.id} className="my-6">
          <img
            src={getStrapiMediaUrl(block.file.url)}
            alt={block.file.alternativeText || ""}
            className="w-full rounded-lg"
          />
        </div>
      );
    }
    if (block.__component === "shared.quote") {
      return (
        <blockquote key={block.id} className="border-l-4 border-brand-purple pl-4 italic my-6">
          <div className="font-bold">{block.title}</div>
          <div>{block.body}</div>
        </blockquote>
      );
    }
    if (
      block.__component === "shared.slider" &&
      Array.isArray(block.files) &&
      block.files.length > 0
    ) {
      return (
        <div key={block.id} className="my-6 flex gap-4 overflow-x-auto">
          {block.files.map((file, idx) =>
            file?.url ? (
              <img
                key={file.url + idx}
                src={getStrapiMediaUrl(file.url)}
                alt={file.alternativeText || ""}
                className="h-48 rounded-lg"
                style={{ minWidth: 200 }}
              />
            ) : null,
          )}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar lang={document.documentElement.dir === "rtl" ? navBarFa : navBarEn} />

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blogs link */}
          <div className="mb-6">
            <Link to="/blog" className="inline-flex items-center text-brand-purple hover:underline">
              {document.documentElement.dir === "rtl" ? (
                <ArrowDown className="h-4 w-4 ml-1 transform -rotate-90" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1 transform rotate-90" />
              )}
              {blogPostLang.backToAll}
            </Link>
          </div>

          {/* Blog Content */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md mb-12">
            <div className="h-80 overflow-hidden">
              {article.cover && (article.cover.url || article.cover.formats) && (
                <img
                  src={getStrapiMediaUrl(
                    article.cover.formats?.large?.url ||
                      article.cover.formats?.medium?.url ||
                      article.cover.formats?.small?.url ||
                      article.cover.url,
                  )}
                  alt={article.cover.alternativeText || article.cover.name || article.title}
                  className="w-full h-80 object-cover rounded-lg mb-6"
                />
              )}
            </div>

            <div className="p-8">
              <div className="flex items-center mb-4">
                <span className="text-sm text-brand-purple font-medium">
                  {article.publishedAt
                    ? isJalali
                      ? moment(article.publishedAt).format("jYYYY/jMM/jDD")
                      : new Date(article.publishedAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
              <div className="prose max-w-none">
                {Array.isArray(article.blocks) && article.blocks.length > 0
                  ? article.blocks.map(renderBlock)
                  : article.description}
              </div>
            </div>
          </div>

          {/* Summary Call to Action */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold mb-2">{blogPostLang.cta.title}</h3>
                <p className="text-gray-600">{blogPostLang.cta.desc}</p>
              </div>
              <div className="md:w-1/3 mt-4 md:mt-0 flex justify-start md:justify-end">
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90 transition-colors"
                >
                  {blogPostLang.cta.bookNow}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
