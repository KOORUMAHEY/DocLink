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
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import { useI18n } from "@/context/i18n";
import { useState } from "react";

const searchSchema = z.object({
  query: z.string().min(1, "Please enter a search term (name, phone, or Hospital ID)."),
});

export function AppointmentSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: searchParams.get('query') || "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    router.push(`/appointments?query=${encodeURIComponent(data.query)}`);
    // Let the loading state clear after navigation
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleClear = () => {
    form.reset({ query: "" });
    router.push('/appointments');
  };

  const currentQuery = form.watch("query");

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 sr-only">
                  {t('forms.search.label')}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      placeholder="Search by patient name, phone number (10 digits), or Hospital ID..." 
                      {...field}
                      disabled={isLoading}
                      className="h-14 pl-12 pr-24 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {currentQuery && (
                      <button
                        type="button"
                        onClick={handleClear}
                        disabled={isLoading}
                        className="absolute right-20 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                    <Button 
                      type="submit" 
                      disabled={isLoading || !currentQuery}
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="hidden sm:inline">Searching...</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Search</span>
                        </>
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-sm font-medium mt-2" />
              </FormItem>
            )}
          />

          {/* Quick Search Examples */}
          {/* <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs font-medium text-gray-500">Try:</span>
            <button
              type="button"
              onClick={() => form.setValue("query", "Alice Johnson")}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors font-medium"
            >
              Alice Johnson
            </button>
            <button
              type="button"
              onClick={() => form.setValue("query", "1234567890")}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors font-medium"
            >
              1234567890
            </button>
            <button
              type="button"
              onClick={() => form.setValue("query", "1232")}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors font-medium"
            >
              ID: 1232
            </button>
          </div> */}
        </form>
      </Form>
    </div>
  );
}

