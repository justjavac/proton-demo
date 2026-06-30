///|
async fn main {
  let app = @proton.asset(
    "Proton Todo List",
    "demos/todolist/todolist.html",
    width=960,
    height=640,
    debug=true,
  )
  app.run_or_abort()
}
