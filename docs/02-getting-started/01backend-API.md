---
slug: API
title: 后端 - 使用API
type:  docs
sidebar_position: 1
---


:::tip 申明api
## **通过api.Api定义doptime函数**
::: 
 api.Api(...) 要求传入一个函数，这个传入函数的入参是一个结构体指针；出参有两个：1） 任意的数据类型 2）error。  
  api.Api(...).Func 会返回一个函数，这个函数就是你定义的传入函数。
```go   title="/api/api.go"
package api

//api.Api定义如下:
func Api[i any, o any](
	f func(InParameter i) (ret o, err error),
	options ...*ApiOption,
) (out *Context[i, o]) {
    ...
}
```
这是定义api.Api的例子：
```go   title="main.go"
package main

import (
	"github.com/doptime/doptime/api"
)

type InDemo struct {
	Id   string `mapstructure:"JwtId"`
}

var keyDemo = data.New[string,*Demo]()
//define api with input/output data structure
ApiDemo:=api.Api(func(req *InDemo) (ret string, err error) {
    keyInDemo.HSET(req.Id, req)
    return `{data:"ok"}`, nil
}).Func

```
### api命名规则
1. 默认的api名称是 "api:" + Struct类型名称。且类型名首字母会改写为小写.  
2. [struct 名称会移除常见的前缀和后缀。  ](https://github.com/doptime/doptime/blob/master/specification/serviceNames.go#L55)  
   **移除前缀： "api:", "input", "in", "req", "arg", "param", "src", "data"**  
   **移除后缀： "input", "in", "req", "arg", "param", "src", "data"**  
	
举例来说，上述例子中，ApiDemo的api名称是 "api:demo"。它对入参InDemo附加了一个前缀"api:"，移除了"InDemo" 中的"In"，并且首字母小写。
### api 的调用方式
1. 作为普通的函数调用
2. 通过http调用（通过doptime-client,在web客户端调用）
3. 通过RPC调用
4. 通过RPCOverHttp调用(在服务端)

### API被RPC调用出现异常的诊断：
1. 在redis中，查看 rpc调用传参
- 当发起RPC调用后，可以在redis下 api名称（如api:demo）的主键下，看到传参列表
- 注意：如果是本地参数调用，不会有传输参数。
2. 使用 httpserve.Debug() ,在源码中的 httpStart()函数下断点。查看传参处理过程。

&nbsp;
:::tip api.Api的可选参数
## **通过api.Api的可选参数定义api**   
::: 
### api.Option.WithSourceRds(...)    
比如在微服务的拆分隔离中，通过配置选项，你可以指定其它的redis datasource 作为参数交换网关
```go   title="main.go"
...
//define api with input/output data structure
ApiDemo:=api.Api(func(req *InDemo) (ret string, err error) {
    keyInDemo.HSET(req.Id, req)
    return `{data:"ok"}`, nil
},api.Option.WithSourceRds("ServiceQ")).Func
```
上面的例子中。api.Option.WithSourceRds("ServiceQ") 是可选参数,用来指定redis服务器中转函数调用。    

