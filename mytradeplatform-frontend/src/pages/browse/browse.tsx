import { Navigate, Route, Routes } from "react-router-dom";
import BrowseItems from "./components/browse-items";
import SingleItem from "./components/single-item";

const Browse = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<BrowseItems />} />
        <Route path="/single-item" element={<SingleItem />} />
        <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </>
  );
};

export default Browse;
