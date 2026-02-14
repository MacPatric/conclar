import TagSelect from "./TagSelect";
import { useTranslation } from "react-i18next";

const TagSelectors = ({ tags, selTags, setSelTags, tagConfig, resetLimit }) => {
  const { t } = useTranslation();
  /**
   * Get the tag information for the tag category.
   * @param {string} tag The tag category.
   * @returns {object} The tag config information.
   */
  function findTagData(tag) {
    // Check for day tag.
    if (tag === "days" && tagConfig.DAY_TAG.GENERATE) {
      const translatedDays = Object.entries(tagConfig.DAY_TAG.DAYS).reduce(
        (acc, [dayNum, dayName]) => {
          acc[dayNum] = t(`tags.day_tag.days.${dayNum}`);
          return acc;
        },
        {}
      );
      return { ...tagConfig.DAY_TAG, DAYS: translatedDays };
    }

    const tagData = tagConfig.SEPARATE.find(
      (item) => item.PREFIX === tag
    );
    if (tagData !== undefined) return tagData;
    // Tag not found in config, so return default.
    return tagConfig;
  }

  const tagFilters = [];
  for (const tag in tags) {
    const tagData = findTagData(tag);
    // Only add drop-down if tag type actually contains elements, and isn't marked hidden in config.
    if (tags[tag].length && !tagData.HIDE) {
      // Translate day numbers to day names for display
      const options = tag === "days" && tagConfig.DAY_TAG.GENERATE
        ? tags[tag].map(option => ({
            ...option,
            label: t(`tags.day_tag.days.${option.label}`)
          }))
        : tags[tag];

      tagFilters.push(
        <div key={tag} className={"filter-tags filter-tags-" + tag}>
          <TagSelect
            options={options}
            tag={tag}
            selTags={selTags}
            setSelTags={setSelTags}
            tagData={tagData}
            resetLimit={resetLimit}
          />
        </div>
      );
    }
  }
  return <>{tagFilters}</>;
};

export default TagSelectors;
