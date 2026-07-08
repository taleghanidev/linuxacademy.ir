import ScheduleEditor from "@/components/admin/ScheduleEditor";
import adminFa from "@/language/fa/admin";
import { getScheduleSettings } from "@/lib/schedule-settings";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const settings = await getScheduleSettings();

  return (
    <>
      <div>
        <h1 className="text-xl font-bold">{adminFa.schedule.title}</h1>
        <p className="mt-0.5 text-sm text-gray-500">{adminFa.schedule.sub}</p>
      </div>
      <ScheduleEditor initial={settings} />
    </>
  );
}
