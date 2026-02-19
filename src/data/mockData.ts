export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: "UPI" | "Card" | "NetBanking" | "Wallet" | "Loan";
  merchant: string;
  location: string;
  device: string;
  timestamp: string;
  fraudScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  status: "approved" | "flagged" | "blocked";
  riskFactors: string[];
}

export interface UserBehavior {
  userId: string;
  userName: string;
  avgSpending: number;
  typicalTime: string;
  commonLocation: string;
  usualDevice: string;
  txFrequency: number;
  riskProfile: "low" | "medium" | "high";
  anomalyCount: number;
  lastActive: string;
}

export interface Alert {
  id: string;
  transactionId: string;
  severity: "warning" | "danger" | "critical";
  message: string;
  reason: string;
  timestamp: string;
  resolved: boolean;
}

export const sampleTransactions: Transaction[] = [
  {
    id: "TXN-001",
    userId: "USR-101",
    userName: "Rahul Sharma",
    amount: 250,
    type: "UPI",
    merchant: "Swiggy",
    location: "Mumbai, India",
    device: "iPhone 14",
    timestamp: "2026-02-19T10:30:00",
    fraudScore: 8,
    riskLevel: "low",
    status: "approved",
    riskFactors: [],
  },
  {
    id: "TXN-002",
    userId: "USR-102",
    userName: "Priya Patel",
    amount: 15000,
    type: "Card",
    merchant: "Amazon",
    location: "Delhi, India",
    device: "Samsung Galaxy S23",
    timestamp: "2026-02-19T11:15:00",
    fraudScore: 22,
    riskLevel: "low",
    status: "approved",
    riskFactors: [],
  },
  {
    id: "TXN-003",
    userId: "USR-103",
    userName: "Amit Kumar",
    amount: 85000,
    type: "NetBanking",
    merchant: "Unknown Merchant",
    location: "Lagos, Nigeria",
    device: "Unknown Device",
    timestamp: "2026-02-19T02:45:00",
    fraudScore: 92,
    riskLevel: "critical",
    status: "blocked",
    riskFactors: [
      "Transaction from unfamiliar foreign location",
      "Unknown device detected",
      "Unusual transaction time (2:45 AM)",
      "Amount 15x higher than average spending",
    ],
  },
  {
    id: "TXN-004",
    userId: "USR-104",
    userName: "Sneha Reddy",
    amount: 4500,
    type: "Wallet",
    merchant: "PhonePe Merchant",
    location: "Hyderabad, India",
    device: "OnePlus 11",
    timestamp: "2026-02-19T14:20:00",
    fraudScore: 35,
    riskLevel: "medium",
    status: "flagged",
    riskFactors: [
      "Transaction amount slightly above average",
      "New merchant interaction",
    ],
  },
  {
    id: "TXN-005",
    userId: "USR-105",
    userName: "Vikram Singh",
    amount: 125000,
    type: "Loan",
    merchant: "QuickLoan App",
    location: "Jaipur, India",
    device: "Redmi Note 12",
    timestamp: "2026-02-19T03:10:00",
    fraudScore: 78,
    riskLevel: "high",
    status: "flagged",
    riskFactors: [
      "Loan application at unusual hour",
      "High amount for first-time loan",
      "Rapid successive applications detected",
    ],
  },
  {
    id: "TXN-006",
    userId: "USR-101",
    userName: "Rahul Sharma",
    amount: 320,
    type: "UPI",
    merchant: "Zomato",
    location: "Mumbai, India",
    device: "iPhone 14",
    timestamp: "2026-02-19T13:00:00",
    fraudScore: 5,
    riskLevel: "low",
    status: "approved",
    riskFactors: [],
  },
  {
    id: "TXN-007",
    userId: "USR-106",
    userName: "Deepak Joshi",
    amount: 49999,
    type: "NetBanking",
    merchant: "Crypto Exchange",
    location: "Pune, India",
    device: "MacBook Pro",
    timestamp: "2026-02-19T23:55:00",
    fraudScore: 65,
    riskLevel: "high",
    status: "flagged",
    riskFactors: [
      "High-risk merchant category (Crypto)",
      "Transaction near daily limit",
      "Late night transaction",
    ],
  },
  {
    id: "TXN-008",
    userId: "USR-107",
    userName: "Meera Nair",
    amount: 1200,
    type: "Card",
    merchant: "Flipkart",
    location: "Bangalore, India",
    device: "iPhone 15 Pro",
    timestamp: "2026-02-19T16:40:00",
    fraudScore: 12,
    riskLevel: "low",
    status: "approved",
    riskFactors: [],
  },
  {
    id: "TXN-009",
    userId: "USR-108",
    userName: "Rajesh Gupta",
    amount: 200000,
    type: "NetBanking",
    merchant: "Foreign Transfer",
    location: "Dubai, UAE",
    device: "Windows PC",
    timestamp: "2026-02-19T01:20:00",
    fraudScore: 88,
    riskLevel: "critical",
    status: "blocked",
    riskFactors: [
      "International transfer from new location",
      "Amount exceeds typical behavior by 20x",
      "Login from new device and IP",
      "Transaction at 1:20 AM",
    ],
  },
  {
    id: "TXN-010",
    userId: "USR-109",
    userName: "Anita Desai",
    amount: 750,
    type: "UPI",
    merchant: "BigBasket",
    location: "Chennai, India",
    device: "Pixel 8",
    timestamp: "2026-02-19T09:15:00",
    fraudScore: 3,
    riskLevel: "low",
    status: "approved",
    riskFactors: [],
  },
];

export const sampleBehaviors: UserBehavior[] = [
  {
    userId: "USR-101",
    userName: "Rahul Sharma",
    avgSpending: 500,
    typicalTime: "9 AM - 10 PM",
    commonLocation: "Mumbai, India",
    usualDevice: "iPhone 14",
    txFrequency: 8,
    riskProfile: "low",
    anomalyCount: 0,
    lastActive: "2026-02-19T13:00:00",
  },
  {
    userId: "USR-103",
    userName: "Amit Kumar",
    avgSpending: 5500,
    typicalTime: "10 AM - 8 PM",
    commonLocation: "Delhi, India",
    usualDevice: "Samsung Galaxy S22",
    txFrequency: 5,
    riskProfile: "high",
    anomalyCount: 4,
    lastActive: "2026-02-19T02:45:00",
  },
  {
    userId: "USR-105",
    userName: "Vikram Singh",
    avgSpending: 3000,
    typicalTime: "8 AM - 9 PM",
    commonLocation: "Jaipur, India",
    usualDevice: "Redmi Note 12",
    txFrequency: 3,
    riskProfile: "high",
    anomalyCount: 3,
    lastActive: "2026-02-19T03:10:00",
  },
  {
    userId: "USR-108",
    userName: "Rajesh Gupta",
    avgSpending: 10000,
    typicalTime: "10 AM - 6 PM",
    commonLocation: "Bangalore, India",
    usualDevice: "MacBook Air",
    txFrequency: 4,
    riskProfile: "high",
    anomalyCount: 5,
    lastActive: "2026-02-19T01:20:00",
  },
  {
    userId: "USR-102",
    userName: "Priya Patel",
    avgSpending: 8000,
    typicalTime: "11 AM - 11 PM",
    commonLocation: "Delhi, India",
    usualDevice: "Samsung Galaxy S23",
    txFrequency: 6,
    riskProfile: "low",
    anomalyCount: 0,
    lastActive: "2026-02-19T11:15:00",
  },
];

export const sampleAlerts: Alert[] = [
  {
    id: "ALT-001",
    transactionId: "TXN-003",
    severity: "critical",
    message: "Suspicious international transaction blocked",
    reason: "Transaction from Lagos, Nigeria using unknown device at 2:45 AM. Amount ₹85,000 is 15x higher than user's average.",
    timestamp: "2026-02-19T02:45:00",
    resolved: false,
  },
  {
    id: "ALT-002",
    transactionId: "TXN-009",
    severity: "critical",
    message: "High-value foreign transfer blocked",
    reason: "₹2,00,000 transfer to Dubai from new device/IP at 1:20 AM. Amount 20x above normal behavior.",
    timestamp: "2026-02-19T01:20:00",
    resolved: false,
  },
  {
    id: "ALT-003",
    transactionId: "TXN-005",
    severity: "danger",
    message: "Suspicious loan application flagged",
    reason: "First-time loan of ₹1,25,000 submitted at 3:10 AM with rapid successive applications.",
    timestamp: "2026-02-19T03:10:00",
    resolved: false,
  },
  {
    id: "ALT-004",
    transactionId: "TXN-007",
    severity: "danger",
    message: "High-risk crypto transaction flagged",
    reason: "₹49,999 transfer to crypto exchange near daily limit at 11:55 PM.",
    timestamp: "2026-02-19T23:55:00",
    resolved: false,
  },
  {
    id: "ALT-005",
    transactionId: "TXN-004",
    severity: "warning",
    message: "Unusual spending pattern detected",
    reason: "Transaction slightly above average with new merchant.",
    timestamp: "2026-02-19T14:20:00",
    resolved: true,
  },
];

export const realWorldCases = [
  {
    title: "UPI Phishing Attack",
    description: "Fraudster sends a fake UPI payment request disguised as a refund. The victim approves the request, unknowingly transferring money to the scammer.",
    how: "Victim receives an SMS or WhatsApp message claiming a refund is pending. A UPI collect request is sent. When approved, money is debited instead of credited.",
    detection: "System detects unusual collect request patterns, flags requests from unknown VPAs, and alerts when the user approves requests they didn't initiate.",
    impact: "₹5,000 - ₹50,000 per victim",
    frequency: "Very High",
    icon: "smartphone",
  },
  {
    title: "OTP Interception Fraud",
    description: "Attackers trick users into sharing OTPs via social engineering, then use them for unauthorized transactions.",
    how: "Scammer calls pretending to be bank support, creates urgency about account security, and asks for OTP. With the OTP, they complete unauthorized transfers.",
    detection: "ML model detects rapid transaction attempts following OTP generation, flags transactions from devices that don't match the user's profile.",
    impact: "₹10,000 - ₹5,00,000 per incident",
    frequency: "High",
    icon: "key",
  },
  {
    title: "Fake Loan App Scam",
    description: "Fraudulent apps offer instant loans but charge hidden fees, exorbitant interest, or steal personal data for identity theft.",
    how: "Victim downloads a loan app, submits personal documents (Aadhaar, PAN). App either charges upfront fees for loans never disbursed, or uses data for identity theft.",
    detection: "System flags rapid loan applications across multiple platforms, detects unusual data access patterns, and identifies known fraudulent merchant IDs.",
    impact: "₹25,000 - ₹10,00,000 per victim",
    frequency: "Medium-High",
    icon: "file-warning",
  },
  {
    title: "Account Takeover via SIM Swap",
    description: "Fraudster duplicates the victim's SIM card to intercept banking OTPs and gain full account access.",
    how: "Attacker uses fake ID to get a duplicate SIM from the telecom provider. Original SIM is deactivated. All OTPs now go to the attacker's phone.",
    detection: "Behavioral module detects sudden device change, new IMEI, and transaction attempts from unfamiliar location immediately after SIM change.",
    impact: "Complete account compromise",
    frequency: "Medium",
    icon: "shield-alert",
  },
  {
    title: "Merchant Identity Fraud",
    description: "Fake merchants create accounts on payment platforms to process fraudulent transactions and launder money.",
    how: "Scammer creates merchant accounts with stolen business credentials, processes fake transactions to extract funds, then disappears.",
    detection: "System analyzes merchant transaction patterns, flags unusual volumes for new merchants, and detects velocity anomalies in fund flows.",
    impact: "₹1,00,000 - ₹50,00,000 per ring",
    frequency: "Medium",
    icon: "store",
  },
];
