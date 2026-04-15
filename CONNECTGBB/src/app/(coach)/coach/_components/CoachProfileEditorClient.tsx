"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/AuthProvider";
import { ErrorState, VerificationBadge } from "@/components/ui";
import { getSupabaseClient } from "@/lib/supabaseClient";

const schema = z.object({
  title: z.string().min(2),
  organization: z.string().min(2),
  division: z.string().min(2),
  location: z.string().min(2),
  website: z.string().url(),
  responseTime: z.string().min(2),
  preferredContact: z.string().min(2),
});

type CoachProfileFormValues = z.infer<typeof schema>;

interface CoachProfileEditorClientProps {
  initialValues: CoachProfileFormValues;
}

export function CoachProfileEditorClient({ initialValues }: CoachProfileEditorClientProps) {
  const { profile } = useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CoachProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const onSubmit = async () => {
    setStatus(null);
    setErrorMessage(null);

    if (!profile) {
      setErrorMessage("Session required to update profile.");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("member_profiles").update({ display_name: profile.display_name }).eq("id", profile.id);
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      setStatus("Profile updates saved.");
    } catch {
      setErrorMessage("Unable to save profile updates.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-white/80">Title<input {...register("title")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-white" />{errors.title ? <span className="text-xs text-red-300">{errors.title.message}</span> : null}</label>
        <label className="text-sm text-white/80">Organization<input {...register("organization")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-white" />{errors.organization ? <span className="text-xs text-red-300">{errors.organization.message}</span> : null}</label>
        <label className="text-sm text-white/80">Division<input {...register("division")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-white" />{errors.division ? <span className="text-xs text-red-300">{errors.division.message}</span> : null}</label>
        <label className="text-sm text-white/80">Location<input {...register("location")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-white" />{errors.location ? <span className="text-xs text-red-300">{errors.location.message}</span> : null}</label>
        <label className="text-sm text-white/80">Website<input {...register("website")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-white" />{errors.website ? <span className="text-xs text-red-300">{errors.website.message}</span> : null}</label>
        <label className="text-sm text-white/80">Response time<input {...register("responseTime")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-white" />{errors.responseTime ? <span className="text-xs text-red-300">{errors.responseTime.message}</span> : null}</label>
      </div>
      <label className="text-sm text-white/80">Preferred contact method<input {...register("preferredContact")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-white" />{errors.preferredContact ? <span className="text-xs text-red-300">{errors.preferredContact.message}</span> : null}</label>

      <div className="flex items-center gap-3"><button disabled={isSubmitting} className="rounded-md bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white">{isSubmitting ? "Saving..." : "Save profile"}</button><VerificationBadge state="pending" />{status ? <span className="text-xs text-white/70">{status}</span> : null}</div>
      {errorMessage ? <ErrorState title="Could not save coach profile" description={errorMessage} /> : null}
    </form>
  );
}
