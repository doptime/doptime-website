---
slug: db-selection
title: 1.1 数据库选型 - Redis
type:  docs
sidebar_position: 1
---

:::info
## 数据库的选型，为什么是Redis
:::
### 为什么redis 是好选择
 - Redis 使用极简，功能丰富，性能强大.   是最有效满足理想后端框架的需求
 - 存在keydb 这样的redis兼容数据库，使用redis接口，同时保证大容量

 ### 为什么redis 未来是更的好选择
 - Nvme 2.0 支持key-value存储。而且价格也不贵。这对redis的持久化有重大助益。  
 - 3D DRAM后续会流行并开始往单颗粒TB演化。内存存储具有长期技术潜力。

:::info
## Redis选型的最佳实践
:::
推荐使用 [Dragonfly](https://github.com/dragonflydb/dragonfly) 和 [KeyDB](https://github.com/Snapchat/KeyDB)  
这两个数据库都是redis的兼容数据库。

### 什么情况下使用Dragonfly
- [Dragonfly](https://github.com/dragonflydb/dragonfly)是一个纯内存数据库
- 可以支撑极高并发和极高性能
- 数据容量少于内存容量时，这是最佳选择
- doptime采用Dragonfly作为默认最佳选择
- 每个数据文件大小应小于8GB

### 什么情况下使用KeyDB
- [KeyDB](https://github.com/Snapchat/KeyDB)是一个内存加速的
- 性能不如Dragonfly
- 允许数据容量可以超越了内存容量。
- 你可以在Dragonfly遭遇容量限制前 迁移到KeyDB



> #### [如何配置Dragonfly和KeyDB ... ](/zh/配置Redis/)
