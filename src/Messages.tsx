import classNames from 'classnames'
import { memo, useEffect, useMemo, useRef } from 'react'
import { Skeleton } from '@mui/material'
import * as marked from 'marked'
import { blue, green } from '@mui/material/colors'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

type Role = 'user' | 'assistant'

export interface MessageItem {
  role: Role
  content: string
  uuid: string
}

interface Props {
  messages: MessageItem[]
  chating: boolean
}

function toFirstUpperCase(val: string) {
  return `${val[0].toUpperCase()}${val.slice(1)}`
}

function renderRole(val: string) {
  if (val === 'user') {
    return (
      <>
        {toFirstUpperCase(val)}
        <AccountCircleIcon />
      </>
    )
  }

  return (
    <>
      <SmartToyIcon />
      {toFirstUpperCase(val)}
    </>
  )
}

const Message = memo(({ role, content, loading }: { role: Role, content: string, loading: boolean }) => {
  const body = useMemo(() => {
    if (loading && content.length === 0)
      return <Skeleton animation="wave" className="w-24" />

    return (
      <div dangerouslySetInnerHTML={{ __html: marked.parse(content) }} className="markdown-body">
      </div>
    )
  }, [content, loading])

  return (
    <div className={classNames('flex flex-col w-full', { 'items-end': role === 'user', 'items-start': role === 'assistant' })}>
      <div className="flex items-center gap-2">{renderRole(role)}</div>
      <div
        className={classNames('p-6 rounded-xl shadow w-auto max-w-full', { [`justify-end`]: role === 'user' })}
        style={{
          backgroundColor: role === 'user' ? blue[600] : green[600],
        }}
      >
        {body}
      </div>
    </div>
  )
})

export default function Messages(
  { messages, chating }: Props,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scroll(0, containerRef.current.scrollHeight)
    }
  }, [messages])

  return (
    <div className="w-full overflow-y-auto h-full pt-10 pb-20 " ref={containerRef}>
      <div className="flex flex-col gap-8 p-8 mx-auto w-full min-h-full md:max-w-[768px]">
        {messages.length === 0
          ? <div className="flex-1 flex items-center justify-center text-2xl font-bold text-stone-400">Let's start interacting with Chatbot.</div>
          : messages.map((msg, idx) => <Message role={msg.role} content={msg.content} key={msg.uuid} loading={idx === messages.length - 1 && chating} />)}
      </div>
    </div>
  )
}
