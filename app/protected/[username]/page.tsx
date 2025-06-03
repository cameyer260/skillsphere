import ClientProfilePage from "./ClientProfilePage";

export default function UsernamePage({
  params,
}: {
  params: { username: string };
}) {
  return <ClientProfilePage username={params.username} />;
}
