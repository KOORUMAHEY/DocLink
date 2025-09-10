
'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { AlertTriangle, Calendar, Heart, Loader2, Recycle, User, Waves, Search, Info } from "lucide-react"
import { createAppointment } from "@/actions/appointments"
import { getPatientDetails } from "@/actions/patients"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "./ui/card"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { getFridays } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useI18n } from "@/context/i18n"

const appointmentFormSchema = z.object({
  patientType: z.enum(["new", "returning"], { required_error: "Please select patient type." }),
  hospitalId: z.string().min(1, "Hospital ID is required."),
  patientName: z.string().min(2, "Name must be at least 2 characters."),
  patientPhone: z.string().min(10, "Please enter a valid phone number."),
  patientEmail: z.string().email("Please enter a valid email address.").optional().or(z.literal('')),
  age: z.string().min(1, "Age is required.").max(3),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender."}),
  healthPriority: z.enum(["critical", "urgent", "normal", "routine"], { required_error: "Please select a health priority."}),
  description: z.string().optional(),
  doctorId: z.string({ required_error: "Please select a doctor." }),
  appointmentDate: z.string({ required_error: "Please select a date." }),
  timeSlot: z.string({ required_error: "Please select a time slot." }),
});

const fridays = getFridays();

const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export function AppointmentForm({ doctors, preselectedDoctorId }) {
    const router = useRouter();
    const { toast } = useToast();
    const { t } = useI18n();
    const [isFetching, setIsFetching] = useState(false);
    const [isDoctorPrefilled, setIsDoctorPrefilled] = useState(false);

    const form = useForm({
        resolver: zodResolver(appointmentFormSchema),
        defaultValues: {
            patientType: "new",
            hospitalId: "",
            patientName: "",
            patientPhone: "",
            patientEmail: "",
            age: "",
            gender: undefined,
            healthPriority: "normal",
            description: "",
            doctorId: preselectedDoctorId,
            appointmentDate: undefined,
            timeSlot: undefined,
        },
    });

    const patientType = form.watch("patientType");

    const handleFetchDetails = async () => {
      const hospitalId = form.getValues("hospitalId");
      if (!hospitalId) {
        toast({ title: t('forms.appointment.hospital_id_required_title'), description: t('forms.appointment.hospital_id_required_desc'), variant: "destructive" });
        return;
      }
      setIsFetching(true);
      const result = await getPatientDetails(hospitalId);
      setIsFetching(false);

      if (result.error) {
        toast({ title: t('forms.toast.error'), description: result.error, variant: "destructive" });
      } else if (result.patient) {
        const { patientName, patientPhone, patientEmail, age, gender, doctorId } = result.patient;
        form.setValue("patientName", patientName);
        form.setValue("patientPhone", patientPhone);
        form.setValue("patientEmail", patientEmail || "");
        form.setValue("age", age);
        form.setValue("gender", gender);

        if (doctorId) {
            form.setValue("doctorId", doctorId);
            setIsDoctorPrefilled(true);
        } else {
            setIsDoctorPrefilled(false);
        }

        toast({ title: t('forms.toast.success'), description: t('forms.appointment.details_prefilled') });
      } else {
        toast({ title: t('forms.appointment.no_patient_found_title'), description: t('forms-appointment.no_patient_found_desc'), variant: "destructive" });
        form.setValue("patientType", "new");
        setIsDoctorPrefilled(false);
      }
    };


    const onSubmit = async (data) => {
        // Combine date and time
        const [time, period] = data.timeSlot.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        const appointmentDateTime = new Date(data.appointmentDate);
        appointmentDateTime.setHours(hours, minutes);

        const result = await createAppointment({
            ...data,
            appointmentDate: appointmentDateTime.toISOString(),
        });

        if(result.success && result.appointmentId) {
            toast({
                title: t('forms.appointment.booked_title'),
                description: t('forms.appointment.booked_desc'),
            });
            router.push(`/appointments/${result.appointmentId}`);
        } else {
            toast({
                title: t('forms.toast.error'),
                description: result.error || t('forms.appointment.booked_error'),
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="w-full border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-6 h-6 lg:w-7 lg:h-7" />
                        <CardTitle className="text-2xl lg:text-3xl font-bold">{t('forms.appointment.title')}</CardTitle>
                    </div>
                    <CardDescription className="text-blue-100 text-sm lg:text-base">
                        {t('forms.appointment.description')}
                    </CardDescription>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
            </CardHeader>
            <CardContent className="p-6 lg:p-8">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                               <User className="text-blue-600 w-5 h-5 lg:w-6 lg:h-6" />
                               <h3 className="text-lg lg:text-xl font-semibold text-gray-800">{t('forms.appointment.patient_info_title')}</h3>
                            </div>
                            
                             <FormField
                                control={form.control}
                                name="patientType"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                    <FormLabel>{t('forms.appointment.patient_type_label')} *</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            // Reset form fields if switching to 'new'
                                            if (value === 'new') {
                                                form.reset({
                                                    ...form.getValues(),
                                                    patientType: 'new',
                                                    hospitalId: '',
                                                    patientName: '',
                                                    patientPhone: '',
                                                    patientEmail: '',
                                                    age: '',
                                                    gender: undefined,
                                                });
                                                setIsDoctorPrefilled(false);
                                            }
                                        }}
                                        defaultValue={field.value}
                                        className="flex flex-col sm:flex-row gap-4"
                                        >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="new" />
                                            </FormControl>
                                            <FormLabel className="font-normal">{t('forms.appointment.patient_type_new')}</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="returning" />
                                            </FormControl>
                                            <FormLabel className="font-normal">{t('forms.appointment.patient_type_returning')}</FormLabel>
                                        </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="hospitalId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('forms.appointment.hospital_id_label')} *</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input placeholder={t('forms.appointment.hospital_id_placeholder')} {...field} />
                                            </FormControl>
                                            {patientType === 'returning' && (
                                                <Button 
                                                    type="button" 
                                                    onClick={handleFetchDetails} 
                                                    disabled={isFetching}
                                                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 lg:px-6 py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold"
                                                >
                                                    {isFetching ? <Loader2 className="h-4 w-4 lg:h-5 lg:w-5 animate-spin" /> : <Search className="h-4 w-4 lg:h-5 lg:w-5" />}
                                                    <span className="ml-2 hidden sm:inline text-sm lg:text-base">{t('forms.buttons.fetch_details')}</span>
                                                </Button>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="patientName" render={({ field }) => ( <FormItem><FormLabel>{t('forms.appointment.name_label')} *</FormLabel><FormControl><Input placeholder={t('forms.appointment.name_placeholder')} {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={form.control} name="patientPhone" render={({ field }) => ( <FormItem><FormLabel>{t('forms.appointment.phone_label')} *</FormLabel><FormControl><Input placeholder={t('forms.appointment.phone_placeholder')} {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={form.control} name="patientEmail" render={({ field }) => ( <FormItem><FormLabel>{t('forms.appointment.email_label')}</FormLabel><FormControl><Input placeholder={t('forms.appointment.email_placeholder')} {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={form.control} name="age" render={({ field }) => ( <FormItem><FormLabel>{t('forms.appointment.age_label')} *</FormLabel><FormControl><Input placeholder={t('forms.appointment.age_placeholder')} {...field} type="number" /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={form.control} name="gender" render={({ field }) => ( <FormItem><FormLabel>{t('forms.appointment.gender_label')} *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('forms.appointment.gender_placeholder')} /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">{t('forms.appointment.gender_male')}</SelectItem><SelectItem value="female">{t('forms.appointment.gender_female')}</SelectItem><SelectItem value="other">{t('forms.appointment.gender_other')}</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
                                <FormField control={form.control} name="doctorId" render={({ field }) => ( <FormItem><FormLabel>{t('forms.appointment.doctor_label')} *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={isDoctorPrefilled}><FormControl><SelectTrigger><SelectValue placeholder={t('forms.appointment.doctor_placeholder')} /></SelectTrigger></FormControl><SelectContent>{doctors.map(doctor => ( <SelectItem key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.specialization})</SelectItem> ))}</SelectContent></Select><FormMessage /></FormItem> )} />
                            </div>

                             <FormField
                                control={form.control}
                                name="healthPriority"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                    <FormLabel>{t('forms.appointment.priority_label')} *</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                                        >
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <RadioGroupItem value="critical" id="critical" className="sr-only" />
                                                </FormControl>
                                                <Label htmlFor="critical" className={cn("flex items-center justify-center gap-3 rounded-md border-2 p-3 font-normal cursor-pointer", field.value === 'critical' && 'border-red-500 bg-red-50')}>
                                                    <AlertTriangle className="text-red-500" /> {t('forms.appointment.priority_critical')}
                                                </Label>
                                            </FormItem>
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <RadioGroupItem value="urgent" id="urgent" className="sr-only" />
                                                </FormControl>
                                                <Label htmlFor="urgent" className={cn("flex items-center justify-center gap-3 rounded-md border-2 p-3 font-normal cursor-pointer", field.value === 'urgent' && 'border-orange-500 bg-orange-50')}>
                                                    <Waves className="text-orange-500" /> {t('forms.appointment.priority_urgent')}
                                                </Label>
                                            </FormItem>
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <RadioGroupItem value="normal" id="normal" className="sr-only" />
                                                </FormControl>
                                                <Label htmlFor="normal" className={cn("flex items-center justify-center gap-3 rounded-md border-2 p-3 font-normal cursor-pointer", field.value === 'normal' && 'border-blue-500 bg-blue-50')}>
                                                    <Heart className="text-blue-500" /> {t('forms.appointment.priority_normal')}
                                                </Label>
                                            </FormItem>
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <RadioGroupItem value="routine" id="routine" className="sr-only" />
                                                </FormControl>
                                                <Label htmlFor="routine" className={cn("flex items-center justify-center gap-3 rounded-md border-2 p-3 font-normal cursor-pointer", field.value === 'routine' && 'border-green-500 bg-green-50')}>
                                                    <Recycle className="text-green-500" /> {t('forms.appointment.priority_routine')}
                                                </Label>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('forms.appointment.description_label')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t('forms.appointment.description_placeholder')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>{t('forms.appointment.note_title')}</AlertTitle>
                                <AlertDescription>
                                    {t('forms.appointment.note_desc')}
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                 <FormField
                                    control={form.control}
                                    name="appointmentDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('forms.appointment.date_label')} *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('forms.appointment.date_placeholder')} />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                {fridays.map(day => (
                                                    <SelectItem key={day.value} value={day.value}>
                                                        {day.label}
                                                    </SelectItem>
                                                ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="timeSlot"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('forms.appointment.time_label')} *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('forms.appointment.time_placeholder')} />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                {timeSlots.map(slot => (
                                                    <SelectItem key={slot} value={slot}>
                                                        {slot}
                                                    </SelectItem>
                                                ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => router.back()} 
                                disabled={form.formState.isSubmitting}
                                className="border-gray-300 hover:bg-gray-50 transition-all duration-200 px-6 lg:px-8 py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold"
                            >
                                {t('forms.buttons.cancel')}
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={form.formState.isSubmitting} 
                                className="mb-4 sm:mb-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 lg:px-8 py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold"
                            >
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 lg:h-5 lg:w-5 animate-spin" />}
                                <span className="text-sm lg:text-base">{t('forms.buttons.book_appointment')}</span>
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

    
