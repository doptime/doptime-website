---
slug: Http
title: 后端 - http
type:  docs
sidebar_position: 5
---


:::tip 使用doptime框架 :
## 启用HTTP服务
::: 
如果你需要启用 doptime 的 http 服务。那么请在项目中通过匿名导入doptime/httpserve 模块来启用http模块。
```go   title="main.go"

import (
	_ "github.com/doptime/doptime/httpserve"
)
// 现在，api.Api定义的函数自动启用http访问。你可以通过配置进一步了解启用和禁用的方法。
```


:::tip HTTP 请求的响应过程
## doptime 接受HTTP数据后的响应流程
::: 
1. 合并 form +  json body + msgpack body  成为一个大的 map[string]interface\{\} 
2. 继续合并 JWT 数据 + Header 数据(如果有包含Header打头的字段) 到该map中。  
3. 如果有 HookParamEnhancer，调用它，进一步补充、计算参数。
4. 通过validator验证数据。
5. 调用API。 
6. 如果有 HookResultSaver，调用它，把结构存储到redis数据库中
7. 如果有 HookResponseModifier，调用它，进一步修改给客户端的返回值。

:::tip http请求的 json格式 和 msgpack格式
## http请求的Content-Type
::: 
1. 支持json格式的数据。  
发情的请求header 的Content-Type 为"application/json" 时，要求body 采用 json 格式 编码.
2. 支持msgpack格式的数据。  
发情的请求header 的Content-Type 为"application/octet-stream" 时，要求body 采用 msgpack 格式 编码.
3. 默认采用msgpack编码发送的数据。


