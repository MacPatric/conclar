import { useStoreState } from "easy-peasy";
import configData from "../config.json";
import { useTranslation } from 'react-i18next';

const Loading = ({ children }) => {
  const isLoading = useStoreState((state) => state.isLoading);
  const { t } = useTranslation();

  if (isLoading) return <h1>{t('application.loading.message')}</h1>;

  return <>{children}</>;
};

export default Loading;
