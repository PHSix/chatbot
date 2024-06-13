import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, colors } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useEffect, useState } from 'react'

interface Props {
  storageToken: (val: string) => void
  token: string
}

export default function TokenProvider({
  storageToken,
  token: propsToken,
}: Props) {
  const [token, setToken] = useState(propsToken)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (token.length === 0) {
      setDialogOpen(true)
    }
  }, [])

  function onSubmit() {
    storageToken(token)
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>Please input your token.</DialogTitle>

      <DialogContent className="flex flex-col gap-3">
        <TextField value={token} onChange={e => setToken(e.target.value)} placeholder="API TOKEN" fullWidth variant="outlined" />
        <div style={{ color: colors.grey[500] }}>
          {'tips: You can generate token in '}
          <a href="https://openrouter.ai/" style={{ color: blue[700] }}>openrouter</a>
        </div>
      </DialogContent>
      <DialogActions>
        <Button type="submit" onClick={onSubmit} variant="contained" disabled={token.length === 0}>submit</Button>
      </DialogActions>
    </Dialog>
  )
}
