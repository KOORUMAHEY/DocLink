
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
                // Redirect to the doctor dashboard with the doctor's ID
                router.push(`/doctor?id=${doctor.id}`);
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
        <div className="flex min-h-[calc(100vh-112px)] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-sm border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                     <div className="flex justify-center items-center gap-2 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                        {t('login.title')}
                    </CardTitle>
                    <CardDescription className="text-sm lg:text-base text-gray-600 mt-2">
                        {t('login.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            {t('login.email_label')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="email" 
                                                placeholder="your@email.com" 
                                                className="h-11 text-base"
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
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            {t('login.password_label')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="password" 
                                                placeholder="••••••••" 
                                                className="h-11 text-base"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
                                disabled={form.formState.isSubmitting}
                            >
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
