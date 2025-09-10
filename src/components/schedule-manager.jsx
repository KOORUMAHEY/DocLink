import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Clock, 
  Calendar, 
  Save, 
  Plus, 
  Trash2, 
  Settings, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { getDoctorSchedule, saveDoctorSchedule, generateTimeSlots, getAvailableDates } from '@/services/scheduleService';
import { useToast } from '@/hooks/use-toast';

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

const commonDurations = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' }
];

export default function ScheduleManager({ doctorId }) {
  const [scheduleConfig, setScheduleConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewDate, setPreviewDate] = useState('');
  const [previewSlots, setPreviewSlots] = useState([]);
  const [newBreak, setNewBreak] = useState({ start: '', end: '', label: '' });
  const [showBreakDialog, setShowBreakDialog] = useState(false);
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ date: '', reason: '' });
  const [showHolidayDialog, setShowHolidayDialog] = useState(false);
  const { toast } = useToast();

  const loadScheduleConfig = useCallback(async () => {
    try {
      const config = await getDoctorSchedule(doctorId);
      setScheduleConfig(config);
      
      // Set preview date to next available date
      const availableDates = getAvailableDates(config, 7);
      if (availableDates.length > 0) {
        setPreviewDate(availableDates[0].value);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to load schedule configuration.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [doctorId, toast]);

  useEffect(() => {
    loadScheduleConfig();
  }, [doctorId, loadScheduleConfig]);

  useEffect(() => {
    if (scheduleConfig && previewDate) {
      const slots = generateTimeSlots(scheduleConfig, previewDate);
      setPreviewSlots(slots);
    }
  }, [scheduleConfig, previewDate]);

  useEffect(() => {
    // Check if current duration is a custom one (not in common durations)
    if (scheduleConfig?.timeSlots?.slotDuration) {
      const isCustom = !commonDurations.find(d => d.value === scheduleConfig.timeSlots.slotDuration);
      if (isCustom) {
        setCustomDuration(scheduleConfig.timeSlots.slotDuration.toString());
      }
    }
  }, [scheduleConfig?.timeSlots?.slotDuration]);

  const saveScheduleConfig = async () => {
    setSaving(true);
    try {
      await saveDoctorSchedule(doctorId, scheduleConfig);
      toast({
        title: 'Success',
        description: 'Schedule configuration saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save schedule configuration.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateWorkingHours = (day, field, value) => {
    setScheduleConfig(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  const updateTimeSlots = (field, value) => {
    setScheduleConfig(prev => ({
      ...prev,
      timeSlots: {
        ...prev.timeSlots,
        [field]: value
      }
    }));
  };

  const handleCustomDuration = () => {
    const duration = parseInt(customDuration);
    if (duration && duration > 0 && duration <= 480) { // Max 8 hours
      updateTimeSlots('slotDuration', duration);
      setShowCustomDuration(false);
      setCustomDuration('');
    }
  };

  const addCustomBreak = () => {
    if (newBreak.start && newBreak.end && newBreak.label) {
      setScheduleConfig(prev => ({
        ...prev,
        timeSlots: {
          ...prev.timeSlots,
          customBreaks: [
            ...(prev.timeSlots.customBreaks || []),
            { ...newBreak }
          ]
        }
      }));
      setNewBreak({ start: '', end: '', label: '' });
      setShowBreakDialog(false);
    }
  };

  const removeCustomBreak = (index) => {
    setScheduleConfig(prev => ({
      ...prev,
      timeSlots: {
        ...prev.timeSlots,
        customBreaks: prev.timeSlots.customBreaks.filter((_, i) => i !== index)
      }
    }));
  };

  const addHoliday = () => {
    if (newHoliday.date && newHoliday.reason) {
      setScheduleConfig(prev => ({
        ...prev,
        unavailableDates: [
          ...(prev.unavailableDates || []),
          { date: newHoliday.date, reason: newHoliday.reason }
        ]
      }));
      setNewHoliday({ date: '', reason: '' });
      setShowHolidayDialog(false);
      toast({
        title: 'Holiday Added',
        description: `Holiday on ${newHoliday.date} has been added.`,
      });
    }
  };

  const removeHoliday = (index) => {
    setScheduleConfig(prev => ({
      ...prev,
      unavailableDates: prev.unavailableDates.filter((_, i) => i !== index)
    }));
    toast({
      title: 'Holiday Removed',
      description: 'Holiday has been removed from your schedule.',
    });
  };

  if (loading || !scheduleConfig) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading schedule configuration...</p>
        </div>
      </div>
    );
  }

  const availableDates = getAvailableDates(scheduleConfig, 7);

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
            Schedule Configuration
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Configure your available days and time slots</p>
        </div>
        <Button onClick={saveScheduleConfig} disabled={saving} className="w-full sm:w-auto">
          {saving ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Working Hours Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Working Days & Hours
            </CardTitle>
            <CardDescription>
              Set your available days and working hours for each day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysOfWeek.map(day => {
              const dayConfig = scheduleConfig.workingHours?.[day.key] || { enabled: false, start: '09:00', end: '17:00' };
              return (
                <div key={day.key} className={`p-3 border rounded-lg transition-colors ${
                  dayConfig.enabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={dayConfig.enabled}
                        onCheckedChange={(enabled) => updateWorkingHours(day.key, 'enabled', enabled)}
                      />
                      <Label className={`font-medium text-sm sm:text-base ${dayConfig.enabled ? 'text-blue-900' : 'text-gray-600'}`}>
                        {day.label}
                      </Label>
                    </div>
                  
                    {dayConfig.enabled && (
                      <div className="flex items-center gap-2 ml-8 sm:ml-0">
                        <Input
                          type="time"
                          value={dayConfig.start || '09:00'}
                          onChange={(e) => updateWorkingHours(day.key, 'start', e.target.value)}
                          className="w-20 sm:w-24 text-sm"
                        />
                        <span className="text-gray-400 text-sm">to</span>
                        <Input
                          type="time"
                          value={dayConfig.end || '17:00'}
                          onChange={(e) => updateWorkingHours(day.key, 'end', e.target.value)}
                          className="w-20 sm:w-24 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Time Slot Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Slot Settings
            </CardTitle>
            <CardDescription>
              Configure appointment duration and break times
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-3 block">Appointment Duration</Label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {commonDurations.map(duration => (
                    <Button
                      key={duration.value}
                      variant={scheduleConfig.timeSlots.slotDuration === duration.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateTimeSlots('slotDuration', duration.value)}
                      className="text-xs sm:text-sm"
                    >
                      {duration.label}
                    </Button>
                  ))}
                  <Button
                    variant={showCustomDuration ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowCustomDuration(!showCustomDuration)}
                    className="min-w-[70px]"
                  >
                    Custom
                  </Button>
                </div>
                
                {showCustomDuration && (
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-2 sm:space-y-0 p-3 bg-gray-50 rounded-lg">
                    <Input
                      type="number"
                      placeholder="Enter minutes"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(e.target.value)}
                      className="w-full sm:w-32"
                      min="1"
                      max="480"
                    />
                    <span className="text-sm text-gray-600 self-center">minutes</span>
                    <Button
                      size="sm"
                      onClick={handleCustomDuration}
                      disabled={!customDuration || parseInt(customDuration) <= 0}
                      className="w-full sm:w-auto"
                    >
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowCustomDuration(false);
                        setCustomDuration('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                
                {scheduleConfig.timeSlots.slotDuration && 
                 !commonDurations.find(d => d.value === scheduleConfig.timeSlots.slotDuration) && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    Current: {scheduleConfig.timeSlots.slotDuration} minutes (custom)
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Break Between Appointments (minutes)</Label>
              <Input
                type="number"
                min="0"
                max="60"
                value={scheduleConfig.timeSlots.breakDuration || 0}
                onChange={(e) => updateTimeSlots('breakDuration', parseInt(e.target.value) || 0)}
              />
            </div>

            <Separator />

            <div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-3">
                <Label className="font-medium text-sm sm:text-base">Custom Breaks</Label>
                <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Break
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md mx-4 sm:mx-auto">
                    <DialogHeader>
                      <DialogTitle>Add Custom Break</DialogTitle>
                      <DialogDescription>
                        Add a break time that will be unavailable for appointments
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Break Label</Label>
                        <Input
                          value={newBreak.label}
                          onChange={(e) => setNewBreak(prev => ({ ...prev, label: e.target.value }))}
                          placeholder="e.g., Lunch Break, Tea Break"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={newBreak.start}
                            onChange={(e) => setNewBreak(prev => ({ ...prev, start: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={newBreak.end}
                            onChange={(e) => setNewBreak(prev => ({ ...prev, end: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:gap-2 sm:space-y-0">
                        <Button variant="outline" onClick={() => setShowBreakDialog(false)} className="w-full sm:w-auto">
                          Cancel
                        </Button>
                        <Button onClick={addCustomBreak} className="w-full sm:w-auto">
                          Add Break
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                {scheduleConfig.timeSlots.customBreaks?.map((breakTime, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{breakTime.label}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {breakTime.start} - {breakTime.end}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCustomBreak(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {(!scheduleConfig.timeSlots.customBreaks || scheduleConfig.timeSlots.customBreaks.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No custom breaks configured
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Holiday Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Holiday Management
            </CardTitle>
            <CardDescription>
              Add dates when you&apos;re not available for appointments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-3">
              <Label className="font-medium text-sm sm:text-base">Unavailable Dates</Label>
              <Dialog open={showHolidayDialog} onOpenChange={setShowHolidayDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Holiday
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-4 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle>Add Holiday / Unavailable Date</DialogTitle>
                    <DialogDescription>
                      Select a date when you&apos;ll be unavailable for appointments
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newHoliday.date}
                        onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label>Reason (Optional)</Label>
                      <Input
                        value={newHoliday.reason}
                        onChange={(e) => setNewHoliday(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder="e.g., Holiday, Personal leave, Conference"
                      />
                    </div>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:gap-2 sm:space-y-0">
                      <Button variant="outline" onClick={() => setShowHolidayDialog(false)} className="w-full sm:w-auto">
                        Cancel
                      </Button>
                      <Button onClick={addHoliday} disabled={!newHoliday.date} className="w-full sm:w-auto">
                        Add Holiday
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Display existing holidays */}
            <div className="space-y-2">
              {scheduleConfig.unavailableDates && scheduleConfig.unavailableDates.length > 0 ? (
                scheduleConfig.unavailableDates.map((holiday, index) => (
                  <div key={index} className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-red-900 text-sm sm:text-base truncate">
                        {new Date(holiday.date || holiday).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      {holiday.reason && (
                        <div className="text-xs sm:text-sm text-red-600 truncate">{holiday.reason}</div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHoliday(index)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No holidays added yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Preview Time Slots
          </CardTitle>
          <CardDescription>
            See how your time slots will appear to patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
              <Label className="text-sm sm:text-base">Preview Date:</Label>
              <Select value={previewDate} onValueChange={setPreviewDate}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  {availableDates.map(date => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {previewDate && (
              <div>
                <Label className="text-sm text-gray-600 mb-3 block">
                  Available time slots for {previewDate}:
                </Label>
                {previewSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {previewSlots.map((slot, index) => (
                      <Badge key={index} variant="outline" className="px-2 py-1 text-xs sm:text-sm text-center">
                        {slot.label}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                    <span>No time slots available for this date</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
