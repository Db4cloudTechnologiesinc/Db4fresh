export const fetchProducts = async () => {
  const res = await fetch("http://localhost:4000/api/products");
  return res.json();
};
