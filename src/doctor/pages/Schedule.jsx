'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/theme';
import { cn } from '@/lib/utils';

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Monday', short: 'Mon' },
  { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { id: 'thursday', label: 'Thursday', short: 'Thu' },
  { id: 'friday', label: 'Friday', short: 'Fri' },
  { id: 'saturday', label: 'Saturday', short: 'Sat' },
  { id: 'sunday', label: 'Sunday', short: 'Sun' },
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00'
];

export default function Schedule({ doctorId }) {
  const { toast } = useToast();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState({});

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock schedule data
        const mockSchedule = {
          monday: { enabled: true, slots: ['09:00', '09:30', '10:00', '14:00', '15:00'] },
          tuesday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
          wednesday: { enabled: true, slots: ['09:00', '09:30', '10:00', '14:00', '15:00'] },
          thursday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
          friday: { enabled: true, slots: ['09:00', '09:30', '10:00', '14:00', '15:00'] },
          saturday: { enabled: false, slots: [] },
          sunday: { enabled: false, slots: [] },
        };

        setSchedule(mockSchedule);
      } catch (error) {
        console.error('Failed to load schedule:', error);
        toast({
          title: "Error",
          description: "Failed to load schedule data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [doctorId, toast]);

  const handleDayToggle = (dayId, enabled) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        enabled,
        slots: enabled ? prev[dayId]?.slots || [] : []
      }
    }));
  };

  const handleSlotToggle = (dayId, slot) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        slots: prev[dayId].slots.includes(slot)
          ? prev[dayId].slots.filter(s => s !== slot)
          : [...prev[dayId].slots, slot].sort()
      }
    }));
  };

  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Success",
        description: "Schedule updated successfully",
      });
    } catch (error) {
      console.error('Failed to save schedule:', error);
      toast({
        title: "Error",
        description: "Failed to save schedule",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(
            "text-3xl font-bold",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Schedule Management
          </h1>
          <p className={cn(
            "text-sm mt-1",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            Configure your working hours and availability
          </p>
        </div>
        <Button
          onClick={handleSaveSchedule}
          disabled={saving}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Schedule Cards */}
      <div className="grid gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const daySchedule = schedule[day.id] || { enabled: false, slots: [] };

          return (
            <Card key={day.id} className={cn(
              "transition-all duration-200",
              isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200",
              daySchedule.enabled ? "ring-2 ring-blue-500/20" : ""
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      daySchedule.enabled ? "bg-green-500" : "bg-gray-300"
                    )}></div>
                    <CardTitle className={cn(
                      "text-lg",
                      isDark ? "text-white" : "text-gray-900"
                    )}>
                      {day.label}
                    </CardTitle>
                    <Badge variant={daySchedule.enabled ? "default" : "secondary"}>
                      {daySchedule.slots.length} slots
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${day.id}-toggle`} className="text-sm">
                      {daySchedule.enabled ? 'Enabled' : 'Disabled'}
                    </Label>
                    <Switch
                      id={`${day.id}-toggle`}
                      checked={daySchedule.enabled}
                      onCheckedChange={(checked) => handleDayToggle(day.id, checked)}
                    />
                  </div>
                </div>
              </CardHeader>

              {daySchedule.enabled && (
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className={cn(
                        "font-medium",
                        isDark ? "text-gray-300" : "text-gray-700"
                      )}>
                        Available Time Slots
                      </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = daySchedule.slots.includes(slot);
                        return (
                          <Button
                            key={slot}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "text-xs h-8",
                              isSelected
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : isDark
                                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
                            )}
                            onClick={() => handleSlotToggle(day.id, slot)}
                          >
                            {slot}
                          </Button>
                        );
                      })}
                    </div>

                    {daySchedule.slots.length === 0 && (
                      <p className={cn(
                        "text-sm text-center py-4",
                        isDark ? "text-gray-500" : "text-gray-400"
                      )}>
                        No time slots selected. Click on time slots above to add availability.
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className={cn(
        "mt-6",
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
      )}>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center gap-2",
            isDark ? "text-white" : "text-gray-900"
          )}>
            <Calendar className="h-5 w-5" />
            Schedule Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={cn(
                "text-2xl font-bold",
                isDark ? "text-blue-400" : "text-blue-600"
              )}>
                {Object.values(schedule).filter(day => day.enabled).length}
              </div>
              <div className={cn(
                "text-sm",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                Working Days
              </div>
            </div>
            <div className="text-center">
              <div className={cn(
                "text-2xl font-bold",
                isDark ? "text-green-400" : "text-green-600"
              )}>
                {Object.values(schedule).reduce((total, day) => total + day.slots.length, 0)}
              </div>
              <div className={cn(
                "text-sm",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                Total Slots
              </div>
            </div>
            <div className="text-center">
              <div className={cn(
                "text-2xl font-bold",
                isDark ? "text-purple-400" : "text-purple-600"
              )}>
                {Math.round(Object.values(schedule).reduce((total, day) => total + day.slots.length, 0) / 7)}
              </div>
              <div className={cn(
                "text-sm",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                Avg. per Day
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}