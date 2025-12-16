export default function Footer() {
  return (
    <footer className="bg-red-600 shadow-md text-white">
      <div className="container py-6 text-sm text-white-600">
 
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
 
          <div>
            <h3 className="font-semibold text-white-800 mb-2">db4Fresh</h3>
            <p>Fast delivery in minutes</p>
          </div>
 
          <div>
            <h3 className="font-semibold text-white-800 mb-2">Company</h3>
            <ul className="space-y-1">
              <li>About</li>
              <li>Careers</li>
              <li>Help</li>
            </ul>
          </div>
 
          <div>
            <h3 className="font-semibold text-white-800 mb-2">Categories</h3>
            <ul className="space-y-1">
                <li>Home</li>
              <li>All</li>
              <li>Groceries</li>
              <li>Fashion</li>
              <li>Electronics</li>
              <li>Dairy</li>
              <li>Snacks</li>
            </ul>
          </div>
 
          <div>
            <h3 className="font-semibold text-white-800 mb-2">Contact</h3>
            <ul className="space-y-1">
              <li>support@db4fresh.com</li>
              <li>+91 1234567890</li>
              <li>Chennai, India</li>
            </ul>
          </div>
 
        </div>
 
        <p className="text-center mt-6 text-xs">
          © {new Date().getFullYear()} db4fresh  • All rights reserved.
        </p>
 
      </div>
    </footer>
  );
}
 