# Proton FS Demo

独立运行的 Proton `19_app_fs` 示例。依赖 registry 上发布的包，不使用本地
`moonbit-webview` 仓库。

## 要求

- Windows
- MoonBit
- PowerShell

## 版本

- `justjavac/proton@0.1.6`
- `justjavac/proton_ext@0.1.7`
- `proton_cli@0.1.4`

## 运行

在仓库根目录执行：

```powershell
moon update
moon add --upgrade justjavac/proton_ext
moon add --upgrade justjavac/proton
moon install justjavac/proton_cli --bin target/proton-tools
target\proton-tools\proton_cli.exe cef setup

moon check --target native
moon clean
moon build 19_app_fs --target native

$root = (Get-Location).Path
$runtime = Get-Content .proton\runtime.json | ConvertFrom-Json
$runtimeBin = Join-Path $root (Join-Path $runtime.dist "bin")
$env:PATH = "$runtimeBin;$env:PATH"
.\_build\native\debug\build\19_app_fs\19_app_fs.exe
```

## 清理

```powershell
moon clean
Remove-Item -Recurse -Force .proton, .cef-cache, .mooncakes, target
```

## 不提交

这些目录和文件可以重新生成：

- `.proton/`
- `.cef-cache/`
- `.mooncakes/`
- `_build/`
- `target/`

## License

MIT. See [LICENSE](LICENSE).
