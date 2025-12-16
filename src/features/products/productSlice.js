// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../services/api';
// import amul from '../../Assets/amul.jpg';
// import apple from '../../Assets/apple.jpg';
// import banana from '../../Assets/banana.jpg';
// import bread from '../../Assets/bread.jpg';
// import goodday from '../../Assets/goodday.jpg';
// import paneer from '../../Assets/paneer.jpg';



// // try to fetch from backend; otherwise use seeded data
// export const fetchProducts = createAsyncThunk('products/fetch', async ()=>{
//   try {
//     const res = await api.get('/products');
//     return res.data;
//   } catch (e) {
//     // fallback seed
//     return [
//      {_id:'p1', title:'Fresh Banana ',price:49, image:banana, description:'Ripe bananas',category:'fruits',variantPrice:{
//       "1kg": 49,
//       "500g": 25,
//       "250g": 12
//      }
//     },
//       {_id:'p2', title:'Amul Milk ', price:60,image:amul, description:'Full cream milk',category:'milk',variantPrice:
//         {
//           "1L": 60,
//           "500ml": 30,
//           "250ml": 15,
//           "100ml": 10
//         }
//       },
//       {_id:'p3', title:'Good Day Cookies', price:30,image:goodday, description:'Buttery cookies',category:'snacks',variantPrice:
//         {
//          "Small": 15,
//          "Medium": 30,
//          "Large": 60
//         }
//       },
//       {_id:'p4', title:'Paneer ',price:100, image:paneer, description:'Fresh cottage cheese',category:'paneer',variantPrice:
//         {
//           "1kg": 400,
//           "500g": 200,
//           "250g": 100,
//         }
//       },
//       {_id:'p5', title:'Apple', price:250,image:apple, description:'Red apples',category:'fruits',variantPrice:
//         {
//           "1kg": 250,
//           "500g": 130,
//           "250g": 70
//         }
//       },
//       {_id:'p6', title:'Bread - Whole Wheat',price:30, image:bread, description:'Baked fresh daily',category:'bread',variantPrice:
//         {
//           "Large": 90,
//           "Medium": 50,
//           "Small": 30
//         }
//       },
//     ];
//   }
// });

// const slice = createSlice({
//   name:'products',
//   initialState:{ items:[], status:'idle' },
//   reducers:{},
//   extraReducers:(b)=>{
//     b.addCase(fetchProducts.fulfilled, (s,a)=>{ s.items = a.payload; s.status='succeeded'; });
//   }
// });

// export default slice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await api.get("/products");
  // map backend product to frontend shape (title used by UI)
  return res.data.map(p => ({
    id: p.id,
    title: p.name,
    name: p.name,      // keep both
    price: p.price,
    image: p.image,
    description: p.description,
    category: p.category,
    mrp: p.mrp
  }));
});

const slice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (s) => { s.status = "loading"; });
    builder.addCase(fetchProducts.fulfilled, (s, a) => { s.items = a.payload; s.status = "succeeded"; });
    builder.addCase(fetchProducts.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; });
  }
});

export default slice.reducer;
