name = "justjavac/proton_demo_backend"

version = "0.1.0"

import {
  "justjavac/proton_demo_shared@0.1.0",
  "justjavac/proton@0.1.13",
  "justjavac/proton_contract@0.1.0",
}

license = "MIT"

description = "Proton backend for Proton Starter."

options(
  "bin-deps": { "justjavac/proton_cli": "0.1.10" },
  warn_list: "",
  preferred_target: "native",
  supported_targets: "+native",
)
