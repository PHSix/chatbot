import mitt from 'mitt'
import OpenAI from 'openai'
import retry from './utils/retry'

const tokenKey = 'OPENROUTER_TOKEN'

export default class OpenRouterService {
  private _token: string
  private _messages: OpenAI.ChatCompletionMessageParam[] = []
  private _ai?: OpenAI
  private _emitter = mitt<{
    chat: [string, string]
  }>()

  get ai(): OpenAI {
    if (!this._ai) {
      this._ai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: this._token,
        dangerouslyAllowBrowser: true,
      })
    }

    return this._ai
  }

  get token() {
    return this._token
  }

  constructor() {
    this._token = localStorage.getItem(tokenKey) || ''
  }

  updateToken(token: string) {
    localStorage.setItem(tokenKey, token)
    this._token = token
  }

  async chat(uuid: string, content: string) {
    const stream = await retry(() => this.ai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [...this._messages, {
        role: 'user',
        content,
      }],
      stream: true,
    }), 3)

    let result = ''

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      result += content
      this._emitter.emit('chat', [uuid, result])
    }

    this._messages.push({ role: 'user', content }, { role: 'assistant', content: result })
  }

  clearMessages() {
    this._messages = []
  }

  chatSubscribe(callback: (uuid: string, content: string) => void) {
    const listener = ([uuid, content]: [string, string]) => {
      callback(uuid, content)
    }
    this._emitter.on('chat', listener)

    return () => {
      this._emitter.off('chat', listener)
    }
  }
}
