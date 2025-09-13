import React from "react";
import step1Img from "../assets/image.png";
import step2Img from "../assets/image1.png";
import step3Img from "../assets/image2.png";
import step4Img from "../assets/image3.png";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Upload Your Image",
      description:
        "Take a selfie or upload your photo to start creating your personalized fashion experience.",
      image: step1Img,
    },
    {
      id: 2,
      title: "Pick Your Topwear",
      description:
        "Browse through our curated collection of tops, blouses, and shirts that match your style.",
      image: step2Img,
    },
    {
      id: 3,
      title: "Choose Your Bottomwear",
      description:
        "Select the perfect pair of pants, skirts, or shorts to complete your outfit.",
      image: step3Img,
    },
    {
      id: 4,
      title: "Experiment & Finalize",
      description:
        "Mix and match different pieces until you find the perfect outfit that suits you.",
      image: step4Img,
    },
  ];

  return (
    <div className="py-16 sm:py-20 ">
      <div className="text-center mb-12 sm:mb-20 px-4">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-pink-600 tracking-wide">
          How It Works
        </h2>
        <div className="w-20 sm:w-28 md:w-32 h-1 mx-auto bg-pink-300 rounded-full mt-4 shadow-md"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center text-center transition transform hover:scale-105 hover:shadow-3xl"
          >
            <div className="w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 mb-4 sm:mb-6 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={step.image}
                alt={`step-${step.id}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-400 mb-1 sm:mb-2">
              Step {step.id}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-pink-600 mb-1 sm:mb-2 italic">
              {step.title}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base md:text-base italic">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;


