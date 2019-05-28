import app from './config/app'
import variables from './config/variables'
import ColorCMD from './util/ColorCMD'

app.listen(variables.Api, async (): Promise<void> => {
  ColorCMD('purple', '', '[API] Rodando')
  ColorCMD('purple', '', `[API] Porta: ${variables.Api.port}`)
})
// server.timeout = 30000
