
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useI18n } from "@/context/i18n";

const searchSchema = z.object({
  query: z.string().min(1, "Please enter a phone number or Hospital ID."),
});

export function AppointmentSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: searchParams.get('query') || "",
    },
  });

  const onSubmit = (data) => {
    router.push(`/appointments?query=${data.query}`);
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <CardTitle className="text-xl lg:text-2xl flex items-center font-bold">
            <Search className="mr-3 h-6 w-6" />
            {t('forms.search.title')}
          </CardTitle>
          <CardDescription className="text-blue-100 text-sm lg:text-base mt-2">
            {t('forms.search.description')}
          </CardDescription>
        </div>
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
      </CardHeader>
      <CardContent className="p-6 lg:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-end gap-4 lg:gap-6">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="w-full sm:w-auto flex-grow">
                  <FormLabel className="text-gray-700 font-semibold text-sm lg:text-base">{t('forms.search.label')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('forms.search.placeholder')} 
                      {...field}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 h-12 lg:h-14 text-sm lg:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 lg:px-8 py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold h-12 lg:h-14"
            >
                <Search className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                <span className="text-sm lg:text-base">{t('forms.buttons.search')}</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    