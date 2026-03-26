import ConversationClient from "@/components/app/ConversationClient";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return <ConversationClient conversationId={conversationId} />;
}
