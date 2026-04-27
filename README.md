[README_VERCEL.md](https://github.com/user-attachments/files/27120357/README_VERCEL.md)
# futurescan89757.github.io# Pathwise Vercel 部署说明

这个版本适合部署到 Vercel。网页仍然是静态页面，右下角 AI 对话框通过 Vercel Serverless Function 调用硅基流动。

## 文件结构要求

上传到 GitHub 仓库时，仓库最外层必须直接看到：

```text
index.html
stage-01.html
stage-02.html
...
stage-10.html
styles.css
app.js
chat-widget.js
holland-data.js
vercel.json
api/
assets/
```

不要把这些文件放在一个总文件夹里面。`api/` 和 `assets/` 两个文件夹必须保留。

## 部署步骤

1. 打开 Vercel。
2. 选择 `Add New Project`。
3. 连接 GitHub，并选择你的项目仓库。
4. Framework Preset 选择 `Other`。
5. Build and Output Settings 保持默认即可：

```text
Build Command: 留空
Output Directory: 留空
Install Command: 留空或默认
```

6. 在 Environment Variables 添加：

```text
SILICONFLOW_API_KEY=你的硅基流动密钥
SILICONFLOW_MODEL=Qwen/Qwen2.5-7B-Instruct
SILICONFLOW_API_URL=https://api.siliconflow.cn/v1/chat/completions
```

7. 点击 Deploy。

部署完成后，Vercel 会生成类似这样的地址：

```text
https://你的项目名.vercel.app
```

## 更新环境变量后

如果你部署后才添加或修改环境变量，需要重新部署一次：

```text
Project → Deployments → 选择最新部署右侧菜单 → Redeploy
```

## 重要提醒

不要把真实硅基流动密钥写进 GitHub、网页文件或压缩包。密钥只放在 Vercel 的 Environment Variables 里。
