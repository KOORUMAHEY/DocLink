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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">
                  {t('forms.doctor.name_label')}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('forms.doctor.name_placeholder')} 
                    className="h-10 sm:h-11 text-sm sm:text-base"
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
                <FormLabel className="text-sm sm:text-base font-medium">
                  {t('forms.doctor.specialization_label')}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('forms.doctor.specialization_placeholder')} 
                    className="h-10 sm:h-11 text-sm sm:text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm sm:text-base font-medium">
                  {t('forms.doctor.email_label')}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder={t('forms.doctor.email_placeholder')} 
                    className="h-10 sm:h-11 text-sm sm:text-base"
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
                <FormLabel className="text-sm sm:text-base font-medium">
                  {t('forms.doctor.password_label')}
                </FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-10 sm:h-11 text-sm sm:text-base"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base font-medium">
                {t('forms.doctor.bio_label')}
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('forms.doctor.bio_placeholder')} 
                  className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base resize-y"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm sm:text-base font-medium">
                {t('forms.doctor.image_url_label')}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('forms.doctor.image_url_placeholder')} 
                  className="h-10 sm:h-11 text-sm sm:text-base"
                  {...field} 
                />
              </FormControl>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t('forms.doctor.image_url_desc')}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 sm:pt-6">
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="w-full sm:w-auto min-w-[120px] h-10 sm:h-11 text-sm sm:text-base"
          >
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('forms.buttons.add_doctor')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
