import { Router as ReachRouter } from "@reach/router";
import * as React from "react";
import _404 from "./pages/_404";
import About from "./pages/About";
import AddMood from "./pages/AddMood";
import Home from "./pages/Home";
import SeeAlso from "./pages/SeeAlso";

export default function Router() {
  return (
    <ReachRouter>
      <_404 default />
      <Home path="/" />
      <AddMood path="add" />
      <About path="about" />
      <SeeAlso path="see-also" />
    </ReachRouter>
  );
}
