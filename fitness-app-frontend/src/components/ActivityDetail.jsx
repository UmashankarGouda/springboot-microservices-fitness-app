import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getActivityDetail } from '../services/api';
import {
  ArrowLeft, Sparkles, TrendingUp, Lightbulb, ShieldCheck,
  BarChart3, Activity, Footprints, Bike, Waves, Dumbbell,
  Zap, Heart, StretchHorizontal, CircleDot, Timer, Flame, CheckCircle2
} from 'lucide-react';

const activityConfig = {
  RUNNING:         { icon: <Activity className="w-6 h-6" />,            color: '#818cf8', bg: 'rgba(99, 102, 241, 0.15)',  label: 'Running' },
  WALKING:         { icon: <Footprints className="w-6 h-6" />,          color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)',  label: 'Walking' },
  CYCLING:         { icon: <Bike className="w-6 h-6" />,                color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)',  label: 'Cycling' },
  SWIMMING:        { icon: <Waves className="w-6 h-6" />,               color: '#22d3ee', bg: 'rgba(6, 182, 212, 0.15)',   label: 'Swimming' },
  WEIGHT_TRAINING: { icon: <Dumbbell className="w-6 h-6" />,            color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)',  label: 'Weight Training' },
  YOGA:            { icon: <Sparkles className="w-6 h-6" />,            color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)', label: 'Yoga' },
  HIIT:            { icon: <Zap className="w-6 h-6" />,                 color: '#fb7185', bg: 'rgba(251, 113, 133, 0.15)', label: 'HIIT' },
  CARDIO:          { icon: <Heart className="w-6 h-6" />,               color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)',   label: 'Cardio' },
  STRETCHING:      { icon: <StretchHorizontal className="w-6 h-6" />,   color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.15)',  label: 'Stretching' },
  OTHER:           { icon: <CircleDot className="w-6 h-6" />,           color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', label: 'Other' },
};

const parseAnalysisSections = (text) => {
  if (!text) return {};
  const sections = {};
  const parts = text.split('\n\n');
  parts.forEach((part) => {
    const trimmed = part.trim();
    if (trimmed.startsWith('Overall:')) sections.overall = trimmed.replace('Overall:', '').trim();
    else if (trimmed.startsWith('Pace:')) sections.pace = trimmed.replace('Pace:', '').trim();
    else if (trimmed.startsWith('Heart Rate:')) sections.heartRate = trimmed.replace('Heart Rate:', '').trim();
    else if (trimmed.startsWith('Calories:')) sections.calories = trimmed.replace('Calories:', '').trim();
    else if (!sections.overall) sections.overall = trimmed;
  });
  return sections;
};

const parseListItems = (items) => {
  if (!items || !Array.isArray(items)) return [];
  return items.map((item) => {
    const colonIndex = item.indexOf(':');
    if (colonIndex > 0 && colonIndex < 40) {
      return {
        title: item.substring(0, colonIndex).trim(),
        description: item.substring(colonIndex + 1).trim(),
      };
    }
    return { title: '', description: item };
  });
};

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivityDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page" style={{ padding: '2rem 0' }}>
        <div className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="detail-page">
        <button className="detail-back-btn" onClick={() => navigate('/activities')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Activities
        </button>
        <div className="empty-state">
          <div className="empty-state__icon"><Timer className="w-12 h-12 mx-auto text-gray-500" /></div>
          <div className="empty-state__title">Recommendation not ready</div>
          <div className="empty-state__desc">
            AI is still analyzing this activity. Please check back in a few moments.
          </div>
        </div>
      </div>
    );
  }

  const activityType = data.activityType || 'RUNNING';
  const config = activityConfig[activityType.toUpperCase()] || activityConfig.OTHER;
  const analysisSections = parseAnalysisSections(data.recommendation);
  const improvements = parseListItems(data.improvements);
  const suggestions = parseListItems(data.suggestions);

  return (
    <div className="detail-page">
      {/* Back Button */}
      <button className="detail-back-btn" onClick={() => navigate('/activities')}>
        <ArrowLeft className="w-4 h-4" />
        Back to Activities
      </button>

      {/* Activity Summary Card */}
      <div
        className="detail-summary"
        style={{ '--card-type-color': config.color, '--card-type-bg': config.bg }}
      >
        <div className="detail-summary__icon" style={{ color: config.color }}>
          {config.icon}
        </div>
        <div className="detail-summary__info">
          <div className="detail-summary__type">{config.label} Activity</div>
          <div className="detail-summary__date">
            Tracked on {data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            }) : 'N/A'}
          </div>
        </div>
      </div>

      {/* AI Recommendation Section */}
      <div className="ai-section">
        <div className="ai-section__header">
          <span className="ai-badge">
            <Sparkles className="w-3.5 h-3.5" />
            AI POWERED
          </span>
          <h2 className="ai-section__title">Recommendation</h2>
        </div>

        {/* Analysis */}
        {data.recommendation && (
          <div className="ai-subsection animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="ai-subsection__header">
              <div
                className="ai-subsection__icon"
                style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8' }}
              >
                <BarChart3 className="w-4.5 h-4.5" />
              </div>
              <h3 className="ai-subsection__title">Analysis</h3>
            </div>
            <div className="analysis-grid">
              {analysisSections.overall && (
                <div className="analysis-card">
                  <div className="analysis-card__label">Overall</div>
                  <div className="analysis-card__text">{analysisSections.overall}</div>
                </div>
              )}
              {analysisSections.pace && (
                <div className="analysis-card">
                  <div className="analysis-card__label">Pace</div>
                  <div className="analysis-card__text">{analysisSections.pace}</div>
                </div>
              )}
              {analysisSections.heartRate && (
                <div className="analysis-card">
                  <div className="analysis-card__label">Heart Rate</div>
                  <div className="analysis-card__text">{analysisSections.heartRate}</div>
                </div>
              )}
              {analysisSections.calories && (
                <div className="analysis-card">
                  <div className="analysis-card__label">Calories</div>
                  <div className="analysis-card__text">{analysisSections.calories}</div>
                </div>
              )}
            </div>
            {/* Fallback if no structured sections parsed */}
            {!analysisSections.overall && !analysisSections.pace && !analysisSections.heartRate && !analysisSections.calories && (
              <div className="ai-subsection__content">{data.recommendation}</div>
            )}
          </div>
        )}

        {/* Improvements */}
        {data.improvements && data.improvements.length > 0 && (
          <div className="ai-subsection animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="ai-subsection__header">
              <div
                className="ai-subsection__icon"
                style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#22d3ee' }}
              >
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <h3 className="ai-subsection__title">Improvements</h3>
            </div>
            {improvements.map((item, index) => (
              <div key={index} className="ai-list-item">
                <div
                  className="ai-list-item__marker"
                  style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#22d3ee' }}
                >
                  {index + 1}
                </div>
                <div className="ai-list-item__text">
                  {item.title && <strong>{item.title}: </strong>}
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {data.suggestions && data.suggestions.length > 0 && (
          <div className="ai-subsection animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="ai-subsection__header">
              <div
                className="ai-subsection__icon"
                style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' }}
              >
                <Lightbulb className="w-4.5 h-4.5" />
              </div>
              <h3 className="ai-subsection__title">Suggested Workouts</h3>
            </div>
            {suggestions.map((item, index) => (
              <div key={index} className="ai-list-item">
                <div
                  className="ai-list-item__marker"
                  style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' }}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <div className="ai-list-item__text">
                  {item.title && <strong>{item.title}: </strong>}
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Safety */}
        {data.safety && data.safety.length > 0 && (
          <div className="ai-subsection animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="ai-subsection__header">
              <div
                className="ai-subsection__icon"
                style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399' }}
              >
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <h3 className="ai-subsection__title">Safety Guidelines</h3>
            </div>
            {data.safety.map((item, index) => (
              <div key={index} className="safety-item">
                <span className="safety-item__icon"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></span>
                <span className="safety-item__text">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDetail;