/**
 * Doctor Form Component
 * @module features/doctors/components/DoctorForm
 */

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
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { createDoctor } from "@/features/doctors/actions/doctorActions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useI18n } from "@/context/i18n"
import { ROUTES } from "@/config/routes"

const doctorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  specialization: z.string().min(2, "Specialization is required."),
  bio: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

export function DoctorForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useI18n();

  const form = useForm({
    resolver: zodResolver(doctorFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: "",
      email: "",
      password: "",
      specialization: "",
      bio: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await createDoctor({
        ...data,
        imageUrl: data.imageUrl || `https://picsum.photos/400/400?random=${Math.random()}`,
      });

      if (result.success) {
        toast({
          title: t('forms.doctor.added_title'),
          description: result.message || t('forms.doctor.added_desc'),
        });
        router.push(ROUTES.ADMIN.DOCTORS);
        router.refresh();
      } else {
        toast({
          title: t('forms.toast.error'),
          description: result.error || t('forms.doctor.added_error'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to create doctor:', error);
      toast({
        title: t('forms.toast.error'),
        description: t('forms.doctor.added_error'),
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Name and Specialization Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {t('forms.doctor.name_label')}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Dr. John Smith" 
                    className="h-12 text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {t('forms.doctor.specialization_label')}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Cardiology, Pediatrics, etc." 
                    className="h-12 text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email and Password Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {t('forms.doctor.email_label')}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="doctor@example.com" 
                    className="h-12 text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  {t('forms.doctor.password_label')}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Minimum 6 characters" 
                    className="h-12 text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {t('forms.doctor.bio_label')} <span className="text-gray-400 font-normal">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief professional background and expertise..." 
                  className="min-h-[120px] text-base"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URL */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {t('forms.doctor.image_url_label')} <span className="text-gray-400 font-normal">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/doctor-photo.jpg" 
                  className="h-12 text-base"
                  {...field} 
                />
              </FormControl>
              <p className="text-sm text-gray-500 mt-1">
                Leave empty for a default avatar
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="pt-4 flex gap-4">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            size="lg"
            className="flex-1 bg-blue-600 hover:bg-blue-700 h-12"
          >
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {form.formState.isSubmitting ? 'Adding Doctor...' : t('forms.buttons.add_doctor')}
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.push(ROUTES.ADMIN.DOCTORS)}
            className="h-12"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
