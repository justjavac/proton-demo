# Proton Starter

一个最小 Proton 桌面应用示例。

## 设置

```bash
moon update
moon install justjavac/proton_cli
moon check --target native
proton_cli cef setup
```

## 运行本示例

Windows PowerShell：

```powershell
$root = (Get-Location).Path
$runtime = Get-Content .proton\runtime.json | ConvertFrom-Json
$runtimeBin = Join-Path $root (Join-Path $runtime.dist "bin")
$env:PATH = "$runtimeBin$([IO.Path]::PathSeparator)$env:PATH"
moon run app --target native
```

macOS / Linux：

```sh
runtime_bin="$(find .proton/runtimes -type d -name bin -print -quit)"
export PATH="$(pwd)/$runtime_bin:$PATH"
moon run app --target native
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

在 `moon.mod` 中使用 native target：

```moonbit
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

options(
  "is-main": true,
  targets: { "main.mbt": [ "native" ] },
)
```

创建 `app/main.mbt`：

```moonbit
///|
async fn main {
  let app = @proton.asset(
    "Proton Starter",
    "app/app.html",
    width=960,
    height=640,
    debug=true,
  )
  app.run_or_abort()
}
```

创建 `app/app.html`、`app/app.css` 和 `app/app.js`，HTML 中用相对路径引用 CSS 和 JS。

## License

MIT. See [LICENSE](LICENSE).
