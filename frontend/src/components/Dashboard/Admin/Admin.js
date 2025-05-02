// import React from "react";
// import Dashboard from "../Dashboard";

// const tabs = [
//   { title: "List of Doctors", redirect: "/dashboard/admin/doc-list" },
//   { title: "List of Staffs", redirect: "/dashboard/admin/staff-list" },
//   { title: "Generate Stats", redirect: "/dashboard/admin/generate-stats" },
//   { title: "Verify User", redirect: "/dashboard/admin/verify-user" },
//   { title: "Feedbacks", redirect: "/dashboard/admin/feedbacks" },
// ];

// export default function AdminDash() {
//   return <Dashboard tabs={tabs} />;
// }


import React from "react";
import Dashboard from "../Dashboard";

// Image URLs for admin dashboard tabs
const ADMIN_IMAGES = {
  "List of Doctors": 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  "List of Staffs": 'https://as2.ftcdn.net/v2/jpg/04/65/67/59/1000_F_465675945_NnAqE6nOW8nezQnLiQUcFj5DA65Of7l0.jpg',
  "Generate Stats": 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  "Verify User": 'https://static.vecteezy.com/system/resources/previews/036/030/346/original/person-verified-user-illustration-vector.jpg',
  "Feedbacks": 'https://techcrunch.com/wp-content/uploads/2015/04/feedback.jpg'
};

const tabs = [
  { 
    title: "List of Doctors", 
    redirect: "/dashboard/admin/doc-list",
    image: ADMIN_IMAGES["List of Doctors"],
    description: "Manage all medical practitioners - view profiles, specialties, and schedules"
  },
  { 
    title: "List of Staffs", 
    redirect: "/dashboard/admin/staff-list",
    image: ADMIN_IMAGES["List of Staffs"],
    description: "Access complete staff directory with roles, departments, and contact information"
  },
  { 
    title: "Generate Stats", 
    redirect: "/dashboard/admin/generate-stats",
    image: ADMIN_IMAGES["Generate Stats"],
    description: "Create comprehensive reports and visualize key healthcare metrics"
  },
  { 
    title: "Verify User", 
    redirect: "/dashboard/admin/verify-user",
    image: ADMIN_IMAGES["Verify User"],
    description: "Review and authenticate new user registrations and access requests"
  },
  { 
    title: "Feedbacks", 
    redirect: "/dashboard/admin/feedbacks",
    image: ADMIN_IMAGES["Feedbacks"],
    description: "Analyze patient and staff feedback to improve healthcare services"
  },
];

export default function AdminDash() {
  return <Dashboard tabs={tabs} />;
}