---
title: 2.1 用Redis命令替代CURD API
type:  docs
sidebar_position: 20
---
### dopTime 为什么可以让CURD操作消失。
    - CURD API的作用。1.实现上下文绑定，2.实现权限控制. 3.实现数据操作。
    - 现在我们已经知道. dopTime已经解决了权限问题。redis api也可以直接操作数据。
    - 所以，最后我们只需要解决上下文绑定问题，就可以让CURD操作消失。
## 绑定JWT和数据操作
    - 我们采用现在最流行的方式。约定把上下文信息放在JWT中。
    - 我们在redis 的 key 和 fields 中使用绑定标识符@xxx ,像是@id。
    - 这些标记会被doptime自动替换成JWT中的字段。
    - 通过这种采用约定的方式。我们实现了上下文绑定。
    - 至此，CURD API被统一为几个标准的redis函数，不需要另写。
## 如何关联用户和数据
redis key, redis fields 中的 @标记，会被doptime 自动替换成jwt中的字段。 比如 @id 会被替换成jwt中的id字段。  
通过这种方式，你可以直接使用redis 中的各种CURD操作和api操作，同时可以适配不同用户的权限。

## JWT中的主键哈希应该使用什么类型
- 建议JWT 的id 等主键哈希，都使用string类型。
 
理由:
- 不建议使用int32或int64作为主键。因为jwt不区分类型，所以它们可能会意外地被表示为float64。当它们再次转换成为string时，可能会出现被表示成科学计数法的情况。
- string 类型可以避免类型转换开销。


## 使用doptime的libRPC库允许你使用标准化的后端功能。
- 这样你可以快速的搭建一个后端服务，完成许多诸如，用户管理，JWT登录等，而不必开发后端代码。
- 由于libRPC去除了所有的实现细节。只需要定义入参出参，这使得它非常小巧。
- 也非常欢迎你提交你的后端代码到libRPC中，
- libRPC是libAPI的兄弟项目，libAPI 运行在doptime 的服务池中，而libRPC 运行在doptime服务中。


## 尽可能使用doptime-client的redis curd 函数 实现你的意图。
    - 把核心的标识信息放在JWT中。
    - 在**主键**和**字段**中使用 @id 等来表示JWT中的字段。
    - 这样你可以直接使用redis的CURD操作，同时可以适配不同用户。