---
slug: CallAt
title: 后端 - 定时调用CallAt
type:  docs
sidebar_position: 4
---


## 在未来的某个时间，定时运行你的代码
doptime 提供了一个定时调用函数，来实现在未来的某个时间运行你的代码。  
1. 你需要先定义一个api, 或者是rpc函数。  
2. 然后通过CallAt来创建对该函数的定时调用函数。  
3. 像普通函数一样调用创建的函数。
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
//create Api before callAt this api
var ApiDemo=api.Api(func(req *InDemo) (ret InDemo, err error) {
	fmt.Println("Demo api is called with InParam:" + req.Text + " run at " + time.Now().String())
    return  req, nil
})
//create Rpc before callAt this rpc
var DemoRpc = api.Rpc[*InDemo, string]()
func main() {
	var param = &InDemo{Text: "TestCallAt "+time.Now().String()}	
	
	callAt := api.CallAt(ApiDemo, time.Now().Add(time.Second*4))
	callAt(param)

	callAt = api.CallAt(DemoRpc, time.Now().Add(time.Second*2))
	callAt(param)
	//wait for the callAt to finish
	time.Sleep(time.Second*5)
}
```


## CallAt 补充说明
- CallAt的入参函数是要求是 api.Rpc 或 api.Api 创建的函数。 
- 这个调用后会立即返回。但是会在指定的时间后执行目标RPC或者是API。  
- 这个定时调用函数不受程序重启影响。    
    
