---
title: 后端 - 定时调用CallAt
type:  docs
sidebar_position: 4
---


:::tip &nbsp;
## 如何启用doptime框架 :
::: 
```go   title="main.go"

package main

import (
	"github.com/doptime/doptime/api"
	"time"
	"fmt"
)

type InDemo struct {
	Text   string 
}
var ApiDemo=api.Api(func(req *InDemo) (ret InDemo, err error) {
	fmt.Println("Demo api is called with InParam:" + req.Text + " run at " + time.Now().String())
    return  req, nil
})
var DemoRpc = api.Rpc[*InDemo, string]()
func main() {
	var param = &InDemo{Text: "TestCallAt "+time.Now().String()}	
	
	callAt := api.CallAt(DemoRpc, time.Now().Add(time.Second*4))
	callAt(param)

	callAt = api.CallAt(DemoRpc, time.Now().Add(time.Second*2))
	callAt(param)
	time.Sleep(time.Second*5)
}
```


:::tip  &nbsp;
## CallAt 如何工作
::: 
### 通过CallAt 创建一个定时调用的函数。
### 像普通函数一样调用创建的函数。
> 这个调用后会立即返回。但是会在指定的时间后执行目标RPC或者是API。  
> 这个定时调用函数不受程序重启影响。    
> CallAt的入参函数是要求是 api.Rpc 或 api.Api 创建的函数。 
    
