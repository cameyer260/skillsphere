import { Suspense } from "react";
import ProfilePageClient from "./ProfilePageClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfilePageClient />
    </Suspense>
  );
}
