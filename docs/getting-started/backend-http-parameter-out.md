---
title: 后端 - http - 出参
type:  docs
sidebar_position: 7
---

:::tip 出参与错误处理
## doptime 如何处理HTTP请求的出参和错误
::: 
如果需要JWT相关的错误。就会返回401错误。
其它的错误，会返回500错误。
如果没有错误。则返回200。 同时任意的返回值都会被转化为json格式返回。



