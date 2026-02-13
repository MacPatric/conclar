import configData from "../config.json";
import { useTranslation } from 'react-i18next';

const ResetButton = ({ isFiltered, resetFilters }) => {
  const { t } = useTranslation();
  const button = isFiltered ? (
    <button className="reset-button" onClick={() => resetFilters()}>
      {t('filter.reset.label')}
    </button>
  ) : (
    ""
  );
  return button;
};

export default ResetButton;
