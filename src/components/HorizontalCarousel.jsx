export default function HorizontalCarousel({ title, items=[] }){
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 ">{title}</h3>
      <div className="flex gap-3 overflow-x-auto py-2">
        {items.map(it=>(
          <div key={it._id} className="min-w-[160px] bg-white  p-3 
                       transition-all hover:bg-red-300 cursor-pointer">
            <img src={it.image} className="h-28 mx-auto object-contain" />
            <div className="mt-2 text-sm">{it.title}</div>
            <div className="font-bold mt-1">₹{it.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
