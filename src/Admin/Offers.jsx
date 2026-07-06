import { useEffect, useState } from "react";
import axios from "axios";

export default function Offers() {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
const [buyVariants, setBuyVariants] = useState([]);
const [freeVariants, setFreeVariants] = useState([]);
  const [form, setForm] = useState({
  title: "",

  buy_product_id: "",
  buy_variant_id: "",
  buy_qty: "",

  free_product_id: "",
  free_variant_id: "",
  free_qty: "",
});
const loadBuyVariants = async (productId) => {
  try {
    console.log("Selected Product:", productId);

    const { data } = await axios.get(
      `http://localhost:4000/api/products/${productId}/variants`
    );

    console.log("Variants:", data);

    setBuyVariants(data);
  } catch (err) {
    console.error(err);
  }
};

const loadFreeVariants = async (productId) => {

  const { data } = await axios.get(
    `http://localhost:4000/api/products/${productId}/variants`
  );

  setFreeVariants(data);

};
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this offer?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `http://localhost:4000/api/offers/${id}`
    );

    alert("Offer deleted successfully");

    fetchOffers();
  } catch (err) {
    console.error(err);
    alert("Failed to delete offer");
  }
};

  useEffect(() => {
    fetchProducts();
    fetchOffers();
  }, []);

  const fetchProducts = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/admin/products"
    );

    setProducts(data);
  };

  const fetchOffers = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/api/offers"
    );

    setOffers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:4000/api/offers",
      form
    );

    alert("Offer Created");

    fetchOffers();

    setForm({
  title: "",
  buy_product_id: "",
  buy_variant_id: "",
  buy_qty: "",
  free_product_id: "",
  free_variant_id: "",
  free_qty: "",
});

setBuyVariants([]);
setFreeVariants([]);
  };
  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Offer Management
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >

        <input
          type="text"
          placeholder="Offer Title"
          className="border p-2 w-full mb-3"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
        />

        <select
  className="border p-2 w-full mb-3"
  value={form.buy_product_id}
  onChange={async (e) => {

    const productId = e.target.value;

    setForm({
      ...form,
      buy_product_id: productId,
      buy_variant_id: "",
    });

    await loadBuyVariants(productId);

  }}
>
          <option>Select Buy Product</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        

        <input
          type="number"
          placeholder="Buy Quantity"
          className="border p-2 w-full mb-3"
          value={form.buy_qty}
          onChange={(e) =>
            setForm({
              ...form,
              buy_qty: e.target.value,
            })
          }
        />
        <select
  className="border p-2 w-full mb-3"
  value={form.buy_variant_id}
  onChange={(e) =>
    setForm({
      ...form,
      buy_variant_id: e.target.value,
    })
  }
>

<option value="">
Select Buy Variant
</option>

{buyVariants.map((v) => (

<option
  key={v.id}
  value={v.id}
>

{v.variant_label}

₹{v.price}

</option>

))}

</select>

        <select
          className="border p-2 w-full mb-3"
          value={form.free_product_id}
          onChange={async (e)=>{

const productId=e.target.value;

setForm({
...form,
free_product_id:productId,
free_variant_id:"",
});

await loadFreeVariants(productId);

}}
        >
          <option>Select Free Product</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Free Quantity"
          className="border p-2 w-full mb-3"
          value={form.free_qty}
          onChange={(e) =>
            setForm({
              ...form,
              free_qty: e.target.value,
            })
          }
        />
        <select
className="border p-2 w-full mb-3"
value={form.free_variant_id}
onChange={(e)=>
setForm({
...form,
free_variant_id:e.target.value,
})
}
>

<option>

Select Free Variant

</option>

{freeVariants.map((v)=>(

<option
key={v.id}
value={v.id}
>

{v.variant_label}

₹{v.price}

</option>

))}

</select>

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Save Offer
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow">
  <h3 className="font-semibold mb-4 text-lg">
    Existing Offers
  </h3>

  <div className="overflow-x-auto">
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Offer</th>
          <th className="border p-2">Buy Product</th>
          <th className="border p-2">Buy Qty</th>
          <th className="border p-2">Free Product</th>
          <th className="border p-2">Free Qty</th>
          <th className="border p-2">Action</th>
        </tr>
      </thead>

      <tbody>
        {offers.map((offer) => (
          <tr key={offer.id}>
            <td className="border p-2">
              {offer.title}
            </td>

            <td className="border p-2">
  <div>{offer.buy_product_name}</div>
  {offer.buy_variant_label && (
    <div className="text-xs text-gray-500">
      {offer.buy_variant_label}
    </div>
  )}
</td>

            <td className="border p-2 text-center">
              {offer.buy_qty}
            </td>

            <td className="border p-2">
  <div>{offer.free_product_name}</div>
  {offer.free_variant_label && (
    <div className="text-xs text-gray-500">
      {offer.free_variant_label}
    </div>
  )}
</td>

            <td className="border p-2 text-center">
              {offer.free_qty}
            </td>

            <td className="border p-2 text-center">
              <button
                onClick={() =>
                  handleDelete(offer.id)
                }
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {offers.length === 0 && (
      <p className="text-center py-4 text-gray-500">
        No offers available
      </p>
    )}
  </div>
</div>
    </div>
  );
}