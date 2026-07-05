"use client";

import { Minus, Plus } from "lucide-react";
import type React from "react";
import { useCallback, useContext, useState } from "react";
import { GlobalContext } from "@/components/GlobalContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { packageText } from "@/config/catalog";
import { getPackage } from "@/config/products";
import bookingFormEn from "@/language/en/components/bookingForm";
import cartEn from "@/language/en/pages/cart";
import bookingFormFa from "@/language/fa/components/bookingForm";
import cartFa from "@/language/fa/pages/cart";
import { useCart } from "@/lib/cart";
import { useNavigate } from "@/lib/router";

interface BookingFormLang {
  bookConsultation: string;
  numberOfHours: string;
  briefDescription: string;
  briefDescriptionPlaceholder?: string;
  loading: string;
  hour: string;
  hours: string;
  pleaseDescribe: string;
  priceLabel: string;
  decreaseHours: string;
  increaseHours: string;
  toman: string;
}

interface BookingFormProps {
  lang?: BookingFormLang;
}

const BookingForm = ({ lang }: BookingFormProps) => {
  const { hourlyRate } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { addItem } = useCart();

  const isFa = document.documentElement.dir === "rtl";
  const language = lang || (isFa ? bookingFormFa : bookingFormEn);
  const cart = isFa ? cartFa : cartEn;

  const [hours, setHours] = useState(1);
  const [note, setNote] = useState("");

  const pkg = getPackage("linux-consult");
  const minHours = pkg?.minHours ?? 1;
  const maxHours = pkg?.maxHours ?? 8;

  const amount = useCallback(() => (hourlyRate ? hours * hourlyRate : 0), [hours, hourlyRate]);
  const formatPrice = (price: number) =>
    `${new Intl.NumberFormat("en-US").format(price)} ${language.toman}`;

  const increaseHours = () => setHours((h) => Math.min(maxHours, h + 1));
  const decreaseHours = () => setHours((h) => Math.max(minHours, h - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hourlyRate) return;
    addItem({
      type: "booking",
      itemKey: "linux-consult",
      label: packageText("linux-consult").title,
      unitPrice: hourlyRate,
      quantity: hours,
      minQuantity: minHours,
      maxQuantity: maxHours,
      meta: { note: note || undefined },
    });
    navigate("/cart");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 rounded-lg shadow-md max-w-md w-[100%] mx-auto border border-black hover:border-[#8B5CF6] transition-colors bg-white"
    >
      <h3 className="text-xl font-semibold mb-4">{language.bookConsultation}</h3>

      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">{language.numberOfHours}</div>
        <div className="flex flex-row items-center gap-2">
          <Button
            type="button"
            onClick={decreaseHours}
            className="h-10 w-10 p-0 flex items-center justify-center"
            disabled={hours <= minHours}
            aria-label={language.decreaseHours}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center bg-gray-50 py-2 border rounded-md min-w-[70px]">
            {hours} {hours === 1 ? language.hour : language.hours}
          </div>
          <Button
            type="button"
            onClick={increaseHours}
            className="h-10 w-10 p-0 flex items-center justify-center"
            disabled={hours >= maxHours}
            aria-label={language.increaseHours}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className={`mt-2 text-sm font-medium ${isFa ? "text-left" : "text-right"}`}>
          {language.priceLabel}{" "}
          <span className="text-brand-magenta">
            {hourlyRate ? formatPrice(amount()) : language.loading}
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
          {language.pleaseDescribe}
        </label>
        <Textarea
          id="note"
          placeholder={language.briefDescriptionPlaceholder || language.briefDescription}
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue hover:bg-blue-light transition-colors"
        disabled={!hourlyRate}
      >
        {cart.buttons.addToCart}
      </Button>
    </form>
  );
};

export default BookingForm;
