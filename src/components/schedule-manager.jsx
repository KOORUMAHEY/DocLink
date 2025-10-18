import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useTheme } from '@/context/theme';
import { cn } from '@/lib/utils';

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
  const { isDark } = useTheme();
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
      <div className={cn(
        "flex items-center justify-center p-8 rounded-lg",
        isDark ? "bg-gray-800" : "bg-white"
      )}>
        <div className="text-center">
          <Clock className={cn(
            "h-8 w-8 animate-spin mx-auto mb-4",
            isDark ? "text-blue-400" : "text-blue-600"
          )} />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>Loading schedule configuration...</p>
        </div>
      </div>
    );
  }

  const availableDates = getAvailableDates(scheduleConfig, 7);

  return (
    <div className={cn("space-y-4", isDark ? "bg-gray-900" : "")}>
      {/* Save Button - Top */}
      <div className="flex justify-end mb-3 sm:mb-4">
        <Button onClick={saveScheduleConfig} disabled={saving} size="sm" className={cn(
          "text-xs sm:text-sm h-8 sm:h-10",
          isDark 
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"
        )}>
          {saving ? (
            <>
              <Clock className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Save Configuration</span>
              <span className="sm:hidden">Save</span>
            </>
          )}
        </Button>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="hours" className="w-full">
        <TabsList className={cn(
          "grid w-full grid-cols-3 p-0.5 sm:p-1 rounded-lg h-8 sm:h-10 text-xs sm:text-sm",
          isDark ? "bg-gray-800" : "bg-gray-100"
        )}>
          <TabsTrigger value="hours" className="text-xs sm:text-sm px-1 sm:px-4 py-1 sm:py-2 rounded data-[state=active]:text-xs sm:data-[state=active]:text-sm">Working Hours</TabsTrigger>
          <TabsTrigger value="slots" className="text-xs sm:text-sm px-1 sm:px-4 py-1 sm:py-2 rounded data-[state=active]:text-xs sm:data-[state=active]:text-sm">Time Slots</TabsTrigger>
          <TabsTrigger value="preview" className="text-xs sm:text-sm px-1 sm:px-4 py-1 sm:py-2 rounded data-[state=active]:text-xs sm:data-[state=active]:text-sm">Preview</TabsTrigger>
        </TabsList>

        {/* Tab 1: Working Hours */}
        <TabsContent value="hours" className="mt-2 sm:mt-4">
          <Card className={cn(
            "shadow-sm border",
            isDark
              ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50"
              : "bg-gradient-to-br from-blue-50 to-white border-blue-100"
          )}>
            <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className={cn(
                "text-base sm:text-lg font-semibold flex items-center gap-2",
                isDark ? "text-gray-100" : "text-blue-900"
              )}>
                <Clock className={cn(
                  "w-4 sm:w-5 h-4 sm:h-5",
                  isDark ? "text-blue-400" : "text-blue-600"
                )} />
                Working Hours
              </CardTitle>
              <CardDescription className={isDark ? "text-gray-400" : "text-blue-700"}>Set your availability for each day</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6 pb-3 sm:pb-6">
              <div className="space-y-2 sm:space-y-3">
                {daysOfWeek.map(day => {
                  const dayConfig = scheduleConfig.workingHours?.[day.key] || { enabled: false, start: '09:00', end: '17:00' };
                  return (
                    <div 
                      key={day.key} 
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-2 sm:p-4 rounded-xl border-2 transition-all duration-200",
                        isDark
                          ? dayConfig.enabled
                            ? "bg-gray-700/30 border-gray-600/50 shadow-md"
                            : "bg-gray-800/20 border-gray-700/30"
                          : dayConfig.enabled
                          ? "bg-white border-blue-300 shadow-md"
                          : "bg-slate-50 border-slate-200"
                      )}
                    >
                      {/* Left: Day name with toggle */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-1">
                        <Switch
                          checked={dayConfig.enabled}
                          onCheckedChange={(enabled) => updateWorkingHours(day.key, 'enabled', enabled)}
                          className="scale-100 sm:scale-110"
                        />
                        <span className={cn(
                          "text-xs sm:text-sm font-semibold w-16 sm:w-24",
                          isDark
                            ? dayConfig.enabled
                              ? "text-gray-100"
                              : "text-gray-500"
                            : dayConfig.enabled
                            ? "text-blue-900"
                            : "text-slate-400"
                        )}>
                          {day.label}
                        </span>
                      </div>

                      {/* Right: Time picker with clock icons */}
                      {dayConfig.enabled && (
                        <div className="flex items-center gap-1.5 sm:gap-3 flex-1 sm:flex-none justify-end">
                          <div className={cn(
                            "flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-2 rounded-lg border",
                            isDark
                              ? "bg-blue-900/30 border-blue-700/50"
                              : "bg-blue-50 border-blue-200"
                          )}>
                            <Clock className={cn(
                              "w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0",
                              isDark ? "text-blue-400" : "text-blue-600"
                            )} />
                            <Input
                              type="time"
                              value={dayConfig.start || '09:00'}
                              onChange={(e) => updateWorkingHours(day.key, 'start', e.target.value)}
                              className={cn(
                                "w-14 sm:w-24 h-6 sm:h-8 text-xs px-1 py-0.5 text-center border-0 bg-transparent focus:ring-0 font-semibold",
                                isDark ? "text-blue-400" : "text-blue-900"
                              )}
                            />
                          </div>
                          <span className={cn(
                            "font-bold text-sm",
                            isDark ? "text-gray-600" : "text-slate-400"
                          )}>→</span>
                          <div className={cn(
                            "flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-2 rounded-lg border",
                            isDark
                              ? "bg-orange-900/30 border-orange-700/50"
                              : "bg-orange-50 border-orange-200"
                          )}>
                            <Clock className={cn(
                              "w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0",
                              isDark ? "text-orange-400" : "text-orange-600"
                            )} />
                            <Input
                              type="time"
                              value={dayConfig.end || '17:00'}
                              onChange={(e) => updateWorkingHours(day.key, 'end', e.target.value)}
                              className={cn(
                                "w-14 sm:w-24 h-6 sm:h-8 text-xs px-1 py-0.5 text-center border-0 bg-transparent focus:ring-0 font-semibold",
                                isDark ? "text-orange-400" : "text-orange-900"
                              )}
                            />
                          </div>
                        </div>
                      )}
                      {!dayConfig.enabled && (
                        <span className={cn(
                          "text-xs italic",
                          isDark ? "text-gray-500" : "text-slate-400"
                        )}>Day off</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Time Slots & Breaks */}
        <TabsContent value="slots" className="mt-2 sm:mt-4 space-y-3 sm:space-y-4">
          {/* Appointment Duration */}
          <Card className={cn(
            "shadow-sm border",
            isDark
              ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50"
              : "bg-gradient-to-br from-blue-50 to-white border-blue-100"
          )}>
            <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className={cn(
                "flex items-center gap-2 text-base sm:text-lg",
                isDark ? "text-gray-100" : "text-blue-900"
              )}>
                <Clock className={cn(
                  "h-4 sm:h-5 w-4 sm:w-5",
                  isDark ? "text-blue-400" : "text-blue-600"
                )} />
                Appointment Duration
              </CardTitle>
              <CardDescription className={isDark ? "text-gray-400" : "text-blue-700"}>How long should each appointment be?</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {commonDurations.map(duration => (
                  <Button
                    key={duration.value}
                    variant={scheduleConfig.timeSlots.slotDuration === duration.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateTimeSlots('slotDuration', duration.value)}
                    className={cn(
                      "text-xs sm:text-sm transition-all",
                      scheduleConfig.timeSlots.slotDuration === duration.value
                        ? isDark
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        : isDark
                        ? "border-gray-600 hover:border-gray-500 text-gray-300"
                        : "border-blue-200 hover:border-blue-400"
                    )}
                  >
                    {duration.label}
                  </Button>
                ))}
                <Button
                  variant={showCustomDuration ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowCustomDuration(!showCustomDuration)}
                  className={cn(
                    "text-xs sm:text-sm",
                    showCustomDuration
                      ? isDark
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                      : isDark
                      ? "border-gray-600 hover:border-gray-500 text-gray-300"
                      : "border-blue-200"
                  )}
                >
                  Custom
                </Button>
              </div>
              
              {showCustomDuration && (
                <div className={cn(
                  "flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-1.5 p-2 sm:p-4 mt-3 sm:mt-4 rounded-xl border",
                  isDark
                    ? "bg-blue-900/20 border-blue-700/50"
                    : "bg-blue-50 border-blue-200"
                )}>
                  <Input
                    type="number"
                    placeholder="Minutes"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className={cn(
                      "w-full sm:w-24 text-xs sm:text-sm h-8 sm:h-10",
                      isDark
                        ? "bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                        : "bg-white border-blue-300"
                    )}
                    min="1"
                    max="480"
                  />
                  <span className={cn(
                    "text-xs sm:text-sm font-medium",
                    isDark ? "text-gray-400" : "text-blue-700"
                  )}>minutes</span>
                  <Button
                    size="sm"
                    onClick={handleCustomDuration}
                    disabled={!customDuration}
                    className={cn(
                      "w-full sm:w-auto text-xs sm:text-sm",
                      isDark
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700"
                    )}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Break Duration */}
          <Card className={cn(
            "shadow-sm border",
            isDark
              ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50"
              : "bg-gradient-to-br from-orange-50 to-white border-orange-100"
          )}>
            <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className={cn(
                "flex items-center gap-2 text-base sm:text-lg",
                isDark ? "text-gray-100" : "text-orange-900"
              )}>
                <Clock className={cn(
                  "h-4 sm:h-5 w-4 sm:w-5",
                  isDark ? "text-orange-400" : "text-orange-600"
                )} />
                Break Between Appointments
              </CardTitle>
              <CardDescription className={isDark ? "text-gray-400" : "text-orange-700"}>How much time between each appointment?</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className={cn(
                "flex items-center gap-2 sm:gap-3 p-2 sm:p-4 rounded-xl border",
                isDark
                  ? "bg-orange-900/20 border-orange-700/50"
                  : "bg-orange-50 border-orange-200"
              )}>
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={scheduleConfig.timeSlots.breakDuration || 0}
                  onChange={(e) => updateTimeSlots('breakDuration', parseInt(e.target.value) || 0)}
                  className={cn(
                    "w-16 sm:w-32 text-xs sm:text-sm h-8 sm:h-10",
                    isDark
                      ? "bg-gray-700/50 border-gray-600 text-white"
                      : "bg-white border-orange-300"
                  )}
                />
                <span className={cn(
                  "text-xs sm:text-sm font-medium",
                  isDark ? "text-gray-400" : "text-orange-700"
                )}>minutes</span>
              </div>
            </CardContent>
          </Card>

          {/* Custom Breaks */}
          <Card className={cn(
            "shadow-sm border",
            isDark
              ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50"
              : "bg-gradient-to-br from-purple-50 to-white border-purple-100"
          )}>
            <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className={cn(
                "flex items-center gap-2 text-base sm:text-lg",
                isDark ? "text-gray-100" : "text-purple-900"
              )}>
                <Settings className={cn(
                  "h-4 sm:h-5 w-4 sm:w-5",
                  isDark ? "text-purple-400" : "text-purple-600"
                )} />
                Custom Breaks
              </CardTitle>
              <CardDescription className={isDark ? "text-gray-400" : "text-purple-700"}>Add breaks like lunch or specific unavailable times</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-2 sm:space-y-3">
              <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className={cn(
                    "w-full sm:w-auto text-xs sm:text-sm",
                    isDark
                      ? "border-gray-600 hover:bg-gray-700/50 text-gray-300"
                      : "border-purple-300 hover:bg-purple-50"
                  )}>
                    <Plus className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    Add Break
                  </Button>
                </DialogTrigger>
                <DialogContent className={cn(
                  "max-w-md mx-2 sm:mx-auto p-3 sm:p-6",
                  isDark ? "bg-gray-900 border-gray-700" : ""
                )}>
                  <DialogHeader>
                    <DialogTitle className={cn("text-base sm:text-lg", isDark ? "text-gray-100" : "")}>Add Break Time</DialogTitle>
                    <DialogDescription className={cn("text-xs sm:text-sm", isDark ? "text-gray-400" : "")}>Add a break or unavailable time period</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="breakLabel" className={cn("text-xs sm:text-sm", isDark ? "text-gray-300" : "")}>Break Label (e.g., Lunch)</Label>
                      <Input
                        id="breakLabel"
                        value={newBreak.label}
                        onChange={(e) => setNewBreak(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="e.g., Lunch, Meeting"
                        className={cn(
                          "mt-1 text-xs sm:text-sm h-8 sm:h-10",
                          isDark ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : ""
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <Label htmlFor="breakStart" className={cn("text-xs sm:text-sm", isDark ? "text-gray-300" : "")}>Start Time</Label>
                        <Input
                          id="breakStart"
                          type="time"
                          value={newBreak.start}
                          onChange={(e) => setNewBreak(prev => ({ ...prev, start: e.target.value }))}
                          className={cn(
                            "mt-1 text-xs sm:text-sm h-8 sm:h-10",
                            isDark ? "bg-gray-800 border-gray-700 text-white" : ""
                          )}
                        />
                      </div>
                      <div>
                        <Label htmlFor="breakEnd" className={cn("text-xs sm:text-sm", isDark ? "text-gray-300" : "")}>End Time</Label>
                        <Input
                          id="breakEnd"
                          type="time"
                          value={newBreak.end}
                          onChange={(e) => setNewBreak(prev => ({ ...prev, end: e.target.value }))}
                          className={cn(
                            "mt-1 text-xs sm:text-sm h-8 sm:h-10",
                            isDark ? "bg-gray-800 border-gray-700 text-white" : ""
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowBreakDialog(false)} className={cn(
                        "w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-10",
                        isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700/50" : ""
                      )}>
                        Cancel
                      </Button>
                      <Button onClick={addCustomBreak} className={cn(
                        "w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-10",
                        isDark
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-purple-600 hover:bg-purple-700"
                      )}>
                        Add Break
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Display breaks */}
              <div className="space-y-1.5 sm:space-y-2">
                {scheduleConfig.timeSlots?.customBreaks && scheduleConfig.timeSlots.customBreaks.length > 0 ? (
                  scheduleConfig.timeSlots.customBreaks.map((brk, index) => (
                    <div key={index} className={cn(
                      "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 p-2 sm:p-3 border-2 rounded-lg text-xs sm:text-sm",
                      isDark
                        ? "bg-gray-700/30 border-gray-600/50"
                        : "bg-white border-purple-300"
                    )}>
                      <div className="flex items-center gap-2">
                        <Clock className={cn(
                          "h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0",
                          isDark ? "text-purple-400" : "text-purple-600"
                        )} />
                        <div className="min-w-0">
                          <div className={cn(
                            "font-medium truncate",
                            isDark ? "text-gray-100" : "text-purple-900"
                          )}>{brk.label}</div>
                          <div className={cn(
                            "text-xs truncate",
                            isDark ? "text-gray-400" : "text-purple-600"
                          )}>{brk.start} → {brk.end}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomBreak(index)}
                        className={cn(
                          "w-full sm:w-auto text-xs sm:text-sm h-7 sm:h-8",
                          isDark
                            ? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
                            : "text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                        )}
                      >
                        <Trash2 className="h-3 sm:h-4 w-3 sm:w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className={cn(
                    "text-center py-3 sm:py-4 text-xs italic",
                    isDark ? "text-gray-500" : "text-purple-400"
                  )}>No breaks added</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Holidays */}
          <Card className={cn(
            "shadow-sm border",
            isDark
              ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50"
              : "bg-gradient-to-br from-red-50 to-white border-red-100"
          )}>
            <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className={cn(
                "flex items-center gap-2 text-base sm:text-lg",
                isDark ? "text-gray-100" : "text-red-900"
              )}>
                <Calendar className={cn(
                  "h-4 sm:h-5 w-4 sm:w-5",
                  isDark ? "text-red-400" : "text-red-600"
                )} />
                Holidays & Unavailable Dates
              </CardTitle>
              <CardDescription className={isDark ? "text-gray-400" : "text-red-700"}>Mark dates when you're unavailable for appointments</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-2 sm:space-y-3">
              <Dialog open={showHolidayDialog} onOpenChange={setShowHolidayDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className={cn(
                    "w-full sm:w-auto text-xs sm:text-sm",
                    isDark
                      ? "border-gray-600 hover:bg-gray-700/50 text-gray-300"
                      : "border-red-300 hover:bg-red-50"
                  )}>
                    <Plus className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    Add Holiday
                  </Button>
                </DialogTrigger>
                <DialogContent className={cn(
                  "max-w-md mx-2 sm:mx-auto p-3 sm:p-6",
                  isDark ? "bg-gray-900 border-gray-700" : ""
                )}>
                  <DialogHeader>
                    <DialogTitle className={cn("text-base sm:text-lg", isDark ? "text-gray-100" : "")}>Add Holiday</DialogTitle>
                    <DialogDescription className={cn("text-xs sm:text-sm", isDark ? "text-gray-400" : "")}>Mark a date when you're unavailable</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="holidayDate" className={cn("text-xs sm:text-sm", isDark ? "text-gray-300" : "")}>Date</Label>
                      <Input
                        id="holidayDate"
                        type="date"
                        value={newHoliday.date}
                        onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className={cn(
                          "mt-1 text-xs sm:text-sm h-8 sm:h-10",
                          isDark ? "bg-gray-800 border-gray-700 text-white" : ""
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="holidayReason" className={cn("text-xs sm:text-sm", isDark ? "text-gray-300" : "")}>Reason (Optional)</Label>
                      <Input
                        id="holidayReason"
                        value={newHoliday.reason}
                        onChange={(e) => setNewHoliday(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder="e.g., Holiday, Personal leave"
                        className={cn(
                          "mt-1 text-xs sm:text-sm h-8 sm:h-10",
                          isDark ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : ""
                        )}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowHolidayDialog(false)} className={cn(
                        "w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-10",
                        isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700/50" : ""
                      )}>
                        Cancel
                      </Button>
                      <Button onClick={addHoliday} className={cn(
                        "w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-10",
                        isDark
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-red-600 hover:bg-red-700"
                      )}>
                        Add Holiday
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="space-y-1.5 sm:space-y-2">
                {scheduleConfig.unavailableDates && scheduleConfig.unavailableDates.length > 0 ? (
                  scheduleConfig.unavailableDates.map((holiday, index) => (
                    <div key={index} className={cn(
                      "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 p-2 sm:p-3 border-2 rounded-lg text-xs sm:text-sm",
                      isDark
                        ? "bg-gray-700/30 border-gray-600/50"
                        : "bg-white border-red-300"
                    )}>
                      <div className="flex items-center gap-2">
                        <Calendar className={cn(
                          "h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0",
                          isDark ? "text-red-400" : "text-red-600"
                        )} />
                        <div className="min-w-0">
                          <div className={cn(
                            "font-medium truncate",
                            isDark ? "text-gray-100" : "text-red-900"
                          )}>
                            {new Date(holiday.date || holiday).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          {holiday.reason && <div className={cn(
                            "text-xs truncate",
                            isDark ? "text-gray-400" : "text-red-600"
                          )}>{holiday.reason}</div>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHoliday(index)}
                        className={cn(
                          "w-full sm:w-auto text-xs sm:text-sm h-7 sm:h-8",
                          isDark
                            ? "text-red-400 hover:text-red-300 hover:bg-red-900/30"
                            : "text-red-600 hover:text-red-800 hover:bg-red-100"
                        )}
                      >
                        <Trash2 className="h-3 sm:h-4 w-3 sm:w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className={cn(
                    "text-center py-3 sm:py-4 text-xs italic",
                    isDark ? "text-gray-500" : "text-red-400"
                  )}>No holidays added</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Preview */}
        <TabsContent value="preview" className="mt-2 sm:mt-4">
          <Card className={cn(
            "shadow-sm border",
            isDark
              ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50"
              : "bg-gradient-to-br from-green-50 to-white border-green-100"
          )}>
            <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className={cn(
                "flex items-center gap-2 text-base sm:text-lg",
                isDark ? "text-gray-100" : "text-green-900"
              )}>
                <CheckCircle2 className={cn(
                  "h-4 sm:h-5 w-4 sm:w-5",
                  isDark ? "text-green-400" : "text-green-600"
                )} />
                Preview Time Slots
              </CardTitle>
              <CardDescription className={isDark ? "text-gray-400" : "text-green-700"}>See how your time slots appear to patients</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-3 sm:space-y-6">
              <div>
                <Label htmlFor="previewDateSelect" className={cn(
                  "text-xs sm:text-sm font-semibold",
                  isDark ? "text-gray-300" : "text-gray-900"
                )}>Select Date to Preview</Label>
                <Select value={previewDate} onValueChange={setPreviewDate}>
                  <SelectTrigger id="previewDateSelect" className={cn(
                    "w-full mt-1.5 sm:mt-3 h-8 sm:h-10 text-xs sm:text-sm",
                    isDark
                      ? "bg-gray-700/50 border-gray-600 text-white"
                      : "bg-white border-green-300"
                  )}>
                    <SelectValue placeholder="Choose a date" />
                  </SelectTrigger>
                  <SelectContent className="text-xs sm:text-sm">
                    {availableDates.map(date => (
                      <SelectItem key={date.value} value={date.value} className="text-xs sm:text-sm">
                        {date.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {previewDate && (
                <div className={cn(
                  "space-y-2 sm:space-y-3 p-3 sm:p-6 border-2 rounded-xl",
                  isDark
                    ? "bg-gray-700/20 border-gray-600/50"
                    : "bg-white border-green-300"
                )}>
                  <p className={cn(
                    "text-xs sm:text-sm font-semibold",
                    isDark ? "text-gray-300" : "text-green-900"
                  )}>
                    Available Slots:
                  </p>
                  {previewSlots.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1.5 sm:gap-2">
                      {previewSlots.map((slot, index) => (
                        <div key={index} className={cn(
                          "flex items-center justify-center p-1.5 sm:p-3 border rounded-lg hover:shadow-md transition-all",
                          isDark
                            ? "bg-green-900/30 border-green-700/50"
                            : "bg-gradient-to-br from-green-100 to-green-50 border-green-300"
                        )}>
                          <div className="text-center">
                            <Clock className={cn(
                              "h-2.5 sm:h-3 w-2.5 sm:w-3 mx-auto mb-0.5 sm:mb-1",
                              isDark ? "text-green-400" : "text-green-600"
                            )} />
                            <span className={cn(
                              "text-xs font-bold",
                              isDark ? "text-green-300" : "text-green-900"
                            )}>{slot.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={cn(
                      "flex items-center gap-2 sm:gap-3 border-l-4 p-2 sm:p-4 rounded-lg",
                      isDark
                        ? "bg-orange-900/20 border-l-orange-600 text-orange-400"
                        : "bg-orange-50 border-l-orange-400"
                    )}>
                      <AlertCircle className={cn(
                        "h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0",
                        isDark ? "text-orange-400" : "text-orange-600"
                      )} />
                      <span className={cn(
                        "text-xs sm:text-sm font-medium",
                        isDark ? "text-orange-300" : "text-orange-800"
                      )}>No slots available for this date</span>
                    </div>
                  )}
                </div>
              )}

              {!previewDate && (
                <div className={cn(
                  "flex items-center gap-2 sm:gap-3 border-l-4 p-2 sm:p-4 rounded-lg",
                  isDark
                    ? "bg-blue-900/20 border-l-blue-600 text-blue-400"
                    : "bg-blue-50 border-l-blue-400"
                )}>
                  <Calendar className={cn(
                    "h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0",
                    isDark ? "text-blue-400" : "text-blue-600"
                  )} />
                  <span className={cn(
                    "text-xs sm:text-sm",
                    isDark ? "text-blue-300" : "text-blue-800"
                  )}>Select a date to see available time slots</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
