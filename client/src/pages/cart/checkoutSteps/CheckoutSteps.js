import React from "react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  const steps = [
    {
      label: "Shipping",
      path: "/shipping",
      active: shipping,
    },
    {
      label: "Confirm Order",
      path: "/order/confirm",
      active: confirmOrder,
    },
    {
      label: "Payment",
      path: "/payment",
      active: payment,
    },
  ];

  return (
    <div className="checkout-steps">
      <div className="steps-container">
        {steps.map((step, index) => {
          const isActive = step.active;
          const isCompleted = 
            (index === 0 && shipping) ||
            (index === 1 && confirmOrder) ||
            (index === 2 && payment);

          return (
            <React.Fragment key={step.label}>
              {/* Step */}
              <div className="step-item">
                {isActive || isCompleted ? (
                  <Link to={step.path} className="step-link">
                    <div
                      className={`step-circle ${
                        isCompleted ? "completed" : "active"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`step-label ${isActive ? "active-label" : ""}`}>
                      {step.label}
                    </span>
                  </Link>
                ) : (
                  <div className="step-link disabled">
                    <div className="step-circle incomplete">{index + 1}</div>
                    <span className="step-label">{step.label}</span>
                  </div>
                )}
              </div>

              {/* Connector line (except last step) */}
              {index < steps.length - 1 && (
                <div
                  className={`connector ${
                    (index === 0 && shipping) || (index === 1 && confirmOrder)
                      ? "completed"
                      : ""
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <style jsx>{`
        .checkout-steps {
          margin: 2.5rem 0 2rem;
          display: flex;
          justify-content: center;
        }

        .steps-container {
          display: flex;
          align-items: center;
          gap: 0;
          max-width: 640px;
          width: 100%;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .step-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }

        .step-link.disabled {
          cursor: not-allowed;
          pointer-events: none;
        }

        .step-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.25s ease;
          border: 2px solid transparent;
        }

        /* Incomplete */
        .step-circle.incomplete {
          background: #f1f5f9;
          color: #94a3b8;
          border-color: #e2e8f0;
        }

        /* Active (current step) */
        .step-circle.active {
          background: #4f46e5;
          color: white;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.25);
        }

        /* Completed */
        .step-circle.completed {
          background:  #1e6f50;
          color: white;
        }

        .step-label {
          margin-top: 0.6rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          white-space: nowrap;
        }

        .step-label.active-label {
          color:  #1e6f50;
          font-weight: 600;
        }

        /* Connector line */
        .connector {
          flex: 1;
          height: 3px;
          background: #e2e8f0;
          margin: 0 8px;
          margin-bottom: 28px; /* aligns with circle center */
          border-radius: 2px;
          transition: background 0.3s ease;
        }

        .connector.completed {
          background: #1e6f50;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .step-circle {
            width: 36px;
            height: 36px;
            font-size: 0.85rem;
          }

          .step-label {
            font-size: 0.75rem;
          }

          .connector {
            margin: 0 4px;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutSteps;