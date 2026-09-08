"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components/ui/ProductImage";
import {
  CheckCircle2,
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  ShieldCheck,
  Gift,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [cart, setCart] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState("");

  // Step 1: Address
  const [shippingAddress, setShippingAddress] = React.useState({
    fullName: "Alex Mercer",
    street: "742 Evergreen Terrace",
    apartment: "Suite 4B",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    country: "United States",
    phone: "+1 (555) 987-6543",
  });

  // Step 2: Shipping Method
  const [shippingMethod, setShippingMethod] = React.useState<"STANDARD" | "EXPRESS" | "OVERNIGHT">("STANDARD");

  // Step 3: Gift & Notes
  const [isGift, setIsGift] = React.useState(false);
  const [giftMessage, setGiftMessage] = React.useState("");

  // Step 4: Payment
  const [paymentIntent, setPaymentIntent] = React.useState<any>(null);
  const [testCardNumber, setTestCardNumber] = React.useState("4242 •••• •••• 4242");

  // Fetch cart
  React.useEffect(() => {
    async function loadCart() {
      try {
        setLoading(true);
        const res = await fetch("/api/cart");
        if (res.ok) {
          const data = await res.json();
          if (!data.cart || !data.cart.items || data.cart.items.length === 0) {
            router.push("/cart");
            return;
          }
          setCart(data.cart);
        } else {
          router.push("/login?redirect=/checkout");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, [router]);

  // Create payment intent when reaching payment step
  const handleProceedToPayment = async () => {
    try {
      setProcessing(true);
      setError("");
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingMethod }),
      });

      if (res.ok) {
        const data = await res.json();
        setPaymentIntent(data);
        setStep(4);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to initialize payment");
      }
    } catch (err: any) {
      setError("Network error while creating payment");
    } finally {
      setProcessing(false);
    }
  };

  // Submit checkout order
  const handleCompleteOrder = async () => {
    try {
      setProcessing(true);
      setError("");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress,
          shippingMethod,
          isGift,
          giftMessage: isGift ? giftMessage : undefined,
          paymentIntentId: paymentIntent?.paymentIntentId || `pi_test_${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.dispatchEvent(new CustomEvent("cart-updated"));
        router.push(`/order-confirmation/${data.order.id}`);
      } else {
        setError(data.error || "Failed to place order");
      }
    } catch (err: any) {
      setError("Network error during order placement");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-semibold">Preparing secure checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-between max-w-xl mx-auto px-4">
        {[
          { num: 1, label: "Shipping" },
          { num: 2, label: "Delivery" },
          { num: 3, label: "Review" },
          { num: 4, label: "Payment" },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                  : step > s.num
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </div>
            <span className="text-[11px] font-semibold text-slate-600">{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Steps Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                1. Shipping Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Apt / Suite</label>
                  <input
                    type="text"
                    value={shippingAddress.apartment}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">State / Region</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number for Delivery Alerts</label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs mt-4"
              >
                Continue to Delivery Method &rarr;
              </Button>
            </div>
          )}

          {/* STEP 2: Delivery Method */}
          {step === 2 && (
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">2. Delivery Speed</h3>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod("STANDARD")}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    shippingMethod === "STANDARD"
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={shippingMethod === "STANDARD"} readOnly />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Standard Delivery (3-5 Business Days)</p>
                      <p className="text-[11px] text-slate-500">Free for orders over $100 ($9.99 otherwise)</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {cart.subtotal >= 100 ? "FREE" : "$9.99"}
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod("EXPRESS")}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    shippingMethod === "EXPRESS"
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={shippingMethod === "EXPRESS"} readOnly />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Express Courier (2 Business Days)</p>
                      <p className="text-[11px] text-slate-500">Priority tracking & signature on delivery</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">$15.00</span>
                </label>

                <label
                  onClick={() => setShippingMethod("OVERNIGHT")}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    shippingMethod === "OVERNIGHT"
                      ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={shippingMethod === "OVERNIGHT"} readOnly />
                    <div>
                      <p className="text-xs font-bold text-slate-900">⚡ Priority Overnight (Next Morning)</p>
                      <p className="text-[11px] text-slate-500">Guaranteed delivery by 10:30 AM</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">$25.00</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setStep(1)} className="text-xs font-semibold">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Continue to Order Review &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Review & Gift Options */}
          {step === 3 && (
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">3. Order Review & Preferences</h3>

              {/* Gift Options */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-900">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <Gift className="w-4 h-4 text-indigo-600" /> This order contains a gift
                </label>
                {isGift && (
                  <textarea
                    rows={2}
                    placeholder="Enter complimentary gift message to include in packing slip..."
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs mt-2 bg-white"
                  />
                )}
              </div>

              {/* Verified Address Review */}
              <div className="p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">Shipping to:</p>
                <p>{shippingAddress.fullName}</p>
                <p>{shippingAddress.street}, {shippingAddress.apartment}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                <p>Phone: {shippingAddress.phone}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setStep(2)} className="text-xs font-semibold">
                  Back
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  isLoading={processing}
                  className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Proceed to Payment &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Simulation / Stripe Elements */}
          {step === 4 && (
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" /> 4. Payment
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted
                </span>
              </div>

              {paymentIntent?.isTestMode && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" /> Stripe Safe Test Mode Simulator Active
                  </p>
                  <p className="text-[11px] text-amber-700">
                    No actual charges will be made. You can test checkout freely and verify full order lifecycle, inventory decrement, and seller notifications!
                  </p>
                </div>
              )}

              {/* Card Inputs Form */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Card Number</label>
                  <input
                    type="text"
                    readOnly
                    value={testCardNumber}
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-slate-50 font-mono text-xs text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Expiration</label>
                    <input
                      type="text"
                      readOnly
                      value="12 / 28"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-slate-50 font-mono text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      readOnly
                      value="888"
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-slate-50 font-mono text-xs text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setStep(3)} className="text-xs font-semibold">
                  Back
                </Button>
                <Button
                  onClick={handleCompleteOrder}
                  isLoading={processing}
                  className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md"
                >
                  Pay {formatPrice(paymentIntent?.amount || cart.total)} & Complete Order
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Review Items in Order</h4>

            <div className="divide-y divide-slate-200/60 max-h-80 overflow-y-auto pr-1">
              {cart.items.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                      <ProductImage
                        src={item.product.images?.[0]?.url}
                        alt={item.product.title}
                        fill
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 truncate max-w-[180px]">{item.product.title}</p>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatPrice((item.variant?.price ?? item.product.salePrice ?? item.product.basePrice) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatPrice(cart.subtotal)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(cart.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping ({shippingMethod})</span>
                <span className="font-semibold text-slate-900">
                  {shippingMethod === "OVERNIGHT" ? "$25.00" : shippingMethod === "EXPRESS" ? "$15.00" : (cart.subtotal >= 100 ? "FREE" : "$9.99")}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span className="font-semibold text-slate-900">{formatPrice(cart.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total to Pay</span>
                <span className="text-indigo-600">
                  {formatPrice(
                    paymentIntent?.amount ||
                      cart.subtotal - cart.discount + cart.tax + (shippingMethod === "OVERNIGHT" ? 25 : shippingMethod === "EXPRESS" ? 15 : cart.subtotal >= 100 ? 0 : 9.99)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
