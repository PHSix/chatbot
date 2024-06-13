import { TextField } from '@mui/material'
import { useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'

export default function Prompt({ onSend, chating }: { onSend: (value: string) => void, chating: boolean }) {
  const [input, setInput] = useState('')

  function submit() {
    onSend(input)
    setInput('')
  }

  return (
    <div className="absolute bottom-0 left-[50%] z-10 w-full px-4 md:px-0 md:max-w-[768px] translate-x-[-50%] flex gap-2 py-4 bg-white">
      <TextField
        className="flex-1"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Please put your question in here."
        onKeyDown={(e) => {
          if (e.key.toUpperCase() === 'ENTER') {
            submit()
          }
        }}
      />
      <LoadingButton
        variant="contained"
        disabled={input.length === 0}
        onClick={submit}
        loading={chating}
      >
        SEND
      </LoadingButton>
    </div>
  )
}
