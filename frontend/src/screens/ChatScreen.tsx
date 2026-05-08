import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PageHeader } from '../components/ui/PageHeader';
import { copy, getScenarios } from '../i18n';
import type { ChatAttachment, ChatMessage, Language, Scenario } from '../types';

export function ChatScreen({
  input,
  language,
  loading,
  messages,
  onAttachDocument,
  onAttachPhoto,
  onChangeInput,
  onBack,
  onPractice,
  onRemoveAttachment,
  onSafety,
  onScenario,
  onSend,
  pendingAttachments,
}: {
  input: string;
  language: Language;
  loading: boolean;
  messages: ChatMessage[];
  onAttachDocument: () => Promise<void>;
  onAttachPhoto: () => Promise<void>;
  onChangeInput: (value: string) => void;
  onBack: () => void;
  onPractice: (scenario: Scenario) => void;
  onRemoveAttachment: (id: string) => void;
  onSafety: () => void;
  onScenario: (scenario: Scenario) => void;
  onSend: (preset?: string) => void;
  pendingAttachments: ChatAttachment[];
}) {
  const t = copy[language];
  const scenarios = getScenarios(language);
  const attach = (kind: 'document' | 'photo') => {
    void (kind === 'photo' ? onAttachPhoto() : onAttachDocument()).catch(() => {
      Alert.alert(t.chat.attachmentFailed);
    });
  };

  return (
    <View style={styles.chatScreen}>
      <ScrollView contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
        <PageHeader
          onBack={onBack}
          title={t.chat.title}
          subtitle={t.chat.subtitle}
        />

        <Pressable style={styles.chatSafetyPanel} onPress={onSafety}>
          <Text style={styles.chatSafetyTitle}>{t.chat.urgentTitle}</Text>
          <Text style={styles.chatSafetyText}>{t.chat.urgentText}</Text>
        </Pressable>

        <View style={styles.quickPromptRow}>
          <Pressable style={styles.quickPrompt} onPress={() => onSend(t.chat.anxietyPrompt)}>
            <Text style={styles.quickPromptText}>{t.chat.anxiety}</Text>
          </Pressable>
          <Pressable style={styles.quickPrompt} onPress={() => onSend(t.chat.sleepPrompt)}>
            <Text style={styles.quickPromptText}>{t.chat.sleep}</Text>
          </Pressable>
          <Pressable style={styles.quickPrompt} onPress={() => onPractice(scenarios[2])}>
            <Text style={styles.quickPromptText}>{t.chat.practice}</Text>
          </Pressable>
          <Pressable style={styles.quickPromptAlert} onPress={onSafety}>
            <Text style={styles.quickPromptAlertText}>{t.chat.urgent}</Text>
          </Pressable>
        </View>

        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.chatBubble,
              message.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text
              style={[
                styles.chatBubbleText,
                message.role === 'user' && styles.userBubbleText,
              ]}
            >
              {message.content}
            </Text>
            <AttachmentList attachments={message.attachments ?? []} />
          </View>
        ))}

        {loading && (
          <View style={[styles.chatBubble, styles.assistantBubble]}>
            <ActivityIndicator color="#1976ee" />
          </View>
        )}
      </ScrollView>

      <View style={styles.chatComposer}>
        <View style={styles.composerLeft}>
          <Pressable style={styles.attachButton} onPress={() => attach('photo')} disabled={loading}>
            <Text style={styles.attachButtonText}>▧</Text>
          </Pressable>
          <Pressable style={styles.attachButton} onPress={() => attach('document')} disabled={loading}>
            <Text style={styles.attachButtonText}>▤</Text>
          </Pressable>
        </View>
        <View style={styles.composerInputWrap}>
          {pendingAttachments.length > 0 ? (
            <View style={styles.pendingRow}>
              {pendingAttachments.map((attachment) => (
                <Pressable
                  key={attachment.id}
                  style={styles.pendingChip}
                  onPress={() => onRemoveAttachment(attachment.id)}
                >
                  <Text style={styles.pendingChipText} numberOfLines={1}>
                    {attachment.kind === 'image' ? t.chat.attachPhoto : t.chat.attachDocument}
                  </Text>
                  <Text style={styles.pendingRemove}>×</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        <TextInput
          multiline
          onChangeText={onChangeInput}
          onSubmitEditing={() => onSend()}
          placeholder={t.chat.placeholder}
          placeholderTextColor="#8290a6"
          style={styles.chatInput}
          value={input}
        />
        </View>
        <Pressable style={styles.sendButton} onPress={() => onSend()} disabled={loading}>
          <Text style={styles.sendButtonText}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}

function AttachmentList({ attachments }: { attachments: ChatAttachment[] }) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <View style={styles.attachmentList}>
      {attachments.map((attachment) => (
        <View key={attachment.id} style={styles.attachmentCard}>
          {attachment.kind === 'image' ? (
            <Image source={{ uri: attachment.url }} style={styles.attachmentImage} />
          ) : (
            <Text style={styles.attachmentIcon}>▤</Text>
          )}
          <Text style={styles.attachmentName} numberOfLines={1}>{attachment.name}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chatScreen: {
    backgroundColor: '#dcecff',
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 180,
  },
  chatSafetyPanel: {
    backgroundColor: '#fff2ed',
    borderColor: '#ffc4ad',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
  },
  chatSafetyTitle: {
    color: '#9f3d21',
    fontSize: 17,
    fontWeight: '900',
  },
  chatSafetyText: {
    color: '#7a584d',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  quickPromptRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  quickPrompt: {
    backgroundColor: 'rgba(247,251,255,0.8)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  quickPromptText: {
    color: '#1976ee',
    fontSize: 13,
    fontWeight: '800',
  },
  quickPromptAlert: {
    backgroundColor: '#fff2ed',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  quickPromptAlertText: {
    color: '#d65b36',
    fontSize: 13,
    fontWeight: '900',
  },
  chatBubble: {
    borderRadius: 24,
    marginBottom: 10,
    maxWidth: '88%',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(247,251,255,0.82)',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1976ee',
  },
  chatBubbleText: {
    color: '#52627a',
    fontSize: 15,
    lineHeight: 22,
  },
  userBubbleText: {
    color: '#ffffff',
  },
  chatComposer: {
    alignItems: 'flex-end',
    alignSelf: 'center',
    backgroundColor: 'rgba(247,251,255,0.95)',
    borderRadius: 28,
    bottom: 98,
    flexDirection: 'row',
    gap: 10,
    left: 22,
    maxWidth: 386,
    padding: 10,
    position: 'absolute',
    right: 22,
    boxShadow: '0 14px 24px rgba(142,169,201,0.2)',
  },
  composerLeft: {
    gap: 6,
  },
  attachButton: {
    alignItems: 'center',
    backgroundColor: '#edf5ff',
    borderRadius: 16,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  attachButtonText: {
    color: '#1976ee',
    fontSize: 17,
    fontWeight: '900',
  },
  composerInputWrap: {
    flex: 1,
  },
  pendingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  pendingChip: {
    alignItems: 'center',
    backgroundColor: '#edf5ff',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 5,
    maxWidth: 120,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  pendingChipText: {
    color: '#1976ee',
    flexShrink: 1,
    fontSize: 11,
    fontWeight: '900',
  },
  pendingRemove: {
    color: '#63728a',
    fontSize: 14,
    fontWeight: '900',
  },
  chatInput: {
    color: '#17233a',
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 92,
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#1976ee',
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 24,
  },
  attachmentList: {
    gap: 8,
    marginTop: 10,
  },
  attachmentCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    maxWidth: 220,
    padding: 8,
  },
  attachmentImage: {
    borderRadius: 10,
    height: 42,
    width: 42,
  },
  attachmentIcon: {
    color: '#1976ee',
    fontSize: 20,
    fontWeight: '900',
    width: 28,
  },
  attachmentName: {
    color: '#52627a',
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '800',
  },
});
