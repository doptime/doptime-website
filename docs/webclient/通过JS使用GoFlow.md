---
title: 通过JS使用doptime
type:  docs
weight: 2
---

:::info
### 通过JS使用doptime示例
:::
所有[可用的方法定定义](https://github.com/doptime/saavuu/blob/master/3rd_lang/Api.tsx)
1. **加载用户头像**
   
``` go
package main

import (
 "github.com/doptime/doptime/api"
)

type Demo struct {
    Foo   string
}
var keyDemo = data.NewStruct[string,*Demo]()
_demo, _ := keyDemo.Get("KQYang")

```


2. **申明和使用doptime的函数**
``` go
package main

import (
	"github.com/doptime/doptime/api"
)

type InDemo struct {
	Id   string `msgpack:"alias:JwtId" validate:"required"`
}

var keyDemo = data.NewStruct[string,*Demo]()
//define api with input/output data structure
ApiDemo,ApiDemoContext=api.Api(func(req *InDemo) (ret string, err error) {
    // your logic here
    if req.Id == "" {
        return nil, fmt.Errorf("InvalidInput")
    }
    keyInDemo.HSET(req.Id, req)
    return `{data:"ok"}`, nil
})

```


