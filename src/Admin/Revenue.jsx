
// // // import React, { useEffect, useState } from "react";

// // // export default function Revenue() {
// // //   const [data, setData] = useState([]); // MUST be array
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     fetch("http://localhost:4000/api/admin/revenue")
// // //       .then(res => res.json())
// // //       .then(result => {
// // //         // 🔥 SAFETY CHECK
// // //         if (Array.isArray(result)) {
// // //           setData(result);
// // //         } else {
// // //           setData([]); // prevent crash
// // //           console.error("Revenue API did not return array", result);
// // //         }
// // //         setLoading(false);
// // //       })
// // //       .catch(err => {
// // //         console.error(err);
// // //         setLoading(false);
// // //       });
// // //   }, []);

// // //   if (loading) {
// // //     return <p>Loading revenue...</p>;
// // //   }

// // //   // const totalRevenue = data.reduce(
// // //   //   (sum, item) => sum + Number(item.totalRevenue || 0),
// // //   //   0
// // //   // );
// // //   const totalRevenue = data.reduce(
// // //   (sum, item) => sum + Number(item.totalRevenue || 0),
// // //   0
// // // );


// // //   return (
// // //     <div>
// // //       <h1 className="text-2xl font-bold mb-4">Revenue</h1>

// // //       <div className="bg-green-100 p-4 rounded mb-6">
// // //         <p className="text-gray-600">Total Revenue</p>
// // //         <p className="text-3xl font-bold text-green-700">
// // //           ₹{totalRevenue}
// // //         </p>
// // //       </div>

// // //       <table className="w-full border">
// // //         <thead className="bg-gray-100">
// // //           <tr>
// // //             <th className="p-2">Date</th>
// // //             <th className="p-2">Orders</th>
// // //             <th className="p-2">Revenue</th>
// // //           </tr>
// // //         </thead>
// // //         <tbody>
// // //           {data.map((row, index) => (
// // //             <tr key={index} className="border-t">
// // //               <td className="p-2">{row.orderDate}</td>
// // //               <td className="p-2">{row.totalOrders}</td>
// // //               <td className="p-2 text-green-600">
// // //                 ₹{row.totalRevenue}
// // //               </td>
// // //             </tr>
// // //           ))}
// // //         </tbody>
// // //       </table>
// // //     </div>
// // //   );
// // // }
// // export default function Revenue() {
// //   return (
// //     <div className="space-y-6">

// //       {/* Summary */}
// //       <div className="grid grid-cols-4 gap-4">
// //         <Stat title="Total Revenue" value="₹499" />
// //         <Stat title="Total Orders" value="1" />
// //         <Stat title="COD Orders" value="1" />
// //         <Stat title="Online Orders" value="0" />
// //       </div>

// //       {/* Filters */}
// //       <div className="flex gap-3">
// //         <FilterButton label="Today" />
// //         <FilterButton label="Week" />
// //         <FilterButton label="Month" />
// //         <FilterButton label="Year" />
// //       </div>

// //       {/* Table */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <table className="w-full">
// //           <thead className="bg-gray-100">
// //             <tr>
// //               <th className="p-3 text-left">Date</th>
// //               <th className="p-3 text-left">Orders</th>
// //               <th className="p-3 text-left">Revenue</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             <tr className="border-t">
// //               <td className="p-3">23 Dec 2025</td>
// //               <td className="p-3">1</td>
// //               <td className="p-3 font-semibold">₹499</td>
// //             </tr>
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }

// // const Stat = ({ title, value }) => (
// //   <div className="bg-green-100 p-4 rounded-lg">
// //     <p className="text-sm text-gray-600">{title}</p>
// //     <p className="text-xl font-bold">{value}</p>
// //   </div>
// // );

// // const FilterButton = ({ label }) => (
// //   <button className="px-4 py-2 border rounded hover:bg-gray-100">
// //     {label}
// //   </button>
// // );
// // import { useEffect, useState } from "react";

// // export default function Revenue() {
// //   const [stats, setStats] = useState({
// //     totalRevenue: 0,
// //     totalOrders: 0,
// //     codRevenue: 0,
// //     onlineRevenue: 0,
// //   });

// //   useEffect(() => {
// //     fetch("http://localhost:4000/api/admin/revenue")
// //       .then(res => res.json())
// //       .then(data => setStats(data))
// //       .catch(err => console.error(err));
// //   }, []);

// //   return (
// //     <div className="space-y-6">

// //       <h2 className="text-xl font-semibold">Revenue Overview</h2>

// //       {/* Summary Cards */}
// //       <div className="grid grid-cols-4 gap-4">
// //         <Card title="Total Revenue" value={`₹${stats.totalRevenue}`} />
// //         <Card title="Total Orders" value={stats.totalOrders} />
// //         <Card title="COD Revenue" value={`₹${stats.codRevenue}`} />
// //         <Card title="Online Revenue" value={`₹${stats.onlineRevenue}`} />
// //       </div>

// //       {/* Filters (UI only for now) */}
// //       <div className="flex gap-3">
// //         <Filter label="Today" />
// //         <Filter label="Week" />
// //         <Filter label="Month" />
// //         <Filter label="Year" />
// //       </div>

// //       {/* Table */}
// //       <div className="bg-white rounded-lg shadow">
// //         <table className="w-full">
// //           <thead className="bg-gray-100">
// //             <tr>
// //               <th className="p-3 text-left">Metric</th>
// //               <th className="p-3 text-left">Amount</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             <tr className="border-t">
// //               <td className="p-3">Total Revenue</td>
// //               <td className="p-3 font-semibold">₹{stats.totalRevenue}</td>
// //             </tr>
// //             <tr className="border-t">
// //               <td className="p-3">COD Revenue</td>
// //               <td className="p-3">₹{stats.codRevenue}</td>
// //             </tr>
// //             <tr className="border-t">
// //               <td className="p-3">Online Revenue</td>
// //               <td className="p-3">₹{stats.onlineRevenue}</td>
// //             </tr>
// //           </tbody>
// //         </table>
// //       </div>

// //     </div>
// //   );
// // }

// // const Card = ({ title, value }) => (
// //   <div className="bg-green-100 p-4 rounded-lg">
// //     <p className="text-sm text-gray-600">{title}</p>
// //     <p className="text-xl font-bold">{value}</p>
// //   </div>
// // );

// // const Filter = ({ label }) => (
// //   <button className="px-4 py-2 border rounded hover:bg-gray-100">
// //     {label}
// //   </button>
// // );

// import { useEffect, useState } from "react";

// export default function Revenue() {
//   const [stats, setStats] = useState({
//     totalRevenue: 0,
//     totalOrders: 0,
//     codRevenue: 0,
//     onlineRevenue: 0,
//   });

//   useEffect(() => {
//     fetch("http://localhost:4000/api/admin/revenue")
//       .then(res => res.json())
//       .then(data => {
//         setStats({
//           totalRevenue: data.totalRevenue ?? 0,
//           totalOrders: data.totalOrders ?? 0,
//           codRevenue: data.codRevenue ?? 0,
//           onlineRevenue: data.onlineRevenue ?? 0,
//         });
//       })
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold">Revenue Overview</h2>

//       <div className="grid grid-cols-4 gap-4">
//         <Card title="Total Revenue" value={`₹${stats.totalRevenue}`} />
//         <Card title="Total Orders" value={stats.totalOrders} />
//         <Card title="COD Revenue" value={`₹${stats.codRevenue}`} />
//         <Card title="Online Revenue" value={`₹${stats.onlineRevenue}`} />
//       </div>

//       <div className="bg-white rounded-lg shadow">
//         <table className="w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left">Metric</th>
//               <th className="p-3 text-left">Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="border-t">
//               <td className="p-3">Total Revenue</td>
//               <td className="p-3 font-semibold">₹{stats.totalRevenue}</td>
//             </tr>
//             <tr className="border-t">
//               <td className="p-3">COD Revenue</td>
//               <td className="p-3">₹{stats.codRevenue}</td>
//             </tr>
//             <tr className="border-t">
//               <td className="p-3">Online Revenue</td>
//               <td className="p-3">₹{stats.onlineRevenue}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// const Card = ({ title, value }) => (
//   <div className="bg-green-100 p-4 rounded-lg">
//     <p className="text-sm text-gray-600">{title}</p>
//     <p className="text-xl font-bold">{value}</p>
//   </div>
// );
import { useEffect, useState } from "react";

export default function Revenue() {
  const [range, setRange] = useState("all");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    codRevenue: 0,
    onlineRevenue: 0,
  });

  const loadRevenue = (selectedRange) => {
    setRange(selectedRange);

    fetch(`http://localhost:4000/api/admin/revenue?range=${selectedRange}`)
      .then(res => res.json())
      .then(data => {
        setStats({
          totalRevenue: data.totalRevenue ?? 0,
          totalOrders: data.totalOrders ?? 0,
          codRevenue: data.codRevenue ?? 0,
          onlineRevenue: data.onlineRevenue ?? 0,
        });
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadRevenue("all");
  }, []);

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold">Revenue Overview</h2>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Revenue" value={`₹${stats.totalRevenue}`} />
        <Card title="Total Orders" value={stats.totalOrders} />
        <Card title="COD Revenue" value={`₹${stats.codRevenue}`} />
        <Card title="Online Revenue" value={`₹${stats.onlineRevenue}`} />
      </div>

      {/* FILTERS */}
      <div className="flex gap-3">
        <Filter label="Today" active={range==="today"} onClick={() => loadRevenue("today")} />
        <Filter label="Week" active={range==="week"} onClick={() => loadRevenue("week")} />
        <Filter label="Month" active={range==="month"} onClick={() => loadRevenue("month")} />
        <Filter label="Year" active={range==="year"} onClick={() => loadRevenue("year")} />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">Total Revenue</td>
              <td className="p-3 font-semibold">₹{stats.totalRevenue}</td>
            </tr>
            <tr className="border-t">
              <td className="p-3">COD Revenue</td>
              <td className="p-3">₹{stats.codRevenue}</td>
            </tr>
            <tr className="border-t">
              <td className="p-3">Online Revenue</td>
              <td className="p-3">₹{stats.onlineRevenue}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="bg-green-100 p-4 rounded-lg">
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const Filter = ({ label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 border rounded ${
      active ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
    }`}
  >
    {label}
  </button>
);
