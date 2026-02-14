import { useStoreState, useStoreActions } from "easy-peasy";
import configData from "../config.json";
import { useTranslation } from 'react-i18next';

const Debug = () => {
  const { t } = useTranslation();
  const timeToNextFetch = useStoreState((state) => state.timeToNextFetch);
  const fetchProgram = useStoreActions((actions) => actions.fetchProgram);
  const onLine = useStoreState((state) => state.onLine);

  if (!configData.DEBUG_MODE.ENABLE) return "";

  const handleFetch = () => {
    fetchProgram(false);
  };

  const onlineClass = onLine ? "debug-online" : "debug-offline";
  const onlineLabel = onLine
    ? t('debug_mode.online_label')
    : t('debug_mode.offline_label');
  return (
    <div className={"debug " + onlineClass}>
      <span className="debug-status">{onlineLabel}</span>
      <span className="debug-fetch">
        <button onClick={handleFetch}>
          {t('debug_mode.fetch_button_label')}
        </button>
      </span>
      <span className="debug-time-left">{timeToNextFetch} seconds</span>
    </div>
  );
};

export default Debug;
