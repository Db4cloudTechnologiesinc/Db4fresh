import { colors } from "@mui/material"
import { green, purple } from "@mui/material/colors"

export default function OfferStrip(){
  return (
    <div className="bg-gradient-to-r from-red-100 to-darkred-500 py-2" style={{backgroundColor: '#880606ff'}}>
      <div className="container text-center text-sm">
        <strong>Extra 10% off</strong> on first order • Free delivery over ₹199
      </div>
    </div>
  );
}
