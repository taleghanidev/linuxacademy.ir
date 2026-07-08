"use client";

import { ArrowDown, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import PageShell, { useIsFa } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { tierText } from "@/config/catalog";
import { SPONSORSHIP_TIERS } from "@/config/products";
import navBarEn from "@/language/en/components/navBar";
import sponsorshipEn from "@/language/en/pages/sponsorship";
import navBarFa from "@/language/fa/components/navBar";
import sponsorshipFa from "@/language/fa/pages/sponsorship";
import { useCart } from "@/lib/cart";
import { Link, useNavigate } from "@/lib/router";
import { getStrapiMediaUrl } from "@/lib/utils";

interface SponsorProduct {
  id: number;
  documentId: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const Sponsorship = () => {
  const [products, setProducts] = useState<SponsorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, _setError] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [totals, setTotals] = useState<Record<number, number>>({});
  const navigate = useNavigate();
  const { addItem } = useCart();

  const isFa = useIsFa();
  const lang = isFa ? sponsorshipFa : sponsorshipEn;

  useEffect(() => {
    // Sponsorship tiers are static now (no Strapi). See src/config/products.ts.
    const tierImages = ["/images/consult.webp", "/images/architect.webp", "/images/implement.webp"];
    const data: SponsorProduct[] = SPONSORSHIP_TIERS.map((tier, idx) => {
      const text = tierText(tier.key);
      return {
        id: idx + 1,
        documentId: tier.key,
        name: text.title,
        description: text.description,
        price: tier.price,
        image: tierImages[idx % tierImages.length],
      };
    });
    setProducts(data);
    const initialQuantities: Record<number, number> = {};
    const initialTotals: Record<number, number> = {};
    data.forEach((product) => {
      initialQuantities[product.id] = 1;
      initialTotals[product.id] = product.price;
    });
    setQuantities(initialQuantities);
    setTotals(initialTotals);
    setLoading(false);
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price: number) => {
    const currency = isFa ? "تومان" : "T";
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${currency}`;
  };

  const handleQuantityChange = (productId: number, value: number) => {
    if (value < 1) return;

    // Update quantity
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));

    // Find the product and calculate the total
    const product = products.find((p) => p.id === productId);
    if (product) {
      const total = product.price * value;
      setTotals((prev) => ({
        ...prev,
        [productId]: total,
      }));
    }
  };

  const addToCart = (product: SponsorProduct) => {
    addItem({
      type: "sponsorship",
      itemKey: product.documentId, // tier key
      label: product.name,
      unitPrice: product.price,
      quantity: quantities[product.id] || 1,
      minQuantity: 1,
      meta: {},
    });
  };

  const _handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    addToCart(product);
    toast.success(`${product.name} × ${quantities[productId] || 1}`, {
      description: formatPrice(totals[productId]),
    });
  };

  const handleBuyNow = (product: SponsorProduct) => {
    addToCart(product);
    navigate("/cart");
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
    <PageShell>
      {/* Hero section */}
      <div className="max-w-4xl mx-auto mb-12 md:mb-16 text-center px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">{lang.hero.title}</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{lang.hero.description}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full md:w-auto">
          <a
            href="#products"
            className="w-full sm:w-auto px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90 transition-colors"
          >
            {lang.hero.viewOpportunities}
          </a>
        </div>
      </div>

      {/* Advantages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 mb-12 md:mb-16 px-4 md:px-0">
        {lang.advantages.map((adv: any, idx: number) => (
          <div
            key={idx}
            className="p-5 md:p-6 bg-white rounded-lg shadow-sm border border-gray-100 transform transition-transform hover:scale-[1.02]"
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full mb-4 ${idx === 0 ? "bg-brand-purple/10" : idx === 1 ? "bg-brand-magenta/10" : "bg-brand-cyan/10"}`}
            >
              {idx === 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-brand-purple"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              )}
              {idx === 1 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-brand-magenta"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              )}
              {idx === 2 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-brand-cyan"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
              )}
            </div>
            <h3 className="text-lg font-medium mb-2">{adv.title}</h3>
            <p className="text-gray-600">{adv.desc}</p>
          </div>
        ))}
      </div>

      {/* Products Section */}
      <div id="products" className="pt-8 px-4 md:px-0">
        <h2 className="text-2xl font-bold mb-6 text-center">{lang.products.title}</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {lang.products.description}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 animate-pulse">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col sm:flex-row h-full"
              >
                <div className="sm:w-2/5 md:w-1/3 relative overflow-hidden">
                  <div className="h-40 bg-gray-200 w-full" />
                </div>
                <div className="sm:w-2/3 md:w-3/4 p-5 md:p-6 flex flex-col justify-between">
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
                    <div className="h-10 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-10 w-32 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="sm:w-2/5 md:w-1/3 relative overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9 sm:aspect-none sm:h-full">
                      <img
                        src={getStrapiMediaUrl(product.image)}
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="sm:w-2/3 md:w-3/4 p-5 md:p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm">{product.description}</p>

                      <div className="mb-4">
                        <div className="block text-sm font-medium text-gray-700 mb-1">
                          {lang.products.quantity}
                        </div>
                        <div
                          className={`flex items-center ${isFa ? "space-x-reverse space-x-3" : "space-x-3"}`}
                        >
                          <Button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(product.id, quantities[product.id] - 1)
                            }
                            className="h-10 w-10 p-0 flex items-center justify-center"
                            disabled={quantities[product.id] <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <div className="flex-1 text-center bg-gray-50 py-2 border rounded-md">
                            {quantities[product.id] || 1}
                          </div>
                          <Button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(product.id, quantities[product.id] + 1)
                            }
                            className="h-10 w-10 p-0 flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                        <p className={`font-bold ${isFa ? "text-left" : "text-right"} w-full`}>
                          {lang.products.total}{" "}
                          <span className="text-brand-purple">
                            {formatPrice(totals[product.id] || product.price)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 mt-4">
                      <Button
                        onClick={() => handleBuyNow(product)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-brand-magenta text-white rounded-md hover:bg-brand-magenta/90 transition-colors"
                      >
                        {lang.products.buyNow}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="mt-12 md:mt-16 bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 mx-4 md:mx-0">
        <h3 className="text-xl font-semibold mb-4">{lang.faq.title}</h3>

        <div className="space-y-6">
          {lang.faq.questions.map((q: any, idx: number) => (
            <div
              key={idx}
              className={`pb-4 ${idx < lang.faq.questions.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <h4 className="font-medium text-lg">{q.q}</h4>
              <p className="text-gray-600 mt-2">{q.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center"></div>
      </div>

      <div className="text-center mt-8">
        <Link to="/" className="inline-flex items-center text-brand-purple hover:underline">
          <ArrowDown
            className={`h-4 w-4 ${isFa ? "ml-1 transform -rotate-90" : "mr-1 transform rotate-90"}`}
          />
          {lang.navigation.returnHome}
        </Link>
      </div>
    </PageShell>
  );
};

export default Sponsorship;
