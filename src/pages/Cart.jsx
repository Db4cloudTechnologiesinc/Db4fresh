
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../features/cart/cartSlice";
import { fetchProducts } from "../features/products/productSlice";
import { Link, useNavigate } from "react-router-dom";

import AddToCartButton from "../components/AddToCartButton";
import AddressSection from "../components/AddressSection";
import CheckoutPanel from "../components/CheckoutPanel";

import { setAddresses } from "../features/address/addressSlice";
import { fetchAddressesApi } from "../features/address/addressApi";

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

  /* ================= SELECTED ADDRESS ================= */
  const selectedAddress =
    JSON.parse(localStorage.getItem("selected_address")) ||
    addresses.find((a) => a.is_default) ||
    null;

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

  /* ================= BILL CALCULATIONS ================= */
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

  /* ================= SUGGESTED PRODUCTS ================= */
  const cartProductIds = items.map((i) => i.productId);

  const suggestedProducts =
    products
      ?.filter((p) => !cartProductIds.includes(p.id))
      .slice(0, 4) || [];

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
            <h2 className="text-2xl font-semibold">My Cart</h2>

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

                <div className="flex-1">
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
                  {suggestedProducts.map((p) => {
                    const img =
                      p.images?.[0]?.url ||
                      p.images?.[0] ||
                      "/placeholder.png";

                    const v = p.variants?.[0];
                    const price = v?.price || p.price || 0;

                    return (
                      <div
                        key={p.id}
                        className="bg-white rounded-lg shadow p-3"
                      >
                        <Link to={`/product/${p.id}`}>
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-24 object-contain mb-2"
                          />
                          <p className="text-sm font-medium line-clamp-2">
                            {p.name}
                          </p>
                        </Link>

                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-sm">
                            ₹{price}
                          </span>

                          <AddToCartButton
                            productId={p.id}
                            variantId={v?.id}
                            name={p.name}
                            price={price}
                            image={img}
                            variantLabel={v?.variant_label}
                            stock={v?.stock ?? 0}
                          />
                        </div>
                      </div>
                    );
                  })}
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
          onSelect={() => setShowAddressModal(false)}
        />
      )}
    </>
  );
}
