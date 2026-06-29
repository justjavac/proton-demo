name = "justjavac/proton_demo"

version = "0.1.0"

import {
  "moonbitlang/x@0.4.43",
  "justjavac/ffi@0.2.1",
  "moonbitlang/async@0.19.0",
  "justjavac/proton_ext@0.1.7",
  "justjavac/proton@0.1.6",
}

readme = "README.md"

repository = ""

license = "MIT"

keywords = [ "webview", "webui", "gui", "web", "desktop-app" ]

description = "Standalone Proton filesystem app demo."

rule(name: "embed", command: ":embed -i $input -o $output")

options(
  source: "",
  warn_list: "",
  preferred_target: "native",
  supported_targets: "+native",
)
