import {
  linkIcon,
  mailIcon,
  matchIcon,
  messageIcon,
  shareIcon,
} from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import { FormField } from "@/components/form-field/form-field";
import styles from "../trade.module.scss";
const inviteList = [
  {
    id: "1",
    icon: linkIcon,
    title: "1. Generate Link",
    text: "Create a unique invitation link with an optional custom message",
  },
  {
    id: "2",
    icon: shareIcon,
    title: "2. Share Anywhere",
    text: "Send the link via email, text, or paste it in marketplace conversations",
  },
  {
    id: "3",
    icon: matchIcon,
    title: "3. Start Trading",
    text: "Both parties join the trade builder to add items and confirm the trade",
  },
];
export default function Invite() {
  return (
    <section className={styles["invite"]}>
      <div className="auto__container">
        <div className={styles["invite__inner"]}>
          <div className={styles["invite__inner-title"]}>
            <h1>Invite Someone to Trade</h1>
            <p>
              Generate a link to invite someone from Facebook Marketplace, Ebay, or any other online platform
            </p>
          </div>
          <div className={styles["invite__inner-row"]}>
            <div className={styles["inviteCol"]}>
              <div className={styles["inviteCol__title"]}>
                <h4>
                  {linkIcon}
                  Generate Invite Link
                </h4>
                <p>
                  Create a unique link that you can share with potential trading
                  partners
                </p>
              </div>
              <label className={styles["input__outer"]}>
                <p>Custom Message (Optional)</p>
                <FormField
                  placeholder="Hey! Want to trade golf clubs on MyTradePlatform?"
                  type="text"
                />
              </label>
              <div className={styles["inviteCol__foot"]}>
                <CustomButton
                  title="Generate Invite Link"
                  styleType="primary"
                />
              </div>
            </div>
            <div className={styles["inviteCol"]}>
              <div className={styles["inviteCol__title"]}>
                <h4>
                  {shareIcon}
                  Share Your Link
                </h4>
                <p>Choose how you want to share your trade invitation</p>
              </div>
              <div className={styles["inviteCol__buttons"]}>
                <button type="button" onClick={() => alert("Email sharing functionality coming soon...")}>
                  {mailIcon}
                  Email
                </button>
                <button type="button" onClick={() => alert("SMS sharing functionality coming soon...")}>
                  {messageIcon}
                  Text Message
                </button>
              </div>
              <div className={styles["inviteCol__list"]}>
                <h6>Perfect for:</h6>
                <ul>
                  <li>Facebook Marketplace conversations</li>
                  <li>Buy/Sell/Trade online groups</li>
                  <li>Collector groups & trading communities</li>
                  <li>Ebay, OfferUp & other online platforms</li>
                </ul>
              </div>
              <div className={styles["inviteCol__info"]}>
                <span>{matchIcon}</span>
                <p>
                  Both parties will need to add their items and confirm the
                  trade before it becomes active.
                </p>
              </div>
            </div>
          </div>
          <div className={styles["inviteContent"]}>
            <h4>How Trade Invitations Work</h4>
            <div className={styles["inviteContent__row"]}>
              {inviteList.map((item, index) => {
                return <InviteItem {...item} key={index} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
const InviteItem = (props) => {
  return (
    <div className={styles["inviteItem"]}>
      <div className={styles["inviteItem__icon"]}>{props.icon}</div>
      <h6>{props.title}</h6>
      <p>{props.text}</p>
    </div>
  );
};
