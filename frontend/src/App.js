import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Component/navbar'; 
import Login from './Component/LoginPage'; 
import HospitalRegistration from './Component/HospitalRegistration'; 
import PatientDashboard from './Component/PatientDashboard'; 

function App() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger); 

        const canvas = document.querySelector("#canvas");
        const context = canvas.getContext("2d");

        const frames = {
            currentIndex: 0,
            maxIndex: 364
        };

        const images = [];
        let imagesLoaded = 0;

        function preloadImages() {
            for (let i = 1; i <= frames.maxIndex; i++) {
                const imageUrl = `./images22/frame_${i.toString().padStart(4, "0")}.jpeg`;
                const img = new Image();
                img.src = imageUrl;
                img.onload = function() {
                    images.push(img);
                    imagesLoaded++;
                    if (imagesLoaded === frames.maxIndex) {
                        console.log("All images loaded");
                        loadImages(frames.currentIndex);
                        startAnimation();
                        ScrollTrigger.refresh(); 
                    }
                };
            }
        }

        function loadImages(index) {
            if (index >= 0 && index < frames.maxIndex) {
                const img = images[index];
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                const scaleX = canvas.width / img.width;
                const scaleY = canvas.height / img.height;
                const scale = Math.max(scaleX, scaleY);
                const newWidth = img.width * scale;
                const newHeight = img.height * scale;
                const offsetX = (canvas.width - newWidth) / 2;
                const offsetY = (canvas.height - newHeight) / 2;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.imageSmoothingEnabled = true;
                context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
                frames.currentIndex = index;
            }
        }

        function startAnimation() {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".parent",
                    start: "top top",
                    scrub: 2,
                    end: "bottom bottom"
                }
            });

            tl.to(frames, {
                currentIndex: frames.maxIndex,
                onUpdate: function() {
                    loadImages(Math.floor(frames.currentIndex));
                }
            });
        }

        const handleResize = () => {
            loadImages(Math.floor(frames.currentIndex));
            ScrollTrigger.refresh(); 
        };

        window.addEventListener("resize", handleResize);

        preloadImages(); 

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="w-full bg-zinc-900">
            <Navbar />
            
            {/* Include Hospital Registration and Patient Dashboard */}
            <HospitalRegistration />
            <PatientDashboard patientId="12345" /> {/* Replace with actual patient ID */}

            <div className="parent relative w-full h-[1400vh]">
                <div className="w-full sticky top-0 left-0 h-screen">
                    <canvas className="w-full h-screen" id="canvas"></canvas>
                </div>
            </div>
            
            <div className="fixed top-28 left-14 w-80 overflow-y-auto z-20">
                <div className="backdrop-blur-lg bg-white/20 p-4 shadow-lg rounded-lg">
                    <Login />
                </div>
            </div>
        </div>
    );
}

export default App;