import { useStoreState } from "easy-peasy";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import configData from "../config.json";
import { useTranslation } from 'react-i18next';

const ShareLink = () => {
    const { t } = useTranslation();
    const mySchedule = useStoreState((state) => state.getMySchedule);
  // Don't show share link(s) unless there are items in mySchedule.
  if (mySchedule.length === 0) return <></>;
  const links = [];
  let key = 0;
  function addLink(linkItems, multi) {
    const link = window.publicUrl + "ids/" + linkItems;
    const absLink = `${window.location.origin}${link}`;
    links.push(
      <div key={key++} className="share-body">
        <div className="share-link">
          <Link to={link}>
            {multi
              ? t('program.my_schedule.share.multiple_link_label').replace(
                  "@number",
                  key + 1
                )
              : t('program.my_schedule.share.link_label')}
          </Link>
        </div>
        <div className="share-qr-code">
          <QRCode value={absLink} />
        </div>
      </div>
    );
  }
  let linkItems = "";
  mySchedule.forEach((item) => {
    // If item would make link exceed maximum length, form link and move on to next one.
    if (
      (linkItems.length + item.id.length) >
      configData.PROGRAM.MY_SCHEDULE.SHARE.MAX_LENGTH
    ) {
      addLink(linkItems, true);
      linkItems = "";
    }
    if (linkItems.length) linkItems += "~";
    linkItems += item.id;
  });
  addLink(linkItems, key > 0);

  const multipleDesc =
    key > 1 ? (
      <div className="share-body">
          {t('program.my_schedule.share.multiple_description')}
      </div>
    ) : (
      ""
    );

  return (
    <div className="share-group select-show-timezone">
      <div className="share-head">
          {t('program.my_schedule.share.label')}
      </div>
      <div className="share-body">
          {t('program.my_schedule.share.description')}
      </div>
      {multipleDesc}
      {links}
    </div>
  );
};

export default ShareLink;
