import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';
import StatsCard from './StatsCard';
import {
  Activity, Flame, Timer, Trophy, ArrowRight,
  Footprints, Bike, Waves, Dumbbell, Sparkles,
  Zap, Heart, StretchHorizontal, CircleDot
} from 'lucide-react';

const activityConfig = {
  RUNNING:         { icon: <Activity className="w-5 h-5" />,            color: '#818cf8', bg: 'rgba(99, 102, 241, 0.12)',  label: 'Running' },
  WALKING:         { icon: <Footprints className="w-5 h-5" />,          color: '#34d399', bg: 'rgba(16, 185, 129, 0.12)',  label: 'Walking' },
  CYCLING:         { icon: <Bike className="w-5 h-5" />,                color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.12)',  label: 'Cycling' },
  SWIMMING:        { icon: <Waves className="w-5 h-5" />,               color: '#22d3ee', bg: 'rgba(6, 182, 212, 0.12)',   label: 'Swimming' },
  WEIGHT_TRAINING: { icon: <Dumbbell className="w-5 h-5" />,            color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)',  label: 'Weight Training' },
  YOGA:            { icon: <Sparkles className="w-5 h-5" />,            color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)', label: 'Yoga' },
  HIIT:            { icon: <Zap className="w-5 h-5" />,                 color: '#fb7185', bg: 'rgba(251, 113, 133, 0.12)', label: 'HIIT' },
  CARDIO:          { icon: <Heart className="w-5 h-5" />,               color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)',   label: 'Cardio' },
  STRETCHING:      { icon: <StretchHorizontal className="w-5 h-5" />,   color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.12)',  label: 'Stretching' },
  OTHER:           { icon: <CircleDot className="w-5 h-5" />,           color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', label: 'Other' },
};

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

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const firstName = user?.given_name || user?.name || 'User';

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivities();
        setActivities(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Compute stats from activities
  const totalActivities = activities.length;
  const totalCalories = activities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
  const totalMinutes = activities.reduce((sum, a) => sum + (a.duration || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Most frequent type
  const typeCounts = activities.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
  const topTypeName = topType ? (activityConfig[topType[0]]?.label || topType[0]) : '—';

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__greeting">Welcome back</div>
        <div className="page-header__title">Hello, {firstName} 👋</div>
        <div className="page-header__subtitle">Here's your fitness overview</div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid stagger-children">
        <StatsCard
          icon={<Activity className="w-6 h-6" />}
          value={totalActivities}
          label="Total Activities"
          accentColor="#818cf8"
          accentBg="rgba(99, 102, 241, 0.12)"
        />
        <StatsCard
          icon={<Flame className="w-6 h-6" />}
          value={totalCalories.toLocaleString()}
          label="Calories Burned"
          accentColor="#fb7185"
          accentBg="rgba(244, 63, 94, 0.12)"
        />
        <StatsCard
          icon={<Timer className="w-6 h-6" />}
          value={`${totalHours}h`}
          label="Total Duration"
          accentColor="#22d3ee"
          accentBg="rgba(6, 182, 212, 0.12)"
        />
        <StatsCard
          icon={<Trophy className="w-6 h-6" />}
          value={topTypeName}
          label="Top Activity"
          accentColor="#fbbf24"
          accentBg="rgba(245, 158, 11, 0.12)"
        />
      </div>

      {/* Recent Activities */}
      <div className="section-header">
        <h2 className="section-header__title">
          <Activity className="w-5 h-5 inline-block mr-2" style={{ verticalAlign: 'text-bottom' }} />
          Recent Activities
        </h2>
        {activities.length > 0 && (
          <button className="fab-add" onClick={() => navigate('/activities')}>
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="activity-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      ) : recentActivities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon"><Dumbbell className="w-12 h-12 mx-auto text-gray-500" /></div>
          <div className="empty-state__title">No activities yet</div>
          <div className="empty-state__desc">
            Start tracking your workouts to see your progress here!
          </div>
          <button
            className="fab-add"
            style={{ marginTop: '1.5rem' }}
            onClick={() => navigate('/activities')}
          >
            Go to Activities
          </button>
        </div>
      ) : (
        <div className="activity-grid stagger-children">
          {recentActivities.map((activity) => {
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

export default Dashboard;
