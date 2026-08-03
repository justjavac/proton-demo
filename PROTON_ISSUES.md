# Proton issues

当前 CI 的强制门禁是三端 `moon check --target js,native --diagnostic-limit 80`（仓库已重构为 moon workspace：`shared/` + `frontend/` + `backend/` + `demos/`）。完整 native build 和 `proton_cli cef setup` 已放进 CI 诊断步骤，失败时保留日志但不阻塞门禁。

## 版本验证记录（2026-07-30，proton 0.1.13 / proton_cli 0.1.11）

在旧单模块布局上，`moon check --target native` 对 proton 0.1.7 → 0.1.13 全部通过，覆盖当时的 `app/`、`demos/todolist`、`demos/calculator`、`demos/spinning_cube` 和 `extensions/async_add`。

2026-08-03 合并 `demos-by-version` 分支后：`app/` 与 `extensions/async_add` 由 proton_cli 0.1.10+ 重新生成的 workspace 布局取代（contract 命令见 `shared/todo_contract.mbt` 与 `backend/todo/`），三个 demo 移入独立的 `justjavac/proton_demo_demos` 模块（`demos/`），仍走 `@proton.asset` 纯前端窗口。

### proton_cli ≥ 0.1.10：扩展命令迁移到 contract

旧写法 `#proton.command(name="slowAdd")` 已被拒绝（`only the contract argument is supported`），且 0.1.13 移除了 `@proton_extension.from_command_spec`、`AppCommandExtensionSpec::new` 和 `context.op_async_result`。扩展已迁移到新 contract 体系：

- `moon.ext` 经 `proton_cli codegen --extension-identity` 生成 `extension_identity.g.mbt`（`generated_extension_contract`）。
- 命令用 `@proton_contract.Command[Req, Resp]` 声明，`#proton.command(contract=...)` 绑定处理器。
- 注册改为 `@proton_extension.typed(...)` + `CommandRegistrar::bind`。

### Windows 构建诊断

- `moon build backend/app --target native` 现在停在 proton 的 prebuild 脚本：需要 PATH 里有 `node`（`native_link_config.mjs`）。干净环境下是否仍有 `.mooncakes/justjavac/native/dist` 链接产物问题，待装好 node 后复测。
- workspace 布局引入的 `bin-deps` 版 proton_cli（backend/moon.mod）在 Windows 上导致 `moon check --target native` 失败：moon 把 bin-dep 编译成 `_build/__moonbin__/.artifacts/proton_cli/proton_cli.exe`， shim 只生成 `__moonbin__/proton_cli.ps1`，但规则命令按 `$mooncake_bin/proton_cli` 原样执行，没有这个文件 → `The system cannot find the file specified (os error 2)`。Unix 上 shim 是无扩展名可执行脚本所以正常。这是 moon（0.1.20260724）Windows bin-deps 的缺陷。已改为使用全局安装的 proton_cli（规则命令 `proton_cli codegen ...`，CI 本就先装 CLI），改后 Windows 本地 `moon check --target js,native` 全量通过。
- `proton_cli cef setup` 在 proton_cli 0.1.11 上不再报 `Copy-Item` 空参数错误，会正常开始下载 CEF；但 CEF 压缩包约 151 MB，托管在 spotifycdn，受限网络下可能中断（curl 56），重试即可。

## 历史阻塞（已过时，保留存档）

在干净环境中，`moon build app --target native` 曾因为缺少 `native/dist` 链接产物失败：

```text
LINK : fatal error LNK1104: cannot open file '.mooncakes\justjavac\native\dist\lib\proton.lib'
ld: library 'proton' not found
/usr/bin/ld: cannot find -lproton
```

Windows 上，`proton_cli cef setup` 曾失败：

```text
Copy-Item : Cannot bind argument to parameter 'LiteralPath' because it is null.
error: Failed to copy ...\.bazelrc ... Copy-Item exited with code 1
```

## 已验证

```sh
moon update
moon check --target js,native --diagnostic-limit 80
```

三端 CI 都应通过上述检查。等 `justjavac/proton` 发布的包在干净环境中包含可链接的 native 产物后，再把 CI 中的 `Build diagnostic` 改成强制步骤。
