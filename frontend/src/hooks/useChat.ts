import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { fetchChatHistory, postChatMessage, type ApiFetch } from '../api/reflectaApi';
import { copy } from '../i18n';
import { chatAttachmentBucket, supabase } from '../lib/supabase';
import type { ChatAttachment, ChatMessage, Language } from '../types';

export type ChatController = ReturnType<typeof useChat>;

export function useChat({
  apiFetch,
  enabled,
  language,
  onCrisis,
}: {
  apiFetch: ApiFetch;
  enabled: boolean;
  language: Language;
  onCrisis: () => void;
}) {
  const welcomeMessage: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content: copy[language].chat.welcome,
  };
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshHistory = async () => {
    try {
      if (!enabled) {
        return;
      }

      const nextMessages = await fetchChatHistory(apiFetch);

      if (nextMessages && nextMessages.length > 0) {
        setMessages(nextMessages);
      }
    } catch {
      // Local chat still works if the API is unavailable.
    }
  };

  useEffect(() => {
    void refreshHistory();
  }, [enabled, apiFetch]);

  useEffect(() => {
    setMessages((current) => (current.length === 1 && current[0].id === 'welcome' ? [welcomeMessage] : current));
  }, [language]);

  const reset = () => {
    setMessages([welcomeMessage]);
    setInput('');
    setPendingAttachments([]);
    setLoading(false);
  };

  const send = async (preset?: string) => {
    const content = (preset ?? input).trim();

    if ((!content && pendingAttachments.length === 0) || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content,
      attachments: pendingAttachments,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setPendingAttachments([]);
    setLoading(true);

    try {
      if (!enabled) {
        throw new Error('Auth session is not ready');
      }

      const payload = await postChatMessage({
        apiFetch,
        attachments: pendingAttachments,
        language,
        message: content,
        history: messages.map(({ role, content: text }) => ({
          role,
          content: text,
        })),
      });

      if (payload.safety === 'crisis') {
        onCrisis();
      }

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: payload.message,
        },
      ]);
      void refreshHistory();
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: copy[language].chat.offline,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const attachPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      throw new Error('Media library permission denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.82,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    const attachment = await uploadChatAttachment({
      kind: 'image',
      mimeType: asset.mimeType ?? 'image/jpeg',
      name: asset.fileName ?? `photo-${Date.now()}.jpg`,
      size: asset.fileSize,
      uri: asset.uri,
    });

    setPendingAttachments((current) => [...current, attachment].slice(0, 4));
  };

  const attachDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    const attachment = await uploadChatAttachment({
      kind: 'document',
      mimeType: asset.mimeType,
      name: asset.name,
      size: asset.size,
      uri: asset.uri,
    });

    setPendingAttachments((current) => [...current, attachment].slice(0, 4));
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((current) => current.filter((attachment) => attachment.id !== id));
  };

  return {
    attachDocument,
    attachPhoto,
    input,
    loading,
    messages,
    pendingAttachments,
    refreshHistory,
    removePendingAttachment,
    reset,
    send,
    setInput,
    setPendingAttachments,
  };
}

async function uploadChatAttachment({
  kind,
  mimeType,
  name,
  size,
  uri,
}: {
  kind: ChatAttachment['kind'];
  mimeType?: string | null;
  name: string;
  size?: number;
  uri: string;
}): Promise<ChatAttachment> {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) {
    throw new Error('Auth session is not ready');
  }

  const response = await fetch(uri);
  const blob = await response.blob();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const extension = getAttachmentExtension(name, mimeType, kind);
  const path = `${userId}/${id}.${extension}`;
  const upload = await supabase.storage.from(chatAttachmentBucket).upload(path, blob, {
    contentType: mimeType ?? (kind === 'image' ? 'image/jpeg' : 'application/octet-stream'),
    upsert: false,
  });

  if (upload.error) {
    throw upload.error;
  }

  const publicUrl = supabase.storage.from(chatAttachmentBucket).getPublicUrl(path);

  return {
    id,
    kind,
    mimeType: mimeType ?? undefined,
    name,
    size,
    url: publicUrl.data.publicUrl,
  };
}

function getAttachmentExtension(name: string, mimeType?: string | null, kind?: ChatAttachment['kind']) {
  const extension = name.split('.').pop()?.toLowerCase();

  if (extension && /^[a-z0-9]{2,8}$/.test(extension)) {
    return extension;
  }

  if (mimeType?.includes('png')) {
    return 'png';
  }

  if (mimeType?.includes('webp')) {
    return 'webp';
  }

  if (mimeType?.includes('pdf')) {
    return 'pdf';
  }

  if (kind === 'image') {
    return 'jpg';
  }

  return 'bin';
}
