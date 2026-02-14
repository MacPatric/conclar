import { NavLink } from "react-router-dom";
import configData from "../config.json";
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const { t } = useTranslation();
  const infoLink =
    configData.NAVIGATION.INFO ? (
      <li>
        <NavLink to="/info">{t('navigation.info')}</NavLink>
      </li>
    ) : (
      <></>
    );
  const extraLinks = [];
  if ("EXTRA" in configData.NAVIGATION) {
    for (let link of configData.NAVIGATION.EXTRA) {
      extraLinks.push(
        <li key={link.URL}>
          <a href={link.URL}>{link.LABEL}</a>
        </li>
      );
    }
  }
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink to="/">{t('navigation.program')}</NavLink>
        </li>
        <li>
          <NavLink to="/people">{t('navigation.people')}</NavLink>
        </li>
        <li>
          <NavLink to="/myschedule">{t('navigation.myschedule')}</NavLink>
        </li>
        {infoLink}
        <li>
          <NavLink to="/settings">{t('navigation.settings')}</NavLink>
        </li>
        {extraLinks}
      </ul>
    </nav>
  );
};

export default Navigation;
