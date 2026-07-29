import BingoPlayer from "./BingoPlayer";

export default async function BingoPlayPage({ params }: PageProps<"/play/bingo/[id]">) {
  const { id } = await params;
  return <BingoPlayer activityId={id.toUpperCase()} />;
}
