export interface PropItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  image: string;
  dimensions?: string;
  inStock: boolean;
  tags: string[];
}

export type OrderStatus = "Pending" | "In Transit" | "Delivered" | "Returned";

export interface OrderItem {
  prop: PropItem;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  rentalDurationDays: number;
}

export const CATEGORY_TREE = [
  {
    name: "Room and Garden Decor",
    subcategories: ["Table Top", "Accessories", "Kitchen, Dining, and Tableware"]
  },
  {
    name: "Electronics and Mechanical",
    subcategories: ["Telephones", "Cameras", "Audio Equipment", "Computers"]
  },
  {
    name: "Themed and Curated",
    subcategories: ["Music and Instruments", "Sports and Outdoors", "Industrial, Farm, and Rustic"]
  },
  {
    name: "Furniture",
    subcategories: ["Seating", "Tables", "Storage"]
  }
];

export const MOCK_PROPS: PropItem[] = [
  {
    id: "prop-101",
    title: "Vintage Leather Armchair",
    description: "Authentic 1970s brown leather armchair, perfectly distressed.",
    price: 150,
    category: "Furniture",
    subcategory: "Seating",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80",
    inStock: true,
    tags: ["vintage", "leather", "office"]
  },
  {
    id: "prop-102",
    title: "Classic Rotary Telephone",
    description: "1960s red rotary phone. Does not ring but dial spins perfectly.",
    price: 45,
    category: "Electronics and Mechanical",
    subcategory: "Telephones",
    image: "https://i.ebayimg.com/images/g/aqEAAOSwr6VjddOH/s-l1200.jpg",
    inStock: true,
    tags: ["60s", "telephone", "red"]
  },
  {
    id: "prop-103",
    title: "Amias Wall Clock",
    description: "Retro diner wall clock with sweeping red second hand.",
    price: 60,
    category: "Room and Garden Decor",
    subcategory: "Table Top",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80",
    inStock: true,
    tags: ["clock", "retro", "wall decor"]
  },
  {
    id: "prop-104",
    title: "1980s Arcade Cabinet",
    description: "Functional retro arcade cabinet. Screen turns on.",
    price: 350,
    category: "Electronics and Mechanical",
    subcategory: "Audio Equipment",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    inStock: true,
    tags: ["80s", "arcade", "retro"]
  },
  {
    id: "prop-105",
    title: "Mid-Century Dining Table",
    description: "Walnut dining table seating 6. Sleek mid-century lines.",
    price: 200,
    category: "Furniture",
    subcategory: "Tables",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80",
    inStock: true,
    tags: ["mid-century", "dining", "table"]
  },
  {
    id: "prop-106",
    title: "Martin Clay Sculpture",
    description: "Abstract clay sculpture, great for modern art studio sets.",
    price: 40,
    category: "Room and Garden Decor",
    subcategory: "Accessories",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
    inStock: true,
    tags: ["sculpture", "clay", "art"]
  },
  {
    id: "prop-107",
    title: "Mia Folding Lap Tray",
    description: "Aluminum and pink resin breakfast-in-bed lap tray.",
    price: 60,
    category: "Room and Garden Decor",
    subcategory: "Kitchen, Dining, and Tableware",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo8k-CQN1y3Pb5dDHd7S63JBsjMnXSvnHXUkbidaZK-EGNcL_nnDo9ZBs&s=10",
    inStock: true,
    tags: ["tray", "breakfast", "pink"]
  },
  {
    id: "prop-108",
    title: "Acoustic Guitar",
    description: "Worn acoustic guitar. Playable.",
    price: 85,
    category: "Themed and Curated",
    subcategory: "Music and Instruments",
    image: "https://guitarfactory.net/cdn/shop/collections/Menu-Guitars-Acoustic-004.jpg?v=1711515615",
    inStock: true,
    tags: ["music", "guitar", "instrument"]
  },
  {
    id: "prop-109",
    title: "Vintage Film Camera",
    description: "1950s style press camera with flash bulb attachment.",
    price: 65,
    category: "Electronics and Mechanical",
    subcategory: "Cameras",
    image: "https://images.unsplash.com/photo-1516961642265-531546e84af2?w=800&q=80",
    inStock: false,
    tags: ["photography", "vintage", "camera"]
  },
  {
    id: "prop-110",
    title: "Leather Baseball Glove",
    description: "Worn-in baseball mitt from the 1990s.",
    price: 30,
    category: "Themed and Curated",
    subcategory: "Sports and Outdoors",
    image: "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800&q=80",
    inStock: true,
    tags: ["baseball", "sports", "90s"]
  },
  {
    id: "prop-111",
    title: "Industrial Storage Locker",
    description: "3-door gray metal locker with slight rust patina.",
    price: 110,
    category: "Furniture",
    subcategory: "Storage",
    image: "https://i5.walmartimages.com/seo/Fesbos-Metal-Storage-Locker-Industrial-Storage-Cabinet-Doors-Shelves-Stylish-Sturdy-6-Compartment-Lockable-Doors-Home-Office-School-Club-Bar_6f9930f3-bd6a-48a3-b0be-5e5d63abfb7f.24a5813399f605ec79718d57c2ca1aab.jpeg",
    inStock: true,
    tags: ["locker", "industrial", "school"]
  },
  {
    id: "prop-112",
    title: "Patrick Pen in Resin",
    description: "Gold pen cast in a clear resin block for executive desks.",
    price: 40,
    category: "Room and Garden Decor",
    subcategory: "Table Top",
    image: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1?w=800&q=80",
    inStock: true,
    tags: ["pen", "resin", "desk"]
  },
  {
    id: "prop-113",
    title: "Rustic Pitchfork",
    description: "Wooden handled pitchfork, weathered for farm scenes.",
    price: 25,
    category: "Themed and Curated",
    subcategory: "Industrial, Farm, and Rustic",
    image: "https://i.pinimg.com/474x/5b/30/78/5b3078ec91a5ff0f4d046d889296de16.jpg",
    inStock: true,
    tags: ["farm", "tools", "rustic"]
  },
  {
    id: "prop-114",
    title: "Retro Portable TV",
    description: "1970s yellow portable television with rabbit ears.",
    price: 75,
    category: "Electronics and Mechanical",
    subcategory: "Audio Equipment",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
    inStock: true,
    tags: ["tv", "70s", "yellow"]
  },
  {
    id: "prop-115",
    title: "Coffee Shop Espresso Machine",
    description: "Non-functional chrome espresso machine prop.",
    price: 150,
    category: "Room and Garden Decor",
    subcategory: "Kitchen, Dining, and Tableware",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80",
    inStock: true,
    tags: ["coffee", "cafe", "machine"]
  },
  {
    id: "prop-116",
    title: "IBM ThinkPad 1998",
    description: "Chunky 90s laptop. Powers on to a DOS prompt.",
    price: 90,
    category: "Electronics and Mechanical",
    subcategory: "Computers",
    image: "https://i.redd.it/to207gv0i5i21.jpg",
    inStock: true,
    tags: ["laptop", "90s", "computer"]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "Order #1042",
    date: "2026-08-10",
    status: "Delivered",
    rentalDurationDays: 7,
    total: 395,
    items: [
      { prop: MOCK_PROPS[0], quantity: 1 }, // Armchair (150)
      { prop: MOCK_PROPS[1], quantity: 1 }, // Rotary Phone (45)
      { prop: MOCK_PROPS[4], quantity: 1 }, // Dining Table (200)
    ]
  },
  {
    id: "Order #1048",
    date: "2026-08-13",
    status: "In Transit",
    rentalDurationDays: 14,
    total: 150,
    items: [
      { prop: MOCK_PROPS[14], quantity: 1 }, // Espresso Machine (150)
    ]
  },
  {
    id: "Order #1055",
    date: "2026-08-14",
    status: "Pending",
    rentalDurationDays: 5,
    total: 145,
    items: [
      { prop: MOCK_PROPS[7], quantity: 1 }, // Guitar (85)
      { prop: MOCK_PROPS[2], quantity: 1 }, // Wall clock (60)
    ]
  },
  {
    id: "Order #0988",
    date: "2026-07-20",
    status: "Returned",
    rentalDurationDays: 3,
    total: 350,
    items: [
      { prop: MOCK_PROPS[3], quantity: 1 }, // Arcade (350)
    ]
  }
];
