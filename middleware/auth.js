export default function({ store, redirect, route }) {
  if (!store.state.auth.user) {
    redirect(`/login?to=${btoa(route.path)}`)
  }
}
