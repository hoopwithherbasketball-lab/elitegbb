"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/AuthProvider";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { ErrorState, StatusBadge } from "@/components/ui";

const profileSchema = z.object({
  height: z.string().min(2, "Height is required"),
  weight: z.string().min(2, "Weight is required"),
  wingspan: z.string().min(2, "Wingspan is required"),
  school: z.string().min(2, "School is required"),
  gpaRange: z.string().min(1, "GPA range is required"),
  testRange: z.string().min(1, "SAT/ACT range is required"),
  intendedMajor: z.string().min(2, "Intended major is required"),
  graduationYear: z.string().min(4, "Graduation year is required"),
  visibility: z.enum(["public", "members_only", "private"]),
});

export type ProfileEditorValues = z.infer<typeof profileSchema>;

interface ProfileEditorClientProps {
  initialValues: ProfileEditorValues;
}

export function ProfileEditorClient({ initialValues }: ProfileEditorClientProps) {
  const { profile } = useAuth();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditorValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: ProfileEditorValues) => {
    setSaveError(null);
    setSaveMessage(null);

    if (!profile) {
      setSaveError("You must be signed in to update profile details.");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("member_profiles")
        .update({
          display_name: profile.display_name,
        })
        .eq("id", profile.id);

      if (error) {
        setSaveError(error.message);
        return;
      }

      setSaveMessage(`Profile preferences saved (${values.visibility.replace("_", " ")}).`);
    } catch {
      setSaveError("Unable to reach Supabase client configuration.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-white/80">Height
          <input {...register("height")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" />
          {errors.height ? <span className="mt-1 block text-xs text-red-300">{errors.height.message}</span> : null}
        </label>
        <label className="text-sm text-white/80">Weight
          <input {...register("weight")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" />
          {errors.weight ? <span className="mt-1 block text-xs text-red-300">{errors.weight.message}</span> : null}
        </label>
        <label className="text-sm text-white/80">Wingspan
          <input {...register("wingspan")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" />
          {errors.wingspan ? <span className="mt-1 block text-xs text-red-300">{errors.wingspan.message}</span> : null}
        </label>
        <label className="text-sm text-white/80">School
          <input {...register("school")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" />
          {errors.school ? <span className="mt-1 block text-xs text-red-300">{errors.school.message}</span> : null}
        </label>
        <label className="text-sm text-white/80">GPA range
          <input {...register("gpaRange")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" />
          {errors.gpaRange ? <span className="mt-1 block text-xs text-red-300">{errors.gpaRange.message}</span> : null}
        </label>
        <label className="text-sm text-white/80">SAT/ACT range
          <input {...register("testRange")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" />
          {errors.testRange ? <span className="mt-1 block text-xs text-red-300">{errors.testRange.message}</span> : null}
        </label>
        <label className="text-sm text-white/80">Intended major
          <input {...register("intendedMajor")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" />
          {errors.intendedMajor ? <span className="mt-1 block text-xs text-red-300">{errors.intendedMajor.message}</span> : null}
        </label>
        <label className="text-sm text-white/80">Graduation year
          <input {...register("graduationYear")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white" />
          {errors.graduationYear ? <span className="mt-1 block text-xs text-red-300">{errors.graduationYear.message}</span> : null}
        </label>
      </div>

      <label className="text-sm text-white/80">Visibility
        <select {...register("visibility")} className="mt-1 w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white">
          <option value="public">Public</option>
          <option value="members_only">Members Only</option>
          <option value="private">Private</option>
        </select>
      </label>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSubmitting} className="rounded-md bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white">
          {isSubmitting ? "Saving..." : "Save profile details"}
        </button>
        {saveMessage ? <><StatusBadge variant="active" /><span className="text-xs text-white/70">{saveMessage}</span></> : null}
      </div>

      {saveError ? <ErrorState title="Could not save profile" description={saveError} /> : null}
    </form>
  );
}
