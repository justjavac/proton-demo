name = "justjavac/proton_demo"

version = "0.1.0"

import {
  "moonbitlang/async@0.19.0",
  "justjavac/proton@0.1.6",
}

readme = "README.md"

repository = ""

license = "MIT"

keywords = [ "webview", "webui", "gui", "web", "desktop-app" ]

description = "Standalone Proton starter app demo."

rule(name: "proton_codegen", command: "proton_cli codegen $input -o $output")

options(
  source: "",
  warn_list: "",
  preferred_target: "native",
  supported_targets: "+native",
)
