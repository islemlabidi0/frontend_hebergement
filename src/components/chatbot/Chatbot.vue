<template>
  <div class="chatbot-page">

    <div class="bg-grid"></div>
    <div class="bg-glow"></div>

    <div class="chat-layout">

      <!-- ── Sidebar ── -->
      <aside class="chat-sidebar">
        <div class="sidebar-top">
          <div class="ai-logo">
            <div class="ai-logo-ring"></div>
            <i class="bi bi-stars"></i>
          </div>
          <h2 class="sidebar-title">Assistant PGHU</h2>
          <p class="sidebar-sub">Propulsé par Ollamma </p>
        </div>

        <div class="sidebar-section">
          <span class="sidebar-label">Suggestions</span>
          <button
            v-for="s in suggestions"
            :key="s.text"
            class="suggestion-btn"
            @click="useSuggestion(s.text)"
          >
            <i :class="s.icon"></i>
            <span>{{ s.text }}</span>
          </button>
        </div>

        <div class="sidebar-footer">
          <div class="model-badge">
            <span class="model-dot"></span>
            grok-3-mini · xAI
          </div>
        </div>
      </aside>

      <!-- ── Main Chat ── -->
      <main class="chat-main">

        <!-- Topbar -->
        <div class="chat-topbar">
          <div class="topbar-left">
            <div class="topbar-avatar"><i class="bi bi-stars"></i></div>
            <div>
              <div class="topbar-name">Assistant Hébergement</div>
              <div class="topbar-status">
                <span class="status-pulse"></span>
                 llama3.2:1b · Ollama
              </div>
            </div>
          </div>
          <button class="clear-btn" @click="clearChat">
            <i class="bi bi-arrow-counterclockwise"></i>
            <span>Réinitialiser</span>
          </button>
        </div>

        <!-- Messages -->
        <div class="chat-messages" ref="messagesEl">

          <div v-if="messages.length === 0" class="welcome-state">
            <div class="welcome-icon"><i class="bi bi-stars"></i></div>
            <h3 class="welcome-title">Bonjour, je suis votre assistant PGHU</h3>
            <p class="welcome-sub">
              Posez-moi vos questions sur les foyers, blocs et chambres disponibles,
              ou demandez une recommandation personnalisée selon vos besoins.
            </p>
          </div>

          <template v-for="(msg, i) in messages" :key="i">
            <div class="msg-row" :class="msg.role">
              <div v-if="msg.role === 'assistant'" class="msg-avatar bot-av">
                <i class="bi bi-stars"></i>
              </div>
              <div class="msg-content">
                <div class="msg-bubble" :class="msg.role">
                  <p v-for="(line, li) in msg.text.split('\n')" :key="li" class="msg-line">{{ line }}</p>
                </div>
                <div class="msg-meta">{{ msg.time }}</div>
              </div>
              <div v-if="msg.role === 'user'" class="msg-avatar user-av">
                <i class="bi bi-person-fill"></i>
              </div>
            </div>
          </template>

          <div v-if="isLoading" class="msg-row assistant">
            <div class="msg-avatar bot-av"><i class="bi bi-stars"></i></div>
            <div class="msg-content">
              <div class="msg-bubble assistant typing-bubble">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </div>
            </div>
          </div>

          <div v-if="error" class="error-banner">
            <i class="bi bi-exclamation-triangle-fill"></i> {{ error }}
          </div>

        </div>

        <!-- Input -->
        <div class="chat-input-wrap">
          <div class="chat-input-box" :class="{ focused: inputFocused }">
            <textarea
              v-model="inputText"
              class="chat-textarea"
              placeholder="Ex: Je suis en 1ère année à FSEGT, je cherche une chambre calme..."
              rows="1"
              @keydown.enter.exact.prevent="sendMessage"
              @focus="inputFocused = true"
              @blur="inputFocused = false"
              @input="autoResize"
              ref="textareaEl"
              :disabled="isLoading"
            ></textarea>
            <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim() || isLoading">
              <i class="bi bi-send-fill"></i>
            </button>
          </div>
          <p class="input-hint">Entrée pour envoyer · Maj+Entrée pour nouvelle ligne</p>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { sendChatMessage } from '@/services/chatbotService'

interface Message {
  role: 'user' | 'assistant'
  text: string
  time: string
}

const messages   = ref<Message[]>([])
const inputText  = ref('')
const isLoading  = ref(false)
const error      = ref('')
const inputFocused = ref(false)
const messagesEl = ref<HTMLElement | null>(null)
const textareaEl = ref<HTMLTextAreaElement | null>(null)

const suggestions = [
  { icon: 'bi bi-house-heart-fill', text: 'Quel bloc est le plus calme ?' },
  { icon: 'bi bi-moon-stars-fill',  text: 'Chambre simple pour étudier en paix' },
  { icon: 'bi bi-people-fill',      text: 'Chambres disponibles en ce moment ?' },
  { icon: 'bi bi-building-fill',    text: 'Quels foyers sont les plus proches ?' },
  { icon: 'bi bi-star-fill',        text: 'Quel bloc est le plus bruyant ?' },
]

const getTime = () =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

const scrollBottom = async () => {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
}

const autoResize = () => {
  const ta = textareaEl.value
  if (!ta) return
  ta.style.height = 'auto'
  ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return
  error.value = ''
  messages.value.push({ role: 'user', text, time: getTime() })
  inputText.value = ''
  if (textareaEl.value) textareaEl.value.style.height = 'auto'
  await scrollBottom()
  isLoading.value = true
  await scrollBottom()
  try {
    const response = await sendChatMessage(text)
    messages.value.push({ role: 'assistant', text: response, time: getTime() })
  } catch {
    error.value = 'Erreur de connexion. Vérifiez que le backend Spring Boot est démarré.'
  } finally {
    isLoading.value = false
    await scrollBottom()
  }
}

const useSuggestion = (text: string) => {
  inputText.value = text
  textareaEl.value?.focus()
}

const clearChat = () => { messages.value = []; error.value = '' }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.chatbot-page {
  min-height: 100vh;
  background: #07090f;
  font-family: 'Sora', sans-serif;
  color: #e2e8f0;
  position: relative;
  overflow: hidden;
  display: flex;
}

.bg-grid {
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none; z-index: 0;
}
.bg-glow {
  position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
  width: 800px; height: 500px;
  background: radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
}

.chat-layout { display: flex; width: 100%; min-height: 100vh; position: relative; z-index: 1; }

/* Sidebar */
.chat-sidebar {
  width: 270px; flex-shrink: 0;
  background: rgba(255,255,255,0.025);
  border-right: 1px solid rgba(255,255,255,0.07);
  display: flex; flex-direction: column;
  padding: 32px 20px; gap: 28px;
}
.sidebar-top { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.ai-logo {
  position: relative; width: 50px; height: 50px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.35rem; color: #818cf8;
}
.ai-logo-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1.5px solid rgba(129,140,248,0.4);
  animation: spin 8s linear infinite;
}
.ai-logo-ring::before {
  content: ''; position: absolute; top: -3px; left: 50%;
  width: 6px; height: 6px; background: #818cf8;
  border-radius: 50%; transform: translateX(-50%);
}
@keyframes spin { to { transform: rotate(360deg); } }
.sidebar-title { font-size: 0.95rem; font-weight: 700; color: #f1f5f9; }
.sidebar-sub   { font-size: 0.73rem; color: #64748b; }
.sidebar-section { display: flex; flex-direction: column; gap: 7px; }
.sidebar-label {
  font-size: 0.67rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: #475569; margin-bottom: 4px;
}
.suggestion-btn {
  display: flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px; padding: 9px 13px;
  color: #94a3b8; font-size: 0.79rem;
  font-family: 'Sora', sans-serif;
  cursor: pointer; text-align: left; transition: all 0.2s;
}
.suggestion-btn i { color: #6366f1; font-size: 0.83rem; flex-shrink: 0; }
.suggestion-btn:hover { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.3); color: #e2e8f0; }
.sidebar-footer { margin-top: auto; }
.model-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 20px; padding: 6px 14px;
  font-size: 0.71rem; font-family: 'JetBrains Mono', monospace; color: #818cf8;
}
.model-dot {
  width: 6px; height: 6px; background: #4ade80; border-radius: 50%;
  animation: pdot 2s ease-in-out infinite;
}
@keyframes pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

/* Main */
.chat-main { flex: 1; display: flex; flex-direction: column; min-height: 100vh; overflow: hidden; }

.chat-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(7,9,15,0.85); backdrop-filter: blur(12px); flex-shrink: 0;
}
.topbar-left { display: flex; align-items: center; gap: 13px; }
.topbar-avatar {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, #4338ca, #6366f1);
  border-radius: 11px; display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem; color: #fff;
}
.topbar-name   { font-size: 0.88rem; font-weight: 600; color: #f1f5f9; }
.topbar-status { display: flex; align-items: center; gap: 6px; font-size: 0.71rem; color: #64748b; margin-top: 2px; }
.status-pulse  { width: 7px; height: 7px; background: #4ade80; border-radius: 50%; animation: pdot 2s ease-in-out infinite; }
.clear-btn {
  display: flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 7px 13px;
  color: #64748b; font-size: 0.77rem; font-family: 'Sora', sans-serif;
  cursor: pointer; transition: all 0.2s;
}
.clear-btn:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }

.chat-messages {
  flex: 1; overflow-y: auto;
  padding: 28px; display: flex; flex-direction: column; gap: 18px;
  scroll-behavior: smooth;
}
.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 4px; }

.welcome-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center;
  flex: 1; padding: 60px 20px; gap: 14px;
  animation: fadeUp 0.5s ease;
}
.welcome-icon {
  width: 68px; height: 68px;
  background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(99,102,241,0.04));
  border: 1px solid rgba(99,102,241,0.28);
  border-radius: 18px; display: flex; align-items: center; justify-content: center;
  font-size: 1.7rem; color: #818cf8;
}
.welcome-title { font-size: 1.15rem; font-weight: 600; color: #f1f5f9; }
.welcome-sub   { font-size: 0.86rem; color: #64748b; max-width: 400px; line-height: 1.7; }

.msg-row { display: flex; align-items: flex-end; gap: 11px; animation: fadeUp 0.3s ease; }
.msg-row.user { flex-direction: row-reverse; }
@keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

.msg-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; flex-shrink: 0;
}
.bot-av  { background: linear-gradient(135deg, #4338ca, #6366f1); color: #fff; }
.user-av { background: rgba(255,255,255,0.08); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); }

.msg-content { display: flex; flex-direction: column; gap: 4px; max-width: 74%; }
.msg-row.user .msg-content { align-items: flex-end; }

.msg-bubble {
  padding: 11px 15px; border-radius: 15px;
  font-size: 0.875rem; line-height: 1.65;
  display: flex; flex-direction: column; gap: 5px;
}
.msg-bubble.assistant {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-bottom-left-radius: 4px; color: #cbd5e1;
}
.msg-bubble.user {
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: #fff; border-bottom-right-radius: 4px;
}
.msg-line { margin: 0; }
.msg-meta { font-size: 0.66rem; color: #475569; padding: 0 3px; }

.typing-bubble { flex-direction: row !important; align-items: center; gap: 5px; padding: 13px 17px !important; }
.dot { width: 7px; height: 7px; background: #6366f1; border-radius: 50%; animation: bounce 1.2s ease-in-out infinite; }
.dot:nth-child(2) { animation-delay: .2s; }
.dot:nth-child(3) { animation-delay: .4s; }
@keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-7px);opacity:1} }

.error-banner {
  display: flex; align-items: center; gap: 9px;
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
  border-radius: 10px; padding: 11px 15px; color: #fca5a5; font-size: 0.82rem;
}

.chat-input-wrap {
  padding: 18px 28px 22px;
  border-top: 1px solid rgba(255,255,255,0.06);
  background: rgba(7,9,15,0.9); backdrop-filter: blur(12px); flex-shrink: 0;
}
.chat-input-box {
  display: flex; align-items: flex-end; gap: 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px; padding: 11px 13px;
  transition: border-color 0.2s;
}
.chat-input-box.focused { border-color: rgba(99,102,241,0.5); }
.chat-textarea {
  flex: 1; background: transparent; border: none; outline: none;
  color: #e2e8f0; font-size: 0.875rem; font-family: 'Sora', sans-serif;
  resize: none; line-height: 1.6; min-height: 24px; max-height: 140px;
}
.chat-textarea::placeholder { color: #475569; }
.chat-textarea:disabled { opacity: 0.4; }
.send-btn {
  width: 37px; height: 37px;
  background: linear-gradient(135deg, #4338ca, #6366f1);
  border: none; border-radius: 10px; color: #fff;
  font-size: 0.88rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: opacity .2s, transform .2s;
}
.send-btn:hover:not(:disabled) { transform: scale(1.07); }
.send-btn:disabled { opacity: 0.3; cursor: default; }
.input-hint { font-size: 0.69rem; color: #334155; margin-top: 7px; text-align: center; }

@media (max-width: 768px) {
  .chat-sidebar { display: none; }
  .chat-messages { padding: 14px; }
  .chat-input-wrap { padding: 12px 14px 16px; }
  .chat-topbar { padding: 12px 14px; }
}
</style>