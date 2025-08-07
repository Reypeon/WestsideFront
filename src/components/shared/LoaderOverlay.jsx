import React from "react";
import { useApp } from "../CartContext.jsx";
import Loader from "./loader.jsx";
//para mostrarlo en un axios con context
const LoaderOverlay = React.memo(() => {
  const { isLoading } = useApp();

  if (!isLoading) return null;

  return <Loader />;
});

export default LoaderOverlay;
