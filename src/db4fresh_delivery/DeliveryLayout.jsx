// import Sidebar from "./components/Sidebar";
// import { Outlet } from "react-router-dom";

// export default function DeliveryLayout() {
//   return (
//     <div style={{ display: "flex" }}>
//       <Sidebar />

//       <div style={{ marginLeft: "230px", padding: "30px", width: "100%" }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// }
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DeliveryLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "230px", padding: "30px", width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}
