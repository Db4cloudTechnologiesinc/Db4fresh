
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} from "../features/cart/cartSlice";
import { fetchProducts } from "../features/products/productSlice";
import { Link, useNavigate } from "react-router-dom";

import AddToCartButton from "../components/AddToCartButton";
import AddressSection from "../components/AddressSection";
import CheckoutPanel from "../components/CheckoutPanel";

import { setAddresses } from "../features/address/addressSlice";
import { fetchAddressesApi } from "../features/address/addressApi";
import ProductCard from "../components/ProductCard";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= REDUX STATE ================= */
  const items = useSelector((s) => s.cart.items);
  const products = useSelector((s) => s.products.items);
  const addresses = useSelector((s) => s.address.addresses || []);

  const authUser =
    useSelector((s) => s.auth?.user) ||
    JSON.parse(localStorage.getItem("user") || "{}");

  /* ================= UI STATES ================= */
  const [giftWrap, setGiftWrap] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
  JSON.parse(localStorage.getItem("selected_address")) || null
);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [offers, setOffers] = useState([]);

  /* ================= SELECTED ADDRESS ================= */
  

  /* ================= FETCH ADDRESSES ================= */
  useEffect(() => {
    fetchAddressesApi().then((res) => {
      dispatch(setAddresses(res.addresses || []));
    });
  }, [dispatch]);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);
  /* ================= FETCH SUGGESTED PRODUCTS ================= */
useEffect(() => {
  const fetchSuggestions = async () => {
    if (!items.length) {
      setSuggestedProducts([]);
      return;
    }

    try {
      const productId = items[items.length - 1].productId;

      const res = await fetch(
        `http://localhost:4000/api/products/cart-suggestions/${productId}`
      );

      const data = await res.json();

      setSuggestedProducts(data.slice(0, 4));
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  };

  fetchSuggestions();
}, [items]);
useEffect(() => {
  const fetchOffers = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/offers");
      const data = await res.json();

      setOffers(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchOffers();
}, []);

  /* ================= BILL CALCULATIONS ================= */
  const freeItems = [];

items.forEach((item) => {
  const offer = Array.isArray(offers)
  ? offers.find(
      (o) =>
        Number(o.buy_product_id) ===
        Number(item.productId)
    )
  : null;
  if (!offer) return;

  const buyQty = Number(offer.buy_qty);
  const freeQty = Number(offer.free_qty);

  if (item.qty >= buyQty) {
    const timesEligible = Math.floor(
      item.qty / buyQty
    );

   freeItems.push({
  name: offer.free_product_name,
  variantLabel: offer.free_variant_label,   // <-- add this
  image:
    offer.free_product_image ||
    JSON.parse(offer.free_product_images || "[]")?.[0]?.url ||
    "/placeholder.png",
  qty: timesEligible * freeQty,
});
  }
});
  const itemTotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const discount = itemTotal >= 500 ? 50 : 0;
  const deliveryFee = itemTotal >= 99 ? 0 : 0;
  const giftWrapFee = giftWrap ? 25 : 0;

  const deliverySavings = deliveryFee === 0 ? 30 : 0;
  const handlingSavings = 10;

  const totalSavings =
    discount + deliverySavings + handlingSavings;

  const grandTotal =
    itemTotal - discount + deliveryFee + giftWrapFee;

  /* ================= PAYMENT HANDLER ================= */
  const handlePayment = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    navigate("/checkout");
  };


  /* ================= EMPTY CART ================= */
  if (!items.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4 text-lg">
          Your cart is empty
        </p>
        <Link
          to="/"
          className="bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="pb-32">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ================= LEFT ================= */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-6">
  <div>
    <h2 className="text-2xl font-semibold">My Cart</h2>

    <p className="text-sm text-gray-500 mt-1">
      {items.length} Item{items.length !== 1 ? "s" : ""}
    </p>
  </div>

  <button
    onClick={() => {
      if (window.confirm("Are you sure you want to clear your cart?")) {
        dispatch(clearCart());
      }
    }}
    className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
  >
    🗑 Clear Cart
  </button>
</div>
             {freeItems.length > 0 && (
  <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 shadow-sm">
    
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
        🎁
      </div>

      <div>
        <h3 className="font-bold text-green-700">
          Congratulations!
        </h3>

        <p className="text-xs text-green-600">
          You've unlocked free products
        </p>
      </div>
    </div>

    {freeItems.map((item, index) => (
      <div
        key={index}
        className="bg-white rounded-xl p-3 flex items-center gap-3 border"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
        />

       <div className="flex-1">
  <h4 className="font-semibold">
    {item.name}
  </h4>

  {item.variantLabel && (
    <p className="text-sm text-gray-500">
      {item.variantLabel}
    </p>
  )}

  <p className="text-green-600 font-medium">
    FREE × {item.qty}
  </p>
</div>

        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
          FREE
        </div>
      </div>
    ))}
  </div>
)}

            {/* CART ITEMS */}
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-4 bg-white rounded-xl shadow p-4"
              >
               
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>

                  {item.variantLabel && (
                    <p className="text-xs text-gray-500">
                      {item.variantLabel}
                    </p>
                  )}

                  <p className="text-green-600 font-bold mt-1">
                    ₹{item.price}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        dispatch(
                          decreaseQty({
                            productId: item.productId,
                            variantId: item.variantId,
                          })
                        )
                      }
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      −
                    </button>

                    <span className="font-semibold">
                      {item.qty}
                    </span>

                    <button
                      onClick={() =>
                        dispatch(
                          increaseQty({
                            productId: item.productId,
                            variantId: item.variantId,
                          })
                        )
                      }
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div> */}
                <div className="flex-1">
  {/* PRODUCT NAME */}
  <h3 className="font-semibold text-lg">
    {item.name}
  </h3>

  {/* VARIANT */}
  {item.variantLabel && (
    <p className="text-sm text-gray-500 mt-1">
      {item.variantLabel}
    </p>
  )}

  {/* UNIT PRICE */}
  <div className="mt-2">
    <p className="text-sm text-gray-500">
      Price per item
    </p>

    <p className="text-green-600 font-bold text-lg">
      ₹{item.price}
    </p>
  </div>

  {/* QUANTITY CONTROLS */}
  <div className="flex items-center gap-3 mt-4">
    <button
      onClick={() =>
        dispatch(
          decreaseQty({
            productId: item.productId,
            variantId: item.variantId,
          })
        )
      }
      className="w-10 h-10 bg-gray-200 rounded-lg text-lg font-bold"
    >
      −
    </button>

    <span className="font-semibold text-lg">
      {item.qty}
    </span>

    <button
      onClick={() =>
        dispatch(
          increaseQty({
            productId: item.productId,
            variantId: item.variantId,
          })
        )
      }
      className="w-10 h-10 bg-gray-200 rounded-lg text-lg font-bold"
    >
      +
    </button>
  </div>

  {/* TOTAL PRICE */}
  <div className="mt-4 bg-gray-50 rounded-lg p-3 border">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">
        Calculation
      </span>

      <span className="font-medium">
        ₹{item.price} × {item.qty}
      </span>
    </div>

    <div className="flex justify-between mt-2">
      <span className="font-semibold">
        Item Total
      </span>

      <span className="text-lg font-bold text-black">
        ₹{item.price * item.qty}
      </span>
    </div>
  </div>
</div>

                <button
                  onClick={() =>
                    dispatch(
                      removeFromCart({
                        productId: item.productId,
                        variantId: item.variantId,
                      })
                    )
                  }
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* MISSED SOMETHING */}
            <div className="flex justify-between bg-gray-50 border border-dashed rounded-xl p-4">
              <p className="text-sm font-medium">
                Missed something?
              </p>
              <Link
                to="/"
                className="text-red-600 font-semibold text-sm"
              >
                + Add more items
              </Link>
            </div>

            {/* YOU MAY ALSO LIKE */}
            {suggestedProducts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  You may also like
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
  {suggestedProducts.map((p) => (
    <ProductCard key={p.id} p={p} />
  ))}
</div>
              </div>
            )}
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-4">

            {/* GIFT WRAP */}
            <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Gift wrap this order</p>
                <p className="text-xs text-gray-500">
                  Make it special
                </p>
              </div>

              <button
                onClick={() => setGiftWrap(!giftWrap)}
                className={`w-12 h-6 rounded-full ${
                  giftWrap ? "bg-green-500" : "bg-gray-300"
                } relative`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                    giftWrap ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* SAVINGS */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex justify-between mb-3">
                <p className="font-semibold">
                  Savings on this order
                </p>
                <span className="bg-green-600 text-white px-3 py-1 rounded-lg">
                  ₹{totalSavings}
                </span>
              </div>

              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Discount on MRP</span>
                  <span>₹{discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>FREE delivery savings</span>
                  <span>₹{deliverySavings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Handling fee savings</span>
                  <span>₹{handlingSavings}</span>
                </div>
              </div>
            </div>

            {/* BILL SUMMARY */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                Bill Summary
              </h3>

              <div className="flex justify-between text-sm">
                <span>Item Total</span>
                <span>₹{itemTotal}</span>
              </div>

              <div className="flex justify-between text-sm text-green-600">
                <span>Total Savings</span>
                <span>-₹{totalSavings}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0
                    ? "FREE"
                    : `₹${deliveryFee}`}
                </span>
              </div>

              {giftWrap && (
                <div className="flex justify-between text-sm">
                  <span>Gift Wrap</span>
                  <span>₹25</span>
                </div>
              )}

              <hr className="my-3" />

              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* CHECKOUT PANEL */}
            {/* <CheckoutPanel
              totalAmount={grandTotal}
              address={selectedAddress}
              user={authUser}
              onChangeAddress={() => setShowAddressModal(true)}
              onPay={handlePayment}
            /> */}
            <button
  onClick={handlePayment}
  className="w-full bg-red-600 text-white py-3 rounded-xl text-lg font-semibold"
>
  Proceed to Checkout
</button>

          </div>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <AddressSection
  onClose={() => setShowAddressModal(false)}
  onSelect={(address) => {
    setSelectedAddress(address);
    localStorage.setItem(
      "selected_address",
      JSON.stringify(address)
    );
    setShowAddressModal(false);
  }}
/>
      )}
    </>
  );
}
