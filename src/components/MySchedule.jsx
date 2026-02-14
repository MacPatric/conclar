import { useStoreState, useStoreActions } from "easy-peasy";
import configData from "../config.json";
import ProgramList from "./ProgramList";
import ShowPastItems from "./ShowPastItems";
import ShareLink from "./ShareLink";
import { LocalTime } from "../utils/LocalTime";
import { useTranslation } from 'react-i18next';

const MySchedule = () => {
  const { t } = useTranslation();
  const mySchedule = useStoreState((state) => state.getMySchedule);
  const program = useStoreState((state) => state.program);
  const showPastItems = useStoreState((state) => state.showPastItems);
  const { expandSelected, collapseSelected } = useStoreActions((actions) => ({
    expandSelected: actions.expandSelected,
    collapseSelected: actions.collapseSelected,
  }));
  const noneExpanded = useStoreState((state) => state.noneExpanded);
  const allSelectedExpanded = useStoreState(
    (state) => state.allSelectedExpanded
  );

  const pageHeading = (
    <div className="page-heading">
      <h2>{t('program.my_schedule.title')}</h2>
    </div>
  );

  if (mySchedule.length === 0) {
    return (
      <div className="my-schedule">
        {pageHeading}
        <div>{t('program.my_schedule.empty.text')}</div>
      </div>
    );
  }

  const filtered =
    LocalTime.isDuringCon(program) && !showPastItems
      ? LocalTime.filterPastItems(mySchedule)
      : mySchedule;

  return (
    <div className="my-schedule">
      {pageHeading}
      <div className="introduction">
        {t('program.my_schedule.intro')}
      </div>
      <div className="result-filters">
        <div className="stack">
          <div className="filter-expand">
            <button disabled={allSelectedExpanded} onClick={expandSelected}>
              {t('expand.expand_all_label')}
            </button>
            <button disabled={noneExpanded} onClick={collapseSelected}>
              {t('expand.collapse_all_label')}
            </button>
          </div>
        </div>
        <div className="filter-options">
          <ShowPastItems />
        </div>
      </div>
      <ProgramList program={filtered} />
      <ShareLink />
    </div>
  );
};

export default MySchedule;
