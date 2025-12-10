import { energyIcon, vaultIcon } from "../base/SVG";
import placeholder from "@/assets/images/placeholder.png";
import avatar1 from "@/assets/images/avatars/3.png";
import avatar2 from "@/assets/images/avatars/4.png";
import avatar3 from "@/assets/images/avatars/2.png";
import avatar4 from "@/assets/images/avatars/5.png";
import avatar5 from "@/assets/images/avatars/6.png";
import image1 from "@/assets/images/trades/1.png";
import image2 from "@/assets/images/trades/2.png";
import image3 from "@/assets/images/trades/3.png";
import image4 from "@/assets/images/trades/4.png";
import avatar from "@/assets/images/success/1.png";
import { globeIcon, shieldIcon, verifiedIcon, uploadIcon, matchIcon, truckIcon } from "@/base/SVG";

// landing page start
export const successList = [
  {
    id: "1",
    title: "Vintage Nikon Camera",
    text: "Professional 35mm SLR camera in pristine condition with original leather case and documentation.",
    price: "325",
    avatar: avatar,
    name: "Michael K.",
    rate: "4.9",
    trades: "(127 trades)",
  },
  {
    id: "2",
    title: "PlayStation 5 Console",
    text: "Like-new PS5 disc edition with DualSense controller an two popular games included.",
    price: "375",
    name: "Sarah L.",
    rate: "5.0",
    trades: "(89 trades)",
  },
  {
    id: "3",
    title: "Vintage Nikon Camera",
    text: "Professional 35mm SLR camera in pristine condition with original leather case and documentation.",
    price: "325",
    avatar: avatar,
    name: "Michael K.",
    rate: "4.9",
    trades: "(127 trades)",
  },
  {
    id: "4",
    title: "PlayStation 5 Console",
    text: "Like-new PS5 disc edition with DualSense controller an two popular games included.",
    price: "375",
    name: "Sarah L.",
    rate: "5.0",
    trades: "(89 trades)",
  },
];
export const workList = [
  {
    id: "1",
    icon: uploadIcon,
    title: "List Your Item",
    text: "Upload photos, add descriptions, and set your value. Choose Quick Trade for speed or Vault Trade for security.",
  },
  {
    id: "2",
    icon: matchIcon,
    title: "Find a Match",
    text: "Share your trade link or browse listings. Connect with traders and review items together before confirming.",
  },
  {
    id: "3",
    icon: truckIcon,
    title: "Ship & Complete",
    text: "Get discounted labels, track shipments, and complete your trade. Vault trades include full escrow protection.",
  },
];
export const trustList = [
  {
    id: "1",
    icon: shieldIcon,
    title: "Secure Escrow",
    text: "Trustap's proven escrow system holds funds safely until both parties confirm delivery and satisfaction.",
  },
  {
    id: "2",
    icon: globeIcon,
    title: "Global Shipping",
    text: "Discounted shipping rates worldwide with full tracking and insurance coverage for every package.",
  },
  {
    id: "3",
    icon: verifiedIcon,
    title: "Verified Community",
    text: "Comprehensive review system and identity verification to ensure you're trading with trusted partners.",
  },
];
// landing page end
export const messageList = [
  {
    id: "1",
    avatar: avatar,
    name: "GolfPro92",
    title: "TaylorMade SIM2 Driver",
    text: "When would be a good time to meet for the tr…",
    date: "5/28/2025",
    message: "2",
    active: false,
  },
  {
    id: "2",
    avatar: avatar2,
    name: "SwingKing",
    title: "Callaway Epic Flash Irons",
    text: "Trade completed successfully!",
    date: "5/27/2025",
    active: false,
  },
];
export const browseList = [
  {
    id: "1",
    link: "/browse/single-item",
    image: placeholder,
    title: "TaylorMade SIM2",
    status: "vault",
    statusIcon: vaultIcon,
    text: "Great condition driver with headcover",
    price: "$225",
    field: "Drivers",
    name: "GolfPro92",
    avatar: placeholder,
    rate: "4.8",
    trades: "(15)",
  },

  {
    id: "2",
    link: "/browse/single-item",
    image: placeholder,
    title: "Scotty Cameron",
    status: "quick",
    statusIcon: energyIcon,
    text: "34 inch putter in excellent condition",
    price: "$265",
    field: "Drivers",
    name: "PuttingKing",
    avatar: placeholder,
    rate: "4.9",
    trades: "(23)",
  },
  {
    id: "3",
    link: "/browse/single-item",
    image: placeholder,
    title: "Ping G425 Iron Set",
    status: "vault",
    statusIcon: vaultIcon,
    text: "5-PW iron set, regular flex",
    price: "$400",
    field: "Irons",
    name: "IronMaster",
    avatar: placeholder,
    rate: "4.7",
    trades: "(8)",
  },
  {
    id: "4",
    link: "/browse/single-item",
    image: placeholder,
    title: "Callaway Mavrik",
    status: "quick",
    statusIcon: energyIcon,
    text: "3 wood in very good condition",
    price: "$150",
    field: "Fairway Woods",
    name: "FairwayFinder",
    avatar: placeholder,
    rate: "4.6",
    trades: "(12)",
  },
  {
    id: "1",
    link: "/browse/single-item",
    image: placeholder,
    title: "TaylorMade SIM2",
    status: "vault",
    statusIcon: vaultIcon,
    text: "Great condition driver with headcover",
    price: "$225",
    field: "Drivers",
    name: "GolfPro92",
    avatar: placeholder,
    rate: "4.8",
    trades: "(15)",
  },

  {
    id: "2",
    link: "/browse/single-item",
    image: placeholder,
    title: "Scotty Cameron",
    status: "quick",
    statusIcon: energyIcon,
    text: "34 inch putter in excellent condition",
    price: "$265",
    field: "Drivers",
    name: "PuttingKing",
    avatar: placeholder,
    rate: "4.9",
    trades: "(23)",
  },
  {
    id: "3",
    link: "/browse/single-item",
    image: placeholder,
    title: "Ping G425 Iron Set",
    status: "vault",
    statusIcon: vaultIcon,
    text: "5-PW iron set, regular flex",
    price: "$400",
    field: "Irons",
    name: "IronMaster",
    avatar: placeholder,
    rate: "4.7",
    trades: "(8)",
  },
  {
    id: "4",
    link: "/browse/single-item",
    image: placeholder,
    title: "Callaway Mavrik",
    status: "quick",
    statusIcon: energyIcon,
    text: "3 wood in very good condition",
    price: "$150",
    field: "Fairway Woods",
    name: "FairwayFinder",
    avatar: placeholder,
    rate: "4.6",
    trades: "(12)",
  },
  {
    id: "1",
    link: "/browse/single-item",
    image: placeholder,
    title: "TaylorMade SIM2",
    status: "vault",
    statusIcon: vaultIcon,
    text: "Great condition driver with headcover",
    price: "$225",
    field: "Drivers",
    name: "GolfPro92",
    avatar: placeholder,
    rate: "4.8",
    trades: "(15)",
  },

  {
    id: "2",
    link: "/browse/single-item",
    image: placeholder,
    title: "Scotty Cameron",
    status: "quick",
    statusIcon: energyIcon,
    text: "34 inch putter in excellent condition",
    price: "$265",
    field: "Drivers",
    name: "PuttingKing",
    avatar: placeholder,
    rate: "4.9",
    trades: "(23)",
  },
  {
    id: "3",
    link: "/browse/single-item",
    image: placeholder,
    title: "Ping G425 Iron Set",
    status: "vault",
    statusIcon: vaultIcon,
    text: "5-PW iron set, regular flex",
    price: "$400",
    field: "Irons",
    name: "IronMaster",
    avatar: placeholder,
    rate: "4.7",
    trades: "(8)",
  },
  {
    id: "4",
    link: "/browse/single-item",
    image: placeholder,
    title: "Callaway Mavrik",
    status: "quick",
    statusIcon: energyIcon,
    text: "3 wood in very good condition",
    price: "$150",
    field: "Fairway Woods",
    name: "FairwayFinder",
    avatar: placeholder,
    rate: "4.6",
    trades: "(12)",
  },
];
export const mainList = [
  {
    id: "1",
    title: "Quick Bag Swap",
    type: "quick",
    status: "pending",
    date: "May 6, 2025",
    avatar: avatar1,
    partner: "GolfGear365",
    card: [
      {
        id: "1",
        image: image1,
        title: "Your Item",
        name: "Sun Mountain 4.5 LS Stand Bag (Navy)",
        price: "$150",
      },
      {
        id: "2",
        image: image2,
        title: "Their Item",
        name: "Titleist T200 Irons Set (5-PW)",
        price: "$550",
      },
    ],
  },
  {
    id: "2",
    title: "Irons Trade",
    type: "vault",
    status: "transit",
    date: "May 3, 2025",
    avatar: avatar2,
    partner: "IronMaster42",
    card: [
      {
        id: "1",
        image: image1,
        title: "Your Item",
        name: "Callaway Mavrik Irons Set (5-PW)",
        price: "$520",
        add: "+$30 Cash Added",
      },
      {
        id: "2",
        image: image2,
        title: "Their Item",
        name: "Titleist T200 Irons Set (5-PW)",
        price: "$550",
      },
    ],
  },
  {
    id: "3",
    title: "Driver for Putter Swap",
    type: "vault",
    status: "completed",
    date: "May 1, 2025",
    avatar: avatar3,
    partner: "GolfSwapper92",
    card: [
      {
        id: "1",
        image: image3,
        title: "Your Item",
        name: "TaylorMade SIM2 Driver",
        price: "$265",
      },
      {
        id: "2",
        image: image4,
        title: "Their Item",
        name: "Scotty Cameron Special Select Putter",
        price: "$265",
      },
    ],
  },
  {
    id: "4",
    title: "Wedge Collection",
    type: "vault",
    status: "delivered",
    date: "Apr 28, 2025",
    avatar: avatar4,
    partner: "ShortGame99",
    card: [
      {
        id: "1",
        image: image3,
        title: "Your Item",
        name: "Vokey SM9 Wedges (52, 56, 60)",
        price: "$380",
      },
      {
        id: "2",
        image: image4,
        title: "Their Item",
        name: "Cleveland RTX ZipCore Wedges (52, 56, 60)",
        price: "$360",
        add: "+$30 Cash Added",
      },
    ],
  },
  {
    id: "5",
    title: "Rangefinder",
    type: "quick",
    status: "dispute",
    date: "Apr 15, 2025",
    avatar: avatar5,
    partner: "RangeFinder101",
    card: [
      {
        id: "1",
        image: image1,
        title: "Your Item",
        name: "Bushnell Tour V5 Shift Rangefinder",
        price: "$300",
      },
      {
        id: "2",
        image: image2,
        title: "Their Item",
        name: "Garmin Approach Z82 Rangefinder",
        price: "$300",
      },
    ],
  },
];
// selects modul start
export const categoryList = [
  {
    id: "1",
    value: "All Categories",
  },
  {
    id: "2",
    value: "Category 1",
  },
  {
    id: "3",
    value: "Category 2",
  },
  {
    id: "4",
    value: "Category 3",
  },
];
export const dateList = [
  {
    id: "1",
    value: "Recently Added",
  },
  {
    id: "2",
    value: "Yesterday",
  },
  {
    id: "3",
    value: "Today",
  },
];
export const typeList = [
  {
    id: "1",
    value: "All Types",
  },
  {
    id: "2",
    value: "Type 1",
  },
  {
    id: "3",
    value: "Type 2",
  },
];
export const statusList = [
  {
    id: "1",
    value: "All Statuses",
  },
  {
    id: "2",
    value: "In Progress",
  },
  {
    id: "3",
    value: "Pending",
  },
  {
    id: "4",
    value: "Done",
  },
];
export const moreList = [
  {
    id: "1",
    value: "Newest First",
  },
  {
    id: "2",
    value: "Oldest First",
  },
];
export const countryList = [
  {
    id: "1",
    value: "United States",
  },
  {
    id: "2",
    value: "Germany",
  },
  {
    id: "3",
    value: "Spain",
  },
];
export const carrierList = [
  {
    id: "1",
    value: "Manager",
  },
  {
    id: "2",
    value: "Developer",
  },
  {
    id: "3",
    value: "Doctor",
  },
  {
    id: "4",
    value: "Dentist",
  },
];
// selects modul end
