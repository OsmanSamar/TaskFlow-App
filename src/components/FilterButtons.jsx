import { useTranslation } from "react-i18next";

const FilterButtons = ({ filterButtons, filter, setFilter }) => {
  const { t } = useTranslation();

  return (
    <div className="filter-bar">
      {filterButtons.map(({ key }) => (
        <button
          key={key}
          type="button"
          onClick={() => setFilter(key)}
          className={`filter-btn ${
            filter === key ? "filter-btn--active" : ""
          }`}
        >
          {t(`tasks.filters.${key}`)}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;

