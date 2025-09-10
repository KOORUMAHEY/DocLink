
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
import { createDoctor } from "@/actions/doctors"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useI18n } from "@/context/i18n";

const doctorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  specialization: z.string().min(2, "Specialization is required."),
  bio: z.string().min(10, "Bio must be at least 10 characters."),
  imageUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});


export function DoctorForm() {
    const router = useRouter();
    const { toast } = useToast();
    const { t } = useI18n();

    const form = useForm({
        resolver: zodResolver(doctorFormSchema),
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
        const result = await createDoctor({
            ...data,
            imageUrl: data.imageUrl || `https://picsum.photos/400/400?random=${Math.random()}`,
        });

        if(result.success) {
            toast({
                title: t('forms.doctor.added_title'),
                description: t('forms.doctor.added_desc'),
            });
            router.push(`/admin/doctors`);
            router.refresh();
        } else {
            toast({
                title: t('forms.toast.error'),
                description: result.error || t('forms.doctor.added_error'),
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('forms.doctor.name_label')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('forms.doctor.name_placeholder')} {...field} />
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
                                <FormLabel>{t('forms.doctor.specialization_label')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('forms.doctor.specialization_placeholder')} {...field} />
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
                                <FormLabel>{t('forms.doctor.email_label')}</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder={t('forms.doctor.email_placeholder')} {...field} />
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
                                <FormLabel>{t('forms.doctor.password_label')}</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
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
                            <FormLabel>{t('forms.doctor.bio_label')}</FormLabel>
                            <FormControl>
                                <Textarea placeholder={t('forms.doctor.bio_placeholder')} {...field} />
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
                            <FormLabel>{t('forms.doctor.image_url_label')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('forms.doctor.image_url_placeholder')} {...field} />
                            </FormControl>
                             <p className="text-sm text-muted-foreground">{t('forms.doctor.image_url_desc')}</p>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('forms.buttons.add_doctor')}
                </Button>
            </form>
        </Form>
    );
}

    