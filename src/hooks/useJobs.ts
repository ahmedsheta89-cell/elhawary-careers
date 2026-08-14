import { useCallback, useEffect, useState } from 'react';
import type { Job } from '@/types';
import { jobsService } from '@/services/jobsService';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setJobs(await jobsService.getActiveJobs());
    } catch (loadError) {
      console.error(loadError);
      setError('تعذر تحميل الوظائف حالياً. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  return { jobs, isLoading, error, reload: loadJobs };
}

export function useJob(id: string | undefined) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const loadJob = useCallback(async () => {
    if (!id) {
      setJob(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setJob(await jobsService.getJobById(id));
    } catch (loadError) {
      console.error(loadError);
      setError('تعذر تحميل بيانات الوظيفة حالياً.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadJob();
  }, [loadJob]);

  return { job, isLoading, error, reload: loadJob };
}
