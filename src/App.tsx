import { useEffect, useState } from 'react'
import { AppBar, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Prompt from './Prompt'
import TokenProvider from './TokenProvider'
import OpenRouterService from './service'
import type { MessageItem } from './Messages'
import Messages from './Messages'

export default function App() {
  const [service] = useState(() => new OpenRouterService())
  const [chating, setChating] = useState(false)
  const [messages, setMessages] = useState<MessageItem[]>([])

  useEffect(() => {
    const unsubscribe = service.chatSubscribe((uuid, content) => {
      setMessages((msgs) => {
        const msg = msgs.find(item => item.uuid === uuid)
        if (msg) {
          msg.content = content
          return [...msgs]
        }

        return msgs
      })
    })

    return () => {
      unsubscribe()
    }
  }, [])

  function onSend(content: string) {
    const uuid = crypto.randomUUID()
    const responseUuid = crypto.randomUUID()

    setChating(true)
    setMessages([...messages, { role: 'user', content, uuid }, { role: 'assistant', content: '', uuid: responseUuid }])

    service.chat(responseUuid, content).finally(() => {
      setChating(false)
    })
  }

  function onClear() {
    setMessages([])
    service.clearMessages()
  }

  return (
    <main className="w-screen h-screen relative">
      <div className="h-screen">
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Chatbot
            </Typography>

            <Tooltip title="clear records" onClick={onClear}>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Messages chating={chating} messages={messages} />
        <Prompt chating={chating} onSend={onSend} />
      </div>
      <TokenProvider
        token={service.token}
        storageToken={(token) => {
          service.updateToken(token)
        }}
      />

    </main>
  )
}
