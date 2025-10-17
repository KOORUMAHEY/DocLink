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
import { createAppointment } from "@/features/appointments/actions/appointmentActions"
import { getPatientDetails } from "@/features/patients"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Checkbox as UICheckbox } from "./ui/checkbox"
import { getDoctorSchedule, generateTimeSlots, getAvailableDates } from "@/services/scheduleService"
import { Label } from "@/components/ui/label"
import { useState, useMemo, useEffect } from "react"
import PropTypes from 'prop-types'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useI18n } from "@/context/i18n"
import { getDynamicFormConfig } from "@/services/templateService"

// Generate dynamic schema based on form configuration
const generateFormSchema = (formConfig) => {
  const schemaFields = {
    patientType: z.enum(["new", "returning"], { required_error: "Please select patient type." }),
    hospitalId: z.string().min(1, "Hospital ID is required."),
    doctorId: z.string({ required_error: "Please select a doctor." }),
    appointmentDate: z.string({ required_error: "Please select a date." }),
    timeSlot: z.string({ required_error: "Please select a time slot." }),
    // Essential patient fields - always required
    patientName: z.string().min(2, "Name must be at least 2 characters."),
    patientPhone: z.string().min(10, "Please enter a valid phone number."),
    patientEmail: z.string().email("Please enter a valid email address.").optional().or(z.literal('')),
    age: z.coerce.number().min(1, "Age must be at least 1").max(120, "Age must be less than 120"),
    gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  };

  // Process template-based sections
  if (formConfig?.customSections) {
    formConfig.customSections.forEach(section => {
      section.fields.forEach(field => {
        let validation;

        switch (field.type) {
          case 'text':
          case 'tel':
          case 'textarea':
            validation = z.string().optional();
            break;
          case 'number':
            validation = z.coerce.number().optional();
            break;
          case 'email':
            validation = z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Please enter a valid email address." }).optional().or(z.literal(''));
            break;
          case 'date':
            validation = z.string().optional();
            break;
          case 'select':
          case 'radio':
            validation = z.string().optional();
            break;
          case 'checkbox':
            validation = z.boolean().optional();
            break;
          case 'checkbox-group':
            validation = z.array(z.string()).optional();
            break;
          default:
            validation = z.string().optional();
        }

        schemaFields[field.id] = validation;
      });
    });
  }

  // Fallback to old configuration format for backward compatibility
  if (formConfig?.requiredFields || formConfig?.optionalFields || formConfig?.customFields) {
    const standardFields = [
      { name: 'patientName', validation: z.string().min(2, "Name must be at least 2 characters.").optional() },
      { name: 'patientPhone', validation: z.string().min(10, "Please enter a valid phone number.").optional() },
      { name: 'patientEmail', validation: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address.").optional().or(z.literal('')) },
      { name: 'age', validation: z.coerce.number().optional() },
      { name: 'gender', validation: z.enum(["male", "female", "other"], { required_error: "Please select a gender."}).optional() },
      { name: 'healthPriority', validation: z.enum(["critical", "urgent", "normal", "routine"], { required_error: "Please select a health priority."}).optional() },
      { name: 'description', validation: z.string().optional() },
    ];

    standardFields.forEach(field => {
      if (formConfig?.requiredFields?.includes(field.name) || formConfig?.optionalFields?.includes(field.name)) {
        schemaFields[field.name] = formConfig?.requiredFields?.includes(field.name)
          ? field.validation.required()
          : field.validation;
      }
    });

    // Add legacy custom fields
    formConfig?.customFields?.forEach(field => {
      let validation;
      switch (field.type) {
        case 'text':
        case 'textarea':
          validation = z.string().optional();
          break;
        case 'number':
          validation = z.coerce.number().optional();
          break;
        case 'email':
          validation = z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address.").optional().or(z.literal(''));
          break;
        case 'date':
          validation = z.string().optional();
          break;
        case 'select':
        case 'radio':
          validation = z.string().optional();
          break;
        case 'checkbox':
          validation = z.boolean().optional();
          break;
        default:
          validation = z.string().optional();
      }

      schemaFields[field.id] = field.required ? validation.required() : validation;
    });
  }

  return z.object(schemaFields);
};

AppointmentForm.propTypes = {
    doctors: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        specialization: PropTypes.string.isRequired
    })),
    preselectedDoctorId: PropTypes.string,
    formConfig: PropTypes.shape({
        requiredFields: PropTypes.arrayOf(PropTypes.string),
        optionalFields: PropTypes.arrayOf(PropTypes.string),
        customFields: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            required: PropTypes.bool
        })),
        customSections: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            fields: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
                required: PropTypes.bool
            }))
        }))
    }),
    doctor: PropTypes.shape({
        name: PropTypes.string.isRequired,
        specialization: PropTypes.string.isRequired
    }),
    previewMode: PropTypes.bool
};

export function AppointmentForm({ doctors, preselectedDoctorId, formConfig: initialFormConfig, doctor, previewMode = false }) {
    const router = useRouter();
    const { toast } = useToast();
    const { t } = useI18n();
    const [isFetching, setIsFetching] = useState(false);
    const [dynamicFormConfig, setDynamicFormConfig] = useState(initialFormConfig);
    const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDoctorId);
    const [availableDates, setAvailableDates] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [scheduleConfig, setScheduleConfig] = useState(null);

    // Use dynamic form config if available, otherwise fallback to initial config
    const formConfig = dynamicFormConfig || initialFormConfig;

    // Load form configuration when doctor is selected
    useEffect(() => {
        const loadDoctorFormConfig = async () => {
            if (selectedDoctorId && !previewMode) {
                try {
                    const config = await getDynamicFormConfig(selectedDoctorId);
                    setDynamicFormConfig(config);
                } catch (error) {
                    console.error('Error loading doctor form config:', error);
                    // Fall back to initial config or default
                    setDynamicFormConfig(initialFormConfig);
                }
            }
        };

        loadDoctorFormConfig();
    }, [selectedDoctorId, previewMode, initialFormConfig]);

    // Load doctor's schedule configuration
    useEffect(() => {
        const loadScheduleConfig = async () => {
            if (selectedDoctorId) {
                try {
                    const config = await getDoctorSchedule(selectedDoctorId);
                    setScheduleConfig(config);
                    
                    // Generate available dates
                    const dates = getAvailableDates(config, 30);
                    setAvailableDates(dates);
                    
                    // Clear selected date and time slots when doctor changes
                    setSelectedDate('');
                    setTimeSlots([]);
                } catch (error) {
                    console.error('Error loading schedule config:', error);
                }
            }
        };

        loadScheduleConfig();
    }, [selectedDoctorId]);

    // Update time slots when date is selected
    useEffect(() => {
        if (scheduleConfig && selectedDate) {
            const slots = generateTimeSlots(scheduleConfig, selectedDate);
            setTimeSlots(slots);
        } else {
            setTimeSlots([]);
        }
    }, [scheduleConfig, selectedDate]);

    // Generate dynamic schema
    const appointmentFormSchema = useMemo(() => generateFormSchema(formConfig), [formConfig]);

    // Generate default values
    const defaultValues = useMemo(() => {
      const defaults = {
        patientType: "new",
        hospitalId: "",
        doctorId: preselectedDoctorId || "",
        appointmentDate: "",
        timeSlot: "",
      };

      // Add standard fields
      const standardDefaults = {
        patientName: "",
        patientPhone: "",
        patientEmail: "",
        age: "",
        gender: "",
        healthPriority: "normal",
        description: "",
      };

      Object.keys(standardDefaults).forEach(key => {
        if (formConfig?.requiredFields?.includes(key) || formConfig?.optionalFields?.includes(key)) {
          defaults[key] = standardDefaults[key];
        }
      });

      // Add custom fields
      formConfig?.customFields?.forEach(field => {
        switch (field.type) {
          case 'checkbox':
            defaults[field.id] = false;
            break;
          case 'number':
            defaults[field.id] = 0;
            break;
          default:
            defaults[field.id] = "";
        }
      });

      // Add custom sections fields
      formConfig?.customSections?.forEach(section => {
        section.fields.forEach(field => {
          switch (field.type) {
            case 'checkbox':
              defaults[field.id] = false;
              break;
            case 'checkbox-group':
              defaults[field.id] = [];
              break;
            case 'number':
              defaults[field.id] = 0;
              break;
            default:
              defaults[field.id] = "";
          }
        });
      });

      return defaults;
    }, [formConfig, preselectedDoctorId]);

    const form = useForm({
        resolver: zodResolver(appointmentFormSchema),
        defaultValues,
        mode: 'onChange', // This helps with controlled/uncontrolled issues
    });

    // Reset form when form config changes to ensure proper default values
    // But only reset if the form hasn't been touched by the user
    useEffect(() => {
        if (!form.formState.isDirty) {
            form.reset(defaultValues);
        }
    }, [defaultValues, form]);

    const patientType = form.watch("patientType");

    const updatePatientField = (fieldName, value) => {
      if (formConfig?.requiredFields?.includes(fieldName) || formConfig?.optionalFields?.includes(fieldName)) {
        form.setValue(fieldName, value);
      }
    };

    const handleFetchDetails = async () => {
      const hospitalId = form.getValues("hospitalId");
      if (!hospitalId) {
        toast({ 
          title: t('forms.appointment.hospital_id_required_title'), 
          description: t('forms.appointment.hospital_id_required_desc'), 
          variant: "destructive" 
        });
        return;
      }

      setIsFetching(true);
      const result = await getPatientDetails(hospitalId);
      setIsFetching(false);

      if (result.error) {
        toast({ 
          title: t('forms.toast.error'), 
          description: result.error, 
          variant: "destructive" 
        });
        return;
      }

      if (!result.patient) {
        toast({ 
          title: t('forms.appointment.no_patient_found_title'), 
          description: t('forms-appointment.no_patient_found_desc'), 
          variant: "destructive" 
        });
        form.setValue("patientType", "new");
        setIsDoctorPrefilled(false);
        return;
      }

      const { patientName, patientPhone, patientEmail, age, gender, doctorId } = result.patient;
      
      // Update patient fields
      updatePatientField('patientName', patientName);
      updatePatientField('patientPhone', patientPhone);
      updatePatientField('patientEmail', patientEmail || '');
      updatePatientField('age', age?.toString() || '');
      updatePatientField('gender', gender);

      // For returning patients, show their previous doctor as selected but allow changing
      if (doctorId) {
        form.setValue("doctorId", doctorId);
        setSelectedDoctorId(doctorId); // This triggers schedule loading
        // Don't set isDoctorPrefilled to true so they can change the doctor
        toast({
          title: t('forms.toast.info'),
          description: t('forms.appointment.previous_doctor_selected'),
        });
      }

      toast({ 
        title: t('forms.toast.success'), 
        description: t('forms.appointment.details_prefilled') 
      });
    };

    // Helper functions to reduce cognitive complexity
    const validateRequiredFields = (data) => {
        if (!selectedDoctorId) {
            throw new Error(t('forms.appointment.doctor_required'));
        }
        if (!data.appointmentDate) {
            throw new Error(t('forms.appointment.date_required'));
        }
        if (!data.timeSlot) {
            throw new Error(t('forms.appointment.time_required'));
        }
    };

    const parseAppointmentDateTime = (data) => {
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

        if (appointmentDateTime < new Date()) {
            throw new Error(t('forms.appointment.date_past_error'));
        }

        return appointmentDateTime;
    };

    const extractCustomFields = (data) => {
        const customFieldsData = {};

        // Handle template-based sections
        if (formConfig?.customSections) {
            formConfig.customSections.forEach(section => {
                section.fields.forEach(field => {
                    if (data[field.id] !== undefined && data[field.id] !== '') {
                        customFieldsData[field.id] = data[field.id];
                    }
                });
            });
        }

        // Handle legacy custom fields
        formConfig?.customFields?.forEach(field => {
            if (data[field.id] !== undefined && data[field.id] !== '') {
                customFieldsData[field.id] = data[field.id];
            }
        });

        return customFieldsData;
    };

    const prepareAppointmentData = (data, appointmentDateTime, customFieldsData) => {
        const cleanAppointmentData = {
            patientType: data.patientType,
            hospitalId: data.hospitalId,
            doctorId: data.doctorId,
            appointmentDate: appointmentDateTime.toISOString(),
            timeSlot: data.timeSlot,
            customFields: customFieldsData,
        };

        // Add optional fields only if they have values
        if (data.patientName?.trim()) {
            cleanAppointmentData.patientName = data.patientName.trim();
        }
        if (data.patientPhone?.trim()) {
            cleanAppointmentData.patientPhone = data.patientPhone.trim();
        }
        if (data.patientEmail?.trim()) {
            cleanAppointmentData.patientEmail = data.patientEmail.trim();
        }
        if (data.age !== undefined && data.age !== null && data.age !== '') {
            cleanAppointmentData.age = Number(data.age);
        }
        if (data.gender?.trim()) {
            cleanAppointmentData.gender = data.gender.trim();
        }
        if (data.healthPriority?.trim()) {
            cleanAppointmentData.healthPriority = data.healthPriority.trim();
        }
        if (data.description?.trim()) {
            cleanAppointmentData.description = data.description.trim();
        }

        return cleanAppointmentData;
    };

    const onSubmit = async (data) => {
        // Prevent submission in preview mode
        if (previewMode) {
            toast({
                title: t('preview_mode'),
                description: t('preview_mode_description'),
                variant: "default",
            });
            return;
        }

        setIsFetching(true);
        setFormError(null);

        try {
            // Validate required fields
            validateRequiredFields(data);

            // Parse and validate date/time
            const appointmentDateTime = parseAppointmentDateTime(data);

            // Extract custom fields
            const customFieldsData = extractCustomFields(data);

            // Prepare clean appointment data
            const cleanAppointmentData = prepareAppointmentData(data, appointmentDateTime, customFieldsData);

            // Create appointment
            const result = await createAppointment(cleanAppointmentData);

            if (result.success && result.appointmentId) {
                toast({
                    title: t('forms.appointment.booked_title'),
                    description: t('forms.appointment.booked_desc'),
                });
                router.push(`/appointments/${result.appointmentId}`);
            } else {
                throw new Error(result.error || t('forms.appointment.booked_error'));
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            const errorMessage = error.message || t('forms.appointment.booked_error');
            setFormError(errorMessage);
            toast({
                title: t('forms.toast.error'),
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsFetching(false);
        }
    };

    // Helper function to render checkbox group to reduce nesting
    const renderCheckboxGroup = (fieldConfig, formField) => {
        const currentValue = Array.isArray(formField.value) ? formField.value : [];

        return (
            <div className="space-y-2 sm:space-y-3">
                {fieldConfig.options?.map(option => {
                    const isChecked = currentValue.includes(option);
                    const handleToggle = (checked) => {
                        formField.onChange(
                            checked
                                ? [...currentValue, option]
                                : currentValue.filter(v => v !== option)
                        );
                    };

                    return (
                        <div key={option} className="flex items-center space-x-2 sm:space-x-3">
                            <UICheckbox
                                id={`${fieldConfig.id}-${option}`}
                                checked={isChecked}
                                onCheckedChange={handleToggle}
                            />
                            <Label htmlFor={`${fieldConfig.id}-${option}`}>{option}</Label>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Unified field renderer
    const renderFormField = (fieldConfig, formField) => {
        // Ensure the field has a defined value to prevent controlled/uncontrolled issues
        let fieldValue = formField.value;
        if (fieldValue === undefined) {
            if (fieldConfig.type === 'checkbox-group') {
                fieldValue = [];
            } else if (fieldConfig.type === 'checkbox') {
                fieldValue = false;
            } else {
                fieldValue = "";
            }
        }

        const fieldProps = {
            ...formField,
            value: fieldValue,
        };

        switch (fieldConfig.type) {
            case 'text':
            case 'tel':
                return (
                    <Input
                        placeholder={fieldConfig.placeholder || ''}
                        type={fieldConfig.type}
                        {...fieldProps}
                    />
                );
            case 'number':
                return (
                    <Input
                        type="number"
                        placeholder={fieldConfig.placeholder || ''}
                        {...fieldProps}
                        onChange={(e) => formField.onChange(e.target.valueAsNumber || 0)}
                    />
                );
            case 'email':
                return (
                    <Input
                        type="email"
                        placeholder={fieldConfig.placeholder || ''}
                        {...fieldProps}
                    />
                );
            case 'textarea':
                return (
                    <Textarea
                        placeholder={fieldConfig.placeholder || ''}
                        {...fieldProps}
                    />
                );
            case 'date':
                return (
                    <Input
                        type="date"
                        {...fieldProps}
                    />
                );
            case 'select':
                return (
                    <Select onValueChange={formField.onChange} value={fieldProps.value}>
                        <SelectTrigger>
                            <SelectValue placeholder={fieldConfig.placeholder || 'Select an option'} />
                        </SelectTrigger>
                        <SelectContent>
                            {fieldConfig.options?.map(option => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case 'radio':
                return (
                    <RadioGroup
                        onValueChange={formField.onChange}
                        value={fieldProps.value}
                        className="flex flex-col space-y-2 sm:space-y-3"
                    >
                        {fieldConfig.options?.map(option => (
                            <div key={option} className="flex items-center space-x-2 sm:space-x-3">
                                <RadioGroupItem value={option} id={`${fieldConfig.id}-${option}`} />
                                <Label htmlFor={`${fieldConfig.id}-${option}`}>{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <UICheckbox
                            id={fieldConfig.id}
                            checked={fieldProps.value || false}
                            onCheckedChange={formField.onChange}
                        />
                        <Label htmlFor={fieldConfig.id}>{fieldConfig.label}</Label>
                    </div>
                );
            case 'checkbox-group':
                return renderCheckboxGroup(fieldConfig, formField);
            default:
                return (
                    <Input
                        placeholder={fieldConfig.placeholder || ''}
                        {...fieldProps}
                    />
                );
        }
    };    return (
        <div className="w-full p-2 sm:p-4 lg:p-6">
            <Card className="w-full border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 mx-auto max-w-4xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0 mb-2">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                        <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">{t('forms.appointment.title')}</CardTitle>
                    </div>
                    {doctor && (
                        <div className="mb-2">
                            <p className="text-blue-100 text-xs sm:text-sm lg:text-base">
                                Booking with: <span className="font-semibold">{doctor.name}</span> - {doctor.specialization}
                            </p>
                        </div>
                    )}
                    <CardDescription className="text-blue-100 text-xs sm:text-sm lg:text-base">
                        {t('forms.appointment.description')}
                    </CardDescription>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                        <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-gray-200">
                               <User className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                               <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">{t('forms.appointment.patient_info_title')}</h3>
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
                                                    ...defaultValues,
                                                    patientType: 'new',
                                                });
                                            }
                                        }}
                                        defaultValue={field.value}
                                        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                                        >
                                        <FormItem className="flex items-center space-x-2 sm:space-x-3 space-y-0">
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
                                        <div className="flex flex-col space-y-2 sm:flex-row sm:gap-2 sm:space-y-0">
                                            <FormControl>
                                                <Input placeholder={t('forms.appointment.hospital_id_placeholder')} {...field} className="flex-1" />
                                            </FormControl>
                                            {patientType === 'returning' && (
                                                <Button
                                                    type="button"
                                                    onClick={handleFetchDetails}
                                                    disabled={isFetching}
                                                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-sm sm:text-base"
                                                >
                                                    {isFetching ? <Loader2 className="h-4 w-4 lg:h-5 lg:w-5 animate-spin" /> : <Search className="h-4 w-4 lg:h-5 lg:w-5" />}
                                                    <span className="ml-2 sm:inline text-xs sm:text-sm lg:text-base">{t('forms.buttons.fetch_details')}</span>
                                                </Button>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Dynamic Standard Fields */}
                                {formConfig?.requiredFields?.includes('patientName') || formConfig?.optionalFields?.includes('patientName') ? (
                                    <FormField control={form.control} name="patientName" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('forms.appointment.name_label')} {formConfig?.requiredFields?.includes('patientName') ? '*' : ''}</FormLabel>
                                            <FormControl><Input placeholder={t('forms.appointment.name_placeholder')} {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                ) : null}

                                {formConfig?.requiredFields?.includes('patientPhone') || formConfig?.optionalFields?.includes('patientPhone') ? (
                                    <FormField control={form.control} name="patientPhone" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('forms.appointment.phone_label')} {formConfig?.requiredFields?.includes('patientPhone') ? '*' : ''}</FormLabel>
                                            <FormControl><Input placeholder={t('forms.appointment.phone_placeholder')} {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                ) : null}

                                {formConfig?.requiredFields?.includes('patientEmail') || formConfig?.optionalFields?.includes('patientEmail') ? (
                                    <FormField control={form.control} name="patientEmail" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('forms.appointment.email_label')} {formConfig?.requiredFields?.includes('patientEmail') ? '*' : ''}</FormLabel>
                                            <FormControl><Input placeholder={t('forms.appointment.email_placeholder')} {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                ) : null}

                                {formConfig?.requiredFields?.includes('age') || formConfig?.optionalFields?.includes('age') ? (
                                    <FormField control={form.control} name="age" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('forms.appointment.age_label')} {formConfig?.requiredFields?.includes('age') ? '*' : ''}</FormLabel>
                                            <FormControl><Input placeholder={t('forms.appointment.age_placeholder')} {...field} type="number" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                ) : null}

                                {formConfig?.requiredFields?.includes('gender') || formConfig?.optionalFields?.includes('gender') ? (
                                    <FormField control={form.control} name="gender" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('forms.appointment.gender_label')} {formConfig?.requiredFields?.includes('gender') ? '*' : ''}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder={t('forms.appointment.gender_placeholder')} /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="male">{t('forms.appointment.gender_male')}</SelectItem>
                                                    <SelectItem value="female">{t('forms.appointment.gender_female')}</SelectItem>
                                                    <SelectItem value="other">{t('forms.appointment.gender_other')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                ) : null}

                                <FormField control={form.control} name="doctorId" render={({ field }) => (
                                    <FormItem>
                                        <div className="flex justify-between items-center">
                                            <FormLabel>{t('forms.appointment.doctor_label')} *</FormLabel>
                                            {patientType === 'returning' && field.value && (
                                                <span className="text-xs text-muted-foreground">

                                                </span>
                                            )}
                                        </div>
                                        <Select 
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedDoctorId(value);
                                                // Always allow changing doctor for returning patients
                                                if (patientType === 'returning') {
                                                    setIsDoctorPrefilled(false);
                                                }
                                            }} 
                                            defaultValue={field.value} 
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('forms.appointment.doctor_placeholder')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {doctors?.map(doctor => (
                                                    <SelectItem key={doctor.id} value={doctor.id}>
                                                        {doctor.name} ({doctor.specialization})
                                                        {patientType === 'returning' && doctor.id === field.value && (
                                                            <span className="ml-2 text-xs text-muted-foreground">
                                                                ({t('forms.appointment.previous_doctor')})
                                                            </span>
                                                        )}
                                                    </SelectItem>
                                                )) || (
                                                    <SelectItem value="" disabled>
                                                        {t('forms.appointment.no_doctors')}
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {/* Template-based Form Sections */}
                            {formConfig?.customSections?.map(section => (
                                <div key={section.id} className="space-y-4">
                                    <div className="space-y-3">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                            {section.title}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            {section.fields.map(field => (
                                                <FormField 
                                                    key={field.id} 
                                                    control={form.control} 
                                                    name={field.id} 
                                                    render={({ field: formField }) => (
                                                        <FormItem className={field.type === 'textarea' || field.type === 'checkbox-group' ? 'sm:col-span-2' : ''}>
                                                            <FormLabel>{field.label} {field.required ? '*' : ''}</FormLabel>
                                                            <FormControl>
                                                                {renderFormField(field, formField)}
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* No additional details message */}
                            {(!formConfig?.customSections || formConfig.customSections.length === 0) && (
                                <div className="text-center py-4">
                                    <p className="text-sm text-muted-foreground">
                                        No additional details are required for this appointment.
                                    </p>
                                </div>
                            )}

                            {/* Legacy Custom Fields (for backward compatibility) */}
                            {formConfig?.customFields?.map(field => (
                                <FormField key={field.id} control={form.control} name={field.id} render={({ field: formField }) => (
                                    <FormItem>
                                        <FormLabel>{field.label} {field.required ? '*' : ''}</FormLabel>
                                        <FormControl>
                                            {renderFormField(field, formField)}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            ))}

                             {formConfig?.requiredFields?.includes('healthPriority') || formConfig?.optionalFields?.includes('healthPriority') ? (
                                <FormField
                                    control={form.control}
                                    name="healthPriority"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                        <FormLabel>{t('forms.appointment.priority_label')} {formConfig?.requiredFields?.includes('healthPriority') ? '*' : ''}</FormLabel>
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
                            ) : null}

                             {formConfig?.requiredFields?.includes('description') || formConfig?.optionalFields?.includes('description') ? (
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('forms.appointment.description_label')} {formConfig?.requiredFields?.includes('description') ? '*' : ''}</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder={t('forms.appointment.description_placeholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            ) : null}

                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertTitle>{t('forms.appointment.note_title')}</AlertTitle>
                                <AlertDescription>
                                    {t('forms.appointment.note_desc')}
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                 <FormField
                                    control={form.control}
                                    name="appointmentDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('forms.appointment.date_label')} *</FormLabel>
                                            <Select onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedDate(value);
                                            }} defaultValue={field.value}>
                                                <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('forms.appointment.date_placeholder')} />
                                                </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                {availableDates.map(day => (
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
                                                    <SelectItem key={slot.value} value={slot.value}>
                                                        {slot.label}
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

                        {!previewMode && (
                            <div className="flex flex-col space-y-3 sm:flex-row-reverse sm:justify-start sm:gap-4 sm:space-y-0 pt-4 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={form.formState.isSubmitting}
                                    className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 transition-all duration-200 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-sm sm:text-base"
                                >
                                    {t('forms.buttons.cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold"
                                >
                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 animate-spin" />}
                                    <span className="text-sm sm:text-base">{t('forms.buttons.book_appointment')}</span>
                                </Button>
                            </div>
                        )}
                        {previewMode && (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-sm">This is a preview of your appointment form</p>
                            </div>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
        </div>
    );
}

AppointmentForm.propTypes = {
    doctors: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            specialization: PropTypes.string,
            email: PropTypes.string,
            phone: PropTypes.string,
        })
    ),
    preselectedDoctorId: PropTypes.string,
    formConfig: PropTypes.object,
    doctor: PropTypes.object,
    previewMode: PropTypes.bool,
};
