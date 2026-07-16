import { getPasswordCriteria } from "../utils/validators";

export const PasswordCriteria = ({ password }) => {
  const criteria = getPasswordCriteria(password);

  if (!password) {
    return null;
  }

  return (
    <ul className="password-criteria" aria-label="Password requirements">
      {criteria.map((criterion) => (
        <li
          key={criterion.id}
          className={`password-criteria__item${
            criterion.met ? " password-criteria__item--met" : ""
          }`}
        >
          <span className="password-criteria__indicator" aria-hidden="true" />
          {criterion.label}
        </li>
      ))}
    </ul>
  );
};
