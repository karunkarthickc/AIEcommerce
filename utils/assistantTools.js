const Product = require("../models/product");
const Order = require("../models/order");

const RETURN_POLICY = {
    general:
        "ShopX offers a 30-day return policy on most items. Items must be unworn, unwashed, and have original tags attached. Refunds are processed within 5–7 business days after we receive the return.",
    footwear:
        "Footwear can be returned within 30 days if unworn and in original packaging. Running shoes must not show signs of outdoor use.",
    clothing:
        "Clothing returns accepted within 30 days. Jackets and outerwear must have tags attached. Final sale items (marked with a red tag) cannot be returned but may be exchanged within 14 days for store credit.",
    finalSale:
        "Items marked Final Sale cannot be returned or refunded. Exchanges for store credit may be available within 14 days.",
    shipping:
        "Free return shipping on orders over $75. Otherwise a $5.99 return shipping fee applies.",
};

const toolDefinitions = [
    {
        type: "function",
        function: {
            name: "search_products",
            description:
                "Search the product catalog by keyword, category, and price range. Use for queries like 'running shoes under $50' or 'show me jackets'.",
            parameters: {
                type: "object",
                properties: {
                    keyword: {
                        type: "string",
                        description:
                            "Search term for product name or description, e.g. 'running shoes', 'jacket'",
                    },
                    category: {
                        type: "string",
                        enum: [
                            "Footwear",
                            "Sports",
                            "Clothing",
                            "Accessories",
                            "Beauty/Health",
                            "Outdoor",
                            "New Collection",
                            "Featured",
                            "Eid Collection",
                        ],
                        description: "Product category filter",
                    },
                    maxPrice: {
                        type: "number",
                        description: "Maximum price in USD",
                    },
                    minPrice: {
                        type: "number",
                        description: "Minimum price in USD",
                    },
                    limit: {
                        type: "number",
                        description: "Max results to return (default 5)",
                    },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_product_details",
            description:
                "Get detailed info about a specific product by name or ID, including description, price, stock, and return policy notes.",
            parameters: {
                type: "object",
                properties: {
                    productName: {
                        type: "string",
                        description: "Product name or partial name",
                    },
                    productId: {
                        type: "string",
                        description: "MongoDB product ID if known",
                    },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "recommend_products",
            description:
                "Recommend products based on user preferences, activity, or natural-language description. Uses catalog search over product descriptions (RAG-style).",
            parameters: {
                type: "object",
                properties: {
                    preference: {
                        type: "string",
                        description:
                            "What the user is looking for, e.g. 'something for morning runs', 'gift for a yoga enthusiast'",
                    },
                    category: { type: "string" },
                    maxPrice: { type: "number" },
                    limit: { type: "number" },
                },
                required: ["preference"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_return_policy",
            description:
                "Get ShopX return and refund policy. Use when users ask about returns, exchanges, or refunds for a product type.",
            parameters: {
                type: "object",
                properties: {
                    productCategory: {
                        type: "string",
                        description:
                            "Optional category like 'Clothing', 'Footwear' for specific policy details",
                    },
                    productName: {
                        type: "string",
                        description:
                            "Optional product name to include product-specific return notes from its description",
                    },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_user_orders",
            description:
                "Get the logged-in user's order history. Requires authentication.",
            parameters: { type: "object", properties: {} },
        },
    },
    {
        type: "function",
        function: {
            name: "get_order_status",
            description:
                "Track order status for the logged-in user. Can fetch the most recent order or a specific order by ID.",
            parameters: {
                type: "object",
                properties: {
                    orderId: {
                        type: "string",
                        description: "Specific order ID. Omit to get the latest order.",
                    },
                    latest: {
                        type: "boolean",
                        description:
                            "If true, return the user's most recent order",
                    },
                },
            },
        },
    },
];

async function searchProducts({ keyword, category, maxPrice, minPrice, limit = 5 }) {
    const filter = {};

    if (keyword) {
        filter.$or = [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
        ];
    }
    if (category) filter.category = category;
    if (maxPrice != null) filter.price = { ...filter.price, $lte: maxPrice };
    if (minPrice != null) filter.price = { ...filter.price, $gte: minPrice };

    const products = await Product.find(filter)
        .select("name price category description stock ratings images")
        .limit(Math.min(limit, 10))
        .lean();

    return {
        count: products.length,
        products: products.map(formatProduct),
    };
}

async function getProductDetails({ productName, productId }) {
    let product;
    if (productId) {
        product = await Product.findById(productId).lean();
    } else if (productName) {
        product = await Product.findOne({
            name: { $regex: productName, $options: "i" },
        }).lean();
    }

    if (!product) {
        return { error: "Product not found. Try search_products instead." };
    }

    return { product: formatProduct(product, true) };
}

async function recommendProducts({ preference, category, maxPrice, limit = 4 }) {
    const filter = {
        $or: [
            { description: { $regex: preference, $options: "i" } },
            { name: { $regex: preference, $options: "i" } },
            { category: { $regex: preference, $options: "i" } },
        ],
    };

    if (category) filter.category = category;
    if (maxPrice != null) filter.price = { $lte: maxPrice };

    const products = await Product.find(filter)
        .select("name price category description ratings images")
        .sort({ ratings: -1 })
        .limit(Math.min(limit || 4, 8))
        .lean();

    if (products.length === 0) {
        const fallback = await Product.find(
            maxPrice ? { price: { $lte: maxPrice } } : {}
        )
            .sort({ ratings: -1 })
            .limit(4)
            .lean();
        return {
            count: fallback.length,
            note: "No exact matches — here are top-rated alternatives:",
            products: fallback.map((p) => formatProduct(p)),
        };
    }

    return {
        count: products.length,
        products: products.map((p) => formatProduct(p)),
    };
}

async function getReturnPolicy({ productCategory, productName }) {
    const policy = {
        general: RETURN_POLICY.general,
        shipping: RETURN_POLICY.shipping,
    };

    if (productCategory === "Footwear" || productCategory === "footwear") {
        policy.categorySpecific = RETURN_POLICY.footwear;
    } else if (
        productCategory === "Clothing" ||
        productCategory === "clothing"
    ) {
        policy.categorySpecific = RETURN_POLICY.clothing;
    }

    if (productName) {
        const product = await Product.findOne({
            name: { $regex: productName, $options: "i" },
        })
            .select("name description category")
            .lean();

        if (product) {
            policy.productNote = `For "${product.name}" (${product.category}): check product page for any special return notes in the description.`;
            if (product?.description) {
    const desc = product.description.toLowerCase();
    if (desc.includes("return policy")) {
        const match = product.description.match(/Return policy:[^.]+\./i);
        if (match) policy.productNote = match[0];
    }
}
        }
    }

    return policy;
}

async function getUserOrders(userId) {
    if (!userId) {
        return {
            error: "Please log in to view your orders.",
            requiresAuth: true,
        };
    }

    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .select("orderStatus totalPrice createdAt orderItems paidAt deliveredAt")
        .lean();

    return {
        count: orders.length,
        orders: orders.map((o) => ({
            id: o._id,
            status: o.orderStatus,
            total: o.totalPrice,
            items: o.orderItems.map((i) => ({
                name: i.name,
                quantity: i.quantity,
                price: i.price,
            })),
            orderedAt: o.createdAt,
            deliveredAt: o.deliveredAt,
        })),
    };
}

async function getOrderStatus(userId, { orderId, latest }) {
    if (!userId) {
        return {
            error: "Please log in to track your orders.",
            requiresAuth: true,
        };
    }

    let order;
    if (orderId) {
        order = await Order.findOne({ _id: orderId, user: userId }).lean();
    } else {
        order = await Order.findOne({ user: userId })
            .sort({ createdAt: -1 })
            .lean();
    }

    if (!order) {
        return { error: "No order found." };
    }

    return {
        orderId: order._id,
        status: order.orderStatus,
        total: order.totalPrice,
        items: order.orderItems.map((i) => ({
            name: i.name,
            quantity: i.quantity,
        })),
        orderedAt: order.createdAt,
        paidAt: order.paidAt,
        deliveredAt: order.deliveredAt,
        shippingAddress: `${order.shippingInfo.address}, ${order.shippingInfo.city}`,
    };
}

function formatProduct(p, includeDescription = false) {
    const base = {
        id: p._id,
        name: p.name,
        price: p.price,
        category: p.category,
        ratings: p.ratings,
        stock: p.stock,
        image: p.images?.[0]?.url,
        url: `/product/${p._id}`,
    };
    if (includeDescription) base.description = p.description;
    return base;
}

async function executeTool(name, args, userId) {
    switch (name) {
        case "search_products":
            return searchProducts(args);
        case "get_product_details":
            return getProductDetails(args);
        case "recommend_products":
            return recommendProducts(args);
        case "get_return_policy":
            return getReturnPolicy(args);
        case "get_user_orders":
            return getUserOrders(userId);
        case "get_order_status":
            return getOrderStatus(userId, args);
        default:
            return { error: `Unknown tool: ${name}` };
    }
}

module.exports = { toolDefinitions, executeTool, RETURN_POLICY };
