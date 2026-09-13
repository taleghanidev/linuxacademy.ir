const courseRegisterEn = {
  eyebrow: "Registration",
  title: "Register for the course",
  intro:
    "Registration takes three steps: transfer the fee to the account below, upload a picture of the receipt here, and we confirm your seat once we have checked it.",
  feeLabel: "Course fee",

  region: {
    heading: "Where are you based?",
    note: "This sets your fee and the account you pay into.",
    iran: "Inside Iran",
    international: "Outside Iran",
    warning:
      "Given the situation in Iran at the moment, the Toman price is offered to people living there. If you are outside Iran, the fee is payable in Australian dollars.",
  },

  steps: {
    heading: "Three steps",
    items: [
      {
        title: "Transfer the fee",
        desc: "Send the course fee to the account shown at the bottom of this section.",
      },
      {
        title: "Upload the receipt",
        desc: "Fill in the form and attach a photo or file of your payment receipt.",
      },
      { title: "Seat confirmed", desc: "We check the receipt and let you know by phone or email." },
    ],
  },

  pay: {
    heading: "Ways to pay",
    note: "Wise or Revolut is easiest. Scan the code, or tap the button.",
    wise: "Pay with Wise",
    revolut: "Pay with Revolut",
    scan: "Scan with your phone",
    orBank: "Or a plain bank transfer:",
  },

  bank: {
    heading: "Account details",
    note: "Please transfer the exact amount to this account and keep your receipt.",
    bankName: "Bank",
    accountHolder: "Account holder",
    cardNumber: "Card number",
    iban: "IBAN",
    accountNumber: "Account number",
    bsb: "BSB",
    swift: "SWIFT code",
    copy: "Copy",
    copied: "Copied",
  },

  form: {
    heading: "Registration form",
    fullName: "Full name",
    fullNamePlaceholder: "Your full name",
    email: "Email (optional)",
    emailPlaceholder: "you@example.com",
    countryCode: "Country code",
    phone: "Phone",
    phonePlaceholder: "9123456789",
    note: "Anything else (optional)",
    notePlaceholder: "If there is something we should know, write it here.",
    receipt: "Payment receipt",
    receiptHint: "JPG, PNG, WEBP or PDF, up to 8 MB",
    receiptChoose: "Choose a file",
    receiptChange: "Change file",
    submit: "Submit registration",
    submitting: "Sending…",
  },

  success: {
    heading: "We have your registration",
    body: "We will check your receipt and contact you with the result. If you have not heard from us within two working days, get in touch through the contact page.",
    another: "Send another registration",
    backToCourse: "Back to the course page",
  },

  errors: {
    name_too_short: "Please enter your full name.",
    invalid_email: "That email address is not valid.",
    invalid_phone: "That phone number is not valid.",
    receipt_required: "A picture of the receipt is required.",
    receipt_too_large: "That file is larger than 8 MB.",
    receipt_bad_type: "Only images (JPG, PNG, WEBP) or PDF are accepted.",
    rate_limited: "Too many attempts. Please try again shortly.",
    storage_unavailable: "File upload is unavailable right now. Please try again later.",
    upload_failed: "The receipt could not be uploaded. Please try again.",
    unknown_course: "That course is not valid.",
    generic: "Something went wrong. Please try again.",
  },

  backToCourse: "Back to the course page",
};

export default courseRegisterEn;
