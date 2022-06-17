import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Map from "./components/Map";

function App() {
  return (
    <div className='flex flex-col'>
      <Map />
    </div>
  );
}

export default App;
