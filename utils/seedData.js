const PLACEHOLDER = (id) => ({
    public_id: `seed/${id}`,
    url: `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop`,
});

const PLACEHOLDER_IMG = (id) => [
    {
        public_id: `seed/product-${id}`,
        url: `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop`,
    },
];

const users = [
    {
        name: "ShopX Admin",
        email: "admin@shopx.com",
        password: "Admin@123",
        phone: "+91-9876543210",
        address: "100 Commerce Street, Chennai, Tamil Nadu",
        avatar: PLACEHOLDER("1472099645785-5658abf4ff4e"),
        role: "admin",
    },
    {
        name: "John Customer",
        email: "john@shopx.com",
        password: "Customer@123",
        phone: "+91-9876543211",
        address: "42 Oak Avenue, Bangalore, Karnataka",
        avatar: PLACEHOLDER("1507003211169-0a1dd7228f2d"),
        role: "user",
    },
    {
        name: "Sarah Miller",
        email: "sarah@shopx.com",
        password: "Customer@123",
        phone: "+91-9876543212",
        address: "88 Pine Road, Coimbatore, Tamil Nadu",
        avatar: PLACEHOLDER("1494790108377-be9c29b29330"),
        role: "user",
    },
];

const buildProducts = (adminId) => [
    {
        name: "SwiftRun Lite Running Shoes",
        price: 3999,
        description:
            "Lightweight mesh running shoes with cushioned sole. Ideal for daily jogs and gym sessions. Breathable upper, non-slip rubber outsole. Available in sizes 7–12.",
        ratings: 4.5,
        images: PLACEHOLDER_IMG("1542291026-7eec264c27ff"),
        category: "Footwear",
        type: "Men",
        seller: "ShopX Sports",
        stock: 120,
        numOfReviews: 48,
        user: adminId,
    },

    {
        name: "City Sprint Running Shoes",
        price: 3499,
        description:
            "Budget-friendly running shoes for urban runners. Foam midsole absorbs impact on pavement. Reflective strips for night runs. Best value under ₹4,000.",
        ratings: 4.0,
        images: PLACEHOLDER_IMG("1606107557195-0e29a4b5b4aa"),
        category: "Footwear",
        type: "Women",
        seller: "ShopX Sports",
        stock: 200,
        numOfReviews: 67,
        user: adminId,
    },

    {
        name: "Alpine Pro Winter Jacket",
        price: 10999,
        description:
            "Insulated winter jacket with waterproof shell. Return policy: 30-day free returns on unworn items with tags attached. Machine washable on gentle cycle. Not eligible for return if personalized.",
        ratings: 4.7,
        images: PLACEHOLDER_IMG("1551028719-00167b16eac5"),
        category: "Clothing",
        type: "Men",
        seller: "ShopX Outdoors",
        stock: 45,
        numOfReviews: 22,
        user: adminId,
    },

    {
        name: "Urban Windbreaker Jacket",
        price: 6999,
        description:
            "Lightweight windbreaker perfect for spring. Return policy: 30-day returns for store credit. Final sale items marked with a red tag cannot be returned. Exchange available within 14 days.",
        ratings: 4.3,
        images: PLACEHOLDER_IMG("1591047139829-d91aecb6caea"),
        category: "Clothing",
        type: "Women",
        seller: "ShopX Fashion",
        stock: 60,
        numOfReviews: 18,
        user: adminId,
    },

    {
        name: "ProFit Yoga Mat",
        price: 2999,
        description:
            "Non-slip 6mm yoga mat with carrying strap. Eco-friendly TPE material. Ideal for home workouts, pilates, and stretching routines.",
        ratings: 4.6,
        images: PLACEHOLDER_IMG("1545205597-3d9d02c29597"),
        category: "Sports",
        type: "Women",
        seller: "ShopX Sports",
        stock: 150,
        numOfReviews: 89,
        user: adminId,
    },

    {
        name: "Classic Leather Belt",
        price: 2499,
        description:
            "Genuine leather belt with brushed nickel buckle. Fits waist sizes 30–40. A timeless accessory for casual and formal wear.",
        ratings: 4.1,
        images: [
            {
                public_id: "seed/product-leather-belt",
                url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Leather_belt.jpg",
            },
        ],
        category: "Accessories",
        type: "Men",
        seller: "ShopX Accessories",
        stock: 90,
        numOfReviews: 14,
        user: adminId,
    },

    {
        name: "Wireless Sport Earbuds",
        price: 4999,
        description:
            "Sweat-proof Bluetooth earbuds with 8-hour battery. Secure fit for running and workouts. Touch controls and built-in microphone.",
        ratings: 4.4,
        images: PLACEHOLDER_IMG("1590658268037-6bf12165a8df"),
        category: "Accessories",
        type: "Men",
        seller: "ShopX Tech",
        stock: 75,
        numOfReviews: 56,
        user: adminId,
    },

    {
        name: "Kids Explorer Sneakers",
        price: 3799,
        description:
            "Durable kids sneakers with velcro straps. Cushioned insole for all-day comfort. Easy to clean — wipe with damp cloth.",
        ratings: 4.8,
        images: PLACEHOLDER_IMG("1562183241-b937e95585b6"),
        category: "Footwear",
        type: "Kids",
        seller: "ShopX Kids",
        stock: 110,
        numOfReviews: 40,
        user: adminId,
    },

    {
        name: "Organic Face Moisturizer",
        price: 1999,
        description:
            "Hydrating daily moisturizer with SPF 15. Paraben-free, suitable for all skin types. Dermatologist tested.",
        ratings: 4.5,
        images: PLACEHOLDER_IMG("1556228720-195a672e8a03"),
        category: "Beauty/Health",
        type: "Women",
        seller: "ShopX Beauty",
        stock: 200,
        numOfReviews: 103,
        user: adminId,
    },

    {
        name: "Camping Backpack 40L",
        price: 7499,
        description:
            "Water-resistant hiking backpack with rain cover. Multiple compartments, hydration bladder compatible. Perfect for weekend camping trips.",
        ratings: 4.6,
        images: PLACEHOLDER_IMG("1622560480654-d96214fdc887"),
        category: "Outdoor",
        type: "Men",
        seller: "ShopX Outdoors",
        stock: 35,
        numOfReviews: 27,
        user: adminId,
    },

    {
        name: "Summer Floral Dress",
        price: 4499,
        description:
            "Flowy midi dress in breathable cotton blend. Perfect for summer outings. Machine washable. Available in S–XL.",
        ratings: 4.3,
        images: PLACEHOLDER_IMG("1515372039744-b8f02a3ae446"),
        category: "New Collection",
        type: "Women",
        seller: "ShopX Fashion",
        stock: 70,
        numOfReviews: 33,
        user: adminId,
    },
];

module.exports = { users, buildProducts };