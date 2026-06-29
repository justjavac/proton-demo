# Proton Starter

一个最小 Proton 桌面应用示例。示例使用 `justjavac/proton` 加载内嵌 HTML，不依赖本地
`moonbit-webview` 仓库，也不使用额外 native 扩展。

## 要求

- Windows、macOS 或 Linux
- MoonBit
- PowerShell、sh 或 bash

## 当前版本

- `justjavac/proton@0.1.6`
- `proton_cli@0.1.4`

## 运行本示例

Windows PowerShell：

```powershell
moon update
moon install justjavac/proton_cli --bin target/proton-tools
target\proton-tools\proton_cli.exe cef setup

moon check --target native
moon build app --target native

$root = (Get-Location).Path
$runtime = Get-Content .proton\runtime.json | ConvertFrom-Json
$runtimeBin = Join-Path $root (Join-Path $runtime.dist "bin")
$env:PATH = "$runtimeBin$([IO.Path]::PathSeparator)$env:PATH"
.\_build\native\debug\build\app\app.exe
```

macOS / Linux：

```sh
moon update
moon install justjavac/proton_cli --bin target/proton-tools
./target/proton-tools/proton_cli cef setup

moon check --target native
moon build app --target native

runtime_bin="$(find .proton/runtimes -type d -name bin -print -quit)"
export PATH="$(pwd)/$runtime_bin:$PATH"
./_build/native/debug/build/app/app
```

## 从零创建

新建项目并添加依赖：

```sh
moon new my_proton_app
cd my_proton_app
moon add moonbitlang/async
moon add justjavac/proton
mkdir app
```

在 `moon.mod` 中添加 embed 规则，并使用 native target：

```moonbit
rule(name: "embed", command: ":embed -i $input -o $output")

options(
  preferred_target: "native",
  supported_targets: "+native",
)
```

创建 `app/moon.pkg`：

```moonbit
import {
  "moonbitlang/async",
  "justjavac/proton",
}

supported_targets = "native"

dev_build(rule: "embed", input: "app.html", output: "app.mbt")

options(
  formatter: { "ignore": [ "app.mbt" ] },
  "is-main": true,
  targets: { "main.mbt": [ "native" ] },
)
```

创建 `app/main.mbt`：

```moonbit
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
```

创建 `app/app.html`，写普通 HTML、CSS 和 JavaScript。构建时会生成 `app/app.mbt`：

```sh
moon build app --target native
```

准备 runtime 后，按上面的对应平台命令把 runtime `bin` 加入 `PATH`，再启动生成的可执行文件。

建议添加 `.gitignore`：

```gitignore
_build/
.mooncakes/
.mooncakes.lock
.proton/
target/
```

## 清理

PowerShell：

```powershell
moon clean
Remove-Item -Recurse -Force .proton, .mooncakes, target
```

sh / bash：

```sh
moon clean
rm -rf .proton .mooncakes target
```

## 不提交

这些目录和文件可以重新生成：

- `.proton/`
- `.mooncakes/`
- `_build/`
- `target/`

## License

MIT. See [LICENSE](LICENSE).
