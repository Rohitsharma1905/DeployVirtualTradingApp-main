import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import {
  Trophy, Medal, Gift, Award, Star, Zap,
  Users, BarChart2, Coins, Plus, Trash2, X, Percent
} from 'lucide-react';

const EventModal = ({ event, onClose, onSubmit }) => {
  const iconOptions = [
    { value: 'Trophy', label: 'Trophy', icon: <Trophy className="text-lightBlue-600" size={16} /> },
    { value: 'Medal', label: 'Medal', icon: <Medal className="text-yellow-500" size={16} /> },
    { value: 'Gift', label: 'Gift', icon: <Gift className="text-purple-500" size={16} /> },
    { value: 'Award', label: 'Award', icon: <Award className="text-green-500" size={16} /> },
    { value: 'Star', label: 'Star', icon: <Star className="text-orange-500" size={16} /> },
    { value: 'Zap', label: 'Zap', icon: <Zap className="text-red-500" size={16} /> },
    { value: 'Users', label: 'Users', icon: <Users className="text-green-500" size={16} /> },
    { value: 'BarChart2', label: 'Chart', icon: <BarChart2 className="text-red-500" size={16} /> },
    { value: 'Coins', label: 'Coins', icon: <Coins className="text-amber-500" size={16} /> },
  ];

  const backgroundOptions = [
    { value: 'bg-gradient-to-br from-blue-50 to-blue-100', label: 'Blue Gradient' },
    { value: 'bg-gradient-to-br from-green-50 to-green-100', label: 'Green Gradient' },
    { value: 'bg-gradient-to-br from-purple-50 to-purple-100', label: 'Purple Gradient' },
    { value: 'bg-gradient-to-br from-yellow-50 to-yellow-100', label: 'Yellow Gradient' },
    { value: 'bg-gradient-to-br from-pink-50 to-pink-100', label: 'Pink Gradient' },
    { value: 'bg-gradient-to-br from-red-50 to-red-100', label: 'Red Gradient' },
    { value: 'bg-gradient-to-br from-amber-50 to-amber-100', label: 'Amber Gradient' },
  ];

  // Default reward tiers
  const defaultRewardTiers = [
    {
      tier: '10%+ Gain',
      description: '100% of entry fee returned',
      cashback: 0.5,
      bonus: 0
    },
    {
      tier: '15%+ Gain',
      description: 'Full cashback + additional 50% of entry fee',
      cashback: 1,
      bonus: 0
    },
    {
      tier: '20%+ Gain',
      description: 'Full cashback + additional 100% of entry fee',
      cashback: 1,
      bonus: 1
    },
    {
      tier: '25%+ Gain',
      description: 'Full cashback + 110% of entry fee',
      cashback: 1,
      bonus: 1.1
    },
    {
      tier: '30%+ Gain',
      description: 'Full cashback + 120% of entry fee',
      cashback: 1,
      bonus: 1.2
    }
  ];

  // Enhanced prize distribution calculation
  const calculateDistribution = (values) => {
    const totalPrize = parseFloat(values.prize.replace(/[^0-9.]/g, '')) || 0;
    const participants = parseInt(values.participants) || 0;

    if (totalPrize <= 0 || participants <= 0) {
      return {
        prizeBreakdown: [{ position: 'Enter prize and participants', reward: 'to see breakdown' }],
        rewardTiers: defaultRewardTiers
      };
    }

    const breakdown = [];
    const topPerformersCount = Math.max(1, Math.floor(participants * 0.3));
    const winnerPool = totalPrize * 0.7; // 70% for winners
    const participationPool = totalPrize * 0.2; // 20% for participation rewards
    const organizerCut = totalPrize * 0.1; // 10% for platform

    // Organizer cut
    breakdown.push({
      position: 'Platform Fee',
      reward: `$${organizerCut.toFixed(2)} (10% of prize pool)`
    });

    // Top performers rewards
    if (topPerformersCount >= 1) {
      breakdown.push({
        position: '1st Place',
        reward: `$${(winnerPool * 0.4).toFixed(2)} (40% of winner pool)`
      });
    }
    if (topPerformersCount >= 2) {
      breakdown.push({
        position: '2nd Place',
        reward: `$${(winnerPool * 0.3).toFixed(2)} (30% of winner pool)`
      });
    }
    if (topPerformersCount >= 3) {
      breakdown.push({
        position: '3rd Place',
        reward: `$${(winnerPool * 0.2).toFixed(2)} (20% of winner pool)`
      });
    }
    if (topPerformersCount > 3) {
      const remainingWinners = topPerformersCount - 3;
      const remainingPrize = winnerPool * 0.1;
      breakdown.push({
        position: `4th-${topPerformersCount}th Places`,
        reward: `$${(remainingPrize / remainingWinners).toFixed(2)} each`
      });
    }

    // Participation rewards
    breakdown.push({
      position: 'Participation Rewards',
      reward: `$${participationPool.toFixed(2)} distributed based on performance`
    });

    return {
      prizeBreakdown: breakdown,
      rewardTiers: defaultRewardTiers
    };
  };

  const formik = useFormik({
    initialValues: event ? { 
      ...event,
      startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      description: event.description || '',
      prizeBreakdown: event.prizeBreakdown || [],
      rewardTiers: event.rewardTiers || defaultRewardTiers,
      rewards: event.rewards || [''],
      participants: event.participants || 0,
      cashbackPercentage: event.cashbackPercentage || 0,
      entryFee: event.entryFee || 0,
      backgroundColor: event.backgroundColor || 'bg-gradient-to-br from-blue-50 to-blue-100',
      highlight: event.highlight || '',
      requirements: event.requirements || '',
      progress: event.progress || 0,
      progressText: event.progressText || '',
      icon: event.icon || 'Trophy',
    } : {
      title: '',
      type: 'ongoing',
      description: '',
      startDate: '',
      endDate: '',
      participants: 0,
      prize: '',
      prizeBreakdown: [],
      rewardTiers: defaultRewardTiers,
      cashbackPercentage: 0,
      difficulty: 'Beginner',
      entryFee: 0,
      rewards: [''],
      backgroundColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      highlight: '',
      requirements: '',
      progress: 0,
      progressText: '',
      icon: 'Trophy',
    },
   
validate: (values) => {
  const errors = {};
  
  // Title validation
  if (!values.title) errors.title = 'Event title is required';
  else if (values.title.length < 3) errors.title = 'Title must be at least 3 characters';
  
  // Description validation
  if (!values.description) errors.description = 'Description is required';
  else if (values.description.length < 10) errors.description = 'Description must be at least 10 characters';
  
  // Ensure prize is string
// In your validate function:
if (!values.prize) errors.prize = 'Prize information is required';
else if (typeof values.prize !== 'string') errors.prize = 'Prize must be a string';
else if (!/^\d+$/.test(values.prize.replace(/[^0-9.]/g, ''))) {
  errors.prize = 'Prize must be a valid number';
}

  // Date validation
  if (!values.startDate) errors.startDate = 'Start date is required';
  if (!values.endDate) errors.endDate = 'End date is required';
  if (values.startDate && values.endDate) {
    const start = new Date(values.startDate);
    const end = new Date(values.endDate);
    if (end < start) errors.endDate = 'End date must be after start date';
  }
  
  return errors;
},
    
onSubmit: (values) => {
  const calculated = calculateDistribution(values);
  
// Transform reward tiers to match backend schema
const transformedRewardTiers = values.rewardTiers.map(tier => ({
  tier: tier.tier,
  description: tier.description,
  cashback: tier.cashback,
  bonus: tier.bonus
}));
const finalValues = {
  ...values,
  startDate: new Date(values.startDate).toISOString(),
  endDate: new Date(values.endDate).toISOString(),
  prize: String(values.prize).replace(/[^0-9.]/g, ''),
  prizeBreakdown: calculated.prizeBreakdown,
  rewardTiers: values.rewardTiers, // Just use the original array
  rewards: values.rewards.filter(reward => reward.trim() !== ''),
  difficulty: values.difficulty || 'Beginner',
  participants: parseInt(values.participants) || 0,
  entryFee: parseFloat(values.entryFee) || 0,
  cashbackPercentage: parseFloat(values.cashbackPercentage) || 0,
  progress: parseInt(values.progress) || 0,
};
  
  onSubmit(finalValues);
},
  });

  // Update distributions when relevant fields change
  useEffect(() => {
    if (formik.values.prize && formik.values.participants !== undefined) {
      const calculated = calculateDistribution(formik.values);
      formik.setFieldValue('prizeBreakdown', calculated.prizeBreakdown);
      formik.setFieldValue('rewardTiers', calculated.rewardTiers);
    }
  }, [formik.values.prize, formik.values.participants]);

  const handleRewardsChange = (index, value) => {
    const newRewards = [...formik.values.rewards];
    newRewards[index] = value;
    formik.setFieldValue('rewards', newRewards);
  };

  const addReward = () => {
    formik.setFieldValue('rewards', [...formik.values.rewards, '']);
  };

  const removeReward = (index) => {
    if (formik.values.rewards.length > 1) {
      const newRewards = formik.values.rewards.filter((_, i) => i !== index);
      formik.setFieldValue('rewards', newRewards);
    }
  };

  const handleRewardTierChange = (index, field, value) => {
    const newRewardTiers = [...formik.values.rewardTiers];
    newRewardTiers[index][field] = value;
    formik.setFieldValue('rewardTiers', newRewardTiers);
  };

  const addRewardTier = () => {
    formik.setFieldValue('rewardTiers', [
      ...formik.values.rewardTiers,
      { tier: '', description: '', cashback: 0, bonus: 0 }
    ]);
  };

  const removeRewardTier = (index) => {
    if (formik.values.rewardTiers.length > 1) {
      const newRewardTiers = formik.values.rewardTiers.filter((_, i) => i !== index);
      formik.setFieldValue('rewardTiers', newRewardTiers);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-[80%] max-h-[80%] my-4 bg-white rounded-2xl shadow-xl border !border-gray-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border !border-gray-200 flex justify-between items-center bg-white">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-lightBlue-100 !rounded-xl">
              <Trophy className="text-lightBlue-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {event ? 'Edit Event' : 'Create New Event'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 !rounded-xl transition-colors duration-200"
          >
            <X className="text-gray-500" size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="flex-1 max-h-[300px] overflow-y-auto pr-1 grid md:grid-cols-2 gap-6 ">
              {/* Basic Event Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Event Title"
                    className={`w-full px-4 py-3 !rounded-xl border ${formik.errors.title && formik.touched.title ? 'border-red-500' : 'border-gray-200'} !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200`}
                  />
                  {formik.errors.title && formik.touched.title && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 !rounded-xl border ${formik.errors.type && formik.touched.type ? 'border-red-500' : 'border-gray-200'} !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200`}
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                  {formik.errors.type && formik.touched.type && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 !rounded-xl border ${formik.errors.startDate && formik.touched.startDate ? 'border-red-500' : 'border-gray-200'} !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200`}
                  />
                  {formik.errors.startDate && formik.touched.startDate && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 !rounded-xl border ${formik.errors.endDate && formik.touched.endDate ? 'border-red-500' : 'border-gray-200'} !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200`}
                  />
                  {formik.errors.endDate && formik.touched.endDate && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.endDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty *</label>
                  <select
                    name="difficulty"
                    value={formik.values.difficulty}
                    onChange={formik.handleChange}
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Financial Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Prize *</label>
                  <input
                    type="text"
                    name="prize"
                    value={formik.values.prize}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Total Prize Pool (e.g., $10,000)"
                    className={`w-full px-4 py-3 !rounded-xl border ${formik.errors.prize && formik.touched.prize ? 'border-red-500' : 'border-gray-200'} !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200`}
                  />
                  {formik.errors.prize && formik.touched.prize && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.prize}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entry Fee *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">$</span>
                    <input
                      type="number"
                      name="entryFee"
                      value={formik.values.entryFee}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-3 pl-10 !rounded-xl border ${formik.errors.entryFee && formik.touched.entryFee ? 'border-red-500' : 'border-gray-200'} !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200`}
                    />
                  </div>
                  {formik.errors.entryFee && formik.touched.entryFee && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.entryFee}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cashback Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="cashbackPercentage"
                      value={formik.values.cashbackPercentage}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0"
                      min="0"
                      max="100"
                      className={`w-full px-4 py-3 pr-10 !rounded-xl border ${formik.errors.cashbackPercentage && formik.touched.cashbackPercentage ? 'border-red-500' : 'border-gray-200'} !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200`}
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">%</span>
                  </div>
                  {formik.errors.cashbackPercentage && formik.touched.cashbackPercentage && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.cashbackPercentage}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Participants *</label>
                  <input
                    type="number"
                    name="participants"
                    value={formik.values.participants}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min="0"
                    className={`w-full px-4 py-3 !rounded-xl border ${formik.errors.participants && formik.touched.participants ? 'border-red-500' : 'border-gray-200'} !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200`}
                  />
                  {formik.errors.participants && formik.touched.participants && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.participants}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <select
                    name="icon"
                    value={formik.values.icon}
                    onChange={formik.handleChange}
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
<textarea
  name="description"
  value={formik.values.description}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  placeholder="Event description (minimum 10 characters)"
  className={`w-full px-4 py-3 rounded-xl border ${
    formik.errors.description && formik.touched.description 
      ? 'border-red-500' 
      : 'border-gray-200'
  } bg-white text-gray-900 focus:border-lightBlue-500 focus:ring-2 focus:ring-lightBlue-500/20 focus:outline-none transition-all duration-200`}
  rows="3"
  minLength="10"
/>
{formik.errors.description && formik.touched.description && (
  <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                  <select
                    name="backgroundColor"
                    value={formik.values.backgroundColor}
                    onChange={formik.handleChange}
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
                  >
                    {backgroundOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                  <input
                    type="text"
                    name="requirements"
                    value={formik.values.requirements}
                    onChange={formik.handleChange}
                    placeholder="Event requirements"
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highlight</label>
                  <input
                    type="text"
                    name="highlight"
                    value={formik.values.highlight}
                    onChange={formik.handleChange}
                    placeholder="Event highlight"
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Prize Breakdown */}
              <div className="md:col-span-2 space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prize Distribution (Auto-calculated)
                </label>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  {formik.values.prizeBreakdown.map((breakdown, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="font-medium">{breakdown.position}</div>
                      <div className="text-gray-700">{breakdown.reward}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Reward Tiers */}
              <div className="md:col-span-2 space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performance Reward Tiers
                </label>
                <div className="space-y-3">
                  {formik.values.rewardTiers.map((tier, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Tier Name</label>
                          <input
                            type="text"
                            value={tier.tier}
                            onChange={(e) => handleRewardTierChange(index, 'tier', e.target.value)}
                            placeholder="e.g. 5%+ Gain"
                            className="w-full px-3 py-2 rounded-lg border !border-gray-200 !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Reward Description</label>
                          <input
                            type="text"
                            value={tier.description}
                            onChange={(e) => handleRewardTierChange(index, 'description', e.target.value)}
                            placeholder="e.g. 50% of entry fee returned"
                            className="w-full px-3 py-2 rounded-lg border !border-gray-200 !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRewardTier(index)}
                        className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-red-50 transition-colors mt-6"
                        disabled={formik.values.rewardTiers.length <= 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRewardTier}
                    className="mt-2 flex items-center text-lightBlue-600 hover:text-lightBlue-800 text-sm font-medium"
                  >
                    <Plus size={16} className="mr-2" /> Add Reward Tier
                  </button>
                </div>
              </div>

              {/* Additional Rewards */}
              <div className="md:col-span-2 space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Rewards</label>
                <div className="space-y-3">
                  {formik.values.rewards.map((reward, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        placeholder="Reward description"
                        value={reward}
                        onChange={(e) => handleRewardsChange(index, e.target.value)}
                        className="flex-1 px-4 py-3 !rounded-xl border !border-gray-200 !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeReward(index)}
                        className="p-3 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed !rounded-xl hover:bg-red-50 transition-colors"
                        disabled={formik.values.rewards.length <= 1}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addReward}
                    className="mt-2 flex items-center text-lightBlue-600 hover:text-lightBlue-800 text-sm font-medium"
                  >
                    <Plus size={16} className="mr-2" /> Add Reward
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
                <div className="relative">
                  <input
                    type="number"
                    name="progress"
                    value={formik.values.progress}
                    onChange={formik.handleChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 pr-10 !rounded-xl border !border-gray-200 !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">%</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Progress Text</label>
                <input
                  type="text"
                  name="progressText"
                  value={formik.values.progressText}
                  onChange={formik.handleChange}
                  placeholder="Progress description"
                  className="w-full px-4 py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:border-lightBlue-500 focus:ring-2 focus:ring-lightBlue-500/20 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="sticky flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-3 !rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-3 !rounded-xl bg-lightBlue-600 text-white hover:bg-lightBlue-700 transition-colors duration-200"
              >
                {event ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;