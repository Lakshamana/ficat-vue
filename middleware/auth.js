export default function({ store, redirect, route }) {
  const auth = store.state.auth
  if (!auth.user || !auth.xsrfToken) {
    redirect(`/login?to=${btoa(route.path)}`)
  }
}
