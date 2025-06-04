// src/components/Home.jsx
import React from "react";
import Header from "../../components/Layout/Header/Header";
import Collection from "../../components/Sections/Collection";
import Breadcrumb from "../../components/Sections/Breadcrumb";

function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Breadcrumb />
      <Collection />
    </div>
  );
}

export default Home;
