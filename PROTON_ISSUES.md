# Proton issues

当前 CI 的强制门禁是三端 `moon check --target native`。完整 native build 和 `proton_cli cef setup` 已放进 CI 诊断步骤，失败时保留日志但不阻塞门禁。

## 当前阻塞

在干净环境中，`moon build app --target native` 会因为缺少 `native/dist` 链接产物失败：

```text
LINK : fatal error LNK1104: cannot open file '.mooncakes\justjavac\native\dist\lib\proton.lib'
ld: library 'proton' not found
/usr/bin/ld: cannot find -lproton
```

CI 中可以看到 `.mooncakes/justjavac/proton/prebuilt/<rid>` 存在，但当前 native link 仍查找 `.mooncakes/justjavac/native/dist`。

Linux/macOS 上，`proton_cli cef setup` 可以装配 `.proton/runtimes/...`，但它没有为 MoonBit native link 准备 `.mooncakes/justjavac/native/dist`，也不能消除上面的链接错误。

Windows 上，`proton_cli cef setup` 仍会失败：

```text
Copy-Item : Cannot bind argument to parameter 'LiteralPath' because it is null.
error: Failed to copy ...\.bazelrc ... Copy-Item exited with code 1
```

## 已验证

```sh
moon update
moon check --target native
```

三端 CI 都应通过上述检查。等 `justjavac/proton` 发布的包在干净环境中包含可链接的 native 产物后，再把 CI 中的 `Build diagnostic` 改成强制步骤。
