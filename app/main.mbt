///|
async fn main {
  let app = @proton.html(
    "Proton Starter",
    resource,
    width=960,
    height=640,
    debug=true,
  )
  app.run_or_abort()
}
