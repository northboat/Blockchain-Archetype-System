# Blockchain-Archetype-System

> 区块链原型系统

主要负责前端工作，一个 React 实现的单页面应用，采用模板 [Mantis React Admin Dashboard](https://mantisdashboard.io/)

- 这个前端也有一个小问题，溯源页面数据量太大，平均 7k+ 条数据项（20MB+），页面渲染会很卡，前端要做分页处理（比如一页 100 条），算了，懒了，本来就是半吊子前端，也不是第一天写屎了

后端做了一个简单的 Java API，调用底层的 C 语言的密钥生成程序，向前端返回协商密钥信息，先后做了两个版本，第一版用 WebSocket 通信调用接口，被告知做成 Restful 风格 API 调用即可，即为第二版
