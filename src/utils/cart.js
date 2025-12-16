// export function addToCart(product) {
//   let cart = JSON.parse(localStorage.getItem("cart")) || [];

//   const exist = cart.find((item) => item.id === product.id);

//   if (exist) {
//     exist.qty += 1;
//   } else {
//     cart.push({
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       image: product.image,
//       qty: 1,
//     });
//   }

//   localStorage.setItem("cart", JSON.stringify(cart));
// }
export const addToCart = (product, quantity = 1) => {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: quantity
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};
