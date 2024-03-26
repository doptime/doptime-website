---
title: 后端 - http
type:  docs
sidebar_position: 5
---


:::tip 使用doptime框架 :
## 启用HTTP服务
::: 
如果你需要启用 doptime 的 http 服务。那么请在项目中通过匿名导入来启用http模块。
```go   title="main.go"

import (
	_ "github.com/doptime/doptime/httpserve"
)
// 现在，api.New定义的函数自动启用http访问。你可以通过配置进一步了解启用和禁用的方法。
```


:::info HTTP 请求的响应过程
## doptime 接受HTTP数据后的处理流程
::: 
1. 创建一个map[string]interface{} ，用来合并数据。  
2. 合并form, body (json 或者是msgpack 编码 ) 的数据 。  
3. 合并JWT 数据。  (如果有包含Jwt打头的字段)  
4. 合并Header 数据。(如果有包含Header打头的字段)  
5. 通过mapstructure将数据解析到你的输入参数中。  
6. 通过validator验证数据。
7. 调用API。 

:::info json格式 和 msgpack格式
## http 支持的数据格式
::: 
1. 支持json格式的数据。  
发情的请求header 的Content-Type 为"application/json" 时，要求body 采用 json 格式 编码.
2. 支持msgpack格式的数据。  
发情的请求header 的Content-Type 为"application/octet-stream" 时，要求body 采用 msgpack 格式 编码.
3. 默认采用msgpack编码发送的数据。


