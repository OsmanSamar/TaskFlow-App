const FilterButtons = ({ filterButtons, filter, setFilter }) => {
  return (
    <div className="filter-bar">
      {filterButtons.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => setFilter(key)}
          className={`filter-btn ${filter === key ? "filter-btn--active" : ""}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
