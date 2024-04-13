---
title: 2.1 用Redis命令替代CURD API
type:  docs
sidebar_position: 20
---
### dopTime 为什么可以让CURD操作消失。
- CURD API的作用。1.实现上下文绑定，2.实现权限控制. 3.实现数据操作。
- 现在我们已经知道. dopTime 已经实现了2、3，也就是:  
dopTime已经通过黑白名单`command::key::on/off` 解决了权限问题。  
redis api也可以直接操作数据。  
- 所以，最后我们只需要解决上下文绑定问题，就可以让CURD操作消失。
## 绑定上下文（JWT）和数据操作
- 我们采用现在最流行的方式。约定把上下文信息放在JWT中。
- 我们在redis 的 key 和 fields 中使用绑定标识符@xxx ,像是这样的主键名：userInfo@id。
- redis key, redis fields 中的 @标记，会被doptime 自动替换成jwt中相应的字段。 比如 @id 会被替换成jwt中的id字段。  像是userInfo@id被替换为: userInfo2802151341134135268
- 通过这种方式，我们实现了上下文绑定。 你可以直接使用redis 中的各种CURD操作和api操作查询上下文相关的信息。
- 至此，CURD API被统一为几个标准的redis函数，不需要另写。  

## 尽可能使用doptime-client的 redis CURD API 函数 实现你的意图
- 把核心的标识信息放在JWT中。
- 在**主键**和**字段**中使用 @id 等来表示JWT中的字段。
- 这样你可以直接使用redis的CURD操作，同时可以适配不同用户。
 
## JWT中的主键哈希应该使用什么类型
 建议JWT 的id 等主键哈希，都使用string类型, 而不采用int32或int64类型。理由:
- 因为jwt字段不区分类型，所以int会被理解为float64。@标记 会被表示成科学计数法的情况。引发查询失败和非预期键写入。
- string 类型可以避免类型转换开销。
