import ConversationClient from "@/components/app/ConversationClient";

export default function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const { conversationId } = params;
  return <ConversationClient conversationId={conversationId} />;
}
