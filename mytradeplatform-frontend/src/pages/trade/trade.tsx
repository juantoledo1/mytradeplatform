import { Navigate, Route, Routes } from "react-router-dom";
import Invite from "./components/invite";
import Steps from "./components/steps/steps";
import Labels from "./components/labels";
import Summary from "./components/summary";
import Offer from "./components/offer";
import Review from "./components/review";
import EscrowRelease from "./components/escrow-release";
import DeliveryTracking from "./components/delivery-tracking";
import TradeSummary from "./components/trade-summary";
import PostItem from "./components/postItem";

const Trade = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<Invite />} />
        <Route path="/labels" element={<Labels />} />
        <Route path="/post-item" element={<PostItem />} />
        <Route path="/steps" element={<Steps />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/review" element={<Review />} />
        <Route path="/escrow-release" element={<EscrowRelease />} />
        <Route path="/delivery-tracking" element={<DeliveryTracking />} />
        <Route path="/trade-summary" element={<TradeSummary />} />
        <Route path="*" element={<Navigate to="" replace={true} />} />
      </Routes>
    </>
  );
};

export default Trade;
