import configData from "../config.json";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Temporal } from "@js-temporal/polyfill";
import TimeZoneSelect from "react-timezone-select";
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();
  const defaultTimeZone = Temporal.Now.timeZone;

  const show12HourTime = useStoreState((state) => state.show12HourTime);
  const setShow12HourTime = useStoreActions(
    (actions) => actions.setShow12HourTime
  );

  const showLocalTime = useStoreState((state) => state.showLocalTime);
  const setShowLocalTime = useStoreActions(
    (actions) => actions.setShowLocalTime
  );

  const showTimeZone = useStoreState((state) => state.showTimeZone);
  const setShowTimeZone = useStoreActions((actions) => actions.setShowTimeZone);

  const useTimeZone = useStoreState((state) => state.useTimeZone);
  const setUseTimeZone = useStoreActions((actions) => actions.setUseTimeZone);

  const selectedTimeZone = useStoreState((state) => state.selectedTimeZone);
  const setSelectedTimeZone = useStoreActions(
    (actions) => actions.setSelectedTimeZone
  );

  const darkMode = useStoreState((state) => state.darkMode);
  const setDarkMode = useStoreActions((actions) => actions.setDarkMode);

  const timezoneSelect = useTimeZone ? (
    <div>
      <TimeZoneSelect
        value={selectedTimeZone}
        onChange={(e) => setSelectedTimeZone(e.value)}
        labelStyle="abbrev"
        className="filter-container"
        classNamePrefix="filter-select"
      />
    </div>
  ) : (
    ""
  );

  return (
    <div className="settings">
      <h2>{t('settings.title.label')}</h2>
      <fieldset className="settings-group time-format">
        <legend className="settings-head">
          {t('settings.time_format.label')}
        </legend>
        <div className="settings-radio">
          <label>
            <input
              type="radio"
              value="12hour"
              name="format"
              checked={show12HourTime}
              onChange={(e) => setShow12HourTime(e.target.value === "12hour")}
            />
            {t('settings.time_format.t12_hour_label')}
          </label>
          <label>
            <input
              type="radio"
              value="24hour"
              name="format"
              checked={!show12HourTime}
              onChange={(e) => setShow12HourTime(e.target.value === "12hour")}
            />
            {t('settings.time_format.t24_hour_label')}
          </label>
        </div>
      </fieldset>
      <fieldset className="settings-group select-show-localtime">
        <legend className="settings-head">
          {t('settings.show_local_time.label')}
        </legend>
        <div className="settings-radio">
          <label>
            <input
              type="radio"
              value="never"
              name="show_localtime"
              checked={showLocalTime === "never"}
              onChange={(e) => setShowLocalTime(e.target.value)}
            />
            {t('settings.show_local_time.never_label')}
          </label>
          <label>
            <input
              type="radio"
              value="differs"
              name="show_localtime"
              checked={showLocalTime === "differs"}
              onChange={(e) => setShowLocalTime(e.target.value)}
            />
            {t('settings.show_local_time.differs_label')}
          </label>
          <label>
            <input
              type="radio"
              value="always"
              name="show_localtime"
              checked={showLocalTime === "always"}
              onChange={(e) => setShowLocalTime(e.target.value)}
            />
            {t('settings.show_local_time.always_label')}
          </label>
        </div>
      </fieldset>
      <fieldset className="settings-group select-show-timezone">
        <legend className="settings-head">
          {t('settings.show_timezone.label')}
        </legend>
        <div className="settings-radio">
          <label>
            <input
              type="radio"
              value="never"
              name="show_timezone"
              checked={showTimeZone === "never"}
              onChange={(e) => setShowTimeZone(e.target.value)}
            />
            {t('settings.show_timezone.never_label')}
          </label>
          <label>
            <input
              type="radio"
              value="if_local"
              name="show_timezone"
              checked={showTimeZone === "if_local"}
              onChange={(e) => setShowTimeZone(e.target.value)}
            />
            {t('settings.show_timezone.if_local_label')}
          </label>
          <label>
            <input
              type="radio"
              value="always"
              name="show_timezone"
              checked={showTimeZone === "always"}
              onChange={(e) => setShowTimeZone(e.target.value)}
            />
            {t('settings.show_timezone.always_label')}
          </label>
        </div>
      </fieldset>
      <fieldset className="settings-group select-timezone">
        <legend className="settings-head">
          {t('settings.select_timezone.label')}
        </legend>
        <div className="settings-radio">
          <label>
            <input
              type="radio"
              value="default"
              name="method"
              checked={!useTimeZone}
              onChange={(e) => setUseTimeZone(e.target.value === "select")}
            />
            {t('settings.select_timezone.browser_default_label')}{" "}
            {defaultTimeZone}
          </label>
          <label>
            <input
              type="radio"
              value="select"
              name="method"
              checked={useTimeZone}
              onChange={(e) => setUseTimeZone(e.target.value === "select")}
            />
            {t('settings.select_timezone.select_label')}
          </label>
        </div>
        {timezoneSelect}
      </fieldset>
      <fieldset className="settings-group select-dark-mode">
        <legend className="settings-head">
          {t('settings.dark_mode.label')}
        </legend>
        <div className="settings-radio">
          <label>
            <input
              type="radio"
              value="browser"
              name="darkmode"
              checked={darkMode === "browser"}
              onChange={(e) => setDarkMode(e.target.value)}
            />
            {t('settings.dark_mode.browser_default_label')}{" "}
            {window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
              ? t('settings.dark_mode.browser_dark_label')
              : t('settings.dark_mode.browser_light_label')
            }
          </label>
        </div>
        <div className="settings-radio">
          <label>
            <input
              type="radio"
              value="light"
              name="darkmode"
              checked={darkMode === "light"}
              onChange={(e) => setDarkMode(e.target.value)}
            />
            {t('settings.dark_mode.light_mode_label')}
          </label>
        </div>
        <div className="settings-radio">
          <label>
            <input
              type="radio"
              value="dark"
              name="darkmode"
              checked={darkMode === "dark"}
              onChange={(e) => setDarkMode(e.target.value)}
            />
            {t('settings.dark_mode.dark_mode_label')}
          </label>
        </div>
      </fieldset>
    </div>
  );
};

export default Settings;
