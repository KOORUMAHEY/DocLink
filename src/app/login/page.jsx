
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Stethoscope, Heart, Eye, EyeOff, Shield, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-100 rounded-full opacity-20"></div>
            </div>

            <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm relative z-10">
                <CardHeader className="text-center pb-6">
                    <div className="flex justify-center items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-green-700 bg-clip-text text-transparent">
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
                                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span>{t('login.email_label')}</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="email" 
                                                placeholder="doctor@hospital.com" 
                                                className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 rounded-lg"
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
                                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span>{t('login.password_label')}</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input 
                                                    type={showPassword ? "text" : "password"} 
                                                    placeholder="••••••••" 
                                                    className="h-12 text-base border-2 border-gray-200 focus:border-blue-400 rounded-lg pr-12"
                                                    {...field} 
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg" 
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('login.button')}
                            </Button>
                        </form>
                    </Form>

                    {/* Additional Links */}
                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                                {t('login.forgot_password')}
                            </a>
                            <a href="#" className="text-green-600 hover:text-green-800 font-medium hover:underline">
                                {t('login.sign_up')}
                            </a>
                        </div>
                        
                        {/* Trust marks */}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                            <Shield className="w-4 h-4 text-green-600" />
                            <Lock className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{t('login.secured_by')}</span>
                        </div>

                        {/* Support contact */}
                        <div className="text-center text-sm text-gray-500">
                            {t('login.having_trouble')} 
                            <a href="mailto:support@doclink.com" className="text-blue-600 hover:text-blue-800 font-medium ml-1 hover:underline">
                                support@doclink.com
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
