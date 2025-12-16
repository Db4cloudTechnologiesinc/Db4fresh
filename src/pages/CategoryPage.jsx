import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

export default function CategoryPage(){
  const { name } = useParams();
  const items = useSelector(s=>s.products.items);
  const filtered = items.filter(p=> p.title.toLowerCase().includes(name.toLowerCase()));
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{name} Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filtered.map(p=> <ProductCard key={p._id} p={p} />)}
      </div>
    </div>
  );
}


