import Choice from "./components/choice";
import Count from "./components/count";
import Intro from "./components/intro";
import Join from "./components/join";
import Success from "./components/success";
import Trust from "./components/trust";
import Work from "./components/work";
export default function Landing() {
  return (
    <>
      <Intro />
      <Count />
      <Choice />
      <div className="anchor" id="work"></div>
      <Work />
      <Trust />
      <Success />
      <Join />
    </>
  );
}
