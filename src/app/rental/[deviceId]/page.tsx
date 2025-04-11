import RentalForm from "@/components/RentalForm";

export default async function RentalPage({
  params,
}: {
  params: Promise<{ deviceId: string }>;
}) {
  const { deviceId } = await params;

  return <RentalForm deviceId={deviceId} />;
}
