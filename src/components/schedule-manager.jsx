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

const slotDurations = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' }
];

export default function ScheduleManager({ doctorId }) {
  const [scheduleConfig, setScheduleConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewDate, setPreviewDate] = useState('');
  const [previewSlots, setPreviewSlots] = useState([]);
  const [newBreak, setNewBreak] = useState({ start: '', end: '', label: '' });
  const [showBreakDialog, setShowBreakDialog] = useState(false);
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
      console.log('Regenerating time slots:', { 
        slotDuration: scheduleConfig.timeSlots.slotDuration,
        breakDuration: scheduleConfig.timeSlots.breakDuration,
        previewDate 
      });
      const slots = generateTimeSlots(scheduleConfig, previewDate);
      console.log('Generated slots:', slots);
      setPreviewSlots(slots);
    }
  }, [scheduleConfig, previewDate]);

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
    console.log('Updating time slots:', { field, value });
    setScheduleConfig(prev => {
      const newConfig = {
        ...prev,
        timeSlots: {
          ...prev.timeSlots,
          [field]: value
        }
      };
      console.log('New schedule config:', newConfig);
      return newConfig;
    });
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

  if (loading) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Schedule Configuration
          </h2>
          <p className="text-gray-600">Configure your available days and time slots</p>
        </div>
        <Button onClick={saveScheduleConfig} disabled={saving}>
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

      <div className="grid lg:grid-cols-2 gap-6">
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
            {daysOfWeek.map(day => (
              <div key={day.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={scheduleConfig.workingHours[day.key]?.enabled || false}
                    onCheckedChange={(enabled) => updateWorkingHours(day.key, 'enabled', enabled)}
                  />
                  <Label className="font-medium">{day.label}</Label>
                </div>
                
                {scheduleConfig.workingHours[day.key]?.enabled && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={scheduleConfig.workingHours[day.key]?.start || '09:00'}
                      onChange={(e) => updateWorkingHours(day.key, 'start', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-gray-400">to</span>
                    <Input
                      type="time"
                      value={scheduleConfig.workingHours[day.key]?.end || '17:00'}
                      onChange={(e) => updateWorkingHours(day.key, 'end', e.target.value)}
                      className="w-24"
                    />
                  </div>
                )}
              </div>
            ))}
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
              <Label>Appointment Duration</Label>
              <Select 
                value={scheduleConfig.timeSlots.slotDuration?.toString()} 
                onValueChange={(value) => updateTimeSlots('slotDuration', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {slotDurations.map(duration => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <div className="flex items-center justify-between mb-3">
                <Label className="font-medium">Custom Breaks</Label>
                <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Break
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
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
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowBreakDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addCustomBreak}>
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
            <div className="flex items-center gap-4">
              <Label>Preview Date:</Label>
              <Select value={previewDate} onValueChange={setPreviewDate}>
                <SelectTrigger className="w-64">
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
                  <div className="flex flex-wrap gap-2">
                    {previewSlots.map((slot, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
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
