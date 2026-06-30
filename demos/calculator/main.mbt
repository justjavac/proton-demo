///|
async fn main {
  let app = @proton.asset(
    "Proton Calculator",
    "demos/calculator/calculator.html",
    width=420,
    height=640,
    debug=true,
  )
  app.run_or_abort()
}
