
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
    <Card>
      <CardHeader>
        <CardTitle>{t('forms.search.title')}</CardTitle>
        <CardDescription>{t('forms.search.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-end gap-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="w-full sm:w-auto flex-grow">
                  <FormLabel>{t('forms.search.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('forms.search.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto">
                <Search className="mr-2" />
                {t('forms.buttons.search')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    