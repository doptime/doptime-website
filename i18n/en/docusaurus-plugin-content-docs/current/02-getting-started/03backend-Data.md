---
slug: Data
title: 后端 - 使用Data
type:  docs
sidebar_position: 3
---

:::tip dopTime的数据对象
## doptime可仅作为数据库框架使用。
::: 
 你可以独立地使用doptime的数据操作功能。就像它只是一个数据库操作框架（如同GORM那样）。

:::tip 使用doptime定义数据对象:
## **定义doptime的数据对象**
::: 
### 使用data.New\[keyType,valueType\](...)
```go   title="main.go"
package main

import (
 "github.com/doptime/doptime/data"
)

type Demo struct {    
    Foo   string `msgpack:"alias:foo"`
    Name  string `msgpack:"alias:name"`
}
// 如果你需要自定义主键名称，或redis datasource, 请参看可选参数
var keyDemo = data.New[string,*Demo]()
keyDemo.HSet("q", &Demo{Foo:"bar"})
if _demo, err := keyDemo.HGet("q"); err == nil {
    fmt.Println("demo:", _demo.Foo)
}
```
在上面这个例子中，我们定义了一个data对象。它对应的是一个redis hash对象。主键名称是demo.   
我们在其中添加一个field 为 "q" ,value 为Demo\{Foo:"bar"\}的数据。


:::tip data.New的可选参数
## **通过data.New的可选参数**   
:::
可以使用data.Option的 WithRds 来指定data对象的数据源  
可以使用data.Option的 WithKey 来指定data对象的主键名称  
或是同时组合使用它们: data.Option.WithRds("myRds").WithKey("myKeyName")
```go   title="main.go"
//define api with input/output data structure
var keyDemo =data.New[string,*Demo](data.Option.WithRds("dragonflydb").WithKey("myKeyName"))
```
通过这样的配置，这个data可以连接到其它的redis datasource.   
可以通过这样的方式来创建迁移数据的新源。比如从内存数据库dragonflydb 迁移到内存缓存数据库keydb。

&nbsp;
:::tip data中，如何定义数据序列化行为
## **通过msgpack定义data的序列化**   
::: 
```go   title="main.go"
type Demo struct {    
    Foo   string `msgpack:"alias:foo"`
    Name  string `msgpack:"alias:name"`
}
```
### **说明**
- doptime 使用 **msgpack**  来定义data对象的序列化方式   
- 通过msgpack 标签，你可以定义数据的序列化方式。比如不保存某些字段等。  
- [点击查看更多msgpack文档](https://msgpack.uptrace.dev/guide/#quickstart:~:text=%23-,Struct%20tags,-msgpack%20supports%20following) 。  
