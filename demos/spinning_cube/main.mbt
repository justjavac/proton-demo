///|
async fn main {
  let app = @proton.asset(
    "Proton Spinning Cube",
    "demos/spinning_cube/spinning_cube.html",
    width=960,
    height=640,
    debug=true,
  )
  app.run_or_abort()
}
