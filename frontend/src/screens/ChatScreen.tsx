import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { PageHeader } from '../components/ui/PageHeader';
import { scenarios } from '../data';
import { styles } from '../theme/styles';
import type { ChatMessage, Scenario } from '../types';

export function ChatScreen({
  input,
  loading,
  messages,
  onChangeInput,
  onPractice,
  onSafety,
  onScenario,
  onSend,
}: {
  input: string;
  loading: boolean;
  messages: ChatMessage[];
  onChangeInput: (value: string) => void;
  onPractice: (scenario: Scenario) => void;
  onSafety: () => void;
  onScenario: (scenario: Scenario) => void;
  onSend: (preset?: string) => void;
}) {
  return (
    <View style={styles.chatScreen}>
      <ScrollView contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Поговорить"
          subtitle="Конфиденциальный мягкий диалог. Без диагнозов и громких обещаний."
        />

        <Pressable style={styles.chatSafetyPanel} onPress={onSafety}>
          <Text style={styles.chatSafetyTitle}>Нужна срочная помощь?</Text>
          <Text style={styles.chatSafetyText}>
            Если есть риск навредить себе или кому-то ещё, лучше подключить живого человека прямо сейчас.
          </Text>
        </Pressable>

        <View style={styles.quickPromptRow}>
          <Pressable style={styles.quickPrompt} onPress={() => onSend('Меня накрывает тревога')}>
            <Text style={styles.quickPromptText}>Тревога</Text>
          </Pressable>
          <Pressable style={styles.quickPrompt} onPress={() => onSend('Не могу уснуть')}>
            <Text style={styles.quickPromptText}>Сон</Text>
          </Pressable>
          <Pressable style={styles.quickPrompt} onPress={() => onPractice(scenarios[2])}>
            <Text style={styles.quickPromptText}>Практика</Text>
          </Pressable>
          <Pressable style={styles.quickPromptAlert} onPress={onSafety}>
            <Text style={styles.quickPromptAlertText}>Срочно</Text>
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
          </View>
        ))}

        {loading && (
          <View style={[styles.chatBubble, styles.assistantBubble]}>
            <ActivityIndicator color="#1976ee" />
          </View>
        )}
      </ScrollView>

      <View style={styles.chatComposer}>
        <TextInput
          multiline
          onChangeText={onChangeInput}
          onSubmitEditing={() => onSend()}
          placeholder="Напиши одну фразу..."
          placeholderTextColor="#8290a6"
          style={styles.chatInput}
          value={input}
        />
        <Pressable style={styles.sendButton} onPress={() => onSend()} disabled={loading}>
          <Text style={styles.sendButtonText}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}
