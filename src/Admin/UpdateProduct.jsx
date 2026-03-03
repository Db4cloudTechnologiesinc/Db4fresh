
 
// // import { useEffect, useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
 
// // export default function UpdateProduct() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
 
// //   /* ================= STATES ================= */
// //   const [product, setProduct] = useState({
// //     name: "",
// //     category: "",
// //     description: "",
// //     manufacture_date: "",
// //     expiry_date: "",
// //   });
 
// //   const [variants, setVariants] = useState([]);
// //   const [removedVariantIds, setRemovedVariantIds] = useState([]);
 
// //   const [existingImages, setExistingImages] = useState([]);
// //   const [newImages, setNewImages] = useState([]);
 
// //   /* ================= LOAD PRODUCT ================= */
// //   useEffect(() => {
// //     fetch(`http://localhost:4000/api/products/${id}`)
// //       .then(res => res.json())
// //       .then(data => {
// //         setProduct({
// //           name: data.name || "",
// //           category: data.category || "",
// //           description: data.description || "",
// //           manufacture_date: data.manufacture_date?.split("T")[0] || "",
// //           expiry_date: data.expiry_date?.split("T")[0] || "",
// //         });
 
// //         setVariants(data.variants || []);
// //         setExistingImages(data.images || []);
// //       });
// //   }, [id]);
 
// //   /* ================= IMAGE HANDLERS ================= */
// //   const removeImage = (index) => {
// //     const copy = [...existingImages];
// //     copy.splice(index, 1);
// //     setExistingImages(copy);
// //   };
 
// //   const handleNewImages = (e) => {
// //     setNewImages(Array.from(e.target.files));
// //   };
 
// //   /* ================= VARIANT HANDLERS ================= */
// //   const updateVariant = (i, field, value) => {
// //     const copy = [...variants];
// //     copy[i][field] = value;
// //     setVariants(copy);
// //   };
 
// //   const addVariant = () => {
// //     setVariants([
// //       ...variants,
// //       { id: null, variant_label: "", price: "", stock: "", mrp: "" },
// //     ]);
// //   };
 
// //   const removeVariant = (index) => {
// //     const variant = variants[index];
 
// //     if (variant.id) {
// //       setRemovedVariantIds([...removedVariantIds, variant.id]);
// //     }
 
// //     setVariants(variants.filter((_, i) => i !== index));
// //   };
 
// //   /* ================= UPDATE PRODUCT ================= */
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
 
// //     let images = existingImages;
 
// //     // Upload new images
// //     if (newImages.length > 0) {
// //       const formData = new FormData();
// //       newImages.forEach(img => formData.append("images", img));
 
// //       const res = await fetch(
// //         "http://localhost:4000/api/products/upload",
// //         { method: "POST", body: formData }
// //       );
 
// //       const data = await res.json();
// //       images = [...images, ...(data.images || [])];
// //     }
 
// //     const payload = {
// //       ...product,
// //       images,
// //       variants: variants.map(v => ({
// //         id: v.id,
// //         variant_label: v.variant_label,
// //         price: Number(v.price),
// //         mrp: v.mrp ? Number(v.mrp) : null,
// //         stock: Number(v.stock),
// //       })),
// //       removedVariantIds,
// //     };
 
// //     const res = await fetch(
// //       `http://localhost:4000/api/products/${id}`,
// //       {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       }
// //     );
 
// //     if (res.ok) {
// //       alert("✅ Product updated successfully");
// //       navigate("/admin/products");
// //     } else {
// //       alert("Update failed");
// //     }
// //   };
 
// //   /* ================= UI ================= */
// //   return (
// //     <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
// //       <h2 className="text-xl font-semibold mb-4">Update Product</h2>
 
// //       <form onSubmit={handleSubmit} className="space-y-4">
 
// //         <input
// //           className="border p-2 w-full"
// //           placeholder="Product Name"
// //           value={product.name}
// //           onChange={e => setProduct({ ...product, name: e.target.value })}
// //         />
 
// //         <textarea
// //           className="border p-2 w-full"
// //           placeholder="Description"
// //           value={product.description}
// //           onChange={e => setProduct({ ...product, description: e.target.value })}
// //         />
 
// //         <div className="grid grid-cols-2 gap-2">
// //           <input type="date" value={product.manufacture_date}
// //             onChange={e => setProduct({ ...product, manufacture_date: e.target.value })} />
// //           <input type="date" value={product.expiry_date}
// //             onChange={e => setProduct({ ...product, expiry_date: e.target.value })} />
// //         </div>
 
// //         {/* EXISTING IMAGES */}
// //         <div className="flex gap-2 flex-wrap">
// //           {existingImages.map((img, i) => (
// //             <div key={i} className="relative">
// //               <img
// //                 src={img.url || img}
// //                 className="w-20 h-20 rounded border"
// //                 alt=""
// //               />
// //               <button
// //                 type="button"
// //                 onClick={() => removeImage(i)}
// //                 className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1"
// //               >
// //                 ✕
// //               </button>
// //             </div>
// //           ))}
// //         </div>
 
// //         <input type="file" multiple onChange={handleNewImages} />
 
// //         {/* VARIANTS */}
// //         <div className="flex justify-between items-center mt-4">
// //           <h3 className="font-semibold">Variants</h3>
// //           <button
// //             type="button"
// //             onClick={addVariant}
// //             className="text-green-600 text-sm"
// //           >
// //             + Add Variant
// //           </button>
// //         </div>
 
// //         {variants.map((v, i) => (
// //           <div key={i} className="grid grid-cols-4 gap-2">
// //             <input
// //               placeholder="Label"
// //               value={v.variant_label}
// //               onChange={e => updateVariant(i, "variant_label", e.target.value)}
// //             />
// //             <input
// //               type="number"
// //               placeholder="Price"
// //               value={v.price}
// //               onChange={e => updateVariant(i, "price", e.target.value)}
// //             />
// //             <input
// //               type="number"
// //               placeholder="Stock"
// //               value={v.stock}
// //               onChange={e => updateVariant(i, "stock", e.target.value)}
// //             />
// //             <button
// //               type="button"
// //               onClick={() => removeVariant(i)}
// //               className="text-red-600"
// //             >
// //               Remove
// //             </button>
// //           </div>
// //         ))}
 
// //         <button className="bg-pink-600 text-white py-2 rounded w-full">
// //           Update Product
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

  
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
 
// export default function UpdateProduct() {
//   const { id } = useParams();
//   const navigate = useNavigate();
 
//   /* ================= STATES ================= */
//   const [product, setProduct] = useState({
//     name: "",
//     category_id: "",
//     subcategory_id: "",
//     description: "",
//     manufacture_date: "",
//     expiry_date: "",
//   });
 
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
 
//   const [variants, setVariants] = useState([]);
//   const [removedVariantIds, setRemovedVariantIds] = useState([]);
 
//   const [existingImages, setExistingImages] = useState([]);
//   const [newImages, setNewImages] = useState([]);
 
//   /* ================= LOAD CATEGORIES ================= */
//   useEffect(() => {
//     fetch("http://localhost:4000/api/categories")
//       .then(res => res.json())
//       .then(setCategories);
//   }, []);
 
//   /* ================= LOAD PRODUCT ================= */
//   useEffect(() => {
//     fetch(`http://localhost:4000/api/products/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         setProduct({
//           name: data.name || "",
//           category_id: data.category_id || "",
//           subcategory_id: data.subcategory_id || "",
//           description: data.description || "",
//           manufacture_date: data.manufacture_date?.split("T")[0] || "",
//           expiry_date: data.expiry_date?.split("T")[0] || "",
//         });
 
//         setVariants(
//           (data.variants || []).map(v => ({
//             ...v,
//             price: v.price ?? "",
//             stock: v.stock ?? "",
//             mrp: v.mrp ?? "",
//           }))
//         );
 
//         setExistingImages(Array.isArray(data.images) ? data.images : []);
//       });
//   }, [id]);
 
//   /* ================= LOAD SUBCATEGORIES ================= */
//   useEffect(() => {
//     if (!product.category_id) {
//       setSubCategories([]);
//       return;
//     }
 
//     fetch(
//       `http://localhost:4000/api/subcategories/${product.category_id}`
//     )
//       .then(res => res.json())
//       .then(setSubCategories);
//   }, [product.category_id]);
 
//   /* ================= IMAGE HANDLERS ================= */
//   const removeImage = (index) => {
//     setExistingImages(prev => prev.filter((_, i) => i !== index));
//   };
 
//   const handleNewImages = (e) => {
//     setNewImages(Array.from(e.target.files));
//   };
 
//   /* ================= VARIANT HANDLERS ================= */
//   const updateVariant = (i, field, value) => {
//     const copy = [...variants];
//     copy[i][field] = value;
//     setVariants(copy);
//   };
 
//   const addVariant = () => {
//     setVariants([
//       ...variants,
//       { id: null, variant_label: "", price: "", stock: "", mrp: "" },
//     ]);
//   };
 
//   const removeVariant = (index) => {
//     const v = variants[index];
//     if (v.id) setRemovedVariantIds(prev => [...prev, v.id]);
//     setVariants(prev => prev.filter((_, i) => i !== index));
//   };
 
//   /* ================= UPDATE PRODUCT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
 
//     let images = [...existingImages];
 
//     if (newImages.length > 0) {
//       const fd = new FormData();
//       newImages.forEach(img => fd.append("images", img));
 
//       const res = await fetch(
//         "http://localhost:4000/api/products/upload",
//         { method: "POST", body: fd }
//       );
 
//       const data = await res.json();
//       if (data.images?.length) {
//         images = [...images, ...data.images];
//       }
//     }
 
//     const safeVariants = variants.map(v => ({
//       id: v.id,
//       variant_label: v.variant_label,
//       price: v.price === "" ? null : Number(v.price),
//       mrp: v.mrp === "" ? null : Number(v.mrp),
//       stock: v.stock === "" ? null : Number(v.stock),
//     }));
 
//     const payload = {
//       name: product.name,
//       category_id: Number(product.category_id),
//       subcategory_id: Number(product.subcategory_id),
//       description: product.description,
//       manufacture_date: product.manufacture_date,
//       expiry_date: product.expiry_date,
//       images,
//       variants: safeVariants,
//       removedVariantIds,
//     };
 
//     const res = await fetch(
//       `http://localhost:4000/api/products/${id}`,
//       {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }
//     );
 
//     if (res.ok) {
//       alert("✅ Product updated successfully");
//       navigate("/admin/products");
//     } else {
//       alert("❌ Update failed");
//     }
//   };
 
//   /* ================= UI ================= */
//   return (
//     <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
//       <h2 className="text-xl font-semibold mb-4">
//         Update Product
//       </h2>
 
//       <form onSubmit={handleSubmit} className="space-y-4">
 
//         <input
//           className="border p-2 w-full"
//           placeholder="Product Name"
//           value={product.name}
//           onChange={e =>
//             setProduct({ ...product, name: e.target.value })
//           }
//         />
 
//         {/* CATEGORY */}
//         <select
//           className="border p-2 w-full"
//           value={product.category_id}
//           onChange={e =>
//             setProduct({
//               ...product,
//               category_id: e.target.value,
//               subcategory_id: "",
//             })
//           }
//           required
//         >
//           <option value="">Select Category</option>
//           {categories.map(c => (
//             <option key={c.id} value={c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
 
//         {/* SUBCATEGORY */}
//         <select
//           className="border p-2 w-full"
//           value={product.subcategory_id}
//           onChange={e =>
//             setProduct({
//               ...product,
//               subcategory_id: e.target.value,
//             })
//           }
//           disabled={!product.category_id}
//           required
//         >
//           <option value="">
//             {product.category_id
//               ? "Select Subcategory"
//               : "Select Category First"}
//           </option>
 
//           {subCategories.map(s => (
//             <option key={s.id} value={s.id}>
//               {s.name}
//             </option>
//           ))}
//         </select>
 
//         <textarea
//           className="border p-2 w-full"
//           placeholder="Description"
//           value={product.description}
//           onChange={e =>
//             setProduct({ ...product, description: e.target.value })
//           }
//         />
 
//         <div className="grid grid-cols-2 gap-2">
//           <input
//             type="date"
//             value={product.manufacture_date}
//             onChange={e =>
//               setProduct({
//                 ...product,
//                 manufacture_date: e.target.value,
//               })
//             }
//           />
//           <input
//             type="date"
//             value={product.expiry_date}
//             onChange={e =>
//               setProduct({
//                 ...product,
//                 expiry_date: e.target.value,
//               })
//             }
//           />
//         </div>
 
//         {/* EXISTING IMAGES */}
//         <div className="flex gap-2 flex-wrap">
//           {existingImages.map((img, i) => (
//             <div key={i} className="relative">
//               <img
//                 src={img.url || img}
//                 className="w-20 h-20 rounded border"
//                 alt=""
//               />
//               <button
//                 type="button"
//                 onClick={() => removeImage(i)}
//                 className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1"
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>
 
//         <input type="file" multiple onChange={handleNewImages} />
 
//         {/* VARIANTS */}
//         <div className="flex justify-between items-center mt-4">
//           <h3 className="font-semibold">Variants</h3>
//           <button
//             type="button"
//             onClick={addVariant}
//             className="text-green-600 text-sm"
//           >
//             + Add Variant
//           </button>
//         </div>
 
//         {variants.map((v, i) => (
//           <div key={i} className="grid grid-cols-4 gap-2">
//             <input
//               placeholder="Label"
//               value={v.variant_label}
//               onChange={e =>
//                 updateVariant(i, "variant_label", e.target.value)
//               }
//             />
//             <input
//               type="number"
//               placeholder="Price"
//               value={v.price}
//               onChange={e =>
//                 updateVariant(i, "price", e.target.value)
//               }
//             />
//             <input
//               type="number"
//               placeholder="Stock"
//               value={v.stock}
//               onChange={e =>
//                 updateVariant(i, "stock", e.target.value)
//               }
//             />
//             <button
//               type="button"
//               onClick={() => removeVariant(i)}
//               className="text-red-600"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
 
//         <button className="bg-red-600 text-white py-2 rounded w-full">
//           Update Product
//         </button>
//       </form>
//     </div>
//   );
// }
 
 import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
 
export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  /* ================= STATES ================= */
  const [product, setProduct] = useState({
    name: "",
    category_id: "",
    subcategory_id: "",

  /* ================= STATES ================= */
  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    manufacture_date: "",
    expiry_date: "",
  });
 
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
 
  const [variants, setVariants] = useState([]);
  const [removedVariantIds, setRemovedVariantIds] = useState([]);
 
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
 
  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);
 

  const [variants, setVariants] = useState([]);
  const [removedVariantIds, setRemovedVariantIds] = useState([]);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct({
          name: data.name || "",
          category_id: data.category_id || "",
          subcategory_id: data.subcategory_id || "",
          category: data.category || "",
          description: data.description || "",
          manufacture_date: data.manufacture_date?.split("T")[0] || "",
          expiry_date: data.expiry_date?.split("T")[0] || "",
        });
 
        setVariants(
          (data.variants || []).map(v => ({
            id: v.id,
            variant_label: v.variant_label || "",
            price: v.price ?? "",
            mrp: v.mrp ?? "",
            stock: v.stock ?? "",
          }))
        );
 
        setExistingImages(Array.isArray(data.images) ? data.images : []);
      })
      .catch(console.error);
  }, [id]);
 
  /* ================= LOAD SUBCATEGORIES ================= */
  useEffect(() => {
    if (!product.category_id) {
      setSubCategories([]);
      return;
    }
 
    fetch(`http://localhost:4000/api/subcategories/${product.category_id}`)
      .then(res => res.json())
      .then(setSubCategories)
      .catch(console.error);
  }, [product.category_id]);
 
  /* ================= IMAGE HANDLERS ================= */
  const removeImage = index => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };
 
  const handleNewImages = e => {
    setNewImages(Array.from(e.target.files));
  };
 
  /* ================= VARIANT HANDLERS ================= */
  const updateVariant = (index, field, value) => {
    const copy = [...variants];
    copy[index][field] = value;
    setVariants(copy);
  };
 
  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      { id: null, variant_label: "", price: "", mrp: "", stock: "" },
    ]);
  };
 
  const removeVariant = index => {
    const v = variants[index];
    if (v.id) setRemovedVariantIds(prev => [...prev, v.id]);
    setVariants(prev => prev.filter((_, i) => i !== index));
  };
 
  /* ================= UPDATE PRODUCT ================= */
  const handleSubmit = async e => {
    e.preventDefault();
 
    let images = [...existingImages];
 
    /* UPLOAD NEW IMAGES */
    if (newImages.length > 0) {
      const fd = new FormData();
      newImages.forEach(img => fd.append("images", img));
 
      const res = await fetch(
        "http://localhost:4000/api/products/upload",
        { method: "POST", body: fd }
      );
      const data = await res.json();
      if (data.images?.length) {
        images = [...images, ...data.images];
      }
    }
 
    /* SAFE VARIANTS */
    const safeVariants = variants.map(v => ({
      id: v.id,
      variant_label: v.variant_label,
      price: v.price === "" ? null : Number(v.price),
      mrp: v.mrp === "" ? null : Number(v.mrp),
      stock: v.stock === "" ? null : Number(v.stock),
    }));
 
    const payload = {
      name: product.name,
      category_id: Number(product.category_id),
      subcategory_id: Number(product.subcategory_id),
      description: product.description,
      manufacture_date: product.manufacture_date,
      expiry_date: product.expiry_date,
      images,
      variants: safeVariants,
      removedVariantIds,
    };
 
    console.log("UPDATE PAYLOAD 👉", payload);
 

        setVariants(data.variants || []);
        setExistingImages(data.images || []);
      });
  }, [id]);

  /* ================= IMAGE HANDLERS ================= */
  const removeImage = (index) => {
    const copy = [...existingImages];
    copy.splice(index, 1);
    setExistingImages(copy);
  };

  const handleNewImages = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  /* ================= VARIANT HANDLERS ================= */
  const updateVariant = (i, field, value) => {
    const copy = [...variants];
    copy[i][field] = value;
    setVariants(copy);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: null, variant_label: "", price: "", stock: "", mrp: "" },
    ]);
  };

  const removeVariant = (index) => {
    const variant = variants[index];

    if (variant.id) {
      setRemovedVariantIds([...removedVariantIds, variant.id]);
    }

    setVariants(variants.filter((_, i) => i !== index));
  };

  /* ================= UPDATE PRODUCT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let images = existingImages;

    // Upload new images
    if (newImages.length > 0) {
      const formData = new FormData();
      newImages.forEach(img => formData.append("images", img));

      const res = await fetch(
        "http://localhost:4000/api/products/upload",
        { method: "POST", body: formData }
      );

      const data = await res.json();
      images = [...images, ...(data.images || [])];
    }

    const payload = {
      ...product,
      images,
      variants: variants.map(v => ({
        id: v.id,
        variant_label: v.variant_label,
        price: Number(v.price),
        mrp: v.mrp ? Number(v.mrp) : null,
        stock: Number(v.stock),
      })),
      removedVariantIds,
    };

    const res = await fetch(
      `http://localhost:4000/api/products/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
 
    const data = await res.json();
 

    if (res.ok) {
      alert("✅ Product updated successfully");
      navigate("/admin/products");
    } else {
      alert(data.message || "❌ Update failed");
    }
  };
 
      alert("Update failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Update Product</h2>
 
      <form onSubmit={handleSubmit} className="space-y-4">
 

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="border p-2 w-full"
          placeholder="Product Name"
          value={product.name}
          onChange={e => setProduct({ ...product, name: e.target.value })}
          required
        />
 
        <select
          className="border p-2 w-full"
          value={product.category_id}
          onChange={e =>
            setProduct({
              ...product,
              category_id: e.target.value,
              subcategory_id: "",
            })
          }
          required
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
 
        <select
          className="border p-2 w-full"
          value={product.subcategory_id}
          onChange={e =>
            setProduct({ ...product, subcategory_id: e.target.value })
          }
          disabled={!product.category_id}
          required
        >
          <option value="">
            {product.category_id ? "Select Subcategory" : "Select Category First"}
          </option>
          {subCategories.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
 

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={product.description}
          onChange={e =>
            setProduct({ ...product, description: e.target.value })
          }
        />
 
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={product.manufacture_date}
            onChange={e =>
              setProduct({ ...product, manufacture_date: e.target.value })
            }
          />
          <input
            type="date"
            value={product.expiry_date}
            onChange={e =>
              setProduct({ ...product, expiry_date: e.target.value })
            }
          />
        </div>
 
        {/* IMAGES */}
        <div className="flex gap-2 flex-wrap">
          {existingImages.map((img, i) => {
  const imageUrl =
    typeof img === "string"
      ? `http://localhost:4000${img}`
      : `http://localhost:4000${img.url}`;

  return (
    <div key={i} className="relative">
      <img
        src={imageUrl}
        className="w-20 h-20 rounded border object-cover"
        alt="product"
      />
      <button
        type="button"
        onClick={() => removeImage(i)}
        className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1"
      >
        ✕
      </button>
    </div>
  );
})}

        </div>
 
        <input type="file" multiple onChange={handleNewImages} />
 
          onChange={e => setProduct({ ...product, description: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={product.manufacture_date}
            onChange={e => setProduct({ ...product, manufacture_date: e.target.value })} />
          <input type="date" value={product.expiry_date}
            onChange={e => setProduct({ ...product, expiry_date: e.target.value })} />
        </div>

        {/* EXISTING IMAGES */}
        <div className="flex gap-2 flex-wrap">
          {existingImages.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img.url || img}
                className="w-20 h-20 rounded border"
                alt=""
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <input type="file" multiple onChange={handleNewImages} />

        {/* VARIANTS */}
        <div className="flex justify-between items-center mt-4">
          <h3 className="font-semibold">Variants</h3>
          <button
            type="button"
            onClick={addVariant}
            className="text-green-600 text-sm"
          >
            + Add Variant
          </button>
        </div>
 

        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            <input
              placeholder="Label"
              value={v.variant_label}
              onChange={e =>
                updateVariant(i, "variant_label", e.target.value)
              }
              onChange={e => updateVariant(i, "variant_label", e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={v.price}
              onChange={e => updateVariant(i, "price", e.target.value)}
            />
            <input
              type="number"
              placeholder="Stock"
              value={v.stock}
              onChange={e => updateVariant(i, "stock", e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeVariant(i)}
              className="text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
 
        <button className="bg-red-600 text-white py-2 rounded w-full">

        <button className="bg-pink-600 text-white py-2 rounded w-full">
          Update Product
        </button>
      </form>
    </div>
  );
}
 