import { useStoreState, useStoreActions } from "easy-peasy";
import configData from "../config.json";
import { useTranslation } from 'react-i18next';

const HelpText = () => {
  const { t } = useTranslation();
  const mySchedule = useStoreState((state) => state.getMySchedule);
  const helpTextDismissed = useStoreState((state) => state.helpTextDismissed);
  const setHelpTextDismissed = useStoreActions(
    (actions) => actions.setHelpTextDismissed
  );
  const dismiss = (item) => {
    setHelpTextDismissed({ ...helpTextDismissed, [item]: true });
  };
  const selector = mySchedule.length > 0 ? "SHARING" : "WELCOME";
  if (selector in helpTextDismissed && helpTextDismissed[selector]) {
    return <></>;
  }
  return (
    <div className="help-text">
      <button
        onClick={() => dismiss(selector)}
        aria-label={t('help_text.close_aria_label')}
      >
        {t('help_text.close_label')}
      </button>
      {selector === "SHARING" ? <p>{t('help_text.sharing')}</p> : <p>{t('help_text.welcome')}</p>}
    </div>
  );
};

export default HelpText;
