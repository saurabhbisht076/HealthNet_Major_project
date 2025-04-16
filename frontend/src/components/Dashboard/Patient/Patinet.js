// import React from "react";
// import Dashboard from "../Dashboard";

// const tabs = [
//   { title: "View Location", redirect: "/dashboard/patient/view-location" },
//   {
//     title: "Book Appointment",
//     redirect: "/dashboard/patient/book-appointment",
//   },
//   { title: "Make Payment", redirect: "/dashboard/patient/make-payment" },
//   { title: "My Appointments", redirect: "/dashboard/patient/my-appointments" },
//   { title: "Prescriptions", redirect: "/dashboard/patient/prescriptions" },
//   { title: "Feedbacks", redirect: "/dashboard/patient/feedbacks" },
// ];

// export default function PatientDash() {
//   return <Dashboard tabs={tabs} />;
// }


import React from "react";
import Dashboard from "../Dashboard";

// Image URLs for patient dashboard tabs (using Unsplash)
const PATIENT_IMAGES = {
  "View Location": 'https://static.vecteezy.com/system/resources/previews/000/153/588/non_2x/vector-roadmap-location-map.jpg',
  "Book Appointment": 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  "Make Payment": 'https://drapersolutions.com/wp-content/uploads/2019/03/payments-image.png',
  "My Appointments": 'https://img.freepik.com/premium-vector/book-doctor-appointment-card-template_151150-11155.jpg?w=2000',
  "Prescriptions": 'https://cdnl.iconscout.com/lottie/premium/preview/prescription-8842208-7195412.png?f=webp',
  "Feedbacks": 'https://techcrunch.com/wp-content/uploads/2015/04/feedback.jpg'
};

const tabs = [
  { 
    title: "View Location", 
    redirect: "/dashboard/patient/view-location",
    image: PATIENT_IMAGES["View Location"],
    description: "Find our clinic locations and get directions for your visit"
  },
  {
    title: "Book Appointment",
    redirect: "/dashboard/patient/book-appointment",
    image: PATIENT_IMAGES["Book Appointment"],
    description: "Schedule your next doctor visit with our specialists"
  },
  { 
    title: "Make Payment", 
    redirect: "/dashboard/patient/make-payment",
    image: PATIENT_IMAGES["Make Payment"],
    description: "Securely pay your medical bills and view payment history"
  },
  { 
    title: "My Appointments", 
    redirect: "/dashboard/patient/my-appointments",
    image: PATIENT_IMAGES["My Appointments"],
    description: "View upcoming and past appointments with your doctors"
  },
  { 
    title: "Prescriptions", 
    redirect: "/dashboard/patient/prescriptions",
    image: PATIENT_IMAGES["Prescriptions"],
    description: "Access your current medications and refill prescriptions"
  },
  { 
    title: "Feedbacks", 
    redirect: "/dashboard/patient/feedbacks",
    image: PATIENT_IMAGES["Feedbacks"],
    description: "Share your experience and help us improve our services"
  },
];

export default function PatientDash() {
  return <Dashboard tabs={tabs} />;
}