const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/user");
const Product = require("./models/product");
const Order = require("./models/order");
const { users, buildProducts } = require("./utils/seedData");

dotenv.config();

const seed = async () => {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB — seeding...");

    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    const createdUsers = [];
    for (const userData of users) {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`  User: ${user.email} (${user.role})`);
    }

    const admin = createdUsers.find((u) => u.role === "admin");
    const john = createdUsers.find((u) => u.email === "john@shopx.com");

    const products = await Product.insertMany(buildProducts(admin._id));
    console.log(`  Products: ${products.length} inserted`);

    const runningShoes = products.find((p) =>
        p.name.includes("SwiftRun")
    );
    const jacket = products.find((p) => p.name.includes("Alpine Pro"));

    await Order.create({
        shippingInfo: {
            address: "42 Oak Avenue",
            city: "Austin",
            phoneNo: "+1-555-0101",
            postalCode: "78701",
            country: "United States",
        },
        user: john._id,
        orderItems: [
            {
                name: runningShoes.name,
                quantity: 1,
                image: runningShoes.images[0].url,
                price: runningShoes.price,
                product: runningShoes._id,
            },
            {
                name: jacket.name,
                quantity: 1,
                image: jacket.images[0].url,
                price: jacket.price,
                product: jacket._id,
            },
        ],
        paymentInfo: { id: "pi_seed_demo_001", status: "succeeded" },
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        itemsPrice: runningShoes.price + jacket.price,
        taxPrice: 17.6,
        shippingPrice: 10,
        totalPrice: runningShoes.price + jacket.price + 17.6 + 10,
        orderStatus: "Shipped",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });

    await Order.create({
        shippingInfo: {
            address: "42 Oak Avenue",
            city: "Austin",
            phoneNo: "+1-555-0101",
            postalCode: "78701",
            country: "United States",
        },
        user: john._id,
        orderItems: [
            {
                name: products.find((p) => p.name.includes("Yoga")).name,
                quantity: 2,
                image: products.find((p) => p.name.includes("Yoga")).images[0]
                    .url,
                price: products.find((p) => p.name.includes("Yoga")).price,
                product: products.find((p) => p.name.includes("Yoga"))._id,
            },
        ],
        paymentInfo: { id: "pi_seed_demo_002", status: "succeeded" },
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        itemsPrice: 69.98,
        taxPrice: 5.6,
        shippingPrice: 5,
        totalPrice: 80.58,
        orderStatus: "Processing",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    console.log("  Orders: 2 sample orders for john@shopx.com");
    console.log("\nSeed complete!\n");
    console.log("Login credentials:");
    console.log("  Admin:    admin@shopx.com  /  Admin@123");
    console.log("  Customer: john@shopx.com   /  Customer@123");
    console.log("  Customer: sarah@shopx.com  /  Customer@123");

    await mongoose.disconnect();
    process.exit(0);
};

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
