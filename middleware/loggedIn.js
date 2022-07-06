export default function ({ store, redirect }) {
  if (store.state.user.isLoggedIn) {
    return redirect("/home");
  }
}
