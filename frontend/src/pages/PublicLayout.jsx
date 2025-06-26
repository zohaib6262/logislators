import { Outlet } from "react-router-dom";
import Header from "../reusableComponents/Header";
import Footer from "../reusableComponents/Footer";
import useFetchHomePage from "@/hooks/homePage/useFetchHomePage";
import useLegislators from "@/hooks/lagislators/useLegislators";
import { useFeatures } from "@/hooks/Feature/useFeature";
import useHeaderFeature from "@/hooks/Feature/useHeaderFeature";
import LoadingScreen from "@/reusableComponents/LoadingScreen";
import ServerError from "@/UI/ServerError";
import ErrorDisplay from "@/UI/ErrorDisplay";

const PublicLayout = () => {
  const {
    homeData,
    isLoading: homeLoading,
    error: homeError,
    refetch: refetchHome,
  } = useFetchHomePage();

  const {
    coords,
    people,
    isLoading: legislatorsLoading,
    setIsLoading,
    error: legislatorsError,
    searchByAddress,
    refetch: refetchLegislators,
  } = useLegislators();

  const {
    features,
    loading: featuresLoading,
    error: featureError,
    refreshFeatures: refetchFeatures,
  } = useFeatures();

  const { header, refreshHeader } = useHeaderFeature();

  const handleRetry = () => {
    refreshHeader();
    if (homeError) refetchHome();
    if (legislatorsError) refetchLegislators();
    if (featureError) refetchFeatures();
  };

  // Check for server errors (500)
  if (homeError?.statusCode === 500) {
    return (
      <ServerError
        error={homeError}
        onRetry={handleRetry}
        title="Server Connection Error"
        message="We're having trouble loading the required data. This might be due to a temporary server issue."
      />
    );
  }
  // Check for server errors (500)
  if (featureError?.statusCode === 500) {
    return (
      <ServerError
        error={featureError}
        onRetry={handleRetry}
        title="Server Connection Error"
        message="We're having trouble loading the required data. This might be due to a temporary server issue."
      />
    );
  }
  if (legislatorsError?.statusCode === 500) {
    return (
      <ServerError
        error={featureError}
        onRetry={handleRetry}
        title="Server Connection Error"
        message="We're having trouble loading the required data. This might be due to a temporary server issue."
      />
    );
  }

  // Show loading screen if any loading state is true
  if (featuresLoading || homeLoading || legislatorsLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet
          context={{
            homeData,
            homeError,
            coords,
            people,
            isLoading: legislatorsLoading,
            setIsLoading,
            error: legislatorsError,
            searchByAddress,
            features,
            featureError,
            header,
          }}
        />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
