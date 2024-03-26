---
title: 后端 - http - 入参映射和验证
type:  docs
sidebar_position: 6
---

:::tip 入参映射 - 从http、rpc参数到api入参
## 使用 mapstructure tag 定义api入参
::: 
> **[[查看mapstructure文档]](https://pkg.go.dev/github.com/mitchellh/mapstructure?utm_source=godoc#hdr-Field_Tags)**   
1. mapstructure可帮助你免于类型转换和变量名大小写转换等繁琐工作。    
2. mapstructure 可以将string 自动转化为int*,uint*, float*, bool等类型。同样，也可以把int*, float*, bool*等类型转化为string。  
3. 注意，从string 转化 int*时，采用10进制转化。如果你期望不同进制，请使用string类型来接受数据。然后再自行转化。
4. mapstructure 的匹配和转化适用用 http请求和rpc请求。




:::tip 入参验证 - 确保你的参数符合要求:
## 使用 validator tag 验证入参
::: 
    validator 是一个强大的数据验证库，它可以验证结构体中的字段。doptime 使用它来验证请求的数据。
> **[[查看validator文档]](https://pkg.go.dev/github.com/go-playground/validator/v10?utm_source=godoc)**  &nbsp;&nbsp;&nbsp;&nbsp;  [**[validator 官方example]**](https://github.com/go-playground/validator/blob/master/_examples/struct-level/main.go)



## 示例代码
```go   title="main.go"
type Person struct {
    Name string
}
type InDemo struct {
    //要求不能是零值,否则返回错误
    Id   string `mapstructure:"JwtId" validate:"required,min=16,max=64"`
    //相当于 `mapstructure:"HeaderRemoteAddr"`    
	HeaderRemoteAddr        string
	HeaderUserAgent string
    Username  string `validate:"required,min=5,max=20"`
    Email     string `mapstructure:"email" validate:"required,email"`
	FavouriteColor string     `validate:"hexcolor|rgb|rgba"`
	Addresses      []*Address `validate:"required,dive,required"` // a person can have a home and cottage...
    //squash 嵌入结构
    Person `mapstructure:",squash"`
    //omitempty. if 
    Age int `mapstructure:""  validate:"gte=18,lte=120`
    //相当于 `mapstructure:"Text"` 或是 `mapstructure:"text"`
    //mapstructure tag is not always needed
    Text string 
    Discount  float64 `json:"discount" validate:"percentage"`
    //other param will be kept as map
    Other map[string]interface{} `mapstructure:",remain"`
}
```


