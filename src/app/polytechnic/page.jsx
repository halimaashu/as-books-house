import { redirect } from "next/navigation";

// Legacy customer URL now opens the general bookstore. Admin records and tools remain available.
export default function LegacyPolytechnicRoute() {
  redirect("/allBooks?category=Academic");
}
