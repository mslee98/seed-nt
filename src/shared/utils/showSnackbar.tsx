import { createElement } from 'react'
import { Snackbar, type useSnackbarAdapter } from 'seed-design/ui/snackbar'

type SnackbarAdapter = ReturnType<typeof useSnackbarAdapter>

export function showSnackbar(
  adapter: SnackbarAdapter,
  message: string,
  variant: 'positive' | 'critical' | 'default' = 'positive',
) {
  adapter.create({
    render: () => createElement(Snackbar, { variant, message }),
  })
}
