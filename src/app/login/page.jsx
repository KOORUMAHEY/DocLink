
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getDoctorByEmail } from "@/services/doctorService";
import { useI18n } from "@/context/i18n";

const loginFormSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { t } = useI18n();

    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        if (data.email.includes('admin')) {
            toast({
                title: "Admin Login Successful",
                description: "Redirecting to admin dashboard...",
            });
            router.push("/admin");
            return;
        }

        try {
            const doctor = await getDoctorByEmail(data.email);

            if (doctor && doctor.password === data.password) {
                toast({
                    title: "Login Successful",
                    description: "Redirecting to your dashboard...",
                });
                // Redirect to the appointments page with the doctor's ID
                router.push(`/doctor/appointments?id=${doctor.id}`);
            } else {
                 toast({
                    title: "Login Failed",
                    description: "Invalid email or password.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred during login.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-112px)] items-center justify-center bg-background px-4">
            <Card className="w-full max-w-sm border-0 shadow-lg">
                <CardHeader className="text-center">
                     <div className="flex justify-center items-center gap-2 mb-4">
                        <Stethoscope className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
                    <CardDescription>{t('login.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('login.email_label')}</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="your@email.com" {...field} />
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
                                        <FormLabel>{t('login.password_label')}</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('login.button')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
