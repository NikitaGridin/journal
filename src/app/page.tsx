import ClientOnly from "@/shared/utils";
import { JournalWidget } from "@/widgets/journal";
import { ListDisciplinesWidget } from "@/widgets/list-disciplines";
import { ListGroupsWidget } from "@/widgets/list-groups/ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Журнал",
};
export default async function Home() {
  return (
    <main className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <ClientOnly>
          <>
            <ListGroupsWidget />
            <ListDisciplinesWidget />
          </>
        </ClientOnly>
      </div>
      <div className="col-span-2">
        <JournalWidget />
      </div>
    </main>
  );
}
