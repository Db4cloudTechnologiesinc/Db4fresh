import { useState, useEffect } from 'react';

const slides = [
  { title:'Get Cigarettes at ₹0 Convenience Fee' },
  { title:'Fresh groceries in 10 minutes' },
  { title:'Lowest prices everyday' },
];

export default function HeroSlider(){
  const [i, setI] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=> setI(v=> (v+1)%slides.length), 4000);
    return ()=> clearInterval(t);
  },[]);
  const s = slides[i];
  return (
    <div className="relative bg-red-50 rounded-xl p-6 flex items-center justify-between ">
      <div>
        <h2 className="text-2xl font-bold text-red-700">{s.title}</h2>
        <p className="mt-2 text-gray-700">Shop now and save</p>
        <button className="mt-4 bg-pink-600 text-white px-4 py-2 rounded p-3 
                       transition-all hover:bg-red-200 cursor-pointer">Order now</button>
      </div>
      
    </div>
  );
}
