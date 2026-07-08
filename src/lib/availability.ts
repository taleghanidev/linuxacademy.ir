// Shared availability lookup: Google free/busy (Upstash-cached, 15 min TTL like
// the old Redis setup) intersected with the weekly working hours.

import { Redis } from "@upstash/redis";
import { type BusyBlock, getBusyBlocks } from "@/lib/google-calendar";
import { getScheduleSettings } from "@/lib/schedule-settings";
import { bookingWindow, candidateSlots, filterFree } from "@/lib/slots";

const CACHE_KEY = "gcal:busy";
const CACHE_TTL_SECONDS = 15 * 60;

function redis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

export async function getFreeSlotIsos(skipCache = false): Promise<string[]> {
  const settings = await getScheduleSettings();
  const { fromIso, toIso } = bookingWindow(settings);
  const kv = redis();

  let busy: BusyBlock[] | null = null;
  if (!skipCache && kv) {
    try {
      busy = (await kv.get<BusyBlock[]>(CACHE_KEY)) ?? null;
    } catch {
      busy = null;
    }
  }
  if (!busy) {
    busy = await getBusyBlocks(fromIso, toIso);
    if (kv) {
      try {
        await kv.set(CACHE_KEY, busy, { ex: CACHE_TTL_SECONDS });
      } catch {
        // cache write failure is non-fatal
      }
    }
  }
  return filterFree(candidateSlots(settings), busy).map((s) => s.toISO() as string);
}

export async function invalidateBusyCache(): Promise<void> {
  const kv = redis();
  if (kv) {
    try {
      await kv.del(CACHE_KEY);
    } catch {
      // ignore
    }
  }
}
