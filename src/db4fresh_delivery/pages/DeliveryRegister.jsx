// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { registerDelivery } from "../services/deliveryApi";

// export default function DeliveryRegister() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const containerRef = useRef(null);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     dob: "",
//     vehicle_type: "",
//     license_number: "",
//     license_expiry: "",
//   });

//   const [licenseImage, setLicenseImage] = useState(null);
//   const [answers, setAnswers] = useState({});

//   // 🔥 TIMER STATES (2 Minutes)
//   const [timeLeft, setTimeLeft] = useState(120);
//   const [isTimeUp, setIsTimeUp] = useState(false);

//   // 🔥 Scroll on step change
//   useEffect(() => {
//     containerRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [step]);

//   // 🔥 Timer Logic
//   useEffect(() => {
//     let timer;

//     if (step === 3 && timeLeft > 0) {
//       timer = setTimeout(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     }

//     if (step === 3 && timeLeft === 0) {
//       setIsTimeUp(true);
//       handleSubmit();
//     }

//     return () => clearTimeout(timer);
//   }, [timeLeft, step]);

//   const calculateAge = (dob) => {
//     const birth = new Date(dob);
//     const today = new Date();
//     return today.getFullYear() - birth.getFullYear();
//   };

//   // ✅ Properly placed formatTime
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
//   };

//   const questions = [
//     {
//       id: 1,
//       question:
//         "You are delivering food and it starts raining heavily. What should you do?",
//       options: [
//         "Drive faster to finish quickly",
//         "Stop safely and wait or drive carefully",
//         "Ignore rain and continue normally",
//         "Cancel delivery",
//       ],
//       correct: "Stop safely and wait or drive carefully",
//     },
//     {
//       id: 2,
//       question:
//         "Customer location is in a narrow street with children playing. What should you do?",
//       options: [
//         "Honk loudly and go fast",
//         "Slow down and drive carefully",
//         "Ignore children",
//         "Reverse immediately",
//       ],
//       correct: "Slow down and drive carefully",
//     },
//     {
//       id: 3,
//       question:
//         "An ambulance is behind you during delivery. What is correct action?",
//       options: [
//         "Continue same speed",
//         "Increase speed",
//         "Give way immediately",
//         "Block the road",
//       ],
//       correct: "Give way immediately",
//     },
//   ];

//   const handleNext = () => {
//     if (step === 2) {
//       setTimeLeft(120); // reset to 2 minutes
//       setIsTimeUp(false);
//     }
//     setStep((prev) => prev + 1);
//   };

//   const handleBack = () => setStep((prev) => prev - 1);

//   const handleSubmit = async () => {
//     if (calculateAge(form.dob) < 18)
//       return alert("You must be 18+ to register.");

//     let score = 0;
//     questions.forEach((q) => {
//       if (answers[q.id] === q.correct) score++;
//     });

//     if (score < 2)
//       return alert("Please answer correctly to proceed.");

//     try {
//       const data = new FormData();
//       Object.keys(form).forEach((key) =>
//         data.append(key, form[key])
//       );
//       data.append("license_image", licenseImage);
//       data.append("verification_score", score);

//       await registerDelivery(data);
//       alert("Registered successfully. Awaiting admin approval.");
//       navigate("/delivery/login");
//     } catch (err) {
//       alert(err.response?.data?.message || "Registration failed");
//     }
//   };

//   const stepVariants = {
//     initial: { opacity: 0, x: 50 },
//     animate: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: -50 },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex justify-center p-6">
//       <div
//         ref={containerRef}
//         className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-3xl"
//       >
//         <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
//           Delivery Partner Onboarding
//         </h2>

//         {/* Progress Bar */}
//         <div className="mb-10">
//           <div className="flex justify-between text-sm font-semibold mb-3">
//             <span className={step >= 1 ? "text-red-600" : "text-gray-400"}>
//               Personal
//             </span>
//             <span className={step >= 2 ? "text-red-600" : "text-gray-400"}>
//               License
//             </span>
//             <span className={step >= 3 ? "text-red-600" : "text-gray-400"}>
//               Driving Test
//             </span>
//           </div>

//           <div className="w-full bg-gray-200 h-2 rounded-full">
//             <div
//               className="bg-red-600 h-2 rounded-full transition-all duration-500"
//               style={{ width: `${(step / 3) * 100}%` }}
//             />
//           </div>
//         </div>

//         <AnimatePresence mode="wait">
//           {step === 1 && (
//             <motion.div
//               key="step1"
//               variants={stepVariants}
//               initial="initial"
//               animate="animate"
//               exit="exit"
//               transition={{ duration: 0.4 }}
//               className="grid md:grid-cols-2 gap-4"
//             >
//               <input placeholder="Full Name" className="p-3 border rounded-lg" onChange={(e) => setForm({ ...form, name: e.target.value })}/>
//               <input placeholder="Phone" className="p-3 border rounded-lg" onChange={(e) => setForm({ ...form, phone: e.target.value })}/>
//               <input placeholder="Email" className="p-3 border rounded-lg" onChange={(e) => setForm({ ...form, email: e.target.value })}/>
//               <input type="password" placeholder="Password" className="p-3 border rounded-lg" onChange={(e) => setForm({ ...form, password: e.target.value })}/>
//               <input type="date" className="p-3 border rounded-lg" onChange={(e) => setForm({ ...form, dob: e.target.value })}/>
//               <select className="p-3 border rounded-lg" onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}>
//                 <option value="">Select Vehicle</option>
//                 <option>Bike</option>
//                 <option>Scooter</option>
//                 <option>EV</option>
//               </select>
//             </motion.div>
//           )}

//           {step === 2 && (
//             <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }} className="space-y-4">
//               <input placeholder="License Number" className="p-3 border rounded-lg w-full" onChange={(e) => setForm({ ...form, license_number: e.target.value })}/>
//               <input type="date" className="p-3 border rounded-lg w-full" onChange={(e) => setForm({ ...form, license_expiry: e.target.value })}/>
//               <div className="border-2 border-dashed border-red-400 p-8 text-center rounded-xl bg-red-50">
//                 <p className="text-sm text-gray-600 mb-3 font-medium">Upload Driving License</p>
//                 <input type="file" onChange={(e) => setLicenseImage(e.target.files[0])}/>
//               </div>
//             </motion.div>
//           )}

//           {step === 3 && (
//             <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">

//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-red-600">
//                   Driving Test
//                 </h3>

//                 <div className={`px-4 py-2 rounded-full text-white font-bold ${
//                   timeLeft <= 10 ? "bg-red-600 animate-pulse" : "bg-gray-800"
//                 }`}>
//                   ⏳ {formatTime(timeLeft)}
//                 </div>
//               </div>

//               {questions.map((q) => (
//                 <div key={q.id} className="bg-red-50 p-5 rounded-xl shadow-sm">
//                   <p className="font-semibold mb-3">{q.question}</p>
//                   <div className="flex flex-col gap-2">
//                     {q.options.map((opt) => (
//                       <button
//                         key={opt}
//                         type="button"
//                         disabled={isTimeUp}
//                         onClick={() =>
//                           setAnswers({ ...answers, [q.id]: opt })
//                         }
//                         className={`p-3 rounded-lg text-left transition ${
//                           answers[q.id] === opt
//                             ? "bg-red-600 text-white"
//                             : "bg-white border hover:bg-gray-100"
//                         }`}
//                       >
//                         {opt}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div className="flex justify-between mt-10">
//           {step > 1 && (
//             <button onClick={handleBack} className="px-5 py-2 bg-gray-300 rounded-lg">
//               Back
//             </button>
//           )}

//           {step < 3 && (
//             <button onClick={handleNext} className="px-6 py-2 bg-red-600 text-white rounded-lg">
//               Next
//             </button>
//           )}

//           {step === 3 && (
//             <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg">
//               Submit Verification
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { registerDelivery } from "../services/deliveryApi";

export default function DeliveryRegister() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    vehicle_type: "",
    license_number: "",
    license_expiry: "",
  });

  const [licenseImage, setLicenseImage] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimeUp, setIsTimeUp] = useState(false);

  /* Scroll */
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  /* Timer */
  useEffect(() => {
    let timer;

    if (step === 3 && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (step === 3 && timeLeft === 0) {
      setIsTimeUp(true);
      handleSubmit();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, step]);

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const questions = [
    {
      id: 1,
      question: "You are delivering food and it starts raining heavily. What should you do?",
      options: [
        "Drive faster to finish quickly",
        "Stop safely and wait or drive carefully",
        "Ignore rain and continue normally",
        "Cancel delivery",
      ],
      correct: "Stop safely and wait or drive carefully",
    },
    {
      id: 2,
      question: "Customer location is in a narrow street with children playing. What should you do?",
      options: [
        "Honk loudly and go fast",
        "Slow down and drive carefully",
        "Ignore children",
        "Reverse immediately",
      ],
      correct: "Slow down and drive carefully",
    },
    {
      id: 3,
      question:
        "An ambulance is behind you during delivery. What is correct action?",
      options: [
        "Continue same speed",
        "Increase speed",
        "Give way immediately",
        "Block the road",
      ],
      correct: "Give way immediately",
    },
  ];

  /* Validation */
  const validateStep1 = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name required";
    if (!form.phone.match(/^[0-9]{10}$/)) newErrors.phone = "Valid 10 digit phone required";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Valid email required";
    if (form.password.length < 6) newErrors.password = "Min 6 characters";
    if (!form.dob || calculateAge(form.dob) < 18) newErrors.dob = "Must be 18+";
    if (!form.vehicle_type) newErrors.vehicle_type = "Select vehicle";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if (!form.license_number.trim()) newErrors.license_number = "License number required";
    if (!form.license_expiry) newErrors.license_expiry = "Expiry date required";
    if (!licenseImage) newErrors.license_image = "Upload license image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;

    if (step === 2) {
      setTimeLeft(120);
      setIsTimeUp(false);
    }

    setErrors({});
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    let score = 0;
    Object.keys(answers).forEach((key) => {
      if (answers[key]) score++;
    });

    if (score < 1) return alert("Answer at least one question.");

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      data.append("license_image", licenseImage);
      data.append("verification_score", score);

      await registerDelivery(data);
      alert("Registered successfully.");
      navigate("/delivery/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex justify-center p-6">
      <div ref={containerRef} className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-3xl">

        <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
          Delivery Partner Onboarding
        </h2>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between text-sm font-semibold mb-3">
            <span className={step >= 1 ? "text-red-600" : "text-gray-400"}>Personal</span>
            <span className={step >= 2 ? "text-red-600" : "text-gray-400"}>License</span>
            <span className={step >= 3 ? "text-red-600" : "text-gray-400"}>Driving Test</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">

          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.4 }} className="grid md:grid-cols-2 gap-4">

              <input placeholder="Full Name" className="p-3 border rounded-lg"
                onChange={(e) => setForm({ ...form, name: e.target.value })}/>
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <input placeholder="Phone" className="p-3 border rounded-lg"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}/>
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

              <input placeholder="Email" className="p-3 border rounded-lg"
                onChange={(e) => setForm({ ...form, email: e.target.value })}/>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input type="password" placeholder="Password" className="p-3 border rounded-lg"
                onChange={(e) => setForm({ ...form, password: e.target.value })}/>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

              <input type="date" className="p-3 border rounded-lg"
                onChange={(e) => setForm({ ...form, dob: e.target.value })}/>
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}

              <select className="p-3 border rounded-lg"
                onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}>
                <option value="">Select Vehicle</option>
                <option>Bike</option>
                <option>Scooter</option>
                <option>EV</option>
              </select>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.4 }} className="space-y-4">

              <input placeholder="License Number" className="p-3 border rounded-lg"
                onChange={(e) => setForm({ ...form, license_number: e.target.value })}/>

              <input type="date" className="p-3 border rounded-lg"
                onChange={(e) => setForm({ ...form, license_expiry: e.target.value })}/>

              <input type="file" onChange={(e) => setLicenseImage(e.target.files[0])}/>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.4 }} className="space-y-6">

              <div className="flex justify-between">
                <h3 className="text-red-600 font-semibold">Driving Test</h3>
                <div className="bg-gray-800 text-white px-4 py-2 rounded-full">
                  ⏳ {formatTime(timeLeft)}
                </div>
              </div>

              {questions.map((q) => (
                <div key={q.id} className="bg-red-50 p-4 rounded-xl">
                  <p className="font-semibold mb-3">{q.question}</p>
                 {q.options.map((opt) => (
  <button
    key={opt}
    type="button"
    disabled={isTimeUp}
    onClick={() =>
      setAnswers({
        ...answers,
        [q.id]: opt,
      })
    }
    className={`block w-full text-left p-3 rounded-lg mb-2 transition ${
      answers[q.id] === opt
        ? "bg-red-600 text-white"
        : "bg-white border hover:bg-gray-100"
    }`}
  >
    {opt}
  </button>
))}

                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>

        <div className="flex justify-between mt-10">
          {step > 1 && (
            <button onClick={handleBack} className="px-5 py-2 bg-gray-300 rounded-lg">
              Back
            </button>
          )}
          {step < 3 && (
            <button onClick={handleNext} className="px-6 py-2 bg-red-600 text-white rounded-lg">
              Next
            </button>
          )}
          {step === 3 && (
            <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg">
              Submit
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
