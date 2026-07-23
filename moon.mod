name = "justjavac/proton_demo"

version = "0.1.0"

import {
  "moonbitlang/async@0.20.3",
  "justjavac/proton@0.1.12",
}

readme = "README.mbt.md"

repository = ""

license = "MIT"

keywords = [ "proton", "gui", "web", "desktop-app" ]

description = "A Proton desktop app."

options(
  warn_list: "",
  preferred_target: "native",
  supported_targets: "+native",
)
