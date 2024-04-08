---
title: 后端 - 使用Data
type:  docs
sidebar_position: 3
---

:::tip dopTime的数据对象
### doptime可仅作为数据库框架使用。
::: 
- 你可以独立地使用doptime的数据操作功能。而不必考虑任何其它部分。  
- 这种情况下，它就如同GORM那样，只是一个数据库操作框架。

:::tip 使用doptime定义数据对象:
### 通过**申明和使用doptime的数据对象**
::: 
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



&nbsp;
:::tip data.New的可选参数
## **通过data.New的可选参数定义data**   
:::
```go   title="main.go"
...
//define api with input/output data structure
var keyDemo =data.New[string,*Demo](data.Option.WithDataSource("myRedisDataDource").WithKey("myDataName"))
```
上面的例子中。data.Option.WithDataSource("myRedisDataDource").WithKey("myDataName") 是可选参数。  
您可以使用单个或组合使用多个选项来定义data。  
通过这样的配置，这个data可以连接到其它的redis datasource. 你可以通过这样的方式来迁移数据。比如从内存数据库dragonflydb 迁移到内存缓存数据库keydb。

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
- doptime 使用 **msgpack**  来定义data对象的序列化方式 **[[查看msgpack文档]](https://msgpack.uptrace.dev/guide/#quickstart:~:text=%23-,Struct%20tags,-msgpack%20supports%20following)** 。  
