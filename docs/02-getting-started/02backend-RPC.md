---
slug: RPC
title: 后端 - 使用RPC
type:  docs
sidebar_position: 2
---


:::tip 申明api
## **通过api.Rpc定义Rpc函数**
::: 
在上一节中，我们定义了一个api，现在我们将定义一个RPC函数来使用这个api。
要创建函数，你需要使用api.Rpc函数使用。  
```go   title="main.go"
package main

import (
	"github.com/doptime/doptime/api"
)

type InDemo struct {
	Id   string `mapstructure:"JwtId" validate:"required"`
}

//var DemoRpc = api.Rpc[*InDemo, string](options ...*api.ApiOption)
var DemoRpc = api.Rpc[*InDemo, string](...).Func
result, err := DemoRpc(&InDemo{Id:"123"})

```
- RPC 的可选参数与api的可选参数相同  
- 如果你不需要用到多体模式。则不需要使用RPC 功能。  