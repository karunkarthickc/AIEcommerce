const OpenAI = require("openai");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { toolDefinitions, executeTool } = require("../utils/assistantTools");

const SYSTEM_PROMPT = `You are ShopX AI Shopping Assistant — a helpful, concise e-commerce assistant for the ShopX online store.

You have access to tools that query the real product catalog and order database. ALWAYS use tools instead of guessing product info, prices, or order status.

Guidelines:
- For product searches ("running shoes under $50"), call search_products with appropriate filters.
- For recommendations, call recommend_products with the user's preference.
- For return/refund questions, call get_return_policy (and get_product_details if about a specific item).
- For order tracking, call get_order_status or get_user_orders. If the user isn't logged in, tell them to log in.
- When showing products, mention name, price, and briefly why it fits their request.
- Keep responses friendly and under 150 words unless listing multiple products.
- If a tool returns requiresAuth, politely ask the user to log in at /login.`;

const MAX_TOOL_ROUNDS = 5;

async function runAssistantLoop(messages, userId) {
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey || apiKey === "your_openrouter_api_key") {
    return runFallbackAssistant(messages, userId);
}

const openai = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
});
    const conversation = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
    ];

    const toolsUsed = [];
    let products = [];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        const response = await openai.chat.completions.create({
           model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
            messages: conversation,
            tools: toolDefinitions,
            tool_choice: "auto",
        });

        const choice = response.choices[0].message;
        conversation.push(choice);

        if (!choice.tool_calls?.length) {
            return {
                reply: choice.content,
                toolsUsed,
                products,
            };
        }

        for (const toolCall of choice.tool_calls) {
            const fnName = toolCall.function.name;
            const fnArgs = JSON.parse(toolCall.function.arguments || "{}");
            const result = await executeTool(fnName, fnArgs, userId);

            toolsUsed.push({ tool: fnName, args: fnArgs });

            if (result.products) {
                products = [...products, ...result.products];
            } else if (result.product) {
                products.push(result.product);
            }

            conversation.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(result),
            });
        }
    }

    return {
        reply: "I need a bit more info to help with that. Could you rephrase your question?",
        toolsUsed,
        products,
    };
}

async function runFallbackAssistant(messages, userId) {
    const lastUserMsg = [...messages]
        .reverse()
        .find((m) => m.role === "user")?.content?.toLowerCase() || "";

    const toolsUsed = [];
    let products = [];
    let toolResult;

    if (/return|refund|exchange/.test(lastUserMsg)) {
        const productMatch = lastUserMsg.match(/jacket|shoe|dress|mat|earbud/i);
        toolResult = await executeTool(
            "get_return_policy",
            {
                productCategory: /jacket|dress|clothing/.test(lastUserMsg)
                    ? "Clothing"
                    : /shoe|sneaker|running/.test(lastUserMsg)
                      ? "Footwear"
                      : undefined,
                productName: productMatch?.[0],
            },
            userId
        );
        toolsUsed.push({ tool: "get_return_policy", args: {} });
    } else if (/order|track|shipment|delivery|last order/.test(lastUserMsg)) {
        toolResult = await executeTool(
            "get_order_status",
            { latest: true },
            userId
        );
        toolsUsed.push({ tool: "get_order_status", args: { latest: true } });
    } else if (/recommend|suggest|gift|looking for/.test(lastUserMsg)) {
        toolResult = await executeTool(
            "recommend_products",
            {
                preference: lastUserMsg
                    .replace(/recommend|suggest|show me|find/i, "")
                    .trim(),
            },
            userId
        );
        toolsUsed.push({ tool: "recommend_products", args: {} });
        if (toolResult.products) products = toolResult.products;
    } else {
        const priceMatch = lastUserMsg.match(/under\s*\$?\s*(\d+)/);
        const keyword = lastUserMsg
            .replace(
                /show me|find|search|under\s*\$?\d+|cheap|affordable/gi,
                ""
            )
            .trim();

        toolResult = await executeTool(
            "search_products",
            {
                keyword: keyword || "shoes",
                maxPrice: priceMatch ? Number(priceMatch[1]) : undefined,
            },
            userId
        );
        toolsUsed.push({ tool: "search_products", args: { keyword } });
        if (toolResult.products) products = toolResult.products;
    }

    if (toolResult?.requiresAuth) {
        return {
            reply: "To view your orders, please log in first at /login. Once signed in, ask me again to track your order!",
            toolsUsed,
            products: [],
        };
    }

    if (toolResult?.error && !toolResult.products) {
        return { reply: toolResult.error, toolsUsed, products: [] };
    }

    const reply = formatFallbackReply(lastUserMsg, toolResult, products);
    return { reply, toolsUsed, products };
}

function formatFallbackReply(query, toolResult, products) {
    if (toolResult?.status) {
        const items = toolResult.items.map((i) => i.name).join(", ");
        return `Your order #${String(toolResult.orderId).slice(-6)} is ${toolResult.status}. Items: ${items}. Total: $${toolResult.total.toFixed(2)}. Shipped to ${toolResult.shippingAddress}.`;
    }

    if (toolResult?.general) {
        let text = toolResult.general;
        if (toolResult.categorySpecific)
            text += " " + toolResult.categorySpecific;
        if (toolResult.productNote) text += " " + toolResult.productNote;
        if (toolResult.shipping) text += " " + toolResult.shipping;
        return text;
    }

    if (products.length > 0) {
        const list = products
            .slice(0, 5)
            .map((p) => `${p.name} — $${p.price} (${p.category})`)
            .join("\n");
        return `Here's what I found in our catalog:\n\n${list}\n\nClick any product to view details!`;
    }

    if (toolResult?.orders?.length) {
        return toolResult.orders
            .map(
                (o) =>
                    `Order #${String(o.id).slice(-6)}: ${o.status} — $${o.total.toFixed(2)}`
            )
            .join("\n");
    }

    return "I searched our catalog but couldn't find exact matches. Try asking about running shoes, jackets, or track your order!";
}

exports.chat = catchAsyncErrors(async (req, res) => {
    const { messages } = req.body;

    if (!messages?.length) {
        return res.status(400).json({
            success: false,
            message: "Messages array is required",
        });
    }

    const userId = req.user?._id?.toString() || null;
    const result = await runAssistantLoop(messages, userId);

    const uniqueProducts = [];
    const seen = new Set();
    for (const p of result.products || []) {
        if (p?.id && !seen.has(String(p.id))) {
            seen.add(String(p.id));
            uniqueProducts.push(p);
        }
    }

    res.status(200).json({
        success: true,
        reply: result.reply,
        products: uniqueProducts,
        toolsUsed: result.toolsUsed,
    });
});
