# DSH Plugin Market Index

DeepSeek Harness（DSH）插件市场索引。托管 `session-highlight` 插件的市场元数据。

## 内容

- [`index.json`](index.json) — 插件市场索引（DSH `plugin-market` 服务读取）
- [`icons/`](icons/) — 插件图标

## 在 DSH 中使用

1. 打开 DSH Web GUI 的「发现 / Discover」页。
2. 在设置中添加本索引地址（`plugin-market` 服务的 `indexes` 字段）：

   ```
   https://zknyy.github.io/dsh-plugin-market/index.json
   ```

3. 即可在「发现」页看到「会话高亮」插件并一键安装 `@zknyy/session-highlight@1.0.0`。

## 插件

| 插件 | 名称 | 版本 | 引擎要求 |
| --- | --- | --- | --- |
| `@zknyy/session-highlight` | 会话高亮 / Session highlight | 1.0.0 | `dsh >=0.2.0-rc.2 <0.3.0` |
