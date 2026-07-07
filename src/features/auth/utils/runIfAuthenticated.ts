import { isAuthenticated } from '../stores/authSession.store'

export function runIfAuthenticated(
  action: () => void,
  onUnauthenticated: () => void,
) {
  if (isAuthenticated()) {
    action()
    return
  }
  onUnauthenticated()
}
