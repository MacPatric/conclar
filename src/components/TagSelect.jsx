import ReactSelect from "react-select";
import { useTranslation } from 'react-i18next';

const TagSelect = ({ options, tag, selTags, setSelTags, tagData, resetLimit }) => {
    const { t } = useTranslation();

    return (
    <ReactSelect
      placeholder={t(tagData.PLACEHOLDER)}
      options={options}
      isMulti
      isSearchable={tagData.SEARCHABLE}
      value={selTags[tag]}
      onChange={(value) => {
        resetLimit();
        let selections = { ...selTags };
        selections[tag] = value;
        setSelTags(selections);
      }}
      className="filter-container"
      classNamePrefix="filter-select"
/>
  );
};

export default TagSelect;
