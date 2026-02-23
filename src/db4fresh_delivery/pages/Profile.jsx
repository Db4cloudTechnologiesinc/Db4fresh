// export default function Profile() {
//   return (
//     <div>
//       <h2>Profile Page</h2>
//     </div>
//   );
// }
export default function Profile() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold">Vemula Swetha</h2>
        <p className="text-gray-500">Partner since Jan 2026</p>
      </div>

      <div className="bg-white shadow rounded-xl p-6 space-y-3">

        <p className="border-b pb-2">My Store Location</p>
        <p className="border-b pb-2">Slot History</p>
        <p className="border-b pb-2">Order History</p>
        <p className="border-b pb-2">Help & Support</p>
        <p className="border-b pb-2">Documents</p>
        <p>Logout</p>

      </div>
    </div>
  );
}
