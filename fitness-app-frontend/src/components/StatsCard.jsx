import React from 'react';

const StatsCard = ({ icon, value, label, accentColor, accentBg }) => {
  const style = {
    '--card-accent': accentColor,
    '--card-accent-bg': accentBg,
    '--card-accent-color': accentColor,
  };

  return (
    <div className="stats-card" style={style}>
      <div className="stats-card__icon">{icon}</div>
      <div className="stats-card__value">{value}</div>
      <div className="stats-card__label">{label}</div>
    </div>
  );
};

export default StatsCard;
