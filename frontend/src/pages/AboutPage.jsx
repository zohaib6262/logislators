import { Loader2 } from "lucide-react";
import React, { useContext } from "react";
import { useFetchAboutPage } from "../hooks/aboutPage/useAboutPage";
import { TokenContext } from "@/store/TokenContextProvider";

const AboutPage = () => {
  const { aboutData, isLoading, error } = useFetchAboutPage();
  const { primaryColor } = useContext(TokenContext);

  const LoadingSpinner = () => (
    <div
      className="flex justify-center py-10 animate-pulse"
      style={{ color: primaryColor }}
    >
      <Loader2 className="mr-2 animate-spin" />
      Loading about us page...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {isLoading && <LoadingSpinner />}

      {aboutData?.enableAboutusHeader && (
        <div
          className="pt-24 pb-16"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${primaryColor})`,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {aboutData?.title || " "}
              </h1>
              <p className="text-xl opacity-90 mb-8">
                {aboutData?.description || ""}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {aboutData?.labelMission}
          </h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            {aboutData?.mission || " "}
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {aboutData?.labelWhatWeDo}
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {aboutData?.whatWeDo || " "}
          </p>

          <ul className="list-disc pl-6 mb-8 space-y-2 text-gray-700">
            {aboutData?.bulletPoints?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {aboutData?.labelDataInfo}
          </h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            {aboutData?.dataInfo || " "}
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {aboutData?.labelPrivacy}
          </h2>
          <p className="text-gray-700 mb-8 leading-relaxed">
            {aboutData?.privacy || " "}
          </p>

          <div
            className="border-l-4 p-6 rounded-r-lg"
            style={{
              backgroundColor: `${primaryColor}20`,
              borderColor: primaryColor,
            }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Get Involved
            </h3>
            <p className="text-gray-700 mb-4">{aboutData?.privacy || " "}</p>
            <a
              href={`mailto:${aboutData?.email || ""}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
