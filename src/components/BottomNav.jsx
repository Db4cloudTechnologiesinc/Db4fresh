import { Link } from 'react-router-dom';
export default function BottomNav(){
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-light-bg border-t md:hidden z-50">
      <div className="flex justify-around py-2">
        <Link to="/">Home</Link>
        <Link to="/category/Fresh">Categories</Link>
        <Link to="/auth">Search</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/auth">Profile</Link>
      </div>
    </nav>
  );
}
