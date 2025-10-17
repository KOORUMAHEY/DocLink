
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
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="w-full max-w-md mx-auto relative z-10">
                <Card className="w-full border-0 shadow-2xl bg-white/98 backdrop-blur-xl rounded-3xl">
                <CardHeader className="text-center pb-8 pt-8 px-8">
                    <div className="flex justify-center items-center gap-3 mb-6">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl">
                            <Stethoscope className="w-7 h-7 text-white" />
                        </div>
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-xl">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-green-600 bg-clip-text text-transparent mb-2">
                        {t('login.title')}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 mt-2 leading-relaxed">
                        {t('login.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-8 px-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-800 block mb-2">
                                            {t('login.email_label')} *
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="email" 
                                                placeholder="doctor@hospital.com" 
                                                className="h-12 text-base border-1.5 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 bg-white shadow-sm"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs mt-1.5" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-gray-800 block mb-2">
                                            {t('login.password_label')} *
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input 
                                                    type={showPassword ? "text" : "password"} 
                                                    placeholder="••••••••" 
                                                    className="h-12 text-base border-1.5 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 bg-white shadow-sm pr-14"
                                                    {...field} 
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs mt-1.5" />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                className="w-full h-13 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl text-base mt-8" 
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                {form.formState.isSubmitting ? 'Signing in...' : t('login.button')}
                            </Button>
                        </form>
                    </Form>

                    {/* Additional Links & Info */}
                    <div className="mt-8 space-y-4">
                        {/* Admin Login Info */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/70 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-200/50 rounded-lg flex-shrink-0">
                                    <Shield className="w-5 h-5 text-purple-700" />
                                </div>
                                <div className="text-xs text-gray-700">
                                    <p className="font-bold text-purple-900 mb-2">🔐 Admin Access</p>
                                    <p className="text-gray-600 mb-1">Email: <span className="font-mono font-semibold text-gray-800">admin@doclink.in</span></p>
                                    <p className="text-gray-600">Password: <span className="font-mono font-semibold text-gray-800">12345678</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between text-sm gap-2">
                            <button
                                type="button"
                                className="flex-1 py-2.5 text-blue-700 hover:text-blue-900 font-semibold hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
                                onClick={() => {
                                    router.push('/forgot-password');
                                }}
                            >
                                {t('login.forgot_password')}
                            </button>
                            <button
                                type="button"
                                className="flex-1 py-2.5 text-green-700 hover:text-green-900 font-semibold hover:bg-green-50 rounded-lg transition-all duration-200 border border-green-200 hover:border-green-300"
                                onClick={() => {
                                    router.push('/sign-up');
                                }}
                            >
                                {t('login.sign_up')}
                            </button>
                        </div>
                        
                        {/* Trust marks */}
                        <div className="flex items-center justify-center gap-3 text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 rounded-xl p-3.5">
                            <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="font-semibold">{t('login.secured_by')}</span>
                        </div>

                        {/* Support contact */}
                        <div className="text-center text-sm text-gray-500 pt-1">

                            {t('login.having_trouble')} 
                            <a href="mailto:support@doclink.com" className="text-blue-600 hover:text-blue-800 font-semibold ml-1 hover:underline">
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
