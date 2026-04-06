import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import { addActivity } from '../services/api';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Plus, Activity, Footprints, Bike, Waves, Dumbbell,
  Sparkles, Zap, Heart, StretchHorizontal, CircleDot
} from 'lucide-react';

const activityTypes = [
  { value: 'RUNNING',         label: 'Running',         icon: <Activity className="w-6 h-6" />,            color: '#818cf8' },
  { value: 'WALKING',         label: 'Walking',         icon: <Footprints className="w-6 h-6" />,          color: '#34d399' },
  { value: 'CYCLING',         label: 'Cycling',         icon: <Bike className="w-6 h-6" />,                color: '#fbbf24' },
  { value: 'SWIMMING',        label: 'Swimming',        icon: <Waves className="w-6 h-6" />,               color: '#22d3ee' },
  { value: 'WEIGHT_TRAINING', label: 'Weights',         icon: <Dumbbell className="w-6 h-6" />,            color: '#f97316' },
  { value: 'YOGA',            label: 'Yoga',            icon: <Sparkles className="w-6 h-6" />,            color: '#a78bfa' },
  { value: 'HIIT',            label: 'HIIT',            icon: <Zap className="w-6 h-6" />,                 color: '#fb7185' },
  { value: 'CARDIO',          label: 'Cardio',          icon: <Heart className="w-6 h-6" />,               color: '#f43f5e' },
  { value: 'STRETCHING',      label: 'Stretching',      icon: <StretchHorizontal className="w-6 h-6" />,   color: '#2dd4bf' },
  { value: 'OTHER',           label: 'Other',           icon: <CircleDot className="w-6 h-6" />,           color: '#94a3b8' },
];

const ActivityForm = ({ onActivityAdded }) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [activity, setActivity] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {},
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!submitting) setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.duration || !activity.caloriesBurned) {
      enqueueSnackbar('Please fill in all fields', { variant: 'warning' });
      return;
    }
    setSubmitting(true);
    try {
      await addActivity(activity);
      enqueueSnackbar('Activity tracked successfully! 🎉', { variant: 'success' });
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '', additionalMetrics: {} });
      setOpen(false);
      if (onActivityAdded) onActivityAdded();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to add activity. Please try again.', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* FAB Button to open modal */}
      <button className="fab-add" onClick={handleOpen}>
        <Plus className="w-4 h-4" />
        Add Activity
      </button>

      {/* Modal Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        className="activity-form-dialog"
        maxWidth="sm"
        fullWidth
        slotProps={{
          backdrop: {
            sx: { backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }
          }
        }}
      >
        <form onSubmit={handleSubmit} className="form-modal">
          <div className="form-modal__title">Track Activity</div>
          <div className="form-modal__subtitle">Log your workout and let AI analyze it</div>

          {/* Activity Type Selector - Grid layout for 10 types */}
          <div className="type-selector" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {activityTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`type-selector__option ${activity.type === type.value ? 'selected' : ''}`}
                onClick={() => setActivity({ ...activity, type: type.value })}
                style={activity.type === type.value ? { borderColor: type.color, boxShadow: `0 0 12px ${type.color}30` } : {}}
              >
                <span className="type-selector__icon" style={{ color: type.color }}>{type.icon}</span>
                <span className="type-selector__label">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Duration & Calories */}
          <div className="form-metrics-row">
            <div className="form-field">
              <label className="form-field__label">Duration (minutes)</label>
              <input
                className="form-field__input"
                type="number"
                min="1"
                placeholder="e.g. 30"
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-field__label">Calories Burned</label>
              <input
                className="form-field__input"
                type="number"
                min="1"
                placeholder="e.g. 250"
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="form-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <CircularProgress size={20} sx={{ color: '#fff' }} />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Track Activity
              </>
            )}
          </button>
        </form>
      </Dialog>
    </>
  );
};

export default ActivityForm;