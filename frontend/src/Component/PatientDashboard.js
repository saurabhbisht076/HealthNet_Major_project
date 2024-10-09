import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientDashboard = ({ patientId }) => {
   const [reports, setReports] = useState([]);
   const [hospitals, setHospitals] = useState([]);
   const [doctors, setDoctors] = useState([]);

   useEffect(() => {
       const fetchReportsAndInfo= async () => {
           try {
               const reportResponse= await axios.get(`https://localhost:5000/api/reports/${patientId}`);
               setReports(reportResponse.data);

               const hospitalResponse= await axios.get(`https://localhost:500/api/hospitals`);
               setHospitals(hospitalResponse.data);

               const doctorResponse= await axios.get(`https://localhost:500/api/doctor`);
               setDoctors(doctorResponse.data);
           } catch (error) {
               console.error('Error fetching data:', error);
           }
       };

       fetchReportsAndInfo();
   }, [patientId]);

   return (
       <div>
           <h2>Your Medical Reports</h2>
           <ul>
               {reports.map(report => (
                   <li key={report._id}>{report.reportData} - {new Date(report.uploadDate).toLocaleDateString()}</li>
               ))}
           </ul>

           <h2>Available Hospitals</h2>
           <ul>
               {hospitals.map(hospital => (
                   <li key={hospital._id}>{hospital.name} - {hospital.location}</li>
               ))}
           </ul>

           <h2>Available Doctors</h2>
           <ul>
               {doctors.map(doctor => (
                   <li key={doctor._id}>{doctor.name} - {doctor.specialty}</li>
               ))}
           </ul>
       </div>
   );
};

export default PatientDashboard;