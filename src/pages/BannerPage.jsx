

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function BannerPage() {
  const { type } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [type]);

 const fetchProducts = async () => {
  try {

    if (type === "offer-zone") {

      const res = await axios.get(
        "http://localhost:4000/api/offers"
      );

      // setProducts(res.data);
      setProducts(
  res.data.map((offer) => ({
    id: offer.buy_product_id,               // ✅ Product ID
    name: offer.buy_product_name,
    image: offer.buy_product_image,
    images: offer.buy_product_images
      ? JSON.parse(offer.buy_product_images)
      : [],
    price: offer.price,
    mrp: offer.mrp,
    stock: offer.stock,
    variant_label: offer.variant_label,

    // Optional offer fields
    title: offer.title,
    buy_qty: offer.buy_qty,
    free_qty: offer.free_qty,
    free_product_name: offer.free_product_name,
  }))
);


    } else {

      const res = await axios.get(
        `http://localhost:4000/api/banner-products/${type}`
      );

      setProducts(res.data);

    }

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">
  {type.replace("-", " ").toUpperCase()}
</h2>

<p className="text-gray-500 mb-6">
  {products.length} Product{products.length !== 1 ? "s" : ""} Found
</p>

      {products.length === 0 ? (

  <div className="w-full flex flex-col items-center justify-center py-20">
    <h2 className="text-2xl font-bold text-gray-700">
      No Products Available
    </h2>

    <p className="text-gray-500 mt-2">
      Please check back later for exciting offers.
    </p>
  </div>

) : (

  <div className="flex flex-wrap gap-4">
    {products.map((product) => (
      <ProductCard
        key={product.id}
        p={product}
      />
    ))}
  </div>

)}
    </div>
  );
}

export default BannerPage;