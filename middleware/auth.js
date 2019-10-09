// import { encode } from '@/shared/frontUtils'

export default function({ store, redirect, route }) {
  if (!store.state.auth.user) {
    // console.log(route.path, atob(btoa(route.path)))
    redirect(`/login?to=${btoa(route.path)}`)
  }
}
