'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, Activity, TrendingUp, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAppointmentTrends, getPatientDemographics, getTopDoctors } from '@/features/admin';

export default function DataVisualizations() {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [patientDemographicsData, setPatientDemographicsData] = useState([]);
  const [topDoctorsData, setTopDoctorsData] = useState([]);
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      let days;
      if (period === 'daily') {
        days = 7;
      } else if (period === 'weekly') {
        days = 28;
      } else {
        days = 90;
      }
      const [appointmentData, demographicsData, doctorsData] = await Promise.all([
        getAppointmentTrends(period, days),
        getPatientDemographics(),
        getTopDoctors()
      ]);
      setAppointmentsData(appointmentData);
      setPatientDemographicsData(demographicsData);
      setTopDoctorsData(doctorsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {/* Appointments Over Time */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden xl:col-span-3">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Appointments Over Time</CardTitle>
                <p className="text-sm text-muted-foreground">{period.charAt(0).toUpperCase() + period.slice(1)} appointment trends</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={period === 'daily' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setPeriod('daily')}
              >
                Daily
              </Button>
              <Button 
                variant={period === 'weekly' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setPeriod('weekly')}
              >
                Weekly
              </Button>
              <Button 
                variant={period === 'monthly' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setPeriod('monthly')}
              >
                Monthly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-sm text-gray-500">Loading data...</span>
              </div>
            </div>
          ) : error ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={loadData}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : appointmentsData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No appointment data available for the selected period</p>
              </div>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6b7280' }} 
                    tickLine={{ stroke: '#6b7280' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }} 
                    tickLine={{ stroke: '#6b7280' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    labelStyle={{ color: '#374151', fontWeight: 600 }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ stroke: '#3b82f6', strokeWidth: 2, fill: 'white', r: 4 }}
                    activeDot={{ stroke: '#3b82f6', strokeWidth: 2, fill: '#3b82f6', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

     

      {/* Patient Demographics */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Patient Demographics</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Age distribution</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientDemographicsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {patientDemographicsData.length > 0 && patientDemographicsData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {patientDemographicsData.length > 0 ? patientDemographicsData.map((item) => (
              <Badge key={item.name} variant="secondary" className="text-xs">
                {item.name}: {item.value}
              </Badge>
            )) : (
              <p className="text-sm text-gray-500">No patient data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Doctors */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Top Doctors</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">By appointment count</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="h-64">
            {topDoctorsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topDoctorsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280' }} 
                    tickLine={{ stroke: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }} 
                    tickLine={{ stroke: '#6b7280' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    labelStyle={{ color: '#374151', fontWeight: 600 }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Bar 
                    dataKey="appointments" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-500">No doctor data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}