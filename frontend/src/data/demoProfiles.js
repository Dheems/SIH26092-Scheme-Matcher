export const DEMO_PERSONAS = [
  {
    id: "ravi",
    label: "Ravi Kumar (OBC, Food Processing, Maharashtra)",
    badge: "Recommended for Judges",
    description: "Rural micro-unit seeking ₹5,00,000 equipment subsidy for food processing.",
    profile: {
      name: "Ravi Kumar",
      age: 32,
      gender: "Male",
      state: "Maharashtra",
      district: "Nashik",
      social_category: "OBC",
      annual_income: 320000,
      business_name: "Kisan Agro Foods",
      business_type: "Food Processing",
      location: "Rural",
      business_age: 2,
      employees: 4,
      annual_turnover: 650000,
      is_new_business: false,
      funding_required: 500000,
      funding_purpose: "Equipment Purchase",
      documents_available: ["Income Certificate", "Udyam Registration", "Caste Certificate"]
    },
    demoFiles: [
      { name: "Income_Certificate_Nashik.pdf", type: "Income Proof", status: "Verified" },
      { name: "Udyam_MH20_KisanAgro.pdf", type: "MSME Registration", status: "Verified" },
      { name: "Caste_Certificate_OBC.pdf", type: "Category Certificate", status: "Verified" }
    ]
  },
  {
    id: "sunita",
    label: "Sunita Devi (SC, Handicrafts, Bihar)",
    badge: "Women Artisan Persona",
    description: "Rural woman artisan requiring ₹2,00,000 working capital for handloom cluster.",
    profile: {
      name: "Sunita Devi",
      age: 38,
      gender: "Female",
      state: "Bihar",
      district: "Madhubani",
      social_category: "SC",
      annual_income: 180000,
      business_name: "Mithila Handloom & Crafts",
      business_type: "Handicrafts",
      location: "Rural",
      business_age: 3,
      employees: 5,
      annual_turnover: 380000,
      is_new_business: false,
      funding_required: 200000,
      funding_purpose: "Working Capital",
      documents_available: ["Artisan Pehchan Card", "Caste Certificate", "Bank Passbook"]
    },
    demoFiles: [
      { name: "Pehchan_Artisan_Card.pdf", type: "Craftsperson ID", status: "Verified" },
      { name: "SC_Certificate_Bihar.pdf", type: "Category Certificate", status: "Verified" },
      { name: "SHG_Bank_Passbook.pdf", type: "Bank Record", status: "Verified" }
    ]
  }
];

export const INDIAN_STATES = [
  "All",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

export const BUSINESS_TYPES = [
  "Food Processing",
  "Handicrafts",
  "Agriculture",
  "Manufacturing",
  "Services",
  "Retail",
  "Textile",
  "Technology",
  "Other"
];

export const SOCIAL_CATEGORIES = [
  "OBC",
  "SC",
  "ST",
  "Women",
  "Minority",
  "General"
];

export const FUNDING_PURPOSES = [
  "Equipment Purchase",
  "Working Capital",
  "Business Expansion",
  "Startup Capital",
  "Training & Toolkits",
  "Infrastructure Setup",
  "Marketing & Packaging"
];
