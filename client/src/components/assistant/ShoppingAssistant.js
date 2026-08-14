import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {  BsX } from "react-icons/bs";
import { FaRobot } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { axiosInstance } from "../../config";
import "./ShoppingAssistant.scss";

const SUGGESTIONS = [
  "Show me running shoes under ₹5000",
  "What's the return policy on jackets?",
  "Track my last order",
  "Recommend a gift for a yoga lover",
];

const ShoppingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Personal Shopper (Store Pilot). I can search products, check return policies, and track orders. How can I help?",
    },
  ]);
  const messagesEndRef = useRef(null);
  const chatHistoryRef = useRef([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text.trim();
    if (!userText || loading) return;

    const userMsg = { role: "user", content: userText };
    const updatedHistory = [...chatHistoryRef.current, userMsg];
    chatHistoryRef.current = updatedHistory;

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axiosInstance.post(
        "/api/v1/assistant/chat",
        { messages: updatedHistory },
        { withCredentials: true }
      );

      const assistantMsg = {
        role: "assistant",
        content: data.reply || "Sorry, I didn't get a response for that.",
        products: data.products || [],
        toolsUsed: data.toolsUsed || [],
      };

      chatHistoryRef.current = [
        ...updatedHistory,
        { role: "assistant", content: data.reply },
      ];
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <button
        className={`assistant-fab ${open ? "hidden" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open Store Pilot"
      >
        <FaRobot />
        <span>Store Pilot</span>   {/* was "Ask AI" */}
      </button>

      {open && (
        <div className="assistant-panel">
          <div className="assistant-header">
            <div>
              <strong>Personal Shopper</strong>
              <small>Store Pilot • Powered by tool-use + your catalog</small>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
            >
              <BsX />
            </button>
          </div>

          <div className="assistant-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`assistant-msg ${msg.role}`}>
                <div className="assistant-bubble">
                  {msg.content.split("\n").map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>

                {msg.toolsUsed?.length > 0 && (
                  <div className="assistant-tools">
                    {msg.toolsUsed.map((t, j) => (
                      <span key={j} className="tool-badge">
                        {t.tool}
                      </span>
                    ))}
                  </div>
                )}

                {msg.products?.length > 0 && (
                  <div className="assistant-products">
                    {msg.products.map((p) => (
                      <Link
                        key={p.id}
                        to={p.url}
                        className="product-card"
                        onClick={() => setOpen(false)}
                      >
                        {p.image && (
                          <img src={p.image} alt={p.name} />
                        )}
                        <div>
                          <span className="name">{p.name}</span>
                          <span className="price">₹{p.price}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="assistant-msg assistant">
                <div className="assistant-bubble typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!loading && messages.length <= 1 && (
            <div className="assistant-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form className="assistant-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask about products, orders, returns..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ShoppingAssistant;