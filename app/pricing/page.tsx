import { redirect } from "next/navigation";

// The membership page replaced /pricing; keep the old URL working.
export default function PricingRedirect() {
  redirect("/membership");
}
