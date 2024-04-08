---
title: 2.2 用doptime RPC加速开发api
type:  docs
sidebar_position: 20
---

### 1. 为什么传统上需要开发非CURD API。
  我们现在把一个API的功能分解为三个部分。
1. 提供上下文数据。这包括来自客户端的数据，和服务端数据库中的数据。
2. 完成API的逻辑操作，并得到结果。
3. 存储结果到数据库。
4. 返回全部或者部分数据给客户端。

### dopTime 提供3个中间件函数，用来加速非CURD API的开发

1. 使用 MixinParamEnhancer ，完成了1.1 功能，即提供上下文数据，确保RPC的入参是准确的。（比如从数据库中读取数据等）。
```go
   //func MixinParamEnhancer[i any, o any](  rpc func(InParameter i) (ret o, err error), paramEnhancer func(paramMap map[string]interface{}, param i) (out i, err error)     )  
   api.MixinParamEnhancer(doptimerpc.text2mp3, paramEnhancer)
```
   其中 rpc 是第三方  rpc 库，（如doptime）中的函数，直接使用名称就可以。
   paramEnhancer 是一个修正 param i的函数。因为RPC中的部分参数可能需要查询数据库或是计算才能得到。可以在此补足或修改 param i 并返回，以便得到可靠的RPC。
2. 使用MixinResultFinalizer， 完成 1.3，也就是 存储结果到数据库。    
```go 
//func MixinResultSaver[i any, o any](f func(InParameter i) (ret o, err error), resultSaver func(param i, ret o, paramMap map[string]interface{}) (err error))
resultFinalizer:= func(param i, ret o, paramMap map[string]interface{}) ( err error) {
    // 你可以在这里对返回值进行修正，或者存储到数据库中。
    keyText2mp3.HSet(i.TextHash,i.Data)
    return ret, nil
}
api.MixinResultSaver(doptimerpc.text2mp3, resultFinalizer)
```
3. 使用 MixinResponseModifier ，完成 1.4，也就是修改给客户端的响应数据。
   需要说明的是 修改给客户端的响应数据 通常是不需要的，因为rpc 中通常已经考虑了 json tag ,来避免返回数据中存在敏感数据的泄露。

```go 
//func MixinResponseModifier[i any, o any](f func(InParameter i) (ret o, err error), ResponseModifier func(param i, ret o, paramMap map[string]interface{}) (valueToWebclient interface{}, err error))
ResponseModifier:= func(param i, ret o, paramMap map[string]interface{}) ( valueToWebclient interface{}, err error) {
    // modify the response data here. if you need.
    return ret, nil
}
api.MixinResponseModifier(doptimerpc.text2mp3, resultFinalizer)
```
### doptime rpc 的设计原则。
doptime rpc 把rpc的逻辑实现和接口定义区别开来。这样理论上 只需要一个体积很小的接口定义库，调用百万种的函数功能。
RPC的逻辑代码，涉及不同的语言，不同的依赖，编译配置等。把它们放到一个项目实际上是不可行的。


### 如何查看有哪些第三方函数可用。
通常，你引用 doptime-rpc 包, 在vscode 中输入 rpc+你的关键，就可以看到所有的rpc函数了。

 

