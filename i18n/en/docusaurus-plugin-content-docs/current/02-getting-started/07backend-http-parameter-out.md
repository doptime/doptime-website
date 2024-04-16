---
slug: http-parameter-out
title: 后端 - http - 出参
type:  docs
sidebar_position: 7
---

:::tip 出参与错误处理
## doptime 如何处理HTTP请求的出参和错误
::: 
api 包括两个返回参数，一个是任意类型的返回值，一个是错误。
```go   title="main.go"
//define api with input/output data structure
ApiDemo:=api.Api(func(req *InMyStruct) (ret interface{}, err error) {
 ..
}).Func
```
### http status code
- 如果存在JWT相关的错误。就会返回401错误  
- 其它的错误，会返回500错误。  
- 如果没有错误。则返回200。 
### 返回值的处理
- 同时任意的返回值如果是string 或者是byte[],则直接返相应的数据。
- 其它类型会被转化为json格式返回。



