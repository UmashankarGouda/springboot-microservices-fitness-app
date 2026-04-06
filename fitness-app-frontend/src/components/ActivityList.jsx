import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';
import ActivityForm from './ActivityForm';
import {
  ArrowDownUp, Activity, Footprints, Bike, Waves, Dumbbell,
  Sparkles, Zap, Heart, StretchHorizontal, CircleDot,
  Timer, Flame, LayoutGrid
} from 'lucide-react';

const activityConfig = {
  RUNNING:         { icon: <Activity className="w-5 h-5" />,            color: '#818cf8', bg: 'rgba(99, 102, 241, 0.12)',  label: 'Running' },
  WALKING:         { icon: <Footprints className="w-5 h-5" />,          color: '#34d399', bg: 'rgba(16, 185, 129, 0.12)',  label: 'Walking' },
  CYCLING:         { icon: <Bike className="w-5 h-5" />,                color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.12)',  label: 'Cycling' },
  SWIMMING:        { icon: <Waves className="w-5 h-5" />,               color: '#22d3ee', bg: 'rgba(6, 182, 212, 0.12)',   label: 'Swimming' },
  WEIGHT_TRAINING: { icon: <Dumbbell className="w-5 h-5" />,            color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)',  label: 'Weights' },
  YOGA:            { icon: <Sparkles className="w-5 h-5" />,            color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)', label: 'Yoga' },
  HIIT:            { icon: <Zap className="w-5 h-5" />,                 color: '#fb7185', bg: 'rgba(251, 113, 133, 0.12)', label: 'HIIT' },
  CARDIO:          { icon: <Heart className="w-5 h-5" />,               color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)',   label: 'Cardio' },
  STRETCHING:      { icon: <StretchHorizontal className="w-5 h-5" />,   color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.12)',  label: 'Stretching' },
  OTHER:           { icon: <CircleDot className="w-5 h-5" />,           color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', label: 'Other' },
};

const filterOptions = ['ALL', 'RUNNING', 'WALKING', 'CYCLING', 'SWIMMING', 'WEIGHT_TRAINING', 'YOGA', 'HIIT', 'CARDIO', 'STRETCHING', 'OTHER'];

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');
  const navigate = useNavigate();

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Filter & sort
  let filtered = filter === 'ALL'
    ? activities
    : activities.filter((a) => a.type === filter);

  filtered = [...filtered].sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOrder === 'calories') return (b.caloriesBurned || 0) - (a.caloriesBurned || 0);
    if (sortOrder === 'duration') return (b.duration || 0) - (a.duration || 0);
    return 0;
  });

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__title">Activities</div>
        <div className="page-header__subtitle">Track and manage all your workouts</div>
      </div>

      {/* Controls Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {filterOptions.map((opt) => {
            const config = activityConfig[opt];
            return (
              <button
                key={opt}
                className={`navbar-link ${filter === opt ? 'active' : ''}`}
                onClick={() => setFilter(opt)}
                style={{ fontSize: '0.8rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                {opt === 'ALL' ? (
                  <><LayoutGrid className="w-3.5 h-3.5" /> All</>
                ) : (
                  <>{React.cloneElement(config.icon, { className: 'w-3.5 h-3.5' })} {config.label}</>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                padding: '8px 32px 8px 14px',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-family)',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="calories">Most Calories</option>
              <option value="duration">Longest Duration</option>
            </select>
            <ArrowDownUp style={{
              width: 14,
              height: 14,
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--text-muted)',
            }} />
          </div>

          {/* Add Activity Button */}
          <ActivityForm onActivityAdded={fetchActivities} />
        </div>
      </div>

      {/* Activity Grid */}
      {loading ? (
        <div className="activity-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">
            {filter !== 'ALL' && activityConfig[filter]
              ? React.cloneElement(activityConfig[filter].icon, { className: 'w-12 h-12 mx-auto text-gray-500' })
              : <Dumbbell className="w-12 h-12 mx-auto text-gray-500" />
            }
          </div>
          <div className="empty-state__title">
            {filter !== 'ALL'
              ? `No ${activityConfig[filter]?.label?.toLowerCase() || filter.toLowerCase()} activities yet`
              : 'No activities yet'}
          </div>
          <div className="empty-state__desc">
            {filter !== 'ALL'
              ? 'Try adding a new activity or removing the filter'
              : 'Click "Add Activity" to start tracking your workouts!'}
          </div>
        </div>
      ) : (
        <div className="activity-grid stagger-children">
          {filtered.map((activity) => {
            const config = activityConfig[activity.type] || activityConfig.OTHER;
            return (
              <div
                key={activity.id}
                className="activity-card"
                style={{ '--card-type-color': config.color, '--card-type-bg': config.bg }}
                onClick={() => navigate(`/activities/${activity.id}`)}
              >
                <div className="activity-card__header">
                  <div className="activity-card__type-icon" style={{ color: config.color }}>
                    {config.icon}
                  </div>
                  <div>
                    <div className="activity-card__type-name">
                      {config.label}
                    </div>
                    <div className="activity-card__time">
                      {formatTimeAgo(activity.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="activity-card__metrics">
                  <span className="activity-card__pill">
                    <Timer className="w-3.5 h-3.5 inline-block mr-1" />
                    <span className="activity-card__pill-value">{activity.duration} min</span>
                  </span>
                  <span className="activity-card__pill">
                    <Flame className="w-3.5 h-3.5 inline-block mr-1" />
                    <span className="activity-card__pill-value">{activity.caloriesBurned} cal</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityList;