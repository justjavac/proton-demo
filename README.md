# Proton FS Demo

独立运行的 Proton `19_app_fs` 示例。使用 registry 上发布的 `justjavac/proton` 和
`justjavac/proton_ext`，不依赖本地 `moonbit-webview` 仓库。

## 要求

- Windows
- MoonBit
- PowerShell

已验证版本：

```text
moon 0.1.20260618
```

## 依赖

见 `moon.mod`：

```moonbit
import {
  "moonbitlang/x@0.4.43",
  "justjavac/ffi@0.2.1",
  "moonbitlang/async@0.19.0",
  "justjavac/proton_ext@0.1.6",
  "justjavac/proton@0.1.5",
}
```

## 运行

在仓库根目录执行下面的命令。流程是：更新依赖索引、安装 Proton CLI、下载 CEF、构建
CEF 子进程、构建并启动示例。

```powershell
moon update
moon install justjavac/proton_cli --bin target/proton-tools
target\proton-tools\proton_cli.exe cef setup
moon check --target native

$root = (Get-Location).Path
$env:PROTON_CEF_ROOT = Join-Path $root ".cef-cache"
moon -C .mooncakes\justjavac\proton build cef_process --target native

$env:PROTON_CEF_SUBPROCESS_PATH = Join-Path $root ".mooncakes\justjavac\proton\_build\native\debug\build\cef_process\cef_process.exe"
moon clean
moon build 19_app_fs --target native

$cefRelease = Join-Path $root ".cef-cache\Release"
$env:PATH = "$cefRelease;$env:PATH"
.\_build\native\debug\build\19_app_fs\19_app_fs.exe
```

## 单独命令

安装 Proton CLI。后续用它下载 CEF：

```powershell
moon install justjavac/proton_cli --bin target/proton-tools
```

下载当前项目需要的 CEF runtime：

```powershell
target\proton-tools\proton_cli.exe cef setup
```

构建 Proton 使用的 CEF 子进程：

```powershell
$root = (Get-Location).Path
$env:PROTON_CEF_ROOT = Join-Path $root ".cef-cache"
moon -C .mooncakes\justjavac\proton build cef_process --target native
```

构建 `19_app_fs` 示例：

```powershell
$root = (Get-Location).Path
$env:PROTON_CEF_ROOT = Join-Path $root ".cef-cache"
$env:PROTON_CEF_SUBPROCESS_PATH = Join-Path $root ".mooncakes\justjavac\proton\_build\native\debug\build\cef_process\cef_process.exe"
moon build 19_app_fs --target native
```

运行前把 CEF DLL 目录加入当前会话的 `PATH`：

```powershell
$root = (Get-Location).Path
$cefRelease = Join-Path $root ".cef-cache\Release"
$env:PATH = "$cefRelease;$env:PATH"
.\_build\native\debug\build\19_app_fs\19_app_fs.exe
```

## 清理

删除本机生成的构建产物和运行时缓存：

```powershell
moon clean
Remove-Item -Recurse -Force .cef-cache, .mooncakes, target
```

## 不提交的目录

这些目录都可以重新生成，不需要提交：

- `.cef-cache/`
- `.mooncakes/`
- `_build/`
- `target/`

## License

MIT. See [LICENSE](LICENSE).


