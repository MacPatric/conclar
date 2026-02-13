import ReactMarkdown from "react-markdown";
import configData from "../config.json";
import { useTranslation } from 'react-i18next';

const Footer = () => {

    const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-site">
        <ReactMarkdown children={t('footer.site_note_markdown')} />
      </div>
      <div className="footer-bottom">
        <div className="footer-copyright">
          <ReactMarkdown children={t('footer.copyright_markdown')} />
        </div>
        <div className="footer-conclar">
          <ReactMarkdown children={t('footer.conclar_note_markdown')} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
