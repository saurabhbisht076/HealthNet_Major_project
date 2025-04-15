import React from "react";
import Dashboard from "../Dashboard";

// Image URLs for doctor dashboard tabs (using Unsplash)
const DOCTOR_IMAGES = {
  "Appointments": 'https://img.freepik.com/premium-vector/book-doctor-appointment-card-template_151150-11155.jpg?w=2000',
  "Upload Prescription": 'https://healingclap.com/wp-content/uploads/2024/07/Upload-Prescriprion.webp',
 "Feedbacks": 'https://techcrunch.com/wp-content/uploads/2015/04/feedback.jpg'

};

const tabs = [
  { 
    title: "Appointments", 
    redirect: "/dashboard/doctor/appointments",
    image: DOCTOR_IMAGES["Appointments"],
    description: "View and manage your patient appointments schedule"
  },
  {
    title: "Upload Prescription",
    redirect: "/dashboard/doctor/upload-prescription",
    image: DOCTOR_IMAGES["Upload Prescription"],
    description: "Digitally prescribe medications and treatments for patients"
  },
  { 
    title: "Feedbacks", 
    redirect: "/dashboard/doctor/feedbacks",
    image: DOCTOR_IMAGES["Feedbacks"],
    description: "Review patient feedback and satisfaction ratings"
  },
];

export default function DoctorDash() {
  return <Dashboard tabs={tabs} />;
}