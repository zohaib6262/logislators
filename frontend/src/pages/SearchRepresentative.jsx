import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import RepresentativeCard from "../reusableComponents/RepresentativeCard";
import RepresentativeDetails from "../reusableComponents/RepresentativeDetails";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useLegislators from "../hooks/lagislators/useLegislators";
import useUserContactSubmit from "../hooks/userContact/useUserContactSubmit";
import { TokenContext } from "@/store/TokenContextProvider";
import useFetchHomePage from "@/hooks/homePage/useFetchHomePage";

export const SearchRepresentative = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const userInfo = location?.state;
  const street = (searchParams.get("street") || "").replace(/\+/g, " ");
  const city = (searchParams.get("city") || "").replace(/\+/g, " ");
  const state = (searchParams.get("state") || "Nevada").replace(/\+/g, " ");
  const zipCode = (searchParams.get("zipCode") || "").replace(/\+/g, " ");
  const { primaryColor } = useContext(TokenContext);
  const {
    submitUserContact,
    isLoading: isSubmitLoading,
    error: submitError,
    setAssemblyDistrict,
    setStateDistrict,
  } = useUserContactSubmit();
  const { homeData } = useFetchHomePage();
  const fullAddress = `${street} ${city}, ${state} ${zipCode}`;

  const [selectedRepIds, setSelectedRepIds] = useState([]);
  const {
    coords,
    people: representatives,
    isLoading,
    setIsLoading,
    error,
    searchByAddress,
  } = useLegislators();
  const sliderRef = useRef(null);
  useEffect(() => {
    if (street && city && zipCode) {
      searchByAddress(fullAddress);
    }
  }, [street, city, state, zipCode]);

  useEffect(() => {
    if (representatives.length === 0) return;
    if (representatives.length > 0) {
      const senator = representatives.find(
        (rep) =>
          rep.current_role.title?.toLowerCase().includes("senator") &&
          rep.jurisdiction?.classification === "state"
      );
      const assemblyMember = representatives.find(
        (rep) =>
          rep.current_role.title?.toLowerCase().includes("assembly member") &&
          rep.jurisdiction?.classification === "state"
      );
      if (assemblyMember) {
        setAssemblyDistrict(assemblyMember?.current_role?.district || "");
      }
      if (senator) {
        setStateDistrict(senator?.current_role?.district || "");
      }
      // Submit user info if available
      if (userInfo) {
        submitUserContact(userInfo);
      }
      const senators = representatives.filter((rep) => rep.id !== senator?.id);
      const senator2 = senators.find((rep) =>
        rep.current_role.title?.toLowerCase().includes("senator")
      );

      setSelectedRepIds([senator?.id, assemblyMember?.id || senator2?.id]);
    }
    if (
      (representatives.length > 0 && selectedRepIds.length === 0) ||
      selectedRepIds.length === 1
    ) {
      let initialIds;
      if (representatives.length > 0) {
        initialIds = representatives
          .slice(0, Math.min(1, representatives.length))
          .map((rep) => rep.id);
      }
      if (representatives.length > 1) {
        initialIds = representatives
          .slice(0, Math.min(2, representatives.length))
          .map((rep) => rep.id);
      }
      setSelectedRepIds(initialIds);
    }
  }, [
    representatives,
    setAssemblyDistrict,
    setStateDistrict,
    submitUserContact,
    userInfo,
  ]);

  // Force slider resize on window resize
  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current) {
        sliderRef.current.innerSlider?.onWindowResized();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectRepresentative = (id) => {
    setSelectedRepIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      return updated.length > 2 ? updated.slice(-2) : updated;
    });
  };

  const CustomArrow = ({ direction, onClick }) => {
    const positionClass =
      direction === "left" ? "-left-4 sm:-left-6" : "-right-4 sm:-right-6";
    const Icon = direction === "left" ? ChevronLeft : ChevronRight;

    return (
      <div
        onClick={onClick}
        className={`absolute top-1/2 transform -translate-y-1/2 ${positionClass} z-10 p-2 rounded-full cursor-pointer`}
        style={{ backgroundColor: primaryColor }}
      >
        <Icon size={24} className="text-white" />
      </div>
    );
  };

  const previewsToShow = 4;

  const sliderSettings = {
    dots: false,
    infinite: representatives.length > previewsToShow,
    speed: 500,
    slidesToShow: Math.min(previewsToShow, representatives.length),
    slidesToScroll: 1,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, representatives.length),
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: Math.min(2, representatives.length),
        },
      },
      {
        breakpoint: 560,
        settings: {
          slidesToShow: Math.min(1, representatives.length),
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 relative">
      {/* Header */}
      <div
        className="py-12 relative"
        style={{
          background: `linear-gradient(to right, ${primaryColor}, ${primaryColor})`,
        }}
      >
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="absolute left-4 top-4">
            <Link
              to="/"
              className="flex items-center gap-2 bg-white font-medium px-4 py-2 rounded-lg shadow transition"
              style={{
                color: primaryColor,
                border: `1px solid ${primaryColor}`,
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mt-3">
            Your Representatives
          </h1>
          {fullAddress && (
            <p className="text-xl text-blue-100 text-center mt-4">
              Results for: {fullAddress}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
            style={{ borderColor: primaryColor }}
          ></div>
        </div>
      ) : error ? (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      ) : representatives?.length > 0 ? (
        <div className="container mx-auto px-4 py-8">
          {/* Selected Details */}
          {representatives?.length === 1 &&
            selectedRepIds?.length === 1 &&
            selectedRepIds
              .map((id) => representatives.find((rep) => rep.id === id))
              .filter((rep) => Boolean(rep))
              .map((rep) => (
                <RepresentativeDetails
                  key={rep.id}
                  representative={rep}
                  id={rep.id}
                />
              ))}
          {selectedRepIds.length > 1 && (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {selectedRepIds
                .map((id) => representatives.find((rep) => rep.id === id))
                .filter((rep) => Boolean(rep))
                .map((rep) => (
                  <RepresentativeDetails
                    key={rep.id}
                    representative={rep}
                    id={rep.id}
                  />
                ))}
            </div>
          )}
          {homeData?.howLegislatorsScored && (
            <div
              className="border-l-4 p-6 my-10 mx-2 rounded-r-lg"
              style={{
                backgroundColor: `${primaryColor}20`,
                borderColor: primaryColor,
              }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                How Legislators Are Scored?
              </h3>
              <p className="text-gray-700 mb-4">
                {homeData.howLegislatorsScored}
              </p>
              {homeData?.howLegislatorsScoredLink && (
                <a
                  href={homeData.howLegislatorsScoredLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Learn More
                </a>
              )}
            </div>
          )}
          {/* Additional Representatives Carousel */}
          {representatives.length > 0 && (
            <div className="mb-12 relative">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                View More Representatives
              </h2>

              <div className="w-full px-4">
                <Slider ref={sliderRef} {...sliderSettings}>
                  {representatives.map((rep) => (
                    <div key={rep.id} className="px-1 min-w-0">
                      <RepresentativeCard
                        representative={rep}
                        onClick={() => handleSelectRepresentative(rep.id)}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-700">
              No representatives found for this address.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Please verify the address and try again, or try a different
              format.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchRepresentative;
