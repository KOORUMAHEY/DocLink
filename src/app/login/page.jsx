
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
import { authenticateUser, getRedirectPath } from "@/lib/auth";
import { useAuth } from "@/context/auth";
import { useI18n } from "@/context/i18n";

const loginFormSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { login } = useAuth();
    const { t } = useI18n();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        mode: 'onSubmit',
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            const result = await authenticateUser(data.email, data.password);

            if (result.success) {
                // Store user in context
                login(result.user);
                
                toast({
                    title: result.message,
                    description: `Welcome back, ${result.user.name}!`,
                });
                
                // Redirect based on role (include doctor ID for doctors)
                const redirectPath = getRedirectPath(result.user.role, result.user.id);
                router.push(redirectPath);
            } else {
                toast({
                    title: "Login Failed",
                    description: result.error || "Invalid email or password.",
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
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 relative overflow-hidden">
            {/* Animated Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-green-500/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-40 sm:w-60 h-40 sm:h-60 bg-indigo-500/10 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto relative z-10">
                <Card className="w-full border-0 shadow-2xl bg-white/98 backdrop-blur-xl rounded-2xl sm:rounded-3xl">
                <CardHeader className="text-center pb-6 sm:pb-8 pt-6 sm:pt-8 px-4 sm:px-6 md:px-8">
                    <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="p-2.5 sm:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl">
                            <Stethoscope className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
                        </div>
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl">
                            <Heart className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-green-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                        {t('login.title')}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-base text-gray-600 mt-1.5 sm:mt-2 leading-relaxed px-1 sm:px-0">
                        {t('login.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-6 sm:pb-8 px-4 sm:px-6 md:px-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm font-semibold text-gray-800 block mb-1.5 sm:mb-2">
                                            {t('login.email_label')} *
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="email" 
                                                placeholder="doctor@hospital.com" 
                                                className="h-10 sm:h-12 text-sm sm:text-base border-1.5 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg sm:rounded-xl transition-all duration-200 bg-white shadow-sm"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs mt-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm font-semibold text-gray-800 block mb-1.5 sm:mb-2">
                                            {t('login.password_label')} *
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input 
                                                    type={showPassword ? "text" : "password"} 
                                                    placeholder="••••••••" 
                                                    className="h-10 sm:h-12 text-sm sm:text-base border-1.5 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg sm:rounded-xl transition-all duration-200 bg-white shadow-sm pr-10 sm:pr-14"
                                                    {...field} 
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showPassword ? <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" /> : <Eye className="w-4 sm:w-5 h-4 sm:h-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs mt-1" />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                className="w-full h-11 sm:h-13 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg sm:rounded-xl text-sm sm:text-base mt-6 sm:mt-8" 
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 sm:h-5 w-4 sm:w-5 animate-spin" />}
                                {form.formState.isSubmitting ? 'Signing in...' : t('login.button')}
                            </Button>
                        </form>
                    </Form>

                    {/* Additional Links & Info */}
                    <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                        {/* Admin Login Info */}
                        {/* <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/70 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-sm">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-purple-200/50 rounded-lg flex-shrink-0 mt-0.5">
                                    <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-purple-700" />
                                </div>
                                <div className="text-xs sm:text-sm text-gray-700 min-w-0">
                                    <p className="font-bold text-purple-900 mb-1.5 sm:mb-2">🔐 Admin Access</p>
                                    <p className="text-gray-600 mb-0.5 sm:mb-1 break-all">Email: <span className="font-mono font-semibold text-gray-800 text-xs">admin@doclink.in</span></p>
                                    <p className="text-gray-600 break-all">Password: <span className="font-mono font-semibold text-gray-800 text-xs">12345678</span></p>
                                </div>
                            </div>
                        </div> */}

                        <div className="grid grid-cols-1 gap-3 sm:gap-3">
                            <button
                                type="button"
                                className="py-auto sm:py-2.5 px-auto text-xs sm:text-sm text-blue-700 hover:text-blue-900 font-semibold hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 truncate"
                                onClick={() => {
                                    router.push('/forgot-password');
                                }}
                            >
                                {t('login.forgot_password')}
                            </button>
                        </div>
                        
                        {/* Trust marks */}
                        <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 flex-wrap">
                            <Shield className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-green-600 flex-shrink-0" />
                            <Lock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-600 flex-shrink-0" />
                            <span className="font-semibold">{t('login.secured_by')}</span>
                        </div>

                        {/* Support contact */}
                        <div className="text-center text-xs sm:text-sm text-gray-500 pt-1">
                            {t('login.having_trouble')} 
                            <a href="mailto:support@doclink.com" className="text-blue-600 hover:text-blue-800 font-semibold ml-1 hover:underline break-all">
                                support@doclink.com
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
            </div>
        </div>
    );
}
