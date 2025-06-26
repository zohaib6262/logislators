// utils/withSuspense.js
import LoadingScreen from "@/reusableComponents/LoadingScreen";
import React, { Suspense } from "react";

const withSuspense = (Component) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component />
    </Suspense>
  );
};

export default withSuspense;
