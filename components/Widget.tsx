// components/TipsWidget.tsx
import { Lightbulb, Users, Search } from "lucide-react";

export default function TipsWidget() {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 shadow p-4 space-y-4 w-full">
      <h2 className="text-lg font-semibold text-neutral-800 dark:text-white">
        Grow Your Network
      </h2>

      <ul className="space-y-3 text-sm text-neutral-700 dark:text-neutral-200">
        <Tip icon={<Users className="h-4 w-4 text-blue-500" />} text="Connect with people you’ve worked with." />
        <Tip icon={<Search className="h-4 w-4 text-green-500" />} text="Explore profiles in your industry." />
        <Tip icon={<Lightbulb className="h-4 w-4 text-yellow-500" />} text="Share a post about your recent work." />
      </ul>

      <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-700">
        Tip: Stay active to increase your visibility
      </div>
    </div>
  );
}

function Tip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-2">
      <div>{icon}</div>
      <span>{text}</span>
    </li>
  );
}
