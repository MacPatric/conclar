import { useStoreState, useStoreActions } from "easy-peasy";
import { useParams } from "react-router-dom";
import configData from "../config.json";
import ProgramList from "./ProgramList";
import { useTranslation } from 'react-i18next';

const ItemByIdList = () => {
    const { t } = useTranslation();
    const { addSelection } = useStoreActions((actions) => ({
    addSelection: actions.addSelection,
  }));

  const params = useParams();
  const itemIds = params.idList.split("~");
  const program = useStoreState((state) => state.program);
  if (program.length === 0) return <></>;

  // Filter to select only the specified ID.
  const filteredProgram = program.filter((item) =>
    itemIds.includes(item.id.toString())
  );
  return (
    <div>
      <div className="page-heading">
        <h2>{t('program.shared.title')}</h2>
      </div>
      <div className="page-body">{t('program.shared.description')}</div>
      <ProgramList program={filteredProgram} />
      <div className="buttons">
        <button
          className="button-add-all"
          onClick={() => {
            itemIds.forEach((id) => {
              addSelection(id);
            });
          }}
        >
          {t('program.shared.button_label')}
        </button>
      </div>
    </div>
  );
};

export default ItemByIdList;
