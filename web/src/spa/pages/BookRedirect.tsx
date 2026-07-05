"use client";

import { Navigate } from "@/lib/router";

const BookRedirect = () => {
  // Redirect to homepage and trigger scroll to booking-form-container
  return <Navigate to="/" replace state={{ scrollTo: "booking-form-container" }} />;
};

export default BookRedirect;
